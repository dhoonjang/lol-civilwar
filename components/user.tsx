'use client';
import { User } from '@prisma/client';
import { FC, FormEvent, startTransition, useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export const UpdatePoint = () => {
  const { refresh } = useRouter();

  const handleClick = useCallback(async () => {
    const response = await fetch('/api/user', {
      method: 'PATCH',
    });
    const user: User = await response.json();

    toast.success(
      `포인트 업데이트가 완료되었습니다.
[RP: ${user.relationPoint} / BP: ${user.battlePoint}]`
    );

    startTransition(refresh);
  }, [refresh]);

  return (
    <button
      className="text-stone-400 hover:text-stone-200 transition-all"
      onClick={handleClick}
    >
      포인트 업데이트
    </button>
  );
};

export const RegisterSummoner = () => {
  const { refresh } = useRouter();

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const response = await fetch('/api/user', {
        method: 'PUT',
        body: JSON.stringify({
          summonerName: e.currentTarget.summonerName.value,
        }),
      });
      const user: User = await response.json();

      toast.success(
        `소환사 정보가 등록되었습니다.
[소환사 이름: ${user.summonerName}]`
      );

      startTransition(refresh);
    },
    [refresh]
  );

  return (
    <form onSubmit={handleSubmit}>
      <input id="summonerName" />
      <button
        className="text-stone-400 hover:text-stone-200 transition-all"
        type="submit"
      >
        제출
      </button>
    </form>
  );
};

export const ProfileIcon: FC<User> = ({ image }) => {
  const [toggleOpen, setToggleOpen] = useState<boolean>(false);

  return (
    <div
      className="fixed top-4 right-4 cursor-pointer"
      onClick={() => setToggleOpen((isOpen) => !isOpen)}
    >
      <Image
        src={image || ''}
        alt=""
        className="w-10 h-10 rounded-full"
        width={40}
        height={40}
      />
      {toggleOpen && (
        <button
          className="absolute right-0 top-12 w-16 text-stone-400 hover:text-stone-200 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            signOut();
          }}
        >
          로그아웃
        </button>
      )}
    </div>
  );
};
