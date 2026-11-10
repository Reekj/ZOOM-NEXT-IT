import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Sculpture({ reducedMotion }) {
  const group = useRef();
  const ring = useRef();
  useFrame(({ clock, pointer }, delta) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, pointer.x * 0.22 + clock.elapsedTime * 0.11, 2.1, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, pointer.y * -0.13 + 0.08, 2.1, delta);
    group.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.08;
    if (ring.current) ring.current.rotation.z += delta * 0.085;
  });

  return (
    <group ref={group} rotation={[0.1, 0.1, -0.16]}>
      {/* A blue enamel sculpture rather than a high-gloss glass bubble. */}
      <mesh scale={[1.16, 1.16, 1.16]}>
        <icosahedronGeometry args={[1.78, 6]} />
        <meshStandardMaterial color="#075ce3" metalness={0.55} roughness={0.3} />
      </mesh>
      <mesh scale={[1.1, 1.1, 1.1]} rotation={[0.55, 0.2, 0.62]}>
        <torusGeometry args={[1.53, 0.23, 24, 130]} />
        <meshStandardMaterial color="#7cc5ff" metalness={0.58} roughness={0.24} />
      </mesh>
      <mesh rotation={[1.15, 0.28, -0.25]}>
        <torusGeometry args={[1.94, 0.058, 12, 160]} />
        <meshStandardMaterial color="#1743d4" metalness={0.55} roughness={0.32} />
      </mesh>
      <mesh ref={ring} rotation={[0.55, 0.65, 0.2]}>
        <torusGeometry args={[2.33, 0.012, 8, 200]} />
        <meshBasicMaterial color="#4db7ff" />
      </mesh>
    </group>
  );
}

export default function OrbScene({ reducedMotion = false }) {
  return (
    <div className="orb-canvas" aria-hidden="true">
      <Canvas camera={{ position: [0, 0.1, 7.25], fov: 43 }} dpr={[1, 1.6]} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}>
        <ambientLight intensity={1.55} />
        <directionalLight intensity={2.5} position={[4, 4, 6]} color="#f4fcff" />
        <directionalLight intensity={2.2} position={[-4, -2, 1]} color="#59a6ff" />
        <Suspense fallback={null}>
          <Sculpture reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}
