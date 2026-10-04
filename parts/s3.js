/* ---------- tiny 3D engine (canvas 2D, depth sorted) ---------- */
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
