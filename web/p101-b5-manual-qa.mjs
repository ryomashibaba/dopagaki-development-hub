/**
 * A11 local, opt-in human-manual evaluation data. Read-only observational
 * samples; NEVER passed into B48 Runner, B51-C obstacle pose, p101Step,
 * camera or survival scoring.
 *
 * No network transmission, no credentials/device identifiers, no recording
 * of keyboard text; JSON is exported only via explicit user interaction.
 */
export const B5_MANUAL_SCHEMA='dopagaki.b5-manual-qa/1';
export const A13_MANUAL_SCHEMA='dopagaki.a13-manual-qa/1';
const validAudit=a=>Boolean(a&&(a.schema===B5_MANUAL_SCHEMA||a.schema===A13_MANUAL_SCHEMA));
const number=n=>typeof n==='number'&&Number.isFinite(n);
const rounded=(n,d=2)=>Number(n.toFixed(d));
const quantile=(sorted,q)=>sorted.length?sorted[Math.min(sorted.length-1,Math.floor((sorted.length-1)*q))]:null;
// A12: 0.25ms animation-frame duration histogram, bounded memory, no game physics coupling.
// The 90th percentile frame duration corresponds to the ~10th percentile frame FPS.
const frameDurationBin=(bins,count,q)=>{
 if(!count)return null;
 const rank=Math.floor((count-1)*q);
 let cumulative=0;
 for(let i=1;i<bins.length;i++){cumulative+=bins[i];if(cumulative>rank)return i;}
 return null;
};
export function createB5ManualAudit({stageId,profile='OVERDRIVE',startSpeed=52,spawnIndex=0}={}){
 if(!['VB-P101-B5','VB-P101-A13','VB-P101-A13-W7F','VB-P101-A13-W9X-B1'].includes(stageId)||!['OVERDRIVE','RAPID','HYPER'].includes(profile)||
    !number(startSpeed)||startSpeed<1||startSpeed>200||
    !Number.isInteger(spawnIndex)||spawnIndex<0)throw Error('Manual audit must use allowlisted actual A13/B5 stage and valid controls');
 return {
  schema:stageId.startsWith('VB-P101-A13')?A13_MANUAL_SCHEMA:B5_MANUAL_SCHEMA,stageId,profile,startSpeed,spawnIndex,
  source:'ACTUAL_MANUAL_BROWSER_RUN_NOT_SCRIPTED_NOT_HUMAN_FAIRNESS_CERTIFIED',
  samples:[],maxSpeed:startSpeed,inputs:{leftSamples:0,rightSamples:0,neutralSamples:0},
  hazards:{visibleSamples:0,immediateSamples:0,steeringWhileVisibleSamples:0},
  performance:{slowFrames:0,measuredFrames:0,physicsOverloadedFrames:0,frameMsBins:new Uint32Array(4001)},firstContactTime:null,
  final:null,lastSampleAt:-Infinity
 };
}
export function recordB5ManualFrame(a,seconds,{physicsOverloaded=false}={}){
 if(!a||!validAudit(a)||a.final)return false;
 if(!number(seconds)||seconds<=0||seconds>1)return false;
 a.performance.measuredFrames++;
 if(seconds>1/30)a.performance.slowFrames++;
 if(physicsOverloaded)a.performance.physicsOverloadedFrames++;
 // Real animation-frame spacing (wall time), never simulated 240Hz time.
 const bin=Math.max(1,Math.min(4000,Math.round(seconds*4000)));
 a.performance.frameMsBins[bin]++;
 return true;
}
export function recordB5ManualSample(a,x){
 if(!a||!validAudit(a)||a.final)return false;
 if(!x||![x.time,x.speed,x.fps,x.frameDelta].every(number)||
    x.time<0||x.speed<0||x.fps<0||x.frameDelta<0||x.frameDelta>2||
    ![-1,0,1].includes(x.input))throw Error('A11 requires finite legitimate browser sample');
 if(x.time<a.lastSampleAt)return false;
 if(x.time-a.lastSampleAt<.48)return false; // cap data volume, ~2Hz
 if(a.samples.length>=300)return false;
 a.lastSampleAt=x.time;
 const sample={time:rounded(x.time),speed:rounded(x.speed),fps:rounded(x.fps),
   frameDeltaMs:rounded(x.frameDelta*1000),input:x.input,
   surface:typeof x.surface==='string'?x.surface.slice(0,80):null,
   grounded:Boolean(x.grounded),hazard:typeof x.hazard==='string'?x.hazard.slice(0,32):'none',
   urgency:['none','advance','approaching','immediate'].includes(x.urgency)?x.urgency:'none',
   edge:x.edge==='clear'||x.edge==='safe'?'safe':['caution','danger'].includes(x.edge)?x.edge:'unavailable'};
 a.samples.push(sample);
 a.maxSpeed=Math.max(a.maxSpeed,x.speed);
 if(x.input<0)a.inputs.leftSamples++;
 else if(x.input>0)a.inputs.rightSamples++;
 else a.inputs.neutralSamples++;
 if(sample.hazard!=='none'){
  a.hazards.visibleSamples++;
  if(sample.urgency==='immediate')a.hazards.immediateSamples++;
  if(sample.input!==0)a.hazards.steeringWhileVisibleSamples++;
 }
 return true;
}
export function finalizeB5ManualAudit(a,{status,time,surface=null,contacts=0,nearMisses=0,failure=null}={}){
 if(!a||!validAudit(a))throw Error('Invalid B5 observation');
 if(a.final)return a.final;
 if(!['failed','finished','interrupted'].includes(status)||!number(time)||time<0||
  !Number.isInteger(contacts)||contacts<0||!Number.isInteger(nearMisses)||nearMisses<0)
  throw Error('B5 audit needs exact native physics outcome');
 const fps=a.samples.map(x=>x.fps).filter(x=>x>0).sort((x,y)=>x-y);
 const inputCount=a.samples.length;
 const frameCount=a.performance.measuredFrames;
 const p90FrameBin=frameDurationBin(a.performance.frameMsBins,frameCount,.9);
 const medianFrameBin=frameDurationBin(a.performance.frameMsBins,frameCount,.5);
 a.final={
  status,physicsSeconds:rounded(time,3),
  fullCourseCompletionFromStart00:status==='finished'&&a.spawnIndex===0,
  lastSurface:typeof surface==='string'?surface.slice(0,80):null,
  contacts,nearMisses,failureReason:typeof failure==='string'?failure.slice(0,120):null,
  peakSpeedMps:rounded(a.maxSpeed),framesSampled:inputCount,
  fpsP10:quantile(fps,.1),fpsMedian:quantile(fps,.5),
  // A11 snapshot FPS (above) is ~2Hz; below values use every visible running animation frame.
  renderFrameFpsP10:p90FrameBin?rounded(4000/p90FrameBin):null,
  renderFrameFpsMedian:medianFrameBin?rounded(4000/medianFrameBin):null,
  renderFrameTiming:'REAL_RAF_INTERVAL_0_25MS_BINS_NOT_240HZ_PHYSICS_PROOF',
  physicsOverloadedAnimationFrames:a.performance.physicsOverloadedFrames,
  physicsOverloadedFrameShare:frameCount?
   rounded(a.performance.physicsOverloadedFrames/frameCount,3):null,
  fpsSlowFrameSampleShare:a.performance.measuredFrames?
   rounded(a.performance.slowFrames/a.performance.measuredFrames,3):null,
  observedSteeringFraction:inputCount?rounded((a.inputs.leftSamples+a.inputs.rightSamples)/inputCount,3):null,
  hazardVisibleSamples:a.hazards.visibleSamples,
  steeringWhileHazardVisibleSamples:a.hazards.steeringWhileVisibleSamples,
  warningAssessment:'VISIBILITY_SAMPLES_ONLY_NOT_REACTION_TIME_OR_FAIRNESS_PROOF',
  renderFpsIsNotPhysicsHz:true,physicsHz:240
 };
 return a.final;
}
export function exportB5ManualAudit(a,{speedFeel=null,steeringFeel=null,hazardLegibility=null,note=''}={}){
 if(!a||!validAudit(a))throw Error('B5 audit not initialized');
 for(const [name,v] of Object.entries({speedFeel,steeringFeel,hazardLegibility}))
  if(v!==null&&(!Number.isInteger(v)||v<1||v>5))throw Error('Invalid voluntary player rating: '+name);
 if(typeof note!=='string')throw Error('Player note must be text');
 // No local storage keys, absolute file paths, user agent or identifying details.
 const result={schema:a.schema,stageId:a.stageId,profile:a.profile,
  startSpeed:a.startSpeed,spawnIndex:a.spawnIndex,source:a.source,
  survey:{speedFeel,steeringFeel,hazardLegibility,note:note.slice(0,900)},
  summary:a.final,samples:a.samples.map(x=>({...x}))};
 return JSON.stringify(result,null,2)+'\n';
}
