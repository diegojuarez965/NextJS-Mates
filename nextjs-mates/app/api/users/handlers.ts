import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';
import { User, ClientCard } from '../../lib/definitions';
import bcrypt from 'bcryptjs';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ITEMS_PER_PAGE = 5;

// GET clientes paginados, con filtro opcional por nombre
export async function handlerGetClients(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10)
        const offset = page > 0 ? page - 1 : 0
        const nombre = searchParams.get('nombre');

        const clientes: ClientCard[] = await sql`
      SELECT DISTINCT u.id, u.name, u.email
      FROM users u
      JOIN venta_mates_usuario vm ON vm.idUsuario = u.id
      WHERE u.rol = 'user'
      ${nombre ? sql`AND u.name ILIKE ${'%' + nombre + '%'}` : sql``}
      ORDER BY u.name ASC
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset * ITEMS_PER_PAGE};
    `;

        if (!clientes || clientes.length === 0) {
            return NextResponse.json({ error: 'No clients found' }, { status: 404 });
        }

        return NextResponse.json({ clientes }, { status: 200 });

    } catch (error) {
        console.error('Error fetching clients:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// GET cantidad total de páginas de clientes, según filtro opcional
export async function handlerGetClientPages(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const nombre = searchParams.get('nombre');

        const result = await sql`
      SELECT COUNT(DISTINCT u.id) AS total
      FROM users u
      JOIN venta_mates_usuario vm ON vm.idUsuario = u.id
      WHERE u.rol = 'user'
      ${nombre ? sql`AND u.name ILIKE ${'%' + nombre + '%'}` : sql``};
    `;

        const total = Number(result[0]?.total ?? 0);
        const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

        return NextResponse.json({ totalPages }, { status: 200 });

    } catch (error) {
        console.error('Error counting pages:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST registrar nuevo usuario
export async function handlerCreateUser(req: Request) {
    try {
        const body = await req.json();
        const { nombre, email, password } = body;

        if (!nombre || !email || !password) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Verificar si ya existe un usuario con ese email
        const existingUsers = await sql<User[]>`
      SELECT * FROM users WHERE email = ${email}
    `;
        if (existingUsers.length > 0) {
            return NextResponse.json(
                { error: 'Email ya registrado' },
                { status: 409 }
            );
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        // Inserta usuario
        const result = await sql<User[]>`
      INSERT INTO users (name, email, password)
      VALUES (${nombre}, ${email}, ${hashedPassword})
      RETURNING *
    `;

        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json(
            { error: 'Failed to create user.' },
            { status: 500 }
        );
    }
}
