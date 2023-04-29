import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getMyInfo } from 'domain/user';

export async function POST(request: Request) {
  const data = await request.json();
  const user = await getMyInfo();

  if (!user?.puuid || !data) return NextResponse.error();

  const createdComment = prisma.comment.create({
    data: {
      writerId: user.id,
      comment: data.comment,
      properTier: data.properTier,
      matchParticipantId: data.matchParticipantId,
    },
  });

  return NextResponse.json(createdComment);
}
