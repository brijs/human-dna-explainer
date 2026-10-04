/* ===== Scene 1: Welcome ===== */
SCENES.push({id:'s1',belt:0,mood:'happy',title:'Welcome to the DNA Lab',
html:`<p class="lead">Your body is built from a recipe written in a molecule called <b>DNA</b>. Drag the helix to spin it. Hover or tap the glowing pieces.</p>
<div class="grid"><div class="card">${mkCv('clamp(300px,52vh,460px)')}<div class="hint">Drag to rotate · Shift+scroll to zoom</div></div>
<div class="card info"><h3>Today's mission</h3><p>🔬 <b>Zoom</b> from your body to a single DNA molecule.</p><p>🧵 <b>Pack</b> 2 metres of DNA into a tiny nucleus.</p><p>🧬 <b>Build</b> a double helix and copy it.</p><p>🧪 <b>Read</b> genes, make proteins, test mutations.</p><p>🐱 <b>Inherit</b> traits and compare animals.</p>
<p class="mini">Four ranks to earn: Cadet → Scientist → Researcher → Master.</p><button class="btn" id="go1">Start the zoom journey ▶</button></div></div>`,
init(w){const seq=randSeq(24,3);new S3(w.querySelector('canvas'),{yaw:.5,pitch:.15,auto:.01,zoom:.78,draw(S){stars(S,60,11,6);helix(S,seq,{rise:.17,R:.55})}});w.querySelector('#go1').onclick=()=>go(1)}});

