/** R15S3D9: real existing B48 road5/6 coordinated macro-geometry.
 * Frozen good road4, original CROWN/early SCISSOR, Runner/CCD, native P96/P94,
 * A13, original route/routeSegments, camera, 28 B51, main/prod.
 * Explicitly NOT a player-following safety floor, speed hack, respawn, or
 * official art certification. Two different physical hypotheses.
 */
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {buildR15S3D8R1} from './p101-r15s3d8r1-original-road4-continuous-physical-winding.mjs';
import {sample,frame,tessellate,validate} from '../private/reference_only/director/surface.js';
export const MODES=Object.freeze(['A_CONTINUOUS_NARROW_MACRO','B_ELEVATED_REAL_GAP_MACRO']);
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const mag=v=>Math.hypot(...v),sub=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const norm=v=>{const n=mag(v)||1;return v.map(x=>x/n)};
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const mul=(v,a)=>v.map(x=>x*a);
const angle=(a,b)=>Math.acos(Math.max(-1,Math.min(1,dot(a,b)/(mag(a)*mag(b)||1))))*180/Math.PI;
const round=x=>Number(x.toFixed(6)),vec=v=>v.map(round);
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function hermite(p,q,v,w,t){
 const t2=t*t,t3=t2*t;
 return p.map((x,i)=>(2*t3-3*t2+1)*x+(t3-2*t2+t)*v[i]+(-2*t3+3*t2)*q[i]+(t3-t2)*w[i]);
}
function lateralFrom(centers,row){
 const before=centers[Math.max(0,row-1)],after=centers[Math.min(30,row+1)];
 const dx=after[0]-before[0],dz=after[2]-before[2];
 return norm([dz,-dx]);
}
function shape(s,centers,startCross,width){
 const source=s.points.map(v=>[...v]),first=s.points.slice(0,5).map(v=>[...v]);
 let maxChange=0;
 // Preserve first boundary exactly where requested. New rows use oriented
 // local road frames (not old original 106m or 110m lateral vectors).
 const firstLateral=norm(sub(first[4],first[0]).filter((_,i)=>i!==1));
 for(let row=0;row<=30;row++){
  if(row===0 && startCross){for(let j=0;j<5;j++)s.points[j]=[...startCross[j]];continue;}
  let side=lateralFrom(centers,row);
  if(dot(side,firstLateral)<0)side=mul(side,-1);
  for(let j=0;j<5;j++){
   const a=(j-2)/2;
   const p=[centers[row][0]+a*width/2*side[0],centers[row][1],centers[row][2]+a*width/2*side[1]];
   assert.ok(p.every(x=>Number.isFinite(x)&&Math.abs(x)<2000));
   maxChange=Math.max(maxChange,mag(sub(p,source[row*5+j])));
   s.points[row*5+j]=p;
  }
 }
 return maxChange;
}
function geometry(s){
 const report=Array.from({length:301},(_,i)=>{const u=i/300,f=frame(s,u,.5),l=sample(s,u,0),r=sample(s,u,1);
  return {u,normal:f.normal,forward:f.forward,widthXZ:Math.hypot(l[0]-r[0],l[2]-r[2])}});
 const maxAngle=Math.max(...report.slice(1).map((v,i)=>angle(v.normal,report[i].normal)));
 return {maxNeighbourFrameNormalDegrees:round(maxAngle),
  minFrameNormalY:round(Math.min(...report.map(x=>x.normal[1]))),
  minWidthXZ:round(Math.min(...report.map(x=>x.widthXZ))),
  maxWidthXZ:round(Math.max(...report.map(x=>x.widthXZ))),
  startTangentXYZ:vec(frame(s,0,.5).forward),endTangentXYZ:vec(frame(s,1,.5).forward),
  centerAtStartXYZ:vec(sample(s,0,.5)),centerAtEndXYZ:vec(sample(s,1,.5))};
}
export function buildR15S3D9(world,mode){
 assert.ok(['true-pinch','pinch-switch'].includes(world)&&MODES.includes(mode));
 const baseline=buildR15S3D8R1(world),frozen=JSON.stringify(baseline);
 const doc=structuredClone(baseline),s4=doc.surfaces[4],s5=doc.surfaces[5],s6=doc.surfaces[6];
 const base5=baseline.surfaces[5],base6=baseline.surfaces[6];
 for(const s of [s4,s5,s6])assert.equal(s.rows,31);
 const source4end=sample(s4,1,.5);
 const final5=sample(base5,1,.5);
 const final6=sample(base6,1,.5);
 const forward4=norm(sub(s4.points[30*5+2],s4.points[29*5+2]));
 const forward6=norm(sub(base6.points[30*5+2],base6.points[29*5+2]));
 const chord5=mag(sub(final5,source4end));
 // A: continuous large-radius 3D downhill-to-ridge swoop.
 // B: alternate arch with a REAL physically missing two-cell gap in road5.
 const isB=mode===MODES[1];
 const vStart=mul(forward4,chord5*.68);
 const towardsFinish=norm(sub(final6,final5));
 const vExit=mul(towardsFinish,chord5*.61);
 const c5=Array.from({length:31},(_,r)=>{
  const t=r/30,c=hermite(source4end,final5,vStart,vExit,t);
  if(isB){
   // Mid-course offset is gentle over >1km; not a hidden patch under ball.
   // Positive Y is a real visible elevated ridge prior to a true 2-cell gap.
   const arch=Math.sin(Math.PI*t)**2;
   c[0]-=arch*70;c[1]+=arch*22;c[2]+=arch*135;
  }
  return c;
 });
 const road4endCross=s4.points.slice(30*5).map(v=>[...v]);
 // Baseline s5 has original 106m width; do not force its original orientation.
 // Start source s5 zero-row from exact road4 16m real skin.
 for(let j=0;j<5;j++)s5.points[j]=[...road4endCross[j]];
 const moved5=shape(s5,c5,road4endCross,16);
 const cross5End=s5.points.slice(30*5).map(v=>[...v]);
 const heading5=norm(sub(c5[30],c5[29]));
 const road6Chord=mag(sub(final6,final5));
 const c6=Array.from({length:31},(_,r)=>{
  const t=r/30;
  const initial=mul(heading5,road6Chord*.72);
  const final=mul(forward6,road6Chord*.66);
  const c=hermite(final5,final6,initial,final,t);
  if(isB)c[1]+=Math.sin(Math.PI*t)**2*10;
  return c;
 });
 for(let j=0;j<5;j++)s6.points[j]=[...cross5End[j]];
 const moved6=shape(s6,c6,cross5End,16);
 if(isB){
  // 2 actual absent tessellation cells, incl underside + edges, not
  // an invisible acceleration or collision plane.
  const nu=(s5.rows-1)*s5.resolution;
  const where=Math.floor(nu*.52);
  s5.voidLongitudinalCells=[where,where+1];
 }
 assert.ok(moved5>100&&moved6>10);
 assert.ok(eq(doc.surfaces.slice(0,5),baseline.surfaces.slice(0,5)),'successful original CROWN/SCISSOR/LOWER/VOID modified');
 assert.ok(eq(doc.movingObstacles,baseline.movingObstacles));
 assert.ok(eq(doc.route,baseline.route)&&eq(doc.routeSegments,baseline.routeSegments));
 assert.ok(eq(doc.spawns,baseline.spawns));
 assert.equal(JSON.stringify(baseline),frozen);
 const seam45=s5.points.slice(0,5).map((v,j)=>round(mag(sub(v,s4.points[30*5+j]))));
 const seam56=s6.points.slice(0,5).map((v,j)=>round(mag(sub(v,s5.points[30*5+j]))));
 assert.ok(seam45.every(v=>v<1e-6)&&seam56.every(v=>v<1e-6));
 assert.ok(mag(sub(sample(s6,1,.5),final6))<1e-6,'real original finish center moved');
 const g5=geometry(s5),g6=geometry(s6);
 assert.equal(tessellate(s5).degenerate,0);assert.equal(tessellate(s6).degenerate,0);
 const signature=crypto.createHash('sha256').update(JSON.stringify([s5.points,s6.points,s5.voidLongitudinalCells??[]])).digest('hex');
 doc.name=baseline.name+' R15S3D9 REAL RE-GRADED ROAD5+6 '+mode+' PRIVATE/HOLD';
 doc.stageForge={...doc.stageForge,productionPromoted:false,r15s3d9:{
  schema:'dopagaki.r15s3d9-real-existing-two-downstream-B48-macro/1',
  world,mode,sourceOriginalGameBlob:SHA,originalB48Count:7,originalMovingB51Count:28,
  changedPhysicalRoadIndices:[5,6],unchangedCompleteRoads0Through4:true,
  actualOriginalP96P94A13RunnerGuideCameraCCDUnmodified:true,
  newHiddenRoadsOrPhysicsColliders:0,
  genuineB48GapCellsOnRoad5:isB?2:0,
  realOldRoad5ControlPointMaxChangeM:round(moved5),
  realOldRoad6ControlPointMaxChangeM:round(moved6),
  realRoad4ToRoad5FiveVertexSeamDistancesM:seam45,
  realRoad5ToRoad6FiveVertexSeamDistancesM:seam56,
  oldFinalFinishCentreStillAtXYZ:vec(final6),
  realRoad5Geometry:g5,realRoad6Geometry:g6,
  realRoad4To5HeadingAngleDegrees:round(angle(frame(s4,1,.5).forward,frame(s5,0,.5).forward)),
  realRoad5To6HeadingAngleDegrees:round(angle(frame(s5,1,.5).forward,frame(s6,0,.5).forward)),
  actualPhysicalGeometrySHA256:signature,
  missingOriginalB51RelocationOrPlayabilityCheck:true,originalGuideMayBeMisaligned:true,
  originalHumanNativeControlsUnproven:true,sourceWebGLRendered:false,
  actualFullCourseFinished:false,officialArtAdopted:0,officialSlope2Metres:0,
  GAMEPLAY:'HOLD',ART:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD'}};
 const verified=validate(doc);assert.equal(verified.surfaces.length,7);assert.equal(verified.movingObstacles.length,28);
 return verified;
}
