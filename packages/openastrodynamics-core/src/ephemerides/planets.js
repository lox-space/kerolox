"use strict";
exports.__esModule = true;
exports.state = exports.velocity = exports.position = exports.EPHEMERIDES = exports.Ephemeris = void 0;
var math_1 = require("../math");
var DJ00 = 2451545.0;
var DJM = 365250.0;
var DAS2R = 4.848136811095359935899141e-6;
var AU = 149597870.7; // km
/* Gaussian constant */
var GK = 0.01720209895;
/* Sin and cos of J2000.0 mean obliquity (IAU 1976) */
var SINEPS = 0.3977771559319137;
var COSEPS = 0.9174820620691818;
/* Maximum number of iterations allowed to solve Kepler's equation */
var KMAX = 10;
var Ephemeris = /** @class */ (function () {
    function Ephemeris(amas, a, dlm, e, pi, dinc, omega, kp, ca, sa, kq, cl, sl) {
        this.amas = amas;
        this.a = Float32Array.from(a);
        this.dlm = Float32Array.from(dlm);
        this.e = Float32Array.from(e);
        this.pi = Float32Array.from(pi);
        this.dinc = Float32Array.from(dinc);
        this.omega = Float32Array.from(omega);
        this.kp = Float32Array.from(kp);
        this.ca = Float32Array.from(ca);
        this.sa = Float32Array.from(sa);
        this.kq = Float32Array.from(kq);
        this.cl = Float32Array.from(cl);
        this.sl = Float32Array.from(sl);
    }
    Ephemeris.prototype.meanElements = function (date1, date2) {
        if (date2 === void 0) { date2 = 0.0; }
        /* Time: Julian millennia since J2000.0. */
        var t = (date1 - DJ00 + date2) / DJM;
        /* OK status unless remote date. */
        // if (t > 1) console.warn("The requested date is later than the year 3000.");
        // if (t < -1)
        //   console.warn("The requested date is earlier than the year 1000.");
        /* Compute the mean elements. */
        var da = this.a[0] + (this.a[1] + this.a[2] * t) * t;
        var dl = (3600.0 * this.dlm[0] + (this.dlm[1] + this.dlm[2] * t) * t) * DAS2R;
        var de = this.e[0] + (this.e[1] + this.e[2] * t) * t;
        var dp = (0, math_1.modpi)((3600.0 * this.pi[0] + (this.pi[1] + this.pi[2] * t) * t) * DAS2R);
        var di = (3600.0 * this.dinc[0] + (this.dinc[1] + this.dinc[2] * t) * t) * DAS2R;
        var dom = (0, math_1.modpi)((3600.0 * this.omega[0] + (this.omega[1] + this.omega[2] * t) * t) * DAS2R);
        /* Apply the trigonometric terms. */
        var dmu = 0.3595362 * t;
        for (var k_1 = 0; k_1 < 8; k_1++) {
            var arga_1 = this.kp[k_1] * dmu;
            var argl = this.kq[k_1] * dmu;
            da += (this.ca[k_1] * Math.cos(arga_1) + this.sa[k_1] * Math.sin(arga_1)) * 1e-7;
            dl += (this.cl[k_1] * Math.cos(argl) + this.sl[k_1] * Math.sin(argl)) * 1e-7;
        }
        var arga = this.kp[8] * dmu;
        da +=
            t * (this.ca[8] * Math.cos(arga) + this.sa[8] * Math.sin(arga)) * 1e-7;
        for (var k_2 = 8; k_2 < 10; k_2++) {
            var argl = this.kq[k_2] * dmu;
            dl +=
                t * (this.cl[k_2] * Math.cos(argl) + this.sl[k_2] * Math.sin(argl)) * 1e-7;
        }
        dl = dl % math_1.TWOPI;
        /* Iterative soln. of Kepler's equation to get eccentric anomaly. */
        var am = dl - dp;
        var ae = am + de * Math.sin(am);
        var k = 0;
        var dae = 1.0;
        while (k < KMAX && Math.abs(dae) > 1e-12) {
            dae = (am - ae + de * Math.sin(ae)) / (1.0 - de * Math.cos(ae));
            ae += dae;
            k++;
            // if (k === KMAX - 1) console.warn("Not converged.");
        }
        /* True anomaly. */
        var ae2 = ae / 2.0;
        var at = 2.0 *
            Math.atan2(Math.sqrt((1.0 + de) / (1.0 - de)) * Math.sin(ae2), Math.cos(ae2));
        var si2 = Math.sin(di / 2.0);
        var xq = si2 * Math.cos(dom);
        var xp = si2 * Math.sin(dom);
        var tl = at + dp;
        var xsw = Math.sin(tl);
        var xcw = Math.cos(tl);
        return { da: da, de: de, di: di, dp: dp, ae: ae, xp: xp, xq: xq, xsw: xsw, xcw: xcw };
    };
    Ephemeris.prototype.position = function (pos, date1, date2, opts) {
        if (date2 === void 0) { date2 = 0.0; }
        if (opts === void 0) { opts = { unit: "km" }; }
        var pFactor = opts.unit === "km" ? AU : 1.0;
        var _a = this.meanElements(date1, date2), da = _a.da, de = _a.de, di = _a.di, ae = _a.ae, xp = _a.xp, xq = _a.xq, xsw = _a.xsw, xcw = _a.xcw;
        var xm2 = 2.0 * (xp * xcw - xq * xsw);
        var ci2 = Math.cos(di / 2.0);
        var r = da * (1.0 - de * Math.cos(ae));
        var x = r * (xcw - xm2 * xp) * pFactor;
        var y = r * (xsw + xm2 * xq) * pFactor;
        var z = r * (-xm2 * ci2) * pFactor;
        /* Rotate to equatorial. */
        pos.set(x, y * COSEPS - z * SINEPS, y * SINEPS + z * COSEPS);
    };
    Ephemeris.prototype.velocity = function (vel, date1, date2, opts) {
        if (date2 === void 0) { date2 = 0.0; }
        if (opts === void 0) { opts = { unit: "km" }; }
        var vFactor = opts.unit === "km" ? AU * (1 / 86400) : 1.0;
        var _a = this.meanElements(date1, date2), da = _a.da, de = _a.de, di = _a.di, dp = _a.dp, xp = _a.xp, xq = _a.xq, xsw = _a.xsw, xcw = _a.xcw;
        var v = GK * Math.sqrt((1.0 + 1.0 / this.amas) / (da * da * da));
        var xf = da / Math.sqrt(1 - de * de);
        var ci2 = Math.cos(di / 2.0);
        var xms = (de * Math.sin(dp) + xsw) * xf;
        var xmc = (de * Math.cos(dp) + xcw) * xf;
        var xpxq2 = 2 * xp * xq;
        /* Velocity (J2000.0 ecliptic xdot,ydot,zdot in au/d). */
        var vx = v * ((-1.0 + 2.0 * xp * xp) * xms + xpxq2 * xmc) * vFactor;
        var vy = v * ((1.0 - 2.0 * xq * xq) * xmc - xpxq2 * xms) * vFactor;
        var vz = v * (2.0 * ci2 * (xp * xms + xq * xmc)) * vFactor;
        /* Rotate to equatorial. */
        vel.set(vx, vy * COSEPS - vz * SINEPS, vy * SINEPS + vz * COSEPS);
    };
    Ephemeris.prototype.state = function (pos, vel, date1, date2, opts) {
        if (date2 === void 0) { date2 = 0.0; }
        if (opts === void 0) { opts = { unit: "km" }; }
        this.position(pos, date1, date2, opts);
        this.velocity(vel, date1, date2, opts);
    };
    return Ephemeris;
}());
exports.Ephemeris = Ephemeris;
exports.EPHEMERIDES = {
    mercury: new Ephemeris(6023600.0, [0.3870983098, 0.0, 0.0], [252.25090552, 5381016286.88982, -1.92789], [0.2056317526, 0.0002040653, -28349e-10], [77.45611904, 5719.1159, -4.83016], [7.00498625, -214.25629, 0.28977], [48.33089304, -4515.21727, -31.79892], [69613, 75645, 88306, 59899, 15746, 71087, 142173, 3086, 0], [4, -13, 11, -9, -9, -3, -1, 4, 0], [-29, -1, 9, 6, -6, 5, 4, 0, 0], [3086, 15746, 69613, 59899, 75645, 88306, 12661, 2658, 0, 0], [21, -95, -157, 41, -5, 42, 23, 30, 0, 0], [-342, 136, -23, 62, 66, -52, -33, 17, 0, 0]),
    venus: new Ephemeris(408523.5, [0.72332982, 0.0, 0.0], [181.97980085, 2106641364.33548, 0.59381], [0.0067719164, -0.0004776521, 98127e-10], [131.563703, 175.4864, -498.48184], [3.39466189, -30.84437, -11.67836], [76.67992019, -10008.48154, -51.32614], [21863, 32794, 26934, 10931, 26250, 43725, 53867, 28939, 0], [-156, 59, -42, 6, 19, -20, -10, -12, 0], [-48, -125, -26, -37, 18, -13, -20, -2, 0], [21863, 32794, 10931, 73, 4387, 26934, 1473, 2157, 0, 0], [-160, -313, -235, 60, -74, -76, -27, 34, 0, 0], [524, -149, -35, 117, 151, 122, -71, -62, 0, 0]),
    earthMoonBarycenter: new Ephemeris(328900.5, [1.0000010178, 0.0, 0.0], [100.46645683, 1295977422.83429, -2.04411], [0.0167086342, -0.0004203654, -0.0000126734], [102.93734808, 11612.3529, 53.27577], [0.0, 469.97289, -3.35053], [174.87317577, -8679.27034, 15.34191], [16002, 21863, 32004, 10931, 14529, 16368, 15318, 32794, 0], [64, -152, 62, -8, 32, -41, 19, -11, 0], [-150, -46, 68, 54, 14, 24, -28, 22, 0], [10, 16002, 21863, 10931, 1473, 32004, 4387, 73, 0, 0], [-325, -322, -79, 232, -52, 97, 55, -41, 0, 0], [-105, -137, 258, 35, -116, -88, -112, -80, 0, 0]),
    mars: new Ephemeris(3098710.0, [1.5236793419, 3e-10, 0.0], [355.43299958, 689050774.93988, 0.94264], [0.0934006477, 0.0009048438, -80641e-10], [336.06023395, 15980.45908, -62.328], [1.84972648, -293.31722, -8.1183], [49.55809321, -10620.90088, -230.57416], [6345, 7818, 15636, 7077, 8184, 14163, 1107, 4872, 0], [124, 621, -145, 208, 54, -57, 30, 15, 0], [-621, 532, -694, -20, 192, -94, 71, -73, 0], [10, 6345, 7818, 1107, 15636, 7077, 8184, 532, 10, 0], [2268, -979, 802, 602, -668, -33, 345, 201, -55, 0], [854, -205, -936, -240, 140, -341, -97, -232, 536, 0]),
    jupiter: new Ephemeris(1047.355, [5.2026032092, 19132e-10, -39e-10], [34.35151874, 109256603.77991, -30.60378], [0.0484979255, 0.0016322542, -0.0000471366], [14.33120687, 7758.75163, 259.95938], [1.30326698, -71.5589, 11.95297], [100.46440702, 6362.03561, 326.52178], [1760, 1454, 1167, 880, 287, 2640, 19, 2047, 1454], [-23437, -2634, 6601, 6259, -1507, -1821, 2620, -2115, -1489], [-14614, -19828, -5869, 1881, -4372, -2255, 782, 930, 913], [19, 1760, 1454, 287, 1167, 880, 574, 2640, 19, 1454], [7610, -4997, -7689, -5841, -2617, 1115, -748, -607, 6074, 354], [-56980, 8016, 1012, 1448, -3024, -3710, 318, 503, 3767, 577]),
    saturn: new Ephemeris(3498.5, [9.5549091915, -0.0000213896, 444e-10], [50.0774443, 43996098.55732, 75.61614], [0.0555481426, -0.0034664062, -0.0000643639], [93.05723748, 20395.49439, 190.25952], [2.48887878, 91.85195, -17.66225], [113.66550252, -9240.19942, -66.23743], [574, 0, 880, 287, 19, 1760, 1167, 306, 574], [62911, -119919, 79336, 17814, -24241, 12068, 8306, -4893, 8902], [139737, 0, 24667, 51123, -5102, 7429, -4095, -1976, -9566], [19, 574, 287, 306, 1760, 12, 31, 38, 19, 574], [-18549, 30125, 20012, -730, 824, 23, 1289, -352, -14767, -2062], [138606, -13478, -4964, 1441, -1319, -1482, 427, 1236, -9167, -1918]),
    uranus: new Ephemeris(22869.0, [19.2184460618, -3716e-10, 979e-10], [314.05500511, 15424811.93933, -1.75083], [0.0463812221, -0.0002729293, 0.0000078913], [173.00529106, 3215.56238, -34.09288], [0.77319689, -60.72723, 1.25759], [74.00595701, 2669.15033, 145.93964], [204, 0, 177, 1265, 4, 385, 200, 208, 204], [389061, -262125, -44088, 8387, -22976, -2093, -615, -9720, 6633], [-138081, 0, 37205, -49039, -41901, -33872, -27037, -12474, 18797], [4, 204, 177, 8, 31, 200, 1265, 102, 4, 204], [-135245, -14594, 4197, -4030, -5630, -2898, 2540, -306, 2939, 1986], [71234, -41116, 5334, -4935, -1848, 66, 434, -1748, 3780, -701]),
    neptune: new Ephemeris(19314.0, [30.1103868694, -16635e-10, 686e-10], [304.34866548, 7865503.20744, 0.21103], [0.009455747, 0.0000603263, 0.0], [48.12027554, 1050.71912, 27.39717], [1.76995259, 8.12333, 0.08135], [131.78405702, -221.94322, -0.78728], [0, 102, 106, 4, 98, 1367, 487, 204, 0], [-412235, -157046, -31430, 37817, -9740, -13, -7449, 9644, 0], [0, 28492, 133236, 69654, 52322, -49577, -26430, -3593, 0], [4, 102, 106, 8, 98, 1367, 487, 204, 4, 102], [89948, 2103, 8963, 2695, 3682, 1648, 866, -154, -1963, -283], [-47645, 11647, 2166, 3194, 679, 0, -244, -419, -2531, 48])
};
var position = function (pos, planet, date1, date2, opts) {
    if (date2 === void 0) { date2 = 0.0; }
    if (opts === void 0) { opts = { unit: "km" }; }
    return exports.EPHEMERIDES[planet].position(pos, date1, date2, opts);
};
exports.position = position;
var velocity = function (vel, planet, date1, date2, opts) {
    if (date2 === void 0) { date2 = 0.0; }
    if (opts === void 0) { opts = { unit: "km" }; }
    return exports.EPHEMERIDES[planet].velocity(vel, date1, date2, opts);
};
exports.velocity = velocity;
var state = function (pos, vel, planet, date1, date2, opts) {
    if (date2 === void 0) { date2 = 0.0; }
    if (opts === void 0) { opts = { unit: "km" }; }
    return exports.EPHEMERIDES[planet].state(pos, vel, date1, date2, opts);
};
exports.state = state;
