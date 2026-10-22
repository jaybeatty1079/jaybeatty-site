# Gap-closing plan (queued 2026-10-21, run when the usage window resets)

Checklist source: `data/unverified-checklist.md` (98 flagged fields) plus the unverified tables in each `research/*-notes.md`.
Web search was capped per session during the sweep, so each pass below should lean on direct fetches: openFDA
(api.fda.gov/device/510k.json, /pma.json), SEC EDGAR full-text search (efts.sec.gov/LATEST/search-index?q=...),
company IR pages via the built-in browser (Stryker, Kuros, SI-BONE and Becker's returned 403 to plain fetches),
PubMed and ClinicalTrials.gov tools. Each pass edits its research slice JSON in place, clears `unverified` where
confirmed, keeps `challenge` text, then `build/merge.py` is rerun.

## Pass 1 — SI-joint fusion graft products (edit research/spine.json)
Identify what is actually packed in posterior and lateral SI fusion systems: SI-BONE iFuse (titanium, no graft) vs
iFuse Bedrock Granite / iFuse TORQ, Globus SI-LOK, Orthofix FIREBIRD SI, PainTEQ LinQ (allograft bone), Omnia Medical PsiF,
Aurora Spine SiLO, CornerLoc, Camber Spine Siconus, Spinal Simplicity, Tenon Catamaran; which ship with or recommend
cellular allograft or DBM; the 2024-2026 LCD and CPT changes (27279, 27278 posterior, 0775T) and SI-BONE's cumulative
procedure count from its 10-K. Pair products to application `si-joint-fusion` with tier and grade.

## Pass 2 — ownership, distribution and catalog status (edit all slices)
Confirm from a 2025-2026 primary source: Bio4 Stryker–Osiris/Smith+Nephew supply; DBX MTF–DePuy Synthes; ViviGen
LifeNet–DePuy Synthes; Optium DBM current owner (LifeNet K053098 vs DePuy); Osteoset and Cortoss and Norian current
US catalog status (Stryker, DePuy Synthes); map3 status (RTI Surgical / Montagu); OsteoAMP 510(k) or 361; AlloFuse
361 vs 510(k) by form; chronOS Inject US status (likely ex-US); Cerament V US status; KyphOs FS availability;
Stimulan VG status; Harvest/Terumo BCT 2026; Magellan (Isto) BMAC clearance; Angel bone-marrow 510(k);
PearlMatrix PMA number and Infuse 2026 TLIF supplement number (FDA PMA database: search trade name);
acquisition dates (Osteotech 2010, Orthovita 2011, Wright 2020, SeaSpine–Orthofix 2023, NuVasive–Globus 2023,
Rotation Medical 2017, OP-1 to Olympus 2011); Novosis/DePuy–CGBIO 2026 agreement; NovaBone–Isto 2026; Kuros–Medtronic
agency terms; Celularity Interfyl/Arthrex status after the Dec 2025 FDA letter.

## Pass 3 — blocked pages and evidence fills
Use the built-in browser for: Becker's (Infuse TLIF, PearlMatrix coverage), Stryker biologics catalog, Kuros IR
(MagnetOs clearances, Medtronic agreement), SI-BONE IR, Anthem/Elevance bone graft substitute policy (state-gated;
pick one state), the FDA 2008 cervical BMP Public Health Notification page, CMS FY2027 final rule text for the
level-based fusion DRGs and the antibiotic-eluting void filler retitling, the Peichl 2011 pelvic teriparatide RCT
PMID, Hernigou 2005 union count, Osteogrow EU register results, and pooled nonunion numbers for lateral lumbar
fusion and SI-joint fusion. Fill application `volume_note` fields that cite only trade summaries with the primary NIS
or registry table where one exists.

## After the passes
`/usr/bin/python3 -I build/merge.py` then `/usr/bin/python3 -I build/fda_check.py`; update RESEARCH_SUMMARY.md
"What must be closed" section; then build.
