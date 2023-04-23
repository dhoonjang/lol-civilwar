import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { fetchToRiot } from '@/utils/index';
import { getMyInfo, getPuuidList } from 'domain/user';
import { getRiotMatchIdList, getRiotMatchList } from 'domain/riot';

export async function PATCH() {
  const user = await getMyInfo();

  if (!user?.puuid || !prisma) return NextResponse.error();

  const matchIdList = await getRiotMatchIdList(
    user.puuid,
    user.pointUpdateTime ? user.pointUpdateTime.getTime() / 1000 : undefined
  );

  const matchList = await getRiotMatchList(matchIdList);

  const puuidList = await getPuuidList();

  const [rpIncrementPoint, bpIncrementPoint] = matchList.reduce<
    [number, number]
  >(
    (prev, match) => {
      const participantCount = match.participants.filter((participant) =>
        puuidList.includes(participant.puuid)
      ).length;
      const win =
        match.participants.find(
          (participant) => participant.puuid === user.puuid
        )?.win ?? false;
      return [
        prev[0] + participantCount,
        prev[1] + (win ? participantCount : 0),
      ];
    },
    [0, 0]
  );

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      relationPoint: {
        increment: rpIncrementPoint,
      },
      battlePoint: {
        increment: bpIncrementPoint,
      },
      pointUpdateTime: new Date(),
    },
  });

  return NextResponse.json(updatedUser);
}

export async function PUT(request: Request) {
  const data = await request.json();
  const user = await getMyInfo();

  if (!user || !prisma || !data) return NextResponse.error();

  const riotData = await fetchToRiot(
    `/lol/summoner/v4/summoners/by-name/${data.summonerName}`
  );

  if (!riotData.puuid) return NextResponse.error();

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      summonerName: data.summonerName,
      puuid: riotData.puuid,
      tier: Number(data.tier),
      position: data.position !== 'null' ? data.position : undefined,
      subPosition: data.subPosition !== 'null' ? data.subPosition : undefined,
    },
  });

  return NextResponse.json(updatedUser);
}

export async function POST(request: Request) {
  const data = await request.json();

  if (!prisma || !data) return NextResponse.error();

  const riotData = await fetchToRiot(
    `/lol/summoner/v4/summoners/by-name/${data.summonerName}`
  );

  if (!riotData.puuid) return NextResponse.error();

  const updatedUser = await prisma.user.create({
    data: {
      summonerName: data.summonerName,
      puuid: riotData.puuid,
      tier: Number(data.tier),
      position: data.position !== 'null' ? data.position : undefined,
      subPosition: data.subPosition !== 'null' ? data.subPosition : undefined,
    },
  });

  return NextResponse.json(updatedUser);
}
