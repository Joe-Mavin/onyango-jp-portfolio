import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points } from 'three'
import * as THREE from 'three'

export function ParticleField() {
  const distantStarsRef = useRef<Points>(null)
  const energyDustRef = useRef<Points>(null)
  
  // Distant Stars - Static with subtle parallax
  const { starPositions, starColors, starCount } = useMemo(() => {
    const starCount = window.innerWidth < 768 ? 1500 : 3000 // Reduce for mobile
    const positions = new Float32Array(starCount * 3)
    const colors = new Float32Array(starCount * 3)
    const starColor = new THREE.Color('#EAF6FF')
    
    for (let i = 0; i < starCount; i++) {
      // Distribute in a large sphere
      const radius = Math.random() * 200 + 100
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      // Varying brightness
      const brightness = 0.3 + Math.random() * 0.7
      colors[i * 3] = starColor.r * brightness
      colors[i * 3 + 1] = starColor.g * brightness
      colors[i * 3 + 2] = starColor.b * brightness
    }
    
    return { starPositions: positions, starColors: colors, starCount }
  }, [])

  // Energy Dust - Fast moving with wispy trails
  const { dustPositions, dustColors, dustVelocities, dustCount } = useMemo(() => {
    const dustCount = window.innerWidth < 768 ? 750 : 1500 // Reduce for mobile
    const positions = new Float32Array(dustCount * 3)
    const colors = new Float32Array(dustCount * 3)
    const velocities = new Float32Array(dustCount * 3)
    
    const colorPalette = [
      new THREE.Color('#6C1BDB'), // Nebula purple
      new THREE.Color('#00E5FF'), // Cyber neon blue
      new THREE.Color('#EAF6FF'), // Subtle white
    ]
    
    for (let i = 0; i < dustCount; i++) {
      // Start particles in a cylinder around the scene
      const radius = Math.random() * 50 + 10
      const angle = Math.random() * Math.PI * 2
      const height = (Math.random() - 0.5) * 100
      
      positions[i * 3] = radius * Math.cos(angle)
      positions[i * 3 + 1] = height
      positions[i * 3 + 2] = radius * Math.sin(angle)
      
      // Forward velocity with some randomness
      velocities[i * 3] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 2] = -0.05 - Math.random() * 0.03 // Mainly forward
      
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      const alpha = 0.2 + Math.random() * 0.6
      colors[i * 3] = color.r * alpha
      colors[i * 3 + 1] = color.g * alpha
      colors[i * 3 + 2] = color.b * alpha
    }
    
    return { dustPositions: positions, dustColors: colors, dustVelocities: velocities, dustCount }
  }, [])

  useFrame((state) => {
    // Distant stars - subtle parallax only
    if (distantStarsRef.current) {
      distantStarsRef.current.rotation.y += 0.0001
      distantStarsRef.current.rotation.x += 0.00005
    }

    // Energy dust - constant forward motion
    if (energyDustRef.current) {
      const positions = energyDustRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < dustCount; i++) {
        const i3 = i * 3
        
        // Update positions based on velocity
        positions[i3] += dustVelocities[i3]
        positions[i3 + 1] += dustVelocities[i3 + 1]
        positions[i3 + 2] += dustVelocities[i3 + 2]
        
        // Reset particles that have moved too far
        if (positions[i3 + 2] < -50) {
          const radius = Math.random() * 50 + 10
          const angle = Math.random() * Math.PI * 2
          positions[i3] = radius * Math.cos(angle)
          positions[i3 + 1] = (Math.random() - 0.5) * 100
          positions[i3 + 2] = 50
        }
      }
      
      energyDustRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <>
      {/* Distant Stars */}
      <points ref={distantStarsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starCount}
            array={starPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={starCount}
            array={starColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation={true}
        />
      </points>

      {/* Energy Dust */}
      <points ref={energyDustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={dustCount}
            array={dustPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={dustCount}
            array={dustColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  )
}
