import Link from 'next/link';
import RegisterForm from '@/app/ui/cliente/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registro',
};
export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Crear Cuenta</h2>
      <RegisterForm />

      <div className="mt-6 text-center">
        <Link
          href="/elsurenouniversitario/clientes"
          className="inline-block rounded-md bg-greenMateButton px-4 py-2 text-white font-medium hover:opacity-80"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
