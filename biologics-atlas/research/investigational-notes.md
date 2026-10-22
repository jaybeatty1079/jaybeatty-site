# Investigational / regulatory slice: research notes

Date: 2026-10-21. Companion to `investigational.json` and `regulatory-primer.md`.

## 1. Method and tool limits

- Sources: FDA pages and warning letters (read directly), ClinicalTrials.gov API, PubMed (metadata and abstracts), company press releases, two appellate opinions via Justia/FindLaw, and law-firm/trade-press summaries where primary pages were unavailable.
- The shared web-search budget ran out partway through the second verification pass. After that point I could only fetch URLs I already had. Items listed under "could not verify" below are mostly casualties of that limit, not of absence of evidence.
- eCFR (ecfr.gov) blocked automated retrieval, so 21 CFR 1271.10, 1271.15 and 864.9245 are cited through FDA documents that restate them (the 2017 guidance, the warning letters, and the BK241083 510(k) summary).
- Three fda.gov URLs returned 404: the Nov 16, 2017 press release, the "FDA Warns About Stem Cell Therapies" consumer update, and the cumulative RMAT-designations table. The Federal Register notice (82 FR 54290) and FDA's framework page substitute for the first; the July 2020 consumer alert substitutes for the second; RMAT counts are not quoted.
- Schema gaps I worked around: `regulatory.path` has no `IDE-only` or `NDA` value. IDE-stage devices (LDGraft) are coded `IND-only` and NDA peptides (teriparatide, abaloparatide) are coded `BLA`, each with a `challenge` note. Suggest adding both values to SCHEMA v0.2.

## 2. What I could not verify (flagged `"unverified": true` in the JSON where it matters)

| Item | What is missing |
|---|---|
| DiscGenics Phase 1/2 publication | Company cites "scientific publications"; PubMed searches on rebonuputemcel / IDCT / discogenic cells returned no trial paper. Endpoints and effect sizes therefore not in the record. |
| Mesoblast MSB-DR003 primary result | The record says the composite primary was not met (consistent with the 2021 announcement and the FDA Type B framing), but the Spine J 2025 abstract was truncated in retrieval and the ClinicalTrials.gov results section was not parsed. Confirm the exact responder rates before publishing. |
| Vivex VIA Disc NP | US market year (2018) from secondary sources; regulatory intent behind the "Phase I/II" and pivotal sham-controlled trials (361 defense vs IND) not stated by the company; CPT 0627T-0630T association from memory. |
| Locate Bio | The IDE press release (Sept 2025, RESTORE, Australia + US) does not match the only ClinicalTrials.gov entry (NCT07858643, AMBITION, Georgia). Check ANZCTR. |
| Kuros KUR-113 discontinuation | Dec 27, 2023 and Mar 13, 2024 statements are from a Synapse summary of Kuros releases; the Kuros IR pages returned 403. |
| Novadip NVDX3 | No NCT, no publication; all data company-reported. |
| OSTEOGROW | No registry entry; US affiliate (perForm Biologics) relationship unclear; no funding or pivotal plan found. |
| PearlMatrix PMA number and Jan 2026 label text | Pull from FDA PMA database (search "P-15" or "Cerapedics"). i-FACTOR PMA number also from memory. |
| Kolon TissueGene Korean history (Invossa approval 2017, revocation 2019, US clinical hold 2019-2020) | From memory; consistent with trade press but not re-read. |
| BMAC device K numbers | Not retrieved; SmartPrep, Angel, BioCUE, etc. are cleared but the specific K numbers and intended-use wording should be pulled from the 510(k) database. |
| PRP first-clearance year (1999) | Approximate. |
| CDC MMWR on Liveyon cord-blood infections (2018) | The MMWR URL I tried was wrong; the report exists but is uncited in the JSON. |
| Exosome warning letters to Invitrx (Nov 2022), Evolutionary Biologics (late 2024), Chara Biologics (early 2025), Supreme Rejuvenation (May 2025), BioStem (Jan 2025) | Found in search results but not opened; dates taken from URLs. |
| Medtronic 2008 Infuse warning letter / 2012 Senate Finance report | Mentioned in the primer as context; not re-verified in this pass. |
| Ossium Health | No orthopedic product with verifiable regulatory status found. OssiGraft is mentioned in a 2023 release as "in use on the East Coast" with no description; the company's verifiable work is cryopreserved bone marrow for HSCT (expanded access; BARDA contract 2024) and an IND for perianal Crohn's. Omitted from the JSON. |
| Orthocell | Australian company (tendon cell therapy Ortho-ATI; nerve repair product Remplir has US 510(k)); no bone-healing product. Omitted. |
| Cytori / Personalized Stem Cells | Cytori (Celution adipose device) lost its 2012 court challenge to FDA's refusal to clear the device by 510(k) and later became Plus Therapeutics; Personalized Stem Cells' adipose IND for knee OA (2020) could not be searched before the budget ran out. Omitted from JSON; history noted here only. |
| MSC fracture-healing US IND | None found. The nearest is the EU OrthoAlloUnion Phase 3 (EUCT 2025-520841-60-00, allogeneic BM-MSC plus biomaterial, single-arm) and the Spanish ADSC/TCP Phase 2 (n=12). Older US-registered nonunion MSC studies (NCT02307435, n=9) have unknown status. |
| Chinese rhBMP-2 products | Hangzhou Jiuyuan listing says "registered as implanted medical device"; NMPA record not checked. |

