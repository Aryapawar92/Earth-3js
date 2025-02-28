"use client";

import React, { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";
import * as THREE from "three";
import EarthMaterial from "@/components/EarthMaterial";
import Starfield from "@/components/Starfield";
import Nebula from "@/components/Nebula";

const sunDirection = { x: 0, y: 0, z: 1 };

export default function Earth() {
  const { x, y, z } = sunDirection;
  return (
    <div className="w-full h-screen flex items-center justify-center bg-black ">
      <Canvas
        camera={{ position: [0, 0, 10] }}
        gl={{ toneMapping: THREE.NoToneMapping }}
      >
        <OrbitControls enableZoom={true} enablePan={false} />
        <ambientLight intensity={2} />
        <Globe />
        <directionalLight position={[x, y, z]} />
        <hemisphereLight args={[0xffffff, 0x000000, 1]} />
        <Starfield />
      </Canvas>
    </div>
  );
}

function Globe() {
  const ref = useRef(null);

  const map = useLoader(TextureLoader, "/earth-daymap-4k.jpg");

  useFrame(() => {
    ref.current.rotation.y += 0.0007;
  });

  const textureDay = useLoader(TextureLoader, "/2k_neptune.jpg");

  return (
    <group rotation-z={THREE.MathUtils.degToRad(-23)}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[5.5, 32]} />
        <EarthMaterial />
      </mesh>
    </group>
  );
}
