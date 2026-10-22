# Orthobiologics in the US: a regulatory primer

Written for the Biologics Atlas, 2026-10-21. Audience: a smart non-lawyer in medical-device business development. Everything below is sourced to FDA pages, statute/regulation text, court decisions or peer-reviewed papers; where a fact comes from a secondary source (law-firm note, trade press, company release) it is labeled as such. Nothing here is legal advice.

---

## 1. The three lanes: 361 HCT/P, 351 biologic, device

A product made from human cells or tissue can land in one of three regulatory lanes. Which lane decides whether the company needs clinical trials before selling it, what it can claim, and what a surgeon can do with it.

### 1a. Section 361 HCT/Ps: registration, no premarket review

"HCT/P" means human cells, tissues, and cellular and tissue-based products (21 CFR 1271.3(d)). An HCT/P is regulated *solely* under section 361 of the Public Health Service Act and 21 CFR Part 1271 (registration, donor screening, good tissue practice, no premarket approval) only if it meets **all four** criteria in 21 CFR 1271.10(a):

1. **Minimally manipulated.** For structural tissue (bone, skin, amniotic membrane, nucleus pulposus), processing must not alter "the original relevant characteristics of the tissue relating to the tissue's utility for reconstruction, repair, or replacement" (21 CFR 1271.3(f)(1)). For cells and nonstructural tissue (bone marrow, cord blood), processing must not alter "the relevant biological characteristics of cells or tissues" (1271.3(f)(2)).
2. **Homologous use only.** The product performs the same basic function(s) in the recipient that it performed in the donor, as reflected by the manufacturer's labeling, advertising and other intent.
3. **Not combined with another article**, except water, crystalloids, or a sterilizing, preserving or storage agent that raises no new clinical safety concerns.
4. **Either** (i) no systemic effect and not dependent on the metabolic activity of living cells for its primary function, **or** (ii) it has a systemic effect or depends on living cells but is for autologous use, use in a first- or second-degree blood relative, or reproductive use.

Fail any one criterion and the product is a drug, device and/or biological product under the FD&C Act and section 351 of the PHS Act, and needs a BLA (or device clearance/approval) and an IND/IDE for clinical use.

Sources: 21 CFR 1271.10 and 1271.3 as quoted in FDA's guidance "Regulatory Considerations for Human Cells, Tissues, and Cellular and Tissue-Based Products: Minimal Manipulation and Homologous Use" (final Nov 2017, corrected Dec 2017, revised July 2020), https://www.fda.gov/media/109176/download ; Federal Register notice of availability, 82 FR 54290 (Nov 17, 2017), docket FDA-2017-D-6146, https://www.federalregister.gov/documents/2017/11/17/2017-24838/regulatory-considerations-for-human-cells-tissues-and-cellular-and-tissue-based-products-minimal . (The eCFR itself blocked automated retrieval on 2026-10-21; the criteria above are taken from the FDA guidance's restatement of the regulation and from FDA warning letters that quote 1271.10(a).)

Two exceptions in 21 CFR 1271.15 matter in orthopedics:
- **1271.15(b), the "same surgical procedure" exception**: an establishment that removes HCT/Ps from a patient and implants them back into the same patient during the same surgical procedure is exempt from Part 1271 entirely. FDA reads this narrowly: the implanted material must be the same HCT/P "in its original form", with only rinsing, cleansing, sizing or shaping. See FDA guidance "Same Surgical Procedure Exception under 21 CFR 1271.15(b): Questions and Answers" (Nov 2017), https://www.hhs.gov/guidance/sites/default/files/hhs-guidance-documents/FDA/Same-Surgical-Procedure-Exception-under-21-CFR-1271.15%28b%29-_Questions-and-Answers-Regarding-the-Scope-of-the-Exception.pdf . Both appellate courts that have examined this (section 5) agreed with FDA.
- **Minimally manipulated bone marrow for homologous use, not combined with another article, is not an HCT/P at all** (21 CFR 1271.3(d)(4), restated in the 2017 guidance). This is the hook on which intra-operative autologous bone marrow aspirate concentrate (BMAC) has historically hung.

