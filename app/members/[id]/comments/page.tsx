import { getTierInfo } from '@/utils/index';
import { format } from 'date-fns';
import { getUserPariticipants } from 'domain/user';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const MatchList = async ({ params }: { params: { id: string } }) => {
  const user = await getUserPariticipants(params.id);

  if (!user) redirect('/members');

  const comments = user.participants.flatMap((m) =>
    m.comments.map((c) => ({ ...c, matchId: m.matchId }))
  );

  return (
    <div className="flex flex-col mt-6 gap-2">
      {comments.map((c) => {
        const tierInfo = getTierInfo(c.properTier);
        return (
          <Link href={`/members/${user.id}/${c.matchId}`} key={c.id}>
            <div className="card flex items-center justify-between">
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
          </Link>
        );
      })}
    </div>
  );
};

export default MatchList;
