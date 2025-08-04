import { NextRequest } from 'next/server'
import { handlerComprarMate } from './handlers'

export async function POST(req: NextRequest) {
  return handlerComprarMate(req)
}