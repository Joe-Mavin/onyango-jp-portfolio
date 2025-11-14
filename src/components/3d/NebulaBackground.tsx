import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, ShaderMaterial } from 'three'
import * as THREE from 'three'

const nebulaVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const nebulaFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uLightPos;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  // Enhanced noise function
  float noise(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 54.53))) * 43758.5453);
  }
  
  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 6; i++) {
      value += amplitude * noise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value;
  }
  
  // Sub-surface scattering approximation
  float subsurfaceScattering(vec3 lightDir, vec3 normal, vec3 viewDir, float thickness) {
    vec3 scatterDir = lightDir + normal * 0.3;
    float scatter = pow(clamp(dot(viewDir, -scatterDir), 0.0, 1.0), 4.0) * thickness;
    return scatter;
  }
  
  void main() {
    vec3 pos = vPosition * 0.08 + vec3(uTime * 0.03, uTime * 0.02, uTime * 0.01);
    
    float n1 = fbm(pos);
    float n2 = fbm(pos * 1.5 + vec3(100.0));
    float n3 = fbm(pos * 3.0 + vec3(200.0));
    float n4 = fbm(pos * 6.0 + vec3(300.0));
    
    // Create volumetric density
    float density = (n1 * 0.5 + n2 * 0.3 + n3 * 0.15 + n4 * 0.05);
    density = smoothstep(0.2, 0.8, density);
    
    // Calculate lighting
    vec3 lightDir = normalize(uLightPos - vPosition);
    vec3 viewDir = normalize(cameraPosition - vPosition);
    
    // Sub-surface scattering effect
    float thickness = density * 0.8;
    float scattering = subsurfaceScattering(lightDir, vNormal, viewDir, thickness);
    
    // Color mixing with depth
    vec3 baseColor = mix(uColor1, uColor2, n1);
    baseColor = mix(baseColor, uColor3, n2 * 0.4);
    
    // Add scattering glow
    vec3 scatterColor = uColor2 * 1.5;
    vec3 finalColor = mix(baseColor, scatterColor, scattering * 0.6);
    
    // Distance-based alpha falloff
    float distanceFade = smoothstep(0.0, 1.0, 1.0 - length(vUv - 0.5) * 1.5);
    float alpha = density * 0.4 * distanceFade;
    
    // Add subtle pulsing
    alpha *= 0.8 + sin(uTime * 0.5) * 0.2;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`

export function NebulaBackground() {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<ShaderMaterial>(null)

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
    
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.0002
      meshRef.current.rotation.y += 0.0001
    }
  })

  return (
    <>
      {/* Main Nebula */}
      <mesh ref={meshRef} position={[0, 0, -50]} scale={[80, 80, 1]}>
        <planeGeometry args={[1, 1, 32, 32]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={nebulaVertexShader}
          fragmentShader={nebulaFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color('#6C1BDB') }, // Nebula purple
            uColor2: { value: new THREE.Color('#00E5FF') }, // Cyber neon blue
            uColor3: { value: new THREE.Color('#EAF6FF') }, // Subtle white
            uLightPos: { value: new THREE.Vector3(10, 10, 10) },
          }}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Secondary Nebula Layers */}
      <mesh position={[30, -20, -60]} scale={[40, 40, 1]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[1, 1, 16, 16]} />
        <shaderMaterial
          vertexShader={nebulaVertexShader}
          fragmentShader={nebulaFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color('#12A7FF') },
            uColor2: { value: new THREE.Color('#6C1BDB') },
            uColor3: { value: new THREE.Color('#EAF6FF') },
          }}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[-25, 15, -70]} scale={[35, 35, 1]} rotation={[0, 0, -Math.PI / 6]}>
        <planeGeometry args={[1, 1, 16, 16]} />
        <shaderMaterial
          vertexShader={nebulaVertexShader}
          fragmentShader={nebulaFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color('#9D4EDD') },
            uColor2: { value: new THREE.Color('#EAF6FF') },
            uColor3: { value: new THREE.Color('#6C1BDB') },
          }}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  )
}
