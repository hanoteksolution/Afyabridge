import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { withDbRetry } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";
import type { Permission } from "@/lib/constants";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          return await withDbRetry(async (prisma) => {
            const user = await prisma.user.findUnique({
              where: { email: (credentials.email as string).trim().toLowerCase() },
              include: { role: true },
            });

            if (!user || !user.isActive) return null;

            const isValid = await bcrypt.compare(
              credentials.password as string,
              user.password
            );
            if (!isValid) return null;

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              role: user.role.name,
              roleSlug: user.role.slug,
              permissions: user.role.permissions as Permission[],
            };
          });
        } catch (error) {
          console.error("[auth] authorize failed:", error);
          return null;
        }
      },
    }),
  ],
});

export function hasPermission(
  permissions: Permission[] | undefined,
  required: Permission
): boolean {
  if (!permissions) return false;
  return (
    permissions.includes(required) ||
    (permissions.includes("dashboard:read" as Permission) &&
      required.endsWith(":read"))
  );
}

export function isAdmin(roleSlug?: string): boolean {
  return roleSlug === "super-admin" || roleSlug === "admin";
}
