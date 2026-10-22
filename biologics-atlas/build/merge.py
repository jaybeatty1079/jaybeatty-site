#!/usr/bin/env python3
"""Merge the per-slice research JSON files into data/applications.json and data/products.json.

Usage: /usr/bin/python3 -I build/merge.py
- Products with the same id across slices are merged: scalar fields keep the first non-empty
  value (slice order below), list fields (applications, evidence, sources) are unioned
  (applications by application_id, evidence by ref).
- Writes data/merge-report.md with counts, duplicate ids, unknown application references,
  missing-field warnings and evidence-grade distribution.
"""
import json, os, re, sys, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RES = os.path.join(ROOT, "research")
OUT = os.path.join(ROOT, "data")
SLICES = ["spine", "hip-femur", "tibia-knee", "foot-ankle", "upper-extremity", "skull-cmf", "investigational"]

# Same product written under different ids by different slices -> canonical id
PRODUCT_ALIASES = {
    "grafton-dbm": "grafton", "ossigraft-prime": "ossigraft", "bmac-foot-ankle": "bmac", "bmac-point-of-care": "bmac",
    "prp-fracture": "prp", "prp-trauma": "prp", "prp-foot-ankle": "prp", "prp-preparation-systems": "prp",
    "novabone-putty": "novabone", "bioactive-glass-s53p4": "bonalive", "prodense": "pro-dense", "vitoss-tcp": "vitoss",
    "chronos-tcp": "chronos", "ria-reamer-irrigator-aspirator": "ria", "pearlmatrix-p15l": "pearlmatrix",
    "nb1-nell-1": "nb1", "osteogrow-c": "osteogrow", "amplex-b2a": "amplex", "norian-srs": "norian",
    "op1-implant": "op-1", "amniotic-foot-ankle": "amniotic-orthopedic-products",
}
# Application ids referenced by products but defined under another id (or not at all -> None drops the reference)
APP_ALIASES = {
    "general-nonunion": "general-long-bone-nonunion", "tibial-shaft-fracture": "tibial-shaft-open",
    "lumbar-tlif": "lumbar-tlif-plif", "hip-fracture": "femoral-neck-fracture", "knee-oa-adjacent": None,
}
# Post-merge overrides where the first slice's value is not the right one
STATUS_OVERRIDES = {"pearlmatrix": "emerging"}

REGIONS = {"spine","pelvis-hip","femur-knee","tibia","ankle-foot","shoulder-humerus","forearm-wrist-hand","skull-cmf","general"}
CATS = {"rhBMP","rhPDGF","peptide","DBM","synthetic-ceramic","bioactive-glass","calcium-phosphate-cement","calcium-sulfate","cellular-allograft","structural-allograft","amniotic","PRP","BMAC","MSC","exosome","pharmacologic","other"}
STATUS = {"established","emerging","investigational","off-market","withdrawn"}
TIERS = {"established","emerging","investigational"}
GRADES = {"I","II","III","IV","V"}

def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

def load(name):
    p = os.path.join(RES, f"{name}.json")
    if not os.path.exists(p):
        return None, f"missing {p}"
    with open(p) as f:
        try:
            return json.load(f), None
        except json.JSONDecodeError as e:
            return None, f"{name}.json invalid JSON: {e}"

def merge_product(a, b):
    for k, v in b.items():
        if k in ("applications", "evidence", "sources"):
            continue
        if k not in a or a[k] in (None, "", [], {}):
            a[k] = v
        elif isinstance(v, dict) and isinstance(a[k], dict):
            for kk, vv in v.items():
                if kk not in a[k] or a[k][kk] in (None, "", [], {}):
                    a[k][kk] = vv
    seen = {x.get("application_id") for x in a.get("applications", [])}
    for x in b.get("applications", []):
        if x.get("application_id") not in seen:
            a.setdefault("applications", []).append(x); seen.add(x.get("application_id"))
    seen = {x.get("ref") for x in a.get("evidence", [])}
    for x in b.get("evidence", []):
        if x.get("ref") not in seen:
            a.setdefault("evidence", []).append(x); seen.add(x.get("ref"))
    for s in b.get("sources", []):
        if s not in a.setdefault("sources", []):
            a["sources"].append(s)
    return a

