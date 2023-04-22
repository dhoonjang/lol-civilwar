import { UserCard } from '@/components/user';
import { getUserList } from 'domain/user';
import Link from 'next/link';

const Members = async () => {
  const userList = await getUserList();

  return (
    <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 content-start pt-20 px-4">
      {userList.map(({ pointUpdateTime, ...user }) => (
        <Link href={`/members/${user.id}`} key={user.id}>
          <UserCard user={user} className="card-btn" />
        </Link>
      ))}
    </div>
  );
};

export default Members;
