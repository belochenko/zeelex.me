"use client"

import React, { useState, useEffect, useRef } from "react"

export function InteractiveOscillator() {
  const [zeta, setZeta] = useState(0.1) // Damping ratio
  const [omega, setOmega] = useState(3.0) // Natural frequency rad/s
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(true)

  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()

  // Mathematical displacement function
  const calculateDisplacement = (t: number) => {
    const A = 1 // Initial amplitude
    
    if (zeta < 1) {
      // Underdamped
      const omega_d = omega * Math.sqrt(1 - zeta * zeta)
      return A * Math.exp(-zeta * omega * t) * Math.cos(omega_d * t)
    } else if (zeta === 1) {
      // Critically damped
      return A * (1 + omega * t) * Math.exp(-omega * t)
    } else {
      // Overdamped
      const s1 = -omega * (zeta - Math.sqrt(zeta * zeta - 1))
      const s2 = -omega * (zeta + Math.sqrt(zeta * zeta - 1))
      const c1 = (A * s2) / (s2 - s1)
      const c2 = (A * s1) / (s1 - s2)
      return c1 * Math.exp(s1 * t) + c2 * Math.exp(s2 * t)
    }
  }

  // Animation Loop for the moving mass
  const animate = (timestamp: number) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = (timestamp - previousTimeRef.current) / 1000 // Convert ms to s
      setTime((prevTime) => (prevTime + deltaTime) % 15) // Reset after 15s to loop
    }
    previousTimeRef.current = timestamp
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate)
    }
  }

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate)
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [isRunning, zeta, omega])

  // Generate SVG Path for the Plot
  const generatePath = () => {
    const points = []
    const duration = 15 // plot up to 15 seconds
    const width = 600
    const height = 200
    const resolution = 200 // Number of segments

    for (let i = 0; i <= resolution; i++) {
      const t = (i / resolution) * duration
      const xDisplay = (t / duration) * width
      // Y logic: Map domain [-1, 1] to range [height, 0] with some padding
      const displacement = calculateDisplacement(t)
      const yDisplay = height / 2 - (displacement * (height / 2.5))
      points.push(`${xDisplay},${yDisplay}`)
    }
    return `M ${points.join(" L ")}`
  }

  const currentDisplacement = calculateDisplacement(time)

  return (
    <div className="my-8 rounded-[4px] border p-1 border-[#d1d0cb] bg-white shadow-sm font-sans flex flex-col overflow-hidden">
      {/* 1. Visual Plot area */}
      <div className="w-full relative h-[240px] bg-[#f9f9f8] p-4 flex flex-col gap-4 border-b border-[#e5e4df]">
        <div className="absolute top-2 left-4 text-[10px] font-mono tracking-widest text-[#818188] uppercase">
          Dynamic System Trace
        </div>
        
        {/* Animated Mass Visualization */}
        <div className="w-full h-8 relative mt-4 border-l border-r border-[#d1d0cb] bg-white/50 flex items-center">
          <div className="absolute w-full h-[1px] bg-dashed bg-[#d1d0cb] top-1/2" />
          <div 
            className="absolute h-6 w-6 rounded-sm bg-[#d97706] shadow-md border border-[#92400e] flex items-center justify-center text-[8px] font-mono text-white"
            style={{ 
              left: `${50 + (currentDisplacement * 45)}%`, 
              transform: 'translateX(-50%)' 
            }}
          >
            M
          </div>
        </div>

        {/* SVG Math Curve */}
        <svg viewBox="0 0 600 200" preserveAspectRatio="none" className="w-full h-full flex-grow mt-2 overflow-visible">
          {/* Neutral Axis */}
          <line x1="0" y1="100" x2="600" y2="100" stroke="#d1d0cb" strokeWidth="1" strokeDasharray="4 4" />
          {/* T-tracker line */}
          <line 
            x1={(time / 15) * 600} 
            y1="0" 
            x2={(time / 15) * 600} 
            y2="200" 
            stroke="#1c1c1f" 
            strokeWidth="1" 
            opacity={0.3} 
          />
          {/* Math Curve */}
          <path 
            d={generatePath()} 
            fill="none" 
            stroke="#1c1c1f" 
            strokeWidth="2"
            strokeLinejoin="round" 
            strokeLinecap="round" 
          />
          {/* Tracking dot */}
          <circle 
            cx={(time / 15) * 600} 
            cy={100 - (currentDisplacement * 80)} 
            r="4" 
            fill="#d97706" 
          />
        </svg>
      </div>

      {/* 2. Control Panel */}
      <div className="p-4 bg-white flex flex-col sm:flex-row gap-6 justify-between items-center text-sm text-[#1c1c1f]">
        
        <div className="flex-1 flex flex-col gap-2 w-full">
          <div className="flex justify-between font-mono text-xs">
            <label className="font-bold">Damping Ratio (ζ)</label>
            <span className="text-[#818188]">{zeta.toFixed(2)}</span>
          </div>
          <input 
            type="range" 
            min="0" max="2" step="0.05" 
            value={zeta} 
            onChange={(e) => setZeta(parseFloat(e.target.value))}
            className="w-full h-1 bg-[#e5e4df] rounded-lg appearance-none cursor-pointer accent-[#d97706]"
          />
          <span className="text-[10px] text-[#818188] italic">
            {zeta < 1 ? "Underdamped" : zeta === 1 ? "Critically Damped" : "Overdamped"}
          </span>
        </div>

        <div className="flex-1 flex flex-col gap-2 w-full">
          <div className="flex justify-between font-mono text-xs">
            <label className="font-bold">Natural Frequency (ω_n)</label>
            <span className="text-[#818188]">{omega.toFixed(1)} rad/s</span>
          </div>
          <input 
            type="range" 
            min="0.5" max="10" step="0.5" 
            value={omega} 
            onChange={(e) => setOmega(parseFloat(e.target.value))}
            className="w-full h-1 bg-[#e5e4df] rounded-lg appearance-none cursor-pointer accent-[#d97706]"
          />
        </div>

        <button 
          onClick={() => {
            if (!isRunning) previousTimeRef.current = undefined; // reset timing to prevent jumps
            setIsRunning(!isRunning);
          }}
          className="px-4 py-2 border border-[#d1d0cb] rounded-sm font-mono text-xs uppercase tracking-wider hover:bg-[#f2f1ef] transition-colors"
        >
          {isRunning ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  )
}
