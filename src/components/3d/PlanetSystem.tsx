import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Planet } from './Planet'

interface PlanetSystemProps {
  onPlanetClick?: (planetId: string) => void
}

const planetData = [
  {
    id: 'about',
    name: 'About',
    position: [-8, 2, 0] as [number, number, number],
    color: '#6C1BDB', // Nebula purple
    size: 1.2,
    orbitRadius: 8,
    orbitSpeed: 0.005,
  },
  {
    id: 'projects',
    name: 'Projects',
    position: [0, -6, 2] as [number, number, number],
    color: '#12A7FF', // Electric blue
    size: 1.5,
    orbitRadius: 6,
    orbitSpeed: 0.008,
  },
  {
    id: 'skills',
    name: 'Skills',
    position: [6, 3, -1] as [number, number, number],
    color: '#EAF6FF', // Soft white
    size: 1.0,
    orbitRadius: 7,
    orbitSpeed: 0.006,
  },
  {
    id: 'contact',
    name: 'Contact',
    position: [-3, -4, -3] as [number, number, number],
    color: '#9D4EDD', // Purple variant
    size: 1.1,
    orbitRadius: 5,
    orbitSpeed: 0.007,
  },
]

export function PlanetSystem({ onPlanetClick }: PlanetSystemProps) {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation of the entire system
      groupRef.current.rotation.y += 0.001
      
      // Subtle floating motion
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {planetData.map((planet) => (
        <Planet
          key={planet.id}
          {...planet}
          onPlanetClick={onPlanetClick}
        />
      ))}
    </group>
  )
}
