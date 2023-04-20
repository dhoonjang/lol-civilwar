import SignOut from '@/components/sign-out';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';

const Home = async () => {
  const session = await getServerSession(authOptions);

  console.log('home', session);

  return (
    <div className="flex h-screen bg-black">
      <div className="w-screen h-screen flex flex-col space-y-5 justify-center items-center">
        <SignOut />
      </div>
    </div>
  );
};

export default Home;
