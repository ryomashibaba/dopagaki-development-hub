import test from 'node:test';
import assert from 'node:assert/strict';
import {generateP101W9C1AbyssCandidate,W9C1_VARIANTS} from '../scripts/p101-w9c1-abyss-narrow.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
import {DT,RADIUS} from '../private/reference_only/director/physics.js';
const width=(s,u)=>Math.hypot(...sample(s,u,1).map((v,k)=>v-sample(s,u,0)[k]));
test('W9-C1 28m control and 14m ultra are independent real 31x5 B48 skins',()=>{
 const gold=generateP101A13W7Candidate(),frozen=JSON.stringify(gold);
 for(const [kind,cfg] of Object.entries(W9C1_VARIANTS)){
  const doc=generateP101W9C1AbyssCandidate(kind),skin=doc.surfaces[0],old=gold.surfaces[0];
  assert.equal(doc.stageForge.recordStageId,cfg.recordStageId);
  assert.equal(doc.stageForge.productionPromoted,false);
  assert.equal(doc.stageForge.humanPlaytest,'NOT_RUN');
  assert.equal(doc.stageForge.nativeScriptedProof,null);
  assert.equal(doc.stageForge.gameAutoSteering,false);
  assert.equal(doc.surfaces.length,7);
  assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.movingObstacles,gold.movingObstacles);
  assert.deepEqual(doc.route,gold.route);
  assert.deepEqual(doc.routeSegments,gold.routeSegments);
  for(let i=1;i<7;i++)assert.deepEqual(doc.surfaces[i],gold.surfaces[i]);
  for(let row=0;row<31;row++){
   const m=row*20;
   assert.deepEqual(skin.points[row*5+2],old.points[row*5+2],'centerline changed');
   if(m<=200||m>=440)for(let lane=0;lane<5;lane++)
    assert.deepEqual(skin.points[row*5+lane],old.points[row*5+lane],'seam/outer segment changed');
  }
  for(const m of [300,320,340,360])assert.ok(Math.abs(width(skin,m/600)-cfg.widthMeters)<.1,'core actual B48 width mismatch '+m);
  for(let j=0;j<=120;j++)assert.ok(width(skin,j/120)>9,'true interpolated road collapsed');
  assert.equal(tessellate(skin).degenerate,0,'B48 generated a degenerate triangle');
 }
 assert.equal(JSON.stringify(gold),frozen,'W7F mutated while generating a trial');
 assert.equal(1/DT,240);
 assert.equal(RADIUS,.65);
});
