# growth-factors-cells: notes (2026-10-23)

18 product records, no new applications. Every PMID was checked against PubMed esummary, and most abstracts were read through efetch. Every NCT was pulled from ClinicalTrials.gov v2. openFDA was searched for PMA records for AMPLIFY, Augment, BioMimetic and Theradaptive: the only hits were Infuse and Augment, which were expected. EDGAR full-text search returned 403, so no SEC full-text queries were run. The only filing read was Carmell's FY2023 10-K (fetched directly).

## Records
amplify-rhbmp2-crm, rhbmp2-cpm-wyeth-pfizer, bioventus-pfizer-bmp-portfolio, osteoadapt, carmell-bha, kur-111-fibrin-pth, rhfgf2-trafermin-fracture, chrysalin-tp508, rhgdf5-intradiscal, neofuse-mpc, preob, plx-pad-hip-fracture, cartistem, jointstem, autologous-msc-clinics-class, guyoudao-rhbmp2-china, augment-rotator-cuff, ossgrow-ossron.

## Grading convention
Grades follow trial design, as the brief asks. Several Level I grades rest on unpublished or sponsor-only results, and each of those says so in its summary and caveats: NeoFuse (n=8 per arm, press release only), rhGDF-5 (n=24, registry only), Chrysalin (one-line registry statement), PLX-PAD (registry and press release only). Several Level I records are negative trials: rhBMP-2/CPM, PREOB, Chrysalin, and PLX-PAD on its primary endpoint. A reviewer may prefer to downgrade unpublished RCTs. That is an editorial call for the consolidation pass.

## Unverified flags (13 records)
- amplify-rhbmp2-crm: the PMA number P050036 comes from patents and insurer policies, not an FDA page. The FDA panel transcript was not retrieved; the panel votes come from Medtronic's release and trade press. The 2011 non-approvable letter is sourced to trade press quoting Medtronic's 10-Q.
- bioventus-pfizer-bmp-portfolio: the program's current status is unknown, and no trial has been registered. applications[] is left empty on purpose so the record doesn't invent a target indication.
- osteoadapt: the IDE number and the spine trial registry number were not found. The "three Breakthrough designations" figure comes from secondary coverage.
- kur-111-fibrin-pth: the trial registry number and US IND status are unknown, and the granule carrier is not confirmed. KUR-112 could not be found in any source.
- rhfgf2-trafermin-fracture: Kaken's sponsorship of the fracture trials and trafermin's Japanese approvals (Fiblast, Regroth) are from general knowledge.
- neofuse-mpc: whether the program was formally discontinued is not confirmed (pipeline.unverified).
- plx-pad-hip-fracture: whether development stopped is not confirmed. pipeline.stage is "phase-2" only because the schema has no value for a failed Phase 3.
- cartistem: the Korean MFDS approval year (2012) and the FDA agreement come from company releases.
- jointstem: the RMAT and Breakthrough designations and the MFDS rejections come from company releases and Korean press.
- autologous-msc-clinics-class: the 2014 D.C. Cir. (Regenerative Sciences) and 2021 11th Cir. (US Stem Cell Clinic) citations were not read from court documents. The 9th Cir. 2024 decision and the Celltex 2012 warning letter are sourced to law-firm and news pages. The outcome of the Supreme Court cert petition (24-1189) is not confirmed.
- guyoudao-rhbmp2-china: the NMPA registration number, year, carrier and indications were not verified. No Rebone finished product was confirmed.
- augment-rotator-cuff: why the program stopped and whether a US IDE ever existed are not confirmed.
- ossgrow-ossron: the CDSCO approval document was not seen, and the CTRI Phase 3 results were not located.

## Left out, and why
- Ember Therapeutics: it only matters as an OP-1 rights holder, which the existing op-1 record already covers. No new product.
- Osteologix: strontium malonate (NB S101) is an osteoporosis drug, not a fracture-healing or fusion product.
- Histogenics: only cartilage products (NeoCart), which belong to another slice.
- Ossium beyond OssiGraft: its other programs are hematopoietic (bone marrow for transplant), not bone repair.
- Bone Biologics beyond NB1, Genera beyond Osteogrow, Cerapedics beyond PearlMatrix: no separate product was found.
- CGBio/Daewoong second rhBMP-2 product: none found beyond Novosis.
- Celling Biosciences: a BMAC device already covered by the bmac class record.
- Personalized Stem Cells: no ClinicalTrials.gov record or FDA document was found, so it isn't named in the clinic class record.
- StemCyte: its programs are cord-blood transplant and neurology, not orthopedics.
- Osteopharma and other Japanese BMP programs: nothing found by web search, PubMed or ClinicalTrials.gov.
- Stryker rhPDGF beyond Augment: only Augment Rotator Cuff was found, and it has a record.
- PTH and sclerostin beyond the existing records: blosozumab and setrusumab are osteoporosis and osteogenesis imperfecta drugs with no fracture-healing product. Local PTH is covered by kur-111 and the existing kur-113 record.
- InductOs (the EU twin of Infuse) and Osigraft (the EU twin of OP-1) belong to the existing infuse and op-1 records.

## Notes for consolidation
- The brief described KUR-111/112 as "fibrin-BMP-2". The sources say KUR-111 is fibrin-PTH (TGplPTH1-34); nothing fibrin-BMP-2 from Kuros was found.
- Glassman 2008 (PMID 19092613, patients over 60) used rhBMP-2/ACS, not AMPLIFY/CRM, so it is not cited in the AMPLIFY record. The existing infuse record cites it correctly as ACS.
- Cartistem and JointStem overlap the cartilage and knee-injection slices; the consolidation pass should dedupe them.
- PLX-PAD is paired to femoral-neck-fracture as the brief asked, but its target is gluteal muscle recovery after hip fracture arthroplasty, not fracture healing.

## Three biggest gaps
1. Primary FDA documents for AMPLIFY: the P050036 executive summary, panel transcript and non-approvable letter. The FDA advisory-committee archive was not reached.
2. Regulatory records for the Chinese rhBMP-2 products: NMPA registration for Gu You Dao, and whether Shanghai Rebone has a product at all.
3. Current sponsor status for the dormant programs (NeoFuse, Bioventus/Pfizer BMP, Augment Rotator Cuff, PLX-PAD in orthopedics, intradiscal rhGDF-5). This needs company filings, and EDGAR full-text search was blocked.
