'use client';

import {
  HomeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useCarrito } from "./carritoProvider";

type NavLinksProps = {
  isLogged: boolean;
};

export default function NavLinks({ isLogged }: NavLinksProps) {
  const { cantidadTotal, hasFetchedOnce } = useCarrito();

  const pathname = usePathname();

  const links = [
    { name: 'Inicio', href: '/elsurenouniversitario/clientes', icon: HomeIcon },
    {
      name: 'Mates',
      href: '/elsurenouniversitario/clientes/mates',
      icon: ShoppingBagIcon,
    },
    ...(isLogged
      ? [
        {
          name: 'Carrito de compras',
          href: '/elsurenouniversitario/clientes/carrito',
          icon: ShoppingCartIcon,
        },
      ]
      : []),
  ];

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
            {link.name === "Carrito de compras" && hasFetchedOnce && (
              <span
                key={cantidadTotal}
                className="bg-greenMateNeon text-white rounded-full px-2 ml-3 text-xs transition-all duration-300"
              >
                {cantidadTotal}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
