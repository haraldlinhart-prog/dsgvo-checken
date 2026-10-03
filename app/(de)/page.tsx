import type { Metadata } from 'next';
import CheckForm from '../CheckForm';
import ImpressumWidget from '../ImpressumWidget';
import SiteHeader from '../SiteHeader';
import { alternates } from '../i18n';

export const metadata: Metadata = {
  alternates: alternates('/', '/en'),
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
          <a className="ctaBtn" href="https://webmaster.plus" target="_blank" rel="noopener noreferrer">
            Zu webmaster.plus →
          </a>
        </section>

        <footer className="footer">
          <p>
            Ein Tool von{' '}
            <a href="https://webmaster.plus" target="_blank" rel="noopener noreferrer">webmaster.plus</a>
            {' '}· Teil des{' '}
            <a href="https://www.pan21.info" target="_blank" rel="noopener noreferrer">PAN21-Netzwerks</a>
            {' '}·{' '}
            <ImpressumWidget />
            {' '}·{' '}
            <a href="/datenschutz">Datenschutz</a>
            {' '}·{' '}
            <a href="/kontakt">Kontakt</a>
            {' '}·{' '}
            <a href="/blog">Blog</a>
          </p>
        </footer>
      </div>
    </>
  );
}
