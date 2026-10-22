/* TEAM Episode Calculator engine: the reconciliation math and reference tables, with no DOM and no page state.
 * Loaded by the page (window.TEAMEngine) and by tests/engine.test.js (require). Keep this file pure: inputs in, numbers out.
 * Sources for every rule are in TEAM_Calculator_Model_Spec.md; checks against CMS worked examples are in tests/ and on the page. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TEAMEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
'use strict';
/* ---------- reference data ---------- */
const DIVS={1:'New England',2:'Middle Atlantic',3:'East North Central',4:'West North Central',5:'South Atlantic',6:'East South Central',7:'West South Central',8:'Mountain',9:'Pacific and territories'};
const DIVSTATES={1:'CT ME MA NH RI VT',2:'NJ NY PA',3:'IL IN MI OH WI',4:'IA KS MN MO NE ND SD',5:'DE DC FL GA MD NC SC VA WV',6:'AL KY MS TN',7:'AR LA OK TX',8:'AZ CO ID MT NV NM UT WY',9:'AK CA HI OR WA AS GU MP PR VI'};
const STATE2DIV={};for(const d in DIVSTATES)DIVSTATES[d].split(' ').forEach(s=>STATE2DIV[s]=+d);
const CATS=[
 {key:'lejr',cat:'MS-Lower extremity joint replacement',label:'Lower extremity joint replacement',short:'LEJR',disc:2,drgs:[['469','Major hip and knee joint replacement or reattachment w MCC, or total ankle replacement'],['470','Major hip and knee joint replacement or reattachment w/o MCC'],['521','Hip replacement w principal dx of hip fracture w MCC'],['522','Hip replacement w principal dx of hip fracture w/o MCC'],['470-OP','Outpatient knee or hip replacement (HCPCS 27447, 27130; CMS reports these under MS-DRG 470 and prices them at its target). Prefilled from APC 5115 services, an upper bound that also holds other Level 5 procedures such as shoulder replacement; edit to your count']]},
 {key:'shfft',cat:'IP-Surgical hip/femur fracture treatment',label:'Surgical hip and femur fracture treatment',short:'Hip/femur fracture',disc:2,drgs:[['480','Hip and femur procedures except major joint w MCC'],['481','Hip and femur procedures except major joint w CC'],['482','Hip and femur procedures except major joint w/o CC/MCC']]},
 {key:'cabg',cat:'IP-Coronary artery bypass graft',label:'Coronary artery bypass graft',short:'CABG',disc:1.5,drgs:[['231','CABG w PTCA w MCC'],['232','CABG w PTCA w/o MCC'],['233','CABG w cardiac cath w MCC'],['234','CABG w cardiac cath w/o MCC'],['235','CABG w/o cardiac cath w MCC'],['236','CABG w/o cardiac cath w/o MCC']]},
 {key:'spine',cat:'MS-Spinal fusion',label:'Spinal fusion',short:'Spinal fusion',disc:2,drgs:[['402','Single level combined anterior and posterior spinal fusion except cervical'],['426','Multiple level combined anterior and posterior spinal fusion except cervical w MCC'],['427','Multiple level combined anterior and posterior spinal fusion except cervical w CC'],['428','Multiple level combined anterior and posterior spinal fusion except cervical w/o CC/MCC'],['429','Combined anterior and posterior spinal fusion (FY2025 regrouping) w MCC'],['430','Combined anterior and posterior spinal fusion (FY2025 regrouping) w/o MCC'],['447','Multiple level spinal fusion except cervical w MCC'],['448','Multiple level spinal fusion except cervical w/o MCC'],['450','Single level spinal fusion except cervical w MCC'],['451','Single level spinal fusion except cervical w/o MCC'],['471','Cervical spinal fusion w MCC'],['472','Cervical spinal fusion w CC'],['473','Cervical spinal fusion w/o CC/MCC'],['473-OP','Outpatient spinal fusion (HCPCS such as 22551; CMS reports these under the matching fusion MS-DRG, priced here at MS-DRG 473)']]},
 {key:'bowel',cat:'IP-Major bowel procedure',label:'Major bowel procedure',short:'Major bowel',disc:1.5,drgs:[['329','Major small and large bowel procedures w MCC'],['330','Major small and large bowel procedures w CC'],['331','Major small and large bowel procedures w/o CC/MCC']]}
];
const TRACKS={1:{name:'Track 1',gain:.10,loss:0,negAdj:0,desc:'Upside only. 10% stop-gain. No repayment.'},2:{name:'Track 2',gain:.05,loss:.05,negAdj:.15,desc:'Two-sided. 5% stop-gain and stop-loss. Up to 15% quality relief on repayments.'},3:{name:'Track 3',gain:.20,loss:.20,negAdj:.10,desc:'Two-sided. 20% stop-gain and stop-loss. Up to 10% quality relief on repayments.'}};
const baseDrg=d=>String(d).split('-')[0];
/* ---------- eligibility ---------- */
function eligible(track,py,sn,rural){
  if(track===3)return {ok:true};
  if(track===1){ if(py===1)return {ok:true}; if(py<=3&&sn)return {ok:true}; return {ok:false,why:py<=3?'PY2 to PY3: safety-net hospitals only':'Not offered after PY3'}; }
  if(track===2){ if(py===1)return {ok:false,why:'Starts in PY2'}; if(sn||rural)return {ok:true}; return {ok:false,why:'Safety-net, rural, SCH, MDH or EACH only'}; }
}
/* ---------- lever defaults (post-discharge mix and complications) ---------- */
const UNIT={snfDay:626,irf:25300,hh:1852,optx:900,readmit:19400,ssi:12800,vte:12381};
const CAP_PER_EPISODE=1200; /* evidence cap on the typical-program preset: CJR measured $1,226 per elective joint episode; BPCI Advanced about $500 to $1,000 */
/* national TEAM 30-day episode cost by setting, IAC analysis of 2021-2023 claims (read from the published chart, rounded to $500) */
const SETTING={lejr:[13000,2000,4000],shfft:[14500,3500,20500],cabg:[41000,6000,10000],spine:[25000,5000,7500],bowel:[17000,3000,6000]};
const LEVER_DEF={
 lejr:{snf:15,days:10,irf:4,ra:4,ssi:0.8,vte:0.6,src:'Readmission about 4% (elective TKA, Nationwide Readmissions Database). SSI 0.7 to 0.8% and VTE under 1% after joint replacement. Discharge mix illustrative: CJR hospitals moved steadily toward home with home health.'},
 shfft:{snf:55,days:20,irf:18,ra:12,ssi:1.5,vte:0.8,src:'Fewer than one in five Medicare hip fracture patients go straight home; SNF stays average 24 to 27 days. Readmission about 12% overall and over 20% for SNF discharges. VTE 0.3% DVT plus 0.5% PE (National Inpatient Sample).'},
 cabg:{snf:21,days:12,irf:5,ra:12,ssi:1.8,vte:0.8,src:'21.2% of Medicare CABG patients discharged to a SNF (2016 to 2017 cohort of 73,164). Medicare CABG readmission 12.7% (2013); 9.7% all-payer in Pennsylvania 2022 to 2023. Deep sternal wound infection about 0.2 to 2.9%.'},
 spine:{snf:20,days:12,irf:10,ra:8,ssi:1.4,vte:0.6,src:'About half of Medicare lumbar fusion patients used rehabilitation-based post-acute care (2012 to 2014). 30-day readmission 7.5 to 13% depending on source. SSI 1.4% in elective spine surgery (PearlDiver).'},
 bowel:{snf:20,days:12,irf:4,ra:12,ssi:10,vte:1.5,src:'Colectomy readmission 11 to 16% in Medicare cohorts. SSI 6.2% superficial plus 4.7% deep or organ-space (NSQIP, 27,011 colectomies). SNF discharge 11% laparoscopic to 31% open among older patients.'}
};
/* ---------- quality adjustment ---------- */
function qualityAdj(base,cqs,track){const T=TRACKS[track];let adjPct=0;if(base>0)adjPct=.10*(1-cqs/100);else if(base<0)adjPct=T.negAdj*cqs/100;return {adjPct,adjAmt:base*adjPct,qa:base-base*adjPct};}
/* ---------- lever savings per episode ---------- */
function leverSavings(levers,key,raw){const u=levers.unit,c=levers.cur[key],t=levers.tgt[key];const f=raw?1:levers.real/100;
  const snfMoved=Math.max(0,c.snf-t.snf)/100, snfKept=Math.min(c.snf,t.snf)/100, daysCut=Math.max(0,c.days-t.days);
  const parts={
    snf:(snfMoved*(c.days*u.snfDay-u.hh-u.optx) + snfKept*daysCut*u.snfDay)*f,
    irf: Math.max(0,c.irf-t.irf)/100*(u.irf-u.hh-u.optx)*f,
    ra: (c.ra-t.ra)/100*u.readmit*f,
    ssi:(c.ssi-t.ssi)/100*u.ssi*f,
    vte:(c.vte-t.vte)/100*u.vte*f};
  parts.total=parts.snf+parts.irf+parts.ra+parts.ssi+parts.vte;
  parts.raAvoided=Math.max(0,c.ra-t.ra)/100*f; parts.snfDays=(snfMoved*c.days+snfKept*daysCut)*f; parts.irfAvoided=Math.max(0,c.irf-t.irf)/100*f;
  return parts;}
