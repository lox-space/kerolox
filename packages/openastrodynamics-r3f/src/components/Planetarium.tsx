import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as React from "react";
import StarMap from "./StarMap/StarMap";

type BoxProps = {
  position: [number, number, number];
};

function Box({ position }: BoxProps) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

const Planetarium = () => {
  return (
    <Canvas>
      <StarMap type="grid" />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
      <OrbitControls />
    </Canvas>
  );
};

export default Planetarium;
