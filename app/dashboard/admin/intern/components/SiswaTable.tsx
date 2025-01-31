"use client";

import React, { useEffect, useState, useMemo } from "react";

interface Siswa {
  id: number;
  username: string;
  sekolah: string;
  jurusan: string;
  dateOfBirth: string;
  tanggalMasuk: string;
  tanggalKeluar: string | null;
}

interface SiswaTableProps {
  onEdit: (userId: number) => void;
  siswaList: any[];
}

const SiswaTable: React.FC<SiswaTableProps> = ({ onEdit }) => {
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // State untuk pencarian
  const [showModal, setShowModal] = useState(false);
  const [siswaToDelete, setSiswaToDelete] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<string>("username"); // Default sort by username

  useEffect(() => {
    const fetchSiswa = async () => {
      const response = await fetch("/api/siswa");
      const data = await response.json();
      setSiswa(data.siswa || []);
    };
    fetchSiswa();
  }, []);

  const handleDelete = async () => {
    if (siswaToDelete === null) return;

    const isConfirmed = window.confirm("Apakah Anda yakin ingin menghapus siswa ini?");
    if (!isConfirmed) return;

    try {
      const response = await fetch(`/api/siswa/${siswaToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSiswa(siswa.filter((item) => item.id !== siswaToDelete));
        alert('Siswa berhasil dihapus');
        setShowModal(false);
      } else {
        const errorData = await response.json();
        alert(`Gagal menghapus siswa: ${errorData.error || 'Terjadi kesalahan'}`);
      }
    } catch (error) {
      console.error('Error deleting siswa:', error);
      alert('Terjadi kesalahan saat menghapus siswa');
    }
  };

  // Filter siswa berdasarkan query pencarian
  const filteredSiswa = siswa.filter((item) =>
    item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sekolah.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.jurusan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort siswa based on the selected column (sortBy)
  const sortedSiswa = useMemo(() => {
    return filteredSiswa.sort((a, b) => {
      if (sortBy === "username") {
        return a.username.localeCompare(b.username);
      } else if (sortBy === "sekolah") {
        return a.sekolah.localeCompare(b.sekolah);
      } else if (sortBy === "tanggalMasuk") {
        return new Date(a.tanggalMasuk).getTime() - new Date(b.tanggalMasuk).getTime();
      }
      return 0;
    });
  }, [filteredSiswa, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(sortedSiswa.length / itemsPerPage);

  // Get tasks for current page
  const currentSiswa = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedSiswa.slice(start, end);
  }, [sortedSiswa, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="overflow-x-auto p-6 bg-white rounded-lg shadow-xl">
      {/* Input Pencarian */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari siswa..."
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Sorting Dropdown */}
      <div className="mb-4 flex space-x-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="username">Sort by Nama</option>
          <option value="sekolah">Sort by Sekolah</option>
          <option value="tanggalMasuk">Sort by Tanggal Masuk</option>
        </select>
      </div>

      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-800">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold border-b-2 border-gray-300">Nama</th>
            <th className="px-6 py-4 text-left text-sm font-semibold border-b-2 border-gray-300">Sekolah</th>
            <th className="px-6 py-4 text-left text-sm font-semibold border-b-2 border-gray-300">Jurusan</th>
            <th className="px-6 py-4 text-left text-sm font-semibold border-b-2 border-gray-300">Tanggal Masuk</th>
            <th className="px-6 py-4 text-left text-sm font-semibold border-b-2 border-gray-300">Tanggal Keluar</th>
            <th className="px-6 py-4 text-left text-sm font-semibold border-b-2 border-gray-300">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentSiswa.map((item) => (
            <tr key={item.id} className="text-center hover:bg-gray-50 transition-all">
              <td className="px-6 py-4 border-b border-gray-300">{item.username}</td>
              <td className="px-6 py-4 border-b border-gray-300">{item.sekolah}</td>
              <td className="px-6 py-4 border-b border-gray-300">{item.jurusan}</td>
              <td className="px-6 py-4 border-b border-gray-300">
                {item.tanggalMasuk ? new Date(item.tanggalMasuk).toLocaleDateString() : "-"}
              </td>
              <td className="px-6 py-4 border-b border-gray-300">
                {item.tanggalKeluar ? new Date(item.tanggalKeluar).toLocaleDateString() : "-"}
              </td>
              <td className="px-6 py-4 border-b border-gray-300 space-x-4">
                <button 
                  onClick={() => onEdit(item.id)} 
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all transform hover:scale-105"
                >
                  Edit
                </button>
                <button 
                  onClick={() => { setSiswaToDelete(item.id); setShowModal(true); }} 
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all transform hover:scale-105"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300"
        >
          {"<<"} First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300"
        >
          {"<"} Prev
        </button>
        <span className="py-2 px-4 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300"
        >
          Next {">"}
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300"
        >
          Last {">>"}
        </button>
      </div>

      {/* Modal Konfirmasi */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full transform transition-all scale-110 hover:scale-100">
            <h2 className="text-lg font-medium text-gray-800">Konfirmasi Hapus</h2>
            <p className="text-gray-600 mt-2">Apakah Anda yakin ingin menghapus siswa ini?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-all transform hover:scale-105"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all transform hover:scale-105"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiswaTable;
