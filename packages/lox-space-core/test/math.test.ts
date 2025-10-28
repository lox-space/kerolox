import { isApprox, mod2pi, modpi } from "../src/math";

describe("isApprox", () => {
  test("floating point", () => {
    expect(isApprox(4.00000000000001, 4.0)).toBeTruthy();
    expect(isApprox(5.0, 4.999999999999993)).toBeTruthy();
    expect(isApprox(4.000000002, 4.00300002)).toBeFalsy();
  });
  test("tolerance levels", () => {
    expect(isApprox(4.32, 4.3, { rtol: 0.1, atol: 0.01 })).toBeTruthy();
    expect(isApprox(1.001, 1.002, { rtol: 0.001, atol: 0.0001 })).toBeTruthy();
    expect(isApprox(4.5, 4.9, { rtol: 0.001, atol: 0.001 })).toBeFalsy();
  });
  test("NaNs", () => {
    expect(isApprox(4.0, NaN)).toBeFalsy();
    expect(isApprox(NaN, 4.0)).toBeFalsy();
    expect(isApprox(NaN, NaN)).toBeFalsy();
  });
  test("Infs", () => {
    expect(isApprox(Infinity, Infinity)).toBeTruthy();
    expect(isApprox(Infinity, 1)).toBeFalsy();
    expect(isApprox(Infinity, -Infinity)).toBeFalsy();
  });
});

describe("Angle Normalisation", () => {
  test("mod2pi", () => {
    const r = mod2pi(-0.1);
    expect(r).toBeCloseTo(6.183185307179586477);
  });
  test("modpi", () => {
    const r = modpi(-4.0);
    expect(r).toBeCloseTo(2.283185307179586477);
  });
});
