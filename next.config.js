/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Blogartikel (suchmaschinen.pro) liegen als public/blog/<slug>/index.html, ihre kanonische URL endet auf "/".
  // Ohne diese Option leitet Next sie per 308 auf die Variante ohne "/" um. App-Seiten leitet middleware.ts um.
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [{ source: '/favicon.ico', destination: '/favicon.svg', permanent: true }];
  },
  async headers() {
    // llms.txt contains umlauts — always serve it as UTF-8 plain text.
    return [
      {
        source: '/llms.txt',
        headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }],
      },
    ];
  },
};

module.exports = nextConfig;
