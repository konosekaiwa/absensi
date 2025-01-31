import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/app/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'INTERN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Ambil aktivitas berdasarkan userId
    const activities = await prisma.activity.findMany({
      where: { userId: session.user.id },
      include: {
        task: true, // Tugas terkait, jika ada
      },
      orderBy: { date: 'asc' },
    });

    // Ambil data kehadiran berdasarkan userId
    const attendances = await prisma.attendance.findMany({
      where: { userId: session.user.id },
    });

    // Gabungkan aktivitas dengan status kehadiran
    const reports = activities.map((activity) => {
      // Cari status kehadiran untuk tanggal yang sama dengan activity.date
      const attendance = attendances.find(
        (att) =>
          new Date(att.date).toLocaleDateString() === new Date(activity.date).toLocaleDateString()
      );

      return {
        id: activity.id,
        date: activity.date,
        activityDescription: activity.description,
        attendanceStatus: attendance?.status === 'PRESENT' ? 'Hadir' : 'Tanpa Keterangan',
      };
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}
