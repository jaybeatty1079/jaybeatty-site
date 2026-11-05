// Shared helpers for the ride's browser checks: a static server on the peptide-map folder and a headless browser with WebGL.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import {createRequire} from 'node:module'; import {fileURLToPath} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, '..');
const MIME = {'.html': 'text/html', '.json': 'application/json', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png'};
export function serve(port = 0) {
  const srv = http.createServer((req, res) => {
    const f = path.join(root, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
    if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, {'content-type': MIME[path.extname(f)] || 'application/octet-stream'}); fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => srv.listen(port, '127.0.0.1', () => r({srv, url: `http://127.0.0.1:${srv.address().port}/index.html`})));
}
export async function launch() {
  // playwright-core is not a dependency of the site; use the copy the playwright-cli brings, or PLAYWRIGHT_CORE
  const req = createRequire(import.meta.url);
  const core = process.env.PLAYWRIGHT_CORE || path.join(process.env.HOME, '.local/lib/playwright-cli/node_modules/playwright-core');
  const {chromium} = req(core);
  return chromium.launch({channel: process.env.PW_CHANNEL || 'chrome', headless: true, args: ['--ignore-gpu-blocklist']});
}
export async function open(browser, url, width, height, opts = {}) {
  const ctx = await browser.newContext({viewport: {width, height}, deviceScaleFactor: 1, ...opts}), page = await ctx.newPage();
  const errors = []; page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url, {waitUntil: 'load'}); await page.waitForFunction(() => window.ride && window.ride.state, null, {timeout: 60000});
  return {page, ctx, errors};
}
