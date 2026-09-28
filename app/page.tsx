import CheckForm from './CheckForm';

export default function Home() {
  return (
    <>
      <header className="header">
        <div className="wrap">
          <a className="header-logo" href="/">
            🔒 <span>DSGVO</span>-checken.de
          </a>
        </div>
      </header>

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
            <a href="https://webmaster.plus" target="_blank" rel="noopener noreferrer">Impressum & Datenschutz</a>
          </p>
        </footer>
      </div>
    </>
  );
}