/* ===== Scene 2: Zoom ===== */
(function(){
const ST=[
 {n:'You',size:'≈ 1.6 m tall',fact:'Your body has roughly 37 trillion cells working together.'},
 {n:'One cell',size:'≈ 10–30 µm across (a µm is a millionth of a metre)',fact:'Almost every human cell has a nucleus. Mature red blood cells are the famous exception: they dump theirs.'},
 {n:'The nucleus',size:'≈ 6 µm across',fact:'The nucleus is the cell\'s library. Inside, DNA is tangled like a bowl of thread called chromatin.'},
 {n:'Chromosomes',size:'≈ 2–10 µm long when condensed',fact:'Before a cell divides, the DNA coils tightly into 46 visible chromosomes.'},
 {n:'The DNA double helix',size:'2 nm wide (a nm is a billionth of a metre)',fact:'One cell\'s DNA holds about 6.4 billion letters (3.2 billion from each parent) and would stretch about 2 m if uncoiled.'}];
const HUES=[...Array(23)].map((_,i)=>`hsl(${i*15.6},85%,62%)`);
function hsl2hex(h){const c=document.createElement('canvas').getContext('2d');c.fillStyle=h;return c.fillStyle}
const CHC=HUES.map(hsl2hex);
const rr=rng(5),thr=[...Array(12)].map(()=>[...Array(30)].map(()=>[rr()*2-1,rr()*2-1,rr()*2-1])),cells=[...Array(70)].map(()=>[(rr()-.5)*.8,rr()*2.2-.2,(rr()-.5)*.4]);
const mito=[...Array(7)].map(()=>{const a=rr()*6.28,b=rr()*3.14;return[Math.cos(a)*Math.sin(b)*.8,Math.cos(b)*.8,Math.sin(a)*Math.sin(b)*.8]});
const chp=[...Array(46)].map(()=>{let v;do{v=[rr()*2-1,rr()*2-1,rr()*2-1]}while(v[0]**2+v[1]**2+v[2]**2>1);return v});
const draws=[
 (S,k)=>{S.sphere([0,1.5*k,0],.3*k,'#fcd9b6');S.line([0,1.15*k,0],[0,.1*k,0],.5*k,'#38bdf8');S.line([0,1*k,0],[-.6*k,.3*k,0],.16*k,'#38bdf8');S.line([0,1*k,0],[.6*k,.3*k,0],.16*k,'#38bdf8');S.line([-.15*k,.1*k,0],[-.25*k,-1.1*k,0],.2*k,'#6366f1');S.line([.15*k,.1*k,0],[.25*k,-1.1*k,0],.2*k,'#6366f1');
  cells.forEach(c=>S.sphere([c[0]*k,(c[1]-.6)*k*.8,c[2]*k],.025*k,'#22d3ee',null,.7));S.label([0,-1.5*k,0],'≈ 37 trillion cells','#22d3ee',14)},
 (S,k)=>{S.sphere([0,0,0],1.25*k,'#2dd4bf',null,.25);mito.forEach((m,i)=>{S.sphere([m[0]*k,m[1]*k,m[2]*k],.1*k,'#fb923c');S.sphere([m[0]*k*1.03+.12*k,m[1]*k,m[2]*k],.09*k,'#fb923c')});S.sphere([.1*k,.05*k,0],.5*k,'#a78bfa',null,.95);S.label([.1*k,.62*k,0],'Nucleus','#e9d5ff',15);S.label([0,-1.4*k,0],'cell','#5eead4',13)},
 (S,k,t)=>{S.sphere([0,0,0],1.35*k,'#a78bfa',null,.18);thr.forEach((th,j)=>{for(let i=1;i<th.length;i++){const w=Math.sin(t*.8+i*.4+j)*.05;const a=th[i-1],b=th[i];S.line([a[0]*k*.9+w,a[1]*k*.9,a[2]*k*.9],[b[0]*k*.9+w,b[1]*k*.9,b[2]*k*.9],.04*k,CHC[(j*2)%23],.8)}});S.label([0,-1.6*k,0],'nucleus: DNA threads (chromatin)','#e9d5ff',13)},
 (S,k,t)=>{chp.forEach((v,i)=>{const c=[v[0]*1.2*k,v[1]*1.2*k,v[2]*1.2*k],col=CHC[Math.floor(i/2)%23],d=.17*k;S.line([c[0]-d,c[1]+d,c[2]],[c[0]+d,c[1]-d,c[2]],.07*k,col);S.line([c[0]+d,c[1]+d,c[2]],[c[0]-d,c[1]-d,c[2]],.07*k,col)});S.label([0,-1.7*k,0],'46 chromosomes = 23 pairs','#fde68a',14)},
 (S,k)=>{helix(S,randSeq(18,9),{rise:.17*k,R:.5*k,labels:true})}];
let lv=0,tgt=0;
SCENES.push({id:'s2',belt:0,mood:'neutral',title:'Zoom Into a Cell',
html:`<p class="lead">Slide the control to dive from your whole body down to one DNA molecule.</p>
<div class="grid"><div class="card">${mkCv()}<div class="row"><input id="zs" type="range" min="0" max="400" value="0" aria-label="Zoom level"></div><div class="row" id="zc"></div></div>
<div class="card info"><h3 id="zn"></h3><p class="big" id="zsz"></p><p id="zf"></p><div id="zc2" class="mini"></div></div></div>`,
init(w){lv=0;const sl=w.querySelector('#zs');const upd=()=>{const L=Math.round(lv);w.querySelector('#zn').textContent=ST[L].n;w.querySelector('#zsz').textContent=ST[L].size;w.querySelector('#zf').textContent=ST[L].fact;w.querySelectorAll('#zc .chip').forEach((c,i)=>c.classList.toggle('on',i===L))};
 ST.forEach((s,i)=>{const c=el('button','chip',s.n);c.onclick=()=>{sl.value=i*100;lv=i;upd();react(['Here we are!','Cells are tiny!','Control room!','Look at all 46!','The helix at last!'][i],'happy')};w.querySelector('#zc').append(c)});
 sl.oninput=()=>{lv=sl.value/100;upd()};upd();
 new S3(w.querySelector('canvas'),{yaw:.4,pitch:.2,auto:.006,draw(S,t){const L=Math.round(lv),fr=lv-L,al=Math.max(0,1-Math.abs(fr)*1.8);S.alpha=al;draws[L](S,1+fr*1.4,t)}})}});
})();

