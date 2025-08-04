'use client';
import { createContext, useContext, useState, useEffect } from "react";
import { getCarrito } from "@/app/lib/data";
// Contexto para manejar la cantidad total del carrito y recarga de datos
const CarritoContext = createContext<{
  cantidadTotal: number;
  refetch: () => void;
  hasFetchedOnce: boolean;
}>({
  cantidadTotal: 0,
  refetch: () => { },
  hasFetchedOnce: false,
});

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [cantidadTotal, setCantidadTotal] = useState(0);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  // Función para obtener datos del carrito y actualizar estado
  const refetch = async () => {
    try {
      const data = await getCarrito();
      setCantidadTotal(data.carrito?.cantidadTotal || 0);
      setHasFetchedOnce(true);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };
  // Cargar datos del carrito al montar
  useEffect(() => {
    refetch();
  }, []);

  return (
    <CarritoContext.Provider value={{ cantidadTotal, refetch, hasFetchedOnce }}>
      {children}
    </CarritoContext.Provider>
  );
}
// Hook para consumir el contexto del carrito
export const useCarrito = () => useContext(CarritoContext);
