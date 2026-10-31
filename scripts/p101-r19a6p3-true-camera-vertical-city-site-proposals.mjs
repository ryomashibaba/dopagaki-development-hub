/**
 * R19 A6 P3: original camera-first site planner; NO city generated.
 * Uses genuine 12 WebGL2 views and actual B48 81-station geometry + 28 B51
 * native projections. Tower silhouettes are candidate-only, not built meshes.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {sourceP3Projection} from './p101-r19a6p3-readonly-source-camera-and-b51.mjs';
const out='r19-evidence/r19a6p3';
const camera=JSON.parse(fs.readFileSync(path.join(out,'P3_ACTUAL_RAW_CAMERA_B51_12_FRAMES.json'),'utf8'));
assert.equal(camera.sourceBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
assert.equal(camera.frames.length,12);
const anchors=Object.fromEntries(['ultra','control'].map(mode=>[
 mode,JSON.parse(fs.readFileSync('r19-evidence/r19a6p2/P2_'+mode+'_real_road_anchors.json','utf8'))
]));
const sub=(a,b)=>a.map((v,k)=>v-b[k]),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const unit=v=>v.map(x=>x/Math.hypot(...v));
const bbox=v=>({xMin:Math.min(...v.map(x=>x.x)),xMax:Math.max(...v.map(x=>x.x)),
 yMin:Math.min(...v.map(x=>x.y)),yMax:Math.max(...v.map(x=>x.y))});
const overlaps=(a,b,pad=0)=>a&&b&&a.xMin<=b.xMax+pad&&a.xMax>=b.xMin-pad&&a.yMin<=b.yMax+pad&&a.yMax>=b.yMin-pad;
const clip=(a,min=-1,max=1)=>Math.max(min,Math.min(max,a));
function visibleArea(b){
 if(!b)return 0;
 return Math.max(0,clip(b.xMax)-clip(b.xMin))*Math.max(0,clip(b.yMax)-clip(b.yMin))/4;
}
const hazard=frame=>frame.actualProjection.hazards.filter(x=>x.enabled&&x.fullOBBBoundsIntersectScreen)
 .map(x=>({id:x.id,bbox:x.conservativeOBBProjectionBBoxNDC}));
const frames=Object.fromEntries(camera.frames.map(x=>[x.mode+':'+x.tick,x]));
const trials=[],distances=[],results=[];
for(const road of [0,1])for(const u of [.12,.24,.36,.48,.6,.72,.84,.94])
 for(const side of [-1,1])for(const offset of [48,90,150,220])
 for(const height of [50,95,155,225]){
  const record={road,u,side,edgeOffsetMeters:offset,verticalTowerHeightM:height,
   footprintRadiusM:18,sourceB48RoadDependent:true,siteNotYetConstructed:true,
   perMode:{},riskReasons:[],hitHazardIds:[]};
  let exposure=0,risks=0,maxClose=0;
  for(const mode of ['ultra','control']){
   const a=anchors[mode];assert.equal(a.roadCount,7);assert.equal(a.realB51,28);
   const station=a.roads[road].stations[Math.round(u*80)];
   const edge=station[side<0?'left':'right'],center=station.center;
   const nx=edge[0]-center[0],nz=edge[2]-center[2],m=Math.hypot(nx,nz);
   assert.ok(m>1);
   const outward=[nx/m,0,nz/m],tangent=station.forward;
   const p=[edge[0]+outward[0]*offset,edge[1],edge[2]+outward[2]*offset];
   const points=[];
   for(const h of [0,height])for(const x of [-1,1])for(const z of [-1,1])
     points.push([p[0]+x*outward[0]*18+z*tangent[0]*18,
      p[1]+h,p[2]+x*outward[2]*18+z*tangent[2]*18]);
   const perTick={};
   for(const tick of [265,721,1057,1249,1921,2761]){
    const f=frames[mode+':'+tick];assert.ok(f);
    const v=f.actualProjection,dist=Math.hypot(...sub(p,v.eye));
    const projected=points.map(point=>sourceP3Projection(v,point,v.viewport.width,v.viewport.height));
    const allInFront=projected.every(Boolean);
    const box=allInFront?bbox(projected):null;
    const area=visibleArea(box);
    const fullyInView=allInFront&&area>0;
    const hz=hazard(f).filter(x=>overlaps(x.bbox,box,.055));
    const central=overlaps(box,{xMin:-.45,xMax:.45,yMin:-.38,yMax:.35});
    const nativeRoad0=tick===721||tick===1057||tick===1249;
    const hazardRisk=hz.length>0&&(tick===1057||tick===721||tick===1921||tick===2761);
    const nearRoad0Risk=nativeRoad0&&fullyInView&&dist<360&&central;
    const extremeOcclusion=area>.2&&fullyInView;
    if(nearRoad0Risk)risks+=3;
    if(hazardRisk)risks+=3;
    if(extremeOcclusion)risks+=2;
    if(fullyInView&&road===1&&(tick===1921||tick===2761)){
      const x=(box.xMin+box.xMax)/2;
      const front=projected.reduce((s,p)=>s+p.depth,0)/projected.length;
      if(area>.004&&area<.18&&front>125&&front<1400&&Math.abs(x)<.88){
       exposure+=Math.min(.13,area)*Math.max(.15,1-Math.abs(x)*.65)*100;
      }
    }
    if(hazardRisk||nearRoad0Risk)record.riskReasons.push({mode,tick,
     hazardIDs:hz.map(x=>x.id),nearRoad0Risk});
    for(const z of hz)record.hitHazardIds.push(z.id);
    perTick[tick]={cameraDepthClosestM:Math.min(...projected.filter(Boolean).map(x=>x.depth),Infinity),
     projectedBBoxNDC:box,clippedVisibleAreaFraction:area,
     geometryNearClipped:!allInFront,hazardOBBOverlapIds:hz.map(x=>x.id),
     proxyRoad0CentralOcclusion:nearRoad0Risk};
   }
   record.perMode[mode]={sourceRoadAnchor:station.center,worldBase:p,perTick};
  }
  record.distinctHazardsIntersected=[...new Set(record.hitHazardIds)];
  record.screenExposureProxy=Number(exposure.toFixed(4));
  record.geometricRiskPenalty=risks;
  record.proxyRankingScore=Number((exposure-risks*8).toFixed(4));
  trials.push(record);
 }
const safe=trials.filter(x=>x.geometricRiskPenalty===0&&x.screenExposureProxy>.1)
 .sort((a,b)=>b.proxyRankingScore-a.proxyRankingScore);
const ranked=safe.slice(0,22);
const result={schema:'dopagaki.r19a6p3-actual-12source-camera-silhouette-site-gate/1',
 sourceBlob:camera.sourceBlob,sourceCamera:'ACTUAL_ORIGINAL_WEBGL2_viewForPose_at_nativeTicks',
 stageVariants:['ultra14m','control28m'],nativeB48:7,nativeMovingB51:28,
 candidateCount:trials.length,noActualCityProduced:true,
 proxyOBBBoundsNotActualOcclusion:true,screenExperienceNotValidated:true,
 noFinalMaterialLightingOrInhabitedArchitecture:true,
 safeProxyCandidateCount:safe.length,rankedResearchSites:ranked,
 objective:'road1 frontal inhabited towers, road0 hazard/central readability; no horizontal ribbons',
 ART:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',GAMEPLAY:'HOLD',MERGE:'HOLD'};
fs.writeFileSync(path.join(out,'P3_CAMERA_GROUNDED_VERTICAL_CITY_SITE_PROPOSALS.json'),
 JSON.stringify(result,null,2)+'\n');
console.log('P3_ACTUAL_CAMERA_SITE_STUDY',JSON.stringify({
 candidates:trials.length,safeProxy:safe.length,top:ranked.slice(0,5).map(x=>({
 road:x.road,u:x.u,side:x.side,offsetM:x.edgeOffsetMeters,
 heightM:x.verticalTowerHeightM,score:x.proxyRankingScore
 })),ART:'HOLD',pixelOcclusion:'NOT_MEASURED'}));
// A lack of qualified sites is an informative HOLD, NOT reason to fake camera
// suitability or loosen the dangerous B51 envelope.
// No formal ART approval can be made from these proxies.
