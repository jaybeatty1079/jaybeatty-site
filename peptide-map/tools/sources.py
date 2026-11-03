#!/usr/bin/env python3
"""Free regulatory connectors for the peptide tool. Read-only. No scraping: these are the agencies' own APIs.

  python3 peptide-map/tools/sources.py check          # one call to each, writes data/connectors-check.md
  python3 peptide-map/tools/sources.py fr "enforcement discretion peptide"
  python3 peptide-map/tools/sources.py docket HHS-OASH-2026-0496
  python3 peptide-map/tools/sources.py shortage semaglutide
  python3 peptide-map/tools/sources.py court "Outsourcing Facilities Association v. FDA"
  python3 peptide-map/tools/sources.py govinfo "503A bulk drug substances"

Keys (all free): Regulations.gov and GovInfo use an api.data.gov key; DEMO_KEY works for a few calls an hour.
CourtListener's search API needs a free account token (COURTLISTENER_TOKEN). openFDA answers 404 when nothing matches, which
the shortage call reports as an empty list (no current shortage record).
Get a real one at https://api.data.gov/signup/ and export DATA_GOV_KEY=... . openFDA, the Federal Register and
CourtListener need no key for light use (an openFDA key raises the limit: https://open.fda.gov/apis/authentication/).
"""
import json, os, sys, urllib.parse, urllib.request, datetime
KEY = os.environ.get('DATA_GOV_KEY', 'DEMO_KEY')
UA = {'User-Agent': 'peptide-tool/1.0 (jaybeatty.com; research, read-only)'}

CL_TOKEN = os.environ.get('COURTLISTENER_TOKEN', '')  # free account at courtlistener.com; the search API needs it since 2025

def get(url, params=None, headers=None, empty_on_404=False):
    if params: url += ('&' if '?' in url else '?') + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={**UA, **(headers or {})})
    try:
        with urllib.request.urlopen(req, timeout=30) as r: return json.load(r)
    except urllib.error.HTTPError as e:
        if e.code == 404 and empty_on_404: return {}  # openFDA answers 404 when nothing matches: that is "no records", not an error
        raise

# Federal Register: notices, rules, the HHS policy, FDA list proposals. No key.
def fr(query, n=5):
    j = get('https://www.federalregister.gov/api/v1/documents.json', {'conditions[term]': query, 'order': 'newest', 'per_page': n})
    return [{'date': d['publication_date'], 'title': d['title'], 'agency': ', '.join(a['name'] for a in d.get('agencies', [])), 'docnum': d['document_number'], 'url': d['html_url']} for d in j.get('results', [])]

# Regulations.gov: dockets and their comments (the HHS peptide docket, the FDA advisory-committee docket). api.data.gov key.
def docket(docket_id):
    j = get('https://api.regulations.gov/v4/documents', {'filter[docketId]': docket_id, 'sort': '-postedDate', 'page[size]': 10, 'api_key': KEY})
    return [{'posted': d['attributes'].get('postedDate', '')[:10], 'type': d['attributes'].get('documentType'), 'title': d['attributes'].get('title'), 'id': d['id'], 'comment_end': d['attributes'].get('commentEndDate')} for d in j.get('data', [])]

def comments_count(docket_id):
    j = get('https://api.regulations.gov/v4/comments', {'filter[docketId]': docket_id, 'page[size]': 5, 'api_key': KEY})
    return j.get('meta', {}).get('totalElements')

# openFDA: drug shortages, enforcement reports (recalls), NDC. No key for light use.
def shortage(generic):
    j = get('https://api.fda.gov/drug/shortages.json', {'search': 'generic_name:"%s"' % generic, 'limit': 10}, empty_on_404=True)
    return [{'name': r.get('generic_name'), 'status': r.get('status'), 'updated': r.get('update_date'), 'reason': (r.get('shortage_reason') or '')[:120]} for r in j.get('results', [])]

