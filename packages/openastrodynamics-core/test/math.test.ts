import { mod2pi, modpi } from '../src/math';

describe('Angle Normalisation', () => {
  test('mod2pi', () => {
    const r = mod2pi(-0.1);
    expect(r).toBeCloseTo(6.183185307179586477);
  });
  test('modpi', () => {
    const r = modpi(-4.0);
    expect(r).toBeCloseTo(2.283185307179586477);
  });
});
