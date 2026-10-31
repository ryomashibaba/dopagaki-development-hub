/** R15S3D8: two REAL two-B48 macro road designs after frozen R15S3D6R1
 * source CROWN and SCISSOR. Study geometry only. No source physics, HUD,
 * camera, guide, steering, moving machines, or production change.
 *
 * A: long supported large-radius two-road turn.
 * B: different turn timing plus ACTUAL absent B48 physical cells (honest gap).
 * Any "running" 45s is explicitly NOT a full-course finish.
 */
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {buildR15S3D6R1} from './p101-r15s3d6r1-real-lower-b48-runout-candidate.mjs';
import {frame,sample,tessellate,validate} from '../private/reference_only/director/surface.js';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const round=x=>Number(x.toFixed(6));
const mag=v=>Math.hypot(...v),sub=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);
const norm=v=>{const n=mag(v)||1;return v.map(x=>x/n)};
const ANGLE=(a,b)=>Math.acos(Math.max(-1,Math.min(1,dot(norm(a),norm(b)))))*180/Math.PI;
const configs=Object.freeze({
 A_DISTRIBUTED_MACRO_ARC:{
  character:'Two-road spatially distributed high-speed turn, no intentional flight gap',
  lower:[[9,-1646.5,-4.45,363.5],[10,-1674,-4.5,375],[12,-1728,-4,412],
   [15,-1807,-3,505],[18,-1878,-2,630],[21,-1905,-1,820],
   [24,-1855,0,1005],[27,-1710,2,1180],[30,-1510,5,1335]],
  following:[[0,-1510,5,1335],[1,-1450,6,1380],[5,-1210,8,1510],
   [10,-890,12,1600],[15,-560,16,1590],[20,-250,22,1480],
   [25,-30,30,1270],[30,100,36,1020]],widthAtEnd:16,gap:false
 },
 B_REAL_AIRBORNE_TRANSFER:{
  character:'Later broad turning approach with two tessellation cells honestly missing near LOWER exit',
  lower:[[9,-1646.5,-4.45,363.5],[10,-1675,-4.3,376],[12,-1735,-2.6,406],
   [15,-1828,-1,458],[18,-1910,2,550],[21,-1945,3,695],
   [24,-1920,7,850],[27,-1780,10,1045],[30,-1580,13,1195]],
  following:[[0,-1580,13,1195],[1,-1510,16,1250],[5,-1230,20,1450],
   [10,-890,29,1560],[15,-540,35,1600],[20,-230,42,1520],
   [25,-40,49,1320],[30,80,60,1070]],widthAtEnd:16,gap:true
 }
});
export const MODES=Object.freeze(Object.keys(configs));
function centre(anchors,row){
 if(row<=anchors[0][0])return anchors[0].slice(1);
 for(let i=1;i<anchors.length;i++){
  const a=anchors[i-1],b=anchors[i];
  if(row<=b[0]){const t=(row-a[0])/(b[0]-a[0]);return [1,2,3].map(k=>a[k]*(1-t)+b[k]*t);}
 }
 return anchors.at(-1).slice(1);
}
function designSurface(s,original,anchors,first,last,endWidth,followFirst=false){
 let largest=0;
 for(let row=first;row<=last;row++){
  const c=centre(anchors,row),prev=centre(anchors,Math.max(anchors[0][0],row-1)),next=centre(anchors,Math.min(anchors.at(-1)[0],row+1));
  let [px,pz]=norm([next[2]-prev[2],-(next[0]-prev[0])]);
  const left=original.points[row*5],right=original.points[row*5+4];
  const oldW=Math.hypot(right[0]-left[0],right[2]-left[2]);
  const [ox,oz]=norm([right[0]-left[0],right[2]-left[2]]);
  if(px*ox+pz*oz<0){px=-px;pz=-pz;}
  const width=row===first&&first>0?oldW:Math.max(10,endWidth);
  for(let col=0;col<5;col++){
   const a=(col-2)/2;
   const p=[c[0]+a*width*.5*px,c[1],c[2]+a*width*.5*pz];
   assert.ok(p.every(Number.isFinite));
   largest=Math.max(largest,mag(sub(p,original.points[row*5+col])));
   s.points[row*5+col]=p;
  }
 }
 return largest;
}
function roadGeometry(road){
 const readings=[];
 for(let r=9;r<=30;r++){
  const u=r/30,t=frame(road,u,.5),c=sample(road,u,.5);
  readings.push({row:r,u:round(u),centre:c.map(round),tangent:t.forward.map(round),
    frameNormal:t.normal.map(round),
    widthXZ:round(Math.hypot(...[0,2].map(i=>sample(road,u,1)[i]-sample(road,u,0)[i])))});
 }
 let biggestTurn=0,biggestNormal=0;
 for(let i=1;i<readings.length;i++){
  biggestTurn=Math.max(biggestTurn,ANGLE(readings[i-1].tangent,readings[i].tangent));
  biggestNormal=Math.max(biggestNormal,ANGLE(readings[i-1].frameNormal,readings[i].frameNormal));
 }
 return {sampledRows:readings,maxSampledAdjacentRowTangentDegrees:round(biggestTurn),
 maxSampledAdjacentRowFrameNormalDegrees:round(biggestNormal)};
}
export function buildR15S3D8(world,mode){
 assert.ok(['true-pinch','pinch-switch'].includes(world));
 assert.ok(Object.hasOwn(configs,mode));
 const spec=configs[mode],base=buildR15S3D6R1(world),sourceSnapshot=JSON.stringify(base);
 const doc=structuredClone(base);
 const lower=doc.surfaces[3],following=doc.surfaces[4],baseLower=base.surfaces[3],baseFollow=base.surfaces[4];
 assert.equal(lower.rows,31);assert.equal(lower.cols,5);
 assert.equal(following.rows,31);assert.equal(following.cols,5);
 // Rebuild lower from row 10 on. Prefix 0..8 and the known 9th crossing
 // from the source-native landing remain unchanged. A *single* physical road
 // becomes a long macro curve, rather than being pulled to old row20.
 const oldL0=JSON.stringify(lower.points.slice(0,9*5));
 const roadSeam=baseLower.points.slice(30*5).map(p=>[...p]);
 const changedLower=designSurface(lower,baseLower,spec.lower,10,30,spec.widthAtEnd);
 assert.equal(JSON.stringify(lower.points.slice(0,9*5)),oldL0);
 // Explicitly rewrite next B48 full control grid; original route remains
 // untouched (and therefore human / route compatibility remains HOLD).
 const changedNext=designSurface(following,baseFollow,spec.following,0,30,spec.widthAtEnd);
 // Match all five physical edge control vertices, not only centreline.
 // row1 follows its own tangent, so a seam is position-C0, not guaranteed C1.
 for(let j=0;j<5;j++)following.points[j]=[...lower.points[30*5+j]];
 if(spec.gap){
  const i=24*lower.resolution;
  const originalCells=new Set(lower.voidLongitudinalCells??[]);
  originalCells.add(i);originalCells.add(i+1);
  lower.voidLongitudinalCells=[...originalCells].sort((a,b)=>a-b);
 }
 assert.equal(JSON.stringify(doc.surfaces.slice(0,3)),JSON.stringify(base.surfaces.slice(0,3)));
 assert.equal(JSON.stringify(doc.surfaces.slice(5)),JSON.stringify(base.surfaces.slice(5)));
 assert.ok(eq(doc.movingObstacles,base.movingObstacles));
 assert.ok(eq(doc.route,base.route)&&eq(doc.routeSegments,base.routeSegments));
 assert.ok(eq(doc.spawns,base.spawns));
 assert.equal(JSON.stringify(base),sourceSnapshot);
 const seam=mag(sub(sample(lower,1,.5),sample(following,0,.5)));
 assert.ok(seam<1e-6,'next physical B48 centre seam');
 for(let j=0;j<5;j++)assert.ok(mag(sub(lower.points[30*5+j],following.points[j]))<1e-8);
 const nextRoadExit=sample(following,1,.5),untouchedNext=sample(doc.surfaces[5],0,.5);
 const unverifiedDownstreamGap=mag(sub(nextRoadExit,untouchedNext));
 assert.ok(changedLower>1&&changedNext>1,'actual B48 macro change');
 const m1=tessellate(lower),m2=tessellate(following);
 assert.equal(m1.degenerate,0);assert.equal(m2.degenerate,0);
 const geo=roadGeometry(lower);
 const followingGeo=roadGeometry(following);
 const hash=crypto.createHash('sha256').update(JSON.stringify([lower.points,following.points,lower.voidLongitudinalCells??[]])).digest('hex');
 doc.name=base.name+' PRIVATE R15S3D8 '+mode+' REAL TWO ROAD STUDY';
 doc.stageForge={...doc.stageForge,productionPromoted:false,
  r15s3d8SourceStudy:{sourceGameBlob:SHA,world,mode,designCharacter:spec.character,
   nativeRoadCount:7,originalB51Count:28,editedRealPhysicalB48Indices:[3,4],
   protectedEntireCROWNAndEarlySCISSOR:true,originalPhysicsGuideSteeringCameraUnmodified:true,
   originalRouteUnchanged:true,additionalHiddenPhysicalColliders:0,
   physicallyRemovedRoadCells:spec.gap?2:0,
   actualRoad3LargestControlVertexMoveM:round(changedLower),
   actualRoad4LargestControlVertexMoveM:round(changedNext),
   trueRoad3Road4CentreSeamM:round(seam),
   road4EndToOriginalRoad5StartGapM:round(unverifiedDownstreamGap),
   road3Original9To30Sampled:geo,
   road4Sampled:followingGeo,
   geometryHash:hash,
   sourceHumanGuidanceCanBeWrong:true,noSourceWebGL:true,
   finishNotCertified:true,artApproved:0,slope2ApprovedMeters:0,
   GAMEPLAY:'HOLD',ART:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD'}};
 const valid=validate(doc);
 assert.equal(valid.surfaces.length,7);assert.equal(valid.movingObstacles.length,28);
 return valid;
}
