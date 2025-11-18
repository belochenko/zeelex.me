'use client'

import { useEffect } from 'react'

export default function MathJaxLoader() {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).MathJax) {
      (window as any).MathJax.typesetPromise?.()
    }
  }, [])

  return null
}
