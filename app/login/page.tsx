"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/legacy/image";

const AuthPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if the user is already authenticated
    if (status === "authenticated") {
      const roleRedirect: Record<'ADMIN' | 'INTERN', string> = {
        ADMIN: '/dashboard/admin',
        INTERN: '/dashboard/intern',
      };
      
      const userRole = session?.user?.role as 'ADMIN' | 'INTERN'; // Pastikan bahwa role adalah salah satu dari 'ADMIN' atau 'INTERN'
      
      if (userRole && roleRedirect[userRole]) {
        router.push(roleRedirect[userRole]);
      }
      
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      if (res?.error) {
        setError("Invalid username or password. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 to-blue-400 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-lg flex overflow-hidden">
        <div className="lg:w-2/5 w-full p-10 sm:p-12 flex flex-col items-center justify-center space-y-5">
          <h2 className="text-3xl font-semibold text-gray-800 text-center uppercase">
            Daftar Kehadiran <br /> Siswa Magang
          </h2>
          <p className="text-gray-500 text-center text-sm">
            Selamat datang, silakan masukkan informasi Anda!
          </p>

          <form className="w-full max-w-sm space-y-5" onSubmit={handleSubmit}>
            <input
              className="w-full text-black px-5 py-3 rounded-lg bg-gray-100 border border-gray-300 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition duration-200 ease-in-out shadow-sm"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              className="w-full text-black px-5 py-3 rounded-lg bg-gray-100 border border-gray-300 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition duration-200 ease-in-out shadow-sm"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-lg font-semibold hover:from-teal-500 hover:to-sky-500 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
            >
              Login
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </div>

        <div className="flex-1 bg-gradient-to-b from-blue-400 to-yellow-400 hidden lg:flex items-center justify-center">
          <div className="relative ml-1 w-full h-full">
            <Image
              src="/logo.jpg"
              layout="fill"
              objectFit="cover"
              className="rounded-xl shadow-lg"
              alt="Dashboard preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
