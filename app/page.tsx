import { RegisterSummoner, UpdatePoint, UserCard } from '@/components/user';
import { getMyInfo } from 'domain/user';
import { format } from 'date-fns';
import Image from 'next/image';
import { Suspense } from 'react';

const UserSection = async () => {
  const user = await getMyInfo();

  if (!user) return null;
  if (!user.summonerName) return <RegisterSummoner />;
  const { pointUpdateTime, ...rest } = user;
  return (
    <>
      <UserCard user={rest} />
      <div className="mt-4 flex flex-col items-center gap-1">
        <UpdatePoint />
        {!!pointUpdateTime && (
          <div className="text-sm text-stone-400 text-center">
            마지막 업데이트 {format(pointUpdateTime, '4월 d일 HH:mm')}
          </div>
        )}
      </div>
    </>
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
      <h1 className="font-bold text-2xl text-center mb-10">
        제 2회 찌질이들의 롤대회
      </h1>
      <Suspense>
        {/* @ts-expect-error Server Component */}
        <UserSection />
      </Suspense>
    </div>
  );
};

export default Home;
