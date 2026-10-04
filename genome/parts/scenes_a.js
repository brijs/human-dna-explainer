/* ===== Genomes & Proteins: Part A (genome) ===== */
const sphereM=(r,c,o={})=>new T.Mesh(new T.SphereGeometry(r,24,16),new T.MeshStandardMaterial({color:c,roughness:.35,metalness:.1,emissive:o.em||0x000000,emissiveIntensity:o.ei??.0,transparent:o.op!=null,opacity:o.op??1}));
const lineM=(a,b,c,op)=>{const g=new T.BufferGeometry().setFromPoints([new T.Vector3(...a),new T.Vector3(...b)]);return new T.Line(g,new T.LineBasicMaterial({color:c||0x4a6fb5,transparent:true,opacity:op??.7}))};
const infoBox=(h,p,extra='')=>`<h3>${h}</h3><p>${p}</p>${extra}`;
function addStars(st,n=300,R=120){const r=rng(3),g=new T.BufferGeometry(),a=[];for(let i=0;i<n;i++){const u=r()*6.28,v=Math.acos(2*r()-1),d=R*(.6+r()*.6);a.push(d*Math.sin(v)*Math.cos(u),d*Math.cos(v),d*Math.sin(v)*Math.sin(u))}g.setAttribute('position',new T.Float32BufferAttribute(a,3));st.scene.add(new T.Points(g,new T.PointsMaterial({color:0x7aa2ff,size:.5,transparent:true,opacity:.6})))}
/* generic clickable concept graph */
function nodeGraph(w,nodes,edges,o,onSel){const st=mkStage(w,{pos:o.pos||[0,6,34],auto:.5,minD:12,maxD:90,onPick:h=>{if(h)sel(h.object.userData.id)},onHover:h=>{}});if(!st)return null;addStars(st);
 const M={};nodes.forEach(n=>{const m=sphereM(n.r||1.5,n.color,{em:n.color,ei:.35});m.position.set(...n.pos);m.userData.id=n.id;st.add(m,true);M[n.id]=m;const l=makeLabel(n.label,'#e8f1ff',1.7);l.position.set(n.pos[0],n.pos[1]+(n.r||1.5)+1.5,n.pos[2]);st.scene.add(l)});
 edges.forEach(([a,b])=>st.scene.add(lineM(nodes.find(n=>n.id===a).pos,nodes.find(n=>n.id===b).pos)));
 let cur=null;function sel(id){cur=id;onSel(nodes.find(n=>n.id===id));st.focus(M[id].position.toArray(),o.focus||22,.7)}
 st.up.push((dt,t)=>{nodes.forEach(n=>{const m=M[n.id];m.scale.setScalar(cur===n.id?1.25+.08*Math.sin(t*4):1)})});return{st,sel}}
const jump=i=>`<button class="btn" onclick="go(${i})">Go to scene ${i+1} ▶</button>`;

