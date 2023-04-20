import { RegisterSummoner, UpdatePoint } from '@/components/user';
import { getUserInfo } from 'api/users';
import Image from 'next/image';
import { Suspense } from 'react';

const UserSection = async () => {
  const user = await getUserInfo();

  if (!user) return null;
  if (!user.summonerName) return <RegisterSummoner />;

  return (
    <div className="bg-slate-800 divider shadow-md shadow-slate-700 rounded-md px-8 py-4">
      <p className="text-stone-300 mb-4">
        <span className="font-bold text-stone-100">{user.summonerName}</span>{' '}
        [RP: {user.relationPoint} / BP: {user.battlePoint}]
      </p>
      <UpdatePoint />
    </div>
  );
};

const Home = async () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <Image
        width={512}
        height={512}
        src="/riotgames.webp"
        alt="Platforms on Vercel"
        className="w-40 h-40"
      />
      <div className="text-center max-w-screen-sm mb-10">
        <h1 className="text-stone-200 font-bold text-2xl">
          제 2회 찌질이들의 롤대회
        </h1>
      </div>
      <Suspense>
        {/* @ts-expect-error Server Component */}
        <UserSection />
      </Suspense>
    </div>
  );
};

export default Home;
