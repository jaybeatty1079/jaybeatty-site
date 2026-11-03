#!/usr/bin/env python3
"""Builds peptide-map/index.html from template.html, the vault's research CSVs and the two base maps.
Run: python3 peptide-map/build.py  (from the site repo root). The page is one file with the data inline."""
import csv, json, re, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
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
    {'date': '2026-11-13', 'label': 'Comments close on the HHS draft policy, 11:59 pm Eastern (Regulations.gov docket HHS-OASH-2026-0496)', 'url': 'https://www.regulations.gov/docket/HHS-OASH-2026-0496', 'detail': 'Comment end date read from the Regulations.gov API on 2026-11-02: 2026-11-14T04:59:59Z.', 'kind': 'next'},
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
tpl = open(os.path.join(HERE, 'map-template.html')).read()
out = tpl.replace('/*__DATA__*/', json.dumps(data, separators=(',', ':')).replace('</', '<\\/'))
open(os.path.join(HERE, 'map.html'), 'w').write(out)
# the artifact publisher wraps a page in its own document skeleton, so it gets the same page without the wrapper tags
art = out
for tag in ['<!doctype html>', '<html lang="en">', '<head>', '</head>', '<body>', '</body>', '</html>', '<meta charset="utf-8">', '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">']:
    art = art.replace(tag, '', 1)
art = art.replace('<link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml"><link rel="icon" href="/favicon.ico?v=2" sizes="32x32"><link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2">', '')
RIDE_ART = 'https://claude.ai/artifact/1y6Y6xAFm76vHBFG96ZLPg'; MAP_ART = 'https://claude.ai/artifact/Uc5sbnmU6cgKJ3XahexJbN'  # the private previews link to each other
MAP_ART_HTML = art.strip().replace('href="index.html"', 'href="' + RIDE_ART + '"')

def strip_wrapper(html):
    for tag in ['<!doctype html>', '<html lang="en">', '<head>', '</head>', '<body>', '</body>', '</html>', '<meta charset="utf-8">', '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">']:
        html = html.replace(tag, '', 1)
    return html.replace('<link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml"><link rel="icon" href="/favicon.ico?v=2" sizes="32x32"><link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2">', '').strip() + '\n'

# ---------- the ride: one card per compound, every date a register row ----------
HHS = row('2026-10-30 (announced'); SEP23 = row('2023-09-29'); APR26 = row('2026-04-22 (FDA'); MAY26 = row('2026-05-14'); PCAC26 = row('2026-07-23'); PCAC24A = row('2024-10-29'); PCAC24B = row('2024-12-04')
B503 = row('2025-03-21'); SEMA = row('2025-02-21'); TIRZ = row('2024-10-02'); PROP = row('2026-05-01'); CA5 = row('2026-08-27'); FEB26 = row('2026-02-06'); RETA25 = row('2025-09-09'); RUO26 = row('2026-08-24'); EMP = row('2026-09-18'); GREEN = row('2025-09-05'); RUO24 = row('2024-12-10')
def d(date, what, r): return {'date': date, 'what': what, 'url': r['url']}
HHS_SIX = {'a': 'Not in any FDA category since the April 2026 withdrawals. The advisory committee recommended it for the 503A list in July 2026; FDA has not acted.', 'hhs': 'Covered by the draft policy of 2026-10-30, with conditions on source, testing, labeling and reporting. A draft, under comment.', 'b': 'Not covered. 503B outsourcing facilities are outside the policy.',
           'path': 'Today the only tolerated path is a 503A pharmacy, a physician or a federal facility compounding it for one patient under the draft conditions. Nothing is approved, and FDA says tolerance is not approval.',
           'stations': [['cond', 'Source', 'The draft policy sets conditions on where the bulk substance comes from and how it is tested. The appendix itself was not readable; the conditions are as law firms report them.'], ['cond', 'Fill and finish', 'Compounded per prescription, with the policy\'s testing and labeling conditions. No batch production.'], ['ok', 'Pharmacy', 'A 503A pharmacy, a physician\'s office or a federal facility. A 503B facility is not covered.'], ['ok', 'Prescriber and you', 'A prescription for one named patient. No marketing claims; adverse events reported.']],
           'enforce': 'No warning letter naming this peptide for human-use sale was found in FDA\'s letters of 2024 to 2026; claims of 2026 letters online were not confirmed.'}
