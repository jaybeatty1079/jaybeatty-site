#!/usr/bin/env python3
"""Project every TEAM participant's 2027 (PY2) reconciliation from the public data layer and build the map page.

Port of build/engine.js (catCalc, reconcile, qualityAdj) and the page's derivePublic() so the batch is reproducible without a browser.
Validated against the live page: the first fourteen participants' Track 3 results must match the in-browser engine to the dollar.

Inputs (all in this folder): data_hospital_slim.json, data_participants.json, data_target_prices_py1.json, cms-sources/pulls/geo/participants_geo.json
Outputs: data_map_2027.json (one compact row per hospital) and the map page from build/map-template.html.

Usage: /usr/bin/python3 -I build/build_map.py [--out /path/map.html]"""
import json, os, sys, math, statistics

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "/Users/jaybeatty/Claude/jaybeatty-site/team-calculator"
out_path = sys.argv[sys.argv.index("--out") + 1] if "--out" in sys.argv else os.path.join(SITE, "map.html")
L = lambda n: json.load(open(os.path.join(ROOT, n)))
H = L("data_hospital_slim.json"); NAT = H["nat"]; HOSP = H["h"]
PARTS = L("data_participants.json"); TP = L("data_target_prices_py1.json")
GEO = json.load(open(os.path.join(ROOT, "cms-sources/pulls/geo/participants_geo.json")))

# ---- reference tables, copied from engine.js ----
DIVSTATES = {1: 'CT ME MA NH RI VT', 2: 'NJ NY PA', 3: 'IL IN MI OH WI', 4: 'IA KS MN MO NE ND SD', 5: 'DE DC FL GA MD NC SC VA WV', 6: 'AL KY MS TN', 7: 'AR LA OK TX', 8: 'AZ CO ID MT NV NM UT WY', 9: 'AK CA HI OR WA AS GU MP PR VI'}
STATE2DIV = {s: d for d, ss in DIVSTATES.items() for s in ss.split(' ')}
CATS = [("lejr", ["469", "470", "521", "522", "470-OP"]), ("shfft", ["480", "481", "482"]), ("cabg", ["231", "232", "233", "234", "235", "236"]),
        ("spine", ["402", "426", "427", "428", "429", "430", "447", "448", "450", "451", "471", "472", "473", "473-OP"]), ("bowel", ["329", "330", "331"])]
TRACKS = {1: dict(gain=.10, loss=0, negAdj=0), 2: dict(gain=.05, loss=.05, negAdj=.15), 3: dict(gain=.20, loss=.20, negAdj=.10)}
UNIT = dict(readmit=19400, ssi=12800)
LEVER_RA = dict(lejr=4, shfft=12, cabg=12, spine=8, bowel=12)  # typical readmission rate per category, from engine.js LEVER_DEF
SETTING = {"lejr": [13000, 2000, 4000], "shfft": [14500, 3500, 20500], "cabg": [41000, 6000, 10000], "spine": [25000, 5000, 7500], "bowel": [17000, 3000, 6000]}
PRICE = {(r["drg"], r["region"]): r["target"] for r in TP}
def price(drg, region): return PRICE.get((str(drg).split("-")[0], region), 0)
clamp = lambda v, lo, hi: max(lo, min(hi, v))
def jsround(x):  # JavaScript Math.round rounds half up; Python rounds half to even
    return math.floor(x + 0.5)

