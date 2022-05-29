import * as React from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import starmap_plain_back from "./assets/starmap/plain_back.jpg"
import starmap_plain_front from "./assets/starmap/plain_front.jpg"
import starmap_plain_up from "./assets/starmap/plain_up.jpg"
import starmap_plain_down from "./assets/starmap/plain_down.jpg"
import starmap_plain_right from "./assets/starmap/plain_right.jpg"
import starmap_plain_left from "./assets/starmap/plain_left.jpg"
import { CubeTextureLoader, sRGBEncoding } from "three";
  // "starmap/plain_front.jpg",
  // "starmap/plain_up.jpg",
  // "starmap/plain_down.jpg",
  // "starmap/plain_right.jpg",
  // "starmap/plain_left.jpg",

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

const STARMAP_PLAIN = [
  starmap_plain_back,
  starmap_plain_front,
  starmap_plain_up,
  starmap_plain_down,
  starmap_plain_right,
  starmap_plain_left,
];

const loader = new CubeTextureLoader();
const texture = loader.load([
  starmap_plain_back,
  starmap_plain_front,
  starmap_plain_up,
  starmap_plain_down,
  starmap_plain_right,
  starmap_plain_left,
]);
texture.encoding = sRGBEncoding;

const SkyBox = () => {
  const { scene } = useThree();
  scene.background = texture;
  return null;
};

const Planetarium = () => {
  return (
    <Canvas>
      {/* <Environment files={STARMAP_PLAIN} /> */}
      <SkyBox />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
      <Box position={[2.2, 0, 0]} />
    </Canvas>
  );
};

export default Planetarium;
