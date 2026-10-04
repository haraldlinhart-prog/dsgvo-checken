import type { Metadata } from 'next';
import CheckForm from '../../CheckForm';
import InfoSection from '../../InfoSection';
import SiteFooter from '../../SiteFooter';
import SiteHeader from '../../SiteHeader';
import { alternates } from '../../i18n';

export const metadata: Metadata = {
  alternates: alternates('/', '/en', '/en'),
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
        <InfoSection lang="en" />
      </main>

      <div className="wrap">
        <section className="cta">
          <h2>Need professional help?</h2>
          <p>
            We&apos;re real webmasters — servers, domains, databases, forms, automation.
            Describe your problem and name your price.
          </p>
          <a className="ctaBtn" href="https://www.webmaster.plus" target="_blank" rel="noopener noreferrer">
            Go to webmaster.plus →
          </a>
        </section>

        <SiteFooter lang="en" />
      </div>
    </>
  );
}
