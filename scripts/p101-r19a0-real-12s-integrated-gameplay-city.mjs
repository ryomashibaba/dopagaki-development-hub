/** R19 A0: FIRST genuine 12s gameplay+existing skyline study, not a fake completion. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {generateP101W9C1AbyssCandidate} from './p101-w9c1-abyss-narrow.mjs';
import {generateP101A13W7Candidate} from './p101-a13-w7-gameplay-build.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
import {locateRoadLateral} from '../web/p81-edge-radar.mjs';
import {makeW9C1CueProfile,readW9C1Cue,w9c1ArcAt} from '../web/p101-w9c1-approach-cue.mjs';
import {w9c1G5BSkyline} from '../web/p101-w9c1-g5b-skyline.mjs';
export const POLICY=Object.freeze({schema:'dopagaki.r19a0-real-12second-integrated-slice/1',
 physicalHz:240,seconds:12,realB48:7,realB51:28,
 goalSlopeMeters:2912,approvedSlopeMeters:0,
 ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',RELEASE:'HOLD'});
const json=JSON.stringify;
const r3=x=>Number(x.toFixed(3));
const distance=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
function originalSourceSHA(){
 const p=new URL('../web/p101-w9c2-g4e7ci-integrated-streetscape.mjs',import.meta.url);
 const b=fs.readFileSync(p);
 return crypto.createHash('sha1').update(Buffer.concat([
  Buffer.from('blob '+b.length+'\0'),b])).digest('hex');
}
function nativeTwelve(doc){
 const source=json(doc),r=new Runner(doc,compile(doc),0,52);
 const steering=makeP96RoutePlan(doc,r),forward=createA13SurgeState();
 const profile=makeW9C1CueProfile(doc,sample);
 const visited=new Set(),samples=[];
 let notices=null,core=null,maxSpeed=52,contacts=0,idx=0,air=0,maxAir=0;
 for(let t=0;t<12/DT&&!['failed','finished'].includes(r.status);t++){
  const steer=p96DodgeSteer(r,steering,'early-soft',movingObstaclePose);
  p101Step(r,steer.input/4.8,'OVERDRIVE',
   {forwardScale:p101A13ForwardScale(r,forward)});
  if(r.surface)visited.add(r.surface);
  air=r.grounded?0:air+DT;maxAir=Math.max(maxAir,air);
  const v=Math.hypot(...r.v);maxSpeed=Math.max(maxSpeed,v);
  for(;idx<r.events.length;idx++)
   if(r.events[idx].type==='moving-contact')contacts++;
  if(t%12)continue;
  const edge=r.surface?locateRoadLateral(doc,r.surface,r.p,sample,frame,
   {grounded:r.grounded}):null;
  const onFirst=edge?.surface===doc.surfaces[0].id;
  const cue=edge?readW9C1Cue(profile,{surfaceId:r.surface,u:edge.u,
   grounded:r.grounded,speedMps:v}):null;
  const m=onFirst?edge.u*600:null;
  if(cue?.phase==='approach'&&notices===null)notices=r.time;
  if(m!==null&&m>=310&&m<=360&&core===null)core=r.time;
  samples.push({nativeTick:Math.round(r.time/DT),t:r3(r.time),
   speedMps:r3(v),xyz:r.p.map(r3),road:r.surface,grounded:r.grounded,
   road0NominalM:m===null?null:r3(m),
   road0PhysicalArcM:onFirst?r3(w9c1ArcAt(profile,edge.u)):null,
   actualRoadWidthM:onFirst?r3(edge.width):null,
   approximateRoadEdgeMarginM:edge?r3(edge.margin):null,
   cuePhase:cue?.phase??null});
 }
 assert.equal(json(doc),source,'real native run cannot mutate stage description');
 const lead=notices===null||core===null?null:r3(core-notices);
 return {status:r.status,seconds:r3(r.time),ticks:Math.round(r.time/DT),
  maxSpeedMps:r3(maxSpeed),roads:[...visited],
  originalMovingContactEvents:contacts,longestAirSeconds:r3(maxAir),
  firstNoticeS:notices===null?null:r3(notices),
  firstCoreS:core===null?null:r3(core),
  actualNoticeToCoreSeconds:lead,
  firstNoticeAtLeast2S:lead===null?false:lead>=2,
  failure:r.failure??null,
  samples,source240Hz:true,scriptedP96NotHuman:true,
  safety:lead===null?'HOLD_CORE_OR_CUE_UNOBSERVED':lead<2?'HOLD_WARNING_UNDER_2S':'HOLD_HUMAN_VISIBILITY',
  ART:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD'};
}
export function runR19A0(){
 assert.equal(1/DT,240);
 assert.equal(originalSourceSHA(),'af076d67492a677d2235e4730aef8cdf4808e106');
 const gold=generateP101A13W7Candidate(),frozen=json(gold),studies=[];
 for(const [mode,widthTarget] of [['control',28],['ultra',14]]){
  const stage=generateP101W9C1AbyssCandidate(mode),src=json(stage);
  assert.equal(stage.surfaces.length,7);assert.equal(stage.movingObstacles.length,28);
  assert.equal(json(stage.movingObstacles),json(gold.movingObstacles));
  assert.equal(json(stage.surfaces.slice(1)),json(gold.surfaces.slice(1)));
  const road=stage.surfaces[0];
  const physicalWidth=distance(sample(road,330/600,0),sample(road,330/600,1));
  assert.ok(Math.abs(physicalWidth-widthTarget)<3,'actual narrow width missing');
  const noCity=w9c1G5BSkyline(stage,sample,{enabled:false});
  const city=w9c1G5BSkyline(stage,sample,{enabled:true});
  assert.equal(noCity.vertices.length,0);
  assert.equal(city.nonCollision,true);
  assert.ok(city.vertices.length>1000&&city.vertices.length%18===0);
  assert.ok(city.vertices.every(Number.isFinite));
  assert.equal(json(stage),src,'candidate skyline must not change physical stage');
  const physical=nativeTwelve(stage);
  studies.push({mode,recordStageId:stage.stageForge.recordStageId,
   trueB48WidthAt330M:r3(physicalWidth),
   unchangedB48Roads:7,unchangedNativeB51:28,
   existingNoncollidingCity:{asset:'EXISTING_W9C1_G5B_NOT_NEW_R18_CITY',
    defaultOff:true,triangles:city.vertices.length/18,
    realRoadEdgeClearanceM:city.minimumEdgeClearanceMeters,
    ART:'HOLD_NOT_ORIGINAL_CAMERA_VERIFIED'},
   physical});
 }
 assert.equal(json(gold),frozen,'original Gold source changed');
 return {schema:POLICY.schema,policy:POLICY,
  sourceBlob:originalSourceSHA(),studies,
  decision:{actualFirst12SecondsMeasured:true,officialSlope2Meters:0,
   ART:'HOLD',HUMAN:'HOLD',GAMEPLAY:'HOLD',PERFORMANCE:'HOLD',RELEASE:'HOLD',
   caution:'Scripted original 240Hz native input is NOT human or actual camera visual evidence'}};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const out=process.argv[2]??'test-results/r19a0/R19A0_FIRST_12S_W9C1.json';
 const data=runR19A0();
 fs.mkdirSync(path.dirname(out),{recursive:true});
 fs.writeFileSync(out,JSON.stringify(data,null,2)+'\n');
 for(const x of data.studies)console.log('R19A0_REAL_12S',JSON.stringify({
  mode:x.mode,width:x.trueB48WidthAt330M,status:x.physical.status,
  simulated:x.physical.seconds,peak:x.physical.maxSpeedMps,
  coreAt:x.physical.firstCoreS,lead:x.physical.actualNoticeToCoreSeconds,
  cityTriangles:x.existingNoncollidingCity.triangles,ART:'HOLD',human:'HOLD'}));
 console.log('R19A0_EVIDENCE',out);
}
