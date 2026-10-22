// Tests for the TEAM Episode Calculator engine (build/engine.js).
// Run from the team-calculator folder with Node 18 or newer, no dependencies:
//     node --test tests/
// Each test states the CMS rule it checks. Sources are in TEAM_Calculator_Model_Spec.md.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const ENG = require('../build/engine.js');
const TP = require('../data/data_target_prices_py1.json');
const E = ENG.createEngine(TP);
const { CATS, qualityAdj, eligible, leverSavings } = ENG;

const near = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-6, `${msg || ''} expected ${b}, got ${a}`);
const state = region => E.defaultState(region || 2);
const count = (S, key, counts) => Object.assign(S.cats[key].counts, counts);

test('price table: 29 MS-DRGs across 9 census divisions, one row each', () => {
  assert.equal(new Set(TP.map(r => r.drg)).size, 29);
  assert.equal(new Set(TP.map(r => r.region)).size, 9);
  assert.equal(TP.length, 261);
  const key = r => r.drg + '|' + r.region;
  assert.equal(new Set(TP.map(key)).size, TP.length, 'no duplicate DRG-region rows');
});

test('price lookup: the outpatient joint row prices at MS-DRG 470, unknown DRGs price at zero', () => {
  assert.ok(E.price('470', 2) > 10000);
  assert.equal(E.price('470-OP', 2), E.price('470', 2));
  assert.equal(E.price('999', 2), 0);
});

test('positive reconciliation: 10% × (1 − CQS/100) is withheld (CMS quality fact sheet table)', () => {
  assert.equal(qualityAdj(10000, 0, 3).qa, 9000);
  assert.equal(qualityAdj(10000, 50, 3).qa, 9500);
  assert.equal(qualityAdj(10000, 100, 3).qa, 10000);
});

test('negative reconciliation: quality relief is up to 15% in Track 2 and 10% in Track 3', () => {
  assert.equal(qualityAdj(-10000, 100, 2).qa, -8500);
  assert.equal(qualityAdj(-10000, 0, 2).qa, -10000);
  assert.equal(qualityAdj(-10000, 100, 3).qa, -9000);
  assert.equal(qualityAdj(-10000, 50, 3).qa, -9500);
});

test('a zero reconciliation amount gets no quality adjustment', () => {
  assert.equal(qualityAdj(0, 80, 2).adjPct, 0);
  assert.equal(qualityAdj(0, 80, 2).qa, 0);
});

test('track eligibility: Track 2 starts in PY2 for safety-net or rural; Track 1 after PY1 is safety-net only through PY3; Track 3 always', () => {
  assert.equal(eligible(2, 1, false, false).ok, false);
  assert.equal(eligible(2, 2, false, true).ok, true);
  assert.equal(eligible(2, 2, true, false).ok, true);
  assert.equal(eligible(2, 2, false, false).ok, false);
  assert.equal(eligible(1, 1, false, false).ok, true);
  assert.equal(eligible(1, 2, true, false).ok, true);
  assert.equal(eligible(1, 2, false, false).ok, false);
  assert.equal(eligible(1, 4, true, false).ok, false);
  assert.equal(eligible(3, 5, false, false).ok, true);
});

test('reconciliation: spend at target pays nothing; spend 5% under target pays the gap times episodes', () => {
  const S = state(2); count(S, 'lejr', { '470': 100 });
  let R = E.reconcile(S);
  assert.equal(R.eps, 100); assert.equal(R.recon, 0); assert.equal(R.npra, 0);
  const p = E.price('470', 2); S.cats.lejr.spend = p * 0.95;
  R = E.reconcile(S, { seq: false });
  near(R.recon, p * 0.05 * 100, 'reconciliation');
});

test('the risk multiplier scales the target, not the spend', () => {
  const S = state(2); count(S, 'cabg', { '235': 50 });
  const p = E.price('235', 2); S.cats.cabg.spend = p;
  const R = E.reconcile(S, { risk: 1.06, seq: false });
  near(R.aggT, p * 1.06 * 50, 'aggregated target');
  near(R.aggS, p * 50, 'aggregated spend');
  near(R.recon, p * 0.06 * 50, 'reconciliation');
});

test('Track 1 has no downside: a negative reconciliation floors at zero before quality and limits', () => {
  const S = state(2); count(S, 'bowel', { '329': 40 });
  S.cats.bowel.spend = E.price('329', 2) * 1.2;
  const R1 = E.reconcile(S, { track: 1 });
  assert.ok(R1.recon < 0); assert.equal(R1.base, 0); assert.equal(R1.npra, 0);
  const R3 = E.reconcile(S, { track: 3 });
  assert.ok(R3.npra < 0);
});

test('stop-gain and stop-loss are shares of the aggregated target: Track 1 10% gain, Track 2 5%/5%, Track 3 20%/20%', () => {
  const S = state(2); count(S, 'lejr', { '470': 100 });
  const p = E.price('470', 2);
  S.cats.lejr.spend = p * 0.5;
  let R = E.reconcile(S, { track: 3, cqs: 100, seq: false });
  assert.equal(R.capHit, 'gain'); near(R.npra, 0.20 * R.aggT, 'Track 3 gain');
  R = E.reconcile(S, { track: 1, cqs: 100, seq: false });
  assert.equal(R.capHit, 'gain'); near(R.npra, 0.10 * R.aggT, 'Track 1 gain');
  S.cats.lejr.spend = p * 1.5;
  R = E.reconcile(S, { track: 2, cqs: 0, seq: false });
  assert.equal(R.capHit, 'loss'); near(R.npra, -0.05 * R.aggT, 'Track 2 loss');
  R = E.reconcile(S, { track: 3, cqs: 0, seq: false });
  assert.equal(R.capHit, 'loss'); near(R.npra, -0.20 * R.aggT, 'Track 3 loss');
});

