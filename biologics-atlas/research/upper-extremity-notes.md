# Upper-extremity slice: research notes (2026-10-21)

Companion to `upper-extremity.json` (15 applications, 26 products, 54 evidence rows). Everything below is what the JSON could not carry: what was not verified, where the evidence is thin, ownership changes to confirm, what an upper-extremity trauma hiring manager will push on, and a short state-of-the-market paragraph.

## How this was built, and one limitation

PubMed was queried through the NCBI E-utilities (the plugin PubMed tool rate-limited after the first few batches), ClinicalTrials.gov through its v2 API, and FDA data through the openFDA 510(k)/PMA/De Novo endpoints plus the accessdata decision PDFs where the text layer could be extracted. The shared web-search budget for this session was exhausted partway through, so corporate-history facts that normally come from a press release (acquisition dates, distribution partnerships) were written from memory and flagged `unverified` in the JSON. They are listed below so they can be confirmed in a follow-up pass.

## Could not verify (fix before publishing)

Ownership and dates written from memory, not from a primary page:
- Medtronic acquisition of Osteotech (Grafton): stated 2010.
- Stryker acquisition of Orthovita (Vitoss, HydroSet XT applicant): stated 2011.
- Stryker acquisition of Wright Medical (Allomatrix, GraftJacket orthopaedic rights): stated November 2020.
- Orthofix / SeaSpine merger (Trinity Elite): stated January 2023.
- Globus Medical / NuVasive merger (Osteocel): stated September 2023; NuVasive's 2008 purchase of Osteocel from Osiris also from memory.
- Smith+Nephew acquisition of Rotation Medical (Regeneten): stated December 2017.
- Stryker sale of the OP-1 business to Olympus (2010-2011) and Olympus Biotech's US wind-down (~2014); the HDE pages confirm Olympus Biotech as holder but say nothing about withdrawal.
- Who owns the Norian name after Synthes agreed to divest it in 2010 (Kensey Nash bought the assets in 2011 and DSM later bought Kensey Nash, from memory). The DOJ facts themselves (2009 indictment, October 2010 guilty plea, $23M fine, four executives sentenced 5-9 months in 2011) come from the Synthes Wikipedia article, which should be replaced with the DOJ press release; the DOJ URL I tried returned 404.
- Terumo BCT acquisition of Harvest Technologies (BMAC): stated 2014.
- ViviGen distribution through DePuy Synthes and Optium DBM distribution through DePuy Synthes: not stated on the LifeNet pages fetched.
- Bonesupport and Biocomposites US channel mix (direct vs agents) is an inference, marked hybrid.

Regulatory text that could not be extracted (scanned PDFs with no text layer): Infuse P000058 approval order PDF (the HTML database page gave the indication, which is what the JSON uses), OP-1 H010002A and H020008A approval orders (indication paraphrased from the HDE generic name), Optium K053098, DBX K103795, Norian Drillable K102722, Grafton K251193 (letter only), Vitoss K242280 and Bonalive K231528 (text extraction failed). Class labeling was used for those with `unverified: true`.

Volume figures: national counts labeled "extrapolated" are the atlas author's multiplication of Karl 2015 per-10,000 rates by the 2010 census, not numbers from the paper. No US volume was found for humeral shaft nonunion (only the French <700/yr figure), forearm nonunion, radial head fractures, metacarpal nonunion rate, Latarjet national volume, or upper-extremity osteomyelitis. Rotator cuff repair volume is from 2006 and 2002 data; a current figure needs a newer source.

Reimbursement specifics not confirmed from CMS pages: whether CERAMENT G holds (or held) an inpatient NTAP; whether Smith+Nephew obtained a Category III CPT code for bioinductive augmentation; current OPPS packaging status and the C9359 history for Infuse; the C1762 reporting convention for human connective tissue in HOPD. The general rule (bone graft substitutes and tissue are packaged into the MS-DRG, APC or ASC procedure payment with no separate pay) is standard CMS policy, but the CMS ASC landing page fetched did not restate it, so a reader should cite the OPPS/ASC final rule directly. One correction worth noting: the CMS pass-through page URL I tried was dead.

## Thin or negative evidence, by application

