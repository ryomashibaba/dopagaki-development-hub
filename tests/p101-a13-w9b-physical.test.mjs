import test from 'node:test';
import assert from 'node:assert/strict';
import {generateP101A13W9XCandidate,W9X_BANK} from '../scripts/p101-a13-w9b-road-candidate.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';

test('W9-X-B1 real 31x5 banking stays isolated from W7F Gold and 28 B51-C bodies',()=>{
 const gold=generateP101A13W7Candidate(),before=JSON.stringify(gold);
 const trial=generateP101A13W9XCandidate();
 assert.equal(JSON.stringify(gold),before);
 assert.equal(gold.stageForge.revision,'W7F');
 assert.equal(gold.stageForge.productionPromoted,false);
 assert.equal(trial.stageForge.productionPromoted,false);
 assert.equal(trial.stageForge.humanPlaytest,'NOT_RUN');
 assert.equal(trial.stageForge.fairness,'NOT_APPROVED');
 assert.equal(trial.stageForge.nativeScriptedProof,null);
 assert.equal(trial.stageForge.recordStageId,W9X_BANK.stageId);
 assert.equal(trial.surfaces.length,7);
 assert.deepEqual(trial.movingObstacles,gold.movingObstacles);
 assert.deepEqual(trial.route,gold.route);
 assert.deepEqual(trial.routeSegments,gold.routeSegments);
 for(let i=0;i<7;i++)if(i!==W9X_BANK.section)
   assert.deepEqual(trial.surfaces[i],gold.surfaces[i]);
 const a=trial.surfaces[3],b=gold.surfaces[3];
 for(const row of [0,1,2,3,27,28,29,30])
   assert.deepEqual(a.points.slice(row*5,row*5+5),b.points.slice(row*5,row*5+5));
 let changed=0,maxAbs=0;
 for(let row=0;row<31;row++){
   assert.deepEqual(a.points[row*5+2],b.points[row*5+2]);
   for(let lane=0;lane<5;lane++){
     const p=a.points[row*5+lane],q=b.points[row*5+lane];
     assert.equal(p[0],q[0]);assert.equal(p[2],q[2]);
     const delta=p[1]-q[1];maxAbs=Math.max(maxAbs,Math.abs(delta));
     if(Math.abs(delta)>1e-8)changed++;
   }
 }
 assert.ok(changed>45&&maxAbs>4&&maxAbs<8);
});

test('W9-X-B1 physically finishes all 7 roads with original native 240Hz runner (scripted only)',()=>{
 const doc=generateP101A13W9XCandidate(),runner=new Runner(doc,compile(doc),0,52);
 const plan=makeP96RoutePlan(doc,runner),surge=createA13SurgeState();
 const visited=new Set(),contacts=[];let eventIndex=0,peak=52;
 assert.ok(Math.abs(1/DT-240)<1e-6);
 for(let tick=0;tick<Math.ceil(65/DT)&&!['failed','finished'].includes(runner.status);tick++){
   const target=p96DodgeSteer(runner,plan,'early-soft',movingObstaclePose);
   p101Step(runner,target.input/4.8,'OVERDRIVE',{
     forwardScale:p101A13ForwardScale(runner,surge)});
   if(runner.surface)visited.add(runner.surface);
   peak=Math.max(peak,Math.hypot(...runner.v));
   for(;eventIndex<runner.events.length;eventIndex++){
     const e=runner.events[eventIndex];if(e.type==='moving-contact')contacts.push(e);
   }
 }
 assert.equal(runner.status,'finished',
   'A scripted native completion does not certify human playability');
 assert.equal(visited.size,7);
 assert.ok(runner.time>50&&runner.time<58);
 assert.ok(peak>195&&peak<210);
 assert.ok(contacts.length>=1,'Keep real collision interaction');
});
