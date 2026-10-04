import { ImageResponse } from 'next/og';
import type { Lang } from './i18n';

/**
 * Shared 1200x630 social preview image (og:image) for the DE and EN pages.
 * Colors match globals.css. Only Latin-1 characters in the text, so the
 * built-in default font covers everything and no font has to be fetched.
 */
export const OG_SIZE = { width: 1200, height: 630 };

const TEXT: Record<Lang, { claim: string; items: string; foot: string }> = {
  de: {
    claim: 'Kostenloser DSGVO-Check für Ihre Website',
    items: 'HTTPS · Impressum · Datenschutzerklärung · Cookie-Banner · Google Fonts · Tracking',
    foot: 'Sofort-Ergebnis · ohne Anmeldung',
  },
  en: {
    claim: 'Free GDPR check for your website',
    items: 'HTTPS · Legal notice · Privacy policy · Cookie banner · Google Fonts · Tracking',
    foot: 'Instant results · no sign-up',
  },
};

export function renderOgImage(lang: Lang) {
  const t = TEXT[lang];
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px 88px',
          background: 'linear-gradient(135deg, #0f1117 0%, #1a1d27 100%)',
          color: '#e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
          <svg width="88" height="88" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2 L20 5 V11 C20 16 16.6 20.2 12 22 C7.4 20.2 4 16 4 11 V5 Z"
              fill="#3b82f6"
            />
            <path
              d="M8.5 12.2 L11 14.7 L15.8 9.6"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ display: 'flex', fontSize: 64, fontWeight: 700, marginLeft: 28 }}>
            <span style={{ color: '#3b82f6' }}>DSGVO</span>
            <span>-checken.de</span>
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 58, fontWeight: 700, lineHeight: 1.15, marginBottom: 32 }}>
          {t.claim}
        </div>
        <div style={{ display: 'flex', fontSize: 28, color: '#94a3b8', lineHeight: 1.4, marginBottom: 40 }}>
          {t.items}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 28, color: '#22c55e' }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              background: '#22c55e',
              marginRight: 16,
            }}
          />
          {t.foot}
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
