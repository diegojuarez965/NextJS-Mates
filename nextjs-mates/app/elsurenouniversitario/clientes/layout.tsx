import { CarritoProvider } from '@/app/ui/cliente/carritoProvider';
import Footer from '@/app/ui/cliente/Footer';
import Header from '@/app/ui/Header';
import SideNav from '@/app/ui/cliente/sidenav';
import { Metadata } from 'next';
import { ClientWrapper } from '@/app/ui/cliente/client-wrapper';
import { isLoggedIn, getRole } from '@/app/lib/auth-utils';

export const metadata: Metadata = {
  title: {
    template: '%s | Clientes',
    default: 'Clientes',
  },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  // Verifica si el usuario ha iniciado sesión
  const isLogged = await isLoggedIn();
  // Obtiene el rol del usuario actual, el cual puede ser admin o user  
  const role = await getRole() ?? '';

  const content = (
    <div className="flex flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav isLogged={isLogged} />
      </div>
      <ClientWrapper>
        {children}
      </ClientWrapper>
    </div>
  );

  return (
    <div>
      <div className="hidden md:block">
        <Header role={role} />
      </div>

      {isLogged ? (
        <CarritoProvider>{content}</CarritoProvider>
      ) : (
        content
      )}

      <div className="sticky bottom-0 z-10 w-full">
        <Footer />
      </div>
    </div>
  );
}
