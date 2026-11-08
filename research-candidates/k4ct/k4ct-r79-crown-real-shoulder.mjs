/** R79 offline isolated B48 CROWN roadway physical shoulders.
 * Road0 jump & legacy Game/Runner/Camera/B51 are preserved, no altered steering or assist.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import assert from 'node:assert/strict';
const [src,out,amountText='24']=process.argv.slice(2);
if(!src||!out)throw Error('node r79-crown-real-shoulder.mjs originalR78.json NEW_R79.json [shoulderM=24]');
const amount=Number(amountText);assert([0,12,20,28,36].includes(amount));
assert.notEqual(path.resolve(src),path.resolve(out));assert(!fs.existsSync(out));
const bytes=fs.readFileSync(src),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const originalHash='4ea956114b868c8ab3ec991b780fcf7498d71c994a8a3962bc804e2f907a361f';
assert.equal(sha(bytes),originalHash,'Original R78 drift');
const doc=JSON.parse(bytes),cand=structuredClone(doc);
assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
assert.equal(doc.surfaces[1].id,'p93-CROWN_REVERSAL-01');
const road=cand.surfaces[1],before=doc.surfaces[1];
const ramp=i=>i<=3||i>=25?0:i<9?(i-3)/6:i<=19?1:(25-i)/6;
for(let i=0;i<31;i++){
 const a=before.points.slice(i*5,i*5+5), row=road.points.slice(i*5,i*5+5);
 const p0=a[0],p4=a[4];const dx=p4[0]-p0[0],dz=p4[2]-p0[2],len=Math.hypot(dx,dz);
 assert(len>1);const ux=dx/len,uz=dz/len;
 const extend=amount*ramp(i);
 for(let k=0;k<5;k++){
   const t=k/4;
   // Outer shoulder at v=0, zero change at v=1, preserves route centerline? center moves half-width;
   // preserve centerline exactly instead: proportional radial out from both sides, 0 at k=2.
   const delta=(k-2)/2*extend; // v0 -extend; v1 +extend
   const p=row[k];p[0]+=ux*delta;p[2]+=uz*delta;
   assert.equal(p[1],a[k][1]);
 }
}
for(let j=0;j<7;j++)if(j!==1)assert.deepEqual(cand.surfaces[j],doc.surfaces[j]);
for(const k of ['movingObstacles','route','routeSegments','spawns','fixtures','stageForge'])assert.deepEqual(cand[k],doc[k]);
for(let i=0;i<31;i++)assert.deepEqual(road.points[i*5+2],before.points[i*5+2]);
for(let i=0;i<31;i++)if(i<=3||i>=25)assert.deepEqual(road.points.slice(i*5,i*5+5),before.points.slice(i*5,i*5+5));
cand.name='K4CT R79 / CROWN readably banked continuous wide shoulder / native human hold';
cand.stageForge.r79Research={sourceR78SHA256:originalHash,shoulderMaxM:amount,road:'p93-CROWN_REVERSAL-01',edits:'B48 physical 31x5 road1 only; centerline constant; symmetric shoulder each side',road0VoidIdentical:true,originalMovingB51Unchanged:28,noSteeringOrAssistChange:true,claim:'physical research not human/art/7-road certified'};
fs.mkdirSync(path.dirname(out),{recursive:true});const buf=Buffer.from(JSON.stringify(cand)+'\n');fs.writeFileSync(out,buf,{flag:'wx'});
console.log(JSON.stringify({status:'R79_RESEARCH_STAGE_GENERATED',sha256:sha(buf),sourceR78SHA256:originalHash,amount,roadCount:cand.surfaces.length,movingB51:cand.movingObstacles.length}));
