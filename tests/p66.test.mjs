import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush,P66_GEOMETRY} from '../scripts/p66-echo-rebuild.mjs';
import {validate,sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT,FIXTURE_IMPULSES} from '../private/reference_only/director/physics.js';
import {normalizeMovingObstacles} from '../private/reference_only/director/moving/moving-obstacles.mjs';

const stage=generateEchoRush();
test('P66 builds independent B48-ready real 3D roads; P62 SHA inputs preserved',()=>{
 const out=validate(stage);
 assert.equal(out.stageForge.id,'EP-P66');
 assert(out.surfaces.length<=32&&out.surfaces.length>=18);
 assert.equal(out.surfaces.filter(x=>x.rideable&&x.collidable).length,stage.surfaces.length);
 assert.equal(P66_GEOMETRY.spiralAngleDegrees,450);
 assert.equal(P66_GEOMETRY.gapMeters,25);
 assert.equal(out.fixtures.some(x=>x.kind==='boosterCube'||x.kind==='shove'),false);
 assert(out.spawns.length>=6);
 assert(out.visualBlueprint.spiralRings.length>=5);
 assert.deepEqual(FIXTURE_IMPULSES.shove,{side:10,lift:8,forward:3});
 assert.equal(DT,1/240);
});
test('P66 changes vertical terrain, physical Y branches and a real 25m jump void',()=>{
 const road=id=>stage.surfaces.find(x=>x.id===id);
 const takeoff=road('p66-GAP_TAKEOFF-01');
 const landing=road('p66-GAP_LANDING-01');
 const before=sample(takeoff,1,.5),after=sample(landing,0,.5);
 assert(Math.abs(after[0]-before[0]-25)<.01,'missing true 25m road gap');
 assert(!stage.surfaces.some(s=>s.id.includes('BRIDGE_GAP')),'do not hide jump bridge');
 const y=stage.surfaces.flatMap(s=>s.points.map(p=>p[1]));
 assert(Math.max(...y)-Math.min(...y)>180,'insufficient colossal verticality');
 const L=sample(road('p66-FORK_L-01'),.9,.5);
 const R=sample(road('p66-FORK_R-01'),.9,.5);
 assert(Math.abs(L[2]-R[2])>120,'fork separation too small');
 assert(Math.abs(L[1]-R[1])>12,'fork altitude separation too small');
});
test('P66 3 × B51-C machine modes; 6 animated native colliders',()=>{
 const all=normalizeMovingObstacles(stage);
 assert.equal(all.length,6);
 assert.deepEqual([...new Set(all.map(x=>x.type))].sort(),['piston','rotator','slider']);
 assert.deepEqual([...new Set(all.map(x=>x.collision.mode))].sort(),['bounce','fail','push']);
});
test('P66 initial downhill is actually traversable by unmodified native physics',()=>{
 const world=compile(stage);
 const rider=new Runner(stage,world,0,44);
 const initialPosition=[...rider.p];
 for(let i=0;i<Math.round(2.2/DT)&&rider.status!=='failed'&&rider.status!=='finished';i++)rider.step(0);
 assert.notEqual(rider.status,'failed',JSON.stringify(rider.failure));
 assert(Math.hypot(rider.p[0]-initialPosition[0],rider.p[2]-initialPosition[2])>35,'Runner did not advance on P76 downhill intake: '+rider.p);
 assert(rider.p[1]<239,'The giant pipe descent is not physically progressing: '+rider.p[1]);
});
test('P66 lip launches genuine airborne segment with no jump power-ups',()=>{
 const world=compile(stage);
 const rider=new Runner(stage,world,5,51);
 let air=0;
 for(let i=0;i<Math.round(4.3/DT)&&rider.status!=='failed'&&rider.status!=='finished';i++){
  rider.step(0);if(!rider.grounded)air++;
 }
 assert(air>25,'Natural jump did not yield measurable airtime (frames='+air+', status='+rider.status+')');
 assert(!rider.events.some(e=>e.type==='boosterCube'||e.type==='shove'),'jump used authored impulse instead of physical ramp');
});
