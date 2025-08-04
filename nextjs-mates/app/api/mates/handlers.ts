import { NextRequest, NextResponse } from 'next/server'
import postgres from 'postgres';
import { Mate } from '../../lib/definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const ITEMS_PER_PAGE = 6;

export async function handlerAdminFetchMates(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
    }

    try {
        // Parseo de query params
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1', 10)
        const offset = page > 0 ? page - 1 : 0

        const color = searchParams.get('color')
        const material = searchParams.get('material')
        const nombre = searchParams.get('nombre')

        const precioMin = parseFloat(searchParams.get('precioMin') || '')
        const precioMax = parseFloat(searchParams.get('precioMax') || '')

        const vendidosMin = parseFloat(searchParams.get('vendidosMin') || '')
        const vendidosMax = parseFloat(searchParams.get('vendidosMax') || '')

        const estado = searchParams.get('estado')

        // Consulta dinámica con filtros opcionales
        const mates = await sql<Mate[]>`
      SELECT *
      FROM mates
      WHERE
        ${color ? sql`color ILIKE ${`%${color}%`}` : sql`TRUE`} AND  
        ${material ? sql`material ILIKE ${`%${material}%`}` : sql`TRUE`} AND
        ${!isNaN(precioMin) ? sql`precio >= ${precioMin}` : sql`TRUE`} AND
        ${!isNaN(precioMax) ? sql`precio <= ${precioMax}` : sql`TRUE`} AND
        ${!isNaN(vendidosMin) ? sql`vendidos >= ${vendidosMin}` : sql`TRUE`} AND
        ${!isNaN(vendidosMax) ? sql`vendidos <= ${vendidosMax}` : sql`TRUE`} AND
        ${nombre ? sql`nombre ILIKE ${`%${nombre}%`}` : sql`TRUE`} AND
        ${estado ? sql`estado ILIKE ${`%${estado}%`}` : sql`TRUE`}
      ORDER BY mates.id 
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset * ITEMS_PER_PAGE}
    `

        return NextResponse.json(mates, { status: 200 })
    } catch (error) {
        console.error('Database Error:', error)
        return NextResponse.json({ error: 'Failed to fetch mates.' }, { status: 500 })
    }
}

export async function handlerClientFetchMates(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
    }

    try {
        // Parseo de query params
        const { searchParams } = new URL(req.url)

        const page = parseInt(searchParams.get('page') || '1', 10)
        const offset = page > 0 ? page - 1 : 0

        const color = searchParams.get('color')
        const material = searchParams.get('material')
        const nombre = searchParams.get('nombre')

        const precioMin = parseFloat(searchParams.get('precioMin') || '')
        const precioMax = parseFloat(searchParams.get('precioMax') || '')

        // Consulta dinámica con filtros opcionales
        const mates = await sql<Mate[]>`
      SELECT *
      FROM mates
      WHERE
        ${color ? sql`color ILIKE ${`%${color}%`}` : sql`TRUE`} AND  
        ${material ? sql`material ILIKE ${`%${material}%`}` : sql`TRUE`} AND
        ${!isNaN(precioMin) ? sql`precio >= ${precioMin}` : sql`TRUE`} AND
        ${!isNaN(precioMax) ? sql`precio <= ${precioMax}` : sql`TRUE`} AND
        ${nombre ? sql`nombre ILIKE ${`%${nombre}%`}` : sql`TRUE`} AND
        estado = 'disponible'
      ORDER BY mates.id 
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset * ITEMS_PER_PAGE}
    `

        return NextResponse.json(mates, { status: 200 })
    } catch (error) {
        console.error('Database Error:', error)
        return NextResponse.json({ error: 'Failed to fetch mates.' }, { status: 500 })
    }
}

export async function handlerFetchMateById(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
    }

    try {
        // Obtención de query param `id`
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
        }
        // Consulta por ID
        const mate = await sql<Mate[]>`
      SELECT *
      FROM mates
      WHERE id = ${id}
    `

        return NextResponse.json(mate[0], { status: 200 })
    } catch (error) {
        console.error('Database Error:', error)
        return NextResponse.json({ error: 'Failed to fetch mate.' }, { status: 500 })
    }
}

export async function handlerCreateMate(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
    }

    try {
        const body = await req.json()
        const { color, material, precio, vendidos, nombre, imagen, estado } = body
        // Validación de campos requeridos
        if (!color || !material || !precio || vendidos === undefined || !nombre || !imagen || !estado) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }
        // Inserción en base de datos
        const result = await sql<Mate[]>`
      INSERT INTO mates (color, material, precio, vendidos, nombre, imagen, estado)
      VALUES (${color}, ${material}, ${precio}, ${vendidos}, ${nombre}, ${imagen}, ${estado})
      RETURNING *
    `

        return NextResponse.json(result[0], { status: 201 })
    } catch (error) {
        console.error('Database Error:', error)
        return NextResponse.json({ error: 'Failed to create mate.' }, { status: 500 })
    }
}

