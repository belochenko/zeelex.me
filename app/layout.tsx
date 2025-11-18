import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Alexey Belochenko | Systems and Engineering",
  description:
    "Personal website of Alexey Belochenko, about Systems and Engineering",
  icons: {
    icon: "/icon.png",
  },
    generator: 'v0.app'
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
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>{children}</body>
    </html>
  )
}
