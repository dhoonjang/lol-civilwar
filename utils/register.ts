import { Guild, Member, Permission, Summoner } from '@prisma/client';
import { fetchToDiscord, fetchToRiot } from './api';
import prisma from './prisma';
import { NextResponse } from 'next/server';
import { InteractionResponseType } from 'discord-interactions';

export const getSummonerByDiscordId = async (discordId: string) => {
  const summoner = await prisma.summoner.findUnique({
    where: {
      discordId,
    },
  });

  return summoner;
};

export const registerSummoner = async (discordId: string, name: string) => {
  const riotData = await fetchToRiot(
    `/lol/summoner/v4/summoners/by-name/${name}`
  );

  if (!riotData.puuid) return;

  const summoner = await prisma.summoner.create({
    data: {
      discordId,
      name,
      riotAccounts: {
        create: {
          puuid: riotData.puuid,
        },
      },
    },
  });

  await prisma.participant.updateMany({
    where: {
      puuid: riotData.puuid,
    },
    data: {
      summonerId: summoner.id,
    },
  });

  return summoner;
};

export const registerMember = async (
  serverId: string,
  summonerId: string
): Promise<[(Member & { summoner: Summoner }) | null, Guild | null]> => {
  const existGuild = await prisma.guild.findUnique({
    where: {
      serverId,
    },
  });

  if (existGuild) {
    const member = await prisma.member.create({
      data: {
        summonerId,
        permission: Permission.MEMBER,
        guildId: existGuild.id,
      },
      include: {
        summoner: true,
      },
    });

    return [member, null];
  }

  const dicordGuild = await fetchToDiscord(`/guilds/${serverId}/preview`);

  if (!dicordGuild) return [null, null];

  const { id, name, icon } = dicordGuild;

  const result = await prisma.guild.create({
    data: {
      serverId: id,
      name,
      icon,
      members: {
        create: {
          summonerId,
          permission: Permission.OWNER,
        },
      },
    },
  });

  const member = await prisma.member.findUnique({
    where: {
      guildId_summonerId: {
        summonerId,
        guildId: result.id,
      },
    },
    include: {
      summoner: true,
    },
  });

  return [member, result];
};

export const registerResponse = (summoner: Summoner, guild: Guild | null) =>
  NextResponse.json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `[${summoner.name}] 소환사가 길드${
        !guild ? '에 합류했습니다.' : '를 만들었습니다.'
      }`,
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: !guild ? `[${summoner.name}] 소환사` : `길드 바로가기`,
              style: 5,
              url: `https://lol-civilwar.vercel.app/${
                !guild ? `summoners/${summoner.id}` : `guilds/${guild.id}`
              }`,
            },
          ],
        },
      ],
    },
  });

export const handleRegisterMember = async (guildId: string, userId: string) => {
  const summoner = await getSummonerByDiscordId(userId);

  if (!summoner) {
    return NextResponse.json({
      type: InteractionResponseType.MODAL,
      data: {
        title: '소환사 등록',
        custom_id: 'summoner_register_modal',
        components: [
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: 'summoner_name',
                label: '소환사 이름',
                style: 1,
                min_length: 1,
                max_length: 20,
                placeholder: 'Hide on bush',
                required: true,
              },
            ],
          },
        ],
      },
    });
  }

  const [member, guild] = await registerMember(guildId, summoner.id);

  if (!member) return;
  return registerResponse(member.summoner, guild);
};
