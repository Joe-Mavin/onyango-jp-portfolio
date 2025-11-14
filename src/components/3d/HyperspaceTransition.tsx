import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface HyperspaceTransitionProps {
  isTransitioning: boolean
  onTransitionComplete: () => void
}

export function HyperspaceTransition({ isTransitioning, onTransitionComplete }: HyperspaceTransitionProps) {
  const { camera, scene } = useThree()
  const transitionProgress = useRef(0)
  const whiteoutMaterial = useRef<THREE.MeshBasicMaterial | null>(null)
  const whiteoutMesh = useRef<THREE.Mesh | null>(null)

  useEffect(() => {
    if (isTransitioning) {
      transitionProgress.current = 0
      
      // Create whiteout overlay
      const geometry = new THREE.PlaneGeometry(2, 2)
      const material = new THREE.MeshBasicMaterial({
        color: 0xEAF6FF, // Subtle white
        transparent: true,
        opacity: 0
      })
      
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.z = -0.1 // Just in front of camera
      camera.add(mesh)
      
      whiteoutMaterial.current = material
      whiteoutMesh.current = mesh
    }
  }, [isTransitioning, camera])

  useFrame((state, delta) => {
    if (!isTransitioning || !whiteoutMaterial.current) return

    transitionProgress.current += delta * 2 // 0.5 second transition

    if (transitionProgress.current <= 1) {
      // Ramp up phase - white out with chromatic aberration
      const progress = transitionProgress.current
      const easedProgress = 1 - Math.pow(1 - progress, 3) // Cubic ease-out
      
      whiteoutMaterial.current.opacity = easedProgress * 0.95
      
      // Add camera shake for motion blur effect
      const shakeIntensity = easedProgress * 0.1
      camera.position.x += (Math.random() - 0.5) * shakeIntensity
      camera.position.y += (Math.random() - 0.5) * shakeIntensity
      
    } else if (transitionProgress.current <= 2) {
      // Ramp down phase - fade out
      const progress = transitionProgress.current - 1
      const easedProgress = Math.pow(1 - progress, 2) // Quadratic ease-in
      
      whiteoutMaterial.current.opacity = easedProgress * 0.95
      
    } else {
      // Transition complete
      if (whiteoutMesh.current) {
        camera.remove(whiteoutMesh.current)
        whiteoutMesh.current = null
        whiteoutMaterial.current = null
      }
      onTransitionComplete()
    }
  })

  return null // Transition effects are handled in useFrame
}
