import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "SmogShield AI - Hyperlocal Smog Defense & Low-Emission Living",
  description:
    "Intelligent hyperlocal GenAI assistant that transforms real-time air quality data into tailored daily routines, affordable indoor air quality mitigation hacks, and low-emission actions.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
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
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        <AppShell>{children}</AppShell>
        <Script id="pwa-service-worker" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(reg) { console.log('SmogShield SW active:', reg.scope); },
                  function(err) { console.log('SW registration error:', err); }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
