'use client';

import { Comment, User } from '@prisma/client';
import { format } from 'date-fns';
import { ExternalMatch, MatchParticipant } from 'domain/riot';
import { NamedExoticComponent, memo } from 'react';

export const ParticipantView = ({
  summonerName,
  kills,
  deaths,
  assists,
  borderd,
  championName,
  highlighted,
  win,
}: MatchParticipant & {
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
};

interface MatchItemProps {
  match: ExternalMatch;
  comments: Comment[];
  puuidList: string[];
  user: User;
  canComment: boolean;
}

export const MatchItem: NamedExoticComponent<MatchItemProps> = memo(
  ({ user, match, puuidList, canComment, comments }) => {
    const win =
      match.participants.find((p) => p.puuid === user.puuid)?.win ?? false;

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
                highlighted={p.puuid === user.puuid}
              />
            ))}
        </div>
        <div className="text-center">
          {format(match.timestamp, 'M월 d일 HH:mm')}
          <div className="mt-1">
            {Math.floor(match.duration / 60)}분 {match.duration % 60}초
          </div>
          <div className="mt-3 gap-1 flex flex-col">
            {comments.length >= 0 && (
              <button className="btn btn-black text-sm" onClick={() => {}}>
                댓글 보기
              </button>
            )}
            {canComment && (
              <button className="btn btn-black text-sm" onClick={() => {}}>
                댓글 달기
              </button>
            )}
          </div>
        </div>
        <div className="text-right w-2/5">
          {match.participants
            .filter((p) => !p.win)
            .map((p) => (
              <ParticipantView
                {...p}
                key={p.puuid}
                borderd={puuidList.includes(p.puuid)}
                highlighted={p.puuid === user.puuid}
              />
            ))}
        </div>
      </div>
    );
  }
);

MatchItem.displayName = 'MatchItem';