## 3. What changed in 2025-2026 (the parts most likely to be stale in anyone's head)

1. **Cerapedics PearlMatrix got its PMA (June 23, 2025) and a label expansion (Jan 13, 2026).** "P-15L" is no longer an investigational product. It is the only new orthobiologic approval in the period and the only Class III peptide bone graft competing with Infuse in lumbar interbody.
2. **Mesoblast moved from "failed Phase 3" to "one confirmatory trial from a BLA."** FDA's January 2026 Type B feedback (as reported by the company) accepted a 12-month pain endpoint; MSB-DR004 finished dosing all 300 patients in August 2026; topline mid-2027, filing Q3 2027.
3. **DiscGenics started its Phase 3** (first patient Jan 2026; DSMB clean June 2026) and lost its founder-CEO (Oct 5, 2026).
4. **Novadip NVD-003 received RMAT (June 23, 2025), started its Phase 3 (first implants Feb-Mar 2026) and raised EUR 10.4M (Sept 2026)** with a stated 2028 approval target; FDA also cleared the NVDX3 allogeneic IND (Nov 2024).
5. **Locate Bio LDGraft got an IDE (Sept 2025)** on top of its 2023 Breakthrough designation.
6. **Kolon TissueGene's TG-C missed both co-primaries in ACTiVION-II (July 2026)**; second readout due October 2026.
7. **FDA enforcement kept its cadence and sharpened its theory**: Celularity/Arthrex Interfyl (Dec 2025) shows a public company's 361 product reclassified on the strength of distributor marketing; R3 Medical (Aug 2026) is the first letter I found that cites criterion (a)(4) (dependence on living cells, allogeneic) against a cord-blood product and that says a marketed "exosome" product is not made by a process that isolates exosomes. Kimera's closeout (June 2026) shows the end state: the products were withdrawn.
8. **CMS repriced the Q-code economy** (CY2026 PFS: $127.28/cm2 for skin substitutes from Jan 1, 2026; 351-licensed products exempt). Expect consolidation among amniotic tissue banks that also sell orthopedic injectables.
9. **Kuros formally discontinued Fibrin-PTH** (FY2023 results, Mar 2024) and redirected to MagnetOs RCTs, one of which runs head-to-head against Trinity Elite (NCT05037968, primary completion Dec 2026).
10. **BioRestorative's Phase 2 is still blinded** as of May 2026; it targets a Phase 3 IND in late 2026.

## 4. What a regulatory-savvy hiring manager would challenge

