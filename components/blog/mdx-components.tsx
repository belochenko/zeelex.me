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

export const mdxComponents = {
  h2: ({ children }: BaseProps) => (
    <h2 className="text-2xl font-bold text-zinc-100 mt-8 mb-4 font-mono">{children}</h2>
  ),
  h3: ({ children }: BaseProps) => (
    <h3 className="text-xl font-bold text-zinc-100 mt-6 mb-3 font-mono">{children}</h3>
  ),
  p: Paragraph,
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
  pre: ({ children }: BaseProps) => (
    <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-x-auto mb-4 font-mono text-sm">
      {children}
    </pre>
  ),
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
}
