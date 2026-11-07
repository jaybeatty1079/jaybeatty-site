// node owners-desk/test.mjs   (the copy's shape, the banned claims, the shared math on the desk's defaults, the page wiring)
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const M = require('../bonus-lot/model.js');
globalThis.window = {}; require('./copy.js'); const D = globalThis.window.DESK;

// copy shape
assert.deepEqual(Object.keys(D.doors).sort(), ['cpa', 'owner']);
for (const [k, d] of Object.entries(D.doors)) {
  assert.ok(d.sub && d.open.length === 2 && d.open.every(l => l.length === 2) && typeof d.live === 'function' && d.letterTurn && d.cta.length === 2 && d.ctaFine && d.print.length === 2, k + ': door copy');
}
assert.ok(D.doors.cpa.extra && D.doors.cpa.extra.p.length >= 2 && D.doors.owner.extra === null, 'only the CPA door has the extra screen');
assert.equal(D.binder.tabs.length, 5, 'five binder tabs');
assert.ok(D.questions.length >= 8 && D.questions.every(q => q.q && D.groups[q.g] && q.beats.length >= 1 && q.beats.every(b => b.length === 2)), 'questions');
assert.ok(D.stat.line && D.stat.src && /^https:\/\/www\.mercer\.com\//.test(D.stat.url), 'the letter cites its source');

// banned claims: "IRS-approved" only in the line that says nobody can say it; "guarantee" only in the disclaimer; no E&O dollar figure; no fee number
const text = JSON.stringify(D);
for (const m of text.matchAll(/[^.]{0,40}IRS[- ]approved/gi)) assert.match(m[0], /Nobody says/, 'IRS-approved only as the line nobody can say: ' + m[0]);
const noDisc = JSON.stringify({ ...D, disclaimer: '' });
assert.ok(!/guarantee|no net cost|IRS approved program/i.test(noDisc), 'no guarantee outside the disclaimer');
assert.ok(!/\$\s?\d+\s?(M|million)/i.test(text), 'no E&O or other dollar-million figure');
assert.ok(!/referral fee of|\d+% referral/i.test(text), 'no referral fee number');
assert.ok(/KCP \(CPAs and former IRS special agents and auditors\)/.test(text), 'KCP is never named bare the first time');

// the shared math on the desk's defaults: 50 employees at 80% = 40 enrolled × $67.10 × 12 = $32,208
const S = M.defaults(D.sector), m = M.model(S);
assert.deepEqual(M.sanitize(S, D.sector), S, 'defaults survive sanitize');
assert.equal(m.g.emp, 50); assert.equal(m.g.enrolled, 40);
assert.equal(+m.per.toFixed(2), 67.10); assert.equal(+m.g.lift.toFixed(2), 32208);
assert.ok(Number.isFinite(m.g.net) && Number.isFinite(m.units), 'no benchmarks: the model clamps to tiny finite figures the page never shows, never NaN');
const bad = M.sanitize({ stores: [{ brand: '<b>', emp: 1e9, state: 'ZZ' }], hp: 'x', qual: 999 }, D.sector);
assert.equal(bad.stores[0].brand, 'Headquarters'); assert.equal(bad.stores[0].emp, 2000); assert.equal(bad.stores[0].state, 'PA'); assert.equal(bad.hp, 'insured'); assert.equal(bad.qual, 100);
console.log('ok: copy and math');

// page wiring
const page = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
for (const id of ['pg-letter', 'pg-stub', 'pg-pnl', 'pg-calendar', 'pg-binder', 'pg-cpa', 'pg-phone', 'onepage', 'cashV', 'statSrc', 'disclaimer']) assert.ok(page.includes('id="' + id + '"'), 'page has #' + id);
for (const o of ['letter', 'stub', 'pnl', 'calendar', 'binder', 'phone']) assert.ok(page.includes('data-o="' + o + '"'), 'desk has the ' + o);
assert.ok(/src="\.\.\/bonus-lot\/model\.js"/.test(page) && /src="\.\.\/bonus-lot\/gsap\.min\.js"/.test(page), 'reuses the Dealer City model and GSAP');
assert.ok(/mailto:jay@jaybeatty\.com/.test(page), 'the CTA goes to Jay by email');
assert.ok(/get\('for'\)==='cpa'\?'cpa':'owner'/.test(page), 'the door is whitelisted');
assert.ok(/prefers-reduced-motion/.test(page), 'reduced motion is honoured');
console.log('ok: page wiring');
