/* The Journey scene: a flat 2D side-view panorama. Pickers work a field, scan trays with the field scanner and a phone,
   product moves to the cooler, the packing shed (line scanner), the dock, then fans out on three roads to distributors,
   then stores, ending on a shelf. A marker follows ONE clamshell lot along the route; the camera follows the marker.
   Drawing only: the story data (lot code, buyers) arrives through setStory(). */
const WORLD = { H: 440, G: 322, W: 4800, Y0: 100, VH: 290 };
const WP = [ // where the marker rests: 0 field stand, 1 cooler, 2 packing line, 3 dock, 4 distributor, 5 shelf
  { x: 830, y: 292 }, { x: 1240, y: 292 }, { x: 1900, y: 270 }, { x: 2620, y: 292 }, { x: 3330, y: 292 }, { x: 4560, y: 226 }];
const LANE = [{ y: 332, s: 1 }, { y: 306, s: .9 }, { y: 282, s: .8 }];
const SHIRT = ['#2f6f6c', '#c9a05b', '#5b6fb0', '#a8584a', '#6a8f4e', '#7a5aa0'], SKIN = ['#e0b48a', '#c68863', '#8d5a3b', '#f0c8a0'];
const ease = t => t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t);

class Scene {
  constructor(cv, hooks) { this.cv = cv; this.ctx = cv.getContext('2d'); this.hooks = hooks || {}; this.u = 0; this.target = 0; this.t = 0; this.fx = []; this.story = { crop: '#7fbf6a', cropId: 'romaine', code: 'L-2905-A', dist: 0, store: 0, field: 0, buyers: [] }; this.cam = 830; this.back = false; this.stars = Array.from({ length: 70 }, (_, i) => ({ x: (i * 97.3) % 1, y: (i * 53.1 % 1) * .55, r: .4 + (i % 3) * .35, p: i })); this.resize(); }
  setStory(s) { Object.assign(this.story, s); }
  setFlags(f) { // gate: null | 'closed' | 'open'; consumer: shopper scans the shelf clamshell
    if (f.gate !== this.gate) { this.gate = f.gate; if (f.gate === 'closed') this.gateT0 = this.t; }
    if (!!f.consumer !== !!this.consumer) { this.consumer = !!f.consumer; this.consT0 = this.t; this.consScanned = false; }
  }
  wrap(text, maxW) { const c = this.ctx, words = text.split(' '), lines = []; let cur = ''; for (const w of words) { const t = cur ? cur + ' ' + w : w; if (c.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; } if (cur) lines.push(cur); return lines; }
  bigSign(x, y, w, h, name, sub, hot) {
    const c = this.ctx; c.strokeStyle = '#3b4a4a'; c.lineWidth = 3; c.beginPath(); c.moveTo(x + 24, y + h); c.lineTo(x + 24, y + h + 40); c.moveTo(x + w - 24, y + h); c.lineTo(x + w - 24, y + h + 40); c.stroke();
    this.rr(x, y, w, h, 6, '#0d1313', hot ? '#d9c36a' : '#4dccc7'); this.glow(x + w / 2, y + h / 2, w * .6, hot ? 'rgba(217,195,106,A)' : 'rgba(77,204,199,A)', .12);
    c.textAlign = 'left'; c.fillStyle = '#e8ecec'; c.font = '800 21px "Inter Tight",sans-serif'; c.fillText(name, x + 10, y + 25);
    c.font = '500 10px "JetBrains Mono",monospace'; c.fillStyle = '#9aa8a8'; this.wrap(sub, w - 20).slice(0, 2).forEach((l, i) => c.fillText(l, x + 10, y + 39 + i * 12));
  }
  signs() {
    const bs = this.story.buyers, c = this.ctx;
    bs.slice(0, 8).forEach((b, i) => { const row = i % 2, col = Math.floor(i / 2); this.bigSign(2790 + col * 215, row ? 168 : 112, 200, 56, b.label.toUpperCase(), b.short, b.id === 'costco'); });
    if (bs.length > 8) { c.textAlign = 'left'; c.fillStyle = '#8d9a9a'; c.font = '600 12px "JetBrains Mono",monospace'; c.fillText('+' + (bs.length - 8) + ' more buyers', 3650, 130); }
  }
  drawGate() {
    const c = this.ctx, G = IOMIST_DATA.gate, e = this.t - (this.gateT0 || 0), closed = this.gate === 'closed';
    // booth and barrier
    this.rr(2290, 262, 58, 60, 3, '#18201f', '#3b4a4a'); this.rr(2300, 272, 24, 20, 2, '#0f2a36'); c.fillStyle = 'rgba(255,214,120,.5)'; c.fillRect(2304, 276, 16, 12);
    this.barrier = lerp(this.barrier ?? 0, this.gate === 'open' ? 1 : 0, .08);
    c.save(); c.translate(2372, 300); c.rotate(-this.barrier * 1.45); c.fillStyle = '#e8ecec'; c.fillRect(0, -3, 74, 6); c.fillStyle = '#d9533a'; for (let i = 0; i < 4; i++) c.fillRect(10 + i * 18, -3, 9, 6); c.restore(); this.rr(2366, 296, 12, 28, 2, '#37423f');
    // the auditor
    this.person(2318, 332, { shirt: '#c9a05b', skin: SKIN[1], hat: '#e8ecec', bend: .15 + .1 * Math.sin(this.t * 2), a1: .9, a2: .6 });
    this.rr(2330, 292, 11, 15, 2, '#e8ecec');
    // the panel
    const lines = (this.story.gateLines || []).slice(0, 9), n = lines.length, x = 2150, y = 104, w = 470, h = 34 + n * 14;
    this.rr(x, y, w, h, 6, '#0d1313', '#d9c36a'); this.glow(x + w / 2, y + h / 2, 260, 'rgba(217,195,106,A)', .1);
    c.textAlign = 'left'; c.fillStyle = '#d9c36a'; c.font = '800 20px "Inter Tight",sans-serif'; c.fillText('AUDIT GATE', x + 12, y + 24);
    c.font = '600 10px "JetBrains Mono",monospace';
    lines.forEach((L, i) => { const on = !closed || e > 1 + i * .8 || this.gate === 'open'; c.fillStyle = on ? '#4dccc7' : '#4a5656'; c.fillText(on ? '✓' : '○', x + 12, y + 42 + i * 14); c.fillStyle = on ? '#e8ecec' : '#7b8888'; c.font = '800 10px "JetBrains Mono",monospace'; c.fillText(L.b, x + 28, y + 42 + i * 14); c.font = '500 10px "JetBrains Mono",monospace'; c.fillStyle = on ? '#b9c6c6' : '#7b8888'; c.fillText(L.t, x + 28 + 84, y + 42 + i * 14); });
    if (closed && e > 1 + n * .8 + .6 && !this.gateScan) { this.gateScan = true; this.scan(2440, 276); } if (!closed) this.gateScan = false;
  }
  resize() { const r = this.cv.getBoundingClientRect(); this.dpr = Math.min(2, devicePixelRatio || 1); this.w = Math.max(280, r.width); this.h = Math.max(200, r.height); this.cv.width = this.w * this.dpr; this.cv.height = this.h * this.dpr; this.s = this.h / WORLD.VH; this.vw = this.w / this.s; }
  goTo(wp, back) { this.target = wp; this.back = !!back; }
  reset() { this.u = 0; this.target = 0; this.back = false; }
  markerPos() { const i = Math.min(4, Math.floor(this.u)), f = this.u - i, a = WP[i], b = WP[i + 1] || WP[i]; let by = b.y; if (i + 1 === 4) by = LANE[this.story.dist].y - 30 * LANE[this.story.dist].s; const e = ease(f); let x = lerp(a.x, b.x, e); if (this.gate === 'closed' && this.story.gateOn) x = Math.min(x, 2326); return { x, y: lerp(a.y, by, e), moving: Math.abs(this.u - this.target) > .01 && x < (this.gate === 'closed' ? 2325 : 1e9) }; }
  scan(x, y) { this.fx.push({ x, y, t0: this.t }); if (this.hooks.onScan && Math.abs(x - this.cam) < this.vw * .55) this.hooks.onScan(); }
  step(dt) {
    this.t += dt; const d = this.target - this.u; if (Math.abs(d) < .002) this.u = this.target; else this.u += clamp(d * 1.5, -.9, .9) * dt + Math.sign(d) * .02 * dt;
    const mp = this.markerPos(), fx = this.gate === 'closed' && this.story.gateOn ? 2470 : mp.x, want = clamp(fx - this.vw * (this.u > 3.6 ? .45 : .5) + (this.u < 4.6 ? 0 : 60), 0, WORLD.W - this.vw);
    this.cam = lerp(this.cam, want, 1 - Math.exp(-dt * 3));
    this.fx = this.fx.filter(f => this.t - f.t0 < 1.4);
  }
  /* ---------- primitives ---------- */
  rr(x, y, w, h, r, fill, stroke) { const c = this.ctx; c.beginPath(); c.roundRect(x, y, w, h, r); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1.5; c.stroke(); } }
  glow(x, y, r, col, a) { const c = this.ctx, g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col.replace('A', a)); g.addColorStop(1, col.replace('A', 0)); c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); }
  person(x, y, o) {
    const c = this.ctx, d = o.dir || 1, sw = o.walk ? Math.sin(o.walk) * .55 : 0, lean = (o.bend || 0) * .85, sh = o.shirt || SHIRT[0], sk = o.skin || SKIN[0];
    const PS = 1.3; c.save(); c.translate(x, y); c.scale(d * PS, PS); c.lineCap = 'round';
    c.strokeStyle = '#20282a'; c.lineWidth = 6; [-sw, sw].forEach(a => { c.beginPath(); c.moveTo(0, -27); c.lineTo(Math.sin(a) * 15, -27 + Math.cos(a) * 27); c.stroke(); });
    c.translate(0, -27); c.rotate(lean);
    this.rr(-7, -27, 14, 28, 6, sh);
    c.fillStyle = sk; c.beginPath(); c.arc(1.5, -34, 6.5, 0, 7); c.fill();
    c.fillStyle = o.hat || '#d9c36a'; c.beginPath(); c.ellipse(1.5, -39, 11, 3, 0, 0, 7); c.fill(); c.beginPath(); c.arc(1.5, -39, 6, Math.PI, 0); c.fill();
    const arm = (a1, a2, col) => { c.strokeStyle = col; c.lineWidth = 5; c.beginPath(); c.moveTo(0, -20); const ex = Math.cos(a1) * 12, ey = Math.sin(a1) * 12; c.lineTo(ex, -20 + ey); c.lineTo(ex + Math.cos(a2) * 12, -20 + ey + Math.sin(a2) * 12); c.stroke(); return { x: ex + Math.cos(a2) * 12, y: -20 + ey + Math.sin(a2) * 12 }; };
    const hand = arm(o.a1 ?? 1.2, o.a2 ?? 1.4, sh);
    c.restore();
    return { x: x + d * PS * (hand.x * Math.cos(lean) - (hand.y + 27) * Math.sin(lean)), y: y - 27 * PS + PS * (hand.x * Math.sin(lean) + (hand.y + 27) * Math.cos(lean)) };
  }
  tray(x, y, n, dir) { const c = this.ctx; this.rr(x - 13, y - 5, 26, 7, 2, '#3b4646'); for (let i = 0; i < n; i++) this.rr(x - 12 + i * 6.4, y - 11, 5, 6, 2, this.story.crop); }
  truck(x, y, dir, s, o) {
    const c = this.ctx; c.save(); c.translate(x, y); c.scale(dir * s, s);
    this.rr(-62, -48, 80, 42, 4, o.col || '#3a4b4b'); this.rr(18, -38, 34, 32, 5, o.cab || '#2f3f3f'); this.rr(34, -33, 14, 12, 2, '#9ad7d3');
    if (o.cargo) { this.glow(-20, -54, 36, 'rgba(77,204,199,A)', .5); this.rr(-40, -62, 28, 14, 3, '#4dccc7'); this.rr(-34, -58, 6, 6, 1, '#06201f'); }
    [-38, 4, 34].forEach(wx => { c.fillStyle = '#0a0d0d'; c.beginPath(); c.arc(wx, -4, 8, 0, 7); c.fill(); c.strokeStyle = '#5b6a6a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(wx, -4); c.lineTo(wx + Math.cos(x * .05) * 6, -4 + Math.sin(x * .05) * 6); c.stroke(); });
    c.restore();
  }
  plant(x, y, k, sc) {
    const c = this.ctx, id = this.story.cropId, col = this.story.crop; c.save(); c.translate(x, y); c.scale(sc, sc);
    c.fillStyle = col; c.globalAlpha = .85;
    const lobes = (n, r, rot) => { for (let i = 0; i < n; i++) { const a = rot + i * Math.PI * 2 / n; c.beginPath(); c.ellipse(Math.cos(a) * r, -8 + Math.sin(a) * r * .5, 9, 5, a, 0, 7); c.fill(); } };
    if (['romaine', 'leafy', 'herb', 'freshcut'].includes(id)) { lobes(6, 7, k); c.beginPath(); c.ellipse(0, -9, 7, 9, 0, 0, 7); c.fill(); }
    else { lobes(5, 8, k); c.globalAlpha = 1; c.fillStyle = ({ tomato: '#e8553d', pepper: '#f2a93b', berry: '#d6405a', cucumber: '#3f9b5a', melon: '#e9b86a', tropical: '#f0a23d' })[id] || '#c9a27a'; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(-9 + i * 6, -3 - (i % 2) * 6, 3, 0, 7); c.fill(); } }
    c.restore();
  }
  label(x, y, text, col) { const c = this.ctx; c.font = '500 11px "JetBrains Mono",monospace'; c.textAlign = 'center'; c.fillStyle = col || '#8d9a9a'; c.fillText(text, x, y); }
  /* ---------- the world ---------- */
  draw(now) {
    const c = this.ctx, { w, h, dpr, s } = this, t = this.t, cam = this.cam;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const sky = c.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, '#080d0f'); sky.addColorStop(.7, '#10252a'); sky.addColorStop(1, '#17383a'); c.fillStyle = sky; c.fillRect(0, 0, w, h);
    this.stars.forEach(st => { c.fillStyle = `rgba(200,240,238,${.25 + .35 * Math.sin(t * .8 + st.p)})`; c.fillRect(((st.x * w - cam * s * .02) % w + w) % w, st.y * h, st.r, st.r); });
    c.fillStyle = '#d8efec'; c.globalAlpha = .9; c.beginPath(); c.arc(w * .82 - cam * s * .03, h * .14, 14 * s, 0, 7); c.fill(); c.globalAlpha = 1;
    [[.25, '#0f1f21', 60, .004], [.45, '#12292b', 42, .007]].forEach(([par, col, amp, fr]) => { c.fillStyle = col; c.beginPath(); c.moveTo(0, h); for (let x = 0; x <= w; x += 12) { const wx = x / s + cam * par; c.lineTo(x, (WORLD.G - 40 - amp * (.5 + .5 * Math.sin(wx * fr) * Math.cos(wx * fr * 2.3 + 1)) - WORLD.Y0) * s); } c.lineTo(w, h); c.fill(); });
    c.save(); c.scale(s, s); c.translate(-cam, -WORLD.Y0);
    const vis = (a, b) => b > cam - 80 && a < cam + this.vw + 80;
    // ground
    c.fillStyle = '#121915'; c.fillRect(cam - 20, WORLD.G, this.vw + 40, 90);
    c.fillStyle = '#1a2520'; c.fillRect(cam - 20, WORLD.G, this.vw + 40, 4);
    if (vis(850, 2700)) { c.fillStyle = '#171d1d'; c.fillRect(850, WORLD.G + 6, 1900, 24); c.fillStyle = '#2b3535'; for (let x = 860; x < 2700; x += 60) c.fillRect(x, WORLD.G + 17, 28, 2); }
    if (vis(2700, 4400)) { c.fillStyle = '#151a1a'; c.fillRect(2700, 270, 1700, 90); [292, 318].forEach(y => { c.fillStyle = '#2b3535'; for (let x = 2710; x < 4400; x += 50) c.fillRect(x, y, 24, 2); }); }
    if (vis(60, 960)) this.field(); if (vis(1080, 1420)) this.cooler(); if (vis(1600, 2330)) this.shed(); if (vis(2400, 2820)) this.dock();
    if (vis(2700, 4800)) this.network(); if (vis(2700, 3600)) this.signs(); if (this.story.gateOn && vis(2200, 2700)) this.drawGate(); if (vis(4200, 4800)) this.store();
    this.marker(); this.effects();
    c.restore();
  }
  unit(cx, y) { // Iomist's scanner as filmed: a yellow case with a round speaker and a small screen, on an aluminum plate
    this.rr(cx - 24, y + 28, 48, 14, 2, '#aab4b3'); this.rr(cx - 24, y + 38, 48, 4, 1, '#232b2b');
    this.rr(cx - 22, y, 44, 28, 4, '#f2c230', '#b88f12'); this.ctx.fillStyle = '#10150f'; this.ctx.beginPath(); this.ctx.arc(cx - 10, y + 14, 6.5, 0, 7); this.ctx.fill();
    this.rr(cx + 2, y + 7, 16, 14, 2, '#10150f');
  }
  field() {
    const c = this.ctx, t = this.t;
    for (let r = 0; r < 3; r++) for (let x = 100 + (r % 2) * 20; x < 800; x += 42) this.plant(x, 300 + r * 6 - 4, x * .1 + r, .8 + r * .08);
    // field scanner stand
    this.rr(790, 282, 60, 8, 2, '#37423f'); this.rr(796, 290, 6, 32, 1, '#2a3331'); this.rr(838, 290, 6, 32, 1, '#2a3331');
    this.rr(796, 246, 5, 36, 1, '#3d4a4a'); this.rr(839, 246, 5, 36, 1, '#3d4a4a'); this.unit(820, 206);
    this.glow(820, 240, 50, 'rgba(77,204,199,A)', .35);
    this.label(820, 196, 'FIELD SCANNER', '#4dccc7');
    const pickers = [0, 1, 2, 3];
    pickers.forEach(i => {
      const T = 10, cc = (t + i * 2.3) % T, bx = 180 + i * 130, y = 328 + (i % 2) * 8; let x = bx, o = { shirt: SHIRT[i], skin: SKIN[i], hat: i % 2 ? '#d9c36a' : '#b8c8c6' }, hold = 0;
      if (cc < 4) { o.bend = .5 + .3 * Math.sin(cc * 5); o.a1 = 1.1 + .5 * Math.sin(cc * 5); o.a2 = 1.2; }
      else if (cc < 6) { const e = ease((cc - 4) / 2); x = lerp(bx, 790, e); o.walk = cc * 11; o.a1 = 1.3; o.a2 = -.2; hold = 1; }
      else if (cc < 7.4) { x = 790; o.a1 = 1.3; o.a2 = -.2; hold = 1; if (cc > 6.5 && !this['sc' + i]) { this['sc' + i] = 1; this.scan(820, 250); } if (cc < 6.5) this['sc' + i] = 0; }
      else if (cc < 9.4) { const e = ease((cc - 7.4) / 2); x = lerp(790, bx, e); o.walk = cc * 11; o.dir = -1; o.a1 = 1.2; }
      else { o.bend = .4; }
      if (cc >= 7.4 && cc < 9.4) o.dir = -1;
      const hand = this.person(x, y, o); if (hold) this.tray(hand.x, hand.y + 2, 8, 1);
      if (cc >= 6 && cc < 7.4) { const sweep = ((cc - 6) / 1.4); c.fillStyle = 'rgba(77,204,199,.85)'; c.fillRect(798, 238 + sweep * 42, 44, 2); this.glow(820, 238 + sweep * 42, 26, 'rgba(77,204,199,A)', .45); }
    });
    // mobile scanner picker
    const cm = (t + 1.1) % 8, px = 700; let o = { shirt: SHIRT[4], skin: SKIN[2], hat: '#d9c36a' };
    if (cm < 5) { o.bend = .5 + .3 * Math.sin(cm * 5); o.a1 = 1.1 + .4 * Math.sin(cm * 5); o.a2 = 1.2; this.mobSc = 0; } else { o.a1 = -.4; o.a2 = -.6; o.dir = 1; if (cm > 5.7 && !this.mobSc) { this.mobSc = 1; this.scan(px + 22, 286); } }
    const hd = this.person(px, 330, o);
    if (cm >= 5) { this.rr(px + 14, 280, 10, 17, 2, '#0e1414', '#4dccc7'); this.tray(px + 38, 313, 8, 1); const al = .35 + .3 * Math.sin(t * 10); c.fillStyle = `rgba(77,204,199,${al})`; c.beginPath(); c.moveTo(px + 24, 284); c.lineTo(px + 52, 300); c.lineTo(px + 22, 318); c.fill(); }
    this.label(px + 20, 262, 'MOBILE SCANNER', '#4dccc7');
    // front plant row
    for (let x = 120; x < 800; x += 46) this.plant(x, 346, x * .07, 1.05);
    this.label(300, 380, 'FIELD', '#6f7d7d');
  }
  cooler() {
    const c = this.ctx, t = this.t;
    this.rr(1130, 190, 230, 132, 6, '#16222a', '#2c4450'); this.rr(1150, 232, 80, 90, 3, '#0d1418'); this.rr(1260, 214, 70, 40, 3, '#0f2a36', '#2d6f86');
    c.fillStyle = '#7fd2ee'; c.font = '600 22px Inter Tight,sans-serif'; c.textAlign = 'center'; c.fillText('❄', 1295, 242);
    this.glow(1295, 235, 60, 'rgba(120,210,240,A)', .25);
    for (let i = 0; i < 12; i++) { const px = 1140 + ((i * 37 + t * 14) % 210), py = 200 + ((i * 53 + t * 22) % 120); c.fillStyle = 'rgba(190,235,250,.35)'; c.fillRect(px, py, 2, 2); }
    const cc = (t % 7); const o = { shirt: SHIRT[5], skin: SKIN[3], hat: '#b8c8c6', a1: -.2, a2: -.6 }; this.person(1200, 328, o);
    this.rr(1214, 288, 9, 15, 2, '#0e1414', '#4dccc7'); if (cc > 3 && cc < 4) { c.fillStyle = 'rgba(77,204,199,.5)'; c.fillRect(1160, 300 + (cc - 3) * 10, 50, 2); if (!this.cool) { this.cool = 1; this.scan(1200, 290); } } else if (cc < 2) this.cool = 0;
    this.label(1240, 178, 'COOLER', '#6f7d7d');
  }
  shed() {
    const c = this.ctx, t = this.t;
    this.rr(1640, 164, 640, 158, 6, '#17201f', '#27393a'); this.rr(1660, 190, 600, 70, 3, '#0d1313');
    for (let x = 1690; x < 2240; x += 90) { c.fillStyle = 'rgba(255,214,120,.55)'; c.fillRect(x, 176, 30, 6); this.glow(x + 15, 182, 40, 'rgba(255,214,120,A)', .12); }
    // belt
    this.rr(1670, 276, 540, 9, 3, '#2a3535'); for (let x = 1680; x < 2210; x += 24) { c.fillStyle = '#3d4a4a'; c.beginPath(); c.arc(x + ((t * 40) % 24), 290, 3, 0, 7); c.fill(); }
    for (let k = 0; k < 8; k++) { const bx = 1670 + ((t * 56 + k * 68) % 540); if (bx > 2190) continue; this.rr(bx - 12, 258, 24, 18, 3, this.story.crop); this.rr(bx - 5, 262, 10, 10, 1, '#e8ecec'); if (Math.abs(bx - 1900) < 1.5 && !this['b' + k]) { this['b' + k] = 1; this.scan(1900, 262); } if (Math.abs(bx - 1900) > 20) this['b' + k] = 0; }
    // line scanner arch
    this.rr(1878, 232, 5, 53, 1, '#3d4a4a'); this.rr(1918, 232, 5, 53, 1, '#3d4a4a'); this.unit(1900, 186); this.glow(1900, 214, 46, 'rgba(77,204,199,A)', .3);
    this.label(1900, 176, 'LINE SCANNER', '#4dccc7');
    // packers
    [[2236, 0], [2290, 2.4]].forEach(([x, ph], i) => { const k = Math.sin(t * 3 + ph); this.person(x, 330, { shirt: SHIRT[i + 1], skin: SKIN[i + 2], hat: '#b8c8c6', bend: .25 + .2 * k, a1: .9 + .5 * k, a2: 1 }); });
    this.rr(2210, 292, 100, 14, 2, '#303b3b'); for (let i = 0; i < 4; i++) this.rr(2218 + i * 22, 282, 18, 12, 2, '#a9865b');
    this.label(1960, 150, 'PACKING SHED', '#6f7d7d');
  }
  dock() {
    const c = this.ctx, t = this.t;
    this.rr(2440, 214, 250, 108, 4, '#18201f', '#27393a'); this.rr(2470, 244, 70, 78, 2, '#0d1313'); this.rr(2560, 244, 70, 78, 2, '#0d1313');
    for (let i = 0; i < 6; i++) this.rr(2476 + (i % 3) * 22, 300 - Math.floor(i / 3) * 18, 18, 16, 2, '#a9865b');
    const f = ease(((t % 8) / 8) * 2 > 1 ? 2 - ((t % 8) / 8) * 2 : ((t % 8) / 8) * 2); this.rr(2680 - f * 70, 296, 22, 24, 2, '#a9865b'); this.rr(2706 - f * 70, 308, 24, 8, 2, '#d9c36a');
    this.label(2560, 202, 'DOCK', '#6f7d7d');
  }
  network() {
    const c = this.ctx, t = this.t;
    // distributors (back to front)
    [2, 1, 0].forEach(l => { const L = LANE[l], s = L.s, x = 3380, y = L.y + 12; this.rr(x, y - 78 * s, 170 * s, 78 * s, 4, '#18211f', '#27393a'); for (let k = 0; k < 3; k++) this.rr(x + 14 * s + k * 50 * s, y - 40 * s, 36 * s, 40 * s, 2, '#0d1313'); c.fillStyle = 'rgba(255,214,120,.5)'; c.fillRect(x + 8 * s, y - 70 * s, 154 * s, 4); this.label(x + 85 * s, y - 84 * s, 'DISTRIBUTOR ' + (l + 1), '#6f7d7d'); });
    // outbound trucks on the three roads, loops
    [0, 1, 2].forEach(l => { const L = LANE[l]; for (let k = 0; k < 2; k++) { const x = 2760 + ((t * 38 + k * 280 + l * 90) % 560); this.truck(x, L.y + 12, 1, .5 * L.s, { col: '#2c3838', cab: '#243030' }); } });
    // to the stores
    [0, 1, 2].forEach(l => { const L = LANE[l]; const x = 3600 + ((t * 34 + l * 200) % 650); this.truck(x, L.y + 12, 1, .5 * L.s, { col: '#2c3838', cab: '#243030' }); });
    [[3790, 2, 1], [3980, 1, 2]].forEach(([x, l, bi]) => { const s = LANE[l].s, b = this.story.buyers[bi]; this.rr(x, LANE[l].y - 70 * s, 150 * s, 82 * s, 4, '#1a2220', '#2a3b3a'); this.rr(x + 8, LANE[l].y - 74 * s, 150 * s - 16, 18 * s, 3, '#30413f'); c.fillStyle = '#e8ecec'; c.textAlign = 'center'; c.font = `800 ${Math.round(14 * s)}px "Inter Tight",sans-serif`; c.fillText(b ? b.label.toUpperCase() : 'STORE', x + 75 * s, LANE[l].y - 60 * s); });
  }
  store() {
    const c = this.ctx, t = this.t, X = 4380;
    this.rr(X, 120, 400, 212, 6, '#171f1e', '#2b3d3c'); this.rr(X + 8, 124, 384, 34, 3, '#4dccc7'); c.fillStyle = '#06201f'; c.font = '800 26px "Inter Tight",sans-serif'; c.textAlign = 'center'; const nm = this.story.buyers[0]; c.fillText(nm ? nm.label.toUpperCase() : 'STORE', X + 200, 150);
    this.rr(X + 20, 170, 360, 150, 4, '#0d1313');
    for (let r = 0; r < 3; r++) { this.rr(X + 36, 218 + r * 38 - 6, 328, 5, 2, '#3a4646'); for (let i = 0; i < 14; i++) this.rr(X + 42 + i * 23, 218 + r * 38 - 22, 19, 16, 3, this.story.crop); }
    // our lot, lit
    this.glow(4560, 216, 40, 'rgba(77,204,199,A)', .6); this.rr(4551, 196, 19, 16, 3, '#4dccc7');
    const k = Math.sin(t * 2); this.person(X + 120, 330, { shirt: SHIRT[0], skin: SKIN[1], hat: '#b8c8c6', bend: .1 + .1 * k, a1: .6 + .3 * k, a2: 1.2, dir: 1 });
    if (this.consumer) { // a shopper raises a phone at our clamshell
      const ce = this.t - this.consT0, px = X + 150, hand = this.person(px, 332, { shirt: SHIRT[5], skin: SKIN[3], hat: '#7a5aa0', a1: -1.3, a2: -.9 });
      this.rr(hand.x - 5, hand.y - 16, 11, 19, 2, '#0e1414', '#4dccc7');
      const al = ce > .8 ? .5 : 0; c.fillStyle = `rgba(77,204,199,${al * (.7 + .3 * Math.sin(t * 9))})`; c.beginPath(); c.moveTo(hand.x, hand.y - 12); c.lineTo(4548, 190); c.lineTo(4574, 222); c.fill();
      if (ce > 1.1 && !this.consScanned) { this.consScanned = true; this.scan(4560, 200); }
    } else this.person(X + 300 + 40 * Math.sin(t * .4), 330, { shirt: SHIRT[3], skin: SKIN[0], hat: '#7a5aa0', walk: t * 5, dir: Math.cos(t * .4) > 0 ? 1 : -1 });
    if (this.back && this.u > 4.6) { const ph = (t * 1.2) % 1; c.strokeStyle = `rgba(255,122,89,${1 - ph})`; c.lineWidth = 3; c.beginPath(); c.arc(4560, 204, 14 + ph * 36, 0, 7); c.stroke(); this.label(4560, 160, 'FRIDAY 4:47 P.M. THE CALL', '#ff7a59'); }
    this.label(X + 200, 108, 'SHELF', '#6f7d7d');
  }
  marker() {
    const c = this.ctx, m = this.markerPos(), col = this.back ? '#ff7a59' : '#4dccc7', glow = this.back ? 'rgba(255,122,89,A)' : 'rgba(77,204,199,A)';
    if (m.moving && this.u < 4.7) this.truck(Math.min(m.x, 4280) + 24, Math.min(m.y + 38, LANE[this.story.dist].y + 12 + (this.u > 3.9 ? 0 : 0)), 1, 1, { col: '#33504f', cab: '#2a4443', cargo: false });
    const y = m.y - 18 + (m.moving ? 0 : Math.sin(this.t * 3) * 2);
    this.glow(m.x, y, 46, glow, .55); this.rr(m.x - 12, y - 9, 24, 18, 3, col); this.rr(m.x - 6, y - 5, 10, 10, 1, '#06201f'); c.fillStyle = col; c.fillRect(m.x + 2, y - 3, 3, 3);
    this.label(m.x, y - 22, this.story.code, col);
  }
  effects() {
    const c = this.ctx;
    this.fx.forEach(f => { const a = (this.t - f.t0) / 1.4, r = 10 + a * 40; c.strokeStyle = `rgba(77,204,199,${1 - a})`; c.lineWidth = 2; c.beginPath(); c.arc(f.x, f.y, r, 0, 7); c.stroke(); c.fillStyle = `rgba(77,204,199,${1 - a})`; c.font = '600 11px "JetBrains Mono",monospace'; c.textAlign = 'center'; c.fillText('scanned', f.x, f.y - 18 - a * 26); });
  }
}
