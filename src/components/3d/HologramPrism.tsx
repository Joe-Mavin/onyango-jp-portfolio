import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, ShaderMaterial } from 'three'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface HologramPrismProps {
  position: [number, number, number]
  title: string
  content: string
  color: string
  delay?: number
}

const hologramVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform float uTime;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    
    // Subtle floating animation
    vec3 pos = position;
    pos.y += sin(uTime * 2.0 + position.x * 5.0) * 0.02;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const hologramFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vec2 uv = vUv;
    
    // Scan lines effect
    float scanlines = sin(uv.y * 50.0 + uTime * 5.0) * 0.5 + 0.5;
    scanlines = smoothstep(0.3, 0.7, scanlines) * 0.3;
    
    // Edge glow
    float edge = 1.0 - abs(dot(vNormal, normalize(cameraPosition - vPosition)));
    edge = pow(edge, 2.0) * 0.8;
    
    // Flickering effect
    float flicker = 0.9 + sin(uTime * 10.0) * 0.1;
    
    vec3 color = uColor + vec3(scanlines) + vec3(edge);
    float alpha = (uOpacity + edge + scanlines) * flicker;
    
    gl_FragColor = vec4(color, alpha);
  }
`

export function HologramPrism({ position, title, content, color, delay = 0 }: HologramPrismProps) {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<ShaderMaterial>(null)
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    const time = state.clock.elapsedTime + delay

    // Update shader uniforms
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time
    }

    // Gentle rotation
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.1
      meshRef.current.rotation.x = Math.cos(time * 0.3) * 0.05
    }

    // Dynamic lighting that casts glow on planet surface
    if (lightRef.current) {
      lightRef.current.intensity = 0.5 + Math.sin(time * 2) * 0.2
    }
  })

  return (
    <group position={position}>
      {/* Hologram Prism */}
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 1.5, 0.1]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={hologramVertexShader}
          fragmentShader={hologramFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uColor: { value: new THREE.Color(color) },
            uOpacity: { value: 0.3 }
          }}
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Title Text */}
      <Text
        position={[0, 0.4, 0.06]}
        fontSize={0.15}
        color="#EAF6FF"
        anchorX="center"
        anchorY="middle"
        font="monospace"
      >
        {title}
      </Text>

      {/* Content Text */}
      <Text
        position={[0, -0.1, 0.06]}
        fontSize={0.08}
        color="#EAF6FF"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
        textAlign="center"
        font="monospace"
      >
        {content}
      </Text>

      {/* Dynamic Point Light for Planet Glow */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 0.5]}
        color={color}
        intensity={0.5}
        distance={5}
        decay={2}
      />

      {/* Corner Brackets */}
      {[
        [-0.9, 0.65, 0.06],
        [0.9, 0.65, 0.06],
        [-0.9, -0.65, 0.06],
        [0.9, -0.65, 0.06]
      ].map((pos, index) => (
        <mesh key={index} position={pos as [number, number, number]}>
          <boxGeometry args={[0.1, 0.1, 0.02]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}
