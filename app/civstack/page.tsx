import './civstack.css';
import CivStackClient from './CivStackMap';
import { Metadata } from 'next';
import Script from 'next/script';

const pageUrl = 'https://zeelex.me/civstack';
const pageTitle = 'Civilization Stack | Interactive Dependency Map';
const pageDescription = 'A dense, brutalist interactive graph mapping the technologies, systems, and dependencies humanity needs to survive and grow. Explore the Civilization Stack.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    'Civilization Stack',
    'Technology Tree',
    'Human Survival Graph',
    'Systems Engineering',
    'Dependency Map',
    'Infrastructure Map',
    'Brutalist Design',
    'Interactive Graph',
    'Alexey Belochenko'
  ],
  authors: [{ name: 'Alexey Belochenko', url: 'https://zeelex.me' }],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    type: 'website',
    siteName: 'Alexey Belochenko | Data & Systems Engineer',
    images: [
      {
        url: 'https://zeelex.me/icon.jpg', // Using global icon as fallback
        width: 1200,
        height: 630,
        alt: 'Civilization Stack Interface',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    creator: '@zeelexes',
    images: ['https://zeelex.me/icon.jpg'],
  },
  alternates: {
    canonical: pageUrl,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Civilization Stack',
  operatingSystem: 'Any',
  applicationCategory: 'EducationalApplication',
  description: pageDescription,
  url: pageUrl,
  author: {
    '@type': 'Person',
    name: 'Alexey Belochenko',
    url: 'https://zeelex.me',
  },
  publisher: {
    '@type': 'Person',
    name: 'Alexey Belochenko',
  },
  offers: {
    '@type': 'Offer',
    price: '0.00',
    priceCurrency: 'USD',
  },
};

export default function CivStackPage() {
  return (
    <div className="civstack-root">
      {/* JSON-LD Structured Data for SEO */}
      <Script
        id="civstack-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="afterInteractive"
      />

      <CivStackClient />

      {/* Mobile wall */}
      <div className="cs-mobile-wall">
        <div style={{ fontSize: '32px', color: '#d4724a', marginBottom: '8px' }}>⚠</div>
        <h2 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: '24px',
          color: '#ece8e0',
          fontWeight: 400,
        }}>
          Desktop required
        </h2>
        <p>
          The Civilization Stack is a dense interactive graph.
          Use a monitor or tablet in landscape mode.
        </p>
      </div>
    </div>
  );
}
