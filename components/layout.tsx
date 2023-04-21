'use client';

import { User } from '@prisma/client';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useEffect, useRef, useState } from 'react';

export const HomeIcon = () => {
  return (
    <div className="fixed top-4 left-2">
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

export const ProfileIcon: FC<Omit<User, 'pointUpdateTime'>> = ({ image }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [toggleOpen, setToggleOpen] = useState<boolean>(false);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      setToggleOpen(false);
    };

    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref]);

  return (
    <div ref={ref} className="fixed top-4 right-4">
      <Image
        src={image || ''}
        alt=""
        className="w-8 h-8 rounded-full cursor-pointer"
        width={40}
        height={40}
        onClick={() => setToggleOpen((isOpen) => !isOpen)}
      />
      {toggleOpen && (
        <div className="flex flex-col absolute right-0 top-12 gap-1 w-24 items-end rounded bg-black/50">
          <button
            className="text-btn"
            onClick={(e) => {
              e.stopPropagation();
              window.open('https://discord.gg/btdvPBpp');
            }}
          >
            디스코드 채널
          </button>
          <button
            className="text-btn"
            onClick={(e) => {
              e.stopPropagation();
              signOut();
            }}
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
};
