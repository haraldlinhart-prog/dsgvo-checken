import type { Metadata } from 'next';
import NotFoundContent from '../../../NotFoundContent';

// Styled English 404 page for unknown URLs below /en (status 404 via middleware.ts).
export const metadata: Metadata = {
  title: 'Page not found | dsgvo-checken.de',
  robots: { index: false },
  openGraph: null,
};

export default function CatchAllEn() {
  return <NotFoundContent lang="en" />;
}