/* ===== g1: map ===== */
SCENES.push({id:'g1',belt:0,mood:'happy',title:'The Map: What You Don\'t Know Yet',
html:`<p class="lead">Genes, genomes and proteins connect in a chain from information to function to disease. Click a node (or drag to explore) for the question that node answers. This module follows the map left to right.</p>
<div class="grid"><div class="card">${mkCv()}<div class="hint">Drag: rotate · right-drag: pan · scroll: zoom · click a node</div></div><div class="card info" id="gi"><h3>Pick a node</h3><p>Start anywhere. Each node has a "you probably haven't heard…" fact and a link to its scene.</p></div></div>`,
init(w){const N=[
 {id:'genome',label:'Genome',pos:[-24,0,0],color:'#22d3ee',scene:1,q:'Why are the longest chromosomes not the ones with the most genes?',d:'About 3.1 billion letters per haploid set, but only ~1.5% codes for protein.'},
 {id:'content',label:'What\'s in it',pos:[-17,8,4],color:'#38bdf8',scene:2,q:'If half the genome is old jumping genes, is it junk?',d:'Repeats, regulatory DNA, and regions of unknown function. "Function" is defined differently by different scientists.'},
 {id:'var',label:'Variation',pos:[-17,-8,-4],color:'#60a5fa',scene:3,q:'How different are you from a stranger, and from a Neanderthal?',d:'About 1 letter in 1,000 differs between two people. Some of your DNA is Neanderthal.'},
 {id:'reg',label:'Regulation',pos:[-9,5,6],color:'#a78bfa',scene:4,q:'Same genome, different cells: who flips the switches?',d:'Enhancers, promoters, chromatin loops and chemical tags decide which genes are used where.'},
 {id:'aa',label:'Amino acids',pos:[-2,0,-2],color:'#f472b6',scene:5,q:'Why do twenty building blocks suffice?',d:'Twenty side chains differing in size, charge and water preference.'},
 {id:'struct',label:'Structure',pos:[6,6,2],color:'#fb923c',scene:6,q:'What do four levels of structure mean?',d:'Sequence, helices and sheets, 3D fold, and multi-chain assemblies.'},
 {id:'fold',label:'Folding',pos:[13,0,-3],color:'#fbbf24',scene:7,q:'Why is folding a famous "paradox"?',d:'Levinthal paradox and the energy funnel.'},
 {id:'mis',label:'Misfolding',pos:[13,-9,3],color:'#f87171',scene:9,q:'How can one letter cause sickle cell disease?',d:'Mutations change stability or create sticky patches that aggregate.'},
 {id:'pred',label:'AlphaFold',pos:[21,7,-2],color:'#4ade80',scene:11,q:'How does AI predict structures without simulating physics?',d:'Evolutionary clues plus deep learning, with a confidence score for every residue.'},
 {id:'des',label:'Design & drugs',pos:[28,-3,4],color:'#34d399',scene:12,q:'Can we design proteins that don\'t exist in nature?',d:'Yes, and structure-based drug design already saved lives.'},
 {id:'open',label:'Open problems',pos:[34,4,-3],color:'#facc15',scene:13,q:'What can nobody do yet?',d:'Dynamics, disorder, complexes, mutation effects, folding pathways, function.'}];
 const E=[['genome','content'],['genome','var'],['genome','reg'],['reg','aa'],['aa','struct'],['struct','fold'],['fold','mis'],['fold','pred'],['pred','des'],['des','open'],['pred','open'],['mis','open']];
 const gi=w.querySelector('#gi');nodeGraph(w,N,E,{pos:[4,8,60],focus:26},n=>{gi.innerHTML=infoBox(n.label,'<b>'+n.q+'</b><br>'+n.d,jump(n.scene))});
 react('Every node is a scene. Click one to begin.')}});

