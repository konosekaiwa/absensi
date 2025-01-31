import NextAuth, { DefaultSession, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../lib/prisma';
import { AuthOptions } from 'next-auth';

// Ekstensi tipe DefaultSession untuk menambahkan role dan id
declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      role: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: number;
    role: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('Credentials are required');
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        // Validasi username dan password
        if (!user || credentials.password !== user.password) {
          throw new Error('Invalid username or password');
        }

        // Jika role "INTERN", catat kehadiran
        if (user.role === 'INTERN') {
          await recordAttendance(user.id);
        }

        return { id: user.id, username: user.username, role: user.role };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as number;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

// Fungsi untuk mencatat kehadiran
async function recordAttendance(userId: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayOfWeek = today.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  if (isWeekend) {
    console.log('No attendance recorded on weekends');
    return;
  }

  try {
    await prisma.attendance.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      update: {},
      create: {
        userId,
        date: today,
        status: 'PRESENT',
      },
    });
    console.log(`Attendance recorded for user ID ${userId}`);
  } catch (error) {
    console.error('Error recording attendance:', error);
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
