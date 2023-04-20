import { getUserInfo } from 'api/users';
import Image from 'next/image';

const Home = async () => {
  const user = await getUserInfo();

  console.log(user);

  return (
    <div className="flex h-screen bg-black">
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
          <p className="text-stone-200 mt-5">{user?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
