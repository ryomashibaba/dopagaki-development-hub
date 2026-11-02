/**
 * G4E-7U static contact diagnostic at ONE53:
 * record, but NEVER modify, original 240Hz CCD collision response.
 */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7UPhysical} from './p101-w9c2-g4e7u-single-cell-build.mjs';
import {compile,contacts} from '../private/reference_only/director/collision.js';
import {Runner,DT,RADIUS} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const fmt=(x,n=4)=>Number(x.toFixed(n));
function run(id){
 const doc=generateG4E7UPhysical(id),world=compile(doc),
  r=new Runner(doc,world,0,52),plan=makeP96RoutePlan(doc,r),
  surge=createA13SurgeState();
 let worstDrop=null;
 const important=[];
 for(let tick=1;tick<=5.5/DT&&['ready','running'].includes(r.status);tick++){
  const before=[...r.v],oldSpeed=Math.hypot(...before),oldContacts=r.collisions,evStart=r.events.length;
  const steer=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
  p101Step(r,steer,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),
   collisionRecovery:false});
  const after=[...r.v],speed=Math.hypot(...after),
   collisionAdded=r.collisions-oldContacts,
   recent=r.events.slice(evStart);
  if(r.time>=4.72&&r.time<=5.4){
   const decrease=oldSpeed-speed;
   const collisionType=collisionAdded>0?
    (recent.some(e=>e.type==='moving-contact')?'MOVING_CONTACT':
     'FIXED_CCD_OR_OTHER_CONTACT'):'NO_COLLISION';
   if(!worstDrop||decrease>worstDrop.speedDropMps)
    worstDrop={time:fmt(r.time,5),tick,
     speedDropMps:fmt(decrease,5),priorSpeedMps:fmt(oldSpeed,4),
     afterSpeedMps:fmt(speed,4),priorVelocity:before.map(x=>fmt(x,3)),
     afterVelocity:after.map(x=>fmt(x,3)),
     collisionAdded,collisionType,events:recent};
   if(collisionAdded>0&&decrease>3||recent.some(e=>e.type==='moving-contact')){
    const closest=contacts(world,r.p,RADIUS+.15).slice(0,6);
    important.push({time:fmt(r.time,5),tick,
     contactCountIncrease:collisionAdded,collisionType,
     speedBefore:fmt(oldSpeed,3),speedAfter:fmt(speed,3),
     vyBefore:fmt(before[1],3),vyAfter:fmt(after[1],3),
     xyz:r.p.map(x=>fmt(x,3)),recentEvents:recent,
     closestPhysicalTriangles:closest.map(c=>({
      part:c.triangle.part,surface:c.triangle.surface,
      rideable:c.triangle.rideable,
      distanceMeters:fmt(c.distance,4),normal:c.normal.map(x=>fmt(x,4))}))});
   }
  }
 }
 return {variant:id,source:'REAL_START00_NATIVE_240HZ',
  timeSeconds:fmt(r.time,5),state:r.status,collisions:r.collisions,
  worstSpeedDrop:worstDrop,largeContactRecords:important,
  officialSlope2Meters:0};
}
export function g4e7uPhysicalContactAudit(){
 const control=run('control'),one53=run('one53');
 return {schema:'dopagaki.g4e7u-physical-impulse-audit/1',hz:1/DT,
  control,one53,collisionObservationOnly:true,
  exactCCDPartNotGuaranteedByClosestAfterContact:true,
  noPhysicalChanges:true,certifiedSlope2Meters:0,
  gameplayAcceptance:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const d=g4e7uPhysicalContactAudit();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(d,null,2)+'\n');
 console.log('G4E7U_IMPULSE '+JSON.stringify({
  control:d.control.worstSpeedDrop,
  one53:d.one53.worstSpeedDrop,
  damagingContacts:d.one53.largeContactRecords,
  approval:d.gameplayAcceptance}));
}
