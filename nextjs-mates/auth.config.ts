import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized() {
      return true;
    },
  },
  secret: process.env.AUTH_SECRET, // Add a secret for encryption
  trustHost: true, // Trust the host
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;