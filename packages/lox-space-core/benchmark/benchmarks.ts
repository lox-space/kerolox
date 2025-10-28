import { add, complete, cycle, suite } from "benny";
import { Vector3 } from "three";
import { state } from "../src";

const p = new Vector3();
const v = new Vector3();
const date1 = 2400000.5;
const date2 = 43999.9;

suite(
  "OpenAstrodynamics Core Benchmarks",
  add("Planetary Ephemerides", () => {
    state(p, v, "mercury", date1, date2, { unit: "au" });
  }),
  cycle(),
  complete()
);
