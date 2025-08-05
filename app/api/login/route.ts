import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (
    username === process.env.DEMO_USER &&
    password === process.env.DEMO_PASSWORD
  ) {
    // Създаваме бисквитка, която да пази сесията
    const cookieStore = await cookies();
    cookieStore.set('session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 часа
      path: '/',
    });

    return NextResponse.json({ message: 'Success' });
  }

  return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
}
