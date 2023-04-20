import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const users = await prisma.user.findMany();

  res.json({
    users,
  });
};

export default handler;
