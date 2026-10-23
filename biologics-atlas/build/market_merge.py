#!/usr/bin/env python3
"""Merge the market research slices (research/market/*.json) into data/market.json and test Jay's hypothesis:
   large caps hold the leading share in most indications; a small or mid cap that leads must carry strong evidence; those get acquired.

Reads (all optional, missing files are skipped):
  research/market/market-spine.json, market-trauma-extremities.json  -> shares by application
  research/market/companies.json                                     -> cap tiers and market caps
  research/market/deals.json                                         -> M&A record
  research/market/market-size.json                                   -> volumes, sizes, penetration, reimbursement
  data/products.json                                                 -> evidence grades per product x application
Writes data/market.json and prints the hypothesis table. The verdict prose lives in research/market/verdict.md (written by hand after reading the numbers)."""
import json, os, re, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
M = os.path.join(ROOT, "research/market")
def load(name, default):
    p = os.path.join(M, name)
    if not os.path.exists(p): return default
    try: return json.load(open(p))
    except Exception as e: print("skip", name, e); return default

prods = json.load(open(os.path.join(ROOT, "data/products.json")))
apps = json.load(open(os.path.join(ROOT, "data/applications.json")))
app_by = {a["id"]: a for a in apps}
prod_by = {p["id"]: p for p in prods}
GRADE = {"I": 1, "II": 2, "III": 3, "IV": 4, "V": 5}

comp_file = load("companies.json", {"companies": []})
companies = comp_file.get("companies", [])
def norm(s): return re.sub(r"[^a-z0-9]+", " ", (s or "").lower()).strip()
# aliases: company id -> words that identify it in a product's company string
ALIAS = {
 "medtronic": ["medtronic", "kyphon", "sofamor"], "stryker": ["stryker", "wright medical", "orthovita"], "jnj-depuy-synthes": ["depuy", "synthes", "johnson"],
 "zimmer-biomet": ["zimmer", "biomet"], "globus-medical": ["globus", "nuvasive", "nevro"], "orthofix": ["orthofix", "seaspine"], "bioventus": ["bioventus"],
 "smith-nephew": ["smith+nephew", "smith nephew", "osiris"], "arthrex": ["arthrex"], "enovis": ["enovis", "djo"], "baxter": ["baxter", "apatech"], "integra": ["integra"],
 "isto-biologics": ["isto", "novabone", "arteriocyte"], "cerapedics": ["cerapedics"], "bonesupport": ["bonesupport", "bone support"], "biocomposites": ["biocomposites"],
 "kuros": ["kuros"], "elutia-berkeley": ["elutia", "aziyo", "berkeley"], "spinal-elements": ["spinal elements"], "spineart": ["spineart"], "alphatec": ["alphatec", "atec"],
 "xtant-medical": ["xtant"], "surgalign-rti-evergen": ["surgalign", "rti surgical", "evergen"], "mtf-biologics": ["mtf"], "lifenet-health": ["lifenet"], "allosource": ["allosource"],
 "si-bone": ["si-bone", "si bone"], "anika": ["anika"], "treace": ["treace"], "organogenesis": ["organogenesis"], "mimedx": ["mimedx"], "abyrx": ["abyrx", "orthocon"],
 "ossium": ["ossium"], "terumo": ["terumo", "harvest"], "omnia": ["omnia"], "painteq": ["painteq"], "aurora-spine": ["aurora spine"], "radius": ["radius health"],
 "amgen": ["amgen"], "lilly": ["lilly"], "novartis": ["novartis"], "tr-biofab": ["t&r biofab", "t r biofab"], "bonalive": ["bonalive"], "skeletal-kinetics": ["skeletal kinetics"],
 "osartis": ["osartis"], "lynch": ["lynch biologics"], "atreon": ["atreon", "nanofiber"], "prosidyan": ["prosidyan"], "cornerloc": ["cornerloc", "foundation fusion"], "cgbio": ["cgbio"],
 "jrf-ortho": ["jrf"], "vivex": ["vivex"], "nexus": ["nexus"], "bone-bank-allografts": ["bone bank"], "community-tissue-services": ["community tissue"],
}
for c in companies:
    ALIAS.setdefault(c["id"], []); ALIAS[c["id"]].append(norm(c.get("name", "")).split(" ")[0] if c.get("name") else c["id"])
