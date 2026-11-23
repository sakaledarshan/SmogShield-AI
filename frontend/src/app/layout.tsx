import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "SmogShield AI - Hyperlocal Smog Defense & Low-Emission Living",
  description:
    "Intelligent hyperlocal GenAI assistant that transforms real-time air quality data into tailored daily routines, affordable indoor air quality mitigation hacks, and low-emission actions.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SmogShield",
  },
};

export const viewport: Viewport = {
  themeColor: "#1A365D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        <AppShell>{children}</AppShell>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(reg) { console.log('SmogShield PWA SW registered:', reg.scope); },
                    function(err) { console.log('SW registration error:', err); }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
