# TEAM Episode Calculator: launch notes (2026-10-15)

Private preview: https://claude.ai/artifact/TzveUPzZT25eA73ufQyV2q
Site build: `team-calculator.html` in this folder (also copied to /Users/jaybeatty/Claude/site-redesign/). Rebuild with `python3 build/assemble.py` from this folder after editing `build/template.html` or `build/app.js`.

## Put it on jaybeatty.com (Netlify drag-and-drop)
1. In the folder you dragged to Netlify last time, create a folder named `team-calculator` and copy `team-calculator.html` into it renamed `index.html`. The page then lives at jaybeatty.com/team-calculator/.
2. Add the Projects block below to the home page and a nav link "Projects".
3. Drag the whole folder to Netlify Drop again. Netlify sees the form tag and starts collecting "team-calculator" submissions under Site > Forms (free tier: 100 a month). Turn on email notifications there so each lead lands in jay@jaybeatty.com.
4. Add `https://www.jaybeatty.com/team-calculator/` to sitemap.xml.

## Home-page Projects block (Scoreboard styling, paste inside the main wrap before Track record)
```html
<section id="projects">
  <div class="sec-head">
    <div><div class="eyebrow">Projects</div><h2 style="margin-top:12px">Tools I built so buyers could see the math.</h2></div>
    <p class="lede">Value-based care only sells when the CFO can see the number. This one models the CMS TEAM bundled-payment program for the 711 hospitals that were mandated into it in 2026.</p>
  </div>
  <div class="board" style="max-width:720px">
    <div class="board-head"><span>CMS TEAM Episode Calculator</span><span class="live">Live</span></div>
    <p style="color:var(--muted)">Pick a hospital from the CMS participant list, enter episode volumes and spend for joint replacement, hip fracture, CABG, spinal fusion and major bowel surgery, and see the estimated payment or repayment under Tracks 1, 2 and 3 with the quality adjustment and stop-loss rules applied. Built from the CMS PY1 target-price workbook and fact sheets. No patient data.</p>
    <div class="tiles"><div class="tile"><div class="lab">Hospitals on the list</div><div class="val">721</div></div><div class="tile"><div class="lab">Target prices loaded</div><div class="val">261</div><div class="delta">29 MS-DRGs × 9 regions</div></div></div>
    <div class="cta" style="margin-top:4px"><a class="btn primary" href="/team-calculator/">Open the calculator</a></div>
  </div>
</section>
```

## Resume bullet (Independent consulting, Pulse 365 or a Projects line)
- Built and published a CMS TEAM episode-payment calculator (jaybeatty.com/team-calculator) covering all 721 mandated hospitals and 29 MS-DRGs: models Track 1 to 3 reconciliation, quality adjustment and stop-loss rules from the CMS target-price workbook and fact sheets, so hospital CFOs and device partners can size exposure before a sales conversation.

## LinkedIn post plan (one post, one follow-up)
Post 1 (launch, Tue or Wed morning): "711 hospitals were put into CMS TEAM on January 1 whether they wanted in or not. Most of the CFOs I talked to this year still couldn't put a number on it. So I built one." Then three lines: what it does, that it is free and uses only public CMS data, the link. Ask: "If you run surgical service lines, tell me where it's wrong." Tag nobody; no hashtags beyond #TEAMmodel #valuebasedcare.
Post 2 (one week later): one screenshot of the three-track sensitivity chart with the sentence "Same hospital, 5% over target: Track 1 costs nothing, Track 3 costs $X." Use the example hospital numbers, say they are illustrative.
Comment plan: reply to every comment within the day with a question about their episode mix.

