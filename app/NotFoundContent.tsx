import SiteFooter from './SiteFooter';
import SiteHeader from './SiteHeader';
import type { Lang } from './i18n';

const TEXT = {
  de: {
    title: 'Seite nicht gefunden',
    text: 'Die aufgerufene Seite existiert nicht oder wurde verschoben. Prüfen Sie die Adresse oder starten Sie direkt den kostenlosen DSGVO-Check.',
    home: 'Zum DSGVO-Check',
    homeHref: '/',
    other: 'English version',
    otherHref: '/en',
    otherLang: 'en',
  },
  en: {
    title: 'Page not found',
    text: 'The page you requested does not exist or has been moved. Check the address or go straight to the free GDPR check.',
    home: 'Go to the GDPR check',
    homeHref: '/en',
    other: 'Deutsche Version',
    otherHref: '/',
    otherLang: 'de',
  },
} as const;

/** Styled 404 page content, used by the not-found files of both route groups. */
export default function NotFoundContent({ lang }: { lang: Lang }) {
  const t = TEXT[lang];
  return (
    <>
      <SiteHeader lang={lang} deHref="/" enHref="/en" />
      <main>
        <section className="notFound">
          <div className="wrap">
            <p className="notFoundCode" aria-hidden="true">404</p>
            <h1>{t.title}</h1>
            <p>{t.text}</p>
            <div className="notFoundLinks">
              <a className="ctaBtn" href={t.homeHref}>{t.home}</a>
              <a className="ghostBtn" href={t.otherHref} hrefLang={t.otherLang} lang={t.otherLang}>
                {t.other}
              </a>
            </div>
          </div>
        </section>
      </main>
      <div className="wrap">
        <SiteFooter lang={lang} />
      </div>
    </>
  );
}
