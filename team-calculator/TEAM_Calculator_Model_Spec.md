# CMS TEAM Episode Calculator: model spec (plain English)

Prepared 2026-10-15 for Jay Beatty; public data layer and FY2027 rule added 2026-10-18; CFO review fixes added 2026-10-19. Every rule below comes from public CMS documents saved in `cms-sources/` (FY2025 and FY2026 IPPS final rules as summarized in the CMS fact sheets, the September 2025 Risk Adjustment and Preliminary Target Price Specifications, the September 2025 Quality Scoring fact sheet, and the 2025-12-10 PY1 preliminary target price workbook). Nothing in here uses Surge Care materials, Definitive data or any hospital's private numbers.

## What the calculator answers

"If my hospital's TEAM episodes run above or below the CMS target price next year, roughly what does CMS pay us, or what do we owe, under each participation track?"

The user picks a hospital (or a census region), enters annual Medicare episode counts and average episode spend for up to five episode categories, picks a track and a quality score, and gets the estimated net payment reconciliation amount (NPRA) with the stop-gain, stop-loss, quality and low-volume rules applied. A five-year view projects PY1 through PY5 (2026 to 2030) with an optional yearly spend-improvement assumption.

## Inputs

1. **Hospital.** Searchable list of the 721 hospitals on the CMS TEAM participant list (711 mandatory, 10 voluntary; CCN, CBSA and state are shown). The hospital's state maps to one of nine census divisions, which is how CMS regionalizes target prices. A user can also skip the list and pick a census division directly.
2. **Performance year** (PY1 2026 through PY5 2030) and **track**:
   - Track 1: upside only, 10% stop-gain. Open to everyone in PY1; safety-net hospitals only in PY2 and PY3.
   - Track 2: 5% stop-gain and 5% stop-loss. PY2 to PY5, only for safety-net, rural, sole community, Medicare-dependent and essential access community hospitals.
   - Track 3: 20% stop-gain and 20% stop-loss. Any participant, any year, and the default from PY2 on.
   The calculator lets the user tick "my hospital qualifies as safety-net / rural / SCH / MDH / EACH" to unlock Track 2 and the later Track 1 years. CMS publishes those designations before each PY; the calculator does not infer them.
3. **Episode categories** (five): lower extremity joint replacement (MS-DRG 469, 470, 521, 522), surgical hip/femur fracture treatment (480 to 482), coronary artery bypass graft (231 to 236), spinal fusion (402, 426 to 430, 447, 448, 450, 451, 471 to 473), major bowel procedure (329 to 331). For each category the user enters:
   - Annual Medicare FFS episode count, split by MS-DRG in an expandable table (the category target price is the count-weighted average of the regional DRG target prices).
   - Average actual episode spend (Part A plus Part B, anchor stay through 30 days after discharge). Defaults to the regional target so the user only has to move it.
   - A "below the low-volume threshold" flag: 30 or fewer episodes in that category across the 2022 to 2024 baseline. CMS still reconciles that category but does not hold the hospital accountable for spending above target.
4. **Risk adjustment multiplier** (default 1.00, range 0.80 to 1.20). CMS builds a hospital-specific target from the regional benchmark using patient HCCs, age, dual and LIS status, and hospital factors such as safety-net status and bed size, then normalizes so risk adjustment does not raise the average. Hospitals do not see their multiplier until CMS sends the preliminary target price report, so the calculator exposes it as an assumption.
5. **Composite quality score** (0 to 100, default 50). CMS scales each measure to its national percentile and weights by episode volume. PY1 measures: hospital-wide readmission (all inpatient episodes), CMS PSI 90 (all inpatient episodes), THA/TKA patient-reported outcome measure (LEJR only).
6. **Five-year assumption**: yearly change in average episode spend relative to target (for example, 2% lower each year from care redesign), applied in the projection only.

## Calculation, in order

