import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  trustHost: true, // <--- KANKA BU SATIRI EKLEMEN LAZIM, EKSİK OLAN BU!
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          credits: user.credits,
          plan: user.plan
        };
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.credits = (user as any).credits;
        token.plan = (user as any).plan;
      }
      
      // Her JWT token yenilendiğinde kullanıcı bilgilerini veritabanından al
      if (token.id && (trigger === 'update' || !token.plan)) {
        try {
          const freshUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { credits: true, plan: true, name: true }
          });
          
          if (freshUser) {
            token.credits = freshUser.credits;
            token.plan = freshUser.plan;
            token.name = freshUser.name;
          }
        } catch (error) {
          console.error('JWT refresh error:', error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.credits = token.credits as number;
        session.user.plan = token.plan as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/auth/signout'
  }
});

export const { GET, POST } = handlers;