def six(id, name, aka, vote):
    c = dict(HHS_SIX); c.update({'id': id, 'name': name, 'aka': aka, 'track': 'tolerated', 'dates': [d('2023-09-29', 'Placed in 503A Category 2 (bulk compounding stopped)', SEP23), d('2026-04-22', 'Nomination withdrawn: out of Category 2, not added to Category 1', APR26), d('2026-07-23', 'Advisory committee recommends it for the 503A list, ' + vote, PCAC26), d('2026-10-30', 'HHS draft enforcement-discretion policy covers it, 503A only', HHS)]})
    return c
CARDS = [
    six('bpc-157', 'BPC-157', 'a 15-residue fragment of a gastric protein, sold for healing claims', 'eight votes to six'),
    six('tb-500', 'TB-500', 'a fragment of thymosin beta-4', 'eight votes to six'),
    six('mots-c', 'MOTS-c', 'a mitochondrial-derived peptide', 'seven votes to five'),
    six('kpv', 'KPV', 'a three-residue fragment of alpha-MSH', 'eight votes to six'),
    six('epitalon', 'Epitalon', 'a synthetic four-residue peptide', 'seven votes to four'),
    six('semax', 'Semax', 'a synthetic ACTH fragment, route limits reported in the policy', 'eight votes to five'),
    {'id': 'ipamorelin', 'name': 'Ipamorelin', 'aka': 'a growth-hormone secretagogue', 'track': 'closed', 'stop': 2,
     'a': 'Not in any category. The advisory committee voted 0 to 12 against listing it in October 2024, and FDA has published nothing since.', 'hhs': 'Not in the draft policy.', 'b': 'Category 2 since September 2023: 503B facilities may not compound it from bulk.',
     'path': 'There is no lawful bulk-compounding path today, 503A or 503B. Products sold as "research use only" are unapproved drugs in FDA\'s letters.',
     'stations': [['no', 'Source', 'No lawful bulk source for compounding. Research-grade powder sold online is an unapproved drug in FDA\'s letters.'], ['no', 'Fill and finish', 'Nothing to fill lawfully: no category, no tolerance.'], ['no', 'Pharmacy', 'The gate is closed for 503A (no listing, no tolerance) and for 503B (Category 2).'], ['no', 'Prescriber and you', 'Nothing compounded can be lawfully dispensed.']],
     'enforce': 'Research-use-only sellers of peptides drew FDA warning letters in December 2024, March 2026 and August 2026; the letters cite the "research use only" label as no defense.',
     'dates': [d('2023-09-29', 'Placed in 503B Category 2', SEP23), d('2024-10-29', 'Advisory committee votes 0 to 12 against 503A listing', PCAC24A), d('2024-12-10', 'First warning letters to research-use-only peptide sellers', RUO24)]},
    {'id': 'cjc-1295', 'name': 'CJC-1295', 'aka': 'a GHRH analogue, with and without DAC', 'track': 'closed', 'stop': 2,
     'a': 'The advisory committee voted against every form in December 2024. Not in any category.', 'hhs': 'Not in the draft policy.', 'b': 'Not listed.',
     'path': 'No lawful bulk-compounding path today. Sold online as "research use only", which FDA\'s letters say is no defense.',
     'stations': [['no', 'Source', 'No lawful bulk source for compounding.'], ['no', 'Fill and finish', 'Nothing to fill lawfully.'], ['no', 'Pharmacy', 'Closed: the committee voted against every form and FDA has listed none.'], ['no', 'Prescriber and you', 'Nothing compounded can be lawfully dispensed.']],
     'enforce': 'Research-use-only sellers of peptides drew FDA warning letters in December 2024, March 2026 and August 2026.',
     'dates': [d('2024-12-04', 'Advisory committee votes against CJC-1295 in every form', PCAC24B), d('2024-12-10', 'First warning letters to research-use-only peptide sellers', RUO24)]},
    {'id': 'kisspeptin-10', 'name': 'Kisspeptin-10', 'aka': 'a reproductive-hormone peptide', 'track': 'closed', 'stop': 2,
     'a': 'Category 2 since September 2023; the advisory committee voted 0 to 11 against listing it.', 'hhs': 'Not in the draft policy.', 'b': 'Not listed.',
     'path': 'No lawful bulk-compounding path today.',
     'stations': [['no', 'Source', 'No lawful bulk source for compounding.'], ['no', 'Fill and finish', 'Nothing to fill lawfully.'], ['no', 'Pharmacy', 'Closed: Category 2 for 503A, not listed for 503B.'], ['no', 'Prescriber and you', 'Nothing compounded can be lawfully dispensed.']],
     'enforce': 'No letter naming kisspeptin-10 was found; research-use-only sellers in general drew letters in 2024 to 2026.',
     'dates': [d('2023-09-29', 'Placed in 503A Category 2', SEP23), d('2024-10-29', 'Advisory committee votes 0 to 11 against 503A listing', PCAC24A)]},
    {'id': 'nad', 'name': 'NAD+', 'aka': 'nicotinamide adenine dinucleotide, with NADH', 'track': 'listed',
     'a': 'Category 1 on the 503A list of May 2026: FDA does not intend to act against bulk compounding while the rule is written. Tolerance, not approval.', 'hhs': 'Not needed; Category 1 already tolerates it.', 'b': 'Not listed for 503B.',
     'path': 'A 503A pharmacy may compound it from bulk for a patient\'s prescription under Category 1. No 503B batch path.',
     'stations': [['ok', 'Source', 'Bulk substance from a registered supplier with a certificate of analysis, as 503A conditions require.'], ['ok', 'Fill and finish', 'Compounded per prescription at a 503A pharmacy.'], ['ok', 'Pharmacy', '503A under Category 1. 503B: not listed.'], ['ok', 'Prescriber and you', 'A prescription for one patient.']],
     'enforce': 'No enforcement letter naming NAD+ was found.',
     'dates': [d('2026-05-14', 'Current 503A category list: NAD and NADH in Category 1', MAY26)]},
    {'id': 'ghk-cu', 'name': 'GHK-Cu', 'aka': 'a copper peptide, topical and injectable', 'track': 'mixed',
     'a': 'Non-injectable forms are Category 1 (restored in May 2026 after a nominator\'s clarification). The injectable nomination was withdrawn; no tolerance for injection.', 'hhs': 'Not in the draft policy.', 'b': 'Not listed.',
     'path': 'Topical or other non-injectable compounding is tolerated under Category 1 at a 503A pharmacy. Injectable GHK-Cu has no lawful bulk path.',
     'stations': [['ok', 'Source', 'Bulk substance for non-injectable use, with a certificate of analysis.'], ['cond', 'Fill and finish', 'Creams and other non-injectable forms only. The injectable siding is closed.'], ['ok', 'Pharmacy', '503A under Category 1, non-injectable.'], ['ok', 'Prescriber and you', 'A prescription for one patient.']],
     'enforce': 'No enforcement letter naming GHK-Cu was found.',
     'dates': [d('2026-04-22', 'GHK-Cu removed from Category 1 after nominations were withdrawn', APR26), d('2026-05-14', 'Non-injectable GHK-Cu back in Category 1; injectable stays out', MAY26)]},
    {'id': 'sermorelin', 'name': 'Sermorelin', 'aka': 'a GHRH analogue; its approved product, Geref, is discontinued', 'track': 'component',
     'a': 'Not in a 503A category. The component-of-an-approved-drug route is a reading of the statute, not an FDA statement.', 'hhs': 'Not in the draft policy.', 'b': 'Category 1 on the 503B list, marked as a component of an approved drug.',
     'path': 'A 503B outsourcing facility may compound it from bulk under Category 1. The 503A side rests on a legal reading, so it is drawn with conditions.',
     'stations': [['ok', 'Source', 'Bulk sermorelin acetate for a 503B facility.'], ['ok', 'Fill and finish', 'Batch production at a registered 503B facility.'], ['cond', 'Pharmacy', '503B: Category 1. 503A: a legal reading, not an FDA listing.'], ['ok', 'Prescriber and you', 'Prescribed or office-use from a 503B batch.']],
     'enforce': 'No enforcement letter naming sermorelin was found.',
     'dates': [d('2025-03-21', '503B category list: sermorelin acetate in Category 1', B503)]},
    {'id': 'semaglutide', 'name': 'Semaglutide', 'aka': 'the GLP-1 in Ozempic and Wegovy', 'track': 'brand',
     'a': 'An approved drug. A 503A pharmacy may compound it only when the product is not essentially a copy, with a documented patient-specific difference. The shortage-based window closed in 2025.', 'hhs': 'Not in the draft policy.', 'b': 'Not on the 503B list. FDA proposed on 2026-05-01 not to add it; no final notice found.',
     'path': 'The lawful line is the approved product from the manufacturer through a licensed pharmacy. Compounded copies lost their shortage cover in 2025, the Fifth Circuit affirmed FDA in August 2026, and mass-marketed compounded GLP-1s are an enforcement target.',
     'stations': [['brand', 'Source', 'Branded API from the manufacturer. For compounders, only API from the Green List under Import Alert 66-80 clears the border.'], ['brand', 'Fill and finish', 'Branded pens from the manufacturer\'s plants. Compounded vials only when not a copy.'], ['cond', 'Pharmacy', 'Dispensing the approved product. 503A compounding only with a patient-specific difference; 503B: not listed.'], ['ok', 'Prescriber and you', 'A prescription for the approved product; telehealth sellers of compounded copies drew letters in 2026.']],
     'enforce': 'FDA\'s statement of 2026-02-06, thirty telehealth warning letters in March 2026, the Empower letter of 2026-09-18, and research-use-only letters of 2026-08-24 naming semaglutide.',
     'dates': [d('2025-02-21', 'Shortage declared resolved; 503A cover ended 2025-04-22, 503B 2025-05-22', SEMA), d('2025-09-05', 'Green List import alert 66-80 for GLP-1 APIs', GREEN), d('2026-02-06', 'FDA: all available tools against mass-marketed compounded GLP-1s', FEB26), d('2026-05-01', 'FDA proposes not to add it to the 503B list', PROP), d('2026-08-27', 'Fifth Circuit affirms FDA on the shortage delisting', CA5), d('2026-09-18', 'Warning letter to Empower Pharmacy', EMP)]},
    {'id': 'tirzepatide', 'name': 'Tirzepatide', 'aka': 'the GIP/GLP-1 in Mounjaro and Zepbound', 'track': 'brand',
     'a': 'An approved drug. Compounding only when not essentially a copy. The shortage was declared resolved in October and again in December 2024; cover ended in early 2025.', 'hhs': 'Not in the draft policy.', 'b': 'Not on the 503B list. FDA proposed on 2026-05-01 not to add it.',
     'path': 'The lawful line is the approved product. Compounded copies lost their cover in 2025; the Fifth Circuit affirmed FDA in August 2026.',
     'stations': [['brand', 'Source', 'Branded API from the manufacturer; for compounders only Green List API clears the border.'], ['brand', 'Fill and finish', 'Branded pens. Compounded vials only when not a copy.'], ['cond', 'Pharmacy', 'Dispensing the approved product. 503A only with a patient-specific difference; 503B: not listed.'], ['ok', 'Prescriber and you', 'A prescription for the approved product.']],
     'enforce': 'FDA\'s statement of 2026-02-06 and the 2026 telehealth letters; the Empower letter of 2026-09-18 names a tirzepatide product.',
     'dates': [d('2024-10-02', 'Shortage declared resolved', TIRZ), d('2025-09-05', 'Green List import alert 66-80', GREEN), d('2026-05-01', 'FDA proposes not to add it to the 503B list', PROP), d('2026-08-27', 'Fifth Circuit affirms FDA', CA5), d('2026-09-18', 'Warning letter to Empower Pharmacy', EMP)]},
    {'id': 'retatrutide', 'name': 'Retatrutide', 'aka': 'an investigational triple agonist, not approved anywhere', 'track': 'none',
     'a': 'FDA says it cannot be used in compounding: no approved product, no listing, no tolerance.', 'hhs': 'Not in the draft policy.', 'b': 'Same: cannot be used in compounding.',
     'path': 'There is no lawful route to a patient outside a clinical trial. Everything sold online is an unapproved drug, and the letters say the "research use only" label is no defense.',
     'stations': [['no', 'Source', 'No lawful source. Online sellers drew warning letters in September 2025 and August 2026.'], ['no', 'Fill and finish', 'Nothing can be lawfully filled.'], ['no', 'Pharmacy', 'No 503A or 503B path exists.'], ['no', 'Prescriber and you', 'Nothing can be lawfully prescribed outside a trial.']],
     'enforce': 'Warning letters of 2025-09-09 (ASN-LABS, GLP-1 Solution) and 2026-08-24 (NuScience, Royal Peptides) name retatrutide.',
     'dates': [d('2025-09-09', 'Warning letters: compounded retatrutide qualifies under neither 503A nor 503B', RETA25), d('2026-08-24', 'Warning letters to NuScience and Royal Peptides', RUO26)]},
]
# four windows, in Jay's order: source (NW), purify and test (SW), fill and finish (NE), dispense (SE). The old pharmacy gate folds into fill and finish, where 503A and 503B part ways.
QC = {'tolerated': ['cond', 'Each lot tested for identity, purity, sterility and endotoxin under the draft policy\'s conditions, with the certificate of analysis kept on file.'],
      'closed': ['no', 'Nothing lawful to test: there is no bulk-compounding path.'], 'none': ['no', 'No lawful lot exists to test. Products sold online carry no verified certificate.'],
      'listed': ['ok', 'The supplier\'s certificate of analysis, and the pharmacy\'s own testing for sterile preparations under USP <797>.'],
      'mixed': ['ok', 'Certificate of analysis for the non-injectable bulk substance; no sterile testing needed for a cream.'],
      'component': ['ok', 'Release testing at the 503B facility under cGMP: identity, purity, sterility, endotoxin.'],
      'brand': ['brand', 'Manufacturer release testing under cGMP. A compounder\'s API lot needs a certificate of analysis and Green List origin.']}