/* ===== Scene 3: Packing ===== */
(function(){
const N=600,P=[[],[],[],[]];
for(let i=0;i<N;i++){const t=i/(N-1);
 P[0].push([.05*Math.cos(t*60),-1.4+2.8*t,.05*Math.sin(t*60)]);
 P[1].push([.8*Math.sin(5*Math.PI*t+.5),-1.3+2.6*t,.5*Math.cos(7*Math.PI*t)]);
 P[2].push([.35*Math.cos(t*16*Math.PI),-1.2+2.4*t,.35*Math.sin(t*16*Math.PI)]);
 const h=i<N/2?0:1,u=(h?i-N/2:i)/(N/2-1),sg=h?1:-1,y=1.25-2.5*u+.0,ys=y-.25;
 const x=sg*(.05+.42*Math.pow(Math.abs(ys)/1.3,1.2)),co=.06*Math.cos(u*70);
 P[3].push([x+co,y,.06*Math.sin(u*70)])}
const INFO=[
 ['DNA double helix','2 nm wide','This is the starting point: a long, thin double helix.'],
 ['Nucleosomes: "beads on a string"','≈ 11 nm beads','DNA wraps about 1.65 turns (≈147 base pairs) around a spool of 8 histone proteins. Many spools in a row look like beads on a string.'],
 ['Chromatin fibre (coiled)','≈ 30 nm fibre (textbook model)','The beaded string coils into a thicker fibre, which loops and folds again. (Scientists still debate the exact 3D shape inside living cells.)'],
 ['Condensed chromosome','visible with a light microscope','Before cell division the fibre is packed so tightly it forms an X: two identical copies (sister chromatids) joined at the centromere.']];
SCENES.push({id:'s3',belt:0,mood:'think',title:'Packing 2 Metres of DNA',
html:`<p class="lead">Move the slider to coil the DNA step by step. Drag the picture to look from other angles.</p>
<div class="grid"><div class="card">${mkCv()}<div class="row"><input id="ps" type="range" min="0" max="300" value="0" aria-label="Packing level"></div><div class="row"><button class="btn sec" id="pl">▶ Auto-pack</button></div></div>
<div class="card info"><h3 id="pn"></h3><p class="big" id="pz"></p><p id="pf"></p><hr style="border-color:#24407a"><p class="mini">Fun scale: if the DNA in one nucleus were as thin as sewing thread, it would be about 200 km long. Your body's DNA (all cells) could reach the Sun and back many times.</p></div></div>`,
init(w){let v=0,playing=false;const sl=w.querySelector('#ps'),upd=()=>{const L=Math.round(v);w.querySelector('#pn').textContent=INFO[L][0];w.querySelector('#pz').textContent=INFO[L][1];w.querySelector('#pf').textContent=INFO[L][2]};upd();
 sl.oninput=()=>{v=sl.value/100;upd()};
 const iv=setInterval(()=>{if(playing){v=Math.min(3,v+.012);sl.value=v*100;upd();if(v>=3){playing=false;react('Packed! Now it fits in a nucleus.','happy')}}},16);(window.TIMERS=window.TIMERS||[]).push(iv);
 w.querySelector('#pl').onclick=()=>{if(v>=3){v=0}playing=true};
 const col=['#22d3ee','#fb923c','#a78bfa','#f472b6'];
 new S3(w.querySelector('canvas'),{yaw:.5,pitch:.1,auto:.006,zoom:1.05,draw(S){const s=Math.min(2,Math.floor(v)),f=v>=3?1:v-s,e=f*f*(3-2*f),sa=v>=3?3:s,sb=v>=3?3:s+1;
  const pts=P[sa].map((a,i)=>{const b=P[sb][i];return[lerp(a[0],b[0],e),lerp(a[1],b[1],e),lerp(a[2],b[2],e)]});
  const sc=Math.round(v),c=col[sc];const beadK=v<=1?clamp(v,0,1):v<=2?1-(v-1)*.2:1-(.8-.8)*0;
  for(let i=1;i<N;i++){if(i===N/2&&e>.5&&sb===3)continue;S.line(pts[i-1],pts[i],lerp(.05,[.06,.07,.1,.13][sb],e)*(v>=3?1:1)*(sa===0&&sb===1?1:1),col[Math.round(v)],1)}
  if(v>.15){const a=clamp((v-.15)*1.5,0,1);for(let i=15;i<N;i+=30){S.sphere(pts[i],.075+(v>=2?.02:0),'#fbbf24',null,a)}}
  S.label([0,-1.55,0],INFO[Math.round(v)][0],c,13)}})}});
})();

