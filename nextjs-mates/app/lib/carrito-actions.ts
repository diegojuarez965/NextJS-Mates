const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

// Agrega un mate con cantidad al carrito (POST)
export async function addMateToCarrito(idMate: string, cantidad: number) {
    try {
        const res = await fetch(`${baseUrl}/api/carrito`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idMate, cantidad })
        });

        if (!res.ok) {
            throw new Error(`Error al agregar al carrito: ${res.status}`);
        }
    }
    catch (error) {
        console.error("Error al agregar al carrito:", error);
    }
}

// Elimina un mate del carrito por idMate (DELETE con body)
export async function deleteMateFromCarrito(idMate: string) {
    try {
        const res = await fetch(`${baseUrl}/api/carrito?mode=delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idMate })
        });

        if (!res.ok) {
            throw new Error(`Error al eliminar del carrito: ${res.status}`);
        }
    }
    catch (error) {
        console.error("Error al eliminar del carrito:", error);
    }
}

// Limpia todo el carrito (DELETE sin body, con modo clear)
export async function clearCarrito() {
    try {
        const res = await fetch(`${baseUrl}/api/carrito?mode=clear`, {
            method: 'DELETE'
        });

        if (!res.ok) {
            throw new Error(`Error al limpiar el carrito: ${res.status}`);
        }
    }
    catch (error) {
        console.error("Error al limpiar el carrito:", error);
    }
}



