(function () {
'use strict';
const D = JSON.parse(document.getElementById('atlas-data').textContent);
const APPS = D.applications, PRODS = D.products, BD = D.bd || {}, META = D.meta || {};
const MARKET = D.market || {}; const MK_SHARES = MARKET.shares || [], MK_PC = MARKET.product_company || {}, MK_CO = {}; (MARKET.companies || []).forEach(c => { MK_CO[c.id] = c; });
const MK_LEADERS = {}; { const CONF = { high: 0, medium: 1, low: 2 }; MK_SHARES.forEach(s => { (MK_LEADERS[s.application_id] = MK_LEADERS[s.application_id] || []).push(s); }); Object.keys(MK_LEADERS).forEach(k => { const seen = new Set(); MK_LEADERS[k] = MK_LEADERS[k].sort((u, v) => ((u.rank || 99) - (v.rank || 99)) || ((CONF[u.confidence] ?? 3) - (CONF[v.confidence] ?? 3)) || ((v.share_pct || 0) - (u.share_pct || 0))).filter(s => { const id = s.product_id || s.product_name; if (seen.has(id)) return false; seen.add(id); return true; }); }); }
const TIER_LABEL = { large: 'Large cap', mid: 'Mid cap', small: 'Small cap', private: 'Private', nonprofit: 'Nonprofit', subsidiary: 'Subsidiary', multiple: 'Many vendors', unknown: '' };
function tierBadge(pid) { const t = (MK_PC[pid] || {}).tier; return t && TIER_LABEL[t] ? `<span class="badge tier ${esc(t)}" title="Company size tier from research/market/companies.json">${TIER_LABEL[t]}</span>` : ''; }
function shareFor(pid, aid) { return MK_SHARES.find(s => s.product_id === pid && (s.application_id === aid)) || null; }
function shareBadge(pid, aid) { const s = shareFor(pid, aid); if (!s) return ''; const n = s.share_pct != null ? `${s.share_pct}% share` : (s.rank ? `#${s.rank} by share` : ''); return n ? `<span class="badge share" title="${esc(s.quote || s.note || '')}">${esc(n)}${s.year ? ' · ' + esc(s.year) : ''}</span>` : ''; }
function marketStrip(aid) { const rows = (MK_LEADERS[aid] || []).slice(0, 5); if (!rows.length) return ''; return `<div class="mkt"><div class="h">Who sells the most here</div>${rows.map(s => `<div class="row"><strong>${esc(s.product_name || s.product_id || '')}</strong><span class="muted">${esc(s.company || '')}</span>${s.cap_tier && TIER_LABEL[s.cap_tier] ? `<span class="badge tier ${esc(s.cap_tier)}">${TIER_LABEL[s.cap_tier]}</span>` : ''}<span class="pct">${s.share_pct != null ? esc(s.share_pct) + '%' : (s.rank ? '#' + esc(s.rank) : '')}${s.year ? ((s.share_pct != null || s.rank) ? ' · ' : '') + esc(s.year) : ''}</span>${s.evidence_grade ? `<span class="grade g${esc(s.evidence_grade)}" title="Evidence grade for this product in this application">${esc(s.evidence_grade)}</span>` : ''}<span class="conf">${esc(s.confidence || '')}</span>${s.source && /^https?:/.test(s.source) ? `<a class="small" href="${esc(s.source)}" target="_blank" rel="noopener">source</a>` : ''}</div>`).join('')}</div>`; }
const REGION = {
  'skull-cmf': { label: 'Skull and face', short: 'Skull' },
  'spine': { label: 'Spine', short: 'Spine' },
  'shoulder-humerus': { label: 'Shoulder and humerus', short: 'Shoulder' },
  'forearm-wrist-hand': { label: 'Forearm, wrist and hand', short: 'Forearm' },
  'pelvis-hip': { label: 'Pelvis and hip', short: 'Hip' },
  'femur-knee': { label: 'Femur and knee', short: 'Femur' },
  'tibia': { label: 'Tibia and knee', short: 'Tibia' },
  'ankle-foot': { label: 'Ankle and foot', short: 'Foot' },
  'general': { label: 'Any long bone', short: 'Any bone' }
};
const ORDER = ['skull-cmf', 'spine', 'shoulder-humerus', 'forearm-wrist-hand', 'pelvis-hip', 'femur-knee', 'tibia', 'ankle-foot', 'general'];
const SUB_ORDER = { spine: ['cervical', 'thoracolumbar', 'lumbar', 'sacroiliac'], 'skull-cmf': ['cranium', 'midface-orbit', 'mandible', 'dental-alveolar'] };
const TIERS = [['established', 'Established', 'est'], ['emerging', 'Emerging', 'emg'], ['investigational', 'Investigational', 'inv']];
const GRADE_RANK = { I: 1, II: 2, III: 3, IV: 4, V: 5 };
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const appById = {}, prodById = {}, pairsByApp = {}, appsByRegion = {};
APPS.forEach(a => { appById[a.id] = a; (appsByRegion[a.region] = appsByRegion[a.region] || []).push(a); });
PRODS.forEach(p => { prodById[p.id] = p; (p.applications || []).forEach(x => { if (appById[x.application_id]) (pairsByApp[x.application_id] = pairsByApp[x.application_id] || []).push({ p, x }); }); });

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const title = s => String(s || '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const gradeOf = x => GRADE_RANK[x.evidence_grade] || 6;
function refLink(ref) {
  ref = String(ref || ''); let m;
  if ((m = ref.match(/^PMID:?\s*(\d+)/i))) return { label: 'PMID ' + m[1], href: 'https://pubmed.ncbi.nlm.nih.gov/' + m[1] + '/' };
  if ((m = ref.match(/(NCT\d{8})/))) return { label: m[1], href: 'https://clinicaltrials.gov/study/' + m[1] };
  if ((m = ref.match(/^PMC(\d+)/i))) return { label: 'PMC' + m[1], href: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC' + m[1] + '/' };
  if ((m = ref.match(/^DOI:?\s*(.+)/i))) return { label: 'DOI', href: 'https://doi.org/' + m[1].trim() };
  if (/^10\.\d+\//.test(ref)) return { label: 'DOI', href: 'https://doi.org/' + ref };
  if ((m = ref.match(/EudraCT:?\s*([\d-]+)/i))) return { label: 'EudraCT ' + m[1], href: 'https://www.clinicaltrialsregister.eu/ctr-search/search?query=' + m[1] };
  if (/^https?:/.test(ref)) { try { return { label: new URL(ref).hostname.replace(/^www\./, ''), href: ref }; } catch (e) { return { label: 'source', href: ref }; } }
  return { label: ref.slice(0, 28), href: null };
}
const refChip = r => { const l = refLink(r); return l.href ? `<a class="ref" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>` : `<span class="ref">${esc(l.label)}</span>`; };
const shortRef = s => { s = String(s || ''); const m = s.match(/\b(P\d{6}(?:\/S\d{3})?|K\d{6}|DEN\d{6}|H\d{6}|BK\d{6}|BLA\s?\d+)\b/); return m ? m[1] : s.split(/[;(]/)[0].trim().slice(0, 40); };
const regLabel = p => { const r = p.regulatory || {}; const path = { 'PMA': 'PMA', '510k': '510(k)', '361-HCTP': '361 HCT/P', 'HDE': 'HDE', 'De-Novo': 'De Novo', 'BLA': 'BLA', 'NDA': 'NDA', 'IND-only': 'IND', 'IDE-only': 'IDE', 'none-unapproved': 'Unapproved' }[r.path] || r.path || '—'; const ref = shortRef(r.reference); return ref && ref !== path ? `${path} · ${ref}` : path; };
const statusBadge = p => p.status === 'withdrawn' ? '<span class="badge off">Withdrawn</span>' : p.status === 'off-market' ? '<span class="badge off">Off market</span>' : '';

/* ---------- state and routing ---------- */
const state = { region: null, app: null };
function parseHash() {
  const h = location.hash.replace(/^#/, ''); const k = h.slice(0, 1), id = h.slice(2); if (h.slice(1, 2) !== '-' && h) return { region: null, app: null, product: null };
  if (k === 'r' && REGION[id]) return { region: id, app: null, product: null };
  if (k === 'a' && appById[id]) return { region: appById[id].region, app: id, product: null };
  if (k === 'p' && prodById[id]) return { region: null, app: null, product: id };
  return { region: null, app: null, product: null };
}
let wantScroll = false;
function go(hash, opts) { wantScroll = !!(opts && opts.scroll); if (location.hash === '#' + hash) route(); else location.hash = hash; }
function route() {
  const r = parseHash(); state.region = r.region; state.app = r.app;
  if (r.product) { render(); openProduct(r.product); return; }
  render();
}
window.addEventListener('hashchange', route);
function scrollToPanel() { if (window.innerWidth < 900) document.getElementById('panel').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }

/* ---------- skeleton: hits, zoom, pan ---------- */
const svg = document.getElementById('skel'), wrap = document.getElementById('skel-wrap'), tip = document.getElementById('skel-tip');
const HOME = { x: 0, y: 0, w: 440, h: 950 }; const ASPECT = HOME.w / HOME.h;
let vb = Object.assign({}, HOME), animId = null;
function setVB(v) { vb = v; svg.setAttribute('viewBox', `${v.x} ${v.y} ${v.w} ${v.h}`); }
function animateTo(t, ms) {
  if (animId) cancelAnimationFrame(animId);
  if (reduced || ms === 0) { setVB(t); return; }
  const from = Object.assign({}, vb), t0 = performance.now(); ms = ms || 680;
  const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  const step = now => { const k = Math.min(1, (now - t0) / ms), e = ease(k); setVB({ x: from.x + (t.x - from.x) * e, y: from.y + (t.y - from.y) * e, w: from.w + (t.w - from.w) * e, h: from.h + (t.h - from.h) * e }); if (k < 1) animId = requestAnimationFrame(step); else animId = null; };
  animId = requestAnimationFrame(step);
}
function fitBox(b, padFrac) {
  const pad = padFrac == null ? .18 : padFrac; let w = b.w * (1 + pad * 2), h = b.h * (1 + pad * 2);
  if (w < 150) w = 150; if (h < 150) h = 150;
  if (w / h > ASPECT) h = w / ASPECT; else w = h * ASPECT;
  const cx = b.x + b.w / 2, cy = b.y + b.h / 2; return { x: cx - w / 2, y: cy - h / 2, w, h };
}
function regionBox(region, sub) {
  const hits = [...svg.querySelectorAll('.hit')].filter(h => h.dataset.region === region && (!sub || h.dataset.sub === sub));
  if (!hits.length) return null; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  hits.forEach(h => { const b = h.getBBox(); x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height); });
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}
const is3d = () => window.ATLAS3D && window.ATLAS3D.ready && !wrap.classList.contains('flat');
function focusRegion(region, sub) {
  if (window.ATLAS3D && (window.ATLAS3D.ready || !window.ATLAS3D.failed) && !wrap.classList.contains('flat')) { window.ATLAS3D.focus(region, sub); if (window.ATLAS3D.ready) { svg.querySelectorAll('.hit').forEach(h => h.classList.toggle('active', !!region && h.dataset.region === region && (!sub || !h.dataset.sub || h.dataset.sub === sub))); return; } }
  svg.querySelectorAll('.hit').forEach(h => h.classList.toggle('active', !!region && h.dataset.region === region && (!sub || !h.dataset.sub || h.dataset.sub === sub)));
  if (!region) { animateTo(HOME); return; }
  const b = regionBox(region, sub) || regionBox(region); if (b) animateTo(fitBox(b));
}
svg.querySelectorAll('.hit').forEach(h => {
  h.addEventListener('mouseenter', () => { const r = h.dataset.region; svg.querySelectorAll('.hit').forEach(o => o.classList.toggle('hover', o.dataset.region === r)); const n = (appsByRegion[r] || []).length; tip.innerHTML = `<b>${esc(REGION[r] ? REGION[r].label : r)}</b>${h.dataset.sub ? ' · ' + esc(title(h.dataset.sub)) : ''} · ${n} application${n === 1 ? '' : 's'}`; });
  h.addEventListener('mouseleave', () => { svg.querySelectorAll('.hit').forEach(o => o.classList.remove('hover')); tip.textContent = state.region ? 'Scroll to zoom · drag to pan · Zoom out to reset' : 'Hover a region · click to focus · scroll to zoom · drag to pan'; });
  h.addEventListener('click', e => { if (dragMoved) return; const r = h.dataset.region; const sub = h.dataset.sub; pendingSub = sub || null; go('r-' + r, { scroll: true }); if (sub) focusRegion(r, sub); });
  h.setAttribute('tabindex', '0'); h.setAttribute('role', 'button'); h.setAttribute('aria-label', (REGION[h.dataset.region] || {}).label || h.dataset.region);
  h.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); h.dispatchEvent(new MouseEvent('click')); } });
});
let pendingSub = null;
function svgPoint(evt) { const pt = new DOMPoint(evt.clientX, evt.clientY); return pt.matrixTransform(svg.getScreenCTM().inverse()); }
wrap.addEventListener('wheel', e => { if (is3d()) return; e.preventDefault(); const p = svgPoint(e); const f = Math.exp(e.deltaY * 0.0016); let w = Math.min(HOME.w * 1.1, Math.max(70, vb.w * f)); const h = w / ASPECT; const kx = (p.x - vb.x) / vb.w, ky = (p.y - vb.y) / vb.h; if (animId) { cancelAnimationFrame(animId); animId = null; } setVB({ x: p.x - kx * w, y: p.y - ky * h, w, h }); }, { passive: false });
let drag = null, dragMoved = false;
wrap.addEventListener('pointerdown', e => { if (e.button !== 0 || is3d()) return; drag = { x: e.clientX, y: e.clientY, vb: Object.assign({}, vb) }; dragMoved = false; window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', endDrag, { once: true }); window.addEventListener('pointercancel', endDrag, { once: true }); });
function onMove(e) { if (!drag) return; const rect = wrap.getBoundingClientRect(); const dx = (e.clientX - drag.x) * vb.w / rect.width, dy = (e.clientY - drag.y) * vb.h / rect.height; if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 5) { dragMoved = true; wrap.classList.add('dragging'); } if (dragMoved) { if (animId) { cancelAnimationFrame(animId); animId = null; } setVB({ x: drag.vb.x - dx, y: drag.vb.y - dy, w: vb.w, h: vb.h }); } }
function endDrag() { drag = null; wrap.classList.remove('dragging'); window.removeEventListener('pointermove', onMove); setTimeout(() => { dragMoved = false; }, 0); }
document.getElementById('zoom-out').addEventListener('click', () => { if (state.region) go('r-' + state.region); focusRegion(state.region || null); if (!state.region) { animateTo(HOME); if (window.ATLAS3D && window.ATLAS3D.ready) window.ATLAS3D.reset(); } });
const flatBtn = document.getElementById('flat-toggle');
flatBtn.addEventListener('click', () => { const flat = wrap.classList.toggle('flat'); flatBtn.textContent = flat ? '3D view' : 'Flat view'; focusRegion(state.region || null, pendingSub); });
(function watch3d() { if (window.ATLAS3D && window.ATLAS3D.ready) { flatBtn.hidden = false; const c = document.getElementById('skel-credit'); if (c) c.hidden = false; return; } if (window.ATLAS3D && window.ATLAS3D.failed) return; setTimeout(watch3d, 400); })();

/* ---------- region chips ---------- */
const chipsEl = document.getElementById('region-chips');
chipsEl.innerHTML = ORDER.map(r => `<button class="rchip" type="button" data-r="${r}">${esc(REGION[r].short)}<small>${(appsByRegion[r] || []).length}</small></button>`).join('');
chipsEl.addEventListener('click', e => { const b = e.target.closest('.rchip'); if (b) go('r-' + b.dataset.r, { scroll: true }); });

/* ---------- panel ---------- */
const panel = document.getElementById('panel'), stageLabel = document.getElementById('stage-label');
const crumbs = parts => `<div class="crumbs">` + parts.map((p, i) => (i ? '<span class="sep">›</span>' : '') + (p.hash ? `<button type="button" data-go="${esc(p.hash)}">${esc(p.label)}</button>` : `<span>${esc(p.label)}</span>`)).join('') + `</div>`;
const tierCounts = appId => { const c = { est: 0, emg: 0, inv: 0, g1: 0 }; (pairsByApp[appId] || []).forEach(({ x }) => { if (x.tier === 'established') c.est++; else if (x.tier === 'emerging') c.emg++; else c.inv++; if (x.evidence_grade === 'I') c.g1++; }); return c; };
const countPills = c => `${c.est ? `<span class="pill est">${c.est} established</span>` : ''}${c.emg ? `<span class="pill emg">${c.emg} emerging</span>` : ''}${c.inv ? `<span class="pill inv">${c.inv} investigational</span>` : ''}${!(c.est + c.emg + c.inv) ? '<span class="pill">no biologic standard</span>' : ''}`;

function render() {
  const r = state.region, a = state.app ? appById[state.app] : null;
  chipsEl.querySelectorAll('.rchip').forEach(b => b.classList.toggle('on', b.dataset.r === r));
  stageLabel.textContent = r ? REGION[r].label : 'Choose a region';
  if (!r) { panel.innerHTML = renderOverview(); focusRegion(null); }
  else if (!a) { panel.innerHTML = renderRegion(r); focusRegion(r, pendingSub); pendingSub = null; }
  else { panel.innerHTML = renderApp(a); focusRegion(r, a.region === 'spine' || a.region === 'skull-cmf' ? subHit(a) : null); }
  panel.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go, { scroll: true })));
  panel.querySelectorAll('[data-prod]').forEach(b => b.addEventListener('click', () => openProduct(b.dataset.prod)));
  panel.querySelectorAll('.rv').forEach(el => requestAnimationFrame(() => el.classList.add('in')));
  if (wantScroll) { wantScroll = false; scrollToPanel(); }
  if (!r) tip.textContent = 'Hover a region · click to focus · scroll to zoom · drag to pan';
}
function subHit(a) { const s = (a.subregion || '').toLowerCase(); if (a.region === 'spine') { if (s.startsWith('cerv')) return 'cervical'; if (s.startsWith('sacro')) return 'sacroiliac'; return 'thoracolumbar'; } if (a.region === 'skull-cmf') return s.startsWith('crani') ? 'cranium' : 'face'; return null; }

