import { fetchToRiot } from './api';

export interface RiotMatch {
  matchId: string;
  timestamp: number;
  duration: number;
  participants: MatchParticipant[];
}

export interface MatchParticipant {
  win: boolean;
  championName: string;
  puuid: string;
  summonerName: string;
  kills: number;
  assists: number;
  deaths: number;
}

export const getRiotMatchIdList = async (
  puuid: string,
  startTime?: number
): Promise<string[]> => {
  try {
    const idList = await fetchToRiot(
      `/lol/match/v5/matches/by-puuid/${puuid}/ids?type=ranked${
        startTime ? `&startTime=${Math.floor(startTime)}` : ''
      }`,
      'asia'
    );

    return Array.isArray(idList) ? idList : [];
  } catch {
    return [];
  }
};

export const getRiotMatchList = async (
  matchIdList: string[]
): Promise<RiotMatch[]> => {
  const response = await Promise.allSettled(
    matchIdList.map((matchId) =>
      fetchToRiot(`/lol/match/v5/matches/${matchId}`, 'asia')
    )
  );

  const matchList = response
    .filter(
      (r): r is PromiseFulfilledResult<any> =>
        r.status === 'fulfilled' && !!r.value.metadata
    )
    .map((r) => r.value);

  return matchList
    .map((m) => ({
      matchId: m.metadata.matchId,
      timestamp: m.info.gameStartTimestamp,
      duration: m.info.gameDuration,
      participants: m.info.participants.map(
        ({
          win,
          championName,
          puuid,
          summonerName,
          kills,
          assists,
          deaths,
        }: MatchParticipant) => ({
          win,
          championName,
          puuid,
          summonerName,
          kills,
          assists,
          deaths,
        })
      ),
    }))
    .sort((a, b) => b.timestamp - a.timestamp);
};
