import React from "react"
import type { MDXComponents } from "mdx/types"
import { Badge } from "@/components/ui/badge"
import { InteractiveOscillator } from "@/components/lab/InteractiveOscillator"
import OscillatorMassOnSpring from "@/components/lab/OscillatorMassOnSpring"

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
  <figure className="my-8">
    <img
      {...props}
      loading="lazy"
      className={`w-full rounded-[var(--r-tile)] border object-cover shadow-xl ${props.className ?? ''}`}
      style={{ borderColor: "var(--bg-border)", background: "var(--bg-elevated)" }}
    />
    {caption && (
      <figcaption className="mt-3 text-center text-sm" style={{ color: "var(--tx-muted)" }}>
        {caption}
      </figcaption>
    )}
  </figure>
)

const Video = ({ className, ...props }: VideoProps) => (
  <video
    className={`w-full rounded-[var(--r-tile)] border shadow-xl ${className ?? ''}`}
    style={{ borderColor: "var(--bg-border)", background: "var(--bg-base)" }}
    controls
    playsInline
    {...props}
  />
)

const YouTube = ({ id, title }: YouTubeProps) => (
  <div 
    className="relative my-8 aspect-video w-full overflow-hidden rounded-[var(--r-tile)] border shadow-xl"
    style={{ borderColor: "var(--bg-border)" }}
  >
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
    <div 
      className="mb-8 overflow-hidden rounded-[var(--r-tile)] border backdrop-blur-sm"
      style={{ borderColor: "var(--bg-border-dim)", background: "var(--bg-surface)" }}
    >
      <div 
        className="flex items-center justify-between border-b px-4 py-2.5 text-xs font-mono uppercase tracking-wider"
        style={{ borderColor: "var(--bg-border-dim)", background: "var(--bg-elevated)", color: "var(--tx-muted)" }}
      >
        <span>{meta.title ?? 'Code Snippet'}</span>
        <span style={{ color: "var(--tx-accent)" }}>{language}</span>
      </div>
      <pre 
        className="px-5 py-4 text-[13px] md:text-sm font-mono overflow-auto"
        style={{ background: "transparent" }}
      >
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
      className={`mb-[1.25em] text-[16px] md:text-[17px] leading-[1.75] ${className ?? ''}`}
      style={{ color: "#B0B4BE" }}
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
  <div 
    className="my-8 overflow-x-auto rounded-[var(--r-tile)] border"
    style={{ borderColor: "var(--bg-border)", background: "var(--bg-surface)" }}
  >
    <table
      {...props}
      className={`w-full text-[13px] md:text-sm text-left ${className ?? ''}`}
      style={{ color: "var(--tx-primary)" }}
    >
      {children}
    </table>
  </div>
)

const THead = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead
    {...props}
    className={`text-xs uppercase tracking-widest font-mono ${className ?? ''}`}
    style={{ background: "var(--bg-elevated)", color: "var(--tx-muted)" }}
  >
    {children}
  </thead>
)

const TBody = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody
    {...props}
    className={`divide-y ${className ?? ''}`}
  >
    {children}
  </tbody>
)

const TRow = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    {...props}
    className={`transition-colors hover:brightness-125 ${className ?? ''}`}
  >
    {children}
  </tr>
)

const THeaderCell = ({ children, className, ...props }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
  <th
    {...props}
    className={`px-5 py-3.5 font-semibold border-b ${className ?? ''}`}
    style={{ color: "var(--tx-primary)", borderColor: "var(--bg-border)" }}
  >
    {children}
  </th>
)

const TCell = ({ children, className, ...props }: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
  <td
    {...props}
    className={`px-5 py-3 align-top ${className ?? ''}`}
    style={{ color: "var(--tx-secondary)" }}
  >
    {children}
  </td>
)

export const mdxComponents: MDXComponents = {
  h2: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <div className={`mt-[56px] mb-[20px] scroll-mt-24 ${className ?? ''}`}>
      <div 
        className="text-xs font-mono tracking-widest uppercase mb-1.5" 
        style={{ color: "var(--tx-accent)" }}
      >
        {`//`} {typeof children === 'string' ? children : 'Section'}
      </div>
      <h2
        {...props}
        className="text-2xl md:text-[28px] font-semibold tracking-tight leading-tight"
        style={{ color: "var(--tx-primary)" }}
      >
        {children}
      </h2>
    </div>
  ),
  h3: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      {...props}
      className={`text-xl md:text-2xl font-semibold tracking-tight mt-[40px] mb-[16px] scroll-mt-24 ${className ?? ''}`}
      style={{ color: "var(--tx-primary)" }}
    >
      {children}
    </h3>
  ),
  p: Paragraph,
  code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    if (className?.includes('language-')) {
      return (
        <code {...props} className="hljs inline bg-transparent text-sm font-mono" style={{ color: "var(--tx-accent)" }}>
          {children}
        </code>
      )
    }
    return (
      <code 
        {...props} 
        className="px-1.5 py-0.5 rounded-md text-[13px] md:text-sm font-mono tracking-tight"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border-dim)", color: "var(--tx-accent)" }}
      >
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
        className={`rounded-[var(--r-tile)] border p-4 overflow-x-auto mb-6 font-mono text-[13px] md:text-sm ${className ?? ''}`}
        style={{ background: "var(--bg-surface)", borderColor: "var(--bg-border)" }}
      >
        {children}
      </pre>
    )
  },
  CodeBlock,
  ul: ({ children, className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      {...props}
      className={`list-disc list-outside ml-6 space-y-[0.75em] mb-[1.25em] text-[16px] md:text-[17px] leading-[1.75] ${className ?? ''}`}
      style={{ color: "#B0B4BE" }}
    >
      {children}
    </ul>
  ),
  ol: ({ children, className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      {...props}
      className={`list-decimal list-outside ml-6 space-y-[0.75em] mb-[1.25em] text-[16px] md:text-[17px] leading-[1.75] ${className ?? ''}`}
      style={{ color: "#B0B4BE" }}
    >
      {children}
    </ol>
  ),
  li: ({ children, className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li {...props} className={className ?? ''}>
      {children}
    </li>
  ),
  blockquote: ({ children }: BaseProps) => (
    <blockquote 
      className="border-l-4 pl-5 py-1 italic my-8 bg-gradient-to-r rounded-r-xl"
      style={{ 
        borderColor: "var(--tx-accent)", 
        color: "var(--tx-muted)", 
        backgroundImage: "linear-gradient(to right, var(--bg-surface), transparent)"
      }}
    >
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
  InteractiveOscillator,
  OscillatorMassOnSpring,
  a: ({ href, children, className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href?.startsWith('http')
    return (
      <a
        href={href}
        className={`underline underline-offset-4 transition-colors hover:brightness-125 ${className ?? ''}`}
        style={{ color: "var(--tx-accent)", textDecorationColor: "var(--tx-accent)66" }}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    )
  },
}
