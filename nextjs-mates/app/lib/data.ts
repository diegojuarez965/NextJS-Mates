import { AdminFilter, ClientFilter, Carrito, CarritoMate } from "./definitions";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

// Fetch mates (admin) con filtros y paginación
export async function fetchAdminMates(filtros: AdminFilter, page: number) {
    const { nombre, material, color, precioMin, precioMax, vendidosMin, vendidosMax, estado } = filtros;

    const params = new URLSearchParams();

    if (nombre) params.append('nombre', nombre);
    if (material) params.append('material', material);
    if (color) params.append('color', color);
    if (precioMin) params.append('precioMin', precioMin);
    if (precioMax) params.append('precioMax', precioMax);
    if (vendidosMin) params.append('vendidosMin', vendidosMin);
    if (vendidosMax) params.append('vendidosMax', vendidosMax);
    if (estado) params.append('estado', estado);

    params.append('page', page.toString());
    params.append('mode', 'adminFetch');

    const res = await fetch(`${baseUrl}/api/mates?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch mates.');
    return res.json();
}

// Fetch mates (cliente) con filtros y paginación
export async function fetchClientMates(filtros: ClientFilter, page: number) {
    const { nombre, material, color, precioMin, precioMax } = filtros;

    const params = new URLSearchParams();

    if (nombre) params.append('nombre', nombre);
    if (material) params.append('material', material);
    if (color) params.append('color', color);
    if (precioMin) params.append('precioMin', precioMin);
    if (precioMax) params.append('precioMax', precioMax);

    params.append('page', page.toString());
    params.append('mode', 'clientFetch');

    const res = await fetch(`${baseUrl}/api/mates?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch mates.');
    return res.json();
}

// Cuenta páginas para mates admin con filtros
export async function fetchAdminCountPages(filtros: AdminFilter) {
    const { nombre, material, color, precioMin, precioMax, vendidosMin, vendidosMax, estado } = filtros;

    const params = new URLSearchParams();

    if (nombre) params.append('nombre', nombre);
    if (material) params.append('material', material);
    if (color) params.append('color', color);
    if (precioMin) params.append('precioMin', precioMin);
    if (precioMax) params.append('precioMax', precioMax);
    if (vendidosMin) params.append('vendidosMin', vendidosMin);
    if (vendidosMax) params.append('vendidosMax', vendidosMax);
    if (estado) params.append('estado', estado);

    params.append('mode', 'adminCountPages');

    const res = await fetch(`${baseUrl}/api/mates?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to count pages.');
    return res.json();
}

// Cuenta páginas para mates cliente con filtros
export async function fetchClientCountPages(filtros: ClientFilter) {
    const { nombre, material, color, precioMin, precioMax } = filtros;

    const params = new URLSearchParams();

    if (nombre) params.append('nombre', nombre);
    if (material) params.append('material', material);
    if (color) params.append('color', color);
    if (precioMin) params.append('precioMin', precioMin);
    if (precioMax) params.append('precioMax', precioMax);

    params.append('mode', 'clientCountPages');

    const res = await fetch(`${baseUrl}/api/mates?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to count pages.');
    return res.json();
}

// Trae mate por id
export async function fetchMateById(id: string) {
    const res = await fetch(`${baseUrl}/api/mates?id=${id}&mode=fetchById`);
    if (!res.ok) throw new Error('Failed to fetch mate.');
    return res.json();
}

// Trae datos climáticos desde coordenadas
export async function getMensajeClimaDesdeCoords(latitude: number, longitude: number) {
    const resWeather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=cloud_cover,is_day,apparent_temperature`);
    if (!resWeather.ok) throw new Error('Failed to fetch weather.');
    return resWeather.json();
}

// Trae clientes paginados y filtrados por nombre
export async function getClientes(nombre: string, page: number) {
    const res = await fetch(`${baseUrl}/api/users?nombre=${nombre}&page=${page}&mode=clientes`);
    if (!res.ok) {
        throw new Error('Error fetching clients data');
    }
    return res;
}

// Cuenta páginas para clientes
export async function countPagesOfClientes(nombre: string) {
    const res = await fetch(`${baseUrl}/api/users?nombre=${nombre}&mode=countPagesOfClientes`);
    if (!res.ok) {
        throw new Error('Error fetching clients data');
    }
    return res.json();
}

// Trae ventas de un cliente específico
export async function getVentasByClient(selectedClient: string) {
    const res = await fetch(`${baseUrl}/api/ventas?userId=${selectedClient}&mode=ventasByUser`);
    if (!res.ok) {
        throw new Error('Error fetching sales data');
    }
    return res;
}

// Trae ventas en últimos X meses
export async function getVentasUltimosXMeses(meses: number) {
    const res = await fetch(`${baseUrl}/api/ventas?meses=${meses}&mode=ventasUltimosXMeses`);
    if (!res.ok) {
        throw new Error('Error fetching sales data');
    }
    return res.json();
}

// Trae top 3 mates más vendidos (disponibles)
export async function getTopMatesVendidos() {
    const res = await fetch(`${baseUrl}/api/mates?mode=top`);
    if (!res.ok) {
        throw new Error('Error fetching top mates');
    }
    return res.json();
}

// Trae carrito actual con items
export async function getCarrito() {
    const res = await fetch(`${baseUrl}/api/carrito`);
    if (!res.ok) {
        throw new Error('Error fetching carrito');
    }
    return res.json() as Promise<{ carrito: Carrito; items: CarritoMate[] }>;
}

// Verifica existencia de venta por id
export async function existeVenta(id: string) {
    const res = await fetch(`${baseUrl}/api/ventas?id=${id}&mode=existeVenta`);
    if (!res.ok) {
        throw new Error('Error fetching venta');
    }
    return res.json();
}       