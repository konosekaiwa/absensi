// pages/api/intern/tasks/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma"; // Pastikan kamu memiliki instance Prisma

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "PATCH") {
    // Mengubah status task
    const { status } = req.body;
    try {
      const task = await prisma.task.update({
        where: { id: Number(id) },
        data: { status },
      });
      return res.status(200).json(task);
    } catch (error) {
      return res.status(500).json({ error: "Failed to update task" });
    }
  }

  if (req.method === "DELETE") {
    // Menghapus task
    try {
      await prisma.task.delete({
        where: { id: Number(id) },
      });
      return res.status(200).json({ message: "Task deleted" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete task" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
