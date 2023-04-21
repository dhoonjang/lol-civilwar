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

export const positionOptions = [
  {
    label: '탑 라이너',
    value: 'top',
  },
  {
    label: '정글러',
    value: 'jungle',
  },
  {
    label: '미드 라이너',
    value: 'mid',
  },
  {
    label: '원거리 딜러',
    value: 'adc',
  },
  {
    label: '서포터',
    value: 'support',
  },
];

export interface TierInfo {
  tierName: string;
  tierNumber: number;
  tierImage: StaticImageData;
}

export const getTierInfo = (tierNumber: number): TierInfo => {
  if (tierNumber < 10)
    return {
      tierName: '아이언',
      tierNumber: Math.max(1, Math.round(4 - tierNumber * 0.4)),
      tierImage: ironImage,
    };

  if (tierNumber < 20)
    return {
      tierName: '브론즈',
      tierNumber: Math.max(1, Math.round(4 - (tierNumber - 10) * 0.4)),
      tierImage: bronzeImage,
    };

  if (tierNumber < 30)
    return {
      tierName: '실버',
      tierNumber: Math.max(1, Math.round(4 - (tierNumber - 20) * 0.4)),
      tierImage: silverImage,
    };

  if (tierNumber < 40)
    return {
      tierName: '골드',
      tierNumber: Math.max(1, Math.round(4 - (tierNumber - 30) * 0.4)),
      tierImage: goldImage,
    };

  if (tierNumber < 50)
    return {
      tierName: '플래티넘',
      tierNumber: Math.max(1, Math.round(4 - (tierNumber - 40) * 0.4)),
      tierImage: platinumImage,
    };

  if (tierNumber < 60)
    return {
      tierName: '다이아',
      tierNumber: Math.max(1, Math.round(4 - (tierNumber - 50) * 0.4)),
      tierImage: diamondImage,
    };

  if (tierNumber < 70)
    return {
      tierName: '마스터',
      tierNumber: 1,
      tierImage: masterImage,
    };

  if (tierNumber < 80)
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
