import Image from 'next/image'

interface BlogImageProps {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
}

export function BlogImage({ src, alt, caption, width = 800, height = 400 }: BlogImageProps) {
  return (
    <figure className="space-y-2 my-6">
      <div className="relative w-full overflow-hidden rounded-lg border border-zinc-800">
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
        />
      </div>
      {caption && (
        <figcaption className="text-sm text-zinc-400 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
