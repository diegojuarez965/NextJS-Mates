import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { crearVenta } from '@/app/lib/actions';
import { existeVenta } from '@/app/lib/data';
import { Venta, VentaMateUsuario } from '@/app/lib/definitions';

const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function handlerNotificarCompra(req: NextRequest) {
    try {
        const body: { data?: { id?: string } } = await req.json();
        const paymentId = body.data?.id;

        if (!paymentId) {
            console.error('Error: paymentId no recibido en el webhook');
            return NextResponse.json({ error: 'paymentId faltante' }, { status: 400 });
        }

        // 1. Verificamos si la venta ya fue procesada
        const ventaYaExiste = await existeVenta(paymentId);
        if (ventaYaExiste?.existe) {
            console.warn(`Venta ${paymentId} ya procesada. Ignorando notificación duplicada.`);
            return NextResponse.json({ message: 'Venta ya procesada' }, { status: 200 });
        }

        // 2. Obtenemos el detalle del pago
        const payment = await new Payment(mp).get({ id: paymentId });

        // 3. Validamos que el pago esté aprobado
        if (payment.status !== 'approved') {
            console.info(`Pago ${paymentId} con estado "${payment.status}", no se procesa.`);
            return NextResponse.json({ message: 'Pago no aprobado', status: payment.status }, { status: 200 });
        }

        // 4. Extraemos items comprados y datos del usuario
        const items = payment.additional_info?.items || [];
        const userID = payment.external_reference || '';

        const itemsIDCantidad = items.map(item => ({
            id: item.id,
            cantidad: item.quantity,
        }));

        // 5. Actualizamos los vendidos solo para los productos realmente comprados
        await actualizarVendidos(itemsIDCantidad);

        // 6. Registramos la venta
        const venta: Venta = {
            id: paymentId,
            fecha: new Date().toISOString(),
            total: payment.transaction_amount || 0,
        };

        const ventaMatesUsuario: VentaMateUsuario[] = itemsIDCantidad.map(item => ({
            idVenta: paymentId,
            idMate: item.id,
            idUsuario: userID,
            cantidad: item.cantidad,
        }));

        await crearVenta(venta, ventaMatesUsuario);

        return NextResponse.json({ message: 'Venta procesada correctamente' }, { status: 200 });

    } catch (error) {
        console.error('Error al procesar el webhook de compra:', error);
        return NextResponse.json({ error: 'Error al procesar la notificación' }, { status: 500 });
    }
}

export async function actualizarVendidos(itemsIDCantidad: { id: string; cantidad: number }[]) {
    try {
        await Promise.all(itemsIDCantidad.map(async ({ id, cantidad }) => {
            const res = await fetch(`${baseUrl}/api/mates`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, vendidos: cantidad }),
            });

            if (!res.ok) {
                const msg = await res.text();
                console.error(`Error al actualizar mate ID ${id}: ${res.status} - ${msg}`);
            }
        }));
    } catch (error) {
        console.error('Error general al actualizar vendidos:', error);
    }
}
