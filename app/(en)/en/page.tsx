import type { Metadata } from 'next';
import CheckForm from '../../CheckForm';
import ImpressumWidget from '../../ImpressumWidget';
import SiteHeader from '../../SiteHeader';
import { alternates } from '../../i18n';

export const metadata: Metadata = {
  alternates: alternates('/', '/en'),
};

export default function HomeEn() {
  return (
    <>
      <SiteHeader lang="en" deHref="/" enHref="/en" />

      <main>
        <section className="hero">
          <div className="wrap">
            <h1>Is your website GDPR compliant?</h1>
            <p>
              Free quick check: enter your URL and see the results instantly — privacy policy,
              legal notice, cookie banner, Google Fonts, tracking and more.
            </p>
            <CheckForm lang="en" />
          </div>
        </section>
      </main>

      <div className="wrap">
        <section className="cta">
          <h2>Need professional help?</h2>
          <p>
            We&apos;re real webmasters — servers, domains, databases, forms, automation.
            Describe your problem and name your price.
          </p>
          <a className="ctaBtn" href="https://webmaster.plus" target="_blank" rel="noopener noreferrer">
            Go to webmaster.plus →
          </a>
        </section>

        <footer className="footer">
          <p>
            A tool by{' '}
            <a href="https://webmaster.plus" target="_blank" rel="noopener noreferrer">webmaster.plus</a>
            {' '}· Part of the{' '}
            <a href="https://www.pan21.info" target="_blank" rel="noopener noreferrer">PAN21 network</a>
            {' '}·{' '}
            <ImpressumWidget lang="en" />
            {' '}·{' '}
            <a href="/datenschutz" hrefLang="de">Privacy policy (German)</a>
            {' '}·{' '}
            <a href="/en/contact">Contact</a>
          </p>
        </footer>
      </div>
    </>
  );
}
