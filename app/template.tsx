import { ProfileIcon } from '@/components/user';
import { getUserInfo } from 'api/users';

async function Template({ children }: { children: React.ReactNode }) {
  const user = await getUserInfo();

  return (
    <div className="flex h-screen bg-black">
      {user && <ProfileIcon {...user} />}
      {children}
    </div>
  );
}

export default Template;
