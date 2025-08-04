import { NextRequest } from "next/server";
import { handlerGetCarrito, handlerAddMateToCarrito, handlerDeleteMateFromCarrito, handlerClearCarrito } from "./handler";

export async function GET(req: NextRequest) {
    return handlerGetCarrito(req);
}

export async function POST(req: NextRequest) {
    return handlerAddMateToCarrito(req);
}

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const mode = searchParams.get('mode')

    switch (mode) {
        case 'clear':
            return handlerClearCarrito(req)
        case 'delete':
            return handlerDeleteMateFromCarrito(req)
    }
}