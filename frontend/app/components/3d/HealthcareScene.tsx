'use client';

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Elegant, subtle medical plus - minimal rotation
function MedicalPlus({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Very subtle rotation - premium feel
      groupRef.current.rotation.z += 0.002;
      // Gentle floating
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.1;
    }
  });

  return (
    <Float speed={0.4} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={position} ref={groupRef}>
        {/* Vertical bar */}
        <mesh>
          <boxGeometry args={[0.1, 0.6, 0.1]} />
          <meshStandardMaterial 
            color="#3D8472" 
            emissive="#3D8472" 
            emissiveIntensity={0.2} 
            metalness={0.5} 
            roughness={0.3} 
          />
        </mesh>
        {/* Horizontal bar */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.1, 0.6, 0.1]} />
          <meshStandardMaterial 
            color="#3D8472" 
            emissive="#3D8472" 
            emissiveIntensity={0.2} 
            metalness={0.5} 
            roughness={0.3} 
          />
        </mesh>
      </group>
    </Float>
  );
}

// Subtle care pulse - representing gentle heartbeat
function CarePulse({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Very subtle pulse - like a calm heartbeat
      const pulse = Math.sin(state.clock.elapsedTime * 0.8) * 0.08 + 1;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <Float speed={0.3} rotationIntensity={0.05} floatIntensity={0.15}>
      <Sphere ref={meshRef} args={[0.4, 32, 32]} position={position}>
        <MeshDistortMaterial
          color="#3D8472"
          attach="material"
          distort={0.1}
          speed={1}
          roughness={0.4}
          metalness={0.6}
          emissive="#337865"
          emissiveIntensity={0.25}
        />
      </Sphere>
    </Float>
  );
}

// Main scene component - clean and premium
export const HealthcareScene: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[500px] aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-gray-50 via-white to-teal-50/20 relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} color="#ffffff" />
        <pointLight position={[0, 3, 3]} intensity={0.4} color="#ffffff" />
        
        <Suspense fallback={null}>
          {/* Main care pulse - centerpiece, elegant */}
          <CarePulse position={[0, 0, 0]} />
          
          {/* Just 2 medical plus signs - minimal, premium */}
          <MedicalPlus position={[-1.2, 0.6, 0.5]} />
          <MedicalPlus position={[1.2, -0.6, 0.5]} />
          
          {/* Very subtle shadows */}
          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.1}
            scale={7}
            blur={2}
            far={3.5}
            color="#3D8472"
          />
          
          {/* Clean, soft environment */}
          <Environment preset="sunset" />
        </Suspense>
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.15}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>
    </div>
  );
};