def derive(h):
    rt, cx, q = h.get("rt") or {}, h.get("cx") or {}, h.get("q") or {}
    counts = dict(h.get("ip") or {})
    reg = STATE2DIV.get(h.get("st"), 2)
    shift, sig, sigsrc, rsig = {}, {}, {}, {}
    E = El = 0
    for key, drgs in CATS:
        n = tsum = 0
        for d in drgs:
            k = counts.get(d, 0); n += k; tsum += k * price(d, reg)
        E += n
        if key == "lejr": El = n
        avgT = tsum / n if n else price(drgs[min(1, len(drgs) - 1)], reg)
        sh = SETTING[key]; p = sh[2] / (sh[0] + sh[1] + sh[2])
        pac = 100 * p * (rt["pac"] - 1) if rt.get("pac") else 0
        extra = None; src = None
        if key == "lejr" and q.get("ehkp") is not None and q.get("ehke") is not None: extra = (q["ehkp"] - q["ehke"]) / 100 * UNIT["readmit"]; src = "hrrp-hk"
        elif key == "cabg" and q.get("ecbp") is not None and q.get("ecbe") is not None: extra = (q["ecbp"] - q["ecbe"]) / 100 * UNIT["readmit"]; src = "hrrp-cabg"
        elif q.get("e6") is not None: extra = (q["e6"] - 1) * (LEVER_RA[key] / 100) * UNIT["readmit"]; src = "hrrp6"  # six-condition HRRP ratio on the category's typical readmission rate
        rextra = extra  # readmission dollars alone, before the infection add-on, for the "of which readmissions" attribution
        if key == "bowel" and rt.get("ssi") is not None: extra = (extra or 0) + (rt["ssi"] - 1) * 0.10 * UNIT["ssi"]; src = (src + "+ssi") if src else "ssi"
        if extra is not None and avgT: sig[key] = round(extra / avgT * 100, 1)
        if rextra is not None and avgT: rsig[key] = round(rextra / avgT * 100, 1)
        sigsrc[key] = src
        # joint replacement: CMS's own 90-day hip/knee payment measure replaces the inferred pattern when the hospital has one
        if key == "lejr" and q.get("phk") is not None and (NAT.get("phkdiv") or {}).get(str(reg)): shift[key] = round(clamp((q["phk"] / NAT["phkdiv"][str(reg)] - 1) * 100, -20, 20), 1); sigsrc[key] = "paym"
        else: shift[key] = round(clamp(pac + (sig.get(key) or 0), -20, 20), 1)
    if h.get("op"): counts["470-OP"] = h["op"]
    rd = cx.get("readm", 50) if cx.get("readm") is not None else 50
    ps = cx.get("psi90", 50) if cx.get("psi90") is not None else 50
    cqs = jsround((E * rd + E * ps + El * 50) / (2 * E + El)) if E else jsround((rd + ps + 50) / 3)
    rp = 1.0; beds = h.get("beds")
    if beds is not None and beds >= 851: rp += .02
    elif beds is not None and beds >= 501: rp += .01
    elif beds is not None and beds <= 250: rp -= .01
    if h.get("sn"): rp += .01
    if h.get("dual") is not None and NAT.get("dual") is not None: rp += (h["dual"] - NAT["dual"]) * .25
    rp = round(clamp(rp, .94, 1.06), 2)
    return dict(counts=counts, shift=shift, sig=sig, sigsrc=sigsrc, rsig=rsig, cqs=cqs, E=E, El=El, sn=bool(h.get("sn")), rural=bool(h.get("rural")), risk=rp, reg=reg)

def cat_calc(drgs, counts, spend, lowvol, region, risk):
    n = tsum = 0
    for d in drgs:
        k = counts.get(d, 0); n += k; tsum += k * price(d, region)
    regional = tsum / n if n else price(drgs[min(1, len(drgs) - 1)], region)
    target = regional * risk
    sp = regional if spend is None else spend
    recon = (target - sp) * n
    capped = lowvol and recon < 0
    if capped: recon = 0
    return dict(n=n, regional=regional, target=target, spend=sp, recon=recon, capped=capped, aggTarget=target * n, aggSpend=sp * n)

def reconcile(h, dv, track):
    rows = []; recon = aggT = aggS = eps = 0
    for key, drgs in CATS:
        n = sum(dv["counts"].get(d, 0) for d in drgs)
        if n == 0: continue
        lowvol = n > 0 and n * 3 <= 30
        base = cat_calc(drgs, dv["counts"], None, lowvol, dv["reg"], dv["risk"])
        spend = jsround(base["target"] * (1 + dv["shift"][key] / 100))  # applyPublic: st.spend = Math.round(target * (1 + shift/100))
        r = cat_calc(drgs, dv["counts"], spend, lowvol, dv["reg"], dv["risk"]); r["key"] = key; r["sig"] = dv["sig"].get(key); r["shift"] = dv["shift"][key]
        rows.append(r); recon += r["recon"]; aggT += r["aggTarget"]; aggS += r["aggSpend"]; eps += n
    T = TRACKS[track]
    base = recon
    if track == 1 and base < 0: base = 0
    adj = .10 * (1 - dv["cqs"] / 100) if base > 0 else (T["negAdj"] * dv["cqs"] / 100 if base < 0 else 0)
    qa = base - base * adj
    gain, loss = T["gain"] * aggT, T["loss"] * aggT
    npra, cap = qa, None
    if npra > gain: npra, cap = gain, "gain"
    if npra < -loss: npra, cap = -loss, "loss"
    seq = npra * .02 if npra > 0 else 0
    npra -= seq
    return dict(rows=rows, recon=recon, npra=npra, cap=cap, aggT=aggT, aggS=aggS, eps=eps, adj=adj)

# ---- validation against the in-browser engine (TEAMCALC.run({track:3}) on 2026-10-23, after the HRRP six-condition and hip/knee payment signals) ----
EXPECT_T3 = {"010039": 2617062, "010052": 0, "010065": 28174, "010079": 318740, "010131": 1145268, "030006": 1008702, "030010": 30204, "030011": -409864, "030064": -374283, "030085": 223372, "030111": 0, "030114": -284011, "030148": 66862, "040014": 382363}

