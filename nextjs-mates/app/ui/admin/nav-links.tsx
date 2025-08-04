'use client';

import {
  HomeIcon,
  ShoppingBagIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { name: 'Inicio', href: '/elsurenouniversitario/admin', icon: HomeIcon },
  {
    name: 'Mates',
    href: '/elsurenouniversitario/admin/mates',
    icon: ShoppingBagIcon,
  },
  {
    name: 'Ventas',
    href: '/elsurenouniversitario/admin/ventas',
    icon: BanknotesIcon,
  }
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <div className='flex flex-row gap-2 grow md:flex-col'>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-greenMateTransparent hover:text-greenMateNeon md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-greenMateTransparent text-greenMateNeon': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
