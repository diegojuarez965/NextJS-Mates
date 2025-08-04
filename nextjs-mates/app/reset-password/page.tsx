"use client";

import { useState } from "react";

export default function ResetPasswordRequestPage() {
  // Estados para email, éxito, error y loading
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Envío del formulario para solicitar restablecimiento de contraseña
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/sendmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    if (res.ok) {
      setSuccess(true); // Mostrar mensaje éxito
    } else {
      const data = await res.json();
      setError(data.error || "Ocurrió un error. Intentá nuevamente.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-xl">
      <h1 className="text-2xl font-bold mb-4 text-center">Recuperar contraseña</h1>
      {success ? (
        <p className="text-greenMate text-center">
          Te enviamos un enlace para restablecer tu contraseña. Revisá tu correo.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-greenMate text-white py-2 rounded hover:opacity-80"
          >
            {loading ? "Enviando..." : "Enviar enlace de recuperación"}
          </button>
        </form>
      )}
    </div>
  );
}
