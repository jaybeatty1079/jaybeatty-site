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
    ('2025-03-05', 'N.D. Tex. denies the compounders an injunction on tirzepatide', row('2025-03-05'), 'court'),
    ('2025-04-24', 'N.D. Tex. denies the injunction on semaglutide', row('2025-04-24'), 'court'),
    ('2025-09-05', 'Green List import alert 66-80 for GLP-1 APIs', row('2025-09-05'), 'enforce'),
    ('2026-02-06', 'FDA: all available tools against mass-marketed compounded GLP-1s', row('2026-02-06'), 'glp1'),
    ('2026-03-31', 'CBP Cincinnati: 300 cartons, 5,000 peptide shipments from a China shipper', row('2026-03-31', 'CBP'), 'enforce'),
    ('2026-04-22', 'Nominations withdrawn: 17 peptides leave Category 2, not added to Category 1', row('2026-04-22 (FDA'), 'list'),
    ('2026-05-01', 'FDA proposes to keep semaglutide, tirzepatide, liraglutide off the 503B list', row('2026-05-01'), 'glp1'),
    ('2026-07-23', 'Advisory committee recommends six of seven peptides, against FDA staff', row('2026-07-23'), 'list'),
    ('2026-08-24', 'Warning letters to NuScience and Royal Peptides on GLP-1 "research" sales', row('2026-08-24'), 'enforce'),
    ('2026-08-27', 'Fifth Circuit affirms FDA in both GLP-1 shortage cases', row('2026-08-27'), 'court'),
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
# court rulings and settlements with a lesson in them, from the register and the enforcement research (research/03, sections 4b to 4e). Allegations in pending cases are not findings.
COURTS = [  # date, forum, case, what was decided, what it tells you, kind, url
    ('2014', 'W.D.N.C. (guilty pleas)', 'United States v. the owners of Spectrum Peptides', 'Two men pleaded guilty to selling misbranded drugs: peptides labeled "for research purposes only", sold to bodybuilders, about $800,000 in sales.', 'The research-use-only label has been a losing defense for over a decade. Intended use is read from the whole record: the website, the dosing talk, the customers.', 'criminal', 'https://www.justice.gov/usao-wdnc/pr/two-charlotte-men-plead-guilty-selling-misbranded-drugs'),
    ('2025-03-05', 'N.D. Tex.', 'Outsourcing Facilities Association v. FDA, 4:24-cv-00953 (tirzepatide)', 'Preliminary injunction denied. The compounders could not keep making copies while they sued; 503A discretion ended and 503B ran to 2025-03-19.', 'A shortage listing is FDA\'s call, and a court will not freeze it. Compounding that rests on a shortage ends when the shortage does.', 'civil', row('2025-03-05')['url']),
    ('2025-04-24', 'N.D. Tex.', 'Outsourcing Facilities Association v. FDA, 4:25-cv-00174 (semaglutide)', 'Preliminary injunction denied; 503B discretion ran to 2025-05-22.', 'The same result for the second GLP-1. The pattern held.', 'civil', row('2025-04-24')['url']),
    ('2025-12-03', 'FTC (final order)', 'FTC v. NextMed', 'Final order against a telehealth GLP-1 program for hidden costs, unsubstantiated weight-loss claims and fake testimonials; $150,000 in consumer refunds.', 'The marketing is a second front. Claims and billing draw the FTC even where the drug itself is lawful.', 'agency', 'https://www.ftc.gov/news-events/news/press-releases/2025/12/ftc-approves-final-order-against-telehealth-provider-nextmed-over-charges-it-used-deceptive'),
    ('2026-01-12', 'Alabama Attorney General (settlement after a TRO of 2025-11-10)', 'State of Alabama v. Aurora IV and Wellness', 'A clinic that advertised "pharmaceutical-grade" tirzepatide and semaglutide but injected research-grade product settled: $17,267.50 in consumer damages, $7,000 in penalties and fees, and it closed.', 'State consumer-protection law reaches the clinic. Calling research-grade product pharmaceutical grade is the actionable act, before any federal case.', 'state', 'https://www.alabamaag.gov/attorney-general-marshall-settles-lawsuit-with-cullman-clinic-for-administering-dangerous-unapproved-weight-loss-drugs/'),
    ('2026-03-09', 'D. Del. (dismissed without prejudice)', 'Novo Nordisk v. Hims & Hers', 'Novo sued on 2026-02-09 over a $49 compounded semaglutide pill, alleging inauthentic API and impurities. Hims dropped the pill within two days, announced a shift to the branded drugs on 2026-03-09, and Novo dismissed.', 'Manufacturers sue within days, on patent and unfair-competition law. The business change ends the case, not a judgment.', 'civil', 'https://investors.hims.com/news/news-details/2026/Hims--Hers-Announces-Strategic-Shift-for-US-Weight-Loss-Business/default.aspx'),
    ('2026-04-01', 'D. Utah (indictment, not tried)', 'United States v. Watkins', 'An osteopathic physician was indicted for receiving misbranded peptides from China through a middleman and selling them to more than 200 patients under labels he made himself. An allegation, not a conviction.', 'A prescriber who sources from the grey market is charged as a distributor. The medical license is no shield for the supply chain.', 'criminal', 'https://www.justice.gov/usao-ut/pr/utah-licensed-osteopathic-physician-indicted-allegedly-receiving-misbranded-drugs-china'),
    ('2026-07-01', 'D. Mass. (sentence)', 'United States v. Gong and Tang', 'A year and a day each for importing drugs from China through PO boxes and false addressees and relabeling them "For Research Purposes Only"; gross sales over $2.5 million.', 'The import side is prosecuted as misbranding and smuggling. Relabeling at the US end does not launder the product.', 'criminal', 'https://www.justice.gov/usao-ma/pr/massachusetts-couple-sentenced-prison-importing-misbranded-drugs-china-and-selling-them'),
    ('2026-07-23', 'W.D. Mich. (sentence)', 'United States v. Piper', 'Twenty-one months for selling misbranded peptides and GLP-1s sourced from China through a web storefront.', 'A web store is a drug distributor in the law\'s eyes, whatever its disclaimer says.', 'criminal', 'https://www.justice.gov/usao-wdmi/pr/2026_0723_Piper_Sentencing_PR'),
    ('2026-07-30', 'N.D. Ind. (sentence)', 'United States v. Kawa and Stechkober (Paradigm Peptides)', 'Five years ten months and one year four months for shipping peptides, hCG and "SARMs" that in fact contained testosterone to thousands of customers; restitution $78,317.52.', 'Sentences scale with volume and with what was actually in the vials.', 'criminal', 'https://www.justice.gov/usao-ndin/united-states-v-matthew-kawa'),
    ('2026-08-12', 'Several courts (filed, pending)', 'Eli Lilly v. six retatrutide sellers', 'Lilly sued pharmacies, med spas and web sellers over retatrutide, mostly under state unfair-competition law, with a Lanham Act claim against one med spa. Pending; reported by press, courts not named.', 'The manufacturer polices its investigational drug itself. There is no private right to enforce the FDCA, so these suits run on state law and trademark.', 'civil', 'https://www.cnbc.com/2026/08/12/lilly-lawsuits-obesity-drug-retatrutide.html'),
    ('2026-08-27', '5th Cir. (unpublished per curiam)', 'Outsourcing Facilities Ass\'n v. FDA, Nos. 25-10600 and 25-10758', 'Affirmed FDA in both GLP-1 shortage cases: any failure to use notice-and-comment was harmless, and taking tirzepatide and semaglutide off the shortage list was not arbitrary or capricious.', 'The appeals court confirmed the district courts. The shortage door is shut, and the way FDA shut it survives review.', 'civil', row('2026-08-27')['url']),
]
courts = [{'date': d, 'forum': f, 'case': c, 'decided': w, 'lesson': l, 'kind': k, 'n': cite(d + ' ' + c, u), 'url': u} for d, f, c, w, l, k, u in COURTS]
reg_rows = [{'date': r['date_in_effect'], 'body': r['body'], 'what': r['what_it_decides'], 'compounds': r['compounds'], 'url': r['url'], 'part': r['part']} for r in reg]

