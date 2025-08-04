import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Inicializar Firebase Admin solo una vez
if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { topic, title, body: messageBody } = body;

        const message = {
            topic,
            data: {
                title,
                body: messageBody,
            },
        };

        const response = await admin.messaging().send(message);
        return NextResponse.json({ success: true, response });
    } catch (error) {
        console.error('Error al enviar notificación:', error);
        return NextResponse.json({ error: 'Failed to send notification.' }, { status: 500 });
    }
}
