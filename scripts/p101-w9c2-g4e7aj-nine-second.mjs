/** G4E-7AJ real 9-second 240Hz start00, unchanged P96 input for each
 * genuine 11m B48 / 28 B51-C arrangement; failure is first-class evidence.
 * No steering to rescue new hazards, no ghost floor, no collision disable.
 */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7AJ,AJ_LAYOUTS,AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT,RADIUS} from '../private/reference_only/director/physics.js';
import {movingObstaclePose,sphereBoxSeparation} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const round=(x,n=4)=>Number(x.toFixed(n));
export function g4e7ajRealNineSecondMatrix(){
 const results=[];
 for(const road of AJ_ROADS)for(const layout of AJ_LAYOUTS){
  const doc=generateG4E7AJ(road,layout),runner=new Runner(doc,compile(doc),0,52),
   plan=makeP96RoutePlan(doc,runner),surge=createA13SurgeState(),
   focus=doc.movingObstacles.filter(o=>['a13-machine-01','a13-machine-02'].includes(o.id)),
   clearances=focus.map(o=>({id:o.id,minBallBoxSeparationM:Infinity,nearTimeSeconds:null})),
   events={moving:0,contactIds:[],staticFatal:0},snapshots=[];
  for(let tick=1;tick<=9/DT&&['ready','running'].includes(runner.status);tick++){
   const start=runner.events.length,
    input=p96DodgeSteer(runner,plan,'early-soft',movingObstaclePose).input/4.8;
   p101Step(runner,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(runner,surge),collisionRecovery:false});
   for(const e of runner.events.slice(start)){
    if(e.type==='moving-contact'){events.moving++;events.contactIds.push(e.id);}
    if(e.type==='static-fatal-contact')events.staticFatal++;
   }
   for(let k=0;k<focus.length;k++){
    const box=movingObstaclePose(focus[k],runner.time),
     sep=sphereBoxSeparation(runner.p,RADIUS,box).separation;
    if(sep<clearances[k].minBallBoxSeparationM){
     clearances[k].minBallBoxSeparationM=sep;clearances[k].nearTimeSeconds=round(runner.time,3);
    }
   }
   if(tick%48===0)snapshots.push({time:round(runner.time,2),
    speedMps:round(Math.hypot(...runner.v),2),surface:runner.surface||runner.lastSurface,
    grounded:runner.grounded,status:runner.status});
  }
  results.push({road,layout,realRoads:7,realMovingObjects:28,
   twoNativeMovingObjectsReanchored:layout!=='original',
   allPhysicsUnassisted:true,timeSeconds:round(runner.time,4),
   status:runner.status,failure:runner.failure??null,movingContactEvents:events,
   trueB48NarrowWidthM:doc.stageForge.g4e7ahStudy.widthMinMeters,
   firstRoadGap:doc.surfaces[0].voidLongitudinalCells,
   minSeparations:clearances.map(x=>({...x,minBallBoxSeparationM:round(x.minBallBoxSeparationM,3)})),
   samples:snapshots,publication:'HOLD',manualFairness:'HOLD'});
 }
 return {schema:'dopagaki.g4e7aj-true-240Hz-original-vs-reanchored-B51-9s/1',
  realPhysicsHz:240,initialSpeedMps:52,originalRoads:7,originalMovingObjects:28,
  canonicalSteering:'P96_EARLY_SOFT_DIV4_8_NONHUMAN_NO_RESCALE_FOR_HAZARDS',
  results,fullSevenRoadsProvenForNewLayouts:false,officialSlope2Meters:0,
  humanFairness:'HOLD',artQuality:'HOLD',publication:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const r=g4e7ajRealNineSecondMatrix();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(r,null,2)+'\n');
 console.log('G4E7AJ_REAL_B51_9S '+JSON.stringify(r.results.map(x=>({
  road:x.road,layout:x.layout,status:x.status,sec:x.timeSeconds,
  moving:x.movingContactEvents.moving,contactIds:x.movingContactEvents.contactIds,
  failure:x.failure?.reason??null,minSeparations:x.minSeparations.map(z=>({
   id:z.id,meters:z.minBallBoxSeparationM,time:z.nearTimeSeconds}))
 }))));
}
