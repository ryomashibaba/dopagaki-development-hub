/**
 * G4E-7V true full 240Hz start00 P96 research route, fixed CCD angle and
 * shock diagnostic. Finished 7/7 IS NOT human fair/playable approval.
 */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7VExit,G4E7V_PROFILES} from './p101-w9c2-g4e7v-exit-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {sample} from '../private/reference_only/director/surface.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const fmt=(n,p=4)=>Number(n.toFixed(p)),dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
function project(line,p){
 let u=0,distance=Infinity;
 for(let i=0;i<line.length-1;i++){
  const a=line[i],v=a.map((x,k)=>line[i+1][k]-x),
   dx=p.map((x,k)=>x-a[k]),fraction=Math.max(0,Math.min(1,dot(dx,v)/(dot(v,v)||1))),
   dist=Math.hypot(...dx.map((x,k)=>x-fraction*v[k]));
  if(dist<distance){distance=dist;u=(i+fraction)/(line.length-1);}
 }
 return {u,distance};
}
function setup(id){
 const doc=generateG4E7VExit(id),r=new Runner(doc,compile(doc),0,52);
 return {id,doc,r,plan:makeP96RoutePlan(doc,r),surge:createA13SurgeState(),
  line:Array.from({length:129},(_,i)=>sample(doc.surfaces[0],i/128,.5)),
  seen:new Set(),ordered:[],peak:52,largestShock:null,
  firstGapAir:null,firstRoadRejoin:null,exitMinSpeed:Infinity,
  postGapPos:null,eventsNearExit:0};
}
export function g4e7vExitNativeMatrix(){
 const states=G4E7V_PROFILES.map(p=>setup(p.id));
 for(let tick=1;tick<=70/DT;tick++){
  for(const s of states){
   const r=s.r;if(!['ready','running'].includes(r.status))continue;
   const beforeSpeed=Math.hypot(...r.v),oldCollisions=r.collisions,
    input=p96DodgeSteer(r,s.plan,'early-soft',movingObstaclePose).input/4.8,
    cursor=r.events.length;
   p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,s.surge),collisionRecovery:false});
   const speed=Math.hypot(...r.v),pos=project(s.line,r.p),
    gap=s.doc.stageForge.g4e7uStudy.gap;
   s.peak=Math.max(s.peak,speed);
   if(r.surface&&!s.seen.has(r.surface)){s.seen.add(r.surface);s.ordered.push(r.surface);}
   if(pos.distance<25&&pos.u>.55&&pos.u<.68){
    const drop=beforeSpeed-speed,collisionAdded=r.collisions-oldCollisions;
    if(!s.largestShock||drop>s.largestShock.speedLossMps)
     s.largestShock={time:fmt(r.time,5),u:fmt(pos.u,5),
      speedLossMps:fmt(drop,4),speedBefore:fmt(beforeSpeed,3),speedAfter:fmt(speed,3),
      collisionAdded,
      events:r.events.slice(cursor).map(x=>x.type)};
    s.eventsNearExit+=collisionAdded;
   }
   if(pos.distance<30){
    if(!r.grounded&&pos.u>=gap.uTakeoff-.005&&pos.u<=gap.uLanding+.025&&!s.firstGapAir)
     s.firstGapAir={time:fmt(r.time,5),u:fmt(pos.u,6),speedMps:fmt(speed,2)};
    if(s.firstGapAir&&r.grounded&&r.surface===s.doc.surfaces[0].id&&
       pos.u>gap.uLanding&&!s.firstRoadRejoin)
     s.firstRoadRejoin={time:fmt(r.time,5),u:fmt(pos.u,6),speedMps:fmt(speed,2)};
    if(pos.u>=gap.uLanding&&pos.u<.8)
     s.exitMinSpeed=Math.min(s.exitMinSpeed,speed);
   }
  }
  if(states.every(x=>['failed','finished'].includes(x.r.status)))break;
 }
 return {schema:'dopagaki.g4e7v-real-B48-exit-native/1',hz:1/DT,start00:true,startSpeed:52,
  originalMoveCount:28,originalRoadCount:7,
  steering:'P96_EARLYSOFT_DIV4_8_NONHUMAN',
  candidates:states.map(s=>{
   const r=s.r,roads=s.doc.surfaces.map(x=>x.id);
   return {id:s.id,profile:s.doc.stageForge.g4e7vStudy,
    status:r.status,finished:r.status==='finished'&&!r.failure,
    roadsInOrder:roads.every((x,i)=>s.seen.has(x)&&(i===0||s.ordered.indexOf(roads[i-1])<s.ordered.indexOf(x))),
    observedRoads:s.ordered.length,timeSeconds:fmt(r.time),
    peakMps:fmt(s.peak,2),firstGapAir:s.firstGapAir,firstRoadRejoin:s.firstRoadRejoin,
    minimumExitSpeedMps:Number.isFinite(s.exitMinSpeed)?fmt(s.exitMinSpeed,2):null,
    worstContactNearExit:s.largestShock,collisionCountNearExit:s.eventsNearExit,
    failure:r.failure??null,humanFairness:'HOLD',certifiedSlope2Meters:0};
  }),approved:false,certifiedSlope2Meters:0,release:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const a=g4e7vExitNativeMatrix();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(a,null,2)+'\n');
 console.log('G4E7V_EXIT '+JSON.stringify(a.candidates.map(({profile,firstGapAir,failure,...v})=>({...v,
  width:profile.realNarrowWidthMeters,change:profile.maxControlHeightChangeMeters,
  fatal:failure?.reason??null}))));
}