### 1b. Section 351 biologics: BLA

A cellular product that is more than minimally manipulated (culture-expanded MSCs, gene-modified cells), used non-homologously (umbilical cord tissue injected into a knee), or allogeneic and dependent on living cells for its effect is a biological product under PHS Act 351(i). It needs an Investigational New Drug application (IND) for trials and a Biologics License Application (BLA) to market. CBER's Office of Therapeutic Products reviews these. The current FDA list of licensed cellular and gene therapy products ("Approved Cellular and Gene Therapy Products", content current as of 09/17/2026) contains 54 entries; the only musculoskeletal product on it is MACI (autologous cultured chondrocytes on a collagen membrane, for knee cartilage defects). **There is no FDA-licensed cell or gene therapy for bone healing, fracture, nonunion or spinal fusion.** Source: https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/approved-cellular-and-gene-therapy-products .

### 1c. Devices: 510(k), PMA, De Novo, HDE

Products that act physically rather than chemically or metabolically are devices (FD&C Act 201(h)). The four device routes, in rising order of evidence burden:
- **510(k)**: Class I/II; show substantial equivalence to a legally marketed predicate. Bench and animal data usually suffice; clinical data are sometimes required. Most bone void fillers, DBM-plus-carrier products, synthetic ceramics, and PRP/BMAC preparation systems travel this road.
- **De Novo**: for novel low-to-moderate risk devices with no predicate; creates a new classification regulation that later 510(k)s can cite.
- **PMA (premarket approval)**: Class III; requires valid scientific evidence of safety and effectiveness, normally a pivotal IDE trial. Infuse (rhBMP-2), OP-1 (rhBMP-7, now withdrawn), i-FACTOR and PearlMatrix (P-15 peptide), and Augment (rhPDGF-BB) are PMA combination products with CDRH as lead center.
- **HDE (humanitarian device exemption)**: for conditions affecting not more than 8,000 US patients per year; requires probable benefit, not effectiveness. OP-1 Putty for revision posterolateral lumbar fusion was marketed under an HDE (H020008) before Stryker and then Olympus exited the product.

Clinical investigations of significant-risk devices run under an Investigational Device Exemption (IDE), the device analogue of an IND. Expedited device programs (Breakthrough Device designation) are separate from the biologics programs described in section 7.

---

## 2. Why DBM with a carrier is a 510(k) device

FDA's jurisdictional update on human demineralized bone matrix (content current as of 02/16/2018) states that DBM alone meets the 361 HCT/P criteria, but DBM combined with sodium hyaluronate, glycerol or calcium phosphate to make a putty or paste does not, because those components are not sterilizing, preserving or storage agents (criterion 3 above). The added components are intended to help fill bone voids and do not act chemically or metabolically, so they meet the device definition; the combined product is regulated under the device provisions of the FD&C Act with CDRH (Division of Surgical, Orthopedic and Restorative Devices) as lead. In practice these are cleared by 510(k) as bone void fillers; a published comparison table lists, for example, Optium DBM (DBM in glycerol) and Progenix and AlloFuse as 510(k)-cleared.

Sources: https://www.fda.gov/combination-products/jurisdictional-updates/jurisdictional-update-human-demineralized-bone-matrix ; 510(k) status table in PMC7103314 (https://pmc.ncbi.nlm.nih.gov/articles/PMC7103314/table/t0005). The 2017 MM/HU guidance also references FDA's 2001 DBM guidance and gives the homologous-use example that demineralized cortical bone used to fill bony voids in the extremities, cranium and spine, or to augment posterolateral spinal fusion, is a homologous use.

---

## 3. Cellular bone allografts (Trinity, Osteocel, ViviGen): marketed as 361, with an "osteoinductive" claim that sits on a fault line

