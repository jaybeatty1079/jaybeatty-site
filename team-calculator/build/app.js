(function(){
'use strict';
const $=id=>document.getElementById(id);
const NS='http://www.w3.org/2000/svg';
const el=(n,a={},t)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);if(t!=null)e.textContent=t;return e;};
const C={panel:'#1c1730',purple:'#8366ea',green:'#22a85e',teal:'#10a197',red:'#e0607a',amber:'#e5b35a',line:'#2b2542',fg:'#ece9f5',muted:'#a79fc0'};
const tip=$('tip');
function bindTip(node,html){node.addEventListener('mousemove',e=>{tip.innerHTML=html;tip.style.left=e.clientX+'px';tip.style.top=e.clientY+'px';tip.style.opacity=1;});node.addEventListener('mouseleave',()=>tip.style.opacity=0);node.addEventListener('focus',()=>{const r=node.getBoundingClientRect();tip.innerHTML=html;tip.style.left=(r.left+r.width/2)+'px';tip.style.top=r.top+'px';tip.style.opacity=1;});node.addEventListener('blur',()=>tip.style.opacity=0);node.setAttribute('tabindex','0');}
const fmt=n=>{const s=n<0?'−':'';n=Math.abs(n);if(n>=1e9)return s+'$'+(n/1e9).toFixed(2)+'B';if(n>=1e6)return s+'$'+(n/1e6).toFixed(n>=1e7?1:2)+'M';if(n>=1e3)return s+'$'+(n/1e3).toFixed(n>=1e5?0:1)+'K';return s+'$'+Math.round(n);};
const fmtFull=n=>(n<0?'−':'')+'$'+Math.round(Math.abs(n)).toLocaleString('en-US');
const pct=(n,d=1)=>(n>0?'+':n<0?'−':'')+Math.abs(n).toFixed(d)+'%';
const num=n=>Math.round(n).toLocaleString('en-US');

/* ---------- engine (build/engine.js, shared with tests/engine.test.js) ---------- */
const ENG=window.TEAMEngine,E=ENG.createEngine(TP);
const {DIVS,DIVSTATES,STATE2DIV,CATS,TRACKS,UNIT,CAP_PER_EPISODE,SETTING,LEVER_DEF,baseDrg,eligible,qualityAdj}=ENG;
const {price,priceRow,catCalc}=E;
function run(opts){return E.reconcile(S,opts);}
function leverSavings(key,raw){return ENG.leverSavings(S.levers,key,raw);}

/* ---------- state ---------- */
const S={hospital:null,region:2,py:1,track:1,sn:false,rural:false,risk:1,cqs:50,improve:-2,regional:-1,seq:true,cats:{},net:{cost:250000,raMargin:3500,snfRev:0},pub:null,op:{rev:null,margin:2.5,src:'default',fy:null,cm:null}};
const KH_MARGIN=2.5; /* Kaufman Hall National Hospital Flash Report, year-to-date operating margin through August 2026 */
CATS.forEach(c=>{S.cats[c.key]={on:true,counts:{},spend:null,lowvol:false,src:'default'};c.drgs.forEach(d=>S.cats[c.key].counts[d[0]]=0);});
/* ---------- levers (post-discharge mix and complications) ---------- */
const UNIT_LAB={snfDay:'SNF per day (standardized, set from your state when a hospital is picked)',irf:'IRF stay',hh:'Home health 30-day period (replaces a facility stay)',optx:'Outpatient therapy and visits (added when a patient goes home)',readmit:'Readmission (2018 HCUP $15,500 inflated 25% to 2024)',ssi:'Surgical site infection (added cost)',vte:'VTE (added cost)'};
S.levers={on:false,real:60,unit:Object.assign({},UNIT),cur:{},tgt:{}};
CATS.forEach(c=>{const d=LEVER_DEF[c.key];S.levers.cur[c.key]={snf:d.snf,days:d.days,irf:d.irf,ra:d.ra,ssi:d.ssi,vte:d.vte};S.levers.tgt[c.key]=Object.assign({},S.levers.cur[c.key]);});


/* ---------- public hospital data (Care Compare, data.cms.gov, FY2027 impact file) ---------- */
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
const HN=HM.nat;
function derivePublic(h){
  if(!h)return null;
  const rt=h.rt||{},cx=h.cx||{},q=h.q||{};
  const counts=Object.assign({},h.ip||{});
  const reg=STATE2DIV[h.st]||S.region;
  const shift={},lev={},sig={},pacShift={};let E=0,El=0;
  CATS.forEach(c=>{let n=0,tsum=0;c.drgs.forEach(d=>{const k=counts[d[0]]||0;n+=k;tsum+=k*price(d[0],reg);});E+=n;if(c.key==='lejr')El=n;
    const avgT=n?tsum/n:price(c.drgs[Math.min(1,c.drgs.length-1)][0],reg);
    const sh=SETTING[c.key],p=sh[2]/(sh[0]+sh[1]+sh[2]);
    pacShift[c.key]=rt.pac?100*p*(rt.pac-1):0;
    /* category-specific public signal, in dollars per episode: excess readmissions (HRRP predicted minus expected) for joints and CABG; excess colon infections for bowel */
    let extra=null;
    if(c.key==='lejr'&&q.ehkp!=null&&q.ehke!=null)extra=(q.ehkp-q.ehke)/100*UNIT.readmit;
    else if(c.key==='cabg'&&q.ecbp!=null&&q.ecbe!=null)extra=(q.ecbp-q.ecbe)/100*UNIT.readmit;
    else if(c.key==='bowel'&&rt.ssi!=null)extra=(rt.ssi-1)*0.10*UNIT.ssi;
    if(extra!=null&&avgT)sig[c.key]=+(extra/avgT*100).toFixed(1);
    shift[c.key]=+clamp(pacShift[c.key]+(sig[c.key]||0),-20,20).toFixed(1);
    const d=LEVER_DEF[c.key],L={snf:d.snf,days:d.days,irf:d.irf,ra:d.ra,ssi:d.ssi,vte:d.vte};
    if(rt.snf)L.snf=+Math.min(90,d.snf*clamp(rt.snf,.5,1.8)).toFixed(1);
    if(rt.days)L.days=+(d.days*clamp(rt.days,.7,1.4)).toFixed(1);
    if(rt.irf)L.irf=+(d.irf*clamp(rt.irf,.3,2)).toFixed(1);
    if(c.key==='lejr'&&q.rhk!=null)L.ra=q.rhk;else if(c.key==='cabg'&&q.rcb!=null)L.ra=q.rcb;else if(rt.ip)L.ra=+(d.ra*clamp(rt.ip,.6,1.6)).toFixed(1);
    if(c.key==='bowel'&&rt.ssi!=null)L.ssi=+(d.ssi*clamp(rt.ssi,.3,2.5)).toFixed(1);
    if(rt.vte)L.vte=+(d.vte*clamp(rt.vte,.4,2)).toFixed(2);
    lev[c.key]=L;});
  /* outpatient joint row: APC 5115 services, an upper bound that also holds other Level 5 procedures such as shoulder replacement */
  if(h.op)counts['470-OP']=h.op;
  const rd=cx.readm??50,ps=cx.psi90??50;
  const cqs=Math.round(E?(E*rd+E*ps+El*50)/(2*E+El):(rd+ps+50)/3);
  /* rough risk-multiplier proxy from public hospital factors: bed-size band, safety-net flag, county dual-eligible share vs national; CMS's coefficients are not public */
  let rp=1;if(h.beds>=851)rp+=.02;else if(h.beds>=501)rp+=.01;else if(h.beds!=null&&h.beds<=250)rp-=.01;if(h.sn)rp+=.01;if(h.dual!=null&&HN.dual!=null)rp+=(h.dual-HN.dual)*.25;rp=+clamp(rp,.94,1.06).toFixed(2);
  return {counts,shift,pacShift,sig,lev,cqs,E,El,sn:!!h.sn,rural:!!h.rural,risk:rp,reg};
}
const fmtK=n=>n==null?'n/a':'$'+Math.round(n).toLocaleString('en-US');
const vs=(a,b,unit='')=>a==null?'not reported':`${a}${unit}${b!=null?` <span class="dim">(${b}${unit})</span>`:''}`;
function factsHTML(h,dv){
  const q=h.q||{},c=h.cty||{},sp=h.sp||{},nh=h.nh,nq=HN.q,per=HN.per||{};
  const teach=h.rbr>=.25?'major teaching':h.rbr>0?'teaching':'non-teaching';
  const urb={LURBAN:'large urban',OURBAN:'other urban',RURAL:'rural'}[h.urb]||'';
  const ma=c.ma!=null?Math.round(c.ma*100)+'% of county Medicare beneficiaries in Medicare Advantage (2025), so roughly '+(100-Math.round(c.ma*100))+'% of the hospital\'s Medicare surgical patients are TEAM-eligible':'';
  const rows=[
   ['Profile',`${h.beds?h.beds.toLocaleString('en-US')+' beds · ':''}${teach}${urb?' · '+urb:''}${h.sr?' · CMS overall rating '+h.sr+' stars':''}${h.co?' · '+h.co+' County, '+h.st:''}. ${ma}`,'FY2027 IPPS impact file; Care Compare; Medicare Monthly Enrollment'],
   ['Quality (Care Compare)',`Hip/knee 30-day readmission ${vs(q.rhk,nq.rhk,'%')} · CABG readmission ${vs(q.rcb,nq.rcb,'%')} · THA/TKA complications ${vs(q.chk,nq.chk,'%')} · PSI-90 ${vs(q.p90,nq.p90)} · PSI-12 perioperative VTE ${vs(q.p12,nq.p12,' per 1,000')} · colon SSI ratio ${vs(q.ssi,'1.00 benchmark')}. National medians in parentheses; ${per.rhk||''} readmissions, ${per.p90||''} PSIs.`,'Unplanned Hospital Visits, Complications and Deaths, HAI files, Sept and July 2026'],
   ['Spending after discharge (all conditions, price-standardized, per episode)',`SNF ${fmtK(sp.snf&&sp.snf[0])} vs census division ${fmtK(sp.snf&&sp.snf[1])} · home health ${fmtK(sp.hh&&sp.hh[0])} vs ${fmtK(sp.hh&&sp.hh[1])} · readmissions ${fmtK(sp.ip&&sp.ip[0])} vs ${fmtK(sp.ip&&sp.ip[1])} · whole episode ${fmtK(h.tot&&h.tot[0])} vs ${fmtK(h.tot&&h.tot[1])}. The division figure is the hospital-count-weighted average of its states, since TEAM prices by census division. Thirty-day post-discharge window, ${per.sp?per.sp.replace(/^(\d{4})-\1$/,'$1'):'2024'} episodes.`,'Medicare Hospital Spending by Claim (MSPB), FY2026 release'],
   ['Post-acute market',`${c.snfprov!=null?c.snfprov+' SNFs billing in the county':''}${nh?` · ${nh.n} nursing homes averaging ${nh.r??'n/a'} stars, ${nh.w} on the TEAM Q4-2026 three-day-waiver list${nh.rh!=null?`, short-stay rehospitalization ${nh.rh}%`:''}`:''}${c.snfd!=null?` · county SNF days ${Math.round(c.snfd).toLocaleString('en-US')} per 1,000 beneficiaries (national ${Math.round(HN.cty.snfd).toLocaleString('en-US')})`:''}${c.readm!=null?` · county readmission rate ${c.readm}% (national ${HN.cty.readm}%)`:''}.`,'Market Saturation 2025; Nursing Home Compare Sept 2026; TEAM qualified SNF list; Geographic Variation 2024'],
   ['Finances (cost report)',h.fin?`Net patient revenue ${fmt(h.fin.rev)} for the fiscal year ending ${h.fin.fy}; patient-service margin ${pct(h.fin.m)} on the cost-report basis, which excludes investment and other income and is not comparable with reported operating margin. The margin field below defaults to the Kaufman Hall ${KH_MARGIN}% industry figure instead.`:'No 2024 cost report row for this CCN.','Hospital Provider Cost Report 2024, data.cms.gov'],
   ['Volume',`${dv.E.toLocaleString('en-US')} traditional-Medicare inpatient TEAM discharges in 2024 (MS-DRG cells under 11 suppressed)${h.op?`, plus ${h.op.toLocaleString('en-US')} outpatient Level 5 musculoskeletal services (APC 5115, which holds outpatient knee and hip replacement). TEAM prices outpatient episodes by HCPCS code; they are not in this model, so the true book is larger`:''}.`,'Medicare Inpatient and Outpatient Hospitals by Provider and Service, CY2024']];
  const rt=h.rt||{};
  const sigTxt=CATS.map(c=>dv.sig[c.key]!=null?`${c.short} ${pct(dv.sig[c.key])} from its ${c.key==='bowel'?'colon-infection ratio':'excess-readmission ratio'}`:null).filter(Boolean).join(', ');
  const noSig=CATS.filter(c=>dv.sig[c.key]==null).map(c=>c.short).join(', ');
  const derived=`<b style="color:var(--fg)">Prefilled from this public data, so edit anything:</b> volumes from the 2024 inpatient file plus ${h.op?h.op.toLocaleString('en-US')+' outpatient joint cases (APC 5115, an upper bound)':'no outpatient row'}; spend set ${rt.pac?(rt.pac>1?'above':'below')+' target by each category\'s post-acute share × '+Math.round(Math.abs(rt.pac-1)*100)+'% (30-day post-discharge spend vs its census division)':'at target (no spending file)'}${sigTxt?', then adjusted by category where a public surgical signal exists: '+sigTxt:''}${noSig?'; no category-specific public signal for '+noSig+', so those carry the post-discharge pattern only':''}; quality score ${dv.cqs} (details under the slider); readmission, SNF, IRF, VTE and SSI levers scaled by the same files; SNF per day set to this state's standardized rate${HN.snfday&&HN.snfday[h.st]?' ('+fmtK(HN.snfday[h.st])+')':''}; risk multiplier seeded at ${dv.risk.toFixed(2)}× from bed size, safety-net flag and county dual-eligible share (a rough proxy; CMS sends the real one); ${dv.sn?'flagged safety-net':'not flagged safety-net'} because its Medicare SSI share of ${h.ssi!=null?Math.round(h.ssi*1000)/10+'%':'n/a'} is ${dv.sn?'at or above':'below'} the 8.7% IPPS 75th percentile${h.dual!=null?' (county dual-eligible share '+Math.round(h.dual*1000)/10+'% vs '+Math.round(HN.dual*1000)/10+'% national)':''}, and CMS\'s own notification governs; ${dv.rural?'rural':'urban'} per the FY2027 impact file. Spend and quality are estimates from public patterns, not the hospital\'s TEAM result: replace the spend fields with your CMS baseline report.`;
  return `<div class="facts">${rows.map(r=>`<div class="fact"><span class="fl">${r[0]}</span><span class="fv">${r[1]}<small class="fs">${r[2]}</small></span></div>`).join('')}<div class="fact derived">${derived}</div></div>`;
}
function applyPublic(ccn){const h=HM.h[ccn];const dv=derivePublic(h);if(!dv)return null;
  S.pub=ccn;S.sn=dv.sn;S.rural=dv.rural;S.cqs=dv.cqs;S.risk=dv.risk;S.levers.on=false;
  if(HN.snfday&&HN.snfday[h.st])S.levers.unit.snfDay=HN.snfday[h.st];
  if(h.fin&&h.fin.rev){S.op.rev=h.fin.rev;S.op.src='cost report';S.op.fy=h.fin.fy;S.op.cm=h.fin.m;}else{S.op.rev=null;S.op.src='default';S.op.fy=null;S.op.cm=null;}S.op.margin=KH_MARGIN;syncOpInputs();
  CATS.forEach(c=>{const st=S.cats[c.key];let n=0;c.drgs.forEach(d=>{st.counts[d[0]]=dv.counts[d[0]]||0;n+=st.counts[d[0]];});st.on=n>0;st.lowvol=n>0&&n*3<=30;st.src='derived';
    const base=catCalc(c,Object.assign({},st,{spend:null}),S.region,S.risk);st.spend=Math.round(base.target*(1+dv.shift[c.key]/100));
    S.levers.cur[c.key]=Object.assign({},dv.lev[c.key]);S.levers.tgt[c.key]=Object.assign({},dv.lev[c.key]);});
  return dv;}
