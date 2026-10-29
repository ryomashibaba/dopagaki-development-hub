/** R15S3D8R2: an EXPLICIT private physical B48 road4->original road5
 * long-distance connector using endpoint-tangent Hermite control lattice.
 * NO invisible floors, automatic player steering, or original game edits.
 *
 * Falsification: a C0 seam, smooth normals, or t=85 status="running" alone
 * cannot prove real native road5 recontact or full-course completion.
 */
import assert from 'node:assert/strict';
import {buildR15S3D8R1} from './p101-r15s3d8r1-original-road4-continuous-physical-winding.mjs';
import {frame,sample,tessellate,validate} from '../private/reference_only/director/surface.js';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const mag=v=>Math.hypot(...v), sub=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const norm=v=>{const n=mag(v)||1;return v.map(x=>x/n)};
const angle=(a,b)=>Math.acos(Math.max(-1,Math.min(1,dot(a,b)/(mag(a)*mag(b)||1))))*180/Math.PI;
const round=x=>Number(x.toFixed(6));
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function hermite(a,b,v0,v1,t){
 const t2=t*t,t3=t2*t;
 return a.map((x,k)=>(2*t3-3*t2+1)*x+(t3-2*t2+t)*v0[k]+(-2*t3+3*t2)*b[k]+(t3-t2)*v1[k]);
}
export function buildR15S3D8R2(world){
 assert.ok(['true-pinch','pinch-switch'].includes(world));
 const base=buildR15S3D8R1(world),before=JSON.stringify(base),doc=structuredClone(base);
 const lower=doc.surfaces[3],bridge=doc.surfaces[4],next=doc.surfaces[5],old=base.surfaces[4];
 assert.equal(bridge.rows,31);assert.equal(bridge.cols,5);assert.equal(next.cols,5);
 // Exact existing road3 exit and next ORIGINAL road5 entrance in REAL source world.
 const start=base.surfaces[4].points[2],end=next.points[2];
 const road3=base.surfaces[3];
 const t0=norm(sub(road3.points[30*5+2],road3.points[29*5+2]));
 const t1=norm(sub(next.points[5+2],next.points[2]));
 // Design hypothesis: over ~2km physical corridor distributed across all
 // 30 longitudinal rows, C1 endpoint headings on actual source control grid.
 const sourceSeparation=mag(sub(end,start));
 const v0=t0.map(x=>x*sourceSeparation*.8),v1=t1.map(x=>x*sourceSeparation*.55);
 const centers=Array.from({length:31},(_,r)=>hermite(start,end,v0,v1,r/30));
 const startLateral=norm([old.points[4][0]-old.points[0][0],old.points[4][2]-old.points[0][2]]);
 const endLateral=norm([next.points[4][0]-next.points[0][0],next.points[4][2]-next.points[0][2]]);
 const initialWidth=mag([old.points[4][0]-old.points[0][0],old.points[4][2]-old.points[0][2]]);
 const finalWidth=mag([next.points[4][0]-next.points[0][0],next.points[4][2]-next.points[0][2]]);
 let lateral=[...startLateral],largest=0;
 for(let r=1;r<30;r++){
  const p=centers[Math.max(0,r-1)],q=centers[Math.min(30,r+1)];
  const delta=sub(q,p);
  let side=norm([delta[2],-delta[0]]);
  if(dot(side,lateral)<0)side=side.map(x=>-x);
  lateral=side;
  const width=initialWidth+(finalWidth-initialWidth)*r/30;
  for(let j=0;j<5;j++){
   const a=(j-2)/2;
   const vertex=[centers[r][0]+a*width*.5*side[0],
     centers[r][1],centers[r][2]+a*width*.5*side[1]];
   assert.ok(vertex.every(Number.isFinite)&&vertex.every(x=>Math.abs(x)<2000));
   largest=Math.max(largest,mag(sub(vertex,old.points[r*5+j])));
   bridge.points[r*5+j]=vertex;
  }
 }
 // Both existing B48 seam edges, all 5 real vertices; not just visual centre.
 for(let j=0;j<5;j++)bridge.points[30*5+j]=[...next.points[j]];
 assert.ok(eq(bridge.points.slice(0,5),old.points.slice(0,5)));
 assert.ok(eq(bridge.points.slice(30*5),next.points.slice(0,5)));
 assert.ok(eq(doc.surfaces.slice(0,4),base.surfaces.slice(0,4)));
 assert.ok(eq(doc.surfaces.slice(5),base.surfaces.slice(5)));
 assert.ok(eq(doc.movingObstacles,base.movingObstacles));
 assert.ok(eq(doc.route,base.route)&&eq(doc.routeSegments,base.routeSegments));
 assert.ok(eq(doc.spawns,base.spawns));
 assert.equal(JSON.stringify(base),before);
 assert.ok(largest>100,'no real macro lattice change');
 assert.equal(tessellate(bridge).degenerate,0);
 const readings=Array.from({length:301},(_,i)=>{
  const u=i/300,f=frame(bridge,u,.5);
  return {u:round(u),normal:f.normal.map(round),centre:sample(bridge,u,.5).map(round)};
 });
 let maxNormal=0,minNormalY=1,maxAbsCoordinate=0;
 for(let i=1;i<readings.length;i++)maxNormal=Math.max(maxNormal,angle(readings[i-1].normal,readings[i].normal));
 for(const item of readings){
  minNormalY=Math.min(minNormalY,item.normal[1]);
  maxAbsCoordinate=Math.max(maxAbsCoordinate,...item.centre.map(Math.abs));
 }
 const nextRoadSeam=mag(sub(sample(bridge,1,.5),sample(next,0,.5)));
 const pStart=sample(bridge,0,.5),pEnd=sample(bridge,1,.5);
 const sourceTargetDistance=mag(sub(pEnd,pStart));
 const endHeading=angle(frame(bridge,1,.5).forward,frame(next,0,.5).forward);
 const lateralAtEnd=angle(sub(bridge.points[30*5+4],bridge.points[30*5]),sub(next.points[4],next.points[0]));
 const frameAtSeam=frame(bridge,1,.5);
 doc.name=base.name+' R15S3D8R2 REAL 2KM B48 EXISTING ROAD5 LINK HOLD';
 doc.stageForge={...doc.stageForge,productionPromoted:false,r15s3d8r2:{
  schema:'dopagaki.r15s3d8r2-real-existing-B48-to-road5-hermite/1',
  sourceOriginalGameBlob:SHA,world,
  newHiddenColliders:0,originalB48RoadCount:7,originalB51Count:28,
  modifiedExistingB48Section:4,entireCROWNAndSCISSORPreserved:true,
  originalRunnerCCDSteeringCameraGuideAndRouteFrozen:true,
  widthAtSourceM:round(initialWidth),widthAtExistingRoad5M:round(finalWidth),
  newMacroControlPointLargestChangeM:round(largest),
  nearestRoad5RealEndToEntrySeamM:round(nextRoadSeam),
  road4EndToRoad5ForwardAngleDeg:round(endHeading),
  road4EndToRoad5LateralAngleDeg:round(lateralAtEnd),
  road4MaxAdjacentObservedSampledFrameNormalAngleDeg:round(maxNormal),
  road4MinimumSampledFrameNormalY:round(minNormalY),
  road4MaximumAbsCentreCoordinateM:round(maxAbsCoordinate),
  road4OriginalSourceSeparationM:round(sourceSeparation),
  bridgeCurveChordDistanceM:round(sourceTargetDistance),
  originalFollowingRoad5StartXYZ:end.map(round),actualRoad4ExitXYZ:pEnd.map(round),
  noActualCollisionContinuityOrFullFinishCertified:true,
  actualBrowserWebGL:false,humanFairnessCertified:false,officialArt:0,officialSlope2Meters:0,
  GAMEPLAY:'HOLD',ART:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD'}};
 const valid=validate(doc);
 assert.equal(valid.surfaces.length,7);assert.equal(valid.movingObstacles.length,28);
 return valid;
}
