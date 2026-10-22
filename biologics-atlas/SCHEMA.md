# Biologics Atlas — data schema (v0.1, 2026-10-21)

Two record types. Research agents write one JSON file per slice with both arrays; the consolidation step merges them into `data/applications.json` and `data/products.json`.

## Application record
One per surgical application (a procedure or injury the surgeon is treating), grouped by body region.

```json
{
  "id": "lumbar-plf",
  "region": "spine",            // spine | pelvis-hip | femur-knee | tibia | ankle-foot | shoulder-humerus | forearm-wrist-hand | general
  "subregion": "lumbar",
  "name": "Posterolateral lumbar fusion (PLF)",
  "type": "fusion",             // fusion | fracture | nonunion | bone-void | vcf | osteotomy | other
  "classifications": [          // fracture classes in WORDS only (no copyrighted figures)
    {"name": "AO/OTA 31-A", "summary": "Trochanteric region; A1 simple, A2 multifragmentary, A3 intertrochanteric/reverse oblique"}
  ],
  "why_biologic": "one or two sentences on what the biologic is doing here (extender, substitute, osteoinductive, void fill)",
  "autograft_standard": "what the gold standard is and its downside (ICBG morbidity, limited volume, etc.)",
  "volume_note": "US annual procedure volume if a public source exists, with the source",
  "sources": ["url", "PMID:123"]
}
```

## Product record
One per product (not per SKU). A product can serve many applications.

```json
{
  "id": "infuse",
  "name": "Infuse Bone Graft",
  "company": "Medtronic",
  "ownership_history": "optional: acquisitions/divestitures with years",
  "category": "rhBMP",          // rhBMP | rhPDGF | peptide | DBM | synthetic-ceramic | bioactive-glass | calcium-phosphate-cement | calcium-sulfate | cellular-allograft | structural-allograft | amniotic | PRP | BMAC | MSC | exosome | pharmacologic | other
  "composition": "rhBMP-2 on absorbable collagen sponge",
  "regulatory": {
    "path": "PMA",              // PMA | 510k | 361-HCTP | HDE | De-Novo | BLA | NDA | IND-only | IDE-only | none-unapproved
    "reference": "P000058",     // K/P/BLA number if findable
    "us_market_year": 2002,
    "on_label_indications": ["ALIF with LT-Cage L2-S1 single level", "acute open tibial shaft fracture with IM nail", "sinus and alveolar ridge augmentation"]
  },
  "status": "established",      // established | emerging | investigational | off-market | withdrawn
  "applications": [
    {
      "application_id": "lumbar-alif",
      "tier": "established",    // established | emerging | investigational
      "on_label": true,
      "evidence_grade": "I",    // I = RCT or meta-analysis of RCTs; II = prospective comparative; III = retrospective comparative; IV = case series; V = expert opinion / none
      "evidence_summary": "one or two sentences, with the strongest study named",
      "caveats": "sponsor-funded, small n, surrogate endpoint, etc."
    }
  ],
  "evidence": [
    {
      "ref": "PMID:12345678",   // PMID, NCT, or DOI
      "title": "",
      "year": 2002,
      "design": "RCT",          // RCT | meta-analysis | prospective-cohort | retrospective | case-series | registry | preclinical
      "n": 279,
      "finding": "one sentence",
      "sponsor_funded": true,
      "applications": ["lumbar-alif"]
    }
  ],
  "pipeline": {                 // only for emerging/investigational
    "stage": "pivotal",         // preclinical | phase-1 | phase-2 | pivotal | under-review | launched-<year>
    "trials": ["NCT01234567"],
    "expected_milestone": "PMA decision expected 2026 (source)"
  },
  "bd": {
    "sales_channel": "direct | distributor | hybrid | unknown",
    "reimbursement": "bundled in MS-DRG inpatient; no separate HCPCS; etc.",
    "notes": "contracting, GPO, pricing signals if public"
  },
  "last_reviewed": "2026-10-21",
  "sources": ["url"]
}
```

## Rules
- Facts only from public sources: FDA databases (510(k), PMA, HDE, HCT/P establishment registration), company IFUs and press releases, PubMed, ClinicalTrials.gov, SEC filings, CMS. No paywalled market-share numbers presented as fact. If a figure comes from a press release quoting a market report, say so.
- Never copy marketing claims as findings. Evidence lines describe the study, not the brochure.
- Never present an unapproved product (exosomes, most MSC products, 361 products used as osteoinductive) as a "choice"; tier it investigational and say what the FDA position is.
- When unsure, write `"unverified": true` on the field's parent object and explain in the notes file.
- Mark anything a hiring manager in orthobiologics would challenge with `"challenge": "..."`.
