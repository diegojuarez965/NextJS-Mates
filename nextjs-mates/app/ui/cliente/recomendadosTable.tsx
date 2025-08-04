'use client';

import { useEffect, useState } from "react";
import { fetchClientMates } from "../../lib/data";
import { ClientFilter, Mate } from "../../lib/definitions";
import { getRecomendacionClimatica } from "../../lib/weather-utils";
import { AgregarACarrito } from "../buttons";
import BaseTable from "../baseTable";
import { MatesTableClientSkeleton } from "../skeletons";

interface Props {
  claveClima: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export function RecomendadosTable({ claveClima }: Props) {
  const [mates, setMates] = useState<Mate[]>([]);
  const [noMates, setNoMates] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const { color, material } = getRecomendacionClimatica(claveClima);

    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Verificamos si el usuario está logueado
        const res = await fetch(`${baseUrl}/api/isLogged`);
        const data = await res.json();
        setIsLogged(!!data.logged);

        // Buscamos mates recomendados
        const filtros: ClientFilter = { color, material };
        const resMates = await fetchClientMates(filtros, 1);

        if (!resMates || resMates.length === 0) {
          setNoMates(true);
        } else {
          setMates(resMates);
          setNoMates(false);
        }
      } catch (error) {
        console.error(error);
        setNoMates(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [claveClima]);

  if (isLoading) {
    return <MatesTableClientSkeleton />;
  }

  if (noMates) {
    return (
      <div className="text-center text-greenMate mt-6">
        No se encontraron mates recomendados.
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-gray-50 shadow-md p-4 md:p-6 max-w-6xl mx-auto">
      <BaseTable
        mates={mates}
        renderActions={(mate) => (
          <AgregarACarrito id={mate.id} isLogged={isLogged} />
        )}
      />
    </div>
  );
}
