import prisma from '@/lib/prisma';

export const getMatchList = async (puuid: string) => {
  const matchList = await prisma.match.findMany({
    where: {
      participants: {
        some: {
          puuid,
        },
      },
      OR: [
        {
          status: {
            equals: 'EXTERNAL',
          },
        },
        {
          status: {
            equals: 'END',
          },
        },
      ],
    },
    include: {
      participants: true,
    },
    orderBy: {
      timestamp: 'desc',
    },
  });

  return matchList;
};

export const getMatch = async (matchId: string) => {
  const match = await prisma.match.findUnique({
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

  return match;
};
