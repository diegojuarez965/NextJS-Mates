import { NextRequest } from 'next/server'
import { handlerGetClients, handlerGetClientPages, handlerCreateUser } from './handlers'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('mode')

  switch (mode) {
    case 'clientes':
      return handlerGetClients(req);
    case 'countPagesOfClientes':
      return handlerGetClientPages(req);
  }
}

export async function POST(req: NextRequest) {
  return handlerCreateUser(req)
}