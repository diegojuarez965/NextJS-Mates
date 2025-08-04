import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { auth } from './auth';
import { NextRequest, NextResponse } from 'next/server';

// Middleware de autenticación de NextAuth
export default NextAuth(authConfig).auth;

export async function middleware(req: NextRequest) {
  const session = await auth();
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;

  // Rutas protegidas según rol
  const isOnAdmin = pathname.startsWith("/elsurenouniversitario/admin");
  const isOnClient = pathname.startsWith("/elsurenouniversitario/clientes");
  const isOnCarrito = pathname.startsWith("/elsurenouniversitario/clientes/carrito");
  const isOnLoginSuccess = pathname === "/login-success";

  const requiresAuth = isOnAdmin || isOnCarrito || isOnLoginSuccess;

  // Redirección a login si no hay sesión en rutas protegidas
  if (!session && requiresAuth) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (!session) return NextResponse.next(); // acceso libre al resto

  const role = session.user.rol;

  // Redirección post-login según rol
  if (isOnLoginSuccess) {
    url.pathname =
      role === "admin"
        ? "/elsurenouniversitario/admin"
        : "/elsurenouniversitario/clientes";
    return NextResponse.redirect(url);
  }

  // Acceso restringido según rol
  if (isOnAdmin && role !== "admin") {
    url.pathname = "/elsurenouniversitario/clientes";
    return NextResponse.redirect(url);
  }

  if (isOnClient && role === "admin") {
    url.pathname = "/elsurenouniversitario/admin";
    return NextResponse.redirect(url);
  }

  if (isOnCarrito && role !== "user") {
    url.pathname = role === "admin"
      ? "/elsurenouniversitario/admin"
      : "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Matcher para definir qué rutas pasan por el middleware
export const config = {
  matcher: [
    "/login-success",
    "/elsurenouniversitario/(admin|clientes|clientes/carrito)(/:path*)?",
    "/((?!api/|_next/static|_next/image|favicon\\.ico|manifest\\.json|sw\\.js|firebase-messaging-sw\\.js|icons/|.*\\.png$).*)",
  ],
};
