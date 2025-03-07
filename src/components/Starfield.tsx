import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import React, { useRef } from "react";

// Define a type for the stars
interface Star {
  pos: THREE.Vector3;
  update: (t: number) => number;
}

function getPoints({ numStars = 500 } = {}) {
  function randomSpherePoint(): Star {
    const radius = Math.random() * 25 + 25;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    const rate = Math.random();
    const prob = Math.random();
    const light = Math.random();

    function update(t: number): number {
      const lightness = prob > 0.8 ? light + Math.sin(t * rate) * 0.5 : light;
      return Math.min(1, Math.max(0, lightness));
    }

    return {
      pos: new THREE.Vector3(x, y, z),
      update,
    };
  }

  const verts: number[] = [];
  const colors: number[] = [];
  const positions: Star[] = [];

  for (let i = 0; i < numStars; i++) {
    const p = randomSpherePoint();
    positions.push(p);
    verts.push(p.pos.x, p.pos.y, p.pos.z);

    // Set all stars to pure white
    colors.push(1, 1, 1);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    transparent: true,
    opacity: 1,
  });

  const points = new THREE.Points(geo, mat);

  function update(t: number) {
    points.rotation.y -= 0.0002;
    const colors: number[] = [];

    for (let i = 0; i < numStars; i++) {
      const p = positions[i];
      const brightness = p.update(t);
      colors.push(brightness, brightness, brightness);
    }

    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geo.attributes.color.needsUpdate = true;
  }

  points.userData = { update };
  return points;
}

function Starfield() {
  const ref = useRef<THREE.Points>(null!);
  const points = getPoints({ numStars: 3000 });

  useFrame(({ clock }) => {
    ref.current.userData.update(clock.elapsedTime);
  });

  return <primitive object={points} ref={ref} />;
}

export default Starfield;
