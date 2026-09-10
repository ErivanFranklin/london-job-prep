const phaseData=[
['p0','Phase 0 — Positioning Setup','Week 1','priority','Become market-ready immediately and start applying before heavy study begins.',[
['p0t1','Update LinkedIn headline','qw p1'],['p0t2','Update LinkedIn About section','qw p1'],['p0t3','Set Open to Work to Recruiters only','qw'],['p0t4','Use the FinTech CV as the default London CV','p1'],['p0t5','Keep the Enterprise Full-Stack CV ready for Java/Angular/Azure roles',''],['p0t6','Upload/update CVs on LinkedIn, Reed, Hays and Indeed','p1'],['p0t7','Apply to the first 5–10 target roles','p1']]],
['p1','Phase 1 — System Design Foundations','Weeks 1–2','priority','Build a repeatable senior-level system-design interview method.',[
['p1t1','Learn requirements → scale → API → data → architecture → bottlenecks → reliability → security → observability → trade-offs','p1'],['p1t2','Start Software Architecture & Design of Modern Large Scale Systems (Udemy)','p1'],['p1t3','Design a benefits platform',''],['p1t4','Design a notification system',''],['p1t5','Design an SSO-enabled Microsoft Teams integration',''],['p1t6','Record one 5–10 minute architecture explanation','qw'],['p1t7','Create one reusable system-design answer template','p1']]],
['p2','Phase 2 — Distributed Systems + Backend Depth','Weeks 3–4','priority','Strengthen backend trade-off reasoning and senior Node.js depth.',[
['p2t1','Study REST vs messaging, retries, DLQs, eventual consistency, Saga and Outbox patterns','p1'],['p2t2','Study idempotency, duplicate delivery, ordering, concurrency and backpressure','p1'],['p2t3','Refresh Node.js event loop, async/await, streams, worker threads and graceful shutdown','p1'],['p2t4','Start NestJS: The Complete Developer’s Guide (Udemy)',''],['p2t5','Build a small API with auth, validation and an async queue/event flow','p1'],['p2t6','Prepare answers: Why async? How do you handle duplicate events? How would you scale this service?','qw']]],
['p3','Phase 3 — AWS + Cloud Refresh','Weeks 5–6','priority','Remove AWS as a blocker in London fintech/backend interviews.',[
['p3t1','Start Ultimate AWS Certified Developer Associate (Udemy)','p1'],['p3t2','Refresh Lambda, API Gateway, SQS, SNS, EventBridge, DynamoDB, S3, CloudWatch and IAM','p1'],['p3t3','Map Azure services to AWS equivalents','qw'],['p3t4','Design one TypeScript serverless architecture','p1'],['p3t5','Prepare answers: deployment on AWS, DynamoDB choice, securing AWS services','']]],
['p4','Phase 4 — Observability + Databases + Production Thinking','Weeks 7–9','priority','Demonstrate production-grade reliability, monitoring and data decisions.',[
['p4t1','Start OpenTelemetry for Observability (Udemy)','p1'],['p4t2','Learn logs, metrics, traces, correlation IDs, SLI/SLO/SLA, p95/p99 and alerting','p1'],['p4t3','Refresh SQL vs NoSQL, indexing, transactions, caching, replication and partitioning','p1'],['p4t4','Write 3 production incident stories from on-call experience','qw'],['p4t5','Prepare answers: monitoring, useful metrics, production incident handling','']]],
['p5','Phase 5 — Interview Execution','Weeks 9–12','priority','Convert experience into strong coding, design and behavioural interview performance.',[
['p5t1','Practice hash maps, sliding window, binary search, BFS/DFS, stacks/queues and heaps','p1'],['p5t2','Optionally use Coding Interview Bootcamp (Udemy)',''],['p5t3','Build story: Teams Bot + Tab + External SSO','p1'],['p5t4','Build story: hybrid mobile platform',''],['p5t5','Build story: production/on-call incident management',''],['p5t6','Build story: mentoring Associate/LEAP engineers',''],['p5t7','Build story: Blancco/AWS cloud experience',''],['p5t8','Complete 2 coding mocks, 2 system-design mocks and 2 behavioural mocks','p1']]],
['p6','Phase 6 — Application Engine + Market Feedback','Continuous','cont','Apply consistently and let real market feedback guide the next study focus.',[
['p6t1','Target 5 strong-fit applications per week','p1'],['p6t2','Target up to 3 stretch applications per week',''],['p6t3','Review repeated keywords in job descriptions every week','qw'],['p6t4','After every interview, log questions, strengths, gaps and next study action','p1'],['p6t5','Use FinTech or Enterprise CV depending on the role','p1']]]
];

