import type { NextAuthConfig } from "next-auth";
import type { Permission } from "@/lib/constants";

declare module "next-auth" {
  interface User {
    role?: string;
    roleSlug?: string;
    permissions?: Permission[];
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role?: string;
      roleSlug?: string;
      permissions?: Permission[];
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: string;
    roleSlug?: string;
    permissions?: Permission[];
  }
}

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { nextUrl } = request;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isLoginPage = nextUrl.pathname === "/admin/login";
      const isLoggedIn = !!auth?.user;

      if (isAdminRoute && !isLoginPage && !isLoggedIn) {
        return false;
      }

      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL("/admin/dashboard", nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.roleSlug = user.roleSlug;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.roleSlug = token.roleSlug as string;
        session.user.permissions = token.permissions as Permission[];
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
