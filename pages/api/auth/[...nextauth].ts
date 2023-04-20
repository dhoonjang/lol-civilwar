import NextAuth, { AuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import prisma from '@/lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: '1098189483125506139',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
};

export default NextAuth(authOptions);
