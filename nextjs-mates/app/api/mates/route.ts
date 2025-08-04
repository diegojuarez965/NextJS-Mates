import { NextRequest } from 'next/server'
import { handlerAdminFetchMates, handlerClientFetchMates, handlerFetchMateById, handlerAdminCountPages, handlerClientCountPages, handlerCreateMate, handlerUpdateMate, handlerDeleteMate, handlerTopMatesVendidos } from './handlers'


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const mode = searchParams.get('mode')

  switch (mode) {
    case 'adminFetch':
      return handlerAdminFetchMates(req)
    case 'clientFetch':
      return handlerClientFetchMates(req)
    case 'adminCountPages':
      return handlerAdminCountPages(req)
    case 'clientCountPages':
      return handlerClientCountPages(req)
    case 'fetchById':
      return handlerFetchMateById(req)
    case 'top':
      return handlerTopMatesVendidos(req)
  }
}

export async function POST(req: NextRequest) {
  return handlerCreateMate(req)
}

export async function PUT(req: NextRequest) {
  return handlerUpdateMate(req)
}

export async function DELETE(req: NextRequest) {
  return handlerDeleteMate(req)
}