rows = []; bad = []
for p in PARTS:
    h = HOSP.get(p["ccn"]); g = GEO.get(p["ccn"], {})
    base = dict(ccn=p["ccn"], name=p["name"].title().replace("'S", "'s"), st=p["state"], cbsa=p.get("cbsa_name"), type=p["type"], lat=g.get("lat"), lon=g.get("lon"), city=g.get("city"), geo_note=g.get("geo_note"))
    if not h:
        rows.append(dict(base, nodata=True)); continue
    dv = derive(h)
    r = {t: reconcile(h, dv, t) for t in (1, 2, 3)}
    if p["ccn"] in EXPECT_T3 and abs(r[3]["npra"] - EXPECT_T3[p["ccn"]]) > 2: bad.append((p["ccn"], round(r[3]["npra"]), EXPECT_T3[p["ccn"]]))
    # 2027 = PY2. Track 1 (no downside) stays open to safety-net hospitals through PY3; Track 2 (±5%) to rural, SCH, MDH and EACH; everyone else is in Track 3 (±20%).
    track27 = 1 if dv["sn"] else (2 if dv["rural"] else 3)
    r3 = r[3]
    readm_dollars = sum(w["aggTarget"] * (dv["rsig"].get(w["key"]) or 0) / 100 for w in r3["rows"])  # spend attributed to excess readmissions: HRRP predicted minus expected for joints and CABG, the six-condition ratio elsewhere
    q = h.get("q") or {}; cx = h.get("cx") or {}
    rows.append(dict(base, sn=dv["sn"], rural=dv["rural"], cqs=dv["cqs"], risk=dv["risk"], reg=dv["reg"], E=dv["E"], eps=r3["eps"], aggT=round(r3["aggT"]), aggS=round(r3["aggS"]),
        recon=round(r3["recon"]), t1=round(r[1]["npra"]), t2=round(r[2]["npra"]), t3=round(r[3]["npra"]), cap3=r3["cap"], track27=track27, npra27=round(r[track27]["npra"]),
        readm=round(readm_dollars), beds=h.get("beds"), urb=h.get("urb"), pac=(h.get("rt") or {}).get("pac"),
        rhk=q.get("rhk"), rcb=q.get("rcb"), ehk=q.get("ehk"), ecb=q.get("ecb"), e6=q.get("e6"), e6k=q.get("e6k"), phk=q.get("phk"), phkc=q.get("phkc"), readmPct=cx.get("readm"), readmSrc=cx.get("readm_src"), psi90=cx.get("psi90"),
        src={k: v for k, v in dv["sigsrc"].items() if v},
        cats=[[w["key"], w["n"], round(w["aggTarget"]), round(w["recon"]), w["shift"], w["sig"]] for w in r3["rows"]]))
if bad: print("VALIDATION FAILED", bad); sys.exit(1)
print(f"validated {len(EXPECT_T3)} hospitals against the in-browser engine")

# ---- summary ----
def summarize(key):
    withvol = [r for r in rows if not r.get("nodata") and r["eps"] > 0]
    neg = [r for r in withvol if r[key] < 0]; pos = [r for r in withvol if r[key] > 0]
    return dict(hospitals=len(rows), with_volume=len(withvol), repay=len(neg), paid=len(pos), zero=len(withvol) - len(neg) - len(pos),
                repay_total=round(sum(r[key] for r in neg)), paid_total=round(sum(r[key] for r in pos)), repay_median=round(statistics.median([r[key] for r in neg])) if neg else 0,
                shielded=len([r for r in withvol if r["track27"] == 1 and r["recon"] < 0]) if key == "npra27" else None)
summary = dict(designated=summarize("npra27"), all_track3=summarize("t3"), nodata=len([r for r in rows if r.get("nodata")]), geocoded=len([r for r in rows if r.get("lat")]),
               built="2026-10-22", prices="PY1 preliminary target prices (CMS workbook); PY2 prices not yet published", data_year="CY2024 volumes and FY2026 Care Compare releases")
by_state = {}
for r in rows:
    if r.get("nodata") or r["eps"] == 0: continue
    s = by_state.setdefault(r["st"], dict(n=0, repay=0, repay_total=0, paid_total=0))
    s["n"] += 1
    if r["npra27"] < 0: s["repay"] += 1; s["repay_total"] += r["npra27"]
    elif r["npra27"] > 0: s["paid_total"] += r["npra27"]
data = dict(summary=summary, by_state=by_state, hospitals=rows)
json.dump(data, open(os.path.join(ROOT, "data_map_2027.json"), "w"), separators=(",", ":"))
print("designated tracks:", summary["designated"]); print("all track 3:", summary["all_track3"])

tpl = open(os.path.join(ROOT, "build/map-template.html")).read()
states = open(os.path.join(ROOT, "cms-sources/pulls/geo/states-10m.json")).read()  # us-atlas 3.0.1 states-10m (TopoJSON, US Census cartographic boundaries), inlined so the page has no runtime fetch
html = tpl.replace("__MAPDATA__", json.dumps(data, separators=(",", ":")).replace("</", "<\\/")).replace("__STATES__", states.replace("</", "<\\/"))
os.makedirs(os.path.dirname(out_path), exist_ok=True)
open(out_path, "w").write(html)
os.makedirs(os.path.join(SITE, "data"), exist_ok=True)
json.dump(data, open(os.path.join(SITE, "data/data_map_2027.json"), "w"), separators=(",", ":"))
for f in ("build_map.py", "map-template.html"):
    os.makedirs(os.path.join(SITE, "build"), exist_ok=True)
    open(os.path.join(SITE, "build", f), "w").write(open(os.path.join(ROOT, "build", f)).read())
print("wrote", out_path, f"{os.path.getsize(out_path)//1024} KB")
