'use client'

import { useEffect, useState } from 'react'

type Heading = {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  headings: Heading[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -60% 0px' } // Triggers slightly above the middle of viewport
    )

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <aside className="hidden lg:block lg:w-56 xl:w-64 sticky top-24 shrink-0 max-h-[calc(100vh-8rem)] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="border-l pl-4 lg:ml-6 xl:ml-10" style={{ borderColor: "var(--bg-border-dim)" }}>
        <p className="text-xs uppercase tracking-widest font-mono" style={{ color: "var(--tx-muted)" }}>
          // Contents
        </p>
        <nav className="mt-5 flex flex-col gap-1.5">
          {headings.map((heading) => {
            const indent = heading.level === 1 ? '' : heading.level === 2 ? 'pl-2' : 'pl-5'
            const isActive = activeId === heading.id
            return (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={`block text-[13px] leading-snug py-1 transition-all duration-300 ${indent} ${
                  isActive ? 'font-medium' : ''
                }`}
                style={{
                  color: isActive ? "var(--tx-accent)" : "var(--tx-secondary)",
                  transform: isActive ? "translateX(6px)" : "translateX(0)",
                }}
              >
                {heading.text}
              </a>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
