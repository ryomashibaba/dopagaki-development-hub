import test from 'node:test';
import assert from 'node:assert/strict';
import {generateVoidBreaker} from '../scripts/p93-void-breaker-build.mjs';
import {generateVoidHazardCandidate,P95_HAZARD_COUNT} from '../scripts/p95-void-hazard-build.mjs';
import {sample,validate} from '../private/reference_only/director/surface.js';
import {normalizeMovingObstacles,movingObstaclePose,sphereBoxSeparation,sweepSphereMovingObstacle} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {p94NativeSteer} from '../web/p94-native-steer.mjs';

test('P95 adds 12 ACTUAL B51-C moving colliders to separate experimental stage without altering P93 or P94',()=>{
 const original=generateVoidBreaker(),baseline=JSON.stringify(original),d=generateVoidHazardCandidate();
 assert.equal(P95_HAZARD_COUNT,12);
 assert.equal(d.stageForge.id,'VB-P95');
 assert.equal(d.stageForge.fullStartToFinish,'NOT_YET_PROVEN_WITH_HAZARDS');
 assert.equal(d.stageForge.humanPlaytest,'NOT_RUN');
 assert.equal(d.stageForge.inheritedP94Evidence,false);
 assert.equal('fullRouteControl' in d.stageForge,false);
 assert.equal('neutralRun' in d.stageForge,false);
 assert.equal(d.movingObstacles.length,12);
 assert.deepEqual([...new Set(d.movingObstacles.map(x=>x.type))].sort(),['piston','rotator','slider']);
 assert.deepEqual([...new Set(d.movingObstacles.map(x=>x.collision.mode))].sort(),['bounce','fail','push']);
 assert(d.movingObstacles.every(x=>x.enabled!==false));
 assert.equal(JSON.stringify(d.surfaces),JSON.stringify(original.surfaces),'P95 moving machines must not sneakily change B48 road geometry');
 assert.equal(JSON.stringify(d.routeSegments),JSON.stringify(original.routeSegments));
 assert.equal(JSON.stringify(original),baseline);
 assert.doesNotThrow(()=>validate(d));
 assert.equal(normalizeMovingObstacles(d).length,12);
});
test('P95 physical obstacle animation intersects selected real roadway centerlines; center is not an always-safe line',()=>{
 const d=generateVoidHazardCandidate(),sliders=d.movingObstacles.filter(x=>x.type==='slider');
 let crossingCount=0;
 for(const ob of sliders){
  const index=Number(ob.id.slice(-2))-1;
  const specs=[[1,.22],[1,.57],[1,.84],[2,.26],[2,.64],[3,.18],[3,.48],[3,.82],[4,.35],[4,.78],[5,.30],[5,.73]];
  const [surface,u]=specs[index],p=sample(d.surfaces[surface],u,.5);
  let near=false;
  for(let k=0;k<=120;k++){
   const pose=movingObstaclePose(ob,(k/120)*ob.period);
   if(sphereBoxSeparation([p[0],p[1]+.65,p[2]],.65,pose).separation<-.02){near=true;break;}
  }
  if(near)crossingCount++;
 }
 assert(crossingCount>=2,'Most animated hazards never threaten the otherwise safe central path');
 const first=sliders[0];
 const tangent=[1,0,0],center=movingObstaclePose(first,1).center;
 const result=sweepSphereMovingObstacle(first,
  [center[0]-25,center[1],center[2]-25],[center[0]+25,center[1],center[2]+25],
  .65,1,1+.015);
 assert(result.status==='hit'||result.hit,'B51-C actual CCD contact required');
});
test('P95 all six unmodified native Runner start positions remain legitimate and not instant unsafe',()=>{
 const doc=generateVoidHazardCandidate(),world=compile(doc);
 assert.equal(DT,1/240);
 for(let i=0;i<doc.spawns.length;i++){
  const r=new Runner(doc,world,i,44);
  for(let k=0;k<Math.ceil(.7/DT)&&!['failed','finished'].includes(r.status);k++)r.step(p94NativeSteer(r));
  assert.notEqual(r.status,'failed','P95 chapter spawn instant failure: '+i+' '+JSON.stringify(r.failure));
  assert(r.time>.65,'P95 first seconds of real 240Hz physics did not simulate');
 }
});
