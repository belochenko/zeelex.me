import { Badge } from "@/components/ui/badge"

export const mdxComponents = {
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-2xl font-bold text-zinc-100 mt-8 mb-4 font-mono">{children}</h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xl font-bold text-zinc-100 mt-6 mb-3 font-mono">{children}</h3>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="leading-relaxed text-zinc-300 font-mono mb-4">{children}</p>
  ),
  code: ({ children, className }: { children: React.ReactNode; className?: string }) => {
    if (className?.includes('language-')) {
      return (
        <code className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-emerald-400 text-sm font-mono">
          {children}
        </code>
      )
    }
    return <code className="bg-zinc-900 px-2 py-1 rounded text-emerald-400 font-mono">{children}</code>
  },
  pre: ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-x-auto mb-4 font-mono text-sm">
      {children}
    </pre>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc list-inside space-y-2 text-zinc-300 font-mono mb-4">{children}</ul>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="font-mono">{children}</li>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-emerald-400 pl-4 py-2 text-zinc-400 italic font-mono my-4">
      {children}
    </blockquote>
  ),
}
