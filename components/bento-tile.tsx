"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { X } from "lucide-react"

export interface BentoTileProps {
  /** One-liner title shown in compact view */
  title: string
  /** Short subtitle / one-liner */
  oneLiner: string
  /** Tag array */
  tags: string[]
  /** Hex color that propagates to dot, badge border, gradient, hover glow */
  accentColor: string
  /** Status label shown next to dot */
  status?: string
  /** JetBrains Mono timestamp */
  publishedAt?: string
  /** Grid column span class, e.g. "col-7" */
  colSpan?: string
  /** Default layout: vertical or horizontal or square-image */
  layout?: "vertical" | "horizontal" | "square-image"
  /** Image string for square-image layout */
  imagePath?: string
  /** Extra CSS classes on the tile wrapper */
  className?: string
  /** Inline styles for the tile wrapper */
  style?: React.CSSProperties
  /** Detail slot rendered inside the overlay */
  children?: React.ReactNode
  /** Optional click override (e.g. external link tile) */
  onClick?: () => void
  /** Disable overlay — use onClick instead */
  noOverlay?: boolean
}

export function BentoTile({
  title,
  oneLiner,
  tags,
  accentColor,
  status = "active",
  publishedAt,
  colSpan = "col-7",
  layout = "vertical",
  imagePath,
  className = "",
  style,
  children,
  onClick,
  noOverlay = false,
}: BentoTileProps) {
  const [open, setOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  const handleOpen = useCallback(() => {
    if (noOverlay && onClick) { onClick(); return }
    if (!noOverlay) setOpen(true)
  }, [noOverlay, onClick])

  const handleClose = useCallback(() => setOpen(false), [])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose() }
    document.addEventListener("keydown", handler)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
    }
  }, [open, handleClose])

  // Click outside overlay to close
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
      handleClose()
    }
  }, [handleClose])

  const glowShadow = `0 0 0 1px ${accentColor}55, 0 0 18px ${accentColor}22`
  const radialGradient = `radial-gradient(ellipse at top left, ${accentColor}0d 0%, transparent 60%)`

  return (
    <>
      {/* ── COMPACT TILE ── */}
      <div
        className={`tile ${colSpan} ${className} ${layout === "square-image" ? "aspect-square p-0 overflow-hidden relative group" : ""}`}
        style={layout === "square-image" ? { cursor: "pointer", ...style } : {
          background: `var(--bg-surface)`,
          backgroundImage: radialGradient,
          cursor: "pointer",
          ...style
        }}
        onClick={handleOpen}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleOpen() }}
        tabIndex={0}
        role="button"
        aria-haspopup={!noOverlay ? "dialog" : undefined}
        aria-expanded={open}
        // hover glow via inline style override — JS injects on hover
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = glowShadow
          ;(e.currentTarget as HTMLElement).style.borderColor = `${accentColor}44`
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.boxShadow = ""
          ;(e.currentTarget as HTMLElement).style.borderColor = ""
        }}
      >
        {layout === "vertical" ? (
          <>
            {/* Top row: status dot + timestamp */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="status-dot"
                  style={{ background: accentColor }}
                  aria-label={status}
                />
                <span
                  className="text-[10px] uppercase tracking-[0.12em]"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    color: accentColor,
                    opacity: 0.85,
                  }}
                >
                  {status}
                </span>
              </div>
              {publishedAt && (
                <time
                  className="text-[10px]"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    color: "var(--tx-muted)",
                  }}
                >
                  {publishedAt}
                </time>
              )}
            </div>

            {/* Title */}
            <span
              className="block font-semibold text-sm leading-snug mb-1"
              style={{ color: "var(--tx-primary)", fontVariantNumeric: "tabular-nums" } as React.CSSProperties}
            >
              {title}
            </span>

            {/* One-liner */}
            <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--tx-secondary)" }}>
              {oneLiner}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="tag-pill"
                  style={{
                    borderColor: `${accentColor}44`,
                    color: accentColor,
                    background: `${accentColor}0e`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        ) : layout === "horizontal" ? (
          /* ── HORIZONTAL TILE (DENSE LIST) ── */
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Status, Title, Description */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="status-dot" style={{ background: accentColor }} aria-label={status} />
                <span className="font-semibold text-sm" style={{ color: "var(--tx-primary)", fontVariantNumeric: "tabular-nums" } as React.CSSProperties}>
                  {title}
                </span>
              </div>
              <span className="hidden md:inline text-xs" style={{ color: "var(--tx-muted)" }}>—</span>
              <p className="text-xs truncate" style={{ color: "var(--tx-secondary)" }}>
                {oneLiner}
              </p>
            </div>

            {/* Right: Tags and Date */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="flex flex-wrap gap-1.5 hidden sm:flex">
                {tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="tag-pill text-[10px] px-1.5 py-0.5"
                    style={{
                      borderColor: `${accentColor}44`,
                      color: accentColor,
                      background: `${accentColor}0e`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {publishedAt && (
                <time
                  className="text-[10px] text-right w-20"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    color: "var(--tx-muted)",
                  }}
                >
                  {publishedAt}
                </time>
              )}
            </div>
          </div>
        ) : (
          /* ── SQUARE IMAGE TILE ── */
          <>
            {imagePath && (
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out 
                           grayscale brightness-[0.4] group-hover:grayscale-[20%] group-hover:brightness-90 group-hover:scale-105"
                style={{ backgroundImage: `url(${imagePath})` }}
              />
            )}
            {/* Always use a distinct dark gradient at the bottom for image readability */}
            <div className="absolute inset-x-0 bottom-0 h-[85%] bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/70 to-transparent pointer-events-none" />

            <div className="relative h-full flex flex-col justify-end p-5 md:p-6 z-10 transition-transform duration-500 ease-out sm:group-hover:-translate-y-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="status-dot shadow-none" style={{ background: accentColor }} />
                  <span className="text-[10px] uppercase tracking-widest font-mono drop-shadow-md" style={{ color: accentColor }}>{status}</span>
                </div>
              </div>
              
              <span className="block font-semibold text-lg md:text-xl leading-snug mb-1 drop-shadow-lg text-white">
                {title}
              </span>
              
              <p className="text-xs md:text-sm leading-relaxed mb-4 drop-shadow-md line-clamp-3 text-zinc-300">
                {oneLiner}
              </p>
              
              <div className="flex flex-wrap gap-1.5 opacity-100 sm:opacity-0 sm:translate-y-4 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-500 delay-75">
                {tags.slice(0, 3).map(tag => (
                  <span key={tag} className="tag-pill backdrop-blur-md" style={{
                    background: "rgba(0,0,0,0.6)",
                    borderColor: `${accentColor}55`,
                    color: accentColor,
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)"
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── DETAIL OVERLAY ── */}
      {open && (
        <div
          className="overlay-backdrop"
          onClick={handleBackdropClick}
          aria-modal="true"
          role="dialog"
          aria-label={`Detail: ${title}`}
        >
          <div
            ref={overlayRef}
            className="overlay-panel"
            style={{ borderColor: `${accentColor}33` }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1 rounded-md transition-colors"
              style={{ color: "var(--tx-muted)" }}
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {/* Overlay header */}
            <div className="mb-5 pr-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="status-dot" style={{ background: accentColor }} />
                <span
                  className="text-[10px] uppercase tracking-widest"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    color: accentColor,
                  }}
                >
                  {status}
                </span>
                {publishedAt && (
                  <time
                    className="text-[10px] ml-auto"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      color: "var(--tx-muted)",
                    }}
                  >
                    {publishedAt}
                  </time>
                )}
              </div>
              <h2
                className="text-xl font-semibold mb-1"
                style={{ color: accentColor }}
              >
                {title}
              </h2>
              <p className="text-sm" style={{ color: "var(--tx-secondary)" }}>
                {oneLiner}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="tag-pill"
                  style={{
                    borderColor: `${accentColor}44`,
                    color: accentColor,
                    background: `${accentColor}0e`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Detail slot */}
            {children && (
              <div className="text-sm leading-relaxed" style={{ color: "var(--tx-secondary)" }}>
                {children}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
