"use client";
import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function FoxWithCursorFollowing() {
  const foxRef = useRef<THREE.Object3D>(null);
  const { scene } = useGLTF("/model/gg.glb"); // Path to your GLB file
  const { mouse, camera } = useThree(); // Get mouse and camera from Three.js

  useFrame(() => {
    if (foxRef.current) {
      // Convert normalized mouse position to 3D world coordinates
      const mousePosition = new THREE.Vector3(-mouse.x, -mouse.y, 1);
      mousePosition.unproject(camera);

      // Fixed position of the fox (prevent movement in negative Z)
      const foxPosition = new THREE.Vector3(0, 0, 0); // Fox is fixed at the origin

      // Calculate direction vector from fox to cursor
      const direction = mousePosition.clone().sub(foxPosition).normalize();

      // Calculate rotation to align fox's nose with the direction vector
      const quaternion = new THREE.Quaternion();
      quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), direction);

      // Apply the rotation to the fox with smooth interpolation
      foxRef.current.quaternion.slerp(quaternion, 0.7); // Adjust the factor for speed
    }
  });

  return (
    <primitive
      ref={foxRef}
      object={scene}
      scale={1} // Adjust the scale to fit your scene
      position={[0, 0, 0]} // Fixed position for the fox
    />
  );
}

const FoxCanvas = () => {
  return (
    <div className="absolute bottom-20 w-full h-screen" >
      <Canvas
      // gl={{ alpha: true }}
      style={{ background: "transparent" }}
        camera={{ position: [0, 0, 10], fov: 50 }} // Adjust camera position
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <FoxWithCursorFollowing />
      </Canvas>
    </div>
  );
};

export default FoxCanvas;