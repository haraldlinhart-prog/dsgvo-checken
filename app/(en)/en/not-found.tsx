import type { Metadata } from 'next';
import NotFoundContent from '../../NotFoundContent';

export const metadata: Metadata = {
  title: 'Page not found | dsgvo-checken.de',
  robots: { index: false },
};

export default function NotFound() {
  return <NotFoundContent lang="en" />;
}
