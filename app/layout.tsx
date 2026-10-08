import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// Loaded as a variable font (no fixed weights) so hover effects can animate weight smoothly.
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});
// Italic serif for the accent line in the hero headline.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#F4F2EE",
};

const siteUrl = "https://souravgokul.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Sourav Gokul V | MERN Stack Developer",
  description:
    "MERN Stack Developer specializing in MongoDB, Express, React, Node.js and Next.js. Building production LMS, WebRTC live-classroom, e-commerce and project management platforms.",
  keywords: [
    "React.js",
    "Next.js",
    "TypeScript",
    "MERN Stack Developer",
    "MERN Stack",
    "React Query",
    "SSR",
    "WebRTC",
    "E-commerce",
    "LMS",
    "PMT",
    "Bengaluru Developer",
  ],
  authors: [{ name: "Sourav Gokul V" }],
  creator: "Sourav Gokul V",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Sourav Gokul V | MERN Stack Developer",
    description:
      "MERN Stack Developer specializing in MongoDB, Express, React, Node.js and Next.js. Building production-grade applications across education, real-time video, e-commerce and project management.",
    siteName: "Sourav Gokul V",
    images: [
      {
        url: "/opengraph.jpg",
        width: 1200,
        height: 630,
        alt: "Sourav Gokul V — MERN Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sourav Gokul V | MERN Stack Developer",
    description:
      "MERN Stack Developer specializing in MongoDB, Express, React, Node.js and Next.js.",
    images: ["/opengraph.jpg"],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sourav Gokul V",
  jobTitle: "MERN Stack Developer",
  description:
    "MERN Stack Developer specializing in MongoDB, Express, React, Node.js and Next.js with experience building production-grade applications across education, real-time video, e-commerce and project management.",
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    addressCountry: "India",
  },
  worksFor: {
    "@type": "Organization",
    name: "Aim Window Info Tech",
  },
  sameAs: [
    "https://github.com/sourav446",
    "https://www.linkedin.com/in/souravgokul11",
  ],
  knowsAbout: [
    "React.js",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "React Query",
    "Tailwind CSS",
    "REST APIs",
    "Socket.IO",
    "Server-Side Rendering",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${interTight.variable} ${instrumentSerif.variable} ${jetbrains.variable}`}
    >
      <head>
        {/* Decide before first paint whether the intro plays (once per session, never with reduced motion). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('intro-seen')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.intro='skip'}catch(e){document.documentElement.dataset.intro='skip'}",
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
