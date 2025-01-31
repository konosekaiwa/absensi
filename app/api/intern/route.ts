import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET: Fetch data for the intern dashboard (for the currently logged-in user)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const intern = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        sekolah: true,
        jurusan: true,
        dateOfBirth: true,
        tanggalMasuk: true,
        tanggalKeluar: true,
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
          },
        },
        activities: {
          select: {
            id: true,
            description: true,
            status: true,
            date: true,
          },
        },
      },
    });

    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    return NextResponse.json(intern);
  } catch (error) {
    console.error("Error fetching intern data:", error);
    return NextResponse.json({ error: "Failed to fetch intern data" }, { status: 500 });
  }
}

// POST: Submit a new activity report (for the currently logged-in user)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { description, status } = await req.json();

    if (!description || !status) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newActivity = await prisma.activity.create({
      data: {
        userId: session.user.id, // Use the current user's ID
        description,
        status,
        date: new Date(),
      },
    });

    return NextResponse.json(newActivity, { status: 201 });
  } catch (error) {
    console.error("Error submitting activity report:", error);
    return NextResponse.json({ error: "Failed to submit activity report" }, { status: 500 });
  }
}