function renderOverview() {
  const rows = ORDER.map(r => { const apps = appsByRegion[r] || []; const prods = new Set(); let g1 = 0; apps.forEach(a => (pairsByApp[a.id] || []).forEach(({ p, x }) => { prods.add(p.id); if (x.evidence_grade === 'I') g1++; })); return `<button class="app-row" type="button" data-go="r-${r}"><div><div class="t">${esc(REGION[r].label)}</div><div class="d">${apps.length} application${apps.length === 1 ? '' : 's'} · ${prods.size} product${prods.size === 1 ? '' : 's'}${g1 ? ` · ${g1} Level I pairing${g1 === 1 ? '' : 's'}` : ' · no Level I evidence'}</div></div><div class="counts"><span class="pill">open</span></div></button>`; }).join('');
  return crumbs([{ label: 'Atlas' }]) + `
  <div class="card rv"><h3><span class="k">Start here</span>Click a region on the skeleton, or pick one below</h3>
    <p class="muted small">Each region lists its surgical applications. Each application shows the biologics used there in three tiers, with the FDA pathway, the strongest study and the evidence grade for that specific use. Products open in a detail view with every citation.</p>
    <div class="howto">
      <div class="card sub"><h4>Tiers</h4><p><span class="pill est">Established</span> long on the US market for that use · <span class="pill emg">Emerging</span> new in about three years or in a pivotal trial · <span class="pill inv">Investigational</span> not authorized for that use.</p></div>
      <div class="card sub"><h4>Evidence grade</h4><p><span class="grade gI">I</span> RCT or meta-analysis · <span class="grade gII">II</span> prospective comparative · <span class="grade gIII">III</span> retrospective comparative · <span class="grade gIV">IV</span> case series · <span class="grade gV">V</span> opinion or no data.</p></div>
      <div class="card sub"><h4>Badges</h4><p><span class="badge on">On label</span> the FDA indication covers this use · <span class="badge off">Off label</span> it does not · <span class="badge unv">Unverified</span> a field could not be confirmed from a primary source.</p></div>
    </div>
  </div>
  <div class="applist rv">${rows}</div>`;
}

