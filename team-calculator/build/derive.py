"""Compact per-hospital public facts and ratios for the page (data_hospital_slim.json). The page derives prefill values from the ratios; see TEAM_Calculator_Model_Spec.md."""
import json,os
D=json.load(open('data_hospital_metrics.json')); M=D['h']; NAT=D['nat']
SSI_P75=0.0874   # 75th percentile of the Medicare SSI share (DSHPCT minus Medicaid percentage) across IPPS hospitals, FY2027 impact file
def r(v,d=1): return None if v is None else round(v,d)
def ratio(a,b): return round(a/b,3) if a is not None and b else None
DIVSTATES={1:'CT ME MA NH RI VT',2:'NJ NY PA',3:'IL IN MI OH WI',4:'IA KS MN MO NE ND SD',5:'DE DC FL GA MD NC SC VA WV',6:'AL KY MS TN',7:'AR LA OK TX',8:'AZ CO ID MT NV NM UT WY',9:'AK CA HI OR WA AS GU MP PR VI'}
S2D={st:d for d,ss in DIVSTATES.items() for st in ss.split()}
# census-division comparator for the 30-day spending file: hospital-count-weighted average of state values (TEAM prices by division, not state)
import csv,collections
CT={'Skilled Nursing Facility':'snf','Home Health Agency':'hh','Inpatient':'ip','Outpatient':'op','Hospice':'hsp','Carrier':'car','Durable Medical Equipment':'dme','Total':'tot'}
stval={}; sthosp=collections.defaultdict(set)
for row in csv.DictReader(open('cms-sources/carecompare/mspb_claim.csv',newline='',encoding='utf-8-sig')):
    k=CT.get(row['Claim Type']); st=row['State']
    if not k: continue
    if row['Period'].startswith('1 through 30') or row['Period']=='Complete Episode':
        try: stval[(st,k)]=float(row['Avg Spndg Per EP State'])
        except: pass
        sthosp[st].add(row['Facility ID'])
DIV={}
for d,ss in DIVSTATES.items():
    for k in set(CT.values()):
        num=sum(stval.get((st,k),0)*len(sthosp[st]) for st in ss.split() if (st,k) in stval); den=sum(len(sthosp[st]) for st in ss.split() if (st,k) in stval)
        if den: DIV.setdefault(d,{})[k]=round(num/den)
# standardized SNF payment per day by state (Geographic Variation 2024): per user / (days per 1,000 / (share using SNF x 1,000))
SNFDAY={}
for row in json.load(open('cms-sources/pulls/geovar2024.json')):
    if row['BENE_GEO_LVL'] in ('State','National'):
        try:
            pu=float(row['SNF_MDCR_STDZD_PYMT_PER_USER']); d1000=float(row['SNF_CVRD_DAYS_PER_1000_BENES']); pct=float(row['BENES_SNF_PCT'])
            SNFDAY['US' if row['BENE_GEO_LVL']=='National' else row['BENE_GEO_DESC']]=max(450,min(900,round(pu/(d1000/(pct*1000)))))  # clamped: swing-bed-heavy states (MT, AK) show per-diems above $1,000 that do not describe a freestanding SNF
        except: pass
HC={}
for row in json.load(open('cms-sources/pulls/hcris2024.json')):
    try:
        npr=float(row['Net Patient Revenue']); ni=float(row['Net Income from Service to Patients'])
        if npr>0: HC[row['Provider CCN']]={'rev':round(npr),'m':round(ni/npr*100,1),'fy':row['Fiscal Year End Date'][:7]}
    except: pass
