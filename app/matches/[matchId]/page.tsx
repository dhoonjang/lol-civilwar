import Image from 'next/image';

const MatchPage = async () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <Image
        width={160}
        height={160}
        src="/riotgames.webp"
        alt="Platforms on Vercel"
        className="w-40 h-40"
      />
      <h1 className="font-bold text-xl text-center mb-10">매치</h1>
    </div>
  );
};

export default MatchPage;
