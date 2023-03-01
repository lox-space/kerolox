import { Vector3 } from "three";
import {
  cartesianToKeplerian,
  degToRad,
  keplerianToCartesian,
  keplerianToPerifocal,
} from "../src";

const digits = 5;

describe("Orbital Elements", () => {
  test("Perifocal", () => {
    const semiLatus = 1.13880762905224e7;
    const eccentricity = 0.7311;
    const trueAnomaly = 0.44369564302687126;
    const gravParam = 3.9860047e14;

    const pos = new Vector3(6194863.12535486, 2944437.90016286, 0.0);
    const vel = new Vector3(-2539.71254827, 9668.69568539, 0.0);
    const { pos: pos1, vel: vel1 } = keplerianToPerifocal({
      semiLatus,
      eccentricity,
      trueAnomaly,
      gravParam,
    });

    expect(pos1.x).toBeCloseTo(pos.x, digits);
    expect(pos1.y).toBeCloseTo(pos.y, digits);
    expect(pos1.z).toBeCloseTo(pos.z, digits);
    expect(vel1.x).toBeCloseTo(vel.x, digits);
    expect(vel1.y).toBeCloseTo(vel.y, digits);
    expect(vel1.z).toBeCloseTo(vel.z, digits);
  });
  test("Elliptic", () => {
    const gravParam = 3.9860047e14;
    const elements = {
      semiMajor: 24464560.0,
      eccentricity: 0.7311,
      inclination: 0.122138,
      ascendingNode: 1.00681,
      periapsisArg: 3.10686,
      trueAnomaly: 0.44369564302687126,
    };
    const pos = new Vector3(
      -0.107622532467967e7,
      -0.676589636432773e7,
      -0.332308783350379e6
    );
    const posClone = pos.clone();
    const vel = new Vector3(
      0.935685775154103e4,
      -0.331234775037644e4,
      -0.118801577532701e4
    );
    const velClone = vel.clone();

    const elements1 = cartesianToKeplerian(pos, vel, gravParam);
    const { pos: pos1, vel: vel1 } = keplerianToCartesian({
      gravParam,
      ...elements,
    });

    // Check that we are not mutating the inputs
    expect(pos.x).toBe(posClone.x);
    expect(pos.y).toBe(posClone.y);
    expect(pos.z).toBe(posClone.z);
    expect(vel.x).toBe(velClone.x);
    expect(vel.y).toBe(velClone.y);
    expect(vel.z).toBe(velClone.z);

    expect(pos1.x).toBeCloseTo(pos.x, digits);
    expect(pos1.y).toBeCloseTo(pos.y, digits);
    expect(pos1.z).toBeCloseTo(pos.z, digits);
    expect(vel1.x).toBeCloseTo(vel.x, digits);
    expect(vel1.y).toBeCloseTo(vel.y, digits);
    expect(vel1.z).toBeCloseTo(vel.z, digits);

    expect(elements1.semiMajor).toBeCloseTo(elements.semiMajor, digits);
    expect(elements1.eccentricity).toBeCloseTo(elements.eccentricity, digits);
    expect(elements1.inclination).toBeCloseTo(elements.inclination, digits);
    expect(elements1.ascendingNode).toBeCloseTo(elements.ascendingNode, digits);
    expect(elements1.periapsisArg).toBeCloseTo(elements.periapsisArg, digits);
    expect(elements1.trueAnomaly).toBeCloseTo(elements.trueAnomaly, digits);
  });
  test("Circular", () => {
    const gravParam = 3.986004418e14;
    const elements = {
      semiMajor: 6778136.6,
      eccentricity: 0.0,
      inclination: degToRad(15),
      ascendingNode: degToRad(20),
      periapsisArg: 0.0,
      trueAnomaly: degToRad(30),
    };
    const pos = new Vector3(
      4396398.60746266,
      5083838.45333733,
      877155.42119322
    );
    const posClone = pos.clone();
    const vel = new Vector3(-5797.06004014, 4716.60916063, 1718.86034246);
    const velClone = vel.clone();

    const elements1 = cartesianToKeplerian(pos, vel, gravParam);
    const { pos: pos1, vel: vel1 } = keplerianToCartesian({
      gravParam,
      ...elements,
    });

    // Check that we are not mutating the inputs
    expect(pos.x).toBe(posClone.x);
    expect(pos.y).toBe(posClone.y);
    expect(pos.z).toBe(posClone.z);
    expect(vel.x).toBe(velClone.x);
    expect(vel.y).toBe(velClone.y);
    expect(vel.z).toBe(velClone.z);

    expect(pos1.x).toBeCloseTo(pos.x, digits);
    expect(pos1.y).toBeCloseTo(pos.y, digits);
    expect(pos1.z).toBeCloseTo(pos.z, digits);
    expect(vel1.x).toBeCloseTo(vel.x, digits);
    expect(vel1.y).toBeCloseTo(vel.y, digits);
    expect(vel1.z).toBeCloseTo(vel.z, digits);

    expect(elements1.semiMajor).toBeCloseTo(elements.semiMajor, digits);
    expect(elements1.eccentricity).toBeCloseTo(elements.eccentricity, digits);
    expect(elements1.inclination).toBeCloseTo(elements.inclination, digits);
    expect(elements1.ascendingNode).toBeCloseTo(elements.ascendingNode, digits);
    expect(elements1.periapsisArg).toBeCloseTo(elements.periapsisArg, digits);
    expect(elements1.trueAnomaly).toBeCloseTo(elements.trueAnomaly, digits);
  });
  test("Circular Orekit", () => {
    const gravParam = 3.9860047e14;
    const elements = {
      semiMajor: 24464560.0,
      eccentricity: 0.0,
      inclination: 0.122138,
      ascendingNode: 1.00681,
      periapsisArg: 0.0,
      trueAnomaly: 0.048363,
    };

    const { pos, vel } = keplerianToCartesian({
      gravParam,
      ...elements,
    });
    const elements1 = cartesianToKeplerian(pos, vel, gravParam);

    expect(elements1.semiMajor).toBeCloseTo(elements.semiMajor, digits);
    expect(elements1.eccentricity).toBeCloseTo(elements.eccentricity, digits);
    expect(elements1.inclination).toBeCloseTo(elements.inclination, digits);
    expect(elements1.ascendingNode).toBeCloseTo(elements.ascendingNode, digits);
    expect(elements1.periapsisArg).toBeCloseTo(elements.periapsisArg, digits);
    expect(elements1.trueAnomaly).toBeCloseTo(elements.trueAnomaly, digits);
  });
  test("Hyperbolic", () => {
    const gravParam = 3.9860047e14;
    const elements = {
      semiMajor: -24464560.0,
      eccentricity: 1.7311,
      inclination: 0.122138,
      ascendingNode: 1.00681,
      periapsisArg: 3.10686,
      trueAnomaly: 0.12741601769795755,
    };

    const { pos, vel } = keplerianToCartesian({
      gravParam,
      ...elements,
    });
    const elements1 = cartesianToKeplerian(pos, vel, gravParam);

    expect(elements1.semiMajor).toBeCloseTo(elements.semiMajor, digits);
    expect(elements1.eccentricity).toBeCloseTo(elements.eccentricity, digits);
    expect(elements1.inclination).toBeCloseTo(elements.inclination, digits);
    expect(elements1.ascendingNode).toBeCloseTo(elements.ascendingNode, digits);
    expect(elements1.periapsisArg).toBeCloseTo(elements.periapsisArg, digits);
    expect(elements1.trueAnomaly).toBeCloseTo(elements.trueAnomaly, digits);
  });
  test("Equatorial", () => {
    const gravParam = 3.9860047e14;
    const elements = {
      semiMajor: 24464560.0,
      eccentricity: 0.7311,
      inclination: 0.0,
      ascendingNode: 0.0,
      periapsisArg: 3.10686,
      trueAnomaly: 0.44369564302687126,
    };

    const { pos, vel } = keplerianToCartesian({
      gravParam,
      ...elements,
    });
    const elements1 = cartesianToKeplerian(pos, vel, gravParam);

    expect(elements1.semiMajor).toBeCloseTo(elements.semiMajor, digits);
    expect(elements1.eccentricity).toBeCloseTo(elements.eccentricity, digits);
    expect(elements1.inclination).toBeCloseTo(elements.inclination, digits);
    expect(elements1.ascendingNode).toBeCloseTo(elements.ascendingNode, digits);
    expect(elements1.periapsisArg).toBeCloseTo(elements.periapsisArg, digits);
    expect(elements1.trueAnomaly).toBeCloseTo(elements.trueAnomaly, digits);
  });
  test("Circular-Equatorial", () => {
    const gravParam = 3.9860047e14;
    const elements = {
      semiMajor: 24464560.0,
      eccentricity: 0.0,
      inclination: 0.0,
      ascendingNode: 0.0,
      periapsisArg: 0.0,
      trueAnomaly: 0.44369564302687126,
    };

    const { pos, vel } = keplerianToCartesian({
      gravParam,
      ...elements,
    });
    const elements1 = cartesianToKeplerian(pos, vel, gravParam);

    expect(elements1.semiMajor).toBeCloseTo(elements.semiMajor, digits);
    expect(elements1.eccentricity).toBeCloseTo(elements.eccentricity, digits);
    expect(elements1.inclination).toBeCloseTo(elements.inclination, digits);
    expect(elements1.ascendingNode).toBeCloseTo(elements.ascendingNode, digits);
    expect(elements1.periapsisArg).toBeCloseTo(elements.periapsisArg, digits);
    expect(elements1.trueAnomaly).toBeCloseTo(elements.trueAnomaly, digits);
  });
});
