import { NextRequest, NextResponse } from 'next/server'
import postgres from 'postgres';
import { Mate, Venta, VentaMateCard } from '../../lib/definitions';


const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Verifica si existe una venta por id
export async function handlerExisteVenta(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
        }

        const venta = await sql<Venta[]>`
            SELECT * FROM ventas
            WHERE id = ${id}
        `
        const existe = venta.length > 0
        return NextResponse.json({ existe: existe }, { status: 200 })
    } catch (error) {
        console.error('Database Error:', error)
        return NextResponse.json({ error: 'Failed to fetch venta.' }, { status: 500 })
    }
}

// Obtiene ventas de los últimos X meses (por parámetro)
export async function handlerVentasUltimosXMeses(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
    }
    try {
        const { searchParams } = new URL(req.url)
        const meses = parseInt(searchParams.get('meses') || '1', 10);

        // Obtener la fecha actual y calcular la fecha de hace meses
        const currentDate = new Date();
        const monthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - meses));

        // Consultar las ventas de los últimos meses
        const ventas = await sql<Mate[]>`
            SELECT * FROM ventas
            WHERE fecha >= ${monthsAgo.toISOString().split('T')[0]}
            ORDER BY fecha ASC;
        `;

        return NextResponse.json(ventas, { status: 200 });
    } catch (error) {
        console.error('Error fetching sales:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Obtiene ventas realizadas por un usuario
export async function handlerVentasByUser(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    try {
        const ventas: Venta[] = await sql`
            SELECT DISTINCT v.*
            FROM ventas v
            JOIN venta_mates_usuario vm ON vm.idVenta = v.id
            WHERE vm.idUsuario = ${userId}
            ORDER BY v.fecha ASC;
        `;

        if (!ventas || ventas.length === 0) {
            return NextResponse.json({ error: 'No sales found' }, { status: 404 });
        }

        const items: VentaMateCard[] = await sql`
            SELECT 
                vm.idVenta AS "idVenta",
                vm.idMate AS "idMate",
                vm.idUsuario AS "idUsuario",
                vm.cantidad,
                m.nombre AS "nombreMate",
                m.precio AS "precioMate"
            FROM venta_mates_usuario vm
            JOIN mates m ON vm.idMate = m.id
            WHERE vm.idUsuario = ${userId}
            ORDER BY vm.idVenta ASC;
        `;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No sales found' }, { status: 404 });
        }

        return NextResponse.json({ ventas, items }, { status: 200 });
    } catch (error) {
        console.error('Error fetching sales:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Crea una nueva venta y sus items
export async function handlerCrearVenta(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
    }

    try {
        const body = await req.json();
        const { venta, ventaMatesUsuario } = body;
        const { id, fecha, total } = venta;

        if (!id || !fecha || !total) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Insertar la venta
        const result = await sql`
            INSERT INTO ventas (id, fecha, total)
            VALUES (${id}, ${fecha}, ${total})
            RETURNING *;
        `;
        // Insertar los items de la venta
        if (ventaMatesUsuario && Array.isArray(ventaMatesUsuario) && ventaMatesUsuario.length > 0) {
            for (const item of ventaMatesUsuario) {
                const { idMate, idUsuario, cantidad } = item;
                if (!idMate || !idUsuario || !cantidad) {
                    return NextResponse.json({ error: 'Missing required fields in ventaMatesUsuario' }, { status: 400 });
                }

                await sql`
                    INSERT INTO venta_mates_usuario (idVenta, idMate, idUsuario, cantidad)  
                    VALUES (${id}, ${idMate}, ${idUsuario}, ${cantidad});
                `;
            }
        }

        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error('Error creating sale:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

