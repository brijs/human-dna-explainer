const $=(s,r=document)=>r.querySelector(s);
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const BC={A:'#4ade80',T:'#f87171',C:'#60a5fa',G:'#fbbf24',U:'#f472b6'};
const COMP={A:'T',T:'A',C:'G',G:'C'};
/* ---------- tiny 3D engine (canvas 2D, depth sorted) ---------- */
const LIVE=[];
function hexRGB(h){const n=parseInt(h.slice(1),16);return[n>>16,n>>8&255,n&255]}
function shade(h,k){const[r,g,b]=hexRGB(h);const f=c=>clamp(Math.round(k>0?c+(255-c)*k:c*(1+k)),0,255);return`rgb(${f(r)},${f(g)},${f(b)})`}
const SPR={};
function sprite(col){if(SPR[col])return SPR[col];const c=document.createElement('canvas');c.width=c.height=96;const x=c.getContext('2d');
 const g=x.createRadialGradient(34,30,4,48,48,46);g.addColorStop(0,shade(col,.7));g.addColorStop(.35,col);g.addColorStop(1,shade(col,-.65));
 x.fillStyle=g;x.beginPath();x.arc(48,48,46,0,7);x.fill();return SPR[col]=c}
class S3{
 constructor(cv,o){this.c=cv;this.x=cv.getContext('2d');this.yaw=o.yaw??.6;this.pitch=o.pitch??.25;this.auto=REDUCED?0:(o.auto??.004);this.zoom=o.zoom||1;this.draw=o.draw;this.onPick=o.onPick;this.onHover=o.onHover;
  this.items=[];this.hits=[];this.t=0;this.alpha=1;this.drag=null;this.hover=null;this.w=300;this.h=300;
  this.resize();this.ro=new ResizeObserver(()=>this.resize());this.ro.observe(cv);
  cv.addEventListener('pointerdown',e=>{this.drag={x:e.clientX,y:e.clientY,m:0};cv.setPointerCapture(e.pointerId)});
  cv.addEventListener('pointermove',e=>{if(this.drag){const dx=e.clientX-this.drag.x,dy=e.clientY-this.drag.y;this.yaw+=dx*.01;this.pitch=clamp(this.pitch+dy*.01,-1.3,1.3);this.drag.m+=Math.abs(dx)+Math.abs(dy);this.drag.x=e.clientX;this.drag.y=e.clientY}
   else{const r=cv.getBoundingClientRect();const h=this.hit(e.clientX-r.left,e.clientY-r.top);this.hover=h;cv.style.cursor=h?'pointer':'grab';this.onHover&&this.onHover(h)}});
  cv.addEventListener('pointerup',e=>{const d=this.drag;this.drag=null;if(d&&d.m<6&&this.onPick){const r=cv.getBoundingClientRect();const h=this.hit(e.clientX-r.left,e.clientY-r.top);if(h)this.onPick(h.id,h)}});
  cv.addEventListener('wheel',e=>{if(e.ctrlKey||e.shiftKey){e.preventDefault();this.zoom=clamp(this.zoom*(e.deltaY>0?.92:1.08),.5,2.5)}},{passive:false});
  LIVE.push(this)}
 resize(){const d=Math.min(devicePixelRatio||1,2),r=this.c.getBoundingClientRect();this.w=r.width||300;this.h=r.height||300;this.c.width=this.w*d;this.c.height=this.h*d;this.x.setTransform(d,0,0,d,0,0)}
 destroy(){this.ro.disconnect();const i=LIVE.indexOf(this);if(i>=0)LIVE.splice(i,1)}
 P(x,y,z){const cy=Math.cos(this.yaw),sy=Math.sin(this.yaw);let X=x*cy+z*sy,Z=-x*sy+z*cy;const cp=Math.cos(this.pitch),sp=Math.sin(this.pitch);const Y=y*cp-Z*sp;Z=y*sp+Z*cp;
  const k=Math.min(this.w,this.h)*.27*this.zoom,f=5/(5+Z);return{x:this.w/2+X*k*f,y:this.h/2-Y*k*f,z:Z,f:f*k}}
 sphere(p,r,col,id,a){const q=this.P(p[0],p[1],p[2]);this.items.push({z:q.z,k:0,x:q.x,y:q.y,r:Math.max(.5,r*q.f),col,a:(a??1)*this.alpha});if(id)this.hits.push({x:q.x,y:q.y,r:Math.max(6,r*q.f),z:q.z,id})}
 line(p1,p2,w,col,a){const A=this.P(p1[0],p1[1],p1[2]),B=this.P(p2[0],p2[1],p2[2]);this.items.push({z:(A.z+B.z)/2,k:1,x:A.x,y:A.y,x2:B.x,y2:B.y,w:Math.max(.6,w*(A.f+B.f)/2),col,a:(a??1)*this.alpha})}
 label(p,t,col,size,a){const q=this.P(p[0],p[1],p[2]);this.items.push({z:q.z-.5,k:2,x:q.x,y:q.y,t,col:col||'#fff',s:size||13,a:(a??1)*this.alpha})}
 hit(mx,my){let b=null;for(const h of this.hits){if(Math.hypot(h.x-mx,h.y-my)<=h.r+3&&(!b||h.z<b.z))b=h}return b}
 tick(dt){if(!this.drag)this.yaw+=this.auto*dt*60;this.t+=dt;const x=this.x;x.clearRect(0,0,this.w,this.h);this.items=[];this.hits=[];this.alpha=1;this.draw&&this.draw(this,this.t);
  this.items.sort((a,b)=>b.z-a.z);
  for(const i of this.items){const dim=clamp(.8-i.z*.1,.4,1);x.globalAlpha=clamp(i.a*(i.k===0?dim:1),0,1);
   if(i.k===0){x.drawImage(sprite(i.col),i.x-i.r,i.y-i.r,i.r*2,i.r*2)}
   else if(i.k===1){x.strokeStyle=i.col;x.lineWidth=i.w;x.lineCap='round';x.beginPath();x.moveTo(i.x,i.y);x.lineTo(i.x2,i.y2);x.stroke()}
   else{x.fillStyle=i.col;x.font=`700 ${i.s}px system-ui,sans-serif`;x.textAlign='center';x.fillStyle='#04061acc';x.fillText(i.t,i.x+1,i.y+1);x.fillStyle=i.col;x.fillText(i.t,i.x,i.y)}}
  x.globalAlpha=1}
}
let lastT=performance.now();
(function loop(now){const dt=Math.min((now-lastT)/1000,.1);lastT=now;for(const s of LIVE.slice())if(s.c.isConnected)s.tick(dt);requestAnimationFrame(loop)})(lastT);
function mkCanvas(root,sel){const c=root.querySelector(sel||'canvas');return c}
/* generic helix. seq = string of ATCG; o: twist(0..1), R, rise, cx, ids, labels, unzip(0..1), fresh(0..1) */
function helix(S,seq,o={}){
 const n=seq.length,R=o.R??.5,rise=o.rise??.17,tw=o.twist??1,bpt=10.5,u=o.unzip||0,nf=o.fresh||0,sep=o.sep??1.3,cy=o.cy||0,ph=o.phase||0,al=o.a??1;
 const pts=[];
 for(let i=0;i<n;i++){
  const a=ph+i*2*Math.PI/bpt*tw,y=cy+(i-(n-1)/2)*rise,c=Math.cos(a)*R,s=Math.sin(a)*R;
  const b1=seq[i],b2=COMP[b1];
  const cx1=(o.cx||0)-u*sep,cx2=(o.cx||0)+u*sep;
  const p1=[cx1+c,y,s],p2=[cx2-c,y,-s];
  pts.push([p1,p2]);
  const m1=[cx1,y,0],m2=[cx2,y,0];
  if(!u){
   S.line(p1,m1,.07,BC[b1],al);S.line(m1,p2,.07,BC[b2],al);
   S.sphere([cx1,y,0],.075,'#e2e8f0',o.ids?'base':null,.0+al*.9);
   if(o.labels){S.label([cx1+c*.55,y-.02,s*.55],b1,'#04061a',11,al);S.label([cx1-c*.55,y-.02,-s*.55],b2,'#04061a',11,al)}
  }else{
   S.line(p1,m1,.07,BC[b1],al);S.line(p2,m2,.07,BC[b2],al);
   if(nf>0){const q1=[cx1-c,y,-s],q2=[cx2+c,y,s];
    S.line(q1,m1,.07,BC[b2],nf*al);S.line(q2,m2,.07,BC[b1],nf*al);
    S.sphere(q1,.1,'#a5b4fc',null,nf*al);S.sphere(q2,.1,'#a5b4fc',null,nf*al)}
  }
  S.sphere(p1,.1,'#38bdf8',o.ids?'backbone':null,al);S.sphere(p2,.1,'#a78bfa',o.ids?'backbone':null,al);
  if(i>0){const[pp1,pp2]=pts[i-1];S.line(pp1,p1,.06,'#38bdf8',al);S.line(pp2,p2,.06,'#a78bfa',al);}
 }
 if(u&&nf>0){for(let i=1;i<n;i++){const a0=ph+(i-1)*2*Math.PI/bpt*tw,a1=ph+i*2*Math.PI/bpt*tw;const y0=cy+(i-1-(n-1)/2)*rise,y1=cy+(i-(n-1)/2)*rise;
   const cx1=(o.cx||0)-u*sep,cx2=(o.cx||0)+u*sep;
   S.line([cx1-Math.cos(a0)*R,y0,-Math.sin(a0)*R],[cx1-Math.cos(a1)*R,y1,-Math.sin(a1)*R],.06,'#a5b4fc',nf*al);
   S.line([cx2+Math.cos(a0)*R,y0,Math.sin(a0)*R],[cx2+Math.cos(a1)*R,y1,Math.sin(a1)*R],.06,'#a5b4fc',nf*al)}}
}
function stars(S,n,seed,spread){const r=rng(seed||7);for(let i=0;i<n;i++){const p=[(r()-.5)*spread,(r()-.5)*spread*.8,(r()-.5)*spread];S.sphere(p,.025+r()*.03,['#22d3ee','#a78bfa','#f472b6'][i%3],null,.5)}}
function randSeq(n,seed){const r=rng(seed),L='ATCG';let s='';for(let i=0;i<n;i++)s+=L[Math.floor(r()*4)];return s}
/* ---------- genetic code ---------- */
const CODE='FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG',ORD='TCAG';
const AAN={F:'Phe',L:'Leu',S:'Ser',Y:'Tyr','*':'Stop',C:'Cys',W:'Trp',P:'Pro',H:'His',Q:'Gln',R:'Arg',I:'Ile',M:'Met',T:'Thr',N:'Asn',K:'Lys',V:'Val',A:'Ala',D:'Asp',E:'Glu',G:'Gly'};
const AAC={};'AVILMFWGP'.split('').forEach(a=>AAC[a]='#fbbf24');'STCYNQ'.split('').forEach(a=>AAC[a]='#38bdf8');'KRH'.split('').forEach(a=>AAC[a]='#60a5fa');'DE'.split('').forEach(a=>AAC[a]='#f87171');AAC['*']='#94a3b8';
const codon2aa=c=>CODE[16*ORD.indexOf(c[0])+4*ORD.indexOf(c[1])+ORD.indexOf(c[2])];
function translate(dna){const out=[];for(let i=0;i+3<=dna.length;i+=3)out.push(codon2aa(dna.slice(i,i+3)));return out}
/* ---------- character ---------- */
const RANKS=['Cadet','Scientist','Researcher','Master'],RCOL=['#cd7f32','#4ade80','#60a5fa','#fbbf24'];
$('#char').innerHTML=`<svg viewBox="0 0 120 150" id="bot"><g id="botall">
<line x1="60" y1="26" x2="60" y2="12" stroke="#64748b" stroke-width="3"/><circle id="tip" cx="60" cy="9" r="6" fill="#22d3ee"><animate attributeName="opacity" values="1;.4;1" dur="1.6s" repeatCount="indefinite"/></circle>
<polygon id="crown" points="38,26 44,12 52,22 60,8 68,22 76,12 82,26" fill="#fbbf24" stroke="#b45309" display="none"/>
<rect x="20" y="42" width="8" height="18" rx="3" fill="#475569"/><rect x="92" y="42" width="8" height="18" rx="3" fill="#475569"/>
<rect x="26" y="26" width="68" height="56" rx="18" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
<rect x="32" y="33" width="56" height="42" rx="13" fill="#0b1226"/>
<g class="eyes" id="eyes"><circle id="eL" cx="48" cy="50" r="7" fill="#22d3ee"/><circle id="eR" cx="72" cy="50" r="7" fill="#22d3ee"/></g>
<g id="happy" display="none" stroke="#22d3ee" stroke-width="4" fill="none" stroke-linecap="round"><path d="M41 53 Q48 43 55 53"/><path d="M65 53 Q72 43 79 53"/></g>
<g id="brows" display="none" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"><line x1="40" y1="38" x2="55" y2="41"/><line x1="80" y1="38" x2="65" y2="41"/></g>
<rect id="mouth" x="52" y="64" width="16" height="3" rx="2" fill="#22d3ee"/>
<rect x="38" y="86" width="44" height="42" rx="12" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
<circle id="badge" cx="60" cy="106" r="11" fill="#cd7f32" stroke="#fff" stroke-width="2"/><text id="badgeT" x="60" y="111" text-anchor="middle" font-size="14" font-weight="800" fill="#04061a">1</text>
<g id="armL"><rect x="24" y="90" width="12" height="30" rx="6" fill="#475569"/></g><g id="armR"><rect x="84" y="90" width="12" height="30" rx="6" fill="#475569"/></g>
<rect x="42" y="130" width="14" height="14" rx="4" fill="#475569"/><rect x="64" y="130" width="14" height="14" rx="4" fill="#475569"/>
</g></svg>`;
let mood='neutral';
function setMood(m){mood=m;$('#eyes').style.display=m==='happy'?'none':'';$('#happy').setAttribute('display',m==='happy'?'':'none');$('#brows').setAttribute('display',m==='alert'?'':'none');
 const t=m==='think'?{eL:4,eR:7,dy:-3}:m==='alert'?{eL:8,eR:8,dy:0}:{eL:7,eR:7,dy:0};$('#eL').setAttribute('r',t.eL);$('#eR').setAttribute('r',t.eR);$('#eyes').style.transform=`translateY(${t.dy}px)`}
