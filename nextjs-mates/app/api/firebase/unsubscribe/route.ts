import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import postgres from 'postgres';

// Conexión a la base de datos
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Inicialización de Firebase Admin
if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export async function POST(request: Request) {
    try {
        const { token } = await request.json();
        if (!token) throw new Error('Token faltante');

        //  Desuscribirse del topic 'ofertas'
        await admin.messaging().unsubscribeFromTopic([token], 'ofertas');

        //  Eliminar el token de la base de datos
        await sql`
            DELETE FROM subscriptions
            WHERE token = ${token};
        `;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error al desuscribirse:', error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
