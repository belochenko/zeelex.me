'use client'

import { useEffect, useState } from 'react'

export default function DyslexiaToggle() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Check initial state
    const isDyslexiaMode = localStorage.getItem('dyslexia_mode') === 'true'
    setEnabled(isDyslexiaMode)
    if (isDyslexiaMode) {
      document.documentElement.classList.add('dyslexia-mode')
    }
  }, [])

  const toggleMode = () => {
    const newState = !enabled
    setEnabled(newState)
    if (newState) {
      document.documentElement.classList.add('dyslexia-mode')
      localStorage.setItem('dyslexia_mode', 'true')
    } else {
      document.documentElement.classList.remove('dyslexia-mode')
      localStorage.setItem('dyslexia_mode', 'false')
    }
  }

  // Prevent hydration mismatch by returning a stable empty shell on first render
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="w-[124px] h-[32px]"></div>
  }

  return (
    <button
      onClick={toggleMode}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-mono tracking-widest uppercase transition-all border ${
        enabled
          ? 'border-[var(--tx-accent)] bg-[var(--tx-accent)]/10 text-[var(--tx-accent)]'
          : 'border-[var(--bg-border-dim)] bg-[var(--bg-base)] text-[var(--tx-muted)] hover:text-[var(--tx-secondary)] hover:border-[var(--bg-border)]'
      }`}
      aria-label="Toggle Dyslexia-friendly reading mode"
    >
      <span
        className={`w-1.5 h-1.5 rounded-full transition-colors ${
          enabled ? 'bg-[var(--tx-accent)] shadow-[0_0_6px_var(--tx-accent)]' : 'bg-[var(--bg-border)]'
        }`}
      />
      {enabled ? 'Dyslexia : ON' : 'Dyslexia : OFF'}
    </button>
  )
}
