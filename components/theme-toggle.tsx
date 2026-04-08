"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Ensure hydration matches server
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-md" style={{ color: "var(--tx-muted)" }} />
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 rounded-md transition-colors flex items-center justify-center"
      style={{ color: "var(--tx-muted)" }}
      onMouseEnter={(e) => { e.currentTarget.style.color = "var(--tx-primary)" }}
      onMouseLeave={(e) => { e.currentTarget.style.color = "var(--tx-muted)" }}
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  )
}
