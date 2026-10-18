/**
 * P101 A13 W7D – assess ACTUAL B51-C collision reachability across rideable
 * real B48 road patches for 16 added large machines in 7/7 W7C candidate.
 * An OBB ground-ball overlap at a sampled lateral lane and phase is NOT a
 * reachable human driving trajectory or a gameplay fairness certificate.
 */
import {W7_TRIALS,makeW7TrialDoc} from './p101-a13-w7-candidate-matrix.mjs';
import {A13_HAZARD_SPECS} from '../web/p101-a13-hazard-layout.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
import {movingObstaclePose,sphereBoxSeparation} from '../private/reference_only/director/moving/moving-obstacles.mjs';
export const W7_PASSING_TRIAL_ID='w7c-edges-120-middle';
const round=(x,n=2)=>Number(x.toFixed(n));
const docForPassedTrial=()=>{
 const choice=W7_TRIALS.find(x=>x.id===W7_PASSING_TRIAL_ID);
 if(!choice)throw Error('Frozen 7/7 52.046s W7 candidate missing');
 return makeW7TrialDoc(choice);
};
export function runW7PhysicalExposure(){
 const doc=docForPassedTrial();
 const bodyStatuses=[];
 for(let i=0;i<16;i++){
  const [s,u,type]=A13_HAZARD_SPECS[i];
  const road=doc.surfaces[s],ob=doc.movingObstacles[12+i];
  const lanes=new Set(),phases=new Set();
  let closest=Infinity,centerlineHits=0;
  // Sample exact B51-C OBB at equally spaced true animation phases; road
  // ball positions are B48 sampled road + 0.65m along real surface normal.
  for(let ti=0;ti<17;ti++){
   const t=ob.period*ti/16,pose=movingObstaclePose(ob,t);
   for(let v=0;v<=20;v++){
    const lane=v/20,surf=sample(road,u,lane),normal=frame(road,u,lane).normal;
    const ball=surf.map((x,j)=>x+.65*normal[j]);
    const sep=sphereBoxSeparation(ball,.65,pose).separation;
    if(sep<closest)closest=sep;
    if(sep<=0){
     lanes.add(v);phases.add(ti);
     if(v>=8&&v<=12)centerlineHits++;
    }
   }
  }
  bodyStatuses.push({id:ob.id,section:s+1,type:ob.type,mode:ob.collision.mode,
   phasesTouchingRoad:phases.size,ofPhases:17,
   uniqueLanesTouchingRoad:lanes.size,ofLanes:21,
   centerlineCollisionSamples:centerlineHits,
   closestGroundBallSeparationMeters:round(closest)});
 }
 return {schema:'dopagaki.a13-w7d-native-ground-occupancy/1',
  physics:'TRUE_B51C_MOVING_POSE_AND_SPHERE_OBB_ON_TRUE_B48_ROAD',humanFeasibility:'NOT_TESTED',
  candidate:W7_PASSING_TRIAL_ID,roadCount:7,nativeMachines:doc.movingObstacles.length,
  addedMachines:16,physicalFootprintCount:bodyStatuses.filter(x=>x.phasesTouchingRoad>0).length,
  centerlineThreatCount:bodyStatuses.filter(x=>x.centerlineCollisionSamples>0).length,
  hazards:bodyStatuses};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const data=runW7PhysicalExposure();
 console.log('A13_W7D_EXPOSURE '+JSON.stringify(data));
 if(data.roadCount!==7||data.nativeMachines!==28||data.addedMachines!==16)
  throw Error('W7 physical exposure underlying native integrity mismatch');
}
