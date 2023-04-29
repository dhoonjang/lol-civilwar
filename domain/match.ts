import prisma from '@/lib/prisma';

export const getMatchList = async (puuid: string) =>
  await prisma.externalMatch.findMany({
    where: {
      participants: {
        some: {
          puuid,
        },
      },
    },
    include: {
      participants: true,
    },
    orderBy: {
      timestamp: 'desc',
    },
  });

export const getMatch = async (matchId: string) => {
  const match = await prisma.externalMatch.findUnique({
    where: {
      id: matchId,
    },
    include: {
      participants: {
        include: {
          comments: true,
        },
      },
    },
  });

  if (!match) return null;
  return match;
};