/* ===== Scene 4: Karyotype ===== */
(function(){
const LEN=[248,242,198,190,181,171,159,145,138,134,135,133,114,107,102,90,83,80,59,64,47,51],CEN=[.48,.38,.46,.27,.27,.35,.38,.31,.35,.37,.39,.27,.14,.15,.18,.4,.32,.25,.46,.47,.2,.2];
function chrom(num,pair,maternal,opt={}){const l=LEN[num-1]||(num==='X'?156:57),h=14+l*.22,cw=opt.w||15,cp=num==='X'?.4:num==='Y'?.3:CEN[num-1],hue=(typeof num==='number'?num*15.6:num==='X'?340:210);
 const col=`hsl(${hue},80%,62%)`,cy=h*cp,nn=typeof num==='number'?num:(num==='X'?23:24);const bands=[...Array(Math.floor(h/9))].map((_,i)=>`<rect x="1" y="${4+i*9+((nn*3)%4)}" width="${cw-2}" height="${2+(i+nn)%3}" fill="rgba(0,0,0,.28)" rx="1"/>`).join('');
 return`<svg width="${cw+6}" height="${h+6}" viewBox="-3 -3 ${cw+6} ${h+6}" aria-label="chromosome ${num}"><defs><clipPath id="cp${opt.id||0}"><path d="M0,${cy-3} Q0,0 ${cw/2},0 Q${cw},0 ${cw},${cy-3} L${cw-3},${cy} L${cw},${cy+3} Q${cw},${h} ${cw/2},${h} Q0,${h} 0,${cy+3} L3,${cy} Z"/></clipPath></defs><g clip-path="url(#cp${opt.id||0})"><rect width="${cw}" height="${h}" fill="${col}"/>${bands}</g>${maternal===undefined?'':`<circle cx="${cw/2}" cy="${h+1}" r="2.5" fill="${maternal?'#f472b6':'#60a5fa'}"/>`}</svg>`}
SCENES.push({id:'s4',belt:1,mood:'think',title:'23 Pairs: Your Karyotype',
html:`<p class="lead">A <b>karyotype</b> is a picture of all your chromosomes, arranged in pairs by size. <b>Step 1:</b> pair up the 8 scrambled chromosomes (same size and stripes). <b>Step 2:</b> see a full human set.</p>
<div class="card"><div class="row"><b>Your turn:</b><span id="kp" class="mini"></span></div><div id="kb" class="row" style="gap:18px;align-items:flex-end;justify-content:center;min-height:130px"></div><div id="kd" class="row" style="justify-content:center"></div></div>
<div class="card" style="margin-top:12px" id="kfull"><div class="row"><b>Full human karyotype</b><button class="btn sec" id="kx">Show XX (female)</button><button class="btn sec" id="ky">Show XY (male)</button><button class="btn" id="ks">Reveal all 23 pairs</button></div>
<div id="kall" class="row" style="gap:14px 10px;align-items:flex-end;justify-content:center"></div>
<div class="mini"><span style="color:#f472b6">●</span> from mom · <span style="color:#60a5fa">●</span> from dad. 22 numbered pairs (autosomes) + 1 pair of sex chromosomes = 46. Sizes shown are real relative lengths in DNA letters.</div></div>`,
init(w){const nums=[3,7,13,19];const r=rng(Date.now()%1000),items=[];nums.forEach(n=>{items.push({n,m:true});items.push({n,m:false})});items.sort(()=>r()-.5);let sel=null,done=0;const kb=w.querySelector('#kb');
 const rend=()=>{kb.innerHTML='';items.forEach((it,idx)=>{if(it.gone)return;const b=el('button','',chrom(it.n,0,undefined,{id:idx}));b.style.cssText='background:'+(sel===idx?'#16337a':'#0d1740')+';border:1px solid '+(sel===idx?'#22d3ee':'#24407a')+';border-radius:10px;padding:8px 10px;align-self:flex-end';b.setAttribute('aria-label','chromosome '+(idx+1));b.onclick=()=>{if(sel===null){sel=idx}else if(sel===idx){sel=null}else{const a=items[sel],c=items[idx];if(a.n===c.n){a.gone=c.gone=true;const d=el('div','pop',chrom(a.n,0,true)+chrom(a.n,0,false));d.style.cssText='display:flex;gap:2px;align-items:flex-end;border:1px solid #4ade80;border-radius:8px;padding:4px';w.querySelector('#kd').append(d);done++;w.querySelector('#kp').textContent=done+' / 4 pairs';react('Matched! One from each parent.','happy');if(done===4){react('All paired! Every pair has one copy from mom and one from dad.','happy');bow()}}else{react('Those two do not match. Compare length and stripes.','alert');kb.classList.add('shake');setTimeout(()=>kb.classList.remove('shake'),400)}sel=null}rend()};kb.append(b)})};
 w.querySelector('#kp').textContent='0 / 4 pairs';rend();
 let sex='XX',shown=false;const all=w.querySelector('#kall');
 const full=()=>{all.innerHTML='';if(!shown)return;for(let i=1;i<=22;i++){const d=el('div','',`<div style="display:flex;gap:1px;align-items:flex-end">${chrom(i,0,true,{id:'a'+i,w:11})}${chrom(i,0,false,{id:'b'+i,w:11})}</div><div class="mini" style="text-align:center">${i}</div>`);all.append(d)}
  const sx=sex==='XX'?['X','X']:['X','Y'];all.append(el('div','',`<div style="display:flex;gap:1px;align-items:flex-end;outline:2px solid #fbbf24;border-radius:6px;padding:2px">${chrom(sx[0],0,true,{id:'sx1',w:11})}${chrom(sx[1],0,false,{id:'sx2',w:11})}</div><div class="mini" style="text-align:center;color:#fbbf24">${sex}</div>`))};
 w.querySelector('#ks').onclick=()=>{shown=true;full();react('46 chromosomes: 23 from each parent.','happy')};
 w.querySelector('#kx').onclick=()=>{sex='XX';shown=true;full();react('XX: the child got an X from mom and an X from dad.')};
 w.querySelector('#ky').onclick=()=>{sex='XY';shown=true;full();react('XY: the Y comes from dad. It carries SRY, a switch that starts male development.')}}});
})();

