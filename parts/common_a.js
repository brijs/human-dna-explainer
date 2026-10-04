const $=(s,r=document)=>r.querySelector(s);
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const BC={A:'#4ade80',T:'#f87171',C:'#60a5fa',G:'#fbbf24',U:'#f472b6'};
const COMP={A:'T',T:'A',C:'G',G:'C'};
const LIVE=[];
let lastT=performance.now();
(function loop(now){const dt=Math.min((now-lastT)/1000,.1);lastT=now;for(const s of LIVE.slice())if(s.c.isConnected)s.tick(dt);requestAnimationFrame(loop)})(lastT);
