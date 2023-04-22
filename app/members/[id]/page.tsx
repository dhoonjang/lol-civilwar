import { PageProps } from '.next/types/app/page';
import { UserCard } from '@/components/user';
import { getMatchList, getMemberInfo, getUserInfo } from 'db/users';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { UserComplete } from 'types';

const MatchList = async ({
  member,
  user,
}: {
  member: UserComplete;
  user: UserComplete;
}) => {
  const matchList = await getMatchList(member.puuid);
  const matchWithUserList = matchList.filter((match) =>
    match.participants.map((p) => p.puuid).includes(user.puuid ?? '')
  );

  return (
    <div className="flex flex-col overflow-scroll gap-2 mt-4">
      {matchWithUserList.map((match) => (
        <div className="card flex justify-between py-2" key={match.matchId}>
          <div className="text-left">
            {match.participants
              .filter((p) => p.win)
              .map((p) => (
                <div key={p.puuid}>{p.summonerName}</div>
              ))}
          </div>
          <div className="text-right">
            {match.participants
              .filter((p) => !p.win)
              .map((p) => (
                <div key={p.puuid}>{p.summonerName}</div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const Members = async ({ params }: PageProps) => {
  const member = await getMemberInfo(params.id);
  const user = await getUserInfo();
  if (!member?.puuid || !user?.puuid) redirect('/members');
  const { pointUpdateTime, comments, ...profile } = member;

  return (
    <div className="container pt-20 px-4">
      <UserCard user={profile} />
      <Suspense>
        {/* @ts-expect-error Server Component */}
        <MatchList user={user} member={member} />
      </Suspense>
      {comments.map(({ comment, id }) => (
        <div className="card" key={id}>
          {comment}
        </div>
      ))}
    </div>
  );
};

export default Members;
