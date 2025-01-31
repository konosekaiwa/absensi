import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/')[4];
  
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const { status } = await req.json();
    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: { status },
    });
    
    return NextResponse.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/')[4];
  
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await prisma.task.delete({
      where: { id: Number(id) },
    });
    
    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}