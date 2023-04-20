import { RegisterSummoner, UpdatePoint } from '@/components/user';
import { getUserInfo } from 'api/users';

export const UserSection = async () => {
  const user = await getUserInfo();

  if (!user) return null;
  if (!user.summonerName) return <RegisterSummoner />;

  return (
    <div className="bg-gray-800 divider shadow-md shadow-gray-700 rounded-md px-8 py-4">
      <p className="text-stone-200">{user.summonerName}</p>
      <p className="text-stone-200">RP: {user.relationPoint}</p>
      <p className="text-stone-200">BP: {user.battlePoint}</p>
      <UpdatePoint />
    </div>
  );
};
