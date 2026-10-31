/** R19 A6 P2: camera-independent real B48 source roadway stations for Blender.
 * Geometry coordinates are the ORIGINAL physics-driven W9-C1 surface sample.
 * This is a noncolliding architecture coordinate guide, not a new road.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {generateP101W9C1AbyssCandidate} from './p101-w9c1-abyss-narrow.mjs';
import {sample} from '../private/reference_only/director/surface.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const original=fs.readFileSync(path.join(root,'web/p101-w9c2-g4e7ci-integrated-streetscape.mjs'));
const blob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+original.length+'\\0'),original])).digest('hex');
assert.equal(blob,'af076d67492a677d2235e4730aef8cdf4808e106');
const out=path.join(root,'r19-evidence/r19a6p2');fs.mkdirSync(out,{recursive:true});
for(const mode of ['ultra','control']){
 const stage=generateP101W9C1AbyssCandidate(mode);
 const before=JSON.stringify(stage);
 assert.equal(stage.surfaces.length,7);assert.equal(stage.movingObstacles.length,28);
 const roads=[0,1].map(index=>{
  const s=stage.surfaces[index],stations=[];
  for(let k=0;k<=80;k++){
   const u=k/80,center=sample(s,u,.5),left=sample(s,u,0),right=sample(s,u,1);
   const old=sample(s,Math.max(0,u-.003),.5),next=sample(s,Math.min(1,u+.003),.5);
   const fwd=[next[0]-old[0],0,next[2]-old[2]];
   const n=Math.hypot(...fwd);assert.ok(n>1e-5);
   const f=fwd.map(x=>x/n);
   stations.push({u,center,left,right,forward:f,nominalWidth:Math.hypot(...left.map((a,i)=>a-right[i]))});
  }
  return {index,id:s.id,stations};
 });
 assert.equal(before,JSON.stringify(stage),'anchors must never mutate physics stage');
 const data={schema:'dopagaki.r19a6p2-real-source-b48-stations/1',mode,sourceBlob:blob,
  researchOnly:true,roadCount:7,realB51:28,addedColliders:0,
  worldXYZFormat:'original WebGL2 x,y(up),z; Blender converts to x,-z,y',
  roads,ART:'HOLD',HUMAN:'HOLD'};
 fs.writeFileSync(path.join(out,'P2_'+mode+'_real_road_anchors.json'),JSON.stringify(data,null,2)+'\n');
 console.log('R19A6P2_SOURCE_ROAD_ANCHORS',JSON.stringify({mode,stations:roads.map(x=>x.stations.length),minWidth:Math.min(...roads[0].stations.map(x=>x.nominalWidth)),blob}));
}
