import { StaticImageData } from 'next/image';
import ironImage from '@/assets/iron.png';
import bronzeImage from '@/assets/bronze.png';
import silverImage from '@/assets/silver.png';
import goldImage from '@/assets/gold.png';
import platinumImage from '@/assets/platinum.png';
import diamondImage from '@/assets/diamond.png';
import masterImage from '@/assets/master.png';
import grandMasterImage from '@/assets/grandmaster.png';
import challengerImage from '@/assets/challenger.png';
import topImage from '@/assets/top.svg';
import jungleImage from '@/assets/jungle.svg';
import midImage from '@/assets/mid.svg';
import adcImage from '@/assets/adc.svg';
import supportImage from '@/assets/support.svg';
import { User } from '@prisma/client';

export const positionOptions = [
  {
    label: '탑 라이너',
    value: 'TOP',
    image: topImage,
  },
  {
    label: '정글러',
    value: 'JUNGLE',
    image: jungleImage,
  },
  {
    label: '미드 라이너',
    value: 'MID',
    image: midImage,
  },
  {
    label: '원거리 딜러',
    value: 'ADC',
    image: adcImage,
  },
  {
    label: '서포터',
    value: 'SUPPORT',
    image: supportImage,
  },
];

export interface TierInfo {
  tierName: string;
  tierNumber: number;
  tierImage: StaticImageData;
}

export const getTierInfo = (tierNumber: number): TierInfo => {
  if (tierNumber < 20)
    return {
      tierName: '아이언',
      tierNumber: Math.max(1, Math.round(4 - tierNumber * 0.2)),
      tierImage: ironImage,
    };

  if (tierNumber < 40)
    return {
      tierName: '브론즈',
      tierNumber: Math.max(1, Math.round(4 - (tierNumber - 20) * 0.2)),
      tierImage: bronzeImage,
    };

  if (tierNumber < 60)
    return {
      tierName: '실버',
      tierNumber: Math.max(1, Math.round(4 - (tierNumber - 40) * 0.2)),
      tierImage: silverImage,
    };

  if (tierNumber < 80)
    return {
      tierName: '골드',
      tierNumber: Math.max(1, Math.round(4 - (tierNumber - 60) * 0.2)),
      tierImage: goldImage,
    };

  if (tierNumber < 100)
    return {
      tierName: '플래티넘',
      tierNumber: Math.max(1, Math.round(4 - (tierNumber - 80) * 0.2)),
      tierImage: platinumImage,
    };

  if (tierNumber < 120)
    return {
      tierName: '다이아',
      tierNumber: Math.max(1, Math.round(4 - (tierNumber - 100) * 0.2)),
      tierImage: diamondImage,
    };

  if (tierNumber < 140)
    return {
      tierName: '마스터',
      tierNumber: 1,
      tierImage: masterImage,
    };

  if (tierNumber < 160)
    return {
      tierName: '그랜드마스터',
      tierNumber: 1,
      tierImage: grandMasterImage,
    };

  return {
    tierName: '챌린저',
    tierNumber: 1,
    tierImage: challengerImage,
  };
};

export const fetchToRiot = async (url: string, region?: string) => {
  const response = await fetch(
    `https://${region ?? 'kr'}.api.riotgames.com${url}`,
    {
      headers: {
        'X-Riot-Token': process.env.RIOT_API_KEY ?? '',
      },
    }
  );

  return await response.json();
};

export function exclude<T, Key extends keyof T>(
  user: T,
  keys: Key[]
): Omit<T, Key> {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}

export function calculateTeamDifference(userList: User[]) {
  const team1 = userList.filter((_, index) => index % 2 === 0);
  const team2 = userList.filter((_, index) => index % 2 === 1);

  const team1TotalTier = team1.reduce((acc, cur) => acc + (cur.tier || 0), 0);
  const team2TotalTier = team2.reduce((acc, cur) => acc + (cur.tier || 0), 0);

  const team1PositionList = [
    ...new Set(team1.map((user) => user.position).filter((p) => p !== null)),
  ];

  const team1SubPositionList = team1
    .map((user) => user.subPosition)
    .filter((p) => p !== null && !team1PositionList.includes(p));

  const team1PositionArrange =
    team1PositionList.length +
    team1SubPositionList.length * 0.5 +
    team1.filter((user) => user.position === null).length;

  const team2PositionList = [
    ...new Set(team1.map((user) => user.position).filter((p) => p !== null)),
  ];

  const team2SubPositionList = team1
    .map((user) => user.subPosition)
    .filter((p) => p !== null && !team2PositionList.includes(p));

  const team2PositionArrange =
    team2PositionList.length +
    team2SubPositionList.length * 0.5 +
    team2.filter((user) => user.position === null).length;

  if (team1PositionArrange <= 3 || team2PositionArrange <= 3) return 1000;

  const team1Point = team1TotalTier + team1PositionArrange * 20;
  const team2Point = team2TotalTier + team2PositionArrange * 20;

  let result = Math.abs(team1Point - team2Point);

  if (team1PositionArrange > 4 && team2PositionArrange > 4) result -= 10;
  return result;
}
