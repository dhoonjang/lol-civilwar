import { getUserList } from 'db/users';
import Image from 'next/image';
import Link from 'next/link';
import { getTierInfo } from 'utils';

const Members = async () => {
  const userList = await getUserList();

  return (
    <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 content-start pt-20 px-4">
      {userList.map((user) => {
        const tierInfo = getTierInfo(user.tier || 0);
        return (
          <Link
            href={`/members/${user.id}`}
            className="flex rounded-md p-4 py-2 border-slate-400 border items-center justify-around hover:bg-slate-900"
            key={user.id}
          >
            <div>
              <Image
                src={tierInfo.tierImage}
                alt={tierInfo.tierName}
                className="w-16 h-16"
              />
              <p className="text-stone-100 text-center">
                {tierInfo.tierName} [{tierInfo.tierNumber}]
              </p>
            </div>
            <div className="flex flex-col justify-between h-16 items-center">
              <p className="font-bold text-stone-100 text-lg mr-2">
                {user.summonerName} ({user.name})
              </p>
              <p className="text-stone-300">
                [RP: {user.relationPoint} / BP: {user.battlePoint}]
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Members;
