// Biologics Atlas 3D viewer: a licensed skeleton GLB rendered with three.js, bones colored and picked by region.
// Loaded as an ES module. Exposes window.ATLAS3D = { ready, focus(region, sub), reset(), setRegionRules(rules) }.
// If WebGL or the model fails, the page keeps the SVG skeleton; app.js checks ATLAS3D.ready before delegating.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const CFG = window.ATLAS3D_CONFIG || {};
const MODEL_URL = CFG.model || 'skeleton.glb';
const REGION_COLORS = CFG.colors || {
  'skull-cmf': '#d65db1', 'spine': '#8366ea', 'shoulder-humerus': '#10a197', 'forearm-wrist-hand': '#22a85e',
  'pelvis-hip': '#e5b35a', 'femur-knee': '#6fe3a3', 'tibia': '#b7a6ff', 'ankle-foot': '#10a197', 'other': '#8f87ad'
};
// Rules map a mesh or node name (lowercased, with ancestors joined by '/') to a region and optional subregion.
// Filled per model by setRegionRules(); the defaults cover common anatomical naming.
let RULES = CFG.rules || [
  [/(cranium|skull|frontal|parietal|temporal|occipital|sphenoid|ethmoid)/, 'skull-cmf', 'cranium'],
  [/(mandible|maxilla|zygomatic|nasal|lacrimal|palatine|vomer|concha|hyoid|teeth|tooth|incisor|canine|molar|premolar)/, 'skull-cmf', 'face'],
  [/(atlas|axis|\bc[1-7]\b|cervical)/, 'spine', 'cervical'],
  [/(\bt(h)?[1-9]\b|\bt1[0-2]\b|thoracic|\bl[1-5]\b|lumbar|intervertebral)/, 'spine', 'thoracolumbar'],
  [/(sacrum|sacral|coccyx)/, 'spine', 'sacroiliac'],
  [/(ilium|iliac|ischium|pubis|pubic|hip bone|pelvis|pelvic|innominate|coxal|acetab)/, 'pelvis-hip', null],
  [/(clavicle|scapula|humerus|humeral)/, 'shoulder-humerus', null],
  [/(radius|radial|ulna|ulnar|carpal|scaphoid|lunate|triquetr|pisiform|trapezium|trapezoid|capitate|hamate|metacarp|phalan.*(hand|manus)|finger|thumb|hand)/, 'forearm-wrist-hand', null],
  [/(femur|femoral|patella)/, 'femur-knee', null],
  [/(tibia|tibial|fibula|fibular)/, 'tibia', null],
  [/(talus|calcane|navicular|cuboid|cuneiform|metatars|tarsal|toe|foot|pes|hallux)/, 'ankle-foot', null],
  [/(rib|costal|sternum|manubrium|xiphoid)/, 'other', null],
];
const BONE = new THREE.Color('#e9e4f3');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const api = window.ATLAS3D = { ready: false, focus() {}, reset() {}, setRegionRules(r) { RULES = r; }, regionOf: null, failed: false };
const host = document.getElementById('skel3d');
const wrap = document.getElementById('skel-wrap');
const tip = document.getElementById('skel-tip');
if (!host) throw new Error('no #skel3d host');

function classify(path) {
  for (const [re, region, sub] of RULES) if (re.test(path)) return { region, sub };
  return { region: 'other', sub: null };
}
api.regionOf = classify;

function supportsWebGL() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }
if (!supportsWebGL()) { api.failed = true; throw new Error('no webgl'); }

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
host.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.08; controls.rotateSpeed = 0.7; controls.zoomSpeed = 0.8;
controls.enablePan = true; controls.screenSpacePanning = true; controls.minDistance = 0.15; controls.maxDistance = 12;
controls.autoRotate = !reduced; controls.autoRotateSpeed = 0.45;
scene.add(new THREE.HemisphereLight(0xfff6ff, 0x1a1428, 1.15));
const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(2.5, 4, 3); scene.add(key);
const fill = new THREE.DirectionalLight(0xb7a6ff, 0.55); fill.position.set(-3, 1, -2); scene.add(fill);
const rim = new THREE.DirectionalLight(0x6fe3a3, 0.35); rim.position.set(0, -2, -4); scene.add(rim);

