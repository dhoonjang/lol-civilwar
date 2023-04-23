import { HomeIcon, Navigation, ProfileIcon } from '@/components/layout';
import { getMyInfo } from 'domain/user';

async function Template({ children }: { children: React.ReactNode }) {
  const user = await getMyInfo();
  let profile = null;
  if (user) {
    const { pointUpdateTime, ...rest } = user;
    profile = { ...rest };
  }
  return (
    <div className="flex h-screen bg-black overflow-scroll">
      <div className="fixed w-full py-3 px-1 sm:px-3 flex justify-between items-center bg-black/80">
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
