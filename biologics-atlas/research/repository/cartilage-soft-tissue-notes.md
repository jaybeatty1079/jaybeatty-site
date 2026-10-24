# Slice notes: cartilage-soft-tissue (2026-10-23)

Output: `cartilage-soft-tissue.json` (43 products, 30 distinct companies, 2 new applications). Validation: all 57 PMIDs resolved against PubMed esummary with matching titles; every NCT id resolved on ClinicalTrials.gov v2; every K and P number resolved in openFDA (510k and PMA endpoints); no id collides with existing-products.txt.

Method limits: WebSearch hit its session budget partway through (200 calls), so a few late checks (S+N/CartiHeal deal, Vericel MACI Arthro label text) fell back on the Vericel FY2025 10-K and openFDA instead. Web-search summaries were treated as leads, not sources; where a fact rests only on a summary it is flagged.

## New applications added
- `meniscus-deficiency-knee` (femur-knee): no existing id covered meniscus scaffolds/implants (CMI, RejuvaKnee, Actifit, NUsurface).
- `cartilage-defect-hip` (pelvis-hip): only used by the Cytex ReNew hip early-feasibility record.

## Corrections to the sweep brief (check these before consolidation)
1. **NUsurface** is a **De Novo** request, not a PMA. FDA Orthopaedic and Rehabilitation Devices Panel, 2023-04-20, voted 2 yes / 6 no / 1 abstain on benefit versus risk (FDA summary minutes, fda.gov/media/168616). No final decision found; no US authorization found.
2. **Anika Integrity Implant** is a hyaluronic acid (HYAFF) plus PET knitted mesh, not a collagen scaffold (K223538 summary). 510(k) indication: management and protection of tendon injuries with no substantial tissue loss.
3. **Arthrex DX Reinforcement Matrix** is a porcine-dermis xenograft made by DSM Biomedical (GUDID), not a LifeNet product. Only ArthroFlex is LifeNet-processed.
4. **"Xiros LARS"** is two companies. Xiros makes Poly-Tape/Infinity-Lock/Jewel/Pitch-Patch (PET, all 510(k)); LARS is a separate ligament whose only US clearances are acromioclavicular (K190143 Corin 2019, K253115 Movmedix 2026). No FDA clearance for LARS as an ACL/PCL graft found.
5. **GraftJacket** processor: could not confirm LifeCell/AbbVie Allergan. Stryker's current orthopaedic page cites AlloSource white papers (a search summary said the sheet lists AlloSource as manufacturer; the page I read did not). Flagged.
6. **Cartiva SCI** (not in the brief, added): FDA recall Z-0598-2025, initiated 2024-10-31 by Cartiva/Stryker for higher-than-expected revision/removal/subsidence/fragmentation; PMA P150017 (2016-07-01) with a Level I RCT. Recorded as withdrawn.
7. **Hyalofast** is not "ex-US only": Anika filed the final PMA module 2025-10-31. The US FastTRACK RCT (NCT02659215, n=200) missed both co-primary endpoints; secondaries and post-hoc analyses favored Hyalofast (sponsor release).
8. **Chondro-Gide**: Breakthrough Device Designation (Feb 2021) but both US-registered knee studies (NCT04537013, NCT05785949) were terminated for a change in business strategy; no US authorization.
9. **NeoCart**: held by Ocugen (reported OrthoCellix subsidiary), RMAT 2022, FDA-agreed Phase 3 design; no Phase 3 start located.
10. **MACI Arthro**: an sBLA approved August 2024 (FDA page lists a 2024-08-23 approval letter; Vericel 10-K says commercially available in Q3 2024), not 2025. MACI Ankle (MASCOT, n=309) and pediatric (n=45) trials are Phase 3 under IND.
11. **CMI**: K170364 (Ivy Sports Medicine, 2017) is a live 510(k); the 2008 ReGen clearance was rescinded in 2010. Stryker acquired Ivy in 2016. The brief's "PMA" for CMI is incorrect.

