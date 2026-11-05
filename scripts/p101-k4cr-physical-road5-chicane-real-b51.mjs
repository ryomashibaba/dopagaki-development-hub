/** K4CR: PHYSICAL, not scenic, one-sector Road5 banked two-choice chicane.
 * Modifies only an isolated research JSON (already separate D9 16m Road5).
 * Restores original Road4/5/6 seams, original native Runner/240Hz/Camera.
 * D11 B_INNER_CROSSING keeps original 28 actual B51 machines, relocates SIX.
 * No source/Gold/main/official P101 write and NO official approval.
 */
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {buildR15S3D11} from './p101-r15s3d11-six-real-b51-lane-reanchor-candidates.mjs';
import {sample,frame,tessellate,validate} from '../private/reference_only/director/surface.js';
const sha=d=>crypto.createHash('sha256').update(JSON.stringify(d)).digest('hex');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const N=30,W=16,MAX_LATERAL=57,CREST=20,MAX_BANK_DEGREES=9;
const vlen=v=>Math.hypot(...v);
const dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);
const diff=(a,b)=>a.map((v,i)=>v-b[i]);
const norm=x=>{const n=vlen(x)||1;return x.map(v=>v/n)};
const beforeHash='39d66c47cfce3718871c5450f8594dfd10a2a31b7bbb70dd5634d1cb4c73922f';
const originalGameBlob='af076d67492a677d2235e4730aef8cdf4808e106';
const anchors=[{road:5,u:.16,v:.66},{road:5,u:.43,v:.34},{road:5,u:.74,v:.66},
  {road:6,u:.18,v:.34},{road:6,u:.47,v:.66},{road:6,u:.77,v:.34}];
