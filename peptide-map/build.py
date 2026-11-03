#!/usr/bin/env python3
"""Builds peptide-map/index.html from template.html, the vault's research CSVs and the two base maps.
Run: python3 peptide-map/build.py  (from the site repo root). The page is one file with the data inline."""
import csv, json, re, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
VAULT = '/Users/jaybeatty/Desktop/Claude outputs/Pharma - peptide map'
AS_OF = '2026-11-02'
FDA_LIST_URL = 'https://www.fda.gov/drugs/human-drug-compounding/registered-outsourcing-facilities'

def first_url(s):
    m = re.search(r'https?://[^\s;,)]+', s or '')
    return m.group(0) if m else ''

# 503B facilities
fac = []
for r in csv.DictReader(open(os.path.join(VAULT, 'data/503b-facilities.csv'))):
    n = r['notes'].lower()
    flags = []
    if 'not yet inspected' in n: flags.append('uninspected')
    if 'prior non-compliance' in n: flags.append('prior')
    if 'warning letter' in n: flags.append('warning')
    if 'from bulk: no' in n: flags.append('nobulk')
    fac.append({'name': r['name'], 'city': r['city'], 'state': r['state'], 'reg': r['registration_date'],
                'lat': float(r['lat']) if r['lat'] else None, 'lon': float(r['lon']) if r['lon'] else None,
                'flags': flags, 'note': r['notes']})

# the federal register, whole, and the timeline picked from it by date
reg = list(csv.DictReader(open(os.path.join(VAULT, 'data/register.csv'))))
for r in reg: r['url'] = first_url(r['source_url'])
def row(date_prefix, body_prefix=''):
    for r in reg:
        if r['date_in_effect'].startswith(date_prefix) and r['body'].startswith(body_prefix): return r
    sys.exit('register row not found: ' + date_prefix + ' ' + body_prefix)

TIMELINE = [  # (date, label, register row, kind) kind: rule | list | glp1 | enforce | hhs | next
    ('2013-11-27', 'Drug Quality and Security Act creates 503B outsourcing facilities', row('2013-11-27'), 'rule'),
    ('2023-09-29', 'FDA puts BPC-157, ipamorelin, kisspeptin-10, GHRP-2/6 and others in Category 2', row('2023-09-29'), 'list'),
    ('2024-10-02', 'Tirzepatide shortage declared resolved', row('2024-10-02'), 'glp1'),
    ('2024-10-29', 'Advisory committee votes against ipamorelin, kisspeptin-10, ibutamoren for 503A', row('2024-10-29'), 'list'),
    ('2024-12-04', 'Committee votes against CJC-1295, AOD-9604, thymosin alpha-1', row('2024-12-04'), 'list'),
    ('2024-12-10', 'First warning letters to research-use-only peptide sellers', row('2024-12-10'), 'enforce'),
    ('2025-01-07', 'Interim policy: category system frozen for new nominations', row('2025-01-07'), 'rule'),
    ('2025-02-21', 'Semaglutide shortage declared resolved; compounding windows close by May', row('2025-02-21'), 'glp1'),
    ('2025-09-05', 'Green List import alert 66-80 for GLP-1 APIs', row('2025-09-05'), 'enforce'),
    ('2026-02-06', 'FDA: all available tools against mass-marketed compounded GLP-1s', row('2026-02-06'), 'glp1'),
    ('2026-03-31', 'CBP Cincinnati: 300 cartons, 5,000 peptide shipments from a China shipper', row('2026-03-31', 'CBP'), 'enforce'),
    ('2026-04-22', 'Nominations withdrawn: 17 peptides leave Category 2, not added to Category 1', row('2026-04-22 (FDA'), 'list'),
    ('2026-05-01', 'FDA proposes to keep semaglutide, tirzepatide, liraglutide off the 503B list', row('2026-05-01'), 'glp1'),
    ('2026-07-23', 'Advisory committee recommends six of seven peptides, against FDA staff', row('2026-07-23'), 'list'),
    ('2026-08-24', 'Warning letters to NuScience and Royal Peptides on GLP-1 "research" sales', row('2026-08-24'), 'enforce'),
    ('2026-08-27', 'Fifth Circuit affirms FDA in both GLP-1 shortage cases', row('2026-08-27'), 'glp1'),
    ('2026-10-30', 'HHS publishes draft enforcement-discretion policy for six peptides, 503A only', row('2026-10-30 (announced'), 'hhs'),
]
timeline = [{'date': d, 'label': l, 'url': r['url'], 'detail': r['what_it_decides'], 'kind': k} for d, l, r, k in TIMELINE]
timeline += [
    {'date': '2026-11-13', 'label': 'About: comments close on the HHS draft policy', 'url': row('2026-10-30 (announced')['url'], 'detail': 'The Federal Register notice calls the policy a draft and sets a short comment window.', 'kind': 'next'},
    {'date': '2027-02-28', 'label': 'By end of February: next advisory committee meeting (GHK-Cu named by FDA)', 'url': row('2026-05-14')['url'], 'detail': 'FDA names GHK-Cu; other substances reported by one law firm are unconfirmed.', 'kind': 'next'},
]

