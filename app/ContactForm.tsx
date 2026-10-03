'use client';
import { useState } from 'react';
import { contactFormText, type Lang } from './i18n';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function ContactForm({ lang = 'de' }: { lang?: Lang }) {
  const t = contactFormText[lang];
  const [state, setState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '', // honeypot — hidden
    privacy: false,
  });

  function set(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.privacy) {
      setErrorMsg(t.privacyRequired);
      return;
    }
    setState('loading');
    setErrorMsg('');
    try {
      const resp = await fetch(lang === 'en' ? '/api/contact?lang=en' : '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
          website: form.website, // honeypot
        }),
      });
      const data = await resp.json();
      if (!resp.ok || data.error) {
        setErrorMsg(data.error ?? t.unknownError);
        setState('error');
      } else {
        setState('success');
      }
    } catch {
      setErrorMsg(t.connectionError);
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div className="contactSuccess">
        <div className="contactSuccessIcon">✓</div>
        <h2>{t.successTitle}</h2>
        <p>{t.successText(form.name)}</p>
        <a href={t.backHref} className="ctaBtn" style={{ display: 'inline-block', marginTop: '20px' }}>
          {t.back}
        </a>
      </div>
    );
  }

  return (
    <form className="contactForm" onSubmit={handleSubmit} noValidate>
      <div className="contactGrid">
        <div className="contactField">
          <label htmlFor="cf-name">{t.name}</label>
          <input
            id="cf-name"
            type="text"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder={t.namePlaceholder}
            required
            autoComplete="name"
          />
        </div>
        <div className="contactField">
          <label htmlFor="cf-email">{t.email}</label>
          <input
            id="cf-email"
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder={t.emailPlaceholder}
            required
            autoComplete="email"
          />
        </div>
      </div>

      <div className="contactField">
        <label htmlFor="cf-subject">{t.subject}</label>
        <select
          id="cf-subject"
          value={form.subject}
          onChange={(e) => set('subject', e.target.value)}
        >
          <option value="">{t.choose}</option>
          {t.subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="contactField">
        <label htmlFor="cf-message">{t.message}</label>
        <textarea
          id="cf-message"
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          placeholder={t.messagePlaceholder}
          required
          rows={6}
        />
      </div>

      {/* Honeypot — hidden from real users via CSS */}
      <div className="contactHoneypot" aria-hidden="true">
        <label htmlFor="cf-website">{t.honeypot}</label>
        <input
          id="cf-website"
          type="text"
          value={form.website}
          onChange={(e) => set('website', e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="contactPrivacy">
        <label className="checkboxLabel">
          <input
            type="checkbox"
            checked={form.privacy}
            onChange={(e) => set('privacy', e.target.checked)}
            required
          />
          <span>
            {t.privacyBefore}
            <a href={t.privacyHref} target="_blank" rel="noopener noreferrer">
              {t.privacyLink}
            </a>
            {t.privacyAfter}
          </span>
        </label>
      </div>

      {(state === 'error' || errorMsg) && (
        <div className="errorMsg">{errorMsg}</div>
      )}

      <button
        type="submit"
        className="checkBtn"
        disabled={state === 'loading'}
        style={{ width: '100%', marginTop: '8px', padding: '14px' }}
      >
        {state === 'loading' ? (
          <><span className="spinner" aria-hidden="true" />{t.sending}</>
        ) : (
          t.send
        )}
      </button>

      <p className="contactNote">{t.note}</p>
    </form>
  );
}
