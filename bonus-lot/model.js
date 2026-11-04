/* The program's math and the share-link validator. Shared by index.html and test.mjs.
   Sector-specific numbers come in through the sector config; nothing here knows what a "store" is. */
(function (root) {
  // Contribution levels as published in the decks on file (contribution, admin fee). Edit here when the rate sheet changes.
  // Five levels, $40 admin each (Jay, 2026-11-03: 1600, 1400, 1200 on top, 1000 and 675 below; there is no 1500 plan). $1,600 is $82.40 net per enrolled employee per month; the default is 1400 so a GM need not pick.
  const PLANS = [{ c: 1600, admin: 40 }, { c: 1400, admin: 40 }, { c: 1200, admin: 40 }, { c: 1000, admin: 40 }, { c: 675, admin: 40 }];
  const FICA = 0.0765;
  const STATES = 'AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY'.split(' ');
  const NOTAX = new Set(['AK', 'FL', 'NV', 'NH', 'SD', 'TN', 'TX', 'WA', 'WY']);
  const MAX_STORES = 30, MAX_EMP = 2000;

  const num = (v, lo, hi, d) => { v = +v; return Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d; };
  const oneOf = (v, list, d) => list.includes(v) ? v : d;

  function defaults(sector) {
    const b = sector.bench;
    return { stores: [{ brand: sector.labels[0][0], emp: sector.sizes.emp, state: sector.sizes.state }], qual: 80, plan: PLANS[1].c, hp: 'insured', cost: 9000, defl: 3, scope: 'store', mode: 'all', share: 5, rpe: b.rpe[0], margin: b.margin[0], unit: b.unit[0] };
  }

  /* Takes anything (a parsed share link) and returns a state every field of which is on the sector's whitelists and inside its ranges. Never throws. */
  function sanitize(o, sector) {
    const d = defaults(sector), b = sector.bench, names = sector.labels.map(l => l[0]);
    o = (o && typeof o === 'object') ? o : {};
    const stores = (Array.isArray(o.stores) ? o.stores : []).slice(0, MAX_STORES).map(st => {
      st = (st && typeof st === 'object') ? st : {};
      return { brand: oneOf(st.brand, names, names[0]), emp: Math.round(num(st.emp, 1, MAX_EMP, sector.sizes.emp)), state: oneOf(st.state, STATES, sector.sizes.state) };
    });
    return {
      stores: stores.length ? stores : d.stores,
      qual: num(o.qual, 40, 100, 80),
      plan: oneOf(+o.plan, PLANS.map(p => p.c), PLANS[1].c),
      hp: oneOf(o.hp, ['insured', 'level', 'self'], 'insured'),
      cost: num(o.cost, 3000, 25000, 9000),
      defl: num(o.defl, 0, 15, 3),
      scope: oneOf(o.scope, ['store', 'group'], 'store'),
      mode: oneOf(o.mode, ['all', 'above'], 'all'),
      share: num(o.share, 1, 40, 5),
      rpe: num(o.rpe, b.rpe[1], b.rpe[2], b.rpe[0]),
      margin: num(o.margin, b.margin[1], b.margin[2], b.margin[0]),
      unit: num(o.unit, b.unit[1], b.unit[2], b.unit[0])
    };
  }

  function model(S) {
    const p = PLANS.find(x => x.c === S.plan) || PLANS[0];
    const per = p.c * FICA - p.admin;                       // the plan's published per-employee monthly figure
    const margin = Math.max(0.1, S.margin) / 100, unit = Math.max(1, S.unit), rpe = Math.max(1, S.rpe);
    const stores = S.stores.map(st => { const enrolled = Math.round(st.emp * S.qual / 100), lift = enrolled * per * 12, rev = st.emp * rpe, net = rev * margin; return { ...st, enrolled, lift, rev, net }; });
    const sum = k => stores.reduce((a, x) => a + x[k], 0);
    const g = { emp: sum('emp'), enrolled: sum('enrolled'), lift: sum('lift'), net: sum('net'), rev: sum('rev') };
    const my = stores[0], base = S.scope === 'group' ? g : my;
    const units = base.lift / margin / unit, bonusDelta = base.lift * S.share / 100;
    const claims = S.hp === 'insured' ? 0 : g.enrolled * S.cost * S.defl / 100;
    const unitsOf = lift => lift / margin / unit;
    return { per, fica: p.c * FICA, admin: p.admin, stores, g, my, base, units, unitsOf, bonusDelta, claims };
  }

  const api = { PLANS, FICA, STATES, NOTAX, MAX_STORES, MAX_EMP, defaults, sanitize, model };
  root.BonusModel = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
