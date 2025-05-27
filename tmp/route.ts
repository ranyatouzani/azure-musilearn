import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

const prisma = new PrismaClient();


export const authOptions: NextAuthOptions = {

  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "test@example.com" },
        password: { label: "Password", type: "password", placeholder: "••••••" },
      },
      async authorize(credentials) {
        try {
          console.log("📌 Tentative de connexion avec :", credentials?.email);

          if (!credentials?.email || !credentials?.password) {
            console.log("❌ Email ou mot de passe manquant !");
            throw new Error("Veuillez entrer un email et un mot de passe.");
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            console.log("❌ Utilisateur non trouvé !");
            throw new Error("Utilisateur non trouvé.");
          }

          console.log("✅ Utilisateur trouvé :", user.email);

          const passwordMatch = await bcrypt.compare(credentials.password, user.password);

          if (!passwordMatch) {
            console.log("❌ Mot de passe incorrect !");
            throw new Error("Mot de passe incorrect.");
          }

          console.log("✅ Connexion réussie !");
          return user;
        } catch (error) {
          console.error("Erreur d'authentification :", error);
          throw new Error("Échec de la connexion.");
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Redirige vers ta page de connexion personnalisée
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string; // Ajout du rôle
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role; // Ajout du rôle dans le token JWT
      }
      return token;
    },
  },
  
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
