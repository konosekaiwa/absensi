"use client";
import React, { useState, useEffect } from "react";
import SiswaTable from "./components/SiswaTable";
import EditSiswaForm from "./components/EditSiswaForm";
import AdminLayout from "@/app/ui/admin/AdminLayout";

const SiswaPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    sekolah: "",
    jurusan: "",
    dateOfBirth: "",
    tanggalMasuk: "",
    tanggalKeluar: "",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [siswaList, setSiswaList] = useState<any[]>([]);

  // Ambil daftar siswa
  useEffect(() => {
    const fetchSiswaList = async () => {
      try {
        const response = await fetch("/api/siswa");
        const data = await response.json();
        setSiswaList(data);
      } catch (error) {
        console.error("Gagal mengambil daftar siswa:", error);
      }
    };
    fetchSiswaList();
  }, []);

  const handleEditClick = (userId: number) => {
    setSelectedUser(userId);
    setIsEditModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/siswa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan data");
      }

      const data = await response.json();
      console.log(data);

      // Reset form dan tutup modal
      setIsModalOpen(false);
      setFormData({
        username: "",
        password: "",
        sekolah: "",
        jurusan: "",
        dateOfBirth: "",
        tanggalMasuk: "",
        tanggalKeluar: "",
      });
      // Update daftar siswa setelah menambah siswa baru
      setSiswaList((prevList: any[] | null) => {
        if (Array.isArray(prevList)) {
          return [...prevList, data];
        }
        return [data];
      });
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-slate-800 border rounded-lg">
        <h1 className="text-2xl text-slate-100 text-center font-bold mb-4">Daftar Siswa</h1>
        <div className="flex">
          <button
            onClick={() => setIsModalOpen(true)}
            className="ml-auto text-slate-100 bg-green-500 hover:bg-green-400 transition duration-200 ease-in-out py-2 px-4 rounded-md shadow-lg"
          >
            Tambah Siswa
          </button>
        </div>

        <SiswaTable onEdit={handleEditClick} siswaList={siswaList} />

        {/* Modal untuk tambah siswa */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-2xl overflow-hidden">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Tambah Siswa Baru</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Sekolah</label>
                  <input
                    type="text"
                    name="sekolah"
                    value={formData.sekolah}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Jurusan</label>
                  <input
                    type="text"
                    name="jurusan"
                    value={formData.jurusan}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Tanggal Lahir</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Tanggal Masuk</label>
                  <input
                    type="date"
                    name="tanggalMasuk"
                    value={formData.tanggalMasuk}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Tanggal Keluar</label>
                  <input
                    type="date"
                    name="tanggalKeluar"
                    value={formData.tanggalKeluar}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition duration-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-400 transition duration-200"
                  >
                    Tambah Siswa
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal untuk edit siswa */}
        {isEditModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-2xl overflow-hidden">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Edit Siswa</h2>
              <EditSiswaForm userId={selectedUser} />
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-red-500 text-white px-6 py-2 mt-4 rounded-md hover:bg-red-400 transition duration-200"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SiswaPage;
