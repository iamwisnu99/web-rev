import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://webrev.primadev.id";

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "WebRev | Platform Live Review Website & Speed Insight",
    template: "%s | WebRev",
  },
  description:
    "WebRev adalah platform all-in-one untuk host live stream dalam mereview website, mengelola antrean URL penonton secara realtime, audit performa Google PageSpeed Insights, serta checklist evaluasi UI/UX profesional.",
  applicationName: "WebRev",
  authors: [{ name: "WebRev Team", url: siteUrl }],
  generator: "Next.js",
  keywords: [
    "WebRev",
    "Web Rev",
    "Review Website",
    "Web Review",
    "WebReview",
    "live review website",
    "review website live streaming",
    "speed insight",
    "google pagespeed insights",
    "antrean review website",
    "audit performa web",
    "cek kecepatan website",
    "evaluasi ui ux",
    "checklist review web",
    "live coding tools",
    "streamer web developer",
    "core web vitals test",
    "interactive live queue",
    "website audit tool",
    "asisten live stream",
    "split screen review",
  ],
  referrer: "origin-when-cross-origin",
  creator: "WebRev",
  publisher: "WebRev",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "id-ID": "/",
      "en-US": "/?lang=en",
    },
  },
  openGraph: {
    title: "WebRev | Platform Live Review Website & Speed Insight",
    description:
      "Kelola antrean live review website bersama penonton secara realtime, uji performa Google PageSpeed, dan checklist evaluasi UI/UX profesional.",
    url: siteUrl,
    siteName: "WebRev",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WebRev - Platform Live Review Website & Speed Insight",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WebRev | Platform Live Review Website & Speed Insight",
    description:
      "Platform cerdas untuk host live review website, antrean realtime penonton, dan Google PageSpeed audit.",
    creator: "@webrev",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

// Structured Data (JSON-LD) Schemas
const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "WebRev",
      alternateName: ["WebRev Platform", "WebRev Live Stream Review"],
      description:
        "Platform live review website profesional untuk host live streaming, dilengkapi antrean penonton realtime dan audit Google PageSpeed Insights.",
      inLanguage: ["id-ID", "en-US"],
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "WebRev",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon.svg`,
      },
    },
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#webapp`,
      name: "WebRev",
      url: siteUrl,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "All",
      browserRequirements: "Requires JavaScript. Requires HTML5.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Sistem Room & Antrean Live URL Realtime Supabase",
        "Audit Kecepatan & Core Web Vitals Google PageSpeed Insights V5",
        "Checklist Evaluasi UI/UX, Aksesibilitas, dan SEO",
        "Device Emulation (Desktop, Tablet, Mobile) dengan Split View",
        "Dukungan Penuh Bahasa Indonesia & Inggris",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Apa itu WebRev?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "WebRev adalah platform asisten review website yang dirancang khusus untuk host live streaming dan web developer dalam mengelola antrean URL website penonton, checklist evaluasi UI/UX, dan audit performa Google PageSpeed secara terintegrasi.",
          },
        },
        {
          "@type": "Question",
          name: "Bagaimana cara penonton mengirimkan URL website saat live streaming?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Host mengaktifkan fitur Live Room untuk mendapatkan link publik unik (contoh: /room/@NamaHost?id=...). Penonton cukup membuka link tersebut untuk memasukkan URL website, yang seketika otomatis masuk ke antrean layar host.",
          },
        },
        {
          "@type": "Question",
          name: "Bagaimana WebRev menguji performa website?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "WebRev terintegrasi dengan Google PageSpeed Insights API v5 untuk menganalisis metrik Core Web Vitals (LCP, FID, CLS, FCP) untuk perangkat mobile dan desktop beserta diagnosis optimasi performa.",
          },
        },
        {
          "@type": "Question",
          name: "Apakah WebRev gratis digunakan?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ya, WebRev dapat digunakan secara gratis oleh content creator, programmer, dan host live streaming untuk meningkatkan kualitas interaksi dengan penonton.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLM Context" />
        <link rel="alternate" type="text/markdown" href="/llms-full.txt" title="Full LLM Documentation" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
