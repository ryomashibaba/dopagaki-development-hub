/** R2F5-C: SOURCE 8.004s camera full-building bounding volume preflight.
 * Real 7 B48 road surface samples, all-tick 28 B51 OBB -> cached
 * R2F4 feasibility evidence; no geometry/physics/camera mutation.
 * Strict conservative bounding box, NOT actual glTF renderer/raster.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const original=fs.readFileSync('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs');
assert.equal(crypto.createHash('sha1').update(Buffer.concat([
 Buffer.from('blob '+original.length+'\0'),original])).digest('hex'),SHA);
const evidence=JSON.parse(fs.readFileSync('r19-evidence/r19a6p4r2f4/R2F4_SOURCE_ROADSIDE_PLACEMENT_GATE.json'));
const shots=JSON.parse(fs.readFileSync('docs/R19_A6P3_PRIOR_A1_ORIGINAL_12_TRUE_CAMERAS.json'));
assert.equal(evidence.sourceBlob,SHA);assert.equal(shots.origin.originalGitBlob,SHA);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const normalize=v=>{const n=Math.hypot(...v);assert(n>1e-8);return v.map(x=>x/n);};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
// Larger than full R2F5-B site's native parts: outer roof/footing
// ±25.1m horizontally, foundation -18.5..+16.5m longitudinally.
// Adds room for bevels and a deliberately high 22.5m upper envelope.
const envelope={sideHalfWidthM:26,frontBackHalfDepthM:20,minHeightRelativeToRoadM:-2,maxHeightRelativeToRoadM:22.5};
const radius=Math.hypot(envelope.sideHalfWidthM,envelope.frontBackHalfDepthM);
const oldProbeRadius=Math.hypot(7,6);
const gapCorrection=radius-oldProbeRadius;
const rules={minXPixelMargin:35,minYPixelMargin:35,minWidthPx:170,minHeightPx:75,
 minCentreX:110,maxCentreX:390,minB48SampledXYGapM:9,
 minB51AllTickOBBHorizontalGapM:12};
const found=[];
for(const mode of ['ultra','control']){
 const stage=evidence.modes.find(x=>x.mode===mode);assert(stage);
 assert.equal(stage.sourceB48RoadCount,7);
 assert.equal(stage.originalB51Count,28);
 assert.ok(stage.B51EnabledPoseSnapshots>60000);
 const c=shots.frames.find(f=>f.mode===mode&&f.tick===1921);
 assert.ok(c,'native original 8.004s camera must exist');
 const f=normalize(c.front),right=normalize(cross(f,[0,1,0])),up=normalize(cross(right,f));
 const candidates=stage.longitudinalCameraAlignedSweep.find(x=>x.targetNativeTick===1921)?.topCandidates;
 assert.ok(candidates?.length>=7);
 for(const item of candidates){
  const center=item.sourceWorldXYZ,eye=c.eye;
  const ahead=normalize([eye[0]-center[0],0,eye[2]-center[2]]);
  const side=normalize(cross([0,1,0],ahead));
  const pts=[];
  for(const xx of [-26,26])for(const yy of [-20,20])
   for(const zz of [-2,22.5]){
    const p=center.map((v,k)=>v+xx*side[k]+yy*ahead[k]+(k===1?zz:0));
    const delta=sub(p,eye),depth=dot(delta,f);
    if(depth<=.66)continue;
    pts.push({x:1013*(1+1.35*dot(delta,right)/(1013/698)/depth)/2,
      y:698*(1-1.35*dot(delta,up)/depth)/2,depth});
   }
  const full=pts.length===8;
  const box=full?[Math.min(...pts.map(p=>p.x)),Math.max(...pts.map(p=>p.x)),
    Math.min(...pts.map(p=>p.y)),Math.max(...pts.map(p=>p.y))]:null;
  const w=box?box[1]-box[0]:0,h=box?box[3]-box[2]:0;
  const mid=box?(box[0]+box[1])/2:null;
  const b48=item.sampledB48PlanarGapToProbeM-gapCorrection;
  const b51=item.B51MinConservativeAllTickPlanarGapM-gapCorrection;
  const inside=Boolean(box&&box[0]>=rules.minXPixelMargin&&
   box[1]<=1013-rules.minXPixelMargin&&box[2]>=rules.minYPixelMargin&&
   box[3]<=698-rules.minYPixelMargin);
  const pass=inside&&w>=rules.minWidthPx&&h>=rules.minHeightPx&&
   mid>=rules.minCentreX&&mid<=rules.maxCentreX&&
   b48>=rules.minB48SampledXYGapM&&b51>=rules.minB51AllTickOBBHorizontalGapM;
  found.push({mode,sourceNativeTick:1921,road1U:item.originalRoad1U,offsetM:item.offsetM,
   originalWorldXYZ:center,projectedFullUnclippedBoundingBoxPx:box?.map(x=>+x.toFixed(2))??null,
   projectedFullWidthPx:+w.toFixed(2),projectedFullHeightPx:+h.toFixed(2),
   B48SevenRoadSampleOnlyHorizontalGapM:+b48.toFixed(3),
   B51All2881TickConservativeOBBHorizontalGapM:+b51.toFixed(3),
   full8CornerDepthPositive:full,insideFullNativeFrameProxy:inside,
   nonProductionPositionResearchOnly:pass,
   originalB48RealTriangleClearance:'NOT_VERIFIED',
   actualB51RasterOcclusion:'NOT_VERIFIED',trueTerrainSupport:'NOT_VERIFIED'});
 }
}
const matched=new Map();
for(const c of found.filter(x=>x.nonProductionPositionResearchOnly)){
 const id=c.road1U+'|'+c.offsetM;
 if(!matched.has(id))matched.set(id,[]);
 matched.get(id).push(c);
}
const common=[...matched.values()].filter(x=>x.length===2)
 .map(x=>({road1U:x[0].road1U,offsetM:x[0].offsetM,
  minimumProxyWidthPx:Math.min(...x.map(q=>q.projectedFullWidthPx)),
  minimumProxyHeightPx:Math.min(...x.map(q=>q.projectedFullHeightPx)),
  minimumSourceB48SevenRoadSampleGapM:Math.min(...x.map(q=>q.B48SevenRoadSampleOnlyHorizontalGapM)),
  minimumConservativeB51AllTickGapM:Math.min(...x.map(q=>q.B51All2881TickConservativeOBBHorizontalGapM)),
  modes:x.map(q=>q.mode)}))
 .sort((a,b)=>b.minimumProxyWidthPx-a.minimumProxyWidthPx);
assert.ok(common.length>=1,'Do not place building: no common original-camera proxy candidate');
assert.equal(common[0].road1U,.125);
assert.equal(common[0].offsetM,45);
assert.ok(common[0].minimumSourceB48SevenRoadSampleGapM>=rules.minB48SampledXYGapM);
const result={schema:'dopagaki.r2f5c-full-station-frame-archived-source-road-b51-gate/1',
 originalSourceGitBlob:SHA,originalGameUnchanged:true,unmodifiedStage:true,
 sourceTruth:'R2F4 source seven-road 320x12 samples and 28 B51 source all 2881 ticks',
 buildingShape:'Conservative 8-corner rectangular envelope, NOT exact R2F5-B GLB',
 envelope,sourceProbeCircleM:oldProbeRadius,expandedBuildingCircleM:radius,rules,
 originalCamera:'A1 true source 240Hz tick1921 at ultra and control',
 archivedTopCandidatesOnly:true,researchedCandidates:found.length,
 allCandidateChecks:found,sharedPassesBothOriginalCameraWidths:common,
 preselectedForFutureArtOnly:common[0],
 exactStaticB48SourceTriangleCertification:false,continuousB51SweptCCD:false,
 newNativeBuildingB51ContactCertified:false,
 actualWebGL2RasterVisibilityOrOcclusion:false,
 realGroundSupportOrHumanPassage:false,
 ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
const out='r19-evidence/r19a6p4r2f5c/R2F5C_ARCHIVED_BOTH_MODE_FULL_FRAME_RESEARCH_ONLY.json';
fs.mkdirSync(path.dirname(out),{recursive:true});
fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');
console.log('R2F5C_SOURCE_BOTH_CAMERA_FRAME_PROXY',JSON.stringify({
  original:SHA,trialCount:found.length,matched:common,
  ART:'HOLD',actualRaster:'NOT_VERIFIED'}));