const rnd=n=>+n.toFixed(5);
export function makeK4CRPhysical(source){
 assert.ok(source.stageForge?.r15s3d10Private?.world==='true-pinch');
 assert.equal(source.stageForge.r15s3d9?.mode,'A_CONTINUOUS_NARROW_MACRO');
 assert.equal(source.surfaces.length,7);assert.equal(source.movingObstacles.length,28);
 assert.equal(sha(source.surfaces[5].points),beforeHash,'old protected RESEARCH Road5 mismatch');
 const immutable=JSON.stringify(source),doc=structuredClone(source);
 const s=doc.surfaces[5],base=source.surfaces[5],oldCenters=Array.from({length:31},(_,r)=>base.points[r*5+2]);
 const oldEdge=norm([base.points[4][0]-base.points[0][0],base.points[4][2]-base.points[0][2]]);
 const centers=[],sideShift=[];
 for(let r=0;r<=N;r++){
   const u=r/N,c=oldCenters[r];
   const prev=oldCenters[Math.max(0,r-1)],next=oldCenters[Math.min(N,r+1)];
   const heading=diff(next,prev);
   let side=norm([heading[2],-heading[0]]);
   if(dot(side,oldEdge)<0)side=side.map(v=>-v);
   // Two opposing REAL horizontal turning lobes and 20m REAL crest.
   // Exact seam endpoints and endpoint derivatives remain unaltered.
   const lateral=MAX_LATERAL*Math.sin(Math.PI*u)*Math.sin(2*Math.PI*u);
   const elevation=CREST*Math.sin(Math.PI*u)**2;
   centers.push([c[0]+lateral*side[0],c[1]+elevation,c[2]+lateral*side[1]]);
   sideShift.push(lateral);
 }
 let prevSide=oldEdge,bankMax=0,maxVertexMoved=0;
 for(let r=0;r<=N;r++){
   if(r===0||r===N)continue; // Exact 5-vertex seams to old Road4 and unchanged Road6.
   const u=r/N,prev=centers[r-1],next=centers[r+1],head=diff(next,prev);
   let side=norm([head[2],-head[0]]);
   if(dot(side,prevSide)<0)side=side.map(v=>-v);
   prevSide=side;
   const bank=MAX_BANK_DEGREES*Math.sin(2*Math.PI*u)*Math.sin(Math.PI*u)**2;
   bankMax=Math.max(bankMax,Math.abs(bank));
   for(let j=0;j<5;j++){
     const across=(j-2)*W/4;
     const p=[centers[r][0]+across*side[0],
       centers[r][1]+across*Math.tan(bank*Math.PI/180),
       centers[r][2]+across*side[1]];
     maxVertexMoved=Math.max(maxVertexMoved,vlen(diff(p,base.points[r*5+j])));
     s.points[r*5+j]=p;
   }
 }
 assert.ok(maxVertexMoved>25&&bankMax>5);
 assert.ok(same(s.points.slice(0,5),base.points.slice(0,5)));
 assert.ok(same(s.points.slice(-5),base.points.slice(-5)));
 assert.ok(same(doc.surfaces.slice(0,5),source.surfaces.slice(0,5)));
 assert.ok(same(doc.surfaces[6],source.surfaces[6]));
 const realB51=buildR15S3D11('true-pinch','B_INNER_CROSSING');
 assert.ok(same(realB51.surfaces,source.surfaces),'D11 must inherit exactly original D9 macro');
 assert.ok(same(realB51.movingObstacles.slice(0,22),source.movingObstacles.slice(0,22)));
 doc.movingObstacles=structuredClone(realB51.movingObstacles);
 const changes=[];
 for(let i=0;i<6;i++){
  const o=doc.movingObstacles[22+i],old=source.movingObstacles[22+i],a=anchors[i];
  if(a.road===5){
    const s=doc.surfaces[5],p=sample(s,a.u,a.v),l=sample(s,a.u,0),r=sample(s,a.u,1);
    const axis=norm([r[0]-l[0],0,r[2]-l[2]]);
    o.position=[p[0],p[1]+1.9,p[2]];
    if(o.type==='slider')o.motion={...o.motion,axis,amplitude:3.2};
  }
  assert.equal(o.id,old.id);assert.equal(o.type,old.type);
  assert.equal(o.period,old.period);assert.equal(o.phase,old.phase);
  assert.ok(same(o.collision,old.collision));
  assert.ok(!same(o,old),'six real B51 must physically change');
  changes.push({id:o.id,type:o.type,road:a.road,u:a.u,laneV:a.v,position:o.position,
    originalIdAndCollisionModePreserved:true,actualOriginalMovingSolid:true});
 }
 assert.ok(same(doc.movingObstacles.slice(0,22),source.movingObstacles.slice(0,22)));
 assert.ok(same(doc.route,source.route)&&same(doc.routeSegments,source.routeSegments));
 assert.ok(same(doc.spawns,source.spawns)&&same(doc.fixtures,source.fixtures));
 const rows=Array.from({length:301},(_,i)=>{
  const u=i/300,n=frame(s,u,.5).normal,l=sample(s,u,0),r=sample(s,u,1);
  return {nY:n[1],width:vlen([r[0]-l[0],r[2]-l[2]])};
 });
 const minNormalY=Math.min(...rows.map(x=>x.nY));
 const minWidth=Math.min(...rows.map(x=>x.width)),maxWidth=Math.max(...rows.map(x=>x.width));
 assert.ok(minNormalY>.62,'REAL road has dangerous inverted sampled normals: '+minNormalY);
 assert.ok(minWidth>13&&maxWidth<19,'REAL 16m road visual/physical width drift');
 assert.equal(tessellate(s).degenerate,0);
 assert.equal(sha(source.surfaces[5].points),beforeHash);
 assert.equal(JSON.stringify(source),immutable);
 const signature=sha(s.points),hazardSignature=sha(doc.movingObstacles);
 assert.notEqual(signature,beforeHash);
 doc.name=source.name+' K4CR genuine 2-lobe banked chicane / B51 INNER CROSSING PRIVATE HOLD';
 doc.stageForge={...doc.stageForge,productionPromoted:false,recordStageId:'K4CR-PHYSICAL-HOLD',
  k4crPrivate:{schema:'k4cr-real-road5-banked-s-bend-6-true-b51-v1',
   sourceOriginalGameBlob:originalGameBlob,sourceR15S3D9Road5SHA256:beforeHash,
   modifiedResearchRoad5SHA256:signature,modifiedSixB51SHA256:hazardSignature,
   changedPhysicalRoads:[5],untouchedPhysicalRoads:[0,1,2,3,4,6],
   exactRoad4To5AndRoad5To6FiveVertexSeams:true,
   physicalMaxLateralEnvelopeM:MAX_LATERAL,realMeasuredMaxCenterSideShiftM:rnd(Math.max(...sideShift.map(Math.abs))),
   extraRealCrestElevationM:CREST,measuredPeakBankDegrees:rnd(bankMax),
   controlNetMaxVertexChangeM:rnd(maxVertexMoved),roadMinimumSampleNormalY:rnd(minNormalY),
   minRoadWidthXZ:rnd(minWidth),maxRoadWidthXZ:rnd(maxWidth),
   originalRealB48:7,originalRealMovingB51:28,realRelocatedB51:changes,
   sourcePhysicsInputCameraRunnerCCD240HzUnchanged:true,extraColliders:0,
   formalART:0,formalSlope2DNAM:0,HUMAN:'HOLD',ART:'HOLD',SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'}};
 const verified=validate(doc);
 assert.equal(verified.surfaces.length,7);assert.equal(verified.movingObstacles.length,28);
 return verified;
}
