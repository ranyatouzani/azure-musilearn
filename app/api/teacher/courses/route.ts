import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// 📌 Récupérer tous les cours avec les infos du professeur
export async function GET() {
  console.log("✅ GET /api/teacher/courses appelé !");
  
  try {
    const courses = await prisma.course.findMany({
      include: { teacher: true }, // Inclut les infos du prof associé
    });

    console.log("📌 Cours récupérés :", courses);
    return NextResponse.json(courses);
  } catch (error: unknown) {
    console.error("🚨 Erreur lors de la récupération des cours :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 📌 Création d'un cours
export async function POST(req: Request) {
  console.log("📌 Requête POST reçue sur /api/teacher/courses");

  try {
    const body = await req.json();
    console.log("📩 Données reçues :", body);

    if (!body.teacherId) {
      console.error("🚨 Erreur : ID du professeur manquant !");
      return NextResponse.json({ error: "ID du professeur requis" }, { status: 400 });
    }

    // Vérifier si le professeur existe
    const teacherExists = await prisma.user.findUnique({
      where: { id: body.teacherId, role: "teacher" },
    });

    if (!teacherExists) {
      console.error("🚨 Professeur non trouvé !");
      return NextResponse.json({ error: "Professeur introuvable" }, { status: 404 });
    }

    // 🔥 Création du cours
    const newCourse = await prisma.course.create({
      data: {
        title: body.title,
        description: body.description,
        instrument: body.instrument,
        level: body.level,
        schedule: body.schedule,
        capacity: body.capacity,
        teacherId: body.teacherId,
      },
    });

    console.log("✅ Cours créé avec succès :", newCourse);
    return NextResponse.json(newCourse, { status: 201 });
  } catch (error: unknown) {
    console.error("🚨 Erreur lors de la création du cours :", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: "Erreur Prisma", details: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
