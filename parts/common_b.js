/* ---------- genetic code ---------- */
const CODE='FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG',ORD='TCAG';
const AAN={F:'Phe',L:'Leu',S:'Ser',Y:'Tyr','*':'Stop',C:'Cys',W:'Trp',P:'Pro',H:'His',Q:'Gln',R:'Arg',I:'Ile',M:'Met',T:'Thr',N:'Asn',K:'Lys',V:'Val',A:'Ala',D:'Asp',E:'Glu',G:'Gly'};
const AAC={};'AVILMFWGP'.split('').forEach(a=>AAC[a]='#fbbf24');'STCYNQ'.split('').forEach(a=>AAC[a]='#38bdf8');'KRH'.split('').forEach(a=>AAC[a]='#60a5fa');'DE'.split('').forEach(a=>AAC[a]='#f87171');AAC['*']='#94a3b8';
const codon2aa=c=>CODE[16*ORD.indexOf(c[0])+4*ORD.indexOf(c[1])+ORD.indexOf(c[2])];
function translate(dna){const out=[];for(let i=0;i+3<=dna.length;i+=3)out.push(codon2aa(dna.slice(i,i+3)));return out}
/* ---------- character ---------- */
const RANKS=window.MODULE_RANKS||['Cadet','Scientist','Researcher','Master'],RCOL=['#cd7f32','#4ade80','#60a5fa','#fbbf24'];
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
