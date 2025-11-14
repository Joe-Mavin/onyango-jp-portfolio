import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'

interface OrbitalCameraProps {
  isActive: boolean
  targetPlanet?: string | null
}

const planetPositions = {
  about: new Vector3(-8, 2, 0),
  projects: new Vector3(0, -6, 2),
  skills: new Vector3(6, 3, -1),
  contact: new Vector3(-3, -4, -3),
}

export function OrbitalCamera({ isActive, targetPlanet }: OrbitalCameraProps) {
  const { camera } = useThree()
  const orbitRadius = useRef(12)
  const orbitSpeed = useRef(0.002)
  const orbitAngle = useRef(0)
  const verticalOffset = useRef(0)
  
  useFrame((state) => {
    if (!isActive || targetPlanet) return

    // Slow orbital drift around central point
    orbitAngle.current += orbitSpeed.current
    
    // Calculate orbital position
    const x = Math.cos(orbitAngle.current) * orbitRadius.current
    const z = Math.sin(orbitAngle.current) * orbitRadius.current
    
    // Add subtle vertical floating
    verticalOffset.current = Math.sin(state.clock.elapsedTime * 0.3) * 0.5
    const y = 2 + verticalOffset.current
    
    // Apply smooth camera movement
    camera.position.lerp(new Vector3(x, y, z), 0.02)
    
    // Always look at the center (unseen point)
    camera.lookAt(0, 0, 0)
    
    // Subtle camera roll for immersion
    camera.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.02
  })

  return null
}
