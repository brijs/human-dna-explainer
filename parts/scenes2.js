/* ===== Scene 7: Genes ===== */
(function(){
const LEN={2:242,7:159,11:135,15:102,Y:57},CEN={2:.38,7:.38,11:.39,15:.18,Y:.3};
const CH={
 2:{g:[{id:'LCT',t:.56,c:'#fbbf24',n:'LCT (lactase)',d:'Makes lactase, the enzyme that digests milk sugar. Most babies make it; many adults keep making it thanks to a nearby DNA variant (lactase persistence). Also: human chromosome 2 was formed when two ape chromosomes fused.'}]},
 7:{g:[{id:'CFTR',t:.68,c:'#4ade80',n:'CFTR',d:'Makes a channel that moves salt and water in and out of cells in the lungs and gut. Two faulty copies cause cystic fibrosis (a recessive condition).'},{id:'FOXP2',t:.84,c:'#f472b6',n:'FOXP2',d:'Makes a protein that switches other genes on. It is involved in speech and language development. Chimps have a version that differs by two amino acids.'}]},
 11:{g:[{id:'INS',t:.12,c:'#22d3ee',n:'INS (insulin)',d:'Makes insulin, a hormone that tells cells to take up sugar from the blood.'},{id:'HBB',t:.3,c:'#f87171',n:'HBB (hemoglobin beta)',d:'Makes one part of hemoglobin, the protein that carries oxygen in red blood cells. A one-letter change here causes sickle cell disease (scene 9).'}]},
 15:{g:[{id:'OCA2',t:.34,c:'#60a5fa',n:'OCA2 / HERC2 region',d:'Helps control how much brown pigment (melanin) the iris makes. Variants here are the biggest single factor in blue vs brown eyes, but several other genes also contribute.'}]},
 Y:{g:[{id:'SRY',t:.2,c:'#fb923c',n:'SRY',d:'The "switch" gene on the Y chromosome. It starts the development of male features in an embryo. Without it, the default path is female.'}]}};
function path(chr,sg,n){const L=LEN[chr],cen=CEN[chr],H=.8+L/145*1.4,pts=[];for(let i=0;i<n;i++){const t=i/(n-1),y=H/2-t*H,d=Math.abs(t-cen)*H;pts.push([sg*(.05+.5*Math.pow(d/H,1.25)),y,0])}return pts}
SCENES.push({id:'s7',belt:1,mood:'think',title:'Genes: Recipes in the Book',
html:`<p class="lead">A chromosome is a very long DNA molecule, packed. <b>Genes</b> are short stretches that hold instructions. Pick a chromosome, then click the glowing bands. (Positions are illustrative, not to scale.)</p>
<div class="grid"><div class="card"><div class="row" id="cs"></div>${mkCv()}</div><div class="card info" id="gi"><h3>Click a gene</h3><p>Every colored band is a gene.</p>
<p class="mini">≈ 20,000 protein-coding genes · only ≈ 1–2% of your DNA codes for protein. The rest includes switches that decide when genes turn on, plus regions we are still studying.</p>
<div class="bar"><i style="width:2%"></i></div><p class="mini">Most traits (height, skin color, eye color) involve <b>many genes plus environment</b>, not just one.</p></div></div>`,
init(w){let ch=11,sel=null;const gi=w.querySelector('#gi');
 Object.keys(CH).forEach(k=>{const b=el('button','chip','Chr '+k);b.onclick=()=>{ch=k;sel=null;w.querySelectorAll('#cs .chip').forEach(x=>x.classList.toggle('on',x===b));gi.querySelector('h3').textContent='Chromosome '+k;gi.querySelector('p').textContent='Click one of the glowing bands.'};if(k==='11')b.classList.add('on');w.querySelector('#cs').append(b)});
 const N=40;new S3(w.querySelector('canvas'),{yaw:.3,pitch:.1,auto:.007,zoom:1.25,onPick(id){const g=CH[ch].g.find(x=>x.id===id);if(g){sel=id;gi.querySelector('h3').textContent=g.n;gi.querySelector('p').textContent=g.d;react(g.n+'!','happy')}},
  draw(S,t){for(const sg of[-1,1]){const p=path(ch,sg,N);for(let i=1;i<N;i++)S.line(p[i-1],p[i],.27,'#6d5bd0');
    CH[ch].g.forEach(g=>{const i=Math.round(g.t*(N-1));for(let j=i-1;j<=i+1;j++){S.sphere(p[j],.2,g.c,sg>0?g.id:null,sel===g.id?1:.75+.25*Math.sin(t*3))}})}
   CH[ch].g.forEach(g=>{const p=path(ch,1,N)[Math.round(g.t*(N-1))];S.label([p[0]+.55,p[1],0],g.id,g.c,13)})}})}});
})();

