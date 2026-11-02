/** K: all SEVEN original B48 surface anchor grids, both source physical widths.
 * No mesh writes, art approval or speculative new roadway; source stage in memory only.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {generateP101W9C1AbyssCandidate} from './p101-w9c1-abyss-narrow.mjs';
import {sample} from '../private/reference_only/director/surface.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const src=fs.readFileSync(path.join(root,'web/p101-w9c2-g4e7ci-integrated-streetscape.mjs'));
const sha=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+src.length+'\0'),src])).digest('hex');
assert.equal(sha,'af076d67492a677d2235e4730aef8cdf4808e106');
const out=path.join(root,'r19-evidence/r19a6p4r2f5k');
fs.mkdirSync(out,{recursive:true});
const result={schema:'dopagaki.r2f5k-seven-original-road-anchors-source/1',
 originalGameBlob:sha,physicalRoadCount:7,originalB51:28,nominalCourseM:7280,
 researchOnly:true,geometrySafety:'NOT_TESTED',addedColliders:0,
 ART:'HOLD',HUMAN:'HOLD',sourceModes:{}};
for(const mode of ['ultra','control']){
 const stage=generateP101W9C1AbyssCandidate(mode),before=JSON.stringify(stage);
 assert.equal(stage.surfaces.length,7);assert.equal(stage.movingObstacles.length,28);
 const roads=stage.surfaces.map((s,ri)=>{
  assert.ok(s.collidable&&s.rideable,'Road must be physical source B48');
  const stations=Array.from({length:81},(_,i)=>{
   const u=i/80,center=sample(s,u,.5),left=sample(s,u,0),right=sample(s,u,1);
   const pp=sample(s,Math.max(0,u-.003),.5);
   const qq=sample(s,Math.min(1,u+.003),.5);
   const fw=[qq[0]-pp[0],0,qq[2]-pp[2]];
   const norm=Math.hypot(...fw);
   assert.ok(norm>1e-7&&[...center,...left,...right].every(Number.isFinite));
   const forward=fw.map(x=>x/norm);
   const nominalWidth=Math.hypot(...left.map((v,k)=>v-right[k]));
   assert.ok(nominalWidth>5);
   return {u,center,left,right,forward,nominalWidth};
  });
  return {index:ri,id:s.id,stations};
 });
 assert.equal(before,JSON.stringify(stage),'Mutating source world prohibited');
 assert.equal(roads.length,7);
 assert.equal(roads.reduce((n,x)=>n+x.stations.length,0),567);
 result.sourceModes[mode]={sourceSurfaceIds:roads.map(x=>x.id),stationsPerRoad:81,roads};
}
assert.deepEqual(result.sourceModes.ultra.sourceSurfaceIds,result.sourceModes.control.sourceSurfaceIds);
const filename=path.join(out,'R2F5K_ALL7_FROZEN_SOURCE_ROAD_ANCHORS.json');
fs.writeFileSync(filename,JSON.stringify(result,null,2)+'\n');
console.log('R2F5K_ALL_SEVEN_SOURCE_B48_ANCHORS_OK',JSON.stringify({
 modes:2,roadsPerMode:7,stationsPerRoad:81,
 sampleCount:1134,originalBlob:sha,art:'HOLD'}));
