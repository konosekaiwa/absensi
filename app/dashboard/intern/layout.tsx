"use client";

import React from "react";
import { signOut } from "next-auth/react"; // Import signOut from next-auth/react

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white font-sans">
            <header className="bg-gray-800 border-b border-gray-700 shadow-lg z-10">
                <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white ">Intern Dashboard</h1>
                    <button
                        onClick={() => signOut({ redirect: true, callbackUrl: '/login' })} // Logika logout
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="pt-16 flex-1 bg-sky-100">
                <div className="max-w-5xl max-h-fill mx-auto px-6 py-8">{children}</div>
            </main>

            <footer className="bg-gray-800 border-t border-gray-700">
                <div className="max-w-5xl mx-auto px-6 py-4 text-center">
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} Intern Management. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