comp_by = {c["id"]: c for c in companies}
def company_id_for(text):
    t = norm(text)
    best = None
    for cid, words in ALIAS.items():
        for w in words:
            if w and norm(w) in t:
                if best is None or len(norm(w)) > len(norm(best[1])): best = (cid, w)
    return best[0] if best else None
def tier_of(cid):
    c = comp_by.get(cid)
    if not c: return "unknown"
    t = (c.get("cap_tier") or "unknown").split(" ")[0].lower()
    return t if t in ("large", "mid", "small", "private", "nonprofit", "subsidiary") else "unknown"

# product -> company id and tier (first company named wins; multi-vendor products are 'multiple')
prod_company = {}
for p in prods:
    cs = p["company"] if isinstance(p["company"], str) else (p["company"].get("name") or "")
    if cs.lower().startswith(("multiple", "various", "tissue banks", "technique", "n/a")): prod_company[p["id"]] = {"company_id": None, "tier": "multiple"}
    else:
        cid = company_id_for(cs); prod_company[p["id"]] = {"company_id": cid, "tier": tier_of(cid) if cid else "unknown"}

# shares
shares = []
for f in ("market-spine.json", "market-trauma-extremities.json"):
    j = load(f, {})
    for s in j.get("shares", []) or []:
        s = dict(s); s["slice"] = f.split(".")[0]
        if not s.get("product_id") and s.get("product_name"):
            # try to match by name
            n = norm(s["product_name"]).split(" ")[0]
            hit = [p["id"] for p in prods if n and n in norm(p["name"])]
            if len(hit) == 1: s["product_id"] = hit[0]
        cid = company_id_for(s.get("company", "")) or (prod_company.get(s.get("product_id"), {}).get("company_id"))
        s["company_id"] = cid; s["cap_tier"] = tier_of(cid) if cid else "unknown"
        pid, aid = s.get("product_id"), s.get("application_id")
        g = None
        if pid in prod_by and aid in app_by:
            for x in prod_by[pid].get("applications", []):
                if x["application_id"] == aid: g = x.get("evidence_grade")
        if g is None and pid in prod_by:
            gs = [GRADE.get(x.get("evidence_grade"), 5) for x in prod_by[pid].get("applications", [])]
            g = {v: k for k, v in GRADE.items()}.get(min(gs)) if gs else None
            s["grade_basis"] = "best grade across applications" if g else None
        s["evidence_grade"] = g
        shares.append(s)

leaders = collections.defaultdict(list)
for s in shares: leaders[s.get("application_id") or "unknown"].append(s)
for k in leaders: leaders[k].sort(key=lambda s: (s.get("rank") or 99, -(s.get("share_pct") or 0)))

deals = load("deals.json", {"deals": []}).get("deals", [])
for d in deals:
    d["acquirer_id"] = d.get("acquirer_id") or company_id_for(d.get("acquirer", ""))
    for pid in d.get("product_ids", []) or []:
        if pid in prod_by:
            gs = [GRADE.get(x.get("evidence_grade"), 5) for x in prod_by[pid].get("applications", [])]
            d.setdefault("target_best_grade_now", {v: k for k, v in GRADE.items()}.get(min(gs)) if gs else None)
size = load("market-size.json", {})

# ---- hypothesis tests ----
app_ids_with_leader = [k for k in leaders if k in app_by]
lead_rows = []
for aid in app_ids_with_leader:
    top = leaders[aid][0]
    lead_rows.append({"application_id": aid, "region": app_by[aid]["region"], "leader_product": top.get("product_name"), "leader_company": top.get("company"), "cap_tier": top.get("cap_tier"), "share_pct": top.get("share_pct"), "evidence_grade": top.get("evidence_grade"), "confidence": top.get("confidence")})
