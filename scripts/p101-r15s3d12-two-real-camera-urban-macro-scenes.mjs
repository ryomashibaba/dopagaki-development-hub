/**
 * R15S3D12 genuine geometric CITY architecture for the true original WebGL2
 * game -- two competing major compositions, NEVER layered over old cubes.
 * A / inhabited split-canyon: hollow terraced city cliffs with real openings,
 *     bridges and visible underside districts (no roadway bridge/floor).
 * B / braided sky estuary: enormous asymmetrical shells, nested suspended
 *     commons and open rib arcs, explicitly not a gate tunnel.
 * Both generate original renderer six-float XYZ/RGB triangles, noncollision.
 * Source B48/B51, Runner, camera, input, shader, main and production untouched.
 */
import assert from 'node:assert/strict';
export const CITY_MODES=Object.freeze(['A_INHABITED_VOID','B_BRAIDED_ESTUARY']);
const K={porcelain:[.87,.92,.92],deep:[.075,.14,.21],satin:[.24,.43,.53],
 slate:[.17,.32,.44],glass:[.21,.72,.81],mint:[.46,.97,.87],
 amber:[.99,.71,.36],lavender:[.64,.46,.85],black:[.10,.22,.28]};
const plus=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),
 m=(v,t)=>v.map(x=>x*t),len=v=>Math.hypot(...v),norm=v=>m(v,1/(len(v)||1)),
 dot=(a,b)=>a.reduce((n,x,i)=>n+x*b[i],0),
 cross=(a,b)=>[a[1]*b[2]-a[2]*b[0]-a[0]*b[2],a[2]*b[0]-a[0]*b[2]+0,a[0]*b[1]-a[1]*b[0]],
 lerp=(a,b,t)=>plus(m(a,1-t),m(b,t)),mix=(a,b,t)=>lerp(a,b,t);
function triangle(a,p,q,r,c){for(const v of [p,q,r])a.push(...v,...c);}
function quad(a,p,q,r,s,c){
 triangle(a,p,q,r,c);triangle(a,p,r,s,c);
 triangle(a,s,r,q,K.black);triangle(a,s,q,p,K.black);
}
function tube(a,P,Q,w,color){
 const tangent=norm(sub(Q,P)),up=Math.abs(dot(tangent,[0,1,0]))>.93?[0,0,1]:[0,1,0],
 right=norm(cross(tangent,up)),top=norm(cross(tangent,right));
 const ring=p=>[plus(plus(p,m(right,w*.5)),m(top,w*.37)),
  plus(sub(p,m(right,w*.5)),m(top,w*.37)),
  sub(sub(p,m(right,w*.5)),m(top,w*.37)),
  plus(sub(p,m(top,w*.37)),m(right,w*.5))];
 const b=ring(P),c=ring(Q);
 for(const [i,j,k,l] of [[0,1,2,3],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0],[4,7,6,5]]){
  const q=[...b,...c];quad(a,q[i],q[j],q[k],q[l],color);
 }
}
function actualSide(road,sample,u,sign){
 const center=sample(road,u,.5),edge=sample(road,u,sign<0?0:1);
 const before=sample(road,Math.max(0,u-.002),.5),after=sample(road,Math.min(1,u+.002),.5);
 const ahead=norm([after[0]-before[0],0,after[2]-before[2]]);
 const diff=[edge[0]-center[0],0,edge[2]-center[2]];
 const outward=norm(sub(diff,m(ahead,dot(diff,ahead))));
 assert.ok(outward.every(Number.isFinite)&&ahead.every(Number.isFinite));
 assert.ok(len(diff)>5&&len(outward)>.9);
 return {edge,outward,ahead};
}
const P=(frame,lateral,along,height)=>plus(plus(plus(frame.edge,
 m(frame.outward,lateral)),m(frame.ahead,along)),[0,height,0]);
