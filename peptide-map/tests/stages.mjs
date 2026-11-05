// Drives the whole ride in headless Chrome at 1200 px and 375 px, pauses at every stage and checks that the stage's text is whole:
// on screen, inside the stage, fully opaque, not overlapping, not scrolled or clipped, and big enough. Screenshots go to OUT (default ./out).
// Usage: node tests/stages.mjs [compound-id ...]   (default: bpc-157 tb-500 ipamorelin m-selank)
import fs from 'node:fs'; import path from 'node:path';
import {serve, launch, open} from './lib.mjs';
const OUT = process.env.OUT || path.join(path.dirname(new URL(import.meta.url).pathname), 'out'); fs.mkdirSync(OUT, {recursive: true});
const ids = process.argv.slice(2).length ? process.argv.slice(2) : ['bpc-157', 'tb-500', 'ipamorelin', 'm-selank'];
const SIZES = [['1200', 1200, 800], ['375', 375, 812]].filter(([l]) => !process.env.ONLY || process.env.ONLY === l);

// runs in the page: returns a list of problems with the text on screen right now
function audit(tag) {
  const MIN_FONT = 12, MIN_BODY = {1200: 18, 375: 16}, bad = [], st = document.querySelector('#stage').getBoundingClientRect();
  const vis = el => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 2 && r.height > 2 && cs.display !== 'none' && cs.visibility !== 'hidden' ? r : null };
  const boxes = {};
  for (const [name, sel] of [['pinned panel', '#now'], ['window', '.panel.on'], ['pause bar', '#pausebar'], ['door message', '#doors.show .door.r .msg'], ['door name', '#doorName']]) {
    const el = document.querySelector(sel); if (!el) continue; const r = vis(el); if (!r) continue; boxes[name] = r;
    if (r.left < st.left - 1 || r.right > st.right + 1 || r.top < st.top - 1 || r.bottom > st.bottom + 1) bad.push(name + ' leaves the stage');
    if (name !== 'door name' && el.scrollHeight > el.clientHeight + 1 || // a one-line wood-type title: glyph boxes run past the line box, width is what matters
         el.scrollWidth > el.clientWidth + 3) bad.push(name + ' is clipped or scrolls');
    for (let p = el; p && p !== document.body; p = p.parentElement) if (+getComputedStyle(p).opacity < 0.99) bad.push(name + ' is not fully opaque (' + getComputedStyle(p).opacity + ')');
    el.querySelectorAll('*').forEach(c => { if (!c.childNodes.length) return; const own = [...c.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()); if (!own) return; const fs = parseFloat(getComputedStyle(c).fontSize); if (fs < MIN_FONT) bad.push(name + ' text under ' + MIN_FONT + 'px: ' + c.textContent.trim().slice(0, 30) + ' (' + fs + ')') });
  }
  const names = Object.keys(boxes);
  for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) { const a = boxes[names[i]], b = boxes[names[j]]; if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) bad.push(names[i] + ' overlaps ' + names[j]) }
  const body = document.querySelector('#now p'); if (body && parseFloat(getComputedStyle(body).fontSize) < MIN_BODY[innerWidth > 820 ? 1200 : 375]) bad.push('pinned panel body under ' + MIN_BODY[innerWidth > 820 ? 1200 : 375] + 'px');
  const mid = document.getAnimations().filter(a => a.playState === 'running' && a.effect.getComputedTiming().iterations !== Infinity && !a.effect.target.closest('#doors'));
  if (mid.length && tag !== '99-standing') bad.push(mid.length + ' transitions still moving while paused');
  if (document.documentElement.scrollWidth > innerWidth + 1) bad.push('page scrolls sideways');
  return {tag, bad, boxes: Object.fromEntries(Object.entries(boxes).map(([k, r]) => [k, [r.left | 0, r.top | 0, r.width | 0, r.height | 0]]))};
}

const {srv, url} = await serve(); const browser = await launch(); let fails = 0; const report = [];
for (const [label, w, h] of SIZES) for (const id of ids) {
  const {page, ctx, errors} = await open(browser, url, w, h);
  const shoot = async (name, extra) => { const f = path.join(OUT, `${id}-${label}-${name}.png`); await page.screenshot({path: f}); const r = await page.evaluate(audit, name); r.file = f; r.id = id; r.w = w; if (extra) r.note = extra; report.push(r); if (r.bad.length) { fails++; console.log('FAIL', id, label, name, r.bad.join('; ')) } else console.log('ok  ', id, label, name) };
  await page.evaluate(i => window.ride.start(i), id);
  await page.waitForFunction(() => window.ride.state().phase === 'doors'); await page.waitForTimeout(2500);   // the doors, shut, with their words
  await page.evaluate(() => window.ride.pause()); await page.waitForTimeout(200); await shoot('00-doors'); await page.evaluate(() => window.ride.resume());
  if (process.env.DOORS_ONLY) { await ctx.close(); continue }
  const stop = await page.evaluate(i => window.ride.stopStep(i), id);
  for (let k = 0; k < 12; k++) {
    if (stop != null && k > stop) break;
    await page.waitForFunction(k => window.ride.state().shown >= k, k, {timeout: 240000, polling: 'raf'});
    await page.evaluate(() => window.ride.pause()); await page.waitForTimeout(250);
    await shoot(String(k + 1).padStart(2, '0') + '-step');
    await page.evaluate(() => window.ride.resume());
  }
  await page.waitForFunction(() => window.ride.state().readout, null, {timeout: 240000}); await page.waitForTimeout(900);
  await shoot('99-standing'); if (errors.some(e => !/404/.test(e))) { fails++; console.log('FAIL console', id, label, errors) }
  await ctx.close();
}
fs.writeFileSync(path.join(OUT, 'report' + (process.env.ONLY || '') + '.json'), JSON.stringify(report, null, 1)); await browser.close(); srv.close();
console.log(fails ? `${fails} problem(s)` : `all ${report.length} paused stages clean`); process.exit(fails ? 1 : 0);