for c in CARDS:
    s0, s1, s2, s3 = c['stations']
    c['stations'] = [[s0[0], 'Source', s0[2]], [QC[c['track']][0], 'Purify and test', QC[c['track']][1]], [s2[0], 'Fill and finish', s2[2] + ' ' + s1[2]], [s3[0], 'Dispense', s3[2]]]
# weather on the ride, Jay's rule: sunny where there is oversight (an approved product, or FDA or HHS tolerance) and human evidence; overcast where there is oversight but thin human evidence; rain, storm and blizzard only where there is no oversight at all, graded by how little human evidence exists.
# 0 sunny, 1 overcast, 2 rain and lightning (no oversight, some human study), 3 storm with wind (no oversight, thin human evidence), 4 blizzard with hail (no oversight, laboratory and animal work only)
WEATHER = {'semaglutide': (0, 'Approved products with large completed trials.'), 'tirzepatide': (0, 'Approved products with large completed trials.'), 'sermorelin': (0, 'An approved product (Geref, 1997), since discontinued; human trials exist.'),
           'nad': (0, 'Human trials exist; Category 1 tolerance; no approved injectable product.'), 'ghk-cu': (1, 'Small human studies, mostly topical; Category 1 tolerance for non-injectable forms; no approved product.'),
           'bpc-157': (1, 'HHS draft tolerance; evidence is mostly animal studies with few small human reports.'), 'tb-500': (1, 'HHS draft tolerance; mostly animal and laboratory evidence.'), 'semax': (1, 'HHS draft tolerance; registered as a drug in Russia; no FDA-reviewed trials.'),
           'mots-c': (1, 'HHS draft tolerance; animal and laboratory evidence, early human work only.'), 'kpv': (1, 'HHS draft tolerance; laboratory and animal evidence, no published human trials.'), 'epitalon': (1, 'HHS draft tolerance; small studies outside Western regulation.'),
           'ipamorelin': (2, 'No oversight: committee voted against listing; small human studies; sold on the grey market.'), 'kisspeptin-10': (2, 'No oversight for compounding: Category 2; human research studies exist in reproductive medicine.'), 'cjc-1295': (2, 'No oversight: committee voted against every form; small early human studies.'),
           'retatrutide': (3, 'No lawful route outside its trials; investigational, not approved; sold widely on the grey market.')}
