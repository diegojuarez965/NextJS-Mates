import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { mates, users } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Crea tabla de usuarios y los inserta
async function seedUsers() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      rol TEXT NOT NULL DEFAULT 'user'
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (name, email, password, rol)
        VALUES (${user.name}, ${user.email}, ${hashedPassword}, ${user.rol})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

// Crea tabla de tokens de restablecimiento de contraseña
async function seedPasswordResetTokens() {
  await sql`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      email TEXT NOT NULL,
      token TEXT NOT NULL PRIMARY KEY,
      expires_at TIMESTAMP NOT NULL
    );
  `;
}

// Crea tabla de mates y los inserta
async function seedMates() {
  await sql`
    CREATE TABLE IF NOT EXISTS mates (
      id SERIAL PRIMARY KEY,
      color VARCHAR(50) NOT NULL,
      material VARCHAR(50) NOT NULL,
      precio INTEGER NOT NULL CHECK (precio > 0),
      vendidos INTEGER NOT NULL CHECK (vendidos >= 0),
      nombre VARCHAR(255) NOT NULL,
      imagen TEXT NOT NULL,
      estado VARCHAR(50) NOT NULL
    );
  `;

  const insertedMates = await Promise.all(
    mates.map(async (mate) => {
      return sql`
        INSERT INTO mates (color, material, precio, vendidos, nombre, imagen, estado)
        VALUES (${mate.color}, ${mate.material}, ${mate.precio}, ${mate.vendidos}, ${mate.nombre}, ${mate.imagen}, ${mate.estado})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedMates;
}

// Crea tabla de ventas
async function seedVentas() {
  await sql`
    CREATE TABLE IF NOT EXISTS ventas (
      id BIGINT UNIQUE NOT NULL,
      fecha DATE NOT NULL,
      total INTEGER NOT NULL CHECK (total > 0),
      PRIMARY KEY (id)
    );
  `;
}

// Crea tabla que relaciona ventas, mates y usuarios
async function seedVentaMatesUsuario() {
  await sql`
    CREATE TABLE IF NOT EXISTS venta_mates_usuario (
      idVenta BIGINT NOT NULL,
      idMate INTEGER NOT NULL,
      idUsuario INTEGER NOT NULL,
      cantidad INTEGER NOT NULL CHECK (cantidad > 0),
      PRIMARY KEY (idVenta, idMate, idUsuario),
      FOREIGN KEY (idVenta) REFERENCES ventas (id),
      FOREIGN KEY (idMate) REFERENCES mates (id),
      FOREIGN KEY (idUsuario) REFERENCES users (id)
    );
  `;
}

// Crea tabla que relaciona carritos y usuarios
async function seedCarrito() {
  await sql`
    CREATE TABLE IF NOT EXISTS carrito (
      id_carrito SERIAL PRIMARY KEY,
      id_user INTEGER NOT NULL,
      cantidad_total INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (id_user) REFERENCES users (id)
    );
  `;
}

// Crea tabla que relaciona carritos y mates
async function seedCarritoMates() {
  await sql`
    CREATE TABLE IF NOT EXISTS carrito_mate (
      id_carrito INTEGER NOT NULL,
      id_mate INTEGER NOT NULL,
      cantidad INTEGER NOT NULL,
      PRIMARY KEY (id_carrito, id_mate),
      FOREIGN KEY (id_carrito) REFERENCES carrito (id_carrito),
      FOREIGN KEY (id_mate) REFERENCES mates (id)
    );
  `;
}

// Crea tabla de suscripciones a notificaciones
async function seedSubscriptions() {
  await sql`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id SERIAL PRIMARY KEY,
      token TEXT UNIQUE NOT NULL
    );
  `;
}

// Ruta para sembrar la base de datos
export async function GET() {
  try {
    await sql.begin(async () => [
      await seedUsers(),
      await seedPasswordResetTokens(),
      await seedMates(),
      await seedVentas(),
      await seedVentaMatesUsuario(),
      await seedSubscriptions(),
      await seedCarrito(),
      await seedCarritoMates()
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
