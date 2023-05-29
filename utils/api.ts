import { PositionType } from '@prisma/client';

export interface RiotMatchParticipantResponse {
  win: boolean;
  championId: number;
  championName: string;
  puuid: string;
  summonerName: string;
  kills: number;
  assists: number;
  deaths: number;
  teamPosition: PositionType;
  magicDamageDealtToChampions: number;
  physicalDamageDealtToChampions: number;
  totalDamageDealtToChampions: number;
  trueDamageDealtToChampions: number;
  totalDamageTaken: number;
  totalTimeCCDealt: number;
  totalTimeSpentDead: number;
  timeCCingOthers: number;
  timePlayed: number;
  damageSelfMitigated: number;
  killParticipation: number;
  goldEarned: number;
  goldSpent: number;
  teamDamagePercentage: number;
  visionScore: number;
  challenges: {
    abilityUses: number;
    damageTakenOnTeamPercentage: number;
    teamDamagePercentage: number;
    saveAllyFromDeath: number;
    kda: number;
    damagePerMinute: number;
    effectiveHealAndShielding: number;
    visionScoreAdvantageLaneOpponent: number;
    visionScorePerMinute: number;
  };
}

export interface RiotMatchResponse {
  metadata: {
    matchId: string;
  };
  info: {
    gameStartTimestamp: number;
    gameDuration: number;
    participants: RiotMatchParticipantResponse[];
  };
}

export const fetchToRiot = async <T = any>(
  endpoint: string,
  region?: string
): Promise<T | null> => {
  try {
    const response = await fetch(
      `https://${region ?? 'kr'}.api.riotgames.com${endpoint}`,
      {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY ?? '',
        },
      }
    );

    return await response.json();
  } catch {
    return null;
  }
};

export async function fetchToDiscord(
  endpoint: string,
  options: RequestInit = {}
) {
  try {
    const url = 'https://discord.com/api/v10' + endpoint;

    if (options.body) options.body = JSON.stringify(options.body);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent':
          'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
      },
      ...options,
    });

    return await response.json();
  } catch {
    return null;
  }
}
