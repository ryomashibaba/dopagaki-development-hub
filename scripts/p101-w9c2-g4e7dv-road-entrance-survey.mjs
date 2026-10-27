/**
 * G4E-7DV: actual B48 surface vs proven-clear DU pedestrian-axis entrance.
 * Physical connection feasibility survey ONLY. Never treat a clear camera ray
 * as a real walkway, never add a fake road/collider, never alter game motion.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {generateG4E7BC} from './p101-w9c2-g4e7bc-bank-contour.mjs';
import {tessellate} from '../private/reference_only/director/surface.js';
import {DU_CORRIDOR} from './p101-w9c2-g4e7du-exact-sightline.mjs';
import {g4e7djNativeStoryboard} from './p101-w9c2-g4e7dj-native-storyboard.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';

const add=(a,b)=>a.map((x,k)=>x+b[k]),sub=(a,b)=>a.map((x,k)=>x-b[k]);
const mul=(a,s)=>a.map(x=>x*s),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const len=a=>Math.hypot(...a),d=(a,b)=>len(sub(a,b));
function nearestTri(p,a,b,c){
 // Exact nearest point on a triangle in 3D; Ericson regions A/B/C/AB/AC/BC/face.
 const ab=sub(b,a),ac=sub(c,a),ap=sub(p,a),d1=dot(ab,ap),d2=dot(ac,ap);
 if(d1<=0&&d2<=0)return a;
 const bp=sub(p,b),d3=dot(ab,bp),d4=dot(ac,bp);
 if(d3>=0&&d4<=d3)return b;
 const vc=d1*d4-d3*d2;
 if(vc<=0&&d1>=0&&d3<=0)return add(a,mul(ab,d1/(d1-d3)));
 const cp=sub(p,c),d5=dot(ab,cp),d6=dot(ac,cp);
 if(d6>=0&&d5<=d6)return c;
 const vb=d5*d2-d1*d6;
 if(vb<=0&&d2>=0&&d6<=0)return add(a,mul(ac,d2/(d2-d6)));
 const va=d3*d6-d5*d4;
 if(va<=0&&(d4-d3)>=0&&(d5-d6)>=0)return add(b,mul(sub(c,b),(d4-d3)/((d4-d3)+(d5-d6))));
 const sum=va+vb+vc;if(Math.abs(sum)<1e-14)return a;
 return add(add(a,mul(ab,vb/sum)),mul(ac,vc/sum));
}
function skin(s,pt,topOnly=true){
 const mesh=tessellate(s),N=mesh.topIndexCount;
 let best=Infinity,hit=null;
 for(let i=0;i<(topOnly?N:mesh.indices.length);i+=3){
  const verts=mesh.indices.slice(i,i+3).map(idx=>mesh.positions.slice(idx*3,idx*3+3));
  const q=nearestTri(pt,...verts),dist=d(pt,q);
  if(dist<best){best=dist;hit={point:q,triangle:i/3,sourceSurface:s.id};}
 }
 return {...hit,distanceMeters:best,
  horizontalDistanceMeters:Math.hypot(pt[0]-hit.point[0],pt[2]-hit.point[2]),
  elevationDeltaMeters:pt[1]-hit.point[1],isGameExistingSurface:true};
}
export function buildDvRoadEntrySurvey(road,native=g4e7djNativeStoryboard()){
 assert.ok(['true-pinch','pinch-switch'].includes(road),'DV requires original B48 road');
 const doc=generateG4E7BC(road,'rollDeck'),frozen=JSON.stringify(doc);
 assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
 assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
 const y=DU_CORRIDOR.floorY,x=DU_CORRIDOR.axisX;
 const targets=[
  {id:'FRONT_LEFT',point:[x-6,y,DU_CORRIDOR.nearZ]},
  {id:'FRONT_CENTRE',point:[x,y,DU_CORRIDOR.nearZ]},
  {id:'FRONT_RIGHT',point:[x+6,y,DU_CORRIDOR.nearZ]},
  {id:'ENTRY_MINUS_10M',point:[x,y,DU_CORRIDOR.nearZ+10]},
  {id:'CIVIC_MIDDLE',point:[x,y,(DU_CORRIDOR.nearZ+DU_CORRIDOR.farZ)/2]},
  {id:'FAR_CENTRE',point:[x,y,DU_CORRIDOR.farZ]}
 ];
 const targetsAudit=targets.map(t=>{
  const candidates=doc.surfaces.map((s,i)=>({index:i,...skin(s,t.point)}));
  candidates.sort((a,b)=>a.distanceMeters-b.distanceMeters);
  const best=candidates[0];
  const rise=best.elevationDeltaMeters,run=best.horizontalDistanceMeters;
  return {...t,nearestActualPhysicsTop:best,otherNearSurfaces:candidates.slice(1,4).map(s=>({surface:s.sourceSurface,distanceMeters:s.distanceMeters})),
   candidateStraightBridgeHeightChange:rise,
   candidateStraightBridgeHorizontalRun:run,
   straightBridgeGrade:run>.001?Math.abs(rise)/run:null,
   originalFloorAtTargetExists:best.distanceMeters<.25,
   plannedPublicAccessColliderAdded:false};
 });
 const first=targetsAudit.find(t=>t.id==='FRONT_CENTRE');
 const shots=native.stages[road].frames.filter(f=>['t1550','t1600','t1650'].includes(f.id));
 assert.equal(shots.length,3);
 const movers=shots.map(f=>{
  const nearest=doc.movingObstacles
   .map(o=>movingObstaclePose(o,f.tick/240))
   .map(p=>({id:p.id,type:p.type,metersFromDUEntrance:d(p.center,first.point),halfSize:p.halfSize}))
   .sort((a,b)=>a.metersFromDUEntrance-b.metersFromDUEntrance).slice(0,4);
  return {camera:f.id,simTick:f.tick,nearestMovingCenters:nearest};
 });
 assert.equal(JSON.stringify(doc),frozen,'DV MAY NOT MUTATE B48/B51');
 return {schema:'dopagaki.g4e7dv-road-to-civic-entrance-survey/1',
  road,originalSourceStageId:doc.stageForge.recordStageId,
  realB48Surfaces:7,realB51Movers:28,originalGapCell52:true,
  duCorridor:DU_CORRIDOR,targetAudits:targetsAudit,
  obstacleSnapshotNearby:movers,
  trueOriginalTopSurfaceUsed:true,roadContactFromEntryTest:'EXACT_B48_TRIANGLE_NEAREST_POINT',
  realPlayableConnectionCreated:false,connectionClaim:'NOT_ESTABLISHED',
  roadSampleProximityDoesNotCertifyPedestrianTraversal:true,
  actualGamePhysicsModified:false,additionalGameColliders:0,
  realWebGL:'NOT_RENDERED',art:'HOLD',human:'HOLD',publish:'HOLD',merge:'HOLD',
  officialSlope2Meters:0};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const native=g4e7djNativeStoryboard(),out='test-results/g4e7dv-road-entrance-survey';
 fs.mkdirSync(out,{recursive:true});
 for(const road of ['true-pinch','pinch-switch']){
  const q=buildDvRoadEntrySurvey(road,native);
  fs.writeFileSync(path.join(out,road+'.json'),JSON.stringify(q,null,2)+'\n');
  console.log('DV_EXISTING_ROAD_TO_DU_ENTRANCE_SURVEY',JSON.stringify({
   road,results:q.targetAudits.map(a=>({
    target:a.id,nearestRoad:a.nearestActualPhysicsTop.sourceSurface,
    physicalDistance:a.nearestActualPhysicsTop.distanceMeters,
    elevation:a.nearestActualPhysicsTop.elevationDeltaMeters,
    horizontalRun:a.nearestActualPhysicsTop.horizontalDistanceMeters,
    bridgeGrade:a.straightBridgeGrade
   }))}));
 }
}