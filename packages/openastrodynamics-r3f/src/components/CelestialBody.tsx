import {
  Planet,
  unixToJulian,
  position,
  EPHEMERIDES,
} from "@openastrodynamics/core";
import { Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as React from "react";
import { Mesh, Vector3 } from "three";

type Props = {
  body: Planet;
  scale?: number;
};

const CelestialBody = ({ body, scale = 1.0 }: Props) => {
  const ref = useRef<Mesh>();

  useFrame(() => {
    const { date1, date2 } = unixToJulian(1e-3 * Date.now());
    if (ref.current) {
      // position(ref.current.position, body, date1, date2);
      EPHEMERIDES[body].position(ref.current.position, date1, date2);
    }
  });

  return (
    <>
      <Sphere ref={ref} args={[1e9, 1000, 1000]} scale={scale}>
        <meshStandardMaterial color="blue" />
      </Sphere>
    </>
  );
};

export default CelestialBody;
