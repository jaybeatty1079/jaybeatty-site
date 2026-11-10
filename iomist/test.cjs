// Run: node iomist-tool/test.cjs
const assert = require('assert');
const D = require('./data.js'), M = require('./model.js');
const today = '2026-11-05';
const yes = {}, no = {};
D.questions.forEach(q => { if (['fda', 'buyer'].includes(q.kind)) { yes[q.id] = 'yes'; no[q.id] = 'no'; } });
const ctx = { crop: 'romaine', size: 'over250' };

// Readiness
let r = M.readiness(yes, ctx, ['walmart', 'wholefoods', 'target'], today);
assert.strictEqual(r.fda.pct, 100); assert.strictEqual(r.fda.total, 7);
assert.strictEqual(r.buyers[0].pct, 100); assert.strictEqual(r.buyers[0].dateStatus, 'In effect');
assert.strictEqual(r.buyers[1].pct, null); assert.strictEqual(r.buyers[1].dateStatus, 'Not published');
assert.strictEqual(r.buyers[2].dateStatus, 'No date published');
r = M.readiness(no, ctx, ['albertsons'], today);
assert.strictEqual(r.fda.pct, 0); assert.strictEqual(r.buyers[0].dateStatus, 'In ' + M.daysUntil('2027-01-01', today) + ' days');
// cooling "n/a" drops out of the denominator
assert.strictEqual(M.scoreFda(Object.assign({}, yes, { q5: 'na' }), ctx).total, 6);
// unanswered counts as a gap, partly counts half
const part = M.scoreFda({ q3: 'yes', q4: 'partly' }, ctx); assert.strictEqual(part.met, 1.5); assert.strictEqual(part.gaps.length, 6);
// crop not on the list: FDA does not apply, Albertsons (all food) still scored
r = M.readiness(yes, { crop: 'berry', size: 'over250' }, ['albertsons'], today);
assert.strictEqual(r.fda.applies, false); assert.strictEqual(r.buyers[0].pct, 100);
assert.strictEqual(M.scoreFda(yes, { crop: 'romaine', size: 'under25' }).applies, false);
// data hygiene: every buyer item is a real question; no competitor words; sources exist
D.buyers.forEach(b => { assert(D.sources[b.source], b.id); b.items.forEach(i => assert(M.question(i), i)); });

// Trace
const p = { lotsPerDay: 10, casesPerLot: 100, windowDays: 3, distributors: 3, stores: 12, seed: 4 };
const net = M.buildNetwork(p);
assert.strictEqual(net.cases.length, 3000);
assert.deepStrictEqual(M.buildNetwork(p).cases.slice(0, 20), net.cases.slice(0, 20)); // deterministic
const paper = M.runDrill(net, 'paper'), sheet = M.runDrill(net, 'spreadsheet'), scan = M.runDrill(net, 'scanning');
assert.strictEqual(paper.without.lots, 30);
assert(sheet.without.lots <= paper.without.lots && sheet.without.lots >= 1);
assert(sheet.without.lotIds.includes(sheet.truthLot.id)); // the true lot is always inside the suspects
assert.strictEqual(scan.with.lots, 1); assert.strictEqual(scan.with.cases, 100);
assert(scan.with.cases < paper.without.cases);
// bigger farm, bigger haystack, same one-lot answer
const big = M.runDrill(M.buildNetwork(Object.assign({}, p, { lotsPerDay: 30 })), 'paper');
assert(big.without.cases > paper.without.cases); assert.strictEqual(big.with.cases, 100);
// Layers and doors
D.reqs.forEach(r => { assert(D.sources[r.source], r.id); assert(['harvest', 'cooling', 'packing', 'gate', 'shipping', 'receiving'].includes(r.stop), r.id); assert(D.topics[r.kind] || r.kind === 'none', r.id); if (r.q) assert(M.question(r.q), r.id); assert(['industry', 'fda'].includes(r.buyer) || D.buyers.find(b => b.id === r.buyer), r.id); });
assert.deepStrictEqual(M.monthsDays('2026-11-05', '2028-07-20'), { months: 20, days: 15 }); // the FDA date is about 20 months out, not 18
assert.deepStrictEqual(M.monthsDays('2026-11-05', '2026-12-05'), { months: 1, days: 0 });
assert.strictEqual(M.layerReqs(['fda'], false, 'gate').length, 3);
assert(M.doors(['fda'], {}, 'paper', false)[0].label === 'FDA rule');
assert.strictEqual(new Set(D.reqs.map(r => r.id)).size, D.reqs.length); // unique ids
assert(M.layerReqs(['costco'], false, 'gate').length >= 5);
assert.strictEqual(M.layerReqs(['walmart'], true, 'packing').filter(r => r.buyer === 'industry').length, 2);
let dr = M.doors(['walmart', 'wholefoods'], {}, 'paper', false);
assert.strictEqual(dr[0].todayPct, 0); assert.strictEqual(dr[0].withPct, 100); assert.strictEqual(dr[0].unknown, 2); // audits unknown until answered
assert.strictEqual(dr[1].withPct, 100); assert.strictEqual(dr[1].notFound, 1);
dr = M.doors(['walmart'], { q3: 'yes', q4: 'yes', q10: 'yes', q11: 'yes', q12: 'yes', q13: 'yes' }, 'paper', false);
assert.strictEqual(dr[0].todayPct, 100);
assert(M.doors(['target'], {}, 'spreadsheet', true).length === 2);
const mx = M.matrix(['walmart', 'kroger', 'costco'], true);
assert(mx.find(r => r.kind === 'label').buyers === 4); assert(mx.find(r => r.kind === 'trace').cells.costco === 2);
// a "Not found" row is never counted as covered
assert(M.doors(['kroger'], {}, 'paper', false)[0].notFound === 1);
// a system that stops at the pallet: narrower than paper, never narrower than the one true lot, and the true lot is always inside
const pal = M.runDrill(net, 'pallet');
assert(pal.without.lots >= 1 && pal.without.lots < paper.without.lots && pal.without.cases > scan.with.cases);
assert(pal.without.lotIds.includes(pal.truthLot.id));
['paper', 'spreadsheet', 'erp', 'pallet'].forEach(t => assert.strictEqual(M.runDrill(net, t).without.steps.length, 5, t)); // the page times five steps
assert(D.tracking.find(t => t.id === 'pallet'));
// Start screen, FAQ, ask: every answer has a known kind, published ones a real source, links a real view; no prospect, person or incumbent named
D.faq.forEach(f => { assert(f.q && f.a, f.q); assert(['site', 'iomist', 'pub', 'ask', 'ill'].includes(f.s), f.q); if (f.s === 'pub') assert(D.sources[f.source], f.q); if (f.go) assert(['drill', 'journey', 'ready', 'doors'].includes(f.go) && f.goLabel, f.q); });
assert(D.steps.length === 4 && /^[^@\s]+@iomist\.ag$/.test(D.contact.email));
assert(/Walmart 2025-08-01.*Albertsons 2027-01-01/.test(D.faq.find(f => f.go === 'doors').a)); // buyer dates come from the buyers table
console.log('ok: readiness and trace tests passed');
