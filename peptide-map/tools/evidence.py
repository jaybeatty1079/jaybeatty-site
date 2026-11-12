#!/usr/bin/env python3
"""Grades the human evidence behind each compound in tools/compounds.txt from public sources, and links the papers.

  python3 peptide-map/tools/evidence.py            # all compounds -> peptide-map/data/compounds.json
  python3 peptide-map/tools/evidence.py selank     # one, printed

Sources, all free and keyless at this rate: PubMed E-utilities (human studies, clinical trials, top papers),
ClinicalTrials.gov API v2 (registered trials), openFDA drug labels (an approved product in the US), Europe PMC
(the European index, with preprints) and OpenAlex (journals in every language, with a count of non-English works,
which is the literature PubMed tends to miss: Russian, Chinese, Japanese, Korean journals).
Grades: A approved product; B human trials (3 or more trials on PubMed or ClinicalTrials.gov); C early human work
(3 or more human studies on PubMed); D laboratory and animal work only. The grade is a count, not a verdict.
"""
import json, os, sys, time, urllib.parse, urllib.request, datetime, re
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, '..', 'data', 'compounds.json')
UA = {'User-Agent': 'peptide-ride/1.0 (jaybeatty.com; research)'}
EU = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/'

def get(url, params=None, empty_on_404=False):
    if params: url += ('&' if '?' in url else '?') + urllib.parse.urlencode(params)
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r: return json.load(r)
    except urllib.error.HTTPError as e:
        if e.code == 404 and empty_on_404: return {}
        raise

def terms(name, syn):
    names = [name] + [s for s in syn if s]
    return '(' + ' OR '.join('"%s"[tiab]' % n for n in names) + ')'

def phrases(name, syn):
    # the same names as terms(), each a quoted phrase joined with OR: unquoted, OpenAlex splits "MOTS-c" into words and counts noise
    return ' OR '.join('"%s"' % n for n in [name] + [s for s in syn if s])

def pubmed_count(term):
    j = get(EU + 'esearch.fcgi', {'db': 'pubmed', 'term': term, 'retmode': 'json', 'retmax': 0}); time.sleep(.4)
    return int(j['esearchresult']['count'])

def pubmed_top(term, n=4):
    j = get(EU + 'esearch.fcgi', {'db': 'pubmed', 'term': term, 'retmode': 'json', 'retmax': n, 'sort': 'relevance'}); time.sleep(.4)
    ids = j['esearchresult'].get('idlist', [])
    if not ids: return []
    s = get(EU + 'esummary.fcgi', {'db': 'pubmed', 'id': ','.join(ids), 'retmode': 'json'}); time.sleep(.4)
    out = []
    for i in ids:
        d = s['result'].get(i, {})
        out.append({'pmid': i, 'title': d.get('title', '').rstrip('.'), 'year': (d.get('pubdate') or '')[:4], 'journal': d.get('source', ''), 'url': 'https://pubmed.ncbi.nlm.nih.gov/%s/' % i})
    return out

def trials_count(name):
    try:
        j = get('https://clinicaltrials.gov/api/v2/studies', {'query.intr': name, 'countTotal': 'true', 'pageSize': 1}); time.sleep(.3)
        return int(j.get('totalCount', 0))
    except Exception: return None

def approved(name, syn):
    for n in [name] + [s for s in syn if s]:
        q = 'openfda.generic_name:"%s" OR openfda.brand_name:"%s"' % (n, n)
        j = get('https://api.fda.gov/drug/label.json', {'search': q, 'limit': 1}, empty_on_404=True); time.sleep(.3)
        r = (j.get('results') or [{}])[0].get('openfda', {})
        if r.get('brand_name'): return {'brand': r['brand_name'][0], 'generic': (r.get('generic_name') or [n])[0]}
    return None

def europepmc_count(name, syn=()):
    try:
        j = get('https://www.ebi.ac.uk/europepmc/webservices/rest/search', {'query': phrases(name, syn), 'format': 'json', 'resultType': 'lite', 'pageSize': 1}); time.sleep(.3)
        return int(j.get('hitCount', 0))
    except Exception: return None

def openalex(name, syn=()):
    # all works mentioning the compound, and how many are not in English: a measure of the literature PubMed misses
    try:
        j = get('https://api.openalex.org/works', {'search': phrases(name, syn), 'per-page': 1}); time.sleep(.3)
        total = int(j.get('meta', {}).get('count', 0))
        k = get('https://api.openalex.org/works', {'search': phrases(name, syn), 'filter': 'language:!en', 'per-page': 1}); time.sleep(.3)
        return {'all': total, 'non_english': int(k.get('meta', {}).get('count', 0))}
    except Exception: return None

def grade(row):
    if row['approved']: return 'A'
    if (row['trials_pubmed'] or 0) >= 3 or (row['trials_ctgov'] or 0) >= 3: return 'B'
    if (row['human_pubmed'] or 0) >= 3: return 'C'
    return 'D'

def grade_one(cid, name, aka, about, syn):
    key = name.split(' (')[0]
    t = terms(key, syn)
    row = {'id': cid, 'name': name, 'aka': aka, 'about': about, 'synonyms': syn}
    # each source on its own, so one failing index never loses the row
    def safe(k, fn, default):
        try: row[k] = fn()
        except Exception as e: row[k] = default; row.setdefault('partial', []).append('%s: %s' % (k, str(e)[:60]))
    safe('human_pubmed', lambda: pubmed_count(t + ' AND humans[mh]'), None)
    safe('trials_pubmed', lambda: pubmed_count(t + ' AND (clinical trial[pt] OR randomized controlled trial[pt])'), None)
    safe('all_pubmed', lambda: pubmed_count(t), None)
    safe('papers', lambda: pubmed_top(t + ' AND humans[mh]') or pubmed_top(t), [])
    safe('trials_ctgov', lambda: trials_count(key), None)
    safe('approved', lambda: approved(key, syn), None)
    safe('europepmc', lambda: europepmc_count(key, syn), None)
    safe('openalex', lambda: openalex(key, syn), None)
    row['grade'] = grade(row); row['graded_on'] = str(datetime.date.today())
    print('%-22s %s  human %5s  trials %4s/%4s  all %6s  %s' % (cid, row['grade'], row['human_pubmed'], row['trials_pubmed'], row['trials_ctgov'], row['all_pubmed'], (row['approved'] or {}).get('brand', '')))
    return row

def run(only=None):
    rows = []
    for line in open(os.path.join(HERE, 'compounds.txt')):
        line = line.strip()
        if not line or line.startswith('#'): continue
        cid, name, aka, about, syn = (line.split('|') + [''])[:5]
        if only and cid != only: continue
        rows.append(grade_one(cid, name, aka, about, [s.strip() for s in syn.split(';') if s.strip()]))
    if only: print(json.dumps(rows, indent=1)); return
    json.dump(rows, open(OUT, 'w'), indent=1); print('wrote', os.path.normpath(OUT), len(rows), 'compounds')

if __name__ == '__main__': run(sys.argv[1] if len(sys.argv) > 1 else None)
