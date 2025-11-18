'use server'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import MathJaxLoader from '@/components/blog/mathjax-loader'

// Blog post metadata interface
interface BlogPost {
  title: string
  date: string
  tags: string[]
  tldr: string
  content: React.ReactNode
}

// Sample blog posts with MDX-like content
const blogPosts: Record<string, BlogPost> = {
  'project-1': {
    title: 'Mathematical Modeling and Optimization',
    date: '2025-01-15',
    tags: ['Mathematics', 'Optimization', 'Algorithms'],
    tldr: 'Exploring advanced techniques for solving non-linear optimization problems using gradient descent and its variants.',
    content: (
      <div className="space-y-6 font-mono text-zinc-300">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-100">Introduction</h2>
          <p className="leading-relaxed">
            Optimization lies at the heart of modern machine learning and scientific computing. Whether we're training neural networks or solving complex engineering problems, understanding the mathematical foundations is crucial for building efficient and robust systems.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-100">Gradient Descent Fundamentals</h2>
          <p className="leading-relaxed">
            At its core, gradient descent is an iterative optimization algorithm that finds the minimum of a function by following the negative gradient. The update rule for each iteration is:
          </p>
          <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
            <div className="text-center text-emerald-400">
              $$\theta_{t+1} = \theta_t - \alpha \nabla f(\theta_t)$$
            </div>
          </div>
          <p className="leading-relaxed">
            where <span className="text-emerald-400">$$\theta_t$$</span> is our parameter at iteration <span className="text-emerald-400">$$t$$</span>, <span className="text-emerald-400">$$\alpha$$</span> is the learning rate, and <span className="text-emerald-400">$$\nabla f(\theta_t)$$</span> is the gradient.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-100">Implementation Example</h2>
          <p className="leading-relaxed">
            Here's a practical implementation in TypeScript:
          </p>
          <pre className="bg-zinc-900 border border-zinc-800 rounded p-4 overflow-x-auto text-sm">
            <code>{`function gradientDescent(
  initialParams: number[],
  learningRate: number,
  iterations: number,
  gradientFn: (params: number[]) => number[]
): number[] {
  let params = [...initialParams];
  
  for (let i = 0; i < iterations; i++) {
    const gradient = gradientFn(params);
    params = params.map((p, idx) => 
      p - learningRate * gradient[idx]
    );
  }
  
  return params;
}`}</code>
          </pre>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-100">Convergence Analysis</h2>
          <p className="leading-relaxed">
            The convergence rate of gradient descent depends on the condition number of the Hessian matrix. For strongly convex functions, we have:
          </p>
          <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
            <div className="text-center text-emerald-400">
              $$f(\theta_t) - f^* \leq c \cdot (1-\mu/L)^t$$
            </div>
          </div>
          <p className="leading-relaxed">
            where <span className="text-emerald-400">$$\mu$$</span> is the strong convexity parameter and <span className="text-emerald-400">$$L$$</span> is the Lipschitz constant of the gradient.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-100">Key Takeaways</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Gradient descent is simple yet powerful for convex optimization problems</li>
            <li>Learning rate selection is crucial for both convergence and efficiency</li>
            <li>Adaptive methods (Adam, RMSprop) improve convergence on non-convex landscapes</li>
            <li>Understanding mathematical foundations enables better algorithm selection</li>
          </ul>
        </section>
      </div>
    ),
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
  const post = blogPosts[slug]

  if (!post) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-8">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
          <p className="text-zinc-400">Post not found.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <MathJaxLoader />
      <article className="max-w-2xl mx-auto px-4 py-12">
        {/* Navigation */}
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-8 font-mono text-sm">
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Header */}
        <header className="space-y-4 mb-8">
          <h1 className="text-4xl font-bold font-mono leading-tight">{post.title}</h1>
          
          <div className="flex flex-col gap-4">
            <time className="text-zinc-400 font-mono text-sm">
              {formatDate(post.date)}
            </time>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-zinc-900 text-emerald-400 border-emerald-400/30">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="bg-zinc-800" />
        </header>

        {/* TL;DR Section */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-8">
          <h2 className="font-bold font-mono text-emerald-400 mb-2">TL;DR</h2>
          <p className="text-zinc-300 text-sm font-mono">{post.tldr}</p>
        </section>

        <Separator className="bg-zinc-800 mb-8" />

        {/* Main Content */}
        <section className="space-y-6">
          {post.content}
        </section>

        <Separator className="bg-zinc-800 my-12" />

        {/* Footer */}
        <footer className="pt-8">
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-mono text-sm">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </footer>
      </article>
    </main>
  )
}
