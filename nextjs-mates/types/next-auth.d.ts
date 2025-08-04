import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      rol: "admin" | "user";
      image?: string | null;
      name?: string | null;
    };
  }

  interface User {
    id: number;
    email: string;
    rol: "admin" | "user";
    password: string;
  }

  interface JWT {
    id: number;
    rol: "admin" | "user";
  }
}