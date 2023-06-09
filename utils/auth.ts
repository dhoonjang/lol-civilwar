import { AuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_APP_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    session: ({ session, token }) => {
      if (session.user) session.user.id = token.sub;
      return session;
    },
  },
};

export default authOptions;