for c in CARDS: c['weather'], c['evidence'] = WEATHER[c['id']]
# what is each peptide's own: a plain line on what it is and what people take it for, and the committee vote where there was one
ABOUT = {'bpc-157': ('Sold for tendon, gut and joint healing claims.', 'Advisory committee, July 2026: eight votes to six for listing.'),
         'tb-500': ('A thymosin fragment sold for recovery and injury claims.', 'Advisory committee, July 2026: eight votes to six for listing.'),
         'mots-c': ('A mitochondrial peptide sold for metabolism and endurance claims.', 'Advisory committee, July 2026: seven votes to five for listing.'),
         'kpv': ('A three-residue fragment sold for gut and inflammation claims.', 'Advisory committee, July 2026: eight votes to six for listing.'),
         'epitalon': ('A four-residue synthetic peptide sold for longevity claims.', 'Advisory committee, July 2026: seven votes to four for listing.'),
         'semax': ('A synthetic ACTH fragment sold for cognition claims; registered as a drug in Russia.', 'Advisory committee, July 2026: eight votes to five for listing; route limits reported in the policy.'),
         'ipamorelin': ('A growth-hormone secretagogue sold for muscle and recovery claims.', 'Advisory committee, October 2024: twelve votes to none against listing.'),
         'cjc-1295': ('A GHRH analogue, with and without DAC, sold alongside ipamorelin.', 'Advisory committee, December 2024: voted against in every form.'),
         'kisspeptin-10': ('A reproductive-hormone peptide sold for testosterone and fertility claims.', 'Advisory committee, October 2024: eleven votes to none against listing.'),
         'nad': ('Nicotinamide adenine dinucleotide, given by injection or drip for energy and aging claims.', 'On the 503A Category 1 list of May 2026.'),
         'ghk-cu': ('A copper peptide used in skin products and sold injectable for healing claims.', 'Non-injectable forms restored to Category 1 in May 2026.'),
         'sermorelin': ('A GHRH analogue once approved as Geref for growth-hormone testing.', 'On the 503B Category 1 list of March 2025 as a component of an approved drug.'),
         'semaglutide': ('The GLP-1 in Ozempic and Wegovy.', 'Shortage declared over 2025-02-21; compounding cover ended by 2025-05-22; Fifth Circuit affirmed FDA 2026-08-27.'),
         'tirzepatide': ('The GIP/GLP-1 in Mounjaro and Zepbound.', 'Shortage declared over 2024-10-02 and again 2024-12-19; cover ended early 2025; Fifth Circuit affirmed FDA 2026-08-27.'),
         'retatrutide': ('An investigational triple agonist in large trials, not approved anywhere.', 'FDA letters of 2025-09-09 and 2026-08-24 name it: it cannot be used in compounding.')}
