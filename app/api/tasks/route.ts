//app/api/tasks/route.ts

import { NextResponse } from "next/server";
import prisma from "../../lib/prisma"; // Pastikan path sudah benar

// Get all tasks
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        assignedTo: true, // Include the assignedTo relationship with the task
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.error();
  }
}

// Function to create a new task
export async function POST(req: Request) {
  try {
    const { title, description, deadline, status, assignedTo } = await req.json();

    console.log("Received data:", { title, description, deadline, status, assignedTo });

    // Validasi input
    if (!title || !description || !deadline || !status || !assignedTo || !assignedTo.username) {
      return new Response(
        JSON.stringify({ error: "All fields must be filled, including assignedTo with a valid username." }),
        { status: 400 }
      );
    }

    // Cari user berdasarkan username
    const user = await prisma.user.findUnique({
      where: { username: assignedTo.username },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found." }), { status: 404 });
    }

    // Validasi deadline
    const parsedDeadline = new Date(deadline);
    if (isNaN(parsedDeadline.getTime())) {
      return new Response(JSON.stringify({ error: "Invalid deadline." }), { status: 400 });
    }

    // Buat task baru
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        deadline: parsedDeadline, // Pastikan deadline valid
        status,
        assignedTo: {
          connect: { id: user.id }, // Hubungkan task dengan user berdasarkan ID
        },
      },
    });

    return new Response(JSON.stringify(newTask), { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "An error occurred while creating the task." }), { status: 500 });
  }
}

// Function to update an existing task
export async function PUT(req: Request) {
  try {
    const { id, title, description, deadline, status, assignedTo } = await req.json();

    // Validasi input
    if (!id || !title || !description || !deadline || !status || !assignedTo || !assignedTo.username) {
      return new Response(JSON.stringify({ error: "All fields must be filled." }), { status: 400 });
    }

    // Cari task yang akan diupdate
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return new Response(JSON.stringify({ error: "Task not found." }), { status: 404 });
    }

    // Cari user berdasarkan username
    const user = await prisma.user.findUnique({
      where: { username: assignedTo.username },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found." }), { status: 404 });
    }

    // Validasi deadline
    const parsedDeadline = new Date(deadline);
    if (isNaN(parsedDeadline.getTime())) {
      return new Response(JSON.stringify({ error: "Invalid deadline." }), { status: 400 });
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        deadline: parsedDeadline,
        status,
        assignedTo: {
          connect: { id: user.id }, // Hubungkan task dengan user berdasarkan ID
        },
      },
    });

    return new Response(JSON.stringify(updatedTask), { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "An error occurred while updating the task." }), { status: 500 });
  }
}

// Function to delete a task
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    // Validasi ID
    if (!id) {
      return new Response(JSON.stringify({ error: "Task ID must be provided." }), { status: 400 });
    }

    // Cari task yang akan dihapus
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return new Response(JSON.stringify({ error: "Task not found." }), { status: 404 });
    }

    // Hapus task
    const deletedTask = await prisma.task.delete({
      where: { id },
    });

    return new Response(JSON.stringify(deletedTask), { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "An error occurred while deleting the task." }), { status: 500 });
  }
}
