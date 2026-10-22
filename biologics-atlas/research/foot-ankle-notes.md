# Foot and ankle slice: research notes (2026-10-21)

Companion to `foot-ankle.json` (13 applications, 28 products). Everything below is what the JSON could not carry: what was not verified, where evidence is thin, ownership moves, what a foot/ankle biologics hiring manager will push on, and a short read of the market today.

## 1. What could not be verified in this sweep

The sweep hit the shared web-search cap partway through, so a block of ownership and FDA-number checks fell back to direct page fetches and PubMed. Items marked `"unverified": true` in the JSON are listed here with the reason.

- **US procedure volumes.** No public US annual count was verified for any application. The only population-based rates found are Danish (ankle fractures 168.7/100,000/yr, PMID 29413771; foot fractures 142.3/100,000/yr with hindfoot 13.7 and midfoot 6.5, PMID 32499146). Extrapolating those to the US population is flagged as an extrapolation. Ankle arthrodesis vs total ankle arthroplasty trend data (NIS/Medicare papers) were not retrieved because the PubMed queries returned noise; a follow-up search on "Nationwide Inpatient Sample ankle arthrodesis trends" should fix this.
- **Augment pass-through expiry.** Stryker's FAQ confirms category C1734, effective 2020-01-01, "at least two years and no more than three." The exact quarter CMS expired the category was not retrieved. Assume packaged status since 2023 unless the CMS device pass-through list says otherwise.
- **Infuse tibial and oral-maxillofacial PMA numbers** (P000054 and P050053 from memory) were not confirmed; only P000058 (ALIF, 2002-07-02) was fetched.
- **510(k) numbers** for DBX, AlloMatrix, chronOS, Pro-Dense, OsteoSet, CERAMENT BVF, MagnetOs, VitaFuse and the Vitoss family (only K102545 confirmed) were not pulled from the FDA database. Grafton's regulatory status (361 HCT/P vs 510(k)) should be confirmed against the FDA tissue-establishment registration; DBMs with non-tissue carriers are devices, and the line is product-specific.
- **CERAMENT G De Novo number** (DEN21xxxx) was not retrieved; the FDA product-classification page for code QRR lists 21 CFR 888.3046 but no DEN. The June 2022 De Novo grant and the 2024-03-13 510(k) K234008 (open fractures) are confirmed.
- **Bio4 ownership chain.** Osiris Therapeutics was acquired by Smith+Nephew in 2019 (memory, not verified this session). Stryker's live product page still says BIO4 is manufactured by Osiris and sold by Stryker, so the 2014 exclusive marketing agreement appears intact; the current contract terms are not public in anything found.
- **ViviGen distribution.** LifeNet's page does not name DePuy Synthes; the distribution relationship is from memory and should be confirmed from a J&J or LifeNet release.
- **Treace VitaFuse.** Only a September 2026 RTTNews summary of Treace's AOFAS portfolio was found; no 510(k) number, composition detail, or launch date.
- **OssiGraft Prime (Ossium/Enovis).** Only the March 2025 Enovis ACFAS release; regulatory path presumed 361.
- **Medline/Medartis.** No sources surfaced for either in foot/ankle biologics; Medline UNITE is a hardware line. Treat as "no biologics footprint found," not as "none exists."
- **CMS CY2026 physician fee schedule skin-substitute changes** affecting office-based amniotic products: the fact sheet fetch returned nothing usable. The JSON says the payment system was overhauled without quoting rates.
- **Two PDFs failed text extraction**: Stryker's Trauma & Extremities Biologics catalog and MTF's Trinity clinical-evidence summary (both image-heavy). Product descriptions for the Stryker line therefore come from individual product pages, which omit indications and K-numbers.
- **Diabetic foot osteomyelitis admissions** per year in the US: not found with the PubMed queries used.

## 2. Thin evidence, by product

