/**
 * R15O original B48 road geometry causal inspector, NO MODIFICATION.
 * Last-grounded player/native velocity -> nearest real road grid row/u/v,
 * longitudinal end vs side border, width and immediate next-road center.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {generateG4E7BC} from './p101-w9c2-g4e7bc-bank-contour.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
const ROAD=['true-pinch','pinch-switch'],SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const r=(n)=>Number(n.toFixed(5));
const d3=(p,q)=>Math.hypot(...p.map((v,i)=>v-q[i]));
const dh=(p,q)=>Math.hypot(p[0]-q[0],p[2]-q[2]);
function search(s,p){
 let best=null;
 for(let i=0;i<=150;i++)for(let j=0;j<=40;j++){
  const u=i/150,v=j/40,q=sample(s,u,v),dist=d3(q,p),xz=dh(q,p);
  if(!best||dist<best.d3)best={u,v,d3:dist,dXZ:xz,xyz:q};
 }
 return {u:r(best.u),v:r(best.v),nearest3D:r(best.d3),
  nearestXZ:r(best.dXZ),point:best.xyz.map(r)};
}
function inspect(road,cas){
 const doc=generateG4E7BC(road,'rollDeck');
 const s=doc.surfaces[1],world=compile(doc);
 assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
 assert.equal(s.id,'p93-CROWN_REVERSAL-01');
 const original=JSON.stringify(doc);
 const baseline=cas[0];
 const last=baseline.trueLastSourcePhysicalRoadSupport,
       first=baseline.firstOriginalTickWithoutRoadSupport;
 const positions={lastGrounded:last.playerWorldXYZ,firstAir:first.playerWorldXYZ,
   atFirst:cas[0].sampledSourceB48RoadMeshAndTopBoundaryRelations.find(x=>Math.abs(x.seconds-17)<.00001)?.playerWorldXYZ};
 const samples=Object.fromEntries(Object.entries(positions).map(([name,xyz])=>{
  const p=search(s,xyz),s2=search(doc.surfaces[2],xyz);
  const nativeContacts=contacts(world,xyz,.65).filter(x=>x.triangle.rideable)
   .map(x=>({road:x.triangle.surface,dist:r(x.distance),normal:x.normal.map(r)})).slice(0,6);
  return [name,{sourceB48:xyz,nearestCurrentCrown:p,
   nearestNextOriginalRoad:s2,originalContactWitness:nativeContacts}];
 }));
 const rows=[0,3,6,8,10,12,14,16,18,20,22,24,26,28,30].map(i=>{
  const u=i/30,lc=sample(s,u,0),m=sample(s,u,.5),rc=sample(s,u,1);
  return {row:i,u:r(u),center:m.map(r),
   widthXZ:r(dh(lc,rc)),half0:lc.map(r),half1:rc.map(r)};
 });
 const nearest=search(s,last.playerWorldXYZ);
 const v=nearest.v,u=nearest.u;
 assert.equal(JSON.stringify(doc),original);
 return {road,originalSourceBlob:SHA,worldSourceTriangleCount:world.count,
  sourceOriginalCrownRoadId:s.id,
  sourceFirstRoadGapIsUnmodified:doc.surfaces[0].voidLongitudinalCells,
  actualLastGroundedTick:last.tick,actualNextAirTick:first.tick,
  originalLastVelocityXYZ:last.playerVelocityXYZ,
  originalNativePositionParametricDistanceWitnesses:samples,
  sourceCrownRealRows:rows,
  candidateStudyRegionAroundActualExitU:[r(Math.max(.02,u-.16)),r(Math.min(.98,u+.13))],
  lastExitParametricLocalUV:{u,v},
  originalWorldEdited:false,actualNewColliders:0,
  humanOrArtCertified:false};
}
const argv=process.argv.slice(2),flag=k=>{const i=argv.indexOf(k);assert.ok(i>=0,k);return argv[i+1]};
const data=JSON.parse(fs.readFileSync(flag('--r15m'),'utf8'));
assert.equal(data.sourceGameBlob,SHA);
const out={schema:'dopagaki.r15o-original-native-real-b48-road-end-vs-side-geometric-diagnosis/1',
 sourceBlob:SHA,results:ROAD.map(r=>inspect(r,data.originalSourcedEngineExitAnd3DBlenderGroundRelations[r])),
 originalGameEdited:false,art:'HOLD',gameplay:'HOLD'};
fs.mkdirSync(flag('--out'),{recursive:true});
fs.writeFileSync(flag('--out')+'/R15O_ORIGINAL_NATIVE_B48_CROWN_ROAD_EXIT_PARAMETRIC_SOURCE_DIAGNOSIS.json',JSON.stringify(out,null,2)+'\n');
for(const x of out.results)console.log('R15O_ACTUAL_B48_ROAD_EXIT_PARAMETRIC',JSON.stringify(x).slice(0,6800));
