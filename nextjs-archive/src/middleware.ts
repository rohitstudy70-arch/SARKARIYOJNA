import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = path.startsWith('/portal/myadmin') && path !== '/portal/myadmin/login';
  
  if (isProtectedRoute) {
    const session = request.cookies.get('session')?.value;
    const decrypted = session ? await decrypt(session) : null;
    
    if (!decrypted) {
      return NextResponse.redirect(new URL('/portal/myadmin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/myadmin/:path*'],
};