/* ===== Scene 5: Double helix ===== */
(function(){
const seq=randSeq(21,21);
const INF={backbone:['Sugar-phosphate backbone','The two outside rails are made of alternating sugar (deoxyribose) and phosphate groups. They give the helix its strength. The two strands run in opposite directions (antiparallel).'],
 base:['Base pair rung','Each rung is two bases joined by hydrogen bonds: A–T has 2 bonds, C–G has 3. Hydrogen bonds are weak individually, so the cell can "unzip" the helix to read it.']};
SCENES.push({id:'s5',belt:1,mood:'happy',title:'The Double Helix',
html:`<p class="lead">Spin it, then click the <b style="color:#38bdf8">backbone</b> beads and the white <b>rung</b> centres. Use the slider to untwist the helix into a flat ladder.</p>
<div class="grid"><div class="card">${mkCv()}<div class="row"><label for="tw">Twist</label><input id="tw" type="range" min="0" max="100" value="100" aria-label="Twist"></div></div>
<div class="card info" id="hi"><h3>Click a part</h3><p>The helix is a twisted ladder. Try the parts!</p>
<table class="tbl"><tr><td>Width</td><td>2 nm</td></tr><tr><td>One full turn</td><td>≈ 10.5 base pairs, 3.4 nm</td></tr><tr><td>Between rungs</td><td>0.34 nm</td></tr><tr><td>Discovered</td><td>1953: Watson &amp; Crick, using X-ray data from Rosalind Franklin and Maurice Wilkins</td></tr></table>
<div class="row"><span class="b bA">A</span><span class="b bT">T</span><span class="b bC">C</span><span class="b bG">G</span></div><p class="mini">Adenine, Thymine, Cytosine, Guanine</p></div></div>`,
init(w){let tw=1;w.querySelector('#tw').oninput=e=>{tw=e.target.value/100};const hi=w.querySelector('#hi');
 new S3(w.querySelector('canvas'),{yaw:.5,pitch:.12,auto:.005,zoom:.95,onPick(id){const d=INF[id];if(d){hi.querySelector('h3').textContent=d[0];hi.querySelector('p').textContent=d[1];react(d[0]+'!','happy')}},draw(S){helix(S,seq,{rise:.16,R:.55,twist:tw,ids:true,labels:true})}})}});
})();

