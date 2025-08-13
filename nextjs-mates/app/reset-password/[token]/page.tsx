'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const { token } = useParams(); // Token desde URL
  const router = useRouter();

  // Estados para las contraseñas, loading, error y éxito
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Manejo del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones básicas
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      // Llamada a API para resetear contraseña
      const res = await fetch('/api/resetpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Error al restablecer la contraseña');
      } else {
        setSuccess('Contraseña restablecida correctamente.');
        setTimeout(() => router.push('/login'), 2500); // Redirigir tras éxito
      }
    } catch {
      setError('Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Restablecer contraseña</h1>
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
        <input
          type="password"
          placeholder="Nueva contraseña"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          className="w-full p-2 border rounded"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-greenMateButton">{success}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-greenMateButton text-white px-4 py-2 rounded hover:opacity-80"
        >
          {loading ? 'Restableciendo...' : 'Restablecer'}
        </button>
      </form>
    </div>
  );
}
