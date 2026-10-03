import type { Metadata } from 'next';
import ContactForm from '../../../ContactForm';
import SiteHeader from '../../../SiteHeader';
import { alternates } from '../../../i18n';

export const metadata: Metadata = {
  title: 'Contact | dsgvo-checken.de',
  description: 'Questions about GDPR compliance? Get in touch — we are happy to help.',
  alternates: alternates('/kontakt', '/en/contact'),
  openGraph: {
    title: 'Contact | dsgvo-checken.de',
    description: 'Questions about GDPR compliance? Get in touch — we are happy to help.',
    url: 'https://www.dsgvo-checken.de/en/contact',
    siteName: 'dsgvo-checken.de',
    locale: 'en_US',
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
        <footer className="footer">
          <p>
            A tool by{' '}
            <a href="https://webmaster.plus" target="_blank" rel="noopener noreferrer">webmaster.plus</a>
            {' '}· Part of the{' '}
            <a href="https://www.pan21.info" target="_blank" rel="noopener noreferrer">PAN21 network</a>
            {' '}·{' '}
            <a href="https://webmaster.plus" target="_blank" rel="noopener noreferrer">Legal notice (German)</a>
            {' '}·{' '}
            <a href="/datenschutz" hrefLang="de">Privacy policy (German)</a>
            {' '}·{' '}
            <a href="/en">Start the GDPR check</a>
          </p>
        </footer>
      </div>
    </>
  );
}
