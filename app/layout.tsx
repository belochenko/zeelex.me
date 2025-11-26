import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"

const siteUrl = "https://zeelex.me"
const siteName = "Alexey Belochenko | Systems and Engineering"
const siteDescription =
  "Personal website of Alexey Belochenko, exploring systems, engineering, and data-first problem solving."
const siteKeywords = [
  "Alexey Belochenko",
  "Software Engineer",
  "Data Engineer",
  "Systems Engineering",
  "Systems Design",
  "Reliability Engineering",
  "Distributed Systems",
  "Pipeline Architecture",
  "DevOps",
  "MLOps",
  "Mathematical Modeling",
  "Cloud Infrastructure",
  "Observability",
  "Performance Optimization",
  "3D Printing",
  "Technical Writing",
  "Engineering Leadership",
  "Emerging Tech",
  "Personal Blog",
]

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: "%s | Alexey Belochenko",
  },
  description: siteDescription,
  applicationName: "zeelex.me",
  authors: [{ name: "Alexey Belochenko", url: siteUrl }],
  creator: "Alexey Belochenko",
  publisher: "Alexey Belochenko",
  category: "technology",
  keywords: siteKeywords,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
    locale: "en_US",
    images: [
      {
        url: "/icon.jpg",
        alt: "Portrait logo for Alexey Belochenko",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    creator: "@zeelexes",
    images: ["/icon.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  referrer: "origin-when-cross-origin",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#050505",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Alexey Belochenko",
  url: siteUrl,
  image: `${siteUrl}/icon.jpg`,
  description: siteDescription,
  jobTitle: "Software & Data Engineer",
  sameAs: [
    "https://github.com/belochenko",
    "https://www.linkedin.com/in/zeelexes/",
    "mailto:hi@zeelex.me",
  ],
  knowsAbout: siteKeywords,
  worksFor: {
    "@type": "Organization",
    name: "Independent Engineering & Research",
    url: siteUrl,
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "hi@zeelex.me",
    contactType: "business",
  },
  mainEntityOfPage: {
    "@type": "WebSite",
    "@id": siteUrl,
    name: siteName,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/atom-one-dark.min.css"
        />
        <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
        <script
          id="MathJax-script"
          async
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
        ></script>
        <script
          id="highlight-js"
          defer
          src="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/common.min.js"
        ></script>
        <script
          type="application/ld+json"
          // JSON-LD for richer snippets in search
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>{children}</body>
    </html>
  )
}
