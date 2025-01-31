import { useState, useEffect } from "react";

export default function EditSiswaForm({ userId }: { userId: number }) {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        sekolah: "",
        jurusan: "",
        dateOfBirth: "",
        tanggalMasuk: "",
        tanggalKeluar: "",
    });
    const [message, setMessage] = useState("");

    // Ambil data siswa untuk diisi ke form

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/siswa/${userId}`);
                if (!response.ok) {
                    throw new Error("Gagal mengambil data pengguna");
                }
                const data = await response.json();

                // Format dates to yyyy-MM-dd
                const formatDate = (date: string) => {
                    const d = new Date(date);
                    return d.toISOString().split("T")[0]; // Format to "yyyy-MM-dd"
                };

                setFormData({
                    username: data.username,
                    password: data.password,
                    sekolah: data.sekolah,
                    jurusan: data.jurusan,
                    dateOfBirth: formatDate(data.dateOfBirth),
                    tanggalMasuk: formatDate(data.tanggalMasuk),
                    tanggalKeluar: formatDate(data.tanggalKeluar),
                });
            } catch (error) {
                console.error("Gagal mengambil data pengguna:", error);
                setMessage("Gagal mengambil data");
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    // Handle perubahan input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            for (const key in formData) {
                if (!formData[key as keyof typeof formData]) {
                    setMessage("Input wajib diisi");
                    return;
                }
            }

            const response = await fetch(`/api/siswa/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                setMessage("Data berhasil diperbarui");
            } else {
                const err = await response.json();
                setMessage(`Error, ${err.message}`);
            }
        } catch (error) {
            setMessage("Terjadi kesalahan saat memperbarui data");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="border p-2 w-full"
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="border p-2 w-full"
            />
            <input
                type="text"
                name="sekolah"
                placeholder="Sekolah"
                value={formData.sekolah}
                onChange={handleChange}
                className="border p-2 w-full"
            />
            <input
                type="text"
                name="jurusan"
                placeholder="Jurusan"
                value={formData.jurusan}
                onChange={handleChange}
                className="border p-2 w-full"
            />
            <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="border p-2 w-full"
            />
            <input
                type="date"
                name="tanggalMasuk"
                value={formData.tanggalMasuk}
                onChange={handleChange}
                className="border p-2 w-full"
            />
            <input
                type="date"
                name="tanggalKeluar"
                value={formData.tanggalKeluar}
                onChange={handleChange}
                className="border p-2 w-full"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 w-full">
                Update User
            </button>
            {message && <p className="text-red-500">{message}</p>}
        </form>
    );
}
