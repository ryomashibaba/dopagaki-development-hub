/**
 * R6D-R4 read-only: all 28 genuine source B51 poses at 240Hz over 14–17 s.
 * Each per-tick OBB corner projection is an EXPLICIT sampled envelope, not
 * continuous-time swept-volume certification. Never modifies game code.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {generateG4E7BC} from './p101-w9c2-g4e7bc-bank-contour.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {DT} from '../private/reference_only/director/physics.js';
const R=['true-pinch','pinch-switch'],round=(v,n=6)=>Number(v.toFixed(n));
function corners(p){
 const [hx,hy,hz]=p.halfSize,[cx,cy,cz]=p.center;
 const a=Math.cos(p.yawRadians),b=Math.sin(p.yawRadians);
 const pts=[];
 for(const x of [-hx,hx])for(const y of [-hy,hy])for(const z of [-hz,hz])
  pts.push([cx+x*a+z*b,cy+y,cz-x*b+z*a]);
 return pts;
}
function bounds(){
 return {min:[Infinity,Infinity,Infinity],max:[-Infinity,-Infinity,-Infinity]};
}
function include(box,points){
 for(const p of points)for(let i=0;i<3;i++){
  box.min[i]=Math.min(box.min[i],p[i]);box.max[i]=Math.max(box.max[i],p[i]);
 }
}
function precise(box){
 return {min:box.min.map(x=>round(x)),max:box.max.map(x=>round(x))};
}
function distance(p,box){
 return Math.hypot(...p.map((v,i)=>Math.max(box.min[i]-v,0,v-box.max[i])));
}
export function scan(road){
 assert(R.includes(road));assert.ok(Math.abs(1/DT-240)<1e-7);
 const doc=generateG4E7BC(road,'rollDeck'),frozen=JSON.stringify(doc);
 assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
 assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
 const start=14,end=17,first=Math.round(start/DT),last=Math.round(end/DT);
 const records=doc.movingObstacles.map(ob=>{
  const whole=bounds(),slices=Array.from({length:6},bounds);
  let enabled=0,previous=null,maxDisplacement=0;
  const anchors={};
  for(let tick=first;tick<=last;tick++){
   const t=tick*DT,p=movingObstaclePose(ob,t);
   assert.equal(p.id,ob.id);
   assert.ok(p.center.every(Number.isFinite)&&p.halfSize.every(x=>Number.isFinite(x)&&x>0));
   if((tick-first)%120===0)anchors['t'+String(Math.round(t*100)).padStart(4,'0')]={enabled:p.enabled,center:p.center,halfSize:p.halfSize,yawRadians:p.yawRadians};
   if(!p.enabled){previous=null;continue;}
   const cc=corners(p);include(whole,cc);
   // Shared boundary tick belongs to both neighboring time slices.
   if(tick>first)include(slices[Math.min(5,Math.floor((tick-first-1)/120))],cc);
   if(tick<last)include(slices[Math.min(5,Math.floor((tick-first)/120))],cc);
   if(previous)for(let i=0;i<8;i++)
    maxDisplacement=Math.max(maxDisplacement,Math.hypot(...cc[i].map((x,j)=>x-previous[i][j])));
   previous=cc;enabled++;
  }
  return {id:ob.id,type:ob.type,activeTicks:enabled,totalTicks:721,
   sampledAabb:enabled?precise(whole):null,
   sixHalfSecondSampleAabbs:slices.map(b=>Number.isFinite(b.min[0])?precise(b):null),
   largestCorrespondingCornerInterTickMetres:round(maxDisplacement,7),
   anchors,continuousTimeCertified:false};
 });
 assert.equal(records.length,28);
 assert.ok(records.every(r=>Object.keys(r.anchors).length===7));
 assert.equal(JSON.stringify(doc),frozen);
 return {schema:'dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1',road,
  sourceCXBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
  sourceB48:7,sourceB51:28,sourceCameras:5,gap52:true,
  origin:'ORIGINAL_B51_240HZ_EXPLICIT_721_TICK_ROTATING_BOX_SAMPLES',
  firstTick:first,lastTick:last,physicsHz:240,frames721:721,
  sixHalfSecondWindows:6,hazards:records,
  notContinuousTime:'Sampling does not prove clearance between ticks, player contacts or full-game safety.',
  newCityMeshes:0,newGameColliders:0,officialArt:0,officialSlope2Metres:0,
  sourceChanged:false,ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',
  PERFORMANCE:'HOLD',INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
}
if(process.argv[1]?.endsWith('p101-w9c2-g4e7dz-r6d-r4-28-source-hazard-envelopes.mjs')){
 const folder='test-results/g4e7dz-r6d-r4/source';
 fs.mkdirSync(folder,{recursive:true});
 for(const road of R){
  const x=scan(road);
  fs.writeFileSync(folder+'/'+road+'.json',JSON.stringify(x,null,2)+'\n');
  console.log('R4_28_ORIGINAL_HAZARDS_240HZ_SAMPLES_ONLY',road,x.hazards.length,x.frames721);
 }
}
