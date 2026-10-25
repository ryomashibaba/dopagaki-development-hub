/**
 * G4E-7BM / CAMERA-REGISTERED OPEN CROWN.
 * Reuses BL authentic GLB geometry; places exactly one city district by
 * minimizing actual BG 240Hz camera projection error, not arbitrary world offsets.
 * PRIVATE, non-collider, no Blender provenance; ART never auto-certified.
 */
import {generateBLModel} from './p101-w9c2-g4e7bl-open-crown-author.mjs';
import {BK_MATERIALS,glbFromTriangles} from './p101-w9c2-g4e7bk-glb-author.mjs';
import {parseBKGLB} from '../web/p101-w9c2-g4e7bk-lit-glb.mjs';
import {sample} from '../private/reference_only/director/surface.js';
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),
 scale=(v,k)=>v.map(x=>x*k),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),
 cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
 unit=v=>scale(v,1/(Math.hypot(...v)||1)),rounded=n=>Number(n.toFixed(3));
const ASPECT=928/540,PROJ=1.35;
function view(frame){
 const front=unit(frame.front),right=unit(cross(front,[0,1,0])),up=unit(cross(right,front));
 return {eye:frame.eye,front,right,up,id:frame.id,speedMps:frame.speedMps};
}
function proj(p,v){
 const r=sub(p,v.eye),z=dot(r,v.front);
 if(z<=3)return null;
 return {x:PROJ*dot(r,v.right)/(ASPECT*z),y:PROJ*dot(r,v.up)/z,z};
}
function evidence(vertices,v,offset){
 const hits=[];let danger=0,near=0,far=0;
 for(const p of vertices){
  const v2=proj(add(p,offset),v);
  if(!v2||Math.abs(v2.x)>1||Math.abs(v2.y)>1){far++;continue;}
  hits.push(v2);
  if(v2.x>-.32&&v2.x<.65&&v2.y<.12&&v2.y>-.82)danger++;
  if(v2.z<145)near++;
 }
 if(!hits.length)return {fraction:0,box:null,overRoad:1,near:1};
 const xs=hits.map(x=>x.x).sort((a,b)=>a-b),ys=hits.map(x=>x.y).sort((a,b)=>a-b);
 const q=(a,f)=>a[Math.floor((a.length-1)*f)];
 const box=[q(xs,.08),q(ys,.08),q(xs,.92),q(ys,.92)].map(rounded);
 return {fraction:rounded(hits.length/vertices.length),box,
  overRoad:rounded(danger/hits.length),near:rounded(near/hits.length)};
}
function scoreReport(views,verts,offset,road){
 const samples=views.map(v=>evidence(verts,v,offset));
 let best=0;
 for(const s of samples){
  if(!s.box)continue;
  const w=s.box[2]-s.box[0],h=s.box[3]-s.box[1];
  const silhouette=Math.min(1,w/.36)*Math.min(1,h/.36);
  best+=2.1*s.fraction+.8*silhouette-1.1*s.overRoad-.6*s.near-
   .28*Math.max(0,w-.85)-.28*Math.max(0,h-1.22);
 }
 // Avoid dragging building shells across the physical second B48 road.
 let min=Infinity;
 for(const p of verts.filter((_,i)=>i%5===0)){
  const a=add(p,offset);
  for(const r of road){
   const d=Math.hypot(a[0]-r[0],a[2]-r[2]);
   min=Math.min(min,d);
  }
 }
 if(min<88)best-=2.6+(88-min)*.09;
 return {score:best,samples,minRoadHorizontal:rounded(min)};
}
function target(v,z,nx,ny){
 return add(add(add(v.eye,scale(v.front,z)),scale(v.right,nx*ASPECT*z/PROJ)),scale(v.up,ny*z/PROJ));
}
export function generateBMModel(doc,nativeFrames){
 const b=doc?.stageForge?.g4e7bcStudy,frames=nativeFrames?.stages?.[b?.road]?.frames;
 if(b?.id!=='bank-grade-contour'||b.variant!=='rollDeck'||
  !['true-pinch','pinch-switch'].includes(b.road)||doc.stageForge.productionPromoted!==false||
  doc.surfaces?.length!==7||doc.movingObstacles?.length!==28||
  doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52'||
  nativeFrames.physicsHz!==240||!Array.isArray(frames)||frames.length!==3||
  frames.some(f=>f.source!=='ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN'||
  !Number.isFinite(f.speedMps)||f.speedMps<85))
  throw Error('BM only accepts canonical true BG actual native frames and B48');
 const frozen=JSON.stringify(doc);
 const written=generateBLModel(doc);
 const buf=written.glb.buffer.slice(written.glb.byteOffset,written.glb.byteOffset+written.glb.byteLength);
 const parsed=parseBKGLB(buf,{expectedRoad:b.road});
 const points=[];
 for(const prim of parsed.primitives)
  for(let i=0;i<prim.vertices;i+=Math.max(1,Math.floor(prim.vertices/240)))
   points.push([...prim.data.slice(i*6,i*6+3)]);
 const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
 for(const p of points)for(let i=0;i<3;i++){min[i]=Math.min(min[i],p[i]);max[i]=Math.max(max[i],p[i]);}
 const center=min.map((v,i)=>(v+max[i])/2);
 const views=frames.map(view),v=views[2];
 const road=Array.from({length:31},(_,i)=>sample(doc.surfaces[1],i/30,.5));
 let chosen=null;
 // Candidate rays belong to the genuine 240Hz fixed camera, not a fabricated
 // artist camera; lower central-road collision box is explicitly penalized.
 for(const z of [380,520,680,860,1080])
  for(const nx of [-.82,-.64,-.46,.72])
   for(const ny of [-.15,.10,.33]){
    const offset=sub(target(v,z,nx,ny),center);
    const result=scoreReport(views,points,offset,road);
    const proposal={offset,depth:z,aim:[nx,ny],...result};
    if(!chosen||proposal.score>chosen.score)chosen=proposal;
   }
 if(!chosen||!Number.isFinite(chosen.score)||
  chosen.samples.filter(s=>s.fraction>.04).length<2||
  chosen.minRoadHorizontal<50)
  throw Error('BM projection did not find a viable outside-road placement: '+JSON.stringify(chosen));
 const sets=BK_MATERIALS.map(()=>[]);
 for(const prim of parsed.primitives)
  for(let i=0;i<prim.vertices;i++){
   const a=i*6,p=prim.data.slice(a,a+3),n=prim.data.slice(a+3,a+6);
   sets[prim.material].push(...add([...p],chosen.offset),...n);
  }
 const meta={...parsed.meta,visualCandidate:'G4E-7BM-CAMERA-REGISTERED-CROWN',
  cameraTarget:'GENUINE_BG_240HZ_P96_NOT_HUMAN',
  projectionEvidence:chosen.samples,projectionScore:rounded(chosen.score),
  projectionDepthMeters:chosen.depth,projectionAim:chosen.aim,
  nearestRoadHorizontalMeters:chosen.minRoadHorizontal,
  modelWorldOffset:chosen.offset.map(rounded),authoring:'SCRIPTED_REAL_3D_NOT_BLENDER',
  artApproval:'HOLD',publication:'HOLD'};
 if(JSON.stringify(doc)!==frozen)throw Error('BM mutated B48 course');
 return glbFromTriangles(sets,meta);
}
