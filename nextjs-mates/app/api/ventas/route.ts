import { NextRequest } from 'next/server'
import { handlerVentasUltimosXMeses, handlerCrearVenta, handlerVentasByUser, handlerExisteVenta } from './handler'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('mode')

  switch (mode) {
    case 'ventasUltimosXMeses':
      return handlerVentasUltimosXMeses(req);
    case 'ventasByUser':
      return handlerVentasByUser(req);
    case 'existeVenta':
      return handlerExisteVenta(req);
  }

  return handlerVentasUltimosXMeses(req)
}

export async function POST(req: NextRequest) {
  return handlerCrearVenta(req)
}