1. **Regional target price per MS-DRG** = benchmark price × prospective trend factor × (1 − CMS discount). Read straight from the CMS PY1 workbook (296 rows: 29 MS-DRGs × 9 census divisions, plus extra CABG rows). Discount is 2% for LEJR, hip/femur fracture and spinal fusion, 1.5% for CABG and major bowel.
2. **Hospital-specific target per category** = count-weighted regional target × risk adjustment multiplier. (CMS also applies a prospective normalization factor and, at reconciliation, a retrospective trend factor; both are assumed to be 1.00 and are called out as such.)
3. **Reconciliation amount per category** = (hospital-specific target − average actual spend) × episode count. Positive means the hospital spent less than target.
4. **Low-volume rule**: a category flagged below the threshold has its reconciliation amount floored at zero.
5. **Aggregate** across categories to one participant-level reconciliation amount and one aggregated target price amount.
6. **Track 1 only**: a negative aggregate is set to zero (no downside).
7. **Quality adjustment** (from the CMS worked tables):
   - Positive amount, all tracks: adjustment = 10% × (1 − CQS/100). Quality-adjusted amount = amount × (1 − adjustment). CQS 100 keeps everything, CQS 0 gives up 10%.
   - Negative amount, Track 2: adjustment = 15% × CQS/100, reduces what is owed. Track 3: 10% × CQS/100.
8. **Stop-gain / stop-loss**: the quality-adjusted amount is capped at ±(limit × aggregated target price amount). Track 1: +10% only. Track 2: ±5%. Track 3: ±20%.
9. The result is the estimated **NPRA**. A positive NPRA is a reconciliation payment from CMS; a negative NPRA is a repayment owed to CMS.
10. **Five-year view**: repeat steps 2 to 9 for PY1 to PY5 with the same volumes, the spend-improvement assumption compounding yearly, and a track path the user picks (for example Track 1 in PY1 then Track 3). Target prices for PY2 onward are not published yet, so the PY1 regional prices are held flat in standardized dollars and the page says so.

## Levers module (added 2026-10-16)

Jay's question: TEAM counts what happens after discharge, so can the tool show what fixing post-acute use and complications is worth? Yes. Step 5 adds, per episode category, a "today" and "with program" value for six levers:

1. Share of episodes discharged to a SNF, and average SNF days inside the 30-day episode.
2. Share discharged to inpatient rehab (IRF).
3. 30-day readmission rate.
4. Surgical site infection rate.
5. VTE (DVT or PE) rate.

Savings per episode = (SNF share moved × (SNF days × SNF per day − one home health period)) + (SNF share kept × days cut × SNF per day) + (IRF share moved × (IRF stay − one home health period)) + (readmission points cut × readmission cost) + (SSI points cut × SSI added cost) + (VTE points cut × VTE added cost). A patient kept out of a facility is assumed to go home with home health. Average episode spend falls by that amount and the reconciliation runs again. A waterfall chart shows the NPRA today, the change from each lever in order, and the result with all levers.

Unit costs (editable on the page): SNF $683 per day (MedPAC 2024: $20,970 per stay over 30.7 days); IRF $25,300 per stay (MedPAC 2024); home health $1,852 per 30-day period (MedPAC 2024); readmission $15,500 (HCUP Statistical Brief 278, Medicare 2018); SSI $12,800 added cost (Adeyemi and Trueman 2019, joint replacement, industry funded); VTE $12,381 added cost in the first three months (Cohoon et al. 2015).

"Today" defaults by category come from published cohorts and are labeled on the page: LEJR readmission 4%, SSI 0.8%, VTE 0.6%; hip fracture SNF 55%, 20 days, IRF 18%, readmission 12%; CABG SNF 21.2% (Medicare 2016 to 2017), readmission 12%; spinal fusion readmission 8%, SSI 1.4%; major bowel readmission 12%, SSI 10% (NSQIP). Discharge-mix defaults for LEJR, spine and bowel are illustrative and should be replaced with the hospital's data.

