'use client';
import { useState } from "react";
import Link from 'next/link';
import { PencilIcon, PlusIcon, TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { deleteMate } from '@/app/lib/actions';
import DeleteModal from './admin/DeleteModal';
import { addMateToCarrito, deleteMateFromCarrito, clearCarrito } from "@/app/lib/carrito-actions";
import { useCarrito } from "./cliente/carritoProvider";
import LoginModal from "./cliente/loginModal";

export function CreateMate() {
  return (
    <Link
      href="/elsurenouniversitario/admin/mates/create"
      className="flex h-10 items-center rounded-lg bg-greenMateButton px-4 text-sm font-medium text-white transition-colors hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-greenMateButton"
      aria-label="Crear mate"
    >
      <span className="hidden md:block">Crear Mate</span>{' '}
      <PlusIcon className="h-5 md:ml-4" aria-hidden="true" />
    </Link>
  );
}

export function UpdateMate({ id }: { id: string }) {
  return (
    <Link
      href={`/elsurenouniversitario/admin/mates/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100 z-10"
      aria-label="Editar mate"
    >
      <PencilIcon className="w-5" aria-hidden="true" />
    </Link>
  );
}

export function DeleteMate({ id, vendidos }: { id: string, vendidos: number }) {
  const [modalEliminacion, changeModalEliminacion] = useState(false);

  const deleteMateWithId = deleteMate.bind(null, id);

  return (
    <div>
      <form>
        <button type="button" onClick={() => changeModalEliminacion(!modalEliminacion)} className='z-10 rounded-md border p-2 hover:bg-gray-100'>
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
      {modalEliminacion && <DeleteModal onClose={() => changeModalEliminacion(!modalEliminacion)} onDelete={deleteMateWithId} vendidos={vendidos} />}
    </div>
  )
}

export function AgregarACarrito({ id, isLogged }: { id: string, isLogged: boolean }) {
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [cant, setCant] = useState(1);
  const [modalLogin, changeModalLogin] = useState(false);
  const { refetch } = useCarrito();

  const agregar = async () => {
    await addMateToCarrito(id, cant)
    refetch();
    setMostrarSelector(false);
    setCant(1);
  };

  const handleClickAgregar = () => {
    if (!isLogged) {
      changeModalLogin(true);
      return;
    }
    setMostrarSelector(true);
  };

  return (
    <div className="flex items-center gap-2">
      {!mostrarSelector ? (
        <button
          type="button"
          className="flex items-center gap-2 rounded-md border px-3 py-2 hover:bg-gray-100 transition"
          onClick={() => handleClickAgregar()}
        >
          <ShoppingCartIcon className="w-5" />
          Agregar al carrito
        </button>
      ) : (
        <>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCant(Math.max(1, cant - 1))}
              className="px-2 py-1 border rounded hover:bg-gray-200"
            >
              -
            </button>
            <span className="px-2">{cant}</span>
            <button
              type="button"
              onClick={() => setCant(cant + 1)}
              className="px-2 py-1 border rounded hover:bg-gray-200"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={agregar}
            className="bg-greenMateButton text-white px-3 py-2 rounded hover:bg-green-700 transition"
          >
            Confirmar
          </button>
        </>
      )}
      {modalLogin && (
        <LoginModal onClose={() => changeModalLogin(false)} />
      )}
    </div>
  );
}


export function EliminarDelCarrito({ id, onDelete }: { id: string, onDelete: () => void }) {
  const { refetch } = useCarrito();
  const handleRemove = async () => {
    await deleteMateFromCarrito(id);
    refetch();
    onDelete();
  }

  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-md border px-3 py-2 hover:bg-gray-100 transition"
      onClick={handleRemove}
    >
      <TrashIcon className="w-5" />
      Eliminar del carrito
    </button>
  );
}

export function VaciarCarrito({ onClear }: { onClear: () => void }) {
  const { refetch } = useCarrito();
  const clear = async () => {
    await clearCarrito();
    refetch();
    onClear();
  }

  return (
    <button
      type="button"
      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md shadow hover:opacity-80 transition font-semibold"
      onClick={clear}
    >
      <TrashIcon className="w-5" />
      Vaciar carrito
    </button>
  );
}

export function iniciarSesion() {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-md border px-3 py-2 hover:bg-gray-100 transition"
    >
      Iniciar sesion
    </button>
  );
}