#!/usr/bin/env python3
"""Check every K/P number in data/products.json against openFDA, and look up candidate K numbers
for device products that have none. Writes data/fda-check.md and data/fda-check.json.
openFDA has no De Novo or HDE endpoint, so DEN/H numbers are listed as 'not checkable here'."""
import json, re, time, urllib.request, urllib.parse, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
prods = json.load(open(os.path.join(ROOT, "data/products.json")))
DEVICE_CATS = {"DBM","synthetic-ceramic","bioactive-glass","calcium-phosphate-cement","calcium-sulfate","peptide","rhBMP","rhPDGF"}

def get(url):
    for i in range(3):
        try:
            with urllib.request.urlopen(url, timeout=30) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 404: return {"results": []}
            if e.code == 429: time.sleep(10); continue
            return {"error": str(e)}
        except Exception as e:
            time.sleep(2); last = str(e)
    return {"error": last}

def k_lookup(k):
    d = get(f"https://api.fda.gov/device/510k.json?search=k_number:{k}&limit=1")
    r = (d.get("results") or [None])[0]
    return None if not r else {"k": k, "device": r.get("device_name"), "applicant": r.get("applicant"), "date": r.get("decision_date"), "code": r.get("product_code")}

def p_lookup(p):
    d = get(f"https://api.fda.gov/device/pma.json?search=pma_number:{p}&limit=100")
    rs = d.get("results") or []
    orig = [r for r in rs if not r.get("supplement_number")]
    r = orig[0] if orig else (rs[0] if rs else None)
    return None if not r else {"p": p, "trade": r.get("trade_name"), "applicant": r.get("applicant"), "date": r.get("decision_date"), "generic": r.get("generic_name"), "supplements": len(rs)-len(orig)}

def name_search(term):
    q = urllib.parse.quote(f'device_name:"{term}"')
    d = get(f"https://api.fda.gov/device/510k.json?search={q}&sort=decision_date:desc&limit=6")
    return [{"k": r.get("k_number"), "device": r.get("device_name"), "applicant": r.get("applicant"), "date": r.get("decision_date")} for r in d.get("results") or []]

out = {"checked": [], "candidates": {}, "not_checkable": []}
lines = ["# FDA number check (openFDA)", "", f"Run {time.strftime('%Y-%m-%d')}. openFDA covers CDRH 510(k) and PMA (DEN numbers appear in the 510k endpoint); CBER BK-series 510(k)s (PRP and marrow separators) and HDE (H) numbers cannot be checked through it.", "", "## Numbers cited in products.json", "", "| product | number | openFDA result |", "|---|---|---|"]
for p in prods:
    ref = str(p.get("regulatory", {}).get("reference", "")) + " " + json.dumps(p.get("regulatory", {}).get("notes", ""))
    nums = set(re.findall(r"\b(K\d{6}|P\d{6}|DEN\d{6}|H\d{6}|BK\d{6})\b", ref))
    for n in sorted(nums):
        if n.startswith("K"):
            r = k_lookup(n); out["checked"].append({"product": p["id"], "number": n, "result": r})
            lines.append(f"| {p['id']} | {n} | " + (f"{r['device']} — {r['applicant']} — {r['date']} ({r['code']})" if r else "**NOT FOUND**") + " |")
        elif n.startswith("P"):
            r = p_lookup(n); out["checked"].append({"product": p["id"], "number": n, "result": r})
            lines.append(f"| {p['id']} | {n} | " + (f"{r['trade']} — {r['applicant']} — {r['date']}; {r['supplements']} supplements" if r else "**NOT FOUND**") + " |")
        else:
            out["not_checkable"].append({"product": p["id"], "number": n}); lines.append(f"| {p['id']} | {n} | not checkable via openFDA |")
        time.sleep(0.3)
lines += ["", "## Candidate 510(k)s for device products with no number (name search, newest first)", ""]
for p in prods:
    if p.get("category") not in DEVICE_CATS: continue
    ref = str(p.get("regulatory", {}).get("reference", ""))
    if re.search(r"\b(K\d{6}|P\d{6}|DEN\d{6})\b", ref): continue
    term = re.split(r"[ /(]", p["name"].replace("-", " "))[0]
    if len(term) < 4: term = p["name"].split("(")[0].strip()
    hits = name_search(term); out["candidates"][p["id"]] = {"term": term, "hits": hits}
    lines.append(f"### {p['id']} (searched device_name \"{term}\")")
    lines += [f"- {h['k']} — {h['device']} — {h['applicant']} — {h['date']}" for h in hits] or ["- no hits"]
    lines.append(""); time.sleep(0.3)
json.dump(out, open(os.path.join(ROOT, "data/fda-check.json"), "w"), indent=2)
open(os.path.join(ROOT, "data/fda-check.md"), "w").write("\n".join(lines) + "\n")
print("\n".join(lines))