Spend by setting: the national TEAM pattern from the Institute for Accountable Care and ACS webinar (January 2025, 2021 to 2023 claims) splits a 30-day episode into anchor facility, anchor Part B and post-acute: CABG about 41K / 6K / 10K; hip and femur 14.5K / 3.5K / 20.5K; joint replacement 13K / 2K / 4K; major bowel 17K / 3K / 6K; spinal fusion 25K / 5K / 7.5K (read from the published chart, rounded). Post-acute is 17 to 53 percent of the episode by category. The page scales those shares to the user's average spend.

Quality link stated on the page: readmissions feed the hospital-wide readmission measure and VTE feeds PSI 90 (both in the CQS); SSI is not in PSI 90 and reaches TEAM through readmissions and post-acute cost. SSI and VTE costs are increments beyond the readmission line, so the user should lower the readmission lever if the same event is counted twice.

What the tool cannot do: show where readmissions originate. Only the hospital's claims feed (CMS supplies it to participants) can identify the SNF or agency. The tool prices what fixing it is worth, which is the business case for a preferred post-acute network or an infection-prevention program.

## Service-line tabs and case hospitals (added 2026-10-16, evening)

**Tabs.** Hospital, Orthopedics (joint replacement, hip fracture, and spinal fusion unless the user moves spine to its own line), Cardiac (CABG), Abdominal surgery (major bowel). CMS reconciles the hospital as one book, so the net payment is always the hospital number. A line tab shows that line's episodes, spend versus target, dollars versus target in total and per episode, share of the hospital's reconciliation amount, post-acute spend, the value of its levers, and the effect on the hospital NPRA when only that line's levers are applied. The Hospital tab adds a side-by-side chart of the lines.

**Case hospitals (rebuilt 2026-10-18 on public data).** Six, chosen for size and geography. Nothing in a case is modeled by hand any more: volumes, spend versus target, quality score, lever starting points and the safety-net and rural flags all come from the public data layer described in the next section, applied to the case hospital's CCN at load time. The page names each case by archetype and city; the source hospital is recorded here only (rule: a real hospital's name never sits next to an estimated result on the page, because the estimate is derived from all-condition public files, not from its TEAM claims). Stories and "watch" lines in data_cases.json were written from the derived numbers below and should be re-read if the data layer is rebuilt.

| Case | Source CCN | Division | 2024 TEAM-DRG inpatient discharges | Post-discharge spend vs state | Proxy CQS | Track | PY1 estimate (Track 3 / Track 1 / Track 3 with program) |
|---|---|---|---|---|---|---|---|
| Metro academic medical center, Manhattan NY | 330214 NYU Langone Hospitals | 2 | 2,321 | 0.948 | 89 | 3 | +$1.15M / +$1.15M / +$4.81M on $77.5M |
| Large community system hospital, Jacksonville FL | 100088 Baptist Health Medical Center Jacksonville | 5 | 789 | 0.881 | 46 | 1 | +$1.03M / +$1.03M / +$2.27M on $32.1M |
| Metro cardiac and spine hospital, Minneapolis MN | 240057 Abbott Northwestern | 4 | 414 | 0.919 | 49 | 3 | +$263K / +$263K / +$770K on $14.8M |
| Growing micropolitan hospital, Bozeman MT | 270057 Bozeman Health Deaconess | 8 | 199 | 0.859 | 46 | 1 | +$302K / +$302K / +$552K on $6.5M |
| Rural community hospital, Harrison AR | 040017 North Arkansas Regional Medical Center | 7 | 80 | 0.973 | 43 | 1 | +$26K / +$26K / +$179K on $3.0M |
| Central Pennsylvania academic medical center, Hershey PA | 390256 Milton S. Hershey Medical Center | 2 | 302 | 1.149 | 52 | 1 | −$520K / $0 / −$56K on $11.4M |

