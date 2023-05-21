import { Member, Permission, Summoner } from '@prisma/client';
import { fetchToDiscord, fetchToRiot } from './api';
import prisma from './prisma';

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
      tier: 0,
      riotAccounts: {
        create: {
          puuid: riotData.puuid,
        },
      },
    },
  });

  return summoner;
};

export const registerMember = async (
  guildId: string,
  summonerId: string
): Promise<
  [
    (
      | (Member & {
          summoner: Summoner;
        })
      | null
    ),
    boolean
  ]
> => {
  const existGuild = await prisma.guild.findUnique({
    where: {
      id: guildId,
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

    return [member, false];
  }

  const dicordGuild = await fetchToDiscord(`/guilds/${guildId}/preview`);

  if (!dicordGuild) return [null, false];

  const { id, name, icon } = dicordGuild;

  const result = await prisma.guild.create({
    data: {
      id,
      name,
      icon,
      members: {
        create: {
          summonerId,
          permission: Permission.OWNER,
        },
      },
    },
    include: {
      members: {
        include: {
          summoner: true,
        },
      },
    },
  });

  return [result.members[0], true];
};
