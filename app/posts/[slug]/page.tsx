'use server'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import MathJaxLoader from '@/components/blog/mathjax-loader'
import CodeHighlighter from '@/components/blog/code-highlighter'
import MathJaxWrapper from '@/components/blog/math-jax-wrapper'
import { notFound } from 'next/navigation'
import { getPost } from '@/lib/posts'
import { mdxComponents } from '@/components/blog/mdx-components'
import TableOfContents from '@/components/blog/table-of-contents'
import DyslexiaToggle from '@/components/blog/dyslexia-toggle'
import { run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

async function getMDXComponent(code: string) {
  const { default: Content } = await run(code, runtime)
  return Content
}

type PageProps = {
  params: { slug: string }
  searchParams?: { lang?: string }
}

export default async function PostPage({ params, searchParams }: PageProps) {
  const { slug } = params
  const { lang } = searchParams || {}
  
  const post = await getPost(slug, lang)
  
  if (!post) {
    notFound()
  }

  const { metadata, code, headings, translations } = post
  const hasHeadings = headings.length > 0
  const MDXContent = await getMDXComponent(code)
  const translationLinks = translations.filter((lng: string) => lng !== metadata.lang)

  return (
    <main className="min-h-screen dot-grid" style={{ backgroundColor: "var(--bg-base)", color: "var(--tx-primary)" }}>
      <MathJaxLoader />
      <CodeHighlighter />
      <article className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Navigation & Controls */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-mono transition-colors hover:brightness-125" style={{ color: "var(--tx-accent)" }}>
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <DyslexiaToggle />
        </div>

        <div className="flex flex-col gap-8 lg:flex-row-reverse lg:items-start">
          {hasHeadings && <TableOfContents headings={headings} />}

          <div className="flex-1 max-w-[680px] mx-auto w-full">
            {/* Header */}
            <header className="space-y-4 mb-8">
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight" style={{ color: "var(--tx-primary)" }}>{metadata.title}</h1>
              
              <div className="flex flex-col gap-4">
                <time className="text-sm font-mono tracking-widest uppercase" style={{ color: "var(--tx-secondary)" }}>
                  {formatDate(metadata.date)}
                </time>
                <div className="flex items-center gap-3 text-xs font-mono" style={{ color: "var(--tx-muted)" }}>
                  <span className="uppercase tracking-widest">Lang: {metadata.lang || 'en'}</span>
                  {translationLinks.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span>/</span>
                      <span>Translate:</span>
                      <div className="flex items-center gap-1">
                        {translationLinks.map((lng: string) => (
                          <Link
                            key={lng}
                            href={`/posts/${post.slug}?lang=${lng}`}
                            className="transition-colors hover:brightness-125"
                            style={{ color: "var(--tx-accent)" }}
                          >
                            {lng.toUpperCase()}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Tags */}
                {metadata.tags && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {metadata.tags.map((tag: string) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="text-xs font-mono tracking-wider uppercase rounded border font-normal"
                        style={{ 
                          background: "var(--bg-surface)", 
                          color: "var(--tx-secondary)", 
                          borderColor: "var(--bg-border-dim)" 
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Separator className="my-8" style={{ backgroundColor: "var(--bg-border)" }} />
            </header>

            {/* TL;DR Section */}
            {metadata.tldr && (
              <section 
                className="p-5 mb-12 rounded-r-[14px]"
                style={{ 
                  background: "color-mix(in srgb, var(--tx-accent) 8%, transparent)", 
                  borderLeft: "3px solid var(--tx-accent)" 
                }}
              >
                <h2 className="font-semibold mb-2 text-sm md:text-[15px] font-mono uppercase tracking-widest" style={{ color: "var(--tx-accent)" }}>TL;DR</h2>
                <p className="text-sm md:text-[15px] leading-relaxed" style={{ color: "var(--tx-primary)" }}>{metadata.tldr}</p>
              </section>
            )}

            {/* Main Content */}
            <section className="space-y-6 text-base md:text-[17px] leading-[1.8] post-content" style={{ color: "var(--tx-secondary)" }}>
              <MathJaxWrapper>
                <MDXContent components={mdxComponents} />
              </MathJaxWrapper>
            </section>

            <Separator className="my-12" style={{ backgroundColor: "var(--bg-border-dim)" }} />

            {/* Footer */}
            <footer className="pt-2 pb-12">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-mono transition-colors hover:brightness-125" style={{ color: "var(--tx-accent)" }}>
                <ArrowLeft size={16} />
                Back to Home
              </Link>
            </footer>
          </div>
        </div>
      </article>
    </main>
  )
}
