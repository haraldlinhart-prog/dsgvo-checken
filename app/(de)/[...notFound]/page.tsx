import { notFound } from 'next/navigation';

// Catch-all for unknown URLs: with two root layouts ((de) and (en)) Next.js
// would otherwise show its unstyled default 404 page. Calling notFound() here
// renders app/(de)/not-found.tsx inside the German layout (status 404).
export default function CatchAll() {
  notFound();
}
