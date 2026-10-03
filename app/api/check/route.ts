import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const SUPABASE_URL = 'https://frbvsdumltlzisddrlbi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYnZzZHVtbHRsemlzZGRybGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNTk4NDQsImV4cCI6MjA5NzgzNTg0NH0.8Vrrs8tIyjdGrD3xGoQ3lkpv4G3LBvy4bpeXpaQ8OGY';

interface CheckResult {
  id: string;
  label: string;
  status: 'green' | 'yellow' | 'red';
  message: string;
  fix: { label: string; url: string } | null;
}

type Lang = 'de' | 'en';

// All human-readable texts of the checker. German is the default.
const T = {
  de: {
    urlMissing: 'URL fehlt',
    urlInvalid: 'Ungültige URL',
    sslLabel: 'SSL / HTTPS',
    sslOk: 'Die Seite läuft über HTTPS — Verbindung ist verschlüsselt.',
    sslBad: 'Die URL verwendet kein HTTPS. Daten werden unverschlüsselt übertragen.',
    sslFix: 'SSL-Zertifikat einrichten',
    reachLabel: 'Website erreichbar',
    reachBad: 'Die Website konnte nicht geladen werden.',
    reachFix: 'Verfügbarkeit prüfen',
    reachOk: 'Die Website ist erreichbar und hat geantwortet.',
    sealTitle: 'DSGVO-geprüft von dsgvo-checken.de',
    sealAlt: 'DSGVO-geprüft',
    impLabel: 'Impressum',
    impOk: 'Ein Impressum-Link wurde auf der Seite gefunden.',
    impBad: 'Kein Impressum-Link gefunden. In Deutschland gesetzlich vorgeschrieben.',
    impFix: 'Impressum kostenlos erstellen',
    privLabel: 'Datenschutzerklärung',
    privOk: 'Ein Link zur Datenschutzerklärung wurde gefunden.',
    privBad: 'Keine Datenschutzerklärung gefunden. Nach DSGVO Art. 13/14 verpflichtend.',
    helpFix: 'Webmaster-Hilfe anfragen',
    cookieLabel: 'Cookie-Banner / Consent',
    cookieOk: 'Ein Cookie-Banner / Consent-Tool wurde erkannt.',
    cookiePartial: 'Cookies werden erwähnt, aber kein vollständiges Consent-Tool erkannt. Bitte prüfen.',
    cookieNone: 'Kein Cookie-Hinweis gefunden. Falls Cookies eingesetzt werden, ist ein Banner erforderlich.',
    fontsLabel: 'Google Fonts',
    fontsBad:
      'Externe Google Fonts erkannt. Das überträgt die IP-Adresse der Besucher an Google — nach DSGVO problematisch (EuGH-Urteil).',
    fontsOk: 'Keine externen Google Fonts gefunden.',
    trackLabel: 'Tracking / Analytics',
    trackNone: 'Kein Google Analytics oder Meta Pixel erkannt.',
    trackConsent:
      'Tracking-Scripts erkannt, aber es gibt ein Consent-Tool. Bitte sicherstellen, dass das Tracking erst nach Einwilligung aktiviert wird.',
    trackBad: 'Google Analytics / Tracking ohne erkennbares Consent-Tool gefunden. Das ist ein DSGVO-Verstoß.',
    linksLabel: 'Defekte Links',
    linksMsg: 'Defekte Links können nur durch einen vollständigen Crawl erkannt werden.',
    linksFix: 'Defekte Links prüfen',
  },
  en: {
    urlMissing: 'Please enter a URL.',
    urlInvalid: 'Invalid URL',
    sslLabel: 'SSL / HTTPS',
    sslOk: 'The site is served over HTTPS — the connection is encrypted.',
    sslBad: 'The URL does not use HTTPS. Data is transmitted unencrypted.',
    sslFix: 'Set up an SSL certificate',
    reachLabel: 'Website reachable',
    reachBad: 'The website could not be loaded.',
    reachFix: 'Check availability',
    reachOk: 'The website is reachable and responded.',
    sealTitle: 'GDPR-checked by dsgvo-checken.de',
    sealAlt: 'GDPR-checked',
    impLabel: 'Legal notice (Impressum)',
    impOk: 'A link to a legal notice (Impressum) was found on the page.',
    impBad:
      'No legal notice (Impressum) link found. German law requires one for most websites aimed at German visitors.',
    impFix: 'Create a free Impressum',
    privLabel: 'Privacy policy',
    privOk: 'A link to a privacy policy was found.',
    privBad: 'No privacy policy found. It is mandatory under Articles 13 and 14 GDPR.',
    helpFix: 'Get help from a webmaster',
    cookieLabel: 'Cookie banner / consent',
    cookieOk: 'A cookie banner / consent management tool was detected.',
    cookiePartial:
      'Cookies are mentioned, but no complete consent tool was detected. Please double-check.',
    cookieNone: 'No cookie notice found. If your site uses cookies, you need a consent banner.',
    fontsLabel: 'Google Fonts',
    fontsBad:
      "External Google Fonts detected. This sends your visitors' IP addresses to Google, which is problematic under the GDPR (as German courts have ruled).",
    fontsOk: 'No external Google Fonts found.',
    trackLabel: 'Tracking / analytics',
    trackNone: 'No Google Analytics or Meta Pixel detected.',
    trackConsent:
      'Tracking scripts detected, but there is a consent tool. Make sure tracking only starts after visitors have given their consent.',
    trackBad: 'Google Analytics / tracking found without any recognizable consent tool. This violates the GDPR.',
    linksLabel: 'Broken links',
    linksMsg: 'Broken links can only be detected with a full crawl of your site.',
    linksFix: 'Check for broken links',
  },
};

