//
// Copyright (c) 2021 Helge Eichhorn and the Planetarium contributors
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// This file incorporates work covered by the following copyright and
// permission notice:
//
//   Copyright (C) 2013-2014, NumFOCUS Foundation.
//   All rights reserved.
//
//   This library is derived, with permission, from the International
//   Astronomical Union's "Standards of Fundamental Astronomy" library,
//   available from http://www.iausofa.org.
//
//   The ERFA version is intended to retain identical
//   functionality to the SOFA library, but made distinct through
//   different function and file names, as set out in the SOFA license
//   conditions. The SOFA original has a role as a reference standard
//   for the IAU and IERS, and consequently redistribution is permitted only
//   in its unaltered state. The ERFA version is not subject to this
//   restriction and therefore can be included in distributions which do not
//   support the concept of "read only" software.
//
//   Although the intent is to replicate the SOFA API (other than replacement of
//   prefix names) and results (with the exception of bugs; any that are
//   discovered will be fixed), SOFA is not responsible for any errors found
//   in this version of the library.
//
//   If you wish to acknowledge the SOFA heritage, please acknowledge that
//   you are using a library derived from SOFA, rather than SOFA itself.
//
//
//   TERMS AND CONDITIONS
//
//   Redistribution and use in source and binary forms, with or without
//   modification, are permitted provided that the following conditions are met:
//
//   1 Redistributions of source code must retain the above copyright
//      notice, this list of conditions and the following disclaimer.
//
//   2 Redistributions in binary form must reproduce the above copyright
//      notice, this list of conditions and the following disclaimer in the
//      documentation and/or other materials provided with the distribution.
//
//   3 Neither the name of the Standards Of Fundamental Astronomy Board, the
//      International Astronomical Union nor the names of its contributors
//      may be used to endorse or promote products derived from this software
//      without specific prior written permission.
//
//   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
//   IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
//   TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
//   PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
//   HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
//   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
//   TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
//   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
//   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

import { Vector3 } from "three";

export const PI = Math.PI;
export const TWOPI = 2 * PI;

export const X_AXIS = new Vector3(1, 0, 0);
export const Y_AXIS = new Vector3(0, 1, 0);
export const Z_AXIS = new Vector3(0, 0, 1);

export const radToDeg = (rad: number) => (rad * 180) / PI;
export const degToRad = (deg: number) => (deg * PI) / 180;

export const modpi = (a: number) => {
  let w = a % TWOPI;
  if (Math.abs(w) >= PI) w -= TWOPI * Math.sign(a);

  return w;
};

export const mod2pi = (a: number) => {
  let w = a % TWOPI;
  if (w < 0) w += TWOPI;

  return w;
};

export const normalize2pi = (a: number, center = 0.0) =>
  a - TWOPI * Math.floor((a + PI - center) / TWOPI);

const rtolDefault = (x: number, y: number, atol: number) =>
  atol > 0 ? 0 : Math.sqrt(Number.EPSILON);

type Opts = {
  atol?: number;
  rtol?: number;
  nans?: boolean;
  norm?: (x: number) => number;
};

export const isApprox = (
  x: number,
  y: number,
  { atol = 0, rtol = undefined, nans = false, norm = Math.abs }: Opts = {}
) => {
  rtol = rtol ?? rtolDefault(x, y, atol);
  return (
    x === y ||
    (Number.isFinite(x) &&
      Number.isFinite(y) &&
      norm(x - y) <= Math.max(atol, rtol * Math.max(norm(x), norm(y)))) ||
    (nans && Number.isNaN(x) && Number.isNaN(y))
  );
};

export const newtonRaphson = (
  x0: number,
  f: (x: number) => number,
  fPrime: (x: number) => number,
  { maxiter: maxIter = 50, tol = Math.sqrt(Number.EPSILON) } = {}
) => {
  let p0 = x0;
  for (let i = 1; i < maxIter; i++) {
    let p = p0 - f(p0) / fPrime(p0);
    if (Math.abs(p - p0) < tol) {
      return p;
    }
    p0 = p;
  }
  throw new Error("Not converged.");
};

export const azimuth = (v: Vector3) => Math.atan2(v.y, v.x);
