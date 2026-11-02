/**
 * R18 source camera-first temporal landmark/site planner, NOT city construction.
 * Input only real R15S3D15 recorded source WebGL2 240Hz camera projections.
 * Distances/screen coordinates and conservative 64s/67s close-up risk determine
 * physically grounded sites; score is not an art ranking.
 */
import fs from 'node:fs';import path from 'node:path';
import assert from 'node:assert/strict';import crypto from 'node:crypto';
const sourceFile=process.argv[2],outDir=process.argv[3]||'test-results/r18-site-planner';
assert(sourceFile,'Pass archived genuine R15S3D15 camera json');
const buf=fs.readFileSync(sourceFile),d=JSON.parse(buf);
assert.equal(d.schema,'r15s3d15-true-original-webgl2-240hz-camera-projection/1');
assert.equal(d.sourceBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
assert.equal(d.allB48,7);assert.equal(d.originalB51,28);
const worlds=['true-pinch','pinch-switch'],times=[54,58,61,64,67];
assert.deepEqual(d.perWorld.map(x=>x.world).sort(),worlds.slice().sort());
const keyed={};
for(const w of d.perWorld){
 assert.deepEqual(w.shots.map(s=>s.time),times);
 keyed[w.world]={};
 for(const s of w.shots){
  assert.equal(s.nativeTicks,s.time*240);
  assert.equal(s.actualWebGL2,true);
  keyed[w.world][s.time]=new Map(s.projectedPositions.map(a=>[
   [a.road,a.u,a.offset,a.height].join('/'),a]));
 }
}
const common=[...keyed[worlds[0]][54].keys()].filter(k=>
 times.every(t=>worlds.every(w=>keyed[w][t].has(k))));
const candidates=[];
for(const k of common){
 const base=keyed[worlds[0]][54].get(k);
 if(Math.abs(base.offset)<80||base.height===0)continue;
 const series={};
 for(const t of times)series[t]=worlds.map(w=>keyed[w][t].get(k));
 const closeRisk=[64,67].some(t=>series[t].some(a=>
  a.frontDepthM>0&&a.frontDepthM<140&&
  Math.abs(a.screenX??2)<.50&&Math.abs(a.screenY??2)<.78));
 for(const target of times){
  const projected=series[target];
  if(!projected.every(a=>a.inMainVisibleArea&&
    a.frontDepthM>=190&&a.frontDepthM<=1100&&
    Math.abs(a.screenX)<.70&&a.screenY>-.24&&a.screenY<.62))continue;
  const meanDepth=projected.reduce((s,a)=>s+a.frontDepthM,0)/2;
  const worstOffAxis=Math.max(...projected.map(a=>
   Math.abs(a.screenX)*1.4+Math.abs(a.screenY-.16)));
  // Site selection is a geometric proxy, not the aesthetic merits of the shape.
  const riskScore=Number((worstOffAxis+
    (meanDepth<300?(300-meanDepth)/800:0)+
    (closeRisk?.35:0)).toFixed(5));
  candidates.push({targetSecond:target,road:base.road,u:base.u,offsetM:base.offset,
   heightM:base.height,worlds:worlds.map((world,i)=>({world,
    screenX:projected[i].screenX,screenY:projected[i].screenY,
    forwardDepthM:projected[i].frontDepthM})),
   simpleProjectionRiskScoreLowerIsBetter:riskScore,
   closeAt64Or67CameraRisk:closeRisk});
 }
}
const byTime={};
for(const t of times){
 byTime[t]=candidates.filter(a=>a.targetSecond===t)
  .sort((a,b)=>a.simpleProjectionRiskScoreLowerIsBetter-b.simpleProjectionRiskScoreLowerIsBetter)
  .slice(0,16);
}
const result={
 schema:'dopagaki.r18-source-camera-temporal-site-proposals/1',
 originalSha:d.sourceBlob,originalCameraArtifactSha256:crypto.createHash('sha256').update(buf).digest('hex'),
 worlds,originalCameraTimes:times,
 sourceCameraWorldsTrueWebGL2:true,sourceOriginalB48:7,sourceOriginalB51:28,
 validCandidates:candidates.length,candidateCountPerTime:Object.fromEntries(
  times.map(t=>[t,candidates.filter(x=>x.targetSecond===t).length])),
 rankedProposals:byTime,
 sourceCameraOnlyNoActualArtCreated:true,
 sourceCoordinateScreenProjectionNotOcclusionOrB51Safety:true,
 scoreNotBeautyOrHumanPlayability:true,
 officialARTAccepted:0,officialSlope2Metres:0,ART:'HOLD',HUMAN:'HOLD',
 PERFORMANCE:'HOLD',GAMEPLAY:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'
};
assert.ok(result.validCandidates>0,'No original-source sites satisfy genuine dual-world visibility');
assert.ok(result.rankedProposals[54].length>0);
assert.ok(result.rankedProposals[58].length>0);
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,'R18_TRUE_CAMERA_TWO_WORLD_TEMPORAL_SITE_PROPOSALS.json'),
 JSON.stringify(result,null,2)+'\n');
for(const t of times)console.log('R18_GENUINE_SOURCE_SCREEN_SITE',
 JSON.stringify({t,matching:candidates.filter(x=>x.targetSecond===t).length,
  top:byTime[t].slice(0,3).map(({road,u,offsetM,heightM,worlds,
   closeAt64Or67CameraRisk})=>({road,u,offsetM,heightM,worlds,closeAt64Or67CameraRisk}))}));
console.log('R18_NO_ART_OR_HUMAN_PROMOTION',
 JSON.stringify({realOriginalRawCamera:true,worlds:2,times:5,
  candidateCounts:result.candidateCountPerTime,ArtAccepted:0,
  cannotInferOcclusion:true,sourceUnchanged:true}));
