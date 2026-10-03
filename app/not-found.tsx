import type { Metadata } from 'next';
import './globals.css';
import NotFoundContent from './NotFoundContent';
import { SITE_URL } from './i18n';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Seite nicht gefunden | dsgvo-checken.de',
  robots: { index: false },
  icons: { icon: '/favicon.svg' },
};

// Rendered for every unknown URL (HTTP 404). Because app/layout.tsx only passes
// children through, this page must provide <html> and <body> itself.
export default function NotFound() {
  return (
    <html lang="de">
      <body>
        <NotFoundContent lang="de" />
      </body>
    </html>
  );
}
