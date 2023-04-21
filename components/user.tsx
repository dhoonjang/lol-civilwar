'use client';
import { User } from '@prisma/client';
import {
  FC,
  FormEvent,
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-hot-toast';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { positionOptions } from 'utils';

export const UpdatePoint: FC<{ pointUpdateTime: string }> = ({
  pointUpdateTime,
}) => {
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
    <button className="text-btn" onClick={handleClick}>
      {pointUpdateTime}
    </button>
  );
};

export const RegisterSummoner = () => {
  const [mainPosition, setMainPosition] = useState('null');
  const { refresh } = useRouter();

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const response = await fetch('/api/user', {
        method: 'PUT',
        body: JSON.stringify({
          summonerName: e.currentTarget.summonerName.value,
          tier: e.currentTarget.tier.value,
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
    <form onSubmit={handleSubmit} className="flex gap-2 flex-col">
      <input
        id="summonerName"
        placeholder="소환사명"
        className="w-64 text-center"
      />
      <select id="tier" className="w-64">
        <option value={5}>아이언</option>
        <option value={15}>브론즈</option>
        <option value={25}>실버</option>
        <option value={35}>골드</option>
        <option value={45}>플래티넘</option>
        <option value={55}>다이아</option>
        <option value={65}>마스터</option>
      </select>
      <select
        id="position"
        className="w-64"
        onChange={(e) => setMainPosition(e.currentTarget.value)}
      >
        <option value="null">포지션 상관없음</option>
        {positionOptions.map((opt) => (
          <option value={opt.value} key={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {mainPosition !== 'null' && (
        <select id="subPosition" className="w-64">
          <option value="null">부포지션 상관없음</option>
          {positionOptions
            .filter((opt) => opt.value !== mainPosition)
            .map(({ value, label }) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
        </select>
      )}
      <button className="btn btn-blue w-64" type="submit">
        소환사 등록
      </button>
    </form>
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