test('the quality adjustment is applied before the stop limits', () => {
  const S = state(2); count(S, 'lejr', { '470': 100 });
  S.cats.lejr.spend = E.price('470', 2) * 0.90;
  const R = E.reconcile(S, { track: 3, cqs: 0, seq: false });
  near(R.qa, R.recon * 0.90, 'CQS 0 withholds 10%');
  assert.equal(R.capHit, null); near(R.npra, R.qa, 'no limit hit');
});

test('low-volume flag: 30 or fewer baseline episodes removes the downside for that category only', () => {
  const S = state(2);
  count(S, 'shfft', { '481': 8 }); S.cats.shfft.spend = E.price('481', 2) * 1.3; S.cats.shfft.lowvol = true;
  count(S, 'lejr', { '470': 100 }); S.cats.lejr.spend = E.price('470', 2) * 0.97;
  const R = E.reconcile(S, { track: 3, seq: false });
  const hip = R.rows.find(r => r.c.key === 'shfft'), joints = R.rows.find(r => r.c.key === 'lejr');
  assert.equal(hip.capped, true); assert.equal(hip.recon, 0);
  near(R.recon, joints.recon, 'only the joint line counts');
});

test('sequestration: 2% comes off positive payments only, after the limits', () => {
  const S = state(2); count(S, 'lejr', { '470': 100 });
  S.cats.lejr.spend = E.price('470', 2) * 0.95;
  const a = E.reconcile(S, { seq: false, cqs: 100 }), b = E.reconcile(S, { seq: true, cqs: 100 });
  near(b.npra, a.npra * 0.98, 'net after sequestration'); near(b.seqAmt, a.npra * 0.02, 'sequestered amount');
  S.cats.lejr.spend = E.price('470', 2) * 1.05;
  assert.equal(E.reconcile(S, { seq: true, track: 3 }).seqAmt, 0);
});

test('the spend-shift option sets spend relative to the risk-adjusted target', () => {
  const S = state(2); count(S, 'lejr', { '470': 10 });
  const R = E.reconcile(S, { shift: 0.05, risk: 1.02, seq: false }); const row = R.rows[0];
  near(row.target, E.price('470', 2) * 1.02, 'target'); near(row.spend, row.target * 1.05, 'spend');
});

test('aggregates equal the sum of the category rows', () => {
  const S = state(5); count(S, 'lejr', { '470': 120, '469': 10 }); count(S, 'cabg', { '236': 30 });
  S.cats.lejr.spend = E.price('470', 5) * 0.98;
  const R = E.reconcile(S, { seq: false }); const sum = k => R.rows.reduce((q, r) => q + r[k], 0);
  near(R.aggT, sum('aggTarget'), 'target'); near(R.aggS, sum('aggSpend'), 'spend'); assert.equal(R.eps, sum('n'));
});

test('mixed MS-DRGs in one category: the regional price is the episode-weighted average', () => {
  const S = state(2); count(S, 'lejr', { '470': 90, '469': 10 });
  const row = E.reconcile(S).rows[0];
  near(row.regional, (90 * E.price('470', 2) + 10 * E.price('469', 2)) / 100, 'weighted price');
});

test('an excluded category contributes nothing', () => {
  const S = state(2); count(S, 'lejr', { '470': 100 }); count(S, 'cabg', { '235': 20 });
  S.cats.cabg.on = false;
  const R = E.reconcile(S); assert.equal(R.eps, 100); assert.equal(R.rows.length, 1);
});

test('levers: unchanged inputs produce no savings', () => {
  const S = state(2); assert.equal(leverSavings(S.levers, 'lejr').total, 0);
});

test('levers: one point of readmission is the readmission cost, times the realization rate unless raw', () => {
  const S = state(2); S.levers.tgt.lejr.ra = S.levers.cur.lejr.ra - 1;
  near(leverSavings(S.levers, 'lejr').ra, 0.01 * S.levers.unit.readmit * 0.6, 'realized');
  near(leverSavings(S.levers, 'lejr', true).ra, 0.01 * S.levers.unit.readmit, 'raw');
});

test('levers: a discharge moved from SNF to home nets out the home health period and outpatient therapy', () => {
  const S = state(2); const u = S.levers.unit, c = S.levers.cur.shfft;
  S.levers.tgt.shfft.snf = c.snf - 10;
  near(leverSavings(S.levers, 'shfft', true).snf, 0.10 * (c.days * u.snfDay - u.hh - u.optx), 'SNF lever');
});

test('levers lower the category spend inside reconciliation when switched on', () => {
  const S = state(2); count(S, 'lejr', { '470': 100 }); S.levers.tgt.lejr.ra = S.levers.cur.lejr.ra - 2;
  const off = E.reconcile(S, { levers: false, seq: false }), on = E.reconcile(S, { levers: true, seq: false });
  near(on.recon, off.recon + leverSavings(S.levers, 'lejr').total * 100, 'lever savings × episodes');
});

test('documented defaults: 60% realization, $1,200 per-episode evidence cap, five categories with CMS discounts', () => {
  const S = state(2);
  assert.equal(S.levers.real, 60);
  assert.equal(ENG.CAP_PER_EPISODE, 1200);
  assert.deepEqual(CATS.map(c => c.key), ['lejr', 'shfft', 'cabg', 'spine', 'bowel']);
  assert.deepEqual(CATS.map(c => c.disc), [2, 2, 1.5, 2, 1.5]);
});
