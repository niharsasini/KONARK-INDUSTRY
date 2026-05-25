"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function WireframeOrb() {
  const meshRef = useRef(null);
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x += 0.001;
    }
  });
  return (
    <mesh ref={meshRef} position={[2.5, 0, -2]} scale={3.2}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#00d4ff"
        wireframe
        transparent
        opacity={0.12}
      />
    </mesh>
  );
}

function Particles() {
  const count = 20;
  const refs = useRef([]);
  const velocities = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01,
      })),
    []
  );
  const positions = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 12,
        y: (Math.random() - 0.5) * 8,
        z: (Math.random() - 0.5) * 6 - 3,
      })),
    []
  );

  useFrame(() => {
    refs.current.forEach((ref, i) => {
      if (!ref) return;
      ref.position.x += velocities[i].x;
      ref.position.y += velocities[i].y;
      ref.position.z += velocities[i].z;
      if (Math.abs(ref.position.x) > 8) velocities[i].x *= -1;
      if (Math.abs(ref.position.y) > 5) velocities[i].y *= -1;
      if (Math.abs(ref.position.z) > 4) velocities[i].z *= -1;
    });
  });

  return (
    <>
      {positions.map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => (refs.current[i] = el)}
          position={[pos.x, pos.y, pos.z]}
        >
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.5} />
        </mesh>
      ))}
    </>
  );
}

export default function PowerOrb3D() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: false }}
      >
        <ambientLight intensity={0.5} />
        <pointLight color="#00d4ff" intensity={1} position={[10, 10, 10]} />
        <WireframeOrb />
        <Particles />
      </Canvas>
    </div>
  );
}
