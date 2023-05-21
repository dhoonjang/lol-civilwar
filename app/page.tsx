import authOptions from '@/utils/auth';
import { getServerSession } from 'next-auth';
import Image from 'next/image';

const Home = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <Image
        width={160}
        height={160}
        src="/riotgames.webp"
        alt="Platforms on Vercel"
        className="w-40 h-40"
      />
      {JSON.stringify(session)}
    </div>
  );
};

export default Home;
