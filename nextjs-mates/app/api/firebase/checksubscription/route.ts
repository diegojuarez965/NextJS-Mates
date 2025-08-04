import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function POST(request: Request) {
    try {
        const { token } = await request.json();

        const result = await sql`
            SELECT 1 FROM subscriptions
            WHERE token = ${token}
            LIMIT 1;
        `;

        const isSubscribed = Array.isArray(result) && result.length > 0;

        return NextResponse.json({ isSubscribed });
    } catch (error) {
        console.error('Error al verificar suscripción:', error);
        return NextResponse.json({ isSubscribed: false });
    }
}