async function supabaseUpsert(domain: string, badgeVerified: boolean, checks: CheckResult[]) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/dsgvo_checks`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        domain,
        badge_verified: badgeVerified,
        last_checked_at: new Date().toISOString(),
        check_results: checks,
      }),
    });
  } catch {
    // non-fatal
  }
}

export async function POST(req: NextRequest) {
  let url: string;
  let t = T.de;
  try {
    const body = await req.json();
    const lang: Lang = body.lang === 'en' ? 'en' : 'de';
    t = T[lang];
    url = (body.url ?? '').trim();
    if (!url) return NextResponse.json({ error: t.urlMissing }, { status: 400 });
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    new URL(url); // validate
  } catch {
    return NextResponse.json({ error: t.urlInvalid }, { status: 400 });
  }

  const parsedUrl = new URL(url);
  const domain = parsedUrl.hostname.replace(/^www\./, '');
  const checks: CheckResult[] = [];

  // 1. SSL
  const isHttps = parsedUrl.protocol === 'https:';
  checks.push({
    id: 'ssl',
    label: t.sslLabel,
    status: isHttps ? 'green' : 'red',
    message: isHttps ? t.sslOk : t.sslBad,
    fix: isHttps ? null : { label: t.sslFix, url: 'https://pagespeed-plus.de' },
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
        Accept: 'text/html',
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
      label: t.reachLabel,
      status: 'red',
      message: t.reachBad,
      fix: { label: t.reachFix, url: 'https://site-ok.de' },
    });
    return NextResponse.json({ url: finalUrl, checks });
  }

  checks.push({
    id: 'erreichbar',
    label: t.reachLabel,
    status: 'green',
    message: t.reachOk,
    fix: null,
  });

  const lc = html.toLowerCase();

  // --- Badge / Siegel check ---
  // Look for either the siegel PNG or the dynamic SVG badge
  const hasBadge =
    lc.includes('dsgvo-checken.de/siegel.png') ||
    lc.includes(`dsgvo-checken.de/badge/${domain}`) ||
    lc.includes(`dsgvo-checken.de/badge/www.${domain}`);

  const siegelHtml = `<a href="https://dsgvo-checken.de" target="_blank" rel="noopener noreferrer" title="${t.sealTitle}">\n  <img src="https://dsgvo-checken.de/siegel.png" alt="${t.sealAlt}" width="120" height="120">\n</a>`;

  if (!hasBadge) {
    // Register domain (unverified) so the dynamic badge SVG is served
    await supabaseUpsert(domain, false, []);
    return NextResponse.json({
      requiresBadge: true,
      domain,
      badgeUrl: `https://dsgvo-checken.de/badge/${domain}.svg`,
      badgeHtml: siegelHtml,
    });
  }

  // 2. Impressum
  const hasImpressum =
    lc.includes('impressum') ||
    lc.includes('/impressum') ||
    lc.includes('legal notice') ||
    lc.includes('legal-notice');
  checks.push({
    id: 'impressum',
    label: t.impLabel,
    status: hasImpressum ? 'green' : 'red',
    message: hasImpressum ? t.impOk : t.impBad,
    fix: hasImpressum ? null : { label: t.impFix, url: 'https://impressum-free.de' },
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
    label: t.privLabel,
    status: hasPrivacy ? 'green' : 'red',
    message: hasPrivacy ? t.privOk : t.privBad,
    fix: hasPrivacy ? null : { label: t.helpFix, url: 'https://webmaster.plus' },
  });

  // 4. Cookie-Banner
  const hasCookieBanner =
    lc.includes('cookie') &&
    (lc.includes('consent') ||
      lc.includes('akzeptier') ||
      lc.includes('zustimm') ||
      lc.includes('ablehnen') ||
      lc.includes('accept') ||
      lc.includes('cookie-banner') ||
      lc.includes('cookiebanner') ||
      lc.includes('cookieconsent') ||
      lc.includes('cookie-consent') ||
      lc.includes('cc-') ||
      lc.includes('cookiefirst') ||
      lc.includes('usercentrics') ||
      lc.includes('klaro') ||
      lc.includes('onetrust') ||
      lc.includes('borlabs'));
  const hasCookieAtAll = lc.includes('cookie');
  let cookieStatus: 'green' | 'yellow' | 'red';
  let cookieMessage: string;
  if (hasCookieBanner) {
    cookieStatus = 'green';
    cookieMessage = t.cookieOk;
  } else if (hasCookieAtAll) {
    cookieStatus = 'yellow';
    cookieMessage = t.cookiePartial;
  } else {
    cookieStatus = 'yellow';
    cookieMessage = t.cookieNone;
  }
  checks.push({
    id: 'cookie',
    label: t.cookieLabel,
    status: cookieStatus,
    message: cookieMessage,
    fix: cookieStatus === 'green' ? null : { label: t.helpFix, url: 'https://webmaster.plus' },
  });

  // 5. Google Fonts (external)
  const hasExternalGoogleFonts =
    lc.includes('fonts.googleapis.com') || lc.includes('fonts.gstatic.com');
  checks.push({
    id: 'googlefonts',
    label: t.fontsLabel,
    status: hasExternalGoogleFonts ? 'red' : 'green',
    message: hasExternalGoogleFonts ? t.fontsBad : t.fontsOk,
    fix: hasExternalGoogleFonts ? { label: t.helpFix, url: 'https://webmaster.plus' } : null,
  });

  // 6. Tracking / Analytics
  const hasGaScript =
    lc.includes('google-analytics.com') ||
    lc.includes('googletagmanager.com') ||
    lc.includes('gtag(') ||
    lc.includes("ga('") ||
    lc.includes('ga("') ||
    lc.includes('_ga') ||
    lc.includes('fbq(') ||
    lc.includes('connect.facebook.net');
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
    trackMessage = t.trackNone;
  } else if (hasConsentTool) {
    trackStatus = 'yellow';
    trackMessage = t.trackConsent;
  } else {
    trackStatus = 'red';
    trackMessage = t.trackBad;
  }
  checks.push({
    id: 'tracking',
    label: t.trackLabel,
    status: trackStatus,
    message: trackMessage,
    fix: trackStatus === 'green' ? null : { label: t.helpFix, url: 'https://webmaster.plus' },
  });

  // 7. Defekte Links (cross-sell)
  checks.push({
    id: 'links',
    label: t.linksLabel,
    status: 'yellow',
    message: t.linksMsg,
    fix: { label: t.linksFix, url: 'https://kaputte-links.de' },
  });

  // Save to Supabase
  await supabaseUpsert(domain, true, checks);

  return NextResponse.json({ url: finalUrl, checks });
}
