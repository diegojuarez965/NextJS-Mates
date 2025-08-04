import Pagination from '@/app/ui/pagination';
import Search from '@/app/ui/search';
import { CreateMate } from '@/app/ui/buttons';
import { satisfy } from '@/app/ui/fonts';
import { MatesTableAdminSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchAdminCountPages } from '@/app/lib/data';
import { Metadata } from 'next';
import AdminTable from '@/app/ui/admin/adminTable';
import Filter from '@/app/ui/admin/filter';
import { AdminFilter } from '@/app/lib/definitions';

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
        vendidosMin?: string;
        vendidosMax?: string;
        estado?: string;
        page?: string;
    }>;
}) {
    // Obtiene filtros desde query params (o valores por defecto
    const searchParams = await props.searchParams;
    const nombre = searchParams?.nombre || '';
    const material = searchParams?.material || '';
    const color = searchParams?.color || '';
    const precioMin = searchParams?.precioMin || '';
    const precioMax = searchParams?.precioMax || '';
    const vendidosMin = searchParams?.vendidosMin || '';
    const vendidosMax = searchParams?.vendidosMax || '';
    const estado = searchParams?.estado || '';

    const filtros: AdminFilter = { nombre, material, color, precioMin, precioMax, estado, vendidosMin, vendidosMax };
    const currentPage = Number(searchParams?.page) || 1;
    let totalPages = 1;
    try {
        // Consulta total páginas según filtros
        totalPages = await fetchAdminCountPages(filtros).then((res) => res.totalPages);
    } catch (error) {
        console.error(error);
    }

    return (

        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${satisfy.className} text-2xl mt-6 ml-4`}>Mates</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Buscar mates..." />
                <CreateMate />
            </div>
            <div className='mt-3'>
                <Filter />
            </div>
            {<Suspense fallback={<MatesTableAdminSkeleton />}>
                <AdminTable filtros={filtros} currentPage={currentPage} />
            </Suspense>}
            <div className="mt-5 flex w-full justify-center">
                {<Pagination totalPages={totalPages} />}
            </div>
        </div>
    );
}