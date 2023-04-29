import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';
import { exclude } from '../utils';

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

export const getMyInfoWithComments = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      writedComments: true,
    },
  });
  return user;
};

export const getUserList = async () => {
  const userList = await prisma.user.findMany({
    where: {
      puuid: {
        not: null,
      },
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
  });

  if (user) return exclude(user, ['pointUpdateTime']);
  return null;
};

export const getPuuidList = async (): Promise<string[]> => {
  const puuidList = await prisma.user.findMany({
    where: {
      puuid: {
        not: null,
      },
    },
    select: {
      puuid: true,
    },
  });

  return puuidList.map((p) => p.puuid).filter((p): p is string => p !== null);
};
