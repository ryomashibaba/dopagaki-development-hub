/**
 * K4AV — FULL SCREEN Road5 visual reset, not K4AQ/K4AT scenery stacking.
 * Entire scene composition: physically sourced B48 edge superstructure,
 * distinct occupied public buildings, varied skyline, material depth,
 * and visible human-scale programs. All triangles are VISUAL ONLY.
 *
 * Uses real original Road5 surface frames; no B48/B51/camera/physics changes.
 * Vertex layout: xyz + computed face normal xyz + K4AQ material index.
 *
 * Deliberate one-direction art thesis: "Civic Terraces over the Open Basin".
 * No repeated giant diagonal road gate; no floating neon signboards.
 */
export const K4AV_CONTRACT=Object.freeze({
 schema:'dopagaki.K4AV.full-frame-civic-terraces-open-basin/1',
 sourceBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
 sourceRoad:'p93-PRISM_CREST-01',sourceB48:7,sourceB51:28,nativeHz:240,
 originalCamera:true,originalCollision:true,newColliders:0,
 afterSourceARTHolds:true,officialARTAccepted:0,slope2DNAMetres:0,
 ART:'NOT_TESTED_HOLD',HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',
 FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'
});
const plus=(a,b)=>a.map((v,i)=>v+b[i]);
const minus=(a,b)=>a.map((v,i)=>v-b[i]);
const mul=(a,s)=>a.map(v=>v*s);
const len=a=>Math.hypot(...a);
const unit=a=>mul(a,1/(len(a)||1));
const cross=(a,b)=>[
 a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]
];
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const target=[922.42,107.34,-321.10];
function tri(out,a,b,c,mat){
 const n=cross(minus(b,a),minus(c,a));
 if(!n.every(Number.isFinite)||len(n)<1e-7)throw Error('K4AV_DEGENERATE');
 const normal=unit(n);
 for(const p of [a,b,c])out.push(...p,...normal,mat);
}
function quad(out,a,b,c,d,mat){tri(out,a,b,c,mat);tri(out,a,c,d,mat);}
function local(f,s,d,h=0){
 return plus(plus(plus(f.edge,mul(f.forward,s)),mul(f.outward,d)),[0,h,0]);
}
function cuboid(out,f,x0,x1,d0,d1,h0,h1,face=2,top=1){
 if(!(x1-x0>.1&&d1-d0>.1&&h1-h0>.1))
   throw Error('K4AV_NEGATIVE_OR_ZERO_BAY');
 const p=(x,d,h)=>local(f,x,d,h);
 const A=p(x0,d0,h0),B=p(x1,d0,h0),C=p(x1,d1,h0),D=p(x0,d1,h0);
 const E=p(x0,d0,h1),F=p(x1,d0,h1),G=p(x1,d1,h1),H=p(x0,d1,h1);
 quad(out,A,B,F,E,face);quad(out,B,C,G,F,face);
 quad(out,C,D,H,G,face);quad(out,D,A,E,H,face);
 quad(out,E,F,G,H,top);
 quad(out,A,D,C,B,7);
}
function frameAt(s,sample,u,side){
 const t=.0025,back=sample(s,clamp(u-t,.001,.999),.5),
 forwardPoint=sample(s,clamp(u+t,.001,.999),.5),
 edge=sample(s,u,side<0?0:1),center=sample(s,u,.5);
 if(![back,forwardPoint,edge,center].every(v=>v?.length===3&&v.every(Number.isFinite)))
   throw Error('K4AV_INVALID_ACTUAL_B48_WORLD_POINT');
 const f=unit([forwardPoint[0]-back[0],0,forwardPoint[2]-back[2]]);
 const d=minus(edge,center),project=d[0]*f[0]+d[2]*f[2];
 const lateral=unit([d[0]-project*f[0],0,d[2]-project*f[2]]);
 if(len(minus(edge,center))<3)throw Error('K4AV_SOURCE_EDGE_TOO_SMALL');
 return {edge,forward:f,outward:lateral};
}
function locate(s,sample){
 let best={u:.5,d:Infinity};
 for(let i=1;i<255;i++){
  const u=i/256,p=sample(s,u,.5);
  if(!p.every(Number.isFinite))continue;
  const d=Math.hypot(p[0]-target[0],p[2]-target[2]);
  if(d<best.d)best={u,d};
 }
 if(best.d>350)throw Error('K4AV_NATIVE_CAMERA_ROAD5_NOT_GROUNDED');
 return best;
}
function sourceDoc(doc,sample){
 if(typeof sample!=='function'||doc?.surfaces?.length!==7||
 doc?.movingObstacles?.length!==28||doc?.stageForge?.productionPromoted!==false||
 doc?.surfaces?.[5]?.id!==K4AV_CONTRACT.sourceRoad)
  throw Error('K4AV_SOURCE_B48_B51_PHYSICAL_GUARD');
 return doc.surfaces[5];
}
function trackEdge(out,s,sample,side,uStart,uEnd){
 // Real B48 edge slice only. Nothing crosses any original missing road cell.
 const n=48,rows=s.rows??0,res=s.resolution??1,missing=new Set(s.voidLongitudinalCells||[]);
 let built=0;
 for(let i=0;i<n;i++){
  const a=uStart+(uEnd-uStart)*i/n,b=uStart+(uEnd-uStart)*(i+1)/n;
  const cell=Math.floor(a*(rows-1)*res);
  if(missing.has(cell))continue;
  const f=frameAt(s,sample,(a+b)*.5,side);
  // Physically legible 1m-deep steel band BELOW the outer existing road edge.
  const p=(u,d,h)=>{
   const e=sample(s,u,side<0?0:1);
   return plus(plus(e,mul(f.outward,d)),[0,h,0]);
  };
  quad(out,p(a,0,-.35),p(b,0,-.35),p(b,1.9,-3.2),p(a,1.9,-3.2),2);
  quad(out,p(a,.1,-.14),p(b,.1,-.14),p(b,1.5,-.14),p(a,1.5,-.14),4);
  if(i%3===0){
   // One hollow-sided vertical strut per ~30 source meters, not giant gates.
   quad(out,p(a,.6,-3.4),p(b,.6,-3.4),
    p(b,2.8,-17.0),p(a,2.8,-17.0),0);
  }
  if(i%4===0){
   // Low-profile, real-world scale lane edge marker BELOW eye-line.
   quad(out,p(a,.2,.35),p(b,.2,.35),
    p(b,1.0,.35),p(a,1.0,.35),6);
  }
  built++;
 }
 return built;
}
function inhabitablePodium(out,f,side=0){
 // One continuous metropolitan gallery with HUMAN-SCALE window and door
 // rhythm — not giant unbroken facade stripes.
 const x0=side? -112:-145,x1=side?145:163;
 const d0=side?46:49,d1=side?105:134;
 for(let level=0;level<(side?6:4);level++){
  const y=level*(side?13.5:17.0)-3;
  const setback=level*(side?5:8);
  cuboid(out,f,x0+setback,x1-setback,d0+setback,d1,y,y+2.3,1,1);
  cuboid(out,f,x0+setback,x1-setback,d1-5,d1-1,y+2.4,y+(side?12:15),0,0);
  const bays=side?23:19;
  for(let j=0;j<bays;j++){
   const left=x0+setback+(x1-x0-2*setback)*(j+.06)/bays;
   const right=x0+setback+(x1-x0-2*setback)*(j+.92)/bays;
   // 2m granite pier, deep glazed occupied storefront, warm recess.
   if(j%7!==3){
    cuboid(out,f,left,right,d0+setback+1.9,d0+setback+3.0,
      y+3.1,y+12,3,3);
    cuboid(out,f,left+1.5,right-1.5,d0+setback+.8,d0+setback+1.6,
      y+7.5,y+9.1,j%4===0?5:7,j%4===0?5:7);
   }
   if(j%3===0)cuboid(out,f,left,left+1.3,d0+setback-.5,d0+setback+5.1,
      y+2.7,y+13.2,4,4);
  }
  // Distinct terrace guard, visually legible at 200m/s but not falsely
  // assumed walkable by source physics.
  cuboid(out,f,x0+setback,x1-setback,d0+setback-3,d0+setback-1.6,
    y+2.0,y+5.7,2,2);
 }
 return {name:side?'METROPOLITAN_STATION_PODIUM':'CIVIC_GALLERY_OPEN_TERRACES',
  privateVisualFloorOnly:true};
}
function drawCanopy(out,f){
 // A roof that reads as an occupied public hall, not diagonal struts above road.
 // Wide asymmetric low tensile shell over the sideways gallery's own footprint.
 const seg=56;
 const edgeAt=(t,v)=>{
  const x=-151+t*321;
  const sweep=Math.pow(Math.sin(Math.PI*t),.82);
  const y=61+24*sweep+11*Math.sin(2*Math.PI*t);
  const z=68+v*57+12*Math.sin(t*2.6+v);
  return local(f,x,z,y+v*5);
 };
 for(let i=0;i<seg;i++){
  const t=i/seg,t1=(i+1)/seg;
  for(let band=0;band<5;band++){
   const va=band/5,vb=(band+1)/5;
   const mat=band===0?2:band===4?1:(i%5===0?4:0);
   quad(out,edgeAt(t,va),edgeAt(t1,va),
      edgeAt(t1,vb),edgeAt(t,vb),mat);
  }
  // Fins cast genuine varying normals along the curve. Keep it all off-road.
  if(i%4===0){
   const p=edgeAt(t,.87),q=edgeAt(t,.22);
   const rise=[0,3.1,0];
   quad(out,p,q,plus(q,rise),plus(p,rise),4);
  }
 }
 return {name:'ASYMMETRIC_HALL_ROOF',voidWithin:true};
}
function cylindricalTower(out,f,x,d,height,radius,twist=0){
 const rings=21,sides=11;
 const point=(level,i)=>{
  const t=level/rings,y=height*t;
  const ang=i*2*Math.PI/sides+twist*t+.12*Math.sin(t*Math.PI*2);
  const r=radius*(1-.39*t)+4*Math.sin(t*Math.PI*2)*Math.sin(t*Math.PI);
  return local(f,x+r*Math.cos(ang)+11*t*t,
    d+r*Math.sin(ang)-7*t*t,y);
 };
 for(let y=0;y<rings;y++){
  for(let i=0;i<sides;i++){
   const next=(i+1)%sides;
   quad(out,point(y,i),point(y,next),point(y+1,next),point(y+1,i),
     i%5===0?4:i%4===0?1:3);
  }
 }
 // Distinct usable crown with an architectural parapet, not point spike.
 const top=height+4;
 cuboid(out,f,x-4,x+4,d-4,d+4,top,top+9,4,4);
 return {name:'OCCUPIED_TAPERING_TOWER',height,faceted:true};
}
function steppedOffice(out,f,x,d,width,depth,height){
 const levels=7;
 for(let y=0;y<levels;y++){
  const aa=y/levels;
  const w=width*(1-aa*.40),z=depth*(1-aa*.31);
  const drift=10*aa*aa;
  cuboid(out,f,x-w/2+drift,x+w/2+drift,
    d-z/2,d+z/2,aa*height,(y+1)*height/levels-1.8,
    y%3===0?2:3,y%3===0?4:1);
  for(let j=0;j<7;j++){
   const xx=x-w/2+drift+(j+.25)*w/7;
   cuboid(out,f,xx,xx+Math.min(2.1,w/18),
     d-z/2-.7,d-z/2+.5,aa*height+2,
     (y+1)*height/levels-3,5,5);
  }
 }
 return {name:'STEPPED_CLIMATE_OFFICE_TOWER',height};
}
function bridgesAndCourt(out,f){
 // A real composition of scattered civic platforms and courtyards —
 // not a giant solid box across the original driving lane.
 for(let level=0;level<4;level++){
  const x0=-98+level*18,x1=115+level*9;
  cuboid(out,f,x0,x1,115+level*5,137+level*9,
     7+level*15,9+level*15,1,1);
  const end=x1-11;
  for(let j=0;j<7;j++){
   if(j===3)continue;
   const x=x0+8+j*(end-x0-8)/7;
   cuboid(out,f,x,x+3.2,135+level*7,146+level*7,
      9+level*15,22+level*15,2,2);
  }
  cuboid(out,f,x0+2,x1-2,140+level*7,141.5+level*7,
     15+level*15,18+level*15,4,4);
 }
 return {name:'FOUR_INTERLOCKED_PUBLIC_COURTS',walkability:'NOT_TESTED'};
}
export function buildK4AVRoad5Environment(doc,sample,{enabled=false}={}){
 if(!enabled)return {active:false,vertices:[],ART:'HOLD'};
 const source=sourceDoc(doc,sample),before=JSON.stringify(doc),out=[];
 const anchor=locate(source,sample);
 const u=anchor.u;
 const locations=[
  {u:clamp(u+.023,.07,.91),side:-1,program:'gallery'},
  {u:clamp(u+.058,.07,.91),side:1,program:'station'},
  {u:clamp(u+.19,.07,.91),side:-1,program:'distant'}
 ];
 const elements=[];
 for(const loc of locations){
  const f=frameAt(source,sample,loc.u,loc.side);
  if(loc.program==='gallery'){
   elements.push(inhabitablePodium(out,f,0),drawCanopy(out,f),
    cylindricalTower(out,f,205,218,275,36,-1.25),
    steppedOffice(out,f,-171,254,78,58,158));
  }else if(loc.program==='station'){
   elements.push(inhabitablePodium(out,f,1),bridgesAndCourt(out,f),
    steppedOffice(out,f,221,207,71,49,223),
    cylindricalTower(out,f,-200,248,168,28,.7));
  }else{
   elements.push(cylindricalTower(out,f,175,320,370,38,.9),
    steppedOffice(out,f,-72,342,95,68,291),
    cylindricalTower(out,f,-255,405,250,25,-.9));
  }
 }
 const range=[clamp(u-.045,.015,.97),clamp(u+.26,.03,.985)];
 const sideSegments=trackEdge(out,source,sample,-1,...range)+
   trackEdge(out,source,sample,1,...range);
 const triangles=out.length/21;
 if(out.some(x=>!Number.isFinite(x))||!Number.isInteger(triangles)||
  triangles<3000||triangles>120000||JSON.stringify(doc)!==before)
  throw Error('K4AV_ART_GEOMETRY_INVALID '+JSON.stringify({
    triangles,nonfinite:out.filter(x=>!Number.isFinite(x)).length,
    mutated:JSON.stringify(doc)!==before
  }));
 return {active:true,vertices:out,triangles,
  originalRoad5U:u,originalRoad5Distance:anchor.d,sourceRoad:source.id,
  elements,visibleEdgeSegments:sideSegments,newColliders:0,
  originalPhysicsChanged:false,originalCameraChanged:false,
  ART:'NOT_TESTED_HOLD',formalArtAccepted:0,slope2DNAMetres:0};
}