const SITES=Object.freeze([
 {road:5,u:.15,side:-1,size:190,depth:150,height:138},
 {road:5,u:.37,side:1,size:225,depth:195,height:175},
 {road:5,u:.62,side:-1,size:240,depth:175,height:218},
 {road:5,u:.84,side:1,size:215,depth:195,height:152},
 {road:6,u:.22,side:1,size:260,depth:230,height:240},
 {road:6,u:.53,side:-1,size:285,depth:245,height:280},
 {road:6,u:.78,side:1,size:230,depth:185,height:165}
]);
function sceneA(vertices,road,sample,site,n,stat){
 const F=actualSide(road,sample,site.u,site.side);
 const at=(lng,d,h)=>P(F,31+d,lng,h);
 // Three terraced multi-level residential cliffs in real 3D, carved with
 // entire TWO-BAY open shafts, no false tinted-window holes.
 for(let tier=0;tier<3;tier++){
  const segments=16,h0=-68+tier*43,h1=h0+30+13*tier;
  const front=[],rear=[],upper=[],lower=[];
  for(let j=0;j<=segments;j++){
   const t=j/segments,x=(t-.5)*site.size,
     wave=17*Math.sin(t*Math.PI*1.7+n*.43+tier*.7),
     y=13*Math.sin(2*Math.PI*t+tier*.5),
     depth=site.depth*.18+tier*25+15*Math.cos(t*2.5);
   front.push(at(x+wave,depth,h1+y));
   rear.push(at(x+wave*.37,depth+site.depth*.38,h1+y-10));
   upper.push(at(x+wave,depth,h0+y));
   lower.push(at(x+wave*.37,depth+site.depth*.38,h0+y-9));
  }
  for(let j=0;j<segments;j++){
   // Real negative space, not a rectangle painted black; no walls/roof here.
   const bay=(j+2*tier+n)%9;
   if(bay===3||bay===4||bay===5){stat.voidCells++;continue;}
   const skin=(j+tier+n)%7===0?K.porcelain:(tier===1?K.satin:K.slate);
   quad(vertices,front[j],front[j+1],upper[j+1],upper[j],skin);
   quad(vertices,rear[j+1],rear[j],lower[j],lower[j+1],K.deep);
   if(j%3!==0){
    quad(vertices,front[j],front[j+1],rear[j+1],rear[j],tier===2?K.porcelain:K.glass);
    quad(vertices,upper[j+1],upper[j],lower[j],lower[j+1],K.black);
   }
   stat.habitableUnits++;
   if(j%3===1){
    tube(vertices,front[j],front[j+1],1.6,K.mint);stat.luminousRuns++;
   }
  }
  // Occupied corridors cross only the *city's* excavated open voids,
  // far outside the actual collision road.
  for(const [a,b] of [[2,6],[10,14]]){
   tube(vertices,rear[a],front[b],3.8,tier===1?K.amber:K.porcelain);
   stat.crossCityLinks++;
  }
 }
 // Two asymmetric cantilevers form a vast open civic atrium between them.
 for(let i=0;i<=25;i++){
  const t=i/25,theta=t*Math.PI*.90,
   x=(t-.5)*site.size*.94+12*Math.sin(2.6*Math.PI*t),
   d=site.depth*.52+58*Math.sin(theta),
   height=site.height*(.55+.60*Math.sin(theta))-18;
  const f=at(x,d,height);
  if(i>0 && (i%8!==4&&i%8!==5)){
   tube(vertices,stat.prevSpine,f,6.5,i%4===0?K.amber:K.porcelain);
   stat.skyRibs++;
  } else if(i>0)stat.ribOpenings++;
  stat.prevSpine=f;
 }
 stat.prevSpine=null;
 // A deeply visible underside, separated from upper city rather than a flat
 // road-colored plane.
 for(const j of [0,5,11,16]){
  const t=j/16,a=at((t-.5)*site.size,site.depth*.35, -65),
    b=at((t-.5)*site.size*.73,site.depth*.8,-132-25*Math.sin(t*Math.PI));
  tube(vertices,a,b,6,K.satin);stat.undersideTrusses++;
 }
}
function sceneB(vertices,road,sample,site,n,stat){
 const F=actualSide(road,sample,site.u,site.side);
 const at=(lng,d,h)=>P(F,29+d,lng,h);
 // Non-central, strongly asymmetric urban caldera ribbons.
 for(let ribbon=0;ribbon<3;ribbon++){
  const segments=38,outer=[],inner=[];
  for(let k=0;k<=segments;k++){
   const t=k/segments,x=(t-.5)*site.size*(1-.14*ribbon),
     wave=Math.sin(t*Math.PI*2+n*.4+ribbon*.75)*site.depth*.16,
     h=site.height*(.17+.30*ribbon)+
      Math.sin(Math.PI*t)*site.height*(.35+.20*ribbon)+
      15*Math.sin(t*6*Math.PI+ribbon),
     d=site.depth*.20+ribbon*32+site.depth*.44*Math.sin(t*Math.PI*.92)+wave;
   outer.push(at(x,d,h));
   inner.push(at(x-10*Math.sin(t*3),d+30+13*ribbon,h-14-10*Math.sin(4*Math.PI*t)));
  }
  for(let k=0;k<segments;k++){
   if((k+2*ribbon+n)%15===8||(k+2*ribbon+n)%15===9||
      (k+2*ribbon+n)%15===10){stat.voidCells++;continue;}
   quad(vertices,outer[k],outer[k+1],inner[k+1],inner[k],
    k%9===0?K.amber:ribbon===1?K.porcelain:K.glass);
   if(k%4===0){tube(vertices,outer[k],outer[k+1],2,K.mint);stat.luminousRuns++;}
   stat.habitableUnits++;
  }
  for(const k of [4,16,30]){
   tube(vertices,outer[k],inner[Math.min(segments,k+6)],5,ribbon===1?K.amber:K.porcelain);
   stat.crossCityLinks++;
  }
 }
 // Off-axis suspended public amphitheatres; massive inhabited volumes,
 // separated by open air, not one straight bridge or square tower stack.
 for(let level=0;level<4;level++){
  const center=(level-.8)*site.size*.17,
   z=site.depth*.75+level*24,base=42+level*39,
   radius=24+level*7,segments=24;
  for(let i=0;i<segments;i++){
   const t=i/segments,q=(i+1)/segments,
    a=at(center+Math.cos(t*Math.PI*2)*radius,z+Math.sin(t*Math.PI*2)*radius*.64,base),
    b=at(center+Math.cos(q*Math.PI*2)*radius,z+Math.sin(q*Math.PI*2)*radius*.64,base),
    topA=plus(a,[0,11+level*2,0]),topB=plus(b,[0,11+level*2,0]);
   if(i%7===2||i%7===3){stat.voidCells++;continue;}
   quad(vertices,a,b,topB,topA,level===2?K.lavender:K.satin);
   if(i%4===0)tube(vertices,topA,topB,1.7,K.mint);
   stat.habitableUnits++;
  }
  stat.openPublicCourts++;
 }
 // Truly broad suspended skew ribs below both banks, away from actual road.
 for(const sign of [-1,1]){
  const path=Array.from({length:9},(_,k)=>{
   const t=k/8;
   return at(sign*(site.size*.3+site.size*.12*t),site.depth*(.2+.8*t),
    18+site.height*.7*Math.sin(Math.PI*t)-80*t);
  });
  for(let j=1;j<path.length;j++){
   if(j===4||j===5){stat.ribOpenings++;continue;}
   tube(vertices,path[j-1],path[j],9,j%2===0?K.porcelain:K.satin);stat.skyRibs++;
  }
 }
}
export function buildR15S3D12City(doc,sample,{mode='A_INHABITED_VOID'}={}){
 assert.ok(CITY_MODES.includes(mode),'unknown real city mode');
 assert.equal(doc.surfaces?.length,7);
 assert.equal(doc.movingObstacles?.length,28);
 assert.equal(doc.stageForge?.r15s3d11?.mode,'A_EDGE_READABLE');
 assert.equal(doc.stageForge?.productionPromoted,false);
 const frozen=JSON.stringify(doc),vertices=[];
 const stat={mode,districts:SITES.length,voidCells:0,habitableUnits:0,
  skyRibs:0,ribOpenings:0,crossCityLinks:0,luminousRuns:0,
  undersideTrusses:0,openPublicCourts:0,prevSpine:null};
 for(const [i,site] of SITES.entries()){
  const road=doc.surfaces[site.road];
  if(mode===CITY_MODES[0])sceneA(vertices,road,sample,site,i,stat);
  else sceneB(vertices,road,sample,site,i,stat);
 }
 delete stat.prevSpine;
 const triangles=vertices.length/18;
 assert.ok(vertices.length%18===0&&triangles>1100&&triangles<85000);
 assert.ok(vertices.every(Number.isFinite));
 assert.ok(stat.voidCells>=30&&stat.habitableUnits>130);
 assert.ok(JSON.stringify(doc)===frozen,'real source stage mutated by ART');
 return {vertices,triangles,...stat,
  sourceRoads:7,sourceMovingB51:28,
  actualSourceRoadSegments:[5,6],
  sourceB48B51RunnerCameraInputUnchanged:true,
  addedRealCollisionObjects:0,changedOriginalPhysics:false,
  thisIsPrivateActual3DArtCandidate:true,
  realWebGLCameraEvidencePending:true,
  officialArtAdopted:0,officialSlope2Meters:0,
  ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD'};
}