Flags from the data layer: NYU safety-net (Medicare SSI share 10.9%); Harrison rural; Bozeman urban (impact file), so its Track 1 ends after 2026 unless CMS's rural census-tract test applies. Harrison's bowel line is below the public file's suppression threshold and is off. Risk multiplier 1.00 in every case.

Comparison chart: each case run at PY1 regional prices under Track 1, Track 3, and Track 3 with the typical program preset, shown as percent of the aggregated target book with dollars on the bars.

## Public data layer (added 2026-10-18)

Every one of the 721 participants now carries a record in `data_hospital_slim.json` (built by `build/build_metrics.py` then `build/derive.py`; full detail in `data_hospital_metrics.json`, 1.3 MB, not embedded). Picking a hospital in Step 1, or loading a case, prefills the calculator from that record and shows a facts panel with the source of each line. Everything stays editable.

**Sources, all public, downloaded 2026-10-18 into `cms-sources/carecompare/`, `cms-sources/pulls/`, `cms-sources/ipps-fy2027/` and `cms-sources/team-2026/`:**

| Source | Release | Fields used |
|---|---|---|
| Care Compare: Unplanned Hospital Visits, Complications and Deaths | 2026-09-10 | 30-day hip/knee readmission (READM_30_HIP_KNEE, 7/2023 to 6/2025), 30-day CABG readmission, THA/TKA complications (COMP_HIP_KNEE), PSI-90, PSI-12 perioperative PE/DVT per 1,000. Hybrid hospital-wide readmission has no public scores yet. |
| Care Compare: Healthcare-Associated Infections | 2026-07-22 | Colon surgery SSI standardized infection ratio (HAI_3) and predicted cases, 10/2024 to 9/2025 |
| Care Compare: Medicare Hospital Spending by Claim | FY2026 release (2026-01-26), 2024 episodes | Price-standardized, risk-adjusted spending per episode by claim type for 1 to 30 days after discharge and the complete episode, hospital / state / national, all conditions |
| Care Compare: Hospital General Information, HRRP FY2026 | 2026-07-22, 2026-01-26 | Star rating, hospital type, ownership, county; excess readmission ratios for hip/knee and CABG |
| FY2027 IPPS final rule impact file | August 2026 | Beds, resident-to-bed ratio, DSH patient percentage, Medicaid percentage, urban/rural geographic flag, census region, FIPS county |
| Hospital Provider Cost Report 2024 (data.cms.gov) | 2026-10-05 | Fallback beds; Medicare share of discharges |
| Medicare Inpatient Hospitals by Provider and Service 2024 | 2026-04-23 | Discharges and average Medicare payment by MS-DRG for every hospital (29 TEAM MS-DRGs pulled for all hospitals, 11,164 rows); national and state averages from the Geography and Service file |
| Medicare Outpatient Hospitals by Provider and Service 2024 | 2026-06-25 | Services by APC 5114 to 5116; APC 5115 (Level 5 musculoskeletal) holds outpatient TKA and THA |
| Medicare Geographic Variation by National, State and County 2024 | 2026-05-15 | County SNF covered days per 1,000, SNF/IRF/HH standardized spend per capita, readmission rate, dual share, MA rate |
| Medicare Monthly Enrollment 2025 | 2026-09-23 | County Medicare Advantage share |
| Market Saturation and Utilization State-County 2025 | 2026-06-10 | SNFs and home health agencies billing in the county |
| Nursing Home Compare provider information and claims measures | 2026-09-30 | Nursing homes per county, mean overall rating, mean short-stay rehospitalization rate |
| TEAM qualified SNF list Q4 2026 | 2026-10 | 9,867 SNFs and swing beds rated 3+ stars 7 of 12 months; count per county |

**Derivation rules (implemented in `derivePublic()` in build/app.js; the Python side only prepares ratios):**

