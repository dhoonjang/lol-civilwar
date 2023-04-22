import { getUserInfo } from 'db/users';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH() {
  const user = await getUserInfo();

  if (!user || !prisma) return NextResponse.error();

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      relationPoint: {
        increment: 1,
      },
      pointUpdateTime: new Date(),
    },
  });

  return NextResponse.json(updatedUser);
}

export async function PUT(request: Request) {
  const data = await request.json();
  const user = await getUserInfo();

  if (!user || !prisma || !data) return NextResponse.error();

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      summonerName: data.summonerName,
      tier: Number(data.tier),
      position: data.position !== 'null' ? data.position : undefined,
      subPosition: data.subPosition !== 'null' ? data.subPosition : undefined,
    },
  });

  return NextResponse.json(updatedUser);
}
