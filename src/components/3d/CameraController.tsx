import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import * as THREE from 'three'

interface CameraControllerProps {
  targetPlanet?: string | null
}

const planetPositions = {
  about: new Vector3(-8, 2, 5),
  projects: new Vector3(0, -6, 8),
  skills: new Vector3(6, 3, 4),
  contact: new Vector3(-3, -4, 6),
}

export function CameraController({ targetPlanet }: CameraControllerProps) {
  const { camera, controls } = useThree()
  const targetPosition = useRef(new Vector3(0, 0, 10))
  const currentPosition = useRef(new Vector3(0, 0, 10))
  const isAnimating = useRef(false)

  useEffect(() => {
    if (targetPlanet && planetPositions[targetPlanet as keyof typeof planetPositions]) {
      const planetPos = planetPositions[targetPlanet as keyof typeof planetPositions]
      targetPosition.current.copy(planetPos)
      isAnimating.current = true
    } else {
      // Return to default position
      targetPosition.current.set(0, 0, 10)
      isAnimating.current = true
    }
  }, [targetPlanet])

  useFrame((state, delta) => {
    if (isAnimating.current) {
      // Smooth camera transition
      currentPosition.current.lerp(targetPosition.current, delta * 2)
      camera.position.copy(currentPosition.current)
      
      // Look at center
      camera.lookAt(0, 0, 0)
      
      // Stop animation when close enough
      if (currentPosition.current.distanceTo(targetPosition.current) < 0.1) {
        isAnimating.current = false
      }
    }

    // Gentle camera floating when not animating
    if (!isAnimating.current) {
      camera.position.y += Math.sin(state.clock.elapsedTime * 0.5) * 0.01
      camera.position.x += Math.cos(state.clock.elapsedTime * 0.3) * 0.005
    }
  })

  return null
}