Cellular bone allografts (cancellous bone with preserved viable donor cells, often with DBM) are distributed as 361 HCT/Ps on the manufacturer's own determination that they are minimally manipulated bone used homologously (bone to repair bone). FDA does not pre-approve that determination; a company registers its establishment and lists the product, and may ask the Tissue Reference Group for an informal opinion. The ViviGen protocol posted on ClinicalTrials.gov (NCT04007094) states that ViviGen "meets the 21 CFR 1271.10 criteria for regulation solely under section 361"; that is the sponsor's position, not an FDA finding.

The tension: marketing copy for these products routinely claims they are "osteogenic, osteoinductive and osteoconductive" because they contain living bone-forming cells. Criterion 4 of 1271.10(a) requires that an allogeneic product **not** depend on "the metabolic activity of living cells for its primary function". A product whose selling point is that its living cells form bone is arguing, in effect, that its primary function does depend on living cells. Manufacturers reconcile this by positioning the bone matrix (structural, osteoconductive) as the primary function and the cells as incidental, and by describing the cells' contribution in terms of "bone-forming potential" rather than drug-like activity. FDA has not, as of October 2026, issued a public warning letter to a major cellular bone allograft manufacturer on this point, but it has used exactly this criterion against an allogeneic umbilical cord blood product in August 2026 (R3 Medical letter, section 6). Payers notice the gap: a Blue Cross NC policy (https://www.bcbsnc.com/providers/policies-guidelines-codes/commercial/other-treatments/updates/orthopedic-applications-of-stem-cell-therapy) classifies allograft bone products containing viable stem cells as investigational for all orthopedic applications.