## Added 2026-10-16: levers module
Step 5 on the page (post-discharge mix, readmissions, SSI, VTE) with a "Load a typical program" preset, a spend-by-setting chart from the IAC/ACS national TEAM data, and a lever waterfall. On the example hospital the preset moves the PY1 Track 1 result from about $91K to about $1.0M, which is the sales story: the post-acute network and the infection program are worth more than the base reconciliation. Sources saved in cms-sources/evals/ (IAC/ACS webinar slides with page renders iac-p8/17/18.png, CJR PY6-8 summary, BPCI Advanced final report and appendices, MedPAC Data Book section 8, CJR PY1 findings).

LinkedIn post 3 idea: the waterfall screenshot with "For a mid-size hospital, three fewer SNF days and a 20% drop in readmissions are worth about $900K a year under TEAM. The reconciliation check is the small part."

## Added 2026-10-16 (evening): service-line tabs and five case hospitals
Tabs: Hospital / Orthopedics / Cardiac / Abdominal surgery (spine can be split out). Five case hospitals load from Step 1 with real 2024 Medicare volumes and modeled performance; a "Five hospitals, one model" section compares them. The page opens on the Jacksonville community-hospital case. Source hospitals are listed in the model spec, not on the page.

Talking points the cases give you: (1) the metro academic center earns about $0.75M on $80M of target book, and about $3.9M with a post-acute program, so TEAM is a rounding error without care redesign and real money with it; (2) the Florida community hospital loses about $0.9M in Track 3 at today's SNF pattern and earns about $0.5M with the program, which is the whole argument for a preferred SNF network; (3) the rural Arkansas hospital cannot lose on bowel surgery (low-volume rule) and keeps Track 1 through 2028, but a 10% stop-gain on a $3M book caps the upside near $300K.

## Still to decide
- Spinal fusion MS-DRG titles for 402, 426 to 430, 447, 448, 450, 451 are shown with CMS's FY2025 regrouping wording, not the full IPPS Table 5 titles. Fine for a calculator; worth a line of your eye.
- PY2 target prices are not published; the five-year view holds PY1 prices flat and says so.
- Netlify Forms only works on the live site; the preview build shows the scenario text to copy instead.


## 2026-10-18 update: public data layer

- The page is now about 725 KB because it embeds `data_hospital_slim.json` (470 KB) for all 721 participants. Still a single file; Netlify and the claude.ai artifact handle it. If size matters later, move the JSON to a sidecar file fetched at load (breaks the artifact variant) or gzip on the host.
- Rebuild order after any data refresh: `python3 build/build_metrics.py` (re-downloads nothing; reads the saved CSVs and pulls), `python3 build/derive.py`, `python3 build/assemble.py`. Delete `cms-sources/pulls/inpatient2024_teamdrgs_all.json` to re-pull inpatient volumes.
- Resume and LinkedIn lines can now say: "built on 13 public CMS datasets, prefilled for every one of the 721 mandatory hospitals."

## 2026-10-19: CFO review

- Sixteen fixes from a CFO-style critique are in (spec section "CFO review fixes"). Page is now about 760 KB.
- The resume line can add: "validated against the CMS worked examples and the CJR and BPCI Advanced evaluations; shows net-to-hospital after program cost and lost revenue."

## 2026-10-23: readmission and payment signals

- Data layer now carries all six HRRP conditions (one discharge-weighted ratio per hospital, 617 participants), a readmission adjustment for every category, and CMS's retired 90-day hip/knee payment measure for 388 participants, read from the April 2025 Care Compare archive snapshot (`cms-sources/carecompare/payment_2025-04-30.csv` and `payment_national_2025-04-30.csv`). Spec section "Readmission and payment signals".
- Rebuild order is unchanged: `build_metrics.py`, `derive.py`, `assemble.py`, then `build/build_map.py`. If the derivation in app.js changes, regenerate `EXPECT_T3` in build_map.py from the page (`TEAMCALC.pick(p)` then `TEAMCALC.run({track:3})` for the first 14 participants) or the map build refuses to run.
- Map totals moved: 188 repay $66.9M, 312 paid $126.0M under designated tracks. Resume line can say "20 public CMS datasets".

