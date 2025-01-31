import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;

    const taskId = parseInt(resolvedParams.id);
    const { title, description, deadline, status, assignedTo } = await req.json();

    let assignedUserId = null;

    if (assignedTo) {
      const user = await prisma.user.findUnique({
        where: { username: assignedTo },
      });

      if (user) {
        assignedUserId = user.id;
      } else {
        return NextResponse.json({ error: 'User not found' }, { status: 400 });
      }
    }

    const parsedDeadline = new Date(deadline);
    if (isNaN(parsedDeadline.getTime())) {
      return NextResponse.json({ error: 'Invalid deadline date' }, { status: 400 });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        deadline: parsedDeadline,
        status,
        assignedTo: assignedUserId ? { connect: { id: assignedUserId } } : undefined,
      },
      include: {
        assignedTo: { select: { username: true } },  // Include only the username
      },
    });

    // Ensure the response includes only the relevant fields
    const taskResponse = {
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      deadline: updatedTask.deadline,
      status: updatedTask.status,
      assignedTo: updatedTask.assignedTo?.username || '',  // Only send username or empty string if no user assigned
    };

    return NextResponse.json(taskResponse);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.error();
  }
}
