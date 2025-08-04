import { DeleteMate, UpdateMate } from '@/app/ui/buttons';
import { fetchAdminMates } from '@/app/lib/data';
import BaseTable from '../baseTable';
import { AdminFilter } from "@/app/lib/definitions";
import { Mate } from "@/app/lib/definitions";

export default async function AdminTable({
  filtros,
  currentPage,
}: {
  filtros: AdminFilter;
  currentPage: number;
}) {
  // Estado para indicar si hay mates o no
  let mates: Mate[] = [];
  let noMates = false;

  try {
    // Obtener mates con filtros y paginación
    mates = await fetchAdminMates(filtros, currentPage);
    if (!mates || mates.length === 0) {
      noMates = true;
    }
  } catch (err) {
    console.error('Error al obtener mates:', err);
    noMates = true;
  }

  if (noMates) {
    return (
      <div className="text-center text-greenMate">
        No se encontraron mates.
      </div>
    );
  }

  return (
    <BaseTable
      mates={mates}
      vendidos={(mate) => `${mate.vendidos}`}
      renderActions={(mate) => (
        <div className="flex justify-end gap-2">
          <UpdateMate id={mate.id} />
          <DeleteMate id={mate.id} vendidos={mate.vendidos} />
        </div>
      )}
    />);
}

