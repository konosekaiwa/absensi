import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { startOfMonth, endOfMonth } from "date-fns";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  // Validasi parameter
  if (!userId || !year || !month || isNaN(parseInt(userId)) || isNaN(parseInt(year)) || isNaN(parseInt(month)) || parseInt(month) < 1 || parseInt(month) > 12) {
    return NextResponse.json({ error: "Parameter tidak valid atau hilang" }, { status: 400 });
  }

  try {
    const selectedDate = new Date(parseInt(year), parseInt(month) - 1); // Bulan dimulai dari 0
    const startDate = startOfMonth(selectedDate);
    const endDate = endOfMonth(selectedDate);

    // Query untuk mendapatkan data user dan laporan
    const userReports = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
      select: {
        id: true,
        username: true,
        role: true,
        sekolah: true,
        jurusan: true,
        attendance: {
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            date: true,
            status: true,
          },
        },
        activities: {
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            date: true,
            description: true,
            status: true,
            task: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    // Jika user tidak ditemukan
    if (!userReports) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    console.log("User Reports:", userReports); // Tambahkan ini untuk melihat laporan user

    // Periksa apakah activities ada dan valid
    console.log("Activities Data:", userReports.activities);  // Cek data activities di backend

    const formattedData = {
      userId: userReports.id,
      username: userReports.username,
      role: userReports.role,
      sekolah: userReports.sekolah,
      jurusan: userReports.jurusan,
      attendance: userReports.attendance.map(attendance => ({
        date: attendance.date.toISOString().split('T')[0],
        status: attendance.status.toUpperCase() || "TIDAK ADA STATUS",
      })),
      activities: userReports.activities.map((activity) => ({
        date: activity.date.toISOString().split('T')[0],
        description: activity.description || "Tidak Ada Deskripsi",
        status: activity.status.toUpperCase() || "TIDAK ADA STATUS",
        taskTitle: activity.task?.title || "Tidak Ada Tugas",
      })),
    };

    console.log("Formatted Data:", formattedData);  // Cek hasil data yang diformat

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data laporan:", error);
    return NextResponse.json({ error: "Gagal mengambil data laporan." }, { status: 500 });
  }
}
