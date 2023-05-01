import { Match, Participant } from '@prisma/client';
import { format } from 'date-fns';
import Link from 'next/link';
import { memo } from 'react';

export const ParticipantView = memo(
  ({
    summonerName,
    kills,
    deaths,
    assists,
    borderd,
    championName,
    highlighted,
    win,
  }: Participant & {
    borderd: boolean;
    highlighted: boolean;
  }) => {
    return (
      <div
        className={`flex gap-2 rounded items-center p-1 px-2 ${
          highlighted ? 'bg-black/50' : ''
        } ${borderd ? 'border border-stone-300' : ''} ${
          win ? 'flex-row' : 'flex-row-reverse'
        }`}
      >
        <div className="text-bold">{summonerName}</div>
        <div className="text-sm text-bold">[{championName}]</div>
        <div className="text-sm text-stone-300">
          {kills} / {deaths} / {assists}
        </div>
      </div>
    );
  }
);

ParticipantView.displayName = 'ParticipantView';

interface MatchItemProps {
  match: Match & {
    participants: Participant[];
  };
  userId?: string;
  userPuuid: string;
  puuidList: string[];
}

export const MatchItem = memo(
  ({ match, userId, userPuuid, puuidList }: MatchItemProps) => {
    const win =
      match.participants.find((p) => p.puuid === userPuuid)?.win ?? false;

    return (
      <div
        className={`rounded-xl p-3 flex justify-between items-center ${
          win ? 'bg-slate-800' : 'bg-red-900'
        }`}
      >
        <div className="text-left w-2/5">
          {match.participants
            .filter((p) => p.win)
            .map((p) => (
              <ParticipantView
                {...p}
                key={p.puuid}
                borderd={puuidList.includes(p.puuid)}
                highlighted={p.puuid === userPuuid}
              />
            ))}
        </div>
        <div className="text-center">
          {format(match.timestamp || match.createdAt, 'M월 d일 HH:mm')}
          {match.duration && (
            <div className="mt-1">
              {Math.floor(match.duration / 60)}분 {match.duration % 60}초
            </div>
          )}
          {userId && (
            <div className="mt-3 gap-1 flex flex-col">
              <Link href={`/members/${userId}/${match.id}`}>
                <button className="btn btn-black text-sm">자세히 보기</button>
              </Link>
            </div>
          )}
        </div>
        <div className="text-right w-2/5">
          {match.participants
            .filter((p) => !p.win)
            .map((p) => (
              <ParticipantView
                {...p}
                key={p.puuid}
                borderd={puuidList.includes(p.puuid)}
                highlighted={p.puuid === userPuuid}
              />
            ))}
        </div>
      </div>
    );
  }
);

MatchItem.displayName = 'MatchItem';