- **"Why is VIA Disc NP in your investigational list if it's sold as a 361 product?"** Answer in the record: because its commercial claim (discogenic pain relief) and its own sham-controlled efficacy trials are hard to square with a homologous-use "tissue supplementation" position, and because no payer treats it as established. Be ready to say the company has never been publicly challenged by FDA.
- **"Cellular bone allografts: you say they are 361; are they osteoinductive or not?"** The honest answer is that manufacturers claim it and FDA has not challenged it; the only randomized or intra-patient data (ViviGen vs autograft, n=20) show no difference, and the Orthofix/MTF rat study found zero fusions for Osteocel Pro, Bio4 and Map3. Do not present any cellular allograft as proven osteoinductive in humans.
- **"BMAC: same surgical procedure exception, 1271.3(d)(4), or minimally manipulated 361? Pick one."** None has been adjudicated for centrifuged marrow. The 2017 guidance lists centrifugation of cells as minimal manipulation, so the exposure is homologous use (marrow's donor function is hematopoiesis) and, for office injections days after harvest, the SSP exception is unavailable. Surgical, same-day BMAC in a bone graft has never drawn public FDA action.
- **"Teriparatide is an NDA, not a BLA."** Correct; the schema forced the coding. Teriparatide (34 aa) is below the 40-amino-acid protein threshold and stayed a drug in the 2020 biologics transition; generics are ANDAs.
- **"ALLOB was a Phase 2b, not a Phase 3."** Correct, and the brief had it wrong; the record says so.
- **"Infuse off-label: the 2008 warning letter and the 2012 Senate report."** Not re-verified here; confirm dates and content before using them in the app.
- **"Where are the RMAT counts?"** FDA's cumulative page 404'd; CBER has published fiscal-year tables (requests received, granted, denied) and they should be quoted from the live page, not from memory.
- **"Rexlemestrocel-L failed its Phase 3; how is it one trial from a BLA?"** Because FDA (per Mesoblast) accepted that pain-intensity effects favored the product, allowed a 12-month pain endpoint in the confirmatory trial, and the product holds RMAT. A hiring manager will want you to say plainly that this is the company's characterization of a private meeting.
- **"PRP for fracture: evidence grade I?"** The grade reflects that meta-analyses of RCTs exist, not that the conclusion is positive; the record's finding text says the certainty is low. Consider whether the app should display a "grade I, negative/uncertain" state distinctly.
- **"You cite ipscell.com and law-firm notes."** Only for counts and dates that FDA does not aggregate (number of 2024 letters; the 14/24/400 figures) and for the Lux Therapeutics letter I did not open. Every product-level regulatory statement in the JSON traces to an FDA page, a registry entry or a journal article.
- **"Exosomes: are there really zero clinical trials?"** Zero *orthopedic* bone/disc exosome trials with public results in the US; there are early-phase exosome INDs in other fields (e.g., Kimera's IND 26535, dermatology/aesthetics) and non-US trials. The record scope is bone and disc.

## 5. Evidence I gathered that belongs in other slices

- Cellular bone allograft studies (for the established/emerging product records): Trinity Elite prospective NCT02969616 (PMID 39054302, n=252; PMID 38702654, n=274); ViviGen vs autograft PLF (PMID 39667224, n=20); ViviGen vs DBM ACDF (PMID 37381143, n=68); ViviGen multilevel stand-alone ACDF (PMID 34062509, n=53); LifeNet-authored database and 96-patient series (PMID 33213484, 34794470, 34404368); foot/ankle case series (PMID 32865044, n=153); rat PLF comparison of six CBAs (PMID 32613160); PrimaGen fresh-frozen CBA matched cohort 2026 (PMID 42683532, n=100).
- PearlMatrix (now PMA) and the Cerapedics ASPIRE trial.
- Kuros MagnetOs RCTs vs Trinity Elite and vs DBM (NCT05037968, NCT04679844, NCT04679896, NCT03625544).

## 6. Suggested follow-ups when search budget is available

1. Pull the PMA number and the Jan 2026 SSED/label for PearlMatrix from the FDA PMA database.
2. Open ClinicalTrials.gov results for NCT02412735 and record the exact DR003 responder rates.
3. Find the ANZCTR entry for Locate Bio's RESTORE study.
4. Retrieve the FDA cumulative RMAT table and the 2024-2026 CBER untitled-letter list.
5. Open the Invitrx, Evolutionary Biologics, Chara, Supreme Rejuvenation and BioStem letters and add them to the timeline with product names.
6. Check whether DiscGenics' Phase 1/2 appeared in Int J Spine Surg or Spine J (search by author Beall DP, Silverman, Ambach) and add n/endpoints.
7. Confirm the Kolon Invossa chronology from MFDS/FDA records.
8. Confirm the Medtronic 2008 warning letter date and the Senate Finance Committee Infuse report (Oct 2012) for the off-label section.
