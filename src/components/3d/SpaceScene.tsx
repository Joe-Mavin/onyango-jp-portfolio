import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { Stars, OrbitControls } from '@react-three/drei'
import { PlanetSystem } from './PlanetSystem'
import { ParticleField } from './ParticleField'
import { NebulaBackground } from './NebulaBackground'
import { OrbitalCamera } from './OrbitalCamera'
import { HyperspaceTransition } from './HyperspaceTransition'

interface SpaceSceneProps {
  onPlanetClick?: (planetId: string) => void
}

export function SpaceScene({ onPlanetClick }: SpaceSceneProps) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [activePlanet, setActivePlanet] = useState<string | null>(null)

  const handlePlanetClick = (planetId: string) => {
    setIsTransitioning(true)
    setActivePlanet(planetId)
    if (onPlanetClick) {
      onPlanetClick(planetId)
    }
  }

  const handleTransitionComplete = () => {
    setIsTransitioning(false)
  }
  return (
    <div className="fixed inset-0 w-full h-full">
      <Canvas
        camera={{ 
          position: [0, 0, window.innerWidth < 768 ? 15 : 10], 
          fov: window.innerWidth < 768 ? 85 : 75,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: window.innerWidth > 768,
          alpha: true,
          powerPreference: window.innerWidth > 768 ? "high-performance" : "default"
        }}
        dpr={window.innerWidth < 768 ? 1 : window.devicePixelRatio}
      >
        <Suspense fallback={null}>
          {/* Enhanced Lighting */}
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} intensity={1.2} color="#6C1BDB" />
          <pointLight position={[-10, -10, -10]} intensity={0.8} color="#00E5FF" />
          <pointLight position={[0, 15, 5]} intensity={0.6} color="#EAF6FF" />
          
          {/* Volumetric Environment */}
          <ParticleField />
          
          {/* Main Planet System */}
          <PlanetSystem onPlanetClick={handlePlanetClick} />
          
          {/* Controls - Disabled during transitions */}
          {!isTransitioning && (
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              zoomSpeed={0.6}
              panSpeed={0.5}
              rotateSpeed={0.4}
              minDistance={8}
              maxDistance={25}
              maxPolarAngle={Math.PI * 0.8}
              minPolarAngle={Math.PI * 0.2}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}
