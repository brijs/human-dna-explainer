/* ===== three.js helpers: Stage, labels, tween, sticks, cartoon ProteinView ===== */
const T=window.THREE;
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
function makeLabel(text,color,size,bg){const c=document.createElement('canvas'),x=c.getContext('2d'),f=48;x.font=`700 ${f}px system-ui,sans-serif`;const w=Math.ceil(x.measureText(text).width)+24;c.width=w;c.height=f+20;
 x.font=`700 ${f}px system-ui,sans-serif`;x.textBaseline='middle';if(bg){x.fillStyle=bg;x.beginPath();x.roundRect(0,0,w,f+20,16);x.fill()}
 x.lineWidth=8;x.strokeStyle='rgba(4,6,26,.9)';x.strokeText(text,12,(f+20)/2+2);x.fillStyle=color||'#e8f1ff';x.fillText(text,12,(f+20)/2+2);
 const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const m=new T.SpriteMaterial({map:tex,transparent:true,depthTest:false});const s=new T.Sprite(m);s.scale.set(size*w/(f+20),size,1);s.renderOrder=10;s.userData.label=true;return s}
class Stage{
 constructor(cv,o={}){this.c=cv;this.t=0;this.up=[];this.tw=[];this.pick=[];this.dragM=0;this.onPick=o.onPick;this.onHover=o.onHover;this.o=o;
  try{this.r=new T.WebGLRenderer({canvas:cv,antialias:true})}catch(e){this.fail=true;cv.insertAdjacentHTML('afterend','<div class="card">WebGL is not available in this browser, so the 3D view cannot be shown.</div>');return}
  this.r.setPixelRatio(Math.min(devicePixelRatio||1,2));this.r.setClearColor(o.bg??0x060b26,1);
  this.scene=new T.Scene();this.cam=new T.PerspectiveCamera(o.fov||45,1,.1,o.far||3000);const p=o.pos||[0,0,60];this.cam.position.set(p[0],p[1],p[2]);
  this.ctl=new OrbitControls(this.cam,cv);this.ctl.enableDamping=true;this.ctl.dampingFactor=.08;this.ctl.screenSpacePanning=true;this.ctl.minDistance=o.minD||2;this.ctl.maxDistance=o.maxD||600;
  this.ctl.autoRotate=!REDUCED&&o.auto!==0;this.ctl.autoRotateSpeed=o.auto??.8;if(o.target)this.ctl.target.set(...o.target);
  this.hemi=new T.HemisphereLight(0xcfe3ff,0x1a2a66,1.15);this.scene.add(this.hemi);this.dir=new T.DirectionalLight(0xffffff,1.6);this.scene.add(this.dir);this.scene.add(this.dir.target);
  this.ray=new T.Raycaster();this.mv=new T.Vector2();
  cv.addEventListener('pointerdown',e=>{this.down={x:e.clientX,y:e.clientY};this.ctl.autoRotate=false});
  cv.addEventListener('pointerup',e=>{if(this.down&&Math.hypot(e.clientX-this.down.x,e.clientY-this.down.y)<5)this.doPick(e,true);this.down=null});
  cv.addEventListener('pointermove',e=>{if(!this.down&&this.onHover&&(this.hv=(this.hv||0)+1)%3===0)this.doPick(e,false)});
  this.resize();this.ro=new ResizeObserver(()=>this.resize());this.ro.observe(cv);LIVE.push(this)}
 resize(){const r=this.c.getBoundingClientRect(),w=Math.max(10,r.width),h=Math.max(10,r.height);this.r.setSize(w,h,false);this.cam.aspect=w/h;this.cam.updateProjectionMatrix();this.w=w;this.h=h}
 add(o,pickable){this.scene.add(o);if(pickable)this.pick.push(o);return o}
 doPick(e,click){const r=this.c.getBoundingClientRect();this.mv.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);this.ray.setFromCamera(this.mv,this.cam);
  const hits=this.ray.intersectObjects(this.pick,false);const h=hits[0]||null;if(click){this.onPick&&this.onPick(h)}else{this.c.style.cursor=h?'pointer':'grab';this.onHover&&this.onHover(h)}}
 tween(dur,fn,done){this.tw.push({t:0,d:dur,fn,done})}
 focus(target,dist,dur=.8){const c=this.ctl,s=c.target.clone(),e=new T.Vector3(...target),dir=this.cam.position.clone().sub(c.target).normalize(),d0=this.cam.position.distanceTo(c.target),sp=this.cam.position.clone();
  this.tween(dur,k=>{k=ease(k);c.target.lerpVectors(s,e,k);this.cam.position.copy(c.target).addScaledVector(dir,lerp(d0,dist,k))})}
 tick(dt){this.t+=dt;for(const u of this.up)u(dt,this.t);for(let i=this.tw.length-1;i>=0;i--){const w=this.tw[i];w.t+=dt;const k=Math.min(1,w.t/w.d);w.fn(k);if(k>=1){this.tw.splice(i,1);w.done&&w.done()}}
  this.ctl.update();this.dir.position.copy(this.cam.position).add(new T.Vector3(10,20,10));this.dir.target.position.copy(this.ctl.target);this.r.render(this.scene,this.cam)}
 destroy(){if(!this.r)return;this.ro.disconnect();this.ctl.dispose();this.scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){(o.material.map)&&o.material.map.dispose();o.material.dispose()}});this.r.dispose();this.r.forceContextLoss();const i=LIVE.indexOf(this);if(i>=0)LIVE.splice(i,1)}
}
/* a Stage whose canvas lives in `root`; returns null (and shows fallback) if WebGL fails */
function mkStage(root,o){const cv=root.querySelector('canvas');const s=new Stage(cv,o);return s.fail?null:s}
/* ---------- residue data ---------- */
const AA3={ALA:'A',ARG:'R',ASN:'N',ASP:'D',CYS:'C',GLN:'Q',GLU:'E',GLY:'G',HIS:'H',ILE:'I',LEU:'L',LYS:'K',MET:'M',PHE:'F',PRO:'P',SER:'S',THR:'T',TRP:'W',TYR:'Y',VAL:'V'};
const AAFULL={A:'Alanine',R:'Arginine',N:'Asparagine',D:'Aspartate',C:'Cysteine',Q:'Glutamine',E:'Glutamate',G:'Glycine',H:'Histidine',I:'Isoleucine',L:'Leucine',K:'Lysine',M:'Methionine',F:'Phenylalanine',P:'Proline',S:'Serine',T:'Threonine',W:'Tryptophan',Y:'Tyrosine',V:'Valine'};
const KD={I:4.5,V:4.2,L:3.8,F:2.8,C:2.5,M:1.9,A:1.8,G:-.4,T:-.7,S:-.8,W:-.9,Y:-1.3,P:-1.6,H:-3.2,E:-3.5,Q:-3.5,D:-3.5,N:-3.5,K:-3.9,R:-4.5};
const VOL={G:60.1,A:88.6,S:89,C:108.5,D:111.1,P:112.7,N:114.1,T:116.1,E:138.4,V:140,Q:143.8,H:153.2,M:162.9,I:166.7,L:166.7,K:168.6,R:173.4,F:189.9,Y:193.6,W:227.8};
const GROUP={A:'hydrophobic',V:'hydrophobic',I:'hydrophobic',L:'hydrophobic',M:'hydrophobic',F:'hydrophobic',W:'hydrophobic',P:'special',G:'special',C:'special',S:'polar',T:'polar',N:'polar',Q:'polar',Y:'polar',K:'positive',R:'positive',H:'positive',D:'negative',E:'negative'};
const GCOL={hydrophobic:'#fbbf24',polar:'#38bdf8',positive:'#6366f1',negative:'#f87171',special:'#a3e635'};
const SSC={H:'#f472b6',E:'#fbbf24',C:'#7dd3fc'};
const CHC=['#22d3ee','#f472b6','#a3e635','#fbbf24','#a78bfa','#fb923c'];
const col3=h=>{const c=new T.Color(h);return[c.r,c.g,c.b]};
function plddtColor(b){return b>90?'#0053d6':b>70?'#65cbf3':b>50?'#ffdb13':'#ff7d45'}
function kdColor(k){const t=(k+4.5)/9;const a=new T.Color('#3b82f6'),b=new T.Color('#e5e7eb'),c=new T.Color('#f59e0b');return t<.5?a.clone().lerp(b,t*2):b.clone().lerp(c,(t-.5)*2)}
/* ---------- sticks (ball & stick via instancing) ---------- */
const ELC={C:'#9ca3af',N:'#3b82f6',O:'#ef4444',S:'#facc15',FE:'#f97316',ZN:'#94a3b8',P:'#fb923c'};
class Sticks{
 constructor(cap=1500,rs=.32,rb=.13){this.cap=cap;this.rs=rs;this.rb=rb;this.g=new T.Group();const m=new T.MeshStandardMaterial({roughness:.4,metalness:.1});
  this.sph=new T.InstancedMesh(new T.SphereGeometry(1,12,8),m,cap);this.cyl=new T.InstancedMesh(new T.CylinderGeometry(1,1,1,8,1),m,cap*2);this.sph.frustumCulled=this.cyl.frustumCulled=false;this.sph.count=this.cyl.count=0;this.g.add(this.sph,this.cyl);this.M=new T.Matrix4();this.Q=new T.Quaternion();this.UP=new T.Vector3(0,1,0)}
 /* atoms: {x,y,z,c:'#hex',e:'C'} */
 set(atoms,scale=1){const n=Math.min(atoms.length,this.cap);this.sph.count=n;const P=new T.Vector3(),S=new T.Vector3(),col=new T.Color();
  for(let i=0;i<n;i++){const a=atoms[i];P.set(a.x,a.y,a.z);S.setScalar(this.rs*scale);this.M.compose(P,this.Q.identity(),S);this.sph.setMatrixAt(i,this.M);this.sph.setColorAt(i,col.set(a.c))}
  let k=0;const d=new T.Vector3();for(let i=0;i<n&&k<this.cap*2-1;i++){const a=atoms[i];for(let j=i+1;j<n;j++){const b=atoms[j];const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;if(dx>2.4||dx<-2.4)continue;const L=Math.hypot(dx,dy,dz);const cut=(a.e==='S'||b.e==='S'||a.e==='FE'||b.e==='FE')?2.4:1.95;if(L>cut||L<.4)continue;
    d.set(dx,dy,dz).normalize();this.Q.setFromUnitVectors(this.UP,d);for(const [s,o] of [[a,.25],[b,.75]]){P.set(a.x+dx*o,a.y+dy*o,a.z+dz*o);S.set(this.rb*scale,L/2,this.rb*scale);this.M.compose(P,this.Q,S);this.cyl.setMatrixAt(k,this.M);this.cyl.setColorAt(k,col.set(s.c));k++}}}
  this.cyl.count=k;this.sph.instanceMatrix.needsUpdate=this.cyl.instanceMatrix.needsUpdate=true;if(this.sph.instanceColor)this.sph.instanceColor.needsUpdate=true;if(this.cyl.instanceColor)this.cyl.instanceColor.needsUpdate=true}
}
/* ---------- cartoon ribbon ---------- */
function ribbonGeometry(P,ss,colors,sub=5,ring=10){
 const n=P.length;if(n<2)return null;const pts=P.map(p=>new T.Vector3(p[0],p[1],p[2]));const cur=new T.CatmullRomCurve3(pts,false,'catmullrom',.5);
 const S=(n-1)*sub+1,pos=[],tan=[];for(let k=0;k<S;k++)pos.push(cur.getPoint(k/(S-1)));
 for(let k=0;k<S;k++){const a=pos[Math.max(0,k-1)],b=pos[Math.min(S-1,k+1)];tan.push(b.clone().sub(a).normalize())}
 const ssAt=r=>ss[Math.max(0,Math.min(n-1,r))];
 const prof=k=>{const f=k/sub,r0=Math.floor(f),r1=Math.min(n-1,r0+1),t=f-r0;const g=r=>{const s=ssAt(r);return s==='H'?[1.25,.2]:s==='E'?[1.05,.22]:[.27,.27]};const a=g(r0),b=g(r1);let w=lerp(a[0],b[0],t),h=lerp(a[1],b[1],t);
  /* arrow head at end of a strand run */ const rr=Math.round(f);if(ssAt(rr)==='E'&&ssAt(rr+1)!=='E'&&rr>0&&ssAt(rr-1)==='E'){const u=f-(rr-.5);if(u>0&&u<=.5)w=lerp(1.9,.3,u*2);else if(u<=0)w=Math.max(w,1.05)}
  return[w,h]};
 const V=[],N=[],C=[],I=[],vr=[];let Np=new T.Vector3(0,1,0).cross(tan[0]);if(Np.lengthSq()<.01)Np.set(1,0,0);Np.normalize();const tmp=new T.Vector3();
 for(let k=0;k<S;k++){const Tn=tan[k];Np.addScaledVector(Tn,-Np.dot(Tn,Np)).normalize();let Nk=Np.clone();const rs=Math.min(n-1,Math.round(k/sub));
  if(ssAt(rs)==='H'){tmp.set(0,0,0);for(let q=Math.max(1,k-2);q<=Math.min(S-2,k+2);q++)tmp.add(pos[q-1]).addScaledVector(pos[q],-2).add(pos[q+1]);tmp.addScaledVector(Tn,-tmp.dot(Tn));if(tmp.lengthSq()>1e-4){Nk=tmp.clone().normalize()}}
  Np.copy(Nk);const W=Tn.clone().cross(Nk).normalize(),[hw,ht]=prof(k);const col=colors[rs]||[1,1,1];
  for(let j=0;j<ring;j++){const a=j/ring*Math.PI*2,ca=Math.cos(a),sa=Math.sin(a);V.push(pos[k].x+W.x*ca*hw+Nk.x*sa*ht,pos[k].y+W.y*ca*hw+Nk.y*sa*ht,pos[k].z+W.z*ca*hw+Nk.z*sa*ht);
   const nx=W.x*ca/hw+Nk.x*sa/ht,ny=W.y*ca/hw+Nk.y*sa/ht,nz=W.z*ca/hw+Nk.z*sa/ht,l=Math.hypot(nx,ny,nz)||1;N.push(nx/l,ny/l,nz/l);C.push(col[0],col[1],col[2]);vr.push(rs)}}
 for(let k=0;k<S-1;k++)for(let j=0;j<ring;j++){const a=k*ring+j,b=k*ring+(j+1)%ring,c=(k+1)*ring+j,d=(k+1)*ring+(j+1)%ring;I.push(a,c,b,b,c,d)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(V,3));g.setAttribute('normal',new T.Float32BufferAttribute(N,3));g.setAttribute('color',new T.Float32BufferAttribute(C,3));g.setIndex(I);g.userData.vr=vr;return g}
