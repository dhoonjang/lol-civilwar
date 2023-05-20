import Image from 'next/image';
import { Suspense } from 'react';

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
      <Suspense></Suspense>
    </div>
  );
};

export default Home;