const phaseList=document.getElementById('phaseList');
phaseData.forEach(([id,title,time,kind,desc,tasks])=>{
  const timeClass=kind==='cont'?'tag cont':'tag time';
  const taskHtml=tasks.map(([tid,label,tags])=>{
    let badges='';
    if(tags.includes('qw'))badges+='<span class="mini qw">Quick win</span>';
    if(tags.includes('p1'))badges+='<span class="mini p1">P1</span>';
    return `<label class="task"><input type="checkbox" data-task="${tid}"><div><div class="task-label">${label}</div>${badges?`<div class="badges">${badges}</div>`:''}</div></label>`;
  }).join('');
  phaseList.insertAdjacentHTML('beforeend',`<section class="phase" data-phase="${id}"><div class="phase-top"><div><div class="phase-meta"><span class="${timeClass}">${time}</span><span class="tag priority">P1</span></div><h4>${title}</h4><p>${desc}</p></div><div><div class="phase-progress">0%</div><small>phase progress</small></div></div><div class="progress"><i></i></div><div class="task-grid">${taskHtml}</div></section>`);
});

const KEY='erivan_job_prep_public_v1';
let state=JSON.parse(localStorage.getItem(KEY)||'{}');
state.tasks=state.tasks||{};
state.weekly=state.weekly||{};

function save(){localStorage.setItem(KEY,JSON.stringify(state));refresh();}

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.nav-btn').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(btn.dataset.screen).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}));

// Tasks
document.querySelectorAll('[data-task]').forEach(cb=>{
  cb.checked=!!state.tasks[cb.dataset.task];
  cb.addEventListener('change',()=>{state.tasks[cb.dataset.task]=cb.checked;save();});
});

const fieldMap={apps:'apps',replies:'replies',interviewsCount:'interviews',hours:'hours',mocks:'mocks',coding:'coding',gap:'gap',focus:'focus',wins:'wins'};
Object.entries(fieldMap).forEach(([id,key])=>{
  const el=document.getElementById(id);if(el&&state.weekly[key]!==undefined)el.value=state.weekly[key];
});

document.getElementById('saveWeekly').addEventListener('click',()=>{
  Object.entries(fieldMap).forEach(([id,key])=>state.weekly[key]=document.getElementById(id).value);
  state.weekly.savedAt=new Date().toISOString();
  save();alert('Weekly progress saved in this browser.');
});

document.getElementById('exportBtn').addEventListener('click',()=>{
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');
  a.href=url;a.download='erivan-job-prep-progress.json';a.click();URL.revokeObjectURL(url);
});

document.getElementById('resetBtn').addEventListener('click',()=>{
  if(confirm('Reset all roadmap and weekly review progress?')){localStorage.removeItem(KEY);location.reload();}
});

function refresh(){
  const boxes=[...document.querySelectorAll('[data-task]')];
  const done=boxes.filter(x=>x.checked).length;
  document.getElementById('doneCount').textContent=done;
  document.getElementById('overallPct').textContent=(boxes.length?Math.round(done/boxes.length*100):0)+'%';
  document.getElementById('dashApps').textContent=state.weekly.apps||0;
  document.getElementById('dashHours').textContent=state.weekly.hours||0;
  document.querySelectorAll('.phase').forEach(phase=>{
    const pboxes=[...phase.querySelectorAll('[data-task]')];
    const pdone=pboxes.filter(x=>x.checked).length;
    const pct=pboxes.length?Math.round(pdone/pboxes.length*100):0;
    phase.querySelector('.phase-progress').textContent=pct+'%';
    phase.querySelector('.progress i').style.width=pct+'%';
  });
}
refresh();