import React from "react"
import { Badge } from "@/components/ui/badge"

type BaseProps = {
  children: React.ReactNode
}

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  caption?: React.ReactNode
}

type VideoProps = React.VideoHTMLAttributes<HTMLVideoElement>

type YouTubeProps = {
  id: string
  title?: string
}

type MathProps = {
  latex: string
}

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>

const MdxImage = ({ caption, ...props }: ImageProps) => (
  <figure className="my-6">
    <img
      {...props}
      loading="lazy"
      className={`w-full rounded-lg border border-zinc-800 bg-zinc-900 object-cover ${props.className ?? ''}`}
    />
    {caption && <figcaption className="mt-2 text-center text-xs text-zinc-500">{caption}</figcaption>}
  </figure>
)

const Video = ({ className, ...props }: VideoProps) => (
  <video
    className={`w-full rounded-lg border border-zinc-800 bg-black ${className ?? ''}`}
    controls
    playsInline
    {...props}
  />
)

const YouTube = ({ id, title }: YouTubeProps) => (
  <div className="relative my-6 aspect-video w-full overflow-hidden rounded-lg border border-zinc-800">
    <iframe
      className="absolute inset-0 h-full w-full"
      src={`https://www.youtube.com/embed/${id}`}
      title={title ?? 'YouTube video'}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
)

type CodeBlockProps = {
  children: React.ReactNode
  className?: string
  metastring?: string
}

function parseMeta(meta?: string) {
  if (!meta) {
    return {}
  }

  const titleMatch = meta.match(/title="([^"]+)"/)
  const langMatch = meta.match(/\blang=(\w+)/)

  return {
    title: titleMatch?.[1],
    lang: langMatch?.[1],
  }
}

const CodeBlock = ({ children, className, metastring }: CodeBlockProps) => {
  const meta = parseMeta(metastring)
  const language = className?.replace('language-', '') || meta.lang || 'text'

  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-zinc-800">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 py-2 text-xs font-mono uppercase tracking-wider text-zinc-500">
        <span>{meta.title ?? 'Code Snippet'}</span>
        <span className="text-emerald-400">{language}</span>
      </div>
      <pre className="bg-zinc-950/80 px-4 py-4 text-sm font-mono overflow-auto">
        <code className={`hljs language-${language}`}>{children}</code>
      </pre>
    </div>
  )
}

const Paragraph = ({ children }: BaseProps) => {
  const childArray = React.Children.toArray(children)
  if (childArray.length === 1) {
    const child = childArray[0]
    if (
      React.isValidElement(child) &&
      (child.type === 'img' || child.type === MdxImage || (typeof child.type === 'string' && child.type.toLowerCase() === 'image'))
    ) {
      return <>{child}</>
    }
  }

  return <p className="leading-relaxed text-zinc-300 font-mono mb-4">{children}</p>
}

const MathInline = ({ latex }: MathProps) => (
  // Use the default MathJax/KaTeX inline delimiter: \(...\)
  <span className="math-inline" suppressHydrationWarning>{`\\(${latex}\\)`}</span>
)

const MathBlock = ({ latex }: MathProps) => (
  // FIX: The prop 'latex' already contains the KaTeX block delimiters, so just render it directly.
  <span className="math-block block" suppressHydrationWarning>{latex}</span>
)

export const mdxComponents = {
  h2: ({ children, className, ...props }: HeadingProps) => (
    <h2
      {...props}
      className={`text-2xl font-bold text-zinc-100 mt-8 mb-4 font-mono ${className ?? ''}`}
    >
      {children}
    </h2>
  ),
  h3: ({ children, className, ...props }: HeadingProps) => (
    <h3
      {...props}
      className={`text-xl font-bold text-zinc-100 mt-6 mb-3 font-mono ${className ?? ''}`}
    >
      {children}
    </h3>
  ),
  p: Paragraph,
  code: ({ children, className }: { children: React.ReactNode; className?: string }) => {
    if (className?.includes('language-')) {
      return (
        <code className="hljs inline bg-transparent text-emerald-400 text-sm font-mono">
          {children}
        </code>
      )
    }
    return <code className="bg-zinc-900 px-2 py-1 rounded text-emerald-400 font-mono">{children}</code>
  },
  pre: ({ children }: BaseProps) => {
    if (React.isValidElement(children) && children.props) {
      return <CodeBlock {...children.props}>{children.props.children}</CodeBlock>
    }
    return <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-x-auto mb-4 font-mono text-sm">{children}</pre>
  },
  CodeBlock,
  ul: ({ children }: BaseProps) => (
    <ul className="list-disc list-inside space-y-2 text-zinc-300 font-mono mb-4">{children}</ul>
  ),
  ol: ({ children }: BaseProps) => (
    <ol className="list-decimal list-inside space-y-2 text-zinc-300 font-mono mb-4">{children}</ol>
  ),
  li: ({ children }: BaseProps) => (
    <li className="font-mono">{children}</li>
  ),
  blockquote: ({ children }: BaseProps) => (
    <blockquote className="border-l-4 border-emerald-400 pl-4 py-2 text-zinc-400 italic font-mono my-4">
      {children}
    </blockquote>
  ),
  Badge,
  img: MdxImage,
  Image: MdxImage,
  Video,
  YouTube,
  MathInline,
  MathBlock,
}
