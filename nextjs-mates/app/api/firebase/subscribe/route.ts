// Inicializar Firebase Admin solo una vez
import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

export async function POST(request: Request) {
    try {
        const { tokens, topic } = await request.json();

        if (!tokens || !topic) throw new Error('Tokens o topic faltantes');

        // Suscripción a topic
        const response = await admin.messaging().subscribeToTopic(tokens, topic);
        console.log('Firebase response:', response);

        //  Guardar cada token en la tabla subscriptions
        for (const token of tokens) {
            await sql`
                INSERT INTO subscriptions (token)
                VALUES (${token})
                ON CONFLICT (token) DO NOTHING;
            `;
        }

        return NextResponse.json({ success: true, message: 'Suscripción completada' });
    } catch (error) {
        console.error('Error en suscripción:', error);
        return NextResponse.json({ error: 'Error en suscripción' }, { status: 500 });
    }
}