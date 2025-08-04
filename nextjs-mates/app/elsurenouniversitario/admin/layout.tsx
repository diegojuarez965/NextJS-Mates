import SideNav from '@/app/ui/admin/sidenav';
import { Metadata } from 'next';
import { ClientWrapper } from '@/app/ui/admin/client-wrapper';
import Header from '@/app/ui/Header';
import { getRole } from '@/app/lib/auth-utils';

export const metadata: Metadata = {
  title: {
    template: '%s | Administración',
    default: 'Administración',
  },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  // Obtiene el rol del usuario actual, el cual puede ser admin o user  
  const role = await getRole() ?? '';
  return (
    <div>
      <div className="hidden md:block">
        <Header role={role} />
      </div>
      <div className="flex flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          <ClientWrapper>{children}</ClientWrapper>
        </div>
      </div>
    </div>
  );
}