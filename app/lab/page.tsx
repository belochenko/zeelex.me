import Link from "next/link"
import { getAllLabPosts } from "@/lib/lab"
import { ArrowLeft, Beaker, GitCommitHorizontal, FileJson, Calculator } from "lucide-react"
import { Badge } from "@/components/ui/badge"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Lab & Simulations | Alexey Belochenko",
  description: "Interactive mathematics, physics simulations, and explorable explanations by Alexey.",
  openGraph: {
    title: "Lab & Simulations | Alexey Belochenko",
    description: "Interactive mathematics, physics simulations, and explorable explanations.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lab & Simulations",
    description: "Interactive mathematics and physics solutions.",
  }
}

function getDifficultyColor(diff?: string) {
  switch (diff?.toLowerCase()) {
    case 'beginner': return { bg: 'bg-[#d1fae5]', tx: 'text-[#065f46]', border: 'border-[#34d399]' }
    case 'intermediate': return { bg: 'bg-[#fef3c7]', tx: 'text-[#92400e]', border: 'border-[#fbbf24]' }
    case 'advanced': return { bg: 'bg-[#fee2e2]', tx: 'text-[#b91c1c]', border: 'border-[#f87171]' }
    default: return { bg: 'bg-[#f3f4f6]', tx: 'text-[#374151]', border: 'border-[#d1d5db]' }
  }
}

export default async function LabIndex() {
  const posts = await getAllLabPosts()

  return (
    <main className="min-h-screen dot-grid lab-paper-theme">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16">

        {/* Navigation & Header */}
        <div className="mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-8 text-sm font-mono tracking-widest uppercase transition-colors hover:opacity-70"
            style={{ color: "var(--tx-accent)" }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4" style={{ color: "var(--tx-muted)" }}>
                <Beaker size={24} />
                <span className="font-mono text-sm tracking-[0.2em] uppercase">Interactive</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4" style={{ color: "var(--tx-primary)" }}>
                The Lab
              </h1>
              <p className="text-lg md:text-xl max-w-2xl" style={{ color: "var(--tx-secondary)" }}>
                Explorable explanations, physics simulations, and interactive mathematical proofs.
              </p>
            </div>
            <div className="text-sm font-mono text-right" style={{ color: "var(--tx-muted)" }}>
              // {posts.length} EXPERIMENT{posts.length !== 1 ? 'S' : ''} LOADED
            </div>
          </div>
        </div>

        {/* Index of Problems (Blueprint Grid Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => {
            const diffCols = getDifficultyColor(post.metadata.difficulty)
            const isLatest = index === 0

            return (
              <Link key={post.slug} href={`/lab/${post.slug}`} className="group block relative">
                {isLatest && (
                  <div className="absolute -top-3 -right-2 z-10 animate-fade-in">
                    <span
                      className="px-2 py-1 text-[9px] font-mono font-bold tracking-[0.2em] rounded border shadow-sm uppercase bg-white"
                      style={{ color: "var(--tx-accent)", borderColor: "var(--tx-accent)" }}
                    >
                      New
                    </span>
                  </div>
                )}
                <article
                  className="flex flex-col h-full rounded-xl border p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: isLatest ? "var(--tx-accent)" : "var(--bg-border)",
                    boxShadow: isLatest ? "0 10px 30px -10px rgba(217, 119, 6, 0.15)" : "0 10px 30px -10px rgba(0,0,0,0.05)"
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className="px-2 py-1 flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase rounded border"
                      style={{ color: "var(--tx-muted)", borderColor: "var(--bg-border-dim)" }}
                    >
                      <Calculator size={12} />
                      {post.metadata.topic || 'Simulation'}
                    </span>
                    {post.metadata.difficulty && (
                      <span className={`px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase rounded-sm border ${diffCols.bg} ${diffCols.tx} ${diffCols.border}`}>
                        {post.metadata.difficulty}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold tracking-tight mb-3 leading-snug group-hover:text-amber-600 transition-colors" style={{ color: "var(--tx-primary)" }}>
                    {post.metadata.title}
                  </h3>

                  <p className="line-clamp-3 text-[14px] leading-relaxed mb-6 flex-grow" style={{ color: "var(--tx-secondary)" }}>
                    {post.metadata.summary}
                  </p>

                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-dashed" style={{ borderColor: "var(--bg-border-dim)" }}>
                      {post.metadata.tags?.map(tag => (
                        <span key={tag} className="text-[11px] font-mono" style={{ color: "var(--tx-muted)" }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>

      </div>
    </main>
  )
}