/* ===== shared sequence editor / protein view ===== */
function seqEditor(root,getSeq,setSeq,opt={}){const L='ATCG';root.innerHTML='';const s=getSeq();
 for(let c=0;c*3<s.length;c+=1){const d=el('span','cod');for(let k=0;k<3&&c*3+k<s.length;k++){const i=c*3+k,b=s[i],btn=el('button','b b'+b,b);btn.setAttribute('aria-label','base '+(i+1)+' '+b+' click to change');btn.onclick=()=>{const n=L[(L.indexOf(b)+1)%4];const a=getSeq();setSeq(a.slice(0,i)+n+a.slice(i+1))};d.append(btn)}root.append(d)}}
function aaChips(root,aas,ref){root.innerHTML='';let stop=false;aas.forEach((a,i)=>{if(stop)return;const ch=el('span','aa'+(ref&&ref[i]!==a?' pop':''),`<b style="color:${AAC[a]}">${a==='*'?'■':a}</b>${AAN[a]}`);if(ref&&ref[i]!==a)ch.style.borderColor='#fbbf24';ch.style.borderBottom='3px solid '+AAC[a];root.append(ch);if(a==='*')stop=true})}
function chain3d(cv,getAA){return new S3(cv,{yaw:.4,pitch:.2,auto:.008,zoom:1.25,draw(S,t){const aa=getAA();const full=aa.indexOf('*');const a=full<0?aa:aa.slice(0,full+1);const n=a.length;let prev=null;
  a.forEach((x,i)=>{const ang=i*.95,p=[Math.cos(ang)*.7+Math.sin(i*1.7)*.15,(i-(n-1)/2)*.26,Math.sin(ang)*.7];if(prev)S.line(prev,p,.07,'#cbd5e1');S.sphere(p,.17,AAC[x]||'#94a3b8');S.label([p[0],p[1]+.02,p[2]],x==='*'?'■':x,'#04061a',12);prev=p})}})}

/* ===== Scene 8: DNA -> RNA -> protein ===== */
(function(){
const BASE='ATGGTGCATCTGACTCCTGAGGAGAAG';
SCENES.push({id:'s8',belt:2,mood:'think',title:'DNA → RNA → Protein',
html:`<p class="lead">This is the real start of the human <b>HBB</b> gene (hemoglobin). <b>Click any base to change it</b>, then press the steps. Watch the protein change.</p>
<div class="card"><div class="mini">1 · DNA coding strand (click a base to change it)</div><div class="seq" id="dn"></div>
<div class="row"><button class="btn" id="tr">② Transcribe → mRNA</button><button class="btn" id="tl">③ Translate → protein</button><button class="btn sec" id="rs">Reset</button></div>
<div id="rnaBox" style="display:none"><div class="mini">2 · messenger RNA (copy of the gene; T becomes <span class="b bU" style="width:20px;height:20px">U</span>)</div><div class="seq" id="rn"></div><div class="mini">The mRNA is actually built from the template (opposite) strand, so it matches the coding strand but with U.</div></div>
</div>
<div class="grid" style="margin-top:12px"><div class="card" id="pBox" style="display:none"><div class="mini">3 · amino acids (one per codon). Colors: <span style="color:#fbbf24">water-fearing</span> · <span style="color:#38bdf8">polar</span> · <span style="color:#60a5fa">+ charged</span> · <span style="color:#f87171">− charged</span></div><div id="pr"></div></div>
<div class="card" id="cBox" style="display:none">${mkCv('260px')}<div class="hint">The protein chain folds into a 3D shape. Shape = job.</div></div></div>`,
init(w){let seq=BASE,st=0;const dn=w.querySelector('#dn');
 const rend=()=>{seqEditor(dn,()=>seq,s=>{seq=s;rend();if(st>=1)react('Changed DNA = changed message!','alert')});
  w.querySelector('#rnaBox').style.display=st>=1?'':'none';w.querySelector('#pBox').style.display=st>=2?'':'none';w.querySelector('#cBox').style.display=st>=2?'':'none';
  w.querySelector('#rn').innerHTML=[...seq].map((b,i)=>{const r=b==='T'?'U':b;return(i%3===0?'<span class="cod">':'')+`<span class="b b${r}">${r}</span>`+(i%3===2||i===seq.length-1?'</span>':'')}).join('');
  aaChips(w.querySelector('#pr'),translate(seq),translate(BASE))};
 rend();w.querySelector('#tr').onclick=()=>{st=Math.max(st,1);rend();react('Transcription: the gene is copied into mRNA in the nucleus.','happy')};
 w.querySelector('#tl').onclick=()=>{st=2;rend();react('Translation: a ribosome reads codons and links amino acids.','happy')};
 w.querySelector('#rs').onclick=()=>{seq=BASE;rend()};
 chain3d(w.querySelector('canvas'),()=>translate(seq))}});
})();

