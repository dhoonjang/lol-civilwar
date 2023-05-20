import { SignInButton } from '@/components/layout';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { Suspense } from 'react';
import { authOptions } from './api/auth/[...nextauth]/route';

const Home = async () => {
  const session = await getServerSession(authOptions);

  console.log(session?.user);

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
        <SignInButton />
      </Suspense>
    </div>
  );
};

export default Home;
