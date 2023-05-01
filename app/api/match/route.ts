import { getRiotMatchIdList, getRiotMatchList } from 'domain/riot';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPuuidList } from 'domain/user';
import { calculateTeamDifference } from '@/utils/index';

export async function GET() {
  const puuidList = await getPuuidList();

  const currentMatchList = await prisma.match.findMany();

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
      prisma.match.create({
        data: {
          id: match.matchId,
          status: 'EXTERNAL',
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

export async function POST(request: Request) {
  const data = await request.json();
  const userIdList: string[] = data.userIdList;

  if (userIdList.length !== 10) return NextResponse.error();

  const userList = await prisma.user.findMany({
    where: {
      id: {
        in: userIdList,
      },
      puuid: {
        not: null,
      },
    },
    orderBy: {
      tier: 'desc',
    },
  });

  if (userList.length !== 10) return NextResponse.error();

  let selectedMatchList = [...userList];
  let matchTeamDifference = calculateTeamDifference(selectedMatchList);
  let count = 1;

  while (
    (matchTeamDifference > 20 && count < 10000) ||
    matchTeamDifference >= 1000
  ) {
    count++;
    const newList = [...userList.sort(() => Math.random() - 0.5)];

    if (matchTeamDifference > calculateTeamDifference(newList)) {
      selectedMatchList = newList;
      matchTeamDifference = calculateTeamDifference(selectedMatchList);
    }
  }

  const createdMatch = await prisma.match.create({
    data: {
      status: 'BATTING',
      participants: {
        createMany: {
          data: selectedMatchList.map((user, index) => ({
            puuid: user.puuid ?? '',
            team: index % 2 === 0 ? 'BLUE' : 'RED',
          })),
        },
      },
    },
    include: {
      participants: true,
    },
  });

  return NextResponse.json(createdMatch);
}
