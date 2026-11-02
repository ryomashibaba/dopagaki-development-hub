/**
 * G4E-7V forensic observer: temporary instrumented COPY of frozen native
 * Runner, recording the CCD triangle that WAS SELECTED, not nearby triangles.
 * Copy is generated and removed in this process. The committed native physics
 * source is never edited, nor are its forces, CCD resolution or B48 stage.
 */
import fs from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
import crypto from 'node:crypto';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {generateG4E7UPhysical} from './p101-w9c2-g4e7u-single-cell-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const physicsUrl=new URL('../private/reference_only/director/physics.js',import.meta.url);
const digest=s=>crypto.createHash('sha256').update(s).digest('hex');
const rounded=(n,p=5)=>Number(n.toFixed(p));
const equalVec=(a,b)=>a.length===b.length&&a.every((v,i)=>Math.abs(v-b[i])<1e-10);
async function study(id,DebugRunner){
 const doc=generateG4E7UPhysical(id);
 const physical=new Runner(doc,compile(doc),0,52);
 const shadow=new DebugRunner(doc,compile(doc),0,52);
 const controlPlan=makeP96RoutePlan(doc,physical),surges=[createA13SurgeState(),createA13SurgeState()];
 shadow.__g4e7vHits=[];
 let startTime=0,largestSpeedLoss=null,checkedTicks=0;
 for(let tick=1;tick<=5.6/DT&&physical.status!=='failed'&&physical.status!=='finished';tick++){
  const input=p96DodgeSteer(physical,controlPlan,'early-soft',movingObstaclePose).input/4.8,
   beforeSpeed=Math.hypot(...physical.v);
  p101Step(physical,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(physical,surges[0]),collisionRecovery:false});
  p101Step(shadow,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(shadow,surges[1]),collisionRecovery:false});
  if(!equalVec(physical.p,shadow.p)||!equalVec(physical.v,shadow.v)||
     physical.collisions!==shadow.collisions||physical.status!==shadow.status||
     physical.grounded!==shadow.grounded||physical.surface!==shadow.surface)
   throw Error('Shadow observer diverged from actual native Runner at tick '+tick);
  checkedTicks++;
  if(physical.time>=4.68&&physical.time<=5.45){
   const afterSpeed=Math.hypot(...physical.v),drop=beforeSpeed-afterSpeed;
   if(!largestSpeedLoss||drop>largestSpeedLoss.speedDropMps)
    largestSpeedLoss={time:rounded(physical.time),speedDropMps:rounded(drop),
     previousSpeed:rounded(beforeSpeed),afterSpeed:rounded(afterSpeed),
     previousTick:tick-1,tick,
     position:physical.p.map(x=>rounded(x)),velocity:physical.v.map(x=>rounded(x))};
  }
 }
 const hits=shadow.__g4e7vHits
  .filter(x=>x.time>=4.68&&x.time<=5.45)
  .map(x=>({...x,normal:x.normal.map(v=>rounded(v,7)),
   entryVelocity:x.entryVelocity.map(v=>rounded(v)),
   impulseRemovedMps:rounded(x.impulseRemovedMps),time:rounded(x.time)}));
 return {id,identicalNativeStateAllSteps:true,checkedTicks,
  largestSpeedLoss,selectedCCDContacts:hits,
  nativeRunTimeSeconds:rounded(physical.time),
  realRoads:doc.surfaces.length,movingMachines:doc.movingObstacles.length,
  humanFairness:'HOLD'};
}
export async function g4e7vExactContactAudit(){
 const original=fs.readFileSync(physicsUrl,'utf8'),hashBefore=digest(original),
  targetPath=fileURLToPath(new URL('../private/reference_only/director/physics.g4e7v-untracked-shadow.mjs',import.meta.url)),
  anchor=' const fixedVelocityBefore=[...this.v];',
  insert=` if(this.__g4e7vHits&&this.time>=4.68&&this.time<=5.45){
    const inward=dot(this.v,hit.normal);
    this.__g4e7vHits.push({time:this.time,part:hit.triangle.part,
     surface:hit.triangle.surface,rideable:hit.triangle.rideable,
     impactPosition:[...this.p],hitFraction:hit.time,hitPoint:[...hit.point],
     normal:[...hit.normal],entryVelocity:[...this.v],
     impulseRemovedMps:Math.max(0,-inward),
     triangleVertices:[hit.triangle.a,hit.triangle.b,hit.triangle.c]});
   }`;
 if(original.split(anchor).length!==2)
  throw Error('Native physics signature changed. Aborting observer rather than guessing.');
 if(fs.existsSync(targetPath))throw Error('Previous temporary shadow file exists; no overwrite allowed');
 let data;
 try{
  fs.writeFileSync(targetPath,original.replace(anchor,insert+anchor),{flag:'wx'});
  const imported=await import(pathToFileURL(targetPath).href);
  data={schema:'dopagaki.g4e7v-exact-selected-CCD/1',
   originalPhysicsSHA256:hashBefore,
   originalPhysicsIntact:fs.readFileSync(physicsUrl,'utf8')===original,
   shadowAddedOnlyObservationalHitRecording:true,
   hz:1/DT,source:'NATIVE_START00_P96_SCRIPTED_NOT_HUMAN',
   control:await study('control',imported.Runner),
   one53:await study('one53',imported.Runner),
   stageUnmodified:true,publicRelease:'HOLD',certifiedSlope2Meters:0};
 }finally{
  if(fs.existsSync(targetPath))fs.unlinkSync(targetPath);
 }
 if(fs.existsSync(targetPath)||digest(fs.readFileSync(physicsUrl,'utf8'))!==hashBefore)
  throw Error('Shadow source cleanup or native immutability failed');
 return data;
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const a=await g4e7vExactContactAudit();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(a,null,2)+'\n');
 const compress=s=>({id:s.id,ticks:s.checkedTicks,max:s.largestSpeedLoss,
  chosenHits:s.selectedCCDContacts.map(x=>({t:x.time,part:x.part,rideable:x.rideable,
   surface:x.surface,normal:x.normal,impulseRemovedMps:x.impulseRemovedMps,
   hitPoint:x.hitPoint}))});
 console.log('G4E7V_EXACT '+JSON.stringify({control:compress(a.control),
  one53:compress(a.one53),clean:a.originalPhysicsIntact}));
}
