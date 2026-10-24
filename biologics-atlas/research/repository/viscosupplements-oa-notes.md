# viscosupplements-oa slice: notes (2026-10-23)

28 records in `viscosupplements-oa.json`: 14 HA brand families, 1 HA-steroid combination (Cingal), 1 class record (`ha-viscosupplement-class`, carries guideline, Medicare, commercial, Medicaid and OIG picture), 12 non-HA knee-OA injectables and programs. No new applications added; every record pairs only to `knee-oa-intraarticular`. Extra fields on HA `regulatory` objects (`course`, `hcpcs`) record injections per course and J-code.

## Verification method
PMA numbers, approval dates, supplements and trade-name changes read from openFDA (`device/pma.json`, product code MOZ). Injections per course, J-code descriptors and the "preferred versus excluded" list come from UnitedHealthcare policy 2026D0081M (effective 2026-10-01), read in full. LCD L39260 read at CMS. NDA 208845 read at openFDA drugsfda. Every cited PMID checked with esummary; trial numbers read from the ClinicalTrials.gov v2 API.

## Unverified flags and why
- Class record: Aetna CPB 0179 (aggregator summary only), Blue plans (dated Rheumatologist article), Cigna (nothing located), "ASP plus 4.3%" and the 2023 JAMA IM industry-payment study (secondary summaries), AAOS 2021 "moderate" rating (secondary sources and UHC policy text; AAOS guideline not read).
- Gelsyn-3, Hymovis: only registered RCTs (NCT00556608, NCT01372475), results never located; evidence graded I but flagged.
- Supartz FX / Visco-3: five Supartz RCTs known only through the GenVisc equivalence paper; Visco-3 J-code conflict (UHC J7321 vs a third-party J7333).
- Gel-One, Hyalgan: distributor terms (Zimmer Biomet, Sanofi history) from undated trade press; flagged.
- Triluron, TriVisc, SynoJoynt: no brand study found, graded V; PMA summaries not read. SynoJoynt applicant shows "Mesoblast" in openFDA, treated as a data artifact; true holder unconfirmed.
- Zilretta: J3304 from memory (unverified); Pacira's Flexion acquisition not re-sourced.
- Arthrosamid: the RCT (NCT04045431) has no located results; CE-mark date conflicts (2020 vs 2021).
- Lorecivivint: NDA acceptance and PDUFA date not located; OA-07 claims are sponsor-reported.
- Ampio: dissolution date from secondary sites. Sprifermin: current Merck KGaA status unknown. LNA043, AlloJoin, JointStem, RTX-GRT7039, PCRX-201, ReNu: sponsor press or registry data only; ReNu figures from press summaries (the GlobeNewswire release returned 403). RTX has no posted p-values.
- Regenexx: class record only; no independent RCT.

## Left out and why
- PRP knee-OA comparators: refer to the `prp-bmac-adipose` slice (no PRP records created).
- Cartistem (Medipost, knee cartilage), Hyalofast (Anika; PMA submitted 2025-10-31, FDA deficiency letter January 2026, phase 3 missed co-primary endpoints) and Kolon TG-C (already in the atlas): leave to the cartilage slice. Note for that slice: Hyalofast is not an HA injection.
- SportVis: could not identify a US PMA (no openFDA match); Genzyme heritage folded into Synvisc. "Pluri" and "Carmell": skipped as instructed.
- TLC599 (Taiwan Liposome, liposomal dexamethasone; phase 3 NCT04123561 n=504, posted week-12 difference -0.171, p=0.037) and Moebius MM-II (Sun Pharma phase 2 NCT04506463): omitted, status unverified.
- The comparative Hayes, VA/DoD 2020 and OARSI 2019 guideline positions: not read, mentioned nowhere as fact.

## Gaps for follow-up
1. Primary pivotal trial data for Triluron, TriVisc, SynoJoynt, Gelsyn-3 and Hymovis (FDA SSEDs not read; they exist for each PMA at accessdata.fda.gov).
2. Current Cigna and Blue plan HA policies, and the final OIG audit A-07-24-00646 (estimated FY2026).
3. Lorecivivint FDA filing acceptance and ReNu BLA action date; Zimmer Biomet and Bioventus agreements with Seikagaku/IBSA with dates.
