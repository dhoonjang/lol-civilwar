import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';

export type UserComplete = User & {
  summonerName: string;
  puuid: string;
};

export const getMyInfo = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });
  return user;
};

export const getMyComments = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return [];
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      writedComments: true,
    },
  });
  return user?.writedComments ?? [];
};

export const getUserList = async () => {
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

export const getUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      comments: {
        include: {
          writer: true,
        },
      },
    },
  });

  return user;
};
