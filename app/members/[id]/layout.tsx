import { UserCard } from '@/components/user';
import { getUser } from 'domain/user';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function MemeberLayout({
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  const user = await getUser(params.id);
  if (!user?.puuid) redirect('/members');
  return (
    <div className="container py-20 px-4">
      <UserCard user={user} />
      <Suspense>{children}</Suspense>
    </div>
  );
}
