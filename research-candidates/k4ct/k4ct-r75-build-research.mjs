/** R75 isolated true B48 research candidate. Never overwrites source Stage. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const [original,out,...flags]=process.argv.slice(2);
if(!original||!out)throw Error('Usage: node k4ct-r75-build-research.mjs SOURCE_R73_STAGE.json NEW_R75_STAGE.json [--solid-control]');
assert.notEqual(path.resolve(original),path.resolve(out),'Original R73 source must not be overwritten');
assert(!fs.existsSync(out),'Do not overwrite prior research candidate');
const bytes=fs.readFileSync(original),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
assert.equal(sha(bytes),'a64ad9cbaeb96743738dfe04567283fe4bbbb139f1078423f91f8a25422c684d');
const baseline=JSON.parse(bytes),doc=structuredClone(baseline);
assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
const desired=[36,62,40,32,32,32,32];
const landing={21:151,22:149,23:147,24:144,25:141,26:136,27:131,28:127};
let widened=0;
for(let road=0;road<7;road++){
 const s=doc.surfaces[road];assert.deepEqual([s.rows,s.cols,s.resolution],[31,5,3]);
 for(let i=0;i<31;i++){
  const row=s.points.slice(i*5,i*5+5),mid=[...row[2]];
  const w=Math.hypot(row[4][0]-row[0][0],row[4][1]-row[0][1],row[4][2]-row[0][2]);
  const target=road===0&&i>=16&&i<=21?32:road===4&&i>=22&&i<=24?26:desired[road];
  if(w<target){const ratio=target/w;
   for(const p of row){p[0]=mid[0]+(p[0]-mid[0])*ratio;p[2]=mid[2]+(p[2]-mid[2])*ratio;}
   widened++;
  }
  if(road===0&&Object.hasOwn(landing,i)){
   const dy=landing[i]-row[2][1];for(const p of row)p[1]+=dy;
  }
  // Road2 j-axis flips 180deg between rows19/20 in original R73 source.
  // Restore orientation through downstream roads without moving centerlines.
  if(road>=3||(road===2&&i>=20))row.reverse();
  s.points.splice(i*5,5,...row);
 }
}
const solid=flags.includes('--solid-control');
if(solid)delete doc.surfaces[0].voidLongitudinalCells;
else doc.surfaces[0].voidLongitudinalCells=[52,53,54];
doc.name='R75 original 240Hz physical pilot / WIDE ENTRY + REAL CHASM / ART HUMAN HOLD';
doc.stageForge.r75Pilot={
 sourceR73StageSHA256:sha(bytes),status:'RESEARCH_ONLY_UNCERTIFIED',
 originalRendererCameraRunnerPhysicsB51SourceUnmodified:true,noFakeCollidersOrHiddenSteering:true,
 formalArtAccepted:0,officialSlope2DNAMetres:0,human:'HOLD',SAT:'HOLD',CCD:'HOLD',release:'HOLD',
 independentRealVoid:solid?[]:[52,53,54],groundedLanding:'TO_BE_MEASURED_WITH_240HZ_RUNNER'
};
for(const key of ['movingObstacles','routeSegments','route','spawns','fixtures'])assert.deepEqual(doc[key],baseline[key]);
for(let road=0;road<7;road++)for(let i=0;i<31;i++){
 const a=baseline.surfaces[road].points[i*5+2],b=doc.surfaces[road].points[i*5+2];
 assert.equal(a[0],b[0]);assert.equal(a[2],b[2]);
 if(road!==0||!Object.hasOwn(landing,i))assert.equal(a[1],b[1]);
}
const outBytes=Buffer.from(JSON.stringify(doc)+'\n','utf8');
fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,outBytes,{flag:'wx'});
console.log(JSON.stringify({sourceSHA256:sha(bytes),candidateSHA256:sha(outBytes),roads:7,movingB51:28,voidCells:doc.surfaces[0].voidLongitudinalCells??[],widenedControlRows:widened,formalArtAccepted:0,human:'HOLD'}));
