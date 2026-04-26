import { useEffect, useRef } from 'react'

/**
 * Animated 3D-style mesh gradient background
 * Pure CSS + canvas — no Three.js dependency needed for this subtle effect.
 * For the landing hero, we use @react-three/fiber (see HeroScene.jsx).
 */
export default function MeshBackground({ intensity = 'normal' }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Primary orb */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 animate-float"
        style={{
          background: 'radial-gradient(circle, #6366f1, transparent)',
          top: '-10%',
          left: '-10%',
          animationDelay: '0s',
        }}
      />
      {/* Secondary orb */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-15 animate-float"
        style={{
          background: 'radial-gradient(circle, #ec4899, transparent)',
          bottom: '-5%',
          right: '-5%',
          animationDelay: '2s',
        }}
      />
      {/* Tertiary orb */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-10 animate-float"
        style={{
          background: 'radial-gradient(circle, #14b8a6, transparent)',
          top: '50%',
          left: '40%',
          animationDelay: '4s',
        }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(var(--brand) 1px, transparent 1px),
            linear-gradient(90deg, var(--brand) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}
