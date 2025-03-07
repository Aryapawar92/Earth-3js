"use client";

import * as THREE from "three";
import React, { useMemo } from "react";
import { useLoader } from "@react-three/fiber";

interface EarthMaterialProps {
  sunDirection?: THREE.Vector3;
}

const defaultSunDirection = new THREE.Vector3(-2, 0.5, 1.5).normalize();

const EarthMaterial: React.FC<EarthMaterialProps> = ({
  sunDirection = defaultSunDirection,
}) => {
  const map = useLoader(THREE.TextureLoader, "./earth-daymap-4k.jpg");
  const nightMap = useLoader(THREE.TextureLoader, "./earth-nightmap-4k.jpg");
  const cloudsMap = useLoader(THREE.TextureLoader, "./earth-clouds-4k.jpg");

  const material = useMemo(() => {
    const uniforms = {
      dayTexture: { value: map },
      nightTexture: { value: nightMap },
      cloudsTexture: { value: cloudsMap },
      sunDirection: { value: sunDirection },
    };

    const vs = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * viewMatrix * modelPosition;

        vUv = uv;
        vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
        vPosition = modelPosition.xyz;
      }
    `;

    const fs = `
      uniform sampler2D dayTexture;
      uniform sampler2D nightTexture;
      uniform sampler2D cloudsTexture;
      uniform vec3 sunDirection;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vec3 viewDirection = normalize(vPosition - cameraPosition);
        vec3 normal = normalize(vNormal);
        vec3 color = vec3(0.0);

        float sunOrientation = dot(sunDirection, normal);
        float dayMix = smoothstep(-0.25, 0.5, sunOrientation);
        vec3 dayColor = texture(dayTexture, vUv).rgb;
        vec3 nightColor = texture(nightTexture, vUv).rgb;
        color = mix(nightColor, dayColor, dayMix);

        vec2 specularCloudsColor = texture(cloudsTexture, vUv).rg;
        float cloudsMix = smoothstep(0.0, 1.0, specularCloudsColor.g);
        cloudsMix *= dayMix;
        color = mix(color, vec3(1.0), cloudsMix);

        vec3 reflection = reflect(-sunDirection, normal);
        float specular = -dot(reflection, viewDirection);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    return new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vs,
      fragmentShader: fs,
    });
  }, [map, nightMap, cloudsMap, sunDirection]); // ✅ Fixed missing dependencies

  return <primitive object={material} />;
};

export default EarthMaterial;
