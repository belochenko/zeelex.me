'use client'

import React, { useEffect } from 'react'

type Props = {
  children: React.ReactNode
}

export default function MathJaxWrapper({ children }: Props) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    let cancelled = false

    const typeset = async () => {
      const mj = (window as any).MathJax
      if (!mj) return

      try {
        if (mj.startup?.promise) {
          await mj.startup.promise
        }
        if (cancelled) return

        if (mj.typesetPromise) {
          await mj.typesetPromise()
        } else if (mj.Hub?.Queue) {
          mj.Hub.Queue(['Typeset', mj.Hub])
        }
      } catch {
        // ignore
      }
    }

    typeset()

    return () => {
      cancelled = true
    }
  }, [children])

  return <>{children}</>
}
