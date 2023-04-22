import { UserCard } from '@/components/user';
import { format } from 'date-fns';
import { MatchParticipant, getMatchList } from 'domain/riot';
import { UserComplete, getMyInfo, getUser } from 'domain/user';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

const ParticipantView = ({
  summonerName,
  kills,
  deaths,
  assists,
  borderd,
  championName,
  win,
}: MatchParticipant & {
  borderd: boolean;
}) => {
  return (
    <div
      className={`flex gap-2 rounded items-center p-1 px-2 ${
        borderd ? 'border border-stone-300' : ''
      } ${win ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <div className="text-bold">{summonerName}</div>
      <div className="text-sm text-bold">[{championName}]</div>
      <div className="text-sm text-stone-300">
        {kills} / {deaths} / {assists}
      </div>
    </div>
  );
};

const MatchList = async ({
  user,
  me,
}: {
  me: UserComplete;
  user: UserComplete;
}) => {
  const matchList = await getMatchList(user.puuid);
  const matchWithMeList = matchList.filter((match) =>
    match.participants.map((p) => p.puuid).includes(me.puuid ?? '')
  );

  return (
    <>
      {matchWithMeList.length > 0 && (
        <h2 className="text-lg text-bold mt-10">같이 한 최근 게임</h2>
      )}
      <div className="max-h-96 overflow-scroll mt-4 rounded-xl">
        <div className="flex flex-col overflow-scroll gap-2">
          {matchWithMeList.map((match) => (
            <div
              className={`rounded-xl p-3 flex justify-between items-center ${
                match.win ? 'bg-slate-900' : 'bg-red-900'
              }`}
              key={match.matchId}
            >
              <div className="text-left w-2/5">
                {match.participants
                  .filter((p) => p.win)
                  .map((p) => (
                    <ParticipantView
                      {...p}
                      key={p.puuid}
                      borderd={[me.puuid, user.puuid].includes(p.puuid)}
                    />
                  ))}
              </div>
              <div className="text-center">
                {format(match.timestamp, 'M월 d일 HH:mm')}
                <div className="mt-4">
                  {Math.floor(match.duration / 60)}분 {match.duration % 60}초
                </div>
              </div>
              <div className="text-right w-2/5">
                {match.participants
                  .filter((p) => !p.win)
                  .map((p) => (
                    <ParticipantView
                      {...p}
                      key={p.puuid}
                      borderd={[me.puuid, user.puuid].includes(p.puuid)}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const Members = async ({ params }: { params: { id: string } }) => {
  const user = await getUser(params.id);
  const me = await getMyInfo();
  if (!user?.puuid || !me?.puuid) redirect('/members');
  const { pointUpdateTime, comments, ...profile } = user;

  return (
    <div className="container py-20 px-4">
      <UserCard user={profile} />
      {user.id !== me.id && (
        <Suspense>
          {/* @ts-expect-error Server Component */}
          <MatchList user={user} me={me} />
        </Suspense>
      )}
      {comments.map(({ writer, comment, id }) => (
        <div className="card" key={id}>
          {comment}
          {writer.name}
        </div>
      ))}
    </div>
  );
};

export default Members;