# compound status, two layers, from where-we-are.md (anchor dates in the register)
compounds = [
    {'name': 'BPC-157, TB-500, MOTS-c, KPV, epitalon, semax', 'a': 'Not in any category since April 2026; committee recommended July 2026', 'hhs': 'Covered by the draft policy, with conditions', 'b': 'Not covered', 'grade': 'tol'},
    {'name': 'Ipamorelin', 'a': 'Not tolerated; committee 0-12 against (Oct 2024)', 'hhs': 'No', 'b': 'Category 2', 'grade': 'no'},
    {'name': 'CJC-1295, AOD-9604, thymosin alpha-1', 'a': 'Committee against (Dec 2024)', 'hhs': 'No', 'b': 'Not listed; thymosin alpha-1 Category 3', 'grade': 'no'},
    {'name': 'Kisspeptin-10, ibutamoren', 'a': 'Category 2', 'hhs': 'No', 'b': 'Ibutamoren Category 2', 'grade': 'no'},
    {'name': 'NAD+', 'a': 'Category 1', 'hhs': 'Not needed', 'b': 'Not listed', 'grade': 'ok'},
    {'name': 'GHK-Cu', 'a': 'Non-injectable Category 1; injectable withdrawn', 'hhs': 'No', 'b': 'Not listed', 'grade': 'mixed'},
    {'name': 'Sermorelin', 'a': 'Component-of-approved-drug route (reading, not an FDA statement)', 'hhs': 'No', 'b': 'Category 1', 'grade': 'mixed'},
    {'name': 'Semaglutide, tirzepatide', 'a': 'Only if not essentially a copy; shortage discretion ended 2025', 'hhs': 'No', 'b': 'Not listed; FDA proposes not to list', 'grade': 'no'},
    {'name': 'Retatrutide, cagrilintide', 'a': 'Cannot be used in compounding', 'hhs': 'No', 'b': 'Same', 'grade': 'no'},
]

# supply routes: origin, US node, evidence grade, sources
routes = [
    {'id': 'cn-parcel', 'from': 'china', 'to': ['cvg', 'ord'], 'grade': 'documented', 'label': 'Research peptides and GLP-1 API by parcel, mis-manifested cartons through the Cincinnati and Chicago express hubs, to US web stores and consumers',
     'src': [('CBP, Cincinnati, 2026-03-31', 'https://www.cbp.gov/newsroom/local-media-release/cincinnati-cbp-foils-scheme-smuggle-over-5000-unapproved-peptides-us'), ('DOJ, W.D. Mich., Piper sentencing, 2026-07-23', 'https://www.justice.gov/usao-wdmi/pr/2026_0723_Piper_Sentencing_PR'), ('HS Today on the CBP O\'Hare seizure, July 2026', 'https://www.hstoday.us/subject-matter-areas/customs-immigration/cbp-anti-terrorism-enforcement-team-seizes-illegal-medication-shipment-linked-to-china-at-ohare/')]},
    {'id': 'cn-pens', 'from': 'china', 'to': ['fl'], 'grade': 'documented', 'label': 'Counterfeit Ozempic pens to US distributors in Florida',
     'src': [('DOJ, 2026-09-29, two charged in a counterfeit Ozempic scheme', 'https://www.justice.gov/opa/pr/two-indian-nationals-charged-connection-transnational-counterfeit-ozempic-scheme')]},
    {'id': 'cn-api', 'from': 'china', 'to': ['api'], 'grade': 'partial', 'label': 'API makers, some on the Green List, through a US importer to 503A compounders; no single document names the full chain',
     'src': [('FDA warning letter, Harbin Jixianglong, 2026-05-01', 'https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/harbin-jixianglong-biotech-co-ltd-723330-05012026'), ('FDA warning letter, Darmerica, 2025-12-08', 'https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/darmerica-llc-716152-12082025'), ('FDA Import Alert 66-80', 'https://www.accessdata.fda.gov/CMS_IA/importalert_1186.html')]},
    {'id': 'cn-clinic', 'from': 'china', 'to': ['ut'], 'grade': 'single', 'label': 'Chinese source through a middleman to a Utah physician and over 200 patients; one indictment, not yet tried',
     'src': [('DOJ, D. Utah, indictment', 'https://www.justice.gov/usao-ut/pr/utah-licensed-osteopathic-physician-indicted-allegedly-receiving-misbranded-drugs-china')]},
    {'id': 'eu-lawful', 'from': 'europe', 'to': ['brand'], 'grade': 'lawful', 'label': 'Lawful API and contract manufacturing for the branded supply: Denmark, Ireland, Germany, Switzerland, Belgium, Sweden',
     'src': [('Bachem, follow-on peptide contract', 'https://www.bachem.com/articles/news/bachem-signs-long-term-follow-on-contract-for-peptides/'), ('PolyPeptide, Braine-l\'Alleud capacity', 'https://www.polypeptide.com/news/large-scale-spps-capacity-in-braine-lalleud-starts-production/'), ('Fierce Pharma on CordenPharma', 'https://www.fiercepharma.com/manufacturing/german-cdmo-cordenpharma-invests-981m-bolster-glp-1-manufacturing')]},
    {'id': 'de-web', 'from': 'europe', 'to': ['web'], 'grade': 'single', 'label': 'Two Germany-addressed web stores shipping to US consumers; two FDA letters, no seizures',
     'src': [('FDA warning letter, USApeptide.com, 2025-02-26', 'https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/usapeptidecom-696885-02262025')]},
    {'id': 'mx-domestic', 'from': 'mexico', 'to': [], 'grade': 'none', 'label': 'Counterfeit and unregistered GLP-1s sold inside Mexico (Cofepris alerts, 2026). No government record of a route to US patients',
     'src': [('Cofepris health alert on tirzepatide, 2026-02-09 (PDF)', 'https://www.gob.mx/cms/uploads/attachment/file/1055652/Alerta_Sanitaria_Tirzepatida_09022026.pdf')]},
]
nodes = {  # US points the routes land on
    'cvg': {'name': 'Cincinnati / N. Kentucky express hub', 'lat': 39.05, 'lon': -84.66},
    'ord': {'name': "Chicago O'Hare express hub", 'lat': 41.98, 'lon': -87.90},
    'fl': {'name': 'Florida distributors (counterfeit pens)', 'lat': 26.1, 'lon': -80.3},
    'api': {'name': 'US API importers and 503A compounders', 'lat': 36.2, 'lon': -95.9},
    'ut': {'name': 'Utah clinic (indictment)', 'lat': 40.76, 'lon': -111.9},
    'brand': {'name': 'Branded supply chain (Lilly, Novo US sites)', 'lat': 39.8, 'lon': -86.2},
    'web': {'name': 'US consumers via web stores', 'lat': 33.4, 'lon': -82.0},
}
origins = {  # places named in the documents, drawn inside the insets
    'china': [('Shenzhen', 22.54, 114.06), ('Chengdu', 30.66, 104.07), ('Nanjing', 32.06, 118.80), ('Harbin', 45.80, 126.53)],
    'europe': [('Kalundborg', 55.68, 11.09), ('Bubendorf', 47.45, 7.74), ('Braine-l\'Alleud', 50.68, 4.37), ('Malmö', 55.60, 13.00), ('Limerick', 52.66, -8.63), ('Berlin', 52.52, 13.40)],
    'mexico': [('Mexico City', 19.43, -99.13)],
}

