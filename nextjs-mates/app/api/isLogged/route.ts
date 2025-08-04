import { NextResponse } from 'next/server';
import { isLoggedIn } from '@/app/lib/auth-utils';

export async function GET() {
  const logged = await isLoggedIn();
  return NextResponse.json({ logged });
}
