/**
 * G4E-7DY PRIVATE R0: native physical road-centred vertical-slice world guide.
 * Source B48/B51, camera and game unmodified; no human/art/collision approval.
 * OBJ contains lines only, not building meshes or an imported game level.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {generateG4E7BC} from './p101-w9c2-g4e7bc-bank-contour.mjs';
import {g4e7djNativeStoryboard} from './p101-w9c2-g4e7dj-native-storyboard.mjs';
import {buildDoReference} from './p101-w9c2-g4e7do-master-export.mjs';
import {sample} from '../private/reference_only/director/surface.js';

export const DY_ROADS=Object.freeze(['true-pinch','pinch-switch']);
export const DY_METRES=360;
export const DY_OUTBOARD_METRES=18;
export const DY_GATES=Object.freeze([
 '01_DISCOVER_TRANSIT','02_APPROACH_CIVIC_COURT',
 '03_THROUGH_OPEN_PUBLIC_VOID','04_PASS_INHABITED_TRANSIT_EDGE',
 '05_EXIT_TO_NEXT_CITY'
]);
const dist=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
const delta=(a,b)=>a.map((x,i)=>x-b[i]);
const scale=(a,k)=>a.map(x=>x*k);
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const round=(x,n=3)=>Number(x.toFixed(n));
const clamp=(x,a,b)=>Math.max(a,Math.min(x,b));
function polyline(s){
 const arr=[];
 for(let i=0;i<=180;i++){
  const u=i/180,p=sample(s,u,.5);
  arr.push({u,p,arc:i?arr[i-1].arc+dist(arr[i-1].p,p):0});
 }
 return arr;
}
function bestSurface(stage,player){
 let best=null;
 for(const [section,s] of stage.surfaces.entries()){
  if(!s.collidable||!s.rideable)continue;
  const line=polyline(s);
  for(const k of line){
   const d=dist(k.p,player);
   if(!best||d<best.distance)best={section,u:k.u,arc:k.arc,line,distance:d};
  }
 }
 assert.ok(best,'DY actual native position has no B48 road');
 return best;
}
function roadStation(s,line,meters){
 let a=0,b=line.length-1;
 const wanted=clamp(meters,0,line.at(-1).arc);
 while(a+1<b){
  const m=(a+b)>>1;
  if(line[m].arc<wanted)a=m;else b=m;
 }
 const q=line[a],r=line[b],t=clamp((wanted-q.arc)/(r.arc-q.arc||1),0,1);
 const u=q.u+(r.u-q.u)*t,center=sample(s,u,.5);
 const left=sample(s,u,0),right=sample(s,u,1);
 const outward=edge=>{
  const d=delta(edge,center),h=Math.hypot(d[0],d[2]);
  assert.ok(h>.001,'Invalid physical B48 road edge');
  return [d[0]/h,0,d[2]/h];
 };
 return {u,center,left,right,outerLeft:add(left,scale(outward(left),DY_OUTBOARD_METRES)),
  outerRight:add(right,scale(outward(right),DY_OUTBOARD_METRES)),
  roadWidth:dist(left,right)};
}
function projectNative(point,camera){
 const v=delta(point,camera.eye);
 const dot=(a,b)=>a.reduce((sum,x,i)=>sum+x*b[i],0);
 const depth=dot(v,camera.front);
 if(!(depth>1))return {depthMeters:round(depth),pixel:null,onScreen:false};
 const x=.5+.5*1.35*dot(v,camera.right)/(depth*(1008/645));
 const y=.5-.5*1.35*dot(v,camera.up)/depth;
 return {depthMeters:round(depth),pixel:[round(x*1008),round(y*645)],
  onScreen:x>.12&&x<.88&&y>.14&&y<.79,
  occlusionChecked:false,artOrHumanProof:false};
}
function wireObj(stations,road){
 const keys=['center','left','right','outerLeft','outerRight'];
 const rows=[
  '# G4E-7DY '+road+' WIRE ONLY, no triangles, no collision, no approved buildings'
 ];
 for(const s of stations)for(const k of keys)
  rows.push('v '+s[k].map(n=>n.toFixed(6)).join(' '));
 for(const [j,k] of keys.entries()){
  rows.push('g '+k.toUpperCase()+'_SOURCE_GUIDE');
  rows.push('l '+stations.map((_,i)=>i*5+j+1).join(' '));
 }
 return rows.join('\n')+'\n';
}
export function buildDyIntegratedSlice(native=g4e7djNativeStoryboard()){
 assert.equal(native.physicsHz,240);
 const report={
  schema:'dopagaki.g4e7dy-private-native-road-integrated-spatial-preflight/1',
  reference:'G4E7BC_RollDeck_AND_G4E7DJ_REAL_240HZ_SCRIPTED_NOT_HUMAN',
  originalCXSourceBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
  approach:'REAL_B48_ROUTE_THROUGH_FUTURE_CITY_VOID_NOT_DX_OFFBOARD_42M',
  requestedPhysicalArcMeters:DY_METRES,outboardVisualStudyOffsetMeters:DY_OUTBOARD_METRES,
  roads:{},sourceRoadModified:false,sourceCameraModified:false,
  originalPhysicalRoadCount:7,originalB51MovingCount:28,originalGap52:true,
  newGameColliders:0,newGameRoads:0,actualWebGL:'NOT_RENDERED',
  architecture:'NOT_MODELLED_WIREFRAME_ONLY',fullOcclusion:'NOT_TESTED',
  clearance:'NOT_CERTIFIED',manualHumanTest:'NOT_RUN',art:'HOLD',
  gameplay:'HOLD',ready:'HOLD',publish:'HOLD',merge:'HOLD',
  formalSlope2Meters:0,formalArtAdoptionCount:0
 };
 const objs={};
 for(const road of DY_ROADS){
  const stage=generateG4E7BC(road,'rollDeck'),frozen=JSON.stringify(stage);
  assert.equal(stage.surfaces.length,7);
  assert.equal(stage.movingObstacles.length,28);
  assert.deepEqual(stage.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(stage.stageForge.productionPromoted,false);
  const shot=native.stages[road].frames.find(f=>f.id==='t1600');
  assert.ok(shot?.pose?.position,'DY requires actual 16s pose');
  const best=bestSurface(stage,shot.pose.position),total=best.line.at(-1).arc;
  if(!(total>=DY_METRES))throw Error('Native 16s nearest B48 source section shorter than 360m');
  const start=clamp(best.arc-DY_METRES/2,0,total-DY_METRES);
  const s=stage.surfaces[best.section];
  const stations=Array.from({length:21},(_,i)=>
   roadStation(s,best.line,start+i*DY_METRES/20));
  const cameras=buildDoReference(road,native).cameras;
  const gates=DY_GATES.map((name,i)=>{
   const station=stations[5*i];
   return {name,physicalArcRelativeMeters:i*90,
    u:round(station.u,6),worldB48Center:station.center.map(n=>round(n,6)),
    realB48WidthMeters:round(station.roadWidth),
    civicInteriorOnlyConcept:true,
    futureCivicRoof:'SKY_OPEN',futureCivicDecks:'NOT_BUILT',
    physicalFloor:'EXISTING_SOURCE_B48_ONLY',
    nativeFrames:['t1550','t1600','t1650'].map(id=>{
     const camera=cameras.find(c=>c.id===id);
     assert.ok(camera?.eye&&camera?.front&&camera?.right&&camera?.up);
     return {id,...projectNative(station.center,camera)};
    })};
  });
  assert.equal(JSON.stringify(stage),frozen,'DY must never mutate original stage');
  report.roads[road]={sourceRoadId:s.id,sourceSection:best.section,
   distance16sPlayerToB48CenterMeters:round(best.distance),
   physicalSourceSectionArcMeters:round(total),
   sampledPhysicalWindowMeters:DY_METRES,stationCount:stations.length,
   minRealRoadWidthMeters:round(Math.min(...stations.map(x=>x.roadWidth))),
   maxRealRoadWidthMeters:round(Math.max(...stations.map(x=>x.roadWidth))),
   originalMovingHazards:stage.movingObstacles.length,
   gates,roadExistsButHumanFairnessUnverified:true};
  objs[road]=wireObj(stations,road);
 }
 return {report,objs};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const {report,objs}=buildDyIntegratedSlice(),dir='test-results/g4e7dy-integrated-slice';
 fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,'G4E7DY_REAL_SOURCE_ROAD_ART_HOLD.json'),
  JSON.stringify(report,null,2)+'\n');
 for(const [road,obj] of Object.entries(objs))
  fs.writeFileSync(path.join(dir,'G4E7DY_'+road+'_UNBUILT_WIRE.obj'),obj);
 console.log('G4E7DY_SOURCE_B48_SPATIAL_PREFLIGHT_ONLY',
  JSON.stringify(Object.fromEntries(Object.entries(report.roads).map(([k,v])=>
   [k,{source:v.sourceRoadId,window:v.sampledPhysicalWindowMeters,
    widthMin:v.minRealRoadWidthMeters,widthMax:v.maxRealRoadWidthMeters}]))));
}
