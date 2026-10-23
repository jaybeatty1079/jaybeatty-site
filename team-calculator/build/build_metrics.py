"""Assemble public hospital metrics for every TEAM participant (plus central-PA candidates).
Sources: Care Compare files in cms-sources/carecompare, data.cms.gov pulls in cms-sources/pulls,
FY2027 IPPS impact file, TEAM Q4-2026 qualified SNF list. Run from the team-calculator folder."""
import csv,json,os,re,collections,statistics,urllib.request,urllib.parse
S='cms-sources/'; CC=S+'carecompare/'; PU=S+'pulls/'
def num(s):
    try:
        v=float(str(s).replace(',','').replace('$','').replace('%',''))
        return v
    except: return None
def rd(f):
    with open(f,newline='',encoding='utf-8-sig') as fh:
        for r in csv.DictReader(fh): yield r
parts=json.load(open('data_participants.json'))
EXTRA=['390004','390058','390256']
ccns=[p['ccn'] for p in parts]+EXTRA
M={c:{} for c in ccns}
# ---- Care Compare: all hospitals (for percentiles) ----
ALL=collections.defaultdict(dict)
for r in rd(CC+'general.csv'):
    c=r['Facility ID']
    if c in M: M[c].update(n=r['Facility Name'].title(),ci=r['City/Town'].title(),st=r['State'],co=r['County/Parish'].title(),fipsco=None,ty=r['Hospital Type'],ow=r['Hospital Ownership'],sr=num(r['Hospital overall rating']))
U={'READM_30_HIP_KNEE':'rhk','READM_30_CABG':'rcb'}
for r in rd(CC+'unplanned.csv'):
    k=U.get(r['Measure ID']); 
    if not k: continue
    v=num(r['Score']); c=r['Facility ID']
    if v is not None: ALL[k][c]=v
    if c in M: M[c][k]=v; M[c][k+'n']=num(r['Denominator']); M[c].setdefault('per',{})[k]=r['Start Date'][-4:]+'-'+r['End Date'][-4:]
Cp={'COMP_HIP_KNEE':'chk','PSI_90':'p90','PSI_12':'p12'}
for r in rd(CC+'complications.csv'):
    k=Cp.get(r['Measure ID'])
    if not k: continue
    v=num(r['Score']); c=r['Facility ID']
    if v is not None: ALL[k][c]=v
    if c in M: M[c][k]=v; M[c].setdefault('per',{})[k]=r['Start Date'][-4:]+'-'+r['End Date'][-4:]
for r in rd(CC+'hai.csv'):
    c=r['Facility ID']
    if c not in M: continue
    if r['Measure ID']=='HAI_3_SIR': M[c]['ssi']=num(r['Score']); M[c].setdefault('per',{})['ssi']=r['Start Date'][-4:]+'-'+r['End Date'][-4:]
    if r['Measure ID']=='HAI_3_ELIGCASES': M[c]['ssin']=num(r['Score'])
    if r['Measure ID']=='HAI_3_DOPC': M[c]['ssid']=num(r['Score'])
H={'READM-30-HIP-KNEE-HRRP':'ehk','READM-30-CABG-HRRP':'ecb'}
# all six HRRP conditions, discharge-weighted, for every hospital in the file: the broadest public readmission footprint a hospital has
# (Care Compare's hospital-wide measure moved to the hybrid HWR in 2026 and carries no scores yet, so this stands in for it)
E6=collections.defaultdict(list)
for r in rd(CC+'hrrp.csv'):
    c=r['Facility ID']; err=num(r['Excess Readmission Ratio']); n=num(r['Number of Discharges'])
    if err is not None and n: E6[c].append((err,n))
    k=H.get(r['Measure Name'])
    if not k or c not in M: continue
    M[c][k]=err; M[c][k+'p']=num(r['Predicted Readmission Rate']); M[c][k+'e']=num(r['Expected Readmission Rate'])
for c,L in E6.items():
    tot=sum(n for _,n in L); v=round(sum(e*n for e,n in L)/tot,4)
    ALL['e6'][c]=v
    if c in M: M[c]['e6']=v; M[c]['e6k']=len(L); M[c]['e6hi']=sum(1 for e,_ in L if e>1); M[c]['e6n']=int(tot)
