/* Biologics Atlas: in-depth spine figures.
   One schematic per spine application, drawn procedurally so every figure shares the same anatomy, hardware and graft language.
   Green = where the biologic goes. Grey = hardware. Bone is warm, discs are muted purple. Inline SVG, no external assets. */
const SPINEFIG = (() => {
  const BONE = '#e6dfd0', BONE_EDGE = '#b7ad9a', DISC = '#6b5f8a', DISC_EDGE = '#8a7db0', HW = '#9aa3b5', HW_EDGE = '#d2d8e4', GR = '#6fe3a3', INK = '#ece9f5', MUTED = '#a79fc0', RED = '#e0607a';
  const defs = `<defs><pattern id="sf-gr" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="${GR}" fill-opacity=".28"/><line x1="0" y1="0" x2="0" y2="6" stroke="${GR}" stroke-width="1.6" stroke-opacity=".9"/></pattern><marker id="sf-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${MUTED}"/></marker></defs>`;
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const wrap = (inner, w = 800, h = 340) => `<svg class="sf" viewBox="0 0 ${w} ${h}" role="img" aria-label="Schematic: where the biologic is placed" xmlns="http://www.w3.org/2000/svg">${defs}${inner}</svg>`;
  /* primitives */
  const bodyL = (x, y, w, h) => `<path d="M${x + 10},${y} h${w - 20} q10,0 10,10 v${h - 20} q0,10 -10,10 h${-(w - 20)} q-10,0 -10,-10 v${-(h - 20)} q0,-10 10,-10 z" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/>`;
  const postL = (x, y, h) => { const p = 22, y1 = y + h * 0.28, y2 = y + h * 0.72; return `<path d="M${x},${y1} h${p} l20,-10 h26 l10,10 v18 l-10,10 h-26 l-20,-10 h${-p} z" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/><path d="M${x + p + 20},${y1 - 10} l14,-16 h22 l-8,16 z" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/><path d="M${x + p + 20},${y2 + 10} l14,16 h22 l-8,-16 z" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/>`; };
  const discL = (x, y, w, h, degen) => `<rect x="${x + 4}" y="${y}" width="${w - 8}" height="${h}" rx="${h / 2}" fill="${degen ? '#4a4360' : DISC}" stroke="${DISC_EDGE}" stroke-width="1.5"${degen ? ' stroke-dasharray="4 3"' : ''}/>`;
  const graft = (d, extra = '') => `<path d="${d}" fill="url(#sf-gr)" stroke="${GR}" stroke-width="2" ${extra}/>`;
  const graftRect = (x, y, w, h, r = 4) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#sf-gr)" stroke="${GR}" stroke-width="2"/>`;
  const cage = (x, y, w, h, rot = 0) => `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="#2a2740" stroke="${HW_EDGE}" stroke-width="2.5"/><rect x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${h - 12}" rx="3" fill="url(#sf-gr)" stroke="${GR}" stroke-width="1.5"/>${[0.33, 0.66].map(k => `<line x1="${x + w * k}" y1="${y + 2}" x2="${x + w * k}" y2="${y + h - 2}" stroke="${HW_EDGE}" stroke-width="1.5" stroke-opacity=".7"/>`).join('')}</g>`;
  const screw = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${HW_EDGE}" stroke-width="7" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${HW}" stroke-width="4" stroke-linecap="round"/><circle cx="${x1}" cy="${y1}" r="6" fill="${HW}" stroke="${HW_EDGE}" stroke-width="2"/>`;
  const rod = pts => `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${HW_EDGE}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${HW}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
  const label = (x, y, text, anchor = 'start', dim) => `<text x="${x}" y="${y}" fill="${dim ? MUTED : INK}" font-size="12.5" font-family="IBM Plex Mono, ui-monospace, monospace" text-anchor="${anchor}">${esc(text)}</text>`;
  const lead = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${MUTED}" stroke-width="1" stroke-dasharray="3 3"/>`;
  const arrow = (x1, y1, x2, y2, text, anchor = 'start') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${MUTED}" stroke-width="2" marker-end="url(#sf-arr)"/>` + (text ? label(x1, y1 - 8, text, anchor, true) : '');
  const title = (t, sub) => label(14, 22, t) + (sub ? label(14, 40, sub, 'start', true) : '');
  const legend = (x, y) => `<rect x="${x}" y="${y - 10}" width="14" height="14" rx="3" fill="url(#sf-gr)" stroke="${GR}"/>${label(x + 20, y + 1, 'biologic', 'start', true)}<rect x="${x + 92}" y="${y - 10}" width="14" height="14" rx="3" fill="${HW}" stroke="${HW_EDGE}"/>${label(x + 112, y + 1, 'hardware', 'start', true)}<rect x="${x + 192}" y="${y - 10}" width="14" height="14" rx="3" fill="${BONE}" stroke="${BONE_EDGE}"/>${label(x + 212, y + 1, 'bone', 'start', true)}<rect x="${x + 258}" y="${y - 10}" width="14" height="14" rx="3" fill="${DISC}" stroke="${DISC_EDGE}"/>${label(x + 278, y + 1, 'disc', 'start', true)}`;

  /* a lateral lumbar motion segment: anterior to the left, posterior elements to the right */
  function lumbarLateral(opts) {
    const x = 150, w = 130, h = 92, y1 = 70, gap = 38, y2 = y1 + h + gap;
    let s = bodyL(x, y1, w, h) + bodyL(x, y2, w, h) + postL(x + w, y1, h) + postL(x + w, y2, h) + label(x + 10, y1 + h / 2 + 5, 'L4') + label(x + 10, y2 + h / 2 + 5, 'L5');
    if (!opts.noDisc) s += discL(x, y1 + h + 6, w, gap - 12, opts.degen);
    return { s, x, w, h, y1, y2, gap };
  }
  const figs = {};

  figs['lumbar-alif'] = () => {
    const g = lumbarLateral({ noDisc: true }); let s = g.s;
    s += cage(g.x + 14, g.y1 + g.h + 4, 100, 30) + arrow(40, g.y1 + g.h + 19, g.x - 8, g.y1 + g.h + 19, 'anterior approach');
    s += `<rect x="${g.x - 6}" y="${g.y1 + 40}" width="10" height="${g.h + g.gap + 12}" rx="3" fill="${HW}" stroke="${HW_EDGE}" stroke-width="1.5"/>` + screw(g.x - 1, g.y1 + 56, g.x + 40, g.y1 + 56) + screw(g.x - 1, g.y2 + 40, g.x + 40, g.y2 + 40);
    s += lead(g.x + 64, g.y1 + g.h + 19, 470, 120) + label(474, 118, 'cage packed with graft') + label(474, 134, 'rhBMP-2/ACS on label here (L2-S1, one level);', 'start', true) + label(474, 148, 'DBM, cellular allograft or ceramic otherwise', 'start', true);
    s += lead(g.x - 3, g.y1 + 60, 470, 200) + label(474, 198, 'anterior plate or stand-alone cage', 'start', true);
    return { svg: wrap(title('ALIF, lateral view', 'disc removed, interbody device fills the space') + s + legend(14, 326)), caption: 'The disc is cleared from the front and the cage carries the graft under compressive load, the best biology in the spine for fusion. The posterior elements are untouched unless fixation is added from behind.' };
  };
  figs['lumbar-tlif-plif'] = () => {
    const g = lumbarLateral({ noDisc: true }); let s = g.s;
    s += cage(g.x + 30, g.y1 + g.h + 5, 78, 28, -8) + graftRect(g.x + 14, g.y1 + g.h + 10, 18, 18, 6);
    s += screw(g.x + w0(g) + 26, g.y1 + 40, g.x + 40, g.y1 + 52) + screw(g.x + w0(g) + 26, g.y2 + 44, g.x + 40, g.y2 + 52) + rod([[g.x + w0(g) + 26, g.y1 + 40], [g.x + w0(g) + 26, g.y2 + 44]]);
    s += arrow(600, g.y1 + g.h + 19, g.x + w0(g) + 74, g.y1 + g.h + 19, 'posterior / transforaminal approach', 'end');
    s += lead(g.x + 70, g.y1 + g.h + 19, 470, 250) + label(474, 248, 'cage with graft inside and in front') + label(474, 264, 'Infuse TLIF label 2026; NTAP from Oct 2026', 'start', true);
    s += lead(g.x + w0(g) + 26, g.y1 + 40, 474, 70) + label(478, 68, 'pedicle screws and rod', 'start', true);
    return { svg: wrap(title('TLIF / PLIF, lateral view', 'posterior access, interbody cage plus pedicle screw fixation') + s + legend(14, 326)), caption: 'The surgeon reaches the disc from behind, through the foramen (TLIF) or beside the dura (PLIF). Graft goes inside the cage and into the anterior disc space; many surgeons also lay graft over the posterolateral gutters for a second fusion bed.' };
  };
  function w0(g) { return g.w; }
  figs['lumbar-lateral'] = () => {
    const x = 210, w = 180, h = 78, y1 = 82, gap = 40, y2 = y1 + h + gap; let s = '';
    s += `<path d="M${x},${y1} h${w} v${h} h${-w} z" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2" rx="10"/>`.replace('z"', 'z" rx="10"');
    s = bodyL(x, y1, w, h) + bodyL(x, y2, w, h) + `<rect x="${x - 26}" y="${y1 + 20}" width="26" height="30" rx="6" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/><rect x="${x + w}" y="${y1 + 20}" width="26" height="30" rx="6" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/><rect x="${x - 26}" y="${y2 + 20}" width="26" height="30" rx="6" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/><rect x="${x + w}" y="${y2 + 20}" width="26" height="30" rx="6" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/>`;
    s += cage(x + 14, y1 + h + 6, w - 28, 28) + label(x + w / 2, y1 + h / 2 + 5, 'L3', 'middle') + label(x + w / 2, y2 + h / 2 + 5, 'L4', 'middle');
    s += arrow(40, y1 + h + 20, x - 40, y1 + h + 20, 'lateral (transpsoas) approach');
    s += lead(x + w - 20, y1 + h + 20, 480, 120) + label(484, 118, 'wide cage rests on the apophyseal ring') + label(484, 134, 'large graft volume: ceramic, DBM,', 'start', true) + label(484, 148, 'cellular allograft; rhBMP-2 is off label', 'start', true);
    return { svg: wrap(title('Lateral interbody fusion, coronal view', 'LLIF / XLIF / OLIF: the widest cage footprint of any approach') + s + legend(14, 326)), caption: 'Entering from the flank lets a wide cage sit on the strong ring of cortical bone at the edge of the vertebra. The cage holds more graft than a TLIF cage, which is why synthetics and allografts dominate here and why any BMP use is off label.' };
  };
  figs['lumbar-plf'] = () => {
    /* posterior view: two levels, transverse processes to each side, graft beds laid over them */
    const cx = 320, y1 = 70, y2 = 190, s0 = (y) => `<path d="M${cx - 34},${y} h68 v70 h-68 z" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/><path d="M${cx - 12},${y + 8} h24 l6,54 h-36 z" fill="${BONE_EDGE}" fill-opacity=".5" stroke="${BONE_EDGE}" stroke-width="1.5"/><rect x="${cx - 120}" y="${y + 24}" width="86" height="22" rx="8" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/><rect x="${cx + 34}" y="${y + 24}" width="86" height="22" rx="8" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/>`;
    let s = s0(y1) + s0(y2) + label(cx, y1 - 10, 'L4', 'middle') + label(cx, y2 + 92, 'L5', 'middle');
    s += graft(`M${cx - 118},${y1 + 46} h80 l6,76 h-92 z`) + graft(`M${cx + 36},${y1 + 46} h80 l6,76 h-92 z`);
    s += screw(cx - 60, y1 + 36, cx - 60, y1 + 60) + screw(cx + 60, y1 + 36, cx + 60, y1 + 60) + screw(cx - 60, y2 + 36, cx - 60, y2 + 60) + screw(cx + 60, y2 + 36, cx + 60, y2 + 60) + rod([[cx - 60, y1 + 36], [cx - 60, y2 + 36]]) + rod([[cx + 60, y1 + 36], [cx + 60, y2 + 36]]);
    s += lead(cx + 110, y1 + 80, 520, 100) + label(524, 98, 'posterolateral gutter') + label(524, 114, 'graft over decorticated', 'start', true) + label(524, 128, 'transverse processes', 'start', true);
    s += lead(cx - 60, y1 + 36, 110, 60) + label(14, 58, 'pedicle screws, rods', 'start', true);
    return { svg: wrap(title('Posterolateral fusion, viewed from behind', 'graft bridges the transverse processes outside the canal') + s + legend(14, 326)), caption: 'No cage here. The fusion bed is the bare bone of the transverse processes on each side, with graft piled across the gap and held by the screw-rod construct. It is the largest-volume graft bed in spine, the historic home of DBM and the Infuse off-label controversy.' };
  };
  figs['adult-deformity'] = () => {
    const cx = 300, top = 48, n = 6, hh = 34, gap = 10; let s = '';
    for (let i = 0; i < n; i++) { const y = top + i * (hh + gap); const dx = Math.sin(i / (n - 1) * Math.PI) * 26; s += `<path d="M${cx - 30 + dx},${y} h60 v${hh} h-60 z" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/><rect x="${cx - 96 + dx}" y="${y + 10}" width="66" height="14" rx="6" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="1.5"/><rect x="${cx + 30 + dx}" y="${y + 10}" width="66" height="14" rx="6" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="1.5"/>`; if (i < n - 1) s += graftRect(cx - 94 + dx, y + 24, 60, gap + 10, 5) + graftRect(cx + 34 + dx, y + 24, 60, gap + 10, 5); }
    const sacY = top + n * (hh + gap) + 2; s += `<path d="M${cx - 70},${sacY} h140 l-30,54 h-80 z" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/><path d="M${cx - 150},${sacY - 10} q60,-30 80,20 l-20,60 q-60,-10 -60,-80 z" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/><path d="M${cx + 150},${sacY - 10} q-60,-30 -80,20 l20,60 q60,-10 60,-80 z" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/>`;
    const pts = [], ptsR = []; for (let i = 0; i < n; i++) { const y = top + i * (hh + gap) + 17; const dx = Math.sin(i / (n - 1) * Math.PI) * 26; pts.push([cx - 62 + dx, y]); ptsR.push([cx + 62 + dx, y]); s += screw(cx - 62 + dx, y, cx - 40 + dx, y) + screw(cx + 62 + dx, y, cx + 40 + dx, y); }
    pts.push([cx - 110, sacY + 30]); ptsR.push([cx + 110, sacY + 30]); s += rod(pts) + rod(ptsR) + screw(cx - 110, sacY + 30, cx - 70, sacY + 36) + screw(cx + 110, sacY + 30, cx + 70, sacY + 36);
    s += lead(cx + 100, top + 60, 470, 90) + label(474, 88, 'graft at every level, both gutters') + label(474, 104, 'largest graft volume in orthopaedics;', 'start', true) + label(474, 118, 'allograft, DBM, ceramic, BMP to volume', 'start', true);
    s += lead(cx + 112, sacY + 30, 474, 250) + label(478, 248, 'iliac or S2AI screws', 'start', true) + label(478, 264, 'L5-S1 junction: highest nonunion risk', 'start', true);
    return { svg: wrap(title('Long-segment deformity fusion, posterior view', 'thoracolumbar curve corrected and fused to the pelvis') + s + legend(14, 372), 800, 386), caption: 'A curve straightened with rods needs bone across every level to hold. Surgeons mix autograft from the decortication with extenders to reach the volume; the L5-S1 junction fails most and often gets an interbody cage and the strongest biologic in the case.' };
  };
  figs['cervical-acdf'] = () => {
    const x = 190, w = 92, h = 58, y1 = 86, gap = 30, y2 = y1 + h + gap; let s = bodyL(x, y1, w, h) + bodyL(x, y2, w, h) + postL(x + w, y1, h) + postL(x + w, y2, h) + label(x + 10, y1 + h / 2 + 5, 'C5') + label(x + 10, y2 + h / 2 + 5, 'C6');
    s += `<rect x="${x + 12}" y="${y1 + h + 3}" width="${w - 24}" height="${gap - 6}" rx="4" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/>` + graftRect(x + 22, y1 + h + 7, w - 44, gap - 14, 3);
    s += `<rect x="${x - 8}" y="${y1 + 24}" width="10" height="${h + gap + 12}" rx="3" fill="${HW}" stroke="${HW_EDGE}" stroke-width="1.5"/>` + screw(x - 3, y1 + 38, x + 36, y1 + 40) + screw(x - 3, y2 + 26, x + 36, y2 + 28);
    s += arrow(50, y1 + h + 15, x - 16, y1 + h + 15, 'anterior approach');
    s += lead(x + 46, y1 + h + 15, 430, 120) + label(434, 118, 'structural allograft or PEEK cage') + label(434, 134, 'packed with DBM or local bone;', 'start', true) + label(434, 148, 'rhBMP-2 carries an FDA warning in the neck', 'start', true);
    s += lead(x - 3, y1 + 36, 434, 200) + label(438, 198, 'anterior plate', 'start', true);
    return { svg: wrap(title('ACDF, lateral view', 'disc out, structural spacer in, plate across the front') + s + legend(14, 326)), caption: 'The spacer itself is often the biologic: a machined cortical allograft block. Cages take a small packing of DBM or local bone. Growth factors are rare here because of the 2008 FDA notice on airway swelling after anterior cervical BMP use.' };
  };
  figs['cervical-pcf'] = () => {
    const cx = 320, top = 60, n = 3, hh = 48, gap = 12; let s = '';
    for (let i = 0; i < n; i++) { const y = top + i * (hh + gap); s += `<path d="M${cx - 30},${y} h60 v${hh} h-60 z" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/><path d="M${cx - 10},${y + 6} h20 l4,36 h-28 z" fill="${BONE_EDGE}" fill-opacity=".5" stroke="${BONE_EDGE}" stroke-width="1.5"/><rect x="${cx - 86}" y="${y + 8}" width="54" height="34" rx="7" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/><rect x="${cx + 32}" y="${y + 8}" width="54" height="34" rx="7" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/>`; if (i < n - 1) s += graftRect(cx - 84, y + 40, 50, gap + 10, 5) + graftRect(cx + 34, y + 40, 50, gap + 10, 5); }
    for (let i = 0; i < n; i++) { const y = top + i * (hh + gap) + 25; s += screw(cx - 59, y, cx - 40, y - 6) + screw(cx + 59, y, cx + 40, y - 6); }
    s += rod([[cx - 59, top + 25], [cx - 59, top + 2 * (hh + gap) + 25]]) + rod([[cx + 59, top + 25], [cx + 59, top + 2 * (hh + gap) + 25]]);
    s += lead(cx + 86, top + 60, 480, 100) + label(484, 98, 'graft over decorticated') + label(484, 114, 'lateral masses and facets', 'start', true) + label(484, 128, 'local bone, allograft, DBM', 'start', true);
    s += lead(cx - 59, top + 25, 120, 60) + label(14, 58, 'lateral mass screws', 'start', true);
    return { svg: wrap(title('Posterior cervical fusion, viewed from behind', 'lateral mass screws and rods, graft laid on the facets') + s + legend(14, 326)), caption: 'The fusion bed is the back of the lateral masses after the facet joints are roughened. Volume is small and the bed is well vascularised, so local bone with a DBM or allograft extender is the norm; cellular allografts are marketed here, growth factors are not.' };
  };
  figs['si-joint-fusion'] = () => {
    const cx = 250, top = 60; let s = `<path d="M${cx - 60},${top} h120 l-26,150 h-68 z" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/>`;
    s += `<path d="M${cx - 70},${top - 6} q-110,-20 -140,70 q-10,80 60,140 l40,-50 q-14,-60 20,-100 z" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/><path d="M${cx + 70},${top - 6} q110,-20 140,70 q10,80 -60,140 l-40,-50 q14,-60 -20,-100 z" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/>`;
    s += `<path d="M${cx - 64},${top + 10} q-18,60 -4,120" fill="none" stroke="${DISC_EDGE}" stroke-width="5" stroke-opacity=".8"/><path d="M${cx + 64},${top + 10} q18,60 4,120" fill="none" stroke="${DISC_EDGE}" stroke-width="5" stroke-opacity=".8"/>`;
    s += `<g transform="rotate(-12 ${cx + 90} ${top + 70})"><rect x="${cx + 20}" y="${top + 60}" width="150" height="16" rx="3" fill="${HW}" stroke="${HW_EDGE}" stroke-width="2"/><path d="M${cx + 24},${top + 60} l-10,8 l10,8" fill="${HW_EDGE}"/></g>`;
    s += graft(`M${cx + 56},${top + 44} q16,34 10,70 q-14,-30 -4,-70 z`) + graft(`M${cx - 76},${top + 90} q-6,30 4,50 q10,-22 4,-50 z`);
    s += arrow(640, top + 30, cx + 176, top + 44, 'lateral approach (iliac side)', 'end');
    s += lead(cx + 60, top + 80, 466, 190) + label(470, 188, 'graft in the joint and round the implant') + label(470, 204, 'triangular or threaded titanium implant;', 'start', true) + label(470, 218, 'or a posterior allograft dowel', 'start', true);
    s += lead(cx - 72, top + 110, 120, 336) + label(14, 350, 'posterior approach: allograft', 'start', true) + label(14, 364, 'bone dowel across the joint line', 'start', true);
    return { svg: wrap(title('Sacroiliac joint fusion, posterior view', 'sacrum between the two ilia; the joint line runs down each side') + s + legend(380, 364), 800, 386), caption: 'Two schools. The lateral approach drives a titanium implant through the ilium across the joint, with graft in and around it. The posterior approach places an allograft dowel or wedge into the joint line itself, so the biologic is the implant. Both hinge on the joint being the pain source.' };
  };
  figs['vcf-augmentation'] = () => {
    const x = 190, w = 120, h = 70, y1 = 56, gap = 22; const y2 = y1 + h + gap, y3 = y2 + 52 + gap; let s = bodyL(x, y1, w, h) + postL(x + w, y1, h);
    /* the middle body is wedged: anterior height lost */
    s += `<path d="M${x + 8},${y2 + 18} q10,-10 20,-8 h${w - 36} q10,0 10,10 v32 q0,10 -10,10 h${-(w - 20)} q-10,0 -10,-10 z" fill="${BONE}" stroke="${BONE_EDGE}" stroke-width="2"/>` + postL(x + w, y2 - 8, h);
    s += `<path d="M${x + 24},${y2 + 16} l14,18 l-10,12" fill="none" stroke="${RED}" stroke-width="2"/><path d="M${x + 60},${y2 + 12} l-6,20 l10,10" fill="none" stroke="${RED}" stroke-width="2"/>`;
    s += bodyL(x, y3, w, h) + postL(x + w, y3, h) + discL(x, y1 + h + 5, w, gap - 10) + discL(x, y2 + 52 + 5, w, gap - 10);
    s += `<ellipse cx="${x + 64}" cy="${y2 + 36}" rx="34" ry="14" fill="url(#sf-gr)" stroke="${GR}" stroke-width="2"/>`;
    s += `<path d="M${x + w + 70},${y2 + 10} l-70,22" stroke="${HW_EDGE}" stroke-width="5" stroke-linecap="round"/><path d="M${x + w + 70},${y2 + 10} l-70,22" stroke="${HW}" stroke-width="3" stroke-linecap="round"/>`;
    s += label(x + 10, y1 + h / 2 + 5, 'T12') + label(x + 10, y3 + h / 2 + 5, 'L2') + label(x + w + 4, y2 + 8, 'L1', 'start');
    s += lead(x + 96, y2 + 36, 470, 120) + label(474, 118, 'cavity filled through the pedicle') + label(474, 134, 'PMMA is the standard; resorbable or', 'start', true) + label(474, 148, 'bioactive fills are the biologic contenders', 'start', true);
    s += lead(x + 40, y2 + 22, 470, 220) + label(474, 218, 'wedge compression, anterior', 'start', true) + label(474, 234, 'height lost (AO A1 pattern)', 'start', true);
    return { svg: wrap(title('Vertebral compression fracture, lateral view', 'osteoporotic wedge at the thoracolumbar junction, augmented through the pedicle') + s + legend(14, 326)), caption: 'The anterior column has crushed. A cannula through the pedicle creates or finds a cavity inside the body and fills it. The question for a biologic is whether a resorbable or bioactive fill can match the immediate stability of PMMA cement; so far the market says cement.' };
  };
  figs['ddd-intradiscal'] = () => {
    const g = lumbarLateral({ degen: true }); let s = g.s;
    s += `<ellipse cx="${g.x + g.w / 2}" cy="${g.y1 + g.h + g.gap / 2 - 1}" rx="20" ry="7" fill="url(#sf-gr)" stroke="${GR}" stroke-width="2"/>`;
    s += `<path d="M${g.x + g.w + 150},${g.y1 + g.h + 70} L${g.x + g.w / 2 + 18},${g.y1 + g.h + g.gap / 2 + 2}" stroke="${HW_EDGE}" stroke-width="5" stroke-linecap="round"/><path d="M${g.x + g.w + 150},${g.y1 + g.h + 70} L${g.x + g.w / 2 + 18},${g.y1 + g.h + g.gap / 2 + 2}" stroke="${HW}" stroke-width="3" stroke-linecap="round"/>`;
    s += lead(g.x + g.w / 2, g.y1 + g.h + g.gap / 2, 470, 110) + label(474, 108, 'injectate into the nucleus') + label(474, 124, 'cell therapies, growth factors, PRP;', 'start', true) + label(474, 138, 'nothing is FDA approved for this', 'start', true);
    s += lead(g.x + g.w + 100, g.y1 + g.h + 56, 474, 220) + label(478, 218, 'posterolateral needle, image guided', 'start', true);
    return { svg: wrap(title('Intradiscal injection, lateral view', 'degenerate disc, needle through the posterolateral window') + s + legend(14, 326)), caption: 'No fusion, no hardware. A needle places the biologic inside the disc nucleus. Every product here is investigational in the US; the atlas lists them because the trials are the pipeline that decides whether this becomes an indication at all.' };
  };
  return { has: id => !!figs[id], render: id => figs[id] ? figs[id]() : null };
})();
