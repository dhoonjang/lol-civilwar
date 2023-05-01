import { NextResponse } from 'next/server';
import { getMyInfo } from 'domain/user';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const data = await request.json();
  const user = await getMyInfo();

  if (!user?.tier || !data) return NextResponse.error();

  const participant = await prisma.participant.findUnique({
    where: {
      id: data.participantId,
    },
  });

  if (!participant) return NextResponse.error();

  const targetUser = await prisma.user.findUnique({
    where: {
      puuid: participant.puuid,
    },
  });

  if (!targetUser || targetUser.tier === null) return NextResponse.error();

  const tierWeight = (user.tier + 40) * 0.01;

  const tier = Math.round(
    (targetUser.tier + data.properTier * tierWeight) / (1 + tierWeight)
  );

  const result = await prisma.$transaction([
    prisma.comment.create({
      data: {
        writerId: user.id,
        comment: data.comment,
        properTier: data.properTier,
        participantId: participant.id,
      },
    }),
    prisma.user.update({
      where: {
        id: targetUser.id,
      },
      data: {
        tier,
      },
    }),
  ]);

  return NextResponse.json(result);
}