const root = new THREE.Group(); scene.add(root);
const byRegion = {}; const pickables = []; const meshRegion = new Map();
let hovered = null, active = null, activeSub = null, pending = null, needsRender = true;
let fullBox = null;

function materialFor(region) {
  const c = new THREE.Color(REGION_COLORS[region] || REGION_COLORS.other);
  const tinted = BONE.clone().lerp(c, 0.42);
  return new THREE.MeshStandardMaterial({ color: tinted, roughness: 0.58, metalness: 0.04, emissive: c.clone().multiplyScalar(0.0) });
}
function setGlow(region, sub, strength) {
  (byRegion[region] || []).forEach(m => {
    if (sub && m.userData.sub && m.userData.sub !== sub) { m.material.emissiveIntensity = 0; m.material.emissive.setScalar(0); return; }
    const c = new THREE.Color(REGION_COLORS[region] || REGION_COLORS.other);
    m.material.emissive.copy(c); m.material.emissiveIntensity = strength;
  });
}
function restyle() {
  Object.keys(byRegion).forEach(r => setGlow(r, null, 0));
  if (active) setGlow(active, activeSub, 0.55);
  if (hovered && hovered !== active) setGlow(hovered, null, 0.3);
  needsRender = true;
}

const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
loader.load(MODEL_URL, gltf => {
  const model = gltf.scene;
  model.updateMatrixWorld(true);
  model.traverse(o => {
    if (!o.isMesh) return;
    const names = []; let p = o; while (p && p !== model) { if (p.name) names.push(p.name); p = p.parent; }
    const path = names.join('/').toLowerCase();
    const baked = o.userData && o.userData.region ? { region: o.userData.region, sub: o.userData.sub || null } : null;
    const { region, sub } = baked || classify(path);
    if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals();
    o.userData.region = region; o.userData.sub = sub || null; o.userData.label = (o.userData && o.userData.name) || o.name;
    o.material = materialFor(region); o.castShadow = false; o.receiveShadow = false;
    (byRegion[region] = byRegion[region] || []).push(o); pickables.push(o); meshRegion.set(o, region);
  });
  // normalize: center at origin, height = 2 units, feet at y = -1
  const box = new THREE.Box3().setFromObject(model); const size = new THREE.Vector3(); box.getSize(size); const center = new THREE.Vector3(); box.getCenter(center);
  const s = 2 / Math.max(size.y, 1e-6); model.scale.setScalar(s); model.position.sub(center.multiplyScalar(s));
  root.add(model); root.updateMatrixWorld(true);
  fullBox = new THREE.Box3().setFromObject(root);
  frameBox(fullBox, 0, new THREE.Vector3(0.35, 0.15, 1));
  api.ready = true; host.hidden = false; wrap.classList.add('is3d');
  const stats = Object.entries(byRegion).map(([r, l]) => `${r}:${l.length}`).join(' ');
  if (CFG.debug) console.log('ATLAS3D regions', stats);
  if (tip) tip.textContent = 'Drag to rotate · scroll to zoom · click a bone';
  if (pending) { api.focus(pending.region, pending.sub); pending = null; } else if (window.ATLAS && window.ATLAS.state && window.ATLAS.state.region) api.focus(window.ATLAS.state.region, null);
  needsRender = true;
}, undefined, err => { api.failed = true; host.hidden = true; console.warn('ATLAS3D model failed', err); });

