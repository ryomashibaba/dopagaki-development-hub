import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7UMicroLanding,G4E7U_GRADES} from './p101-w9c2-g4e7u-micro-landing-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {sample} from '../private/reference_only/director/surface.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const round=(x,n=4)=>Number(x.toFixed(n));
const dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);
function near(line,p){
 let best=Infinity,u=0;
 for(let i=0;i<line.length-1;i++){
  const a=line[i],v=a.map((x,k)=>line[i+1][k]-x),
   d=p.map((x,k)=>x-a[k]),f=Math.max(0,Math.min(1,dot(d,v)/(dot(v,v)||1))),
   e=Math.hypot(...d.map((x,k)=>x-f*v[k]));
  if(e<best){best=e;u=(i+f)/(line.length-1);}
 }
 return {u,d:best};
}
function setup(id){
 const doc=generateG4E7UMicroLanding(id),r=new Runner(doc,compile(doc),0,52);
 return {id,doc,r,plan:makeP96RoutePlan(doc,r),surge:createA13SurgeState(),
  line:Array.from({length:129},(_,i)=>sample(doc.surfaces[0],i/128,.5)),
  seen:new Set(),ordered:[],peak:52,
  firstAir:null,firstLanding:null,dropSpeed:0,minimumPostSpeed:Infinity,
  collisions:[],lastCollisions:0};
}
export function g4e7uMicroLandingNative(){
 const states=G4E7U_GRADES.map(({id})=>setup(id));
 for(let tick=1;tick<=70/DT;tick++){
  for(const s of states){
   const r=s.r;if(!['ready','running'].includes(r.status))continue;
   const input=p96DodgeSteer(r,s.plan,'early-soft',movingObstaclePose).input/4.8;
   p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,s.surge),collisionRecovery:false});
   const q=near(s.line,r.p),speed=Math.hypot(...r.v),
    g=s.doc.stageForge.g4e7uLanding.realGap;
   s.peak=Math.max(speed,s.peak);
   if(r.surface&&!s.seen.has(r.surface)){s.seen.add(r.surface);s.ordered.push(r.surface);}
   if(q.d<25){
    if(!r.grounded&&q.u>=g.uTakeoff-.005&&q.u<=g.uLanding+.03&&!s.firstAir)
     s.firstAir={t:round(r.time,5),u:round(q.u,5),speedMps:round(speed,2)};
    if(s.firstAir&&r.grounded&&q.u>g.uLanding&&r.surface===s.doc.surfaces[0].id&&!s.firstLanding)
     s.firstLanding={t:round(r.time,5),u:round(q.u,5),speedMps:round(speed,2)};
    if(q.u>=g.uLanding&&q.u<.80)s.minimumPostSpeed=Math.min(s.minimumPostSpeed,speed);
   }
   if(r.collisions>s.lastCollisions&&q.d<27&&q.u>.57&&q.u<.69)
    s.collisions.push({time:round(r.time,5),u:round(q.u,6),speed:round(speed,2),
      deltaCollision:r.collisions-s.lastCollisions,velocity:[...r.v].map(v=>round(v,3)),
      position:[...r.p].map(v=>round(v,2)),grounded:r.grounded});
   s.lastCollisions=r.collisions;
  }
  if(states.every(s=>['failed','finished'].includes(s.r.status)))break;
 }
 return {schema:'dopagaki.g4e7u-B48-micro-landing-native/1',
  hz:1/DT,start00:true,initialSpeed:52,source:'ONE53_TRUE_NARROW_14M',
  results:states.map(s=>{
   const r=s.r,ids=s.doc.surfaces.map(x=>x.id);
   return {variant:s.id,gradeTarget:s.doc.stageForge.g4e7uLanding.peakShiftTargetMeters,
    actualGrade:s.doc.stageForge.g4e7uLanding.actualShiftMeters,
    trueNarrowWidth:s.doc.stageForge.g4e7uLanding.minTrueRoadWidthMeters,
    realGap:s.doc.stageForge.g4e7uLanding.realGap,
    status:r.status,finished:r.status==='finished'&&!r.failure,
    allSevenInOrder:ids.every((id,i)=>s.seen.has(id)&&(i===0||s.ordered.indexOf(ids[i-1])<s.ordered.indexOf(id))),
    timeSeconds:round(r.time),peakSpeedMps:round(s.peak,2),
    visited:s.ordered.length,firstAir:s.firstAir,firstLanding:s.firstLanding,
    minimumPostGapSpeedMps:Number.isFinite(s.minimumPostSpeed)?round(s.minimumPostSpeed,2):null,
    collisionEventsNearGap:s.collisions,failure:r.failure??null,
    humanQuality:'HOLD',officialSlope2Meters:0};
  }),
  userApproved:false,officialSlope2Meters:0,
  humanFairness:'HOLD',publication:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const d=g4e7uMicroLandingNative();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(d,null,2)+'\n');
 console.log('G4E7U_MICRO '+JSON.stringify(d.results.map(({collisionEventsNearGap,realGap,...x})=>({...x,
  gapMeters:realGap.gapMeters,contactsNearGap:collisionEventsNearGap.length}))));
}