## Not sourced / gaps (biggest first)
1. **Regulatory status of the 361 cartilage products** (DeNovo NT, BioCartilage, ProChondrix CR, fresh OCA): no primary FDA or company document read that says "361 HCT/P" for the brand (Osiris's 10-K does for Cartiform). Flagged unverified.
2. **Final fate of NUsurface's De Novo request and current Actifit/BST-CarGel US status**: no post-2023 FDA outcome found for NUsurface; no US IDE confirmed for Actifit; BST-CarGel has no US PMA found and its commercial status under Smith+Nephew is unclear.
3. **Peer-reviewed clinical data for the new patch class**: BioBrace, Tapestry, Integrity, SpeedFLEX, Kerecis, Xiros devices, TenoGlide and TenoMend have no located human outcome publication; only post-market or pivotal registrations. Graded V.
4. Cytex Therapeutics: only an NCT record (ReNew Hip Implant, n=15 EFS); product description not read.
5. MTF Biologics fresh OCA: no MTF primary source read; record is a placeholder (unverified).
6. Smith+Nephew's acquisition date/price for CartiHeal (S+N Inc. is the PMA applicant at approval).
7. Agili-C 60-month RCT results (posted on CT.gov 2025-12-05) not read in detail; PMA supplement P210034/S001 (2026-06-04, labeling updated with post-approval study results) text not read.

## Left out and why
- Amniotic products (Arthrex Amnion Matrix): amniotic slice.
- Nerve products: NeuroMend (Collagen Matrix/Stryker) and Axogen Avance skipped; nerve is outside scope and I did not record Avance as an adjacent class.
- Episurf (hardware), Aroa Ovitex (hernia), Hyalograft C, Chondron, CartiGrow, Mosaicplasty/OATS autograft (technique), Chondrofix (only a failure case report located), CuffPatch (K042809), OrthADAPT (K043388/K071065/K090288), Conexa (no K number found), MTF AlloPatch HD (no source read; no PubMed hits), MTF Fascia (K120479, allograft fascia 510(k)), JointStem (Nature Cell, knee OA, autologous adipose MSC; RMAT/BTD; likely MSC slice), Arthrex SuturePatch (K243480) and ZuriMED FiberLocker (OWX PET patches), Orthocell Ortho-ATI (no sources read), Rotation Medical legacy collagen sheets.
- NeuroMend: nerve; skipped.
- Cartiva was added because it is a PMA synthetic cartilage with a Level I RCT and a recall; it pairs only with `first-mtp-arthrodesis`.

## Possible overlap with other slices
- AlloJoin and TG-C are knee-OA injectables; the existing atlas note already mentions Kolon TissueGene. If a knee-OA/MSC slice exists, merge on `tg-c` and `allojoin`.
- Dermal-allograft patches: existing `dermal-allograft-rotator-cuff` is the class record; `graftjacket`, `arthroflex`, `arthrex-speedflex` are brand records with a different regulatory question (361 versus 510(k)).
- `regeneten` exists; BioBrace, Tapestry, Integrity, FlexBand are its closest competitors and are cross-referenced in text only.

## Every record carrying `unverified` (record-level or regulatory-level) and why
- denovo-nt: 361 status inferred (Zimmer pages read do not state it); ISTO history unverified.
- biocartilage: 361 inferred; Arthrex page read does not state classification.
- cartiform: 361 per Osiris FY2014 10-K ("we believe"); current Arthrex/S+N distribution unverified.
- prochondrix-cr: 21 CFR 1271 per AlloSource poster; 361 not stated; US launch year from 2018 Stryker/AlloSource release.
- jrf-ortho-fresh-oca, mtf-fresh-oca: 361 inferred; MTF program unconfirmed (record-level unverified).
- bst-cargel: no US PMA found; ex-US approvals from 2016 press, certificates not read.
- neocart: Ocugen/OrthoCellix corporate chain and RMAT detail from press summaries.
- cais: scaffold composition from general knowledge; reason for termination of NCT00881023 not stated.
- cartistem: Korean approval year (2012) and US trial first-patient date come from press/aggregators; CT.gov start 2026-03-11.
- cartilife: Korean approval date conflicts (April 2025 vs earlier); US Phase 2 status stale on registry.
- allojoin: AbelZeta/CBMG chain unverified; Phase II unpublished.
- tg-c: 2026 US Phase 3 "primary endpoint not met" appears only in an aggregator summary; Invossa Korea revocation is general knowledge.
- arthroflex: 361 vs 510(k) not confirmed.
- arthrex-dx-reinforcement-matrix: no K number for the brand found; lineage K103787/K133169 inferred.
- graftjacket: processor and 361 status unconfirmed.
- restore-orthobiologic-implant: off-market status inferred; 510(k) indications unread.
- zimmer-collagen-repair-patch: whether still sold unverified; indications unread.
- lars-ligament: corporate relationships among LARS, Corin, Movmedix unverified.
- integra-tenoglide: K053655 cleared as "Tendon Wrap Tendon Protector"; TenoGlide brand mapping inferred from the 2007 launch release and identical composition.
- tenomend: US availability uncertain (Exactech page lists New Zealand).
- ortho-r: NCT05333211 status unknown; no 2026 update.
- nusurface: no final FDA decision located; Breakthrough date from a search summary.
- collagen-meniscus-implant: whether Stryker actively markets CMI is unverified.
- actifit: Breakthrough Designation and Korean approval from press summaries; US IDE unconfirmed.
- cytex-renew-hip: registry only.

## Evidence-grade judgment calls
- Grade I is used for registered RCTs even when the primary endpoint failed (Hyalofast FastTRACK, NeoCart Phase 3) or the endpoint is a surrogate (BST-CarGel MRI, Cartistem second look); caveats say so.
- Barber 2012 (GraftJacket, n=42) is graded I as an RCT; the paper labels itself Level II "lesser-quality RCT".
- Cartiva MOTION n=202 is derived from reported percentages (152 implant + about 50 arthrodesis).
- Fresh OCA series (knee n=244, n=60) are Level IV single-center; the same data are cited on both fresh-OCA records.

## Commercial facts worth re-checking
- MACI Q2 2025 net revenue $53.5M (+21%); company estimates 315,000 label-consistent US patients/year; >900 surgeons trained in MACI Arthro (10-K, FY2025).
- CONMED paid $85.5M upfront for Biorez (2022-08-09) plus up to $165M earn-out ($84.5M paid by 2024-12-31).
- Zimmer Biomet paid $155M upfront for Embody (closed Feb 2023) plus up to $120M milestones.
- Stryker completed the Artelon acquisition 2024-07-15; Stryker acquired Ivy Sports Medicine (CMI) 2016-09-01.
