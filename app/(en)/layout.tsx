import type { Metadata } from 'next';
import '../globals.css';
import { SITE_URL } from '../i18n';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Free GDPR Check for Your Website | dsgvo-checken.de',
  description:
    'Free GDPR check for your website. Instantly test your privacy policy, legal notice, cookie banner, Google Fonts, tracking and more — no sign-up required.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'GDPR Check — Is your website compliant?',
    description:
      'Free GDPR check: privacy policy, legal notice (Impressum), cookie consent, Google Fonts and tracking.',
    url: `${SITE_URL}/en`,
    siteName: 'dsgvo-checken.de',
    locale: 'en_US',
    alternateLocale: ['de_DE'],
    type: 'website',
  },
};

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Bewusst kein Google Analytics: Die Seite würde sonst ihren eigenen DSGVO-Check nicht bestehen. */}
      <body>{children}</body>
    </html>
  );
}
