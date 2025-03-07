import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import React, { useRef } from "react";

function getPoints({ numStars = 500 } = {}) {
  function randomSpherePoint() {
    const radius = Math.random() * 25 + 25;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta); // Changed let -> const
    const y = radius * Math.sin(phi) * Math.sin(theta); // Changed let -> const
    const z = radius * Math.cos(phi); // Changed let -> const
    const rate = Math.random() * 1;
    const prob = Math.random();
    const light = Math.random();

    function update(t: any) {
      const lightness = prob > 0.8 ? light + Math.sin(t * rate) * 0.5 : light;
      return Math.min(1, Math.max(0, lightness));
    }

    return {
      pos: new THREE.Vector3(x, y, z),
      update,
    };
  }

  const verts = [];
  const colors = [];
  const positions: any[] = [];

  for (let i = 0; i < numStars; i++) {
    const p = randomSpherePoint(); // Changed let -> const
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
    opacity: 1, // Ensure full opacity
  });

  const points = new THREE.Points(geo, mat);

  function update(t: any) {
    points.rotation.y -= 0.0002;
    const colors = [];

    for (let i = 0; i < numStars; i++) {
      const p = positions[i];
      const { update } = p;
      const brightness = update(t); // Changed let -> const

      // Ensure stars stay white by using equal RGB values
      colors.push(brightness, brightness, brightness);
    }

    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geo.attributes.color.needsUpdate = true;
  }

  points.userData = { update };
  return points;
}

function Starfield() {
  const ref = useRef<THREE.Mesh>(null!);
  const points = getPoints({ numStars: 3000 });

  useFrame((state) => {
    const { clock } = state; // Changed let -> const
    ref.current.userData.update(clock.elapsedTime);
  });

  return <primitive object={points} ref={ref} />;
}

export default Starfield;
