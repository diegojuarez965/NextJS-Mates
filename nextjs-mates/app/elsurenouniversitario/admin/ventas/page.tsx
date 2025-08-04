import ClientesList from "@/app/ui/clientesList";
import { satisfy } from "@/app/ui/fonts";
import { Metadata } from 'next';
import Search from "@/app/ui/search";
import { } from "@/app/lib/data";
import { countPagesOfClientes } from "@/app/lib/data";
import Pagination from "@/app/ui/pagination";

export const metadata: Metadata = {
  title: 'Ventas',
};

export default async function VentasPage(props: {
  searchParams?: Promise<{
    nombre?: string;
    page?: string;
  }>;
}) {
  // Obtiene los parámetros de búsqueda (nombre y página)
  const searchParams = await props.searchParams;
  const nombre = searchParams?.nombre || '';
  const currentPage = Number(searchParams?.page) || 1;
  let totalPages = 1;
  try {
    // Obtiene la cantidad total de páginas según el filtro nombre
    totalPages = await countPagesOfClientes(nombre).then((res) => res.totalPages);
  } catch (error) {
    console.error(error);
  }
  return (
    <div className="p-6">
      <h1 className={`${satisfy.className} text-4xl text-carbon mb-6`}>Lista de clientes</h1>
      <div className="mb-6">
        <Search placeholder="Buscar clientes..." />
      </div>
      <ClientesList nombre={nombre} currentPage={currentPage} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}