out={}; natsp={}
for c,m in M.items():
    sp=m.get('sp30') or {}
    for k,v in sp.items():
        if v[2] is not None: natsp[k]=round(v[2])
    dv_=DIV.get(S2D.get(m.get('st')),{})
    tot_h=sum(v[0] for v in sp.values() if v[0] is not None); tot_s=sum(dv_.get(k,0) for k,v in sp.items() if v[0] is not None and k in dv_)
    cty=m.get('cty') or {}; nc=NAT['cty']
    ssi_share=(m['dsh']-m['mcdpct']) if m.get('dsh') is not None and m.get('mcdpct') is not None else None
    nh=m.get('nh') or {}
    out[c]={'n':m.get('n'),'ci':m.get('ci'),'st':m.get('st'),'co':m.get('co'),'beds':int(m['beds']) if m.get('beds') else None,'rbr':r(m.get('rbr'),2),'sr':m.get('sr'),'urb':m.get('urb'),'ssi':r(ssi_share,3),'dual':r(cty.get('dual'),3),
        'q':{k:m.get(k) for k in ['rhk','rcb','chk','p90','p12','ssi','ehk','ecb','ehkp','ehke','ecbp','ecbe','e6','e6k','e6hi','e6n','phk','phkn','phkc'] if m.get(k) is not None},
        'cx':{k:v for k,v in (m.get('cqsx') or {}).items() if v is not None},
        'sp':{k:[round(v[0]),dv_.get(k)] for k,v in sp.items() if k in ('snf','hh','ip','op','hsp') and v[0] is not None and k in dv_},
        'tot':[round(m['mspb'][0]),dv_.get('tot')] if m.get('mspb') and m['mspb'][0] and dv_.get('tot') else None,
        'cty':{'nm':cty.get('name'),'ma':cty.get('ma25'),'snfd':r(cty.get('snfdays'),0),'irfpc':r(cty.get('irfpc'),0),'hhpc':r(cty.get('hhpc'),0),'readm':r((cty.get('readm') or 0)*100,1) if cty.get('readm') else None,'snfprov':int(cty['snfprov']) if cty.get('snfprov') else None,'hhprov':int(cty['hhprov']) if cty.get('hhprov') else None},
        'nh':{'n':nh.get('n'),'r':nh.get('rating'),'w':nh.get('waiver'),'rh':nh.get('rehosp')} if nh else None,
        'ip':{d:v[0] for d,v in m.get('ip24',{}).items()},'op':(m.get('op24') or {}).get('5115',[None])[0],
        'rt':{'pac':ratio(tot_h,tot_s) if tot_h and tot_s else None,'snf':ratio(sp['snf'][0],dv_.get('snf')) if sp.get('snf') and sp['snf'][0] is not None else None,'ip':ratio(sp['ip'][0],dv_.get('ip')) if sp.get('ip') and sp['ip'][0] is not None else None,'days':ratio(cty.get('snfdays'),nc['snfdays']),'irf':ratio(cty.get('irfpc'),nc['irfpc']),'vte':ratio(m.get('p12'),NAT['p12']),'ssi':r(m['ssi'],2) if m.get('ssi') is not None and (m.get('ssin') or 0)>=1 else None},
        'fin':HC.get(c),
        'sn':bool(ssi_share is not None and ssi_share>=SSI_P75),'rural':m.get('urb')=='RURAL'}
    for k in list(out[c]['cty']): 
        if out[c]['cty'][k] is None: del out[c]['cty'][k]
    for k in list(out[c]):
        if out[c][k] in (None,{},[]): del out[c][k]
per=next(m['per'] for m in M.values() if m.get('per') and 'sp' in m['per'] and 'rhk' in m['per'] and 'p90' in m['per'])
nat={'q':{k:NAT[k] for k in ['rhk','rcb','chk','p90','p12','phk'] if NAT.get(k) is not None},'phkdiv':NAT.get('phkdiv'),'elig_n':NAT.get('elig_n'),'ma':NAT['ma25'],'dual':NAT['cty'].get('dual'),'snfday':SNFDAY,'div':DIV,'cty':{'snfd':r(NAT['cty']['snfdays'],0),'irfpc':r(NAT['cty']['irfpc'],0),'hhpc':r(NAT['cty']['hhpc'],0),'readm':r(NAT['cty']['readm']*100,1)},'sp':natsp,'ssip75':SSI_P75,'per':per,'drg':{d:v[0] for d,v in NAT['drg'].items()}}
json.dump({'nat':nat,'h':out},open('data_hospital_slim.json','w'),separators=(',',':'))
print('slim KB',os.path.getsize('data_hospital_slim.json')//1024,'hospitals',len(out),'sn',sum(1 for v in out.values() if v['sn']),'rural',sum(1 for v in out.values() if v['rural']))
print('per',per); print('natsp',natsp)
for c in ['330214','100088','040017','390256']: print(c,json.dumps(out[c])[:900])
