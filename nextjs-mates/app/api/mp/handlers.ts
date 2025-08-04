import { MercadoPagoConfig, Preference } from "mercadopago"
import type { MateMP } from '@/app/lib/definitions';
import { NextRequest, NextResponse } from 'next/server';

const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export async function handlerComprarMate(req: NextRequest) {
    try {
        const body = await req.json();
        const matesMP: MateMP[] = body.matesMP;
        const idUser = body.idUser;
        // Genera preferencia de pago en MercadoPago
        const preference = await new Preference(mp).create({
            body: {
                items: matesMP.map(mate => ({
                    id: mate.id,
                    title: mate.nombre.charAt(0).toUpperCase() + mate.nombre.slice(1).toLowerCase(),
                    unit_price: mate.precio,
                    quantity: mate.cantidad,
                    currency_id: 'ARS',
                })),
                back_urls: {
                    success: `${baseUrl}/elsurenouniversitario/clientes/resultados/exito`,
                    failure: `${baseUrl}/elsurenouniversitario/clientes/resultados/fracaso`,
                    pending: `${baseUrl}/elsurenouniversitario/clientes/resultados/pendiente`,
                },
                auto_return: 'approved',
                external_reference: String(idUser),
            },
        });


        return NextResponse.json({
            id: preference.id,
            init_point: preference.init_point,
        });

    } catch (error) {
        console.error('Error al generar preferencia de MercadoPago:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
