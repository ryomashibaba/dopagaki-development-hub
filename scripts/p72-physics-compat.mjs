/**
 * P72 non-publishing physical-engine handoff evaluator.
 *
 * Optional candidate must be provided from a locally accessible private
 * workspace via DOPAGAKI_PHYSICS_CANDIDATE. Its source is NEVER embedded in
 * public assets, written to build outputs or copied to this repository.
 */
import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {generateEchoRush} from './p66-echo-rebuild.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import * as frozen from '../private/reference_only/director/physics.js';

export const PHYSICS_HANDOFF_CASES=Object.freeze([
 {id:'pipe-intro',spawn:0,seconds:12,speed:44},
 {id:'left-fork',spawn:2,seconds:12,speed:44},
 {id:'right-fork',spawn:3,seconds:12,speed:44},
 {id:'jump-38',spawn:5,seconds:3.5,speed:38},
 {id:'jump-44',spawn:5,seconds:3.5,speed:44},
 {id:'jump-52',spawn:5,seconds:3.5,speed:52},
 {id:'jump-60',spawn:5,seconds:3.5,speed:60},
 {id:'spiral-to-takeoff',spawn:1,seconds:85,speed:44,extended:true}
]);

const magnitude=v=>Math.hypot(...v);
export function evaluateCase(physics,course,world,c){
 const rider=new physics.Runner(course,world,c.spawn,c.speed);
 const visited=new Set(),events={unplannedAirFrames:0,airFrames:0,landed:false,maxSpeedStep:0};
 let firstAir=null,priorSpeed=magnitude(rider.v),firstContact=null;
 for(let i=0;i<Math.round(c.seconds/physics.DT)&&!['failed','finished'].includes(rider.status);i++){
  const input=c.id==='spiral-to-takeoff'&&rider.time>=62.15&&rider.time<67.15?-1:0;
  rider.step(input);
  const speed=magnitude(rider.v);
  events.maxSpeedStep=Math.max(events.maxSpeedStep,Math.abs(speed-priorSpeed));
  priorSpeed=speed;
  if(rider.surface){visited.add(rider.surface);if(!firstContact)firstContact=rider.surface;}
  if(!rider.grounded){
   events.airFrames++;if(!firstAir)firstAir=Number(rider.time.toFixed(3));
   if(!c.id.startsWith('jump'))events.unplannedAirFrames++;
  }
  if(rider.surface?.includes('GAP_LANDING'))events.landed=true;
 }
 const result={
  id:c.id,seconds:Number(rider.time.toFixed(3)),status:rider.status,
  failure:rider.failure?.reason||null,
  endSurface:rider.surface||null,
  speed:Number(magnitude(rider.v).toFixed(2)),
  maxSpeedStep:Number(events.maxSpeedStep.toFixed(3)),
  firstAir,airFrames:events.airFrames,
  reachedForkRejoin:visited.has('p66-FORK_REJOIN-01'),
  reachedForkApproach:[...visited].some(x=>x.includes('FORK_APPROACH')),
  visitedSpiral:[...visited].filter(x=>x.includes('SPIRAL_CATHEDRAL')).length,
  reachedTakeoff:[...visited].some(x=>x.includes('GAP_TAKEOFF')),
  naturalLanding:events.landed,
  remainingGrounded:events.unplannedAirFrames===0,
  firstContact
 };
 return result;
}
export function isApprovedCourseCase(x){
 if(x.failure)return false;
 if(x.id==='pipe-intro')return x.remainingGrounded&&x.seconds>=11.9;
 if(x.id==='left-fork'||x.id==='right-fork')
  return x.remainingGrounded&&x.reachedForkRejoin&&x.seconds>=11.9;
 if(x.id.startsWith('jump'))return x.airFrames>10&&x.naturalLanding;
 if(x.id==='spiral-to-takeoff')
  return x.remainingGrounded&&x.visitedSpiral===6&&x.reachedForkApproach&&x.reachedTakeoff&&x.seconds>=84.9;
 return false;
}
export function checkPhysicsContract(p){
 assert.equal(p.DT,1/240);
 assert.equal(p.RADIUS,.65);
 assert.deepEqual(p.FIXTURE_IMPULSES.shove,{side:10,lift:8,forward:3});
 assert.deepEqual(p.FIXTURE_IMPULSES.boosterCube,{horizontal:10,minUpward:30});
 assert.equal(typeof p.Runner,'function');
}
export async function physicsHandoff({candidatePath=null,full=false}={}){
 const doc=generateEchoRush(),world=compile(doc);
 checkPhysicsContract(frozen);
 const select=PHYSICS_HANDOFF_CASES.filter(c=>full||!c.extended);
 const baseline=select.map(c=>evaluateCase(frozen,doc,world,c));
 if(!candidatePath)return {decision:'HOLD_NO_APPROVED_CANDIDATE',source:'B48_FROZEN_BASELINE',
  tested:select.map(x=>x.id),baseline,baselinePass:baseline.every(isApprovedCourseCase)};
 // A private physical source can be inspected without uploading it to GitHub.
 // Its import must have its original dependency tree available next to it.
 const file=path.resolve(candidatePath);
 const hash=createHash('sha256').update(readFileSync(file)).digest('hex');
 const candidate=await import(pathToFileURL(file).href);
 checkPhysicsContract(candidate);
 const results=select.map(c=>evaluateCase(candidate,doc,world,c));
 const passed=results.every(isApprovedCourseCase);
 return {decision:passed?'CANDIDATE_PHYSICAL_GATE_PASS_PENDING_REVIEW':'HOLD_CANDIDATE_REGRESSION',
  candidateSHA256:hash,source:'PRIVATE_LOCAL_TEST_ONLY',tested:select.map(x=>x.id),
  baseline,baselinePass:baseline.every(isApprovedCourseCase),candidate:results,passed};
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(new URL(import.meta.url).pathname)){
 const result=await physicsHandoff({candidatePath:process.env.DOPAGAKI_PHYSICS_CANDIDATE||null,full:process.env.DOPAGAKI_PHYSICS_FULL==='1'});
 console.log('P72_PHYSICS_HANDOFF '+JSON.stringify(result));
 if(!result.baselinePass||result.passed===false)process.exitCode=1;
}
