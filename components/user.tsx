'use client';
import { User } from '@prisma/client';
import { FC, FormEvent, startTransition, useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { getTierInfo, positionOptions } from 'utils';
import Image from 'next/image';

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

export const UpdatePoint: FC = () => {
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
    <button className="btn btn-blue text-sm" onClick={handleClick}>
      포인트 업데이트
    </button>
  );
};

export const RegisterSummoner: FC<{ createMode?: boolean }> = ({
  createMode,
}) => {
  const [mainPosition, setMainPosition] = useState('null');
  const { refresh } = useRouter();

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const response = await fetch('/api/user', {
        method: createMode ? 'POST' : 'PUT',
        body: JSON.stringify({
          summonerName: e.currentTarget.summonerName.value,
          tier: e.currentTarget.tier.value,
          position: e.currentTarget.position.value,
          subPosition: e.currentTarget.subPosition?.value,
        }),
      });
      const user: User = await response.json();

      toast.success(
        `소환사 정보가 등록되었습니다.
[소환사 이름: ${user.summonerName}]`
      );

      startTransition(refresh);
    },
    [refresh, createMode]
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
