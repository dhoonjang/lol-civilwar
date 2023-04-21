import { HomeIcon } from '@/components/home';
import { ProfileIcon } from '@/components/user';
import { getUserInfo } from 'api/users';

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
