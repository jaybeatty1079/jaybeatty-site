#!/usr/bin/env python3
"""Assemble the Biologics Atlas page from app/template.html + app/app.js + app/skeleton.svg + data/*.json + research/bd-lens.json.

Usage: /usr/bin/python3 -I build/assemble.py [--out /path/to/index.html]
Default output: /Users/jaybeatty/Claude/jaybeatty-site/biologics-atlas/index.html, plus a copy in app/dist/.
Also mirrors SCHEMA.md, RESEARCH_SUMMARY.md, data/, research/ and build/ into the site folder so GitHub holds the data.
Internal reviewer notes ("challenge" fields) are stripped from the embedded data; "unverified" flags are kept."""
import json, os, re, shutil, sys, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "/Users/jaybeatty/Claude/jaybeatty-site/biologics-atlas"
out = SITE + "/index.html"
if "--out" in sys.argv: out = sys.argv[sys.argv.index("--out") + 1]

def strip(o):
    if isinstance(o, dict): return {k: strip(v) for k, v in o.items() if k not in ("challenge", "verification_note")}
    if isinstance(o, list): return [strip(x) for x in o]
    return o

apps = strip(json.load(open(os.path.join(ROOT, "data/applications.json"))))
prods = strip(json.load(open(os.path.join(ROOT, "data/products.json"))))
bd_raw = json.load(open(os.path.join(ROOT, "research/bd-lens.json")))
bd = {k: strip(bd_raw.get(k, [])) for k in ("companies", "reimbursement", "payer_policies")}

# regulatory primer: summary paragraphs (section 11) and timeline (section 10)
primer = open(os.path.join(ROOT, "research/regulatory-primer.md")).read()
summary = []
m = re.search(r"## 11\..*?\n(.*?)(?:\n## |\Z)", primer, re.S)
if m:
    for para in re.split(r"\n\s*\n", m.group(1).strip()):
        para = para.strip()
        if para and not para.startswith("|") and not para.startswith("#"): summary.append(re.sub(r"\s+", " ", para))
timeline = []
m = re.search(r"## 10\..*?\n(.*?)(?:\n## |\Z)", primer, re.S)
if m:
    for line in m.group(1).splitlines():
        if line.startswith("|") and not line.startswith("| Date") and not line.startswith("|---"):
            cells = [c.strip() for c in line.strip("|").split("|")]
            if len(cells) >= 2: timeline.append({"date": cells[0], "action": cells[1], "source": cells[2] if len(cells) > 2 else ""})

reviewed = max([p.get("last_reviewed", "") for p in prods] + [a.get("last_reviewed", "") for a in apps] + ["2026-10-21"])
meta = {
    "reviewed": reviewed,
    "reg_summary": summary,
    "timeline": timeline,
    "changelog": [
        "2026-10-21: first sweep. Seven research passes across spine, hip and femur, tibia and knee, foot and ankle, upper extremity, the investigational and regulatory landscape, and the business layer. 62 applications, 86 products, 290 citations; every CDRH number checked against openFDA.",
        "2026-10-22: gap passes. SI-joint fusion products added, ownership and distribution fields confirmed from openFDA, SEC filings and company pages, blocked pages read directly. Corrections: map3 withdrawn 2018, Norian still sold, Optium DBM is LifeNet's, PearlMatrix PMA P240001, Infuse TLIF supplement S096, level-based fusion DRGs date from FY2025.",
        f"{reviewed}: data version embedded in this page." if reviewed > "2026-10-22" else "2026-10-22: skull and craniomaxillofacial region added.",
    ],
}
data = {"applications": apps, "products": prods, "bd": bd, "meta": meta}
data_js = json.dumps(data, separators=(",", ":"), ensure_ascii=False).replace("</", "<\\/")

tpl = open(os.path.join(ROOT, "app/template.html")).read()
app = open(os.path.join(ROOT, "app/app.js")).read()
svg = open(os.path.join(ROOT, "app/skeleton.svg")).read()
viewer = open(os.path.join(ROOT, "app/viewer3d.js")).read()
vcfg_path = os.path.join(ROOT, "app/viewer-config.json")
vcfg = open(vcfg_path).read().strip() if os.path.exists(vcfg_path) else "{}"
credit = json.load(open(vcfg_path)).get("credit_html", "") if os.path.exists(vcfg_path) else ""
html = tpl.replace("__SKELETON__", svg).replace("__DATA__", data_js).replace("__APP__", app).replace("__VIEWER__", viewer).replace("__VIEWER_CONFIG__", vcfg).replace("__CREDIT__", credit)

os.makedirs(os.path.dirname(out), exist_ok=True)
open(out, "w").write(html)
os.makedirs(os.path.join(ROOT, "app/dist"), exist_ok=True)
open(os.path.join(ROOT, "app/dist/index.html"), "w").write(html)

# mirror the data and notes into the site repo folder so GitHub holds them
if out.startswith(SITE):
    for name in ("SCHEMA.md", "RESEARCH_SUMMARY.md"):
        shutil.copy(os.path.join(ROOT, name), os.path.join(SITE, name))
    for sub in ("data", "research", "build"):
        dst = os.path.join(SITE, sub); os.makedirs(dst, exist_ok=True)
        for f in os.listdir(os.path.join(ROOT, sub)):
            if f.endswith((".json", ".md", ".py")) and not f.startswith("."):
                shutil.copy(os.path.join(ROOT, sub, f), os.path.join(dst, f))
    for f in ("skeleton.glb",):
        src = os.path.join(ROOT, "app", f)
        if os.path.exists(src): shutil.copy(src, os.path.join(SITE, f))
    for f in ("template.html", "app.js", "skeleton.svg", "viewer3d.js", "viewer-config.json"):
        if not os.path.exists(os.path.join(ROOT, "app", f)): continue
        os.makedirs(os.path.join(SITE, "app"), exist_ok=True); shutil.copy(os.path.join(ROOT, "app", f), os.path.join(SITE, "app", f))

# artifact variant: no document wrapper, absolute links to the live site, no favicon link
body = re.search(r"<body>(.*)</body>", html, re.S).group(1)
style = re.search(r"<style>.*?</style>", html, re.S).group(0)
fonts = re.search(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^>]*>', html).group(0)
# the artifact viewer refuses pages over ~768 KB, so the preview drops per-record source lists (the site page keeps them)
def drop_sources(o):
    if isinstance(o, dict): return {k: drop_sources(v) for k, v in o.items() if k != "sources"}
    if isinstance(o, list): return [drop_sources(x) for x in o]
    return o
data_art = json.dumps(drop_sources(data), separators=(",", ":"), ensure_ascii=False).replace("</", "<\\/")
body = body.replace(data_js, data_art)
art = "<title>Biologics Atlas</title>\n" + fonts + "\n" + style + "\n" + body
art = art.replace('href="/', 'href="https://jaybeatty.com/')
open(os.path.join(ROOT, "app/dist/artifact.html"), "w").write(art)
print(f"wrote {out}: {len(html)//1024} KB (data {len(data_js)//1024} KB, {len(apps)} applications, {len(prods)} products, {len(timeline)} timeline rows, {len(summary)} summary paragraphs)")
