import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma'; // Pastikan jalur ke prisma sudah benar

// Fungsi untuk mengonversi string ke format tanggal ISO
function convertToISODate(date: string): string | null {
  const parsedDate = new Date(date);
  return isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
}

// Mendapatkan data siswa berdasarkan userId
export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params; // Menunggu resolusi params

    // Validasi userId sebagai angka
    const id = parseInt(userId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'User ID tidak valid' }, { status: 400 });
    }

    // Mengambil data siswa berdasarkan userId
    const siswa = await prisma.user.findUnique({
      where: { id },
    });

    if (!siswa) {
      return NextResponse.json({ error: 'Siswa tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(siswa); // Mengembalikan data siswa jika ditemukan
  } catch (error) {
    console.error('Error GET siswa:', error);
    return NextResponse.json({ error: 'Gagal mengambil data siswa' }, { status: 500 });
  }
}

// Memperbarui data siswa berdasarkan userId
export async function PUT(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params; // Menunggu resolusi params

    // Validasi userId sebagai angka
    const id = parseInt(userId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'User ID tidak valid' }, { status: 400 });
    }

    // Parse data dari body request
    const data = await req.json();
    const { username, password, role, dateOfBirth, tanggalMasuk, tanggalKeluar, sekolah, jurusan } = data;

    // Validasi dan konversi tanggal
    const validDateOfBirth = convertToISODate(dateOfBirth);
    const validTanggalMasuk = convertToISODate(tanggalMasuk);
    const validTanggalKeluar = tanggalKeluar ? convertToISODate(tanggalKeluar) : null;

    if (!validDateOfBirth || !validTanggalMasuk) {
      return NextResponse.json({ error: 'Tanggal tidak valid' }, { status: 400 });
    }

    // Perbarui data siswa di database
    const updatedSiswa = await prisma.user.update({
      where: { id },
      data: {
        username,
        password, // Pastikan password baru atau data lainnya juga diperbarui
        role,
        dateOfBirth: validDateOfBirth,
        tanggalMasuk: validTanggalMasuk,
        tanggalKeluar: validTanggalKeluar,
        sekolah,
        jurusan,
      },
    });

    return NextResponse.json(updatedSiswa); // Mengembalikan data siswa yang sudah diperbarui
  } catch (error) {
    console.error('Error PUT siswa:', error);
    return NextResponse.json({ error: 'Gagal memperbarui data siswa' }, { status: 500 });
  }
}

// Menghapus data siswa berdasarkan userId
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params; // Menunggu resolusi params

    // Validasi userId sebagai angka
    const id = parseInt(userId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'User ID tidak valid' }, { status: 400 });
    }

    // Hapus data siswa berdasarkan userId
    const deletedSiswa = await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(deletedSiswa); // Mengembalikan data siswa yang telah dihapus
  } catch (error) {
    console.error('Error DELETE siswa:', error);
    return NextResponse.json({ error: 'Gagal menghapus data siswa' }, { status: 500 });
  }
}
