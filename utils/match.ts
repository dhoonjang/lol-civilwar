import { Match, RiotAccount } from '@prisma/client';
import { RiotMatchResponse, fetchToRiot } from './api';
import prisma from './prisma';
import { getSummonerByDiscordId } from './register';
import { NextResponse } from 'next/server';
import { InteractionResponseType } from 'discord-interactions';
import { MatchParticipant, getMatchParticipant } from './participant';

export interface MatchRequest
  extends Pick<Match, 'id' | 'type' | 'status' | 'timestamp' | 'duration'> {
  participants: MatchParticipant[];
}

export const getGuildRiotAccounts = async (
  guildId: string
): Promise<RiotAccount[]> => {
  const guildMemberList = await prisma.guild.findUnique({
    where: {
      serverId: guildId,
    },
    select: {
      members: {
        select: {
          summoner: {
            select: {
              discordId: true,
              riotAccounts: true,
            },
          },
        },
      },
    },
  });

  if (!guildMemberList) return [];
  const summonerList = guildMemberList.members.map((m) => m.summoner);
  return summonerList.flatMap(({ riotAccounts }) => riotAccounts);
};

export const getRiotMatchIdList = async (
  puuid: string,
  startTime?: number
): Promise<string[]> => {
  try {
    const idList = await fetchToRiot(
      `/lol/match/v5/matches/by-puuid/${puuid}/ids?type=ranked${
        startTime ? `&startTime=${Math.floor(startTime)}` : ''
      }`,
      'asia'
    );

    return Array.isArray(idList) ? idList : [];
  } catch {
    return [];
  }
};

export const getRiotMatch = async (matchId: string) => {
  const result = await fetchToRiot<RiotMatchResponse>(
    `/lol/match/v5/matches/${matchId}`,
    'asia'
  );
  if (!result?.metadata) return null;
  return result;
};

export const getRiotMatchList = async (riotAccounts: RiotAccount[]) => {
  const puuidList = riotAccounts.map((r) => r.puuid);

  const currentMatchIdList = await prisma.match.findMany({
    select: { id: true },
  });

  const newMatchIdList = (
    await Promise.allSettled(
      puuidList.map((puuid) => getRiotMatchIdList(puuid))
    )
  )
    .filter(
      (r): r is PromiseFulfilledResult<string[]> => r.status === 'fulfilled'
    )
    .flatMap((r) => r.value)
    .filter((matchId) => !currentMatchIdList.some(({ id }) => id === matchId));

  return (
    await Promise.allSettled(
      newMatchIdList.map((matchId) => getRiotMatch(matchId))
    )
  )
    .filter(
      (r): r is PromiseFulfilledResult<RiotMatchResponse> =>
        r.status === 'fulfilled' && r.value !== null
    )
    .map((r) => r.value);
};

export const participantWithSummoner = (
  participant: MatchParticipant,
  riotAccounts: RiotAccount[]
) => {
  const account = riotAccounts.find((r) => r.puuid === participant.puuid);

  return {
    ...participant,
    summonerId: account?.summonerId,
  };
};

export const getMatchRequest = (
  match: RiotMatchResponse
): MatchRequest | null => {
  if (match.info.gameDuration < 300) return null;

  const participants = match.info.participants.map(getMatchParticipant);

  return {
    id: match.metadata.matchId,
    type: 'EXTERNAL',
    status: 'END',
    timestamp: new Date(match.info.gameStartTimestamp),
    duration: match.info.gameDuration,
    participants,
  };
};

export const createManyMatch = async (
  matchList: MatchRequest[],
  riotAccounts: RiotAccount[]
) => {
  if (matchList.length === 0) return [];

  const promiseList = matchList.map(({ participants, ...matchData }) => {
    const pariticpantsData = participants.map((p) =>
      participantWithSummoner(p, riotAccounts)
    );

    return prisma.match.create({
      data: {
        ...matchData,

        participants: {
          createMany: { data: pariticpantsData },
        },
      },
    });
  });

  try {
    const result = await prisma.$transaction(promiseList);

    return result;
  } catch (error) {
    console.log(error);

    return [];
  }
};

export const handleLoadMatch = async (guildId: string, userId: string) => {
  try {
    const summoner = await getSummonerByDiscordId(userId);

    if (!summoner) {
      return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: '/register 명령어로 소환사 등록을 먼저 진행해주세요.',
        },
      });
    }

    const riotAccounts = await getGuildRiotAccounts(guildId);
    const riotMatchList = await getRiotMatchList(riotAccounts);

    const matchList = await createManyMatch(
      riotMatchList
        .map(getMatchRequest)
        .filter((r): r is MatchRequest => r !== null),
      riotAccounts
    );

    return NextResponse.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content:
          matchList.length > 0
            ? `${matchList.length}개의 새로운 매치를 불러왔습니다.`
            : '새로운 매치가 없습니다.',
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                label: `매치 목록 바로가기`,
                style: 5,
                url: `https://lol-civilwar.vercel.app/guilds/${guildId}/matches`,
              },
            ],
          },
        ],
      },
    });
  } catch (error) {
    return NextResponse.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: JSON.stringify(error),
      },
    });
  }
};
