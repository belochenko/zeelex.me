import React from "react"
import type { MDXComponents } from "mdx/types"
import { Badge } from "@/components/ui/badge"

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  caption?: React.ReactNode
}

type BaseProps = {
  children?: React.ReactNode
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

const Paragraph = ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
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

  return (
    <p
      {...props}
      className={`leading-relaxed text-zinc-300 font-mono mb-4 ${className ?? ''}`}
    >
      {children}
    </p>
  )
}

const MathInline = ({ latex }: MathProps) => (
  // Use the default MathJax/KaTeX inline delimiter: \(...\)
  <span className="math-inline" suppressHydrationWarning>{`\\(${latex}\\)`}</span>
)

const MathBlock = ({ latex }: MathProps) => (
  // Use display math delimiters so MathJax picks up the expression
  <span className="math-block block" suppressHydrationWarning>{`\\[${latex}\\]`}</span>
)

const Table = ({ children, className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
  <div className="my-6 overflow-x-auto rounded-lg border border-zinc-800">
    <table
      {...props}
      className={`w-full text-sm text-left text-zinc-200 ${className ?? ''}`}
    >
      {children}
    </table>
  </div>
)

const THead = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead
    {...props}
    className={`bg-zinc-900/80 text-xs uppercase tracking-[0.16em] text-zinc-400 font-mono ${className ?? ''}`}
  >
    {children}
  </thead>
)

const TBody = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody
    {...props}
    className={`divide-y divide-zinc-800 ${className ?? ''}`}
  >
    {children}
  </tbody>
)

const TRow = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    {...props}
    className={`hover:bg-zinc-900/50 transition-colors ${className ?? ''}`}
  >
    {children}
  </tr>
)

const THeaderCell = ({ children, className, ...props }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
  <th
    {...props}
    className={`px-4 py-3 font-semibold text-zinc-100 border-b border-zinc-800 ${className ?? ''}`}
  >
    {children}
  </th>
)

const TCell = ({ children, className, ...props }: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
  <td
    {...props}
    className={`px-4 py-3 text-zinc-300 align-top ${className ?? ''}`}
  >
    {children}
  </td>
)

export const mdxComponents: MDXComponents = {
  h2: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      {...props}
      className={`text-2xl font-bold text-zinc-100 mt-8 mb-4 font-mono ${className ?? ''}`}
    >
      {children}
    </h2>
  ),
  h3: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      {...props}
      className={`text-xl font-bold text-zinc-100 mt-6 mb-3 font-mono ${className ?? ''}`}
    >
      {children}
    </h3>
  ),
  p: Paragraph,
  code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    if (className?.includes('language-')) {
      return (
        <code {...props} className="hljs inline bg-transparent text-emerald-400 text-sm font-mono">
          {children}
        </code>
      )
    }
    return (
      <code {...props} className="bg-zinc-900 px-2 py-1 rounded text-emerald-400 font-mono">
        {children}
      </code>
    )
  },
  pre: ({ children, className, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    if (React.isValidElement(children) && children.props) {
      return <CodeBlock {...children.props}>{children.props.children}</CodeBlock>
    }
    return (
      <pre
        {...props}
        className={`bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-x-auto mb-4 font-mono text-sm ${className ?? ''}`}
      >
        {children}
      </pre>
    )
  },
  CodeBlock,
  ul: ({ children, className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      {...props}
      className={`list-disc list-inside space-y-2 text-zinc-300 font-mono mb-4 ${className ?? ''}`}
    >
      {children}
    </ul>
  ),
  ol: ({ children, className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      {...props}
      className={`list-decimal list-inside space-y-2 text-zinc-300 font-mono mb-4 ${className ?? ''}`}
    >
      {children}
    </ol>
  ),
  li: ({ children, className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li {...props} className={`font-mono ${className ?? ''}`}>
      {children}
    </li>
  ),
  blockquote: ({ children }: BaseProps) => (
    <blockquote className="border-l-4 border-emerald-400 pl-4 py-2 text-zinc-400 italic font-mono my-4">
      {children}
    </blockquote>
  ),
  table: Table,
  thead: THead,
  tbody: TBody,
  tr: TRow,
  th: THeaderCell,
  td: TCell,
  Badge,
  img: MdxImage,
  Image: MdxImage,
  Video,
  YouTube,
  MathInline,
  MathBlock,
  a: ({ href, children, className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href?.startsWith('http')
    return (
      <a
        href={href}
        className={`text-emerald-400 underline decoration-emerald-400/60 underline-offset-4 hover:text-emerald-300 hover:decoration-emerald-300 transition-colors ${className ?? ''}`}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    )
  },
}