function renderRegion(r) {
  const apps = (appsByRegion[r] || []).slice();
  const subs = SUB_ORDER[r] || [...new Set(apps.map(a => a.subregion || ''))];
  const groups = [];
  subs.forEach(s => { const g = apps.filter(a => matchSub(a, s, r)); if (g.length) groups.push([s, g]); });
  const rest = apps.filter(a => !groups.some(([, g]) => g.includes(a))); if (rest.length) groups.push(['other', rest]);
  const prods = new Set(); apps.forEach(a => (pairsByApp[a.id] || []).forEach(({ p }) => prods.add(p.id)));
  return crumbs([{ label: 'Atlas', hash: '' }, { label: REGION[r].label }]) + `
  <div class="card rv"><h3><span class="k">${esc(REGION[r].label)}</span>${apps.length} surgical application${apps.length === 1 ? '' : 's'} · ${prods.size} product${prods.size === 1 ? '' : 's'}</h3>
  <p class="muted small">${esc(regionBlurb(r))}</p></div>
  <div class="applist rv">${groups.map(([s, g]) => `<div class="subhead">${esc(s === 'other' ? 'Other' : title(s))}</div>` + g.map(a => { const c = tierCounts(a.id); return `<button class="app-row" type="button" data-go="a-${a.id}"><div><div class="t">${esc(a.name)}</div><div class="d"><span class="pill type">${esc(a.type)}</span>${c.g1 ? ` · ${c.g1} Level I` : ''}</div></div><div class="counts">${countPills(c)}</div></button>`; }).join('')).join('')}</div>`;
}
function matchSub(a, s, r) { const sub = (a.subregion || '').toLowerCase(); if (r === 'spine') { if (s === 'cervical') return sub.startsWith('cerv'); if (s === 'sacroiliac') return sub.startsWith('sacro'); if (s === 'lumbar') return sub === 'lumbar'; if (s === 'thoracolumbar') return sub.startsWith('thorac'); } return sub === s; }
function regionBlurb(r) {
  return {
    'skull-cmf': 'Cranial and craniomaxillofacial reconstruction. Custom implants are hardware; the biologics here are the calcium phosphate cements, bone substitutes and the one place a growth factor is labeled in the head: dental sinus and ridge augmentation.',
    'spine': 'Fusion is the market. Three products carry a PMA for spinal use, most everything else is a bone void filler used off-label, and the cellular allografts have never been tested in a comparative trial.',
    'shoulder-humerus': 'Most upper-extremity fractures are fixed with plates and no biologic. The exceptions are structural support in proximal humerus plating, nonunion, infection and glenoid bone loss.',
    'forearm-wrist-hand': 'Distal radius void fill is a market that modern fixation made unnecessary, and the trials say so. Scaphoid nonunion and forearm nonunion are where graft still matters.',
    'pelvis-hip': 'Hip fracture is a hardware market with no Level I biologic adjunct. The pharmacologic story is secondary prevention. The one biologic growth pocket is femoral head osteonecrosis.',
    'femur-knee': 'Femoral shaft fractures unite with reamed nailing. Biologics enter in nonunion, segmental defects and distal femur void fill, where the autograft benchmark is reamer-irrigator-aspirator bone.',
    'tibia': 'Tibial plateau void fill is the one trauma application with product-versus-autograft randomized evidence. Open tibia is the original rhBMP-2 trauma label. Infection dead space is the growth franchise.',
    'ankle-foot': 'Hindfoot and ankle fusion carry the only labeled growth factor outside spine. Charcot and tibiotalocalcaneal fusion use biologics heavily on thin data. Diabetic foot osteomyelitis is where antibiotic-eluting fillers are moving.',
    'general': 'Applications that span any long bone: nonunion and infected dead-space management.'
  }[r] || '';
}

