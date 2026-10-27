/**
 * DR PRIVATE reference ONLY: lossless original B48 physical triangles and all
 * original B51-C oriented-box poses at true 240Hz scripted (not human) ticks.
 * No edits to the original stage, renderer, physics, camera or controls.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {generateG4E7BC} from './p101-w9c2-g4e7bc-bank-contour.mjs';
import {tessellate} from '../private/reference_only/director/surface.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {g4e7djNativeStoryboard} from './p101-w9c2-g4e7dj-native-storyboard.mjs';
import {DO_TIMES} from './p101-w9c2-g4e7do-master-export.mjs';
import {DT} from '../private/reference_only/director/physics.js';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function pack(a){
 assert.equal(a.positions.length%3,0);
 assert.equal(a.indices.length%3,0);
 const b=Buffer.allocUnsafe(a.positions.length*8+a.indices.length*4);
 a.positions.forEach((p,i)=>{assert.ok(Number.isFinite(p));b.writeDoubleLE(p,i*8);});
 const offset=a.positions.length*8;
 a.indices.forEach((ix,i)=>{
  assert.ok(Number.isSafeInteger(ix)&&ix>=0&&ix<a.positions.length/3);
  b.writeUInt32LE(ix,offset+i*4);
 });
 return b;
}
export function buildDrPhysicalReference(road,native=g4e7djNativeStoryboard()){
 assert.ok(['true-pinch','pinch-switch'].includes(road),'DR unsupported BC road');
 const doc=generateG4E7BC(road,'rollDeck'),frozen=JSON.stringify(doc),stage=native.stages[road];
 assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
 assert.equal(stage.actualB48,7);assert.equal(stage.actualMovingB51,28);
 assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
 assert.equal(doc.stageForge.productionPromoted,false);
 const roadMeshes=[],chunks=[];let byteOffset=0;
 for(let n=0;n<doc.surfaces.length;n++){
  const s=doc.surfaces[n],a=tessellate(s),bytes=pack(a);
  assert.equal(a.topIndexCount+a.bottomIndexCount+a.sideIndexCount,a.indices.length);
  let gapProof=null;
  if(n===0){
   const nv=(s.cols-1)*s.resolution,slots=new Set();
   for(let j=0;j<a.topIndexCount;j+=3){
    const row=Math.min(...a.indices.slice(j,j+3).map(k=>Math.floor(k/(nv+1))));
    slots.add(row);
   }
   assert.ok(slots.has(51)&&!slots.has(52)&&slots.has(53),'actual B48 physical gap52 disappeared');
   gapProof={voidCell:52,topSlot51Present:true,topSlot52Absent:true,topSlot53Present:true};
  }
  roadMeshes.push({index:n,id:s.id,name:s.name,material:s.material,
   rideable:s.rideable,collidable:s.collidable,
   positionsScalarCount:a.positions.length,indexCount:a.indices.length,
   topIndexCount:a.topIndexCount,bottomIndexCount:a.bottomIndexCount,
   sideIndexCount:a.sideIndexCount,fileByteOffset:byteOffset,fileByteLength:bytes.length,
   sha256:hash(bytes),gapProof});
  chunks.push(bytes);byteOffset+=bytes.length;
 }
 const shots=DO_TIMES.map(id=>{
  const f=stage.frames.find(s=>s.id===id);
  assert.ok(f&&Number.isSafeInteger(f.tick));
  const time=f.tick*DT;
  assert.ok(Math.abs(f.timeSeconds-time)<1e-4);
  const moving=doc.movingObstacles.map(ob=>{
   const p=movingObstaclePose(ob,time);
   assert.ok(p.enabled&&p.center.every(Number.isFinite)&&Number.isFinite(p.yawRadians));
   return {id:p.id,type:p.type,center:p.center,halfSize:p.halfSize,
    yawRadians:p.yawRadians,enabled:p.enabled};
  });
  assert.equal(moving.length,28);
  return {id,tick:f.tick,timeSeconds:time,originalPlayerPosition:f.pose.position,
   originalEye:f.eye,moving};
 });
 assert.equal(JSON.stringify(doc),frozen,'DR must not mutate BC physics');
 const binary=Buffer.concat(chunks);
 const meta={schema:'dopagaki.g4e7dr-original-b48-b51-private/1',road,
  originalStageId:doc.stageForge.recordStageId,originalDocSha256:hash(Buffer.from(frozen)),
  dataFilename:road+'.b48-f64.bin',binarySha256:hash(binary),binaryBytes:binary.length,
  b48:roadMeshes,b51Ids:doc.movingObstacles.map(o=>o.id),shots,
  surfaces:7,movers:28,gap52Confirmed:true,
  geometry:'EXACT_ORIGINAL_GAME_TESSELLATE_FLOAT64_WORLD_COORDINATES',
  motion:'EXACT_ORIGINAL_MOVING_OBSTACLE_POSE_AT_NATIVE_TICK_DT',
  camera:'UNCHANGED_ORIGINAL_240HZ_START00_P96_NOT_HUMAN',
  collisionRendering:'OBB_PROXY_WITH_EXACT_PHYSICS_BOUNDS',
  materials:'BLENDER_ONLY_NOT_GAME_MATERIALS',
  originalGameWebGL:'NOT_RENDERED',
  art:'HOLD',human:'HOLD',ready:'HOLD',publish:'HOLD',merge:'HOLD',
  officialSlope2Meters:0};
 return {metadata:meta,binary};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const dir=path.resolve('test-results/g4e7dr-physical-reference/data');
 fs.mkdirSync(dir,{recursive:true});
 const native=g4e7djNativeStoryboard();
 for(const road of ['true-pinch','pinch-switch']){
  const {metadata,binary}=buildDrPhysicalReference(road,native);
  fs.writeFileSync(path.join(dir,road+'.json'),JSON.stringify(metadata,null,2)+'\n');
  fs.writeFileSync(path.join(dir,metadata.dataFilename),binary);
  console.log('DR_REAL_B48_B51_EXPORTED',JSON.stringify({
   road,bytes:binary.length,sha256:metadata.binarySha256,
   b48:metadata.surfaces,b51:metadata.movers,gap52:metadata.gap52Confirmed}));
 }
}