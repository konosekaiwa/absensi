import prisma from "../../lib/prisma"; // Pastikan path benar
import { NextRequest, NextResponse } from "next/server";

// Fungsi GET untuk mengambil data siswa
export async function GET() {
  try {
    const siswa = await prisma.user.findMany({
      where: { role: "INTERN" },
      select: {
        id: true,
        username: true,
        sekolah: true,
        jurusan: true,
        dateOfBirth: true,
        tanggalMasuk: true,
        tanggalKeluar: true,
      },
    }) || []; // Fallback ke array kosong jika query gagal

    const count = siswa.length; // Hitung total siswa

    // Mengembalikan response dengan data siswa dan total siswa
    return NextResponse.json({
      count,
      siswa, // Data siswa
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data siswa" },
      { status: 500 }
    );
  }
}

// Fungsi POST untuk menambah siswa baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validasi input
    const requiredFields = [
      "username",
      "password",
      "sekolah",
      "jurusan",
      "dateOfBirth",
      "tanggalMasuk",
      "tanggalKeluar",
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Field ${field} is required` },
          { status: 400 }
        );
      }
    }

    const { username, password, sekolah, jurusan, dateOfBirth, tanggalMasuk, tanggalKeluar } = body;

    // Menambahkan siswa baru ke database
    const newUser = await prisma.user.create({
      data: {
        username,
        password,
        sekolah,
        jurusan,
        dateOfBirth: new Date(dateOfBirth), // Konversi tanggal lahir ke objek Date
        tanggalMasuk: new Date(tanggalMasuk), // Konversi tanggal masuk ke objek Date
        tanggalKeluar: new Date(tanggalKeluar), // Konversi tanggal keluar ke objek Date
        role: "INTERN", // Role untuk siswa magang
      },
    });

    // Mengembalikan response dengan data user yang baru dibuat
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error adding student:", error);
    return NextResponse.json({ error: "Gagal menambah siswa" }, { status: 500 });
  }
}

// Fungsi PUT untuk memperbarui data siswa
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();

  // Validasi input
  const requiredFields = [
    "username",
    "password",
    "sekolah",
    "jurusan",
    "dateOfBirth",
    "tanggalMasuk",
    "tanggalKeluar",
  ];

  for (const field of requiredFields) {
    if (!body[field]) {
      return NextResponse.json(
        { error: `Field ${field} is required` },
        { status: 400 }
      );
    }
  }

  try {
    // Memperbarui data siswa berdasarkan id
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) }, // Menggunakan ID siswa yang diterima dari params
      data: {
        username: body.username,
        password: body.password,
        sekolah: body.sekolah,
        jurusan: body.jurusan,
        dateOfBirth: new Date(body.dateOfBirth), // Konversi tanggal lahir ke objek Date
        tanggalMasuk: new Date(body.tanggalMasuk), // Konversi tanggal masuk ke objek Date
        tanggalKeluar: new Date(body.tanggalKeluar), // Konversi tanggal keluar ke objek Date
        role: "INTERN", // Role untuk siswa magang
      },
    });

    // Mengembalikan response dengan data siswa yang diperbarui
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json({ error: "Gagal mengupdate data siswa" }, { status: 500 });
  }
}