/* ===== Scene 9: Mutation lab ===== */
(function(){
const BASE='ATGGTGCATCTGACTCCTGAGGAGAAG';
const P=[['Silent','ACT → ACC (codon 5)',s=>s.slice(0,14)+'C'+s.slice(15)],['Missense (sickle cell)','GAG → GTG (codon 7)',s=>s.slice(0,19)+'T'+s.slice(20)],['Nonsense','GAG → TAG (codon 7)',s=>s.slice(0,18)+'T'+s.slice(19)],['Frameshift (delete 1 base)','delete the A in codon 7',s=>s.slice(0,19)+s.slice(20)]];
function classify(seq){const ref=translate(BASE),a=translate(seq);if(seq===BASE)return['Original','This is the normal sequence.'];
 const rs=ref.join(''),as=a.join('');const stopAt=a.indexOf('*');
 if(seq.length%3!==0&&seq.length!==BASE.length)return['Frameshift','Adding or deleting letters (not in multiples of 3) shifts every codon after that spot, usually wrecking the protein.'];
 if(stopAt>=0&&stopAt<ref.length)return['Nonsense','A codon turned into STOP, so the protein is cut short.'];
 if(as===rs)return['Silent','The DNA changed but the amino acids did not (several codons can mean the same amino acid). No effect!'];
 return['Missense','One amino acid was swapped. The effect depends on which one and where.']}
SCENES.push({id:'s9',belt:2,mood:'alert',title:'Mutation Lab',
html:`<p class="lead">Try the preset mutations, or click any base to make your own. The yellow outline marks changed amino acids.</p>
<div class="card"><div class="row" id="pre"></div><div class="seq" id="dn"></div><div id="pr" style="margin-top:6px"></div><p><b id="vt"></b> <span id="vd"></span></p></div>
<div class="grid" style="margin-top:12px"><div class="card info"><h3>Why sickle cell?</h3><p>In hemoglobin, amino acid #7 here (Glu, an acidic one) becomes Val (water-fearing). Hemoglobin molecules then stick together in long rods when oxygen is low, bending red blood cells into crescents that can block tiny blood vessels.</p><p class="mini">One copy of the variant (sickle cell trait) gives some protection from malaria, which is why it is common where malaria is common. Mutations are not always "bad": they are also the raw material of variation. Everyone is born with roughly 40–100 brand-new DNA changes.</p></div>
<div class="card"><svg viewBox="0 0 320 130" width="100%" aria-label="Red blood cells" id="rbc"></svg><div class="mini" id="rbt"></div></div></div>`,
init(w){let seq=BASE;const dn=w.querySelector('#dn');
 const cell=(x,y,sick,r)=>sick?`<g transform="translate(${x},${y}) rotate(${-35+x%50})"><path d="M-30,0 Q-4,-24 30,-4 Q-2,-10 -30,0 Z" fill="#b91c1c" stroke="#fecaca" stroke-width="2"/><path d="M-30,0 Q-6,16 30,-4 Q-4,0 -30,0Z" fill="#991b1b"/></g>`:`<g transform="translate(${x},${y})"><ellipse rx="${r}" ry="${r}" fill="#dc2626" stroke="#fecaca" stroke-width="2"/><ellipse rx="${r*.45}" ry="${r*.45}" fill="#991b1b"/></g>`;
 const rend=()=>{seqEditor(dn,()=>seq,s=>{seq=s;rend()});const a=translate(seq),c=classify(seq);aaChips(w.querySelector('#pr'),a,translate(BASE));w.querySelector('#vt').textContent=c[0]+':';w.querySelector('#vd').textContent=c[1];
  const sick=a[6]==='V';w.querySelector('#rbc').innerHTML=[40,110,185,255].map((x,i)=>cell(x,i%2?85:45,sick&&i!==2,26)).join('');w.querySelector('#rbt').textContent=sick?'Sickled red blood cells (crescent shape)':'Healthy round, flexible red blood cells'};
 P.forEach(p=>{const b=el('button','chip',p[0]);b.title=p[1];b.onclick=()=>{seq=p[2](BASE);rend();react(p[0]+': '+p[1],'alert')};w.querySelector('#pre').append(b)});
 const rs=el('button','chip','Reset');rs.onclick=()=>{seq=BASE;rend()};w.querySelector('#pre').append(rs);rend()}});
})();

