import Form from '@/app/ui/admin/edit-form';
import Breadcrumbs from '@/app/ui/admin/breadcrumbs';
import { fetchMateById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Editar Mate',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
    // Obtiene el id desde los params
    const params = await props.params;
    const id = params.id;
    let mate;
    try {
        // Busca el mate por id
        mate = await fetchMateById(id);
    } catch {
        // Si falla, redirige a página 404
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Mates', href: '/elsurenouniversitario/admin/mates' },
                    {
                        label: 'Editar Mate',
                        href: `/elsurenouniversitario/admin/mates/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form {...mate} />
        </main>
    );
}