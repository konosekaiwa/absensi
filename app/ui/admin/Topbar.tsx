// app/ui/admin/TopBar.tsx
'use client';

import React from 'react';
import { signOut } from 'next-auth/react'; // Import signOut

const TopBar: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white flex justify-between items-center p-4 shadow-md">
      <div className="text-xl font-bold">Dashboard Admin</div>
      <div className="flex items-center space-x-4">
        <span>Welcome, Admin</span>
        <button
          onClick={() => signOut({ redirect: true, callbackUrl: '/login' })} // Logika logout
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopBar;
