'use client'

import { useEffect } from 'react'

export default function MathJaxLoader() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    let attempts = 0
    const maxAttempts = 50

    const tryTypeset = () => {
      const mj = (window as any).MathJax
      if (mj?.typesetPromise) {
        mj.typesetPromise()
        return true
      }
      return false
    }

    if (tryTypeset()) return

    const interval = window.setInterval(() => {
      attempts += 1
      if (tryTypeset() || attempts >= maxAttempts) {
        window.clearInterval(interval)
      }
    }, 120)

    return () => window.clearInterval(interval)
  }, [])

  return null
}
