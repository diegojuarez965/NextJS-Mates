import { NextRequest, NextResponse } from 'next/server'
import postgres from 'postgres';
import { auth } from '@/auth';


const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function handlerGetCarrito(req: NextRequest) {
  if (req.method !== 'GET') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idUser = session.user.id;

    // Buscar si ya existe un carrito
    let [carrito]: {
      idCarrito: number;
      idUser: number;
      cantidadTotal: number;
    }[] = await sql`
      SELECT 
        id_carrito AS "idCarrito",
        id_user AS "idUser",
        cantidad_total AS "cantidadTotal"
      FROM carrito
      WHERE id_user = ${idUser};
    `;

    // Si no existe, lo creo con cantidad_total = 0
    if (!carrito) {
      [carrito] = await sql`
        INSERT INTO carrito (id_user, cantidad_total)
        VALUES (${idUser}, 0)
        RETURNING 
          id_carrito AS "idCarrito",
          id_user AS "idUser",
          cantidad_total AS "cantidadTotal";
      `;
    }

    // Traer los items del carrito
    const items: {
      idCarrito: number;
      idMate: number;
      cantidad: number;
    }[] = await sql`
      SELECT 
        id_carrito AS "idCarrito",
        id_mate AS "idMate",
        cantidad
      FROM carrito_mate
      WHERE id_carrito = ${carrito.idCarrito};
    `;

    return NextResponse.json({ carrito, items }, { status: 200 });

  } catch (error) {
    console.error('Error fetching carrito:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function handlerAddMateToCarrito(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idUser = session.user.id;

    const body = await req.json();
    const { idMate, cantidad } = body;

    // Validación básica de datos
    if (typeof idMate !== 'number' || typeof cantidad !== 'number') {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    // Buscar carrito existente
    let [carrito]: {
      idCarrito: number;
      idUser: number;
      cantidadTotal: number;
    }[] = await sql`
      SELECT 
        id_carrito AS "idCarrito",
        id_user AS "idUser",
        cantidad_total AS "cantidadTotal"
      FROM carrito 
      WHERE id_user = ${idUser};
    `;

    // Si no existe, crearlo
    if (!carrito) {
      [carrito] = await sql`
        INSERT INTO carrito (id_user, cantidad_total)
        VALUES (${idUser}, 0)
        RETURNING 
          id_carrito AS "idCarrito",
          id_user AS "idUser",
          cantidad_total AS "cantidadTotal";
      `;
    }

    // Buscar si el mate ya está en el carrito
    const [existente]: {
      idCarrito: number;
      idMate: number;
      cantidad: number;
    }[] = await sql`
      SELECT 
        id_carrito AS "idCarrito",
        id_mate AS "idMate",
        cantidad
      FROM carrito_mate 
      WHERE id_carrito = ${carrito.idCarrito} AND id_mate = ${idMate};
    `;

    if (existente) {
      // Si ya existe, actualizar cantidad
      await sql`
        UPDATE carrito_mate
        SET cantidad = cantidad + ${cantidad}
        WHERE id_carrito = ${carrito.idCarrito} AND id_mate = ${idMate};
      `;
    } else {
      // Si no, insertarlo
      await sql`
        INSERT INTO carrito_mate (id_carrito, id_mate, cantidad)
        VALUES (${carrito.idCarrito}, ${idMate}, ${cantidad});
      `;
    }

    // Actualizar el total del carrito
    await sql`
      UPDATE carrito
      SET cantidad_total = cantidad_total + ${cantidad}
      WHERE id_carrito = ${carrito.idCarrito};
    `;

    return NextResponse.json({ message: 'Mate agregado al carrito' }, { status: 200 });
  } catch (error) {
    console.error('Error adding mate to carrito:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function handlerDeleteMateFromCarrito(req: NextRequest) {
  if (req.method !== 'DELETE') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idUser = session.user.id;

    const body = await req.json();
    const { idMate } = body;

    if (typeof idMate !== 'number') {
      return NextResponse.json({ error: 'idMate inválido' }, { status: 400 });
    }

    // Buscar el carrito del usuario
    const [carrito]: {
      idCarrito: number;
      idUser: number;
      cantidadTotal: number;
    }[] = await sql`
      SELECT 
        id_carrito AS "idCarrito",
        id_user AS "idUser",
        cantidad_total AS "cantidadTotal"
      FROM carrito 
      WHERE id_user = ${idUser};
    `;

    if (!carrito) {
      return NextResponse.json({ error: 'No se encontró un carrito para el usuario' }, { status: 404 });
    }

    // Buscar si el mate existe en el carrito
    const [existente]: {
      idCarrito: number;
      idMate: number;
      cantidad: number;
    }[] = await sql`
      SELECT 
        id_carrito AS "idCarrito",
        id_mate AS "idMate",
        cantidad
      FROM carrito_mate 
      WHERE id_carrito = ${carrito.idCarrito} AND id_mate = ${idMate};
    `;

    if (!existente) {
      return NextResponse.json({ message: 'Mate no encontrado en el carrito' }, { status: 404 });
    }

    // Eliminar el mate del carrito
    await sql`
      DELETE FROM carrito_mate
      WHERE id_carrito = ${carrito.idCarrito} AND id_mate = ${idMate};
    `;

    // Actualizar el total del carrito
    await sql`
      UPDATE carrito
      SET cantidad_total = cantidad_total - ${existente.cantidad}
      WHERE id_carrito = ${carrito.idCarrito};
    `;

    return NextResponse.json({ message: 'Mate eliminado del carrito' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting mate from carrito:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function handlerClearCarrito(req: NextRequest) {
  if (req.method !== 'DELETE') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idUser = session.user.id;

    const [carrito]: {
      idCarrito: number;
      idUser: number;
      cantidadTotal: number;
    }[] = await sql`
      SELECT
        id_carrito AS "idCarrito",
        id_user AS "idUser",
        cantidad_total AS "cantidadTotal" 
      FROM carrito 
      WHERE id_user = ${idUser};
    `;

    // Si no hay carrito, no hay nada que vaciar
    if (!carrito) {
      return NextResponse.json({ message: 'No hay carrito para limpiar' }, { status: 200 });
    }

    // Eliminar todos los mates del carrito
    await sql`
      DELETE FROM carrito_mate
      WHERE id_carrito = ${carrito.idCarrito};
    `;

    // Reiniciar el total del carrito
    await sql`
      UPDATE carrito
      SET cantidad_total = 0
      WHERE id_carrito = ${carrito.idCarrito};
    `;

    return NextResponse.json({ message: 'Carrito limpiado correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error clearing carrito:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
