import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import React from "react";

function getPoints({ numStars = 500 } = {}) {
  function randomSpherePoint() {
    const radius = Math.random() * 25 + 25;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    let x = radius * Math.sin(phi) * Math.cos(theta);
    let y = radius * Math.sin(phi) * Math.sin(theta);
    let z = radius * Math.cos(phi);
    const rate = Math.random() * 1;
    const prob = Math.random();
    const light = Math.random();

    function update(t) {
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
  const positions = [];

  for (let i = 0; i < numStars; i++) {
    let p = randomSpherePoint();
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

  function update(t) {
    points.rotation.y -= 0.0002;
    const colors = [];

    for (let i = 0; i < numStars; i++) {
      const p = positions[i];
      const { update } = p;
      let brightness = update(t);

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
  const ref = React.useRef();
  const points = getPoints({ numStars: 3000 });

  useFrame((state) => {
    let { clock } = state;
    ref.current.userData.update(clock.elapsedTime);
  });

  return <primitive object={points} ref={ref} />;
}

export default Starfield;
