import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');

  // Ако потребителят се опитва да достъпи страница, различна от /login,
  // и няма валидна сесийна бисквитка, го пренасочваме към /login.
  if (!sessionCookie && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Ако потребителят е влязъл и се опитва да достъпи /login,
  // го пренасочваме към главната страница.
  if (sessionCookie && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Конфигурация, която указва кои пътища да бъдат защитени от middleware-a.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
