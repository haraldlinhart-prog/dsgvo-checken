import type { Metadata } from 'next';
import Script from 'next/script';
import '../globals.css';

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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1GD5Z3FKQ6"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1GD5Z3FKQ6');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
