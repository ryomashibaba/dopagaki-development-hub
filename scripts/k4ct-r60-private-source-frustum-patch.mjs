/** R60: readonly original 240Hz source camera and exact active moving B51 poses.
 * GENERATED PRIVATE k4ct renderer ONLY; no geometry, original camera or game edit.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
const file='dist-private/k4ct/drive3d.mjs';
let s=fs.readFileSync(file,'utf8');
const one=(from,to)=>{
 assert.equal(s.split(from).length,2,'R60 unique generated renderer anchor '+from);
 s=s.replace(from,to);
};
const cam=" const r12Skip=window.__k4ctR12SkipGroup??null;";
one(cam,
 " window.__k4ctR60ActualCamera=[...view.eye,...view.front,...view.right,...view.up];\n"+cam);
const hazard=" const dual=readK4CTTwoTrueB51(doc,runner,k4csReader,movingObstaclePose,sphereBoxSeparation);";
const capture=String.raw`
 window.__k4ctR60SourceB51Pose=k4csReader.stations.filter(s=>
  s.id==='a13-machine-14'||s.id==='a13-machine-15').map(s=>{
   const pose=movingObstaclePose(s.ob,runner.time);
   return {id:s.id,sourceTick:Math.round(runner.time*240),
    centre:pose?.center?.slice(),halfSize:pose?.halfSize?.slice(),
    yawRadians:pose?.yawRadians,enabled:pose?.enabled,
    sourceStation: s.distance,sourceRoadIndex:s.roadIndex,
    staticCollisionMode:s.collisionMode,
    isOriginalNativeMovingB51:true};
  });
`;
one(hazard,hazard+capture);
assert.ok(s.includes('window.__k4ctR60ActualCamera='));
assert.ok(s.includes('window.__k4ctR60SourceB51Pose='));
fs.writeFileSync(file,s);
console.log('R60_PRIVATE_READONLY_SOURCE_CAMERA_AND_B51_NATIVE_POSES_INSTRUMENTED');
