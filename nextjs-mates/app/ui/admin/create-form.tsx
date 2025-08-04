'use client';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createMate, MateState } from '@/app/lib/actions';
import { useEffect, useState, useActionState } from 'react';
import { cloudinaryWidgetConfig } from '@/app/lib/cloudinary-config';
import { Listbox } from '@headlessui/react';
import Image from 'next/image';

export default function Form() {
  const initialState: MateState = { message: null, errors: {} };
  // Manejo de estado del formulario mediante acción del servidor
  const [state, formAction] = useActionState(createMate, initialState);
  const [urlImage, setUrlImage] = useState('/mates/mateTest.png');
  const [selected, setSelected] = useState("disponible");
  // Carga el script de Cloudinary solo si no está ya cargado
  /* eslint-disable @typescript-eslint/no-explicit-any */
  useEffect(() => {
    if (!(window as any).cloudinary && typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Abre el widget de Cloudinary para subir imágenes
  const openWidget = () => {
    const widget = (window as any).cloudinary.createUploadWidget(
      cloudinaryWidgetConfig,
      (error: any, result: any) => {
        if (!error && result.event === 'success') {
          setUrlImage(result.info.secure_url);
        }
      }
    );

    widget.open();
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */
  return (
    <form action={formAction}>
      < div className="space-y-6 rounded-xl bg-gray-50 p-6 shadow-md" >

        <div className="space-y-2">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            placeholder="Ingrese el nombre"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder:text-gray-400 focus:border-greenMate focus:outline-none focus:ring-1 focus:ring-greenMate"
            aria-describedby="nombre-error"
          />
          <div id="nombre-error" aria-live="polite" aria-atomic="true">
            {state.errors?.nombre &&
              state.errors.nombre.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="material" className="block text-sm font-medium text-gray-700">Material</label>
          <input
            id="material"
            type="text"
            name="material"
            placeholder="Ingrese el material"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder:text-gray-400 focus:border-greenMate focus:outline-none focus:ring-1 focus:ring-greenMate"
            aria-describedby="material-error"
          />
          <div id="material-error" aria-live="polite" aria-atomic="true">
            {state.errors?.material &&
              state.errors.material.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
          <input
            id="color"
            type="text"
            name="color"
            placeholder="Ingrese el color"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder:text-gray-400 focus:border-greenMate focus:outline-none focus:ring-1 focus:ring-greenMate"
            aria-describedby="color-error"
          />
          <div id="color-error" aria-live="polite" aria-atomic="true">
            {state.errors?.color &&
              state.errors.color.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="precio" className="block text-sm font-medium text-gray-700">Precio</label>
          <input
            id="precio"
            type="number"
            step="any"
            name="precio"
            placeholder="Ingrese el precio"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder:text-gray-400 focus:border-greenMate focus:outline-none focus:ring-1 focus:ring-greenMate"
            aria-describedby="precio-error"
          />
          <div id="precio-error" aria-live="polite" aria-atomic="true">
            {state.errors?.precio &&
              state.errors.precio.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className="w-64 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <Listbox name="estado" value={selected} onChange={setSelected}>
            <Listbox.Button className="bg-greenMateTransparent text-white p-2 rounded w-full capitalize hover:opacity-80" aria-describedby='estado-error'>
              {selected}
            </Listbox.Button>
            <Listbox.Options className="bg-white rounded shadow-md mt-1">
              <Listbox.Option
                value="disponible"
                className={({ active }) =>
                  `cursor-pointer px-4 py-2 ${active ? 'bg-greenMateTransparent text-white' : 'text-black'
                  }`
                }
              >
                Disponible
              </Listbox.Option>
              <Listbox.Option
                value="dado de baja"
                className={({ active }) =>
                  `cursor-pointer px-4 py-2 ${active ? 'bg-greenMateTransparent text-white' : 'text-black'
                  }`
                }
              >
                Dado de Baja
              </Listbox.Option>
            </Listbox.Options>
          </Listbox>
          <div id="estado-error" aria-live="polite" aria-atomic="true">
            {state.errors?.estado &&
              state.errors.estado.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>


        <div className="space-y-2">
          <label htmlFor="imagen" className="block text-sm font-medium text-gray-700">Imágen</label>
          <input
            id="imagen"
            type="hidden"
            name="imagen"
            value={urlImage}
          />
          {urlImage && (
            <Image
              src={urlImage}
              alt="Imágen seleccionada"
              width={128}
              height={128}
              className="w-32 h-32 object-cover rounded-md mb-2"
            />
          )}
          <button
            type="button"
            onClick={openWidget}
            className="inline-block rounded bg-greenMate px-4 py-2 text-white text-sm hover:bg-green-700 transition-colors"
          >
            Subir Imágen
          </button>

          <div id="imagen-error" aria-live="polite" aria-atomic="true">
            {state.errors?.imagen &&
              state.errors.imagen.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Link
            href="/elsurenouniversitario/admin/mates"
            className="flex items-center rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </Link>
          <Button type="submit">Crear Mate</Button>
        </div>

      </div >
    </form >

  );
}
