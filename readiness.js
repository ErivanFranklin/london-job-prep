(function(){
  const DATA=[
    {id:'job',title:'Your UK Job',weight:30,desc:'The most important move gate because you are currently the only household income.',tasks:[
      ['job-target','Target roles and £95k–£110k+ salary range defined',true,false],
      ['job-apps','Applications actively underway',false,true],
      ['job-interviews','Interview process underway',false,true],
      ['job-offer','Signed UK offer with acceptable salary and hybrid pattern',false,true]
    ]},
    {id:'midleton',title:'Midleton Sale',weight:15,desc:'Turn the property into known relocation capital rather than an uncertain asset.',tasks:[
      ['mid-balance','Mortgage balance recorded',true,false],
      ['mid-value','Current market valuation obtained from an estate agent',false,false],
      ['mid-costs','Sale costs and tax position estimated',false,false],
      ['mid-sale','Property listed / sale agreed',false,true],
      ['mid-net','Net proceeds known or sale completed',false,true]
    ]},
    {id:'kildare',title:'Kildare Rental',weight:15,desc:'Make sure the retained Irish property is operationally and financially safe to rent.',tasks:[
      ['kil-balance','Mortgage balance recorded',true,false],
      ['kil-rent','Indicative rent researched',true,false],
      ['kil-consent','Lender consent-to-let confirmed',false,true],
      ['kil-insurance','Landlord insurance and RTB obligations confirmed',false,true],
      ['kil-tax','Irish / UK rental-tax treatment reviewed',false,true],
      ['kil-manage','Agent / management plan selected',false,false]
    ]},
    {id:'cash',title:'Cash Reserve',weight:15,desc:'Protect the family from overlap between London rent, Irish property costs and a new job transition.',tasks:[
      ['cash-budget','Relocation budget built',false,false],
      ['cash-deposit','London deposit + first month reserved',false,true],
      ['cash-move','Moving and setup costs reserved',false,false],
      ['cash-buffer','£25k–£35k post-move accessible cash buffer target met',false,true]
    ]},
    {id:'housing',title:'London Housing',weight:10,desc:'Rent first, but only after the office pattern and best commute corridor are clear.',tasks:[
      ['house-cap','Rent ceiling of about £2,500/month defined',true,false],
      ['house-corridor','Final corridor chosen using actual job locations',false,true],
      ['house-live','Live rental options researched in final corridor',false,false],
      ['house-tenancy','Tenancy secured',false,true]
    ]},
    {id:'school',title:'School & Family',weight:5,desc:'Protect family stability by checking school and daily-life practicality before signing a tenancy.',tasks:[
      ['school-state','UK state primary school route selected',true,false],
      ['school-check','School options / catchments checked for final area',false,true],
      ['school-routine','Family travel / childcare / daily routine tested for final area',false,false]
    ]},
    {id:'location',title:'Location Decision',weight:10,desc:'Use actual offers to choose the correct side of London rather than committing too early.',tasks:[
      ['loc-shortlist','Reading / Watford / Orpington shortlist built',true,false],
      ['loc-church','CCUK / CCB-related church network mapped',true,false],
      ['loc-map','Commute and job-hub decision map built',true,false],
      ['loc-final','Final location selected using actual job offers',false,true]
    ]}
  ];

  const KEY='erivan_relocation_readiness_v1';
  let saved=JSON.parse(localStorage.getItem(KEY)||'{}');
  saved.tasks=saved.tasks||{};

  // Seed only known milestones the first time this runs. After that, user choices win.
  if(!saved.seeded){
    DATA.forEach(cat=>cat.tasks.forEach(([id,label,known])=>{if(known)saved.tasks[id]=true;}));
    saved.seeded=true;
    localStorage.setItem(KEY,JSON.stringify(saved));
  }

  function categoryPct(cat){
    const done=cat.tasks.filter(t=>!!saved.tasks[t[0]]).length;
    return cat.tasks.length?done/cat.tasks.length:0;
  }
  function overall(){return Math.round(DATA.reduce((sum,cat)=>sum+(categoryPct(cat)*cat.weight),0));}
  function criticalOpen(){
    const all=[];
    DATA.forEach(cat=>cat.tasks.forEach(t=>{if(t[3]&&!saved.tasks[t[0]])all.push({cat:cat.title,label:t[1],id:t[0]});}));
    return all;
  }
  function stateLabel(score){
    if(score>=85)return 'Move-ready';
    if(score>=65)return 'Nearly ready';
    if(score>=40)return 'Building readiness';
    return 'Planning stage';
  }

  function render(){
    const host=document.getElementById('readinessCategories');
    if(!host)return;
    host.innerHTML=DATA.map(cat=>{
      const pct=Math.round(categoryPct(cat)*100);
      const tasks=cat.tasks.map(([id,label,known,critical])=>`<label class="readiness-task"><input type="checkbox" data-ready-task="${id}" ${saved.tasks[id]?'checked':''}><span>${label}${critical?'<span class="critical-tag">move gate</span>':''}</span></label>`).join('');
      return `<section class="readiness-category" data-ready-cat="${cat.id}"><div class="readiness-cat-head"><div><h4>${cat.title}</h4><p>${cat.desc}</p></div><span class="weight-badge">${cat.weight}% weight</span></div><div class="readiness-cat-progress"><i style="width:${pct}%"></i></div><div class="readiness-task-list">${tasks}</div></section>`;
    }).join('');

    document.querySelectorAll('[data-ready-task]').forEach(cb=>cb.addEventListener('change',()=>{
      saved.tasks[cb.dataset.readyTask]=cb.checked;
      localStorage.setItem(KEY,JSON.stringify(saved));
      updateSummary();
    }));
    updateSummary();
  }

  function updateSummary(){
    const score=overall();
    const blockers=criticalOpen();
    const ring=document.getElementById('readinessRing');
    const pct=document.getElementById('readinessPct');
    const state=document.getElementById('readinessState');
    const blockerCount=document.getElementById('blockerCount');
    const blockerList=document.getElementById('blockerList');
    const miniScore=document.getElementById('miniReadinessScore');
    const miniBlockers=document.getElementById('miniReadinessBlockers');

    if(ring)ring.style.setProperty('--pct',score);
    if(pct)pct.textContent=score+'%';
    if(state)state.textContent=stateLabel(score);
    if(blockerCount)blockerCount.textContent=blockers.length;
    if(miniScore)miniScore.textContent=score+'% readiness';
    if(miniBlockers)miniBlockers.textContent=blockers.length+' move gate'+(blockers.length===1?'':'s')+' still open';

    if(blockerList){
      blockerList.innerHTML=blockers.length?blockers.map(b=>`<div class="blocker"><i></i><span><b>${b.cat}:</b> ${b.label}</span></div>`).join(''):'<div class="blocker done"><i></i><span><b>No critical blockers open.</b> Recheck timing, contracts and cash before committing to the move.</span></div>';
    }

    DATA.forEach(cat=>{
      const box=document.querySelector('[data-ready-cat="'+cat.id+'"]');
      if(box){const p=Math.round(categoryPct(cat)*100);box.querySelector('.readiness-cat-progress i').style.width=p+'%';}
    });
  }

  document.addEventListener('DOMContentLoaded',()=>{
    render();
    const openBtn=document.getElementById('openReadiness');
    if(openBtn)openBtn.addEventListener('click',()=>{
      const nav=[...document.querySelectorAll('.nav-btn')].find(b=>b.dataset.screen==='readiness');
      if(nav)nav.click();
    });
  });
})();