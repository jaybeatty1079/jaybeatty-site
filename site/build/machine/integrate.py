"""Puts the pipeline machine under the hero of site/index.html: kit CSS + site palette, the figure, the live script."""
import re, sys
HERE = '/private/tmp/claude-501/-Users-jaybeatty--claude-spares-spare-NpDFW7/53d6da9f-fce1-4cd6-83e3-afe542a07b91/scratchpad/machine/'
SITE = '/Users/jaybeatty/Claude/jaybeatty-site/site/index.html'
frag = open(HERE + 'fragment.html').read()
live = open(HERE + 'live.js').read()
kit = open('/Users/jaybeatty/.claude/skills/anatomy/kit/iso.css').read()
# keep the drawing classes, drop the kit's card, legend and page tokens (the site has its own)
kit = '\n'.join(l for l in kit.split('\n') if not re.match(r'\.iso(-plate|-figure|-legend|-keys|-key|-swatch)|@media \(max-width:560px\)', l))
kit = re.sub(r'\.iso\{.*?\}\n\.iso\[data-theme="light"\]\{.*?\}\n', '', kit, flags=re.S)   # the grey palettes: replaced below
css = """
/* the pipeline machine under the hero: the anatomy kit's drawing classes on the site's own palette */
""" + kit + """
.machine.iso{--anatomy-paper:var(--bg);--anatomy-face:#171326;--anatomy-top:#1c182a;--anatomy-shade-0:#0d0b14;--anatomy-shade-1:#100d19;--anatomy-shade-2:#140f21;--anatomy-shade-3:#181328;
  --anatomy-lit-top:color-mix(in oklab,var(--green) 58%,var(--panel));--anatomy-lit-shade:color-mix(in oklab,var(--green) 34%,var(--surface));
  --anatomy-hi:var(--purple-soft);--anatomy-mid:var(--muted);--anatomy-lo:#4a4266;--anatomy-faint:var(--line);--anatomy-lit:var(--green-soft);--anatomy-dot:var(--fg);
  --anatomy-halo:#000;--anatomy-halo-opacity:.85;--anatomy-weight:.6px;--anatomy-mono:var(--mono);--anatomy-red:#ff6b6b;--anatomy-green:var(--green-soft);--anatomy-blue:#6b9bff}
:root[data-theme="light"] .machine.iso{--anatomy-paper:var(--bg);--anatomy-face:#fff;--anatomy-top:#fff;--anatomy-shade-0:#dfd8ec;--anatomy-shade-1:#e6e0f1;--anatomy-shade-2:#ece7f5;--anatomy-shade-3:#f2eef9;
  --anatomy-lit-top:#cdeedc;--anatomy-lit-shade:#b6e2c8;--anatomy-hi:#2a2340;--anatomy-mid:#7a7294;--anatomy-lo:#b9b1cf;--anatomy-faint:var(--line);--anatomy-lit:var(--green);--anatomy-dot:#2a2340;
  --anatomy-halo:#8a80a6;--anatomy-halo-opacity:.3}
.machine-band{padding-block:clamp(24px,4vw,44px)}
.machine{margin:0}
.machine .iso-svg{width:100%;height:auto;display:block;overflow:visible}
.machine .lamp{fill:var(--anatomy-faint);transition:fill var(--t-base)}
.machine .lamp.on{fill:var(--anatomy-lit)}
.machine .tok .iso-solid:not([data-lit])>.iso-top{fill:var(--anatomy-mid)}
.machine .tok .iso-solid:not([data-lit])>.iso-shade{fill:var(--anatomy-lo)}
.machine-cap{display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:space-between;gap:24px;align-items:baseline;margin-top:8px;font-size:.9rem;line-height:1.5;color:var(--muted)}
.machine-cap .mt{display:inline;flex:1 1 auto;min-width:0}
.machine-cap .mr{flex:0 0 auto}
.machine-cap b{color:var(--fg);font-weight:600}
.machine-cap .mr{font-family:var(--mono);font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;color:var(--green-soft)}
@media(max-width:700px){.machine-cap{flex-direction:column;gap:4px}.machine-cap .mr{white-space:normal}}
"""
s = open(SITE, encoding='utf-8').read()
assert s.count('<figure class="machine iso"') == 0, 'already integrated'
i = s.index('</style>')
s = s[:i] + css + s[i:]
hero_end = s.index('</section>', s.index('<section class="hero">')) + len('</section>')
band = '\n\n<section class="machine-band" aria-label="The pipeline, as a machine">\n' + frag + '\n</section>\n<script>' + live + '</script>\n'
s = s[:hero_end] + band + s[hero_end:]
open(SITE, 'w', encoding='utf-8').write(s)
print('integrated', len(frag), 'chars of figure')