/* ===== Scene 10: Inheritance ===== */
SCENES.push({id:'s10',belt:2,mood:'think',title:'Inheritance & Punnett Squares',
html:`<p class="lead">Each parent passes on <b>one</b> of their two alleles (gene versions). A Punnett square shows all the combinations.</p>
<div class="card"><div class="row" id="tabs"></div><div id="tb"></div></div>`,
init(w){const tabs=[['Pea flowers','peas'],['Boy or girl?','sex'],['Calico cats','cat']];let cur='peas';const tb=w.querySelector('#tb');
 const grid=(top,left,fn)=>`<table class="pn"><tr><th></th>${top.map(t=>`<th>${t}</th>`).join('')}</tr>${left.map(l=>`<tr><th>${l}</th>${top.map(t=>`<td>${fn(t,l)}</td>`).join('')}</tr>`).join('')}</table>`;
 const dot=c=>`<span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:${c};border:2px solid #fff6;vertical-align:middle"></span>`;
 let pa='Pp',pb='Pp',ma='XOXB',fa='XOY';
 const ch=(opts,cur,set)=>opts.map(o=>`<button class="chip ${o===cur?'on':''}" data-v="${o}">${o.replace(/X(.)/g,(m,c)=>'X<sup>'+c+'</sup>').replace('Y','Y')}</button>`).join('');
 const hook=(sel,fn)=>tb.querySelectorAll(sel+' .chip').forEach(b=>b.onclick=()=>{fn(b.dataset.v);show()});
 const show=()=>{w.querySelectorAll('#tabs .chip').forEach((b,i)=>b.classList.toggle('on',tabs[i][1]===cur));
  if(cur==='peas'){const gam=g=>[g[0],g[1]],kids=[];gam(pa).forEach(x=>gam(pb).forEach(y=>kids.push([x,y].sort().join(''))));const purple=k=>k.includes('P');const np=kids.filter(purple).length;
   tb.innerHTML=`<p>Mendel's peas: <b>P</b> = purple (dominant), <b>p</b> = white (recessive). Pick the parents' genes:</p><div class="row"><b>Parent 1</b><span id="p1">${['PP','Pp','pp'].map(o=>`<button class="chip ${o===pa?'on':''}" data-v="${o}">${o}</button>`).join('')}</span><b>Parent 2</b><span id="p2">${['PP','Pp','pp'].map(o=>`<button class="chip ${o===pb?'on':''}" data-v="${o}">${o}</button>`).join('')}</span></div>
   ${grid(gam(pb),gam(pa),(t,l)=>{const g=[l,t].sort().join('');return`${dot(purple(g)?'#a855f7':'#f8fafc')}<br>${g}`})}
   <p class="big" style="text-align:center">${np*25}% purple · ${100-np*25}% white</p><div class="row" style="justify-content:center"><button class="btn" id="pl">🌱 Plant 12 seeds</button></div><div id="sd" class="row" style="justify-content:center"></div>
   <p class="mini">A Pp plant is purple because P is dominant, but it still carries the hidden p. Many human traits are more complex than this: most involve several genes.</p>`;
   hook('#p1',v=>pa=v);hook('#p2',v=>pb=v);tb.querySelector('#pl').onclick=()=>{const sd=tb.querySelector('#sd');sd.innerHTML='';let c=0;for(let i=0;i<12;i++){const k=kids[Math.floor(Math.random()*4)];const p=purple(k);if(p)c++;sd.insertAdjacentHTML('beforeend',`<span class="pop" title="${k}">${dot(p?'#a855f7':'#f8fafc')}</span>`)}react(`${c} purple, ${12-c} white. Small samples vary, just like families!`,'happy')}}
  if(cur==='sex'){tb.innerHTML=`<p>Mom has <b>X X</b>. Dad has <b>X Y</b>. Mom can only give an X. Dad gives X or Y, so <b>dad's sperm decides the sex</b>.</p>${grid(['X','Y'].map(x=>x),['X','X'],(t,l)=>{const g=l+t;return`<span style="font-size:22px">${g==='XX'?'👧':'👦'}</span><br>${g}`})}<p class="big" style="text-align:center">50% XX (female) · 50% XY (male)</p><p class="mini">Every pregnancy starts with these odds. The SRY gene on the Y chromosome switches on male development.</p>`}
  if(cur==='cat'){const mom={XOXO:['XO','XO'],XBXB:['XB','XB'],XOXB:['XO','XB']}[ma],dad={XOY:['XO','Y'],XBY:['XB','Y']}[fa];
   const col=g=>{const O=g.includes('XO'),B=g.includes('XB');if(g.includes('Y'))return O?['#fb923c','Orange male']:['#1f2937','Black male'];return O&&B?['conic-gradient(#fb923c 0 33%,#1f2937 0 66%,#fb923c 0)','Tortoiseshell/calico female']:O?['#fb923c','Orange female']:['#1f2937','Black female']};
   const kids=[];mom.forEach(m=>dad.forEach(d=>kids.push((m+d).split(/(?=X)/).sort().join(''))));
   tb.innerHTML=`<p>The orange/black gene sits on the <b>X</b> chromosome: X<sup>O</sup> = orange, X<sup>B</sup> = black. Females (XX) can carry one of each. In each cell, one X is randomly switched off (<b>X-inactivation</b>), making a patchwork. Males (XY) have just one X, so they are one color.</p>
   <div class="row"><b>Mom</b><span id="m">${ch(['XOXO','XBXB','XOXB'],ma)}</span><b>Dad</b><span id="d">${ch(['XOY','XBY'],fa)}</span></div>
   ${grid(dad.map(x=>x),mom.map(x=>x),(t,l)=>{const g=[l,t].sort().join('').replace(/X(.)X(.)/,'X$1X$2');const c=col(g);return`<span style="display:inline-block;width:26px;height:26px;border-radius:50%;background:${c[0]};border:2px solid #fff6"></span><br><span style="font-size:11px;font-weight:400">${c[1]}</span>`})}
   <p class="mini">So a tortoiseshell or calico cat is almost always female. (Calico also has white patches from a different gene. Very rare XXY males can be calico.)</p>`;
   hook('#m',v=>ma=v);hook('#d',v=>fa=v)}};
 tabs.forEach(t=>{const b=el('button','chip',t[0]);b.onclick=()=>{cur=t[1];show();react('Try changing the parents!','think')};w.querySelector('#tabs').append(b)});show()}});

