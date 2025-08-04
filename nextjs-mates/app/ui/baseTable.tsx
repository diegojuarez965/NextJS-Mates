import ZoomImage from './ZoomImage';
import { formatCurrency } from '@/app/lib/utils';
import type { Mate } from '@/app/lib/definitions';
import clsx from 'clsx';


interface Props {
  mates: Mate[];
  renderActions: (mate: Mate) => React.ReactNode;
  vendidos?: (mate: Mate) => React.ReactNode;
  cantidad?: (mate: Mate) => React.ReactNode;
}

export default function BaseTable({ mates, renderActions, vendidos, cantidad }: Props) {
  return (

    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden space-y-4">
            {mates.map(mate => (
              <div key={mate.id} className={clsx('rounded-md bg-white p-4 fade-in', {
                'text-gray-400': mate.estado === 'dado de baja',
              })}>
                <div key={mate.id} className="mb-2 w-full rounded-md bg-white p-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="relative w-[100px] h-[100px] flex-shrink-0">
                          <ZoomImage
                            src={mate.imagen}
                            alt={`Imagen de ${mate.nombre}`}
                            className="relative w-[100px] h-[100px]"
                          />
                        </div>
                        <p className="capitalize">{mate.nombre}</p>
                      </div>
                      <p className="text-sm text-gray-500 capitalize">{mate.material}</p>
                      <p className="text-sm text-gray-500 capitalize">{mate.color}</p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p className="text-xl font-medium">
                        {formatCurrency(mate.precio)}
                      </p>
                      {vendidos && <p>Vendidos: {vendidos(mate)}</p>}
                    </div>
                    <div>
                      {cantidad && `Cantidad: ${cantidad(mate)}`}
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-black">{renderActions(mate)}</div>
              </div>
            ))}
          </div>

          <table className="hidden min-w-full text-gray-900 text-center md:table">
            <thead>
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6 ">Mate</th>
                <th scope="col" className="px-3 py-5 font-medium">Material</th>
                <th scope="col" className="px-3 py-5 font-medium">Color</th>
                <th scope="col" className="px-3 py-5 font-medium">Precio</th>
                {vendidos && (
                  <th scope="col" className="px-3 py-5 font-medium">Vendidos</th>
                )}
                {cantidad && (
                  <th scope="col" className="px-3 py-5 font-medium">Cantidad</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white">
              {mates.map(mate => (
                <tr
                  key={mate.id}
                  className={clsx('border-b text-sm fade-in', {
                    'text-gray-400': mate.estado === 'dado de baja',
                  })}
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-[200px] h-[200px] flex-shrink-0">
                        <ZoomImage
                          src={mate.imagen}
                          alt={`Imagen de ${mate.nombre}`}
                          className="relative w-[200px] h-[200px]"
                        />
                      </div>
                      <p className="capitalize">{mate.nombre}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 capitalize">{mate.material}</td>
                  <td className="whitespace-nowrap px-3 py-3 capitalize">{mate.color}</td>
                  <td className="whitespace-nowrap px-3 py-3">{formatCurrency(mate.precio)}</td>
                  {vendidos && <td className="whitespace-nowrap px-3 py-3 capitalize">{vendidos(mate)}</td>}
                  {cantidad && <td className="whitespace-nowrap px-3 py-3">{cantidad(mate)}</td>}
                  <td className="whitespace-nowrap px-3 py-3 capitalize text-black">{renderActions(mate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
}
