/*
  Warnings:

  - A unique constraint covering the columns `[studentId,courseId]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Enrollment" ALTER COLUMN "status" SET DEFAULT 'pending';

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_studentId_courseId_key" ON "Enrollment"("studentId", "courseId");
