import { Guild, Member, Permission, Summoner } from '@prisma/client';
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