/* ===== g2: genome at scale ===== */
(function(){
const CH=[['1',248.96,2058],['2',242.19,1309],['3',198.30,1078],['4',190.21,752],['5',181.54,876],['6',170.81,1048],['7',159.35,989],['8',145.14,677],['9',138.39,786],['10',133.80,733],['11',135.09,1298],['12',133.28,1034],['13',114.36,327],['14',107.04,830],['15',101.99,613],['16',90.34,873],['17',83.26,1197],['18',80.37,270],['19',58.62,1472],['20',64.44,544],['21',46.71,234],['22',50.82,488],['X',156.04,842],['Y',57.23,71]];
const MODES={len:{n:'Length (Mb)',v:c=>c[1],fmt:v=>v.toFixed(0)+' Mb'},genes:{n:'Protein-coding genes (≈)',v:c=>c[2],fmt:v=>'≈ '+Math.round(v)},dens:{n:'Gene density (genes per Mb)',v:c=>c[2]/c[1],fmt:v=>v.toFixed(1)+' /Mb'}};
const NOTE={'1':'Largest chromosome, with roughly 2,000 protein-coding genes.','19':'Short but the most gene-dense chromosome, with an unusually high fraction of repeats like Alu.','21':'Smallest human autosome by length. Having three copies causes Down syndrome.','Y':'Small and gene-poor (only a few dozen protein-coding genes). It carries SRY, the male-determining switch.','X':'About 155 Mb with hundreds of genes. Females inactivate one X in each cell.','13':'Large but gene-poor, which is why it is one of the less gene-dense chromosomes.','18':'Gene-poor for its size.','2':'Formed by a fusion of two ancestral ape chromosomes.'};
SCENES.push({id:'g2',belt:0,mood:'neutral',title:'The Genome at Scale',
html:`<p class="lead">Your genome has about <b>3.1 billion letters</b> per haploid set (≈ <b>6,000 novels</b> of 500,000 characters). Each bar is a chromosome. Switch the metric and notice that size and gene count are not the same thing.</p>
<div class="grid"><div class="card"><div class="row" id="md"></div>${mkCv()}<div class="hint">Click a bar. Lengths are GRCh38 reference values; gene counts are approximate and vary by annotation release.</div></div>
<div class="card info" id="gi"><h3>Click a chromosome</h3><p>The complete telomere-to-telomere (T2T-CHM13) assembly of 2022 is <b>3.055 billion</b> bases and added ≈ 200 million bases of sequence that earlier references had left as gaps: all centromeres and the short arms of five chromosomes (≈ 8% of the genome).</p><p class="mini">Haploid = one copy of each chromosome. Your cells carry two.</p></div></div>`,
init(w){let mode='len',sel=null;const gi=w.querySelector('#gi');const st=mkStage(w,{pos:[0,16,52],target:[0,6,0],auto:0,minD:10,maxD:120,onPick:h=>{if(h)select(h.object.userData.i)}});if(!st)return;addStars(st,150,100);
 const bars=[],labels=[],cur=CH.map(()=>1),tgt=CH.map(()=>1);
 const sc=()=>{const vs=CH.map(c=>MODES[mode].v(c));const mx=Math.max(...vs);return vs.map(v=>v/mx*22+.3)};
 const colr=(c,i)=>{const d=c[2]/c[1];return mode==='dens'?new T.Color().setHSL(.6-clamp(d/25,0,1)*.5,.85,.55):new T.Color().setHSL(.58+i*.012,.7,.55)};
 CH.forEach((c,i)=>{const m=new T.Mesh(new T.BoxGeometry(1,1,1),new T.MeshStandardMaterial({color:'#38bdf8',roughness:.4,metalness:.1}));m.userData.i=i;st.add(m,true);bars.push(m);const l=makeLabel(c[0],'#e8f1ff',1.3);l.position.set((i-11.5)*2.1,-1.3,0);st.scene.add(l);const v=makeLabel('','#fde68a',1.1);st.scene.add(v);labels.push(v)});
 const floor=new T.Mesh(new T.PlaneGeometry(70,10),new T.MeshBasicMaterial({color:0x0b1440,transparent:true,opacity:.7}));floor.rotation.x=-Math.PI/2;floor.position.y=-.01;st.scene.add(floor);
 function setMode(m){mode=m;const s=sc();s.forEach((v,i)=>tgt[i]=v);CH.forEach((c,i)=>{bars[i].material.color.copy(colr(c,i))});w.querySelectorAll('#md .chip').forEach(b=>b.classList.toggle('on',b.dataset.m===m));
  labels.forEach((l,i)=>{const nl=makeLabel(MODES[m].fmt(MODES[m].v(CH[i])),'#fde68a',1.1);l.material.map.dispose();l.material.map=nl.material.map;l.scale.copy(nl.scale)})}
 function select(i){sel=i;const c=CH[i];st.focus([(i-11.5)*2.1,tgt[i]/2,0],26,.7);gi.innerHTML=infoBox('Chromosome '+c[0],`<b>${c[1].toFixed(1)} Mb</b> · ≈ ${c[2]} protein-coding genes · ≈ ${(c[2]/c[1]).toFixed(1)} genes per Mb.<br>${NOTE[c[0]]||'Average genes per Mb across the genome is roughly 6–7 (≈ 20,000 genes in 3,100 Mb).'}`)}
 Object.entries(MODES).forEach(([k,v])=>{const b=el('button','chip',v.n);b.dataset.m=k;b.onclick=()=>{setMode(k);react(v.n+'. Gene-rich chromosomes pop out in density mode.','think')};w.querySelector('#md').append(b)});
 st.up.push(()=>{CH.forEach((c,i)=>{cur[i]+=(tgt[i]-cur[i])*.12;const h=cur[i];bars[i].scale.set(1.5,h,1.5);bars[i].position.set((i-11.5)*2.1,h/2,0);labels[i].position.set((i-11.5)*2.1,h+1.2,0);bars[i].material.emissive.setHex(sel===i?0x223366:0)})});
 setMode('len')}});
})();

