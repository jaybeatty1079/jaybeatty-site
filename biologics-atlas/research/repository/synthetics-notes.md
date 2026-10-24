# Synthetics slice notes (2026-10-23)

Output: `synthetics.json` (45 products, 4 new applications). 34 companies. Every K number (148 distinct) was checked against openFDA, every PMID (29) against PubMed esummary (titles and years match), every NCT (21) against the ClinicalTrials.gov v2 API. Indications text was read from the FDA 510(k) summary or indications form for each product unless noted below. Evidence grades: 1 Level I, 1 II, 5 III, 10 IV, 89 V (V entries carry the PubMed search terms used).

## New applications added (none fit an existing id)
- `ais-posterior-fusion` (spine): Pro Osteon's only human series is adolescent idiopathic scoliosis.
- `knee-subchondral-bml` (femur-knee): AccuFill / Subchondroplasty and Tactoset.
- `benign-bone-cyst-curettage` (general): labels for Mg OsteoInject, JGH1, JAZBI, Osteo-P name benign cysts and tumors.
- `proximal-femur-augmentation` (pelvis-hip): AGN1 LOEP, investigational.

## Records worth challenging (strongest honesty calls)
- AttraX Putty is the only product here with a published Level I trial (PMID 32080013, noninferior PLF, fusion 55% vs 52% at 1 year, CT-based). Interbody and XLIF use is on-label only for the Scaffold (K240507); the Putty 510(k) K191974 names PLS and pelvis only. Globus's website says the Putty is interbody-indicated; I did not find the 510(k) behind that.
- Altapore: single-arm n=129, 86.3% fusion at 12 months, Baxter-authored. Grade IV.
- Healos: grade III with mixed results (two equivalent, one clearly inferior, interbody worse). The registered randomized TLIF trial NCT00316121 (n=138, completed, results posted) has no PubMed report. Status "off-market" is inferred.
- AccuFill: the cleared indication is void filling in extremities, spine, pelvis; BML is not named, so Subchondroplasty is marked off-label (conservative). Registry RCT NCT03112200 (n=131) completed 2023 with no publication found.
- Cove/OsteoCove, Pro Osteon and Cerasorb Foam: extremities not named for Cove (PLS and pelvis only); Cerasorb Foam is extremities and pelvis only (not spine).
- BioSphere: the 248-case series (PMID 32309645) included 115 ACDF; the cleared text says "intervertebral disc space" without naming cervical.
- Bongros-HA and Herafill are ex-US (path `none-unapproved`); Bongros' only US clearance (K090793) is dental (code LYC).
- Herafill: in a 12-sheep study Herafill-G showed the lowest bone gain of three gentamicin carriers (PMID 32840717); animal data only.

## Unverified flags (37 of 45 records carry an `unverified: true` somewhere)
Reasons, by type:
1. Ownership or marketing status not confirmed from a current company page: Pro Osteon (catalog presence), CopiOs (ZimVie page returned 404; Highridge Medical lists no CopiOs), CaP Spheres Pellet Pack (Zimmer Biomet Spine to ZimVie to Highridge chain), FormaGraft (R&D Medical 510(k) vs NuVasive sales), MicroFuse and CONFIRM (not on current Globus pages searched), Healos, MIIG, Allogran, Teknimed, Smith+Nephew legacy lines (all `off-market` inferred), Cerasorb (US distribution via Orthovita not confirmed), MBCP (no US distributor found), Berkeley (no company page read).
2. 510(k) summary PDF unreadable on FDA site, label taken from the openFDA record only or from an adjacent clearance: K251720 and K242797-family (read K243949 instead), K240621 (read K193168/K193487), K243609 EquivaBone (not recorded, see below), older pre-2008 PDFs for several Berkeley/Teknimed items.
3. Composition from secondary sources: Pro Osteon (Marine Drugs review), Genex (trade snippet; summary text did not list components), Bi-Ostetic 60/40 (GUDID listing), Cem-Ostetic, Mg OsteoCrete chemistry (company description), Biogennix osteoSPAN (origin not stated).
4. Name mapping assumed: AGN1 = JGH1 (publications say AGN1, the 510(k) says JGH1); OsteoStrux and Collage mapped to Mozaik composition by Orthofix pages only (no 510(k) under those names).
5. Trade-press ownership facts not retrieved in full: Collagen Matrix and Linden Capital, Biocomposites-Zimmer Biomet exclusive Genex distribution (March 2022), Highridge/ZimVie divestiture dates.
6. Claims I did not source and left as "not re-sourced" in ownership text: Biomet's purchase of Interpore, Baxter's purchase of ApaTech, Zimmer's purchase of Knee Creations, Globus-NuVasive merger date, S+N's purchase of Osteobiologics.

