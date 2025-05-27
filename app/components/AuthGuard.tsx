"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function AuthGuard({ children, allowedRoles }: { children: ReactNode; allowedRoles: string[] }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Attente du chargement de la session

    if (!session || !allowedRoles.includes(session.user.role)) {
      router.push("/login"); // Redirige si non connecté ou mauvais rôle
    }
  }, [session, status, allowedRoles, router]);

  if (status === "loading") return <p className="text-center mt-10">Chargement...</p>;

  return <>{children}</>;
}
