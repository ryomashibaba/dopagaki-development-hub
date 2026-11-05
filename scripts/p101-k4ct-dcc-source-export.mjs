/** Native Blender coordinates are exported ONLY from the existing K4CT research stage.
 * No source Game/Camera/Road/240Hz/28 B51 mutation. Same two actual stations.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {sample} from '../private/reference_only/director/surface.js';
import {makeK4CSRealB51RoadPlan} from './p101-k4cs-true-b48-ahead-b51-readable-cues.mjs';
const file='dist-private/generated/K4CT_TWO_REAL_B51_NATIVE_CHOICE_PRIVATE.json';
const doc=JSON.parse(fs.readFileSync(file,'utf8'));
assert.ok(doc.stageForge?.k4ctPrivate&&!doc.stageForge.productionPromoted);
assert.equal(doc.surfaces.length,7);
assert.equal(doc.movingObstacles.length,28);
const roadSha=crypto.createHash('sha256').update(JSON.stringify(doc.surfaces[5].points)).digest('hex');
assert.equal(roadSha,'4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b');
const plan=makeK4CSRealB51RoadPlan(doc,sample);
const stations=plan.stations.filter(s=>['a13-machine-13','a13-machine-14'].includes(s.id));
assert.equal(stations.length,2,'two exact ORIGINAL B51 station IDs');
assert.ok(stations[0].roadIndex===5&&stations[1].roadIndex===6);
const roads=[5,6].map(i=>({index:i,id:doc.surfaces[i].id,
 samples:Array.from({length:129},(_,k)=>{
  const u=k/128,s=doc.surfaces[i];
  return {u,left:sample(s,u,0),center:sample(s,u,.5),right:sample(s,u,1)};
 })}));
const site={schema:'k4ct-authentic-source-physical-spillway-dcc-v1',
 sourceGameBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
 researchPhysicalRoad5SHA256:roadSha,originalB48Count:7,originalB51Count:28,
 stations:stations.map(s=>({id:s.id,roadIndex:s.roadIndex,u:s.u,stationM:s.distance,
  type:s.ob.type,worldCenter:s.ob.position,collisionMode:s.collisionMode})),
 roads,officialArtAdopted:0,slope2DNAmeters:0,ART:'HOLD',HUMAN:'HOLD',newColliders:0};
const dest=path.resolve('test-results/k4ct-contact-retry');
fs.mkdirSync(dest,{recursive:true});
fs.writeFileSync(path.join(dest,'K4CT_DCC_AUTHENTIC_SITE.json'),JSON.stringify(site)+'\n');
console.log('K4CT_SOURCE_B51_13_14_DCC_SITE',JSON.stringify({ids:site.stations.map(s=>s.id),
 roads:roads.map(r=>r.index),newColliders:0,originalRoad5SourceSHA:roadSha}));
