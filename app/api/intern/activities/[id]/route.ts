import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function getUserSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    throw new Error("Not authenticated");
  }
  return session;
}

function validateActivityInput(description: string, status: string) {
  if (!description || !status) {
    throw new Error("All fields are required");
  }
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
  try {
    const session = await getUserSession();
    const { description, status } = await req.json();

    validateActivityInput(description, status);

    const { id } = context.params;  // Menunggu params untuk diambil secara asinkron

    const activity = await prisma.activity.update({
      where: { id: parseInt(id), userId: session.user.id },
      data: { description, status },
    });

    return NextResponse.json(activity);
  } catch (error: any) {
    console.error("Error updating activity:", error);
    return NextResponse.json({ error: error.message || "Failed to update activity" }, { status: 500 });
  }
}
