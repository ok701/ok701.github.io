import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Script from "next/script";

const GA_MEASUREMENT_ID = "G-QQEQCJZQBL";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jin-Woo Lee | Robotics Researcher & Engineer",
  description:
    "Jin-Woo Lee is a robotics researcher and motor control engineer. His research interests include rehabilitation robotics, robot control, and embedded systems.",
  keywords: [
    "robotics",
    "rehabilitation",
    "motor control",
    "PMSM",
    "impedance control",
    "cable-driven robot",
    "Jin-Woo Lee",
  ],
  robots: "index, follow",
  openGraph: {
    title: "Jin-Woo Lee | Robotics Researcher & Engineer",
    description:
      "Robotics researcher and motor control engineer specializing in rehabilitation robotics, robot control, and embedded systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics 4 (GA4) */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
