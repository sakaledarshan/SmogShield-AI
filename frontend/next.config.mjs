/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enforces NFR-4.2 Security Headers in production without breaking dev server internal chunk serving
  async headers() {
    if (process.env.NODE_ENV !== 'production') {
      return [];
    }
    return [
      {
        // Exclude Next.js internal static assets and chunks from header interception
        source: '/((?!_next/static|_next/image|favicon.ico).*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' ws: wss: http://localhost:8000 http://127.0.0.1:8000 https://*; worker-src 'self';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
