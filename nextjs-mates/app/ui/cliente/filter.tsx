'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';


export default function Filter() {
    // Hooks para obtener parámetros URL y navegación
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    // Estado para abrir/cerrar el filtro
    const [openFilter, setOpenFilter] = useState(false)
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
                className="bg-greenMateButton text-white py-2 px-4 rounded-lg hover:opacity-80"
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
                        className="flex-1 min-w-[150px] border border-greenMate rounded-lg p-2"
                    />
                    <input
                        type="text"
                        placeholder="Color"
                        onChange={(e) => handleSearch('color', e.target.value)}
                        defaultValue={searchParams.get('color')?.toString()}
                        className="flex-1 min-w-[150px] border border-greenMate rounded-lg p-2"
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
                        className="flex-1 min-w-[150px] border border-greenMate rounded-lg p-2"
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
                        className="flex-1 min-w-[150px] border border-greenMate rounded-lg p-2"
                    />
                </div>
            </div>
        </div>
    )
}