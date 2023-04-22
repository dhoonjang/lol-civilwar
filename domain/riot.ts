import { fetchToRiot } from '../utils';

export interface ExternalMatch {
  matchId: string;
  win: boolean;
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

export const getMatchList = async (
  puuid: string,
  startTime?: number
): Promise<ExternalMatch[]> => {
  const matchIdList: string[] = await fetchToRiot(
    `/lol/match/v5/matches/by-puuid/${puuid}/ids?type=ranked${
      startTime ? `&startTime=${startTime}` : ''
    }`,
    'asia'
  );
  if (!matchIdList || !Array.isArray(matchIdList)) return [];

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

  return matchList.map((m) => ({
    matchId: m.metadata.matchId,
    timestamp: m.info.gameEndTimestamp,
    duration: m.info.gameDuration,
    win:
      m.info.participants.find((p: MatchParticipant) => p.puuid === puuid)
        ?.win ?? false,
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
  }));
};