- Proximal humerus: the fibular strut allograft is the best-supported augment (Dasari 2022 meta of 10 studies; Daher 2026 meta of 5 RCTs), but the RCTs are small single-center trials and graft fate is undefined. PMMA screw-tip augmentation has one RCT (Hengg 2019, n=67) that was stopped early and was negative. Calcium phosphate cement has one retrospective cohort (Egol 2012). CERAMENT BVF has one 24-vs-24 propensity cohort (Sinkler 2025). None of this addresses whether augmentation changes the ORIF-vs-reverse-arthroplasty decision in patients over 75, which is where ORIF volume is falling (Cooke 2024).
- Humeral shaft nonunion: the strongest evidence argues against biologics. Plate plus autograft gives 98% union (Peters 2015); plate alone gave 93% with only 13% grafted (Oliver 2021); rhBMP added nothing (Alhakbani 2024; Hackl 2017). No DBM, cellular allograft or BMAC study is humerus-specific.
- Distal radius: three negative RCTs (Kim 2011 cement with volar plate; Jakubietz 2011 beta-TCP; D'Agostino 2013 Allomatrix DBM) plus a negative Cochrane conclusion on durable benefit. The one positive RCT (Cassidy 2003, Norian SRS, n=323) pre-dates volar plating and the product is gone. Two double-blind osteotomy RCTs (Andreasson 2020 with HydroSet; Angelomenos 2025) show the void can be left empty.
- Scaphoid: autograft comparisons are reasonably studied (Guria 2025 meta; Ghaderi 2026 meta; Braga-Silva 2008 RCT), but every off-the-shelf biologic rests on n=17 (Bilic 2006 OP-1 RCT; Lee 2026 DBM+BMAC series).
- Clavicle, olecranon, radial head, distal humerus, forearm, metacarpal/phalangeal: no product-specific evidence at all; these entries document the absence of a biologic market more than the presence of one.
- Glenoid bone loss: DTA vs Latarjet is matched-cohort level (Frank 2018) until NCT05658289 reads out.
- Osteomyelitis/FRI: Cerament G has a 100-patient prospective series and an RCT in progress; Stimulan antibiotic beads have no comparative upper-extremity data and the antibiotic mix is off-label in the US; S53P4 has a 116-patient registry that is 85% lower limb.
- Rotator cuff (adjacent): the only randomized Regeneten data are the posted results of a terminated sponsor RCT showing 57% vs 50% retear at 6 months; dermal allograft has one 42-patient RCT (Barber 2012); Rotium has none.
- PRP: the only fracture meta-analysis is retracted (PMID:35693268). Say so.
- Teriparatide: Aspenberg 2010 missed its primary endpoint; the 20-microgram effect was post hoc; Shi 2016 pooled no effect on radiographic healing.

## What an upper-extremity trauma hiring manager would challenge

1. "Most upper-extremity fractures use no biologic." Expect to be asked for the number: of the ~2 million US upper-extremity fractures per year (Karl 2015 extrapolation), the biologic-relevant set is proximal humerus ORIF with medial comminution, nonunion revisions, scaphoid nonunion, glenoid bone block and infection dead space; everything else is plates, screws and casts. A candidate who pitches distal radius void fill will be asked about Kim 2011.
2. Traumacem V+ is PMMA, cleared only for TFN-Advanced hip nails; calling it a calcium phosphate or a proximal humerus product is a credibility hit.
3. Infuse: know the three labeled indications and the 14-day tibial window; know that humerus use is off-label and the 2024 meta-analysis is negative; know the compliance history. Same for Norian: be able to tell the DOJ story in two sentences.
4. 361 HCT/P products (Trinity Elite, ViviGen, Osteocel, fibular strut, DTA, dermal allograft) have no FDA-reviewed indications and may not be promoted with osteoinductive or osteogenic claims that exceed homologous use; the cell-count figures are manufacturer specifications. Tier them accordingly.
5. Reimbursement: every bone biologic in this slice is packaged. In an ASC the filler is a facility cost against a fixed procedure payment, so the sale is to the surgeon and the facility's value-analysis committee, not to a payer. Any claim of pass-through, NTAP or a separate HCPCS code must come with the CMS citation.
6. Fibular strut allograft is unbranded and cheap, and it owns the best proximal humerus evidence; a new augment has to beat it on cost or outcomes, not on a brochure.
7. Volume trend: ORIF of proximal humerus fractures is flat to declining in the oldest patients while reverse arthroplasty rose >300% (2010-2019); the augmentation market is being squeezed from the arthroplasty side.
8. The scaphoid "biologic" opportunity is a few thousand nonunions per year in young men; the real product is the headless compression screw.
9. Antibiotic-eluting fillers: CERAMENT G is the only FDA-authorized one; STIMULAN VG is in phase II; anything else is a surgeon mixing antibiotics off-label.
10. The rotator cuff patch business is larger than every bone-biologic indication in this slice combined, and its randomized evidence is worse. Knowing both facts is the point.

## State of the market today (short)

Upper-extremity trauma is a plate-and-screw market in which biologics are an exception, not a default. The one augmentation with real comparative evidence is the endosteal fibular strut allograft in proximal humerus locked plating (Dasari 2022, PMID:34906682; Daher 2026, PMID:42750779), and it is an unbranded tissue-bank item; branded cements and fillers (HydroSet, CERAMENT BVF, chronOS/Vitoss) ride on that logic with cohort-level data (Egol 2012, PMID:22192764; Sinkler 2025, PMID:40885162) while the only RCT of PMMA screw augmentation was negative (Hengg 2019, PMID:30805708). Distal radius void fill, once a 323-patient-RCT market for Norian SRS (Cassidy 2003, PMID:14630841), has been made irrelevant by volar locking plates (Kim 2011, PMID:21471414; Andreasson 2020, PMID:32472263). Nonunion revision in the humerus and forearm still uses autograft with 93-98% union and no demonstrated benefit from BMP (Peters 2015, PMID:26499226; Oliver 2021, PMID:34267148; Alhakbani 2024, PMID:39429996); DBMs and cellular allografts sell into it on convenience, with the first fracture registry for a cellular allograft (ViviGen, NCT04299022) not due until 2028. The growth pockets are infection dead-space management, where CERAMENT G's 2022 De Novo and 2024 open-fracture 510(k) created a labeled category that STIMULAN VG is trying to enter through phase II trials, and glenoid bone block, where fresh distal tibia allograft is being tested head-to-head against Latarjet (NCT05658289). Rotator cuff augmentation sits next door with far higher procedure volume and, on the posted results of the terminated sponsor RCT (NCT04450342), weaker randomized evidence than any bone product above. Everything here is paid as a packaged item inside an inpatient DRG, an APC or an ASC procedure rate, which makes the facility, not the payer, the customer.