def main():
    report = ["# Merge report", ""]
    apps, prods = {}, {}
    app_src, prod_src = collections.defaultdict(list), collections.defaultdict(list)
    for name in SLICES:
        data, err = load(name)
        if err:
            report.append(f"- WARNING: {err}"); continue
        for a in data.get("applications", []):
            aid = a.get("id") or slug(a.get("name", ""))
            a["id"] = aid
            app_src[aid].append(name)
            if aid in apps:
                # keep first, but union classifications/sources
                for k in ("classifications", "sources"):
                    for x in a.get(k, []):
                        if x not in apps[aid].setdefault(k, []):
                            apps[aid][k].append(x)
            else:
                apps[aid] = a
        for p in data.get("products", []):
            pid = p.get("id") or slug(p.get("name", ""))
            pid = PRODUCT_ALIASES.get(pid, pid)
            p["id"] = pid
            fixed = []
            for x in p.get("applications", []):
                aid2 = APP_ALIASES.get(x.get("application_id"), x.get("application_id"))
                if aid2 is None: continue
                x["application_id"] = aid2; fixed.append(x)
            p["applications"] = fixed
            for e in p.get("evidence", []):
                e["applications"] = [APP_ALIASES.get(a, a) for a in e.get("applications", []) if APP_ALIASES.get(a, a)]
            prod_src[pid].append(name)
            prods[pid] = merge_product(prods[pid], p) if pid in prods else p
        report.append(f"- {name}: {len(data.get('applications', []))} applications, {len(data.get('products', []))} products")

    ov_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fda_overrides.json")
    if os.path.exists(ov_path):
        for pid, ov in json.load(open(ov_path)).items():
            if pid.startswith("_") or pid not in prods: continue
            reg = prods[pid].setdefault("regulatory", {})
            old = str(reg.get("reference") or "").strip()
            reg["reference"] = ov["reference"] if not old or old.lower() in ("unknown", "unverified", "not found", "none") else old + "; openFDA: " + ov["reference"]
            reg["openfda_verified"] = "2026-10-21"
            reg.pop("unverified", None)
    for pid, st in STATUS_OVERRIDES.items():
        if pid in prods: prods[pid]["status"] = st
    # validation
    warn = []
    for aid, a in apps.items():
        if a.get("region") not in REGIONS: warn.append(f"application {aid}: region {a.get('region')!r} not in schema")
        for k in ("name", "type", "why_biologic"):
            if not a.get(k): warn.append(f"application {aid}: missing {k}")
    grade_dist = collections.Counter(); tier_dist = collections.Counter(); status_dist = collections.Counter(); cat_dist = collections.Counter()
    unknown_refs = collections.Counter()
    for pid, p in prods.items():
        if p.get("category") not in CATS: warn.append(f"product {pid}: category {p.get('category')!r} not in schema")
        if p.get("status") not in STATUS: warn.append(f"product {pid}: status {p.get('status')!r} not in schema")
        status_dist[p.get("status")] += 1; cat_dist[p.get("category")] += 1
        if not p.get("company"): warn.append(f"product {pid}: missing company")
        if not p.get("evidence"): warn.append(f"product {pid}: no evidence entries")
        for x in p.get("applications", []):
            if x.get("application_id") not in apps: unknown_refs[x.get("application_id")] += 1
            if x.get("tier") not in TIERS: warn.append(f"product {pid}/{x.get('application_id')}: tier {x.get('tier')!r}")
            if x.get("evidence_grade") not in GRADES: warn.append(f"product {pid}/{x.get('application_id')}: evidence_grade {x.get('evidence_grade')!r}")
            grade_dist[x.get("evidence_grade")] += 1; tier_dist[x.get("tier")] += 1
        for e in p.get("evidence", []):
            if not re.match(r"^(PMID:\d+|NCT\d{8}|DOI:.+|10\.\d+/.+|https?://.+|EudraCT.+|ISRCTN.+)$", str(e.get("ref", ""))):
                warn.append(f"product {pid}: evidence ref {e.get('ref')!r} is not PMID/NCT/DOI")

    dup_apps = {k: v for k, v in app_src.items() if len(v) > 1}
    dup_prods = {k: v for k, v in prod_src.items() if len(v) > 1}
    report += ["", f"**Merged:** {len(apps)} applications, {len(prods)} products", "",
               "## Products appearing in more than one slice (merged)"] + [f"- {k}: {', '.join(v)}" for k, v in sorted(dup_prods.items())]
    report += ["", "## Applications defined in more than one slice (first kept)"] + [f"- {k}: {', '.join(v)}" for k, v in sorted(dup_apps.items())]
    report += ["", "## Product references to applications that do not exist"] + [f"- {k} ({n} refs)" for k, n in unknown_refs.most_common()]
    report += ["", "## Distributions",
               f"- status: {dict(status_dist)}", f"- category: {dict(cat_dist)}", f"- tier (per product-application): {dict(tier_dist)}",
               f"- evidence grade (per product-application): {dict(sorted(grade_dist.items(), key=lambda x: str(x[0])))}"]
    report += ["", f"## Warnings ({len(warn)})"] + [f"- {w}" for w in warn]

    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, "applications.json"), "w") as f:
        json.dump(sorted(apps.values(), key=lambda a: (a.get("region",""), a.get("subregion",""), a.get("name",""))), f, indent=2)
    with open(os.path.join(OUT, "products.json"), "w") as f:
        json.dump(sorted(prods.values(), key=lambda p: (p.get("status",""), p.get("category",""), p.get("name",""))), f, indent=2)
    with open(os.path.join(OUT, "merge-report.md"), "w") as f:
        f.write("\n".join(report) + "\n")
    print("\n".join(report[:12])); print(f"... {len(warn)} warnings; see data/merge-report.md")

if __name__ == "__main__":
    main()
