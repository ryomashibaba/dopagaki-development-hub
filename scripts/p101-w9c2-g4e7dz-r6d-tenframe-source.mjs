/**
 * G4E-7DZ R6D — PRIVATE original 240Hz scripted-run timeline, 14.0–18.5s.
 * Reuses authentic DJ native camera samples, unchanged B48/B51, and checks
 * a13-machine-04 at each 240Hz simulation tick in this window.
 * This is NOT continuous-time swept collision certification, new art,
 * a human session, or a game/WebGL modification.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {g4e7djNativeStoryboard, BG_SHOTS} from './p101-w9c2-g4e7dj-native-storyboard.mjs';
import {generateG4E7BC} from './p101-w9c2-g4e7bc-bank-contour.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {DT} from '../private/reference_only/director/physics.js';

const ROADS=['true-pinch','pinch-switch'];
const IDS=['t1400','t1450','t1500','t1550','t1600','t1650','t1700','t1750','t1800','t1850'];
const ORIGINAL=['t1500','t1550','t1600','t1650','t1700'];
const round=(v,n=7)=>Number(v.toFixed(n));
const norm=v=>{const m=Math.hypot(...v);assert.ok(m>1e-9);return v.map(x=>x/m);};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const plus=(a,b)=>a.map((v,i)=>v+b[i]);
const mul=(a,k)=>a.map(v=>v*k);
const sha='af076d67492a677d2235e4730aef8cdf4808e106';

function frame(shot,doc){
 const front=norm(shot.front),right=norm(cross(front,[0,1,0])),up=norm(cross(right,front));
 const p=plus(shot.eye,plus(mul(front,100),plus(mul(right,16),mul(up,7))));
 const v=p.map((x,i)=>x-shot.eye[i]),z=dot(v,front);
 assert.ok(Math.abs(z-100)<1e-8);
 const x=.5+.5*1.35*dot(v,right)/(z*(1008/645));
 const y=.5-.5*1.35*dot(v,up)/z;
 const moving=doc.movingObstacles.map(o=>{
  const m=movingObstaclePose(o,shot.tick*DT);
  assert.ok(m.center.length===3&&m.center.every(Number.isFinite));
  assert.ok(m.halfSize.length===3&&m.halfSize.every(x=>Number.isFinite(x)&&x>0));
  assert.ok(Number.isFinite(m.yawRadians));
  return {id:m.id,type:m.type,enabled:m.enabled,center:m.center,
    halfSize:m.halfSize,yawRadians:m.yawRadians};
 });
 assert.equal(moving.length,28);
 return {
  id:shot.id,tick:shot.tick,timeSeconds:shot.timeSeconds,
  originalSource:shot.source,eye:shot.eye,front,right,up,
  projectionProbePixels:[x*1008,y*645],speedMps:shot.speedMps,
  grounded:shot.grounded,physicalRoad:shot.physicalRoad,
  playerWorld:shot.pose.position,sourceMoving: moving,
  camera:'ACTUAL_NATIVE_240HZ_START00_P96_SCRIPT_NOT_HUMAN',
  gameplayStatus:'NOT_HUMAN_CERTIFIED'
 };
}
function boxCorners(p){
 const [hx,hy,hz]=p.halfSize,[cx,cy,cz]=p.center;
 const a=Math.cos(p.yawRadians),b=Math.sin(p.yawRadians);
 const result=[];
 for(const x of [-hx,hx])for(const y of [-hy,hy])for(const z of [-hz,hz])
  result.push([cx+x*a+z*b,cy+y,cz-x*b+z*a]);
 return result;
}
function sweptSamples(ob,start,end){
 const first=Math.round(start/DT),last=Math.round(end/DT);
 assert.ok(Math.abs(first*DT-start)<1e-8&&Math.abs(last*DT-end)<1e-8);
 let min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
 let previous=null,maxStep=0,samples=0;
 for(let tick=first;tick<=last;tick++){
  const p=movingObstaclePose(ob,tick*DT);
  assert.ok(p.enabled,'R6D selected machine inactive in sampled period');
  const points=boxCorners(p);
  for(const xyz of points)for(let i=0;i<3;i++){
   min[i]=Math.min(min[i],xyz[i]);max[i]=Math.max(max[i],xyz[i]);
  }
  if(previous)for(let j=0;j<8;j++)
   maxStep=Math.max(maxStep,Math.hypot(...points[j].map((x,i)=>x-previous[j][i])));
  previous=points;samples++;
 }
 assert.equal(samples,last-first+1);
 return {machine:'a13-machine-04',startSeconds:start,endSeconds:end,
  intervalSeconds:DT,sampleCount:samples,firstTick:first,lastTick:last,
  sampleAabb:{min:min.map(x=>round(x,6)),max:max.map(x=>round(x,6))},
  largestSameCornerInterTickDisplacementMetres:round(maxStep,7),
  status:'240HZ_POINT_SAMPLES_ONLY_NOT_CONTINUOUS_SWEPT_OCCUPANCY',
  candidateCollisionCertification:'NOT_TESTED'};
}
export function buildR6d(road,native=g4e7djNativeStoryboard()){
 assert.ok(ROADS.includes(road));
 assert.equal(native.physicsHz,240);
 assert.deepEqual(BG_SHOTS.map(x=>x.id),IDS);
 const doc=generateG4E7BC(road,'rollDeck'),frozen=JSON.stringify(doc);
 assert.equal(doc.surfaces.length,7);
 assert.equal(doc.movingObstacles.length,28);
 assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
 const frames=IDS.map(id=>{
  const shot=native.stages[road].frames.find(x=>x.id===id);
  assert.ok(shot&&shot.source==='ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN',id);
  assert.ok(shot.tick===Math.round(shot.timeSeconds/DT));
  return frame(shot,doc);
 });
 const selected=doc.movingObstacles.filter(x=>x.id==='a13-machine-04');
 assert.equal(selected.length,1);
 const hazard=sweptSamples(selected[0],14,18.5);
 assert.equal(hazard.sampleCount,1081);
 assert.equal(JSON.stringify(doc),frozen,'Source physical stage changed');
 const originalFrames=frames.filter(x=>ORIGINAL.includes(x.id));
 assert.equal(originalFrames.length,5);
 return {schema:'dopagaki.g4e7dz-r6d-native-tenframe-timeline/1',
  road,sourceCXBlob:sha,sourceB48:7,sourceB51:28,sourceOriginalBlenderCameras:5,
  sourceGap52:true,sourcePhysicsHz:240,originalSourceUnchanged:true,
  scope:'14.0_TO_18.5_SECONDS_SCRIPTED_REFERENCE_NOT_HUMAN',
  offRoadDiagnosticCaution:'t1850 is an off-road diagnostic sample in the DJ source',
  originalFive:ORIGINAL,frames,sourceMachine04TickStudy:hazard,
  timeBeats:'UNASSIGNED_PENDING_VISUAL_REVIEW',
  newCityMeshes:0,newGameColliders:0,officialArt:0,officialSlope2Metres:0,
  dynamicCollisionSafety:'NOT_CERTIFIED',newCityWebGL:'NOT_RENDERED',
  ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',
  INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const dir='test-results/g4e7dz-r6d/source';
 fs.mkdirSync(dir,{recursive:true});
 const native=g4e7djNativeStoryboard();
 for(const road of ROADS){
  const report=buildR6d(road,native);
  const file=path.join(dir,road+'.json');
  fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');
  console.log('R6D_AUTHENTIC_EXTENDED_NATIVE_TIMELINE_ONLY',JSON.stringify({
   road,frames:report.frames.length,sourceB51:28,machineTicks:report.sourceMachine04TickStudy.sampleCount,
   tickSampleAabb:report.sourceMachine04TickStudy.sampleAabb,safety:'NOT_CERTIFIED',art:'HOLD'}));
 }
}
