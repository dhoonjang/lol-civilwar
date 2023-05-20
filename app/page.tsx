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
        <UpdatePoint
          pointUpdateTime={format(pointUpdateTime, 'M월 d일 HH:mm')}
        />
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
      <Suspense>
        {/* @ts-expect-error Server Component */}
        <UserSection />
      </Suspense>
    </div>
  );
};

export default Home;
