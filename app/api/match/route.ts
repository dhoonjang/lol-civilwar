import { getRiotMatchIdList, getRiotMatchList } from 'domain/riot';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPuuidList } from 'domain/user';

export async function GET() {
  const puuidList = await getPuuidList();
  const updateTime = await prisma.externalMatchUpdateTime.findUnique({
    where: { id: 'global' },
  });
  const currentMatchList = await prisma.externalMatch.findMany();
  if (!updateTime) return NextResponse.error();

  const matchIdList = await Promise.all(
    puuidList.map((puuid) =>
      getRiotMatchIdList(puuid, updateTime.timestamp.getTime() / 1000)
    )
  );

  const matchList = await getRiotMatchList([
    ...new Set(matchIdList.flatMap((matchIdList) => matchIdList)),
  ]);

  const promiseList = matchList
    .filter(
      (m) =>
        m.participants.filter((p) => puuidList.includes(p.puuid)).length >= 2 &&
        !currentMatchList.some((cm) => cm.id === m.matchId)
    )
    .map((match) =>
      prisma.externalMatch.create({
        data: {
          id: match.matchId,
          timestamp: new Date(match.timestamp),
          duration: match.duration,
          participants: {
            createMany: {
              data: match.participants.map((participant) => ({
                win: participant.win,
                puuid: participant.puuid,
                championName: participant.championName,
                summonerName: participant.summonerName,
                kills: participant.kills,
                assists: participant.assists,
                deaths: participant.deaths,
              })),
            },
          },
        },
      })
    );

  const result = await prisma.$transaction([
    ...promiseList,
    prisma.externalMatchUpdateTime.update({
      where: { id: 'global' },
      data: { timestamp: new Date(matchList[0].timestamp) },
    }),
  ]);

  return NextResponse.json(result);
}
