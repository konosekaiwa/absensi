/*
  Warnings:

  - You are about to drop the column `checkIn` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `checkOut` on the `Attendance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[date]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "checkIn",
DROP COLUMN "checkOut",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_date_key" ON "Attendance"("date");
