import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
