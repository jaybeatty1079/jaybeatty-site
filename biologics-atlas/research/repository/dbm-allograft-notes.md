# dbm-allograft slice: notes (2026-10-23)

39 product records, about 26 distinct companies, 0 new applications. 26 records are 510(k) (product codes MQV/MBP, 21 CFR 888.3045) and 13 are 361 HCT/P. 35 of 39 carry an `unverified: true` flag on the product, its regulatory object, or both; reasons are listed below. Every K number in the file was checked against openFDA and every cited PMID against PubMed or Europe PMC.

## How this slice was built
- openFDA 510(k) search by product code MBP (31 clearances) and name search (MQV), then 510(k) summary PDFs read for indication text.
- openFDA UDI/GUDID to find brands, labelers and the 510(k) numbers they rely on. This exposed many private labels of the same cleared putties.
- Xtant, Alphatec, Globus, Orthofix and Zimmer Biomet FY2025 10-Ks (EDGAR) for product lists and ownership.
- PubMed/Europe PMC searches by brand name, run 2026-10-23.
- WebSearch ran out of budget part-way (200 per turn, shared); the later gaps below are partly from that. No Firecrawl used.

## Corrections to the brief (verify before relying on the names)
- Puros DBM is no longer a Zimmer Biomet product. ZimVie was spun out in 2022; ZimVie's spine business went to H.I.G. Capital as Highridge Medical (closed April 1, 2024); the dental line stayed with ZimVie. The spine labeler in GUDID is still "Zimmer Spine, Inc." and which entity owns it today was not confirmed. Puros also has a 2014 reverse-phase-medium family reportedly made with AlloSource, and an RTI Biologics-made putty before that.
- Propel DBM (NuVasive, now Globus), XEMPLIFI (Globus) and Stryker's "DBM" gel/putty/putty-plus are all AlloSource AlloFuse-family products sold under other labels. GUDID lists K071849/K103036 (both AlloSource) against them; XEMPLIFI's label states donor eligibility by an AlloSource Medical Director; Stryker's page cites K103036 and AlloSource white-paper data. The atlas already has `allofuse`.
- Rafugen DBM is Cellumed (Seoul), not CGBio. CGBio's DBM putties (Bongener, Bonfuse) appear only in a Korean study and have no FDA clearance found.
- NanoFUSE DBM is licensed to Amend Surgical (KICVentures-owned per Becker's), not Bioventus.
- Beast Injectable Putty and BEAST PLUS (Paragon 28, now Zimmer Biomet since April 21, 2025), Hero (Spinal Elements), VIA DBM (VIVEX), MAXX-Fuse (Royal Biologics) and Reficio (Biomet lineage) are Xtant OsteoSelect 510(k) putties under other brand names, per GUDID (Xtant is labeler on K130498/K150621).
- The Exactech "Optefil/Opteform" and RTI "Osteofil/Synergent" pastes share the 2005 RTI 510(k)s (K043420/K043421). I could not establish who owns them now.
- GUDID's `is_hct_p: true` flag appears on 510(k)-cleared DBM putties (it reflects human tissue content). Do not read it as proof of 361 status. Pathway in the file follows the 510(k) record where one exists.

## Evidence approach
Almost no DBM brand has a product-specific human study. Where none was found, the application is graded V with the phrase "No published study of this product in this application located (PubMed search 2026-10-23 on the brand name)". Class-level reviews (PMIDs 32455520, 41985112, 27832365, 28733366, 42421266) are labelled "class context only" and are in `evidence[]` as meta-analysis rows describing the class, not the product. Product-specific human data found:
- OrthoBlast (first generation, Citagenix/IsoTis; Orthofix now sells OrthoBlast II): three comparisons against Grafton (PMIDs 12582811, 16130350, 12921362), graded III. All small, non-randomized, none significant for nonunion.
- Osteofil/ICM: single-surgeon series, n=140 (PMID 17414983), graded IV.
- ExFuse (Hans Biomed): retrospective PLIF comparison of three DBMs, n=236 (PMID 38399552), graded III; interbody use is off-label for its posterolateral-spine label.
- Optecure-CCC: a 14-patient dental randomized trial (PMID 31246662) where Optecure was the comparator; graded I with an n=14 caveat.
- Accell Connexus has a 59-patient controlled pilot (Schizas 2008, PMID 17978826) but is not in this file (Accell products sit under the existing `accell-evo3`). Grafton's RCT (PMID 15014276) belongs to the existing `grafton` record.
- Preclinical only: Strand (SeaSpine-run rat study, PMID 32266283), Progenix (rabbit PMID 23576922; rat PMID 31745449), InterGro lot variability (PMID 20124070), OsteoSelect (PMIDs 24577306, 27562800), Puros (PMID 20566657), NanoFUSE (PMID 22323112), Osteofil rat studies (PMIDs 12635152, 17205237).
- PMID 28733366 (van der Stok 2017) found no clinical studies for ten of its 15 non-Grafton/Allomatrix products, including AlphaGRAFT, Optefil and Optium; my own 2026 PubMed searches agree.

## Unverified flags, by product (why)
- propel-dbm: Propel IFU not retrieved; regulatory numbers inferred from GUDID (K103036 is AlloSource's); fibers' pathway unknown.
- puros-dbm: current owner, pathway (GUDID shows MBP/MQV codes, HCT/P flag, no premarket number) and indications unconfirmed; ZimVie page returned 404.
- intergro-dbm: commercial status under Zimmer Biomet not confirmed.
- beast-dbm, hero-dbm, via-dbm, maxx-fuse-dbm: 510(k) link rests on GUDID labeler fields; brand IFUs not retrieved; some formats (sponge, strips, Spinal Elements-labeled DBM+) show no premarket number.
- optecure-dbm: Exactech's post-2024 ownership and active sale not confirmed; dental K103699 text unreadable.
- osteofil-optefil-opteform, bioset-xc, regenavate-dental-dbm: owner and active-sale status unclear after RTI Surgical/Surgalign (sold to Xtant August 2023; Xtant's FY2025 10-K does not name them); a 2017 review attributes BioSet to Penta Biomedical.
- progenix-dbm, plexur-p, sygnal-dbm, legacy-dbm: Medtronic and MTF catalog status not checked; Legacy DBM has no 510(k) number or label retrieved; Medtronic's Osteotech acquisition date comes from background knowledge.
- exfuse-surfuse-maxigen, rafugen-dbm: US availability and distributors not found.
- nanofuse-dbm: KICVentures purchase date and current owner not confirmed.
- osteoballast: Orthofix FY2025 10-K does not name OsteoBallast; SeaSpine-Orthofix merger date from background knowledge.
- strand-dbf: 361 status inferred (no 510(k) found; carrier-free fibers); label not retrieved; brochures were image PDFs.
- pliafx-flo: only the 2024 line-extension 510(k) found; original PliaFX clearances not located by name.
- vesuvius-dbm, stimublast, allosync-pure: pathway, composition and indications not published in anything I could read; Arthrex-AlloSource link inferred from matching GUDID part numbers (ABS-2002-05) and part-number convention.
- stryker-dbm: Stryker IFU M1S1144.02 not retrieved; 510(k) number taken from Stryker's own page.
- equivabone: K243609 indication text not retrieved; distributor unknown.
- vivorte-trabexus: company status unknown.
- alphagraft-dbm: 361 vs 510(k) conflict between a 2017 review (510(k)) and GUDID (HCT/P, no premarket number); processor (DCI) is inferred from matching marketing text.
- 3d-profuse: 2008 trade article plus a 10-K line only; demineralization today unconfirmed.
- osteosponge, 3demin-osteowrap, fibrex-trivium: 361 status inferred from Xtant's 10-K generalities and a KLS Martin distributor page; no label text.
- reficio-link-dci: Reficio brand ownership across DCI, EBI and Xtant labels unresolved.
- aurora-biologics-dbm, medline-unite-dbm: no regulatory statement from either company; Medline brochure is 2018.

## Not sourced (biggest gaps)
1. MTF Biologics house brands beyond Sygnal and Legacy (and AFT, K060161, which is left out), plus AlloSource's AlloWedge and other house brands, LifeNet's Matrix OI and OraGRAFT, and DePuy Synthes DBM beyond DBX: no usable pages or GUDID records found before the search budget ran out. I did not invent any.
2. Pure (non-DBM) cortical fibers, cancellous chips/sponges and machined allografts from Bone Bank Allografts, Community Tissue Services, Pinnacle Transplant Technologies, Spineology, Kolosis BIO, Enovis and Paragon 28 beyond BEAST: Bone Bank and Pinnacle pages only confirmed generic DBM and private-label capability; CTS, Spineology (graft pouches only), Enovis and Kolosis returned nothing usable.
3. Reimbursement and channel detail per product: all `bd` blocks use the generic "bundled in MS-DRG / packaged in OPPS" statement; no product has verified pricing, GPO status or VAC-approval data.

## Left out on purpose
- Cellular allografts (OsteoVive Plus, AlphaGRAFT CBM, Trinity, Osteocel, ViviGen): cellular slice.
- Synthetic bone void fillers from the same 510(k) code (Cove, MagnetOs, Montage, Vitoss, SurGenTec, Bone Solutions, Geistlich, etc.): other slices.
- Xtant OsteoFactor Pro (allogeneic growth-factor solution; fits better in a growth-factor or "other" slice), OsteoMax, SimpliGraft/SimpliMax (amniotic).
- First-generation IsoTis Accell products (Accell Connexus, TBM, Evo3): `accell-evo3` already covers Evo3.
- Wright/Stryker IGNITE and PRO-STIM (Ignite 2.0 K190482 is a bone void filler for extremities and pelvis; its tissue content was not confirmed) and Cancello-Pure: not enough information read to record honestly.
- Osteotech VIAGRAF (K043209) and LifeCell AlloCraft DBM (K052735): off-market legacy 510(k)s with no sign of current sale; flagged here only.
- Dental-only brands (Salvin, Keystone, ZimVie RegenerOss K113645) except as noted under RegenaVate.