/* framing and fly-to */
let tween = null;
function frameBox(box, ms, dirHint) {
  const size = new THREE.Vector3(); box.getSize(size); const center = new THREE.Vector3(); box.getCenter(center);
  const radius = Math.max(size.x, size.y, size.z) * 0.5;
  const fov = THREE.MathUtils.degToRad(camera.fov); const dist = Math.max(0.2, (radius / Math.sin(fov / 2)) * 1.12);
  const dir = dirHint ? dirHint.clone().normalize() : camera.position.clone().sub(controls.target).normalize();
  if (dir.lengthSq() < 1e-6) dir.set(0, 0, 1);
  const toPos = center.clone().add(dir.multiplyScalar(dist));
  flyTo(toPos, center, ms == null ? 750 : ms);
}
function flyTo(pos, target, ms) {
  if (reduced || ms === 0) { camera.position.copy(pos); controls.target.copy(target); controls.update(); needsRender = true; return; }
  tween = { p0: camera.position.clone(), t0: controls.target.clone(), p1: pos, t1: target, start: performance.now(), ms };
}
function boxOf(region, sub) {
  const list = (byRegion[region] || []).filter(m => !sub || !m.userData.sub || m.userData.sub === sub);
  if (!list.length) return null; const b = new THREE.Box3(); list.forEach(m => b.expandByObject(m)); return b;
}
api.focus = (region, sub) => {
  if (!api.ready) { pending = { region, sub }; return; }
  active = region || null; activeSub = sub || null; controls.autoRotate = false; restyle();
  if (!region) { frameBox(fullBox, 750, new THREE.Vector3(0.35, 0.15, 1)); return; }
  const b = boxOf(region, sub) || boxOf(region); if (b) frameBox(b, 750, null); else frameBox(fullBox, 750, null);
};
api.reset = () => { active = null; activeSub = null; restyle(); if (fullBox) frameBox(fullBox, 750, new THREE.Vector3(0.35, 0.15, 1)); };

/* picking */
const ray = new THREE.Raycaster(); const ptr = new THREE.Vector2(); let lastPick = 0, downAt = null, moved = false;
function pickAt(e) {
  const r = renderer.domElement.getBoundingClientRect(); ptr.x = ((e.clientX - r.left) / r.width) * 2 - 1; ptr.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  ray.setFromCamera(ptr, camera); const hits = ray.intersectObjects(pickables, false); return hits.length ? hits[0].object : null;
}
renderer.domElement.addEventListener('pointermove', e => {
  if (downAt && (Math.abs(e.clientX - downAt.x) + Math.abs(e.clientY - downAt.y) > 4)) moved = true;
  const now = performance.now(); if (now - lastPick < 50 || downAt) return; lastPick = now;
  const m = pickAt(e); const region = m ? m.userData.region : null;
  if (region !== hovered) { hovered = region; restyle(); renderer.domElement.style.cursor = region && region !== 'other' ? 'pointer' : 'grab'; }
  if (tip) { if (m && region !== 'other') { const lab = (window.ATLAS && window.ATLAS.regionLabel) ? window.ATLAS.regionLabel(region) : region; tip.innerHTML = `<b>${lab}</b>${m.userData.label ? ' · ' + String(m.userData.label).replace(/[_.]/g, ' ') : ''}`; } else if (!downAt) tip.textContent = active ? 'Drag to rotate · scroll to zoom · Zoom out to reset' : 'Drag to rotate · scroll to zoom · click a bone'; }
});
renderer.domElement.addEventListener('pointerdown', e => { downAt = { x: e.clientX, y: e.clientY }; moved = false; controls.autoRotate = false; });
renderer.domElement.addEventListener('pointerup', e => {
  const wasDown = downAt; downAt = null; if (!wasDown || moved) return;
  const m = pickAt(e); if (!m) return; const region = m.userData.region; if (!region || region === 'other') return;
  if (window.ATLAS && window.ATLAS.go) { window.ATLAS.pendingSub = m.userData.sub || null; window.ATLAS.go('r-' + region, { scroll: true }); }
});
renderer.domElement.addEventListener('pointerleave', () => { if (hovered) { hovered = null; restyle(); } });

/* loop, resize, visibility */
function resize() { const w = host.clientWidth || wrap.clientWidth, h = host.clientHeight || wrap.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); needsRender = true; }
new ResizeObserver(resize).observe(host); resize();
let visible = true; new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(host);
controls.addEventListener('change', () => { needsRender = true; });
const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
function loop(now) {
  requestAnimationFrame(loop);
  if (!visible || document.hidden) return;
  if (tween) { const k = Math.min(1, (now - tween.start) / tween.ms), e = ease(k); camera.position.lerpVectors(tween.p0, tween.p1, e); controls.target.lerpVectors(tween.t0, tween.t1, e); if (k >= 1) tween = null; needsRender = true; }
  const changed = controls.update();
  if (needsRender || changed || controls.autoRotate) { renderer.render(scene, camera); needsRender = false; }
}
requestAnimationFrame(loop);
