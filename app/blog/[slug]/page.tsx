'use server'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import MathJaxLoader from '@/components/blog/mathjax-loader'
import { notFound } from 'next/navigation'

interface BlogPostMetadata {
  title: string
  date: string
  tags: string[]
  tldr: string
}

const blogPostsMetadata: Record<string, BlogPostMetadata> = {
  'project-1': {
    title: 'Mathematical Modeling and Optimization',
    date: '2025-01-15',
    tags: ['Mathematics', 'Optimization', 'Algorithms'],
    tldr: 'Exploring advanced techniques for solving non-linear optimization problems using gradient descent and its variants.',
  },
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const metadata = blogPostsMetadata[slug]

  if (!metadata) {
    notFound()
  }

  let MDXContent
  try {
    MDXContent = (await import(`@/content/blog/${slug}.mdx`)).default
  } catch (error) {
    console.error(`[v0] Failed to load MDX for slug: ${slug}`, error)
    notFound()
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <MathJaxLoader />
      <article className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Navigation */}
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-8 text-sm font-mono">
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Header */}
        <header className="space-y-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight text-zinc-100 font-mono">{metadata.title}</h1>
          
          <div className="flex flex-col gap-4">
            <time className="text-zinc-400 text-sm font-mono">
              {formatDate(metadata.date)}
            </time>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {metadata.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-zinc-900 text-emerald-400 border-emerald-400/30 text-xs md:text-sm font-mono">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="bg-zinc-800" />
        </header>

        {/* TL;DR Section */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-8">
          <h2 className="font-bold text-emerald-400 mb-2 text-sm md:text-base font-mono">TL;DR</h2>
          <p className="text-zinc-300 text-sm leading-relaxed font-mono">{metadata.tldr}</p>
        </section>

        <Separator className="bg-zinc-800 mb-8" />

        {/* Main Content - MDX */}
        <section className="space-y-6 font-mono text-zinc-300">
          <MDXContent />
        </section>

        <Separator className="bg-zinc-800 my-12" />

        {/* Footer */}
        <footer className="pt-8">
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-mono">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </footer>
      </article>
    </main>
  )
}