/* ---------- engine bound to a target-price table ---------- */
function createEngine(TP){
  const price=(drg,region)=>{const r=TP.find(x=>x.drg===baseDrg(drg)&&x.region===region);return r?r.target:0;};
  const priceRow=(drg,region)=>TP.find(x=>x.drg===baseDrg(drg)&&x.region===region);
  function catCalc(c,st,region,risk,spendShift){
    const counts=st.counts;let n=0,tsum=0;
    c.drgs.forEach(d=>{const k=counts[d[0]]||0;n+=k;tsum+=k*price(d[0],region);});
    const regional=n?tsum/n:price(c.drgs[Math.min(1,c.drgs.length-1)][0],region);
    const target=regional*risk;
    let spend=st.spend==null?regional:st.spend;
    if(spendShift!=null)spend=target*(1+spendShift);
    let recon=(target-spend)*n;
    const capped=st.lowvol&&recon<0;if(capped)recon=0;
    return {n,regional,target,spend,recon,capped,aggTarget:target*n,aggSpend:spend*n};
  }
  function reconcile(S,opts={}){
    const region=opts.region??S.region,risk=(opts.risk??S.risk)*(opts.targetMult??1),cqs=opts.cqs??S.cqs,track=opts.track??S.track,shift=opts.shift,spendMult=opts.spendMult??1;
    const rows=[];let recon=0,aggT=0,aggS=0,eps=0;
    CATS.forEach(c=>{const st=S.cats[c.key];if(!st.on)return;
      const st2=spendMult===1?st:Object.assign({},st,{spend:(st.spend==null?null:st.spend*spendMult)});
      let r;
      if(spendMult!==1&&st.spend==null){const base=catCalc(c,st,region,risk,null);r=catCalc(c,Object.assign({},st,{spend:base.regional*spendMult}),region,risk,shift);}
      else r=catCalc(c,st2,region,risk,shift);
      if(r.n===0)return;
      const lv=(opts.levers??S.levers.on)&&(!opts.leverCats||opts.leverCats.includes(c.key)); const lvParts=opts.leverParts; 
      if(lv){const sv=leverSavings(S.levers,c.key);let cut=sv.total;if(lvParts)cut=lvParts.reduce((q,k)=>q+sv[k],0);if(cut){r=catCalc(c,Object.assign({},st,{spend:r.spend-cut,lowvol:st.lowvol}),region,risk,null);r.leverCut=cut;}}
      r.c=c;rows.push(r);recon+=r.recon;aggT+=r.aggTarget;aggS+=r.aggSpend;eps+=r.n;});
    const T=TRACKS[track];
    let base=recon; if(track===1&&base<0)base=0;
    const {adjPct,adjAmt,qa}=qualityAdj(base,cqs,track);
    const gainCap=T.gain*aggT, lossCap=T.loss*aggT;
    let npra=qa,capHit=null;
    if(npra>gainCap){npra=gainCap;capHit='gain';}
    if(npra<-lossCap){npra=-lossCap;capHit='loss';}
    let seqAmt=0;if((opts.seq??S.seq)&&npra>0){seqAmt=npra*.02;npra-=seqAmt;}
    return {rows,recon,base,adjPct,adjAmt,qa,gainCap,lossCap,npra,capHit,aggT,aggS,eps,track,seqAmt};
  }
  function defaultState(region){const S={region:region||2,py:1,track:1,sn:false,rural:false,risk:1,cqs:50,seq:true,cats:{},levers:{on:false,real:60,unit:Object.assign({},UNIT),cur:{},tgt:{}}};
    CATS.forEach(c=>{S.cats[c.key]={on:true,counts:{},spend:null,lowvol:false,src:'default'};c.drgs.forEach(d=>S.cats[c.key].counts[d[0]]=0);const d=LEVER_DEF[c.key];S.levers.cur[c.key]={snf:d.snf,days:d.days,irf:d.irf,ra:d.ra,ssi:d.ssi,vte:d.vte};S.levers.tgt[c.key]=Object.assign({},S.levers.cur[c.key]);});
    return S;}
  return {TP,price,priceRow,catCalc,reconcile,defaultState};
}
return {DIVS,DIVSTATES,STATE2DIV,CATS,TRACKS,UNIT,CAP_PER_EPISODE,SETTING,LEVER_DEF,baseDrg,eligible,qualityAdj,leverSavings,createEngine};
});
