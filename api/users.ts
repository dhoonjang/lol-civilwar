import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';

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
  const userList = await prisma.user.findMany();
  return userList;
};
