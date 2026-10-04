import { SITE_URL, type Lang } from './i18n';

/**
 * Server-rendered explanation + FAQ below the check form, plus the matching
 * JSON-LD (WebApplication + FAQPage). Crawlers that don't run JavaScript
 * (GPTBot, PerplexityBot, ClaudeBot …) see this text in the initial HTML.
 * The FAQ in the JSON-LD is built from the same strings as the visible FAQ,
 * so both always match word for word.
 *
 * Only describe checks that really exist in app/api/check/route.ts.
 */

interface Faq {
  q: string;
  a: string;
  /** Optional: a phrase inside `a` that is rendered as a link (text stays identical). */
  link?: { text: string; href: string };
}

interface InfoText {
  appName: string;
  appDescription: string;
  pageUrl: string;
  whatTitle: string;
  whatIntro: string;
  checks: { label: string; text: string }[];
  linksNote: string;
  howTitle: string;
  how: string[];
  whoTitle: string;
  who: string;
  disclaimerLabel: string;
  disclaimer: string;
  faqTitle: string;
  faqs: Faq[];
}

const TEXT: Record<Lang, InfoText> = {
  de: {
    appName: 'DSGVO-Check von dsgvo-checken.de',
    appDescription:
      'Kostenloser, automatisierter technischer DSGVO-Check für Websites: prüft HTTPS, Erreichbarkeit, Impressum- und Datenschutz-Links, Cookie-Banner, externe Google Fonts sowie Google Analytics, Google Tag Manager und Meta Pixel. Ersetzt keine Rechtsberatung.',
    pageUrl: `${SITE_URL}/`,
    whatTitle: 'Was prüft der DSGVO-Check?',
    whatIntro:
      'dsgvo-checken.de ruft die von Ihnen eingegebene Seite auf und durchsucht ihren HTML-Quelltext automatisch nach typischen technischen Datenschutz-Merkmalen. Das Ergebnis erscheint als Ampel: Grün ist unauffällig, Gelb ein Hinweis, Rot ein Problem.',
    checks: [
      { label: 'SSL / HTTPS', text: 'Wird die Seite – auch nach Weiterleitungen – verschlüsselt ausgeliefert?' },
      { label: 'Erreichbarkeit', text: 'Antwortet die Website innerhalb von zehn Sekunden?' },
      { label: 'Impressum', text: 'Wird auf der Seite ein Impressum erwähnt oder verlinkt?' },
      { label: 'Datenschutzerklärung', text: 'Gibt es einen Hinweis oder Link auf eine Datenschutzerklärung?' },
      {
        label: 'Cookie-Banner / Consent',
        text: 'Ist ein Cookie-Hinweis oder ein bekanntes Consent-Tool wie Usercentrics, OneTrust, Cookiefirst, Klaro oder Borlabs erkennbar?',
      },
      { label: 'Google Fonts', text: 'Werden Schriften extern von Google-Servern geladen?' },
      {
        label: 'Tracking / Analytics',
        text: 'Sind Google Analytics, der Google Tag Manager oder das Meta Pixel eingebunden – und ist dazu ein Consent-Tool erkennbar?',
      },
    ],
    linksNote:
      'Defekte Links lassen sich nur mit einem vollständigen Crawl finden. Dafür verweist der Check auf unser separates Tool kaputte-links.de.',
    howTitle: 'So funktioniert der Check',
    how: [
      'Geben Sie die Adresse Ihrer Website ein. Beim ersten Aufruf erhalten Sie einen kurzen HTML-Code für das Siegel von dsgvo-checken.de, den Sie zum Beispiel im Footer oder auf Ihrer Datenschutzseite einfügen.',
      'Sobald das Siegel auf der Seite gefunden wird, startet die vollständige Auswertung. Zu jedem Punkt sehen Sie eine kurze Erklärung und, wo sinnvoll, einen Link zu passender Hilfe. Das Siegel zeigt das Datum des letzten Checks an. Eine Anmeldung ist nicht nötig.',
    ],
    whoTitle: 'Für wen ist der Check gedacht?',
    who:
      'Für Website-Betreiber, Selbstständige, kleine Unternehmen und Vereine ebenso wie für Webdesigner und Agenturen, die schnell einen ersten technischen Überblick brauchen – etwa nach einem Relaunch, vor dem Livegang einer neuen Seite oder wenn neue Dienste eingebunden wurden.',
    disclaimerLabel: 'Wichtig:',
    disclaimer:
      'Der DSGVO-Check ist eine automatisierte technische Prüfung einzelner Merkmale im Quelltext einer Seite. Er ersetzt keine Rechtsberatung und kann nicht feststellen, ob Ihre Website insgesamt den Anforderungen der DSGVO entspricht.',
    faqTitle: 'Häufige Fragen',
    faqs: [
      {
        q: 'Ist der DSGVO-Check kostenlos?',
        a: 'Ja. Der Check ist kostenlos und ohne Anmeldung nutzbar. Voraussetzung für die vollständige Auswertung ist lediglich, dass das Siegel von dsgvo-checken.de auf der geprüften Website eingebunden ist.',
      },
      {
        q: 'Warum muss ich das Siegel einbinden?',
        a: 'Die vollständige Auswertung startet erst, wenn das Siegel auf der geprüften Seite gefunden wird. Das Siegel verlinkt auf dsgvo-checken.de und zeigt das Datum des letzten Checks an. Solange es eingebunden ist, können Sie jederzeit einen neuen Check starten.',
      },
      {
        q: 'Ist meine Website nach einem grünen Ergebnis DSGVO-konform?',
        a: 'Das lässt sich automatisiert nicht feststellen. Der Check sucht im Quelltext nach typischen Merkmalen wie einem Impressum-Link, einem Cookie-Banner oder eingebundenen Tracking-Diensten. Ob Ihre Datenschutzerklärung inhaltlich vollständig ist oder Ihr Consent-Tool richtig eingestellt ist, kann er nicht beurteilen. Für eine verbindliche Einschätzung holen Sie bitte rechtlichen Rat ein, etwa bei einer Anwaltskanzlei oder Ihrem Datenschutzbeauftragten.',
      },
      {
        q: 'Werden auch Unterseiten geprüft?',
        a: 'Nein. Geprüft wird genau die eingegebene Seite, in der Regel die Startseite. JavaScript wird dabei nicht ausgeführt – Inhalte, die erst im Browser nachgeladen werden, erkennt der Check daher nicht immer.',
      },
      {
        q: 'Welche Daten werden gespeichert?',
        a: 'Gespeichert werden nur der Domainname, ob das Siegel gefunden wurde, das Prüfergebnis und der Zeitpunkt der Prüfung, damit das Siegel das Prüfdatum anzeigen kann. Die vollständige URL wird nicht dauerhaft gespeichert. Details finden Sie in unserer Datenschutzerklärung.',
        link: { text: 'Datenschutzerklärung', href: '/datenschutz' },
      },
      {
        q: 'Warum werden Google Fonts als Problem angezeigt?',
        a: 'Werden Schriften direkt von Google-Servern geladen, überträgt der Browser die IP-Adresse Ihrer Besucher an Google. Das Landgericht München I hat das 2022 als Datenschutzverstoß gewertet. Abhilfe schafft in der Regel, die Schriften lokal auf dem eigenen Server bereitzustellen.',
      },
    ],
  },
  en: {
    appName: 'GDPR Check by dsgvo-checken.de',
    appDescription:
      'Free automated technical GDPR check for websites: tests HTTPS, reachability, legal notice and privacy policy links, cookie banners, external Google Fonts, plus Google Analytics, Google Tag Manager and Meta Pixel. Not a substitute for legal advice.',
    pageUrl: `${SITE_URL}/en`,
    whatTitle: 'What does the GDPR check look at?',
    whatIntro:
      'dsgvo-checken.de loads the page you enter and automatically scans its HTML source for common technical privacy issues. Results are shown as a traffic light: green means nothing stood out, yellow is a warning, red is an issue.',
    checks: [
      { label: 'SSL / HTTPS', text: 'Is the page served over an encrypted connection, including after redirects?' },
      { label: 'Reachability', text: 'Does the website respond within ten seconds?' },
      { label: 'Legal notice (Impressum)', text: 'Does the page mention or link to a legal notice?' },
      { label: 'Privacy policy', text: 'Is there a reference or link to a privacy policy?' },
      {
        label: 'Cookie banner / consent',
        text: 'Can we spot a cookie notice or a well-known consent tool such as Usercentrics, OneTrust, Cookiefirst, Klaro or Borlabs?',
      },
      { label: 'Google Fonts', text: "Are fonts loaded from Google's servers?" },
      {
        label: 'Tracking / analytics',
        text: 'Are Google Analytics, Google Tag Manager or the Meta Pixel embedded, and if so, is there a recognizable consent tool?',
      },
    ],
    linksNote:
      'Broken links can only be found with a full crawl of your site, so for those the check points you to our separate tool kaputte-links.de.',
    howTitle: 'How it works',
    how: [
      'Enter your website address. The first time, you get a short HTML snippet for the dsgvo-checken.de seal, which you add to your footer or privacy policy page, for example.',
      "As soon as the seal is found on the page, the full check runs. Every item comes with a short explanation and, where it helps, a link to a fix. The seal shows the date of your latest check. You don't need an account.",
    ],
    whoTitle: 'Who is it for?',
    who:
      'Website owners, freelancers, small businesses and associations, as well as web designers and agencies who want a quick technical overview – after a relaunch, before a new site goes live, or after adding new services to a site.',
    disclaimerLabel: 'Please note:',
    disclaimer:
      "The GDPR check is an automated technical scan of individual features in a page's source code. It is not legal advice and cannot tell you whether your website as a whole meets the requirements of the GDPR.",
    faqTitle: 'Frequently asked questions',
    faqs: [
      {
        q: 'Is the GDPR check free?',
        a: "Yes. The check is free and you don't need to sign up. The only requirement for the full results is that the dsgvo-checken.de seal is embedded on the website you are checking.",
      },
      {
        q: 'Why do I have to add the seal?',
        a: 'The full check only runs once the seal is found on the page. The seal links to dsgvo-checken.de and shows the date of your latest check. As long as it stays on your site, you can run a new check at any time.',
      },
      {
        q: 'Does an all-green result mean my website is GDPR compliant?',
        a: "That can't be determined automatically. The check looks for typical signs in the source code, such as a legal notice link, a cookie banner or embedded tracking services. It cannot judge whether your privacy policy is complete or whether your consent tool is set up correctly. For a reliable assessment, please talk to a lawyer or your data protection officer.",
      },
      {
        q: 'Are subpages checked too?',
        a: "No. Only the exact page you enter is checked – usually your homepage. JavaScript isn't executed, so content that is only loaded in the browser may not be detected.",
      },
      {
        q: 'What data do you store?',
        a: 'We only store the domain name, whether the seal was found, the result and the time of the check, so the seal can display the date. The full URL is not stored permanently. You can find the details in our privacy policy (German).',
        link: { text: 'privacy policy (German)', href: '/datenschutz' },
      },
      {
        q: 'Why are Google Fonts flagged as an issue?',
        a: "When fonts are loaded directly from Google's servers, your visitors' browsers send their IP addresses to Google. In 2022, the Munich Regional Court (Landgericht München I) ruled that this violates data protection law. The usual fix is to host the fonts on your own server.",
      },
    ],
  },
};

