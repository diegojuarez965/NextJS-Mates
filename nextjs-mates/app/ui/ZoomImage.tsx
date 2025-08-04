'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Props {
  src: string;
  alt: string;
  className?: string;
}

export default function ZoomImage({ src, alt, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    // Cierra la imagen al presionar la tecla Esc
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open]);

  return (
    <>
      {/* Miniatura */}
      <div
        className={`relative overflow-hidden cursor-pointer rounded-full md:rounded-none ${className}`}
        onClick={() => setOpen(true)}
      >
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>

      {/* Modal con imagen ampliada uniforme */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-[90vw] max-w-[500px] aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-greenMateNeon text-3xl font-bold z-50"
              onClick={() => setOpen(false)}
              aria-label="Cerrar imagen ampliada"
            >
              &times;
            </button>

            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