# sources: numbered, in order of first use
sources = []
def cite(label, url):
    for i, s in enumerate(sources):
        if s['url'] == url: return i + 1
    sources.append({'label': label, 'url': url}); return len(sources)
fda_list_n = cite('FDA, Registered Outsourcing Facilities, content current as of 2026-10-29', FDA_LIST_URL)
for t in timeline: t['n'] = cite(t['date'] + ' ' + t['label'], t['url'])
for r in routes: r['n'] = [cite(l, u) for l, u in r['src']]
reg_rows = [{'date': r['date_in_effect'], 'body': r['body'], 'what': r['what_it_decides'], 'compounds': r['compounds'], 'url': r['url'], 'part': r['part']} for r in reg]

data = {'asOf': AS_OF, 'fdaListN': fda_list_n, 'facilities': fac, 'timeline': timeline, 'compounds': compounds, 'routes': routes, 'nodes': nodes, 'origins': origins, 'sources': sources, 'register': reg_rows,
        'us': json.load(open(os.path.join(HERE, 'data/us-states-albers-10m.json'))), 'world': json.load(open(os.path.join(HERE, 'data/world-110m.json')))}
tpl = open(os.path.join(HERE, 'template.html')).read()
out = tpl.replace('/*__DATA__*/', json.dumps(data, separators=(',', ':')).replace('</', '<\\/'))
open(os.path.join(HERE, 'index.html'), 'w').write(out)
# the artifact publisher wraps a page in its own document skeleton, so it gets the same page without the wrapper tags
art = out
for tag in ['<!doctype html>', '<html lang="en">', '<head>', '</head>', '<body>', '</body>', '</html>', '<meta charset="utf-8">', '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">']:
    art = art.replace(tag, '', 1)
art = art.replace('<link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml"><link rel="icon" href="/favicon.ico?v=2" sizes="32x32"><link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2">', '')
open(os.path.join(HERE, 'artifact.html'), 'w').write(art.strip() + '\n')
print('index.html', len(out) // 1024, 'KB;', len(fac), 'facilities,', len(timeline), 'timeline rows,', len(routes), 'routes,', len(sources), 'sources,', len(reg_rows), 'register rows')
