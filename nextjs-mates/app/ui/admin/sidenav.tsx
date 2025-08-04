import Link from 'next/link';
import NavLinks from '@/app/ui/admin/nav-links';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';
import Image from 'next/image';
import ElSureñoUniversitarioLogo from '../ElSureñoUniversitarioLogo';


export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-30 items-center justify-center rounded-md bg-greenMate p-4 md:h-40"
        href="/"
      >
        <div className="hidden md:block w-40">
          <Image
            src='/matesLogo.png'
            alt="Mates El Sureño Universitario Logo"
            width={200}
            height={200}
          />
        </div>
        <div className="block w-100 md:hidden">
          <ElSureñoUniversitarioLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form action={async () => {
          'use server';
          await signOut({ redirectTo: '/' });
        }}>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-greenMateTransparent hover:text-greenMateNeon md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Cerrar Sesión</div>
          </button>
        </form>
      </div>
    </div>
  );
}
