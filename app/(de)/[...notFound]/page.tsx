import type { Metadata } from 'next';
import NotFoundContent from '../../NotFoundContent';

// Styled German 404 page for unknown URLs. With two root layouts ((de) and (en))
// Next.js 14 cannot render a not-found.tsx for unmatched routes, so this catch-all
// renders the 404 content itself; middleware.ts sets the HTTP status to 404.
export const metadata: Metadata = {
  title: 'Seite nicht gefunden | dsgvo-checken.de',
  robots: { index: false },
  openGraph: null,
};

export default function CatchAll() {
  return <NotFoundContent lang="de" />;
}
