#!/usr/bin/env python3
"""Apply a pass patch file to the research JSON files.
Usage: /usr/bin/python3 -I build/apply_patch.py research/pass1-patch.json
Patch object: {file, kind (application|product|payer_policy|reimbursement|company), id, set{dotted.path: value},
append_applications[], append_sources[], clear_unverified, challenge, new_record}"""
import json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RES = os.path.join(ROOT, "research")
KIND_KEY = {"application": "applications", "product": "products", "payer_policy": "payer_policies", "reimbursement": "reimbursement", "company": "companies"}

def setpath(obj, path, value):
    parts = path.split("."); cur = obj
    for p in parts[:-1]:
        if isinstance(cur, list): cur = cur[int(p)]
        else: cur = cur.setdefault(p, {})
    if isinstance(cur, list): cur[int(parts[-1])] = value
    else: cur[parts[-1]] = value

def main(patch_path):
    patches = json.load(open(patch_path))
    cache, log = {}, []
    for i, pt in enumerate(patches):
        fname = pt.get("file") or "bd-lens.json"
        if fname not in cache:
            cache[fname] = json.load(open(os.path.join(RES, fname)))
        data = cache[fname]
        key = KIND_KEY[pt.get("kind", "product")]
        rows = data.setdefault(key, [])
        rec = None
        if pt.get("id"):
            rec = next((r for r in rows if r.get("id") == pt["id"]), None)
        elif pt.get("match"):
            rec = next((r for r in rows if all(str(r.get(k, "")).lower() == str(v).lower() for k, v in pt["match"].items())), None)
            if rec is None and pt.get("new_record"):
                rows.append(pt["new_record"]); rec = pt["new_record"]; log.append(f"{i}: added {key} by match {pt['match']}"); pt = dict(pt, new_record=None)
            elif rec is not None and pt.get("new_record"):
                rows[rows.index(rec)] = pt["new_record"]; rec = pt["new_record"]; log.append(f"{i}: replaced {key} by match {pt['match']}"); pt = dict(pt, new_record=None)
        if pt.get("new_record"):
            if rec:
                rec.update(pt["new_record"]); log.append(f"{i}: updated existing {key} {pt['id']} from new_record")
            else:
                rows.append(pt["new_record"]); rec = pt["new_record"]; log.append(f"{i}: added {key} {pt.get('id') or pt['new_record'].get('id')}")
        if rec is None:
            log.append(f"{i}: SKIPPED, no {key} with id {pt.get('id')} in {fname}"); continue
        for path, val in (pt.get("set") or {}).items():
            setpath(rec, path, val)
        for a in pt.get("append_applications") or []:
            apps = rec.setdefault("applications", [])
            if not any(x.get("application_id") == a.get("application_id") for x in apps): apps.append(a)
        for e in pt.get("append_evidence") or []:
            ev = rec.setdefault("evidence", [])
            if not any(x.get("ref") == e.get("ref") for x in ev): ev.append(e)
        for u in pt.get("application_updates") or []:
            for x in rec.get("applications", []):
                if x.get("application_id") == u.get("application_id"):
                    for k, v in u.items():
                        if k != "application_id": x[k] = v
        for s in pt.get("append_sources") or []:
            if s not in rec.setdefault("sources", []): rec["sources"].append(s)
        if pt.get("clear_unverified"):
            rec.pop("unverified", None); rec.get("regulatory", {}).pop("unverified", None) if isinstance(rec.get("regulatory"), dict) else None
        if "challenge" in pt:
            if pt["challenge"]: rec["challenge"] = pt["challenge"]
            else: rec.pop("challenge", None)
        rec["last_reviewed"] = "2026-10-22"
        log.append(f"{i}: patched {key} {rec.get('id')} in {fname}")
    for fname, data in cache.items():
        json.dump(data, open(os.path.join(RES, fname), "w"), indent=2)
    print("\n".join(log)); print(f"{len(patches)} patches, {len(cache)} files written")

if __name__ == "__main__":
    main(sys.argv[1])
