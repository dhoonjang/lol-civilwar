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

export const fetchToRiot = async (endpoint: string, region?: string) => {
  const response = await fetch(
    `https://${region ?? 'kr'}.api.riotgames.com${endpoint}`,
    {
      headers: {
        'X-Riot-Token': process.env.RIOT_API_KEY ?? '',
      },
    }
  );

  return await response.json();
};

export async function fetchToDiscord(
  endpoint: string,
  options: RequestInit = {}
) {
  const url = 'https://discord.com/api/v10' + endpoint;

  if (options.body) options.body = JSON.stringify(options.body);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent':
        'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options,
  });

  return await response.json();
}

export function exclude<T, Key extends keyof T>(
  user: T,
  keys: Key[]
): Omit<T, Key> {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}
