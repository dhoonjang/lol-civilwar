import { User } from '@prisma/client';

export type UserComplete = User & {
  summonerName: string;
  puuid: string;
};