for c in CARDS: c['about'], c['own'] = ABOUT[c['id']]
TRACKS = {'tolerated': 'Tolerated under a draft', 'closed': 'Closed gate', 'listed': 'Category 1', 'mixed': 'Open for topical, closed for injection', 'component': '503B line', 'brand': 'Brand line', 'none': 'No lawful route'}
for c in CARDS: c['trackLabel'] = TRACKS[c['track']]
# ---------- the rest of the menu: compounds graded by tools/evidence.py from PubMed, ClinicalTrials.gov, openFDA, Europe PMC and OpenAlex ----------
try: MORE = json.load(open(os.path.join(HERE, 'data', 'compounds.json')))
except FileNotFoundError: MORE = []
GRADE_TEXT = {'A': 'An approved product in the US', 'B': 'Human trials published or registered', 'C': 'Early human studies, few or no trials', 'D': 'Laboratory and animal work only'}
# where the register already names a compound, its standing comes from the register, not from the counts
OVERRIDE = {
 'll-37': dict(track='closed', stop=2, weather=3, a='Placed in 503A Category 2 in September 2023: FDA identified significant safety risks; bulk compounding not tolerated.', b='Not listed.'),
 'dihexa': dict(track='closed', stop=2, weather=3, a='Placed in 503A Category 2 in September 2023; bulk compounding not tolerated.', b='Not listed.'),
 'melanotan-2': dict(track='closed', stop=2, weather=3, a='Withdrawn from Category 2 in April 2026 with no tolerance; advisory review reported for early 2027.', b='Not listed.'),
 'aod-9604': dict(track='closed', stop=2, weather=3, a='The advisory committee voted 0 to 12 against listing it in December 2024.', b='Not listed.'),
 'thymosin-alpha-1': dict(track='closed', stop=2, weather=2, a='The advisory committee voted 4 to 17 against listing it in December 2024.', b='503B Category 3.'),
 'ghrp-2': dict(track='closed', stop=2, weather=3, a='503A Category 3.', b='503B Category 2 for injectable and nasal routes.'),
 'ghrp-6': dict(track='closed', stop=2, weather=3, a='503A Category 3.', b='503B Category 2.'),
 'ibutamoren': dict(track='closed', stop=2, weather=2, a='503A Category 2; the committee voted 1 to 13 against listing it.', b='503B Category 2.'),
 'dsip': dict(track='closed', stop=2, weather=3, a='Withdrawn from Category 2 in April 2026; the advisory committee voted 6 to 7 against it in July 2026; not in the HHS draft.', b='Not listed.'),
 'vip': dict(track='listed', weather=0, a='503A Category 1 on the May 2026 list: FDA does not intend to act against bulk compounding while the rule is written.', b='Not listed.', path='A 503A pharmacy may compound it from bulk for a prescription under Category 1.'),
 'glutathione': dict(track='listed', weather=0, a='503A Category 1 on the May 2026 list.', b='Not listed.', path='A 503A pharmacy may compound it from bulk for a prescription under Category 1.'),
 'gonadorelin': dict(track='component', weather=1, a='Not in a 503A category.', b='503B Category 1, marked as a component of an approved drug.', path='A 503B outsourcing facility may compound it from bulk under Category 1.'),
 'cagrilintide': dict(track='none', weather=3, a='Investigational; FDA says it cannot be used in compounding.', b='Same.', path='No lawful route to a patient outside a clinical trial.'),
 'survodutide': dict(track='none', weather=3, a='Investigational; no approved product.', b='Not listed.', path='No lawful route to a patient outside a clinical trial.'),
 'mazdutide': dict(track='none', weather=3, a='Investigational; no approved product.', b='Not listed.', path='No lawful route to a patient outside a clinical trial.'),
 'liraglutide': dict(weather=0, b='Not on the 503B list; FDA proposed in May 2026 not to add it.'),
 'hcg': dict(track='brand', weather=0, a='An approved product, a biologic since 2020; FDA has warned against compounded HCG for weight loss.', b='Deemed-biologic products lost the compounding exemptions in 2020.', path='The lawful line is the approved product on a prescription.'),
 'insulin': dict(track='brand', weather=0, a='Approved products; a biologic since 2020.', b='Deemed-biologic products lost the compounding exemptions in 2020.', path='The lawful line is the approved product on a prescription.'),
}
APPROVED_FALLBACK = {'tesamorelin': 'Egrifta', 'bremelanotide': 'Vyleesi', 'afamelanotide': 'Scenesse', 'elamipretide': 'Forzinity', 'teriparatide': 'Forteo', 'abaloparatide': 'Tymlos', 'octreotide': 'Sandostatin', 'leuprolide': 'Lupron', 'desmopressin': 'DDAVP', 'glucagon': 'Glucagon', 'insulin': 'Insulin', 'calcitonin': 'Miacalcin', 'ziconotide': 'Prialt', 'oxytocin': 'Pitocin', 'liraglutide': 'Victoza', 'exenatide': 'Byetta', 'hcg': 'Pregnyl'}
STN = {'brand': [['brand', 'Source', 'Branded API from the manufacturer under cGMP.'], ['brand', 'Purify and test', 'Manufacturer release testing under cGMP.'], ['cond', 'Fill and finish', 'The approved product; compounding only with a documented patient-specific difference.'], ['ok', 'Dispense', 'A prescription for the approved product.']],
       'closed': [['no', 'Source', 'No lawful bulk source for compounding.'], ['no', 'Purify and test', 'No lawful lot to test.'], ['no', 'Fill and finish', 'The gate is closed: no listing that permits it, no tolerance, no approved product.'], ['no', 'Dispense', 'Nothing compounded can be lawfully dispensed.']],
       'none': [['no', 'Source', 'No lawful source outside a trial.'], ['no', 'Purify and test', 'No lawful lot to test.'], ['no', 'Fill and finish', 'No 503A or 503B path exists.'], ['no', 'Dispense', 'Nothing can be lawfully prescribed outside a trial.']],
       'listed': [['ok', 'Source', 'Bulk substance from a registered supplier with a certificate of analysis.'], ['ok', 'Purify and test', 'The supplier\'s certificate and the pharmacy\'s own testing under USP <797>.'], ['ok', 'Fill and finish', '503A under Category 1. 503B: not listed.'], ['ok', 'Dispense', 'A prescription for one patient.']],
       'component': [['ok', 'Source', 'Bulk substance for a 503B facility.'], ['ok', 'Purify and test', 'Release testing under cGMP.'], ['cond', 'Fill and finish', '503B: Category 1. 503A: a legal reading, not a listing.'], ['ok', 'Dispense', 'Prescribed or office-use from a 503B batch.']]}