# CMS 90-day hip/knee payment measure (PAYM_90_HIP_KNEE): the closest public cousin of a TEAM joint episode. Retired from the live Care Compare files in 2025,
# so it comes from the 30 April 2025 archive snapshot (performance period July 2020 to March 2023). Dollars risk-standardized against the national average.
PAYNAT={}; PAYDIV={}
DIVSTATES={1:'CT ME MA NH RI VT',2:'NJ NY PA',3:'IL IN MI OH WI',4:'IA KS MN MO NE ND SD',5:'DE DC FL GA MD NC SC VA WV',6:'AL KY MS TN',7:'AR LA OK TX',8:'AZ CO ID MT NV NM UT WY',9:'AK CA HI OR WA AS GU MP PR VI'}
S2D={st:d for d,ss in DIVSTATES.items() for st in ss.split()}
for r in rd(CC+'payment_national_2025-04-30.csv'):
    if r['Measure ID']=='PAYM_90_HIP_KNEE': PAYNAT['phk']=num(r['National Payment'])
for r in rd(CC+'payment_2025-04-30.csv'):
    if r['Payment Measure ID']!='PAYM_90_HIP_KNEE': continue
    c=r['Facility ID']; v=num(r['Payment'])
    if v is not None: ALL['phk'][c]=v
    if c in M and v is not None:
        M[c]['phk']=v; M[c]['phkn']=num(r['Denominator']); M[c]['phkc']={'Less Than the National Average Payment':'lo','Greater Than the National Average Payment':'hi'}.get(r['Payment Category'],'avg')
        M[c].setdefault('per',{})['phk']=r['Start Date'][-4:]+'-'+r['End Date'][-4:]
    PAYDIV.setdefault(S2D.get(r['State']),[]).append(v) if v is not None else None
# TEAM prices against the census division, so the benchmark for a hospital's payment measure is its division's simple mean of hospital values (the published national figure is CMS's patient-level number)
PAYNAT['phkdiv']={d:round(statistics.mean(L)) for d,L in PAYDIV.items() if d}
# spending by claim: 30 days after discharge + complete episode
CT={'Skilled Nursing Facility':'snf','Home Health Agency':'hh','Inpatient':'ip','Outpatient':'op','Hospice':'hsp','Carrier':'car','Durable Medical Equipment':'dme'}
for r in rd(CC+'mspb_claim.csv'):
    c=r['Facility ID']
    if c not in M: continue
    h=num(r['Avg Spndg Per EP Hospital']); n=num(r['Avg Spndg Per EP National']); s=num(r['Avg Spndg Per EP State'])
    if r['Period'].startswith('1 through 30'):
        k=CT.get(r['Claim Type'])
        if k: M[c].setdefault('sp30',{})[k]=[h,s,n]
    elif r['Period']=='Complete Episode': M[c]['mspb']=[h,s,n]
    elif r['Period'].startswith('During'):
        k=CT.get(r['Claim Type'])
        if k in ('ip','car'): M[c].setdefault('spidx',{})[k]=[h,s,n]
    M[c].setdefault('per',{})['sp']=r['Start Date'][-4:]+'-'+r['End Date'][-4:]
for c in M:
    if 'mspb' in M[c] and M[c]['mspb'][0] and M[c]['mspb'][2]: ALL['mspbr'][c]=M[c]['mspb'][0]/M[c]['mspb'][2]
# ---- FY2027 impact file ----
imp={}
with open(S+'ipps-fy2027/FY 2027 IPPS Impact File - Final Rule.txt',encoding='utf-8',errors='ignore') as f:
    lines=f.read().split('\n')
hi=next(i for i,l in enumerate(lines) if 'Provider Number' in l); hdr=[h.strip().lstrip('\ufeff') for h in lines[hi].split('\t')]
for ln in lines[hi+1:]:
    x=ln.split('\t')
    if len(x)<30: continue
    d=dict(zip(hdr,x)); imp[d['Provider Number']]=d
