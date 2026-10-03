import { notFound } from 'next/navigation';

// Unknown URLs below /en render the English 404 page (app/(en)/en/not-found.tsx).
export default function CatchAllEn() {
  notFound();
}
