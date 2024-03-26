import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import prisma from './lib/prisma';

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        const existingUser = profile?.email
          ? await prisma.user.findUnique({ where: { email: profile.email } })
          : null;

        if (existingUser) {
          return true;
        }

        await prisma.user.create({
          data: {
            email: profile?.email as string,
            name: profile?.name as string,
          },
        }); // Create a new user with these details
        return true;
      }

      // TODO: handle other providers
      return false;
    },
    async session({ session, token }) {
      const dbUser = token.email
        ? await prisma.user.findUnique({
            where: { email: token.email },
          })
        : null;

      // eslint-disable-next-line no-param-reassign
      session.userId = dbUser?.id as string;
      return session;
    },
  },
  // TODO: this wasnt in docs but seems to be required
  secret: process.env.NEXT_AUTH_SECRET,
});
