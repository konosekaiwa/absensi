// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname === '/login';
    const isAdminRoute = req.nextUrl.pathname.startsWith('/dashboard/admin');
    const isInternRoute = req.nextUrl.pathname.startsWith('/dashboard/intern');

    // Redirect to login if not authenticated
    if (!isAuth && !isAuthPage) {
      const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${callbackUrl}`, req.nextUrl.origin)
      );
    }

    // Redirect away from login if already authenticated
    if (isAuth && isAuthPage) {
      const redirectUrl = token.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/intern';
      return NextResponse.redirect(new URL(redirectUrl, req.nextUrl.origin));
    }

    // Role-based access control
    if (isAuth) {
      if (isAdminRoute && token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard/intern', req.nextUrl.origin));
      }
      if (isInternRoute && token.role !== 'INTERN') {
        return NextResponse.redirect(new URL('/dashboard/admin', req.nextUrl.origin));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Hanya mengizinkan akses jika token ada
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*', // Proteksi semua rute di bawah /dashboard
    '/login', // Proteksi halaman login
  ],
};
