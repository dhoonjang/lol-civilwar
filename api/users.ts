import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import prisma from '@/lib/prisma';

export const getUserInfo = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });
  return user;
};

export const getUserList = async () => {
  const userList = await prisma.user.findMany();
  return userList;
};