What the evidence actually shows (PubMed-retrieved; DOIs given): a sponsor-run prospective open-label study of Trinity Elite in 252 lumbar fusion patients (NCT02969616) reported high fusion rates irrespective of approach ([DOI 10.14444/8612](https://doi.org/10.14444/8612), 2024) and in 274 subjects stratified by nonunion risk ([DOI 10.1186/s12891-024-07456-4](https://doi.org/10.1186/s12891-024-07456-4), 2024); an academic prospective intra-patient comparison of ViviGen vs autograft in 20 PLF patients (55 levels) found no significant difference in CT fusion grade at 12 months ([DOI 10.1016/j.clineuro.2024.108683](https://doi.org/10.1016/j.clineuro.2024.108683), 2024); a retrospective ACDF comparison found no fusion difference between ViviGen and DBM ([DOI 10.1097/BSD.0000000000001475](https://doi.org/10.1097/BSD.0000000000001475), 2023); and an athymic-rat PLF model funded in part by Orthofix and MTF found large differences among six commercial cellular bone matrices, with Osteocel Pro, Bio4 and Map3 producing zero fusions ([DOI 10.1002/jsp2.1084](https://doi.org/10.1002/jsp2.1084), 2020). No randomized trial has shown a cellular bone allograft superior to non-cellular allograft or autograft.

---

## 4. The 2017 framework and the enforcement-discretion window

On November 16, 2017 FDA released a "comprehensive regenerative medicine policy framework" built on four final guidances (listed on FDA's framework page, https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/framework-regulation-regenerative-medicine-products ):
1. Minimal Manipulation and Homologous Use (the MM/HU guidance, above);
2. Same Surgical Procedure Exception under 21 CFR 1271.15(b);
3. Expedited Programs for Regenerative Medicine Therapies for Serious Conditions (Fast Track, Breakthrough, and the new RMAT designation);
4. Evaluation of Devices Used with Regenerative Medicine Advanced Therapies (required by Cures Act section 3034).

The MM/HU guidance announced a **36-month enforcement-discretion period** for products that fail the 361 criteria but are used autologously and not in a way that raises reported safety concerns, to give manufacturers time to file INDs. The period originally ran to November 2020; in July 2020 FDA extended it, citing COVID-19, to **May 31, 2021** (85 FR 44037, July 21, 2020, https://www.govinfo.gov/content/pkg/FR-2020-07-21/html/2020-15718.htm ). CBER Director Peter Marks said publicly in April 2021 that it would not be extended again (reported by RAPS and law firms, https://www.raps.org/resource/cber-qa-addresses-stem-cell-enforcement-questions.html ). During the window FDA did not stay idle: a July 2021 Hogan Lovells summary counted 14 Warning Letters and 24 Untitled Letters to HCT/P manufacturers since 2017, plus roughly 400 "it has come to our attention" letters to manufacturers and providers since December 2018 (https://www.hlc.com/en/publications/times-really-up-fda-authority-to-crack-down-on-regenerative-medicines-upheld-as-grace-period-ends ).

(The original November 16, 2017 press release URL on fda.gov returned 404 on 2026-10-21; the Federal Register notice and the FDA framework page are the citable records.)

---

## 5. After May 31, 2021: warning letters, untitled letters and the two court cases

After June 1, 2021 FDA treated every clinic or manufacturer marketing a non-361 cellular product without an IND/BLA as in violation, at its own risk (CBER Q&A, July 2021, per RAPS). The practical pattern since then:
- **Untitled letters** (lower-tier, posted on the CBER site) for marketing claims and classification problems.
- **Warning letters** (posted in the FDA warning-letter database, 15 working days to respond, threat of seizure/injunction) for repeat offenders and for CGMP failures found on inspection, usually citing FD&C Act 505(a) (unapproved new drug), 301(d), PHS Act 351(a)(1) (unlicensed biologic), and, where processing is deficient, 501(a)(2)(B) with 21 CFR 210/211.
- **Injunction actions** in only two cases, both involving autologous adipose stromal vascular fraction (SVF), and FDA won both on appeal:
  - *United States v. US Stem Cell Clinic, LLC*, 998 F.3d 1302 (11th Cir., June 2, 2021): affirmed summary judgment for FDA; the SVF product fell outside both the same-surgical-procedure exception (what was implanted was not the same as what was removed) and the 361 lane (the clinic intended the cells to perform functions beyond their basic functions). https://law.justia.com/cases/federal/appellate-courts/ca11/19-13381/19-13381-2021-06-02.html
  - *United States v. California Stem Cell Treatment Center, Inc.* (Cell Surgical Network), No. 22-56014 (9th Cir., Sept. 27, 2024): reversed a district-court win for the clinics; held that SVF is a "drug" under the FD&C Act and that the removed HCT/P must be viewed as a whole before significant processing, so enzymatic digestion disqualified the same-surgical-procedure exception. https://caselaw.findlaw.com/court/us-9th-circuit/116597439.html ; analysis at https://www.ropesgray.com/en/insights/alerts/2024/12/stem-cell-litigation-update-fda-won-the-latest-battle-but-the-future-of-hct-p-enforcement

Both cases are about autologous, enzymatically processed fat. Neither decides whether an intra-operative, centrifuged, autologous bone marrow concentrate is covered by the same-surgical-procedure exception or by 1271.3(d)(4); FDA has not litigated or publicly warned on surgical BMAC, and commentators note that the SVF wins may not transfer cleanly to allogeneic perinatal products either (https://ipscell.com/2026/08/big-implications-for-clinic-arena-from-fda-warning-to-r3-stem-cell-david-greene-associated-firms/ ).

---

## 6. Exosomes, umbilical cord, amniotic: what FDA has said and done

**Exosomes.** FDA's "Public Safety Notification on Exosome Products" (December 6, 2019) responded to serious adverse events in Nebraska patients injected with unapproved products marketed as exosomes; it states "there are currently no FDA-approved exosome products", that exosomes used to treat disease are drugs and biologics requiring premarket review, and that clinics claiming otherwise are wrong. https://www.fda.gov/vaccines-blood-biologics/safety-availability-biologics/public-safety-notification-exosome-products . The "Consumer Alert on Regenerative Medicine Products Including Stem Cells and Exosomes" (July 22, 2020; page updated April 9, 2024) repeats that no exosome product is approved, that the only approved stem cell products are cord-blood hematopoietic progenitor cells for blood disorders, and names orthopedic conditions (osteoarthritis, tendonitis, disc disease, back/hip/knee/neck/shoulder pain) as uses for which none of these products is approved. https://www.fda.gov/vaccines-blood-biologics/consumers-biologics/consumer-alert-regenerative-medicine-products-including-stem-cells-and-exosomes . As of the September 17, 2026 version of the approved CGT list, that is still true.

Enforcement examples with public letters:
- **Kimera Labs, Inc.** (Miramar, FL), Warning Letter CBER 23-649343, September 1, 2023: XoGlo and XoGlo Pro exosome products and Amnio2X amniotic-fluid injectable marketed as unapproved drugs and unlicensed biologics after an April 2020 Untitled Letter; ~37,000 vials made April 2020 to June 2022 under deficient CGMP (unvalidated aseptic processing, an uninvestigated positive sterility result on a distributed lot); continued commercial distribution despite an IND (IND 26535) in violation of 21 CFR 312.7(b). https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/kimera-labs-inc-649343-09012023 . FDA's closeout letter of June 12, 2026 records that Kimera ceased manufacture, sale and distribution of the three products. https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/kimera-labs-inc-649343-06122026
- **New Life Medical Services, LLC**, Warning Letter CBER 25-711102, September 24, 2025: Wharton's jelly products (Restor+, Regain, Renyte), amniotic fluid (ReCyte) and an exosome product (Rexo); FDA found failure of both the minimal-manipulation and homologous-use criteria; marketing included orthopedic procedures, bone spurs and non-union fractures. https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/new-life-medical-services-llc-711102-09242025
- **R3 Medical Companies / R3 Stem Cell / Bello Bio / Regen Suppliers** (Scottsdale, AZ), Warning Letter CBER 26-726330, August 14, 2026: umbilical-cord products ReBellaWJ, ReBellaXO, ReBellaXOL and cord-blood ReBellaCB marketed for arthritis, joint pain, cartilage repair, tendonitis and much else; all fail homologous use, ReBellaCB also fails criterion 4 (allogeneic, dependent on living cells); FDA footnotes that the "exosome" products are made by a process that does not appear to isolate exosomes at all; CGMP failures; a May 28, 2019 FDA letter had raised the same concerns seven years earlier. https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/r3-medical-companies-726330-08142026
- **Dynamic Stem Cell Therapy** (Henderson, NV), Warning Letter CBER 25-712579, February 11, 2026: umbilical-cord-derived product marketed for sports injuries, arthritis and joint pain; more than minimal manipulation and non-homologous use; exosome marketing flagged. https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/dynamic-stem-cell-therapy-712579-02112026
- Earlier exosome letters cited in secondary sources (Invitrx 2022; Evolutionary Biologics late 2024; Chara Biologics early 2025) are listed in the notes file as not independently verified against fda.gov.

**Amniotic and placental products.** Two distinct rules apply:
- **Amniotic fluid is not an HCT/P at all**: FDA treats secreted bodily fluids as outside the HCT/P definition, so an injectable amniotic-fluid product is simply a drug/biologic requiring a BLA. Stated in the Kimera (2023), Frontier Biologics (Nov 1, 2024, CBER 25-686059; "Purified Fluid Allograft" marketed by injection for osteoarthritis, joint pain and soft-tissue injury) and Biolab Sciences (2022) letters. https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/frontier-biologics-llc-686059-11012024
- **Amniotic membrane is an HCT/P** whose basic functions in the donor are protection, barrier and fluid-holding; marketing it for wound healing, anti-inflammatory effect, tendon repair or "healing" fails homologous use. Letters: BioXtek (Dec 1, 2025, CBER 26-715478; Sanoplast ECM/Duo marketed for wound care and orthopedic tendon repair), https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/bioxtek-llc-715478-12012025 ; **Celularity** (Dec 1, 2025, CBER 25-681480; Interfyl decellularized placental matrix, distributed by Arthrex, marketed for orthopedic soft-tissue healing; FDA found non-homologous use and cited Arthrex patient materials describing a "chemically active composition"), https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/celularity-inc-681480-12012025 ; Lux Therapeutics/Ponya (Nov 25, 2025, a Part 1271 validation/records letter, per https://ipscell.com/2025/12/celularity-2-other-perinatal-biologics-firms-get-fda-warnings/ ). The historical precedent for injectables is FDA's 2013 Untitled Letter to MiMedx concluding that micronized AmnioFix required a biologics license (company statement: https://www.prnewswire.com/news-releases/mimedx-addresses-fda-untitled-letter-and-reiterates-2013-and-2014-guidance-222392031.html ).

**The adjacent money story.** The wound-care "skin substitute" market, in which 361 amniotic/placental sheets are billed under Q-codes, grew so fast that CMS, in the CY 2026 Physician Fee Schedule final rule (CMS-1832-F, October 31, 2025), cited a nearly 40-fold increase in payments over five years and set a single payment of **$127.28 per cm²** for skin substitutes effective January 1, 2026, grouping products by FDA pathway (PMA, 510(k), 361) and exempting only products licensed under section 351. Reported at https://www.hmpgloballearningnetwork.com/site/wounds/news/regulatory-update-calendar-year-2026-medicare-physician-fee-schedule-final-rule ; the rule itself is CMS-1832-F. This matters to orthobiologics because the same tissue banks sell into both channels, and because it shows CMS using FDA pathway as a pricing variable.

---

## 7. RMAT designation

Created by section 3033 of the 21st Century Cures Act (FD&C Act 506(g)). Eligible: a cell therapy, therapeutic tissue-engineering product, HCT/P, or combination using them, intended for a serious or life-threatening condition, with preliminary clinical evidence that it may address an unmet need. **Products regulated solely under 361 are excluded**, so RMAT is only available to products already on the IND/BLA road. The request is made with or as an amendment to an IND; FDA must respond within 60 days. Benefits mirror Breakthrough (intensive FDA guidance, rolling review, eligibility for priority review and accelerated approval with surrogate endpoints). Source: https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/regenerative-medicine-advanced-therapy-designation (content current 11/04/2025). FDA's cumulative RMAT-count page returned 404 on 2026-10-21; counts are therefore not quoted here. Orthopedic-bone and disc RMATs confirmed in company statements: rexlemestrocel-L (Mesoblast, chronic low back pain), IDCT/rebonuputemcel (DiscGenics), NVD-003 (Novadip, congenital pseudarthrosis of the tibia, June 23, 2025).

---

## 8. Off-label use: a PMA/510(k) device vs a 361 product

**Devices and drugs.** Congress wrote the practice-of-medicine rule into the statute for devices: 21 U.S.C. 396 says nothing in the FD&C Act "shall be construed to limit or interfere with the authority of a health care practitioner" to prescribe or administer any legally marketed device for any condition within a legitimate practitioner-patient relationship, while preserving FDA's authority over labeling and the "existing prohibition on the promotion of unapproved uses". https://www.law.cornell.edu/uscode/text/21/396 . FDA's patient-facing page on off-label drug use says the same for drugs: providers may prescribe for unapproved uses they judge appropriate, but "FDA has not determined that the drug is safe and effective for the unapproved use". https://www.fda.gov/patients/learn-about-expanded-access-and-other-treatment-options/understanding-unapproved-use-approved-drugs-label . So a surgeon may put Infuse in a posterolateral fusion or PearlMatrix in a cervical cage; Medtronic and Cerapedics may not promote those uses, and the surgeon carries the liability and (often) a payer problem. The practical exposure for companies is promotion: Medtronic's 2008 FDA warning letter and the 2012 Senate Finance Committee report on Infuse are the cautionary tale (not re-verified here; see notes).

**361 products.** The logic inverts. A 361 product has no approved indication to be "off" of; it has a *homologous-use* envelope defined by what the tissue did in the donor. A surgeon using a 361 bone allograft to fill a bone void is squarely inside that envelope. But if the manufacturer's labeling, advertising or sales representatives promote the product for a non-homologous use (a nucleus pulposus allograft "to regenerate the disc", an amniotic membrane "to reduce inflammation"), the *product itself* ceases to qualify under 361 and becomes an unlicensed biologic, because intent is read from the manufacturer's statements (21 CFR 1271.10(a)(2) and the 2017 guidance). That is why every letter in section 6 quotes websites, Instagram posts and distributor brochures. For a BD professional the rule of thumb is: with a PMA/510(k) product the label limits what you may say; with a 361 product what you say can change what the product legally is.

---

## 9. Where enforcement stands, 2024-2026

- CBER issued roughly a dozen HCT/P-related warning letters in 2024 (per The Niche tally, https://ipscell.com/2024/10/fdas-cber-fires-off-3-more-warning-letters-on-biologics-for-a-total-of-12-in-2024/ ), continued through 2025 (Supreme Rejuvenation May 2025; New Life Sept 2025; Lux, Celularity, BioXtek Nov-Dec 2025) and into 2026 (Dynamic Feb 2026; R3 Aug 2026; Kimera closeout June 2026). The targets are perinatal tissue banks, exosome makers and clinic networks, not spine or trauma device companies.
- Enforcement remains letter-based. FDA has not obtained a permanent injunction against an exosome or perinatal-product manufacturer; the two injunctions on record are the SVF cases. Observers (The Niche, Aug 2026) note the seven-year gap between FDA's 2019 letter to R3 and the 2026 warning letter.
- The Ninth Circuit's 2024 decision closed the "it's autologous so it's surgery" argument for processed autologous cells; three circuits now agree with FDA's reading (Cooley, Oct 31, 2024, https://www.cooley.com/news/insight/2024/2024-10-31-ninth-circuit-confirms-certain-stem-cell-products-require-fda-premarket-approval ).
- On the approval side, the state of play is unchanged: zero licensed cell or gene therapies for bone; the only new orthobiologic *approval* in the period is a PMA device (PearlMatrix, June 23, 2025, with expanded lumbosacral labeling January 13, 2026).

---

## 10. Timeline of FDA actions relevant to orthobiologics, 2017-2026

| Date | Action | Source |
|---|---|---|
| 2017-11-16 | FDA announces comprehensive regenerative medicine policy framework; four final guidances including Minimal Manipulation/Homologous Use and Same Surgical Procedure; 36-month enforcement discretion announced | FDA framework page; 82 FR 54290 (2017-11-17) |
| 2018-02-16 | FDA jurisdictional update on DBM (page currency date): DBM alone is 361; DBM with carrier is a device | fda.gov jurisdictional update |
| 2019-05-28 | FDA letter to R3 Stem Cell raising concerns about its stem cell therapies (referenced in 2026 warning letter) | R3 warning letter, 2026 |
| 2019-06 | District court (S.D. Fla.) grants FDA permanent injunction against US Stem Cell Clinic | 11th Cir. opinion |
| 2019-12-06 | Public Safety Notification on Exosome Products (Nebraska adverse events; "no FDA-approved exosome products") | fda.gov |
| 2020-04 | Untitled Letter to Kimera Labs (exosomes) | Kimera 2023 warning letter |
| 2020-07-21 | Enforcement discretion extended from Nov 30, 2020 to May 31, 2021 (85 FR 44037) | govinfo |
| 2020-07-22 | Consumer Alert on Regenerative Medicine Products Including Stem Cells and Exosomes (updated 2024-04-09) | fda.gov |
| 2021-03-04 | FDA clears IND for Novadip NVD-003 (CPT) | Novadip press releases |
| 2021-04 | CBER Director Marks: May 31, 2021 end date will not be extended | RAPS (secondary) |
| 2021-05-31 | Enforcement discretion ends | MM/HU guidance rev. July 2020 |
| 2021-06-02 | 11th Cir. affirms FDA in *US Stem Cell Clinic* (998 F.3d 1302) | Justia |
| 2021-07 | CBER Q&A on post-discretion enforcement | RAPS (secondary) |
| 2022-08-23 | Warning Letter to Biolab Sciences (amniotic fluid not an HCT/P) | fda.gov |
| 2022-11-09 | Warning Letter to Invitrx Therapeutics (exosome products) | fda.gov (not re-read) |
| 2023-05-18 | Breakthrough Device designation for Locate Bio LDGraft (ALIF, low-dose rhBMP-2) | Locate Bio |
| 2023-09-01 | Warning Letter to Kimera Labs (XoGlo, XoGlo Pro, Amnio2X) | fda.gov |
| 2024-01 | Breakthrough Device designation for CGBio Novosis Putty (rhBMP-2, Korea) | ODT (trade press) |
| 2024-07 | FDA accepts DiscGenics Phase 3 protocols and manufacturing plan for IDCT | DiscGenics (company) |
| 2024-09-27 | 9th Cir. reverses for FDA in *California Stem Cell Treatment Center* (Cell Surgical Network) | FindLaw |
| 2024-11-01 | Warning Letter to Frontier Biologics (amniotic fluid injectable; amniotic membrane) | fda.gov |
| 2024-11-22 | FDA clears IND for Novadip NVDX3 Phase 2b/3 (cervical fusion) | Novadip |
| 2025-01-17 | Warning Letter to BioStem Life Sciences (CGMP; umbilical cord and amniotic products) | fda.gov (not re-read) |
| 2025-05-05 | Warning Letter to Supreme Rejuvenation (cites exosome safety notification) | fda.gov (not re-read) |
| 2025-06-23 | PMA approval of Cerapedics PearlMatrix P-15 (single-level TLIF); RMAT designation for Novadip NVD-003 (same date) | Cerapedics; Novadip |
| 2025-09-08 | IDE approval for Locate Bio LDGraft (RESTORE expands to US) | Locate Bio / trade press |
| 2025-09-24 | Warning Letter to New Life Medical Services (Wharton's jelly, amniotic fluid, exosome; non-union fracture claims) | fda.gov |
| 2025-10-31 | CMS CY2026 PFS final rule: $127.28/cm² skin-substitute payment, 351-licensed products exempt, effective 2026-01-01 | CMS-1832-F (via HMP) |
| 2025-11-25 | Warning Letter to Lux Therapeutics/Ponya (amniotic membrane patch; Part 1271 records) | The Niche (secondary) |
| 2025-12-01 | Warning Letters to Celularity (Interfyl; non-homologous orthopedic use) and BioXtek (Sanoplast) | fda.gov |
| 2026-01-13 | PMA labeling expansion for PearlMatrix (lumbosacral spine, additional approaches) | Cerapedics |
| 2026-01 | FDA Type B meeting feedback to Mesoblast on rexlemestrocel-L BLA path (12-month pain endpoint in confirmatory trial) | Mesoblast (company) |
| 2026-02-11 | Warning Letter to Dynamic Stem Cell Therapy (umbilical cord product; orthopedic claims) | fda.gov |
| 2026-06-12 | Closeout letter to Kimera Labs | fda.gov |
| 2026-08-14 | Warning Letter to R3 Medical Companies (ReBella umbilical-cord and "exosome" products; criterion 4 cited) | fda.gov |
| 2026-09-17 | Approved Cellular and Gene Therapy Products list current as of this date: 54 products, none for bone | fda.gov |

---

## 11. One-paragraph summary for the app

In the US, a bone biologic is one of three things. A **device** (510(k) or PMA: synthetics, DBM putties, rhBMP-2, P-15, PRP and BMAC *kits*) can be used off-label by surgeons but not promoted off-label. A **361 tissue** (plain allograft, DBM without carrier, cellular bone allografts, nucleus pulposus allograft, amniotic membrane) needs no FDA approval but must stay minimally manipulated and homologous; marketing it for regeneration, inflammation or "osteoinduction via living cells" can convert it into an unlicensed drug. A **351 biologic** (culture-expanded MSCs, disc progenitor cells, gene-modified cells, exosomes, amniotic fluid, umbilical cord injectables) needs an IND to study and a BLA to sell, and as of September 2026 **none** has been licensed for any bone, disc or fusion indication. Enforcement discretion for the grey zone ended May 31, 2021; FDA has won both appellate cases it brought, and warning letters to perinatal, exosome and clinic-network sellers continue through 2026.
