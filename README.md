# jaybeatty.com

Source for [jaybeatty.com](https://www.jaybeatty.com), the site of Jay Beatty, a healthcare business-development lead, and the five tools built for it between October 18 and November 4, 2026. Everything here was designed and coded by Jay working with Claude (Anthropic's AI assistant) in Claude Code. Jay set the brief for each piece, supplied the facts from his own career and files, reviewed every round in a browser, corrected the copy in his own words, and decided what shipped. Claude did the research passes, the code, the drawings and the testing.

## What is in here

| Folder | What it is | Live |
|---|---|---|
| `site/` | The home page and the program pages: the "Scoreboard" design, every claim paired with a figure built from the real numbers | [jaybeatty.com](https://www.jaybeatty.com) |
| `team-calculator/` | **CMS TEAM Episode Calculator.** What the Transforming Episode Accountability Model pays or costs any of the 721 participant hospitals, from public CMS files only | [/team-calculator/](https://www.jaybeatty.com/team-calculator/) |
| `biologics-atlas/` | **Biologics Atlas.** Every orthobiologic product on the US market or in trials, by surgical application, with its evidence grade and FDA status, on a 3D skeleton | [/biologics-atlas/](https://www.jaybeatty.com/biologics-atlas/) |
| `bonus-lot/` | **Dealer City.** A Section 125 wellness plan explained to a dealership general manager as a city he builds, in WebGL | [/bonus-lot/](https://www.jaybeatty.com/bonus-lot/) |
| `peptide-map/` | **The Peptide Ride**, the **Peptide Supply Map** and a glossary. Where 65 peptides stand under US rules, how each one is made, and who supplies them | [/peptide-map/](https://www.jaybeatty.com/peptide-map/) |

## How it was made

The same loop every time, and it is worth stating because it is where the hours went.

1. **The brief comes from Jay**, usually in an Obsidian note or a long message: what the tool is for, who reads it, what it must never claim.
2. **Research first, with sources.** Before anything was drawn, agents swept the public record and wrote structured notes: 23 research files behind the Atlas, 13 CMS datasets joined behind the calculator, a 69-row federal register behind the ride. Every number carries its source. Where a fact could not be found, the tool says "not found" rather than guessing; that is a standing rule.
3. **A build that can be rebuilt.** Each tool has a script that regenerates the page from its data (`build/assemble.py`, `build.py`, `app/`), and the math that matters sits in its own file with tests (`engine.js` with 22 checks, `model.js` with its own test, `evidence.py` with its grade rule in the docstring).
4. **Verification in a real browser, not a screenshot of the start screen.** Headless Chrome and WebKit rode the roller coaster, played the three missions, scrubbed the sliders, tabbed through the pages and measured frame times at 1280 and 375 before Jay saw a round. The lesson was learned the hard way: static screenshots missed a pole sticking out of every banner, and a hero portrait was built against a decision Jay had already made.
5. **Review rounds in Jay's words.** Jay reviewed on a local server and sent back what was off, often as a paragraph of corrections. Those became commits with his reasons in them: no per-employee dollar figures an employee could read as a promise, healthcare and financial products never in one chart, OP-1 is the brand and BMP-7 the molecule, SOS distributes and makes nothing.
6. **A record.** The calculator has a 22-entry decision record with the alternatives that lost. This README is the record for the rest.

Across the repo: about 90 commits on 12 working days, roughly 15,000 lines of HTML, JavaScript, Python and CSS written for these pages, and about 85,000 lines of structured data assembled from public sources.

## The site (`site/`)

The Scoreboard design: black with a purple bias, green for proof, one committed dark look with a light theme behind a toggle. The home page is a weekly scoreboard of Jay's career: a tile row with sparklines, a buyer matrix (healthcare only, nine buyers by three sectors), a twenty-year gantt by sector, growth multiples by role, a government-contract sequence, and a career road map in three lanes (products carried, territory as reach, team built) drawn from one `ROAD` data object that Jay corrected fact by fact.

What went into it:

- **The pipeline machine.** Under the hero sits an isometric bench machine, 89 solids drawn with an isometric figure kit on the site's own palette. Leads drop from a hopper onto a belt; a gate paddle pushes the ones that do not qualify into a bin; a door slides open for each one that does; a press closes the contract and the lead lights green; it drops into a tray and a counter ticks; a dial reads how full the belt is. It is a time-based loop that stops offscreen, renders one populated still frame under reduced motion, and crops to the belt on phones. Source and a note on rebuilding it are in `site/build/machine/`.
- **A career path that scrubs on scroll.** The road map pins while you scroll; a playhead sweeps 2005 to now, bars grow from their start year, the territory line and team ramps draw, and it reverses on the way back. GSAP ScrollTrigger, self-hosted in `site/vendor/`. Median frame 16.7 ms at both widths.
- **A motion system.** Three durations and two easings as tokens on `:root`, used everywhere; hover lift and focus rings on every control; a mobile menu that morphs from a plus; scroll reveals and count-ups; everything off under `prefers-reduced-motion`.
- **ATCG collateral.** `site/atcg-collateral.html` shows the physician and patient brochures Jay wrote and art-directed for ATCG's field team, panel by panel with the full text, and the malignant hyperthermia anesthesia panel he packaged. The lab's mark (a globe with a helix) is Jay's design.
- **Accessibility and phones.** A skip link, a tab order that reaches the nav before the charts, 44 px targets on touch widths, and at 600 px and below every chart gives way to its table twin.
- **A Netlify contact form** with an inline thanks and a plain-POST fallback.

## The TEAM calculator (`team-calculator/`)

TEAM is a mandatory Medicare bundled-payment model that started January 1, 2026 for 711 hospitals across five surgical episodes. The calculator applies the published reconciliation rules (regional target prices, risk and quality adjustments, stop-gain and stop-loss by track) and shows the estimated net payment, service-line views, post-acute levers and a five-year projection.

- Pick any of the 721 participant hospitals and the page prefills its 2024 Medicare volumes, Care Compare quality measures, price-standardized post-discharge spending, county post-acute market and Medicare Advantage share, and FY2027 cost-report facts, each with its source shown. Six case hospitals, named by type and city, are derived from the same public data.
- `TEAM_Calculator_Model_Spec.md` is the plain-English rulebook: every formula, every source, and what is deliberately left out.
- `build/` holds the scripts: `build_metrics.py` joins 13 public CMS datasets by hospital, `derive.py` compacts them for the page, and `assemble.py` writes `index.html` from `template.html`, `engine.js`, `app.js` and the JSON in `data/`. Raw CMS downloads (about 500 MB) are not in the repo; the scripts re-download them.
- `build/engine.js` is the reconciliation engine on its own: no DOM, no page state. `tests/engine.test.js` runs 22 checks against it (`node --test tests/engine.test.js`, Node 18+, no dependencies): the CMS quality tables, track rules, stop limits, low-volume floor, sequestration and lever math.
- `docs/decisions.md` is the decision record: 22 decisions with the alternatives that lost, a 16-point CFO review, validation and the roadmap. `docs/ARCHITECTURE.md` maps the build. `docs/WRITEUP.md` is the essay on why it was built and what it taught. `map.html` is the 2027 participant map.
- Phone pass: a pinned result strip while you move sliders, charts that scroll inside their own box.

No server, no tracking, no patient data. An independent educational model, not affiliated with or endorsed by CMS.

## The Biologics Atlas (`biologics-atlas/`)

A catalogue of orthobiologics by what the surgeon is treating, with the honest state of the evidence next to every product. `RESEARCH_SUMMARY.md` and `SCHEMA.md` are the record; `data/merge-report.md`, `data/fda-check.md` and `data/unverified-checklist.md` show the checks.

What went into it:

- **Seven parallel research passes** (spine, hip and femur, tibia and knee, foot and ankle, upper extremity, investigational and regulatory, the business layer), then gap passes, a skull and CMF region, and a full repository sweep of the market in eight category passes. The notes are in `research/` (23 files).
- **The backend today:** 85 surgical applications, 369 products (122 on a 510(k), 60 as 361 HCT/Ps, 17 PMA, 2 BLA, 2 NDA, 27 IND or IDE only, 35 unapproved or ex-US), 330 product-to-application pairings each with a tier and an evidence grade, 358 evidence rows with a PMID, NCT, DOI or FDA document, 180 companies named as current owners, and a market layer of shares, leaders and 40 deals. Every CDRH 510(k), PMA and De Novo number was confirmed against openFDA.
- **The evidence rule is on the page.** Grades across the pairings run Level I 62, II 41, III 34, IV 87, V 106: almost half of what is sold rests on case series or nothing, and the app shows it rather than hiding it.
- **The skeleton** is a 2.1 MB glTF derived from BodyParts3D and Z-Anatomy (about 575 structures selected, simplified, layered, symmetrized, quantized), with the licences and every change listed in `MODEL-ATTRIBUTION.md` and reproducible from the tools named there. `app/viewer3d.js` drives it with a pause control; `app/spinefig.js` draws the spine figure; `app/template.html` plus `app.js` assemble `index.html`.

## Dealer City (`bonus-lot/`)

A Section 125 wellness plan explained to a general manager as a game: build the dealer group as a night city in WebGL (three.js), run the payroll, set the pay plan, and watch what the plan adds to store net. The mission, in Jay's words: save the store money without selling a car, more to the bottom line, more on every paycheck, and the GM as the ambassador who takes it to the owner.

What went into it:

- **An engine with a config per industry.** `index.html` is the engine; `sectors.js` holds one block per sector (vocabulary, benchmarks with sources, labels, copy, scene, a real case), picked by `?s=key`, car dealerships first. `SECTORS.md` says how to add one. `model.js` is the math and the share-link validator, checked by `node bonus-lot/test.mjs`.
- **The city.** Lit towers with neon roof edges, moving traffic, street lamps and palms, the dealership on the center block with a glass showroom and brand pennants, a drone camera with a cut per mission, bloom, a lighter render on phones. Cars are Kenney's Car Kit (CC0) in `models/`, repainted at load.
- **The story and the bay.** "How it works" is a forty-second truck story with no figures, each caption held six and a half seconds, the camera closing on each vehicle. The service bay parks the same three vehicles (the owner's car, the employees' car, the administrator's motorcycle) and lights the one each answer is about; major medical pulls in for the overlap and cost beats; a police car for compliance. Ten common questions, answered in Jay's own words from his sales calls. Choosing a new question interrupts the one playing.
- **The math stays honest.** Five plan levels with the plan's published per-employee figures, the admin fee out of the saving, workers' comp left out on purpose, claims savings for self-funded groups shown as their own tile and never folded into the tax number, and no dollar figure anywhere that belongs to an employee. One anonymous real group from its own invoices, never the case-study projections.
- **A sharable owner page** carried in the link, printable, with the GM's bonus removed.

Illustrative only; not affiliated with any video game or its publisher.

## The Peptide Ride, the map and the glossary (`peptide-map/`)

Order a peptide at a counter, the doors open, and you ride a roller coaster through the Pennsylvania hills while twelve windows show how the compound is made (sequence, raw materials, synthesis, cleavage, purification, testing, the facility, fill and finish, release, prescribing and dispensing) and whether US rules allow each step. At the end, the compound's standing: dated, sourced, colour-coded by Jay's rule (green with solid human evidence and oversight, yellow thinner evidence on FDA's radar, orange some human evidence and nobody looking, red no human evidence). The weather follows the evidence. Behind it, the map: every registered 503B outsourcing facility, the chronology, the supply routes and the court record.

What went into it:

- **The register.** 69 dated rows: FDA's 503A and 503B bulks lists and their category changes, the advisory committee votes, the GLP-1 shortage decisions, the HHS draft enforcement-discretion policy of October 30, 2026 (comments close November 13), warning letters and seizures, each with its source link. `build.py` builds the chronology from it and refuses to build if a row it names is missing.
- **100 registered 503B facilities** geocoded from FDA's list with their inspection flags, **12 court rulings, indictments and settlements** with what each one tells you, and **seven documented supply routes** from China, Europe and Mexico, each graded by how well the documents support it.
- **65 compounds.** Fifteen named by the regulators are written by hand from the register. Fifty more are graded by `tools/evidence.py` from PubMed (human studies and clinical trials), ClinicalTrials.gov, openFDA labels, Europe PMC and OpenAlex, with the top papers linked; the grade rule is a count, not a verdict, and it says so. Every standing card links the exact searches behind its counts so a reader can check the decision. The named fifteen now carry the same counts through `tools/named_evidence.py`. OpenAlex's free daily budget cut the last re-run short; `tools/refill_openalex.py` fills the gap after the reset and the cards say "not counted" until then rather than showing an old number.
- **The ride.** First-person three.js on a track of three lifts and four gates each, a camera roll soft-capped at 15 degrees with a dwell before it changes side, banners that face the cart, a terminal at the end, twelve small worlds rendered into the windows by the same renderer, five weather states, sunny to blizzard, a counter with two menus and a "Board now" skip. Verified by riding it in headless Chrome at 1280 and 375 on three synthesis routes.
- **Where the data lives.** The register, the facility list and the research notes live in Jay's vault, outside this repo; `build.py` reads them and inlines the result so each page is one file. The base maps are in `data/`. `assets/LICENSES.md` credits the models.

Maps public guidance as of its date. Not legal advice, and no claim that any peptide is safe or works. Tolerated is never approved.

## Timeline

| Date | Commits | What landed |
|---|---|---|
| Oct 18 to 19 | 12 | Site redesign goes live; calculator and Atlas take shape |
| Oct 21 to 23 | 24 | Atlas research sweeps and the 3D skeleton; ATCG collateral; career road map; pill nav |
| Oct 27 to 31 | 9 | Dealer City: the city, the missions, the truck, the questions |
| Nov 1 to 2 | 30 | The Peptide Ride and the map; Dealer City rounds; contact form; icons |
| Nov 3 to 4 | 15 | Phone-width pass; motion system; Jay's review rounds on all five; the pipeline machine; career scroll story; evidence links on every ride card |

## Disclaimer

The calculator, the Atlas, Dealer City and the ride are independent educational tools built from public documents and Jay's own experience. None is affiliated with or endorsed by CMS, FDA, HHS or any company named in them. Use the primary sources for decisions.

## License

Code and text © 2026 Jay Beatty. Shared for reading and learning; please ask before reusing. Third-party models and data keep their own licences, listed in `biologics-atlas/MODEL-LICENSE.md`, `biologics-atlas/MODEL-ATTRIBUTION.md`, `bonus-lot/models/` and `peptide-map/assets/LICENSES.md`.
