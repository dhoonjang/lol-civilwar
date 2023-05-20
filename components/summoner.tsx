'use client';

import { FC } from 'react';
import { getTierInfo, positionOptions } from 'utils';
import Image from 'next/image';
import { Summoner } from '@prisma/client';

export const UserCard: FC<{
  className?: string;
  summoner: Summoner;
}> = ({ className, summoner: { tier, position, name } }) => {
  const tierInfo = getTierInfo(tier || 0);

  const positionImage = positionOptions.find(
    (opt) => opt.value === JSON.parse(position)[0]
  )?.image;

  const subPositionImage = positionOptions.find(
    (opt) => opt.value === JSON.parse(position)[1]
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
          <span className="mr-2">{name}</span>
          {positionImage && (
            <Image
              src={positionImage}
              alt={JSON.parse(position)[0]}
              className="w-7 h-7"
            />
          )}
          {subPositionImage && (
            <Image
              src={subPositionImage}
              alt={JSON.parse(position)[1]}
              className="w-7 h-7"
            />
          )}
        </div>
      </div>
    </div>
  );
};
