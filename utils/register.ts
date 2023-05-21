import { Permission } from '@prisma/client';
import { fetchToDiscord } from './api';

export const getSummonerByDiscordId = async (discordId: string) => {
  const summoner = await prisma.summoner.findUnique({
    where: {
      discordId,
    },
  });

  return summoner;
};

export const registerMember = async (guildId: string, summonerId: string) => {
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
    });

    return member;
  }

  const guild = await fetchToDiscord(`/guilds/${guildId}/preview`);

  if (!guild) return null;

  return await prisma.guild.create({
    data: {
      id: guild.id,
      name: guild.name,
      icon: guild.icon,
      members: {
        create: {
          summonerId,
          permission: Permission.OWNER,
        },
      },
    },
    include: {
      members: true,
    },
  });
};
