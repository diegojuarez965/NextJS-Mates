import ElSureñoUniversitarioLogo from '@/app/ui/ElSureñoUniversitarioLogo';
import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center h-screen md:h-screen">
      <div className="mx-auto flex w-full max-w-[500px] flex-col space-y-2.5 p-4 md:-mt-16">
        <div className="h-50 w-full items-end rounded-lg bg-greenMate p-1 md:h-75">
          <div className="w-32 md:w-36">
            <ElSureñoUniversitarioLogo />
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
        <div className="text-center">
          <Link href="/reset-password" className="text-sm text-greenMate underline hover:opacity-80">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </main>
  );
}