def more_card(r):
    g = r['grade']; key = r['name'].split(' (')[0].lower()
    # openFDA label search is fuzzy (homeopathic labels match single words), so a known brand wins, and a hit counts only when its generic name is the compound
    if r['id'] in APPROVED_FALLBACK: ap = {'brand': APPROVED_FALLBACK[r['id']]}
    else:
        hit = r.get('approved'); ap = hit if hit and key in (hit.get('generic') or '').lower() else None
    if ap:
        track, weather = 'brand', 0
        a = 'An approved drug (%s). A 503A pharmacy may compound it only when the product is not essentially a copy.' % ap['brand']; b = 'Compounding from bulk only where a list or an approved-drug component allows it.'
        path = 'The lawful line is the approved product, %s, through a licensed pharmacy on a prescription.' % ap['brand']
    else:
        track, weather = 'closed', {'A': 0, 'B': 2, 'C': 3, 'D': 4}[g]
        a = 'Not on FDA\'s 503A bulks list in any category the register shows; no approved US product.'; b = 'Not on the 503B list.'
        path = 'No lawful bulk-compounding path today, 503A or 503B, and no approved product: what is sold online is an unapproved drug in FDA\'s letters.'
    o = r.get('openalex') or {}
    ev = '%s. PubMed: %s human studies, %s clinical trials. ClinicalTrials.gov: %s registered trials. Europe PMC: %s records. OpenAlex: %s works, %s not in English.' % (GRADE_TEXT[g], r['human_pubmed'], r['trials_pubmed'], r['trials_ctgov'], r['europepmc'], o.get('all'), o.get('non_english'))
    card = {'id': 'm-' + r['id'], 'name': r['name'], 'aka': r['aka'], 'about': r['about'], 'own': 'Graded from the public indexes on %s. Counts are mentions and registrations, not a verdict on whether it works.' % r['graded_on'],
            'track': track, 'a': a, 'hhs': 'Not in the draft policy.', 'b': b, 'path': path, 'enforce': 'Letters naming this compound were not checked for this entry.', 'dates': [], 'evidence': ev, 'weather': weather, 'papers': r.get('papers', []), 'menu': 'more', 'grade': g}
    card.update(OVERRIDE.get(r['id'], {}))
    card['stations'] = STN[card['track']]
    if card['track'] == 'closed': card['stop'] = 2
    return card
