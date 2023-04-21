'use client';

import Image from 'next/image';
import Link from 'next/link';

export const HomeIcon = () => {
  return (
    <div className="fixed top-4 left-4">
      <Link href="/" className="flex items-center">
        <Image
          width={40}
          height={40}
          src="/riotgames.webp"
          alt="riotgames"
          className="w-10 h-10"
        />
        <h2 className="text-stone-200 font-bold text-lg">찌질이들의 롤대회</h2>
      </Link>
    </div>
  );
};