for c in M:
    d=imp.get(c)
    if not d: continue
    M[c].update(beds=num(d['Beds']),dsh=num(d['DSHPCT']),rbr=num(d['Resident to Bed Ratio']),urb=d['URGEO'],fipsco=d['FIPS County Code'],reg=num(d['Region']),mdh=d['MDH Flag'].strip()=='Y',lvh=d['Low Volume Hospital Adjustment'].strip() not in ('','1','1.0'),medpct=num(d['Medicare Percentage']),mcdpct=num(d['Medicaid Percentage']),adc=num(d['Average Daily Census']),ptype=d['Provider Type'])
# HCRIS 2024 fallback for beds + Medicare share
hc={r['Provider CCN']:r for r in json.load(open(PU+'hcris2024.json'))}
for c in M:
    r=hc.get(c)
    if not r: continue
    if M[c].get('beds') is None: M[c]['beds']=num(r['Number of Beds'])
    td=num(r['Total Discharges (V + XVIII + XIX + Unknown)']); md=num(r['Total Discharges Title XVIII'])
    if td and md: M[c]['mcrshare']=round(md/td,3)
    M[c]['hcris_rural']=r['Rural Versus Urban']; M[c]['fy']=r['Fiscal Year End Date'][-4:]
    if not M[c].get('co'): M[c]['co']=r['County'].title()
# ---- Inpatient 2024 by provider and service, all TEAM DRGs, all hospitals ----
DRGS=['231','232','233','234','235','236','329','330','331','402','426','427','428','429','430','447','448','450','451','469','470','471','472','473','480','481','482','521','522']
def get(ds,params):
    q='&'.join(f'{urllib.parse.quote(k)}={urllib.parse.quote(str(v))}' for k,v in params.items())
    return json.load(urllib.request.urlopen(f'https://data.cms.gov/data-api/v1/dataset/{ds}/data?{q}',timeout=180))
ipf=PU+'inpatient2024_teamdrgs_all.json'
if os.path.exists(ipf): ip=json.load(open(ipf))
else:
    ip=[]
    for d in DRGS:
        off=0
        while True:
            r=get('690ddc6c-2767-4618-b277-420ffb2bf27c',{'size':5000,'offset':off,'filter[DRG_Cd]':d}); ip+=r
            if len(r)<5000: break
            off+=5000
    json.dump(ip,open(ipf,'w'))
print('inpatient rows',len(ip))
for r in ip:
    c=r['Rndrng_Prvdr_CCN']
    if c in M: M[c].setdefault('ip24',{})[r['DRG_Cd']]=[int(r['Tot_Dschrgs']),round(num(r['Avg_Mdcr_Pymt_Amt'])),round(num(r['Avg_Tot_Pymt_Amt']))]
nat={r['DRG_Cd']:r for r in json.load(open(PU+'inpatient2024_geo_service_teamdrgs.json')) if r['Rndrng_Prvdr_Geo_Lvl']=='National'}
NATDRG={d:[int(nat[d]['Tot_Dschrgs']),round(num(nat[d]['Avg_Mdcr_Pymt_Amt'])),round(num(nat[d]['Avg_Tot_Pymt_Amt']))] for d in nat}
# ---- Outpatient 2024 APC 5114-5116 ----
for r in json.load(open(PU+'outpatient2024_apc5114_5116.json')):
    c=r['Rndrng_Prvdr_CCN']
    if c in M: M[c].setdefault('op24',{})[r['APC_Cd']]=[int(num(r['CAPC_Srvcs']) or num(r['Bene_Cnt']) or 0),round(num(r['Avg_Mdcr_Pymt_Amt']) or 0)]
