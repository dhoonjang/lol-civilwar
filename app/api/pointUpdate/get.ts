import { getUserInfo } from 'api/users';
import { NextResponse } from 'next/server';

export async function POST() {
  const user = await getUserInfo();

  if (!user || !prisma) return NextResponse.json({ errorMessage: 'no user' });

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      relationPoint: {
        increment: 1,
      },
    },
  });

  console.log(updatedUser);

  return NextResponse.json(updatedUser);
}
