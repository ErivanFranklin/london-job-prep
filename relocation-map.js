(function(){
  const errorBox=document.getElementById('mapError');
  function fail(msg){if(errorBox){errorBox.style.display='block';errorBox.textContent=msg;}}
  if(!window.L){fail('The map library could not load. Refresh the page, or try another network/browser.');return;}

  const AREAS=[
    {name:'Reading / Caversham',lat:51.4543,lon:-0.9781,top3:true,rank:1,overall:'8.8',rent:'£1,850–£2,400',station:'Reading',terminal:'Paddington',train:'~25–30 min fast',road:'M4',scores:{Rent:9,Transport:9,Software:10,QA:10,Family:9,Church:9},pros:['Strongest two-career corridor','M4 / Thames Valley tech + pharma depth','Fast GWR to Paddington + Elizabeth Line','Official CCUK congregation in Caversham'],cons:['Longer trip to City/Canary Wharf than west/central jobs'],best:'One or both jobs land in Reading, Wokingham, Bracknell, Slough, Maidenhead or west/central London.'},
    {name:'Watford / Bushey',lat:51.6565,lon:-0.3903,top3:true,rank:2,overall:'9.0',rent:'£2,000–£2,400',station:'Watford Junction',terminal:'Euston',train:'~20–25 min',road:'M1 / M25',scores:{Rent:8,Transport:9,Software:9,QA:8,Family:9,Church:9},pros:['Best all-round family default','Fast Euston commute','Good Hertfordshire / M1 / M25 access','Official CCUK congregation at Chipperfield'],cons:['Less direct for west-Thames Valley jobs'],best:'Your role is central/north-west London or Hertfordshire and Simone finds work north-west of London.'},
    {name:'Orpington / Bromley',lat:51.3741,lon:0.0986,top3:true,rank:3,overall:'8.8',rent:'£2,000–£2,500',station:'Orpington',terminal:'London Bridge / Victoria / Blackfriars',train:'~20–30 min',road:'A20 / M25',scores:{Rent:8,Transport:9,Software:9,QA:8,Family:10,Church:10},pros:['Excellent family + church fit','Strong City / London Bridge / Canary Wharf access','Quieter suburban environment','Official CCUK house of prayer in Orpington'],cons:['Poor fit for Reading/Thames Valley employers'],best:'Your job lands in the City, Canary Wharf, London Bridge or south-east London.'},
    {name:'Guildford',lat:51.2362,lon:-0.5704,top3:false,overall:'8.5',rent:'£2,250–£2,600',station:'Guildford',terminal:'Waterloo',train:'~35–40 min',road:'A3',scores:{Rent:7,Transport:8,Software:8,QA:8,Family:10,Church:10},pros:['High family/lifestyle quality','Official CCUK congregation','Good Surrey technology / life-science access'],cons:['More expensive rent'],best:'Lifestyle and Surrey-based jobs outweigh central-London commute speed.'},
    {name:'Feltham / Hampton / Hounslow',lat:51.4277,lon:-0.3690,top3:false,overall:'8.3',rent:'£2,000–£2,500',station:'Feltham / Hampton',terminal:'Waterloo',train:'~30–40 min',road:'M3 / M4 / M25',scores:{Rent:8,Transport:8,Software:8,QA:9,Family:8,Church:10},pros:['Excellent Heathrow / Slough / west-London job geography','Official CCUK congregation in Hampton','Good pharma, aviation and technology access'],cons:['Neighbourhood quality varies significantly'],best:'Jobs cluster around Heathrow, Hounslow, Slough, west London or the M4 corridor.'},
    {name:'Reigate / Redhill',lat:51.2374,lon:-0.2058,top3:false,overall:'8.2',rent:'£2,050–£2,500',station:'Redhill / Reigate',terminal:'Victoria / London Bridge',train:'~30–45 min',road:'M23 / M25',scores:{Rent:8,Transport:8,Software:7,QA:9,Family:10,Church:10},pros:['Calm family environment','Official CCUK congregation in Reigate','Good Gatwick / Surrey quality corridor'],cons:['Smaller software market than Reading/central London'],best:'Simone lands a Surrey/Gatwick quality role and your role is south/central London.'},
    {name:'St Albans',lat:51.7527,lon:-0.3394,top3:false,overall:'8.0',rent:'£2,250–£2,700',station:'St Albans City',terminal:'St Pancras',train:'~20–25 min',road:'M1 / M25',scores:{Rent:6,Transport:10,Software:8,QA:7,Family:10,Church:6},pros:['Excellent family reputation','Fast Thameslink service','Strong north-London access'],cons:['Expensive','No direct CCUK congregation in St Albans'],best:'Commute/schools dominate and budget is comfortable.'},
    {name:'Maidenhead',lat:51.5224,lon:-0.7176,top3:false,overall:'7.9',rent:'£2,000–£2,500',station:'Maidenhead',terminal:'Paddington',train:'~20–30 min',road:'M4',scores:{Rent:8,Transport:9,Software:9,QA:9,Family:9,Church:7},pros:['Strong M4 / Thames Valley location','Elizabeth Line + GWR','Good compromise between Reading and London'],cons:['Usually weaker value than Reading','Church access less direct than Reading'],best:'Jobs are around Slough/Maidenhead while keeping strong London access.'}
  ];

  const CHURCH_LONDON=[
    {name:'Bromley (Orpington)',lat:51.374,lon:0.098,address:'207–215 High Street, 2nd Floor, Orpington BR6 0PF',url:'https://christiancongregation.org.uk/locations/bromley/'},
    {name:'Feltham (Hounslow) / Hampton',lat:51.421,lon:-0.371,address:'Linden Rd, Hampton TW12 2JG',url:'https://christiancongregation.org.uk/locations/'},
    {name:'Norbury',lat:51.411,lon:-0.122,address:'Woodmansterne Rd, London SW16 5UQ',url:'https://christiancongregation.org.uk/locations/'},
    {name:'Stamford Hill (Tottenham)',lat:51.588,lon:-0.070,address:'Entrance via High Road (Car Park), London N17 9HT',url:'https://christiancongregation.org.uk/locations/'},
    {name:'Willesden',lat:51.547,lon:-0.240,address:'Cullingworth Road, Willesden, London NW10 1ET',url:'https://christiancongregation.org.uk/locations/willesden/'}
  ];
  const CHURCH_COMMUTER=[
    {name:'Watford / Chipperfield',lat:51.704,lon:-0.490,address:'The Common, Chipperfield, Hertfordshire WD4 9BS',url:'https://christiancongregation.org.uk/locations/watford/'},
    {name:'Reading / Caversham',lat:51.468,lon:-0.975,address:'Harley Rd, Caversham, Reading RG4 8DB',url:'https://christiancongregation.org.uk/locations/'},
    {name:'Guildford',lat:51.236,lon:-0.570,address:'6 Artillery Terrace, Guildford GU1 4NL',url:'https://christiancongregation.org.uk/locations/'},
    {name:'Reigate',lat:51.236,lon:-0.205,address:'Alma Road, Reigate RH2 0DH',url:'https://christiancongregation.org.uk/locations/'}
  ];

  const STATIONS=[
    ['Reading',51.4590,-0.9722,'Paddington / Elizabeth Line'],['Watford Junction',51.6635,-0.3967,'Euston'],['Orpington',51.3734,0.0890,'London Bridge / Victoria / Blackfriars'],['Guildford',51.2369,-0.5804,'Waterloo'],['Feltham',51.4479,-0.4098,'Waterloo'],['Redhill',51.2404,-0.1659,'Victoria / London Bridge'],['St Albans City',51.7505,-0.3275,'St Pancras'],['Maidenhead',51.5187,-0.7227,'Paddington / Elizabeth Line']
  ];
  const TERMINALS=[['Paddington',51.5154,-0.1755],['Euston',51.5282,-0.1337],['London Bridge',51.5045,-0.0865],['Victoria',51.4952,-0.1441],['Waterloo',51.5033,-0.1147],['St Pancras',51.5319,-0.1269]];
  const COMMUTES=[
    ['Reading → Paddington',[51.459,-0.9722],[51.5154,-0.1755]],['Watford → Euston',[51.6635,-0.3967],[51.5282,-0.1337]],['Orpington → London Bridge',[51.3734,0.089],[51.5045,-0.0865]],['Guildford → Waterloo',[51.2369,-0.5804],[51.5033,-0.1147]],['Redhill → Victoria',[51.2404,-0.1659],[51.4952,-0.1441]],['St Albans → St Pancras',[51.7505,-0.3275],[51.5319,-0.1269]],['Maidenhead → Paddington',[51.5187,-0.7227],[51.5154,-0.1755]]
  ];
  const ROADS=[
    ['M4 / Thames Valley',[51.515,-0.17],[51.53,-0.48],[51.51,-0.70],[51.46,-0.98]],
    ['M1 / North-west corridor',[51.53,-0.13],[51.60,-0.25],[51.66,-0.39],[51.75,-0.34]],
    ['M25 west / north arc',[51.44,-0.47],[51.54,-0.50],[51.66,-0.39]],
    ['A20 / South-east corridor',[51.50,-0.10],[51.43,0.00],[51.37,0.10]],
    ['A3 / Surrey corridor',[51.50,-0.12],[51.38,-0.35],[51.24,-0.57]],
    ['M23 / Gatwick corridor',[51.49,-0.14],[51.34,-0.17],[51.24,-0.20]]
  ];
  const SOFTWARE=[['City of London',51.515,-0.091],['Canary Wharf',51.505,-0.024],['Reading / Wokingham',51.43,-0.91],['Slough / Maidenhead',51.51,-0.64],['Watford / Hertfordshire',51.66,-0.39],['Guildford / Surrey tech',51.236,-0.57]];
  const QUALITY=[['Thames Valley pharma / medtech',51.45,-0.95],['Slough / Heathrow regulated industry',51.48,-0.53],['Hertfordshire quality / life sciences',51.72,-0.32],['Gatwick / Redhill quality corridor',51.16,-0.17],['South-east London / Kent quality corridor',51.40,0.02]];
  const FAMILY=[['Reading riverside / parks',51.459,-0.967],['Cassiobury Park, Watford',51.663,-0.421],['High Elms / Orpington green space',51.352,0.105],['Stoke Park, Guildford',51.247,-0.564],['Bushy Park / Hampton',51.416,-0.335],['Priory Park, Reigate',51.235,-0.211]];

  const map=L.map('map',{zoomControl:true,preferCanvas:true}).setView([51.50,-0.42],9);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);

  const layers={top3:L.layerGroup(),other:L.layerGroup(),trains:L.layerGroup(),roads:L.layerGroup(),commute:L.layerGroup(),software:L.layerGroup(),quality:L.layerGroup(),churchLondon:L.layerGroup(),churchCommuter:L.layerGroup(),family:L.layerGroup()};

  function pinIcon(n){return L.divIcon({className:'',iconSize:[34,34],iconAnchor:[17,34],html:'<div class="pin"><span>'+n+'</span></div>'});}
  function circle(lat,lon,color,tooltip,layer,radius){return L.circleMarker([lat,lon],{radius:radius||7,color:'#fff',weight:2,fillColor:color,fillOpacity:1}).bindTooltip(tooltip).addTo(layer);}
  function areaPopup(a){
    const scores=Object.keys(a.scores).map(k=>'<div><b>'+k+':</b> '+a.scores[k]+'/10</div>').join('');
    const pros=a.pros.map(x=>'<li>'+x+'</li>').join('');
    const cons=a.cons.map(x=>'<li>'+x+'</li>').join('');
    return '<div class="popup"><h3>'+a.name+'</h3><div class="chips"><span class="chip">Overall '+a.overall+'/10</span><span class="chip">'+a.rent+'</span></div><div class="kv"><b>Station</b><span>'+a.station+'</span><b>London</b><span>'+a.terminal+'</span><b>Typical train</b><span>'+a.train+'</span><b>Road</b><span>'+a.road+'</span></div><div class="scores">'+scores+'</div><b style="font-size:11px">Pros</b><ul>'+pros+'</ul><b style="font-size:11px">Trade-offs</b><ul>'+cons+'</ul><div class="best"><b>Best for us if:</b> '+a.best+'</div></div>';
  }
  function churchPopup(c){return '<div class="popup"><h3>'+c.name+'</h3><div class="sub">Christian Congregation in the United Kingdom (CCUK)</div><div class="kv"><b>Official address</b><span>'+c.address+'</span></div><div class="source">Pin is an approximate map position. Verify the official address/service times before travelling.<br><a href="'+c.url+'" target="_blank" rel="noopener">Open official CCUK listing</a></div></div>';}

  AREAS.filter(a=>a.top3).forEach(a=>L.marker([a.lat,a.lon],{icon:pinIcon(a.rank)}).bindPopup(areaPopup(a),{maxWidth:340}).addTo(layers.top3));
  AREAS.filter(a=>!a.top3).forEach(a=>circle(a.lat,a.lon,'#64748b',a.name,layers.other,9).bindPopup(areaPopup(a),{maxWidth:340}));
  STATIONS.forEach(s=>circle(s[1],s[2],'#0284c7',s[0]+' station',layers.trains,6).bindPopup('<b>'+s[0]+'</b><br><small>Direct/primary London corridor: '+s[3]+'</small>'));
  TERMINALS.forEach(s=>circle(s[1],s[2],'#0f172a',s[0]+' terminal',layers.trains,5));
  COMMUTES.forEach(r=>L.polyline([r[1],r[2]],{color:'#8b5cf6',weight:3,opacity:.62,dashArray:'8 8'}).bindTooltip(r[0]+' · schematic').addTo(layers.commute));
  ROADS.forEach(r=>L.polyline(r.slice(1),{color:'#e11d48',weight:4,opacity:.55}).bindTooltip(r[0]+' · schematic corridor').addTo(layers.roads));
  SOFTWARE.forEach(x=>circle(x[1],x[2],'#0284c7',x[0],layers.software,7));
  QUALITY.forEach(x=>circle(x[1],x[2],'#10b981',x[0],layers.quality,7));
  FAMILY.forEach(x=>circle(x[1],x[2],'#65a30d',x[0],layers.family,7));
  CHURCH_LONDON.forEach(c=>circle(c.lat,c.lon,'#f59e0b',c.name,layers.churchLondon,8).bindPopup(churchPopup(c),{maxWidth:320}));
  CHURCH_COMMUTER.forEach(c=>circle(c.lat,c.lon,'#d97706',c.name,layers.churchCommuter,8).bindPopup(churchPopup(c),{maxWidth:320}));

  const presets={
    clean:['top3'],
    commute:['top3','trains','roads','commute'],
    jobs:['top3','software','quality'],
    church:['top3','churchLondon','churchCommuter'],
    family:['top3','family','churchLondon','churchCommuter'],
    all:Object.keys(layers)
  };

  function setLayers(names){
    Object.keys(layers).forEach(k=>{if(map.hasLayer(layers[k]))map.removeLayer(layers[k]);});
    names.forEach(k=>layers[k]&&layers[k].addTo(map));
    document.querySelectorAll('[data-layer]').forEach(cb=>{cb.checked=names.includes(cb.dataset.layer);});
    setTimeout(()=>map.invalidateSize(),50);
  }
  function setPreset(name){
    setLayers(presets[name]||presets.clean);
    document.querySelectorAll('.preset').forEach(b=>b.classList.toggle('active',b.dataset.preset===name));
  }

  document.querySelectorAll('[data-layer]').forEach(cb=>cb.addEventListener('change',()=>{
    const k=cb.dataset.layer;
    if(cb.checked)layers[k].addTo(map);else map.removeLayer(layers[k]);
    document.querySelectorAll('.preset').forEach(b=>b.classList.remove('active'));
  }));
  document.querySelectorAll('.preset').forEach(btn=>btn.addEventListener('click',()=>setPreset(btn.dataset.preset)));
  document.getElementById('fitShortlist').addEventListener('click',()=>{const pts=AREAS.map(a=>[a.lat,a.lon]);map.fitBounds(pts,{padding:[55,55]});});
  document.getElementById('resetView').addEventListener('click',()=>{map.setView([51.50,-0.42],9);});

  setPreset('clean');
  L.control.scale({imperial:false}).addTo(map);
  setTimeout(()=>map.invalidateSize(),150);
  window.addEventListener('resize',()=>map.invalidateSize());
})();