## Left out and why
- Alphatec, Spinal Elements, Spineology, Camber Spine, Paragon 28, In2Bones/CONMED: openFDA shows no MQV/MBP (resorbable calcium salt bone void filler) clearance for any of them (searched by applicant, with and without the product-code filter). Alphatec's only graft-adjacent hit is Invictus bone cement (PMMA, spinal fixation). Paragon 28 has no 510(k) bone void filler; its biologics, if any, are not 510(k) fillers. These are reported as absent, not as gaps in my search.
- Medtronic beyond Mastergraft: Magnifuse and Grafton (DBM) are already in the atlas; Progenix is a DBM; Kyphos FS is in the atlas.
- Ossio OSSIOfiber: skipped. It is a mineral-fiber-reinforced polymer fixation implant (a bone-fixation material that is not intended to regenerate bone), so I did not judge it a bone-regeneration biologic.
- RTI Surgical "Moldable Bone Void Filler" (K241555, Feb 2025): the 510(k) describes processed DBM in a synthetic hydrogel with cortical-cancellous chips, so it belongs to the DBM slice. Stryker tracker items (Vitoss K261008, Allomatrix K252085) are already covered by existing `vitoss` and `allomatrix` records. The tracker `new-bvf-clearances-2024-2026` stays a summary; Elute, Artoss/Biocomposites, SDIP, SurGenTec, Anika and Acuitive now have individual records.
- Stryker IGNITE (K190482), Wright Prostim/AS20/Cellplex, Baxter Tricos/Ultrafuse, SeaSpine Ballast/OsteoBallast resorbable mesh pouch (a graft container, K200290), DePuy Conduit TCP, Geistlich Orthoss (bovine xenograft), Etex EquivaBone/CarriGen/CAP (EquivaBone letter K243609 had no readable indications and the composition could not be confirmed), Exactech Optecure (DBM), Hans Biomed (DBM), Biostructures, Zavation Uni-FuZe, Xenco Sorrento, Orthogem TriPore, Biomet Calcigen/OSS, DSM Biomedical CPC (K173362 etc.), Biostone si-Mochi, Corliber GaiaBone, Noraker GlassBone, Acro ABCcolla: not recorded for time and thin evidence; each is a clearance with no located clinical literature. They can be added from the openFDA index if wanted.
- Collagen Matrix private-label manufacturing: no source found; not asserted.

## Biggest sourcing gaps
1. Clinical outcomes: for 89 of 106 product-application rows I found no published study of that product in that application. In particular there is no product-specific RCT for trauma void fill (tibial plateau, calcaneus, distal radius) for any brand in this slice; the plateau data are one matched cohort (Graftys, n=46), one 1989 Interpore series, and class reviews.
2. Antibiotic-eluting synthetic carriers: Herafill has animal data only and no FDA status; Elute's EP Granules + tobramycin is IDE-only with a 2029 estimated completion. No synthetic antibiotic carrier in this slice has human outcome data.
3. Current commercial status and ownership of legacy lines (CopiOs, CaP Spheres, Healos, MicroFuse, Confirm, Cerasorb in the US, MBCP in the US, Teknimed). The FDA record is solid; the company-side confirmation is not.
