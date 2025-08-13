'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { getVentasUltimosXMeses } from '@/app/lib/data';
import { Venta } from '@/app/lib/definitions';

export function VentasGrafico({
    meses,
    graficoSkeleton,
}: {
    meses: number;
    graficoSkeleton: React.ReactNode;
}) {
    // Estado de datos de ventas agrupados por día
    const [data, setData] = useState<{ fecha: string; total: number }[]>([]);
    const [noVentas, setNoVentas] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Agrupa ventas sumando totales por fecha (yyyy-mm-dd)
    function agruparPorDia(ventas: Venta[]) {
        const map = new Map<string, number>();

        ventas.forEach((venta) => {
            const fecha = new Date(venta.fecha).toISOString().split('T')[0]; // yyyy-mm-dd
            map.set(fecha, (map.get(fecha) || 0) + venta.total);
        });

        return Array.from(map.entries()).map(([fecha, total]) => ({
            fecha,
            total,
        }));
    }

    useEffect(() => {
        async function fetchVentas() {
            setIsLoading(true);
            try {
                const ventas = await getVentasUltimosXMeses(meses);
                if (!ventas || ventas.length === 0) {
                    setNoVentas(true);
                } else {
                    const agrupadas = agruparPorDia(ventas);
                    setData(agrupadas);
                }
            } catch (error) {
                console.error(error);
                setNoVentas(true);
            } finally {
                setIsLoading(false);
            }
        }

        fetchVentas();
    }, [meses]);

    if (isLoading) return <>{graficoSkeleton}</>;

    if (noVentas) return (
        <div className="text-center text-greenMateButton mt-6">
            No se encontraron ventas.
        </div>
    );

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="fecha"
                        stroke="#3F5E4B"
                        interval="preserveStartEnd"
                        tickFormatter={(tick) => new Date(tick).toLocaleDateString('es-AR', { timeZone: 'UTC', })}
                    >
                        <Label value="Fecha" offset={-5} position="insideBottom" style={{ fill: 'carbon' }} />
                    </XAxis>
                    <YAxis stroke="#3F5E4B" tickFormatter={(value) => (value === 0 ? '' : value)}>
                        <Label value="Total (ARS)" offset={-20} position="insideTop" style={{ fill: 'carbon' }} />
                    </YAxis>
                    <Tooltip />
                    <Line type="monotone" dataKey="total" stroke="#3F5E4B" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default VentasGrafico;
