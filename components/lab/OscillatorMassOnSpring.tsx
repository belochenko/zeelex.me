"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"

export default function OscillatorsMassOnSpring() {
  const [M, setM] = useState(2.0)   // frame mass kg
  const [m, setm] = useState(1.0)   // inner mass kg
  const [k, setK] = useState(40.0)  // spring stiffness N/m
  const [c, setC] = useState(0.5)   // damping N·s/m
  const [ic, setIc] = useState(1.5) // initial displacement (downward, m)

  const [running, setRunning] = useState(true)
  const [trail, setTrail] = useState<{ x1: number; x2: number; t: number }[]>([])
  const [tick, setTick] = useState(0)

  const stateRef = useRef([0, 0, -ic, 0])  // [y2, v2, y1, v1] with UPWARD positive
  const tRef = useRef(0)
  const rafRef = useRef<number>()
  const prevTsRef = useRef<number>()

  const reset = useCallback(() => {
    stateRef.current = [0, 0, -ic, 0]
    tRef.current = 0
    prevTsRef.current = undefined
    setTrail([])
    setTick(t => t + 1)
  }, [ic])

  useEffect(() => { reset() }, [M, m, k, c, ic, reset])

  useEffect(() => {
    if (!running) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    const step = (ts: number) => {
      if (prevTsRef.current != null) {
        const dtRender = Math.min((ts - prevTsRef.current) / 1000, 0.04)
        const steps = 100
        const dt = dtRender / steps

        let [y2, v2, y1, v1] = stateRef.current

        for (let i = 0; i < steps; i++) {
          const delta = y1 - y2
          const deltaDot = v1 - v2

          // Upward force from spring on the frame.
          // At y1=y2=0, spring pulls M down by m*g
          const F_spring_up_M = k * delta + c * deltaDot - m * 9.81
          let a2 = (F_spring_up_M - M * 9.81) / M
          if (y2 <= 0 && a2 < 0) {
            a2 = 0
          }

          const F_spring_up_m = -k * delta - c * deltaDot
          const a1 = F_spring_up_m / m

          v1 += a1 * dt
          y1 += v1 * dt

          v2 += a2 * dt
          y2 += v2 * dt

          if (y2 < 0) {
            y2 = 0
            if (v2 < 0) v2 = -v2 * 0.3 // slight inelastic bounce
          }
        }

        stateRef.current = [y2, v2, y1, v1]
        tRef.current += dtRender

        setTrail(prev => {
          const next = [...prev, { x1: -y1, x2: -y2, t: tRef.current }]
          // retain history dynamically to fill the time window
          return next.filter(p => p.t >= tRef.current - 5.0)
        })
      }
      prevTsRef.current = ts
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [running, M, m, k, c])

  // ── Layout constants ──────────────────────────────────────────────────────
  const SCALE = 45  // px per metre of displacement
  const FLOOR_Y = 280

  const FRAME_W = 100, FRAME_H = 180
  const WALL = 12
  const MASS_W = 40, MASS_H = 26
  const CX = 140

  let [y2, , y1,] = stateRef.current
  if (isNaN(y2)) y2 = 0
  if (isNaN(y1)) y1 = 0

  // Frame math
  const frameOuterBot = FLOOR_Y - y2 * SCALE
  const frameOuterTop = frameOuterBot - FRAME_H - 2 * WALL
  const frameInnerTop = frameOuterTop + WALL

  // Mass math
  const REST_SPRING_LEN = 80 // pixels from ceiling
  const massTop = frameInnerTop + REST_SPRING_LEN - (y1 - y2) * SCALE
  const massTopC = Math.max(frameInnerTop + 2, Math.min(massTop, frameOuterBot - WALL - MASS_H - 2))

  // Plotting
  const tWindow = 5
  const tNow = tRef.current
  const toPlotX = (t: number) => ((t - (tNow - tWindow)) / tWindow) * 400
  // Map displacement to Y: 0 is at Y=180 (center of 360), positive (upward) moves to smaller Y
  const toPlotY = (v: number) => 180 - v * 70

  const x1Path = trail.length > 1
    ? "M " + trail.map(p => `${toPlotX(p.t).toFixed(1)},${toPlotY(p.x1).toFixed(1)}`).join(" L ")
    : ""
  const x2Path = trail.length > 1
    ? "M " + trail.map(p => `${toPlotX(p.t).toFixed(1)},${toPlotY(p.x2).toFixed(1)}`).join(" L ")
    : ""

  return (
    <div className="my-8 rounded-[4px] border border-[#d1d0cb] bg-white shadow-sm font-sans flex flex-col overflow-hidden">

      {/* TOP ROW: Visuals */}
      <div className="flex flex-col md:flex-row bg-[#f9f9f8] border-b border-[#e5e4df]">
      
        {/* Visual system */}
        <div className="relative w-full md:w-[320px] h-[360px] shrink-0 border-r border-[#e5e4df] bg-white text-[#1c1c1f]">
          <div className="absolute top-3 left-4 text-[10px] font-mono tracking-widest text-[#818188] uppercase z-10">
            Physical System
          </div>

          <svg width="100%" height="100%" viewBox="0 0 320 360">
            <defs>
              <pattern id="h" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#d1d0cb" strokeWidth="2.5" />
              </pattern>
              <pattern id="floor" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#e5e4df" strokeWidth="2" />
              </pattern>
            </defs>

            {/* Floor */}
            <line x1={40} y1={FLOOR_Y} x2={280} y2={FLOOR_Y} stroke="#818188" strokeWidth="1.5" />
            <rect x={40} y={FLOOR_Y} width={240} height={12} fill="url(#floor)" />

            {/* Frame Box */}
            <rect x={CX - FRAME_W / 2} y={frameOuterTop} width={FRAME_W} height={WALL} fill="url(#h)" stroke="#a1a09a" strokeWidth="1" />
            <rect x={CX - FRAME_W / 2} y={frameOuterTop + WALL} width={WALL} height={FRAME_H} fill="url(#h)" stroke="#a1a09a" strokeWidth="1" />
            <rect x={CX + FRAME_W / 2 - WALL} y={frameOuterTop + WALL} width={WALL} height={FRAME_H} fill="url(#h)" stroke="#a1a09a" strokeWidth="1" />
            <rect x={CX - FRAME_W / 2} y={frameOuterBot - WALL} width={FRAME_W} height={WALL} fill="url(#h)" stroke="#a1a09a" strokeWidth="1" />

            {/* Spring */}
            <path
              d={`M ${CX} ${frameInnerTop} ` + Array.from({ length: 12 }).map((_, i) => {
                const seg = (massTopC - frameInnerTop) / 12
                return `L ${CX + (i % 2 === 0 ? 10 : -10)} ${frameInnerTop + seg * (i + 0.5)} L ${CX} ${frameInnerTop + seg * (i + 1)}`
              }).join(' ')}
              fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinejoin="round"
            />

            {/* Mass */}
            <rect
              x={CX - MASS_W / 2} y={massTopC} width={MASS_W} height={MASS_H} rx={2}
              fill="#d97706" stroke="#92400e" strokeWidth="1.5"
            />
            <text x={CX} y={massTopC + MASS_H / 2 + 4} textAnchor="middle" fontSize={11} fill="#fff" fontFamily="mono">
              m
            </text>
            <text x={CX + FRAME_W / 2 + 10} y={frameOuterTop + 30} textAnchor="start" fontSize={12} fill="#6b7280" fontFamily="mono">
              M
            </text>
          </svg>
        </div>

        {/* Trajectory plot */}
        <div className="relative w-full h-[360px] flex-grow bg-[#f9f9f8]">
          <div className="absolute top-4 left-5 text-[10px] font-mono tracking-widest text-[#818188] uppercase z-10">
            Trajectory
          </div>

          {/* Dynamic plot */}
          <svg preserveAspectRatio="none" viewBox="0 0 400 360" className="absolute inset-0 w-full h-full overflow-visible">
            {/* Neutral Axis */}
            <line x1="0" y1="180" x2="400" y2="180" stroke="#d1d0cb" strokeWidth="1" strokeDasharray="4 4" />

            {x1Path && <path d={x1Path} fill="none" stroke="#d97706" strokeWidth="2" strokeLinejoin="round" opacity={0.9} />}
            {x2Path && <path d={x2Path} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" opacity={0.9} />}

            <rect x={16} y={40} width={6} height={6} fill="#d97706" />
            <text x={28} y={47} fontSize={10} fill="#6b7280" fontFamily="monospace">Mass (x₁)</text>

            <rect x={16} y={55} width={6} height={6} fill="#2563eb" />
            <text x={28} y={62} fontSize={10} fill="#6b7280" fontFamily="monospace">Frame (x₂)</text>
          </svg>
        </div>
      </div>

      {/* BOTTOM ROW: Control Panel */}
      <div className="p-4 bg-white flex flex-col sm:flex-row flex-wrap gap-4 justify-between items-center text-sm text-[#1c1c1f]">

        {/* Sliders */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 w-full">
          {[
            { label: "Frame Mass (M)", val: M, set: setM, min: 1, max: 10, step: 0.5, unit: "kg" },
            { label: "Inner Mass (m)", val: m, set: setm, min: 0.5, max: 5, step: 0.5, unit: "kg" },
            { label: "Stiffness (k)", val: k, set: setK, min: 10, max: 200, step: 5, unit: "N/m" },
            { label: "Damping (c)", val: c, set: setC, min: 0, max: 5, step: 0.1, unit: "N·s/m" },
            { label: "Initial Stretch", val: ic, set: setIc, min: 0, max: 3, step: 0.1, unit: "m" },
          ].map(({ label, val, set, min, max, step, unit }) => (
            <div key={label} className="flex flex-col gap-1 w-full">
              <div className="flex justify-between font-mono text-[11px] uppercase tracking-wide">
                <label className="font-bold">{label}</label>
                <span className="text-[#818188]">{val.toFixed(1)} {unit}</span>
              </div>
              <input
                type="range" min={min} max={max} step={step} value={val}
                onChange={e => {
                  set(parseFloat(e.target.value))
                }}
                className="w-full h-1 bg-[#e5e4df] rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-row md:flex-col gap-2 shrink-0 md:pl-4 md:border-l border-[#e5e4df]">
          <button
            onClick={() => {
              if (!running) prevTsRef.current = undefined;
              setRunning(!running);
            }}
            className="flex-1 px-6 py-2 border border-[#d1d0cb] rounded-sm font-mono text-xs uppercase tracking-wider hover:bg-[#f2f1ef] transition-colors"
          >
            {running ? "Pause" : "Play"}
          </button>
          <button
            onClick={reset}
            className="flex-1 px-6 py-2 border border-[#d1d0cb] rounded-sm font-mono text-xs uppercase tracking-wider hover:bg-[#ffebee] transition-colors text-[#b91c1c]"
          >
            Reset
          </button>
        </div>

      </div>
    </div>
  )
}