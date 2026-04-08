"use client"

import { useState, useEffect } from "react"

interface MascotProps {
  size?: number
  style?: React.CSSProperties
  className?: string
}

export function Mascot({ size = 48, style, className }: MascotProps) {
  const [blink, setBlink] = useState(false)
  const [look, setLook] = useState({ x: 0, y: 0 })
  const [antennaPulse, setAntennaPulse] = useState(false)

  // periodic blink
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const schedule = () => {
      timeout = setTimeout(() => {
        setBlink(true)
        setTimeout(() => {
          setBlink(false)
          setAntennaPulse(true)
          setTimeout(() => setAntennaPulse(false), 400)
          schedule()
        }, 150)
      }, 2800 + Math.random() * 2200)
    }
    schedule()
    return () => clearTimeout(timeout)
  }, [])

  // mouse tracking — eyes follow cursor
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      setLook({
        x: Math.max(-2.5, Math.min(2.5, ((e.clientX - cx) / cx) * 2.5)),
        y: Math.max(-1.8, Math.min(1.8, ((e.clientY - cy) / cy) * 1.8)),
      })
    }
    window.addEventListener("mousemove", handler)
    return () => window.removeEventListener("mousemove", handler)
  }, [])

  const eyeH = blink ? 0.5 : 3

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={className}
      aria-label="Zeelex mascot"
      role="img"
    >
      {/* Antenna stem */}
      <line x1="24" y1="8" x2="24" y2="2" stroke="#3A3D47" strokeWidth="1.5" strokeLinecap="round" />
      {/* Antenna ball — pulses on blink */}
      <circle
        cx="24"
        cy="1.5"
        r="1.8"
        fill={antennaPulse ? "#ffe08a" : "#D4A843"}
        style={{ transition: "fill 0.15s ease" }}
      />

      {/* Body — rounded rect */}
      <rect x="4" y="8" width="40" height="32" rx="8" fill="#1E2028" stroke="#3A3D47" strokeWidth="1.5" />

      {/* Face screen */}
      <rect x="8" y="12" width="32" height="20" rx="4" fill="#0C0D11" />

      {/* Left eye */}
      <rect
        x={15 + look.x}
        y={20 + look.y}
        width="5"
        height={eyeH}
        rx="1"
        fill="#43D4A8"
        style={{ transition: "height 0.1s ease, y 0.08s ease" }}
      />
      {/* Right eye */}
      <rect
        x={28 + look.x}
        y={20 + look.y}
        width="5"
        height={eyeH}
        rx="1"
        fill="#43D4A8"
        style={{ transition: "height 0.1s ease, y 0.08s ease" }}
      />

      {/* Mouth — tiny grill lines */}
      <line x1="16" y1="28" x2="32" y2="28" stroke="#2a2d36" strokeWidth="1" />
      <line x1="18" y1="30" x2="30" y2="30" stroke="#2a2d36" strokeWidth="0.8" />

      {/* Left foot */}
      <rect x="10" y="40" width="10" height="5" rx="2.5" fill="#1E2028" stroke="#3A3D47" strokeWidth="1" />
      {/* Right foot */}
      <rect x="28" y="40" width="10" height="5" rx="2.5" fill="#1E2028" stroke="#3A3D47" strokeWidth="1" />

      {/* Terminal cursor under feet */}
      <rect x="21" y="47" width="6" height="2" rx="1" fill="#43D4A8" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0;0.7" dur="1.1s" repeatCount="indefinite" />
      </rect>
    </svg>
  )
}