/* ===== Scene 11: Species ===== */
(function(){
const SP={
 human:{n:'Human',c:'46 (23 pairs)',sim:'99.9% identical to any other human',t:'≈ 3.1 billion letters per set. Variation in amylase (AMY1) copy number and in the lactase region help different populations digest starch and milk.',p:[-.1,1,.9],col:'#38bdf8'},
 chimp:{n:'Chimpanzee',c:'48 (24 pairs)',sim:'≈ 98–99% similar to human DNA',t:'Human chromosome 2 is a fusion of two ape chromosomes, which is why we have 46 and they have 48. FOXP2 (language-related) differs by 2 amino acids.',p:[-1.3,.9,-.3],col:'#f472b6'},
 mouse:{n:'Mouse',c:'40 (20 pairs)',sim:'most human genes have a mouse counterpart',t:'Scientists copy human gene changes into mice to study diseases, because many genes work the same way.',p:[-1.6,.5,-.8],col:'#a3a3a3'},
 dog:{n:'Dog',c:'78 (39 pairs)',sim:'many shared genes, 78 chromosomes!',t:'Dogs tend to have more copies of the AMY2B gene than wolves, helping them digest starch, a change that came with living near farmers.',p:[1,.4,-.9],col:'#fbbf24'},
 cat:{n:'Cat',c:'38 (19 pairs)',sim:'many shared genes',t:'The orange/black coat gene is on the X chromosome, so calico cats are almost always female (scene 10).',p:[1.7,.1,-.3],col:'#fb923c'},
 fly:{n:'Fruit fly',c:'8 (4 pairs)',sim:'roughly 60% of human genes have a fly counterpart (commonly cited)',t:'The PAX6 "master eye gene" is shared. Human PAX6 can trigger eye development in flies!',p:[-1.9,-.9,1],col:'#4ade80'},
 banana:{n:'Banana (wild)',c:'22 (11 pairs)',sim:'often-quoted ≈ 50% of genes have a human counterpart',t:'Genes for basic jobs like energy production and building proteins are shared across nearly all life.',p:[1.9,-1,.9],col:'#a3e635'}};
const E=[['root','fly'],['root','banana'],['root','mam'],['mam','mouse'],['mam','carn'],['carn','dog'],['carn','cat'],['mam','prim'],['prim','human'],['prim','chimp']];
const NP={root:[0,-1.3,0],mam:[0,-.3,0],carn:[1.3,.2,-.6],prim:[-.6,.2,.3]};
const pos=k=>SP[k]?SP[k].p:NP[k];
const LIST=[['Jack jumper ant (female)',2],['Fruit fly',8],['Cat',38],['Mouse',40],['Human',46],['Chimpanzee',48],['Dog',78],['Adder\'s-tongue fern',1260]];
SCENES.push({id:'s11',belt:2,mood:'happy',title:'Humans & Other Species',
html:`<p class="lead">All life uses DNA, so we can compare it. This 3D "family tree" shows how closely related some species are. Spin it and click an animal.</p>
<div class="grid"><div class="card">${mkCv()}</div><div class="card info" id="si"><h3>Pick a species</h3><p>Click a colored ball.</p></div></div>
<div class="card" style="margin-top:12px"><b>Chromosome number is not a smartness score</b><div id="cb"></div><p class="mini">Numbers are typical total chromosomes per body cell; the adder's-tongue fern figure is the highest reported for a plant.</p></div>`,
init(w){const si=w.querySelector('#si');let sel='human';
 const show=k=>{const s=SP[k];sel=k;si.innerHTML=`<h3 style="color:${s.col}">${s.n}</h3><p><b>Chromosomes:</b> ${s.c}</p><p><b>Compared with us:</b> ${s.sim}</p><p>${s.t}</p>`};show('human');
 w.querySelector('#cb').innerHTML=LIST.map(([n,v])=>`<div class="row" style="margin:3px 0"><span style="width:190px;font-size:13px">${n}</span><div class="bar" style="flex:1"><i style="width:${Math.max(1.5,Math.log10(v+1)/Math.log10(1261)*100)}%"></i></div><b style="width:48px">${v}</b></div>`).join('')+'<p class="mini">(bar lengths use a log scale)</p>';
 new S3(w.querySelector('canvas'),{yaw:.4,pitch:.2,auto:.005,onPick:k=>{if(SP[k]){show(k);react(SP[k].n+'!','happy')}},draw(S,t){E.forEach(([a,b])=>S.line(pos(a),pos(b),.04,'#6b8bd6',.8));
  Object.keys(NP).forEach(k=>S.sphere(NP[k],.07,'#94a3b8'));Object.keys(SP).forEach(k=>{S.sphere(pos(k),sel===k?.24:.18,SP[k].col,k);S.label([pos(k)[0],pos(k)[1]+.34,pos(k)[2]],SP[k].n,'#e8f1ff',12)});S.label([0,-1.65,0],'common ancestor',"#94a3b8",11)}})}});
})();

