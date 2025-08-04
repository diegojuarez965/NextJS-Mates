'use client';

import { CheckCircle } from 'lucide-react';
import { useEffect } from 'react';
import { clearCarrito } from "@/app/lib/carrito-actions";
import { useCarrito } from "@/app/ui/cliente/carritoProvider";

export default function Exito() {
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
    <div className="w-full h-[100vh] flex flex-col justify-center items-center bg-greenMateTransparent">
      <CheckCircle size={64} className="text-green-600" />
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">¡Pago aprobado!</h1>
      <p className="text-gray-600 mb-6">Tu compra fue procesada correctamente.</p>
    </div>
  );
}
