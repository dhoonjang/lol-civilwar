import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import prisma from '@/lib/prisma';
import { fetchToRiot } from '../utils';

export const getUserInfo = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !prisma) return null;
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });
  return user;
};

export const getUserList = async () => {
  if (!prisma) return [];
  const userList = await prisma.user.findMany({
    where: {
      summonerName: {
        not: null,
      },
    },
    include: {
      comments: true,
    },
    orderBy: {
      tier: 'desc',
    },
  });
  return userList;
};

export const getMemberInfo = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      comments: true,
    },
  });

  return user;
};

export interface ExternalMatch {
  matchId: string;
  participants: MatchParticipant[];
}

export interface MatchParticipant {
  win: boolean;
  championName: string;
  puuid: string;
  summonerName: string;
  kills: number;
  assits: number;
  deaths: number;
}

export const getMatchList = async (puuid: string): Promise<ExternalMatch[]> => {
  const matchIdList: string[] = await fetchToRiot(
    `/lol/match/v5/matches/by-puuid/${puuid}/ids`,
    'asia'
  );
  if (!matchIdList || !Array.isArray(matchIdList)) return [];

  const response = await Promise.allSettled(
    matchIdList.map((matchId) =>
      fetchToRiot(`/lol/match/v5/matches/${matchId}`, 'asia')
    )
  );

  const matchList = response
    .filter(
      (r): r is PromiseFulfilledResult<any> =>
        r.status === 'fulfilled' && !!r.value.metadata
    )
    .map((r) => r.value);

  return matchList.map((m) => ({
    matchId: m.metadata.matchId,
    participants: m.info.participants.map(
      ({
        win,
        championName,
        puuid,
        summonerName,
        kills,
        assits,
        deaths,
      }: MatchParticipant) => ({
        win,
        championName,
        puuid,
        summonerName,
        kills,
        assits,
        deaths,
      })
    ),
  }));
};
