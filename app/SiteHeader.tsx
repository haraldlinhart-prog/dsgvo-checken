import type { Lang } from './i18n';

/** Site header with logo and DE | EN language switch. */
export default function SiteHeader({
  lang,
  deHref,
  enHref,
}: {
  lang: Lang;
  deHref: string;
  enHref: string;
}) {
  return (
    <header className="header">
      <div className="wrap">
        <a className="header-logo" href={lang === 'en' ? '/en' : '/'}>
          🔒 <span>DSGVO</span>-checken.de
        </a>
        <nav className="langSwitch" aria-label={lang === 'en' ? 'Language' : 'Sprache'}>
          <a
            href={deHref}
            hrefLang="de"
            lang="de"
            className={lang === 'de' ? 'active' : undefined}
            aria-current={lang === 'de' ? 'page' : undefined}
            title="Deutsch"
          >
            DE
          </a>
          <span aria-hidden="true">|</span>
          <a
            href={enHref}
            hrefLang="en"
            lang="en"
            className={lang === 'en' ? 'active' : undefined}
            aria-current={lang === 'en' ? 'page' : undefined}
            title="English"
          >
            EN
          </a>
        </nav>
      </div>
    </header>
  );
}
