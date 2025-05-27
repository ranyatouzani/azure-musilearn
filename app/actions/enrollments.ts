"use server";
import { PrismaClient } from "@prisma/client";
import type { Enrollment } from "@prisma/client"; // ✅ Ajout du `type` devant `Enrollment`

const prisma = new PrismaClient();

// 📌 Inscrire un étudiant à un cours
export async function enrollStudent(courseId: string, studentId: string): Promise<Enrollment> {
  return prisma.enrollment.create({
    data: {
      studentId,
      courseId,
      status: "pending",
    },
  });
}


// 📌 Modifier le statut d'une inscription
export async function updateEnrollmentStatus(id: string, status: string): Promise<Enrollment> {
  return prisma.enrollment.update({
    where: { id },
    data: { status },
  });
}

// 📌 Annuler une inscription
export async function cancelEnrollment(id: string): Promise<Enrollment> {
  return prisma.enrollment.delete({
    where: { id },
  });
}


// Recupere la liste des enrollments 
export async function getEnrollments(): Promise<Enrollment[]> {
    return prisma.enrollment.findMany();
}