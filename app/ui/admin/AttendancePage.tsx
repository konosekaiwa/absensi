// app/ui/admin/AttendancePage.tsx
import React from 'react';

interface AttendancePageProps {
  data: any[]; // Data yang diterima, sesuaikan tipe data
}

const AttendancePage: React.FC<AttendancePageProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
      <table className="min-w-full text-sm text-gray-800">
        {/* Header */}
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-4 px-6 text-left font-medium uppercase tracking-wider border-b">ID</th>
            <th className="py-4 px-6 text-left font-medium uppercase tracking-wider border-b">Nama</th>
            <th className="py-4 px-6 text-left font-medium uppercase tracking-wider border-b">Tanggal</th>
            <th className="py-4 px-6 text-left font-medium uppercase tracking-wider border-b">Status</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {/* ID */}
              <td className="py-4 px-6 whitespace-nowrap text-gray-700">{item.id}</td>

              {/* Nama */}
              <td className="py-4 px-6 whitespace-nowrap text-gray-700">
                {item.user ? item.user.username : 'No Name'}
              </td>

              {/* Tanggal */}
              <td className="py-4 px-6 whitespace-nowrap text-gray-700">
                {new Date(item.date).toLocaleDateString()}
              </td>

              {/* Status */}
              <td className="py-4 px-6 whitespace-nowrap">
                <span
                  className={`px-3 py-1 rounded-full text-white ${item.status === 'PRESENT' ? 'bg-green-500' : 'bg-red-500'}`}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendancePage;
