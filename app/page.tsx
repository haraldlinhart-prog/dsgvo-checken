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
      {/* <!-- IMPRESSUM:START --> */}
<div dangerouslySetInnerHTML={{__html: "\n<img src=\"//:0\" alt=\"\" style=\"display:none\" onerror=\"(function(){if(document.getElementById('pan21sixj2tta'))return;var m=document.createElement('meta');m.id='pan21sixj2tta';document.head.appendChild(m);(function(){var s=document.createElement('script');s.src=&quot;https://impressum-free.de/widget.js&quot;;document.head.appendChild(s);})();})();\">"}} />
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
            {/* Impressum-Widget: rendert "Impressum"-Link + Siegel via impressum-free.de */}
            <span id="impressum-free-widget" />
            {/* eslint-disable-next-line @next/next/no-sync-scripts */}
            <script src="https://impressum-free.de/widget.js" data-domain="dsgvo-checken.de" />
            {' '}·{' '}
            <a href="/kontakt">Kontakt</a>
          </p>
        </footer>
      </div>
    </>
  );
}
