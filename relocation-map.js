(function(){
  const err=document.getElementById('mapError');
  function fail(m){err.style.display='block';err.textContent=m}
  if(!window.L){fail('Map library could not load.');return;}

  const C={violet:'#5b4bff',red:'#ef3b4f',green:'#13a36f',yellow:'#f5b400',blue:'#4a8df8',orange:'#ff8a1f',teal:'#18a9a4',purple:'#9557e7'};
  const areas=[
    {name:'Maidenhead',rank:1,color:C.violet,center:[51.5224,-0.7176],top:true,desc:'Fast west-London rail access, Thames Valley jobs, strong family option.',poly:[[51.485,-0.815],[51.472,-0.742],[51.489,-0.662],[51.530,-0.625],[51.568,-0.659],[51.574,-0.741],[51.552,-0.806]]},
    {name:'Watford',rank:2,color:C.red,center:[51.6565,-0.3903],top:true,desc:'Fast Euston access, Hertfordshire jobs, strong family and church fit.',poly:[[51.612,-0.455],[51.620,-0.360],[51.647,-0.330],[51.692,-0.350],[51.710,-0.415],[51.682,-0.475]]},
    {name:'Bromley / Orpington corridor',rank:3,color:C.green,center:[51.386,0.045],top:true,desc:'Strong City/London Bridge access with excellent family and church fit.',poly:[[51.330,-0.010],[51.335,0.095],[51.375,0.142],[51.428,0.112],[51.450,0.035],[51.422,-0.035],[51.365,-0.045]]},
    {name:'Reading',color:C.yellow,center:[51.4543,-0.9781],desc:'Large Thames Valley technology and quality/pharma market.',poly:[[51.420,-1.035],[51.420,-0.930],[51.470,-0.900],[51.497,-0.970],[51.480,-1.035]]},
    {name:'Slough / Windsor corridor',color:C.blue,center:[51.500,-0.600],desc:'M4 corridor combining west-London access, pharma and enterprise employers.',poly:[[51.455,-0.680],[51.452,-0.565],[51.493,-0.515],[51.535,-0.540],[51.548,-0.630],[51.515,-0.690]]},
    {name:'Woking / Guildford corridor',color:C.purple,center:[51.280,-0.590],desc:'Surrey technology and quality market with strong family/lifestyle profile.',poly:[[51.190,-0.690],[51.185,-0.535],[51.235,-0.470],[51.325,-0.500],[51.355,-0.610],[51.315,-0.715],[51.235,-0.735]]},
    {name:'Croydon',color:C.orange,center:[51.376,-0.100],desc:'South-London employment corridor with fast central access.',poly:[[51.330,-0.160],[51.325,-0.045],[51.382,-0.010],[51.430,-0.060],[51.422,-0.145],[51.370,-0.175]]},
    {name:'St Albans',color:C.teal,center:[51.7527,-0.3394],desc:'Fast Thameslink commute and highly family-oriented environment.',poly:[[51.710,-0.415],[51.715,-0.285],[51.770,-0.255],[51.810,-0.330],[51.795,-0.420]]}
  ];

  const stations=[
    ['Maidenhead',51.5187,-0.7227],['Watford Junction',51.6635,-0.3967],['Orpington',51.3734,0.0890],
    ['Reading',51.4590,-0.9722],['Slough',51.5110,-0.5910],['Windsor',51.4839,-0.6105],
    ['Woking',51.3185,-0.5572],['Guildford',51.2369,-0.5804],['East Croydon',51.3753,-0.0928],
    ['St Albans City',51.7505,-0.3275],['Paddington',51.5154,-0.1755],['Euston',51.5282,-0.1337],
    ['London Bridge',51.5045,-0.0865],['Waterloo',51.5033,-0.1147],['St Pancras',51.5319,-0.1269]
  ];
  const rails=[
    [[51.5187,-0.7227],[51.5154,-0.1755]],[[51.6635,-0.3967],[51.5282,-0.1337]],[[51.3734,0.089],[51.5045,-0.0865]],
    [[51.459,-0.9722],[51.5154,-0.1755]],[[51.3185,-0.5572],[51.5033,-0.1147]],[[51.7505,-0.3275],[51.5319,-0.1269]]
  ];
  const roads=[
    [[51.515,-0.17],[51.52,-0.50],[51.52,-0.72],[51.46,-0.98]],
    [[51.53,-0.13],[51.59,-0.26],[51.66,-0.39],[51.75,-0.34]],
    [[51.50,-0.09],[51.44,-0.02],[51.38,0.09]],
    [[51.50,-0.12],[51.38,-0.35],[51.28,-0.59]]
  ];
  const software=[['City / FinTech',51.515,-0.091],['Canary Wharf',51.505,-0.024],['Reading Tech',51.456,-0.97],['Slough Enterprise',51.511,-0.59],['Watford Tech',51.656,-0.39],['Guildford Tech',51.236,-0.57]];
  const quality=[['Reading / Wokingham Pharma',51.44,-0.91],['Maidenhead / Slough Pharma',51.51,-0.67],['Hertfordshire Life Sciences',51.71,-0.33],['Surrey Quality',51.26,-0.50],['South-East Quality',51.39,0.01]];
  const churches=[['Orpington',51.374,0.098],['Hampton',51.421,-0.371],['Norbury',51.411,-0.122],['Willesden',51.547,-0.240],['Watford / Chipperfield',51.704,-0.490],['Reading / Caversham',51.468,-0.975],['Guildford',51.236,-0.570],['Reigate',51.236,-0.205]];
  const parks=[['Cassiobury Park',51.663,-0.421],['Ockwells Park',51.506,-0.738],['High Elms',51.352,0.105],['Stoke Park',51.247,-0.564],['Bushy Park',51.416,-0.335],['Forbury Gardens',51.456,-0.969]];
  const schools=[['Maidenhead family schools',51.532,-0.730],['Watford family schools',51.666,-0.378],['Orpington family schools',51.382,0.100],['Reading family schools',51.465,-0.955],['Guildford family schools',51.246,-0.583],['St Albans family schools',51.759,-0.338]];

  const map=L.map('map',{zoomControl:true,preferCanvas:true}).setView([51.51,-0.38],9);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);

  const layers={
    top3:L.layerGroup(),otherAreas:L.layerGroup(),trains:L.layerGroup(),roads:L.layerGroup(),commute:L.layerGroup(),
    software:L.layerGroup(),quality:L.layerGroup(),churchLondon:L.layerGroup(),churchCommuter:L.layerGroup(),parks:L.layerGroup(),schools:L.layerGroup()
  };
  const areaIndex={};

  function popup(a){return '<div class="area-popup"><h3>'+a.name+'</h3><div class="chips">'+(a.rank?'<span class="chip">Rank #'+a.rank+'</span>':'')+'<span class="chip">Relocation corridor</span></div><p>'+a.desc+'</p><p>Use the layer controls to compare trains, roads, jobs, church access and family anchors.</p></div>'}
  function rankIcon(n,color){return L.divIcon({className:'',iconSize:[40,40],iconAnchor:[20,20],html:'<div class="rank-pin" style="background:'+color+'">'+n+'</div>'})}
  function labelIcon(name,color){return L.divIcon({className:'',iconSize:[160,34],iconAnchor:[80,17],html:'<div class="label-pin" style="color:'+color+'"><span class="bullet"></span>'+name+'</div>'})}
  const svg={
    train:'<svg viewBox="0 0 24 24"><path d="M6 2h12a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3l2 3h-3l-2-3H9l-2 3H4l2-3a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zm0 3v5h12V5H6zm2 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm8 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>',
    job:'<svg viewBox="0 0 24 24"><path d="M9 4h6l1 2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l1-2zm1.5 2h3L13 5h-2l-.5 1zM2 11h8v2h4v-2h8v7H2v-7z"/></svg>',
    church:'<svg viewBox="0 0 24 24"><path d="M11 2h2v3h3v2h-3v2.2l6 4.3V22H5v-8.5l6-4.3V7H8V5h3V2zm1 9.5L8 14.4V20h3v-4h2v4h3v-5.6l-4-2.9z"/></svg>',
    park:'<svg viewBox="0 0 24 24"><path d="M12 2l4 5h-2l4 5h-4v3h3l-5 7-5-7h3v-3H6l4-5H8l4-5z"/></svg>',
    school:'<svg viewBox="0 0 24 24"><path d="M2 8l10-5 10 5-10 5L2 8zm4 4.2 6 3 6-3V17l-6 3-6-3v-4.8z"/></svg>'
  };
  function iconMarker(lat,lon,color,type,title,layer){
    const ic=L.divIcon({className:'',iconSize:[24,24],iconAnchor:[12,12],html:'<div class="icon-marker" style="color:'+color+'">'+svg[type]+'</div>'});
    return L.marker([lat,lon],{icon:ic}).bindTooltip(title).addTo(layer);
  }

  areas.forEach(a=>{
    const target=a.top?layers.top3:layers.otherAreas;
    const poly=L.polygon(a.poly,{color:a.color,weight:2,opacity:.95,fillColor:a.color,fillOpacity:a.top?.14:.08,dashArray:a.top?null:'6 5'}).bindPopup(popup(a)).addTo(target);
    const marker=a.top?L.marker(a.center,{icon:rankIcon(a.rank,a.color)}):L.marker(a.center,{icon:labelIcon(a.name,a.color)});
    marker.bindPopup(popup(a)).addTo(target);
    if(a.top)L.marker([a.center[0],a.center[1]-0.04],{icon:labelIcon(a.name,a.color)}).bindPopup(popup(a)).addTo(target);
    areaIndex[a.name]={a,poly,marker};
  });

  rails.forEach(r=>L.polyline(r,{color:'#7d8ba5',weight:2,opacity:.7,dashArray:'5 5'}).addTo(layers.trains));
  stations.forEach(s=>iconMarker(s[1],s[2],'#405ce7','train',s[0],layers.trains));
  roads.forEach(r=>L.polyline(r,{color:'#ff4055',weight:2.5,opacity:.7}).addTo(layers.roads));
  rails.forEach(r=>L.polyline(r,{color:'#8558e8',weight:3,opacity:.45,dashArray:'2 8'}).addTo(layers.commute));
  software.forEach(x=>iconMarker(x[1],x[2],'#5b63e6','job',x[0],layers.software));
  quality.forEach(x=>iconMarker(x[1],x[2],'#13a36f','job',x[0],layers.quality));
  churches.slice(0,4).forEach(x=>iconMarker(x[1],x[2],'#8b4ce8','church',x[0],layers.churchLondon));
  churches.slice(4).forEach(x=>iconMarker(x[1],x[2],'#8b4ce8','church',x[0],layers.churchCommuter));
  parks.forEach(x=>iconMarker(x[1],x[2],'#159447','park',x[0],layers.parks));
  schools.forEach(x=>iconMarker(x[1],x[2],'#f3a400','school',x[0],layers.schools));

  const presets={
    clean:['top3','otherAreas'],
    commute:['top3','otherAreas','trains','roads','commute'],
    jobs:['top3','otherAreas','software','quality'],
    church:['top3','otherAreas','churchLondon','churchCommuter'],
    family:['top3','otherAreas','parks','schools','churchLondon','churchCommuter'],
    all:Object.keys(layers)
  };
  function setLayers(names){
    Object.keys(layers).forEach(k=>{if(map.hasLayer(layers[k]))map.removeLayer(layers[k])});
    names.forEach(k=>layers[k]&&layers[k].addTo(map));
    document.querySelectorAll('[data-layer]').forEach(cb=>cb.checked=names.includes(cb.dataset.layer));
  }
  function setPreset(name){
    setLayers(presets[name]||presets.clean);
    document.querySelectorAll('.preset').forEach(b=>b.classList.toggle('active',b.dataset.preset===name));
  }
  document.querySelectorAll('[data-layer]').forEach(cb=>cb.addEventListener('change',()=>{
    const k=cb.dataset.layer; cb.checked?layers[k].addTo(map):map.removeLayer(layers[k]);
    document.querySelectorAll('.preset').forEach(b=>b.classList.remove('active'));
  }));
  document.querySelectorAll('.preset').forEach(b=>b.addEventListener('click',()=>setPreset(b.dataset.preset)));
  document.querySelectorAll('[data-area]').forEach(b=>b.addEventListener('click',()=>{
    const x=areaIndex[b.dataset.area]; if(!x)return;
    map.fitBounds(x.poly.getBounds(),{padding:[80,80],maxZoom:11});
    setTimeout(()=>x.marker.openPopup(),250);
  }));

  setPreset('all');
  L.control.scale({imperial:false}).addTo(map);
  setTimeout(()=>map.invalidateSize(),120);
  window.addEventListener('resize',()=>map.invalidateSize());
})();