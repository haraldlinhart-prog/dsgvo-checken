import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DSGVO-Check | dsgvo-checken.de',
  description: 'Kostenloser DSGVO-Check für Ihre Website. Prüfen Sie Datenschutzerklärung, Cookie-Banner, Google Fonts, Tracking und mehr — sofort und kostenlos.',
  openGraph: {
    title: 'DSGVO-Check — Ist Ihre Website rechtskonform?',
    description: 'Kostenloser DSGVO-Check: Datenschutzerklärung, Impressum, Cookie-Consent, Google Fonts, Tracking.',
    url: 'https://dsgvo-checken.de',
    siteName: 'dsgvo-checken.de',
    locale: 'de_DE',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
