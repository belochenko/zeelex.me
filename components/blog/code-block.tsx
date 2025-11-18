'use client'

import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
}

export function CodeBlock({ code, language = 'typescript' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between bg-zinc-800 px-4 py-2">
        <span className="text-xs font-mono text-zinc-400">{language}</span>
        <button
          onClick={copyToClipboard}
          className="p-1 hover:bg-zinc-700 rounded transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <Check size={16} className="text-emerald-400" />
          ) : (
            <Copy size={16} className="text-zinc-400" />
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className={`language-${language} text-sm font-mono text-zinc-200`}>
          {code}
        </code>
      </pre>
    </div>
  )
}