# ---- County context ----
geo={r['BENE_GEO_CD'].strip():r for r in json.load(open(PU+'geovar2024.json')) if r['BENE_GEO_LVL']=='County'}
geoS={r['BENE_GEO_DESC']:r for r in json.load(open(PU+'geovar2024.json')) if r['BENE_GEO_LVL']=='State'}
geoN=[r for r in json.load(open(PU+'geovar2024.json')) if r['BENE_GEO_LVL']=='National'][0]
def gpick(r):
    return {k2:num(r.get(k1)) for k1,k2 in [('MA_PRTCPTN_RATE','ma'),('BENE_DUAL_PCT','dual'),('TOT_MDCR_STDZD_PYMT_PC','totpc'),('SNF_MDCR_STDZD_PYMT_PC','snfpc'),('SNF_MDCR_STDZD_PYMT_PER_USER','snfuser'),('SNF_CVRD_DAYS_PER_1000_BENES','snfdays'),('SNF_CVRD_STAYS_PER_1000_BENES','snfstays'),('IRF_MDCR_STDZD_PYMT_PC','irfpc'),('BENES_IRF_PCT','irfpct'),('HH_MDCR_STDZD_PYMT_PC','hhpc'),('BENES_HH_PCT','hhpct'),('ACUTE_HOSP_READMSN_PCT','readm'),('IP_CVRD_STAYS_PER_1000_BENES','ipstays'),('BENES_TOTAL_CNT','benes'),('BENE_AVG_AGE','age')]}
en={r['BENE_FIPS_CD'].strip():r for r in json.load(open(PU+'enrollment_2025.json')) if r['BENE_GEO_LVL']=='County'}
enS={r['BENE_STATE_ABRVTN']:r for r in json.load(open(PU+'enrollment_2025.json')) if r['BENE_GEO_LVL']=='State'}
enN=[r for r in json.load(open(PU+'enrollment_2025.json')) if r['BENE_GEO_LVL']=='National'][0]
def mashare(r):
    t=num(r['TOT_BENES']); m=num(r['MA_AND_OTH_BENES']); return round(m/t,3) if t and m is not None else None
ms=collections.defaultdict(dict)
for r in json.load(open(PU+'marketsat_snf_hh_latest.json')): ms[r['state_fips'].strip()+r['county_fips'].strip()][r['type_of_service']]=r
nh=collections.defaultdict(list)
for r in rd(CC+'nh_provider.csv'): nh[(r['State'],r['County/Parish'].upper())].append(r)
nhq={}
for r in rd(CC+'nh_claims_qm.csv'):
    if r['Measure Code']=='521': nhq[r['CMS Certification Number (CCN)']]=num(r['Adjusted Score'])
waiver=set(d['CCN'] for d in json.load(open(S+'team-2026/team-snfwaiver-q4-2026.json')))
for c in M:
    m=M[c]; f=m.get('fipsco')
    if f and f in geo: m['cty']=gpick(geo[f]); m['cty']['name']=geo[f]['BENE_GEO_DESC']
    if f and f in en: m.setdefault('cty',{})['ma25']=mashare(en[f])
    if f and f in ms:
        s=ms[f].get('Skilled Nursing Facility'); h=ms[f].get('Home Health')
        if s: m.setdefault('cty',{})['snfprov']=num(s['number_of_providers']); m['cty']['snfusers']=num(s['percentage_of_users_out_of_ffs_beneficiaries'])
        if h: m.setdefault('cty',{})['hhprov']=num(h['number_of_providers'])
    key=(m.get('st'),(m.get('co') or '').upper())
    L=nh.get(key,[])
    if L:
        rat=[num(x['Overall Rating']) for x in L if num(x['Overall Rating']) is not None]
        reh=[nhq[x['CMS Certification Number (CCN)']] for x in L if nhq.get(x['CMS Certification Number (CCN)']) is not None]
        m['nh']={'n':len(L),'rating':round(statistics.mean(rat),2) if rat else None,'waiver':sum(1 for x in L if x['CMS Certification Number (CCN)'] in waiver),'rehosp':round(statistics.mean(reh),1) if reh else None,'beds':sum(num(x['Number of Certified Beds']) or 0 for x in L)}
# ---- percentiles & CQS proxy ----
def pct_rank(vals,v,lower_better=True):
    xs=sorted(vals); 
    if v is None or not xs: return None
    below=sum(1 for x in xs if x<v); eq=sum(1 for x in xs if x==v)
    p=(below+0.5*eq)/len(xs)*100
    return round(100-p if lower_better else p,1)
