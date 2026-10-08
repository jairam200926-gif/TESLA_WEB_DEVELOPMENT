import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import * as THREE from "three";

import CanvasLoader from "../layout/Loader";

// ── 3D Procedural Lenovo LOQ Laptop Model ─────────────────────
const LenovoLOQModel: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group
      ref={groupRef}
      scale={isMobile ? 1.4 : 1.8}
      position={isMobile ? [0, -1.8, -0.5] : [1, -2.2, -0.5]}
      rotation={[0.15, -0.45, 0]}
    >
      {/* Lights */}
      <hemisphereLight intensity={0.4} groundColor="#000000" color="#6F2232" />
      <spotLight
        position={[-10, 20, 10]}
        angle={0.2}
        penumbra={1}
        intensity={1.5}
        color="#C3073F"
        castShadow
      />
      <pointLight position={[2, 2, 2]} intensity={0.8} color="#950740" />
      <pointLight position={[-2, 1, 1]} intensity={0.5} color="#C3073F" />

      {/* ── Laptop Base Chassis ── */}
      <group position={[0, 0, 0]}>
        {/* Main Base body */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.1, 2.1]} />
          <meshStandardMaterial color="#141414" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Keyboard deck inset */}
        <mesh position={[0, 0.052, 0]}>
          <boxGeometry args={[2.9, 0.008, 1.9]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.4} roughness={0.8} />
        </mesh>

        {/* Keyboard keys surface */}
        <mesh position={[0, 0.057, 0.15]}>
          <boxGeometry args={[2.6, 0.005, 1.2]} />
          <meshStandardMaterial color="#111111" metalness={0.3} roughness={0.9} />
        </mesh>

        {/* Trackpad */}
        <mesh position={[0, 0.057, 0.68]}>
          <boxGeometry args={[0.8, 0.003, 0.45]} />
          <meshStandardMaterial color="#080808" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* LOQ Rear Vent Exhaust Accent (Vivid Orange LED line) */}
        <mesh position={[0, 0.02, -1.06]}>
          <boxGeometry args={[2.8, 0.06, 0.04]} />
          <meshStandardMaterial color="#C3073F" emissive="#C3073F" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* ── Laptop Open Screen Lid (115° Angle) ── */}
      <group position={[0, 0.05, -1.02]} rotation={[-1.9, 0, 0]}>
        {/* Screen Outer Lid */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <boxGeometry args={[3.2, 2.0, 0.08]} />
          <meshStandardMaterial color="#111111" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Screen Bezel */}
        <mesh position={[0, 1.0, 0.042]}>
          <boxGeometry args={[3.05, 1.85, 0.005]} />
          <meshStandardMaterial color="#050505" roughness={0.95} />
        </mesh>

        {/* Screen Display Panel — Active Code Interface */}
        <mesh position={[0, 1.0, 0.046]}>
          <boxGeometry args={[2.9, 1.7, 0.002]} />
          <meshStandardMaterial
            color="#0f0502"
            emissive="#551500"
            emissiveIntensity={0.5}
            roughness={0.1}
          />
        </mesh>

        {/* Simulated Code Lines on Display Screen */}
        {[-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6].map((y, idx) => (
          <mesh key={idx} position={[-0.8 + (idx % 3) * 0.2, 1.0 + y, 0.049]}>
            <boxGeometry args={[0.8 + (idx % 4) * 0.3, 0.02, 0.001]} />
            <meshStandardMaterial
              color={idx % 3 === 0 ? "#C3073F" : idx % 3 === 1 ? "#950740" : "#F2F2F2"}
              emissive={idx % 3 === 0 ? "#C3073F" : idx % 3 === 1 ? "#950740" : "#ffffff"}
              emissiveIntensity={0.9}
            />
          </mesh>
        ))}

        {/* LOQ Screen Back Logo */}
        <mesh position={[0, 1.0, -0.042]}>
          <boxGeometry args={[0.6, 0.15, 0.002]} />
          <meshStandardMaterial color="#C3073F" emissive="#C3073F" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Desk Shadow Plane */}
      <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 5]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop="demand"
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <LenovoLOQModel isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
