import { getRiotMatchIdList, getRiotMatchList } from 'domain/riot';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPuuidList } from 'domain/user';

export async function GET() {
  const puuidList = await getPuuidList();

  const currentMatchList = await prisma.externalMatch.findMany();

  const matchIdList = await Promise.all(
    puuidList.map((puuid) => getRiotMatchIdList(puuid))
  );

  const matchList = await getRiotMatchList(
    [...new Set(matchIdList.flatMap((matchIdList) => matchIdList))].filter(
      (matchId) => !currentMatchList.some((cm) => cm.id === matchId)
    )
  );

  const promiseList = matchList
    .filter(
      (m) =>
        m.participants.filter((p) => puuidList.includes(p.puuid)).length >= 2
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

  const result = await prisma.$transaction(promiseList);

  return NextResponse.json(result);
}
