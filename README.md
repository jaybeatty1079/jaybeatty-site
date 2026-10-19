# jaybeatty.com

Source for [jaybeatty.com](https://www.jaybeatty.com), the personal site of Jay Beatty, a healthcare business-development lead, plus the projects built for it. Everything here was designed and coded by Jay working with Claude (Anthropic's AI assistant) in Claude Code, with Jay directing the work, checking the numbers, and deciding what shipped.

## What is in here

| Folder | What it is |
|---|---|
| `site/` | The live site: the "Scoreboard" design (black, deep purple and green) with the home page, three program explainers (Section 125 wellness plans, deferred compensation, the No Surprises Act), favicon, robots and sitemap. Static HTML; photos are inlined so each page is one file. |
| `team-calculator/` | **CMS TEAM Episode Calculator.** A single-page estimator of what the Transforming Episode Accountability Model pays or costs a hospital, built entirely from public CMS files. |

## The TEAM calculator

TEAM is a mandatory Medicare bundled-payment model that started January 1, 2026 for 711 hospitals across five surgical episodes. The calculator applies the published reconciliation rules (regional target prices, risk and quality adjustments, stop-gain and stop-loss by track) and shows the estimated net payment, service-line views, post-acute levers, and a five-year projection.

- Pick any of the 721 participant hospitals and the page prefills its 2024 Medicare volumes, Care Compare quality measures, price-standardized post-discharge spending, county post-acute market and Medicare Advantage share, and FY2027 cost-report facts, each with its source shown.
- Six case hospitals, named by type and city, are derived from the same public data.
- `TEAM_Calculator_Model_Spec.md` is the plain-English rulebook: every formula, every source, and what is deliberately left out.
- `build/` holds the scripts: `build_metrics.py` joins 13 public CMS datasets by hospital, `derive.py` compacts them for the page, and `assemble.py` writes `index.html` from `template.html`, `app.js` and the JSON in `data/`.

Raw CMS downloads (about 500 MB of Care Compare, cost report and claims files) are not in the repo; the scripts re-download them from data.cms.gov.

Open `team-calculator/index.html` in a browser to use it. No server, no tracking, no patient data.

## Disclaimer

The calculator is an independent educational model built from public CMS documents. It is not affiliated with or endorsed by CMS. Use CMS's own target price and reconciliation reports for decisions.

## License

Code and text © 2026 Jay Beatty. Shared for reading and learning; please ask before reusing.
