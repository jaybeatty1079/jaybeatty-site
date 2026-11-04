// The pipeline, as a machine. Leads drop from a hopper onto a belt; a gate pushes the ones that do not qualify into a bin;
// a door opens for each lead that does; a press closes it (it lights up green); it drops into the tray and the counter ticks.
// A dial on the back post reads how full the belt is. Built with the anatomy kit; the live script needs no kit at runtime.
import { writeFileSync } from "node:fs";
import * as k from "/Users/jaybeatty/.claude/skills/anatomy/kit/iso-kit.mjs";
import * as G from "/Users/jaybeatty/.claude/skills/anatomy/kit/lathe.mjs";

const OUT = "/private/tmp/claude-501/-Users-jaybeatty--claude-spares-spare-NpDFW7/53d6da9f-fce1-4cd6-83e3-afe542a07b91/scratchpad/machine/";
const W = 1200, H = 400;

// ---- world layout (x along the belt, +y toward the viewer, z up) ----
const PLATE = { x: -214, y: -64, w: 428, d: 128, r: 8 }, PLATE_H = 10, FOOT_H = 5;
const BED = { x: -142, y: -14, w: 294, d: 28, r: 2 }, BED_Z = 8;            // conveyor bed, belt on top
const BELT = { x: -140, y: -12, w: 290, d: 24, r: 1 }, BELT_TOP = BED_Z + 1;
const TOKEN_R = 4.2, TOKEN_H = 1.9, TOKEN_Z = BELT_TOP;                      // a lead on the belt
const X0 = -134, GATE_X = -78, DOOR_X = 4, PRESS_X = 84, X_END = 146;        // stations along the belt
const HOP = { x: -202, y: -20, w: 40, d: 40, r: 3 }, HOP_Z0 = 24, HOP_H = 30; // hopper on four legs
const SPOUT = { x: -162, y: -7, w: 22, d: 14, r: 1.5 }, SPOUT_Z = 16, SPOUT_H = 8;
const BIN = { x: GATE_X - 12, y: 19, w: 24, d: 24, r: 1.5 }, BIN_H = 8;      // reject bin, low lip so a lead flies over it
const TRAY = { x: X_END + 6, y: -16, w: 36, d: 32, r: 1.5 }, TRAY_H = 7;    // contracts tray
const TRAY_AT = [TRAY.x + 18, 0], STACK_H = TOKEN_H + 0.1;
const COUNTER = { x: X_END + 8, y: 24, w: 32, d: 16, r: 1.5 }, COUNTER_H = 18;
const PANEL = { x: -128, y: 30, w: 44, d: 24, r: 2 }, PANEL_H = 12;
const DIAL_AT = [-30, -46], DIAL_R = 13, DIAL_Z = 46, DIAL_H = 6, DIAL_TOP = DIAL_Z + DIAL_H;
const PUSH = { x: GATE_X - 3, y: -46, w: 6, d: 26, r: 1 }, PUSH_Z = 10, PUSH_H = 8; // the actuator behind the belt
const PADDLE_Y0 = -16, PADDLE_TRAVEL = 24;                                   // paddle rests behind the belt, pushes 24 forward
const DOOR_OPEN = 11, RAM_Z = 22, RAM_DROP = RAM_Z - (TOKEN_Z + TOKEN_H) + .2;

const P = k.fitProjection([...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), ...k.boxCorners(HOP, 0, HOP_Z0 + HOP_H + 6), [PRESS_X, 0, 60], [DIAL_AT[0], DIAL_AT[1], DIAL_TOP + 2]], W, H, { pad: 14, azimuth: 66, elevation: 30 });
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const n2 = (v) => Math.round(v * 100) / 100;