/* ===== Scene 12: Quiz + cheat sheet ===== */
SCENES.push({id:'s12',belt:2,mood:'happy',title:'Final Quiz & Cheat Sheet',
html:`<p class="lead">Score at least 6 / 8 to earn the rank of <b>DNA Master</b>.</p><div class="grid"><div class="card" id="qz"></div><div class="card info"><h3>Your cheat sheet</h3><pre class="cheat" id="ch"></pre><div class="row"><button class="btn" id="cp">📋 Copy cheat sheet</button><span class="mini" id="cm"></span></div></div></div>`,
init(w){const CH=`DNA CHEAT SHEET
• Cell → nucleus → chromosomes → DNA.
• Humans: 46 chromosomes = 23 pairs (22 autosome pairs + XX or XY).
• DNA: double helix, 2 nm wide, ~10.5 base pairs per turn.
• Backbone = sugar + phosphate. Rungs = base pairs: A–T (2 H-bonds), C–G (3 H-bonds).
• Replication is semi-conservative: each new DNA has 1 old + 1 new strand.
• Gene = stretch of DNA with instructions (usually for a protein). ~20,000 genes; ~1–2% of DNA codes for protein.
• Transcription: DNA → mRNA (T becomes U). Translation: mRNA codons (3 letters) → amino acids → protein.
• Mutations: silent (no change), missense (swap), nonsense (stop), frameshift (insert/delete).
• Alleles: one from each parent. Dominant hides recessive. Pp × Pp → 25% pp.
• Sex: XX female, XY male; Dad's sperm (X or Y) decides.
• Humans share ≈ 99.9% DNA with each other and ≈ 98–99% with chimps.`;
 w.querySelector('#ch').textContent=CH;w.querySelector('#cp').onclick=()=>{const done=()=>w.querySelector('#cm').textContent='Copied!';if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(CH).then(done,()=>w.querySelector('#cm').textContent='Select the text and copy it.');else{const r=document.createRange();r.selectNodeContents(w.querySelector('#ch'));getSelection().removeAllRanges();getSelection().addRange(r);w.querySelector('#cm').textContent='Selected: press Ctrl/Cmd+C'}};
 const Q=[{q:'Where is most of your DNA stored?',o:['Cell membrane','Nucleus','Blood plasma','Ribosome'],a:1,e:'The nucleus holds the chromosomes. (A little DNA is also in mitochondria.)'},
 {q:'How many chromosomes are in a typical human body cell?',o:['23','44','46','48'],a:2,e:'46 = 23 pairs. Chimps have 48.'},
 {q:'Which base pairs with C?',o:['A','T','G','U'],a:2,e:'C pairs with G (3 hydrogen bonds). A pairs with T.'},
 {q:'What is a gene?',o:['A whole chromosome','A stretch of DNA with instructions for a protein or RNA','A type of amino acid','A cell organelle'],a:1,e:'Genes are the recipes; chromosomes are the packed volumes.'},
 {q:'A codon is…',o:['Three bases that specify one amino acid','A kind of chromosome','A broken gene','A protein fold'],a:0,e:'e.g. GAG = Glu, GUG = Val.'},
 {q:'A mutation swaps one amino acid for another. This is called…',o:['Silent','Missense','Nonsense','Frameshift'],a:1,e:'Missense, like the sickle-cell change (Glu → Val).'},
 {q:'Two Pp pea plants are crossed. What fraction of offspring are white (pp)?',o:['0%','25%','50%','75%'],a:1,e:'Punnett square: PP, Pp, Pp, pp → 1 in 4.'},
 {q:'Which pair of sex chromosomes does a typical male have?',o:['XX','XY','YY','XO'],a:1,e:'XY. The Y brings the SRY gene.'}];
 quiz(w.querySelector('#qz'),Q,sc=>{const box=w.querySelector('#qz');const pass=sc>=6;box.innerHTML=`<p class="big">${sc} / ${Q.length}</p><p>${pass?'🏆 You are a <b>DNA Master</b>!':'So close. Review and try again; you need 6.'}</p>`;const b=el('button','btn',pass?'Replay quiz':'Try again');b.onclick=()=>go(11);box.append(b);
  if(pass){maxRank=3;setRankUI(3);toast('🏆 Rank: DNA Master!');bow();react('Master rank unlocked. Great work, scientist!','happy')}else react('Review the scenes and try again!','think')})}});
