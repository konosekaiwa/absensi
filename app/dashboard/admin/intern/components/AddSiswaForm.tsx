"use client";

import React, { useState } from "react";

const AddSiswaForm = () => {
  const [formData, setFormData] = useState({
    nama: "",
    sekolah: "",
    jurusan: "",
    tanggalMasuk: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/siswa", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });
    alert("Siswa berhasil ditambahkan!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Nama</label>
        <input
          type="text"
          name="nama"
          value={formData.nama}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Sekolah</label>
        <input
          type="text"
          name="sekolah"
          value={formData.sekolah}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Jurusan</label>
        <input
          type="text"
          name="jurusan"
          value={formData.jurusan}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Tanggal Masuk</label>
        <input
          type="date"
          name="tanggalMasuk"
          value={formData.tanggalMasuk}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Tambahkan Siswa
      </button>
    </form>
  );
};

export default AddSiswaForm;