def recalls(term, n=5):
    j = get('https://api.fda.gov/drug/enforcement.json', {'search': 'product_description:"%s"' % term, 'sort': 'report_date:desc', 'limit': n}, empty_on_404=True)
    return [{'date': r.get('report_date'), 'firm': r.get('recalling_firm'), 'reason': (r.get('reason_for_recall') or '')[:140], 'class': r.get('classification')} for r in j.get('results', [])]

# CourtListener (RECAP): dockets and opinions, most PACER filings mirrored free. No key for search.
def court(query, n=5):
    if not CL_TOKEN: raise RuntimeError('CourtListener needs a free API token: sign up at courtlistener.com, then export COURTLISTENER_TOKEN=...')
    j = get('https://www.courtlistener.com/api/rest/v4/search/', {'q': query, 'type': 'r', 'order_by': 'dateFiled desc'}, headers={'Authorization': 'Token ' + CL_TOKEN})
    out = []
    for d in j.get('results', [])[:n]:
        out.append({'filed': d.get('dateFiled'), 'case': d.get('caseName'), 'court': d.get('court'), 'docket': d.get('docketNumber'), 'url': 'https://www.courtlistener.com' + (d.get('docket_absolute_url') or '')})
    return out

# GovInfo: statutes, the Federal Register and CFR as official text. api.data.gov key.
def govinfo(query, n=5):
    body = json.dumps({'query': query, 'pageSize': n, 'offsetMark': '*', 'sorts': [{'field': 'publishdate', 'sortOrder': 'DESC'}]}).encode()
    req = urllib.request.Request('https://api.govinfo.gov/search?api_key=' + KEY, data=body, headers={**UA, 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=30) as r: j = json.load(r)
    return [{'date': d.get('dateIssued'), 'title': d.get('title'), 'collection': d.get('collectionCode'), 'id': d.get('packageId'), 'url': d.get('download', {}).get('pdfLink') or ''} for d in j.get('results', [])]

def check():
    rows = []
    for name, fn in [('Federal Register: "enforcement discretion peptide"', lambda: fr('enforcement discretion peptide 503A', 3)),
                     ('Regulations.gov: docket HHS-OASH-2026-0496', lambda: docket('HHS-OASH-2026-0496')),
                     ('Regulations.gov: comments on HHS-OASH-2026-0496', lambda: comments_count('HHS-OASH-2026-0496')),
                     ('openFDA: shortage status, semaglutide', lambda: shortage('semaglutide')),
                     ('openFDA: shortage status, tirzepatide', lambda: shortage('tirzepatide')),
                     ('CourtListener: OFA v. FDA', lambda: court('"Outsourcing Facilities Association" FDA', 4)),
                     ('GovInfo: 503A bulk drug substances', lambda: govinfo('"bulk drug substances" 503A', 3))]:
        try: rows.append((name, 'ok', fn()))
        except Exception as e: rows.append((name, 'failed', str(e)[:200]))
    out = ['# Connector check, %s' % datetime.date.today(), '', 'Key in use: %s' % ('DEMO_KEY (rate-limited; get a free key at api.data.gov)' if KEY == 'DEMO_KEY' else 'DATA_GOV_KEY set'), '']
    for name, status, res in rows:
        out.append('## %s — %s' % (name, status)); out.append(''); out.append('```'); out.append(json.dumps(res, indent=1)[:2500]); out.append('```'); out.append('')
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'connectors-check.md')
    open(path, 'w').write('\n'.join(out)); print('\n'.join('%s: %s' % (n, s) for n, s, _ in rows)); print('written', os.path.normpath(path))

if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'check'
    arg = ' '.join(sys.argv[2:])
    if cmd == 'check': check()
    else: print(json.dumps({'fr': fr, 'docket': docket, 'shortage': shortage, 'recalls': recalls, 'court': court, 'govinfo': govinfo}[cmd](arg), indent=1))
