import { MatchItem } from '@/components/match';
import { UserCard } from '@/components/user';
import { Comment, User } from '@prisma/client';
import { sub } from 'date-fns';
import { getRiotMatchIdList, getRiotMatchList } from 'domain/riot';
import {
  UserComplete,
  getMyInfoWithComments,
  getPuuidList,
  getUser,
} from 'domain/user';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

interface MatchWithComments {
  matchId: string;
  comments: Comment[];
}

const MatchList = async ({
  user,
  comments,
}: {
  user: UserComplete;
  comments: (Comment & {
    writer: User;
  })[];
}) => {
  const matchWithCommentsList = comments.reduce<MatchWithComments[]>(
    (prev, curr) => {
      const newAray = [...prev];
      const mwc = newAray.find((m) => m.matchId === curr.matchId);
      if (mwc) {
        mwc.comments.push(curr);
      } else {
        newAray.push({
          matchId: curr.matchId,
          comments: [curr],
        });
      }
      return newAray;
    },
    []
  );

  const riotMatchIdList = await getRiotMatchIdList(user.puuid);

  const puuidList = await getPuuidList();

  const matchList = await getRiotMatchList([
    ...new Set(
      riotMatchIdList.concat(matchWithCommentsList.map((m) => m.matchId))
    ),
  ]);

  const me = await getMyInfoWithComments();

  return (
    <div className="mt-6 rounded-xl pb-32">
      <div className="flex flex-col overflow-scroll gap-2">
        {matchList
          .filter((m) =>
            m.participants.some(
              (p) => user.puuid !== p.puuid && puuidList.includes(p.puuid)
            )
          )
          .map((match) => {
            const canComment =
              !!me?.puuid &&
              match.participants.some((p) => p.puuid === me.puuid) &&
              !me.writedComments.some(
                (comment) =>
                  comment.userId === user.id &&
                  comment.matchId === match.matchId
              );

            return (
              <MatchItem
                match={match}
                comments={
                  matchWithCommentsList.find((m) => m.matchId === match.matchId)
                    ?.comments ?? []
                }
                key={match.matchId}
                user={user}
                puuidList={puuidList}
                canComment={canComment}
              />
            );
          })}
      </div>
    </div>
  );
};

const Members = async ({ params }: { params: { id: string } }) => {
  const user = await getUser(params.id);
  if (!user?.puuid) redirect('/members');
  const { comments, ...profile } = user;
  return (
    <div className="container py-20 px-4">
      <UserCard user={profile} />
      <Suspense>
        {/* @ts-expect-error Server Component */}
        <MatchList user={user} comments={comments} />
      </Suspense>
    </div>
  );
};

export default Members;
