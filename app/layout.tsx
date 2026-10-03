// Pass-through root layout. The real root layouts with <html lang> live in the
// route groups app/(de) and app/(en); this file only exists so that
// app/not-found.tsx can handle unmatched URLs (Next.js 14 has no other way to
// render a custom 404 page with multiple root layouts).
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
