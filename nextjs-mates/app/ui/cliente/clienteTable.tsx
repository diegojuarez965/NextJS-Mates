import { fetchClientMates } from '@/app/lib/data';
import BaseTable from '../baseTable';
import { AgregarACarrito } from '../buttons';
import { ClientFilter, Mate } from '@/app/lib/definitions';
import { isLoggedIn } from '@/app/lib/auth-utils';

export default async function ClienteTable({
  filtros,
  currentPage,
}: {
  filtros: ClientFilter;
  currentPage: number;
}) {
  // Estado para indicar si hay mates o no
  let mates: Mate[] = [];
  let noMates = false;
  // Verificar si el usuario está logueado
  const isLogged = await isLoggedIn();

  try {
    // Obtener mates con filtros y paginación
    mates = await fetchClientMates(filtros, currentPage);
    if (!mates || mates.length === 0) {
      noMates = true;
    }
  } catch (err) {
    // Loguear errores y marcar sin resultados
    console.error('Error al obtener mates:', err);
    noMates = true;
  }

  if (noMates) {
    return (
      <div className="text-center text-greenMate mt-6">
        No se encontraron mates.
      </div>
    );
  }

  return (
    <BaseTable mates={mates} renderActions={(mate) => <AgregarACarrito id={mate.id} isLogged={isLogged} />} />
  );
}
