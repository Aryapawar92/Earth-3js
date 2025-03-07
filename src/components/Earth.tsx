"use client";

import React, { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Text, Billboard } from "@react-three/drei";
import { TextureLoader } from "three";
import * as THREE from "three";
import EarthMaterial from "@/components/EarthMaterial";
import Starfield from "@/components/Starfield";
import { Red_Hat_Display, Space_Grotesk } from "next/font/google";

const redhat = Red_Hat_Display({ subsets: ["latin"] });
const space = Space_Grotesk({ subsets: ["latin"] });

const sunDirection = { x: 0, y: 0, z: 1 };

export default function Earth() {
  const { x, y, z } = sunDirection;
  return (
    <div
      className={`  w-full h-screen flex items-center justify-center bg-black  `}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ toneMapping: THREE.NoToneMapping }}
        className="w-full h-screen "
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
  const ref = useRef<THREE.Mesh>(null!);

  const map = useLoader(TextureLoader, "/earth-daymap-4k.jpg");

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0002;
    }
  });

  const textureDay = useLoader(TextureLoader, "/2k_neptune.jpg");

  return (
    <group rotation-z={THREE.MathUtils.degToRad(-23)} position={[0, -9.5, 0]}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[10, 32]} />
        <EarthMaterial />
      </mesh>
      <Billboard>
        <Text
          position={[0, 15, 0]}
          fontSize={2.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/SpaceGrotesk-Bold.ttf"
        >
          The Earth We Need.
        </Text>
        <Text
          position={[0, 13, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/SpaceGrotesk-Bold.ttf"
        >
          (scroll for zoom in or out)
        </Text>
        <Text
          position={[0, 12, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/SpaceGrotesk-Bold.ttf"
        >
          Made by Arya Pawar.
        </Text>
      </Billboard>
    </group>
  );
}
