import * as React from "react";
import { Canvas } from "@react-three/fiber";

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
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  );
};

export default Planetarium;
