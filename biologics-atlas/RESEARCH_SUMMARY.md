# Biologics Atlas — research sweep summary (2026-10-21; gap passes and skull region 2026-10-22)

Seven parallel research passes (spine, hip and femur, tibia and knee, foot and ankle, upper extremity, investigational and regulatory, business layer) wrote schema-shaped JSON plus notes into `research/`. `build/merge.py` merged them into `data/applications.json` and `data/products.json`; `build/fda_check.py` checked every cited FDA number against openFDA.

## What the backend holds now

| Item | Count |
|---|---|
| Surgical applications (spine 10, hip/femur 12, tibia 11, foot/ankle 13, upper extremity 15, skull and CMF 11, general 2) | 73 |
| Products (established 71, emerging 6, investigational 22, off-market 2, withdrawn 3) | 104 |
| Product-to-application pairings, each with tier and evidence grade | 330 |
| Evidence rows with PMID, NCT, DOI or FDA document | 358 |
| FDA 510(k), PMA and De Novo numbers cited and confirmed in openFDA | all CDRH numbers (CBER BK-series not checkable) |
| Companies in the business layer | 32 |
| Reimbursement code rows (MS-DRG, CPT, HCPCS, ICD-10-PCS) | 33 |
| Payer and Medicare policies summarized | 9 |

Evidence grades across the 330 pairings: Level I 62, II 41, III 34, IV 87, V 106. Almost half of everything sold rests on case series or nothing. That is the honest picture and the app should show it.

## The market as it stands today

**Spine is where the real evidence and the real money are.** The PMA tier doubled in 16 months: Cerapedics PearlMatrix (P-15L) was approved June 2025 for single-level TLIF on a 290-patient RCT (fusion 84% vs 59% for autograft) and expanded to ALIF, PLIF, OLIF and LLIF in January 2026. Medtronic Infuse gained a one- and two-level TLIF indication in February 2026 on a 493-patient trial whose results are not yet published, and CMS gave it a new-technology add-on payment from October 2026. i-FACTOR (2015 PMA for ACDF) remains the third PMA product. Kuros MagnetOs is the emerging synthetic with a real RCT (100-patient intra-patient design, 79% vs 47% per-side CT fusion); Kuros is independent, with Medtronic as its exclusive US spine sales agent since January 2025, and its 2025 revenue grew 72%.

**Cellular allografts are a large market with no comparative trial.** Trinity, Osteocel, ViviGen, OsteoAMP, Bio4 and map3 have one single-arm sponsor trial, one matched study showing ViviGen equals DBM, and payers that call them investigational. MTF Biologics is single-source for Orthofix Trinity through 2032 and supplies DBX to DePuy Synthes. The FDA reclassified Celularity's Interfyl as an unlicensed biologic in December 2025 on the strength of its distributor's marketing, which is the regulatory risk hanging over this whole category.

**Trauma is a hardware market with a few biologic pockets.** Hip fracture has no Level I biologic adjunct; the industry RCTs of teriparatide and romosozumab for hip fracture healing were negative, and the only Level I win is zoledronate for preventing the next fracture. Tibial plateau void fill is the one trauma application with product-versus-autograft RCT data. The 2004 Infuse open-tibia label rests on the BESTT trial from the unreamed-nail era; the reamed-nail trial failed. OP-1 was withdrawn in 2014. Distal radius void fill is dead on evidence: three negative RCTs with volar plating and two osteotomy trials showing the void can be left empty. Humeral nonunion, the classic off-label BMP use, has a negative 2024 meta-analysis.

**The one trauma growth franchise is infection.** Bonesupport's Cerament G is the only US-authorized antibiotic-eluting void filler (De Novo May 2022, open fractures added by 510(k) March 2024 even though the FORTIFY RCT missed its endpoint). CMS followed with a new-technology add-on payment from October 2025 and an FY2027 MS-DRG reassignment that puts antibiotic-eluting void filler into the MCC tier of eight DRGs. US Cerament G sales grew 84% in a quarter. Cerament V's De Novo is still pending.

**Foot and ankle has the only labeled growth factor outside spine.** Augment (rhPDGF, PMA 2015, now Stryker) is the only osteoinductive product labeled for hindfoot and ankle fusion, but both arms of its pivotal trial fused only 61 to 66% on CT at six months. Charcot and tibiotalocalcaneal fusion (27% nonunion) are where biologics are used heavily on thin data. A 2026 series of 227 cases found no union difference with or without graft.

