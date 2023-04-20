import { getUserInfo } from 'api/users';
import { NextResponse } from 'next/server';

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
    data,
  });

  return NextResponse.json(updatedUser);
}
