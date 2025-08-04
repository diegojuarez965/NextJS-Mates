import { Card } from './card';
import { Venta, VentaMateCard } from '../lib/definitions';

type Props = {
  ventas: Venta[];
  items: VentaMateCard[];
};

export default function PanelVentas({ ventas, items }: Props) {
  // Agrupa items por id de venta
  const itemsPorVenta = new Map<string, VentaMateCard[]>();
  for (const item of items) {
    const key = String(item.idVenta);
    if (!itemsPorVenta.has(key)) itemsPorVenta.set(key, []);
    itemsPorVenta.get(key)!.push(item);
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {ventas.map((venta) => {
        const itemsVenta = itemsPorVenta.get(String(venta.id)) || [];
        const totalProductos = itemsVenta.reduce((acc, i) => acc + i.cantidad, 0);

        return (
          <Card key={venta.id} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-carbon">
                Venta #{venta.id}
              </h3>
              <span className="text-xs text-center px-2 py-1 rounded-full bg-greenMate text-white font-semibold">
                {totalProductos} producto{totalProductos !== 1 ? 's' : ''}
              </span>
            </div>

            <p className="text-sm text-gray-500">
              {new Date(venta.fecha).toLocaleDateString('es-AR', { timeZone: 'UTC', })}
            </p>

            <div>
              <p className="font-medium text-sm mb-2 text-gray-700">Producto{totalProductos !== 1 ? 's' : ''}:</p>
              <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                {itemsVenta.map((item) => (
                  <li key={`${item.idVenta}-${item.idMate}`}>
                    {item.nombreMate} <span className="text-gray-500">(x{item.cantidad})</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between items-center border-t pt-3 text-sm">
              <span className="text-gray-500">Total</span>
              <span className="text-lg font-bold text-green-600">
                ${venta.total}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}