import Form from '@/app/ui/admin/create-form';
import Breadcrumbs from '@/app/ui/admin/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear Mate',
};
 
export default async function Page() {
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Mates', href: '/elsurenouniversitario/admin/mates' },
          {
            label: 'Crear Mate',
            href: '/elsurenouniversitario/admin/mates/create',
            active: true,
          },
        ]}
      />
      <Form/>
    </main>
  );
}