function jsonLd(lang: Lang) {
  const t = TEXT[lang];
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${t.pageUrl}#app`,
        name: t.appName,
        url: t.pageUrl,
        description: t.appDescription,
        applicationCategory: 'SecurityApplication',
        operatingSystem: 'Web',
        inLanguage: lang,
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        publisher: {
          '@type': 'Organization',
          name: 'PAN21.com International LLC',
          url: 'https://www.pan21.com',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${t.pageUrl}#faq`,
        url: t.pageUrl,
        inLanguage: lang,
        mainEntity: t.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
  // Escape "<" so the JSON can never close the <script> tag early.
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function Answer({ faq }: { faq: Faq }) {
  if (!faq.link) return <p>{faq.a}</p>;
  const i = faq.a.indexOf(faq.link.text);
  if (i < 0) return <p>{faq.a}</p>;
  return (
    <p>
      {faq.a.slice(0, i)}
      <a href={faq.link.href} hrefLang="de">{faq.link.text}</a>
      {faq.a.slice(i + faq.link.text.length)}
    </p>
  );
}

export default function InfoSection({ lang = 'de' }: { lang?: Lang }) {
  const t = TEXT[lang];
  return (
    <section className="info" aria-labelledby="info-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(lang) }} />
      <div className="wrap">
        <h2 id="info-title">{t.whatTitle}</h2>
        <p>{t.whatIntro}</p>
        <ul className="infoChecks">
          {t.checks.map((c) => (
            <li key={c.label}>
              <strong>{c.label}:</strong> {c.text}
            </li>
          ))}
        </ul>
        <p>{t.linksNote}</p>

        <h2>{t.howTitle}</h2>
        {t.how.map((p) => (
          <p key={p}>{p}</p>
        ))}

        <h2>{t.whoTitle}</h2>
        <p>{t.who}</p>

        <p className="infoNote">
          <strong>{t.disclaimerLabel}</strong> {t.disclaimer}
        </p>

        <h2>{t.faqTitle}</h2>
        <div className="faqList">
          {t.faqs.map((f) => (
            <div key={f.q} className="faqItem">
              <h3>{f.q}</h3>
              <Answer faq={f} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
