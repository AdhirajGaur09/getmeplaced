import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, Suspense } from 'react'
import { Float, MeshDistortMaterial, Sphere, Torus, Box } from '@react-three/drei'
import * as THREE from 'three'

function FloatingOrb({ position, color, speed = 1, distort = 0.4 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(clock.elapsedTime * speed * 0.3) * 0.5
      ref.current.rotation.y += 0.005 * speed
    }
  })
  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1.5}>
      <Sphere ref={ref} args={[1, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </Sphere>
    </Float>
  )
}

function FloatingRing({ position, color }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.elapsedTime * 0.3
      ref.current.rotation.y = clock.elapsedTime * 0.2
    }
  })
  return (
    <Float speed={1.5} floatIntensity={1}>
      <Torus ref={ref} args={[1.5, 0.08, 16, 100]} position={position}>
        <meshStandardMaterial color={color} metalness={1} roughness={0} />
      </Torus>
    </Float>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#6366f1" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />

      <FloatingOrb position={[-3, 1, -2]} color="#6366f1" speed={0.8} distort={0.5} />
      <FloatingOrb position={[3, -1, -3]} color="#ec4899" speed={1.2} distort={0.3} />
      <FloatingOrb position={[0, 2, -5]} color="#14b8a6" speed={0.6} distort={0.6} />

      <FloatingRing position={[2, 2, -4]} color="#818cf8" />
      <FloatingRing position={[-2, -2, -6]} color="#f472b6" />
    </>
  )
}

export default function HeroScene({ className = '' }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
