'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Listbox } from '@headlessui/react';
import { useState, useEffect } from 'react';


export default function Filter() {
  // Hooks para obtener parámetros URL y navegación
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [estado, setEstado] = useState('disponible');
  // Estado para abrir/cerrar el filtro
  const [openFilter, setOpenFilter] = useState(false)
  // Actualiza el estado del filtro al cargar el componente
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('estado', estado);
    replace(`${pathname}?${params.toString()}`);
    console.log('Estado:', estado);
  }, [estado, searchParams, pathname, replace]);

  // Actualiza la URL con el filtro aplicado, con debounce
  const handleSearch = useDebouncedCallback((param, term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(param, term);
    } else {
      params.delete(param);
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);
  return (
    <div className="flex flex-col items-center rounded-lg">
      <button
        onClick={() => setOpenFilter(!openFilter)}
        className="bg-greenMate text-white py-2 px-4 rounded-lg hover:opacity-80"
      >
        {openFilter ? 'Ocultar Filtros' : 'Mostrar Filtros'}
      </button>
      <div
        className={`transition-all duration-700 ease-in-out mt-4 ${openFilter ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="flex flex-col items-center sm:flex-row flex-wrap justify-center gap-3">
          <input
            type="text"
            placeholder="Material"
            onChange={(e) => handleSearch('material', e.target.value)}
            defaultValue={searchParams.get('material')?.toString()}
            className="flex-1 min-w-[75px] border border-greenMate rounded-lg p-2"
          />
          <input
            type="text"
            placeholder="Color"
            onChange={(e) => handleSearch('color', e.target.value)}
            defaultValue={searchParams.get('color')?.toString()}
            className="flex-1 min-w-[75px] border border-greenMate rounded-lg p-2"
          />
          <input
            type="number"
            placeholder="Precio mín"
            onChange={(e) => {
              const number = parseInt(e.target.value, 10);
              if (!isNaN(number) && number >= 0) {
                handleSearch('precioMin', number.toString());
              } else if (e.target.value === '') {
                handleSearch('precioMin', '');
              }
            }}
            defaultValue={searchParams.get('precioMin')?.toString()}
            className="flex-1 min-w-[75px] border border-greenMate rounded-lg p-2"
          />
          <input
            type="number"
            placeholder="Precio máx"
            onChange={(e) => {
              const number = parseInt(e.target.value, 10);
              if (!isNaN(number) && number >= 0) {
                handleSearch('precioMax', number.toString());
              } else if (e.target.value === '') {
                handleSearch('precioMax', '');
              }
            }}
            defaultValue={searchParams.get('precioMax')?.toString()}
            className="flex-1 min-w-[75px] border border-greenMate rounded-lg p-2"
          />

          <input
            type="number"
            placeholder="Vendidos mín"
            onChange={(e) => {
              const number = parseInt(e.target.value, 10);
              if (!isNaN(number) && number >= 0) {
                handleSearch('vendidosMin', number.toString());
              } else if (e.target.value === '') {
                handleSearch('vendidosMin', '');
              }
            }}
            defaultValue={searchParams.get('vendidosMin')?.toString()}
            className="flex-1 min-w-[75px] border border-greenMate rounded-lg p-2"
          />

          <input
            type="number"
            placeholder="Vendidos máx"
            onChange={(e) => {
              const number = parseInt(e.target.value, 10);
              if (!isNaN(number) && number >= 0) {
                handleSearch('vendidosMax', number.toString());
              } else if (e.target.value === '') {
                handleSearch('vendidosMax', '');
              }
            }}
            defaultValue={searchParams.get('vendidosMax')?.toString()}
            className="flex-1 min-w-[75px] border border-greenMate rounded-lg p-2"
          />

          {/* Contenedor para label + Listbox */}
          <div className="flex flex-col items-center flex-1 min-w-[75px]">
            <label className="text-sm text-carbon mb-1">Estado</label>
            <Listbox name="estado" value={estado} onChange={setEstado}>
              <div className="relative">
                <Listbox.Button className="w-full bg-greenMateTransparent text-white p-2 rounded capitalize hover:opacity-80">
                  {estado}
                </Listbox.Button>
                <Listbox.Options className="absolute w-full bg-white rounded shadow-md mt-1">
                  <Listbox.Option
                    value="disponible"
                    className={({ active }) =>
                      `cursor-pointer px-2 py-2 ${active ? 'bg-greenMateTransparent text-white' : 'text-black'}`
                    }
                  >
                    Disponible
                  </Listbox.Option>
                  <Listbox.Option
                    value="dado de baja"
                    className={({ active }) =>
                      `cursor-pointer px-2 py-2 ${active ? 'bg-greenMateTransparent text-white' : 'text-black'}`
                    }
                  >
                    Dado de Baja
                  </Listbox.Option>
                </Listbox.Options>
              </div>
            </Listbox>
          </div>
        </div>
      </div>
    </div>
  )
}