by_tier = collections.Counter(r["cap_tier"] for r in lead_rows)
# claim 2: small/mid-cap products that rank in the top 3 anywhere: their evidence vs large-cap leaders' evidence
def gnum(g): return GRADE.get(g, None)
smallmid = [s for s in shares if s.get("cap_tier") in ("small", "mid", "private") and (s.get("rank") or 99) <= 3 and s.get("evidence_grade")]
large = [s for s in shares if s.get("cap_tier") == "large" and (s.get("rank") or 99) <= 3 and s.get("evidence_grade")]
def avg(xs): return round(sum(xs) / len(xs), 2) if xs else None
claim2 = {"small_mid_top3_n": len(smallmid), "small_mid_mean_grade": avg([gnum(s["evidence_grade"]) for s in smallmid]), "small_mid_level_I_pct": round(100 * sum(1 for s in smallmid if s["evidence_grade"] == "I") / len(smallmid)) if smallmid else None,
          "large_top3_n": len(large), "large_mean_grade": avg([gnum(s["evidence_grade"]) for s in large]), "large_level_I_pct": round(100 * sum(1 for s in large if s["evidence_grade"] == "I") / len(large)) if large else None}
# claim 3: deals by acquirer tier and target evidence
acq_tier = collections.Counter((d.get("acquirer_cap_tier_at_deal") or "unknown").split(" ")[0] for d in deals if d.get("deal_type") in ("acquisition", "merger", "asset purchase"))
ev_at_deal = collections.Counter()
for d in deals:
    e = (d.get("evidence_at_deal") or "").lower()
    k = "RCT or PMA" if ("rct" in e or "pma" in e or "level i" in e or "randomi" in e) else ("510(k) or allograft, no comparative data" if ("510" in e or "361" in e or "no " in e or "none" in e) else "other or unstated")
    ev_at_deal[k] += 1

analysis = {"leaders_by_tier": dict(by_tier), "leader_rows": lead_rows, "claim2": claim2, "deals_by_acquirer_tier": dict(acq_tier), "deals_by_evidence_at_deal": dict(ev_at_deal), "n_shares": len(shares), "n_deals": len(deals)}
verdict_path = os.path.join(M, "verdict.md")
verdict = open(verdict_path).read() if os.path.exists(verdict_path) else ""

out = {"generated": "2026-10-22", "companies": [{"id": c["id"], "name": c.get("name"), "ticker": c.get("ticker"), "public": c.get("public"), "cap_tier": tier_of(c["id"]), "market_cap_usd_b": c.get("market_cap_usd_b"), "market_cap_date": c.get("market_cap_date"), "orthobiologics_revenue_usd_m": c.get("orthobiologics_revenue_usd_m"), "orthobiologics_revenue_note": c.get("orthobiologics_revenue_note"), "owner": c.get("owner"), "sources": c.get("sources", [])} for c in companies],
       "product_company": prod_company, "shares": shares, "leaders": dict(leaders), "deals": deals,
       "size": {k: size.get(k, []) for k in ("procedure_volumes", "biologic_penetration", "market_size", "reimbursement")},
       "category_split": (load("market-spine.json", {}).get("category_split", []) or []) + (load("market-trauma-extremities.json", {}).get("category_split", []) or []),
       "analysis": analysis, "verdict_md": verdict,
       "gaps": (load("market-spine.json", {}).get("gaps", []) or []) + (load("market-trauma-extremities.json", {}).get("gaps", []) or []) + (size.get("gaps", []) or [])}
json.dump(out, open(os.path.join(ROOT, "data/market.json"), "w"), indent=1, ensure_ascii=False)
print(f"market.json: {len(companies)} companies, {len(shares)} share rows over {len(app_ids_with_leader)} applications, {len(deals)} deals")
print("leaders by cap tier:", dict(by_tier))
print("claim 2:", claim2)
print("deals by acquirer tier:", dict(acq_tier), "| evidence at deal:", dict(ev_at_deal))
for r in sorted(lead_rows, key=lambda r: (r["region"], r["application_id"])):
    print(f"  {r['region']:16} {r['application_id']:22} {str(r['cap_tier']):8} {str(r['share_pct']):>5} grade {str(r['evidence_grade']):3} {r['leader_product']} ({r['leader_company']}) [{r['confidence']}]")
