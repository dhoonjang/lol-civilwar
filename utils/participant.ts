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
  pyshicalDamage: number;
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

  const damageTakenPerDeath = (totalDamageTaken + damageSelfMitigated) / deaths;

  const aliveRate = (timePlayed - totalTimeSpentDead) / timePlayed;

  return (
    (damageTakenPerMinute + damageTakenPerDeath) *
    Math.pow(aliveRate, 0.2) *
    Math.pow(damageTakenOnTeamPercentage, 0.4) *
    Math.pow(killParticipation, 0.4) *
    (win ? 1.1 : 1)
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

  return (
    (damagePer10Gold + damagePerMinute) *
    Math.pow(kda, 0.2) *
    Math.pow(teamDamagePercentage, 0.4) *
    Math.pow(aliveRate, 0.4) *
    (win ? 1.1 : 1)
  );
};

export interface UtilityInfo extends CommonInfo {
  visionScorePerMinute: number;
  effectiveHealAndShielding: number;
  killParticipation: number;
  visionScoreAdvantageLaneOpponent: number;
}

export const getUtilityScore = (utilityInfo: UtilityInfo) => {
  const {
    visionScorePerMinute,
    visionScoreAdvantageLaneOpponent,
    effectiveHealAndShielding,
    killParticipation,
    win,
    timePlayed,
  } = utilityInfo;

  const visionPoint =
    (visionScorePerMinute + visionScoreAdvantageLaneOpponent) * 100;
  const effectiveHealAndShieldingPerMinute =
    (effectiveHealAndShielding / timePlayed) * 60;

  return (
    (visionPoint + effectiveHealAndShieldingPerMinute) *
    Math.pow(killParticipation, 0.2) *
    (win ? 1.1 : 1)
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
    killParticipation,
    goldSpent,
    challenges: {
      damageTakenOnTeamPercentage,
      kda,
      teamDamagePercentage,
      visionScorePerMinute,
      visionScoreAdvantageLaneOpponent,
      effectiveHealAndShielding,
    },
  } = participantResponse;

  return {
    win,
    championId,
    championName,
    puuid,
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
      visionScorePerMinute,
      visionScoreAdvantageLaneOpponent,
      killParticipation,
      effectiveHealAndShielding,
    }),

    snowballScore: 0,
    crackScore: 0,

    totalDamage: totalDamageDealtToChampions,
    magicDamage: magicDamageDealtToChampions,
    pyshicalDamage: physicalDamageDealtToChampions,
  };
};
