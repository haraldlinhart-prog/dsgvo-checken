import type { MetadataRoute } from 'next';

const BASE = 'https://www.dsgvo-checken.de';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/en`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/kontakt`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE}/en/contact`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE}/datenschutz`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
