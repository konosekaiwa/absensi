import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/lib/prisma"; // Pastikan prisma diatur di dalam lib/prisma.ts

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Ambil data user dengan role "INTERN" dan pilih id serta name
    const users = await prisma.user.findMany({
      where: { role: "INTERN" },
      select: { id: true, username: true }, // Gunakan name sebagai ganti username
    });
    res.status(200).json(users); // Kirim data user dalam bentuk JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" }); // Kirim error jika terjadi masalah
  }
}
