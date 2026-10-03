import type { Metadata } from 'next';
import ContactForm from '../../../ContactForm';
import SiteFooter from '../../../SiteFooter';
import SiteHeader from '../../../SiteHeader';
import { alternates } from '../../../i18n';

export const metadata: Metadata = {
  title: 'Contact | dsgvo-checken.de',
  description: 'Questions about GDPR compliance? Get in touch — we are happy to help.',
  alternates: alternates('/kontakt', '/en/contact', '/en/contact'),
  openGraph: {
    title: 'Contact | dsgvo-checken.de',
    description: 'Questions about GDPR compliance? Get in touch — we are happy to help.',
    url: 'https://www.dsgvo-checken.de/en/contact',
    siteName: 'dsgvo-checken.de',
    locale: 'en_US',
    alternateLocale: ['de_DE'],
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader lang="en" deHref="/kontakt" enHref="/en/contact" />

      <main>
        <section className="hero" style={{ paddingBottom: '0' }}>
          <div className="wrap">
            <h1>Contact</h1>
            <p>
              Questions about GDPR compliance, the seal or professional consulting?
              Drop us a line — we usually reply within 24 hours.
            </p>
          </div>
        </section>

        <div className="wrap">
          <ContactForm lang="en" />
        </div>
      </main>

      <div className="wrap">
        <SiteFooter lang="en" />
      </div>
    </>
  );
}