function bench() {
  const o = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 24))) {
    o.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    o.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  o.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  o.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "faint" }));               // the groove
  const screws = k.corners(PLATE, 10);
  o.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  o.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  const strip = { x: -120, y: PLATE.y + PLATE.d - 13, w: 240, d: 7, r: 1 };             // ruler along the front edge
  o.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const t = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  o.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  o.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }));
  const plate = { x: PLATE.x + 14, y: PLATE.y + PLATE.d - 30, w: 36, d: 12, r: 1 };     // label plate, three rule lines
  o.push(S(k.slabOf(plate, 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
  [3, 6, 9].forEach((dy, i) => o.push(L(k.lineOnTop([plate.x + 3, plate.y + dy], [plate.x + plate.w - (i === 2 ? 14 : 3), plate.y + dy], 0.8, P), { tone: "faint", free: i === 2 ? "end" : false })));
  o.push(D(k.corners(plate, 1.8).map(([x, y]) => at([x, y, 0.8])), { size: 0.35 }));
  return o.join("");
}

function hopper() {
  const o = [];
  for (const [x, y] of byDepth(k.corners(HOP, 5))) o.push(S(k.cylinder(x, y, 2.2, 0, HOP_Z0, P, 16), { tone: "mid", crease: "none" }));
  const seams = [HOP_Z0 + 12, HOP_Z0 + 26].map((z) => L(k.sideSeam(HOP, z, P, 6), { tone: "faint" })).join("");   // sight band
  o.push(S(k.slabOf(HOP, HOP_Z0, HOP_H, P, 6, 1), { tone: "hi", inner: seams }));
  const lid = k.insetPlan(HOP, 2);
  o.push(S(k.slabOf(lid, HOP_Z0 + HOP_H, 2.4, P, 6, 0.6), { tone: "mid" }));
  o.push(L(k.planOutline(k.insetPlan(HOP, 7), HOP_Z0 + HOP_H + 2.4, P, 6), { tone: "faint" }));
  const knob = [HOP.x + HOP.w / 2, HOP.y + HOP.d / 2], kz = HOP_Z0 + HOP_H + 2.4;
  o.push(S(k.cylinder(knob[0], knob[1], 4.5, kz, 3.5, P, 28), { tone: "mid" }));
  o.push(L(k.knurl(knob[0], knob[1], 4.5, kz, kz + 3.5, 28, P), { tone: "lo" }));
  o.push(D([at([knob[0], knob[1], kz + 3.5])], { size: 0.5, tone: "hi" }));
  o.push(D(k.corners(lid, 3).map(([x, y]) => at([x, y, HOP_Z0 + HOP_H + 2.4])), { size: 0.4 }));
  // the spout: a box from the hopper's side out over the belt start, with a band where it meets the body
  o.push(S(k.slabOf(SPOUT, SPOUT_Z, SPOUT_H, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(SPOUT, SPOUT_Z + 2, P, 3), { tone: "faint" }) }));
  o.push(S(k.slabOf({ x: SPOUT.x - 1, y: SPOUT.y - 2, w: 4, d: SPOUT.d + 4, r: 1 }, SPOUT_Z - 2, SPOUT_H + 4, P, 3), { tone: "mid" })); // flange on the hopper wall
  return o.join("");
}

function conveyorBack() {
  const o = [];
  o.push(S(k.slabOf(BED, 0, BED_Z, P, 3, 0.6), { tone: "mid" }));
  o.push(S(k.slabOf(BELT, BED_Z, 1, P, 3), { tone: "lo", crease: "none" }));
  // belt cleats: lines across the belt every 10 units, ending on the belt edges
  let d = ""; for (let x = BELT.x + 6; x < BELT.x + BELT.w - 4; x += 10) d += k.lineOnTop([x, BELT.y + 0.4], [x, BELT.y + BELT.d - 0.4], BELT_TOP + 0.05, P);
  o.push(L(d, { tone: "faint" }));
  // rollers at each end, axis along y
  for (const x of [BED.x, BED.x + BED.w]) { const F = G.frameAlong([x, BED.y - 2, 5], [0, 1, 0]); o.push(S(G.disc(0, BED.d + 4, 5, F, P), { tone: "mid" })); }
  // back rail with a gap at the gate for the paddle
  const railZ = BED_Z, railH = 4.5;
  o.push(S(k.slabOf({ x: BED.x - 2, y: BED.y - 2, w: GATE_X - 8 - (BED.x - 2), d: 2.2, r: .6 }, railZ, railH, P, 2, .3), { tone: "mid" }));
  o.push(S(k.slabOf({ x: GATE_X + 8, y: BED.y - 2, w: BED.x + BED.w + 2 - (GATE_X + 8), d: 2.2, r: .6 }, railZ, railH, P, 2, .3), { tone: "mid" }));
  for (const x of [BED.x + 20, DOOR_X - 40, PRESS_X - 40, BED.x + BED.w - 20]) o.push(D([at([x, BED.y - .9, railZ + railH])], { size: .4 }));
  // the pusher actuator behind the belt
  o.push(S(k.slabOf(PUSH, PUSH_Z, PUSH_H, P, 3, .5), { tone: "mid", inner: L(k.sideSeam(PUSH, PUSH_Z + 2, P, 3), { tone: "faint" }) }));
  o.push(S(k.slabOf({ x: PUSH.x - 2, y: PUSH.y - 2, w: PUSH.w + 4, d: 3, r: .8 }, PUSH_Z - 1, PUSH_H + 2, P, 3), { tone: "mid" })); // rear cap
  o.push(S(k.slabOf({ x: PUSH.x - 2, y: PUSH.y + PUSH.d - 1, w: PUSH.w + 4, d: 3, r: .8 }, PUSH_Z - 1, PUSH_H + 2, P, 3), { tone: "mid" })); // gland
  return o.join("");
}

// a station gantry: two posts straddling the belt and a crossbar; back half and front half are painted around the leads
function gantry(x, barZ, barH, postW, halfSpan) {
  const post = (y) => S(k.slabOf({ x: x - postW / 2, y: y - postW / 2, w: postW, d: postW, r: .8 }, 0, barZ + barH, P, 3, .4), { tone: "mid" });
  const foot = (y) => S(k.slabOf({ x: x - postW / 2 - 2, y: y - postW / 2 - 2, w: postW + 4, d: postW + 4, r: 1 }, 0, 2, P, 3), { tone: "lo" });
  const back = foot(-halfSpan) + post(-halfSpan) + S(k.slabOf({ x: x - postW / 2, y: -halfSpan, w: postW, d: halfSpan * 2, r: .8 }, barZ, barH, P, 3, .4), { tone: "mid" })
    + D([at([x, -halfSpan + 3, barZ + barH]), at([x, halfSpan - 3, barZ + barH])], { size: .4 });
  const front = foot(halfSpan) + post(halfSpan);
  return { back, front };
}

function gateBack() {
  const x = GATE_X, w = 4, y0 = -24, barZ = 30, barH = 4;
  return S(k.slabOf({ x: x - w / 2 - 2, y: y0 - w / 2 - 2, w: w + 4, d: w + 4, r: 1 }, 0, 2, P, 3), { tone: "lo" })
    + S(k.slabOf({ x: x - w / 2, y: y0 - w / 2, w, d: w, r: .8 }, 0, barZ + barH, P, 3, .4), { tone: "mid" })
    + S(k.slabOf({ x: x - w / 2 - 1.5, y: y0 - w / 2, w: w + 3, d: 6, r: .8 }, barZ - 6, 6, P, 3), { tone: "mid" })      // the knee bracket
    + S(k.slabOf({ x: x - w / 2, y: y0, w, d: 24 - y0 + 6, r: .8 }, barZ, barH, P, 3, .4), { tone: "mid" })               // the arm out over the belt
    + S(k.slabOf({ x: x - w / 2 - 1, y: 28, w: w + 2, d: 3, r: .8 }, barZ - 1, barH + 2, P, 3), { tone: "mid" })           // end cap
    + D([at([x, y0 + 6, barZ + barH]), at([x, 20, barZ + barH])], { size: .4 });
}
function gateFront() { return ""; }
function doorBack() {
  const g = gantry(DOOR_X, 30, 4, 4, 28);
  // the lintel sign plate: the one engraved label the drawing allows
  const sign = S(k.slabOf({ x: DOOR_X - 2.6, y: -9, w: 1.2, d: 18, r: .4 }, 34, 6, P, 2), { tone: "hi" });
  return g.back + sign;
}
function doorFront() { return gantry(DOOR_X, 30, 4, 4, 28).front; }
function doorLeaf(side) { // built closed; the live page slides it ±DOOR_OPEN in y
  const plan = side < 0 ? { x: DOOR_X - 1.5, y: -12, w: 3, d: 12, r: .5 } : { x: DOOR_X - 1.5, y: 0, w: 3, d: 12, r: .5 };
  const z0 = BELT_TOP + .4, h = 17;
  const panelLine = k.sideSeam(plan, z0 + h * .55, P, 2);
  return S(k.slabOf(plan, z0, h, P, 2, .4), { tone: "hi", inner: L(panelLine, { tone: "faint" }) })
    + D([at([DOOR_X + 1.5, side < 0 ? -2.5 : 2.5, z0 + 12])], { size: .55, tone: "hi" });
}
function pressBack() {
  const g = gantry(PRESS_X, 42, 5, 5, 22);
  const head = S(k.cylinder(PRESS_X, 0, 8, 47, 12, P, 40, .8), { tone: "mid" }) + L(k.knurl(PRESS_X, 0, 8, 47, 59, 44, P, .3), { tone: "lo" })
    + S(k.cylinder(PRESS_X, 0, 4.5, 59, 2.5, P, 28), { tone: "mid" }) + D([at([PRESS_X, 0, 61.5])], { size: .5, tone: "hi" });
  return g.back + head;
}
function pressFront() { return gantry(PRESS_X, 42, 5, 5, 22).front; }
function ram() { // built raised; the live page drops it RAM_DROP
  return S(k.cylinder(PRESS_X, 0, 3.2, RAM_Z, 42 - RAM_Z, P, 20), { tone: "hi", crease: "none" })
    + S(k.cylinder(PRESS_X, 0, 5.2, RAM_Z - 2.2, 2.2, P, 28), { tone: "hi", lit: true });
}
function paddle() { // the gate's paddle and its arm, built at rest behind the belt; the live page slides it +y
  const arm = S(k.slabOf({ x: GATE_X - 1.5, y: PADDLE_Y0 - 26, w: 3, d: 26, r: .6 }, PUSH_Z + 2.5, 3, P, 2), { tone: "hi", crease: "none" });
  const pad = S(k.slabOf({ x: GATE_X - 4, y: PADDLE_Y0 - 1.5, w: 8, d: 1.8, r: .5 }, BELT_TOP, 5.5, P, 2, .3), { tone: "hi" });
  return arm + pad;
}
function openBox(plan, h, split) { // floor plus far walls before the leads, near walls after
  const t = 1.6, back = [], front = [];
  back.push(S(k.slabOf(plan, 0, .8, P, 3), { tone: "lo", crease: "none" }));
  back.push(S(k.slabOf({ x: plan.x, y: plan.y, w: plan.w, d: t, r: .4 }, 0, h, P, 2, .3), { tone: "mid" }));               // far wall (small y)
  back.push(S(k.slabOf({ x: plan.x, y: plan.y, w: t, d: plan.d, r: .4 }, 0, h, P, 2, .3), { tone: "mid" }));               // left wall
  front.push(S(k.slabOf({ x: plan.x + plan.w - t, y: plan.y, w: t, d: plan.d, r: .4 }, 0, h, P, 2, .3), { tone: "mid" })); // right wall
  front.push(S(k.slabOf({ x: plan.x, y: plan.y + plan.d - t, w: plan.w, d: t, r: .4 }, 0, h, P, 2, .3), { tone: "mid" }));  // near wall
  front.push(D(k.corners(plan, t + 1.2).map(([x, y]) => at([x, y, h])), { size: .35 }));
  return split === "back" ? back.join("") : front.join("");
}
function counter() {
  const o = [];
  o.push(S(k.slabOf(COUNTER, 0, COUNTER_H, P, 3, .6), { tone: "mid" }));
  const win = { x: COUNTER.x + 4, y: COUNTER.y + COUNTER.d - .01, w: COUNTER.w - 8 };
  // the window: a recess outline on the near face, and the digits laid in its plane
  const z0 = 6, z1 = 13;
  o.push(L(k.segment([win.x, COUNTER.y + COUNTER.d, z0], [win.x + win.w, COUNTER.y + COUNTER.d, z0], P) + k.segment([win.x, COUNTER.y + COUNTER.d, z1], [win.x + win.w, COUNTER.y + COUNTER.d, z1], P)
    + k.rise([win.x, COUNTER.y + COUNTER.d], z0, z1, P) + k.rise([win.x + win.w, COUNTER.y + COUNTER.d], z0, z1, P), { tone: "lo" }));
  o.push(`<g data-part="count">${k.faceTextSvg(k.sideMatrix([COUNTER.x + COUNTER.w / 2, COUNTER.y + COUNTER.d], 8, P, "right"), "0000", { size: 5.2, tone: "hi", anchor: "middle" })}</g>`);
  o.push(D([at([COUNTER.x + 3, COUNTER.y + 3, COUNTER_H]), at([COUNTER.x + COUNTER.w - 3, COUNTER.y + 3, COUNTER_H])], { size: .4 }));
  o.push(S(k.cylinder(COUNTER.x + COUNTER.w - 6, COUNTER.y + COUNTER.d - 5, 2.2, COUNTER_H, 2.6, P, 18), { tone: "mid" })); // reset button
  return o.join("");
}
function panel() {
  const o = [];
  o.push(S(k.slabOf(PANEL, 0, PANEL_H, P, 4, .8), { tone: "mid" }));
  o.push(L(k.planOutline(k.insetPlan(PANEL, 3), PANEL_H, P, 4), { tone: "faint" }));
  const knob = [PANEL.x + 12, PANEL.y + 12];
  o.push(S(k.cylinder(knob[0], knob[1], 6, PANEL_H, 4.5, P, 32), { tone: "hi" }));
  o.push(L(k.knurl(knob[0], knob[1], 6, PANEL_H, PANEL_H + 4.5, 36, P), { tone: "lo" }));
  o.push(L(k.lineOnTop(knob, [knob[0] + 5.6, knob[1] - 1.6], PANEL_H + 4.5, P), { tone: "hi" }));
  o.push(D([at([knob[0], knob[1], PANEL_H + 4.5])], { size: .5, tone: "hi" }));
  // a toggle lever
  o.push(S(k.slabOf({ x: PANEL.x + 26, y: PANEL.y + 15, w: 6, d: 6, r: 1.5 }, PANEL_H, 2, P, 3), { tone: "lo" }));
  o.push(S(k.cylinder(PANEL.x + 29, PANEL.y + 18, 1.2, PANEL_H + 2, 7, P, 12), { tone: "hi", crease: "none" }));
  o.push(S(k.cylinder(PANEL.x + 29, PANEL.y + 18, 2.2, PANEL_H + 9, 2, P, 16), { tone: "hi" }));
  // three lamps: in the pipeline, at the door, closed
  const lamps = [0, 1, 2].map((i) => at([PANEL.x + 24 + i * 7, PANEL.y + 7, PANEL_H]));
  o.push(L(lamps.map((_, i) => k.ring(PANEL.x + 24 + i * 7, PANEL.y + 7, 1.8, PANEL_H, P, 14)).join(""), { tone: "lo" }));
  o.push(`<g data-part="lamps">${lamps.map((p, i) => `<circle class="lamp" data-lamp="${i}" cx="${n2(p[0])}" cy="${n2(p[1])}" r="1.3"/>`).join("")}</g>`);
  o.push(D(k.corners(PANEL, 2.4).map(([x, y]) => at([x, y, PANEL_H])), { size: .4 }));
  return o.join("");
}
function dialGauge() {
  const [x, y] = DIAL_AT, o = [];
  o.push(S(k.cylinder(x, y, 5, 0, 3, P, 28), { tone: "lo" }));
  o.push(S(k.cylinder(x, y, 2.8, 3, DIAL_Z - 3, P, 20), { tone: "mid", crease: "none" }));
  o.push(L([16, 30].map((z) => k.sideArc(x, y, 2.8, z, P, 14)).join(""), { tone: "faint" }));
  o.push(S(k.cylinder(x, y, DIAL_R, DIAL_Z, DIAL_H, P, 56, .7), { tone: "hi", crease: "lo" }));
  o.push(L(k.knurl(x, y, DIAL_R, DIAL_TOP - 2.6, DIAL_TOP, 60, P, .3), { tone: "lo" }));
  o.push(L(k.ring(x, y, DIAL_R - 1.8, DIAL_TOP, P, 56), { tone: "lo" }));
  const t = k.radialTicks(x, y, DIAL_R - 2.6, 24, 4, DIAL_TOP, [1.2, 2.4], P, -Math.PI * .75, Math.PI * 1.5);
  o.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  o.push(L(k.ring(x, y, 1.4, DIAL_TOP, P, 14), { tone: "mid" }));
  // the gauge's cable down the post to the panel: a wire with terminal dots
  o.push(k.wireSvg(at([x + 2.8, y + 1, 4]), at([PANEL.x + 2, PANEL.y - .5, PANEL_H - 4]), { via: [at([x + 6, y + 10, 1]), at([PANEL.x - 6, PANEL.y - 14, 1])], tone: "lo", ends: "both", size: 1.1 }));
  return o.join("");
}
const needleAt = (fill) => { // fill 0..1 across a 270° sweep, 0 at seven o'clock
  const a = -Math.PI * .75 + fill * Math.PI * 1.5, [x, y] = DIAL_AT;
  return k.lineOnTop([x - Math.sin(a) * 2.6, y + Math.cos(a) * 2.6], [x + Math.sin(a) * (DIAL_R - 3.4), y - Math.cos(a) * (DIAL_R - 3.4)], DIAL_TOP + .2, P);
};
function token(lit) { return S(k.cylinder(0, 0, TOKEN_R, 0, TOKEN_H, P, 20), { tone: "hi", lit, crease: lit ? "none" : "lo" }); }

const N_TOKENS = 14;
const tokens = Array.from({ length: N_TOKENS }, (_, i) => `<g class="tok" data-tok="${i}" style="display:none">${token(false)}</g>`).join("");

const svg = k.figureSvg({
  width: W, height: H, className: "machine-svg",
  label: "The sales pipeline drawn as a bench machine. Leads drop from a hopper onto a conveyor belt. At the first gantry a paddle pushes the ones that do not qualify into a bin. At the second, a pair of doors slides open for each lead that does. At the third, a press comes down and the lead lights up green: a closed contract. It drops into a tray and a counter ticks up. A dial on a post behind the belt reads how full the pipeline is.",
  body: [
    bench(), dialGauge(), conveyorBack(),
    gateBack(), `<g data-part="paddle">${paddle()}</g>`, doorBack(), pressBack(),
    openBox(BIN, BIN_H, "back"), openBox(TRAY, TRAY_H, "back"),
    `<g data-part="tokens">${tokens}</g>`,
    `<g data-part="leafA">${doorLeaf(-1)}</g>`, `<g data-part="leafB">${doorLeaf(1)}</g>`,
    `<g data-part="ram">${ram()}</g>`,
    // front rail, in two pieces around the gate
    S(k.slabOf({ x: BED.x - 2, y: BED.y + BED.d - .2, w: GATE_X - 8 - (BED.x - 2), d: 2.2, r: .6 }, BED_Z, 4.5, P, 2, .3), { tone: "mid" }),
    S(k.slabOf({ x: GATE_X + 8, y: BED.y + BED.d - .2, w: BED.x + BED.w + 2 - (GATE_X + 8), d: 2.2, r: .6 }, BED_Z, 4.5, P, 2, .3), { tone: "mid" }),
    D([BED.x + 20, DOOR_X - 40, PRESS_X - 40, BED.x + BED.w - 20].map((x) => at([x, BED.y + BED.d + .9, BED_Z + 4.5])), { size: .4 }),
    gateFront(), doorFront(), pressFront(),
    openBox(BIN, BIN_H, "front"), openBox(TRAY, TRAY_H, "front"),
    hopper(), counter(), panel(),
    `<path data-part="needle" class="iso-line" data-tone="lit" data-free="start" d="${needleAt(0)}" style="stroke-width:1.1"/>`,
  ],
});

// ---- live model: numbers the page needs, no kit at runtime ----
const AX = k.axisVector(P, [1, 0, 0]), AY = k.axisVector(P, [0, 1, 0]), AZ = k.axisVector(P, [0, 0, 1]), O = at([0, 0, 0]);
const live = `(()=>{
const AX=${JSON.stringify(AX.map(n2))},AY=${JSON.stringify(AY.map(n2))},AZ=${JSON.stringify(AZ.map(n2))},O=${JSON.stringify(O.map(n2))};
const DIAL=${JSON.stringify(DIAL_AT)},DIAL_R=${DIAL_R},DIAL_TOP=${DIAL_TOP};
const X0=${X0},GATE=${GATE_X},DOOR=${DOOR_X},PRESS=${PRESS_X},XEND=${X_END},TZ=${TOKEN_Z},TH=${TOKEN_H},TRAY=${JSON.stringify(TRAY_AT)},STACK=${STACK_H},BIN=${JSON.stringify([BIN.x + BIN.w / 2, BIN.y + BIN.d / 2])};
const TRAVEL=${PADDLE_TRAVEL},OPEN=${DOOR_OPEN},DROP=${RAM_DROP};
const fig=document.querySelector('.machine');if(!fig)return;const svg=fig.querySelector('svg');
if(matchMedia('(max-width:600px)').matches)svg.setAttribute('viewBox','130 20 950 340'); // phones: the belt and its stations, the bench edges cropped
const tr=(x,y,z)=>'translate('+(x*AX[0]+y*AY[0]+z*AZ[0]).toFixed(2)+' '+(x*AX[1]+y*AY[1]+z*AZ[1]).toFixed(2)+')';
const pt=(x,y,z)=>[O[0]+x*AX[0]+y*AY[0]+z*AZ[0],O[1]+x*AX[1]+y*AY[1]+z*AZ[1]];
const still=matchMedia('(prefers-reduced-motion: reduce)');
const toks=[...svg.querySelectorAll('.tok')],paddle=svg.querySelector('[data-part=paddle]'),leafA=svg.querySelector('[data-part=leafA]'),leafB=svg.querySelector('[data-part=leafB]'),ramEl=svg.querySelector('[data-part=ram]'),needle=svg.querySelector('[data-part=needle]'),count=svg.querySelector('[data-part=count] text'),lamps=[...svg.querySelectorAll('.lamp')],readout=fig.querySelector('[data-readout]');
const V=30,SPAWN=2.6,ease=(a,b,t)=>a+(b-a)*(t<0?0:t>1?1:t*t*(3-2*t));
let T=[],tray=[],bin=[],closed=0,spawnAt=.4,clock=0,uid=0,paddleY=0,door=0,ramD=0,pressBusy=null,gateBusy=null;
function spawn(){const g=toks.find(t=>!t.dataset.on);if(!g)return;g.dataset.on='1';g.style.display='';g.querySelector('.iso-solid').removeAttribute('data-lit');T.push({id:uid++,g,x:X0,y:0,z:TZ,ph:'belt',t:0,lit:false,reject:uid%3===0})}
function place(o){o.g.setAttribute('transform',tr(o.x,o.y,o.z))}
function free(o){o.g.style.display='none';delete o.g.dataset.on}
function step(dt){
  clock+=dt;if(clock>=spawnAt){spawnAt=clock+SPAWN;spawn()}
  const ahead=(o)=>T.some(p=>p!==o&&p.ph!=='bin'&&p.ph!=='tray'&&p.ph!=='binfall'&&p.x>o.x&&p.x-o.x<2*${TOKEN_R}+3.5);
  let wantDoor=0;
  for(const o of T){
    if(o.ph==='belt'){
      if(!ahead(o))o.x+=V*dt;
      if(o.reject&&o.x>=GATE&&!gateBusy){o.x=GATE;o.ph='gate';o.t=0;gateBusy=o}
      else if(!o.reject&&o.x>=PRESS&&!pressBusy){o.x=PRESS;o.ph='press';o.t=0;pressBusy=o}
      else if(o.x>=XEND){o.ph='drop';o.t=0;o.x0=o.x}
      if(!o.reject&&o.x>DOOR-26&&o.x<DOOR+14)wantDoor=1;
    }else if(o.ph==='gate'){o.t+=dt;const u=o.t<.35?0:o.t<.95?(o.t-.35)/.6:1;o.y=ease(0,TRAVEL-4,u);paddleY=ease(0,TRAVEL,u);
      if(o.t>=.95){o.ph='binfall';o.t=0;o.y0=o.y}
    }else if(o.ph==='binfall'){o.t+=dt;const u=Math.min(1,o.t/.45);o.y=o.y0+(BIN[1]-o.y0)*u;o.x=GATE+(BIN[0]-GATE)*u;const n=bin.length;o.z=TZ+2*Math.sin(u*Math.PI)-(TZ-1-n*STACK)*u*u;
      paddleY=ease(TRAVEL,0,o.t/.5);if(o.t>=.45){o.ph='bin';o.z=1+n*STACK;bin.push(o);gateBusy=null;if(bin.length>4)free(bin.shift());}
    }else if(o.ph==='press'){o.t+=dt;ramD=o.t<.3?ease(0,DROP,o.t/.3):o.t<.55?DROP:ease(DROP,0,(o.t-.55)/.4);
      if(o.t>=.3&&!o.lit){o.lit=true;o.g.querySelector('.iso-solid').setAttribute('data-lit','');closed++;flash(2)}
      if(o.t>=.95){o.ph='belt';pressBusy=null;ramD=0;o.x+=.5}
    }else if(o.ph==='drop'){o.t+=dt;const u=Math.min(1,o.t/.5);const n=tray.length;o.x=o.x0+(TRAY[0]-o.x0)*u;o.y=TRAY[1]*u;o.z=TZ+3*Math.sin(u*Math.PI)-(TZ-1-n*STACK)*u*u;
      if(u>=1){o.ph='tray';o.z=1+n*STACK;tray.push(o);if(tray.length>4)free(tray.shift())}
    }
    place(o);
  }
  T=T.filter(o=>o.g.dataset.on);
  door+=(wantDoor*OPEN-door)*(1-Math.exp(-dt/.16));
  leafA.setAttribute('transform',tr(0,-door,0));leafB.setAttribute('transform',tr(0,door,0));
  ramEl.setAttribute('transform',tr(0,0,-ramD));paddle.setAttribute('transform',tr(0,paddleY,0));
  const onBelt=T.filter(o=>o.ph==='belt'||o.ph==='gate'||o.ph==='press').length;
  const fill=Math.min(1,onBelt/6),a=-Math.PI*.75+fill*Math.PI*1.5;
  const p0=pt(DIAL[0]-Math.sin(a)*2.6,DIAL[1]+Math.cos(a)*2.6,DIAL_TOP+.2),p1=pt(DIAL[0]+Math.sin(a)*(DIAL_R-3.4),DIAL[1]-Math.cos(a)*(DIAL_R-3.4),DIAL_TOP+.2);
  needle.setAttribute('d','M'+p0[0].toFixed(1)+' '+p0[1].toFixed(1)+'L'+p1[0].toFixed(1)+' '+p1[1].toFixed(1));
  lamps[0].classList.toggle('on',onBelt>0);lamps[1].classList.toggle('on',door>OPEN*.5);
  const c=String(closed).padStart(4,'0');if(count.textContent!==c)count.textContent=c;
  const txt=onBelt+' in the pipeline · '+closed+' closed since you arrived';if(readout&&readout.textContent!==txt)readout.textContent=txt;
}
let flashT=0;function flash(i){lamps[i].classList.add('on');flashT=.9}
let frame=0,last=0,visible=false;
function tick(now){const dt=last?Math.min((now-last)/1000,1/30):1/60;last=now;step(dt);if(flashT>0){flashT-=dt;if(flashT<=0)lamps[2].classList.remove('on')}frame=visible?requestAnimationFrame(tick):0}
const run=()=>{if(!frame&&visible&&!still.matches){last=0;frame=requestAnimationFrame(tick)}};
new IntersectionObserver(es=>{visible=es[es.length-1].isIntersecting;if(visible)run();},{rootMargin:'120px 0px'}).observe(fig);
// a still frame for reduced motion, or before the first tick: a lead at each station, the tray part full
function stillFrame(){for(let i=0;i<14;i++)step(1/30);for(let i=0;i<14*3;i++)step(.1);}
if(still.matches){stillFrame();}
still.addEventListener('change',()=>{if(still.matches){if(frame)cancelAnimationFrame(frame);frame=0}else run()});
if(!still.matches){for(let i=0;i<60;i++)step(.1)} // start mid-run so the first frame already has leads on the belt
})();`;

const css = `
.machine{margin:0;padding:0}
.machine .iso-svg{width:100%;height:auto;display:block;overflow:visible}
.machine .lamp{fill:var(--anatomy-faint);transition:fill var(--t-base,260ms)}
.machine .lamp.on{fill:var(--anatomy-lit)}
.machine .tok .iso-solid[data-lit]>.iso-fill{fill:var(--anatomy-lit-top)}
.machine .tok .iso-solid:not([data-lit])>.iso-top{fill:var(--anatomy-mid)}
.machine .tok .iso-solid:not([data-lit])>.iso-shade{fill:var(--anatomy-lo)}
`;

const fragment = `<figure class="machine iso" aria-labelledby="machine-cap">
${svg}
<figcaption id="machine-cap" class="machine-cap"><span class="mt"><b>The pipeline, as a machine.</b> Leads in from the hopper. The gate turns away the ones that don't qualify. The door opens for the ones that do. The press closes the contract.</span><span class="mr" data-readout>0 in the pipeline · 0 closed since you arrived</span></figcaption>
</figure>`;

writeFileSync(OUT + "fragment.html", fragment);
writeFileSync(OUT + "live.js", live);
writeFileSync(OUT + "machine.css", css);
// a standalone page per theme for capture
for (const theme of ["dark", "light"]) {
  const page = k.pageHtml({ title: "Pipeline machine", theme, width: 1200, body: `<style>${css}.machine-cap{display:flex;justify-content:space-between;gap:24px;font:13px/1.5 system-ui;color:var(--anatomy-text);margin-top:10px}.machine-cap .mr{font-family:var(--anatomy-mono);white-space:nowrap}</style>` + fragment, script: live });
  writeFileSync(OUT + `test-${theme}.html`, page);
}
const solids = (svg.match(/class="iso-solid/g) || []).length, paths = (svg.match(/<path/g) || []).length;
console.log("wrote fragment", svg.length, "chars,", solids, "solids,", paths, "paths; P", JSON.stringify(P));