/* ===== Scene 6: Base-pair builder ===== */
SCENES.push({id:'s6',belt:1,mood:'think',title:'Base-Pair Builder & DNA Copying',
html:`<p class="lead">Rule: <b>A–T</b> and <b>C–G</b>. Click the matching base for each position on the top strand.</p>
<div class="card"><div class="mini">Original strand (5′ → 3′)</div><div class="seq" id="tp"></div><div class="mini" style="margin-top:8px">Your matching strand</div><div class="seq" id="bot"></div>
<div class="row" id="pick"><span class="mini">Pick the partner for the highlighted base:</span></div><div class="row"><b id="sc"></b></div></div>
<div class="card" style="margin-top:12px"><div class="row"><b>Replication</b><button class="btn" id="rp" disabled>Unzip &amp; copy!</button><span class="mini" id="rn">Finish the strand to unlock.</span></div>${mkCv('clamp(280px,44vh,400px)')}<div class="hint">Each new helix keeps one old strand and one new strand: this is called <b>semi-conservative</b> replication (done by the enzyme DNA polymerase).</div></div>`,
init(w){const seq=randSeq(8,31);let pos=0,miss=0;const top=w.querySelector('#tp'),bot=w.querySelector('#bot'),pick=w.querySelector('#pick');
 const rend=()=>{top.innerHTML=[...seq].map((b,i)=>`<span class="b b${b}" style="${i===pos?'outline:2px solid #fff':''}">${b}</span>`).join('');bot.innerHTML=[...seq].map((b,i)=>i<pos?`<span class="b b${COMP[b]} pop">${COMP[b]}</span>`:`<span class="b" style="background:#0d1740;border:1px dashed #24407a;color:#24407a">?</span>`).join('');w.querySelector('#sc').textContent=`Mistakes: ${miss}`};
 'ATCG'.split('').forEach(b=>{const x=el('button','b b'+b,b);x.setAttribute('aria-label','base '+b);x.onclick=()=>{if(pos>=8)return;if(b===COMP[seq[pos]]){pos++;react(pos<8?'Yes! '+seq[pos-1]+' pairs with '+b+'.':'Perfect strand!','happy');if(pos===8){w.querySelector('#rp').disabled=false;w.querySelector('#rn').textContent='Unlocked! Press the button.';bow()}}else{miss++;react('No: '+seq[pos]+' pairs with '+COMP[seq[pos]]+'.','alert');bot.classList.add('shake');setTimeout(()=>bot.classList.remove('shake'),400)}rend()};pick.append(x)});
 rend();let u=0,nf=0,phase=0,tg=0;
 w.querySelector('#rp').onclick=()=>{phase=1;react('The enzyme helicase unzips the helix, then DNA polymerase adds new partners.','think')};
 const iv=setInterval(()=>{if(phase===1){u=Math.min(1,u+.015);if(u>=1)phase=2}else if(phase===2){nf=Math.min(1,nf+.015);if(nf>=1){phase=3;react('Two identical DNA molecules! Ready for cell division.','happy')}}},16);(window.TIMERS=window.TIMERS||[]).push(iv);
 const full=seq,s2=[...seq].join('');
 new S3(w.querySelector('canvas'),{yaw:.25,pitch:.12,auto:0,zoom:1.5,draw(S){const ready=pos>=8;helix(S,full,{rise:.2,R:.5,twist:1,unzip:u,fresh:nf,sep:1.3,a:ready?1:.35,labels:u===0&&ready})}})}});