# CMS scales measures against hospitals eligible for TEAM: IPPS acute care hospitals, excluding Maryland (quality scoring fact sheet). Use the FY2027 impact file as the IPPS list.
ELIG=set(c for c in imp if not c.startswith('21'))
ALLE={k:{c:v for c,v in d.items() if c in ELIG} for k,d in ALL.items()}
for c in M:
    m=M[c]; sc={}
    for k in ['rhk','rcb','chk','p90','p12','e6','phk']:
        if m.get(k) is not None and k in ALLE: sc[k]=pct_rank(ALLE[k].values(),m[k],True)
    if c in ALL['mspbr']: sc['mspbr']=pct_rank(ALLE['mspbr'].values(),ALL['mspbr'][c],True); m['mspbr']=round(ALL['mspbr'][c],3)
    m['pct']=sc
    # proxy CQS: readmission proxy (rhk, rcb weighted by denominators) 50% ; PSI-90 50%; PRO-PM not public -> 50 for LEJR share handled on page
    rd_parts=[(sc[k],m.get(k+'n') or 1) for k in ('rhk','rcb') if k in sc]
    rdp=sum(p*w for p,w in rd_parts)/sum(w for p,w in rd_parts) if rd_parts else None
    # readmission component: the six-condition HRRP percentile when the hospital has one (closest public stand-in for hospital-wide readmission), else the hip/knee and CABG proxy
    m['cqsx']={'readm':sc['e6'] if 'e6' in sc else (round(rdp,1) if rdp is not None else None),'readm_hk':round(rdp,1) if rdp is not None else None,'readm_src':'hrrp6' if 'e6' in sc else ('hk' if rdp is not None else None),'psi90':sc.get('p90')}
NAT={'rhk':round(statistics.median(ALLE['rhk'].values()),1),'rcb':round(statistics.median(ALLE['rcb'].values()),1),'chk':round(statistics.median(ALLE['chk'].values()),1),'p90':round(statistics.median(ALLE['p90'].values()),2),'p12':round(statistics.median(ALLE['p12'].values()),2),'phk':PAYNAT.get('phk'),'phkdiv':PAYNAT.get('phkdiv'),'elig_n':len(ELIG),
     'cty':gpick(geoN),'ma25':mashare(enN),'drg':NATDRG,'states':{k:gpick(v) for k,v in geoS.items()},'ma25_state':{k:mashare(v) for k,v in enS.items()}}
NAT['cty']['name']='National'
json.dump({'meta':{'built':'2026-10-18','sources':{'carecompare':'Care Compare hospital files downloaded 2026-10-18 (Unplanned Hospital Visits and Complications released 2026-09-10; HAI and MSPB 2026-07-22; HRRP and Spending by Claim FY2026 2026-01-26); hip/knee 90-day payment measure from the 2025-04-30 archive snapshot (period July 2020 to March 2023)','impact':'FY2027 IPPS final rule impact file (Aug 2026)','hcris':'Hospital Provider Cost Report 2024 (data.cms.gov)','inpatient':'Medicare Inpatient Hospitals by Provider and Service CY2024','outpatient':'Medicare Outpatient Hospitals by Provider and Service CY2024, APC 5114-5116','geovar':'Medicare Geographic Variation by National, State & County 2024','enrollment':'Medicare Monthly Enrollment 2025 (year)','marketsat':'Market Saturation & Utilization State-County, 2025','nh':'Nursing Home Provider Information and Medicare Claims Quality Measures, Sep 2026','waiver':'TEAM Qualified SNF List Q4 2026'}},'nat':NAT,'h':M},open('data_hospital_metrics.json','w'))
print('hospitals',len(M),'size KB',os.path.getsize('data_hospital_metrics.json')//1024)
have=lambda k: sum(1 for c in M if M[c].get(k) not in (None,{},[]))
for k in ['n','beds','dsh','rhk','rcb','chk','p90','p12','ssi','ehk','e6','phk','sp30','mspb','ip24','op24','cty','nh']: print(' ',k,have(k))
print('NAT',{k:NAT[k] for k in ['rhk','rcb','chk','p90','p12','phk','ma25']}, {k:NAT['cty'][k] for k in ['snfpc','snfdays','irfpc','hhpc','readm','ma']})
