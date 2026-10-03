'use client';
import { useEffect } from 'react';
import type { Lang } from './i18n';

// English labels for the (German) impressum-free.de widget. The legal texts
// themselves stay German; only link labels, modal title and alt texts change.
const EN_LABELS: Record<string, string> = {
  Impressum: 'Legal notice (German)',
  Datenschutz: 'Privacy policy (German)',
  Datenschutzerklärung: 'Privacy policy (German)',
};

export default function ImpressumWidget({ lang = 'de' }: { lang?: Lang }) {
  useEffect(() => {
    let observer: MutationObserver | undefined;
    if (lang === 'en') {
      const relabel = () => {
        document
          .querySelectorAll<HTMLElement>('#impressum-free-widget a.if-link, #if-modal h2')
          .forEach((n) => {
            const en = EN_LABELS[n.textContent ?? ''];
            if (en) n.textContent = en;
          });
        document.getElementById('if-modal-close')?.setAttribute('aria-label', 'Close');
        document.getElementById('if-modal-overlay')?.setAttribute('aria-label', 'Legal notice');
        document
          .querySelectorAll<HTMLImageElement>('#impressum-free-widget img.if-siegel')
          .forEach((img) => {
            if (img.alt === 'Impressum geprüft') img.alt = 'Legal notice checked';
            if (img.alt === 'DSGVO geprüft') img.alt = 'GDPR-checked';
          });
      };
      observer = new MutationObserver(relabel);
      observer.observe(document.body, { childList: true, subtree: true });
      relabel();
    }

    // Widget schon geladen?
    if (!document.getElementById('if-widget-styles')) {
      const s = document.createElement('script');
      s.src = 'https://impressum-free.de/widget.js';
      s.setAttribute('data-domain', 'dsgvo-checken.de');
      document.head.appendChild(s);
    }

    return () => observer?.disconnect();
  }, [lang]);

  return <span id="impressum-free-widget" />;
}
