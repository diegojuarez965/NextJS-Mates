import Pagination from '@/app/ui/pagination';
import Search from '@/app/ui/search';
import { satisfy } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { fetchClientCountPages } from '@/app/lib/data';
import { MatesTableClientSkeleton } from '@/app/ui/skeletons';
import ClienteTable from '@/app/ui/cliente/clienteTable';
import { ClientFilter } from '@/app/lib/definitions';
import Filter from '@/app/ui/cliente/filter';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Mates',
};

export default async function Page(props: {
    searchParams?: Promise<{
        nombre?: string;
        material?: string;
        color?: string;
        precioMin?: string;
        precioMax?: string;
        page?: string;
    }>;
}) {
    // Obtiene filtros desde query params o valores por defecto
    const searchParams = await props.searchParams;
    const nombre = searchParams?.nombre || '';
    const material = searchParams?.material || '';
    const color = searchParams?.color || '';
    const precioMin = searchParams?.precioMin || '';
    const precioMax = searchParams?.precioMax || '';

    const filtros: ClientFilter = { nombre, material, color, precioMin, precioMax };
    const currentPage = Number(searchParams?.page) || 1;

    let totalPages = 1;
    try {
        // Consulta total de páginas para paginación
        totalPages = await fetchClientCountPages(filtros).then((res) => res.totalPages);
    } catch (error) {
        console.error(error);
    }

    return (
        <div className="w-full min-h-screen overflow-y-hidden mt-2 mb-2">
            <div className='ml-6 mr-6'>
                <div className="flex w-full items-center justify-between">
                    <h1 className={`${satisfy.className} text-4xl text-carbon mt-6 ml-4`}>Catálogo</h1>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                    <Search placeholder="Buscar mates..." />
                </div>
                <div className='mt-3'>
                    <Filter />
                </div>
                <Suspense fallback={<MatesTableClientSkeleton />}>
                    <ClienteTable filtros={filtros} currentPage={currentPage} />
                </Suspense>
                <div className="mt-5 flex w-full justify-center">
                    <Pagination totalPages={totalPages} />
                </div>
            </div>
        </div>
    );
}