const RMAT=()=>new T.MeshStandardMaterial({vertexColors:true,roughness:.42,metalness:.05,side:T.DoubleSide});
/* ---------- ProteinView ---------- */
class ProteinView{
 constructor(stage,struct,o={}){this.st=stage;this.S=struct;this.ids=o.chains||Object.keys(struct.ch);this.mode=o.mode||'ss';this.fold=1;this.group=new T.Group();stage.scene.add(this.group);this.sub=o.sub||5;this.hetOn=true;
  this.chains=this.ids.map((id,ci)=>{const res=struct.ch[id].map(r=>({n:r[0],name:r[1],aa:AA3[r[1]]||'X',ss:r[2],b:r[3],atoms:r[4]}));const ca=res.map(r=>{const a=r.atoms.find(x=>x[0]==='CA');return a?[a[1],a[2],a[3]]:null});const keep=res.map((r,i)=>i).filter(i=>ca[i]);return{id,ci,res:keep.map(i=>res[i]),nat:keep.map(i=>ca[i]),mesh:null}});
  const all=this.chains.flatMap(c=>c.nat);this.center=all.reduce((a,p)=>[a[0]+p[0]/all.length,a[1]+p[1]/all.length,a[2]+p[2]/all.length],[0,0,0]);
  this.radius=Math.sqrt(Math.max(...all.map(p=>(p[0]-this.center[0])**2+(p[1]-this.center[1])**2+(p[2]-this.center[2])**2)));
  this.chains.forEach(c=>{{const per=Math.ceil(Math.sqrt(c.nat.length*.55)*2.2),rows=Math.ceil(c.nat.length/per);c.ext=c.nat.map((p,i)=>{const r=Math.floor(i/per),k=i%per,col=r%2?per-1-k:k;return[this.center[0]+(col-per/2)*3.3,this.center[1]-(r-rows/2)*7+(i%2)*1.1,this.center[2]+(c.ci-(this.chains.length-1)/2)*14]})}c.cur=c.nat.map(p=>p.slice())});
  this.sticks=new Sticks(1400);this.sticks.g.visible=false;this.group.add(this.sticks.g);this.hetBy={};this.buildHet();
  this.sel=null;this.selMesh=new T.Mesh(new T.SphereGeometry(1,16,12),new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.0}));this.group.add(this.selMesh);this.lodOn=o.lod!==false;this.lodKey='';this.rebuild()}
 buildHet(){const by={};for(const h of this.S.het){const atoms=by[h[1]]||(by[h[1]]=[]);for(const a of h[3]){const e=a[0].replace(/[0-9]/g,'').slice(0,2).toUpperCase();const el=(e==='FE'||e==='ZN')?e:e[0];atoms.push({x:a[1],y:a[2],z:a[3],e:el,c:h[0]==='MK1'?(el==='C'?'#a3e635':ELC[el]||'#ccc'):(ELC[el]||'#ccc')})}}
  for(const k in by){const s=new Sticks(300,.35,.14);s.set(by[k]);s.g.visible=false;this.group.add(s.g);this.hetBy[k]=s}}
 showChains(ids){this.chains.forEach(c=>{c.hidden=!ids.includes(c.id);if(c.mesh)c.mesh.visible=!c.hidden});this.lodKey='';this.syncHet()}
 syncHet(){for(const k in this.hetBy)this.hetBy[k].g.visible=this.hetOn&&this.fold>.98&&!(this.chains.find(c=>c.id===k)||{}).hidden}
 colorOf(c,i){const r=c.res[i],m=this.mode;let h;
  if(m==='ss')h=SSC[r.ss];else if(m==='hydro')return(c.col2||(c.col2=[]),(c.col2[i]||(c.col2[i]=kdColor(KD[r.aa]??0).toArray())));else if(m==='charge')h='KRH'.includes(r.aa)?(r.aa==='H'?'#93c5fd':'#3b82f6'):'DE'.includes(r.aa)?'#ef4444':'#cbd5e1';
  else if(m==='chain')h=CHC[c.ci%6];else if(m==='plddt')h=plddtColor(r.b);else if(m==='aa')h=GCOL[GROUP[r.aa]||'special'];else if(m==='rainbow')return new T.Color().setHSL(.75-i/c.res.length*.75,.8,.55).toArray();else h='#ccc';
  if(this.sel&&this.sel.c===c.id&&this.sel.i===i)return[1,1,1];return col3(h)}
 colors(c){return c.res.map((r,i)=>this.colorOf(c,i))}
 setMode(m){this.mode=m;this.rebuild()}
 setFold(t){this.fold=t;const k=ease(clamp(t,0,1));for(const c of this.chains)c.cur=c.nat.map((p,i)=>[lerp(c.ext[i][0],p[0],k),lerp(c.ext[i][1],p[1],k),lerp(c.ext[i][2],p[2],k)]);this.rebuild();this.syncHet();this.lodKey=''}
 rebuild(){for(const c of this.chains){const g=ribbonGeometry(c.cur,c.res.map(r=>(this.fold<.5?(this.fold<.15?'C':r.ss):r.ss)),this.colors(c),this.sub);if(!g)continue;if(c.mesh){c.mesh.geometry.dispose();c.mesh.geometry=g}else{c.mesh=new T.Mesh(g,RMAT());c.mesh.visible=!c.hidden;c.mesh.userData.chain=c;c.mesh.userData.pv=this;this.group.add(c.mesh);this.st.pick.push(c.mesh)}}}
 resOf(hit){if(!hit||!hit.object.userData.chain||hit.object.userData.pv!==this||!this.group.visible)return null;const c=hit.object.userData.chain,v=c.mesh.geometry.userData.vr[c.mesh.geometry.index.array[hit.faceIndex*3]];return{c,i:v,r:c.res[v]}}
 select(sel){this.sel=sel?{c:sel.c.id,i:sel.i}:null;this.rebuild();this.lodKey=''}
 update(){ if(!this.lodOn||this.fold<.98){this.sticks.g.visible=false;return}
  const tg=this.st.ctl.target,d=this.st.cam.position.distanceTo(tg);const on=d<42;this.sticks.g.visible=on;
  for(const c of this.chains)c.mesh.material.opacity=1,c.mesh.material.transparent=false;if(on){for(const c of this.chains){c.mesh.material.transparent=true;c.mesh.material.opacity=clamp((d-8)/34,.18,1)}}
  if(!on)return;const R=clamp(d*.55,6,16),key=[Math.round(tg.x/2),Math.round(tg.y/2),Math.round(tg.z/2),Math.round(R)].join();if(key===this.lodKey)return;this.lodKey=key;
  const atoms=[];for(const c of this.chains){if(c.hidden)continue;c.res.forEach((r,i)=>{const p=c.nat[i];if(Math.hypot(p[0]-tg.x,p[1]-tg.y,p[2]-tg.z)>R)return;const rc=this.colorOf(c,i),hex='#'+new T.Color(rc[0],rc[1],rc[2]).getHexString();for(const a of r.atoms){const e=a[0][0];atoms.push({x:a[1],y:a[2],z:a[3],e,c:e==='C'?hex:(ELC[e]||'#ccc')})}})}
  this.sticks.set(atoms);this.nAtoms=Math.min(atoms.length,1400)}
}
function fitCamera(st,pv,k=2.6){const c=pv.center;st.ctl.target.set(c[0],c[1],c[2]);st.cam.position.set(c[0]+pv.radius*.3,c[1]+pv.radius*.3,c[2]+pv.radius*k);st.ctl.update()}
/* Kabsch superposition (Horn quaternion method with Jacobi eigen solve): returns function mapping points of B onto A */
function superpose(A,B){const n=A.length,ca=[0,0,0],cb=[0,0,0];for(let i=0;i<n;i++)for(let k=0;k<3;k++){ca[k]+=A[i][k]/n;cb[k]+=B[i][k]/n}
 const S=[[0,0,0],[0,0,0],[0,0,0]];for(let i=0;i<n;i++)for(let a=0;a<3;a++)for(let b=0;b<3;b++)S[a][b]+=(B[i][a]-cb[a])*(A[i][b]-ca[b]);
 const[[xx,xy,xz],[yx,yy,yz],[zx,zy,zz]]=S;const Nm=[[xx+yy+zz,yz-zy,zx-xz,xy-yx],[yz-zy,xx-yy-zz,xy+yx,zx+xz],[zx-xz,xy+yx,-xx+yy-zz,yz+zy],[xy-yx,zx+xz,yz+zy,-xx-yy+zz]];
 /* Jacobi */ const V=[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]],M=Nm.map(r=>r.slice());for(let it=0;it<60;it++){let p=0,q=1,mx=0;for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)if(Math.abs(M[i][j])>mx){mx=Math.abs(M[i][j]);p=i;q=j}if(mx<1e-12)break;const th=(M[q][q]-M[p][p])/(2*M[p][q]),t=Math.sign(th||1)/(Math.abs(th)+Math.sqrt(th*th+1)),c=1/Math.sqrt(t*t+1),s=t*c;
  for(let k=0;k<4;k++){const a=M[k][p],b=M[k][q];M[k][p]=c*a-s*b;M[k][q]=s*a+c*b}for(let k=0;k<4;k++){const a=M[p][k],b=M[q][k];M[p][k]=c*a-s*b;M[q][k]=s*a+c*b}for(let k=0;k<4;k++){const a=V[k][p],b=V[k][q];V[k][p]=c*a-s*b;V[k][q]=s*a+c*b}}
 let bi=0;for(let i=1;i<4;i++)if(M[i][i]>M[bi][bi])bi=i;const q=[V[0][bi],V[1][bi],V[2][bi],V[3][bi]];const[w,x,y,z]=q;
 const R=[[w*w+x*x-y*y-z*z,2*(x*y-w*z),2*(x*z+w*y)],[2*(x*y+w*z),w*w-x*x+y*y-z*z,2*(y*z-w*x)],[2*(x*z-w*y),2*(y*z+w*x),w*w-x*x-y*y+z*z]];
 return p=>{const d=[p[0]-cb[0],p[1]-cb[1],p[2]-cb[2]];return[R[0][0]*d[0]+R[0][1]*d[1]+R[0][2]*d[2]+ca[0],R[1][0]*d[0]+R[1][1]*d[1]+R[1][2]*d[2]+ca[1],R[2][0]*d[0]+R[2][1]*d[1]+R[2][2]*d[2]+ca[2]]}}
const rmsd=(A,B)=>Math.sqrt(A.reduce((s,a,i)=>s+(a[0]-B[i][0])**2+(a[1]-B[i][1])**2+(a[2]-B[i][2])**2,0)/A.length);
const caList=(S,ch)=>S.ch[ch].filter(r=>r[4].some(a=>a[0]==='CA')).map(r=>{const a=r[4].find(x=>x[0]==='CA');return[a[1],a[2],a[3]]});
const seqOf=(S,ch)=>S.ch[ch].map(r=>AA3[r[1]]||'X').join('');

function transformStruct(S,fn){const o=JSON.parse(JSON.stringify(S));for(const ch of Object.values(o.ch))for(const r of ch)for(const a of r[4]){const q=fn([a[1],a[2],a[3]]);a[1]=q[0];a[2]=q[1];a[3]=q[2]}for(const h of o.het)for(const a of h[3]){const q=fn([a[1],a[2],a[3]]);a[1]=q[0];a[2]=q[1];a[3]=q[2]}return o}
