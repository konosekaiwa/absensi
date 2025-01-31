"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";

interface SignInResponse {
  ok: boolean;
  error?: string;
  user?: {
    id: number; // Menggunakan type number
    username: string;
    role: string;
  };
}

const AuthPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });
  
    console.log("SignIn Response:", res); // Debugging: Log respons sign-in
  
    if (res?.error) {
      setError(res.error);
    } else {
      // Redirect berdasarkan role setelah sign-in sukses
      const sessionResponse = await fetch('/api/auth/session');
      const sessionData = await sessionResponse.json();
  
      if (sessionData?.user) {
        const { role } = sessionData.user;
  
        if (role === 'ADMIN') {
          router.push('/dashboard/admin');
        } else if (role === 'INTERN') {
          router.push('/dashboard/intern');
        } else {
          setError('Unknown role'); // Penanganan jika role tidak dikenali
        }
      } else {
        setError('No user information received');
      }
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-300 to-emerald-200 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-lg flex overflow-hidden">
        <div className="lg:w-2/5 w-full p-10 sm:p-12 flex flex-col items-center justify-center space-y-5">
          <h2 className="text-3xl font-semibold text-gray-800 text-center uppercase ">Daftar Kehadiran <br/> Siswa Magang</h2>
          <p className="text-gray-500 text-center text-sm">Selamat datang, silakan masukkan informasi anda!</p>

          <form className="w-full max-w-sm space-y-5" onSubmit={handleSubmit}>
            <input
              className="w-full px-5 py-3 rounded-lg bg-gray-100 border border-gray-300 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition duration-200 ease-in-out shadow-sm"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              className="w-full px-5 py-3 rounded-lg bg-gray-100 border border-gray-300 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition duration-200 ease-in-out shadow-sm"
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
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>

        <div className="flex-1 bg-gradient-to-r from-green-200 via-blue-100 to-blue-200 hidden lg:flex items-center justify-center">
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