**Investigational tier.** The FDA's list of approved cellular and gene therapy products (54 as of September 2026) contains no bone, fracture or fusion product. Mesoblast rexlemestrocel-L for degenerative disc pain is one confirmatory trial from a BLA (topline mid-2027). DiscGenics started Phase 3 in January 2026. Novadip NVD-003 has RMAT status for congenital pseudarthrosis of the tibia. ALLOB and Kuros Fibrin-PTH are dead. No exosome product is approved for any indication, and the FDA's 2025 to 2026 letters say the marketed "exosome" products are not even made by a process that isolates exosomes. PRP kits are cleared only to mix with bone graft, so PRP injections are off-label for the device.

## Corrections to assumptions I made in the briefs
- Globus did not acquire Kuros. Globus bought Nevro. Kuros is independent with a Medtronic sales agency.
- The spine MS-DRG family I named (453 to 460) is retired; FY2027 uses a level-based set (402, 426 to 430, 447 to 451, 456 to 458, 471 to 473, new 523 to 525).
- The BESTT trial PMID in the brief was wrong; the correct one is 12473698.
- Traumacem V+ is PMMA, labeled only for hip-nail augmentation, not a calcium phosphate or a proximal humerus product.
- Locate Bio's LDGraft trial is ALIF, not TLIF. "Isto/Integra" conflated IsoTis (Accell, now Orthofix) with Isto Biologics.
- No Infuse C-code exists; C9359 and C9362 are Integra Mozaik. C1734 was Augment's pass-through (2020 to 2022). C1602 for antimicrobial-eluting void filler is the only live orthobiologic pass-through in CY2026.

## Skull and craniomaxillofacial region (2026-10-22)
Added at Jay's request as region `skull-cmf`: 11 applications (cranioplasty, burr hole and craniotomy gap, skull base and frontal sinus, craniosynostosis, orbital fracture, midface fracture, mandible fracture, mandibular continuity defect, alveolar cleft, sinus and ridge augmentation, periodontal intrabony) and 22 products, 12 of them new (BoneSource, DirectInject, Mimix, Montage XT, Kryptonite, TnR cranial implant, Osteopore PCL, OsteoVation, GEM 21S, autologous bone flap as the benchmark, EpiBone, Tetranite). Every US cranial cement is a 510(k) under product code GXP with a 25 cm2 ceiling in most labels. Infuse's dental indication (P050053, sinus and extraction socket) is the only on-label growth factor in the head; cleft use is off-label. The moving category is 3D-printed PCL scaffolds (TnR cleared July 2026, no size ceiling) and Abyrx's cement clearances. Kryptonite was recalled in 2012. Notes: `research/skull-cmf-notes.md` (16 unverified items, mainly current availability of BoneSource, Mimix and the Norian CRS line).

## Gap passes (2026-10-22)
Three follow-up passes closed most of the open items. Logs: `research/pass2-ownership-log.md`, `research/pass3-blocked-pages.md`, the Pass 1 section of `research/spine-notes.md`; patches in `research/pass1-patch.json` and `research/pass3-patch.json`, applied with `build/apply_patch.py`.

**SI-joint fusion is now covered.** Six posterior intra-articular allograft products added (PainTEQ LinQ, SI-BONE iFuse INTRA, Aurora SiLO, CornerLoc, Omnia PsiF, Vyrsa Pro), all 361 tissue products, grade IV at best. The lateral transfixing systems (iFuse family, SI-LOK, FIREBIRD SI, Rialto, Siconus, Catamaran) are titanium with no branded biologic; INSITE, iMIA and SALLY used no graft. Four Medicare contractors (CGS, Noridian, Palmetto, 2025) now non-cover SI arthrodesis without a transfixing device, which is pushing the posterior segment back to metal. CPT 27278 is Category I since 2024. SI-BONE: over 140,000 cumulative procedures and $200.9M 2025 revenue per its 10-K. No vendor discloses its tissue bank, and no cellular allograft or DBM brand is confirmed for SI fusion.

