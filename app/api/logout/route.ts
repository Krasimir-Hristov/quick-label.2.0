import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Изтриваме бисквитката
  const cookieStore = await cookies();
  cookieStore.set('session', '', { expires: new Date(0) });
  return NextResponse.json({ message: 'Logged out' });
}
