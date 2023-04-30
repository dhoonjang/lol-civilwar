import { MatchItem } from './components';
import { getMatchList } from 'domain/match';
import { getPuuidList, getUser } from 'domain/user';
import { redirect } from 'next/navigation';

const MatchList = async ({ params }: { params: { id: string } }) => {
  const user = await getUser(params.id);
  if (!user?.puuid) redirect('/members');
  const puuidList = await getPuuidList();
  const matchList = await getMatchList(user.puuid);

  return (
    <div className="mt-6 flex flex-col gap-2 pb-32">
      {matchList.map((match) => (
        <MatchItem
          match={match}
          key={match.id}
          userId={user.id}
          userPuuid={String(user.puuid)}
          puuidList={puuidList}
        />
      ))}
    </div>
  );
};

export default MatchList;
