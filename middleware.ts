import { NextRequest, NextResponse } from 'next/server';

// Every URL that really exists. Anything else is answered by the styled 404
// catch-all pages (app/(de)/[...notFound], app/(en)/en/[...notFound]) — this
// middleware makes sure those answers carry HTTP status 404 instead of 200.
const KNOWN = new Set([
  '/',
  '/en',
  '/kontakt',
  '/en/contact',
  '/datenschutz',
  '/robots.txt',
  '/sitemap.xml',
  '/favicon.ico',
  '/favicon.svg',
  '/siegel.png',
  '/siegel.svg',
  '/images/siegel.svg',
]);

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname.replace(/\/+$/, '') || '/';
  if (KNOWN.has(path)) return NextResponse.next();
  return NextResponse.rewrite(req.nextUrl, { status: 404 });
}

export const config = {
  // API routes, the badge endpoint and Next.js internals never get the 404 treatment.
  matcher: ['/((?!_next/|api/|badge/).*)'],
};
