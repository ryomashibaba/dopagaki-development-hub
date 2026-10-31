/** G4E-7AJ: genuine 240Hz B48/A13 B51 lane threat, baseline READ-ONLY. */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7AH} from './p101-w9c2-g4e7ah-narrow-real-b48.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT,RADIUS} from '../private/reference_only/director/physics.js';
import {movingObstaclePose,sphereBoxSeparation} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const minus=(a,b)=>a.map((v,i)=>v-b[i]);
const len=v=>Math.hypot(...v),dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);
const round=(x,n=3)=>Number(x.toFixed(n));
function basis(road,u){
 const a=sample(road,Math.max(0,u-.002),.5),b=sample(road,Math.min(1,u+.002),.5),
 t=minus(b,a),right=[-t[2],0,t[0]],l=len(right);
 return right.map(x=>x/(l||1));
}
function crossSection(road,u,p){
 const middle=sample(road,u,.5),left=sample(road,u,0),right=sample(road,u,1),
 width=len(minus(left,right)),axis=basis(road,u),a=p.yawRadians,
 axisX=[Math.cos(a),0,-Math.sin(a)],axisZ=[Math.sin(a),0,Math.cos(a)],
 half= Math.abs(dot(axis,axisX))*p.halfSize[0]+Math.abs(dot(axis,axisZ))*p.halfSize[2]+RADIUS,
 offset=dot(minus(p.center,middle),axis),
 avail=width/2-RADIUS,
 freeLeft=Math.max(0,Math.min(avail,offset-half+avail)),
 freeRight=Math.max(0,Math.min(avail,avail-offset-half));
 return {width:round(width),lateral:round(offset),halfExtent:round(half),
   leftFree:round(freeLeft),rightFree:round(freeRight),
   blocksBoth:freeLeft<1.3&&freeRight<1.3};
}
function closestRoad(road,p){
 let best={u:0,meters:Infinity};
 for(let k=0;k<=120;k++){const u=k/120,d=len(minus(sample(road,u,.5),p));
  if(d<best.meters)best={u,meters:d};}
 return best;
}
export function g4e7ajBaselineThreat(){
 const variants=[];
 for(const id of ['true-pinch','pinch-switch']){
  const doc=generateG4E7AH(id),road=doc.surfaces[0],base=JSON.stringify(doc),
   obs=doc.movingObstacles.filter(o=>['a13-machine-01','a13-machine-02'].includes(o.id));
  if(obs.length!==2||doc.movingObstacles.length!==28||doc.surfaces.length!==7)
   throw Error('AJ original 28 B51-C and real first road required');
  const runner=new Runner(doc,compile(doc),0,52),plan=makeP96RoutePlan(doc,runner),
   surge=createA13SurgeState(),stations=obs.map((o,i)=>({id:o.id,type:o.type,
    nominalU:i===0?.28:.73,originalPosition:o.position,staticRoadOffsetM:round(
     len(minus(o.position,sample(road,i===0?.28:.73,.5)))),
    minimumRunnerOBBSeparationM:Infinity,nearTime:null,blockTimeSamples:0,trace:[]})),
   ball=[];
  let originalMachineContacts=0;
  for(let tick=1;tick<=9/DT&&['ready','running'].includes(runner.status);tick++){
   const prior=runner.events.length,
    steer=p96DodgeSteer(runner,plan,'early-soft',movingObstaclePose).input/4.8;
   p101Step(runner,steer,'OVERDRIVE',{forwardScale:p101A13ForwardScale(runner,surge),collisionRecovery:false});
   originalMachineContacts+=runner.events.slice(prior).filter(e=>e.type==='moving-contact').length;
   for(let j=0;j<obs.length;j++){
    const pose=movingObstaclePose(obs[j],runner.time),
     sep=sphereBoxSeparation(runner.p,RADIUS,pose).separation,s=stations[j];
    if(sep<s.minimumRunnerOBBSeparationM){s.minimumRunnerOBBSeparationM=sep;s.nearTime=round(runner.time,3);}
    if(tick%48===0){
     const lane=crossSection(road,s.nominalU,pose);
     if(lane.blocksBoth)s.blockTimeSamples++;
     s.trace.push({time:round(runner.time,2),separationM:round(sep),...lane});
    }
   }
   if(tick%48===0){
    const loc=closestRoad(road,runner.p);
    ball.push({time:round(runner.time,2),u:round(loc.u,4),
     speed:round(len(runner.v)),offRoadCenter:round(loc.meters),status:runner.status});
   }
  }
  for(const s of stations)s.minimumRunnerOBBSeparationM=round(s.minimumRunnerOBBSeparationM);
  if(JSON.stringify(doc)!==base)throw Error('AJ observation mutated original B48/B51');
  variants.push({id,realFirstRoad:road.id,realOriginalMachines:28,original2Preserved:true,
   status:runner.status,totalEvents:originalMachineContacts,
   stations,ball,humanQA:'HOLD'});
 }
 return {schema:'dopagaki.g4e7aj-native-240Hz-original-b51-threat/1',
  original7Roads:true,original28Machines:true,physicsHz:240,variants,
  sourceModification:false,formalSlope2Meters:0,publication:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const r=g4e7ajBaselineThreat();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(r,null,2)+'\n');
 console.log('G4E7AJ_ORIGINAL_THREAT '+JSON.stringify(r.variants.map(v=>({id:v.id,
   contacts:v.totalEvents,stations:v.stations.map(s=>({id:s.id,
    centerOffset:s.staticRoadOffsetM,nearest:s.minimumRunnerOBBSeparationM,
    at:s.nearTime,blockSamples:s.blockTimeSamples,totalSamples:s.trace.length}))}))));
}
