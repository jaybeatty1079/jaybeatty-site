# Biologics Atlas — BD lens (reimbursement, channels, market map)

Research date: 2026-10-21. Companion to `bd-lens.json` (32 companies, 33 reimbursement rows, 9 payer/Medicare policy rows). Everything below is from public pages fetched or parsed during this sweep; where a fact rests on memory or a secondary page it is flagged **[unverified]**. Market figures are third-party estimates unless they come from an SEC filing or company release.

Two findings reframe the brief itself:

1. **The spine fusion MS-DRGs the brief names (453-455, 459-460) no longer exist.** The FY2027 Table 5 carries a level-based family: 402 (single-level combined A/P), 426-428 (multi-level combined A/P), 429-430 (combined cervical), 447-448 (multi-level except cervical), 450-451 (single-level except cervical), 456-458 (curvature/malignancy/infection), 471-473 (cervical), and three new DRGs 523-525 (extensive/complex fusion). The old numbers are absent from Table 5 and absent from the FY2027 deletion list, so they were retired before FY2027 (the level-based DRGs carry FY2026-to-FY2027 weight comparisons). Source: HFMA's spreadsheet built from CMS Table 5 (file dated Jul 28 2026) — https://www.hfma.org/wp-content/uploads/2026/08/FY-2027-Final-IPPS-MS-DRG-Rate-Comparison-to-FY-2026-Rates-1.xlsx ; FY2026 rule CMS-1833-F — https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps/fy-2026-ipps-final-rule-home-page.
2. **Globus Medical did not acquire Kuros.** Kuros is independent (SIX-listed, 2025 sales USD 146.1M, +72%); Medtronic became its exclusive *sales agent* for MagnetOs in designated US spine geographies under a five-year agreement in January 2025. Globus's 2025 deal was Nevro ($5.85/share, closed Apr 3 2025). Sources: https://www.medtechdive.com/news/medtronic-kuros-partnership-spine-fusion/736878/ ; https://www.biospace.com/press-releases/kuros-biosciences-delivers-72-year-over-year-sales-growth-reaching-usd-146-1-million-for-2025 ; https://www.sec.gov/Archives/edgar/data/1237831/000162828026011209/gmed-20251231.htm.

---

## Part A — Reimbursement

### A1. Inpatient: everything is inside the DRG

Bone graft substitutes, DBM, cellular allografts and rhBMP carry no separate inpatient payment; the hospital buys them against the MS-DRG. Cigna's policy states the industry view plainly: resorbable graft materials are "surgical supplies rather than implants" (Cigna 0118). The only inpatient carve-outs are temporary new-technology add-on payments (NTAP) and DRG retitling.

