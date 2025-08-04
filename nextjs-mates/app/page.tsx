import ElSureñoUniversitarioLogo from '@/app/ui/ElSureñoUniversitarioLogo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { quicksand } from '@/app/ui/fonts';
import Image from 'next/image';
import { getRole } from './lib/auth-utils';
import { signOut } from '@/auth';

export default async function Page() {

  // Obtiene el rol del usuario actual, el cual puede ser admin o user  
  const rol = await getRole();

  const isAdmin = rol === 'admin';

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-30 shrink-0 items-end rounded-lg bg-greenMate p-4 md:h-52">
        {<ElSureñoUniversitarioLogo />}
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p
            className={`${quicksand.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
          >
            <strong>Bienvenido a Mates El Sureño Univeristario.</strong> En esta página encontrarás tu mate ideal.
          </p>
          <div className='flex'>
            {isAdmin ? (
              <form action={async () => {
                'use server';
                await signOut({ redirectTo: '/elsurenouniversitario/clientes' });
              }}>
                <button className="flex items-center gap-5 self-start rounded-lg bg-greenMate px-6 py-3 text-sm font-medium text-white transition-colors hover:opacity-80 md:text-base">
                  <span>Soy Cliente</span> <ArrowRightIcon className="w-5 md:w-6" />
                </button>
              </form>
            ) : (
              <Link
                href="/elsurenouniversitario/clientes"
                className="flex items-center gap-5 self-start rounded-lg bg-greenMate px-6 py-3 text-sm font-medium text-white transition-colors hover:opacity-80 md:text-base"
              >
                <span>Soy Cliente</span> <ArrowRightIcon className="w-5 md:w-6" />
              </Link>
            )}
          </div>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-greenMate px-6 py-3 text-sm font-medium text-white transition-colors hover:opacity-80 md:text-base"
          >
            <span>Soy Administrador</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image
            src='/wallPaperDesktop.png'
            alt="Wallpaper of the mates"
            width={1024}
            height={1536}
            className='hidden md:block'
          />
          <Image
            src='/wallPaperMobile.png'
            alt="Wallpaper of the mates"
            width={400}
            height={600}
            className='block md:hidden'
          />
        </div>
      </div>
    </main>
  );
}
