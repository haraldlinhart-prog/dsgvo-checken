import ContactForm from '../../ContactForm';
import SiteFooter from '../../SiteFooter';
import SiteHeader from '../../SiteHeader';
import { alternates } from '../../i18n';
import type { Metadata } from 'next';

const TITLE = 'Kontakt | dsgvo-checken.de';
const DESCRIPTION = 'Fragen zur DSGVO-Compliance? Schreiben Sie uns — wir helfen Ihnen weiter.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: alternates('/kontakt', '/en/contact', '/kontakt'),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.dsgvo-checken.de/kontakt',
    siteName: 'dsgvo-checken.de',
    locale: 'de_DE',
    type: 'website',
  },
};

export default function KontaktPage() {
  return (
    <>
      <SiteHeader lang="de" deHref="/kontakt" enHref="/en/contact" />

      <main>
        <section className="hero" style={{ paddingBottom: '0' }}>
          <div className="wrap">
            <h1>Kontakt</h1>
            <p>
              Fragen zur DSGVO-Compliance, zum Siegel oder zur professionellen Beratung?
              Schreiben Sie uns — wir antworten in der Regel innerhalb von 24 Stunden.
            </p>
          </div>
        </section>

        <div className="wrap">
          <ContactForm />
        </div>
      </main>

      <div className="wrap">
        <SiteFooter />
      </div>
    </>
  );
}
