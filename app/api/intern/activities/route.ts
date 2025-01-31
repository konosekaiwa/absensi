import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Helper function to get user session
async function getUserSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    throw new Error("Not authenticated");
  }
  return session;
}

// Helper function to validate request body
function validateActivityInput(description: string, status: string) {
  if (!description || !status) {
    throw new Error("All fields are required");
  }
}

// Helper function to get today's date at midnight
function getTodayDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

// POST: Add or update daily activity report
export async function POST(req: Request) {
  try {
    const session = await getUserSession();
    const { description, status } = await req.json();

    validateActivityInput(description, status);

    const today = getTodayDate();

    const existingActivity = await prisma.activity.findFirst({
      where: { userId: session.user.id, date: today },
    });

    let activity;
    if (existingActivity) {
      activity = await prisma.activity.update({
        where: { id: existingActivity.id },
        data: { description, status },
      });
    } else {
      activity = await prisma.activity.create({
        data: {
          userId: session.user.id,
          description,
          status,
          date: today,
        },
      });
    }

    return NextResponse.json(activity, { status: existingActivity ? 200 : 201 });
  } catch (error: any) {
    console.error("Error managing activity:", error);
    return NextResponse.json({ error: error.message || "Failed to manage activity" }, { status: 500 });
  }
}

// GET: Get user's daily activity report
export async function GET() {
  try {
    const session = await getUserSession();
    const today = getTodayDate();

    const activity = await prisma.activity.findFirst({
      where: { userId: session.user.id, date: today },
    });

    return NextResponse.json(activity || null, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching activity:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch activity" }, { status: 500 });
  }
}

// PATCH: Update activity by ID
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getUserSession();
    const { description, status } = await req.json();

    validateActivityInput(description, status);

    const activity = await prisma.activity.update({
      where: { id: parseInt(params.id), userId: session.user.id },
      data: { description, status },
    });

    return NextResponse.json(activity);
  } catch (error: any) {
    console.error("Error updating activity:", error);
    return NextResponse.json({ error: error.message || "Failed to update activity" }, { status: 500 });
  }
}
