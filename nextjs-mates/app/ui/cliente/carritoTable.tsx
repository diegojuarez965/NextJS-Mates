'use client';
import type { Mate, MateMP, CarritoMate } from "@/app/lib/definitions";
import { formatCurrency } from "@/app/lib/utils";
import { useState, useEffect } from "react";
import { fetchMateById, getCarrito } from "@/app/lib/data";
import BaseTable from "../baseTable";
import { EliminarDelCarrito, VaciarCarrito } from "../buttons";
import { quicksand } from "../fonts";
import { comprarMate } from "@/app/lib/actions";
import { CheckIcon, Loader2Icon } from 'lucide-react';
import { MatesTableClientSkeleton } from "@/app/ui/skeletons"


export function CarritoTable() {
    // Estado para items del carrito, detalles de mates, carga, total y datos para MercadoPago
    const [items, setItems] = useState<CarritoMate[]>([]);
    const [matesEnCarrito, setMatesEnCarrito] = useState<Mate[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [precioTotal, setPrecioTotal] = useState(0);
    const [matesMP, setMatesMP] = useState<MateMP[]>([]);

    // Refrescar items del carrito
    const refetchCarrito = async () => {
        try {
            const data = await getCarrito();
            setItems(data.items);
        } catch (err) {
            console.error(err);
        }
    };
    // Cargar items del carrito al montar
    useEffect(() => {
        const fetchCarrito = async () => {
            try {
                const data = await getCarrito();
                setItems(data.items);
            }
            catch (err) {
                console.error(err);
            }
        };
        fetchCarrito();
    }, []);

    // Obtener detalles de mates y calcular total cada vez que cambian los items
    useEffect(() => {
        const fetchMates = async () => {
            try {
                const matesData = await Promise.all(
                    items.map(item => fetchMateById(item.idMate))
                );
                setMatesEnCarrito(matesData);

                const total = matesData.reduce((acc, mate) => {
                    const cantidad = items.find(i => i.idMate === mate.id)?.cantidad || 0;
                    return acc + cantidad * mate.precio;
                }, 0);
                setPrecioTotal(total);

                setMatesMP(
                    matesData.map(mate => ({
                        id: mate.id,
                        nombre: mate.nombre,
                        cantidad: items.find(i => i.idMate === mate.id)?.cantidad || 0,
                        precio: mate.precio,
                    }))
                );
            } catch (err) {
                console.error(err);
            }
        };
        if (items.length > 0) fetchMates();
        else {
            setMatesEnCarrito([]);
            setPrecioTotal(0);
            setMatesMP([]);
        };
    }, [items]);

    const redirigirCompra = async () => {
        setIsLoading(true);
        try {
            const initPoint = await comprarMate(matesMP);
            window.location.href = initPoint; // Redirige a MercadoPago
        } catch (error) {
            console.error('Error al iniciar la compra:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {matesEnCarrito.length === 0 && items.length > 0 ? (
                <MatesTableClientSkeleton />
            ) :
                matesEnCarrito.length > 0 ? (
                    <div>
                        <BaseTable
                            mates={matesEnCarrito}
                            renderActions={(mate) => <EliminarDelCarrito id={mate.id} onDelete={refetchCarrito} />}
                            cantidad={(mate) => `${items.find(item => item.idMate === mate.id)?.cantidad}`}
                        />
                        <div className="rounded-lg bg-gray-50 p-2 ">
                            <table className="hidden min-w-full text-gray-900 md:table">
                                <tbody className="bg-white">
                                    <tr className="border-b text-sm">
                                        <td className="whitespace-nowrap px-11 py-3">
                                            <span className="text-gray-900 text-lg font-semibold">Total: </span>
                                            <span className="text-gray-900 text-lg">{formatCurrency(precioTotal)}</span>
                                        </td>
                                        <td className="whitespace-nowrap px-11 py-3">
                                            <div className="flex justify-end gap-2">
                                                <VaciarCarrito onClear={refetchCarrito} />
                                                <button
                                                    onClick={redirigirCompra}
                                                    disabled={isLoading}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-md shadow transition font-semibold ${isLoading
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-greenMateButton text-white hover:bg-green-700'
                                                        }`}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            Procesando...
                                                            <Loader2Icon className="w-5 animate-spin" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            Continuar con el pago
                                                            <CheckIcon className="w-5" />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="md:hidden">
                                <div className="flex justify-between">
                                    <span className="text-gray-900 text-lg font-semibold">Total: </span>
                                    <span className="text-gray-900 text-lg">{formatCurrency(precioTotal)}</span>
                                </div>
                                <div className="flex justify-end gap-2 mt-2">
                                    <VaciarCarrito onClear={refetchCarrito} />
                                    <button
                                        onClick={redirigirCompra}
                                        disabled={isLoading}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-md shadow transition font-semibold ${isLoading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-greenMateButton text-white hover:bg-green-700'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <>
                                                Procesando...
                                                <Loader2Icon className="w-5 animate-spin" />
                                            </>
                                        ) : (
                                            <>
                                                Continuar con el pago
                                                <CheckIcon className="w-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex w-full items-center justify-between">
                        <h1 className={`${quicksand.className} text-2xl text-carbon mt-6 ml-4`}>Parece que el carrito está vacío...</h1>
                    </div>
                )
            }
        </div >
    );
}