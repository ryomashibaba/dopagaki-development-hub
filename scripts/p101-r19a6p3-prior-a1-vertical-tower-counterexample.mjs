/**
 * R19 A6 P3: recover A1's previously PROVED 12 real source cameras and
 * falsify naive narrow freestanding cuboid towers ahead of Road1.
 * This program never renders or builds towers; it is an independent
 * original-source geometric study, not B51 raster visibility.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {generateP101W9C1AbyssCandidate} from './p101-w9c1-abyss-narrow.mjs';
import {sample} from '../private/reference_only/director/surface.js';
const source=fs.readFileSync('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs');
const blob=crypto.createHash('sha1').update(Buffer.concat([
 Buffer.from('blob '+source.length),Buffer.from([0]),source])).digest('hex');
assert.equal(blob,'af076d67492a677d2235e4730aef8cdf4808e106');
const a1=JSON.parse(fs.readFileSync('docs/R19_A6P3_PRIOR_A1_ORIGINAL_12_TRUE_CAMERAS.json','utf8'));
assert.equal(a1.origin.originalGitBlob,blob);
assert.equal(a1.frames.length,12);
const ticks=[265,721,1057,1249,1921,2761];
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const mul=(a,n)=>a.map(x=>x*n);
const unit=a=>mul(a,1/Math.hypot(...a));
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],
 a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const width=24;
const cam=new Map(a1.frames.map(x=>{
 const front=unit(x.front),right=unit(cross(front,[0,1,0])),
       up=unit(cross(right,front));
 assert.ok(Math.abs(dot(up,right))<1e-6);
 assert.deepEqual(x.viewport,[1013,698]);
 return [x.mode+':'+x.tick,{eye:x.eye,front,right,up,aspect:1013/698}];
}));
const extent=(c,points)=>{
 const rays=points.map(p=>{
  const d=sub(p,c.eye),depth=dot(d,c.front);
  if(depth<=.66)return null;
  return {x:1.35*dot(d,c.right)/c.aspect/depth,
   y:1.35*dot(d,c.up)/depth,depth};
 });
 if(rays.some(p=>!p))return null;
 return {x0:Math.min(...rays.map(p=>p.x)),x1:Math.max(...rays.map(p=>p.x)),
  y0:Math.min(...rays.map(p=>p.y)),y1:Math.max(...rays.map(p=>p.y))};
};
const coverage=(b,rect)=>{
 if(!b)return 0;
 const w=Math.max(0,Math.min(b.x1,rect.x1)-Math.max(b.x0,rect.x0));
 const h=Math.max(0,Math.min(b.y1,rect.y1)-Math.max(b.y0,rect.y0));
 return w*h/4;
};
const screen={x0:-1,x1:1,y0:-1,y1:1};
const central={x0:-.7,x1:.7,y0:-.4,y1:.55};
const bySite=new Map();
const rows=[...Array(34)].map((_,j)=>7+j*2);
for(const mode of ['ultra','control']){
 const stage=generateP101W9C1AbyssCandidate(mode);
 assert.equal(stage.surfaces.length,7);assert.equal(stage.movingObstacles.length,28);
 const road=stage.surfaces[1];
 for(const row of rows){
  const u=row/80,center=sample(road,u,.5);
  const prev=sample(road,Math.max(0,u-.003),.5),
        next=sample(road,Math.min(1,u+.003),.5);
  const delta=sub(next,prev),forward=unit([delta[0],0,delta[2]]);
  for(const side of ['left','right']){
   const edge=sample(road,u,side==='left'?0:1);
   const dx=sub(edge,center),outward=unit([dx[0],0,dx[2]]);
   for(const edgeDistanceM of [55,90,135,185,250])
    for(const towerHeightM of [70,110,160,230]){
     const foot=add(edge,mul(outward,edgeDistanceM));
     const corners=[];
     for(const a of [-12,12])for(const b of [-12,12])for(const h of [0,towerHeightM]){
      corners.push(add(add(add(foot,mul(outward,a)),mul(forward,b)),[0,h,0]));
     }
     const key=JSON.stringify([row,side,edgeDistanceM,towerHeightM]);
     const cameraBoxes=Object.fromEntries(ticks.map(t=>[t,extent(cam.get(mode+':'+t),corners)]));
     const road1Coverage={
      at8s:coverage(cameraBoxes[1921],screen),
      at11s:coverage(cameraBoxes[2761],screen)
     };
     const road0Central={
      at3s:coverage(cameraBoxes[721],central),
      at4s:coverage(cameraBoxes[1057],central),
      at5s:coverage(cameraBoxes[1249],central)
     };
     const record={mode,road1u:u,side,edgeDistanceM,towerHeightM,
      originalB48Road:road.id,worldFoot:foot.map(v=>Number(v.toFixed(3))),
      road1Coverage,road0Central,
      anyRoad1Visible:Math.max(...Object.values(road1Coverage))>.003,
      zeroRoad0CentralOverlap:Object.values(road0Central).every(v=>v===0)};
     if(!bySite.has(key))bySite.set(key,[]);
     bySite.get(key).push(record);
    }
  }
 }
}
const pairs=[...bySite.values()];
assert.equal(pairs.length,34*2*5*4);
assert.ok(pairs.every(x=>x.length===2),'14m and 28m must both be present');
const visible=pairs.filter(pair=>pair.every(v=>v.anyRoad1Visible));
const zeroOverlap=visible.filter(pair=>pair.every(v=>v.zeroRoad0CentralOverlap));
const riskRanking=visible.map(pair=>{
 const [a,b]=pair;
 return {u:a.road1u,side:a.side,edgeDistanceM:a.edgeDistanceM,
  towerHeightM:a.towerHeightM,foot:a.worldFoot,
  road1VisibleAreaMin:Math.min(...pair.map(v=>v.road1Coverage.at8s+v.road1Coverage.at11s)),
  road0CentralOverlapMax:Math.max(...pair.flatMap(v=>Object.values(v.road0Central))),
  notProvenB51Safe:true};
}).sort((a,b)=>b.road1VisibleAreaMin-a.road1VisibleAreaMin);
const result={schema:'dopagaki.r19a6p3-previous-real-A1-camera-road1-vertical-tower-negative-gate/1',
 sourceBlob:blob,A1TrueOriginalCameraEvidence:a1.origin,
 testedActualCameraSnapshots:12,nativeSourceRoads:7,originalB51:28,
 proposalGeometry:'24m x 24m solid cuboid silhouette, 4 heights, 5 road setbacks, 34 road1 stations, both road widths',
 totalCandidateSites:pairs.length,road1VisibleInBothVariants:visible.length,
 strictRoad0ZeroCentralOverlapAndRoad1Visible:zeroOverlap.length,
 restrictions:'No real B51 OBB visibility here. This is an intentionally overconservative pre-P3 camera gate, not a hazard safety certification.',
 topRoad1CoverageDespiteRoad0Risk:riskRanking.slice(0,15),
 sourcePhysicalStageNotMutated:true,actualMeshCreated:false,
 noAutomaticARTApproval:true,ART:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',GAMEPLAY:'HOLD',RELEASE:'HOLD'};
const out=path.resolve('test-results/r19a6p3-prior-a1');
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'P3_PRIOR_A1_SOLID_TOWER_FALSIFICATION.json'),
 JSON.stringify(result,null,2)+'\n');
console.log('P3_PRIOR_A1_NATIVE_12_CAMERA_INDEPENDENT_RESEARCH',
 JSON.stringify({total:pairs.length,road1Visible:visible.length,zeroRoad0Central:zeroOverlap.length,
  ART:'HOLD',B51Occlusion:'NOT_TESTED',artCityBuilt:false}));
