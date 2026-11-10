/* Iomist tool: logic only (no drawing). Two parts:
   1. Readiness: answers -> FDA readiness and per-buyer readiness, with gaps.
   2. Trace: a seeded farm-to-store network and the same complaint run without and with lot records.
   Every count the trace returns is an ILLUSTRATION driven by the viewer's inputs, never a measurement. */
const IOMIST_MODEL = (function (D) {
  const SCORE = { yes: 1, partly: 0.5, no: 0 };
  const q = id => D.questions.find(x => x.id === id);

  function daysUntil(dateStr, today) {
    return Math.round((Date.parse(dateStr) - Date.parse(today)) / 86400000);
  }

  // ctx: { crop: id, size: 'under25'|'to250'|'over250' }
  function fdaApplies(ctx) {
    const crop = D.crops.find(c => c.id === ctx.crop);
    if (!crop) return { applies: false, reason: 'Pick a crop first.' };
    if (!crop.listed) return { applies: false, reason: 'This crop is not on FDA\'s Food Traceability List. FDA\'s rule does not cover it; many buyers still ask for lot-level data.' };
    if (ctx.size === 'under25') return { applies: false, reason: 'Farms with produce sales of $25,000 or less a year are exempt from FDA\'s rule.' };
    return { applies: true, reason: null };
  }

  function tally(ids, answers) {
    let met = 0, total = 0; const gaps = [];
    for (const id of ids) {
      const a = answers[id];
      if (a === 'na') continue;
      total++;
      if (a === undefined) { gaps.push({ id, answer: 'unanswered' }); continue; }
      met += SCORE[a];
      if (a !== 'yes') gaps.push({ id, answer: a });
    }
    return { met, total, pct: total ? Math.round(100 * met / total) : null, gaps };
  }

  function scoreFda(answers, ctx) {
    const gate = fdaApplies(ctx);
    if (!gate.applies) return { applies: false, reason: gate.reason, met: 0, total: 0, pct: null, gaps: [] };
    const ids = D.questions.filter(x => x.kind === 'fda').map(x => x.id);
    return Object.assign({ applies: true, reason: null, enforcementNotBefore: D.fda.enforcementNotBefore }, tally(ids, answers));
  }

  function scoreBuyer(buyerId, answers, today) {
    const b = D.buyers.find(x => x.id === buyerId);
    const base = { id: b.id, label: b.label, status: b.status, text: b.text, source: b.source, date: b.date, dateNote: b.dateNote };
    if (b.status === 'not_published' || !b.items.length) return Object.assign(base, { pct: null, met: 0, total: 0, gaps: [], dateStatus: 'Not published' });
    const t = tally(b.items, answers);
    const dateStatus = !b.date ? 'No date published' : daysUntil(b.date, today) <= 0 ? 'In effect' : 'In ' + daysUntil(b.date, today) + ' days';
    return Object.assign(base, t, { dateStatus, general: !!b.general });
  }

  function readiness(answers, ctx, buyerIds, today) {
    return { fda: scoreFda(answers, ctx), buyers: buyerIds.map(id => scoreBuyer(id, answers, today)) };
  }

  /* ---------- Trace ---------- */
  function rng(seed) { // mulberry32
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }

  // p: { lotsPerDay, casesPerLot, windowDays, distributors, stores, seed }
  function buildNetwork(p) {
    const R = rng(p.seed || 1);
    const fields = Math.max(2, Math.min(20, Math.round(p.lotsPerDay / 2)));
    const lots = [], cases = [];
    for (let day = 0; day < p.windowDays; day++) for (let i = 0; i < p.lotsPerDay; i++) {
      const lot = { id: 'L' + day + '-' + i, day, field: i % fields, dists: [] };
      const n = R() < 0.35 ? 2 : 1; // a lot goes to one or two distributors
      while (lot.dists.length < n) { const d = Math.floor(R() * p.distributors); if (!lot.dists.includes(d)) lot.dists.push(d); }
      lots.push(lot);
      for (let c = 0; c < p.casesPerLot; c++) {
        const dist = lot.dists[Math.floor(R() * lot.dists.length)];
        const served = []; // stores a distributor serves: store s is served by s % D, and every third store also by the next one
        for (let s = 0; s < p.stores; s++) if (s % p.distributors === dist || (s % 3 === 0 && (s + 1) % p.distributors === dist)) served.push(s);
        cases.push({ lot: lot.id, dist, store: served[Math.floor(R() * served.length)] });
      }
    }
    return { lots, cases, fields, params: p };
  }

  /* One complaint: a case from the last harvest day. Same complaint, two ways.
     Without lot records the store's paper names only the distributor(s) and the date, so nothing links the case to a lot.
       paper: cannot rule anything out in the window -> every lot in the window is suspect.
       spreadsheet / erp: the distributor\'s name narrows it to lots that went to that distributor in the window
                          (an ERP lot record starts at receiving, so it adds no field link).
     With a scanned clamshell the code names the lot. */
  function runDrill(net, tracking, windowBack) {
    const p = net.params, last = p.windowDays - 1;
    const lastCases = net.cases.filter(c => net.lots.find(l => l.id === c.lot).day === last);
    const complaint = lastCases[Math.floor(rng((p.seed || 1) + 7)() * lastCases.length)];
    const truthLot = net.lots.find(l => l.id === complaint.lot);
    const inWindow = l => l.day >= last - (windowBack == null ? 2 : windowBack);
    const storeDists = [...new Set(net.cases.filter(c => c.store === complaint.store && inWindow(net.lots.find(l => l.id === c.lot))).map(c => c.dist))];
    const lane = suspects => {
      const ids = new Set(suspects.map(l => l.id));
      return { lots: suspects.length, cases: net.cases.filter(c => ids.has(c.lot)).length, fields: new Set(suspects.map(l => l.field)).size, lotIds: [...ids] };
    };
    const windowLots = net.lots.filter(inWindow);
    // pallet: a case- or pallet-level system knows which pallets went to the delivering distributor; the single pack carries no code, so the link stops there
    const pallet = tracking === 'pallet';
    const without = tracking === 'paper' ? windowLots : pallet ? windowLots.filter(l => l.dists.includes(complaint.dist)) : windowLots.filter(l => l.dists.some(d => storeDists.includes(d)));
    return {
      complaint, truthLot, storeDists,
      without: Object.assign(lane(without), { steps: pallet ? ['Store gives its invoice: a distributor and a date, no lot', 'The system lists every pallet shipped to that distributor', 'Cases came off the pallet there: the record stops', 'The clamshell has no code of its own to match', 'Pull every lot that went to that distributor'] : ['Store gives its invoice: a distributor and a date, no lot', 'Ask each distributor which lots it received', 'Distributor cannot link outbound cases to lots', 'Ask the grower to match harvest records', 'Cannot prove which fields: pull the whole window'] }),
      with: Object.assign(lane([truthLot]), { steps: ['Scan the clamshell: its code names the lot', 'Lot record: field, harvest date, packing and shipping as recorded', 'Pull that lot only', 'Everything else keeps shipping'] }),
      totalCasesInWindow: net.cases.filter(c => inWindow(net.lots.find(l => l.id === c.lot))).length
    };
  }

  /* ---------- Buyer layers and doors ----------
     Every 'covers' / 'records' mark in data.js is the author's working assumption about Iomist.
     "Today" uses the viewer's readiness answers when given; otherwise a labeled illustration from how they track today. */
  const TECH = r => r.iomist === 'covers' || r.iomist === 'records';
  const PRESET = { paper: { data: 0, label: 0, ship: 0, trace: 0 }, spreadsheet: { data: .5, label: 0, ship: .5, trace: .5 }, erp: { data: .5, label: 0, ship: .5, trace: .5 }, pallet: { data: .5, label: .5, ship: .5, trace: .5 }, scanning: { data: 1, label: 1, ship: 1, trace: 1 } };
  function layerReqs(buyerIds, industry, stop) {
    return D.reqs.filter(r => (buyerIds.includes(r.buyer) || (industry && r.buyer === 'industry')) && (!stop || r.stop === stop));
  }
  function todayScore(r, answers, tracking) {
    if (!TECH(r)) return null;
    const a = r.q && answers[r.q];
    if (a === 'na') return null;
    if (a !== undefined) return SCORE[a];
    if (r.kind === 'audit') return null; // how you track does not say whether you are audited
    return (PRESET[tracking] || PRESET.paper)[r.kind] ?? 0;
  }
  function doors(buyerIds, answers, tracking, industry) {
    const ids = buyerIds.concat(industry ? ['industry'] : []);
    return ids.map(id => {
      const b = D.buyers.find(x => x.id === id) || { id, label: id === 'fda' ? D.fdaBuyer.label : D.industry.label }, rs = D.reqs.filter(r => r.buyer === id), tech = rs.filter(TECH);
      const vals = tech.map(r => todayScore(r, answers, tracking)).filter(v => v !== null);
      return { id, label: b.label, published: rs.filter(r => r.kind !== 'none').length, tech: tech.length, own: rs.filter(r => r.iomist === 'own').length, notFound: rs.filter(r => r.kind === 'none').length,
        todayPct: vals.length ? Math.round(100 * vals.reduce((s, v) => s + v, 0) / vals.length) : null, unknown: tech.length - vals.length, withPct: tech.length ? 100 : null };
    });
  }
  function matrix(buyerIds, industry) {
    const ids = buyerIds.concat(industry ? ['industry'] : []);
    return Object.keys(D.topics).map(kind => {
      const cells = {}; ids.forEach(id => cells[id] = D.reqs.filter(r => r.buyer === id && r.kind === kind).length);
      return { kind, label: D.topics[kind], cells, buyers: ids.filter(id => cells[id] > 0).length };
    }).filter(r => r.buyers > 0);
  }

  function monthsDays(from, to) { // whole months and leftover days from one date to a later one
    const a = new Date(from + 'T00:00:00Z'), b = new Date(to + 'T00:00:00Z');
    let m = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth()), d = b.getUTCDate() - a.getUTCDate();
    if (d < 0) { m--; d += new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), 0)).getUTCDate(); }
    return { months: m, days: d };
  }
  return { monthsDays, daysUntil, fdaApplies, scoreFda, scoreBuyer, readiness, buildNetwork, runDrill, question: q, layerReqs, todayScore, doors, matrix };
})(typeof require !== 'undefined' ? require('./data.js') : IOMIST_DATA);

if (typeof module !== 'undefined') module.exports = IOMIST_MODEL;
