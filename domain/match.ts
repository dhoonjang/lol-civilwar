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
      participants: {
        include: {
          comments: true,
        },
      },
    },
    orderBy: {
      timestamp: 'desc',
    },
  });