let reactT;function react(txt,m){$('#react').textContent=txt;if(m){setMood(m);clearTimeout(reactT);reactT=setTimeout(()=>{$('#react').textContent='';setMood(SCENES[cur]?SCENES[cur].mood||'neutral':'neutral')},4200)}}
function setRankUI(r){$('#rank').textContent='Rank: '+RANKS[r];$('#badge').setAttribute('fill',RCOL[r]);$('#badgeT').textContent=r+1;$('#tip').setAttribute('fill',RCOL[r]);$('#crown').setAttribute('display',r===3?'':'none')}
setInterval(()=>{const e=$('#eyes');e.classList.add('blink');setTimeout(()=>e.classList.remove('blink'),160)},3200);
function bow(){const b=$('#botall');b.parentNode.classList.remove('bow');void b.offsetWidth;b.parentNode.classList.add('bow')}
$('#bot').style.transformOrigin='50% 100%';
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2600)}
/* ---------- narration ---------- */
const au=new Audio();au.preload='auto';let actx,analyser,gain,lip,wired=false;
let soundOn=false,muted=false,auto=false,cur=-1,maxRank=0,paused=false;
let words=[],thr=[],sim=null,speaking=false;
function wireAudio(){if(wired)return;wired=true;try{actx=new(window.AudioContext||window.webkitAudioContext)();const s=actx.createMediaElementSource(au);analyser=actx.createAnalyser();analyser.fftSize=512;lip=new Uint8Array(analyser.fftSize);gain=actx.createGain();s.connect(analyser);s.connect(gain);gain.connect(actx.destination)}catch(e){analyser=null}}
function setCaption(txt){const c=$('#capText');c.innerHTML='';words=txt.split(/\s+/).map(w=>{const s=el('span','w',w+' ');s.className='w';c.append(s);return s});let tot=0;const L=words.map(w=>w.textContent.length);L.forEach(l=>tot+=l);let acc=0;thr=L.map(l=>{acc+=l;return acc/tot})}
function light(f){words.forEach((w,i)=>w.classList.toggle('on',thr[i]<=f+.001))}
function narrDone(){speaking=false;light(1);$('#nextBtn').classList.add('pulse');if(auto&&!paused)setTimeout(()=>{if(!speaking&&auto)go(cur+1)},1600)}
function startNarr(){const id=SCENES[cur].id;setCaption(NARR[id]);$('#nextBtn').classList.remove('pulse');paused=false;$('#stopBtn').textContent='⏸ Pause';sim=null;
 if(soundOn&&AUDIO[id]){wireAudio();if(actx&&actx.state==='suspended')actx.resume();au.src=AUDIO[id];au.currentTime=0;speaking=true;au.play().catch(()=>{speaking=false;simStart()})}
 else simStart()}
