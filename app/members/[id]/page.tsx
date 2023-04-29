import { MatchItem } from '@/components/match';
import { UserCard } from '@/components/user';
import { getMatchList } from 'domain/match';
import { UserComplete, getPuuidList, getUser } from 'domain/user';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

const MatchList = async ({ user }: { user: UserComplete }) => {
  const puuidList = await getPuuidList();
  const matchList = await getMatchList(user.puuid);

  return (
    <div className="mt-6 rounded-xl pb-32">
      <div className="flex flex-col overflow-scroll gap-2">
        {matchList.map((match) => (
          <MatchItem
            match={match}
            key={match.id}
            puuid={user.puuid}
            puuidList={puuidList}
          />
        ))}
      </div>
    </div>
  );
};

const Members = async ({ params }: { params: { id: string } }) => {
  const user = await getUser(params.id);
  if (!user?.puuid) redirect('/members');
  return (
    <div className="container py-20 px-4">
      <UserCard user={user} />
      <Suspense>
        {/* @ts-expect-error Server Component */}
        <MatchList user={user} />
      </Suspense>
    </div>
  );
};

export default Members;
