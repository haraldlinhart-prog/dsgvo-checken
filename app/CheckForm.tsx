'use client';
import { useState } from 'react';
import { checkFormText, type Lang } from './i18n';

interface CheckResult {
  id: string;
  label: string;
  status: 'green' | 'yellow' | 'red';
  message: string;
  fix: { label: string; url: string } | null;
}

interface ApiResponse {
  url: string;
  checks: CheckResult[];
  error?: string;
  requiresBadge?: boolean;
  badgeVerified?: boolean;
  domain?: string;
  badgeUrl?: string;
  badgeHtml?: string;
}

const TOOLS = [
  { emoji: '📊', name: 'PAN21counter', url: 'https://www.pan21counter.de' },
  { emoji: '🟢', name: 'site-ok.de', url: 'https://www.site-ok.de' },
  { emoji: '⚡', name: 'PageSpeed-Plus', url: 'https://www.pagespeed-plus.de' },
  { emoji: '📄', name: 'Impressum-Free', url: 'https://www.impressum-free.de' },
  { emoji: '🔗', name: 'kaputte-links.de', url: 'https://www.kaputte-links.de' },
  { emoji: '🛡️', name: 'Spam-Abwehr', url: 'https://www.spam-abwehr.de' },
  { emoji: '🔍', name: 'suchmaschinen.pro', url: 'https://www.suchmaschinen.pro' },
  { emoji: '⚖️', name: 'abmahnschutz.pro', url: 'https://www.abmahnschutz.pro' },
];

export default function CheckForm({ lang = 'de' }: { lang?: Lang }) {
  const t = checkFormText[lang];
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [apiError, setApiError] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    setLoading(true);
    setResult(null);
    setApiError('');
    setCopied(false);
    try {
      const resp = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl.trim(), lang }),
      });
      const data: ApiResponse = await resp.json();
      if (!resp.ok || data.error) {
        setApiError(data.error ?? t.unknownError);
      } else {
        setResult(data);
        setTimeout(() => {
          document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch {
      setApiError(t.connectionError);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select the textarea
    }
  }

  const counts = result && !result.requiresBadge
    ? {
        green: result.checks.filter((c) => c.status === 'green').length,
        yellow: result.checks.filter((c) => c.status === 'yellow').length,
        red: result.checks.filter((c) => c.status === 'red').length,
      }
    : null;

  return (
    <>
      {/* Check form */}
      <form className="checkForm" onSubmit={handleSubmit} noValidate>
        <input
          className="checkInput"
          type="url"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder={t.placeholder}
          required
          aria-label={t.inputLabel}
          autoComplete="url"
          inputMode="url"
        />
        <button className="checkBtn" type="submit" disabled={loading}>
          {loading ? (
            <><span className="spinner" aria-hidden="true" />{t.checking}</>
          ) : result?.requiresBadge ? (
            t.badgeAndCheck
          ) : (
            t.checkNow
          )}
        </button>
      </form>

      {apiError && <div className="errorMsg">{apiError}</div>}

      {/* Badge gate */}
      {result?.requiresBadge && (
        <section id="results" className="badgeGate">
          <div className="badgeGateInner">
            <div className="badgeSiegelPreview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/siegel.png" alt={t.sealAlt} width="140" height="140" />
            </div>
            <h2 className="badgeGateTitle">{t.gateTitle}</h2>
            <p className="badgeGateDesc">{t.gateDesc}</p>

            <ol className="badgeSteps">
              <li>
                <strong>{t.step1Strong}</strong>{t.step1Rest}
              </li>
            </ol>

            <div className="badgeCodeWrap">
              <pre className="badgeCode">{result.badgeHtml}</pre>
              <button
                className="badgeCopyBtn"
                onClick={() => handleCopy(result.badgeHtml ?? '')}
                type="button"
              >
                {copied ? t.copied : t.copyCode}
              </button>
            </div>

            <div className="badgePreview">
              <p className="badgePreviewLabel">{t.previewLabel}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/siegel.png"
                alt={t.sealPreviewAlt}
                width="120"
                height="120"
                style={{ display: 'block', margin: '0 auto' }}
              />
            </div>

            <ol className="badgeSteps" start={2}>
              <li>
                <strong>{t.step2Strong}</strong>{t.step2Rest}
              </li>
              <li>
                <strong>{t.step3Strong}</strong>{t.step3Rest}
              </li>
            </ol>

            <p className="badgeGateNote">{t.gateNote}</p>
          </div>
        </section>
      )}

      {/* Results */}
      {result && !result.requiresBadge && (
        <section id="results" className="results">
          <p className="resultsUrl">
            {t.resultFor}{' '}
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              {result.url}
            </a>
            {result.badgeVerified && (
              <>
                {' '}·{' '}
                <span className="badgeVerifiedChip">{t.verifiedChip}</span>
              </>
            )}
          </p>

          {counts && (
            <div className="summaryBar">
              <span style={{ fontWeight: 600, fontSize: '.9rem' }}>{t.summary}</span>
              <div className="summaryBadges">
                {counts.green > 0 && <span className="badge badge-green">✓ {t.ok(counts.green)}</span>}
                {counts.yellow > 0 && <span className="badge badge-yellow">⚠ {t.notice(counts.yellow)}</span>}
                {counts.red > 0 && <span className="badge badge-red">✕ {t.problem(counts.red)}</span>}
              </div>
            </div>
          )}

          <div className="checkList">
            {result.checks.map((c) => (
              <div key={c.id} className="checkCard">
                <span className={`checkDot dot-${c.status}`} aria-hidden="true" />
                <div>
                  <div className="checkLabel">{c.label}</div>
                  <div className="checkMessage">{c.message}</div>
                  {c.fix && (
                    <div className="checkFix">
                      <a
                        className="checkFixBtn"
                        href={c.fix.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {c.fix.label} →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tools grid */}
      <section className="toolsSection">
        <div className="wrap">
          <h2>{t.toolsTitle}</h2>
          <p>{t.toolsDesc}</p>
          <div className="toolsGrid">
            {TOOLS.map((tool, i) => (
              <a key={tool.url} className="toolCard" href={tool.url} target="_blank" rel="noopener noreferrer">
                <span className="toolEmoji">{tool.emoji}</span>
                <div>
                  <div className="toolName">{tool.name}</div>
                  <div className="toolDesc">{t.tools[i]}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
