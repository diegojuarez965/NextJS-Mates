import { auth } from '@/auth';

export async function isLoggedIn() {
  const session = await auth();
  return !!session?.user;
}

export async function getRole() {
  const session = await auth();
  return session?.user?.rol;
}

export async function getID() {
  const session = await auth();
  return session?.user?.id;
}