data = {'asOf': AS_OF, 'fdaListN': fda_list_n, 'facilities': fac, 'timeline': timeline, 'compounds': compounds, 'routes': routes, 'nodes': nodes, 'origins': origins, 'sources': sources, 'register': reg_rows, 'courts': courts,
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
# ---------- the twelve windows: how a peptide is made, from the idea to the vial ----------
# Three cycles of the four corners. The lamp and the chip at each gate come from the card's station it belongs to
# (0 source, 1 purify and test, 2 fill and finish, 3 dispense); steps 1, 3, 7 and 8 change with the compound.
STEP_STATION = [0, 0, 0, 0, 1, 1, 0, 2, 2, 2, 3, 3]
# where each compound's sequence comes from: kind, and a note for the first window. n is its length in residues where it is a single defined sequence.
ORIGIN = {
 'bpc-157': ('fragment', 'a stretch of a protective protein found in human gastric juice', 15, 'GEPPPGKPADDAGLV'), 'tb-500': ('fragment', 'residues 17 to 23 of thymosin beta-4, the part that binds actin', 7, 'LKKTETQ'),
 'semax': ('analogue', 'a fragment of the stress hormone ACTH with a tail added so it lasts', 7, 'MEHFPGP'), 'mots-c': ('natural', 'a 16-residue peptide encoded in mitochondrial DNA', 16, 'MRWQEMGYIFYPRKLR'),
 'kpv': ('fragment', 'the last three residues of alpha-melanocyte-stimulating hormone', 3, 'KPV'), 'epitalon': ('designed', 'a four-residue sequence written to mimic a pineal extract', 4, 'AEDG'),
 'ipamorelin': ('designed', 'a five-residue chain with three residues that occur in no protein', 5, None), 'kisspeptin-10': ('fragment', 'the ten active residues at the end of kisspeptin-54', 10, 'YNWNSFGLRF'),
 'cjc-1295': ('analogue', 'the first 29 residues of growth-hormone-releasing hormone, with four swaps and an optional tail', 29, None), 'ghk-cu': ('fragment', 'a tripeptide released from collagen as it breaks down, carrying a copper ion', 3, 'GHK'),
 'nad': ('small', 'a coenzyme in every living cell, not a peptide', None, None), 'sermorelin': ('fragment', 'the first 29 residues of growth-hormone-releasing hormone', 29, 'YADAIFTNSYRKVLGQLSARKLLQDIMSR'),
 'semaglutide': ('analogue', 'human GLP-1 with two swaps and a fatty-acid chain so it lasts a week', 31, None), 'tirzepatide': ('analogue', 'a 39-residue chain built on the GIP sequence to hit two receptors, with a fatty-acid chain', 39, None),
 'retatrutide': ('analogue', 'a 39-residue chain designed to hit three receptors, with a fatty-acid chain', 39, None),
 'tesamorelin': ('analogue', 'growth-hormone-releasing hormone with a group added at the front so it lasts', 44, None), 'bremelanotide': ('analogue', 'a cyclic analogue of alpha-MSH', 7, None), 'melanotan-2': ('analogue', 'a cyclic analogue of alpha-MSH', 7, None),
 'afamelanotide': ('analogue', 'alpha-MSH with two swaps', 13, None), 'aod-9604': ('fragment', 'residues 177 to 191 of human growth hormone, with one added', 16, None), 'thymosin-alpha-1': ('natural', 'a 28-residue thymic peptide', 28, None),
 'll-37': ('natural', 'the 37-residue antimicrobial peptide cut from human cathelicidin', 37, None), 'dihexa': ('analogue', 'a six-residue chain derived from angiotensin IV', 6, None), 'selank': ('analogue', 'the immune peptide tuftsin with a tail added', 7, None),
 'ghrp-2': ('designed', 'a six-residue chain with non-natural residues, screened for growth-hormone release', 6, None), 'ghrp-6': ('designed', 'a six-residue chain with non-natural residues', 6, None), 'hexarelin': ('designed', 'a six-residue chain with non-natural residues', 6, None),
 'ibutamoren': ('small', 'a small molecule that mimics ghrelin, not a peptide', None, None), 'igf-1-lr3': ('protein', 'insulin-like growth factor 1 with 13 residues added at the front and one swap', 83, None), 'peg-mgf': ('fragment', 'a 24-residue tail of a growth-factor splice variant, with a polymer attached', 24, None),
 'follistatin': ('protein', 'a 344-residue protein that binds myostatin', 344, None), 'dsip': ('natural', 'a nine-residue peptide first isolated from rabbit brain', 9, 'WAGGDASGE'), 'pinealon': ('designed', 'a three-residue chain from the Russian bioregulator family', 3, 'EDR'),
 'thymalin': ('extract', 'a mixture of fragments drawn from calf thymus', None, None), 'cerebrolysin': ('extract', 'a mixture of fragments drawn from pig brain', None, None), 'humanin': ('natural', 'a 24-residue peptide encoded in mitochondrial DNA', 24, None),
 'elamipretide': ('designed', 'a four-residue chain built to sit in the mitochondrial membrane', 4, None), 'ara-290': ('fragment', 'eleven residues from the surface of erythropoietin', 11, None), 'vip': ('natural', 'a 28-residue gut and nerve hormone', 28, None),
 'oxytocin': ('natural', 'a nine-residue hormone from the pituitary', 9, 'CYIQNCPLG'), 'gonadorelin': ('natural', 'the ten-residue hormone that releases LH and FSH', 10, None), 'hcg': ('protein', 'a two-chain glycoprotein hormone of the placenta', None, None),
 'cagrilintide': ('analogue', 'a 37-residue analogue of amylin with a fatty-acid chain', 37, None), 'survodutide': ('analogue', 'a 29-residue chain built on glucagon to hit two receptors', 29, None), 'mazdutide': ('analogue', 'a 39-residue chain built on oxyntomodulin', 39, None),
 'liraglutide': ('analogue', 'human GLP-1 with one swap and a fatty-acid chain', 31, None), 'exenatide': ('natural', 'a 39-residue peptide copied from Gila monster saliva', 39, None), '5-amino-1mq': ('small', 'a small molecule that blocks an enzyme, not a peptide', None, None),
 'glutathione': ('natural', 'the tripeptide antioxidant every cell makes', 3, 'GCG'), 'thymosin-beta-4': ('natural', 'the full 43-residue actin-binding protein', 43, None), 'kisspeptin-54': ('natural', 'the 54-residue parent of kisspeptin-10', 54, None),
 'noopept': ('small', 'a dipeptide-derived small molecule, not a true peptide', None, None), 'adipotide': ('designed', 'a homing sequence joined to a cell-killing sequence', None, None), 'teriparatide': ('fragment', 'the first 34 residues of parathyroid hormone', 34, None),
 'abaloparatide': ('analogue', 'a 34-residue analogue of parathyroid-hormone-related protein', 34, None), 'octreotide': ('analogue', 'an eight-residue cyclic analogue of somatostatin', 8, None), 'leuprolide': ('analogue', 'gonadorelin with two swaps so it lasts', 9, None),
 'desmopressin': ('analogue', 'vasopressin with two changes so it lasts and does not raise blood pressure', 9, None), 'glucagon': ('natural', 'the 29-residue pancreatic hormone', 29, None), 'insulin': ('protein', 'the two-chain 51-residue pancreatic hormone', 51, None),
 'calcitonin': ('natural', 'the 32-residue thyroid hormone, usually the salmon sequence', 32, None), 'ziconotide': ('natural', 'a 25-residue toxin copied from a cone snail, with three disulfide bridges', 25, None), 'larazotide': ('designed', 'an eight-residue chain built to tighten the gut barrier', 8, 'GGVLVQPG'),
 'vilon': ('designed', 'a two-residue chain from the Russian bioregulator family', 2, 'KE'), 'cortexin': ('extract', 'a mixture of fragments drawn from calf brain', None, None),
}
ROUTE_OF = {'protein': 'bio', 'extract': 'extract', 'small': 'small'}  # everything else is built one residue at a time on resin
LAWFUL = ('tolerated', 'listed', 'mixed', 'component')
def steps_for(c):
    rid = c['id'][2:] if c['id'].startswith('m-') else c['id']
    kind, note, n, seq = ORIGIN.get(rid, ('designed', 'a synthetic sequence', None, None))
    route = ROUTE_OF.get(kind, 'spps'); tr = c['track']; st = c['stations']; name = c['name'].split(' (')[0]
    first = {'fragment': '%s is a fragment of a natural protein: %s. Researchers cut the sequence out, wrote it down and tested it. The papers and patents behind it are the start of the chain.',
             'analogue': '%s is a natural hormone, rebuilt: %s. Chemists swapped or added residues so it lasts longer or binds harder; the sequence on paper, and its patents, come first.',
             'designed': '%s is a sequence written from scratch: %s. Nothing in the body makes it; the first copy was made in a reactor and screened for an effect.',
             'natural': '%s is a sequence copied letter for letter from nature: %s. It is made in a reactor, not harvested.',
             'protein': '%s is a full-size protein: %s. Too long to build one residue at a time, so its gene is copied into cells that grow it.',
             'extract': '%s is not one molecule but a soup: %s, standardised by weight rather than by sequence.',
             'small': '%s is not a peptide at all: %s. It is sold alongside them and made by ordinary organic chemistry.'}[kind] % (name, note)
    cycles = ('%d coupling cycles for %s' % (n, name)) if n and route == 'spps' else 'dozens of cycles'
    build = {'spps': 'Solid-phase synthesis: one protected amino acid is coupled to a chain growing on resin beads, washed, deprotected, and the next one added. %s, a day or more in the reactor.' % cycles,
             'bio': 'Recombinant: the gene for the protein is put into yeast or bacteria, the cells grow it in a bioreactor, and the protein is harvested from the broth.',
             'extract': 'Extraction: animal tissue is minced, digested and filtered. The mix of fragments that comes through is the product.',
             'small': 'Organic synthesis in a flask: reagents, heat and purification, the ordinary chemistry of small-molecule drugs.'}[route]
    crude = {'spps': 'Trifluoroacetic acid cuts the finished chain off the resin and strips the protecting groups. Cold ether drops it out as a crude white powder, typically 60 to 80 percent the right molecule.',
             'bio': 'The cells are broken open and the protein is caught on a capture column. Everything else in the broth is washed away.',
             'extract': 'The digest is concentrated and dried. What is in it depends on what went in.', 'small': 'The crude product is crystallised or dried. What is in it depends on the chemistry.'}[route]
    border = ('The manufacturer\'s own registered plants ship to its fill sites. For compounders, only API from makers on FDA\'s Green List clears customs under Import Alert 66-80.' if tr == 'brand' else
              'Freeze-dried bulk powder, cold-packed, with its certificate. The maker is FDA-registered, the importer declares it as a drug substance, and customs lets it through.' if tr in LAWFUL else
              'The grey market: powder declared as a research chemical and shipped by parcel. CBP opened 300 cartons at Cincinnati in 2026; what gets through carries no certificate anyone verified.')
    facility = {'brand': 'A licensed manufacturer under cGMP, inspected by FDA. The drug substance is received, quarantined, retested and released before anything is made.',
                'component': 'A 503B outsourcing facility: FDA-registered and inspected, making batches to cGMP without a prescription for each vial.',
                'closed': 'No lawful facility. No listing permits it, no tolerance covers it, no approved product exists. The gate stays down.',
                'none': 'No lawful facility outside a clinical trial. The cart is shunted onto the research-use-only siding.'}.get(tr, 'A 503A compounding pharmacy, licensed by its state board: one prescription, one preparation, under USP standards.')
    S = lambda i: st[i][2]
    steps = [[0, 'Discovery and design', first], [0, 'Raw materials', 'Protected amino acids by the kilo, resin beads, solvents and reagents, most of it made in China, India and Europe. The supplier\'s paperwork is the first quality gate; a drum with no lineage becomes a peptide with none.'],
             [0, 'Building the chain', build], [0, 'Cleavage and crude product', crude],
             [1, 'Purification', 'Preparative HPLC: the crude powder goes down a column under pressure and comes off in fractions. The pure fractions are pooled and the counter-ion exchanged, usually to acetate, before freeze-drying.'],
             [1, 'Identity and the certificate', 'Mass spectrometry confirms the molecule, HPLC the purity, then water, counter-ion, endotoxin and bioburden. The certificate of analysis is the lot\'s identity card; a lawful maker also files a Drug Master File with FDA. ' + S(1)],
             [0, 'Shipping and the border', border + ' ' + S(0)], [2, 'The facility', facility + ' ' + S(2)],
             [2, 'Formulation', 'In a cleanroom under USP <797>: the powder dissolved in water for injection with buffers and a preservative, filtered through a 0.22-micron membrane into a sterile vessel. Gowned hands, laminar airflow, every surface wiped.'],
             [2, 'Fill and finish', 'Vials filled by volume, freeze-dried if the peptide is unstable in water, stoppered and capped. Then the lot is tested: sterility, endotoxin, potency, and a beyond-use date is set.'],
             [3, 'Labeling and release', 'The label: drug, strength, lot, beyond-use date, storage, and for a compounded vial the patient\'s name. The pharmacist in charge or the quality unit signs the release; adverse events are reported.'],
             [3, 'Prescribing and dispensing', 'A prescriber, a prescription, a pharmacy. The vial ships cold with instructions for reconstituting and storing it, and the patient draws up the dose at home. ' + S(3)]]
    c['steps'] = [[st[k][0], nm, tx] for k, nm, tx in steps]
    c['origin'] = kind; c['route'] = route; c['seq'] = seq; c['n'] = n
    if tr == 'closed': c['stopStep'] = 7   # the facility gate
    if tr == 'none': c['sidingStep'] = 6   # shunted at the border
for c in CARDS + MORE_CARDS: steps_for(c)
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