1. Counts per MS-DRG = the hospital's 2024 inpatient discharges. A category with no visible MS-DRGs is turned off. Outpatient APC 5115 services are shown as a count only; TEAM prices outpatient episodes by HCPCS code and the public PY1 workbook has no HCPCS rows.
2. Spend versus target per category = (category's national post-acute share of episode spend, from the IAC setting split) × (hospital 30-day post-discharge spend per episode ÷ its state's, summed over SNF, home health, inpatient, outpatient, hospice, carrier and DME), capped at ±20%. The anchor stay is held at target because TEAM pays it at a standardized MS-DRG price. State is used as the comparator because TEAM target prices are regional, not national.
3. Proxy composite quality score = (E × readmission percentile + E × PSI-90 percentile + E_LEJR × 50) ÷ (2E + E_LEJR), where E is total inpatient episodes, percentiles are the hospital's rank among all Care Compare hospitals (lower rate = higher percentile), the readmission percentile is the denominator-weighted average of its hip/knee and CABG readmission percentiles (proxy for the hybrid hospital-wide measure), and the THA/TKA patient-reported measure is 50 because it is not public. Missing measures score 50, which matches CMS's rule for unreported measures.
4. Lever starting points: LEJR readmission = the hospital's hip/knee readmission rate; CABG readmission = its CABG rate; other categories = national default × (hospital 30-day inpatient spend ÷ state), clamped 0.6 to 1.6. SNF share = default × (hospital 30-day SNF spend ÷ state), clamped 0.5 to 1.8 and capped at 90%. SNF days = default × (county SNF days per 1,000 ÷ national), clamped 0.7 to 1.4. IRF share = default × (county IRF spend per capita ÷ national), clamped 0.3 to 2. VTE = default × (hospital PSI-12 ÷ national median 3.4), clamped 0.4 to 2. Major-bowel SSI = 10% × colon SSI ratio, clamped 0.3 to 2.5, only when at least one predicted infection.
5. Safety-net flag = Medicare SSI share (DSH patient percentage minus Medicaid percentage, FY2027 impact file) at or above the 75th percentile of IPPS hospitals, 8.7%. CMS's actual test uses dual-eligible or Part D LIS share at the 75th percentile over a three-year baseline; this is the closest public proxy. Rural = the impact file's geographic RURAL flag (CMS also counts rural census tracts).
6. Risk multiplier stays 1.00. CMS's bed-size and safety-net hospital factors are not published as coefficients.

**What this layer is not.** The spend and quality inputs come from all-condition public measures, so they describe a hospital's post-discharge habits and its quality standing, not its TEAM surgical episode results. The page says so in the facts panel and the methodology list.

## FY2027 IPPS final rule changes to TEAM (CMS-1849-F, displayed 2026-07-31, published 2026-08-04, effective 2026-10-01)

Read from the rule text in `cms-sources/ipps-fy2027/fy2027-team-section.txt`. What changed and how the calculator handles it:

- MS-DRGs 523, 524 and 525 become spinal fusion episode triggers on October 1, 2026, with distinct target prices from PY2. The PY1 workbook has no prices for them, so the page tells users to count them under the fusion MS-DRG they replaced. No change to the DRG list yet.
- MS-DRG update factor and APC update factor multiply the prospective trend factor from PY1 (PY1 factors expected 2026 Q4; later years APC in Q1, MS-DRG in Q4). Episodes ending in a performance year's fourth quarter map back to the first fiscal year's MS-DRG. Not in the public workbook; noted as not modeled.
- Prospective normalization factor and risk adjustment multiplier built from all three baseline years from PY2 (PY1 still uses the most recent year). Noted.
- Composite quality score: concurrent baseline period beginning PY1 (CMS withdrew the proposed sliding historical baseline); hybrid HWR, PSI-90, THA/TKA PRO-PM and the surgical-death measure move to July to June periods. PY2 to PY5 add Hospital Harm falls with injury and postoperative respiratory failure (calendar-year periods) and the 30-day surgical death measure (two-year July to June). A hospital with no or incomplete data on a measure scores 50. Reflected in the Step 4 note and the proxy CQS rule.
- CJR-X (nationwide mandatory joint replacement model, starting January 1, 2028 per the CMS fact sheet) excludes TEAM participants through 2030 and has attribution guardrails for overlapping windows. Not modeled.
- ASC episodes and physician-owned hospitals were requests for information only.

