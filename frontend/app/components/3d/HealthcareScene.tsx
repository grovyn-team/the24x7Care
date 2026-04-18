'use client';

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function MedicalPlus({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.002;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.1;
    }
  });

  return (
    <Float speed={0.4} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={position} ref={groupRef}>
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

function CarePulse({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
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

export const HealthcareScene: React.FC = () => {
  return (
    <div className="relative aspect-square h-full min-h-[500px] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 via-white to-teal-50/20">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} color="#ffffff" />
        <pointLight position={[0, 3, 3]} intensity={0.4} color="#ffffff" />

        <Suspense fallback={null}>
          <CarePulse position={[0, 0, 0]} />
          <MedicalPlus position={[-1.2, 0.6, 0.5]} />
          <MedicalPlus position={[1.2, -0.6, 0.5]} />
          <ContactShadows position={[0, -2, 0]} opacity={0.1} scale={7} blur={2} far={3.5} color="#3D8472" />
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