/* ===== g3: what's in the genome ===== */
SCENES.push({id:'g3',belt:0,mood:'think',title:'What\'s in 3 Billion Letters?',
html:`<p class="lead">Click the slices. Then use the three <b>lenses</b> on "function": they give very different answers, which is the heart of the ENCODE "junk DNA" debate.</p>
<div class="grid"><div class="card"><div class="row" id="ln"></div>${mkCv()}<div class="hint">Slice sizes are approximate and the categories partly overlap.</div></div><div class="card info" id="gi"><h3>Click a slice</h3><p>About half of the genome is derived from transposable elements ("jumping genes") that copied themselves over millions of years.</p></div></div>`,
init(w){const SL=[{n:'Protein-coding exons',p:1.5,c:'#22d3ee',d:'The parts of genes that specify amino acids: only ≈ 1–2% of the genome. This is what the 20,000 or so protein-coding genes are made from.'},
 {n:'LINE-1 elements',p:17,c:'#f472b6',d:'Long interspersed elements: ≈ 17% of the genome. Most copies are old, truncated and inactive, but a few hundred remain able to jump, and occasionally cause disease.'},
 {n:'Alu elements',p:10.5,c:'#fb923c',d:'A ≈ 300-letter sequence repeated more than a million times: ≈ 10–11% of the genome. Primate-specific. They can rewire gene regulation and alternative splicing.'},
 {n:'Other repeats',p:21,c:'#a78bfa',d:'Retrovirus-like (LTR) elements, DNA transposons and the huge satellite arrays at centromeres (≈ 6% of the genome, finally sequenced by T2T in 2022). Together with LINE and Alu roughly half the genome is repeat-derived.'},
 {n:'Everything else',p:50,c:'#4ade80',d:'Introns, regulatory elements (enhancers, promoters, insulators), genes for functional RNAs, and DNA with unknown function. Some is essential, some is likely neutral filler.'}];
 const LENS={bio:{n:'Biochemical activity (ENCODE 2012: ~80%)',f:.8,d:'ENCODE 2012 reported that ~80% of the genome shows some biochemical activity (being transcribed, bound by proteins, or in open chromatin). Critics argued that activity is not the same as function.'},cons:{n:'Evolutionary conservation (≲ 10%)',f:.09,d:'Regions kept unchanged across mammals by natural selection: roughly 5–10% of the genome. If DNA is under purifying selection, it matters, but weak or recent functions are missed.'},cod:{n:'Codes for protein (~1.5%)',f:.015,d:'The narrowest definition: sequences translated into protein.'}};
 const gi=w.querySelector('#gi');const st=mkStage(w,{pos:[0,26,30],auto:.4,minD:10,maxD:80,onPick:h=>{if(h)sel(h.object.userData.i)}});if(!st)return;addStars(st,150,90);
 const grp=new T.Group();st.scene.add(grp);let a0=0;const meshes=SL.map((s,i)=>{const th=s.p/100*Math.PI*2;const geo=new T.CylinderGeometry(10,10,2,48,1,false,a0,th);a0+=th;const m=new T.Mesh(geo,new T.MeshStandardMaterial({color:s.c,roughness:.45,metalness:.1}));m.userData.i=i;const mid=a0-th/2;grp.add(m);st.pick.push(m);if(s.p>=1){const lb=makeLabel(s.n.split(' ')[0]+' '+s.p+'%','#04061a',1.6);lb.material.depthTest=false;lb.position.set(7*Math.sin(mid),1.6,7*Math.cos(mid));grp.add(lb)}return m});
 let ring=null,selI=null;function sel(i){selI=i;gi.innerHTML=infoBox(SL[i].n+' (≈ '+SL[i].p+'%)',SL[i].d);react(SL[i].n,'think')}
 function lens(k){if(ring){grp.remove(ring);ring.geometry.dispose()}const L=LENS[k];ring=new T.Mesh(new T.TorusGeometry(12.5,.55,12,96,Math.max(.05,L.f*Math.PI*2)),new T.MeshStandardMaterial({color:'#fde047',emissive:'#fde047',emissiveIntensity:.5}));ring.rotation.x=Math.PI/2;ring.rotation.z=0;grp.add(ring);gi.innerHTML=infoBox(L.n,L.d+'<br><b>'+(L.f*100).toFixed(L.f<.1?1:0)+'% of the genome</b>');w.querySelectorAll('#ln .chip').forEach(b=>b.classList.toggle('on',b.dataset.k===k))}
 Object.entries(LENS).forEach(([k,v])=>{const b=el('button','chip',v.n);b.dataset.k=k;b.onclick=()=>lens(k);w.querySelector('#ln').append(b)});
 st.up.push((dt,t)=>{meshes.forEach((m,i)=>{const e=selI===i?2.2:0;m.position.y+=((e)-m.position.y)*.15;m.scale.y=1})});
 grp.rotation.x=0}});

