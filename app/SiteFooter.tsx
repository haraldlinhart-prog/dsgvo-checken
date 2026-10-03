import ImpressumWidget from './ImpressumWidget';
import type { Lang } from './i18n';

/**
 * Shared footer for all pages. The seal below the links is the site's own
 * dynamic badge — dsgvo-checken.de embeds the same seal it asks others to
 * embed, so its own check finds it (absolute URL on purpose).
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
        <ImpressumWidget lang={lang} />
        {' '}·{' '}
        {en ? (
          <a href="/datenschutz" hrefLang="de">Privacy policy (German)</a>
        ) : (
          <a href="/datenschutz">Datenschutz</a>
        )}
        {' '}·{' '}
        <a href={en ? '/en/contact' : '/kontakt'}>{en ? 'Contact' : 'Kontakt'}</a>
      </p>
      <p className="footerSeal">
        <a
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
      </p>
    </footer>
  );
}
