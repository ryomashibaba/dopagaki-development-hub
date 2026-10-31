/** R15S3D11: STRICT matched-trajectory counterfactual 28 ORIGINAL B51 OBB
 * distances; sample SAME ball XYZ, original clock, every 0.5s after 23s.
 * Corrects unfair R15S3D10 23s+ vs D11 full-start 0s encounter-count
 * comparisons. This is not counterfactual run survival or human play.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {buildR15S3D11} from './p101-r15s3d11-six-real-b51-lane-reanchor-candidates.mjs';
import {buildR15S3D9} from './p101-r15s3d9-source-real-road5-road6-integrated-macro.mjs';
import {movingObstaclePose,sphereBoxSeparation} from '../private/reference_only/director/moving/moving-obstacles.mjs';
const arg=k=>{const i=process.argv.indexOf(k);assert.ok(i>=0&&process.argv[i+1]);return process.argv[i+1];};
const source=JSON.parse(fs.readFileSync(arg('--source'),'utf8'));
const archived=JSON.parse(fs.readFileSync(arg('--d9'),'utf8'));
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
assert.equal(source.originalSourceGameBlob,SHA);
assert.equal(archived.sourceOriginalBlob,SHA);
const dst={schema:'dopagaki.r15s3d11-original-28-B51-paired-same-0p5s-post23-trace-counterfactual/1',
 gameSourceGitBlob:SHA,fullSamplePeriodSeconds:.5,firstSampleAtOrAfterSeconds:23,
 matchedSameBallXYZAndSourceSimulationTime:true,
 originalB51Count:28,actualModifiedOriginalB51Count:6,
 isActualAlternativePhysicalPlayback:false,noNewRealPhysicsSimulation:true,
 thisStudyDoesNotProveMissOrHumanVisibility:true,
 ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD',worlds:{}};
const mag=v=>Math.hypot(...v),round=x=>+x.toFixed(6);
for(const world of ['true-pinch','pinch-switch']){
 const native=source.cases[world].A_EDGE_READABLE;
 const oldArchived=archived.cases[world].A_CONTINUOUS_NARROW_MACRO;
 assert.equal(native.nativeStatus,'finished');assert.equal(native.nativeFinishEvents,1);
 assert.equal(oldArchived.originalNativeRunnerStatus,'finished');
 const control=buildR15S3D9(world,'A_CONTINUOUS_NARROW_MACRO');
 const candidate=buildR15S3D11(world,'A_EDGE_READABLE');
 assert.equal(control.movingObstacles.length,28);assert.equal(candidate.movingObstacles.length,28);
 assert.deepEqual(candidate.surfaces,control.surfaces);
 assert.deepEqual(candidate.route,control.route);
 const rows=native.native5HzProgressSnapshots.filter(x=>x.time>=23&&x.tick%120===0);
 assert.ok(rows.length>85,'same timeline after 23s missing');
 const oldTime=new Map(oldArchived.genuineNative10HzAndContactTimeline.filter(x=>x.tick%120===0).map(x=>[x.tick,x]));
 let overlappingPositions=0,maxNativeXYZEvidenceError=0;
 const counters={
  baseline:{within30:new Set(),within10:new Set(),timeSamplesWithin30:0,
    closestSurfaceSeparationM:Infinity},
  sixMoved:{within30:new Set(),within10:new Set(),timeSamplesWithin30:0,
    closestSurfaceSeparationM:Infinity}};
 const perNewId=Object.fromEntries(candidate.stageForge.r15s3d11.changedMachines.map(x=>[x.id,
  {id:x.id,baseClosest:Infinity,candidateClosest:Infinity,baseWithin30Samples:0,
    candidateWithin30Samples:0}]));
 for(const row of rows){
  const old=oldTime.get(row.tick);
  if(old){
   overlappingPositions++;
   const d=mag(row.xyz.map((v,i)=>v-old.xyz[i]));
   maxNativeXYZEvidenceError=Math.max(maxNativeXYZEvidenceError,d);
  }
  const time=row.time,point=row.xyz;
  for(const [label,doc] of [['baseline',control],['sixMoved',candidate]]){
   for(const ob of doc.movingObstacles){
    const body=movingObstaclePose(ob,time),sep=sphereBoxSeparation(point,.65,body).separation;
    if(!Number.isFinite(sep))continue;
    counters[label].closestSurfaceSeparationM=Math.min(counters[label].closestSurfaceSeparationM,sep);
    if(sep<30){counters[label].within30.add(ob.id);counters[label].timeSamplesWithin30++;}
    if(sep<10)counters[label].within10.add(ob.id);
    if(Object.hasOwn(perNewId,ob.id)){
     const p=perNewId[ob.id],field=label==='baseline'?'baseClosest':'candidateClosest';
     p[field]=Math.min(p[field],sep);
     if(sep<30)p[label==='baseline'?'baseWithin30Samples':'candidateWithin30Samples']++;
    }
   }
  }
 }
 const clean=p=>({
  distinctRealMovingBodiesWithin30m:p.within30.size,
  distinctRealMovingBodiesWithin10m:p.within10.size,
  originalBodyIDsWithin30m:[...p.within30].sort(),
  timeSampleBodyPairCountWithin30m:p.timeSamplesWithin30,
  minimumBallSurfaceToOriginalMovingBodyM:round(p.closestSurfaceSeparationM)
 });
 const r={world,realSamplingPointsAfter23:rows.length,
  originalNativeSourceRunnerFinishedBoth:true,
  originalSource240HzUnmodified:true,
  overlapSameTickOriginalD9Snapshots:overlappingPositions,
  maxOriginalD9VsD11BallXYZErrorAtMatchingTickM:round(maxNativeXYZEvidenceError),
  originalIdenticalTrajectoryCounterfactual:{
   original28B51UntouchedPositions:clean(counters.baseline),
   sixRealB51ReanchoredPrivatePositions:clean(counters.sixMoved)
  },
  sixEditedBodiesVsOriginal:Object.values(perNewId).map(o=>({
   ...o,baseClosest:round(o.baseClosest),candidateClosest:round(o.candidateClosest)})),
  samplePeriodExactly0p5s:true,allSamplesSameXYZAndTime:true,
  nativeSourceContactEventsAfterNewPositions:native.actualMovingB51ContactEvents,
  actualDriverInterventionTested:false};
 assert.ok(overlappingPositions>80,'no archived source route overlap');
 dst.worlds[world]=r;
 console.log('R15S3D11_MATCHED_REAL_B51_POST23',JSON.stringify({
  world,samples:rows.length,oldB51Within30:r.originalIdenticalTrajectoryCounterfactual.original28B51UntouchedPositions.distinctRealMovingBodiesWithin30m,
  sixMovedB51Within30:r.originalIdenticalTrajectoryCounterfactual.sixRealB51ReanchoredPrivatePositions.distinctRealMovingBodiesWithin30m,
  oldB51Within10:r.originalIdenticalTrajectoryCounterfactual.original28B51UntouchedPositions.distinctRealMovingBodiesWithin10m,
  sixMovedB51Within10:r.originalIdenticalTrajectoryCounterfactual.sixRealB51ReanchoredPrivatePositions.distinctRealMovingBodiesWithin10m,
  overlappingOriginalD9SourceTicks:overlappingPositions,
  maxNativeRouteErrorM:r.maxOriginalD9VsD11BallXYZErrorAtMatchingTickM}));
}
fs.mkdirSync(arg('--out'),{recursive:true});
fs.writeFileSync(arg('--out')+'/R15S3D11_POST23_SAME_BALL_TRACE_B51_COUNTERFACTUAL.json',JSON.stringify(dst,null,2)+'\n');
