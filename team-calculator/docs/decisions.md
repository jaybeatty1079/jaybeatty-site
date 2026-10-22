# TEAM Calculator Decision Record

How the CMS TEAM Episode Calculator was reasoned into existence: the timeline, the public datasets, every modeling decision with the alternative that lost, the CFO review, and the roadmap. The HTML version of this page (`decisions.html`) carries the charts.

Jay Beatty. Started October 12, 2026 and updated as the tool changes.

## Timeline

| Date (2026) | Session | What shipped |
|---|---|---|
| Oct 12 | Site redesign | Three concepts for jaybeatty.com; Scoreboard chosen the next day. Its palette and type became the calculator's. |
| Oct 15 | Version one | Reconciliation engine from the CMS PY1 workbook and fact sheets: 29 MS-DRGs × 9 divisions, three tracks, quality adjustment, stop limits, five-year view, 721-hospital picker. |
| Oct 16 | Levers | Post-discharge mix and complication levers with editable unit costs, spend-by-setting chart, waterfall. Prompted by the question of whether SNF, home health and infections belonged. |
| Oct 16 | Lines and cases | Service-line tabs and five case hospitals on real 2024 CMS volumes, named by archetype and city. |
| Oct 18 | Public data layer | Thirteen datasets joined by CCN; every participant prefills. FY2027 rule read from the Federal Register text. Sixth case added. |
| Oct 19 | CFO review | Sixteen objections fixed in priority order, then a margin-context line from a Kaufman Hall report. |
| Oct 22 | Engine and tests | The reconciliation math moved into a pure engine file with 22 runnable tests, plus an architecture note and a write-up. Outputs unchanged. |

## Data sources

| Source | Release | Rows read | What the calculator takes from it |
|---|---|---|---|
| TEAM PY1 preliminary target prices | 2025-12-10 | 261 price rows | Benchmark, trend, discount and target for 29 MS-DRGs × 9 divisions; baseline 2022 to 2024. |
| TEAM participant list | 2026-08-18 | 721 hospitals | Who is in the model, with CCN, CBSA and state. |
| FY2027 IPPS final rule and impact file | 2026-08-04 | 3,085 hospitals | Beds, residents per bed, DSH and Medicaid shares, urban or rural flag; the TEAM policy changes for PY1 and PY2. |
| Medicare Inpatient by Provider & Service | 2026-04-23 | 11,164 rows | 2024 inpatient discharges and payment by MS-DRG for every hospital; national and state averages. |
| Medicare Outpatient by Provider & Service | 2026-06-25 | 7,725 rows | APC 5114 to 5116 services; the outpatient joint row. |
| Hospital Provider Cost Report | 2026-10-05 | 6,109 hospitals | Net patient revenue, patient-service margin; fallback beds. |
| Care Compare: readmissions and complications | 2026-09-10 | 162,860 rows | Hip/knee and CABG 30-day readmission, THA/TKA complications, PSI-90 and PSI-12. |
| Care Compare: infections (HAI) | 2026-07-22 | 172,440 rows | Colon surgery SSI standardized infection ratio. |
| Care Compare: HRRP FY2026 | 2026-01-26 | 18,330 rows | Excess readmission ratios, predicted and expected rates for hip/knee and CABG. |
| Care Compare: Medicare spending by claim | 2026-01-26 | 63,646 rows | Price-standardized spending per episode by setting, 30 days after discharge; hospital, state, national. |
| Medicare Geographic Variation, county | 2026-05-15 | 3,253 rows | County SNF days per 1,000, SNF, IRF and home health spend per capita, readmission rate, dual share; state SNF per diem. |
| Medicare Monthly Enrollment | 2026-09-23 | 3,337 rows | County Medicare Advantage share. |
| Market Saturation and Utilization | 2026-06-10 | 5,938 rows | SNFs and home health agencies billing in each county. |
| Nursing Home Compare | 2026-09-30 | 73,450 rows | Nursing homes per county, star ratings, short-stay rehospitalization. |
| TEAM qualified SNF list, Q4 2026 | 2026-10 | 9,867 facilities | SNFs eligible for the three-day-rule waiver, counted per county. |
| MedPAC data book and CMS evaluations | 2026-07 | 5 reports | IRF stay cost, home health period cost; CJR and BPCI Advanced per-episode savings for the checks. |
| Kaufman Hall flash report | 2026-10-13 | 1 report | 2.5% year-to-date operating margin default for the margin-context line. |

