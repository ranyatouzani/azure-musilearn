import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// 📌 Récupérer toutes les inscriptions
export async function GET() {
  console.log("✅ Route GET /api/enrollments appelée !");
  
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        student: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } }
      }
    });

    console.log("📜 Inscriptions récupérées :", enrollments);
    return NextResponse.json(enrollments);
  } catch (error) {
    console.error("🚨 Erreur lors de la récupération des inscriptions :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 📌 Inscription à un cours
export async function POST(req: Request) {
  console.log("📌 Requête POST reçue sur /api/enrollments");

  try {
    const body = await req.json();
    console.log("📩 Données reçues :", body);

    if (!body.studentId || !body.courseId) {
      console.error("🚨 Erreur : ID étudiant ou ID cours manquant !");
      return NextResponse.json({ error: "ID étudiant et ID cours requis" }, { status: 400 });
    }

    // Vérifier si l'étudiant existe
    const studentExists = await prisma.user.findUnique({
      where: { id: body.studentId }
    });

    if (!studentExists) {
      return NextResponse.json({ error: "Étudiant non trouvé" }, { status: 404 });
    }

    // Vérifier si le cours existe
    const courseExists = await prisma.course.findUnique({
      where: { id: body.courseId }
    });

    if (!courseExists) {
      return NextResponse.json({ error: "Cours non trouvé" }, { status: 404 });
    }

    // Vérifier si l'étudiant est déjà inscrit
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: body.studentId,
          courseId: body.courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: "L'étudiant est déjà inscrit à ce cours" }, { status: 400 });
    }

    // 🔥 Création de l'inscription
    const newEnrollment = await prisma.enrollment.create({
      data: {
        studentId: body.studentId,
        courseId: body.courseId,
        status: "En cours",
      },
    });

    console.log("✅ Inscription réussie :", newEnrollment);
    return NextResponse.json(newEnrollment, { status: 201 });
  } catch (error: unknown) {
    console.error("🚨 Erreur lors de l'inscription :", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: "Erreur Prisma", details: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 📌 Désinscription d'un étudiant d'un cours
export async function DELETE(req: Request) {
  console.log("📌 Requête DELETE reçue sur /api/enrollments");

  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const courseId = searchParams.get("courseId");

    if (!studentId || !courseId) {
      console.error("🚨 Erreur : ID étudiant ou ID cours manquant !");
      return NextResponse.json({ error: "ID étudiant et ID cours requis" }, { status: 400 });
    }

    // Vérifier si l'inscription existe
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });

    if (!existingEnrollment) {
      return NextResponse.json({ error: "Inscription non trouvée" }, { status: 404 });
    }

    // 🔥 Suppression de l'inscription
    await prisma.enrollment.delete({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });

    console.log("✅ Désinscription réussie !");
    return NextResponse.json({ message: "Désinscription réussie" }, { status: 200 });
  } catch (error) {
    console.error("🚨 Erreur lors de la désinscription :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