function renderApp(a) {
  const pairs = (pairsByApp[a.id] || []).slice().sort((u, v) => gradeOf(u.x) - gradeOf(v.x) || (v.x.on_label === true) - (u.x.on_label === true) || u.p.name.localeCompare(v.p.name));
  const kv = [];
  if (a.classifications && a.classifications.length) kv.push(['Classification', a.classifications.map(c => `<div><strong>${esc(c.name)}</strong>${c.summary ? ': ' + esc(c.summary) : ''}</div>`).join('')]);
  if (a.why_biologic) kv.push(['Why a biologic', esc(a.why_biologic)]);
  if (a.autograft_standard) kv.push(['Autograft standard', esc(a.autograft_standard)]);
  if (a.nonunion_note) kv.push(['Union and failure rates', esc(a.nonunion_note)]);
  if (a.volume_note) kv.push(['Volume', esc(a.volume_note)]);
  if (a.coverage_note) kv.push(['Coverage', esc(a.coverage_note)]);
  const tiers = TIERS.map(([key, label, cls]) => { const g = pairs.filter(({ x }) => x.tier === key); if (!g.length) return ''; return `<div class="tier-head ${cls}"><h3>${label}</h3><span class="n">${g.length} product${g.length === 1 ? '' : 's'} · ordered by evidence</span></div>` + g.map(({ p, x }) => productCard(p, x, a)).join(''); }).join('');
  const fig = (typeof SPINEFIG !== 'undefined' && SPINEFIG.has(a.id)) ? SPINEFIG.render(a.id) : null;
  return crumbs([{ label: 'Atlas', hash: '' }, { label: REGION[a.region].label, hash: 'r-' + a.region }, { label: a.name.length > 40 ? a.name.slice(0, 38) + '…' : a.name }]) + `
  ${fig ? `<div class="card rv fig"><div class="eyebrow">In depth · where the biologic goes</div>${fig.svg}<p class="cap">${esc(fig.caption)}</p></div>` : ''}
  <div class="card rv"><h3><span class="k">${esc(a.type)}${a.subregion ? ' · ' + esc(a.subregion) : ''}</span>${esc(a.name)}</h3>
    <dl class="kv">${kv.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
    ${a.unverified ? '<div class="note warn">A figure on this card could not be confirmed from a primary source and is shown with its best available citation. The research notes on GitHub record what was searched.</div>' : ''}
    ${marketStrip(a.id)}
    ${(a.sources || []).length ? `<details class="more"><summary>Sources for this application</summary><div class="srcs" style="margin-top:8px">${a.sources.map(s => /^https?:/.test(s) ? `<a href="${esc(s)}" target="_blank" rel="noopener">${esc(s)}</a>` : `<span>${esc(s)}</span>`).join('')}</div></details>` : ''}
  </div>
  ${pairs.length ? `<div class="rv" style="display:grid;gap:10px">${tiers}</div>` : `<div class="card rv"><h3><span class="k">Biologics</span>No biologic is standard here</h3><p class="muted small">No product in the dataset is marketed or studied for this application. That is the finding, not a gap: fixation alone is the standard of care and the literature does not support a graft or growth factor.</p></div>`}`;
}
function productCard(p, x, a) {
  const refs = (p.evidence || []).filter(e => (e.applications || []).includes(a.id)); const shown = refs.length ? refs : (p.evidence || []).slice(0, 2);
  const unv = p.unverified || x.unverified || (p.regulatory && p.regulatory.unverified);
  return `<div class="prod">
    <div class="prod-top"><div><div class="name"><button type="button" data-prod="${esc(p.id)}">${esc(p.name)}</button></div><div class="co">${esc(p.company)}</div></div>
      <div class="badges"><span class="grade g${esc(x.evidence_grade || 'V')}" title="Evidence grade">${esc(x.evidence_grade || 'V')}</span>${x.on_label === true ? '<span class="badge on">On label</span>' : x.on_label === false ? '<span class="badge off">Off label</span>' : ''}<span class="badge cat">${esc(p.category)}</span>${statusBadge(p)}${tierBadge(p.id)}${shareBadge(p.id, a.id)}${unv ? '<span class="badge unv">Unverified</span>' : ''}</div></div>
    ${x.evidence_summary ? `<div class="ev">${esc(x.evidence_summary)}</div>` : '<div class="ev muted">No published evidence for this application.</div>'}
    ${x.caveats ? `<div class="cav">${esc(x.caveats)}</div>` : ''}
    ${shown.length ? `<div class="refs">${shown.slice(0, 4).map(e => refChip(e.ref)).join('')}</div>` : ''}
    <div class="bd"><div><b>Regulatory</b>${esc(regLabel(p))}</div><div><b>Channel</b>${esc((p.bd || {}).sales_channel || '—')}</div><div style="grid-column:1/-1"><b>How it is paid</b>${esc((p.bd || {}).reimbursement || '—')}</div></div>
  </div>`;
}

