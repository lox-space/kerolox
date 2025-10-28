import { Quaternion, Vector3 } from "three";
import {
  azimuth,
  isApprox,
  mod2pi,
  normalize2pi,
  X_AXIS,
  Z_AXIS,
} from "./math";

export const isCircular = (ecc: number, tol = 1e-8) =>
  isApprox(ecc, 0.0, { atol: tol });
export const isEquatorial = (inc: number, tol = 1e-8) =>
  isApprox(Math.abs(inc), 0.0, { atol: tol });

export const eccentricityVector = (pos: Vector3, vel: Vector3, mu: number) => {
  const e = pos.clone();
  e.multiplyScalar(vel.dot(vel) - mu / pos.length());
  const v = vel.clone();
  v.multiplyScalar(pos.dot(vel));
  e.sub(v);
  e.divideScalar(mu);
  return e;
};

export const eccentricToTrue = (E: number, ecc: number) =>
  2 * Math.atan(Math.sqrt((1 + ecc) / (1 - ecc)) * Math.tan(E / 2));

export const hyperbolicToTrue = (F: number, ecc: number) =>
  2 * Math.atan(Math.sqrt((ecc + 1) / (ecc - 1)) * Math.tanh(F / 2));

export const cartesianToKeplerian = (
  pos: Vector3,
  vel: Vector3,
  mu: number,
  tol = 1e-8
) => {
  const r = pos.length();
  const v = vel.length();
  // Angular momentum vector
  const h = new Vector3().crossVectors(pos, vel);
  const hm = h.length();
  // Node vector
  const node = new Vector3().crossVectors(Z_AXIS, h);
  const e = eccentricityVector(pos, vel, mu);
  const eccentricity = e.length();
  const inclination = h.angleTo(Z_AXIS);

  const equatorial = isEquatorial(inclination, tol);
  const circular = isCircular(eccentricity, tol);

  const semiMajor = circular ? hm ** 2 / mu : -mu / (2 * (v ** 2 / 2 - mu / r));

  let ascendingNode: number;
  let periapsisArg: number;
  let trueAnomaly: number;
  if (equatorial && !circular) {
    ascendingNode = 0.0;
    // Longitude of pericenter
    periapsisArg = azimuth(e);
    trueAnomaly = Math.atan2(
      h.dot(new Vector3().crossVectors(e, pos)) / hm,
      pos.dot(e)
    );
  } else if (!equatorial && circular) {
    ascendingNode = azimuth(node);
    periapsisArg = 0.0;
    // Argument of latitude
    trueAnomaly = Math.atan2(
      pos.dot(new Vector3().crossVectors(h, node)) / hm,
      pos.dot(node)
    );
  } else if (equatorial && circular) {
    ascendingNode = 0.0;
    periapsisArg = 0.0;
    // True longitude
    trueAnomaly = azimuth(pos);
  } else {
    if (semiMajor > 0) {
      // Elliptic
      const E_se = pos.dot(vel) / Math.sqrt(mu * semiMajor);
      const E_ce = (r * v ** 2) / mu - 1;
      trueAnomaly = eccentricToTrue(Math.atan2(E_se, E_ce), eccentricity);
    } else {
      // Hyperbolic
      const E_sh = pos.dot(vel) / Math.sqrt(-mu * semiMajor);
      const E_ch = (r * v ** 2) / mu - 1;
      trueAnomaly = hyperbolicToTrue(
        Math.log((E_ch + E_sh) / (E_ch - E_sh)) / 2,
        eccentricity
      );
    }
    ascendingNode = azimuth(node);
    const px = pos.dot(node);
    const py = pos.dot(new Vector3().crossVectors(h, node)) / hm;
    periapsisArg = Math.atan2(py, px) - trueAnomaly;
  }
  ascendingNode = mod2pi(ascendingNode);
  periapsisArg = mod2pi(periapsisArg);
  trueAnomaly = normalize2pi(trueAnomaly, 0.0);

  return {
    semiMajor,
    eccentricity,
    inclination,
    ascendingNode,
    periapsisArg,
    trueAnomaly,
  };
};

export const isPrograde = (inc: number) =>
  inc < Math.PI / 2 && !isApprox(inc, Math.PI / 2);
export const isRetrograde = (inc: number) =>
  inc > Math.PI / 2 && !isApprox(inc, Math.PI / 2);
export const isPolar = (inc: number) => isApprox(inc, Math.PI / 2);

export const semiLatusRectum = (a: number, ecc: number) =>
  isApprox(ecc, 0.0) ? a : a * (1.0 - ecc ** 2);

export const keplerianToPerifocal = ({
  semiLatus,
  eccentricity,
  trueAnomaly,
  gravParam,
}: {
  semiLatus: number;
  eccentricity: number;
  trueAnomaly: number;
  gravParam: number;
}) => {
  const sinNu = Math.sin(trueAnomaly);
  const cosNu = Math.cos(trueAnomaly);
  const sqrtMuP = Math.sqrt(gravParam / semiLatus);

  const pos = new Vector3(cosNu, sinNu, 0).multiplyScalar(
    semiLatus / (1 + eccentricity * cosNu)
  );
  const vel = new Vector3(-sinNu, eccentricity + cosNu, 0).multiplyScalar(
    sqrtMuP
  );

  return { pos, vel };
};

export const keplerianToCartesian = ({
  gravParam,
  semiMajor,
  eccentricity,
  inclination,
  ascendingNode,
  periapsisArg,
  trueAnomaly,
}: {
  gravParam: number;
  semiMajor: number;
  eccentricity: number;
  inclination: number;
  ascendingNode: number;
  periapsisArg: number;
  trueAnomaly: number;
}) => {
  const semiLatus = semiLatusRectum(semiMajor, eccentricity);
  const { pos, vel } = keplerianToPerifocal({
    semiLatus,
    eccentricity,
    trueAnomaly,
    gravParam,
  });
  const q1 = new Quaternion();
  q1.setFromAxisAngle(Z_AXIS, ascendingNode);
  const q2 = new Quaternion();
  q2.setFromAxisAngle(X_AXIS, inclination);
  const q3 = new Quaternion();
  q3.setFromAxisAngle(Z_AXIS, periapsisArg);
  const q = q1.multiply(q2).multiply(q3);

  return {
    pos: pos.applyQuaternion(q),
    vel: vel.applyQuaternion(q),
  };
};