/* ===== g4: variation ===== */
SCENES.push({id:'g4',belt:1,mood:'think',title:'Variation: You vs. Everyone',
html:`<p class="lead">Heights are on a <b>log scale</b> (each gridline = 10× more). Switch between "who you're compared to" and "what kinds of differences sit inside one genome".</p>
<div class="grid"><div class="card"><div class="row" id="vm"></div>${mkCv()}<div class="hint">Click a bar for details. Numbers are approximate, from the 1000 Genomes Project and later work.</div></div><div class="card info" id="gi"><h3>Click a bar</h3><p>Pangenome: a single reference misses diversity. The 2023 draft Human Pangenome (47 people) added ≈ 119 million bases of variable sequence and 1,115 gene duplications compared with GRCh38.</p></div></div>`,
init(w){const SETS={who:[{n:'Two people',v:3e6,t:'≈ 0.1% of letters, about 3 million single-letter differences.',c:'#38bdf8'},{n:'Neanderthal DNA*',v:5.5e7,t:'People with recent non-African ancestry carry ≈ 1.5–2% Neanderthal-derived DNA (≈ 50–60 million letters), inherited from interbreeding ≈ 50,000 years ago. *This is amount of DNA, not number of differences.',c:'#a78bfa'},{n:'Human vs chimp',v:3.5e7,t:'≈ 1.2% single-letter differences (≈ 35 million), plus insertions, deletions and duplications that bring the total difference to roughly 4%.',c:'#f472b6'}],
 kind:[{n:'SNPs (single letters)',v:4e6,t:'A typical genome differs from the reference at ≈ 4–5 million sites; the vast majority are single-letter SNPs.',c:'#38bdf8'},{n:'Protein-altering',v:1.1e4,t:'Roughly 10,000–12,000 variants per person change an amino acid. Most are harmless.',c:'#fb923c'},{n:'Loss-of-function',v:150,t:'Roughly 100–200 variants per person are predicted to disable a gene (stop, frameshift, splice). Most genes tolerate losing one copy.',c:'#f87171'},{n:'Structural variants',v:2500,t:'≈ 2,100–2,500 large changes (deletions, duplications, inversions, mobile elements) per genome, yet they affect ≈ 20 million bases, more total sequence than all SNPs combined.',c:'#a3e635'}]};
 let set='who';const gi=w.querySelector('#gi');const st=mkStage(w,{pos:[0,9,24],target:[0,4.5,0],auto:0,minD:8,maxD:70,onPick:h=>{if(h)pick(h.object.userData.i)}});if(!st)return;addStars(st,120,80);
 let grp=new T.Group();st.scene.add(grp);const H=v=>Math.log10(v)*1.6;
 function build(){st.scene.remove(grp);grp.traverse(o=>{if(o.geometry)o.geometry.dispose()});grp=new T.Group();st.scene.add(grp);const D=SETS[set];
  for(let k=0;k<=8;k++){const l=lineM([-8,k*1.6,-1.5],[8,k*1.6,-1.5],0x2a4a8c,.35);grp.add(l);if(k>=1&&k<=8&&k%1===0){const t=makeLabel('10^'+k,'#8aa4d6',.9);t.position.set(-9.2,k*1.6,-1.5);grp.add(t)}}
  D.forEach((d,i)=>{const h=H(d.v),m=new T.Mesh(new T.BoxGeometry(2.6,h,2.6),new T.MeshStandardMaterial({color:d.c,roughness:.4,metalness:.1}));const x=(i-(D.length-1)/2)*5.2;m.position.set(x,h/2,0);m.userData.i=i;grp.add(m);st.pick.push(m);const l=makeLabel(d.n,'#e8f1ff',.8);l.position.set(x,-1.1,2);grp.add(l);const v=makeLabel(d.v>=1e6?(d.v/1e6).toFixed(d.v<1e7?1:0)+' M':d.v>=1e3?d.v.toLocaleString():''+d.v,'#fde68a',1.1);v.position.set(x,h+1,0);grp.add(v)});
  st.pick.length=0;grp.children.forEach(o=>{if(o.userData&&o.userData.i!=null&&o.isMesh)st.pick.push(o)});w.querySelectorAll('#vm .chip').forEach(b=>b.classList.toggle('on',b.dataset.k===set))}
 function pick(i){const d=SETS[set][i];gi.innerHTML=infoBox(d.n,d.t);react(d.n,'think')}
 [['who','Compare genomes'],['kind','Inside one genome']].forEach(([k,n])=>{const b=el('button','chip',n);b.dataset.k=k;b.onclick=()=>{set=k;build()};w.querySelector('#vm').append(b)});build()}});