**FY2027 MS-DRG weights (effective Oct 1 2026; base payment = HFMA's national unadjusted computation from CMS Table 5):**

| MS-DRG | Title (FY2027) | Weight | Base payment | Weight change vs FY2026 |
|---|---|---|---|---|
| 402 | Single-level combined A/P fusion except cervical | 4.0951 | $30,259 | +0.0746 |
| 426 / 427 / 428 | Multi-level combined A/P fusion except cervical w MCC / CC / w/o | 9.9191 / 6.7023 / 5.9200 | $73,292 / $49,523 / $43,743 | −1.1021 / −0.5163 / +0.2980 |
| 429 / 430 | Combined A/P cervical fusion w MCC / w/o | 8.8413 / 5.8941 | $65,328 / $43,552 | −0.1683 / +0.1270 |
| 447 / 448 | Multi-level fusion except cervical w MCC / w/o | 6.9656 / 4.3497 | $51,469 / $32,140 | +0.2840 / +0.1089 |
| 450 / 451 | Single-level fusion except cervical w MCC / w/o | 5.2339 / 3.2596 | $38,673 / $24,085 | −0.0957 / +0.0292 |
| 456 / 457 / 458 | Fusion except cervical w curvature/malignancy/infection w MCC / CC / w/o | 7.6211 / 5.3668 / 4.0371 | $56,312 / $39,655 / $29,830 | −0.7823 / −0.5963 / −0.1355 |
| 471 / 472 / 473 | Cervical fusion w MCC / CC / w/o | 4.9361 / 2.9809 / 2.4525 | $36,473 / $22,026 / $18,122 | +0.1074 / +0.0348 / +0.0112 |
| 523 / 524 / 525 (new) | Extensive or complex fusion except cervical w MCC / CC / w/o | 13.7383 / 9.8322 / 7.2950 | $101,512 / $72,650 / $53,903 | new |
| 480 / 481 / 482 | Hip & femur procedures except major joint w MCC **or insertion of antibiotic-eluting bone void filler** / CC / w/o | 2.9195 / 2.1266 / 1.6397 | $21,572 / $15,713 / $12,116 | +0.0072 / +0.0321 / +0.0087 |
| 493 / 494 | Lower extremity & humerus except hip/foot/femur w CC / w/o (492 w MCC retitled for antibiotic-eluting BVF) | 2.5526 / 2.0254 | $18,861 / $14,966 | +0.0165 / +0.0189 |
| 495 / 496 / 497 | Removal of internal fixation except hip/femur w MCC / CC / w/o | 3.3360 / 1.7781 / 1.1714 | $24,650 / $13,138 / $8,655 | −0.2897 / −0.0258 / −0.0369 |
| 498 / 499 | Removal of internal fixation, hip/femur w CC-MCC / w/o | 3.1885 / 2.1666 | $23,560 / $16,009 | +0.1717 / +0.1518 |
| 500 | Soft tissue procedures w MCC | 3.3601 | $24,828 | +0.1953 |
| 515 / 516 / 517 | Other MSK O.R. procedures w MCC / CC / w/o | 3.1892 / 2.1180 / 1.5728 | $23,565 / $15,650 / $11,621 | +0.0023 / +0.0399 / +0.0361 |

FY2026 national unadjusted rates for cross-check (Cerapedics 2026 guide): 450 $38,782, 451 $23,507, 471 $35,137, 472 $21,438, 473 $17,765. Source: https://info.cerapedics.com/hubfs/2026%20Reimbursement%20Guide%20PearlMatrix%C2%AE%20%26%20i-FACTOR%C2%AE%20P-15.pdf?hsLang=en

What changed for biologics in FY2027:
- **New DRGs 523-525** for extensive/complex fusion came from SI-Bone and Carlsmed requests; 456-458 lost "extensive fusions" from their titles and their weights fell 0.14-0.78. Becker's: https://www.beckersspine.com/spinal-tech/cms-finalizes-3-new-ms-drgs-for-complex-spinal-fusion-cases/
- **Antibiotic-eluting bone void filler** (the CERAMENT G class) now pushes cases into the MCC tier of DRGs 403, 463, 474, 477, 480, 492, 616 and 628 ("...with MCC or insertion of antibiotic-eluting bone void filler"). BONESUPPORT previewed this as "CMS proposes improved payment for CERAMENT G, in effect from Oct 1, 2026." Sources: HFMA Table 5 "MS-DRG Changes" tab; https://storage.mfn.se/a/bonesupport-holding/d54f2be9-7207-476b-9823-b7a345a4a543/bonesupport-presentation-q2-2026.pdf
- **Infuse in TLIF received NTAP** effective Oct 1 2026: maximum $4,396.60 for FY2027 (65% of cost above the DRG payment), Medicare FFS inpatient only, TLIF indication only (ALIF/OLIF, dental, trauma excluded). Reported with the new Section X code **XW0U0CC** (open; 3/4 for percutaneous/endoscopic) plus the 0SG fusion code. Sources: https://www.medtronic.com/content/dam/medtronic-wide/public/united-states/customer-support-services/reimbursement/cst-infuse-NATP-guide.pdf ; https://news.medtronic.com/2026-09-02-INFUSE-Bone-Graft-for-TLIF-receives-eligibility-for-Medicare-New-Technology-Add-on-Payment,-Advancing-Reimbursement-Support-for-Hospitals-and-Spine-Surgeons

**ICD-10-PCS for biologics.** rhBMP has had its own codes for years in table 3E0: **3E0U0GB** (introduction of recombinant BMP into joints, open), 3E0U3GB (percutaneous), **3E0V0GB** (into bones, open), 3E0V3GB. In the Spring 2026 Coordination & Maintenance cycle, Medtronic asked for a unique code for rhBMP-2 *with collagen scaffold*; CMS recommended Option 2 — new substance value C in table XW0, body part Joints (revised from Bones so the NTAP would track the TLIF indication) — and said 3E0U0GB stays correct for ALIF/OLIF and 3E0V0GB for tibial fracture. Source: https://www.cms.gov/files/document/spring-2026-update-pcs-questions-answers-updated-03-23-2026.pdf. For graft material in fusion codes (0SG/0RG), character 6 carries the device: 7 Autologous Tissue Substitute, A Interbody Fusion Device, J Synthetic Substitute, K Nonautologous Tissue Substitute; the "Z no device" fusion codes were deleted in FY2019. Sources: https://www.cms.gov/icd10m/version40-fullcode-cms/fullcode_cms/P2795.html ; https://medlearn.com/icd10monitor/icd-10-coding-new-character-surfaces-in-spinal-fusion-codes/. The CERAMENT G new-technology code is XW0V0P7 **[unverified — confirm in Table 6P]**.

### A2. Hospital outpatient and ASC: packaged, with two pass-through precedents

Under OPPS the biologic is packaged into the primary fusion APC and under the ASC schedule it is "N1" (packaged). The add-on codes surgeons use carry no payment of their own:

| CPT | Description | MPFS | OPPS SI | ASC PI |
|---|---|---|---|---|
| 20930 | Allograft, morselized / placement of osteopromotive material, spine (add-on) | work RVU 0.00, $0 (bundled) | N | N1 |
| 20931 | Allograft, structural, spine (add-on) | bundled | N | N1 |
| 20936 / 20937 / 20938 | Autograft, spine: local / morselized separate incision / structural (add-ons) | bundled (status B) [unverified for CY2026 file] | N | N1 |
| 20939 | Bone marrow aspiration for bone grafting, spine, separate incision (add-on) | listed by UHC as covered autograft technique; MPFS status not re-verified | — | — |
| 38230 / 38232 | Bone marrow harvest for transplantation (allogeneic / autologous) | transplant codes; Cigna lists 38232 as experimental when used for BMAC bone healing | — | — |
| 0232T | PRP injection, any site, incl. harvesting/prep (Cat III) | carrier priced, work RVU 0 | packaged | — |
| 0263T-0265T | Intramuscular autologous bone marrow cell therapy (Cat III) | carrier priced; coverage "extremely limited" | — | — |
| 1095T | BMAC harvest/processing with scaffold application or injection, excluding spine (Cat III) | Cigna: experimental | — | — |
| 0565T / 0566T | Autologous adipose-derived regenerative cell therapy (Cat III) | not found in any payer policy this sweep [unverified] | — | — |

Primary-procedure context (CY2026): 22551 ACDF → APC 5115 $13,117 (ASC J8 $9,031); 22630 TLIF/PLIF and 22558 ALIF/LLIF → APC 5117 $27,722 (ASC $20,859 / $20,101). Sources: Cerapedics 2026 guide (above); UHC 2026T0410KK code table; Cigna 0118 code table; Arthrex 2025 intraosseous bioplasty guide https://arthrex.com/resources/DOC1-001671-en-US/intraosseous-bioplasty-technique-2025-coding-and-reimbursement-guidelines ; AAPC forum on 0263T https://www.aapc.com/discuss/goto/post?id=500083.

CY2026 OPPS also starts a three-year phase-out of the inpatient-only list (285 procedures removed in year one, mostly musculoskeletal), so more fusions migrate to settings where the graft is fully packaged. Source: https://www.cms.gov/files/document/mm14361-hospital-outpatient-prospective-payment-system-january-2026-update.pdf

**Pass-through (C-codes).**
- **C1734** "Orthopedic/device/drug matrix for opposing bone-to-bone or soft tissue-to-bone (implantable)" was created for Stryker's Augment / Augment Injectable, pass-through effective Jan 1 2020 for 2-3 years (so expired no later than Dec 31 2022). It remains in Cigna's code table with the note "may not be separately reimbursed." Source: https://www.stryker.com/content/dam/stryker/foot-and-ankle/products/augment/resources/Augment-FAQ--Device-Pass-Through-Payment.pdf
- **C1602** "Orthopedic/device/drug matrix/absorbable bone void filler, antimicrobial-eluting (implantable)" — the CERAMENT G category — is an **active pass-through category in CY2026**: CMS updated the CPT codes billable with it effective Jan 1 2026 as IPO procedures moved outpatient, and it is not among the categories expiring Dec 31 2025 (C1826, C1827, C1747). Start date, and therefore expiry, not verified. Source: MM14361 (above).
- **C9359 / C9362** are *Integra* codes (Mozaik / Integra OS collagen-ceramic void filler, per 0.5 cc; effective Oct 2008 / Jul 2009), not Infuse codes; their pass-through period is long over and the products now belong to Orthofix via SeaSpine. **No Infuse-specific C-code was found.** Sources: https://hcpcs.codes/c-codes/C9359/ ; https://hcpcs.codes/c-codes/C9362/
- New CY2026 device categories C1607, C1608 (Jan 1), C1743 (Apr 1), C1609 (Jul 1) are not orthobiologics. Sources: MM14361; https://www.cms.gov/files/document/r13836cp.pdf

### A3. Commercial payer policies

| Payer | Policy | Date | Covered | Experimental / not covered |
|---|---|---|---|---|
| Aetna | CPB 0411, Bone and Tendon Graft Substitutes and Adjuncts | last review 08/18/2026, next 04/22/2027 | Infuse for lumbar fusion (ALIF/lateral, or 1-2 level TLIF) and open tibial shaft fracture ≤14 d; allograft/DBM; β-TCP for spine; BMAC for bone cysts only | Infuse cervical, ankle, ≥3-level TLIF, posterolateral; MSC allografts (AlloStem, Osteocel, Trinity Evolution; ViviGen not covered); BMAC for nonunion/OA/fusion; PRP all indications; i-Factor; Bioglass 45S5; VIA Disc NP |
| Cigna | 0118, Bone Graft Substitutes | effective 10/1/2026 | allograft/DBM; ceramic/polymer synthetics; bovine/coral with covered substitutes; Infuse only for open tibial shaft fracture (IM nail, ≤14 d); spine graft decisions to EviCore | Infuse all other uses; OP-1; amniotic; cell-based allografts "processed to retain cells"; growth-factor substitutes; BMAC in any form; donor-site reconstruction |
| UnitedHealthcare | 2026T0410KK, Spinal Fusion and Bone Healing Enhancement Products | effective 1/1/2026 | autograft incl. BMA; DBM; allograft; Infuse single-level L2-S1 anterior/oblique with interbody device; Infuse/Mastergraft for posterolateral pseudoarthrosis | cell-based allografts; amniotic; Infuse other uses; **ceramics (β-TCP, CaP, CaSO4) and bioactive glass, alone or combined**; expandable interbody systems |
| BCBS Illinois (HCSC) | SUR705.038, Bone Morphogenetic Protein | effective 1/1/2026 | Infuse for ALIF, instrumented posterolateral fusion, open tibial fracture — each only when autograft not feasible | all other rhBMP-2 uses incl. fusion when autograft feasible, CMF |
| BCBS Oklahoma (HCSC) | SUR703.051, Orthopedic Applications of Stem Cell Therapy | effective 4/15/2026 | (unprocessed allograft outside scope) | MSC therapy; viable-cell allografts (AlloStem, Osteocel Plus, Trinity Evolution/Elite named); substitutes that must be mixed with marrow (FusionFlex, Ignite named) |
| Blue Shield of California | 7.01.100, Bone Morphogenetic Protein | effective 7/1/2026 | same three autograft-not-feasible indications as HCSC | all other; cites 2013 IPD meta-analyses: little/no benefit over ICBG, cancer signal |
| Anthem / Elevance | **not retrieved** | — | — | — (gap; see below) |

Sources: https://www.aetna.com/cpb/medical/data/400_499/0411.html ; https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/mm_0118_coveragepositioncriteria_recombinant_human_bone_morphogenetic_protein.pdf ; https://www.uhcprovider.com/content/dam/provider/docs/public/policies/comm-medical-drug/spinal-fusion-bone-healing-products.pdf ; https://medicalpolicy.bcbsil.com/content/dam/bcbs/medicalpolicy/pdf/surgery/SUR705.038_2026-01-01.pdf ; https://medicalpolicy.bcbsok.com/content/dam/bcbs/medicalpolicy/pdf/surgery/SUR703.051_2026-04-15.pdf ; https://www.blueshieldca.com/content/dam/bsca/en/provider/docs/medical-policies/Bone-Morph-Protein.pdf

Pattern: every big payer treats cellular allografts, BMAC, PRP and amniotic products as experimental; BMP in the cervical spine is universally excluded; UHC alone also excludes ceramics and bioactive glass. Because the biologic is packaged, these policies bite through prior authorization, medical-necessity audits and site-of-care steering rather than through a denied line item.

### A4. Medicare coverage touching orthobiologics

- **NCD 270.3** (Blood-Derived Products for Chronic Non-Healing Wounds; effective Apr 13 2021): autologous PRP covered for chronic diabetic wounds for 20 weeks using a device FDA-cleared for exuding wounds; PDGF products, becaplermin and PRP for surgical/dehiscent wounds non-covered. No national coverage for musculoskeletal PRP, BMAC or stem cells. https://www.cms.gov/medicare-coverage-database/view/ncd.aspx?ncdid=217
- **LCD L39116** (Noridian JE/JF; original Nov 12 2023, revised Oct 23 2025): a non-coverage policy for all amniotic/placental injections or applications for musculoskeletal, non-wound indications; CGS J15 discussed its parallel draft in July 2023. https://www.cms.gov/medicare-coverage-database/view/lcd.aspx?lcdid=39116
- **No NCD or LCD specific to bone graft substitutes** was found; inpatient DRG bundling and the commercial policies above are the operative constraints.
- **CY2026 skin-substitute overhaul** (context for the 361 economy): CMS stopped ASP-based payment, unpackaged products from CPT 15271-15278, created APCs 6000 (PMA), 6001 (510(k)) and 6002 (361 HCT/P) with status indicator S1, and set a single rate of **$127.14/cm²** (MM14361; PFS summaries quote ~$127.28 from the rule display) after spending rose from $252M (2019) to >$10B (2024). CMS says it will differentiate rates by FDA category in later years, and a CMMI mandatory prior-auth model includes skin substitutes from 2026. Xtant's 10-K already warns OEM-channel sales "may not repeat" because of this change. Sources: MM14361; https://www.kslaw.com/news-and-insights/health-headlines-november-10-2025 ; https://www.mcdermottplus.com/?p=158801 ; https://www.sec.gov/Archives/edgar/data/1453593/000149315226013792/form10-k.htm

### A5. Value analysis, GPOs and physician preference

- Value analysis committees treat biologics as physician-preference items (PPI); AHRMM research cited by a vendor guide puts PPI at 40-60% of hospital supply cost. https://getprovyx.com/resources/healthcare-value-analysis-committee-guide/
- GPO leverage is explicit in SEC filings: Orthofix says GPOs "negotiate pricing for their member hospitals and require us to discount," that certain of its DBM products are priced above competitors', and that exclusion from a GPO supplier list would cut sales; its 1Q25 spine growth was offset by a pricing decrease tied to a joint venture between a large hospital account and a GPO. https://www.sec.gov/Archives/edgar/data/884624/000119312526065189/ofix-20251231.htm ; https://www.orthoworld.com/orthofix-distributor-transition-aimed-at-unlocking-growth/
- Cerapedics claims a Vizient supplier agreement reaching 65%+ of US acute-care providers in 2026 (secondary source; not confirmed on Vizient's site). https://yespress.io/valeska-schroeder.md
- Xtant runs a "national accounts program" for GPO/IDN access alongside 670+ independent agents. (10-K above)
- Public price benchmarks are thin and dated: one published cost comparison used BMP ≈ $3,500/case, Osteocel ≈ $472/cc, DBM ≈ $180/cc (undated figure) — https://www.researchgate.net/figure/Cost-Savings-Analysis-Cost-comparison-Chart-for-176-cc-of-common-allograft-bone_fig1_276493850 ; an IndexBox page models synthetic putties at $45-85/cc and allograft putties at $140-220/cc under contract (modeled, unverified) — https://www.indexbox.io/search/dental-bone-graft-putty-price-evidence-united-states-2026/. Treat both as illustrative only.

---

## Part B — Sales channels and market map

### B1. Market size (third-party estimates; definitions differ)

| Source | Scope | Figure | Year |
|---|---|---|---|
| ORTHOWORLD, "Orthobiologics Market Size and Share," Apr 2026 | worldwide orthobiologics (bone graft, cellular, HA, etc.) | **$5,864.5M**, +3.2%; ≈9% of orthopedics | 2025 |
| ORTHOWORLD (same) | US orthobiologics | **$4,099.3M**, +3.5% (≈70% of world) | 2025 |
| ORTHOWORLD (same) | structure | >20 companies ≥$50M; no company >9.6% share | 2025 |
| Gabelli, Orthopedics Market 2026 | total orthopedics / spine | $62B / $11.4B | 2025 |
| iData Research, Global Orthopedic Biomaterials Market (cited by Kuros) | extremities biologics | USD 1.3B | Feb 2025 |
| IMARC | US orthobiologics (own definition) | USD 1.5B, 3.5% CAGR 2025-33 | 2024 |
| Research and Markets | bone grafts & substitutes | $3.57B (2025) → $3.79B (2026) | 2025-26 |

ORTHOWORLD's 2025 vendor ranking: Medtronic $563.1M (+3%), MTF Biologics $525.0M (+2.5%), Bioventus $408.3M (+5.4%), LifeNet Health $351.0M (+3.5%), J&J MedTech $343.7M (−1.8%), Stryker $328.2M (+1.3%), Sanofi $258.8M (−4.5%, HA), Heraeus $252.9M (+5.8%, cement), AlloSource $185.0M (+3.1%), Arthrex $158.9M (+3.8%); Kuros US >$140M (+71.7%); BONESUPPORT US +36%. Two of the top five are non-profit tissue banks. Sources: https://www.orthoworld.com/?p=67921 ; https://gabelli.com/research/orthopedics-market-2026/ ; https://www.biospace.com/press-releases/kuros-biosciences-delivers-72-year-over-year-sales-growth-reaching-usd-146-1-million-for-2025 ; https://imarcgroup.com/united-states-orthobiologics-market ; https://www.researchandmarkets.com/reports/5939199/bone-grafts-substitutes-market-report

Company-reported segment figures: Zimmer Biomet orthobiologics $148.7M FY2025 (+4.2%), $25.3M 1Q26 (+7.6%); Bioventus Surgical Solutions $203.7M 2025 (+7.6%); Orthofix orthobiologics $33.7M 1Q25 (−3.2%); Kuros MagnetOs USD 143.9M 2025; BONESUPPORT US SEK 295.2M 2Q26 (+25%, 93.8% gross margin).

### B2. Who sells what, and how (details and sources in bd-lens.json)

- **Medtronic** — Infuse (rhBMP-2; TLIF PMA supplement S096 Feb 13 2026; NTAP Oct 2026), Infuse/Mastergraft, Mastergraft ceramics, Grafton DBM, plus MagnetOs as Kuros's sales agent. Direct. #1 by Orthoworld estimate. Class 2 Grafton recall Aug 12 2026 (donor bone positive for *Clostridium butyricum*, 18 units, 13 states). https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfRES/res.cfm?id=222236
- **Stryker** — Vitoss family, Augment/Augment Injectable (rhPDGF), BIO4 (made by Osiris/Smith+Nephew), Pro-Dense/Pro-Stim/OsteoSet, FusionFlex/Ignite DBM, AlloFiber/AlloMatrix. Direct. https://www.stryker.com/us/en/portfolios/orthopaedics/trauma-and-extremities/biologics/bone-grafting.html
- **J&J MedTech / DePuy Synthes** — chronOS, DBX (MTF), ViviGen (LifeNet) **[unverified this sweep]**, Fibergraft **[unverified]**, and from May 26 2026 exclusive US/Canada/Australia distribution of CGBIO's NOVOSIS rhBMP-2 graft (US IDE enrolling). Direct. Only top-10 decliner. https://www.jnjmedtech.com/en-US/company/depuy-synthes/news/depuy-synthes-enters-exclusive-us-canada-and-australia-distribution-agreement-cgbios
- **Zimmer Biomet** — bone grafting, PRP/BBMA concentration systems, allograft (PrimaGen), Genex (Biocomposites) distribution. Converting 1099 territories to direct: CEO says its average rep does ~7 cases/week vs 16-17 at the lead competitor and double digits where already direct. https://www.orthoworld.com/zimmer-biomet-transformation-off-to-strong-start-in-2026/
- **Globus Medical** (NuVasive, Nevro) — Osteocel Plus/Pro (third-party tissue bank supply), ViaCell, Kinex/Kinex Plus, DBM/allograft, amniotic barrier, Harvest autologous systems; Attrax/Propel status unverified. Direct employed reps plus exclusive independent distributors on commission. https://www.globusmedical.com/products/biologics/
- **Orthofix** (SeaSpine, IsoTis OrthoBiologics) — Trinity Elite, Virtuos, FiberFuse (all MTF; exclusive rights, Trinity through 2032), Strand/Strand Plus fibers, Evo3/Accell, Torrent, DynaGraft II, OrthoBlast II, Cove, Mozaik, Ballast, facet-fusion kits. Independent distributors and agents under regional business managers; 2025-26 "distributor transition." **No biologics divestiture or strategic review found** — Q2 2026 call: biologics "approximately flat" after double-digit declines, investing in OsteoCov/Virtuos evidence and a Strength+ registry; guidance raised to $845-855M. FDA warning letter to IsoTis OrthoBiologics (Irvine) Feb 24 2026 over Accell-family particulate CAPA, unvalidated demineralization press and risk files (possible particulate 2008-2024). https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/isotis-orthobiologics-inc-723370-02242026 ; https://www.fool.com/earnings/call-transcripts/2026/08/12/orthofix-ofix-q2-2026-earnings-call-transcript/
- **Bioventus** — OsteoAMP, Signafuse, Exogen; sold Advanced Rehabilitation to Accelmed (Dec 31 2024, $45M). Hybrid [unverified]. https://www.sec.gov/Archives/edgar/data/1665988/000166598826000010/bioventusex-991q42025.htm
- **Smith+Nephew** — owns Osiris (2019, $660M): BIO4 (marketed by Stryker), Grafix, Cartiform; REGENETEN/Agili-C in sports med. A supplier more than a bone-graft brand.
- **Arthrex** — AlloSync DBM family, Angel cPRP/BMA, ACP/ACP Max, BioSurge kits; JRF Ortho support. Agency-based direct model [unverified]. https://www.arthrex.com/orthobiologics
- **Enovis** — distributes Ossium's OssiGraft viable bone allograft and referenced NovaBone synthetics on its Feb 2026 call [relationship unverified]; Manafuse stimulator. https://www.orthoworld.com/enovis-and-ossium-partner-for-ossigraft-distribution
- **Baxter** — Actifuse (ex-ApaTech 2010) still in the US catalog; **no divestiture found**. https://catalog.baxter.com/baxterUS/en/Products/Surgical-Equipment-%26-Technologies/ACTIFUSE-bone-graft-substitute/p/ACTIFUSE
- **Integra** — no orthobiologics today: Accell/Evo3, OrthoBlast, DynaGraft, Mozaik and the IsoTis Irvine plant went with the SeaSpine spin-off (2015 [unverified year]) and are Orthofix assets per Orthofix's 10-K; C9359/C9362 are the fossil record.
- **Isto Biologics** (Keensight-backed since ~Oct 2025) — Magellan/Precise autologous systems, Influx allografts, InQu synthetic, Biologica (2023), and **NovaBone** (bioactive glass; acquired from Halma plc, announced Aug 4 2026). https://www.newswire.com/news/isto-biologics-strengthens-its-bone-graft-substitutes-platform-with-the
- **Cerapedics** — i-FACTOR (PMA P140019, 2015) and PearlMatrix P-15 (PMA Jun 23 2025; ALIF/PLIF/OLIF/LLIF added Jan 13 2026; ASPIRE 24-month data in *Spine* Dec 2025). Vizient agreement claimed. https://cerapedics.com/news
- **BONESUPPORT** — CERAMENT BVF/G/V; US direct force with commissioned agents (Q2 2026 "sales commissions and fees" SEK 95.3M); CERAMENT V De Novo pending; spine BVF launch on track. https://storage.mfn.se/a/bonesupport-holding/d54f2be9-7207-476b-9823-b7a345a4a543/bonesupport-presentation-q2-2026.pdf
- **Biocomposites** — Stimulan, Genex (via ZB), NanoBone (Artoss, Jun 2023). https://www.orthoworld.com/biocomposites-acquires-artoss-and-nanobone-technology
- **Kuros** — MagnetOs family; own direct force plus Medtronic agency; 100,000 surgeries; 2026 guidance ≥35% growth; 2028 target USD 300-330M.
- **Elutia (ex-Aziyo) → Berkeley Biologics (GNI Group)** — ViBone/FiberCel/OsteGro sold Sep 2023 for up to $35M; CBER warning letter Jun 28 2024 says the viable bone matrices are *not* 361 products (not minimally manipulated; combined with another article) and are unapproved biologics, with donor-sepsis screening failures tied to the FiberCel TB outbreak. https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/berkeley-biologics-llc-previously-operating-elutia-inc-orthobiologics-business-unit-formerly-aziyo
- **Spinal Elements** — Orios viable bone matrix, Nevos/Hero/Telegraft DBM, Vidross/Stylos bioactive glass, Provenda placental, Allos/Hero allografts. https://spinalelements.com/products/biologics/
- **SpineArt** — lists a "Biologics" category with no named products; US offering unverified.
- **Alphatec** — AlphaGRAFT DBM/fibers/CBM, 3D ProFuse, BioCORE, Amnioshield; strategic independent distributors plus direct reps.
- **Xtant Medical** — OsteoSponge, OsteoSelect, OsteoVive Plus, OsteoFactor Pro (May 2025; BioHorizons dental private label "Prolifica" Aug 2026), Trivium, nanOss, FibreX; **>670 independent sales agents and stocking agents** vs 28 direct sales/marketing employees; private-label/OEM channel (lower margin); bought Surgalign hardware/biologics for $5M (Aug 2023); sold Coflex/CoFix to Companion Spine for $19.2M (Dec 2025). https://www.sec.gov/Archives/edgar/data/1453593/000149315226013792/form10-k.htm
- **RTI Surgical → Surgalign / Evergen** — Surgalign (ex-RTI public entity, SEC revenue-fraud settlement $2M) filed Chapter 11 in June 2023; Xtant took hardware/biologics, Augmedics the digital assets ($900K). RTI's tissue-processing business, now **Evergen** (Alachua, FL; Cook Biotech, Collagen Solutions), is a CDMO/private-label manufacturer behind many branded allografts. https://www.beckersspine.com/?p=56684 ; https://www.medtechdive.com/news/augmedics-acquire-surgalign-assets-bankruptcy/689576/
- **Nexus** — no orthobiologics company by that name located; flagged in JSON.

**Tissue banks and the "many brands, few processors" point.** MTF Biologics (non-profit; Trinity ELITE, DBX, fiberFUSE, Virtuos, FlexHD, CONFORM, spacers; ~$525M), LifeNet Health (ViviGen [unverified], Optium DBM; ~$351M), AlloSource (AlloFuse, AlloStem, ProChondrix, cellular bone; ~$185M; "largest processor of cellular bone allografts"), Bone Bank Allografts (sterile DBM, SteriScaf fibers, amnion patches), Community Tissue Services (Maxxeus; JRF Ortho JV with AlloSource), JRF Ortho (fresh osteochondral, with Arthrex support), VIVEX (amniotic, bioactive scaffolds, VIA Disc NP) and Evergen supply the branded cellular allografts and DBMs that device companies sell under their own names. Payer policies make the mapping explicit: BCBSOK lists "Trinity Evolution/Trinity Elite (MTF Biologics, Orthofix)," "Osteocel Plus (NuVasive)," "AlloStem (AlloSource)," "FusionFlex/Ignite (Wright, now Stryker)," and UHC cites ECRI reviews of "Bio4 (Osiris)," "PrimaGen (Zimmer Biomet)" and "OsteoAMP (Bioventus)." Orthofix books *marketing fees* on MTF tissue rather than product revenue — the economic signature of a brand-on-processor model. Sources: https://www.mtfbiologics.org/our-products ; https://allosource.org/ ; https://bonebank.com/ ; https://www.lifenethealth.org/ ; https://mtec-sc.org/life-sciences/vivex-biologics-inc ; https://sportsmedicineweekly.com/science/about-jrf-ortho/

### B3. Distributor landscape and the move to direct

- Spine biologics still run largely through commissioned independent (1099) agents and stocking distributors: Xtant 670+ agents vs 28 direct S&M staff; Orthofix spine/biologics "primarily" independent distributors and agents under company business managers; Globus and Alphatec mix exclusive independents with direct reps; SI-Bone 300+ agents; OrthoPediatrics agencies 56% of 2025 sales. Sources: Xtant and Orthofix 10-Ks; Globus 10-K; https://gabelli.com/research/orthopedics-market-2026/
- The 2024-2026 shift: Zimmer Biomet is converting 1099 territories to specialized direct reps and quantifies the productivity gap (7 vs 16-17 cases/week); Orthofix is "exiting lower-performing relationships" and moving territories to "a larger, much more capital-efficient commercial partner," taking a 2025 biologics hit to do it; Kuros layered Medtronic's direct force on top of its own; BONESUPPORT's selling expense and commission lines are both rising as it builds US coverage. Sources: ZB and Orthofix Orthoworld pieces above; https://www.sec.gov/Archives/edgar/data/0000884624/000119312526333822/ofix-20260630.htm
- Compliance overlay: the OIG 2013 Special Fraud Alert called physician-owned distributorships "inherently suspect" under the anti-kickback statute and found PODs supplied ~20% of spinal fusion devices billed to Medicare; the Sunshine Act / CMS Open Payments requires manufacturers (and applicable GPOs) to report payments and physician ownership, so a biologics line sold through surgeon-owned stocking distributors shows up in public data. Sources: https://policymed.com/2015/08/oig-continues-scrutiny-of-physician-owned-distributors-of-spinal-devices-with-new-report-last-week-the-department-of-health.html ; https://hallrender.com/2015/08/27/oig-issues-report-addressing-ownership-overlap-between-physician-owned-hospitals-and-physician-owned-distributors-2/ ; https://openpaymentsdata.cms.gov/
- Private label/OEM is a distinct low-margin channel (Xtant: "generally carries lower gross margins than the independent agent channel"; SimpliGraft license terminated Dec 31 2025).

### B4. Market moves 2023-2026 (dated)

- 2023-01: Orthofix–SeaSpine all-stock merger closes. (Orthofix 10-K)
- 2023-03: Xtant buys Coflex/CoFix from Surgalign (~$17M). (medtechdive)
- 2023-06-06: Biocomposites acquires Artoss (NanoBone). (Orthoworld)
- 2023-06: Surgalign files Chapter 11. 2023-08-10: Xtant closes on Surgalign hardware/biologics ($5M); Augmedics takes digital assets ($900K). (BioSpace; medtechdive)
- 2023-07: Aziyo/Elutia viable bone matrix recall. 2023-09-18: Elutia sells orthobiologics to Berkeley Biologics (GNI) for up to $35M. (GlobeNewswire)
- 2023-09-01: Globus completes NuVasive merger (Osteocel, Attrax, Propel into Globus). (Globus 10-K)
- 2023-10: Isto Biologics combines with Biologica Technologies. (CB Insights)
- 2023-11-12: Noridian LCD L39116 non-coverage of MSK amniotic injections takes effect. (CMS MCD)
- 2024-06-28: FDA CBER warning letter to Berkeley Biologics — viable bone matrices are not 361 HCT/Ps. (FDA)
- 2024-10 → 2024-12-31: Bioventus divests Advanced Rehabilitation to Accelmed ($45M). (MassDevice)
- 2025-01: Medtronic becomes exclusive US spine sales agent for Kuros MagnetOs (5 years). (medtechdive)
- 2025-02-05/04-03: Globus announces and closes Nevro ($5.85/share). (SEC 8-K)
- 2025-05-08: Orthofix accelerates US distributor transition; 1Q25 orthobiologics −3.2%. (Orthoworld)
- 2025-05-28: Xtant launches OsteoFactor Pro; Trivium DBM and CollagenX also launched in 2025. (Xtant IR)
- 2025-06-23: FDA PMA approval of Cerapedics PearlMatrix P-15 for lumbar fusion; first US patient Jul 8. (Cerapedics)
- 2025-08-04: FY2026 IPPS final rule (CMS-1833-F) — level-based spinal fusion DRG family in force Oct 1 2025 (inferred from Table 5 comparisons). (CMS)
- 2025-10-23: L39116 revised/consolidated JE+JF. (CMS MCD)
- 2025-11-21: CY2026 OPPS/ASC final rule (CMS-1834-FC): skin substitutes unpackaged at $127.14/cm²; IPO phase-out begins; C1602 CPT list updated. (MM14361)
- 2025-12: Xtant sells Coflex/CoFix + OUS Paradigm to Companion Spine ($19.2M). (Xtant 10-K)
- 2025 FY: Kuros sales USD 146.1M (+72%); BONESUPPORT US +36%; Orthoworld pegs world market at $5.86B.
- 2026-01-13: PearlMatrix expanded indications (ALIF/PLIF/OLIF/LLIF). (Cerapedics)
- 2026-02-13: FDA approves Infuse for 1-2 level TLIF (P000058/S096). (Aetna CPB 0411 references; Medtronic)
- 2026-02-24: FDA warning letter to IsoTis OrthoBiologics (Orthofix unit, Irvine) — Accell family particulate/CAPA/validation. (FDA)
- 2026-03: CMS C&M Spring update: new XW0 substance value for rhBMP-2 with collagen scaffold, body part Joints. (CMS)
- 2026-04-29: ZB 1Q26: orthobiologics +7.6%; 1099-to-direct conversion. (Orthoworld)
- 2026-05-26: DePuy Synthes exclusive US/Canada/Australia distribution of CGBIO NOVOSIS (rhBMP-2; US IDE enrolling). (BusinessWire)
- 2026-07-16: BONESUPPORT Q2: US CERAMENT G SEK 243.5M; CERAMENT V De Novo questions due end-Aug. (BONESUPPORT)
- 2026-07-31/08-04: FY2027 IPPS final rule: new DRGs 523-525; antibiotic-eluting BVF added to MCC tiers of 8 DRGs; +2.3% update. (CMS; HFMA)
- 2026-08-04: Isto Biologics acquires NovaBone from Halma. (Newswire)
- 2026-08: Xtant–BioHorizons (Henry Schein) dental private label of OsteoFactor Pro as Prolifica; MIMEDX–Sanara MedTech deal reported (headline only, unverified). (Orthoworld)
- 2026-08-12: Medtronic Class 2 recall of Grafton Orthoblend/Paste batch A62881 (*C. butyricum*), posted Oct 9 2026. (FDA)
- 2026-08-12: Orthofix Q2: biologics ~flat; guidance raised; no divestiture. (Motley Fool transcript)
- 2026-09-02: Medtronic announces Infuse-TLIF NTAP, effective Oct 1 2026, max $4,396.60. (Medtronic)
- 2026-10-01: FY2027 DRGs, NTAP and XW0U0CC effective; Cigna 0118 revision effective.

### B5. What a hiring VP would challenge

1. **"Bundled means payer policies don't matter."** They do — through prior auth, audits and site-of-care steering. UHC's 2026 policy excludes ceramics and bioactive glass outright; HCSC/Blue Shield CA require "autograft not feasible" for Infuse. Show you know which products are exposed (MagnetOs, Vitoss, Signafuse, Kinex, NovaBone under UHC; every cellular allograft everywhere).
2. **"Infuse in TLIF has NTAP, so it's a tailwind."** NTAP is capped at $4,396.60, applies only to Medicare FFS inpatients whose costs exceed the DRG, lasts ~3 years, and commercial payers (Aetna aside) still deny TLIF. Quantify the addressable slice before calling it a growth driver.
3. **"CERAMENT G's DRG win is a one-off."** It is the first time CMS retitled trauma DRGs around a biologic; combined with the live C1602 pass-through, it is the template a synthetic-with-drug competitor (Biocomposites Stimulan, Zimmer/Genex) would try to copy — and a reason spine BVF launches matter less than infection indications.
4. **"Brand share = manufacturer share."** Two of the five largest "vendors" are MTF and LifeNet; Orthofix books marketing fees, not product sales, on Trinity. Ask who controls processing capacity, donor supply and 361 status before valuing a brand — the Berkeley Biologics letter shows FDA can reclassify a viable bone matrix as an unapproved biologic and end a franchise.
5. **"Go direct."** ZB's 7-vs-16 cases/week argument is real, but Orthofix paid for its transition with a year of biologics declines, and Xtant's 670 agents cost 28 employees. The honest answer is product-dependent: osteoinductive/PMA products with evidence (PearlMatrix, Infuse, CERAMENT G) justify direct reps; commodity DBM and allograft do not.
6. **"Market is $6B and growing."** Orthoworld's $5.86B world / $4.10B US includes HA injections and cement; bone graft substitutes proper are roughly $3.6B worldwide (Research and Markets) and growing low single digits, with the growth concentrated in two synthetic challengers (Kuros +72%, BONESUPPORT +36%) taking share from DBM/cellular. Separate the categories before quoting a CAGR.
7. **"Skin-substitute reform is a wound-care story."** CMS has now encoded PMA/510(k)/361 as payment tiers and intends to pay 361 products differently; Xtant already flags OEM revenue at risk. Any 361 orthobiologic strategy should assume the same logic reaches orthopedics when a separately paid code exists.
8. **Stale DRG numbers and the Globus–Kuros myth** are the two fastest ways to lose credibility in an interview; both were in the brief and both are corrected above.

### Gaps (not closed in this sweep)

- Anthem/Elevance bone graft and BMP guideline numbers and dates (site is state-gated; search budget exhausted).
- Exact FY2026 final-rule text creating the level-based spinal fusion DRGs (inferred from Table 5; 90 FR, Aug 4 2025).
- C1602 pass-through start/expiry date; the CERAMENT G X-code.
- MPFS status of 20936-20938/20939 for CY2026; any payer policy naming 0565T/0566T.
- Current J&J/DePuy biologics catalog (ViviGen, Fibergraft) and SpineArt's US biologics; SeaSpine spin-off year; Evergen ownership; "Nexus."
- Vizient/Premier/HealthTrust contract terms (member-only); no public cost-per-cc benchmark newer than the dated ResearchGate figure.
