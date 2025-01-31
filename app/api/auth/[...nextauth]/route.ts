import NextAuth, { DefaultSession, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import prisma from '../../../lib/prisma'; // Pastikan path ini benar
import { AuthOptions } from 'next-auth';

// Ekstensi tipe DefaultSession untuk menyertakan role dan id
declare module 'next-auth' {
  interface Session {
    user: {
      id: number; // Ganti tipe id menjadi number
      role: string; // Tambahkan properti role di sini
    } & DefaultSession['user']; // Gabungkan dengan user yang ada
  }

  interface User {
    id: number; // Pastikan id bertipe number
    role: string; // Pastikan untuk menambahkan role ke tipe User
  }
}

// Ekstensi tipe pengguna untuk authorization
interface ExtendedUser extends User {
  role: string;
}

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }

        // Temukan pengguna berdasarkan username
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        console.log("User found:", user); // Memeriksa user yang ditemukan
        console.log("JWT Callback - User:", user);

        if (!user) {
          throw new Error('User not found');
        }

        // Cek password untuk siswa magang
        if (user.role === 'INTERN') {
          const dobString = user.dateOfBirth.toISOString().split('T')[0].replace(/-/g, '').slice(-6);
          console.log("Expected password (DOB):", dobString); // Log expected password
          if (credentials.password === dobString) {
            await recordAttendance(user.id); // Panggil fungsi untuk mencatat kehadiran
            return { id: user.id, username: user.username, role: user.role } as ExtendedUser; // Pastikan id bertipe number
          } else {
            console.log("Invalid password for INTERN"); // Log jika password tidak cocok
            throw new Error('Invalid password');
          }
        }

        // Cek password untuk admin
        console.log("Admin password check:", credentials.password, user.password); // Log perbandingan password
        if (credentials.password !== user.password) {
          console.log("Invalid password for ADMIN"); // Log jika password tidak cocok
          throw new Error('Invalid password');
        }

        return { id: user.id, username: user.username, role: user.role } as ExtendedUser; // Pastikan id bertipe number
      }
    })
  ],
  pages: {
    signIn: '/login', // Atur halaman login sesuai kebutuhan
  },
  session: {
    strategy: 'jwt', // Menggunakan strategi JWT
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT Callback - User:", user); // Log user yang diterima
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - Token:", token); // Log token yang diterima
      if (token) {
        session.user.id = token.id as number;
        session.user.role = token.role as string;
      }
      console.log("Session Data:", session); // Log data sesi
      return session;
    }
  }
};

// Fungsi untuk mencatat kehadiran
async function recordAttendance(userId: number) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Mengecek apakah hari libur

  if (isWeekend) {
    console.log("Today is a weekend. No attendance recorded.");
    return; // Tidak mencatat kehadiran jika hari libur
  }

  // Format tanggal ke YYYY-MM-DD dengan waktu 00:00:00
  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Membuat objek Date tanpa waktu (waktu otomatis 00:00:00)

  // Cari attendance berdasarkan userId dan tanggal
  const attendanceRecord = await prisma.attendance.findUnique({
    where: {
      userId_date: {
        userId: userId,
        date: date, // Pastikan mengirimkan objek Date dengan waktu 00:00:00
      },
    },
  });

  if (!attendanceRecord) {
    // Pastikan hanya mencatat jika belum ada data yang tercatat untuk hari tersebut
    await prisma.attendance.create({
      data: {
        userId: userId,
        date: date, // Kirim objek Date dengan waktu 00:00:00
        status: 'PRESENT',
      },
    });
    console.log(`Attendance recorded for user ID ${userId} on ${date.toISOString().split('T')[0]}.`);
  } else {
    console.log(`Attendance already recorded for user ID ${userId} on ${date.toISOString().split('T')[0]}.`);
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
