/** R15S3D8R2 spatial gate BEFORE another costly full 240Hz replay.
 * Inspect real B48 signed frame normals, full-width continuity and original
 * downstream heading. Treat geometric C0 only as research evidence.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {buildR15S3D8R2} from './p101-r15s3d8r2-real-road4-to-original-road5-hermite.mjs';
import {frame,sample} from '../private/reference_only/director/surface.js';
const sha='af076d67492a677d2235e4730aef8cdf4808e106';
const get=k=>{const i=process.argv.indexOf(k);assert.ok(i>=0&&process.argv[i+1]);return process.argv[i+1]};
const worlds=['true-pinch','pinch-switch'],d={schema:'dopagaki.r15s3d8r2-source-static-road5-spatial-gate/1',
 sourceOriginalBlob:sha,realWorldCount:2,originalB48:7,originalB51:28,
 originalGameAndRunnerChanged:false,sourceWebGL:false,
 SOURCE_TECH:'STATIC_ONLY',GAMEPLAY:'HOLD',ART:'HOLD',
 HUMAN:'HOLD',RELEASE:'HOLD',officialArt:0,officialSlope2Meters:0,cases:{}};
let staticPass=true;
for(const world of worlds){
 const candidate=buildR15S3D8R2(world);
 const g=candidate.stageForge.r15s3d8r2;
 const future=candidate.surfaces[5],bridge=candidate.surfaces[4];
 const leftAtEnd=sample(bridge,1,0),rightAtEnd=sample(bridge,1,1);
 const sourceLeft=sample(future,0,0),sourceRight=sample(future,0,1);
 const normDist=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
 const allFiveMatched=Array.from({length:5},(_,j)=>normDist(bridge.points[30*5+j],future.points[j]));
 const pass={
  actualOriginalB48Seven:g.originalB48RoadCount===7,
  actualOriginalMovingB51TwentyEight:g.originalB51Count===28,
  entireOriginalCrownAndScissorProtected:g.entireCROWNAndSCISSORPreserved,
  zeroNewHiddenColliders:g.newHiddenColliders===0,
  originalRunnerGuideControlFrozen:g.originalRunnerCCDSteeringCameraGuideAndRouteFrozen,
  zeroCentreSeam:g.nearestRoad5RealEndToEntrySeamM<1e-5,
  exactFiveFullWidthVertexSeam:allFiveMatched.every(x=>x<1e-7),
  noPhysicalFrameInversion:g.road4MinimumSampledFrameNormalY>.7,
  noGrossRoad4FrameDiscontinuity:g.road4MaxAdjacentObservedSampledFrameNormalAngleDeg<30,
  sourceRoad5HeadingNearContinuous:g.road4EndToRoad5ForwardAngleDeg<30,
  withinSourceOriginalPositionLimits:g.road4MaximumAbsCentreCoordinateM<2000
 };
 const passes=Object.values(pass).every(Boolean);
 d.cases[world]={world,sourceGeometry:g,fullWidthSeamFiveDistancesM:allFiveMatched,
   downstreamActualLeftEdgeGapM:normDist(leftAtEnd,sourceLeft),
   downstreamActualRightEdgeGapM:normDist(rightAtEnd,sourceRight),
   originalSourceRoad5FirstTangentXYZ:frame(future,0,.5).forward.map(x=>+x.toFixed(6)),
   actualB48Road4LastTangentXYZ:frame(bridge,1,.5).forward.map(x=>+x.toFixed(6)),
   staticAssertions:pass,staticApproval:passes?'GEOMETRY_SOURCE_ONLY':'REJECT',
   real240HzNativeRunsExecuted:false,humanPlayabilityCertified:false};
 staticPass&&=passes;
 console.log('R15S3D8R2_GEOMETRY_STATIC',JSON.stringify({world,staticPass:passes,
  geometry:g,pass}));
}
d.staticMacroCandidateApprovedForNativeReplay=staticPass;
const out=get('--out');fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(out+'/R15S3D8R2_REAL_ROAD5_SPATIAL_CONTINUITY.json',JSON.stringify(d,null,2)+'\n');
console.log('R15S3D8R2_SOURCE_STATIC_END',staticPass?'GEOMETRY_ONLY_PASS':'GEOMETRY_REJECT',
 'No native gameplay claims or source game edits');