/* ---------- product dialog ---------- */
const dlg = document.getElementById('pdlg'), dlgBody = document.getElementById('pdlg-body');
function openProduct(id) {
  const p = prodById[id]; if (!p) return; const r = p.regulatory || {}, bd = p.bd || {}, pipe = p.pipeline;
  const apps = (p.applications || []).filter(x => appById[x.application_id]).sort((u, v) => gradeOf(u) - gradeOf(v));
  dlgBody.innerHTML = `
  <div class="dlg-head"><div><div class="eyebrow">${esc(p.company)}</div><h3 style="margin-top:8px">${esc(p.name)}</h3></div><button class="close" type="button" id="pdlg-close">Close</button></div>
  <div class="badges"><span class="badge cat">${esc(p.category)}</span><span class="pill ${p.status === 'established' ? 'est' : p.status === 'emerging' ? 'emg' : 'inv'}">${esc(p.status)}</span>${statusBadge(p)}${p.unverified || r.unverified ? '<span class="badge unv">Unverified fields</span>' : ''}${p.catalog_status_2026 ? `<span class="badge">${esc(p.catalog_status_2026)}</span>` : ''}</div>
  <dl class="kv">
    ${p.composition ? `<dt>Composition</dt><dd>${esc(p.composition)}</dd>` : ''}
    ${p.ownership_history ? `<dt>Ownership</dt><dd>${esc(p.ownership_history)}</dd>` : ''}
    <dt>FDA pathway</dt><dd>${esc(regLabel(p))}${r.us_market_year ? ` · US market ${esc(r.us_market_year)}` : ''}${r.reference && String(r.reference).length > 24 ? `<div class="muted small" style="margin-top:4px">${esc(r.reference)}</div>` : ''}</dd>
    ${(r.on_label_indications || []).length ? `<dt>Labeled indications</dt><dd><ul class="tight">${r.on_label_indications.map(s => `<li>${esc(s)}</li>`).join('')}</ul></dd>` : ''}
    ${pipe ? `<dt>Pipeline</dt><dd>${esc(pipe.stage || '')}${pipe.expected_milestone ? ' · ' + esc(pipe.expected_milestone) : ''}${(pipe.trials || []).length ? `<div class="refs" style="margin-top:6px">${pipe.trials.map(refChip).join('')}</div>` : ''}</dd>` : ''}
    <dt>Channel</dt><dd>${esc(bd.sales_channel || '—')}</dd>
    <dt>How it is paid</dt><dd>${esc(bd.reimbursement || '—')}</dd>
    ${bd.notes ? `<dt>BD notes</dt><dd>${esc(bd.notes)}</dd>` : ''}
  </dl>
  <h4>Applications in this atlas</h4>
  <div class="applist">${apps.map(x => { const a = appById[x.application_id]; return `<button class="app-row" type="button" data-go="a-${a.id}"><div><div class="t">${esc(a.name)}</div><div class="d">${esc(REGION[a.region].label)}${x.evidence_summary ? ' · ' + esc(x.evidence_summary.slice(0, 110)) + (x.evidence_summary.length > 110 ? '…' : '') : ''}</div></div><div class="counts"><span class="grade g${esc(x.evidence_grade || 'V')}">${esc(x.evidence_grade || 'V')}</span><span class="pill ${x.tier === 'established' ? 'est' : x.tier === 'emerging' ? 'emg' : 'inv'}">${esc(x.tier)}</span>${x.on_label === true ? '<span class="badge on">On label</span>' : x.on_label === false ? '<span class="badge off">Off label</span>' : ''}</div></button>`; }).join('') || '<div class="empty">No application pairings.</div>'}</div>
  <h4>Evidence</h4>
  ${(p.evidence || []).length ? `<div style="overflow:auto"><table class="evtable"><thead><tr><th>Ref</th><th>Year</th><th>Design</th><th>n</th><th>Finding</th><th>Sponsor</th></tr></thead><tbody>${p.evidence.map(e => `<tr><td>${refChip(e.ref)}</td><td class="n">${esc(e.year || '')}</td><td>${esc(e.design || '')}</td><td class="n">${esc(e.n || '')}</td><td>${e.title ? `<div class="muted small">${esc(e.title)}</div>` : ''}${esc(e.finding || '')}</td><td>${e.sponsor_funded === true ? 'Yes' : e.sponsor_funded === false ? 'No' : '—'}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty">No published study was found for this product. It is graded V everywhere it appears.</div>'}
  ${(p.sources || []).length ? `<details class="more"><summary>Sources (${p.sources.length})</summary><div class="srcs" style="margin-top:8px">${p.sources.map(s => /^https?:/.test(s) ? `<a href="${esc(s)}" target="_blank" rel="noopener">${esc(s)}</a>` : `<span>${esc(s)}</span>`).join('')}</div></details>` : ''}
  <div class="muted small">Last reviewed ${esc(p.last_reviewed || META.reviewed || '')}. Permalink: <a href="#p-${esc(p.id)}">#p-${esc(p.id)}</a></div>`;
  dlgBody.querySelector('#pdlg-close').addEventListener('click', () => dlg.close());
  dlgBody.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => { dlg.close(); go(b.dataset.go, { scroll: true }); }));
  if (!dlg.open) dlg.showModal(); dlg.scrollTop = 0;
}
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

