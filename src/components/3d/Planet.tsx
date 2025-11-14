import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Mesh, ShaderMaterial } from 'three'
import { Text, Sphere } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import { playHoverSound, playHyperspaceSound } from '../audio/StellarAudio'
import * as THREE from 'three'

interface PlanetProps {
  id: string
  name: string
  position: [number, number, number]
  color: string
  size: number
  orbitRadius: number
  orbitSpeed: number
  onPlanetClick?: (planetId: string) => void
}

// Planet-specific shader materials
const planetShaders = {
  about: {
    vertex: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float uTime;
      
      void main() {
        vUv = uv;
        vPosition = position;
        
        // Subtle surface displacement
        vec3 pos = position;
        pos += normal * sin(uTime * 2.0 + position.x * 10.0) * 0.02;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragment: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vec2 uv = vUv;
        
        // Flowing energy patterns
        float pattern = sin(uv.x * 20.0 + uTime) * sin(uv.y * 15.0 + uTime * 0.7);
        pattern = smoothstep(-0.5, 0.5, pattern);
        
        vec3 color = mix(uColor * 0.6, uColor * 1.2, pattern);
        gl_FragColor = vec4(color, 1.0);
      }
    `
  },
  
  projects: {
    vertex: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float uTime;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragment: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec2 vUv;
      
      void main() {
        vec2 uv = vUv;
        
        // Rotating rings effect
        float angle = atan(uv.y - 0.5, uv.x - 0.5);
        float radius = length(uv - 0.5);
        
        float rings = sin((radius - uTime * 0.1) * 30.0) * 0.5 + 0.5;
        rings *= smoothstep(0.0, 0.1, radius) * smoothstep(0.5, 0.4, radius);
        
        vec3 color = mix(uColor * 0.7, uColor * 1.5, rings);
        gl_FragColor = vec4(color, 1.0);
      }
    `
  },
  
  skills: {
    vertex: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float uTime;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragment: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec2 vUv;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
      
      void main() {
        vec2 uv = vUv;
        
        // Lightning strikes effect
        float lightning = 0.0;
        for(int i = 0; i < 5; i++) {
          float t = uTime + float(i) * 0.3;
          vec2 lightningPos = vec2(sin(t * 2.0) * 0.5 + 0.5, fract(t * 0.1));
          float dist = distance(uv, lightningPos);
          lightning += smoothstep(0.1, 0.0, dist) * (0.5 + 0.5 * sin(t * 10.0));
        }
        
        vec3 color = mix(uColor * 0.8, vec3(1.0, 1.0, 0.8), lightning);
        gl_FragColor = vec4(color, 1.0);
      }
    `
  },
  
  contact: {
    vertex: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float uTime;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragment: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec2 vUv;
      
      void main() {
        vec2 uv = vUv;
        
        // Pulsing core effect
        float dist = length(uv - 0.5);
        float pulse = sin(uTime * 3.0) * 0.5 + 0.5;
        float core = smoothstep(0.3, 0.1, dist) * pulse;
        
        vec3 color = mix(uColor * 0.6, uColor * 2.0, core);
        gl_FragColor = vec4(color, 1.0);
      }
    `
  }
}

export function Planet({ id, name, position, color, size, orbitRadius, orbitSpeed, onPlanetClick }: PlanetProps) {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<ShaderMaterial>(null)
  const textRef = useRef<any>(null)
  const gravitationalFieldRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const { camera } = useThree()

  // Animation springs
  const { scale, fieldIntensity } = useSpring({
    scale: hovered ? 1.15 : 1,
    fieldIntensity: hovered ? 0.8 : 0.3,
    config: { mass: 1, tension: 280, friction: 60 }
  })

  // Get planet-specific shader
  const shader = planetShaders[id as keyof typeof planetShaders] || planetShaders.about

  useFrame((state) => {
    if (meshRef.current) {
      // Planet rotation
      meshRef.current.rotation.y += 0.01
      meshRef.current.rotation.x += 0.005
      
      // Orbital motion
      const time = state.clock.elapsedTime * orbitSpeed
      meshRef.current.position.x = position[0] + Math.cos(time) * 0.5
      meshRef.current.position.z = position[2] + Math.sin(time) * 0.3
      
      // Floating motion
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }

    // Gravitational field distortion effect
    if (gravitationalFieldRef.current && hovered) {
      const distortionTime = state.clock.elapsedTime * 3
      gravitationalFieldRef.current.rotation.z = Math.sin(distortionTime) * 0.1
      gravitationalFieldRef.current.scale.setScalar(1 + Math.sin(distortionTime * 2) * 0.05)
    }

    // Make text face camera
    if (textRef.current) {
      textRef.current.lookAt(camera.position)
    }
  })

  const handleClick = () => {
    setClicked(!clicked)
    playHyperspaceSound()
    if (onPlanetClick) {
      onPlanetClick(id)
    }
  }

  const handleHover = (hovering: boolean) => {
    setHovered(hovering)
    if (hovering) {
      playHoverSound()
    }
  }

  return (
    <group position={position}>
      {/* Planet Sphere - Simplified */}
      <animated.mesh
        ref={meshRef}
        scale={scale}
        onClick={handleClick}
        onPointerOver={() => handleHover(true)}
        onPointerOut={() => handleHover(false)}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          roughness={0.3}
          metalness={0.7}
        />
      </animated.mesh>

      {/* Gravitational Field Distortion */}
      <animated.mesh
        ref={gravitationalFieldRef}
        scale={fieldIntensity}
      >
        <sphereGeometry args={[size * 2.5, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.1 : 0.05}
          wireframe
          blending={THREE.AdditiveBlending}
        />
      </animated.mesh>

      {/* Glowing Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 1.5, size * 1.7, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.6 : 0.3}
        />
      </mesh>

      {/* Planet Label */}
      <Text
        ref={textRef}
        position={[0, size + 1, 0]}
        fontSize={0.5}
        color="#EAF6FF"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>

      {/* Particle Trail */}
      {hovered && (
        <mesh>
          <sphereGeometry args={[size * 2, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.1}
            wireframe
          />
        </mesh>
      )}
    </group>
  )
}
