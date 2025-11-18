'use client'

import { useEffect } from 'react'

export default function CodeHighlighter() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    let attempts = 0
    const maxAttempts = 30

    const tryHighlight = () => {
      const hljs = (window as any).hljs
      if (hljs?.highlightAll) {
        hljs.highlightAll()
        return true
      }
      return false
    }

    if (tryHighlight()) {
      return
    }

    const interval = window.setInterval(() => {
      attempts += 1
      if (tryHighlight() || attempts >= maxAttempts) {
        window.clearInterval(interval)
      }
    }, 200)

    return () => window.clearInterval(interval)
  }, [])

  return null
}
