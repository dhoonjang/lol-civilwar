import { MatchItem } from '@/components/match';
import { getMatch } from 'domain/match';
import { getPuuidList, getUser } from 'domain/user';
import { redirect } from 'next/navigation';

const MatchList = async ({
  params,
}: {
  params: { id: string; matchId: string };
}) => {
  const user = await getUser(params.id);
  const match = await getMatch(params.matchId);
  if (!user || !match) redirect('/members');
  const puuidList = await getPuuidList();

  const participant = match.participants.find((m) => m.puuid === user.puuid);

  return (
    <div className="mt-6 pb-32">
      <MatchItem
        match={match}
        key={match.id}
        userPuuid={String(user.puuid)}
        puuidList={puuidList}
      />
      <form className="card mt-4">
        <input
          type="text"
          placeholder="경기에 대한 한줄평을 입력하세요"
          className="w-full mb-4 border rounded-lg border-gray-500"
        />
        <div className="flex justify-between">
          <div className="flex items-center">
            적정 티어
            <select
              id="tier"
              className="w-28 h-8 border rounded-lg mr-2 ml-4 border-gray-500 text-center"
            >
              <option value={10}>아이언</option>
              <option value={30}>브론즈</option>
              <option value={50}>실버</option>
              <option value={70}>골드</option>
              <option value={90}>플래티넘</option>
              <option value={110}>다이아</option>
              <option value={130}>마스터</option>
            </select>
            <select
              id="tierNumber"
              className="w-16 h-8 border rounded-lg font-roman border-gray-500 text-center"
            >
              <option value={4}>4</option>
              <option value={3}>3</option>
              <option value={2}>2</option>
              <option value={1}>1</option>
            </select>
          </div>
          <button className="btn btn-blue" type="submit">
            댓글 작성
          </button>
        </div>
      </form>
      <div className="flex flex-col">
        {participant &&
          participant.comments.map((c) => (
            <div key={c.id} className="box">
              {c.comment}
            </div>
          ))}
      </div>
    </div>
  );
};

export default MatchList;
