// Pause freezes the ride's clock (and with it the camera, weather, windows and the door hold); Resume restores it.
// Run: node tests/pause.test.mjs   (needs network for three.js and fonts, and Chrome; see lib.mjs)
import assert from 'node:assert/strict';
import {serve, launch, open} from './lib.mjs';
const {srv, url} = await serve(), browser = await launch();
const S = page => page.evaluate(() => ({...window.ride.state(), clock: window.ride.clock(), paused: window.ride.paused(), label: document.querySelector('#pauseBtn').textContent, tag: !document.querySelector('#pausedTag').hidden, live: document.querySelector('#live').textContent, bar: !document.querySelector('#pausebar').hidden, doorsOpen: document.querySelector('#doors').classList.contains('open'), step: document.querySelector('#now').textContent}));
try {
  const {page, errors} = await open(browser, url, 1200, 800);
  // not riding: Space does nothing and there is no Pause control
  await page.keyboard.press('Space'); let s = await S(page); assert.equal(s.paused, false); assert.equal(s.bar, false);
  await page.evaluate(() => window.ride.start('bpc-157')); await page.waitForFunction(() => window.ride.state().phase === 'doors');
  // 1. at the doors: Space pauses, and the 6.5 s hold does not run out while paused
  await page.waitForTimeout(500); await page.keyboard.press('Space'); s = await S(page);
  assert.equal(s.paused, true); assert.equal(s.label.startsWith('Resume'), true); assert.equal(s.tag, true); assert.match(s.live, /^Paused/);
  const c0 = s.clock; await page.waitForTimeout(8000); s = await S(page);
  assert.equal(s.clock, c0, 'clock moved while paused'); assert.equal(s.phase, 'doors'); assert.equal(s.doorsOpen, false, 'doors opened while paused');
  await page.keyboard.press('Space'); await page.waitForTimeout(700); s = await S(page);
  assert.equal(s.paused, false); assert.match(s.live, /^Resumed/); assert.ok(s.clock > c0 + 300, 'clock did not restart'); assert.equal(s.label.startsWith('Pause'), true);
  // 2. on the lift: the button pauses; camera position, speed, clock and the step's text stay put; Resume moves them again
  await page.waitForFunction(() => window.ride.state().shown >= 0, null, {timeout: 120000}); await page.waitForTimeout(400);
  await page.click('#pauseBtn'); const a = await S(page); assert.equal(a.paused, true);
  await page.waitForTimeout(1500); const b = await S(page);
  assert.equal(b.clock, a.clock); assert.equal(b.t, a.t, 'cart moved while paused'); assert.equal(b.step, a.step); assert.equal(b.phase, a.phase);
  await page.click('#pauseBtn'); await page.waitForTimeout(1000); const d = await S(page);
  assert.equal(d.paused, false); assert.ok(d.clock > a.clock + 500, 'clock did not resume'); assert.ok(d.t > a.t, 'cart did not resume');
  // 3. the ride cannot be left paused: starting over clears it
  await page.evaluate(() => window.ride.pause()); await page.evaluate(() => window.ride.start('tb-500')); s = await S(page); assert.equal(s.paused, false);
  assert.deepEqual(errors.filter(e => !/404/.test(e)), []);
  console.log('pause: freezes the clock, the cart and the door hold; resume restores them');
} catch (e) { console.error('FAIL', e.message); process.exitCode = 1 } finally { await browser.close(); srv.close() }
