import { NextRequest } from 'next/server'
import { handlerNotificarCompra } from './handlers'

export async function POST(req: NextRequest) {
  return handlerNotificarCompra(req)
}