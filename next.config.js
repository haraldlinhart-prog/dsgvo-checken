/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
