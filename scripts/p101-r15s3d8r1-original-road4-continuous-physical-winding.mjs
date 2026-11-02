/** R15S3D8R1: Fix physically folded 180-degree B48 road4 control-net
 * lateral winding of the already-running A_DISTRIBUTED_MACRO_ARC.
 * This changes only real B48 surface[4] in a private candidate; it does
 * not add any road, safety collider, guide, physics change, or autopilot.
 */
import assert from 'node:assert/strict';
import {buildR15S3D8} from './p101-r15s3d8-genuine-two-road-macro-alignments.mjs';
import {sample,frame,tessellate,validate} from '../private/reference_only/director/surface.js';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const len=v=>Math.hypot(...v),sub=(a,b)=>a.map((x,i)=>x-b[i]);
const norm2=v=>{const l=len(v)||1;return v.map(x=>x/l)};
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const angle=(a,b)=>Math.acos(Math.max(-1,Math.min(1,dot(a,b)/(len(a)*len(b)||1))))*180/Math.PI;
const round=x=>Number(x.toFixed(6));
export function buildR15S3D8R1(world){
 assert.ok(['true-pinch','pinch-switch'].includes(world));
 const original=buildR15S3D8(world,'A_DISTRIBUTED_MACRO_ARC');
 const frozen=JSON.stringify(original);
 const doc=structuredClone(original),s=doc.surfaces[4],before=original.surfaces[4];
 assert.equal(s.rows,31);assert.equal(s.cols,5);
 // Keep all original centreline coordinates, including y. Fix the cross-road
 // orientation continuously, rather than realigning each row to a DIFFERENT
 // ancient original B48 frame that flips sign halfway along the macro curve.
 const centers=Array.from({length:31},(_,r)=>before.points[r*5+2]);
 const right0=sub(before.points[4],before.points[0]);
 let previous=norm2([right0[0],right0[2]]);
 let maxMove=0,originalFlips=0;
 for(let r=1;r<31;r++){
  const prev=centers[Math.max(0,r-1)],next=centers[Math.min(30,r+1)];
  const dx=next[0]-prev[0],dz=next[2]-prev[2];
  let lateral=norm2([dz,-dx]);
  if(dot(lateral,previous)<0)lateral=lateral.map(x=>-x);
  const oldL=before.points[r*5],oldR=before.points[r*5+4];
  const oldDirection=norm2([oldR[0]-oldL[0],oldR[2]-oldL[2]]);
  if(dot(oldDirection,lateral)<0)originalFlips++;
  const width=Math.hypot(oldR[0]-oldL[0],oldR[2]-oldL[2]);
  for(let j=0;j<5;j++){
   const across=(j-2)/2,p=[centers[r][0]+across*width*.5*lateral[0],
    centers[r][1],centers[r][2]+across*width*.5*lateral[1]];
   maxMove=Math.max(maxMove,len(sub(p,before.points[r*5+j])));
   s.points[r*5+j]=p;
  }
  previous=lateral;
 }
 assert.ok(originalFlips>0,'must physically fix at least one reversed source net orientation');
 assert.ok(maxMove>1,'REAL B48 surface change');
 assert.ok(eq(s.points.slice(0,5),before.points.slice(0,5)),'road3/4 full-width seam changed');
 assert.ok(eq(doc.surfaces.slice(0,4),original.surfaces.slice(0,4)));
 assert.ok(eq(doc.surfaces.slice(5),original.surfaces.slice(5)));
 assert.ok(eq(doc.route,original.route)&&eq(doc.routeSegments,original.routeSegments));
 assert.ok(eq(doc.spawns,original.spawns)&&eq(doc.movingObstacles,original.movingObstacles));
 assert.equal(JSON.stringify(original),frozen);
 const samples=Array.from({length:301},(_,i)=>{
  const u=i/300,f=frame(s,u,.5),left=sample(s,u,0),right=sample(s,u,1);
  return {u:round(u),normal:f.normal.map(round),
   widthXZ:round(Math.hypot(right[0]-left[0],right[2]-left[2]))};
 });
 let peak=0,minUp=1;
 for(let i=1;i<samples.length;i++)peak=Math.max(peak,angle(samples[i-1].normal,samples[i].normal));
 for(const item of samples)minUp=Math.min(minUp,item.normal[1]);
 assert.ok(peak<35,'R1 actual B48 sampled normals still abruptly folded');
 assert.ok(minUp>.75,'R1 B48 road physically upside down');
 assert.equal(tessellate(s).degenerate,0);
 const next5=sample(doc.surfaces[5],0,.5),road4Exit=sample(s,1,.5);
 const gap=len(sub(road4Exit,next5));
 doc.name=original.name+' R15S3D8R1 real road4 continuous winding QA HOLD';
 doc.stageForge={...doc.stageForge,productionPromoted:false,r15s3d8r1:{
  schema:'dopagaki.r15s3d8r1-source-real-road4-winding/1',
  sourceProtectedGameBlob:SHA,world,baseStudy:'A_DISTRIBUTED_MACRO_ARC',
  realB48ControlPointModificationSection:4,originalB48Count:7,originalB51Count:28,
  realRemovedRoadCells:0,addedPhysicalOrHiddenColliders:0,
  existingRoad3SurfaceAndFullWidthSeamUnchanged:true,
  originalPhysicsCCDInputCameraGuideRouteUnchanged:true,
  sourceCrownAndEarlyScissorPreserved:true,
  oldMacroRoad4CrossOrientationRowsReversed:originalFlips,
  maximumOriginalRoad4VertexMovedM:round(maxMove),
  road4MaximumAdjacentSampledNormalAngleDegrees:round(peak),
  road4MinimumSampledNormalY:round(minUp),
  road4ExitToUnchangedRoad5EntryM:round(gap),
  oldRoad4ExitToRoad5GapM:original.stageForge.r15s3d8SourceStudy.road4EndToOriginalRoad5StartGapM,
  nextOriginalRoad5EntryXYZ:next5.map(round),
  realRoad4ExitXYZ:road4Exit.map(round),
  downstreamGapRemainsUnresolved:true,
  actualSourceWebGLTested:false,humanPlayabilityTested:false,
  actualFullCourseFinishedCertified:false,officialArt:0,officialSlope2Meters:0,
  GAMEPLAY:'HOLD',ART:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD'}};
 const verified=validate(doc);
 assert.equal(verified.surfaces.length,7);assert.equal(verified.movingObstacles.length,28);
 return verified;
}
