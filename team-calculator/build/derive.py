"""Compact per-hospital public facts and ratios for the page (data_hospital_slim.json). The page derives prefill values from the ratios; see TEAM_Calculator_Model_Spec.md."""
import json,os
D=json.load(open('data_hospital_metrics.json')); M=D['h']; NAT=D['nat']
SSI_P75=0.0874   # 75th percentile of the Medicare SSI share (DSHPCT minus Medicaid percentage) across IPPS hospitals, FY2027 impact file
def r(v,d=1): return None if v is None else round(v,d)
def ratio(a,b): return round(a/b,3) if a is not None and b else None
out={}; natsp={}
for c,m in M.items():
    sp=m.get('sp30') or {}
    for k,v in sp.items():
        if v[2] is not None: natsp[k]=round(v[2])
    tot_h=sum(v[0] for v in sp.values() if v[0] is not None); tot_s=sum(v[1] for v in sp.values() if v[1] is not None)
    cty=m.get('cty') or {}; nc=NAT['cty']
    ssi_share=(m['dsh']-m['mcdpct']) if m.get('dsh') is not None and m.get('mcdpct') is not None else None
    nh=m.get('nh') or {}
    out[c]={'n':m.get('n'),'ci':m.get('ci'),'st':m.get('st'),'co':m.get('co'),'beds':int(m['beds']) if m.get('beds') else None,'rbr':r(m.get('rbr'),2),'sr':m.get('sr'),'urb':m.get('urb'),'ssi':r(ssi_share,3),'dual':r(cty.get('dual'),3),
        'q':{k:m.get(k) for k in ['rhk','rcb','chk','p90','p12','ssi','ehk','ecb'] if m.get(k) is not None},
        'cx':{k:v for k,v in (m.get('cqsx') or {}).items() if v is not None},
        'sp':{k:[round(v[0]),round(v[1])] for k,v in sp.items() if k in ('snf','hh','ip','op','hsp') and v[0] is not None and v[1] is not None},
        'tot':[round(m['mspb'][0]),round(m['mspb'][1])] if m.get('mspb') and m['mspb'][0] and m['mspb'][1] else None,
        'cty':{'nm':cty.get('name'),'ma':cty.get('ma25'),'snfd':r(cty.get('snfdays'),0),'irfpc':r(cty.get('irfpc'),0),'hhpc':r(cty.get('hhpc'),0),'readm':r((cty.get('readm') or 0)*100,1) if cty.get('readm') else None,'snfprov':int(cty['snfprov']) if cty.get('snfprov') else None,'hhprov':int(cty['hhprov']) if cty.get('hhprov') else None},
        'nh':{'n':nh.get('n'),'r':nh.get('rating'),'w':nh.get('waiver'),'rh':nh.get('rehosp')} if nh else None,
        'ip':{d:v[0] for d,v in m.get('ip24',{}).items()},'op':(m.get('op24') or {}).get('5115',[None])[0],
        'rt':{'pac':ratio(tot_h,tot_s) if tot_h else None,'snf':ratio(sp['snf'][0],sp['snf'][1]) if sp.get('snf') and sp['snf'][0] is not None else None,'ip':ratio(sp['ip'][0],sp['ip'][1]) if sp.get('ip') and sp['ip'][0] is not None else None,'days':ratio(cty.get('snfdays'),nc['snfdays']),'irf':ratio(cty.get('irfpc'),nc['irfpc']),'vte':ratio(m.get('p12'),NAT['p12']),'ssi':r(m['ssi'],2) if m.get('ssi') is not None and (m.get('ssin') or 0)>=1 else None},
        'sn':bool(ssi_share is not None and ssi_share>=SSI_P75),'rural':m.get('urb')=='RURAL'}
    for k in list(out[c]['cty']): 
        if out[c]['cty'][k] is None: del out[c]['cty'][k]
    for k in list(out[c]):
        if out[c][k] in (None,{},[]): del out[c][k]
per=next(m['per'] for m in M.values() if m.get('per') and 'sp' in m['per'] and 'rhk' in m['per'] and 'p90' in m['per'])
nat={'q':{k:NAT[k] for k in ['rhk','rcb','chk','p90','p12']},'ma':NAT['ma25'],'cty':{'snfd':r(NAT['cty']['snfdays'],0),'irfpc':r(NAT['cty']['irfpc'],0),'hhpc':r(NAT['cty']['hhpc'],0),'readm':r(NAT['cty']['readm']*100,1)},'sp':natsp,'ssip75':SSI_P75,'per':per,'drg':{d:v[0] for d,v in NAT['drg'].items()}}
json.dump({'nat':nat,'h':out},open('data_hospital_slim.json','w'),separators=(',',':'))
print('slim KB',os.path.getsize('data_hospital_slim.json')//1024,'hospitals',len(out),'sn',sum(1 for v in out.values() if v['sn']),'rural',sum(1 for v in out.values() if v['rural']))
print('per',per); print('natsp',natsp)
for c in ['330214','100088','040017','390256']: print(c,json.dumps(out[c])[:900])
