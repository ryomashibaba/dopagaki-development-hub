import test from 'node:test';
import assert from 'node:assert/strict';
import {originalB51TrueSpatialCue} from '../scripts/p101-r15s3d10-physical-b51-hud-cue.mjs';
const make=(x,z,id)=>({id,type:'slider',position:[x,0,z],size:[2,3,2],enabled:true});
const runner={time:4,p:[0,1,0],forward:[0,0,1]};
const view={eye:[0,6,-13],front:[0,0,1],right:[1,0,0],up:[0,1,0]};
const pose=o=>({center:o.position,halfSize:o.size.map(x=>x/2),enabled:true});
const separation=(p,r,b)=>({separation:Math.hypot(...p.map((x,i)=>x-b.center[i]))-r-1});
test('original 28 B51 physical 3D warning selects truly near in FOV and never invents ETA',()=>{
 const bodies=Array.from({length:28},(_,i)=>make(100+i*10,400+i*5,'b51-'+i));
 bodies[4]=make(0,22,'source-front');
 bodies[5]=make(0,-30,'source-behind');
 bodies[6]=make(0,145,'too-far');
 const r=originalB51TrueSpatialCue({movingObstacles:bodies},runner,view,pose,separation);
 assert.equal(r.physicallyAuthoredB51,28);
 assert.equal(r.next.id,'source-front');
 assert.ok(r.next.actualBoxSurfaceSeparationM>0);
 assert.match(r.message,/実B51 source-front/);
 assert.ok(!/0.0秒|予測位置|ETA|必ず衝突|衝突回避を保証/.test(r.message));
 assert.equal(r.occlusionUntested,true);
 assert.equal(r.originalSourceObjectsUnchanged,true);
});
test('no false source hazard when visible bodies are far / behind',()=>{
 const bodies=Array.from({length:28},(_,i)=>make(200+i*3,800,'source-'+i));
 const r=originalB51TrueSpatialCue({movingObstacles:bodies},runner,view,pose,separation);
 assert.equal(r.next,null);
 assert.match(r.message,/近接動体なし/);
});
test('close physical B51 cannot vanish solely because behind camera',()=>{
 const bodies=Array.from({length:28},(_,i)=>make(100+i*3,500,'ob-'+i));
 bodies[4]=make(0,-5,'real-near-behind');
 const r=originalB51TrueSpatialCue({movingObstacles:bodies},runner,view,pose,separation);
 assert.equal(r.next.id,'real-near-behind');
 assert.equal(r.sideOrRearPhysicalNearNotSilentlyHidden,true);
 assert.match(r.message,/近接B51 real-near-behind/);
 assert.match(r.message,/後方・側方/);
 assert.ok(!/衝突予測秒|0.0秒|必ず危険/.test(r.message));
});
test('off-axis real 10m B51 stays noted but not falsely marked visible',()=>{
 const bodies=Array.from({length:28},(_,i)=>make(400+i*3,500,'ob-'+i));
 bodies[2]=make(13,0,'source-outboard');
 const r=originalB51TrueSpatialCue({movingObstacles:bodies},runner,view,pose,separation);
 assert.equal(r.next.id,'source-outboard');
 assert.equal(r.sideOrRearPhysicalNearNotSilentlyHidden,true);
 assert.match(r.message,/画面外・側方/);
});
test('reject malformed missing 28 original B51',()=>{
 assert.throws(()=>originalB51TrueSpatialCue({movingObstacles:[]},runner,view,pose,separation),/28 original/);
});
test('no mutation of 28 source hazards, player or camera',()=>{
 const bodies=Array.from({length:28},(_,i)=>make(100+i,400+i,'ob-'+i));
 const old=JSON.stringify(bodies),p=JSON.stringify(runner),v=JSON.stringify(view);
 originalB51TrueSpatialCue({movingObstacles:bodies},runner,view,pose,separation);
 assert.equal(JSON.stringify(bodies),old);
 assert.equal(JSON.stringify(runner),p);
 assert.equal(JSON.stringify(view),v);
});