/* ---------- hero, glance, tables ---------- */
(function hero() {
  const pairs = PRODS.reduce((n, p) => n + (p.applications || []).length, 0), ev = PRODS.reduce((n, p) => n + (p.evidence || []).length, 0);
  const g1 = PRODS.reduce((n, p) => n + (p.applications || []).filter(x => x.evidence_grade === 'I').length, 0);
  const companies = (BD.companies || []).length;
  document.getElementById('hero-chips').innerHTML = [[PRODS.length, 'products'], [APPS.length, 'applications'], [ev, 'citations'], [ORDER.length - 1, 'regions']].map(([n, l]) => `<span class="chip"><b>${n}</b> ${l}</span>`).join('');
  document.getElementById('hero-tiles').innerHTML = [[PRODS.length, 'Products', 'tiered by application'], [pairs, 'Product uses', 'each graded I to V'], [g1, 'Level I pairings', `${Math.round(100 * g1 / pairs)}% of uses have RCT evidence`], [companies, 'Companies', 'with portfolio and channel']].map(([v, l, d]) => `<div class="tile"><div class="lab">${l}</div><div class="val">${v}</div><div class="delta">${esc(d)}</div></div>`).join('');
  document.getElementById('reviewed-date').textContent = META.reviewed || '';
})();
(function glance() {
  const el = document.getElementById('glance-chart');
  el.innerHTML = ORDER.map(r => { const c = { I: 0, II: 0, III: 0, IV: 0, V: 0 }; let n = 0; (appsByRegion[r] || []).forEach(a => (pairsByApp[a.id] || []).forEach(({ x }) => { c[x.evidence_grade] = (c[x.evidence_grade] || 0) + 1; n++; })); if (!n) return `<div class="gl-row"><div class="lab"><button type="button" data-go="r-${r}">${esc(REGION[r].label)}</button></div><div class="gl-bar"></div><div class="n">0</div></div>`; return `<div class="gl-row"><div class="lab"><button type="button" data-go="r-${r}">${esc(REGION[r].label)}</button></div><div class="gl-bar" title="${['I', 'II', 'III', 'IV', 'V'].map(g => g + ': ' + (c[g] || 0)).join(' · ')}">${['I', 'II', 'III', 'IV', 'V'].map(g => c[g] ? `<span class="g${g}" style="width:${100 * c[g] / n}%" title="Grade ${g}: ${c[g]}"></span>` : '').join('')}</div><div class="n">${n}</div></div>`; }).join('');
  el.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => { go(b.dataset.go); document.getElementById('atlas').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }));
})();
(function paid() {
  const rows = (BD.reimbursement || []).slice().sort((a, b) => (a.setting || '').localeCompare(b.setting || '') || (a.code_type || '').localeCompare(b.code_type || '') || String(a.code).localeCompare(String(b.code)));
  document.getElementById('reimb-table').innerHTML = `<table class="tbl reimb"><thead><tr><th>Setting</th><th>Code</th><th>What it is</th><th>What it pays</th></tr></thead><tbody>${rows.map(x => `<tr><td>${esc(x.setting)}</td><td class="code">${esc(x.code_type)} ${esc(x.code)}</td><td>${esc(x.description)}</td><td class="muted">${esc(x.payment_note)}${x.unverified ? ' <span class="badge unv">Unverified</span>' : ''}</td></tr>`).join('')}</tbody></table>`;
  document.getElementById('payer-cards').innerHTML = (BD.payer_policies || []).map(x => `<div class="card sub" style="padding:14px 16px;gap:6px"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><strong>${esc(x.payer)}</strong><span class="mono small muted">${esc(x.policy_number || '')}</span></div><div class="small">${esc(x.title || '')}${x.date ? ` <span class="muted">· ${esc(x.date)}</span>` : ''}</div>${(x.not_covered_or_experimental || []).length ? `<div class="small"><span class="mono" style="color:var(--amber);font-size:.62rem;letter-spacing:.08em;text-transform:uppercase">Experimental or not covered</span><ul class="tight muted" style="margin-top:4px">${x.not_covered_or_experimental.slice(0, 4).map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>` : ''}${(x.covered || []).length ? `<div class="small"><span class="mono" style="color:var(--green-soft);font-size:.62rem;letter-spacing:.08em;text-transform:uppercase">Covered with criteria</span><ul class="tight muted" style="margin-top:4px">${x.covered.slice(0, 3).map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>` : ''}${x.url ? `<a class="small" href="${esc(x.url)}" target="_blank" rel="noopener">Policy text</a>` : ''}</div>`).join('');
})();
(function market() {
  const rows = (BD.companies || []).slice().sort((a, b) => a.name.localeCompare(b.name));
  document.getElementById('company-table').innerHTML = `<table class="tbl cos"><thead><tr><th>Company</th><th>Orthobiologics portfolio</th><th>How they sell</th></tr></thead><tbody>${rows.map(c => `<tr><td><strong>${esc(c.name)}</strong><div class="muted small">${esc(c.hq || '')}${c.public_or_private ? ' · ' + esc(c.public_or_private) : ''}</div></td><td class="small">${(c.orthobiologics_portfolio || []).map(esc).join('; ')}</td><td class="small muted">${esc(c.sales_model || '')}${c.notes ? `<div style="margin-top:4px">${esc(c.notes)}</div>` : ''}</td></tr>`).join('')}</tbody></table>`;
})();
document.addEventListener('click', e => { const b = e.target.closest('#market-analysis [data-go]'); if (b) go(b.dataset.go, { scroll: true }); });
(function marketAnalysis() {
  const el = document.getElementById('market-analysis'); if (!el) return; const A = MARKET.analysis; if (!A || !(A.leader_rows || []).length) { el.innerHTML = ''; return; }
  const G = { I: 1, II: 2, III: 3, IV: 4, V: 5 }; const pts = MK_SHARES.filter(s => s.evidence_grade && (s.rank || 99) <= 3);
  const W = 620, H = 300, L = 46, R = 16, T = 18, B = 40; const x = g => L + ((G[g] || 5) - 1) * (W - L - R) / 4; const y = v => T + (1 - Math.min(100, v) / 100) * (H - T - B);
  const dots = pts.map((s, i) => { const v = s.share_pct != null ? s.share_pct : (s.rank === 1 ? 55 : s.rank === 2 ? 25 : 12); const jx = ((i * 37) % 11 - 5) * 2.2; return `<circle class="pt ${esc(s.cap_tier || 'unknown')}" cx="${(x(s.evidence_grade) + jx).toFixed(1)}" cy="${y(v).toFixed(1)}" r="${s.share_pct != null ? 7 : 5}" ${s.share_pct == null ? 'stroke-dasharray="2 2" fill-opacity=".55"' : ''}><title>${esc(s.product_name || s.product_id)} · ${esc(s.company || '')} · ${esc((appById[s.application_id] || {}).name || s.application_id)} · ${s.share_pct != null ? s.share_pct + '% share' : 'rank ' + s.rank + ' (share not public)'} · grade ${esc(s.evidence_grade)}</title></circle>`; }).join('');
  const svg = `<svg class="scatter" viewBox="0 0 ${W} ${H}" role="img" aria-label="Scatter of share versus evidence grade for the top three products in each application, coloured by company size"><line class="ax" x1="${L}" y1="${H - B}" x2="${W - R}" y2="${H - B}"/><line class="ax" x1="${L}" y1="${T}" x2="${L}" y2="${H - B}"/>${['I', 'II', 'III', 'IV', 'V'].map(g => `<text x="${x(g)}" y="${H - B + 16}" text-anchor="middle">${g}</text>`).join('')}<text x="${(L + W - R) / 2}" y="${H - 6}" text-anchor="middle">evidence grade in that application (I = randomised)</text>${[0, 25, 50, 75, 100].map(v => `<text x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v}%</text><line class="ax" x1="${L}" y1="${y(v)}" x2="${W - R}" y2="${y(v)}" stroke-dasharray="2 4"/>`).join('')}${dots}</svg><div class="legend"><span><i style="background:var(--purple-soft)"></i>large cap</span><span><i style="background:var(--amber)"></i>small, mid or private</span><span><i style="background:var(--muted)"></i>nonprofit, subsidiary or many vendors</span><span class="muted">dashed = rank only, share not public (plotted at a nominal height)</span></div>`;
  const rows = A.leader_rows.slice().sort((u, v) => u.region.localeCompare(v.region) || u.application_id.localeCompare(v.application_id));
  const tab = `<table class="ltab"><thead><tr><th>Application</th><th>Share leader</th><th>Size</th><th>Share</th><th>Grade</th><th>Conf.</th></tr></thead><tbody>${rows.map(r => `<tr><td><button class="linklike" type="button" data-go="a-${esc(r.application_id)}">${esc((appById[r.application_id] || {}).name || r.application_id)}</button></td><td>${esc(r.leader_product || '')}<div class="muted small">${esc(r.leader_company || '')}</div></td><td>${r.cap_tier && TIER_LABEL[r.cap_tier] ? `<span class="badge tier ${esc(r.cap_tier)}">${TIER_LABEL[r.cap_tier]}</span>` : ''}</td><td class="n">${r.share_pct != null ? esc(r.share_pct) + '%' : '<span class="muted">rank only</span>'}</td><td>${r.evidence_grade ? `<span class="grade g${esc(r.evidence_grade)}">${esc(r.evidence_grade)}</span>` : ''}</td><td class="n muted">${esc(r.confidence || '')}</td></tr>`).join('')}</tbody></table>`;
  const md = (MARKET.verdict_md || '').trim(); const verdict = md ? md.split(/\n\s*\n/).map(p => p.startsWith('## ') ? `<h3>${esc(p.slice(3))}</h3>` : `<p>${esc(p).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`).join('') : '<p class="muted">Verdict pending: the numbers are in, the prose is not.</p>';
  const deals = (MARKET.deals || []).slice().sort((u, v) => (v.date || '').localeCompare(u.date || '')).slice(0, 14);
  const dl = deals.length ? `<div class="deals">${deals.map(d => `<div class="deal"><div class="d">${esc((d.date || '').slice(0, 7))}</div><div><strong>${esc(d.acquirer || '')}</strong> <span class="muted">${esc(d.deal_type || '')}</span> <strong>${esc(d.target || '')}</strong>${d.value_usd_m ? ` <span class="muted">· $${Number(d.value_usd_m).toLocaleString()}M</span>` : ''}<div class="m">${esc(d.rationale || '')}${d.evidence_at_deal ? ` <em>Evidence at the deal: ${esc(d.evidence_at_deal)}</em>` : ''}${d.source && /^https?:/.test(d.source) ? ` <a href="${esc(d.source)}" target="_blank" rel="noopener">source</a>` : ''}</div></div></div>`).join('')}</div>` : '';
  el.innerHTML = `<div class="hyp"><div class="card"><h3><span class="k">The test</span>Share against evidence, every indication with a public leader</h3>${svg}${tab}</div><div class="card verdict"><h3><span class="k">The hypothesis</span>Do the biggest companies hold the share, and must a small company win on evidence?</h3>${verdict}</div></div>${dl ? `<div class="card" style="margin-top:18px"><h3><span class="k">The deal record</span>Who bought what, and what evidence came with it</h3>${dl}</div>` : ''}`;
})();
(function reg() {
  document.getElementById('reg-summary').innerHTML = (META.reg_summary || []).map(p => `<p>${esc(p).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`).join('');
  const tl = META.timeline || []; const item = t => `<div class="tl-item"><div class="d">${esc(t.date)}</div><div>${esc(t.action)}${t.source ? `<span class="s">${esc(t.source)}</span>` : ''}</div></div>`;
  const keep = tl.filter(t => /2025|2026/.test(t.date)).slice(-8); const rest = tl.filter(t => !keep.includes(t));
  document.getElementById('timeline').innerHTML = keep.map(item).join(''); document.getElementById('timeline-rest').innerHTML = rest.map(item).join('');
  document.getElementById('changelog').innerHTML = (META.changelog || []).map(s => `<li>${esc(s)}</li>`).join('');
})();

/* reveal */
if ('IntersectionObserver' in window && !reduced) { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 }); document.querySelectorAll('.rv').forEach(el => io.observe(el)); } else document.querySelectorAll('.rv').forEach(el => el.classList.add('in'));

route();
window.ATLAS = { D, go, state, openProduct, focusRegion, regionLabel: r => (REGION[r] || {}).label || r, get pendingSub() { return pendingSub; }, set pendingSub(v) { pendingSub = v; } };
})();
