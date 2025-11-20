'use server'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import MathJaxLoader from '@/components/blog/mathjax-loader'
import CodeHighlighter from '@/components/blog/code-highlighter'
import { notFound } from 'next/navigation'
import { getPost } from '@/lib/posts'
import { mdxComponents } from '@/components/blog/mdx-components'
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
  const translationLinks = translations.filter((lng) => lng !== metadata.lang)

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <MathJaxLoader />
      <CodeHighlighter />
      <article className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Navigation */}
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-8 text-sm font-mono">
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="flex flex-col gap-10 lg:flex-row">
          {hasHeadings && (
            <aside className="hidden lg:block lg:w-72">
              <div className="sticky top-24 border-l border-zinc-800 pl-4">
                <p className="text-xs uppercase tracking-wider text-zinc-500 font-mono">
                  Contents
                </p>
                <nav className="mt-4 flex flex-col gap-1">
                  {headings.map((heading) => {
                    const indent =
                      heading.level === 1 ? '' : heading.level === 2 ? 'pl-2' : 'pl-4'
                    return (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block text-sm text-zinc-400 hover:text-emerald-400 transition-colors font-mono py-1 ${indent}`}
                      >
                        {heading.text}
                      </a>
                    )
                  })}
                </nav>
              </div>
            </aside>
          )}

          <div className="flex-1">
            {/* Header */}
            <header className="space-y-4 mb-8">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight text-zinc-100 font-mono">{metadata.title}</h1>
              
              <div className="flex flex-col gap-4">
                <time className="text-zinc-400 text-sm font-mono">
                  {formatDate(metadata.date)}
                </time>
                <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
                  <span className="uppercase tracking-widest">Lang: {metadata.lang || 'en'}</span>
                  {translationLinks.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-600">/</span>
                      <span>Translate:</span>
                      <div className="flex items-center gap-1">
                        {translationLinks.map((lng) => (
                          <Link
                            key={lng}
                            href={`/posts/${post.slug}?lang=${lng}`}
                            className="text-emerald-400 hover:text-emerald-300"
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
                  <div className="flex flex-wrap gap-2">
                    {metadata.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="bg-zinc-900 text-emerald-400 border-emerald-400/30 text-xs md:text-sm font-mono">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Separator className="bg-zinc-800" />
            </header>

            {/* TL;DR Section */}
            {metadata.tldr && (
              <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-8">
                <h2 className="font-bold text-emerald-400 mb-2 text-sm md:text-base font-mono">TL;DR</h2>
                <p className="text-zinc-300 text-sm leading-relaxed font-mono">{metadata.tldr}</p>
              </section>
            )}

            <Separator className="bg-zinc-800 mb-8" />

            {/* Main Content */}
            <section className="space-y-6 font-mono text-zinc-300 post-content">
              <MDXContent components={mdxComponents} />
            </section>

            <Separator className="bg-zinc-800 my-12" />

            {/* Footer */}
            <footer className="pt-8">
              <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-mono">
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
