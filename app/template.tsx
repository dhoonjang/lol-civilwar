import { HomeIcon, Navigation, ProfileIcon } from '@/components/layout';
import { getUserInfo } from 'db/users';

async function Template({ children }: { children: React.ReactNode }) {
  const user = await getUserInfo();
  let profile = null;
  if (user) {
    const { pointUpdateTime, ...rest } = user;
    profile = { ...rest };
  }
  return (
    <div className="flex h-screen bg-black">
      <div className="fixed w-full py-3 px-1 sm:px-3 flex justify-between items-center">
        <div className="flex gap-5">
          <HomeIcon />
          {profile?.summonerName && <Navigation />}
        </div>
        {profile && <ProfileIcon {...profile} />}
      </div>
      {children}
    </div>
  );
}

export default Template;