function cqsNoteHTML(h,dv){if(!h||!dv)return '';const cx=h.cx||{};const w=2*dv.E+dv.El;const wr=w?Math.round(dv.E/w*100):38,wp=w?Math.round(dv.El/w*100):24;
  return `<b style="color:var(--fg)">Proxy score ${dv.cqs}, built as CMS weights it:</b> hospital-wide readmission ${cx.readm!=null?`percentile ${cx.readm} <span class="dim">(proxy: this hospital's hip/knee and CABG readmission ranks; the hybrid measure has no public scores yet)</span>`:'50 <span class="dim">(no public readmission measure)</span>'} at ${wr}% weight · PSI-90 ${cx.psi90!=null?`percentile ${cx.psi90} <span class="dim">(real, Care Compare)</span>`:'50 <span class="dim">(not reported)</span>'} at ${wr}% weight · THA/TKA patient-reported outcome 50 <span class="dim">(assumed: not public; a hospital that reports it with the 50% response-rate floor will score above or below this)</span> at ${wp}% weight. Percentiles rank among the ${HN.elig_n?HN.elig_n.toLocaleString('en-US'):'3,000'} IPPS hospitals eligible for TEAM, excluding Maryland, as the CMS fact sheet specifies.`;}
/* ---------- service lines ---------- */
S.view='all';S.spineOrtho=true;S.caseId=null;
function LINES(){const l=[{key:'ortho',label:'Orthopedics',cats:['lejr','shfft'].concat(S.spineOrtho?['spine']:[])}];if(!S.spineOrtho)l.push({key:'spine',label:'Spine',cats:['spine']});l.push({key:'cardiac',label:'Cardiac',cats:['cabg']},{key:'abd',label:'Abdominal surgery',cats:['bowel']});return l;}
function activeCats(){if(S.view==='all')return CATS.map(c=>c.key);const l=LINES().find(x=>x.key===S.view);return l?l.cats:CATS.map(c=>c.key);}
/* ---------- motion helpers: number tweens, chart easing, pulse ---------- */
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const easeOut=t=>1-Math.pow(1-t,3);
function tweenText(el,value,fmtFn,dur=450){if(!el)return;const from=el._v;el._v=value;if(RM||from==null||!isFinite(from)||from===value){el.textContent=fmtFn(value);return;}
  if(el._raf)cancelAnimationFrame(el._raf);const t0=performance.now();const step=now=>{const k=easeOut(Math.min(1,(now-t0)/dur));el.textContent=fmtFn(from+(value-from)*k);if(k<1)el._raf=requestAnimationFrame(step);};el._raf=requestAnimationFrame(step);}
function snapRects(svg){return [...svg.querySelectorAll('rect')].filter(r=>r.getAttribute('fill')!=='transparent').map(r=>({x:+r.getAttribute('x'),y:+r.getAttribute('y'),w:+r.getAttribute('width'),h:+r.getAttribute('height')}));}
function withMorph(ids,fn){if(RM)return fn();const before={};ids.forEach(id=>{const s=$(id);if(s)before[id]=snapRects(s);});fn();
  ids.forEach(id=>{const s=$(id),old=before[id];if(!s||!old||!old.length)return;const now=[...s.querySelectorAll('rect')].filter(r=>r.getAttribute('fill')!=='transparent');if(now.length!==old.length)return;
    now.forEach((r,i)=>{const o=old[i],n={x:+r.getAttribute('x'),y:+r.getAttribute('y'),w:+r.getAttribute('width'),h:+r.getAttribute('height')};if(o.x===n.x&&o.y===n.y&&o.w===n.w&&o.h===n.h)return;
      r.style.transition='none';r.style.x=o.x+'px';r.style.y=o.y+'px';r.style.width=o.w+'px';r.style.height=o.h+'px';r.getBBox();r.style.transition='';r.style.x=n.x+'px';r.style.y=n.y+'px';r.style.width=n.w+'px';r.style.height=n.h+'px';});});}
let pulseT=null;function pulseResults(){if(RM)return;const b=document.querySelector('#results .board');if(!b)return;b.classList.remove('pulse');void b.offsetWidth;b.classList.add('pulse');clearTimeout(pulseT);pulseT=setTimeout(()=>b.classList.remove('pulse'),700);}

/* ---------- engine ---------- */

/* ---------- UI build ---------- */
const regionSel=$('region');
for(const d in DIVS){const o=document.createElement('option');o.value=d;o.textContent=`${d} · ${DIVS[d]} (${DIVSTATES[d]})`;regionSel.appendChild(o);}
regionSel.value=S.region;
regionSel.addEventListener('change',()=>{clearCase();S.region=+regionSel.value;S.hospital=null;$('hosp').value='';$('hospMeta').textContent='Region set manually.';refreshCats();update();});

/* hospital picker */
const hospIn=$('hosp'),hospList=$('hospList');let act=-1,matches=[];
function renderList(){hospList.innerHTML='';matches.slice(0,40).forEach((p,i)=>{const li=document.createElement('li');li.setAttribute('role','option');li.innerHTML=`<span style="color:var(--fg);font-family:var(--body);font-size:.9rem;white-space:normal">${esc(p.name)}</span><span>${esc(p.state)} · ${esc(p.cbsa_name||'').split(',')[0]}</span>`;li.addEventListener('mousedown',e=>{e.preventDefault();pick(p);});if(i===act)li.className='act';hospList.appendChild(li);});hospList.classList.toggle('open',matches.length>0);}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
hospIn.addEventListener('input',()=>{const q=hospIn.value.trim().toLowerCase();act=-1;if(q.length<2){matches=[];renderList();return;}const toks=q.split(/\s+/);matches=PARTS.filter(p=>{const h=(p.name+' '+p.state+' '+(p.cbsa_name||'')+' '+p.ccn).toLowerCase();return toks.every(t=>h.includes(t));});renderList();});
hospIn.addEventListener('keydown',e=>{if(!matches.length)return;if(e.key==='ArrowDown'){act=Math.min(act+1,Math.min(matches.length,40)-1);renderList();e.preventDefault();}else if(e.key==='ArrowUp'){act=Math.max(act-1,0);renderList();e.preventDefault();}else if(e.key==='Enter'){if(act>=0)pick(matches[act]);e.preventDefault();}else if(e.key==='Escape'){matches=[];renderList();}});
hospIn.addEventListener('blur',()=>{setTimeout(()=>{matches=[];renderList();},120);});
function pick(p){clearCase();S.hospital=p;hospIn.value=p.name;matches=[];renderList();const d=STATE2DIV[p.state]||S.region;S.region=d;regionSel.value=d;
  const h=HM.h[p.ccn];const dv=h?applyPublic(p.ccn):null;
  $('hospMeta').innerHTML=`<b style="color:var(--fg)">${esc(p.type)}</b> participant · CCN ${esc(p.ccn)} · ${esc(p.cbsa_name||'')} · census division ${d}, ${DIVS[d]}.${p.new?' Newly identified on the August 2026 list.':''}`+(dv?factsHTML(h,dv):'<div class="note" style="margin-top:6px">No public Care Compare or cost report record matched this CCN, so nothing was prefilled.</div>');
  $('cqsNote').innerHTML=dv?cqsNoteHTML(h,dv):'';
  if(dv){syncDom(true);buildLevers();}else{refreshCats();}update();}

/* tracks */
function buildTracks(){const box=$('tracks');box.innerHTML='';[1,2,3].forEach(t=>{const e=eligible(t,S.py,S.sn,S.rural);const d=document.createElement('label');d.className='track'+(S.track===t?' sel':'')+(e.ok?'':' off');d.innerHTML=`<input type="radio" name="track" value="${t}" ${S.track===t?'checked':''} ${e.ok?'':'disabled'}><span class="t">${TRACKS[t].name}</span><span class="d">${TRACKS[t].desc}</span>${e.ok?'':`<span class="why">${e.why}</span>`}`;d.addEventListener('click',()=>{if(!e.ok)return;S.track=t;buildTracks();update();});box.appendChild(d);});
  const cur=eligible(S.track,S.py,S.sn,S.rural);if(!cur.ok){S.track=3;buildTracks();return;}
  $('trackNote').textContent=S.py===1?'In PY1 every participant may choose Track 1 (no downside) or Track 3. Track 2 begins in PY2 for safety-net and rural-type hospitals.':'From PY2 the default is Track 3. Track 1 stays open to safety-net hospitals through PY3; Track 2 is open to safety-net, rural, SCH, MDH and EACH hospitals.';}

/* categories */
function buildCats(){const box=$('cats');box.innerHTML='';CATS.forEach(c=>{const st=S.cats[c.key];const d=document.createElement('div');d.className='cat'+(st.on?'':' off');d.id='cat-'+c.key;
  d.innerHTML=`<div class="cat-head"><div><h4>${c.label}</h4><div class="sub">MS-DRG ${c.drgs.map(x=>x[0]).join(', ')} · CMS discount ${c.disc}% · <span class="badge" data-srcbadge="${c.key}"></span></div></div><label class="checks" style="font-size:.85rem"><input type="checkbox" data-on="${c.key}" ${st.on?'checked':''}> Included</label></div>
  <div class="sum"><div>Episodes / yr<b data-sum-n="${c.key}">0</b></div><div>Regional target (blended)<b data-sum-t="${c.key}">$0</b></div><div>Reconciliation<b data-sum-r="${c.key}">$0</b></div></div>
  <details><summary>Episodes by MS-DRG</summary><div><table class="drgs"><thead><tr><th>MS-DRG</th><th>Title</th><th class="n">Regional target</th><th class="n">Episodes</th></tr></thead><tbody>${c.drgs.map(x=>`<tr><td><b>${x[0]}</b></td><td style="color:var(--muted)">${x[1]}</td><td class="n" data-p="${c.key}-${x[0]}"></td><td class="n"><input type="number" min="0" step="1" inputmode="numeric" data-drg="${c.key}" data-code="${x[0]}" value="${st.counts[x[0]]||''}" placeholder="0"></td></tr>`).join('')}</tbody></table></div></details>
  <div class="row"><div class="field"><label>Average episode spend (from your CMS baseline report if you have it)</label><input type="number" min="0" step="100" inputmode="decimal" data-spend="${c.key}" placeholder="defaults to regional target"></div>
  <div class="field"><label>Spend vs. target</label><div class="slider"><input type="range" min="-20" max="20" step="0.5" value="0" data-shift="${c.key}"><output data-shiftout="${c.key}">0.0%</output></div></div></div>
  <label class="checks" style="font-size:.85rem"><input type="checkbox" data-lowvol="${c.key}" ${st.lowvol?'checked':''}> Low volume: 30 or fewer episodes in this category across the 2022 to 2024 baseline (no downside here). Set automatically when three times the annual count is 30 or fewer; type counts for MS-DRGs the public file suppresses.</label>`;
  box.appendChild(d);});
  box.addEventListener('input',onCatInput);box.addEventListener('change',onCatInput);refreshCats();}
function onCatInput(e){const t=e.target;
  if(t.dataset.on!=null){S.cats[t.dataset.on].on=t.checked;$('cat-'+t.dataset.on).classList.toggle('off',!t.checked);}
  else if(t.dataset.drg){const k=t.dataset.drg,st=S.cats[k];st.counts[t.dataset.code]=Math.max(0,parseInt(t.value)||0);syncSpendDefault(k);let n=0;for(const d in st.counts)n+=st.counts[d];st.lowvol=n>0&&n*3<=30;const lv=document.querySelector(`[data-lowvol="${k}"]`);if(lv)lv.checked=st.lowvol;}
  else if(t.dataset.spend!=null){const k=t.dataset.spend;S.cats[k].spend=t.value===''?null:Math.max(0,parseFloat(t.value)||0);S.cats[k].src=t.value===''?'default':'user';const r=catCalc(CATS.find(c=>c.key===k),S.cats[k],S.region,S.risk);const sh=r.target?((r.spend/r.target)-1)*100:0;const sl=document.querySelector(`[data-shift="${k}"]`);sl.value=Math.max(-20,Math.min(20,sh));document.querySelector(`[data-shiftout="${k}"]`).textContent=pct(sh);}
  else if(t.dataset.shift!=null){const k=t.dataset.shift;const sh=parseFloat(t.value);if(e.isTrusted)S.cats[k].src='user';const r=catCalc(CATS.find(c=>c.key===k),Object.assign({},S.cats[k],{spend:null}),S.region,S.risk);S.cats[k].spend=Math.round(r.target*(1+sh/100));document.querySelector(`[data-spend="${k}"]`).value=S.cats[k].spend;document.querySelector(`[data-shiftout="${k}"]`).textContent=pct(sh);}
  else if(t.dataset.lowvol!=null){S.cats[t.dataset.lowvol].lowvol=t.checked;}
  update();}
function syncSpendDefault(k){const inp=document.querySelector(`[data-spend="${k}"]`);const r=catCalc(CATS.find(c=>c.key===k),Object.assign({},S.cats[k],{spend:null}),S.region,S.risk);inp.placeholder='regional target '+fmtFull(r.regional);}
function refreshCats(){CATS.forEach(c=>{c.drgs.forEach(x=>{const cell=document.querySelector(`[data-p="${c.key}-${x[0]}"]`);if(cell)cell.textContent=fmtFull(price(x[0],S.region));});syncSpendDefault(c.key);
  const sl=document.querySelector(`[data-shift="${c.key}"]`);const st=S.cats[c.key];if(st.spend!=null&&sl){const r=catCalc(c,Object.assign({},st,{spend:null}),S.region,S.risk);S.cats[c.key].spend=Math.round(r.target*(1+parseFloat(sl.value)/100));document.querySelector(`[data-spend="${c.key}"]`).value=S.cats[c.key].spend;}});}


/* levers UI */
const LV_ROWS=[['snf','Discharged to SNF (% of episodes)','%'],['days','Average SNF days inside the episode','d'],['irf','Discharged to inpatient rehab (%)','%'],['ra','30-day readmission rate (%)','%'],['ssi','Surgical site infection rate (%)','%'],['vte','VTE (DVT or PE) rate (%)','%']];
function buildLevers(){const box=$('levers');box.innerHTML='';CATS.forEach(c=>{const cur=S.levers.cur[c.key],tgt=S.levers.tgt[c.key];const d=document.createElement('div');d.className='lever';d.id='lv-'+c.key;
  d.innerHTML=`<h4>${c.label}</h4><div class="lv"><span class="hd">Lever</span><span class="hd" style="text-align:right">Today</span><span class="hd" style="text-align:right">With program</span></div>`+LV_ROWS.map(r=>`<div class="lv"><span class="n">${r[1]}</span><input type="number" min="0" step="0.1" inputmode="decimal" data-lv="cur" data-cat="${c.key}" data-k="${r[0]}" value="${cur[r[0]]}"><input type="number" min="0" step="0.1" inputmode="decimal" data-lv="tgt" data-cat="${c.key}" data-k="${r[0]}" value="${tgt[r[0]]}"></div>`).join('')+`<div class="lv"><span class="n"><b style="color:var(--fg)">Savings per episode</b></span><span></span><b style="text-align:right;color:var(--green-soft)" data-lvsave="${c.key}">$0</b></div><div class="src">${LEVER_DEF[c.key].src}</div>`;
  box.appendChild(d);});
  const uc=$('unitCosts');uc.innerHTML=Object.keys(UNIT).map(k=>`<div class="field"><label>${UNIT_LAB[k]}</label><input type="number" min="0" step="10" data-unit="${k}" value="${S.levers.unit[k]}"></div>`).join('');
  box.addEventListener('input',e=>{const t=e.target;if(!t.dataset.lv)return;S.levers[t.dataset.lv][t.dataset.cat][t.dataset.k]=Math.max(0,parseFloat(t.value)||0);update();});
  uc.addEventListener('input',e=>{const t=e.target;if(!t.dataset.unit)return;S.levers.unit[t.dataset.unit]=Math.max(0,parseFloat(t.value)||0);update();});}
function syncLeverInputs(){document.querySelectorAll('[data-lv]').forEach(i=>{i.value=S.levers[i.dataset.lv][i.dataset.cat][i.dataset.k];});}
$('leversOn').addEventListener('change',()=>{S.levers.on=$('leversOn').checked;update();});
$('leverPreset').addEventListener('click',()=>{applyPreset();S.levers.on=true;$('leversOn').checked=true;syncLeverInputs();update();});
$('leverReset').addEventListener('click',()=>{CATS.forEach(c=>{S.levers.tgt[c.key]=Object.assign({},S.levers.cur[c.key]);});syncLeverInputs();update();});
/* sliders */
const bind=(id,out,key,f)=>{const i=$(id);i.addEventListener('input',()=>{S[key]=parseFloat(i.value);$(out).textContent=f(S[key]);if(key==='risk')refreshCats();update();});$(out).textContent=f(S[key]);};
bind('risk','riskOut','risk',v=>v.toFixed(2)+'×');
bind('cqs','cqsOut','cqs',v=>String(Math.round(v)));
bind('improve','improveOut','improve',v=>pct(v)+'/yr');
$('py').addEventListener('change',()=>{S.py=+$('py').value;buildTracks();update();});
$('safetyNet').addEventListener('change',()=>{S.sn=$('safetyNet').checked;buildTracks();update();});
$('ruralType').addEventListener('change',()=>{S.rural=$('ruralType').checked;buildTracks();update();});

/* example / reset */
const EXAMPLE={region:2,counts:{lejr:{470:260,469:25,521:10,522:20},shfft:{480:12,481:48,482:18},cabg:{235:14,236:34,233:8,234:10},spine:{473:60,472:18,451:22,450:8,428:10},bowel:{329:22,330:42,331:20}},shift:{lejr:-5,shfft:6,cabg:0,spine:3,bowel:-2}};
function loadExample(){clearCase();S.hospital=null;S.pub=null;$('cqsNote').innerHTML='';hospIn.value='';$('hospMeta').textContent='Example: a mid-size Middle Atlantic hospital. Numbers are illustrative, not any real hospital.';S.region=EXAMPLE.region;regionSel.value=S.region;
  CATS.forEach(c=>{const st=S.cats[c.key];st.on=true;st.lowvol=false;st.spend=null;c.drgs.forEach(d=>st.counts[d[0]]=(EXAMPLE.counts[c.key]||{})[d[0]]||0);});
  buildCats();CATS.forEach(c=>{const sl=document.querySelector(`[data-shift="${c.key}"]`);sl.value=EXAMPLE.shift[c.key];sl.dispatchEvent(new Event('input',{bubbles:true}));});
  S.risk=1;$('risk').value=1;$('riskOut').textContent='1.00×';S.cqs=50;$('cqs').value=50;$('cqsOut').textContent='50';update();}
function resetAll(){clearCase();S.hospital=null;S.pub=null;S.op={rev:null,margin:KH_MARGIN,src:'default',fy:null,cm:null};syncOpInputs();hospIn.value='';$('hospMeta').textContent='';$('cqsNote').innerHTML='';S.levers.unit.snfDay=UNIT.snfDay;CATS.forEach(c=>{const st=S.cats[c.key];st.on=true;st.lowvol=false;st.spend=null;st.src='default';c.drgs.forEach(d=>st.counts[d[0]]=0);});buildCats();buildLevers();update();}
$('loadExample').addEventListener('click',loadExample);$('resetAll').addEventListener('click',resetAll);

/* ---------- results ---------- */
function update(){const R=run();const T=TRACKS[S.track];
  const v=$('npra');tweenText(v,R.eps?R.npra:0,x=>R.eps?fmt(x):'$0');v.className='val '+(R.npra>0?'pos':R.npra<0?'neg':'');if(v._prev!=null&&v._prev!==R.npra)pulseResults();v._prev=R.npra;
  $('resHead').textContent=`${S.caseId?CASES.find(c=>c.id===S.caseId).name+' · ':''}${T.name} · PY${S.py} ${2025+S.py} · division ${S.region}`;
  $('npraSub').textContent=!R.eps?'Enter episodes in Step 3 or load the example.':R.npra>0?`Estimated payment from CMS. ${fmtFull(R.npra)}, ${pct(R.npra/R.aggT*100,2)} of your aggregated target price.`:R.npra<0?`Estimated repayment to CMS. ${fmtFull(R.npra)}, ${pct(R.npra/R.aggT*100,2)} of your aggregated target price.`:(S.track===1&&R.recon<0?`Spending ran ${fmtFull(-R.recon)} over target, but Track 1 has no repayment. In Track 3 this would be ${fmtFull(run({track:3}).npra)}.`:'Breaks even at these inputs.');
  tweenText($('tEp'),R.eps,x=>num(x));$('tEpD').textContent=R.rows.length+' of 5 categories';
  tweenText($('tTarget'),R.aggT,fmt);$('tTargetD').textContent='spend '+fmt(R.aggS)+' ('+pct(R.aggT?(R.aggS/R.aggT-1)*100:0)+')';
  tweenText($('tRecon'),R.recon,fmt);$('tReconD').textContent=S.track===1&&R.recon<0?'Track 1: negative set to $0':(R.rows.some(r=>r.capped)?'low-volume floor applied':'target minus spend, all categories');
  tweenText($('tCqs'),-R.adjAmt,fmt);$('tCqsD').textContent=R.base>0?`${(R.adjPct*100).toFixed(1)}% withheld at CQS ${Math.round(S.cqs)}`:R.base<0?`${(R.adjPct*100).toFixed(1)}% relief at CQS ${Math.round(S.cqs)}`:'no amount to adjust';
  $('capNote').textContent=R.capHit==='gain'?`Stop-gain hit: payment capped at ${(T.gain*100)}% of aggregated target (${fmtFull(R.gainCap)}). Uncapped it would be ${fmtFull(R.qa)}.`:R.capHit==='loss'?`Stop-loss hit: repayment capped at ${(T.loss*100)}% of aggregated target (${fmtFull(R.lossCap)}). Uncapped it would be ${fmtFull(R.qa)}.`:`Stop limits: gain ${(T.gain*100)}%${T.loss?`, loss ${(T.loss*100)}%`:', no downside'} of aggregated target (${fmt(R.aggT)}). Not binding here.`;
  // what moves it
  const mv=[];if(R.eps){const R100=run({cqs:100}),R0=run({cqs:0});mv.push(`<li><b>Quality:</b> CQS 100 gives ${fmt(R100.npra)}, CQS 0 gives ${fmt(R0.npra)}.</li>`);
    const Rp=run({risk:S.risk+.06}),Rm=run({risk:S.risk-.06});mv.push(`<li><b>Risk multiplier ±0.06</b> (${(S.risk-.06).toFixed(2)} to ${(S.risk+.06).toFixed(2)}): ${fmt(Rm.npra)} to ${fmt(Rp.npra)}. This usually moves the answer more than any lever.</li>`);
    const be=breakEvenRisk();if(be)mv.push(`<li><b>Break-even:</b> ${be}</li>`);
    if(R.seqAmt)mv.push(`<li><b>Sequestration:</b> ${fmtFull(R.seqAmt)} taken off the positive payment at 2%; repayments are not reduced.</li>`);
    const big=R.rows.slice().sort((a,b)=>Math.abs(b.recon)-Math.abs(a.recon))[0];if(big)mv.push(`<li><b>Biggest driver:</b> ${big.c.label}, ${fmtFull(big.recon)} on ${num(big.n)} episodes at ${pct((big.spend/big.target-1)*100)} vs target.</li>`);
    const one=run({shift:-0.01});mv.push(`<li><b>Every 1% below target</b> across all categories is worth about ${fmt(one.npra-run({shift:0}).npra)} after the quality adjustment, before stop limits.</li>`);}
  $('moves').innerHTML=mv.join('');
  const Blo=run({targetMult:.97}),Bhi=run({targetMult:1.03});$('bandNote').textContent=R.eps?`Final-price band: ${fmt(Math.min(Blo.npra,Bhi.npra))} to ${fmt(Math.max(Blo.npra,Bhi.npra))} if CMS's retrospective trend and case-mix normalization move the target 3% either way at reconciliation.`:'';
  CATS.forEach(c=>{const b=document.querySelector(`[data-srcbadge="${c.key}"]`);if(b){const src=S.cats[c.key].src;b.textContent=src==='user'?'spend: your number':src==='derived'?'spend: estimated from public pattern, replace with your baseline':'spend: at regional target';b.className='badge '+src;}});
  renderNet();renderMargin(R);
  $('printMeta').textContent=`${S.hospital?S.hospital.name+' · ':''}${T.name}, PY${S.py}, census division ${S.region}, risk ${S.risk.toFixed(2)}×, CQS ${Math.round(S.cqs)}. Printed ${new Date().toLocaleDateString('en-US')}. Estimates only; not affiliated with CMS.`;
  $('cScenario').value=JSON.stringify({hospital:$('cHosp').value||null,opRev:S.op.rev,opMargin:S.op.margin,region:S.region,py:S.py,track:S.track,risk:S.risk,cqs:S.cqs,episodes:R.eps,aggTarget:Math.round(R.aggT),aggSpend:Math.round(R.aggS),npra:Math.round(R.npra),levers:S.levers.on?{unit:S.levers.unit,target:S.levers.tgt}:null});
  CATS.forEach(c=>{const st=S.cats[c.key];const r=catCalc(c,st,S.region,S.risk);const q=k=>document.querySelector(`[data-sum-${k}="${c.key}"]`);if(!q('n'))return;q('n').textContent=st.on?num(r.n):'off';q('t').textContent=fmtFull(r.regional);q('r').textContent=st.on&&r.n?fmtFull(r.recon)+(r.capped?' (floored)':''):'$0';});
  CATS.forEach(c=>{const e=document.querySelector(`[data-lvsave="${c.key}"]`);if(e)e.textContent=fmtFull(leverSavings(c.key).total);});
  const RL=run({levers:true}),RB=run({levers:false});const lt=$('leverTile');
  if(S.levers.on&&R.eps){lt.style.display='';tweenText($('leverVal'),RL.npra,fmt);$('leverDelta').textContent=`vs ${fmt(RB.npra)} without levers (${fmt(RL.npra-RB.npra)})`;$('bigLab').textContent='Net payment reconciliation amount (levers applied)';}
  else{lt.style.display='none';$('bigLab').textContent='Net payment reconciliation amount';}
  $('seqNote').textContent=S.seq?'2% sequestration applied to positive payments.':'Sequestration off.';
  renderLineBoard();withMorph(['chLines','chCats','chSetting','chLevers','chFive','chFlow'],()=>{drawLines();drawCats(R);drawSens();drawSetting();drawLevers();drawFive();drawFlow(false);});}

function syncOpInputs(){const a=$('opRev'),b=$('opMargin');if(a)a.value=S.op.rev!=null?Math.round(S.op.rev):'';if(b)b.value=S.op.margin;const n=$('opSrc');if(n)n.textContent=S.op.src==='cost report'?`Revenue prefilled from the 2024 Medicare cost report (fiscal year ending ${S.op.fy}); margin is the Kaufman Hall ${KH_MARGIN}% industry year-to-date figure. Replace both with your budget.`:S.op.src==='user'?'Your figures.':`Margin defaults to ${KH_MARGIN}%, the Kaufman Hall National Hospital Flash Report year-to-date average through August 2026, when 43% of hospitals ran at a loss. Enter your revenue to see the result in margin points.`;}
function renderMargin(R){const e=$('marginNote');if(!e)return;if(!R.eps){e.textContent='';return;}
  const rev=S.op.rev,m=S.op.margin;const RL=S.levers.on?R:run({levers:false});const npra=R.npra;
  if(!rev){e.innerHTML=`<b style="color:var(--fg)">Margin context:</b> at a ${m}% operating margin${S.op.src==='default'?' (Kaufman Hall year-to-date average; 43% of hospitals ran at a loss in August 2026)':''}, this result is ${fmtFull(Math.abs(npra))} ${npra>=0?'added to':'taken from'} operating income. Enter operating revenue in Step 1 to see it in margin points.`;return;}
  const pts=npra/rev*100,inc=rev*m/100;const share=inc>0?npra/inc*100:null;const t3=S.track===3?R:run({track:3});const t3share=inc>0?t3.npra/inc*100:null;
  e.innerHTML=`<b style="color:var(--fg)">Margin context:</b> on ${fmt(rev)} of operating revenue at a ${m}% margin (${fmt(inc)} operating income), this result is <b style="color:var(--fg)">${pts>=0?'+':'−'}${Math.abs(pts).toFixed(2)} points of operating margin</b>${share!=null?` and ${Math.abs(share).toFixed(1)}% of operating income`:''}.${S.track!==3?` The same inputs in Track 3 would be ${fmtFull(t3.npra)}${t3share!=null&&t3.npra<0?`, a repayment equal to ${Math.abs(t3share).toFixed(1)}% of operating income`:''}.`:''}${m<=KH_MARGIN&&t3.npra<0?' At this margin that repayment is not a rounding error; the break-even multiplier above is the number to watch.':''}`;}
function breakEvenRisk(){const T=TRACKS[S.track];if(S.track===1)return 'Track 1 has no repayment, so there is no break-even to find; in Track 3 the same inputs give '+fmt(run({track:3}).npra)+'.';
  const f=r=>run({risk:r}).npra;const lo=f(.8),hi=f(1.2);if(lo>0)return `stays positive even if CMS's risk multiplier fell to 0.80 (target 20% lower than the slider).`;if(hi<0)return `stays negative even at a 1.20 multiplier; the fix has to come from spend, not case mix.`;
  let a=.8,b=1.2;for(let i=0;i<30;i++){const m=(a+b)/2;if(f(m)>0)b=m;else a=m;}const r=(a+b)/2;return `the result crosses zero at a risk multiplier of ${r.toFixed(3)}×, ${r<S.risk?'so you stay positive down to a target '+((1-r/S.risk)*100).toFixed(1)+'% below the slider':'so you need a target '+((r/S.risk-1)*100).toFixed(1)+'% above the slider to break even'}.`;}
function renderNet(){const box=$('netBoard');if(!box)return;if(!S.levers.on||!run().eps){box.style.display='none';return;}box.style.display='';
  const RL=run({levers:true});let ra=0,days=0,irf=0;CATS.forEach(c=>{const st=S.cats[c.key];if(!st.on)return;const n=catCalc(c,st,S.region,S.risk).n;const p=leverSavings(c.key);ra+=n*p.raAvoided;days+=n*p.snfDays;irf+=n*p.irfAvoided;});
  const lostRA=ra*S.net.raMargin,lostSNF=days*S.net.snfRev,net=RL.npra-S.net.cost-lostRA-lostSNF;
  tweenText($('netVal'),net,fmt);$('netVal').className='val '+(net>0?'pos':net<0?'neg':'');
  $('netDetail').innerHTML=`${fmtFull(RL.npra)} CMS reconciliation with the program − ${fmtFull(S.net.cost)} program cost − ${fmtFull(lostRA)} margin on ${ra.toFixed(0)} avoided readmissions − ${fmtFull(lostSNF)} on ${days.toFixed(0)} avoided SNF days in owned facilities${irf?` (${irf.toFixed(0)} patients kept out of inpatient rehab)`:''}. Compare with ${fmtFull(run({levers:false}).npra)} doing nothing.`;}
function drawCats(R){const svg=$('chCats');svg.innerHTML='';const W=560,H=230,L=150,Rm=70,top=14,bot=24;const ac=activeCats();const rows=R.rows.filter(r=>ac.includes(r.c.key));if(!rows.length){svg.appendChild(el('text',{x:W/2,y:H/2,'text-anchor':'middle'},'No episodes entered'));$('tblCats').innerHTML='';return;}
  const max=Math.max(1,...rows.map(r=>Math.abs(r.recon)));const bh=Math.min(34,(H-top-bot)/rows.length-8);const x0=L+(W-L-Rm)/2;const sc=(W-L-Rm)/2/max;
  svg.appendChild(el('line',{x1:x0,x2:x0,y1:top,y2:H-bot,class:'grid'}));
  rows.forEach((r,i)=>{const y=top+i*((H-top-bot)/rows.length)+((H-top-bot)/rows.length-bh)/2;const w=Math.abs(r.recon)*sc;const x=r.recon>=0?x0:x0-w;const g=el('g');
    g.appendChild(el('rect',{x,y,width:Math.max(w,1),height:bh,rx:3,fill:r.recon>=0?C.green:C.red,opacity:r.capped?.5:1}));
    g.appendChild(el('text',{x:L-8,y:y+bh/2+4,'text-anchor':'end',class:'strong'},r.c.short));
    g.appendChild(el('text',{x:r.recon>=0?x+w+6:x0+6,y:y+bh/2+4,'text-anchor':'start'},fmt(r.recon)));
    bindTip(g,`<b>${r.c.label}</b>${num(r.n)} episodes · target ${fmtFull(r.target)} · spend ${fmtFull(r.spend)}<br>${fmtFull(r.recon)}${r.capped?' (low-volume floor)':''}`);svg.appendChild(g);});
  $('tblCats').innerHTML='<table><thead><tr><th>Category</th><th class="n">Episodes</th><th class="n">Target</th><th class="n">Spend</th><th class="n">Reconciliation</th></tr></thead><tbody>'+rows.map(r=>`<tr><td>${r.c.label}</td><td class="n">${num(r.n)}</td><td class="n">${fmtFull(r.target)}</td><td class="n">${fmtFull(r.spend)}</td><td class="n">${fmtFull(r.recon)}</td></tr>`).join('')+'</tbody></table>';}

function drawSens(){const svg=$('chSens');svg.innerHTML='';const W=560,H=260,L=64,Rm=16,top=14,bot=34;const xs=[];for(let s=-15;s<=15;s+=1)xs.push(s);
  const series=[1,2,3].map(t=>({t,col:{1:C.green,2:C.teal,3:C.purple}[t],pts:xs.map(s=>run({track:t,shift:s/100}).npra)}));
  const all=series.flatMap(s=>s.pts);const R0=run();if(!R0.eps){svg.appendChild(el('text',{x:W/2,y:H/2,'text-anchor':'middle'},'No episodes entered'));$('tblSens').innerHTML='';return;}
  let lo=Math.min(0,...all),hi=Math.max(0,...all);if(hi===lo){hi=1;lo=-1;}const pad=(hi-lo)*.08;lo-=pad;hi+=pad;
  const X=s=>L+((s+15)/30)*(W-L-Rm),Y=v=>top+(hi-v)/(hi-lo)*(H-top-bot);
  for(let i=0;i<=4;i++){const v=lo+(hi-lo)*i/4;svg.appendChild(el('line',{x1:L,x2:W-Rm,y1:Y(v),y2:Y(v),class:'grid'}));svg.appendChild(el('text',{x:L-6,y:Y(v)+4,'text-anchor':'end'},fmt(v)));}
  svg.appendChild(el('line',{x1:L,x2:W-Rm,y1:Y(0),y2:Y(0),stroke:C.muted,'stroke-dasharray':'3 3'}));
  [-15,-10,-5,0,5,10,15].forEach(s=>svg.appendChild(el('text',{x:X(s),y:H-10,'text-anchor':'middle'},pct(s,0))));
  svg.appendChild(el('text',{x:W/2,y:H+2,'text-anchor':'middle',style:'font-size:11px'},'episode spend vs. target, all categories'));
  series.forEach(s=>{const d=s.pts.map((v,i)=>(i?'L':'M')+X(xs[i]).toFixed(1)+' '+Y(v).toFixed(1)).join(' ');svg.appendChild(el('path',{d,fill:'none',stroke:s.col,'stroke-width':s.t===S.track?3:1.8,opacity:s.t===S.track?1:.75}));
    xs.forEach((x,i)=>{const h=el('rect',{x:X(x)-9,y:top,width:18,height:H-top-bot,class:'hit'});bindTip(h,`<b>Spend ${pct(x,0)} vs target</b>Track 1 ${fmt(series[0].pts[i])} · Track 2 ${fmt(series[1].pts[i])} · Track 3 ${fmt(series[2].pts[i])}`);svg.appendChild(h);});});
  const cur=R0.aggT?((R0.aggS/R0.aggT)-1)*100:0;if(cur>=-15&&cur<=15){svg.appendChild(el('circle',{cx:X(cur),cy:Y(R0.npra),r:5,fill:C.fg,stroke:{1:C.green,2:C.teal,3:C.purple}[S.track],'stroke-width':2}));}
  $('tblSens').innerHTML='<table><thead><tr><th>Spend vs target</th><th class="n">Track 1</th><th class="n">Track 2</th><th class="n">Track 3</th></tr></thead><tbody>'+[-15,-10,-5,-2,0,2,5,10,15].map(s=>{const i=xs.indexOf(s);return `<tr><td>${pct(s,0)}</td><td class="n">${fmtFull(series[0].pts[i])}</td><td class="n">${fmtFull(series[1].pts[i])}</td><td class="n">${fmtFull(series[2].pts[i])}</td></tr>`;}).join('')+'</tbody></table>';}


function drawSetting(){const svg=$('chSetting');svg.innerHTML='';const W=560,H=250,L=64,Rm=16,top=14,bot=44;const rows=[];
  const acS=activeCats();CATS.forEach(c=>{const st=S.cats[c.key];if(!st.on||!acS.includes(c.key))return;const r=catCalc(c,st,S.region,S.risk);if(!r.n)return;const sh=SETTING[c.key],tot=sh[0]+sh[1]+sh[2];const sp=r.spend;const seg=[sp*sh[0]/tot,sp*sh[1]/tot,sp*sh[2]/tot];const cut=Math.min(seg[2],leverSavings(c.key).total);rows.push({c,sp,seg,cut,n:r.n});});
  if(!rows.length){svg.appendChild(el('text',{x:W/2,y:H/2,'text-anchor':'middle'},'No episodes entered'));$('tblSetting').innerHTML='';return;}
  const max=Math.max(...rows.map(r=>r.sp))*1.08;const slot=(W-L-Rm)/rows.length;const Y=v=>top+(1-v/max)*(H-top-bot);
  for(let i=0;i<=4;i++){const v=max*i/4;svg.appendChild(el('line',{x1:L,x2:W-Rm,y1:Y(v),y2:Y(v),class:'grid'}));svg.appendChild(el('text',{x:L-6,y:Y(v)+4,'text-anchor':'end'},fmt(v)));}
  rows.forEach((r,i)=>{const x=L+slot*i+slot*.18,bw=slot*.64;let y0=0;const cols=[C.purple,C.teal,C.green];const g=el('g');
    r.seg.forEach((v,j)=>{const rect=el('rect',{x,y:Y(y0+v),width:bw,height:Math.max(0,Y(y0)-Y(y0+v)),fill:cols[j],opacity:j===2&&r.cut>0?.45:1});g.appendChild(rect);if(j===2&&r.cut>0){g.appendChild(el('rect',{x,y:Y(y0+v-r.cut),width:bw,height:Math.max(0,Y(y0)-Y(y0+v-r.cut)),fill:C.green}));}y0+=v;});
    g.appendChild(el('text',{x:x+bw/2,y:Y(r.sp)-5,'text-anchor':'middle',class:'strong'},fmt(r.sp)));
    g.appendChild(el('text',{x:x+bw/2,y:H-bot+16,'text-anchor':'middle'},r.c.short));
    g.appendChild(el('text',{x:x+bw/2,y:H-bot+30,'text-anchor':'middle',style:'font-size:10px'},`post-acute ${Math.round(r.seg[2]/r.sp*100)}%`));
    bindTip(g,`<b>${r.c.label}</b>Anchor stay ${fmtFull(r.seg[0])} · Part B ${fmtFull(r.seg[1])} · post-acute ${fmtFull(r.seg[2])}${r.cut>0?`<br>Levers cut post-acute by ${fmtFull(r.cut)} per episode`:''}`);svg.appendChild(g);});
  $('tblSetting').innerHTML='<table><thead><tr><th>Category</th><th class="n">Anchor stay</th><th class="n">Part B anchor</th><th class="n">Post-acute</th><th class="n">Post-acute share</th><th class="n">Lever savings</th></tr></thead><tbody>'+rows.map(r=>`<tr><td>${r.c.label}</td><td class="n">${fmtFull(r.seg[0])}</td><td class="n">${fmtFull(r.seg[1])}</td><td class="n">${fmtFull(r.seg[2])}</td><td class="n">${Math.round(r.seg[2]/r.sp*100)}%</td><td class="n">${fmtFull(r.cut)}</td></tr>`).join('')+'</tbody></table>';}

function drawLevers(){const svg=$('chLevers');svg.innerHTML='';const W=560,H=250,L=64,Rm=16,top=14,bot=40;const lc=S.view==='all'?null:activeCats();const R0=run({levers:false});if(!R0.eps){svg.appendChild(el('text',{x:W/2,y:H/2,'text-anchor':'middle'},'No episodes entered'));$('tblLevers').innerHTML='';return;}
  const keys=[['snf','SNF use and days'],['irf','Inpatient rehab'],['ra','Readmissions'],['ssi','SSI'],['vte','VTE']];const steps=[{lab:'Today',v:R0.npra,abs:true}];let acc=[];let prev=R0.npra;
  keys.forEach(k=>{acc.push(k[0]);const r=run({levers:true,leverParts:acc.slice(),leverCats:lc});steps.push({lab:k[1],v:r.npra-prev,from:prev});prev=r.npra;});
  const RL=run({levers:true,leverCats:lc});steps.push({lab:'With program',v:RL.npra,abs:true});
  const vals=steps.map(s=>s.abs?s.v:s.from+s.v).concat(steps.map(s=>s.abs?s.v:s.from),[0]);let lo=Math.min(...vals),hi=Math.max(...vals);if(hi===lo){hi=lo+1;}const pad=(hi-lo)*.1;lo-=pad;hi+=pad;
  const slot=(W-L-Rm)/steps.length,Y=v=>top+(hi-v)/(hi-lo)*(H-top-bot);
  for(let i=0;i<=4;i++){const v=lo+(hi-lo)*i/4;svg.appendChild(el('line',{x1:L,x2:W-Rm,y1:Y(v),y2:Y(v),class:'grid'}));svg.appendChild(el('text',{x:L-6,y:Y(v)+4,'text-anchor':'end'},fmt(v)));}
  svg.appendChild(el('line',{x1:L,x2:W-Rm,y1:Y(0),y2:Y(0),stroke:C.muted}));
  steps.forEach((s,i)=>{const x=L+slot*i+slot*.2,bw=slot*.6;let a,b,col;if(s.abs){a=0;b=s.v;col=s.v>=0?C.purple:C.red;}else{a=s.from;b=s.from+s.v;col=s.v>=0?C.green:C.red;}
    const g=el('g');g.appendChild(el('rect',{x,y:Math.min(Y(a),Y(b)),width:bw,height:Math.max(1,Math.abs(Y(a)-Y(b))),rx:3,fill:col}));
    g.appendChild(el('text',{x:x+bw/2,y:Math.min(Y(a),Y(b))-5,'text-anchor':'middle',style:'font-size:11px'},s.abs?fmt(s.v):(s.v>=0?'+':'')+fmt(s.v)));
    const lab=s.lab.split(' ');g.appendChild(el('text',{x:x+bw/2,y:H-bot+14,'text-anchor':'middle',style:'font-size:10.5px'},lab.slice(0,2).join(' ')));if(lab.length>2)g.appendChild(el('text',{x:x+bw/2,y:H-bot+26,'text-anchor':'middle',style:'font-size:10.5px'},lab.slice(2).join(' ')));
    bindTip(g,`<b>${s.lab}</b>${s.abs?fmtFull(s.v):(s.v>=0?'+':'')+fmtFull(s.v)}`);svg.appendChild(g);});
  $('tblLevers').innerHTML='<table><thead><tr><th>Step</th><th class="n">Change</th><th class="n">Running NPRA</th></tr></thead><tbody>'+steps.map(s=>`<tr><td>${s.lab}</td><td class="n">${s.abs?'':(s.v>=0?'+':'')+fmtFull(s.v)}</td><td class="n">${fmtFull(s.abs?s.v:s.from+s.v)}</td></tr>`).join('')+'</tbody></table>';}

function drawFive(){const svg=$('chFive');svg.innerHTML='';const W=560,H=240,L=64,Rm=16,top=14,bot=30;const R0=run();if(!R0.eps){svg.appendChild(el('text',{x:W/2,y:H/2,'text-anchor':'middle'},'No episodes entered'));$('tblFive').innerHTML='';$('fiveSub').textContent='';return;}
  const years=[1,2,3,4,5].map(py=>{let t=S.track;if(!eligible(t,py,S.sn,S.rural).ok)t=3;const mult=Math.pow(1+S.improve/100,py-1),tm=Math.pow(1+S.regional/100,py-1);const r=run({track:t,spendMult:mult,targetMult:tm});return {py,t,mult,tm,npra:r.npra,aggT:r.aggT};});
  let cum=0;years.forEach(y=>{cum+=y.npra;y.cum=cum;});
  const all=years.flatMap(y=>[y.npra,y.cum]);let lo=Math.min(0,...all),hi=Math.max(0,...all);if(hi===lo){hi=1;lo=-1;}const pad=(hi-lo)*.1;lo-=pad;hi+=pad;
  const slot=(W-L-Rm)/5,X=i=>L+slot*i+slot/2,Y=v=>top+(hi-v)/(hi-lo)*(H-top-bot);
  for(let i=0;i<=4;i++){const v=lo+(hi-lo)*i/4;svg.appendChild(el('line',{x1:L,x2:W-Rm,y1:Y(v),y2:Y(v),class:'grid'}));svg.appendChild(el('text',{x:L-6,y:Y(v)+4,'text-anchor':'end'},fmt(v)));}
  svg.appendChild(el('line',{x1:L,x2:W-Rm,y1:Y(0),y2:Y(0),stroke:C.muted}));
  years.forEach((y,i)=>{const bw=slot*.46;const g=el('g');g.appendChild(el('rect',{x:X(i)-bw/2,y:Math.min(Y(0),Y(y.npra)),width:bw,height:Math.max(1,Math.abs(Y(y.npra)-Y(0))),rx:3,fill:y.npra>=0?C.green:C.red}));
    g.appendChild(el('text',{x:X(i),y:H-12,'text-anchor':'middle',class:'strong'},`PY${y.py} · ${2025+y.py}`));g.appendChild(el('text',{x:X(i),y:H+1,'text-anchor':'middle',style:'font-size:10px'},`${TRACKS[y.t].name} · paid ${2026+y.py}`));
    bindTip(g,`<b>PY${y.py} (${2025+y.py}) · ${TRACKS[y.t].name}</b>Spend ${pct((y.mult-1)*100,1)} vs PY1 · target ${pct((y.tm-1)*100,1)} · NPRA ${fmtFull(y.npra)}, settled in ${2026+y.py}<br>Cumulative ${fmtFull(y.cum)}`);svg.appendChild(g);});
  const d=years.map((y,i)=>(i?'L':'M')+X(i)+' '+Y(y.cum)).join(' ');svg.appendChild(el('path',{d,fill:'none',stroke:C.purple,'stroke-width':2.5}));years.forEach((y,i)=>svg.appendChild(el('circle',{cx:X(i),cy:Y(y.cum),r:4,fill:C.purple})));
  const last=years[4];$('fiveSub').textContent=`Same volumes every year, your spend changing ${pct(S.improve)} per year and the regional target ${pct(S.regional)} per year as the division improves and the baseline rolls forward${S.levers.on?', levers applied':''}. Each year's amount is settled the following year, after the performance year closes, with a later true-up for trend. Five-year total ${fmtFull(last.cum)}.`;
  $('tblFive').innerHTML='<table><thead><tr><th>Year</th><th>Track</th><th class="n">Spend vs PY1</th><th class="n">Target vs PY1</th><th class="n">NPRA</th><th>Settled</th><th class="n">Cumulative</th></tr></thead><tbody>'+years.map(y=>`<tr><td>PY${y.py} · ${2025+y.py}</td><td>${TRACKS[y.t].name}</td><td class="n">${pct((y.mult-1)*100,1)}</td><td class="n">${pct((y.tm-1)*100,1)}</td><td class="n">${fmtFull(y.npra)}</td><td>${2026+y.py}</td><td class="n">${fmtFull(y.cum)}</td></tr>`).join('')+'</tbody></table>';}


/* ---------- tabs and line scorecard ---------- */
function renderTabs(){const box=$('tabs');box.innerHTML='';const items=[{key:'all',label:'Hospital'}].concat(LINES().map(l=>({key:l.key,label:l.label})));items.forEach(it=>{const b=document.createElement('button');b.type='button';b.className='tab'+(S.view===it.key?' sel':'');b.setAttribute('role','tab');b.textContent=it.label;b.addEventListener('click',()=>{S.view=it.key;renderTabs();update();});box.appendChild(b);});}
function lineStats(l){const R=run({levers:false});let n=0,aggT=0,aggS=0,recon=0,pac=0,lev=0;const rows=[];
  CATS.forEach(c=>{if(!l.cats.includes(c.key))return;const st=S.cats[c.key];if(!st.on)return;const r=catCalc(c,st,S.region,S.risk);if(!r.n)return;rows.push(r);n+=r.n;aggT+=r.aggTarget;aggS+=r.aggSpend;recon+=r.recon;const sh=SETTING[c.key];pac+=r.aggSpend*sh[2]/(sh[0]+sh[1]+sh[2]);lev+=leverSavings(c.key).total*r.n;});
  const RL=run({levers:true,leverCats:l.cats});return {l,n,aggT,aggS,recon,pac,lev,rows,share:R.recon?recon/R.recon:0,hospRecon:R.recon,effect:RL.npra-run({levers:false}).npra,var:aggT?(aggS/aggT-1)*100:0,perEp:n?recon/n:0};}
function renderLineBoard(){const b=$('lineBoard');if(S.view==='all'){b.style.display='none';$('figLines').style.display='';return;}$('figLines').style.display='none';const l=LINES().find(x=>x.key===S.view);const st=lineStats(l);b.style.display='';
  const q=l.key==='ortho'?'Quality: the THA/TKA patient-reported outcome measure applies only to joint replacement, so this line carries a quality lever the others lack. Readmissions and PSI 90 apply to every line.':l.key==='cardiac'?'Quality: readmissions and PSI 90 only. CABG has the smallest post-acute share of the five categories, so the money here is in the anchor stay and readmissions.':l.key==='abd'?'Quality: readmissions and PSI 90. Infection is the lever: colectomy carries the highest surgical site infection rate in the model.':'Quality: readmissions and PSI 90. Inpatient rehab use is the lever for multi-level fusions.';
  b.innerHTML=`<div class="board-head"><span>${l.label} · contribution to the hospital result</span><span class="live">${st.n?num(st.n)+' episodes':'no episodes'}</span></div>
  <div class="tiles five">
    <div class="tile"><div class="lab">Spend vs target</div><div class="val">${pct(st.var)}</div><div class="delta">${fmt(st.aggS)} on ${fmt(st.aggT)} target</div></div>
    <div class="tile"><div class="lab">Dollars vs target</div><div class="val" style="color:${st.recon>=0?'var(--green-soft)':'var(--red)'}">${fmt(st.recon)}</div><div class="delta">${fmtFull(st.perEp)} per episode</div></div>
    <div class="tile"><div class="lab">Share of hospital result</div><div class="val">${st.hospRecon?Math.round(st.share*100)+'%':'n/a'}</div><div class="delta">of ${fmt(st.hospRecon)} before adjustments</div></div>
    <div class="tile"><div class="lab">Post-acute spend</div><div class="val">${fmt(st.pac)}</div><div class="delta">${st.aggS?Math.round(st.pac/st.aggS*100):0}% of this line's spend</div></div>
    <div class="tile"><div class="lab">This line's levers</div><div class="val" style="color:var(--green-soft)">${fmt(st.lev)}</div><div class="delta">${S.levers.on?'changes hospital NPRA by '+fmt(st.effect):'turn on levers in Step 5 to apply'}</div></div>
  </div>
  <div class="board-foot">${q} CMS reconciles the hospital as one book: the net payment above the charts is always the hospital number, and this line's levers move it by ${fmt(st.effect)}.</div>`;}
function drawLines(){const svg=$('chLines');svg.innerHTML='';const W=560,H=230,L=64,Rm=64,top=26,bot=40;const stats=LINES().map(lineStats).filter(s=>s.n>0);if(!stats.length){svg.appendChild(el('text',{x:W/2,y:H/2,'text-anchor':'middle'},'No episodes entered'));$('tblLines').innerHTML='';return;}
  const maxB=Math.max(1,...stats.map(s=>Math.abs(s.recon)));const maxD=Math.max(1,...stats.map(s=>Math.abs(s.perEp)));const slot=(W-L-Rm)/stats.length;const Y=v=>top+(0.5-v/maxB/2)*(H-top-bot);const YD=v=>top+(0.5-v/maxD/2)*(H-top-bot);
  [-1,-.5,0,.5,1].forEach(f=>{svg.appendChild(el('line',{x1:L,x2:W-Rm,y1:Y(f*maxB),y2:Y(f*maxB),class:'grid'}));svg.appendChild(el('text',{x:L-6,y:Y(f*maxB)+4,'text-anchor':'end'},fmt(f*maxB)));svg.appendChild(el('text',{x:W-Rm+6,y:YD(f*maxD)+4,'text-anchor':'start'},fmt(f*maxD)));});
  svg.appendChild(el('text',{x:L-6,y:top-4,'text-anchor':'end',style:'font-size:10px'},'total'));svg.appendChild(el('text',{x:W-Rm+6,y:top-4,'text-anchor':'start',style:'font-size:10px'},'per episode'));
  stats.forEach((s,i)=>{const x=L+slot*i+slot*.25,bw=slot*.5;const g=el('g');g.appendChild(el('rect',{x,y:Math.min(Y(0),Y(s.recon)),width:bw,height:Math.max(1,Math.abs(Y(0)-Y(s.recon))),rx:3,fill:s.recon>=0?C.green:C.red}));
    g.appendChild(el('circle',{cx:x+bw/2,cy:YD(s.perEp),r:5,fill:C.fg,stroke:C.purple,'stroke-width':2}));
    g.appendChild(el('text',{x:x+bw/2,y:H-bot+16,'text-anchor':'middle',class:'strong'},s.l.label));g.appendChild(el('text',{x:x+bw/2,y:H-bot+30,'text-anchor':'middle',style:'font-size:10px'},`${num(s.n)} ep · ${pct(s.var)}`));
    bindTip(g,`<b>${s.l.label}</b>${fmtFull(s.recon)} vs target on ${num(s.n)} episodes<br>${fmtFull(s.perEp)} per episode · spend ${pct(s.var)} vs target<br>Levers worth ${fmtFull(s.lev)}`);svg.appendChild(g);});
  $('tblLines').innerHTML='<table><thead><tr><th>Line</th><th class="n">Episodes</th><th class="n">Spend vs target</th><th class="n">Dollars vs target</th><th class="n">Per episode</th><th class="n">Post-acute</th><th class="n">Levers</th></tr></thead><tbody>'+stats.map(s=>`<tr><td>${s.l.label}</td><td class="n">${num(s.n)}</td><td class="n">${pct(s.var)}</td><td class="n">${fmtFull(s.recon)}</td><td class="n">${fmtFull(s.perEp)}</td><td class="n">${fmtFull(s.pac)}</td><td class="n">${fmtFull(s.lev)}</td></tr>`).join('')+'</tbody></table>';}
$('spineOrtho').addEventListener('change',()=>{S.spineOrtho=$('spineOrtho').checked;if(!LINES().some(l=>l.key===S.view))S.view='all';renderTabs();update();});

/* ---------- case hospitals ---------- */
function applyPreset(){CATS.forEach(c=>{const cu=S.levers.cur[c.key],t=S.levers.tgt[c.key];t.snf=+Math.max(0,cu.snf-5).toFixed(1);t.days=+Math.max(0,cu.days-3).toFixed(1);t.irf=+Math.max(0,cu.irf-2).toFixed(1);t.ra=+(cu.ra*0.8).toFixed(2);t.ssi=+(cu.ssi*0.7).toFixed(2);t.vte=+(cu.vte*0.75).toFixed(2);
    const raw=leverSavings(c.key,true).total;if(raw>CAP_PER_EPISODE){const f=CAP_PER_EPISODE/raw;['snf','days','irf','ra','ssi','vte'].forEach(k=>{t[k]=+(cu[k]-(cu[k]-t[k])*f).toFixed(2);});}});}
function applyCaseState(cs){S.hospital=null;S.caseId=cs.id;S.region=cs.region;S.py=1;S.track=cs.track;S.levers.on=false;
  const dv=applyPublic(cs.ccn);
  if(!dv){S.sn=!!cs.sn;S.rural=!!cs.rural;S.cqs=cs.cqs||50;S.risk=1;}
  if(cs.sn!=null)S.sn=!!cs.sn; if(cs.rural!=null)S.rural=!!cs.rural;
  cs.episodes=dv?dv.E:0;}
function syncDom(keepHosp){if(!keepHosp)hospIn.value='';regionSel.value=S.region;$('safetyNet').checked=S.sn;$('ruralType').checked=S.rural;$('py').value=S.py;$('risk').value=S.risk;$('riskOut').textContent=S.risk.toFixed(2)+'×';$('cqs').value=S.cqs;$('cqsOut').textContent=String(Math.round(S.cqs));$('leversOn').checked=S.levers.on;
  const shifts={};CATS.forEach(c=>{const st=S.cats[c.key];const base=catCalc(c,Object.assign({},st,{spend:null}),S.region,S.risk);shifts[c.key]=base.target&&st.spend!=null?((st.spend/base.target)-1)*100:0;});
  buildTracks();buildCats();
  CATS.forEach(c=>{const st=S.cats[c.key];const base=catCalc(c,Object.assign({},st,{spend:null}),S.region,S.risk);const sh=shifts[c.key];st.spend=Math.round(base.target*(1+sh/100));const sl=document.querySelector(`[data-shift="${c.key}"]`);if(sl){sl.value=Math.max(-20,Math.min(20,sh));document.querySelector(`[data-shiftout="${c.key}"]`).textContent=pct(sh);}const si=document.querySelector(`[data-spend="${c.key}"]`);if(si)si.value=st.spend;});
  syncLeverInputs();renderCases();}
function renderCases(){const box=$('cases');box.innerHTML='';CASES.forEach(cs=>{const b=document.createElement('button');b.type='button';b.className='case'+(S.caseId===cs.id?' sel':'');const dvE=derivePublic(HM.h[cs.ccn]);b.innerHTML=`<span>${cs.name}</span><small>${cs.place} · ${num(dvE?dvE.E:0)} episodes</small>`;b.addEventListener('click',()=>loadCase(cs.id));box.appendChild(b);});}
function loadCase(id){const cs=CASES.find(c=>c.id===id);if(!cs)return;applyCaseState(cs);syncDom();
  const h=HM.h[cs.ccn],dv=derivePublic(h);
  $('caseNotes').style.display='';$('caseHead').textContent=cs.name+' · '+cs.place;$('caseTag').textContent=cs.archetype;$('caseStory').textContent=cs.story;$('caseWatch').textContent='Watch: '+cs.watch;$('caseProv').textContent=cs.beds+'. '+cs.prov;
  $('cqsNote').innerHTML=dv?cqsNoteHTML(h,dv):'';buildLevers();
  $('hospMeta').innerHTML=`Case hospital loaded: ${esc(cs.name)}, ${esc(cs.place)}. Census division ${cs.region}, ${DIVS[cs.region]}.${S.sn?' Flagged safety-net from its Medicare SSI share.':''}${S.rural?' Rural per the FY2027 impact file.':''} Every input below comes from the public files listed; the case is named by type and city, not by hospital.`+(dv?factsHTML(h,dv).replace(/<div class="fact"><span class="fl">Profile.*?<\/div>/,''):'');
  update();}
function clearCase(){if(S.caseId){S.caseId=null;$('caseNotes').style.display='none';renderCases();}}
function drawCases(){const svg=$('chCases');svg.innerHTML='';const W=900,H=300,L=70,Rm=16,top=16,bot=50;const saved=JSON.stringify({cats:S.cats,levers:S.levers,region:S.region,sn:S.sn,rural:S.rural,py:S.py,track:S.track,cqs:S.cqs,risk:S.risk,hospital:S.hospital,caseId:S.caseId,view:S.view});
  const rows=CASES.map(cs=>{applyCaseState(cs);const t1=eligible(1,1,S.sn,S.rural).ok?run({track:1,levers:false}).npra:null;const t3=run({track:3,levers:false}).npra;applyPreset();const t3p=run({track:3,levers:true}).npra;const aggT=run({track:3,levers:false}).aggT;return {cs,t1,t3,t3p,aggT};});
  const o=JSON.parse(saved);S.cats=o.cats;S.levers=o.levers;S.region=o.region;S.sn=o.sn;S.rural=o.rural;S.py=o.py;S.track=o.track;S.cqs=o.cqs;S.risk=o.risk;S.hospital=o.hospital;S.caseId=o.caseId;S.view=o.view;
  rows.forEach(r=>{r.p1=r.t1==null?null:r.t1/r.aggT*100;r.p3=r.t3/r.aggT*100;r.p3p=r.t3p/r.aggT*100;});const all=rows.flatMap(r=>[r.p1||0,r.p3,r.p3p,0]);let lo=Math.min(...all),hi=Math.max(...all);const pad=(hi-lo)*.12;lo-=pad;hi+=pad;const slot=(W-L-Rm)/rows.length,Y=v=>top+(hi-v)/(hi-lo)*(H-top-bot);
  for(let i=0;i<=4;i++){const v=lo+(hi-lo)*i/4;svg.appendChild(el('line',{x1:L,x2:W-Rm,y1:Y(v),y2:Y(v),class:'grid'}));svg.appendChild(el('text',{x:L-6,y:Y(v)+4,'text-anchor':'end'},pct(v,1)));}
  svg.appendChild(el('text',{x:L-6,y:top-4,'text-anchor':'end',style:'font-size:10px'},'% of target book'));
  svg.appendChild(el('line',{x1:L,x2:W-Rm,y1:Y(0),y2:Y(0),stroke:C.muted}));
  rows.forEach((r,i)=>{const bw=slot*.22;const xs=[L+slot*i+slot*.14,L+slot*i+slot*.39,L+slot*i+slot*.64];const vals=[r.p1,r.p3,r.p3p];const dol=[r.t1,r.t3,r.t3p];const cols=[C.green,C.purple,C.teal];const g=el('g');
    vals.forEach((v,j)=>{if(v==null)return;g.appendChild(el('rect',{x:xs[j],y:Math.min(Y(0),Y(v)),width:bw,height:Math.max(1,Math.abs(Y(0)-Y(v))),rx:3,fill:cols[j]}));g.appendChild(el('text',{x:xs[j]+bw/2,y:(v>=0?Y(v)-4:Y(v)+12),'text-anchor':'middle',style:'font-size:9.5px'},fmt(dol[j])));});
    g.appendChild(el('text',{x:L+slot*i+slot/2,y:H-bot+16,'text-anchor':'middle',class:'strong'},r.cs.name.length>26?r.cs.name.slice(0,24)+'…':r.cs.name));g.appendChild(el('text',{x:L+slot*i+slot/2,y:H-bot+30,'text-anchor':'middle',style:'font-size:10px'},`${r.cs.place} · ${num(r.cs.episodes)} ep · target ${fmt(r.aggT)}`));
    bindTip(g,`<b>${r.cs.name}, ${r.cs.place}</b>Track 1 ${r.t1==null?'not available':fmtFull(r.t1)} · Track 3 ${fmtFull(r.t3)} (${pct(r.p3,1)} of target)<br>Track 3 with program ${fmtFull(r.t3p)} (${pct(r.p3p,1)})`);svg.appendChild(g);});
  $('tblCases').innerHTML='<table><thead><tr><th>Hospital</th><th>Region</th><th class="n">Episodes</th><th class="n">Target book</th><th class="n">Track 1</th><th class="n">Track 3</th><th class="n">Track 3 + program</th></tr></thead><tbody>'+rows.map(r=>`<tr><td>${r.cs.name}<br><small style="color:var(--muted)">${r.cs.place}</small></td><td>${DIVS[r.cs.region]}</td><td class="n">${num(r.cs.episodes)}</td><td class="n">${fmtFull(r.aggT)}</td><td class="n">${r.t1==null?'n/a':fmtFull(r.t1)}</td><td class="n">${fmtFull(r.t3)}</td><td class="n">${fmtFull(r.t3p)}</td></tr>`).join('')+'</tbody></table>';}

/* form: Netlify handles the POST on jaybeatty.com; elsewhere show the scenario to copy */
$('capForm').addEventListener('submit',e=>{const h=window.location.hostname;if(h.endsWith('jaybeatty.com')||h.endsWith('netlify.app'))return;e.preventDefault();const s=JSON.parse($('cScenario').value||'{}');const ok=$('capOk');ok.style.display='block';ok.innerHTML='Preview build: nothing was sent. Email <b>jay@jaybeatty.com</b> with this scenario: '+esc(JSON.stringify(s));});


/* ---------- how TEAM pays: animated six-step flow on the loaded hospital's numbers ---------- */
let flowPlayed=false,flowTimers=[];
function drawFlow(animate){const svg=$('chFlow');if(!svg)return;flowTimers.forEach(clearTimeout);flowTimers=[];svg.innerHTML='';
  const R=run(),R0=run({seq:false});const T=TRACKS[S.track];
  $('flowTitle').textContent=(S.caseId?CASES.find(c=>c.id===S.caseId).name:S.hospital?S.hospital.name:'Your inputs')+' · '+T.name+' · PY'+S.py+', step by step';
  if(!R.eps){svg.setAttribute('viewBox','0 0 1080 120');svg.appendChild(el('text',{x:540,y:64,'text-anchor':'middle'},'Load a case or enter episodes and the six steps play here with your numbers.'));return;}
  const vert=svg.getBoundingClientRect().width<620;const W=vert?480:1080,H=vert?6*118+20:330;svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  const pos=R.recon>=0;const col=pos?C.green:C.red;const sgn=v=>v>0?'+'+fmt(v):v<0?fmt(v):'$0';
  const big=Math.max(R.aggT,R.aggS)||1;const small=Math.max(Math.abs(R.base),Math.abs(R.qa),Math.abs(R.npra),Math.abs(R0.npra),1)*1.15;
  const stages=[
   {n:'01 · Trigger',t:`${num(R.eps)} episodes`,s:'traditional-Medicare surgeries this year'},
   {n:'02 · Target',t:fmt(R.aggT)+' target book',s:'regional price × risk multiplier × episodes'},
   {n:'03 · Compare',t:sgn(R.recon),s:`spend ${fmt(R.aggS)}, ${pct(R.aggT?(R.aggS/R.aggT-1)*100:0)} vs target`},
   {n:'04 · Quality',t:sgn(R.qa),s:S.track===1&&R.recon<0?'Track 1: negative set to $0':R.base>0?`${(R.adjPct*100).toFixed(1)}% withheld at CQS ${Math.round(S.cqs)}`:R.base<0?`${(R.adjPct*100).toFixed(1)}% relief at CQS ${Math.round(S.cqs)}`:'nothing to adjust'},
   {n:'05 · Limits',t:sgn(R0.npra),s:R.capHit==='gain'?`stop-gain: capped at ${(T.gain*100)}% of target`:R.capHit==='loss'?`stop-loss: capped at ${(T.loss*100)}% of target`:`inside the ${(T.gain*100)}% ${T.loss?'/ '+(T.loss*100)+'% ':''}limits`},
   {n:'06 · Settle',t:sgn(R.npra),s:R.npra>0?(R.seqAmt?`paid by CMS in ${2026+S.py}, after 2% sequestration`:`paid by CMS in ${2026+S.py}`):R.npra<0?`repaid to CMS in ${2026+S.py}`:'nothing changes hands'}];
  const cell=k=>vert?{x:20,y:10+k*118,w:W-40,h:108}:{x:20+k*176,y:16,w:160,h:H-32};
  const groups=[];
  stages.forEach((st,k)=>{const c=cell(k);const g=el('g',{class:'stage',opacity:animate?0:1});groups.push(g);
    g.appendChild(el('rect',{x:c.x,y:c.y,width:c.w,height:c.h,rx:10,fill:C.panel||'#1c1730',stroke:C.line}));
    g.appendChild(el('text',{x:c.x+12,y:c.y+20,class:'mono',fill:C.green},st.n));
    const lab=el('text',{x:c.x+12,y:c.y+(vert?44:c.h-34),class:'strong',style:'font-size:15px'},st.t);g.appendChild(lab);
    const sub=el('text',{x:c.x+12,y:c.y+(vert?62:c.h-16),style:'font-size:10.5px'},st.s);g.appendChild(sub);
    // plot area
    const px=vert?c.x+12:c.x+12,py=vert?c.y+74:c.y+34,pw=vert?c.w-24:c.w-24,ph=vert?22:c.h-84;
    const bars=[];const bar=(frac,fill,opt={})=>{frac=Math.max(0,Math.min(1,frac));let r;if(vert){r=el('rect',{x:px+(opt.off||0)*pw,y:py+(opt.lane||0)*(ph/2+2),width:frac*pw,height:opt.lanes?ph/2:ph,rx:3,fill,opacity:opt.op||1});}else{const bw=opt.lanes?(pw-6)/2:pw;const x=px+(opt.lane||0)*(bw+6);const h=frac*ph;r=el('rect',{x:x+(opt.off||0)*bw,y:py+ph-h,width:bw,height:h,rx:3,fill,opacity:opt.op||1});}g.appendChild(r);bars.push({r,frac});return r;};
    if(k===0){const n=Math.min(R.eps,vert?40:72),cols=vert?20:12,sz=vert?(pw/20-3):(pw/12-3);for(let i=0;i<n;i++){const cx=px+(i%cols)*(sz+3),cy=vert?py:py+ph-sz-Math.floor(i/cols)*(sz+3);g.appendChild(el('rect',{x:cx,y:cy,width:sz,height:sz,rx:2,fill:C.purple,opacity:.85}));}if(R.eps>n)g.appendChild(el('text',{x:px+pw,y:vert?py+ph+12:py+12,'text-anchor':'end',style:'font-size:10px'},`each square ≈ ${Math.ceil(R.eps/n)} episodes`));}
    if(k===1)bar(R.aggT/big,C.purple);
    if(k===2){bar(R.aggT/big,C.purple,{lanes:true,lane:0});bar(R.aggS/big,C.teal,{lanes:true,lane:1});}
    if(k===3){const b=Math.abs(R.base)/small;bar(b,col,{});if(R.adjAmt)bar(Math.abs(R.adjAmt)/small,C.amber,{op:.95});}
    if(k===4){bar(Math.abs(R.qa)/small,col,{op:.35});bar(Math.abs(R0.npra)/small,col,{});const cap=(R0.npra>=0?R.gainCap:R.lossCap)/small;if(cap<=1&&cap>0){if(vert)g.appendChild(el('line',{x1:px+cap*pw,x2:px+cap*pw,y1:py-4,y2:py+ph+4,stroke:C.amber,'stroke-dasharray':'3 3'}));else g.appendChild(el('line',{x1:px,x2:px+pw,y1:py+ph-cap*ph,y2:py+ph-cap*ph,stroke:C.amber,'stroke-dasharray':'3 3'}));}}
    if(k===5){bar(Math.abs(R.npra)/small,col,{});if(R.seqAmt)bar((Math.abs(R.npra)+R.seqAmt)/small,C.amber,{op:.35});}
    svg.appendChild(g);
    if(k<5){const a=el('path',{class:'arrow',d:vert?`M${c.x+c.w/2} ${c.y+c.h+1} l-5 -7 h10 z`:`M${c.x+c.w+2} ${c.y+c.h/2} l-7 -5 v10 z`,fill:C.muted,opacity:animate?0:.9});svg.appendChild(a);groups[k].arrow=a;}
    if(animate){bars.forEach(b=>{const r=b.r;r.style.transition='none';if(vert){r.style.width='0px';}else{r.style.y=(py+ph)+'px';r.style.height='0px';}r.getBBox();r.style.transition='';});groups[k].bars=bars;groups[k].play=()=>{bars.forEach(b=>{const r=b.r;if(vert)r.style.width=r.getAttribute('width')+'px';else{r.style.y=r.getAttribute('y')+'px';r.style.height=r.getAttribute('height')+'px';}});};}});
  if(animate){groups.forEach((g,k)=>{flowTimers.push(setTimeout(()=>{g.setAttribute('opacity',1);g.play&&g.play();if(g.arrow)setTimeout(()=>g.arrow.setAttribute('opacity',.9),350);},200+k*700));});}}

/* ---------- checks against CMS worked examples and published evaluations ---------- */
function renderChecks(){const box=$('checksBody');if(!box)return;const rows=[];
  const w=[650,650,400],sc=[60,50,40],tot=w[0]+w[1]+w[2];const cqs=(w[0]*sc[0]+w[1]*sc[1]+w[2]*sc[2])/tot;
  rows.push(['CMS quality-scoring fact sheet, weighting example','650 inpatient episodes for readmission and PSI-90, 400 joint episodes for the PRO-PM, scaled scores 60, 50 and 40','CQS 51.4',`CQS ${cqs.toFixed(1)}`,'Same formula; CMS rounds the weights to two decimals before multiplying, which is the 0.1 difference.']);
  [0,50,100].forEach(c=>{const q=qualityAdj(10000,c,3);rows.push([`Positive reconciliation of $10,000 at CQS ${c}`,'10% × (1 − CQS/100) withheld','$'+(10000-1000*(1-c/100)).toLocaleString('en-US'),fmtFull(q.qa),'Matches the fact sheet table.']);});
  [[2,100,8500],[2,0,10000],[3,100,9000],[3,50,9500]].forEach(([t,c,exp])=>{const q=qualityAdj(-10000,c,t);rows.push([`Negative reconciliation of −$10,000, Track ${t}, CQS ${c}`,`${t===2?'15%':'10%'} × CQS/100 relief`,'−$'+exp.toLocaleString('en-US'),fmtFull(q.qa),'Matches the fact sheet table.']);});
  const u=S.levers.unit;const cjr=0.05*(u.irf-u.hh-u.optx)+0.02*(10*u.snfDay-u.hh-u.optx);
  rows.push(['CJR evaluation, PY6 to PY8','Elective joint episodes: 5 points of patients moved from inpatient rehab to home with home health, 2 points out of SNF (10-day stays), at this page\'s unit costs','$1,226 saved per episode',fmtFull(cjr)+' before realization','The lever math lands in the range CMS measured, which is why the typical-program preset is capped at $'+CAP_PER_EPISODE.toLocaleString('en-US')+' per episode and then scaled by the realization slider.']);
  const bp=3*u.snfDay;rows.push(['BPCI Advanced evaluation (AR7)','Three fewer SNF days per episode at this page\'s SNF per-diem','about $500 lower SNF payments per episode',fmtFull(bp),'Within range; the evaluation also found 1.45 fewer percentage points discharged to institutional care and no change in readmissions.']);
  box.innerHTML='<table><thead><tr><th>Check</th><th>Inputs</th><th class="n">Published</th><th class="n">This page</th><th>Note</th></tr></thead><tbody>'+rows.map(r=>`<tr><td>${r[0]}</td><td style="color:var(--muted)">${r[1]}</td><td class="n">${r[2]}</td><td class="n"><b>${r[3]}</b></td><td style="color:var(--muted)">${r[4]}</td></tr>`).join('')+'</tbody></table>';}
$('seq').addEventListener('change',e=>{S.seq=e.target.checked;update();});
$('opRev').addEventListener('input',e=>{S.op.rev=e.target.value===''?null:Math.max(0,parseFloat(e.target.value)||0);S.op.src='user';$('opSrc').textContent='Your figures.';update();});
$('opMargin').addEventListener('input',e=>{S.op.margin=parseFloat(e.target.value)||0;S.op.src='user';$('opSrc').textContent='Your figures.';update();});
$('regional').addEventListener('input',e=>{S.regional=parseFloat(e.target.value);$('regionalOut').textContent=pct(S.regional)+'/yr';update();});
$('real').addEventListener('input',e=>{S.levers.real=parseFloat(e.target.value);$('realOut').textContent=S.levers.real+'%';update();});
document.querySelectorAll('[data-net]').forEach(i=>i.addEventListener('input',e=>{S.net[e.target.dataset.net]=Math.max(0,parseFloat(e.target.value)||0);update();}));

/* init */
(function(){const f=$('figFlow');if(!f)return;const io=new IntersectionObserver(es=>{es.forEach(x=>{if(x.isIntersecting&&!flowPlayed){flowPlayed=true;if(!RM)drawFlow(true);io.disconnect();}});},{threshold:.35});io.observe(f);$('flowReplay').addEventListener('click',()=>{if(RM)return drawFlow(false);drawFlow(true);});let rt=null;window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>drawFlow(false),200);});})();
renderChecks();syncOpInputs();buildTracks();buildCats();buildLevers();renderTabs();renderCases();drawCases();loadCase('community');
window.TEAMCALC={S,CATS,run,catCalc,applyCaseState,derivePublic,leverSavings,applyPreset,eligible,HM,CASES,loadCase,pick,PARTS};
})();
