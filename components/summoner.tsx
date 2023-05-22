'use client';

import { FC } from 'react';
import { getTierInfo, positionOptions } from '@/utils/summoner';
import Image from 'next/image';
import { Position, Summoner, SummonerStat } from '@prisma/client';

export const UserCard: FC<{
  className?: string;
  summoner: Summoner & {
    summonerStats: SummonerStat[];
    positions: Position[];
  };
}> = ({ className, summoner: { summonerStats, positions, name } }) => {
  const tierInfo = getTierInfo(
    summonerStats.reduce<number>(
      (stat, curr, index) => (curr.value + stat * index) / index + 1,
      0
    )
  );

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
          <span className="mr-2">{name}</span>
          {positions.map(({ position }) => (
            <Image
              key={position}
              src={positionOptions.find((opt) => opt.value === position)?.image}
              alt={position}
              className="w-7 h-7"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
