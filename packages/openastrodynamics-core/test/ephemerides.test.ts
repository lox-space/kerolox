import { Vector3 } from "three";
import { EPHEMERIDES, state } from "../src/ephemerides";

describe("Simon-Bretagnon Ephemeris", () => {
  test("Date in range", () => {
    const p = new Vector3();
    const v = new Vector3();
    const date1 = 2400000.5;
    const date2 = 43999.9;

    EPHEMERIDES.mercury.state(p, v, date1, date2, { unit: "au" });

    expect(p.x).toBeCloseTo(0.2945293959257430832);
    expect(p.y).toBeCloseTo(-0.2452204176601049596);
    expect(p.z).toBeCloseTo(-0.1615427700571978153);
    expect(v.x).toBeCloseTo(0.1413867871404614441e-1);
    expect(v.y).toBeCloseTo(0.1946548301104706582e-1);
    expect(v.z).toBeCloseTo(0.8929809783898904786e-2);
  });
  test("Date outside range", () => {
    const spy = jest.spyOn(global.console, "warn").mockImplementation();
    const p = new Vector3();
    const v = new Vector3();
    const date1 = 2400000.5;
    const date2 = -320000;

    EPHEMERIDES.earthMoonBarycenter.state(p, v, date1, date2, { unit: "au" });

    expect(spy).toHaveBeenCalled();
    expect(p.x).toBeCloseTo(0.9308038666832975759);
    expect(p.y).toBeCloseTo(0.3258319040261346);
    expect(p.z).toBeCloseTo(0.142279454448114056);
    expect(v.x).toBeCloseTo(-0.6429458958255170006e-2);
    expect(v.y).toBeCloseTo(0.1468570657704237764e-1);
    expect(v.z).toBeCloseTo(0.6406996426270981189e-2);

    spy.mockRestore();
  });
  test("Functional API", () => {
    const p = new Vector3();
    const v = new Vector3();
    const date1 = 2400000.5;
    const date2 = 43999.9;

    state(p, v, "mercury", date1, date2, { unit: "au" });

    expect(p.x).toBeCloseTo(0.2945293959257430832);
    expect(p.y).toBeCloseTo(-0.2452204176601049596);
    expect(p.z).toBeCloseTo(-0.1615427700571978153);
    expect(v.x).toBeCloseTo(0.1413867871404614441e-1);
    expect(v.y).toBeCloseTo(0.1946548301104706582e-1);
    expect(v.z).toBeCloseTo(0.8929809783898904786e-2);
  });
});