## Decision log

### 1. Black, deep purple and green, with charts and photos

*Oct 12*

**Instead of:** Keep the live text-only site and add a page.

**Why:** A tool that looks like a demo gets judged as one. The site identity came first so the calculator would inherit it, and the Scoreboard concept won because its data tiles already read like a results board.

### 2. Build a TEAM calculator at all, on public CMS sources only

*Oct 15*

**Instead of:** A slide deck about TEAM; or a tool fed by licensed hospital data from past roles.

**Why:** The point was a checkable, public artifact that proves value-based-care fluency to employers. Anything licensed or from a former employer could not be shown, so public data became a hard rule, not a preference.

### 3. One HTML file, no backend, no tracking

*Oct 15*

**Instead of:** A React app with an API and a database.

**Why:** Deployable anywhere, including as a private preview, with nothing to maintain. The cost is known and documented under What comes next: no persistence, no ingestion, no multi-user.

### 4. Hold PY1 regional prices flat for the five-year view

*Oct 15*

**Instead of:** Project prices forward with the trend factor.

**Why:** CMS has published PY1 prices only. Inventing PY2 to PY5 prices would present a guess as a table. Later, the review added a regional ratchet assumption the user controls instead.

### 5. Risk multiplier and quality score as sliders

*Oct 15*

**Instead of:** Hard-code 1.00 and 50.

**Why:** CMS has not published either for any hospital, and both move the answer. Making them visible controls says so. The data layer later seeded both from public proxies, labeled.

### 6. Model post-discharge care and complications as levers

*Oct 16*

**Instead of:** Leave spend as a single number per category.

**Why:** The question was whether SNF, home health, physical therapy and infections belonged. They are where TEAM money moves, so the levers module was built with editable unit costs from MedPAC, HCUP and peer-reviewed sources.

### 7. Keep the net payment at the hospital level under service-line tabs

*Oct 16*

**Instead of:** Reconcile each line separately.

**Why:** CMS reconciles one book per hospital. A line tab shows its contribution and its effect on the hospital result, never its own NPRA, so the page cannot be read as implying line-level settlements.

### 8. Case hospitals named by archetype and city, never by hospital

*Oct 16*

**Instead of:** Name the real hospitals; the volumes are public.

**Why:** Volumes were public but performance was modeled, and later derived from all-condition patterns. A real name beside an estimated result reads as a claim about that hospital. Source CCNs live in the spec only.

### 9. Join thirteen public datasets by CCN and prefill every participant

*Oct 18*

**Instead of:** Prefill only the six cases by hand.

**Why:** The same work that fills six cases fills 721 hospitals if it runs as a pipeline, and a pipeline is checkable. It also produced the dataset that makes peer benchmarking possible later.

### 10. Derive spend from the hospital's post-discharge pattern, holding the anchor at target

*Oct 18*

**Instead of:** Scale the whole episode by the hospital's inpatient payment ratio.

**Why:** TEAM pays the anchor stay at a standardized MS-DRG price, so hospital-level anchor cost differences are mostly wage index and teaching add-ons that standardization removes. The variance that counts is after discharge.

### 11. Proxy the hybrid hospital-wide readmission measure with hip/knee and CABG readmissions

*Oct 18*

**Instead of:** Set the quality score to 50 for everyone.

**Why:** The hybrid measure has no public scores yet. Surgical readmission measures are the closest public signal and are weighted by their denominators. The page says which component is a proxy.

