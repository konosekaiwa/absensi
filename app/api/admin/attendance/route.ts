// app/api/attendance/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { Attendance } from '@prisma/client';

// Mengambil semua data attendance
// app/api/attendance/route.ts
export async function GET() {
  try {
    const attendanceData = await prisma.attendance.findMany({
      include: {
        user: true, // Menyertakan relasi user
      },
    });
    return NextResponse.json(attendanceData);
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    return NextResponse.error();
  }
}


// Menambahkan data kehadiran baru
export async function POST(request: Request) {
  const { userId, date, status } = await request.json();

  // Validasi input
  if (!userId || !date || !status) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    const attendance = await prisma.attendance.create({
      data: {
        userId,
        date: new Date(date),
        status,
      },
    });
    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    console.error('Error creating attendance record:', error);
    return NextResponse.json({ error: 'Failed to create attendance record' }, { status: 500 });
  }
}

// Update dan delete bisa ditambahkan sesuai kebutuhan
