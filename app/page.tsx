import { RegisterSummoner, UpdatePoint } from '@/components/user';
import { getUserInfo } from 'db/users';
import { differenceInMinutes, format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { getTierInfo } from 'utils';

const UserSection = async () => {
  const user = await getUserInfo();

  if (!user) return null;
  if (!user.summonerName) return <RegisterSummoner />;
  const tierInfo = getTierInfo(user.tier || 0);
  const pointUpdateTime = differenceInMinutes(
    Date.now(),
    user.pointUpdateTime ?? Date.now()
  );
  return (
    <div className="flex rounded-md p-4 py-2 border-slate-400 border items-center gap-4">
      <div>
        <Image
          src={tierInfo.tierImage}
          alt={tierInfo.tierName}
          className="w-16 h-16"
        />
        <p className="text-stone-100 text-center">
          {tierInfo.tierName} [{tierInfo.tierNumber}]
        </p>
      </div>
      <div className="flex flex-col justify-between items-end h-16">
        <p className="text-stone-300">
          <span className="font-bold text-stone-100 text-lg mr-2">
            {user.summonerName}
          </span>
          [RP: {user.relationPoint} / BP: {user.battlePoint}]
        </p>
        <UpdatePoint
          pointUpdateTime={
            pointUpdateTime
              ? `최근 업데이트 ${pointUpdateTime}분 전`
              : '포인트 업데이트'
          }
        />
      </div>
    </div>
  );
};

const Home = async () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <Image
        width={160}
        height={160}
        src="/riotgames.webp"
        alt="Platforms on Vercel"
        className="w-40 h-40"
      />
      <h1 className="text-stone-200 font-bold text-2xl text-center mb-10">
        제 2회 찌질이들의 롤대회
      </h1>
      <Suspense>
        {/* @ts-expect-error Server Component */}
        <UserSection />
      </Suspense>
      <div className="container max-w-md flex justify-around mt-8">
        <Link href="/members" className="text-lg text-btn">
          참가자 목록
        </Link>
        <Link href="/members" className="text-lg text-btn">
          내전 생성
        </Link>
        <Link href="/members" className="text-lg text-btn">
          팀 결성
        </Link>
      </div>
    </div>
  );
};

export default Home;
