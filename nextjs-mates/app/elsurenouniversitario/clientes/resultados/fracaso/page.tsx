'use client';

import { XCircle } from 'lucide-react';
import { useEffect } from 'react';
import { clearCarrito } from "@/app/lib/carrito-actions";
import { useCarrito } from "@/app/ui/cliente/carritoProvider";

export default function Rechazado() {
  const { refetch } = useCarrito();
  // Al montar, limpia el carrito y luego actualiza datos
  useEffect(() => {
    const clear = async () => {
      await clearCarrito();
      refetch();
    };
    clear();
  }, []);

  return (
    <div className="w-full h-[100vh] flex flex-col justify-center items-center bg-red-100">
      <XCircle size={64} className="text-red-600" />
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Pago rechazado</h1>
      <p className="text-gray-600 mb-6">Hubo un problema con tu pago. Intenta nuevamente.</p>
    </div>
  );
}
