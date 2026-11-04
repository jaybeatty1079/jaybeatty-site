# Fills only the missing OpenAlex counts (quoted-phrase search) once OpenAlex's free daily budget resets at midnight UTC, then run build.py: python3 peptide-map/tools/refill_openalex.py && python3 peptide-map/build.py
import json, os, sys, time
T = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, T)
from evidence import openalex
for f in ['compounds.json', 'named-evidence.json']:
    p = os.path.join(T, '..', 'data', f); rows = json.load(open(p))
    for r in rows:
        if r.get('openalex') is None:
            r['openalex'] = openalex(r['name'].split(' (')[0], r.get('synonyms', [])); print(f, r['id'], r['openalex']); time.sleep(1)
    json.dump(rows, open(p, 'w'), indent=1)