export async function handlerUpdateMate(req: NextRequest) {
    if (req.method !== 'PUT') {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
    }

    try {
        const body = await req.json();
        const { id, color, material, precio, vendidos, nombre, imagen, estado } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing required field: id' }, { status: 400 });
        }

        // Armamos dinámicamente las partes del SET
        const updates: string[] = [];
        const values: (string | number)[] = [];

        if (color !== undefined) {
            updates.push(`color = $${values.length + 1}`);
            values.push(color);
        }
        if (material !== undefined) {
            updates.push(`material = $${values.length + 1}`);
            values.push(material);
        }
        if (precio !== undefined) {
            updates.push(`precio = $${values.length + 1}`);
            values.push(precio);
        }
        if (vendidos !== undefined) {
            updates.push(`vendidos = vendidos + $${values.length + 1}`);
            values.push(vendidos);
        }
        if (nombre !== undefined) {
            updates.push(`nombre = $${values.length + 1}`);
            values.push(nombre);
        }
        if (imagen !== undefined) {
            updates.push(`imagen = $${values.length + 1}`);
            values.push(imagen);
        }
        if (estado !== undefined) {
            updates.push(`estado = $${values.length + 1}`);
            values.push(estado);
        }

        if (updates.length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        // Armamos la query con parámetros seguros
        const queryText = `
            UPDATE mates
            SET ${updates.join(', ')}
            WHERE id = $${values.length + 1}
            RETURNING *
        `;

        values.push(id);

        const result = await sql.unsafe(queryText, values);

        if (!result.length) {
            return NextResponse.json({ error: 'Mate no encontrado' }, { status: 404 });
        }

        return NextResponse.json(result[0], { status: 200 });
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Failed to update mate.' }, { status: 500 });
    }
}

export async function handlerDeleteMate(
    req: NextRequest,
) {
    if (req.method !== 'DELETE') {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
    }

    try {
        const body = await req.json()
        const { id } = body
        // Validación de campo requerido
        if (!id) {
            return NextResponse.json(
                { error: 'Missing required field: id' },
                { status: 400 }
            )
        }
        // Eliminación por ID
        const result = await sql<Mate[]>`
            DELETE FROM mates
            WHERE id = ${id}
            RETURNING *
        `

        return NextResponse.json(result[0], { status: 200 })
    } catch (error) {
        console.error('Database Error:', error)
        return NextResponse.json({ error: 'Failed to delete mate.' }, { status: 500 })
    }
}

export async function handlerAdminCountPages(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
    }

    try {
        // Parseo de query params
        const { searchParams } = new URL(req.url)

        const color = searchParams.get('color')
        const material = searchParams.get('material')
        const nombre = searchParams.get('nombre')

        const precioMin = parseFloat(searchParams.get('precioMin') || '')
        const precioMax = parseFloat(searchParams.get('precioMax') || '')

        const vendidosMin = parseFloat(searchParams.get('vendidosMin') || '')
        const vendidosMax = parseFloat(searchParams.get('vendidosMax') || '')

        const estado = searchParams.get('estado')
        // Consulta dinámica con filtros opcionales
        const data = await sql`
      SELECT COUNT(*) 
      FROM mates
      WHERE
        ${color ? sql`color ILIKE ${`%${color}%`}` : sql`TRUE`} AND
        ${material ? sql`material ILIKE ${`%${material}%`}` : sql`TRUE`} AND
        ${!isNaN(precioMin) ? sql`precio >= ${precioMin}` : sql`TRUE`} AND
        ${!isNaN(precioMax) ? sql`precio <= ${precioMax}` : sql`TRUE`} AND
        ${!isNaN(vendidosMin) ? sql`vendidos >= ${vendidosMin}` : sql`TRUE`} AND
        ${!isNaN(vendidosMax) ? sql`vendidos <= ${vendidosMax}` : sql`TRUE`} AND
        ${nombre ? sql`nombre ILIKE ${`%${nombre}%`}` : sql`TRUE`} AND
        ${estado ? sql`estado = ${estado}` : sql`TRUE`}
    `
        const totalCount = Number(data[0].count)
        const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

        return NextResponse.json({ totalPages }, { status: 200 })
    } catch (error) {
        console.error('Database Error:', error)
        return NextResponse.json({ error: 'Failed to count pages.' }, { status: 500 })
    }
}

export async function handlerClientCountPages(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
    }

    try {
        // Parseo de query params
        const { searchParams } = new URL(req.url)

        const color = searchParams.get('color')
        const material = searchParams.get('material')
        const nombre = searchParams.get('nombre')

        const precioMin = parseFloat(searchParams.get('precioMin') || '')
        const precioMax = parseFloat(searchParams.get('precioMax') || '')
        // Consulta dinámica con filtros opcionales
        const data = await sql`
      SELECT COUNT(*) 
      FROM mates
      WHERE
        ${color ? sql`color ILIKE ${`%${color}%`}` : sql`TRUE`} AND
        ${material ? sql`material ILIKE ${`%${material}%`}` : sql`TRUE`} AND
        ${!isNaN(precioMin) ? sql`precio >= ${precioMin}` : sql`TRUE`} AND
        ${!isNaN(precioMax) ? sql`precio <= ${precioMax}` : sql`TRUE`} AND
        ${nombre ? sql`nombre ILIKE ${`%${nombre}%`}` : sql`TRUE`} AND
        estado = 'disponible'
    `
        const totalCount = Number(data[0].count)
        const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

        return NextResponse.json({ totalPages }, { status: 200 })
    } catch (error) {
        console.error('Database Error:', error)
        return NextResponse.json({ error: 'Failed to count pages.' }, { status: 500 })
    }
}

export async function handlerTopMatesVendidos(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
    }

    try {
        // Consulta top 3 mates disponibles, ordenados por vendidos
        const topMates = await sql<Mate[]>`
      SELECT *
      FROM mates
      WHERE estado = 'disponible'
      ORDER BY vendidos DESC
      LIMIT 3
    `
        if (topMates.length === 0) {
            return NextResponse.json({ message: 'No hay mates disponibles.' }, { status: 404 })
        }
        return NextResponse.json(topMates, { status: 200 })
    } catch (error) {
        console.error('Database Error:', error)
        return NextResponse.json({ error: 'Failed to fetch top mates.' }, { status: 500 })
    }
}