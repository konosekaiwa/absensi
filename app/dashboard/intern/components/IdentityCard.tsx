import React from 'react';
import { User, School, GraduationCap, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface IdentityCardProps {
  data: {
    username: string;
    sekolah: string;
    jurusan: string;
    tanggalMasuk: string;
    tanggalKeluar: string;
  };
}

const IdentityCard = ({ data }: IdentityCardProps) => {
  const router = useRouter();

  const handleViewReports = () => {
    router.push('/dashboard/intern/reports');
  };

  return (
    <div className="relative bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-blue-400 mb-6 flex items-center">
        <User className="mr-2" size={40} /> <div className="text-4xl">Intern Identity</div>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-8">
          <p className="flex items-center text-gray-300">
            <User className="mr-2 text-blue-400" size={16} />
            <span className="font-medium">Username:</span>
            <span className="ml-2">{data?.username}</span>
          </p>
          <p className="flex items-center text-gray-300">
            <School className="mr-2 text-blue-400" size={16} />
            <span className="font-medium">School:</span>
            <span className="ml-2">{data?.sekolah}</span>
          </p>
          <p className="flex items-center text-gray-300">
            <GraduationCap className="mr-2 text-blue-400" size={16} />
            <span className="font-medium">Major:</span>
            <span className="ml-2">{data?.jurusan}</span>
          </p>
        </div>
        <div className="space-y-4">
          <p className="flex items-center text-gray-300">
            <Calendar className="mr-2 text-blue-400" size={16} />
            <span className="font-medium">Start Date:</span>
            <span className="ml-2">{new Date(data?.tanggalMasuk).toLocaleDateString()}</span>
          </p>
          <p className="flex items-center text-gray-300">
            <Calendar className="mr-2 text-blue-400" size={16} />
            <span className="font-medium">End Date:</span>
            <span className="ml-2">{new Date(data?.tanggalKeluar).toLocaleDateString()}</span>
          </p>
        </div>
      </div>

      {/* Tombol View Reports */}
      <button
        onClick={handleViewReports}
        className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        View Reports
      </button>
    </div>
  );
};

export default IdentityCard;
