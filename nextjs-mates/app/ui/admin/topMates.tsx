'use client';

import { getTopMatesVendidos } from "@/app/lib/data";
import { Mate } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function TopMates({
    skeleton,
}: {
    skeleton: React.ReactNode;
}) {
    // Estado de mates más vendidos
    const [topMates, setTopMates] = useState<Mate[]>([]);
    const [noMates, setNoMates] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchTopMates() {
            setIsLoading(true);
            try {
                const mates = await getTopMatesVendidos();
                if (!mates || mates.length === 0) {
                    setNoMates(true);
                } else {
                    setTopMates(mates);
                }
            } catch (error) {
                console.error(error);
                setNoMates(true);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTopMates();
    }, []);

    if (isLoading) return <>{skeleton}</>;

    if (noMates) {
        return (
            <div className="text-center text-greenMate">
                No se encontraron mates vendidos.
            </div>
        );
    }

    return topMates.map((mate: Mate) => (
        <div key={mate.id} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
            <Image
                src={mate.imagen}
                alt={mate.nombre}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded"
            />
            <div className="flex flex-col">
                <h3 className="text-lg font-semibold capitalize">{mate.nombre}</h3>
                <p className="text-gray-600">Vendidos: {mate.vendidos}</p>
            </div>
        </div>
    ));
}
