'use client';

import { getClientes, getVentasByClient } from "../lib/data";
import { useEffect, useState } from "react";
import { ClientCard, Venta, VentaMateCard } from "../lib/definitions";
import PanelVentas from "./panelVentas";
import { AnimatePresence, motion } from "framer-motion";
import { ClientesTableSkeleton, VentaCardSkeleton } from "./skeletons";

export default function ClientesList({ nombre, currentPage }: { nombre: string; currentPage: number }) {
  const [clientes, setClientes] = useState<ClientCard[]>([]);
  const [loadingClientes, setLoadingClientes] = useState<boolean>(true);
  const [loadingVentas, setLoadingVentas] = useState<boolean>(true);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [ventasData, setVentasData] = useState<{ ventas: Venta[], items: VentaMateCard[] } | null>(null);
  // Fetch de clientes al cambiar nombre o página
  useEffect(() => {
    setLoadingClientes(true);
    setClientes([]);

    getClientes(nombre, currentPage)
      .then(res => {
        if (res.status === 404) {
          return { clientes: [] };
        }
        return res.json();
      })
      .then(data => {
        setClientes(data.clientes);
        setLoadingClientes(false);
      })
      .catch(() => {
        setClientes([]);
        setLoadingClientes(false);
      });
  }, [nombre, currentPage]);

  // Fetch de ventas al seleccionar un cliente
  useEffect(() => {
    let isActive = true;

    setLoadingVentas(true);

    if (!selectedClient) {
      setLoadingVentas(false);
      setVentasData(null);
      return;
    }

    getVentasByClient(selectedClient)
      .then(res => res.json())
      .then(data => {
        if (isActive && selectedClient) {
          setVentasData(data);
          setLoadingVentas(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [selectedClient]);

  const handleSelectClient = (id: string) => {
    setSelectedClient(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4">
      {/* Versión de escritorio */}
      <div className="overflow-x-auto rounded-xl shadow hidden md:block">
        {loadingClientes ? (
          <ClientesTableSkeleton />
        ) : clientes.length === 0 ? (
          <div className="text-center text-gray-500 p-4">
            No se encontraron clientes.
          </div>
        ) : (
          <table className="min-w-full text-sm text-gray-900 bg-white">
            <thead className="bg-gray-100 text-left font-semibold">
              <tr>
                <th className="px-4 py-3 text-center">Nombre</th>
                <th className="px-4 py-3 text-center">Email</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-2 text-center break-words">{c.name || '-'}</td>
                  <td className="px-4 py-2 text-center break-all">{c.email}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleSelectClient(c.id)}
                      disabled={loadingVentas && selectedClient === c.id}
                      className={`px-3 py-1 text-sm rounded-lg transition
                      ${selectedClient === c.id ? 'bg-red-500' : 'bg-greenMateButton'} 
                      ${loadingVentas && selectedClient === c.id ? 'opacity-50 cursor-not-allowed' : 'text-white hover:opacity-90'}`}
                    >
                      {selectedClient === c.id ? 'Cerrar panel' : 'Ver ventas'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Versión mobile */}
      <div className="md:hidden space-y-4">
        {loadingClientes ? (
          <ClientesTableSkeleton />
        ) : clientes.length === 0 ? (
          <div className="text-center text-gray-500 p-4">
            No se encontraron clientes.
          </div>
        ) : (
          clientes.map((c) => (
            <div key={c.id} className="border rounded-lg p-4 shadow bg-white">
              <div className="text-sm font-medium text-gray-700">Nombre</div>
              <div className="mb-2 text-gray-900 break-words">{c.name || '-'}</div>
              <div className="text-sm font-medium text-gray-700">Email</div>
              <div className="mb-4 text-gray-900 break-all">{c.email}</div>
              <button
                onClick={() => handleSelectClient(c.id)}
                disabled={loadingVentas && selectedClient === c.id}
                className={`px-3 py-1 text-sm rounded-lg transition
                ${selectedClient === c.id ? 'bg-red-500' : 'bg-greenMateButton'} 
                ${loadingVentas && selectedClient === c.id ? 'opacity-50 cursor-not-allowed' : 'text-white hover:opacity-90'}`}
              >
                {selectedClient === c.id ? 'Cerrar panel' : 'Ver ventas'}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Ventas */}
      {loadingVentas ? (
        <div className="flex flex-wrap gap-4">
          <VentaCardSkeleton />
          <VentaCardSkeleton />
        </div>
      ) : (
        <AnimatePresence>
          {ventasData && (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <PanelVentas ventas={ventasData.ventas} items={ventasData.items} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
