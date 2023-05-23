import { RiotAccount } from '@prisma/client';
import { fetchToRiot } from './api';
import prisma from './prisma';
import { getSummonerByDiscordId } from './register';
import { NextResponse } from 'next/server';
import { InteractionResponseType } from 'discord-interactions';
import { format } from 'date-fns';

export interface RiotMatch {
  matchId: string;
  timestamp: number;
  duration: number;
  participants: MatchParticipant[];
}

export interface MatchParticipant {
  win: boolean;
  championName: string;
  puuid: string;
  summonerName: string;
  kills: number;
  assists: number;
  deaths: number;
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

export const getRiotMatch = async (
  matchId: string
): Promise<RiotMatch | null> => {
  const result = await fetchToRiot(`/lol/match/v5/matches/${matchId}`, 'asia');
  if (!result.metadata) return null;
  const { metadata, info } = result;
  return {
    matchId: metadata.matchId,
    timestamp: info.gameStartTimestamp,
    duration: info.gameDuration,
    participants: info.participants.map(
      ({
        win,
        championName,
        puuid,
        summonerName,
        kills,
        assists,
        deaths,
      }: MatchParticipant) => ({
        win,
        championName,
        puuid,
        summonerName,
        kills,
        assists,
        deaths,
      })
    ),
  };
};

export const getRiotMatchList = async (riotAccounts: RiotAccount[]) => {
  const puuidList = riotAccounts.map((r) => r.puuid);

  const currentMatchIdList = await prisma.match.findMany({
    select: { id: true },
  });

  const matchIdResponse = (
    await Promise.allSettled(
      puuidList.map((puuid) => getRiotMatchIdList(puuid))
    )
  )
    .filter(
      (r): r is PromiseFulfilledResult<string[]> => r.status === 'fulfilled'
    )
    .flatMap((r) => r.value);

  const matchIdCount: { matchId: string; count: number }[] = [];

  matchIdResponse.forEach((matchId) => {
    const cnt = matchIdCount.find((m) => m.matchId === matchId);
    if (cnt) cnt.count++;
    else matchIdCount.push({ matchId, count: 1 });
  });

  const newMatchIdList = matchIdCount
    .filter(
      ({ matchId, count }) =>
        !currentMatchIdList.some(({ id }) => id === matchId) && count >= 1
    )
    .map((m) => m.matchId);

  return (
    await Promise.allSettled(
      newMatchIdList.map((matchId) => getRiotMatch(matchId))
    )
  )
    .filter(
      (r): r is PromiseFulfilledResult<RiotMatch> =>
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

export const riotMatchWithSummoner = (
  match: RiotMatch,
  riotAccounts: RiotAccount[]
) => {
  const participants = match.participants.map((participant) =>
    participantWithSummoner(participant, riotAccounts)
  );

  return {
    ...match,
    participants,
  };
};

export const createManyMatch = async (
  matchList: RiotMatch[],
  riotAccounts: RiotAccount[]
) => {
  if (matchList.length === 0) return [];

  const matchListWithSummoner = matchList.map((match) =>
    riotMatchWithSummoner(match, riotAccounts)
  );

  const promiseList = matchListWithSummoner.map((match) =>
    prisma.match.create({
      data: {
        id: match.matchId,
        type: 'EXTERNAL',
        status: 'END',
        timestamp: new Date(match.timestamp),
        duration: match.duration,
        participants: {
          createMany: {
            data: match.participants.map((participant) => ({
              win: participant.win,
              puuid: participant.puuid,
              summonerId: participant.summonerId,
              championName: participant.championName,
              summonerName: participant.summonerName,
              kills: participant.kills,
              assists: participant.assists,
              deaths: participant.deaths,
            })),
          },
        },
      },
    })
  );

  const result = await prisma.$transaction(promiseList);

  return result;
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

    const matchList = await createManyMatch(riotMatchList, riotAccounts);

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
