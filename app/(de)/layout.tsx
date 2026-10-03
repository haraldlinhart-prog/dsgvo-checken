import type { Metadata } from 'next';
import '../globals.css';
import { SITE_URL } from '../i18n';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Kostenloser DSGVO-Check für Ihre Website | dsgvo-checken.de',
  description: 'Kostenloser DSGVO-Check für Ihre Website. Prüfen Sie Datenschutzerklärung, Impressum, Cookie-Banner, Google Fonts, Tracking und mehr — sofort und ohne Anmeldung.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'DSGVO-Check — Ist Ihre Website rechtskonform?',
    description: 'Kostenloser DSGVO-Check: Datenschutzerklärung, Impressum, Cookie-Consent, Google Fonts, Tracking.',
    url: `${SITE_URL}/`,
    siteName: 'dsgvo-checken.de',
    locale: 'de_DE',
    alternateLocale: ['en_US'],
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      {/* Bewusst kein Google Analytics: Die Seite würde sonst ihren eigenen DSGVO-Check nicht bestehen. */}
      <body>{children}</body>
    </html>
  );
}
