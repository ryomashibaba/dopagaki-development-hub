/** K3: late legitimate steering-only matrix after identical W9C1 source prefix.
 * No new colliders, no teleport, no road changes, no artificial restart.
 * Original physics source remains protected and source-spawn-0 only.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {generateP101W9C1AbyssCandidate} from './p101-w9c1-abyss-narrow.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p94NativeSteer} from '../web/p94-native-steer.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const bin=fs.readFileSync(path.join(root,'web/p101-w9c2-g4e7ci-integrated-streetscape.mjs'));
const sourceBlob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bin.length+'\0'),bin])).digest('hex');
assert.equal(sourceBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
assert.equal(DT,1/240);
const out=path.join(root,'r19-evidence/r19a6p4r2f5k3');
fs.mkdirSync(out,{recursive:true});
const proposals=[
 {id:'source-p96-div4p8',profile:'early-soft',divisor:4.8},
 {id:'p96-soft-div3p4',profile:'early-soft',divisor:3.4},
 {id:'p96-soft-div2p4',profile:'early-soft',divisor:2.4},
 {id:'p96-soft-div1p5',profile:'early-soft',divisor:1.5},
 {id:'p96-strong-div4p8',profile:'early-strong',divisor:4.8},
 {id:'p96-fast-div4p8',profile:'fast-switch',divisor:4.8},
 {id:'p94-corrective-div3',profile:'p94',divisor:3},
 {id:'p94-corrective-full',profile:'p94',divisor:1}
];
const switchTick=7680; // 32.000 seconds; historical 11.504s camera prefix exact
const maxTicks=60*240,round=(x,d=4)=>Number(x.toFixed(d));
const result={schema:'dopagaki.r2f5k3-steering-only-real-native-physical-late-matrix/1',
 sourceBlob,runSource:'real Runner native 240Hz W9C1 physical 14/28m',
 startingSpawn:0,startingSpeedMps:52,switchTick,originalB48:7,originalB51:28,
 noTeleport:true,noExtraGround:true,noColliderWrites:true,noSpeedReset:true,
 profiles:proposals,originalFirst32SecondsInvariant:true,gameplay:'HOLD',
 human:'NOT_TESTED',art:'NOT_APPROVED',road4to6Camera:'NOT_YET_CAPTURED',runs:[]};
function run(mode,proposal) {
 const stage=generateP101W9C1AbyssCandidate(mode),source=JSON.stringify(stage);
 const r=new Runner(stage,compile(stage),0,52),plan=makeP96RoutePlan(stage,r),surge=createA13SurgeState();
 const visited=new Set(),snapshots=[];
 let peak=52,firstFailure=null,lastRoad=null,changedTick=null;
 const sourceControl=x=>p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
 for(let tick=1;tick<=maxTicks&&!['failed','finished'].includes(r.status);tick++){
  const input=tick<=switchTick?
   sourceControl():
   proposal.profile==='p94'
    ?p94NativeSteer(r,'corrective')/proposal.divisor
    :p96DodgeSteer(r,plan,proposal.profile,movingObstaclePose).input/proposal.divisor;
  assert.ok(Number.isFinite(input)&&Math.abs(input)<=1.000001);
  if(tick===switchTick+1)changedTick=tick;
  p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge)});
  if(r.surface){visited.add(r.surface);lastRoad=r.surface;}
  peak=Math.max(peak,Math.hypot(...r.v));
  if(tick%240===0||[7680,8160,8640,8880,9000,9600,10560,11520,12480].includes(tick)){
   snapshots.push({tick,seconds:round(tick/240,3),road:r.surface??'AIR',
     xyz:r.p.map(v=>round(v,5)),speedMps:round(Math.hypot(...r.v)),
     status:r.status,grounded:!!r.grounded});
  }
 }
 assert.equal(JSON.stringify(stage),source,'Native QA modified source B48/B51');
 assert.ok(changedTick!==null,'Pre-switch original history ended');
 return {mode,variant:proposal.id,switchedAtTick:changedTick,
  status:r.status,elapsedSeconds:round(r.time,6),
  lastRoad,lastRoadIndex:stage.surfaces.findIndex(s=>s.id===lastRoad),
  visitedRoads:[...visited],visitedRoadIndexes:stage.surfaces.flatMap((s,i)=>visited.has(s.id)?[i]:[]),
  maxSpeedMps:round(peak),sourcePrefixPreserved:true,
  finishedNativeSource:r.status==='finished'&&visited.size===7&&!r.failure,
  failure:r.failure?{reason:r.failure.reason,atSeconds:round(r.failure.t??r.time),surface:r.failure.surface??null}:null,
  lastXYZ:r.p.map(v=>round(v)),endNativeTime:r.time,
  snapshots};
}
for(const mode of ['ultra','control']){
 const runs=proposals.map(p=>run(mode,p));
 const baseline=runs.find(x=>x.variant==='source-p96-div4p8');
 assert(baseline);
 const atBaseline=baseline.snapshots.find(x=>x.tick===7680);
 assert(atBaseline,'Original 32s checkpoint missing');
 for(const run of runs){
  assert.deepEqual(run.snapshots.find(x=>x.tick===7680),atBaseline,
   'Late steering branch changed historical physics prefix');
 }
 result.runs.push(...runs);
 console.log('R2F5K3_LEGAL_LATE_STEERING_MATRIX',JSON.stringify(runs.map(({mode,variant,status,
  elapsedSeconds,visitedRoadIndexes,lastRoadIndex,finishedNativeSource,failure})=>({
   mode,variant,status,elapsedSeconds,visitedRoadIndexes,lastRoadIndex,finishedNativeSource,failure
  }))));
}
fs.writeFileSync(path.join(out,'R2F5K3_REAL_LATE_STEERING_NATIVE_MATRIX.json'),JSON.stringify(result,null,2)+'\n');
const coverage=result.runs.reduce((best,r)=>Math.max(best,...r.visitedRoadIndexes),0);
console.log('R2F5K3_PHYSICAL_MATRIX_FINISHED',JSON.stringify({runs:result.runs.length,
  maxRoadIndexObserved:coverage,continuousFinishTrials:result.runs.filter(x=>x.finishedNativeSource)
   .map(x=>x.mode+'/'+x.variant),originalPhysics:true,ART:'HOLD'}));
