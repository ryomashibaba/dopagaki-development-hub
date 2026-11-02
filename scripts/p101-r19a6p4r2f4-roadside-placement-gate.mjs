/** R2F4 READ ONLY roadside placement feasibility, NO new game collider or model.
 * This script examines candidate original-road edge offsets before art.
 * Source B48 full 7 roads are DENSELY SAMPLED (NOT exact triangle clearance).
 * B51 full 2881 source native snapshots are conservatively bounded in XZ.
 * Cameras are original SOURCE ticks: project prisms, not true image occlusion.
 * Do not convert any condition herein into ART, HUMAN or RELEASE PASS.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import assert from 'node:assert/strict';
import {generateP101W9C1AbyssCandidate} from './p101-w9c1-abyss-narrow.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
const original=fs.readFileSync('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs');
const blob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+original.length+'\0'),original])).digest('hex');
assert.equal(blob,'af076d67492a677d2235e4730aef8cdf4808e106');
const cams=JSON.parse(fs.readFileSync('docs/R19_A6P3_PRIOR_A1_ORIGINAL_12_TRUE_CAMERAS.json','utf8'));
assert.equal(cams.origin.originalGitBlob,blob);
const V=(a,b)=>a.map((x,i)=>x-b[i]);
const dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);
const norm=v=>{let n=Math.hypot(...v);assert(n>1e-7);return v.map(x=>x/n)};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const projection=(shot,p)=>{
 const eye=shot.eye,f=norm(shot.front),right=norm(cross(f,[0,1,0])),up=norm(cross(right,f));
 const d=V(p,eye),z=dot(d,f);if(z<=.66)return null;
 const x=1.35*dot(d,right)/(1013/698)/z, y=1.35*dot(d,up)/z;
 return {ndc:[x,y],pixel:[1013*(1+x)/2,698*(1-y)/2],viewDepth:z,inFrustum:Math.abs(x)<=1&&Math.abs(y)<=1};
};
const settings={
 candidateHalfWidthM:7,candidateHalfDepthM:6,candidateHeightM:15,
 candidateBoundingHorizontalRadiusM:Math.hypot(7,6),
 staticSampleUIntervalsPerRoad:320,staticSampleVIntervalsAcrossRoad:12,
 B51NativeSampleHz:240,B51Ticks:2881,staticMinimumPlanarGapM:6,
 B51MinimumPlanarGapM:5};
const sites=[{id:'ROAD1_DISTRICT1_VISIBLE_8S',u:.30,tick:1921},
 {id:'ROAD1_DISTRICT2_VISIBLE_11S',u:.47,tick:2761},
 {id:'ROAD1_DISTRICT3_VISIBLE_11S',u:.64,tick:2761}];
const report={schema:'dopagaki.r2f4-actual-source-roadside-public-entrance-research-gate/1',
 sourceBlob:blob,unchangedPhysics:true,newColliders:0,artNotAdded:true,
 modes:[],candidateOffsetsM:[25,35,45],sites,
 conditions:settings,conservativeNotes:[
 'B48 nearest distance is to an original sampled road surface grid, NOT rigorous exact mesh triangle-to-solid separation',
 'The original road7 surfaces are sampled at U=1/320 and V=1/12, no terrain collision or foundation support is proven',
 'B51 min gap uses conservative horizontal circle enclosing every sampled yaw OBB; Y ignored, no swept-tick guarantee',
 'Camera frustum projection is geometric prism only, NOT true WebGL2 pixel visibility nor occlusion',
 'A pass authorizes only candidate ART prototyping, NOT human safety, source static clearance, ART release or integration'],
 certifiedB48StaticGeometryCollision:false,certifiedContinuousB51Swept:false,
 actualTerrainContact:'NOT_VERIFIED',humanAccess:'NOT_VERIFIED',
 ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
for(const mode of ['ultra','control']){
 const stage=generateP101W9C1AbyssCandidate(mode);
 assert.equal(stage.surfaces.length,7);assert.equal(stage.movingObstacles.length,28);
 const frozen=JSON.stringify(stage);
 const sourceSamples=[];
 for(let road=0;road<7;road++){
  const s=stage.surfaces[road];
  for(let i=0;i<=settings.staticSampleUIntervalsPerRoad;i++){
   const u=i/settings.staticSampleUIntervalsPerRoad;
   for(let j=0;j<=settings.staticSampleVIntervalsAcrossRoad;j++){
    const p=sample(s,u,j/settings.staticSampleVIntervalsAcrossRoad);
    assert(p.length===3&&p.every(Number.isFinite));
    sourceSamples.push({road,x:p[0],z:p[2]});
   }
  }
 }
 const frames=cams.frames.filter(x=>x.mode===mode);
 assert.deepEqual(frames.map(x=>x.tick).sort((a,b)=>a-b),[265,721,1057,1249,1921,2761]);
 // Full 240Hz source B51 moving box positions cached once, no user game state mutation.
 const bodies=[];
 for(let tick=0;tick<=2880;tick++){
  const t=tick/240;
  for(const ob of stage.movingObstacles){
   const pose=movingObstaclePose(ob,t);if(!pose.enabled)continue;
   const [hx,,hz]=pose.halfSize;
   bodies.push({tick,id:ob.id,x:pose.center[0],z:pose.center[2],
    r:Math.hypot(hx,hz)});
  }
 }
 const cases=[];
 for(const site of sites){
  const s=stage.surfaces[1];
  const center=sample(s,site.u,.5);
  const edge=sample(s,site.u,0); // left edge is negative site side
  const a=sample(s,Math.max(0,site.u-.003),.5),b=sample(s,Math.min(1,site.u+.003),.5);
  const tangent=norm([b[0]-a[0],0,b[2]-a[2]]);
  const delta=[edge[0]-center[0],0,edge[2]-center[2]];
  const n=norm(V(delta,tangent.map(x=>x*dot(delta,tangent))));
  assert(Math.abs(dot(n,tangent))<1e-7);
  const target=frames.find(x=>x.tick===site.tick);assert(target);
  for(const offsetM of [25,35,45]){
   const point=[edge[0]+n[0]*offsetM,edge[1],edge[2]+n[2]*offsetM];
   const r=settings.candidateBoundingHorizontalRadiusM;
   let minDist=Infinity,closestRoad=null;
   for(const p of sourceSamples){
    const d=Math.hypot(point[0]-p.x,point[2]-p.z);
    if(d<minDist){minDist=d;closestRoad=p.road;}
   }
   let minB51=Infinity,nearB51=null;
   for(const ob of bodies){
    const gap=Math.hypot(point[0]-ob.x,point[2]-ob.z)-ob.r-r;
    if(gap<minB51){minB51=gap;nearB51={tick:ob.tick,id:ob.id};}
   }
   const points=[];
   for(const dx of [-settings.candidateHalfDepthM,settings.candidateHalfDepthM])
    for(const dy of [-4,settings.candidateHeightM])
     for(const dz of [-settings.candidateHalfWidthM,settings.candidateHalfWidthM]){
      const p=[point[0]+n[0]*dx+tangent[0]*dz,point[1]+dy,
       point[2]+n[2]*dx+tangent[2]*dz];
      const q=projection(target,p);if(q&&q.viewDepth>.66)points.push(q);
     }
   let screen=null;
   if(points.length){
    const bnds=[Math.min(...points.map(p=>p.pixel[0])),
      Math.max(...points.map(p=>p.pixel[0])),
      Math.min(...points.map(p=>p.pixel[1])),
      Math.max(...points.map(p=>p.pixel[1]))];
    const visibleW=Math.max(0,Math.min(1013,bnds[1])-Math.max(0,bnds[0]));
    const visibleH=Math.max(0,Math.min(698,bnds[3])-Math.max(0,bnds[2]));
    screen={pixelBounds:bnds,frustumClippedAreaPixels:visibleW*visibleH,
      minSourceCameraDepthM:Math.min(...points.map(p=>p.viewDepth))};
   }
   const staticPlanarSurfaceSampleGapM=minDist-r;
   const passCamera=(screen?.frustumClippedAreaPixels??0)>=100;
   const passSampledRoad=staticPlanarSurfaceSampleGapM>=settings.staticMinimumPlanarGapM;
   const passB51=minB51>=settings.B51MinimumPlanarGapM;
   cases.push({site:site.id,mode,offsetM,pointSourceWorldXYZ:point,
    nearestB48RoadSurfaceGridSampleDistanceM:minDist,
    nearestB48RoadSampleRoadIndex:closestRoad,
    staticPlanarSurfaceSampleGapM,
    minConservativeHorizontalB51OBBGapM:minB51,nearestB51:nearB51,
    sourceCameraTick:site.tick,sourceCameraPrismProjection:screen,
    passCameraProjection:passCamera,passSampledRoad,passFullTickB51:passB51,
    eligibleForNonProductionVisualPrototype:passCamera&&passSampledRoad&&passB51,
    originalB48TriangleToBoxContact:'NOT_VERIFIED',
    nativeB51ActualPixelOcclusion:'NOT_VERIFIED',
    trueGroundSupport:'NOT_VERIFIED',humanPassage:'NOT_VERIFIED'});
  }
 }
 // R2F4 next-stage longitudinal alignment. Prior trials were all
 // 280-420m ahead even at 25m sideways; camera-relative U is essential.
 // These trials are STILL research only; no art/collider integration.
 const sweep=[];
 for(const tick of [1921,2761]){
  const target=frames.find(f=>f.tick===tick);assert(target);
  for(let uIndex=1;uIndex<=32;uIndex++){
   const u=uIndex/40;
   const s=stage.surfaces[1];
   const center=sample(s,u,.5),edge=sample(s,u,0);
   const ahead=sample(s,Math.min(1,u+.003),.5);
   const back=sample(s,Math.max(0,u-.003),.5);
   const tangent=norm([ahead[0]-back[0],0,ahead[2]-back[2]]);
   const delta=[edge[0]-center[0],0,edge[2]-center[2]];
   const n=norm(V(delta,tangent.map(x=>x*dot(delta,tangent))));
   for(const offsetM of [25,35,45]){
    const point=[edge[0]+n[0]*offsetM,edge[1],edge[2]+n[2]*offsetM];
    const r=settings.candidateBoundingHorizontalRadiusM;
    let nearest=Infinity,roadIndex=-1;
    for(const p of sourceSamples){
     const d=Math.hypot(point[0]-p.x,point[2]-p.z);
     if(d<nearest){nearest=d;roadIndex=p.road;}
    }
    let b51=Infinity,closestMoving=null;
    for(const ob of bodies){
     const d=Math.hypot(point[0]-ob.x,point[2]-ob.z)-ob.r-r;
     if(d<b51){b51=d;closestMoving={tick:ob.tick,id:ob.id};}
    }
    const projections=[];
    for(const dx of [-settings.candidateHalfDepthM,settings.candidateHalfDepthM])
     for(const dy of [-4,settings.candidateHeightM])
      for(const dz of [-settings.candidateHalfWidthM,settings.candidateHalfWidthM]){
       const p=[point[0]+n[0]*dx+tangent[0]*dz,point[1]+dy,
        point[2]+n[2]*dx+tangent[2]*dz];
       const q=projection(target,p);
       if(q)projections.push(q);
      }
    let visiblePixels=0,bounds=null,depth=Infinity;
    if(projections.length){
     depth=Math.min(...projections.map(q=>q.viewDepth));
     bounds=[Math.min(...projections.map(q=>q.pixel[0])),
      Math.max(...projections.map(q=>q.pixel[0])),
      Math.min(...projections.map(q=>q.pixel[1])),
      Math.max(...projections.map(q=>q.pixel[1]))];
     visiblePixels=Math.max(0,Math.min(1013,bounds[1])-Math.max(0,bounds[0]))*
      Math.max(0,Math.min(698,bounds[3])-Math.max(0,bounds[2]));
    }
    const centreX=bounds?(bounds[0]+bounds[1])/2:null;
    const centreY=bounds?(bounds[2]+bounds[3])/2:null;
    // Proxy for NOT covering center-track visibility: real pixel-mask
    // and hazard readability audits MUST still be done on genuine PNG.
    const peripheral=centreX!==null&&(centreX<380||centreX>660);
    const depthUseful=depth>=75&&depth<=190;
    const sampledStaticClear=nearest-r>=9;
    const movingClear=b51>=9;
    const visibleEnough=visiblePixels>=1200;
    const eligible=peripheral&&depthUseful&&sampledStaticClear&&movingClear&&visibleEnough;
    const score=eligible?(Math.min(16000,visiblePixels)*
      Math.max(.2,1-Math.abs(depth-115)/220)):0;
    sweep.push({targetNativeTick:tick,originalRoad1U:u,offsetM,
     sourceWorldXYZ:point,road7NearestSampleRoadIndex:roadIndex,
     sampledB48PlanarGapToProbeM:nearest-r,
     B51MinConservativeAllTickPlanarGapM:b51,closestMoving,
     sourceCameraMinDepthM:depth,
     projectedPixelBounds:bounds,projectedPixels:visiblePixels,
     screenCentre:[centreX,centreY],peripheralTrackViewProxy:peripheral,
     usefulDepthProxy:depthUseful,staticSamplePass:sampledStaticClear,
     B51SamplePass:movingClear,cameraSizePass:visibleEnough,
     eligibleForReadOnlyArtStudy:eligible,
     screenCandidateScore:score,
     EXACT_B48_CLEARANCE:false,
     B51_TIME_CONTINUOUS_CCD:false,
     RASTER_VISIBILITY_APPROVED:false});
   }
  }
 }
 const byTick=[1921,2761].map(tick=>{
  const ranked=sweep.filter(x=>x.targetNativeTick===tick)
   .sort((a,b)=>b.screenCandidateScore-a.screenCandidateScore);
  return {targetNativeTick:tick,
   eligibleCount:ranked.filter(x=>x.eligibleForReadOnlyArtStudy).length,
   topCandidates:ranked.filter(x=>x.eligibleForReadOnlyArtStudy).slice(0,8),
   largestRawProjection:ranked.slice().sort((a,b)=>b.projectedPixels-a.projectedPixels).slice(0,4),
   testedCandidateCount:ranked.length};
 });
 report.modes.push({mode,road7SampleCount:sourceSamples.length,
  B51EnabledPoseSnapshots:bodies.length,sourceB48RoadCount:stage.surfaces.length,
  originalB51Count:stage.movingObstacles.length,cases,
  longitudinalCameraAlignedSweep:byTick,
  longitudinalSourceRoadTrials:32*3*2});
 assert.equal(JSON.stringify(stage),frozen,'original B48/B51 stage mutated');
}
const output='r19-evidence/r19a6p4r2f4/R2F4_SOURCE_ROADSIDE_PLACEMENT_GATE.json';
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log('R2F4_ROADSIDE_STATIC_SAMPLE_AND_B51_ALL_TICKS',JSON.stringify({
 sourceBlob:blob,modes:report.modes.map(x=>({mode:x.mode,cases:x.cases.map(c=>({
 site:c.site,offset:c.offsetM,screenPixelArea:Math.round(c.sourceCameraPrismProjection?.frustumClippedAreaPixels??0),
 staticSampleGap:+c.staticPlanarSurfaceSampleGapM.toFixed(2),
 minB51Gap:+c.minConservativeHorizontalB51OBBGapM.toFixed(2),
 prototypeCandidate:c.eligibleForNonProductionVisualPrototype}))})),
 originalRoadUnchanged:true,art:'HOLD'}));
assert.equal(report.modes.length,2);
assert.equal(report.modes[0].cases.length,9);
assert.equal(report.modes[1].cases.length,9);
