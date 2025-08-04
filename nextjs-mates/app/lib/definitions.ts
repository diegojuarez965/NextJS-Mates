export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  rol: "admin" | "user";
};

export type ClientCard = {
  id: string;
  name: string;
  email: string;
}

export type Mate = {
  id: string;
  color: string;
  material: string;
  precio: number;
  vendidos: number;
  nombre: string;
  imagen: string;
  estado: string;
}

export type MateMP = {
  id: string
  nombre: string;
  cantidad: number;
  precio: number;
}

export type Venta = {
  id: string;
  fecha: string;
  total: number;
}

export type VentaMateUsuario = {
  idVenta: string;
  idMate: string;
  idUsuario: string;
  cantidad: number;
}

export type VentaMateCard = {
  idVenta: string;
  idMate: string;
  idUsuario: string;
  cantidad: number;
  nombreMate: string;
  precioMate: number;
}

export type Carrito = {
  idCarrito: string;
  idUsuario: string;
  cantidadTotal: number;
}

export type CarritoMate = {
  idCarrito: string;
  idMate: string;
  cantidad: number;
}

export type AdminFilter = {
  nombre?: string;
  material?: string;
  color?: string;
  precioMin?: string;
  precioMax?: string;
  vendidosMax?: string;
  vendidosMin?: string;
  estado?: string;
}

export type ClientFilter = {
  nombre?: string;
  material?: string;
  color?: string;
  precioMin?: string;
  precioMax?: string;
}

export type subscription = {
  id: string;
  token: string;
}