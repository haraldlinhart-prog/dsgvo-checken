import type { Metadata } from 'next';
import NotFoundContent from '../NotFoundContent';

export const metadata: Metadata = {
  title: 'Seite nicht gefunden | dsgvo-checken.de',
  robots: { index: false },
};

export default function NotFound() {
  return <NotFoundContent lang="de" />;
}