function simStart(){speaking=true;sim={t0:performance.now(),dur:NARR[SCENES[cur].id].split(/\s+/).length*360}}
au.onended=()=>{if(soundOn)narrDone()};
function capLoop(){if(speaking&&!paused){let f=0;if(sim){f=(performance.now()-sim.t0)/sim.dur;if(f>=1){narrDone()}}else if(au.duration){f=au.currentTime/au.duration}light(f)}
 let h=3;if(speaking&&!paused){let v=0;if(!sim&&analyser){analyser.getByteTimeDomainData(lip);let s=0;for(const b of lip){const d=(b-128)/128;s+=d*d}v=Math.sqrt(s/lip.length)*40}else v=(Math.sin(performance.now()/90)+1)*.5*8;h=3+clamp(v,0,11)}
 const m=$('#mouth');m.setAttribute('height',h);m.setAttribute('y',66-h/2);requestAnimationFrame(capLoop)}
capLoop();
/* ---------- scenes / nav ---------- */
const SCENES=[];
function destroyLive(){while(LIVE.length)LIVE.pop().destroy();document.querySelectorAll('.tmr').forEach(()=>0);(window.TIMERS||[]).forEach(clearInterval);window.TIMERS=[]}
function go(i){if(i<0||i>=SCENES.length)return;destroyLive();cur=i;const sc=SCENES[i];const st=$('#stage');st.innerHTML='';
 const w=el('div','sc',`<div class="kick">Scene ${i+1} of ${SCENES.length} · ${RANKS[sc.belt]} level</div><h2>${sc.title}</h2>`+sc.html);st.append(w);window.scrollTo(0,0);
 if(sc.belt>maxRank){maxRank=sc.belt;setRankUI(maxRank);toast('⭐ Level up! You are now a '+RANKS[maxRank]);bow()}
 document.querySelectorAll('#dots button').forEach((b,j)=>{b.classList.toggle('cur',j===i);if(j<i)b.classList.add('done')});
 setMood(sc.mood||'neutral');$('#react').textContent='';$('#backBtn').disabled=i===0;$('#nextBtn').disabled=i===SCENES.length-1;
 try{sc.init&&sc.init(w)}catch(e){console.error('scene init',sc.id,e);throw e}
 startNarr()}
