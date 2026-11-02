import ImpressumWidget from './ImpressumWidget';
import type { Lang } from './i18n';

/**
 * Shared footer for all pages. Second row: the impressum-free.de widget
 * (Impressum link + seal) next to the site's own dynamic DSGVO badge —
 * dsgvo-checken.de embeds the same seal it asks others to embed, so its own
 * check finds it (absolute URL on purpose).
 */
export default function SiteFooter({ lang = 'de' }: { lang?: Lang }) {
  const en = lang === 'en';
  return (
    <footer className="footer">
      <p>
        {en ? 'A tool by' : 'Ein Tool von'}{' '}
        <a href="https://www.webmaster.plus" target="_blank" rel="noopener noreferrer">webmaster.plus</a>
        {' '}· {en ? 'Part of the' : 'Teil des'}{' '}
        <a href="https://www.pan21.info" target="_blank" rel="noopener noreferrer">
          {en ? 'PAN21 network' : 'PAN21-Netzwerks'}
        </a>
        {' '}·{' '}
        {en ? (
          <a href="/datenschutz" hrefLang="de">Privacy policy (German)</a>
        ) : (
          <a href="/datenschutz">Datenschutz</a>
        )}
        {' '}·{' '}
        <a href={en ? '/en/contact' : '/kontakt'}>{en ? 'Contact' : 'Kontakt'}</a>
      </p>
      <div className="footerSeals">
        <ImpressumWidget lang={lang} />
        <a
          className="footerBadge"
          href="https://www.dsgvo-checken.de/"
          title={en ? 'GDPR-checked by dsgvo-checken.de' : 'DSGVO-geprüft von dsgvo-checken.de'}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://www.dsgvo-checken.de/badge/dsgvo-checken.de.svg"
            alt={en ? 'GDPR-checked: dsgvo-checken.de' : 'DSGVO-geprüft: dsgvo-checken.de'}
            width="220"
            height="54"
            loading="lazy"
          />
        </a>
      </div>
      {/* Verzeichnis-Banner: Swiss Quality, German Quality, FFA-Links */}
      <div style={{ display:"flex", justifyContent:"center", gap:"12px", flexWrap:"wrap", margin:"1rem 0 0" }}>
        <a href="https://www.swiss-quality.de/ref/cfaba43831e4febf02" target="_blank" rel="noopener"><img src="https://www.swiss-quality.de/banner.svg" width="120" height="60" alt="Swiss Quality" /></a>
        <a href="https://www.german-quality.net/ref/bd0c3ec784766785dc" target="_blank" rel="noopener"><img src="https://www.german-quality.net/banner.svg" width="120" height="60" alt="German Quality" /></a>
        <a href="https://www.ffa-links.de/ref/69378396404ec98ca4" target="_blank" rel="noopener"><img src="https://www.ffa-links.de/banner.svg" width="120" height="60" alt="FFA-Links" /></a>
      </div>
    </footer>
  );
}
