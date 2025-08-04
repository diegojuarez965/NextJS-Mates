'use client';

import { registerUser, UserState } from '@/app/lib/actions';
import { useActionState } from 'react';

export default function RegisterForm() {
  const initialState: UserState = { message: '', errors: {} };
  // Manejo de estado del formulario mediante acción del servidor
  const [state, formAction] = useActionState(registerUser, initialState);

  return (
    <form action={formAction} className="max-w-md mx-auto mt-8 space-y-6">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <input
          type="text"
          name="nombre"
          placeholder='John Doe'
          id="nombre"
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
        {state.errors?.nombre && (
          <p className="text-red-500 text-sm">{state.errors.nombre.join(', ')}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Correo electrónico
        </label>
        <input
          type="text"
          name="email"
          placeholder='tucorreo@example.com'
          id="email"
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
        {state.errors?.email && (
          <p className="text-red-500 text-sm">{state.errors.email.join(', ')}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="••••••"
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
        {state.errors?.password && (
          <p className="text-red-500 text-sm">{state.errors.password.join(', ')}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Repetir contraseña
        </label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="••••••"
          id="confirmPassword"
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
        {state.errors?.confirmPassword && (
          <p className="text-red-500 text-sm">{state.errors.confirmPassword.join(', ')}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-greenMate text-white p-2 rounded-md hover:opacity-80"
        >
          Registrarse
        </button>
      </div>

      {state.message && (
        <p className="text-center text-sm text-red-600">{state.message}</p>
      )}
    </form>
  );
}
