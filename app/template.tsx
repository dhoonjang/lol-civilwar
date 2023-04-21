import { HomeIcon, ProfileIcon } from '@/components/layout';
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
      <HomeIcon />
      {profile && <ProfileIcon {...profile} />}
      {children}
    </div>
  );
}

export default Template;
