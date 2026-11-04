// node bonus-lot/test.mjs   (checks the math and the share-link validator against known figures)
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const M = require('./model.js');
globalThis.window = {}; require('./sectors.js'); const SECTORS = globalThis.window.SECTORS;

for (const [key, sector] of Object.entries(SECTORS)) {
  const S = M.defaults(sector);
  assert.deepEqual(M.sanitize(S, sector), S, key + ': defaults survive sanitize');
  assert.ok(sector.title.length === 2 && sector.labels.length && sector.copy.lines.length === 4 && sector.scene.sign.length === 4, key + ': config shape');
  for (const k of ['rpe', 'margin', 'unit']) { const [d, lo, hi] = sector.bench[k]; assert.ok(lo <= d && d <= hi, key + ': ' + k + ' default inside its range'); }
  assert.equal(sector.copy.gets.length, 5, key + ': five value-add bullets');
  const o = sector.copy.open; assert.ok(o && o.lines.length === 3 && o.lines.every(l => l.length === 2) && o.para && typeof o.live === 'function', key + ': opening panel copy');
  assert.ok(sector.copy.orient.length >= 2 && sector.copy.orient.every(b => b.h && b.s && b.cue != null) && sector.copy.landing.length >= 1, key + ': guided path beats');
  assert.ok(!JSON.stringify(sector).match(/IRS[- ]approved|no net cost|guarantee/i), key + ': no banned claim');
  for (const c of sector.cases || []) { // a real case must load through the same validator unchanged
    const L = M.sanitize({ ...S, stores: c.stores, plan: c.plan, qual: c.qual }, sector);
    assert.deepEqual(L.stores, c.stores, key + ': case stores pass sanitize'); assert.equal(L.plan, c.plan); assert.equal(L.qual, c.qual);
    assert.ok(c.q && c.beats.length >= 3 && c.beats.every(b => b.h && b.s), key + ': case beats');
  }
}

// Default plan is $1,400: × 7.65% − $40 = $67.10 a month; 64 employees at 80% → 51 enrolled → $41,065.20 a year. The published top figure, $1,600 → $82.40, is checked below.
const d = SECTORS.dealership, S = M.defaults(d), m = M.model(S);
assert.equal(+m.per.toFixed(2), 67.10);
assert.equal(m.g.enrolled, 51);
assert.equal(+m.g.lift.toFixed(2), 41065.20);
assert.equal(+M.model({ ...S, plan: 1600 }).per.toFixed(2), 82.40);
assert.equal(+M.model({ ...S, plan: 675 }).per.toFixed(2), 11.64);
// units-equivalent: lift ÷ margin ÷ average sale
assert.equal(Math.round(m.units), Math.round(41065.20 / 0.028 / 48000));
// zero margin or unit through a link cannot produce Infinity
const z = M.model({ ...S, margin: 0, unit: 0, rpe: 0 });
assert.ok(Number.isFinite(z.units) && Number.isFinite(z.g.net));

// a hostile or broken link is rejected field by field, never thrown
const bad = M.sanitize({ stores: [{ brand: '<img src=x onerror=alert(1)>', emp: '1e9', state: 'ZZ' }, 'junk', null], plan: 1300, qual: 'abc', margin: -5, unit: 10, hp: 'other', scope: 'x', share: 999 }, d);
assert.equal(bad.stores.length, 3);
assert.equal(bad.stores[0].brand, 'Toyota'); assert.equal(bad.stores[0].emp, 2000); assert.equal(bad.stores[0].state, 'PA');
assert.equal(bad.plan, 1400); assert.equal(bad.qual, 80); assert.equal(bad.margin, 1); assert.equal(bad.unit, 10000); assert.equal(bad.hp, 'insured'); assert.equal(bad.share, 40);
assert.deepEqual(M.sanitize(null, d), S); assert.deepEqual(M.sanitize('x', d), S); assert.deepEqual(M.sanitize({ stores: [] }, d), S);
const many = M.sanitize({ stores: Array(50).fill({ brand: 'Ford', emp: 10, state: 'CA' }) }, d);
assert.equal(many.stores.length, 30);
// a good link round-trips
const good = { ...S, stores: [{ brand: 'Ford', emp: 120, state: 'CA' }, { brand: 'Kia', emp: 33, state: 'AZ' }], hp: 'self', scope: 'group', share: 12.5 };
assert.deepEqual(M.sanitize(JSON.parse(JSON.stringify(good)), d), good);
console.log('ok: model and sanitize,', Object.keys(SECTORS).length, 'sector(s)');