### 12. Safety-net flag from the Medicare SSI share, not the full DSH percentage

*Oct 18*

**Instead of:** Use DSH patient percentage, which is more familiar.

**Why:** DSH includes Medicaid days from non-Medicare patients and flagged academic centers that are not safety-net by CMS's dual-eligible test. The SSI share is the Medicare-only component and tracks dual eligibility.

### 13. Keep the derived estimate on the named-hospital prefill, labeled

*Oct 18*

**Instead of:** Prefill only facts and volumes for a searched hospital; keep estimates for anonymized cases.

**Why:** The labeled estimate was judged more useful than a blank slider, provided the page says it is an estimate from public patterns and not the hospital's TEAM result. It does, in the facts panel and the badges.

### 14. Fix all sixteen CFO objections, in the order a CFO would raise them

*Oct 19*

**Instead of:** Fix the top five and note the rest.

**Why:** The critique was asked for in order to act on it. Net to the hospital went first because it is the number a CFO signs; the moving target and unit costs next because they are what a CFO would use to dismiss the tool.

### 15. Price outpatient joint and fusion episodes at the matching MS-DRG

*Oct 19*

**Instead of:** Invent outpatient target prices from OPPS payments.

**Why:** The CMS workbook states that HCPCS episode types are mapped and reported under the corresponding MS-DRG. Using that mapping keeps the tool on CMS's own method; the APC-based prefill is labeled an upper bound.

### 16. Rank quality percentiles among IPPS hospitals eligible for TEAM

*Oct 19*

**Instead of:** Rank among all 4,700 Care Compare hospitals.

**Why:** The quality scoring fact sheet says the national set is hospitals eligible for TEAM. Critical access hospitals are not. The impact file is the public list of IPPS hospitals; Maryland is excluded as CMS does.

### 17. Compare post-discharge spend against the census division, not the state

*Oct 19*

**Instead of:** Keep the state, which the Care Compare file provides directly.

**Why:** TEAM prices by census division. The division figure is built as the hospital-count-weighted average of its states' values, so the comparator matches the pricing geography.

### 18. Cap the typical-program preset at $1,200 per episode and add a 60% realization slider

*Oct 19*

**Instead of:** Let the arithmetic run: three fewer SNF days at a full per diem.

**Why:** CJR measured $1,226 per episode and BPCI Advanced about $500 in SNF savings. Modeled savings above what two evaluations found would be a promise the evidence does not support.

### 19. Seed the risk multiplier from bed size, safety-net flag and county dual share

*Oct 19*

**Instead of:** Leave it at 1.00 for everyone.

**Why:** CMS's hospital-level adjusters include bed size and safety-net status, and dual eligibility is in the patient model. The seed is small, clamped and labeled; the break-even and ±0.06 band carry the real uncertainty.

### 20. Clamp the state SNF per diem to $450 to $900

*Oct 19*

**Instead of:** Use the computed value as is.

**Why:** Montana and Alaska compute above $1,000 a day because swing-bed stays in critical access hospitals dominate their SNF days. That is not what a freestanding SNF costs, which is what the lever moves.

### 21. Default the margin line to Kaufman Hall's 2.5%, not the cost-report margin

*Oct 19*

**Instead of:** Use each hospital's patient-service margin from its cost report.

**Why:** The cost-report figure excludes investment and other income and depends on allocation choices; across participants its median is −1.6% with a bottom quartile at −13%. Revenue from the cost report is solid, so it prefills; the margin defaults to the industry figure and is editable.

### 22. Keep this record beside the tool, in the repository and on the site

*Oct 19*

**Instead of:** A private notes file.

**Why:** A hiring manager or a CFO who reads the calculator should be able to see how it was reasoned, with the alternatives that lost. That is the difference between a weekend project and strategic work, and it only counts if it is visible.

## The CFO review: sixteen objections and fixes

