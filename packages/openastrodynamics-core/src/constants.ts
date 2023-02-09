import { Matrix4 } from "three";

// prettier-ignore
export const TO_SCREEN = new Matrix4().set(
  -1, 0, 0, 0,
  0, 0, 1, 0,
  0, 1, 0, 0,
  0, 0, 0, 1
);
