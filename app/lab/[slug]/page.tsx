import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import MathJaxLoader from '@/components/blog/mathjax-loader'
import CodeHighlighter from '@/components/blog/code-highlighter'
import { notFound } from 'next/navigation'
import { getLabPost } from '@/lib/lab'
import { mdxComponents } from '@/components/blog/mdx-components'
import TableOfContents from '@/components/blog/table-of-contents'
import { run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'

async function getMDXComponent(code: string) {
  const mdxExport = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  })
  return mdxExport.default
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getLabPost(params.slug)
  if (!post) {
    return { title: 'Lab Not Found' }
  }
  return {
    title: `${post.metadata.title} | Science Lab`,
    description: post.metadata.summary,
  }
}

export default async function LabPostPage({ params }: { params: { slug: string } }) {
  const post = await getLabPost(params.slug)

  if (!post) {
    notFound()
  }

  const { metadata, code, headings } = post
  const hasHeadings = headings.length > 0
  const MDXContent = await getMDXComponent(code)

  return (
    <main className="min-h-screen dot-grid lab-paper-theme" style={{ backgroundColor: "var(--bg-base)", color: "var(--tx-primary)" }}>
      <MathJaxLoader />
      <CodeHighlighter />

      <article className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16">
        {/* Navigation & Controls */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/lab" className="inline-flex items-center gap-2 text-sm font-mono tracking-widest uppercase transition-colors hover:opacity-70" style={{ color: "var(--tx-accent)" }}>
            <ArrowLeft size={16} />
            Back to Lab
          </Link>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row-reverse lg:items-start">
          {hasHeadings && <TableOfContents headings={headings} />}

          <div className="flex-1 max-w-[680px] w-full bg-white/40 p-8 rounded-[4px] shadow-sm border" style={{ borderColor: "var(--bg-border-dim)", backdropFilter: "blur(12px)" }}>

            {/* Header / Report Cover */}
            <header className="space-y-6 pb-12 mb-12 border-b border-dashed" style={{ borderColor: "var(--bg-border)" }}>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono tracking-widest uppercase" style={{ color: "var(--tx-muted)" }}>
                <span>REPORT :: {metadata.date}</span>
                <span>//</span>
                <span>{metadata.topic || 'General Science'}</span>
              </div>

              <h1 className="text-4xl md:text-[50px] font-bold leading-[1.1] tracking-tight" style={{ color: "var(--tx-primary)" }}>
                {metadata.title}
              </h1>

              {metadata.summary && (
                <p className="text-lg md:text-xl leading-relaxed italic border-l-4 pl-5" style={{ color: "var(--tx-secondary)", borderColor: "var(--tx-accent)" }}>
                  {metadata.summary}
                </p>
              )}

              {metadata.tags && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {metadata.tags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="font-mono text-[11px] rounded-sm py-0.5 px-2 tracking-wider"
                      style={{ color: "var(--tx-secondary)", borderColor: "var(--bg-border)" }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </header>

            {/* Markdown Content */}
            <div className="post-content prose prose-zinc prose-invert max-w-none w-full">
              <MDXContent components={mdxComponents} />
            </div>

          </div>
        </div>
      </article>
    </main>
  )
}