| # | Objection | What the page does now |
|---|---|---|
| 1 | Gross Medicare savings is not my margin | Net-to-hospital panel: program cost, margin lost per avoided readmission, revenue lost on owned post-acute days, beside the do-nothing figure. |
| 2 | Risk adjustment moves the target more than anything you modeled | ±0.06 range and a break-even multiplier on the results board; slider seeded from public hospital factors, labeled a proxy. |
| 3 | The target will move at reconciliation | Final-price band: the result at a target 3% lower and 3% higher. |
| 4 | Your unit costs are national and stale | State SNF per diem, readmission cost inflated to 2024, home health and outpatient allowances charged back, 60% realization slider, preset capped at the evidence. |
| 5 | Half my joints are outpatient and you do not price them | Outpatient joint and fusion rows priced at the matching MS-DRG, prefilled as a labeled upper bound. |
| 6 | You floored low-volume categories wrong | Flag sets itself at 30 or fewer baseline episodes; suppressed MS-DRGs can be typed in. |
| 7 | That quality score is a guess dressed as a number | Slider labeled a proxy; a note shows the three components, which are real, and the weights. |
| 8 | Percentile against whom? | Ranked among the 3,032 IPPS hospitals eligible for TEAM, per the CMS fact sheet. |
| 9 | Safety-net status is inferred | Checkbox says CMS notification governs; SSI share shown against the 8.7% threshold with the county dual share. |
| 10 | Gross savings, no program cost | Covered by the net-to-hospital panel and the realization slider. |
| 11 | The regional target will chase me down | Five-year view ratchets the target by a user-set yearly change, default −1%. |
| 12 | Sequestration and cash timing | 2% sequestration toggle on positive payments; each year labeled with its settlement year. |
| 13 | Why should I believe the engine? | Checks section reproduces the CMS worked examples and compares lever math with CJR and BPCI Advanced. |
| 14 | One shift for all five lines | Category-specific adjustments from HRRP excess readmissions and the colon infection ratio; lines without a signal say so. |
| 15 | State is not my region | Census-division comparator for post-discharge spend. |
| 16 | What happens to my scenario when I click send? | Payload holds only the inputs and the hospital name typed in the form; 30-day retention stated. |

## Case results before and after the review

| Case | Track | Before (Oct 18) | After (Oct 19) | Target book before | Target book after |
|---|---|---|---|---|---|
| Manhattan academic | Track 3 | $1,150,189 | $2,296,502 | $77,472,369 | $101,322,842 |
| Jacksonville community | Track 1 | $1,032,796 | $545,535 | $32,135,785 | $46,665,362 |
| Minneapolis cardiac | Track 3 | $262,903 | $670,578 | $14,771,386 | $16,024,080 |
| Bozeman micropolitan | Track 1 | $302,101 | $986,768 | $6,468,598 | $12,175,729 |
| Harrison rural | Track 1 | $26,277 | $71,162 | $3,001,995 | $4,895,609 |
| Hershey academic | Track 3 shown | −$519,985 | −$359,574 | $11,442,919 | $14,980,371 |

## Validation

Reproduced on the page: the CMS quality-weighting example (51.4 vs 51.5 from unrounded weights), all positive and negative CQS adjustment rows, the CJR per-episode saving (about $1,120 vs $1,226 measured). Not yet checked: a real PY1 reconciliation (first arrives 2027), the prefilled spend against a hospital's own baseline report, the risk-multiplier seed.

## What comes next

1. Ingest the hospital's CMS baseline and claims files so spend and episodes are actual.
2. Accounts, saved scenarios, audit trail, Excel export.
3. Peer benchmarking across the 721 participants from the dataset already loaded.
4. HCC-based risk multiplier from the hospital's own claims.
5. System roll-up across many CCNs.
6. Command-line tests (done October 22: `tests/engine.test.js`, 22 checks against the CMS rules), a data manifest with pull dates, a commit history that shows the iteration. The [architecture note](ARCHITECTURE.md) draws version two.

Estimates only. Independent educational work from public CMS documents; not affiliated with or endorsed by CMS; no patient data.