MORE_CARDS = [more_card(r) for r in MORE if not r.get('error')]
for c in CARDS: c['menu'] = 'named'
for c in MORE_CARDS: c['trackLabel'] = TRACKS[c['track']]
ride = {'asOf': AS_OF, 'cards': CARDS + MORE_CARDS, 'hhsUrl': HHS['url']}
# ---------- the glossary page ----------
from glossary import GROUPS as GLOSSARY
gt = open(os.path.join(HERE, 'glossary-template.html')).read()
gout = gt.replace('/*__DATA__*/', json.dumps({'asOf': AS_OF, 'groups': GLOSSARY}, separators=(',', ':')).replace('</', '<\\/'))
open(os.path.join(HERE, 'glossary.html'), 'w').write(gout)
GLOSS_ART = 'https://claude.ai/artifact/Wocz7W5sAPKo6HWj2TRfLe'
open(os.path.join(HERE, 'glossary-artifact.html'), 'w').write(strip_wrapper(gout).replace('href="index.html"', 'href="' + RIDE_ART + '"').replace('href="map.html"', 'href="' + MAP_ART + '"'))
print('glossary.html', len(gout) // 1024, 'KB;', sum(len(g['terms']) for g in GLOSSARY), 'terms')
rt = open(os.path.join(HERE, 'ride-template.html')).read()
rout = rt.replace('/*__DATA__*/', json.dumps(ride, separators=(',', ':')).replace('</', '<\\/'))
open(os.path.join(HERE, 'index.html'), 'w').write(rout)
open(os.path.join(HERE, 'ride-artifact.html'), 'w').write(strip_wrapper(rout).replace('href="map.html"', 'href="' + MAP_ART + '"').replace('href="glossary.html"', 'href="' + GLOSS_ART + '"'))
open(os.path.join(HERE, 'artifact.html'), 'w').write(MAP_ART_HTML.replace('href="glossary.html"', 'href="' + GLOSS_ART + '"') + '\n')
print('index.html (ride)', len(rout) // 1024, 'KB;', len(CARDS), 'named +', len(MORE_CARDS), 'more')
print('map.html', len(out) // 1024, 'KB;', len(fac), 'facilities,', len(timeline), 'timeline rows,', len(routes), 'routes,', len(sources), 'sources,', len(reg_rows), 'register rows')
