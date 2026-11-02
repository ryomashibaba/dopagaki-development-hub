import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7AUInspection,AU_POINTS} from '../scripts/p101-w9c2-g4e7au-private-inspection.mjs';
import {generateG4E7AT} from '../scripts/p101-w9c2-g4e7at-crown-chasm.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
for(const road of ['true-pinch','pinch-switch'])test('AU real second road private-only optional spawns '+road,()=>{
 const at=generateG4E7AT(road),frozen=JSON.stringify(at),
  ua=generateG4E7AUInspection(road),meta=ua.stageForge.g4e7auStudy;
 assert(eq(ua,generateG4E7AUInspection(road)));
 assert.equal(JSON.stringify(at),frozen);
 assert(eq(ua.surfaces,at.surfaces));assert(eq(ua.movingObstacles,at.movingObstacles));
 assert(eq(ua.route,at.route));assert(eq(ua.routeSegments,at.routeSegments));
 assert(eq(ua.spawns.slice(0,meta.originalSpawns),at.spawns));
 assert.equal(ua.surfaces.length,7);assert.equal(ua.movingObstacles.length,28);
 assert.equal(meta.formalSlope2Meters,0);assert.equal(meta.publish,'HOLD');
 assert.equal(meta.notARescueCheckpoint,true);assert.equal(meta.inspectionPointCount,2);
 for(let i=0;i<AU_POINTS.length;i++){
  const sp=ua.spawns[meta.originalSpawns+i];
  assert.equal(sp.surface,ua.surfaces[1].id);
  assert.equal(sp.u,AU_POINTS[i].u);
  const r=new Runner(ua,compile(ua),meta.originalSpawns+i,105);
  assert(r.p.every(Number.isFinite));
  assert.equal(r.surface,ua.surfaces[1].id);
  for(let k=0;k<Math.round(.25/DT)&&['ready','running'].includes(r.status);k++)r.step(0);
  assert(r.time>0);
 }
});
test('AU inspection does not accept unknown stage',()=>
 assert.throws(()=>generateG4E7AUInspection('r2-control'),/unknown physical road/));