- **Cellular allografts (Trinity, ViviGen, Osteocel, Bio4, OsteoAMP, OssiGraft).** The only prospective foot/ankle study in the class is the Orthofix-funded, single-arm Trinity Evolution trial (n=92; 71% patient-level fusion at 12 months). Everything else is retrospective case series of 14-30 patients. Osteocel, Bio4, OsteoAMP and OssiGraft have no foot/ankle publication found. OsteoAMP is not a viable-cell product and was placed in the cellular-allograft category only for atlas grouping; an independent 2026 muscle-pouch study found it did not form bone.
- **DBM.** Two 2025-2026 reviews (PMID 39850040, PMID 42421266) agree: level III-IV evidence, union comparable to but not better than autograft, strongest in fracture fixation. The one head-to-head in arthroscopic ankle fusion (PMID 35807177) shows no effect.
- **Synthetics (Vitoss, chronOS, HydroSet, Pro-Dense, CERAMENT BVF).** No product-specific foot/ankle outcome trials. The calcaneus cement literature is 15-18-patient series from 2005 with Norian SRS (a DePuy Synthes cement), and two later series show no outcome benefit and a wound-complication association.
- **Antibiotic carriers in the diabetic foot.** The strong CERAMENT G data (96% eradication, 94% at 6 years, 4.4% vs 11.2% recurrence vs calcium-sulfate pellets) are long-bone osteomyelitis from one UK unit. Diabetic-foot-specific data are small and unfavorable for surgeon-mixed calcium sulfate (42% recurrence in 45 US cases). The first diabetic calcaneal RCT (ACHILLS, n=30) started in 2026.
- **BMAC.** Best data are tibial (Hernigou 2005) and Jones-fracture series; the 2025 Duke review says arthrodesis benefit is unproven. The 2026 RNOH series of 227 CT-verified fusions found no union difference with or without graft of any kind.
- **PRP.** No supportive RCT in fusion; the one registered ankle-fusion study was terminated at 10 patients.
- **Amniotic.** Level I evidence exists only for plantar fasciitis injection (MiMedx-funded), for a product form that lost its enforcement-discretion cover on 2021-05-31. Nothing for bone healing.
- **Infuse.** Off-label everywhere in the foot; one 69-patient uncontrolled series (96% union in high-risk fusions) and one 23-patient revision TTC comparison with no difference.
- **Emerging.** MagnetOs (Kuros) started a 126-patient autograft-controlled hindfoot/ankle RCT in November 2025; AMPLEX (Ferring) completed a pivotal in 2020 with 56 patients at 36 sites and went silent; Induce XT (Red Rock) is a 60-patient single-arm series; Locate Bio's LDGraft is spine-only (ALIF, Breakthrough designation 2023, US IDE 2025, NCT07858643) and was deliberately left out of the product list; Carmell's Bone Healing Accelerant hindfoot trial was withdrawn in 2024.

## 3. Ownership and corporate moves to carry in the atlas

- Wright Medical to Stryker (closed November 2020): Augment, Augment Injectable, AlloMatrix, Pro-Dense, OsteoSet all now Stryker Trauma & Extremities.
- Paragon 28 to Zimmer Biomet: merger agreement 2025-01-28, closed 2025-04-21, $13.00 cash per share plus a CVR up to $1.00 (about $1.2B headline). Paragon 28's biologics footprint was small; its 3D-printed and plating lines are the asset. Zimmer Biomet now has a dedicated foot/ankle sales organization to pull its own biologics through.
- Orthofix and SeaSpine merged January 2023 (Trinity ELITE, OrthoBlast II DBM).
- NuVasive to Globus Medical, 2023-09-01 (Osteocel).
- Osiris Therapeutics to Smith+Nephew, 2019 (Bio4 still sold by Stryker; from memory, verify).
- Bioventus divested Advanced Rehabilitation (closed 2024-12-31) but kept OsteoAMP and Exogen.
- Enovis (DJO/Novastep) added OssiGraft Prime (Ossium Health) by ACFAS 2025.
- Treace Medical added VitaFuse bioactive glass by AOFAS 2026, alongside CortiFuse tissue graft.
- Medtronic still owns Grafton (recall record dated August 2026 names Medtronic).

## 4. What a foot/ankle biologics hiring manager would challenge

