'use client';
import { Position, User } from '@prisma/client';
import { FC, FormEvent, startTransition, useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { getTierInfo, positionOptions } from 'utils';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';

export const UserCard: FC<{
  className?: string;
  user: Omit<User, 'pointUpdateTime'>;
}> = ({
  className,
  user: {
    tier,
    position,
    subPosition,
    summonerName,
    relationPoint,
    battlePoint,
  },
}) => {
  const tierInfo = getTierInfo(tier || 0);

  const positionImage = positionOptions.find(
    (opt) => opt.value === position
  )?.image;
  const subPositionImage = positionOptions.find(
    (opt) => opt.value === subPosition
  )?.image;
  return (
    <div className={`card flex gap-6 items-center justify-center ${className}`}>
      <div>
        <Image
          src={tierInfo.tierImage}
          alt={tierInfo.tierName}
          className="w-20 h-20"
        />
        <p className="text-center font-roman">{tierInfo.tierNumber}</p>
      </div>
      <div className="min-w-max">
        <div className="font-bold text-lg mb-2 flex items-center gap-1">
          <span className="mr-2">{summonerName}</span>
          {positionImage && (
            <Image
              src={positionImage}
              alt={position ?? ''}
              className="w-7 h-7"
            />
          )}
          {subPositionImage && (
            <Image
              src={subPositionImage}
              alt={subPosition ?? ''}
              className="w-7 h-7"
            />
          )}
        </div>
        <p className="mb-1">관계 포인트: {relationPoint}</p>
        <p>배팅 포인트: {battlePoint}</p>
      </div>
    </div>
  );
};

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
    <div>
      <button className="btn btn-blue text-sm" onClick={handleClick}>
        포인트 업데이트
      </button>
      <div className="text-sm text-stone-400 text-center mt-1">
        {pointUpdateTime}
      </div>
    </div>
  );
};

export interface CreateSummonerRequest {
  summonerName: string;
  tier: number;
  position: Position | 'null';
  subPosition: Position | 'null';
}

export const RegisterSummoner: FC<{ createMode?: boolean }> = ({
  createMode,
}) => {
  const [mainPosition, setMainPosition] = useState('null');

  const { mutate } = useMutation<User, unknown, CreateSummonerRequest>(
    async (data) => {
      const { summonerName, tier, position, subPosition } = data;
      const response = await fetch('/api/user', {
        method: createMode ? 'POST' : 'PUT',
        body: JSON.stringify({
          summonerName,
          tier,
          position,
          subPosition,
        }),
      });
      const user: User = await response.json();

      return user;
    },
    {
      onSuccess: (user) => {
        toast.success(
          `소환사 정보가 등록되었습니다.
[소환사 이름: ${user.summonerName}]`
        );

        startTransition(refresh);
      },
    }
  );
  const { refresh } = useRouter();

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      mutate({
        summonerName: e.currentTarget.summonerName.value,
        tier: Number(e.currentTarget.tier.value),
        position: e.currentTarget.position.value,
        subPosition: e.currentTarget.subPosition.value,
      });
    },
    [mutate]
  );

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-col">
      <input
        id="summonerName"
        placeholder="소환사명"
        className="w-64 text-center"
      />
      <select id="tier" className="w-64">
        <option value={10}>아이언</option>
        <option value={30}>브론즈</option>
        <option value={50}>실버</option>
        <option value={70}>골드</option>
        <option value={90}>플래티넘</option>
        <option value={110}>다이아</option>
        <option value={130}>마스터</option>
      </select>
      <select
        id="position"
        className="w-64"
        defaultValue="null"
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
        <select id="subPosition" className="w-64" defaultValue="null">
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
