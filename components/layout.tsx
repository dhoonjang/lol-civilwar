'use client';

import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useEffect, useRef, useState } from 'react';

export const HomeIcon = () => {
  return (
    <Link href="/" className="flex items-center">
      <Image
        width={40}
        height={40}
        src="/riotgames.webp"
        alt="riotgames"
        className="w-12 h-12"
      />
    </Link>
  );
};

export const Navigation = () => {
  return (
    <div className="flex gap-4 items-center">
      <Link href="/members" className="text-btn">
        참가자
      </Link>
      <Link href="/civilwars" className="text-btn">
        내전
      </Link>
      <Link href="/teams" className="text-btn">
        팀
      </Link>
    </div>
  );
};

export const ProfileIcon: FC<Session['user']> = ({ image }) => {
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
    <div ref={ref} className="mr-2 relative">
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

export const SignInButton = () => {
  return (
    <button className="btn" onClick={() => signIn()}>
      로그인
    </button>
  );
};