1. **"Augment is proven superior."** It is noninferior to autograft on a 6-month CT endpoint where both arms fused only 61-66% of patients; the injectable's superiority signal rests on 12 concurrent controls plus borrowed controls. The commercial case is donor-site morbidity, not fusion rate.
2. **Any claim that cellular allografts match autograft.** No controlled foot/ankle data exist; the Trinity trial had no control arm and the 361 pathway means no FDA review of effectiveness. Per-cc pricing in a packaged ASC case is the hard objection.
3. **Nonunion rates.** The 10-15% figure for ankle fusion is dated; modern pooled rates are 6-9%, and the 2026 RNOH series shows 92.5% CT union without routine grafting. The real biologic opportunity is TTC (27% pooled nonunion), Charcot, revision, and the diabetic/smoker host, not primary single-joint fusion.
4. **Site of service.** Most forefoot, midfoot and primary hindfoot fusions are HOPD or ASC cases where the biologic is packaged into a fixed payment; only Augment (2020-2022/23) and CERAMENT G (inpatient DRG reassignment effective 2026-10-01) have had product-specific payment levers. A BD plan that does not model the ASC's margin on a $1,000-3,000 graft against a packaged rate will not survive the interview.
5. **Off-label and 361 exposure.** Infuse in the foot, antibiotic-loaded Stimulan, and injectable amnion all carry compliance risk; the June 2021 FDA memo and 2022-onward CMS overpayment demands for amniotic injections are the precedent.
6. **Who actually sells it.** Biologics in foot/ankle ride on hardware reps: Stryker (Augment/Bio4/AlloMatrix), DePuy Synthes (ViviGen/DBX/chronOS), Arthrex (Angel BMAC, AlloSync DBM, bone-void products), Zimmer Biomet/Paragon 28, Enovis (OssiGraft), Treace (CortiFuse/VitaFuse), Orthofix (Trinity), plus stand-alone BONESUPPORT, Biocomposites, Kuros, Medtronic and Bioventus. A stand-alone biologic without a hardware partner struggles for ASC access.
7. **3D-printed titanium as the biologic's competitor.** In TTC salvage the cage (88-89% pooled union) is displacing femoral-head allograft (50-67%); that is implant revenue, not biologic revenue, and it changes who the "biologics" conversation is with.

## 5. LIPUS (adjacent note only)

Low-intensity pulsed ultrasound (Exogen, Bioventus; PMA-approved for fresh fracture acceleration and established nonunion) is prescribed for foot/ankle delayed unions and sometimes after high-risk fusion. The best evidence is negative: the TRUST trial (PMID 27797787; 501 operatively treated tibial fractures, 43 centers, sham-controlled) found no effect on radiographic healing or function. Nonunion data remain uncontrolled series. It is reimbursed separately (HCPCS E0760, DME) which is why it persists commercially despite the evidence; it is not a bone-graft competitor and was kept out of the product list.

## 6. State of the market today (short)

Foot and ankle is the fastest-growing orthopaedic sub-segment by company statements (Zimmer Biomet called it "one of the highest-growth musculoskeletal specialties" when closing Paragon 28 in April 2025), and biologics in this region are sold almost entirely as pull-through for plates, nails, wedges and total ankles rather than as stand-alone franchises. Augment remains the only PMA-approved, labeled osteoinductive product for ankle and hindfoot fusion a decade after approval, with no competitor having completed a successful pivotal since (AMPLEX stalled; MagnetOs started its RCT in late 2025). The 361 cellular-allograft category (Trinity ELITE, ViviGen, Osteocel, Bio4, OssiGraft) carries the volume on surgeon preference and rep coverage with case-series evidence, while DBM and synthetics compete on price inside packaged ASC payments. The one genuinely new regulatory and reimbursement story is CERAMENT G: the first antibiotic-eluting bone void filler authorized in the US (De Novo June 2022, open-fracture expansion March 2024) with a FY2027 MS-DRG reassignment effective 2026-10-01, aimed squarely at diabetic foot and limb-salvage infection work. Sources: Zimmer Biomet 10-K FY2025 and April 2025 release; FDA PMA P100006 and 510(k) K234008 records; BONESUPPORT release 2026-08-03; ClinicalTrials.gov NCT07225751, NCT03028415; PMID 35705455, 42297664, 39850040, 40680688.
