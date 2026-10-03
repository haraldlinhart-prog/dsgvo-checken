import type { Metadata } from 'next';
import CheckForm from '../CheckForm';
import SiteFooter from '../SiteFooter';
import SiteHeader from '../SiteHeader';
import { alternates } from '../i18n';

export const metadata: Metadata = {
  alternates: alternates('/', '/en', '/'),
};

export default function Home() {
  return (
    <>
      <SiteHeader lang="de" deHref="/" enHref="/en" />

      <main>
        <section className="hero">
          <div className="wrap">
            <h1>Ist Ihre Website DSGVO-konform?</h1>
            <p>
              Kostenloser Schnellcheck: URL eingeben, Ergebnis sofort sehen —
              Datenschutzerklärung, Impressum, Cookie-Banner, Google Fonts, Tracking und mehr.
            </p>
            <CheckForm />
          </div>
        </section>
        {/* <!-- IMPRESSUM:START --> */}
        {/* <!-- IMPRESSUM:END --> */}
      </main>

      <div className="wrap">
        <section className="cta">
          <h2>Professionelle Hilfe gesucht?</h2>
          <p>
            Wir sind echte Webmaster — Server, Domains, Datenbanken, Formulare, Automatisierung.
            Beschreiben Sie Ihr Problem und nennen Sie Ihren Preis.
          </p>
          <a className="ctaBtn" href="https://www.webmaster.plus" target="_blank" rel="noopener noreferrer">
            Zu webmaster.plus →
          </a>
        </section>

        <SiteFooter />
      </div>
    </>
  );
}
