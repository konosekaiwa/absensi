// app/api/activities/route.ts
// app/api/activities/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url); // Ambil URL dari request
  const userId = url.searchParams.get('userId'); // Ambil parameter userId dari URL

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const activities = await prisma.activity.findMany({
      where: { userId: parseInt(userId) }, // Pastikan userId adalah integer
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.error();
  }
}

// Menambahkan laporan aktivitas baru
export async function POST(req: Request) {
  const { userId, description, status, date } = await req.json();

  if (!userId || !description || !status || !date) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const activity = await prisma.activity.create({
      data: {
        userId,
        description,
        status,
        date: new Date(date),
      },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Error creating activity record:", error);
    return NextResponse.json({ error: "Failed to create activity record" }, { status: 500 });
  }
}
