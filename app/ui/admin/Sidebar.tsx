"use client"; // Tambahkan direktif ini di bagian atas file

import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Menggunakan useRouter dari next/navigation

const navItems = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: '🏠' },
  { href: '/dashboard/admin/siswa', label: 'Siswa', icon: '👨‍🎓' },
  { href: '/dashboard/admin/laporan', label: 'Laporan', icon: '📊' },
  { href: '/dashboard/admin/pengumuman', label: 'Pengumuman', icon: '📣' },
];

const Sidebar = () => {
  const router = useRouter(); // Menggunakan useRouter

  return (
    <aside className="w-64 bg-gray-800 text-white">
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="flex items-center p-2 hover:bg-gray-700 mt-2 space-y-5">
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