/* ===== g5: regulation ===== */
SCENES.push({id:'g5',belt:1,mood:'think',title:'Regulation: Same Genome, Different Cells',
html:`<p class="lead">Every cell has the same DNA. <b>Enhancers</b> (yellow cubes) can sit tens of thousands of letters from the gene they control; the DNA <b>loops</b> to bring them to the <b>promoter</b> (orange). Pick a cell type, then try adding <b>methylation</b>.</p>
<div class="grid"><div class="card"><div class="row" id="ct"></div><div class="row"><button class="chip" id="meth" aria-pressed="false">🔴 Add DNA methylation on promoters</button><button class="chip" id="rl">⟲ Reset</button></div>${mkCv()}<div class="hint">Drag to rotate. This is a cartoon: real loops form by cohesin proteins extruding DNA, not a simple fold.</div></div><div class="card info" id="gi"><h3>Choose a cell type</h3><p>Neuron, liver and muscle cells use different gene sets because different enhancers are active.</p></div></div>`,
init(w){const GENES=[{n:'Neuron gene',c:'#a78bfa',x:-12},{n:'Liver gene',c:'#4ade80',x:0},{n:'Muscle gene',c:'#fb923c',x:12}],CT={Neuron:0,Liver:1,Muscle:2};let cell=null,meth=false;const gi=w.querySelector('#gi');
 const st=mkStage(w,{pos:[0,12,40],target:[0,3,0],auto:.25,minD:10,maxD:70});if(!st)return;addStars(st,150,90);
 const NP=140,xs=[...Array(NP)].map((_,i)=>-22+i*44/(NP-1));const L=[0,0,0];const tgtL=[0,0,0];
 const eIdx=GENES.map(g=>xs.findIndex(x=>x>=g.x-8)),pIdx=GENES.map(g=>xs.findIndex(x=>x>=g.x));
 function pts(){const shift=L.reduce((s,l,k)=>s+l*.85*8*.5,0);return xs.map((x,i)=>{let X=x,Y=Math.sin(x*.45)*.9,Z=Math.cos(x*.3)*1.2;for(let k=0;k<3;k++){const a=GENES[k].x-8,b=GENES[k].x,l=L[k];if(l<=0.001)continue;const sh=.85*l*(b-a);if(x>a&&x<=b){const u=(x-a)/(b-a);X=a+(x-a)*(1-.85*l);Y+=l*8*Math.sin(Math.PI*u);}else if(x>b){X=x-sh}}return new T.Vector3(X+shift,Y,Z)})}
 let tube=null,P=pts();function rebuildTube(){if(tube){tube.geometry.dispose();st.scene.remove(tube)}P=pts();tube=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(P),240,.38,8,false),new T.MeshStandardMaterial({color:'#3b82f6',roughness:.5}));st.scene.add(tube)}
 const E=[],Pm=[],G=[],ME=[],RN=[];GENES.forEach((g,k)=>{const e=new T.Mesh(new T.BoxGeometry(1.2,1.2,1.2),new T.MeshStandardMaterial({color:'#fde047',roughness:.3,emissive:'#fde047',emissiveIntensity:.1}));st.scene.add(e);E.push(e);const p=new T.Mesh(new T.BoxGeometry(1.1,1.1,1.1),new T.MeshStandardMaterial({color:'#fb923c',roughness:.3}));st.scene.add(p);Pm.push(p);
  const gb=[0,1,2].map(j=>{const s=sphereM(.75,g.c,{em:g.c,ei:0});st.scene.add(s);return s});G.push(gb);const me=[0,1,2,3].map(()=>{const s=sphereM(.28,'#ef4444',{em:'#ef4444',ei:.4});s.visible=false;st.scene.add(s);return s});ME.push(me);
  const rn=[...Array(8)].map(()=>{const s=sphereM(.22,g.c,{em:g.c,ei:.8});s.visible=false;st.scene.add(s);s.userData.ph=Math.random();return s});RN.push(rn);
  const lb=makeLabel(g.n,'#e8f1ff',1.2);lb.userData.k=k;st.scene.add(lb);g.lb=lb});
 const act=k=>cell!==null&&cell===k;
 function status(){const on=GENES.map((g,k)=>act(k)&&!meth);gi.innerHTML=infoBox(cell===null?'Choose a cell type':Object.keys(CT)[cell]+' cell',cell===null?'Pick a cell type above.':GENES.map((g,k)=>`<b style="color:${g.c}">${g.n}</b>: ${on[k]?'ON (enhancer looped, promoter open)':act(k)&&meth?'OFF (promoter methylated, even though the enhancer is active)':'OFF (enhancer not active in this cell)'}`).join('<br>')+'<p class="mini">Methylation adds –CH₃ tags to cytosines (mostly at CpG sites). Methylated promoters tend to be silent; it is one of the epigenetic marks that cells use to remember their identity.</p>')}
 Object.keys(CT).forEach(n=>{const b=el('button','chip',n);b.onclick=()=>{cell=CT[n];GENES.forEach((g,k)=>tgtL[k]=k===cell?1:0);w.querySelectorAll('#ct .chip').forEach(x=>x.classList.toggle('on',x===b));status();react(n+' cell: enhancers loop to the right gene.','happy')};w.querySelector('#ct').append(b)});
 w.querySelector('#meth').onclick=e=>{meth=!meth;e.currentTarget.setAttribute('aria-pressed',meth);e.currentTarget.classList.toggle('on',meth);status();react(meth?'Methylation silences the promoter.':'Methylation removed (demethylation).','think')};
 w.querySelector('#rl').onclick=()=>{cell=null;meth=false;tgtL.fill(0);w.querySelectorAll('#ct .chip,#meth').forEach(x=>x.classList.remove('on'));status()};
 rebuildTube();let mv=true;
 st.up.push((dt,t)=>{let ch=false;for(let k=0;k<3;k++){const d=tgtL[k]-L[k];if(Math.abs(d)>.002){L[k]+=Math.sign(d)*Math.min(Math.abs(d),dt*.6);ch=true}}if(ch||mv){rebuildTube();mv=false}
  GENES.forEach((g,k)=>{const e=P[eIdx[k]],p=P[pIdx[k]];E[k].position.copy(e).add(new T.Vector3(0,1,0));Pm[k].position.copy(p).add(new T.Vector3(0,1,0));const on=act(k)&&!meth&&L[k]>.9;E[k].material.emissiveIntensity=act(k)?.9:.1;
   G[k].forEach((s,j)=>{const q=P[Math.min(NP-1,pIdx[k]+3+j*4)];s.position.copy(q).add(new T.Vector3(0,.5,0));s.material.emissiveIntensity=on?.9:0;s.material.color.set(on?g.c:'#475569')});
   ME[k].forEach((s,j)=>{s.visible=meth;s.position.copy(p).add(new T.Vector3(Math.cos(j*1.6)*1.1,1.8+Math.sin(j*1.6)*.5,Math.sin(j*1.6)*1.1))});
   RN[k].forEach(s=>{s.visible=on;if(on){const u=(t*.4+s.userData.ph)%1;const q=P[pIdx[k]+7];s.position.set(q.x+Math.sin(u*9+s.userData.ph*6)*.7,q.y+1+u*7,q.z);s.material.opacity=1-u}});
   g.lb.position.set(P[pIdx[k]+4].x,P[pIdx[k]+4].y-2.4,P[pIdx[k]+4].z)})});
 status()}});
