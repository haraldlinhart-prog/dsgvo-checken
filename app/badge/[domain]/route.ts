import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const SUPABASE_URL = 'https://frbvsdumltlzisddrlbi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYnZzZHVtbHRsemlzZGRybGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNTk4NDQsImV4cCI6MjA5NzgzNTg0NH0.8Vrrs8tIyjdGrD3xGoQ3lkpv4G3LBvy4bpeXpaQ8OGY';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function makeSvg(domain: string, lastChecked: string | null, verified: boolean): string {
  const dateLine = verified && lastChecked ? `geprüft: ${formatDate(lastChecked)}` : 'noch nicht geprüft';
  const color = verified ? '#22c55e' : '#94a3b8';
  const bgColor = verified ? '#14532d' : '#1e293b';
  const label = verified ? 'DSGVO-geprüft' : 'DSGVO-Check';
  const domainShort = escXml(domain.length > 22 ? domain.slice(0, 20) + '…' : domain);
  const totalWidth = 220;
  const shieldX = 10;
  const textX = 42;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="54" role="img" aria-label="${label}: ${domainShort}">
  <title>${label}: ${domainShort}</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${bgColor}" stop-opacity="1"/>
      <stop offset="1" stop-color="#0f1117" stop-opacity="1"/>
    </linearGradient>
  </defs>
  <rect rx="8" width="${totalWidth}" height="54" fill="url(#bg)"/>
  <rect rx="8" width="${totalWidth}" height="54" fill="none" stroke="${color}" stroke-width="1.2" stroke-opacity="0.6"/>
  <!-- Shield icon -->
  <text x="${shieldX}" y="34" font-size="22" font-family="system-ui,sans-serif">🛡️</text>
  <!-- Label -->
  <text x="${textX}" y="20" font-family="system-ui,-apple-system,sans-serif" font-size="11" font-weight="700" fill="${color}" letter-spacing="0.5">${label}</text>
  <!-- Domain -->
  <text x="${textX}" y="34" font-family="system-ui,-apple-system,sans-serif" font-size="11" font-weight="600" fill="#e2e8f0">${domainShort}</text>
  <!-- Date -->
  <text x="${textX}" y="47" font-family="system-ui,-apple-system,sans-serif" font-size="9.5" fill="#94a3b8">${dateLine}</text>
</svg>`;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  const { domain: rawDomain } = await params;
  // strip .svg suffix if present
  const domain = rawDomain.replace(/\.svg$/, '').toLowerCase();

  // Query Supabase for this domain
  let verified = false;
  let lastChecked: string | null = null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/dsgvo_checks?domain=eq.${encodeURIComponent(domain)}&select=badge_verified,last_checked_at&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    if (res.ok) {
      const rows = await res.json();
      if (rows.length > 0) {
        verified = rows[0].badge_verified === true;
        lastChecked = rows[0].last_checked_at ?? null;
      }
    }
  } catch {
    // serve badge anyway
  }

  const svg = makeSvg(domain, lastChecked, verified);

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

function escXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
