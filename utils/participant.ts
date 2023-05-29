import { PositionType } from '@prisma/client';
import { RiotMatchParticipantResponse } from './api';

export interface MatchParticipant
  extends Pick<
    RiotMatchParticipantResponse,
    | 'assists'
    | 'win'
    | 'kills'
    | 'puuid'
    | 'championId'
    | 'championName'
    | 'deaths'
    | 'summonerName'
  > {
  summonerId?: string;

  position: PositionType;
  jsonString: string;

  tankerScore: number;
  dealerScore: number;
  utilityScore: number;

  snowballScore: number;
  crackScore: number;

  totalDamage: number;
  magicDamage: number;
  physicalDamage: number;
}

export interface CommonInfo {
  win: boolean;
  timePlayed: number;
}

export interface TankerInfo extends CommonInfo {
  deaths: number;
  totalDamageTaken: number;
  damageSelfMitigated: number;
  damageTakenOnTeamPercentage: number;
  totalTimeSpentDead: number;
  killParticipation: number;
}

export const getTankerScore = (tankerInfo: TankerInfo) => {
  const {
    timePlayed,
    totalDamageTaken,
    damageSelfMitigated,
    killParticipation,
    damageTakenOnTeamPercentage,
    totalTimeSpentDead,
    deaths,
    win,
  } = tankerInfo;

  const damageTakenPerMinute =
    ((totalDamageTaken + damageSelfMitigated) / timePlayed) * 60;

  const damageTakenPerDeath =
    (totalDamageTaken + damageSelfMitigated) / (deaths || 0.5);

  const aliveRate = (timePlayed - totalTimeSpentDead) / timePlayed;

  console.log(
    'tankerScore: ',
    damageTakenPerMinute,
    damageTakenPerDeath,
    damageTakenOnTeamPercentage,
    killParticipation,
    win
  );

  return Math.round(
    (damageTakenPerMinute + damageTakenPerDeath) *
      Math.pow(aliveRate, 0.2) *
      Math.pow(damageTakenOnTeamPercentage, 0.4) *
      Math.pow(killParticipation || 0.01, 0.4) *
      (win ? 1100 : 1000)
  );
};

export interface DealerInfo extends CommonInfo {
  totalDamageDealtToChampions: number;
  teamDamagePercentage: number;
  totalTimeSpentDead: number;
  kda: number;
  goldSpent: number;
}

export const getDealerScore = (dealerInfo: DealerInfo) => {
  const {
    goldSpent,
    totalDamageDealtToChampions,
    teamDamagePercentage,
    kda,
    timePlayed,
    totalTimeSpentDead,
    win,
  } = dealerInfo;

  const damagePer10Gold = (totalDamageDealtToChampions / goldSpent) * 10;
  const damagePerMinute = (totalDamageDealtToChampions / timePlayed) * 60;

  const aliveRate = (timePlayed - totalTimeSpentDead) / timePlayed;

  return Math.round(
    (damagePer10Gold + damagePerMinute) *
      Math.pow(kda || 0.01, 0.2) *
      Math.pow(teamDamagePercentage, 0.4) *
      Math.pow(aliveRate, 0.4) *
      (win ? 1100 : 1000)
  );
};

export interface UtilityInfo extends CommonInfo {
  visionScore: number;
  effectiveHealAndShielding: number;
  killParticipation: number;
  visionScoreAdvantageLaneOpponent: number;
}

export const getUtilityScore = (utilityInfo: UtilityInfo) => {
  const {
    visionScore,
    visionScoreAdvantageLaneOpponent,
    effectiveHealAndShielding,
    killParticipation,
    win,
    timePlayed,
  } = utilityInfo;

  const visionPoint = Math.pow(
    ((visionScore + visionScoreAdvantageLaneOpponent) / timePlayed) * 60,
    2
  );

  const effectiveHealAndShieldingPerMinute =
    (effectiveHealAndShielding / timePlayed) * 60;

  console.log(
    'utilityScore: ',
    visionPoint,
    effectiveHealAndShieldingPerMinute,
    killParticipation,
    win
  );

  return Math.round(
    (visionPoint + effectiveHealAndShieldingPerMinute) *
      Math.pow(killParticipation || 0.01, 0.2) *
      (win ? 1100 : 1000)
  );
};

export const getMatchParticipant = (
  participantResponse: RiotMatchParticipantResponse
): MatchParticipant => {
  const {
    win,
    championId,
    championName,
    puuid,
    summonerName,
    kills,
    assists,
    deaths,
    teamPosition,
    totalDamageDealtToChampions,
    magicDamageDealtToChampions,
    physicalDamageDealtToChampions,
    timePlayed,
    totalDamageTaken,
    damageSelfMitigated,
    totalTimeSpentDead,
    goldSpent,
    visionScore,
    challenges: {
      damageTakenOnTeamPercentage,
      killParticipation,
      kda,
      teamDamagePercentage,
      visionScoreAdvantageLaneOpponent,
      effectiveHealAndShielding,
    },
  } = participantResponse;

  return {
    puuid,

    win,
    championId,
    championName,
    summonerName,
    kills,
    assists,
    deaths,
    position: teamPosition,

    jsonString: JSON.stringify(participantResponse),

    tankerScore: getTankerScore({
      win,
      deaths,
      timePlayed,
      totalDamageTaken,
      damageSelfMitigated,
      damageTakenOnTeamPercentage,
      totalTimeSpentDead,
      killParticipation,
    }),
    dealerScore: getDealerScore({
      win,
      timePlayed,
      kda,
      totalDamageDealtToChampions,
      teamDamagePercentage,
      totalTimeSpentDead,
      goldSpent,
    }),
    utilityScore: getUtilityScore({
      win,
      timePlayed,
      visionScore,
      visionScoreAdvantageLaneOpponent,
      killParticipation,
      effectiveHealAndShielding,
    }),

    snowballScore: 0,
    crackScore: 0,

    totalDamage: Math.round(totalDamageDealtToChampions),
    magicDamage: Math.round(magicDamageDealtToChampions),
    physicalDamage: Math.round(physicalDamageDealtToChampions),
  };
};
