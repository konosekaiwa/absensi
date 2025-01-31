// Sidebar.tsx
import React from 'react';
import { Layout, ClipboardList } from 'lucide-react';

const Sidebar = () => (
  <div className="w-64 min-h-screen bg-gray-800 border-r border-gray-700 fixed left-0 top-0">
    <div className="p-6">
      <h2 className="text-xl font-semibold text-indigo-400 mb-6">Navigation</h2>
      <nav className="space-y-4">
        <a href="/dashboard/intern" className="flex items-center space-x-3 text-gray-300 hover:text-indigo-400 transition-colors duration-200 group">
          <Layout className="group-hover:rotate-12 transition-transform duration-200" size={20} />
          <span>Overview</span>
        </a>
        <a href="/dashboard/intern/reports" className="flex items-center space-x-3 text-gray-300 hover:text-indigo-400 transition-colors duration-200 group">
          <ClipboardList className="group-hover:rotate-12 transition-transform duration-200" size={20} />
          <span>Reports</span>
        </a>
      </nav>
    </div>
  </div>
);

export default Sidebar;