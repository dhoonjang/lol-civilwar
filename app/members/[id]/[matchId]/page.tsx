import { CommentForm } from '@/components/match';
import { MatchItem } from '../components';
import { getTierInfo } from '@/utils/index';
import { getMatch } from 'domain/match';
import { getMyInfo, getPuuidList, getUser } from 'domain/user';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';

const MatchDetail = async ({
  params,
}: {
  params: { id: string; matchId: string };
}) => {
  const user = await getUser(params.id);
  const match = await getMatch(params.matchId);
  const me = await getMyInfo();
  if (!user?.tier || !match || !me) redirect('/members');
  const participant = match.participants.find((m) => m.puuid === user.puuid);
  if (!participant) redirect('/members');

  const puuidList = await getPuuidList();
  const tier = getTierInfo(user.tier);

  const canComment =
    match.participants.some((p) => p.puuid === me.puuid) &&
    participant.comments.every((c) => c.writerId !== me.id) &&
    user.id !== me.id;

  return (
    <div className="mt-6 pb-32">
      <MatchItem
        match={match}
        key={match.id}
        userPuuid={String(user.puuid)}
        puuidList={puuidList}
      />
      {canComment && (
        <CommentForm
          tier={Math.floor(user.tier / 20) * 20 + 10}
          tierNumber={tier.tierNumber}
          participantId={participant.id}
        />
      )}
      <div className="flex flex-col mt-2 gap-2">
        {participant.comments.map((c) => {
          const tierInfo = getTierInfo(c.properTier);

          return (
            <div key={c.id} className="card flex items-center justify-between">
              <div className="flex items-center">
                <div>
                  <Image
                    src={tierInfo.tierImage}
                    alt={tierInfo.tierName}
                    className="w-12 h-12"
                  />
                  <p className="text-center font-roman text-sm">
                    {tierInfo.tierNumber}
                  </p>
                </div>
                <div className="ml-5">{c.comment}</div>
              </div>
              <div className="text-stone-400">
                {format(c.createdAt, 'yyyy-MM-dd HH:mm')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchDetail;