The TEAM PY1 preliminary target price workbook and the updated overview deck on the CMS TEAM page are byte-identical to the copies saved 2026-10-15, so prices are unchanged.

MS-DRG titles for the FY2025 spinal fusion regrouping now come from the CMS public file (402, 426 to 428, 448, 451 confirmed; 429, 430, 447, 450 inferred from the CMS mapping summary).


## CFO review fixes (added 2026-10-19)

Sixteen weaknesses a hospital CFO would raise, each with what the page now does. Numbers below are the Jacksonville case after the change.

1. **Spend is not the hospital's spend.** Each category now carries a badge: "your number", "estimated from public pattern, replace with your baseline", or "at regional target". The spend field is labeled as the place for the CMS baseline report figure. A hospital's own number clears the derived estimate.
2. **Risk adjustment dominates.** Results list a ±0.06 risk-multiplier range and a break-even multiplier found by bisection (Track 1: no break-even, Track 3 equivalent shown instead). When a hospital is picked the slider is seeded from public factors: bed-size band (≤250 beds −0.01, 501 to 850 +0.01, 851+ +0.02), safety-net flag (+0.01), and 0.25 × (county dual-eligible share − national 14.6%), clamped 0.94 to 1.06. CMS's coefficients are not public; this is a labeled proxy.
3. **The target moves at reconciliation.** A final-price band reruns the result with the target 3% lower and 3% higher (the retrospective trend cap) and prints both ends.
4. **Outpatient episodes.** The CMS workbook says HCPCS episode types are mapped and reported under the corresponding MS-DRG, so the page adds an outpatient joint row priced at MS-DRG 470 and an outpatient fusion row priced at MS-DRG 473. The joint row prefills from APC 5115 services, labeled an upper bound because that APC also holds other Level 5 procedures. The PRO-PM weight in the proxy CQS still uses inpatient joints only, as CMS's example does.
5. **Low-volume floor.** The flag sets itself when three times the annual count is 30 or fewer, and users can type counts for MS-DRGs the public file suppresses.
6. **Proxy quality score.** The slider is labeled a proxy when prefilled and a note under it shows the three components, which are real, which are proxies, and the weights, with the PRO-PM caveat about the 50% response-rate floor.
7. **Comparison group.** The quality scoring fact sheet says percentiles come from a national set of hospitals eligible for TEAM, not just participants. Percentiles are now computed among the 3,032 IPPS hospitals in the FY2027 impact file excluding Maryland (critical access hospitals dropped).
8. **Safety-net flag.** Checkbox relabeled "CMS notification governs"; the facts panel shows the SSI share against the 8.7% threshold and the county dual-eligible share.
9. **Net to the hospital.** A panel below the results (shown when levers are on) subtracts program cost per year (default $250,000), contribution margin lost per avoided readmission (default $3,500), and revenue lost per avoided SNF day in owned facilities (default $0) from the with-program reconciliation, and shows the do-nothing figure beside it. Avoided readmissions and SNF days are computed from the lever deltas × episodes × realization.
10. **Unit costs.** SNF per day is the standardized Medicare payment per covered day from the Geographic Variation file ($626 national, state value when a hospital is picked, clamped $450 to $900 because swing-bed-heavy states show per-diems above $1,000). Readmission cost inflated from HCUP's 2018 $15,500 to $19,400. A $900 outpatient therapy allowance and the home health period are charged against every patient moved home. A realization slider (default 60%) scales every lever. The typical-program preset is capped at $1,200 raw savings per episode (CJR measured $1,226; BPCI Advanced about $500 to $1,000) before realization.
11. **Regional ratchet.** Five-year view adds a regional target change per year (default −1%) applied as a target multiplier alongside the hospital's own spend change.
12. **Sequestration and timing.** A 2% sequestration toggle (default on) reduces positive amounts only; the five-year chart labels each year's settlement year and the caption explains the true-up.
13. **Validation.** A Checks section recomputes the CMS quality-scoring worked examples (weighting example 51.4 vs 51.5 from unrounded weights; all six positive and negative adjustment rows match) and compares the lever arithmetic with CJR ($1,226 per episode) and BPCI Advanced (about $500 SNF) findings at the page's current unit costs.
14. **Category signals.** Where a public surgical signal exists it adjusts that category's spend shift in dollars per episode: joints and CABG use HRRP predicted minus expected readmission rate × readmission cost; bowel uses (colon SSI ratio − 1) × 10% × SSI cost. The facts panel names the categories that have no signal.
15. **Division comparator.** The 30-day spending comparator is now the census division (hospital-count-weighted average of its states' Care Compare values) instead of the state, matching how TEAM prices.
16a. **Margin context (added later on 2026-10-19).** Step 1 takes optional operating revenue and operating margin. Revenue prefills from the 2024 Medicare cost report (net patient revenue, with the fiscal year shown); margin defaults to 2.5%, the Kaufman Hall National Hospital Flash Report year-to-date operating margin through August 2026 (43% of hospitals at a loss), because the cost report's patient-service margin excludes other income and is noisy (participant median −1.6%, quartiles −13% to +9%), so it is shown in the facts panel for reference only. The results board states the NPRA in points of operating margin and as a share of operating income, and for Track 1 users shows what the same inputs would be in Track 3.
16. **Form privacy.** The scenario payload carries only the inputs and the hospital name typed in the form; the note states 30-day retention in the form inbox.

Case figures after the fixes (PY1, sequestration on, realization 60%): Manhattan +$2.30M on $101.3M (Track 3; program $4.53M); Jacksonville +$546K on $46.7M (Track 1; program $1.53M, net to hospital about $1.24M after a $250K program and lost readmission margin); Minneapolis +$671K on $16.0M; Bozeman +$987K on $12.2M (Track 1, near its 10% stop-gain); Harrison +$71K on $4.9M; Hershey −$360K on $15.0M at Track 3, $0 at Track 1, program −$63K.

## What is deliberately left out

- The actual hospital-specific risk multiplier and normalization factor (CMS-provided; modeled as an input).
- The 99th-percentile outlier cap on individual episodes (already inside the CMS benchmark prices; the user enters average spend).
- Post-episode spending monitoring, episode cancellations, overlap rules with ACOs and other models, beneficiary incentives, and the retrospective trend update at reconciliation.
- Sequestration and any Medicare Advantage volume (TEAM is traditional Medicare only).

## Worked check

Mid-size Pennsylvania hospital (Middle Atlantic, census division 2), Track 3, CQS 50, risk multiplier 1.00:
- 300 LEJR episodes, DRG 470, regional target about $27.4K, spend $26.0K → +$420K
- 80 hip fracture episodes, DRG 481, target about $43.9K, spend $46.0K → −$168K
- Aggregate +$252K. Positive, so quality adjustment 10% × (1 − 0.5) = 5% → $239.4K. Aggregated target about $11.7M, stop-gain 20% = $2.3M, not binding. NPRA ≈ +$239K.
(Exact DRG prices are read from the workbook at run time; these figures are rounded.)

## Guardrails on the page

- "Estimates only. Not affiliated with or endorsed by CMS. No patient data is collected or stored."
- Every published figure links to the CMS source document.
- No hospital names other than the CMS participant list.
