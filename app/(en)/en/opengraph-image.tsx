import { renderOgImage } from '../../ogImage';

export const alt = 'dsgvo-checken.de – Free GDPR check for your website';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage('en');
}