function buildDots(){const d=$('#dots');SCENES.forEach((s,i)=>{const b=el('button');b.setAttribute('aria-label','Go to scene '+(i+1)+': '+s.title);b.title=s.title;b.onclick=()=>go(i);d.append(b)})}
$('#nextBtn').onclick=()=>go(cur+1);$('#backBtn').onclick=()=>go(cur-1);$('#replayBtn').onclick=()=>{startNarr()};
$('#stopBtn').onclick=()=>{if(!speaking&&!paused)return;paused=!paused;$('#stopBtn').textContent=paused?'▶ Resume':'⏸ Pause';if(soundOn&&!sim){paused?au.pause():au.play()}else if(sim){if(paused)sim.p=performance.now();else sim.t0+=performance.now()-sim.p}};
$('#tgSound').onclick=e=>{muted=!muted;e.currentTarget.setAttribute('aria-pressed',!muted);e.currentTarget.textContent=muted?'🔇 Muted':'🔊 Sound';if(gain)gain.gain.value=muted?0:1;if(!soundOn&&!muted){soundOn=true;wireAudio();startNarr()}};
$('#tgAuto').onclick=e=>{auto=!auto;e.currentTarget.setAttribute('aria-pressed',auto)};
$('#tgFx').onclick=e=>{const on=document.body.classList.toggle('fx');e.currentTarget.setAttribute('aria-pressed',on)};
function enter(snd){soundOn=snd;muted=!snd;$('#tgSound').setAttribute('aria-pressed',snd);$('#tgSound').textContent=snd?'🔊 Sound':'🔇 Muted';if(snd)wireAudio();$('#intro').style.display='none';buildDots();setRankUI(0);go(0)}
$('#enterSound').onclick=()=>enter(true);$('#enterSilent').onclick=()=>enter(false);
document.addEventListener('keydown',e=>{if($('#intro').style.display!=='none')return;const sc=SCENES[cur];if(sc&&sc.onKey&&sc.onKey(e))return;if(/INPUT|TEXTAREA/.test(e.target.tagName))return;if(sc&&sc.captureArrows)return;if(e.key==='ArrowRight')go(cur+1);if(e.key==='ArrowLeft')go(cur-1)});
/* ---------- widgets ---------- */
function quiz(root,qs,onDone){let i=0,score=0;const box=root;
 const show=()=>{if(i>=qs.length){onDone(score);return}const q=qs[i];box.innerHTML=`<div class="mini">Question ${i+1} of ${qs.length} · score ${score}</div><p class="big" style="font-size:19px">${q.q}</p>`;
  q.o.forEach((t,j)=>{const b=el('button','opt',t);b.onclick=()=>{box.querySelectorAll('.opt').forEach((x,k)=>{x.disabled=true;if(k===q.a)x.classList.add('right');else if(k===j)x.classList.add('wrong')});
   const ok=j===q.a;if(ok)score++;react(ok?'Correct!':'Not quite.',ok?'happy':'alert');const ex=el('p',ok?'ok':'no',(ok?'✔ ':'✘ ')+q.e);const nx=el('button','btn','Next question ▶');nx.onclick=()=>{i++;show()};box.append(ex,nx)};box.append(b)})};
 show()}
const mkCv=(h)=>`<canvas class="cv" ${h?`style="height:${h}"`:''}></canvas>`;
