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
  try {
    const body = await req.json();
    url = (body.url ?? '').trim();
    if (!url) return NextResponse.json({ error: 'URL fehlt' }, { status: 400 });
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    new URL(url); // validate
  } catch {
    return NextResponse.json({ error: 'Ungültige URL' }, { status: 400 });
  }

  const parsedUrl = new URL(url);
  const domain = parsedUrl.hostname.replace(/^www\./, '');
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
    fix: isHttps ? null : { label: 'SSL-Zertifikat einrichten', url: 'https://pagespeed-plus.de' },
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

  // --- Badge / Siegel check ---
  // Look for either the siegel PNG or the dynamic SVG badge
  const hasBadge =
    lc.includes('dsgvo-checken.de/siegel.png') ||
    lc.includes(`dsgvo-checken.de/badge/${domain}`) ||
    lc.includes(`dsgvo-checken.de/badge/www.${domain}`);

  const siegelHtml = `<a href="https://dsgvo-checken.de" target="_blank" rel="noopener noreferrer" title="DSGVO-geprüft von dsgvo-checken.de">\n  <img src="https://dsgvo-checken.de/siegel.png" alt="DSGVO-geprüft" width="120" height="120">\n</a>`;

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
    label: 'Impressum',
    status: hasImpressum ? 'green' : 'red',
    message: hasImpressum
      ? 'Ein Impressum-Link wurde auf der Seite gefunden.'
      : 'Kein Impressum-Link gefunden. In Deutschland gesetzlich vorgeschrieben.',
    fix: hasImpressum ? null : { label: 'Impressum kostenlos erstellen', url: 'https://impressum-free.de' },
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
    fix: hasPrivacy ? null : { label: 'Webmaster-Hilfe anfragen', url: 'https://webmaster.plus' },
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
    fix: cookieStatus === 'green' ? null : { label: 'Webmaster-Hilfe anfragen', url: 'https://webmaster.plus' },
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
    fix: hasExternalGoogleFonts ? { label: 'Webmaster-Hilfe anfragen', url: 'https://webmaster.plus' } : null,
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
    trackMessage = 'Kein Google Analytics oder Meta Pixel erkannt.';
  } else if (hasConsentTool) {
    trackStatus = 'yellow';
    trackMessage =
      'Tracking-Scripts erkannt, aber es gibt ein Consent-Tool. Bitte sicherstellen, dass das Tracking erst nach Einwilligung aktiviert wird.';
  } else {
    trackStatus = 'red';
    trackMessage =
      'Google Analytics / Tracking ohne erkennbares Consent-Tool gefunden. Das ist ein DSGVO-Verstoß.';
  }
  checks.push({
    id: 'tracking',
    label: 'Tracking / Analytics',
    status: trackStatus,
    message: trackMessage,
    fix: trackStatus === 'green' ? null : { label: 'Webmaster-Hilfe anfragen', url: 'https://webmaster.plus' },
  });

  // 7. Defekte Links (cross-sell)
  checks.push({
    id: 'links',
    label: 'Defekte Links',
    status: 'yellow',
    message: 'Defekte Links können nur durch einen vollständigen Crawl erkannt werden.',
    fix: { label: 'Defekte Links prüfen', url: 'https://kaputte-links.de' },
  });

  // Save to Supabase
  await supabaseUpsert(domain, true, checks);

  return NextResponse.json({ url: finalUrl, checks });
}
