"use client"; // Tambahkan direktif ini di bagian atas file

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaTasks, FaUserGraduate, FaChartBar } from 'react-icons/fa'; // Import ikon dari react-icons

const navItems = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: <FaHome /> },
  { href: '/dashboard/admin/intern', label: 'Intern', icon: <FaUserGraduate /> },
  { href: '/dashboard/admin/tasks', label: 'Tasks', icon: <FaTasks /> },
  { href: '/dashboard/admin/report', label: 'Report', icon: <FaChartBar /> },
];

const Sidebar = () => {
  const router = useRouter(); // Menggunakan useRouter

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen flex flex-col">
      <nav className="flex-1 mt-4 px-2">
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link
                href={item.href}
                className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-all duration-200 ease-in-out"
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                <span className="text-lg">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
