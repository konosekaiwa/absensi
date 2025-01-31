/*
  Warnings:

  - Made the column `dateOfBirth` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "jurusan" TEXT,
ADD COLUMN     "sekolah" TEXT,
ADD COLUMN     "tanggalKeluar" TIMESTAMP(3),
ADD COLUMN     "tanggalMasuk" TIMESTAMP(3),
ALTER COLUMN "dateOfBirth" SET NOT NULL;
