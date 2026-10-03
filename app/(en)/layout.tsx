import type { Metadata } from 'next';
import Script from 'next/script';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Free GDPR Check for Your Website | dsgvo-checken.de',
  description:
    'Free GDPR check for your website. Instantly test your privacy policy, legal notice, cookie banner, Google Fonts, tracking and more — no sign-up required.',
  openGraph: {
    title: 'GDPR Check — Is your website compliant?',
    description:
      'Free GDPR check: privacy policy, legal notice (Impressum), cookie consent, Google Fonts and tracking.',
    url: 'https://www.dsgvo-checken.de/en',
    siteName: 'dsgvo-checken.de',
    locale: 'en_US',
    alternateLocale: ['de_DE'],
    type: 'website',
  },
};

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
