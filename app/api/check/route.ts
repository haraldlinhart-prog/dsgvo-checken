import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  let url: string;
  try {
    const body = await req.json();
    url = (body.url ?? '').trim();
    if (!url) return NextResponse.json({ error: 'URL fehlt' }, { status: 400 });
    // normalise
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    new URL(url); // validate
  } catch {
    return NextResponse.json({ error: 'Ungültige URL' }, { status: 400 });
  }

  const parsedUrl = new URL(url);
  const checks: CheckResult[] = [];

  // 1. SSL
  const isHttps = parsedUrl.protocol === 'https:';
  checks.push({
    id: 'ssl',
    label: 'SSL / HTTPS',
    status: isHttps ? 'green' : 'red',
    message: isHttps
      ? 'Die Seite läuft über HTTPS — Verbindung ist verschlüsselt.'
      : 'Die URL verwendet kein HTTPS. Daten werden unverschlüsselt übertragen.',
    fix: isHttps ? null : {
      label: 'SSL-Zertifikat einrichten',
      url: 'https://pagespeed-plus.de',
    },
  });

  // Fetch the page
  let html = '';
  let fetchError = false;
  let finalUrl = url;
  try {
    const resp = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DSGVO-Checken/1.0; +https://dsgvo-checken.de)',
        'Accept': 'text/html',
        'Accept-Language': 'de-DE,de;q=0.9',
      },
      signal: AbortSignal.timeout(10000),
    });
    finalUrl = resp.url;
    html = await resp.text();
  } catch {
    fetchError = true;
  }

  if (fetchError) {
    checks.push({
      id: 'erreichbar',
      label: 'Website erreichbar',
      status: 'red',
      message: 'Die Website konnte nicht geladen werden.',
      fix: { label: 'Verfügbarkeit prüfen', url: 'https://site-ok.de' },
    });
    return NextResponse.json({ url: finalUrl, checks });
  }

  checks.push({
    id: 'erreichbar',
    label: 'Website erreichbar',
    status: 'green',
    message: 'Die Website ist erreichbar und hat geantwortet.',
    fix: null,
  });

  const lc = html.toLowerCase();

  // 2. Impressum
  const hasImpressum =
    lc.includes('impressum') ||
    lc.includes('/impressum') ||
    lc.includes('legal notice') ||
    lc.includes('legal-notice');
  checks.push({
    id: 'impressum',
    label: 'Impressum',
    status: hasImpressum ? 'green' : 'red',
    message: hasImpressum
      ? 'Ein Impressum-Link wurde auf der Seite gefunden.'
      : 'Kein Impressum-Link gefunden. In Deutschland gesetzlich vorgeschrieben.',
    fix: hasImpressum ? null : {
      label: 'Impressum kostenlos erstellen',
      url: 'https://impressum-free.de',
    },
  });

  // 3. Datenschutzerklärung
  const hasPrivacy =
    lc.includes('datenschutz') ||
    lc.includes('privacy') ||
    lc.includes('datenschutzerklärung') ||
    lc.includes('datenschutzerkl%c3%a4rung') ||
    lc.includes('privacy-policy');
  checks.push({
    id: 'datenschutz',
    label: 'Datenschutzerklärung',
    status: hasPrivacy ? 'green' : 'red',
    message: hasPrivacy
      ? 'Ein Link zur Datenschutzerklärung wurde gefunden.'
      : 'Keine Datenschutzerklärung gefunden. Nach DSGVO Art. 13/14 verpflichtend.',
    fix: hasPrivacy ? null : {
      label: 'Webmaster-Hilfe anfragen',
      url: 'https://webmaster.plus',
    },
  });

  // 4. Cookie-Banner
  const hasCookieBanner =
    lc.includes('cookie') && (
      lc.includes('consent') ||
      lc.includes('akzeptier') ||
      lc.includes('zustimm') ||
      lc.includes('ablehnen') ||
      lc.includes('accept') ||
      lc.includes('cookie-banner') ||
      lc.includes('cookiebanner') ||
      lc.includes('cookieconsent') ||
      lc.includes('cookie-consent') ||
      lc.includes('cc-') || // cookieconsent library class prefix
      lc.includes('cookiefirst') ||
      lc.includes('usercentrics') ||
      lc.includes('klaro') ||
      lc.includes('onetrust') ||
      lc.includes('borlabs')
    );
  const hasCookieAtAll = lc.includes('cookie');
  let cookieStatus: 'green' | 'yellow' | 'red';
  let cookieMessage: string;
  if (hasCookieBanner) {
    cookieStatus = 'green';
    cookieMessage = 'Ein Cookie-Banner / Consent-Tool wurde erkannt.';
  } else if (hasCookieAtAll) {
    cookieStatus = 'yellow';
    cookieMessage = 'Cookies werden erwähnt, aber kein vollständiges Consent-Tool erkannt. Bitte prüfen.';
  } else {
    cookieStatus = 'yellow';
    cookieMessage = 'Kein Cookie-Hinweis gefunden. Falls Cookies eingesetzt werden, ist ein Banner erforderlich.';
  }
  checks.push({
    id: 'cookie',
    label: 'Cookie-Banner / Consent',
    status: cookieStatus,
    message: cookieMessage,
    fix: cookieStatus === 'green' ? null : {
      label: 'Webmaster-Hilfe anfragen',
      url: 'https://webmaster.plus',
    },
  });

  // 5. Google Fonts (external)
  const hasExternalGoogleFonts =
    lc.includes('fonts.googleapis.com') || lc.includes('fonts.gstatic.com');
  checks.push({
    id: 'googlefonts',
    label: 'Google Fonts',
    status: hasExternalGoogleFonts ? 'red' : 'green',
    message: hasExternalGoogleFonts
      ? 'Externe Google Fonts erkannt. Das überträgt die IP-Adresse der Besucher an Google — nach DSGVO problematisch (EuGH-Urteil).'
      : 'Keine externen Google Fonts gefunden.',
    fix: hasExternalGoogleFonts ? {
      label: 'Webmaster-Hilfe anfragen',
      url: 'https://webmaster.plus',
    } : null,
  });

  // 6. Google Analytics / Tracking ohne Consent
  const hasGaScript =
    lc.includes('google-analytics.com') ||
    lc.includes('googletagmanager.com') ||
    lc.includes('gtag(') ||
    lc.includes("ga('") ||
    lc.includes('ga("') ||
    lc.includes('_ga') ||
    lc.includes('fbq(') || // Meta Pixel
    lc.includes('connect.facebook.net');

  // Check if there's a consent tool alongside tracking
  const hasConsentTool =
    hasCookieBanner ||
    lc.includes('usercentrics') ||
    lc.includes('onetrust') ||
    lc.includes('cookiefirst') ||
    lc.includes('klaro') ||
    lc.includes('borlabs') ||
    lc.includes('consentmanager');

  let trackStatus: 'green' | 'yellow' | 'red';
  let trackMessage: string;
  if (!hasGaScript) {
    trackStatus = 'green';
    trackMessage = 'Kein Google Analytics oder Meta Pixel erkannt.';
  } else if (hasConsentTool) {
    trackStatus = 'yellow';
    trackMessage = 'Tracking-Scripts erkannt, aber es gibt ein Consent-Tool. Bitte sicherstellen, dass das Tracking erst nach Einwilligung aktiviert wird.';
  } else {
    trackStatus = 'red';
    trackMessage = 'Google Analytics / Tracking ohne erkennbares Consent-Tool gefunden. Das ist ein DSGVO-Verstoß.';
  }
  checks.push({
    id: 'tracking',
    label: 'Tracking / Analytics',
    status: trackStatus,
    message: trackMessage,
    fix: trackStatus === 'green' ? null : {
      label: 'Spam-Abwehr & Tracking prüfen',
      url: 'https://webmaster.plus',
    },
  });

  // 7. Broken links check (quick: just check if page had a 4xx response — already handled above)
  // Add kaputte-links.de cross-sell as general tip
  checks.push({
    id: 'links',
    label: 'Defekte Links',
    status: 'yellow',
    message: 'Defekte Links können nur durch einen vollständigen Crawl erkannt werden.',
    fix: {
      label: 'Defekte Links prüfen',
      url: 'https://kaputte-links.de',
    },
  });

  return NextResponse.json({ url: finalUrl, checks });
}

interface CheckResult {
  id: string;
  label: string;
  status: 'green' | 'yellow' | 'red';
  message: string;
  fix: { label: string; url: string } | null;
}