**Ownership and status corrections (pass 2, 57 of 66 items resolved).** map3 was discontinued in 2018 (status withdrawn). Norian is still sold by DePuy Synthes (Norian Putty leaflet dated September 2026), so it is established, not off-market. Optium DBM is LifeNet's (K053098), not DePuy's. MTF added Kolosis BIO as a second DBX distributor in March 2025, so DePuy exclusivity cannot be claimed. PearlMatrix is PMA P240001 (approved 2025-06-18; expansion S001 approved 2025-12-11, announced January 2026). The Infuse TLIF indication is supplement P000058/S096 (2026-02-13). Cerament V's De Novo is still under review as of the Q3 2026 report. Stimulan VG is investigational (Phase II NCT06283979). Angel and Magellan are CBER BK-series 510(k)s cleared as platelet and plasma separators for bone graft handling, not cell-therapy clearances. All eight acquisition dates verified. Teriparatide, abaloparatide and zoledronic acid are NDAs.

**Blocked pages read (pass 3, 12 flags cleared).** Stryker's catalog still lists Vitoss, HydroSet XT, Bio4, Augment, Pro-Dense, OsteoSet and AlloMatrix; Cortoss has no product page. Kuros IR confirms the five-year Medtronic sales agency (January 2025) and FY2025 revenue of USD 146.1M. The FDA's July 2008 cervical rhBMP notification was read via the Wayback Machine. The CMS FY2027 final rule text confirms the antibiotic-eluting void filler reassignment into the MCC tier of eight DRGs and dates the level-based fusion DRGs to FY2025 (October 2024), not FY2026. Osteogrow's EU register posting reports fusion proportions so low they are almost certainly a units error, so its result must not be quoted as a fusion rate. Anthem Ohio commercial has no standalone bone graft substitute policy. Evidence fills: Peichl 2011 (PMID 21915572), Hernigou 2005 (PMID 15995108), the cervical NIS primary (PMID 29128581), CDC hip fracture hospitalizations (290,130 in 2019, age 65 and over), ankle arthrodesis pooled fusion 96%, lateral lumbar fusion 85 to 93%, MIS SI-joint pooled revision 2.4%.

## What is still open (29 flags, down from 98)
- **13 product-level**: current US availability of Cortoss and KyphOs FS; Magellan's bone-marrow kit clearance; the tissue banks behind the six posterior SI allografts (none disclosed); VIA Disc NP's 361 status (no FDA position found); the KUR-113 discontinuation (secondary source only); GraftJacket rights; the Osteogrow units problem.
- **16 application-level**: no US annual procedure or injury count exists for these applications after PubMed searches dated 2026-10-22 (calcaneus, talus, subtalar, TTC, first MTP, bunion, Jones, diabetic foot osteomyelitis, distal femur, femoral shaft, subtrochanteric, radial head, and the nonunion variants). The app should show incidence per 10,000 with its source and say no US count exists.
- **Eight applications have no product paired**, all honest: no biologic is standard for patella, olecranon, radial head, metacarpal, humeral shaft, distal humerus, subtrochanteric and talus fractures.
- **Commodity products with no published evidence** stay grade V: Magnifuse, AlloFuse, Mastergraft, Signafuse, OsteoVive Plus, OssiGraft, SiLO, chronOS Inject, Optium, Angel, Magellan, NVDX3, Novosis.
- Sites that still block plain fetches: Kuros IR, J&J MedTech product PDFs, Stryker Cortoss pages, SI-BONE IFUs. The FDA PMA search page served a bot challenge, which was not bypassed.

## What this means for the build
- The data model works: region, application, product, evidence and BD lens all merge cleanly and the app can render tiers and grades directly from JSON. Patches and overrides are reproducible (`build/merge.py`, `build/apply_patch.py`, `build/fda_overrides.json`).
- Spine deserves the deepest UI: ten applications, three PMA products, the cellular-allograft story, the SI-joint coverage fight and the FY2027 DRG changes.
- The honest headline per region is a feature: "no Level I biologic exists for this application" appears often and is what makes the page credible.
- Reimbursement is ready to show per product: bundled in MS-DRG inpatient, packaged in HOPD/ASC, the two NTAPs (Infuse TLIF, Cerament G), the one pass-through (C1602), and the payer policies that call cellular allografts and PRP investigational.
- The regulatory primer in `research/regulatory-primer.md` can become its own page.

## Files
- `SCHEMA.md` — record formats and rules
- `research/*.json`, `research/*-notes.md`, `research/regulatory-primer.md`, `research/bd-lens.md`, pass logs and patches
- `data/applications.json`, `data/products.json`, `data/merge-report.md`, `data/fda-check.md`, `data/unverified-checklist.md`
- `build/merge.py` (rerun after editing any research file), `build/apply_patch.py`, `build/fda_check.py`, `build/fda_overrides.json`, `build/GAP_PLAN.md`
