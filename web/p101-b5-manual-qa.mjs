/**
 * A11 local, opt-in human-manual evaluation data. Read-only observational
 * samples; NEVER passed into B48 Runner, B51-C obstacle pose, p101Step,
 * camera or survival scoring.
 *
 * No network transmission, no credentials/device identifiers, no recording
 * of keyboard text; JSON is exported only via explicit user interaction.
 */
export const B5_MANUAL_SCHEMA='dopagaki.b5-manual-qa/1';
const number=n=>typeof n==='number'&&Number.isFinite(n);
const rounded=(n,d=2)=>Number(n.toFixed(d));
const quantile=(sorted,q)=>sorted.length?sorted[Math.min(sorted.length-1,Math.floor((sorted.length-1)*q))]:null;
export function createB5ManualAudit({stageId,profile='OVERDRIVE',startSpeed=52}={}){
 if(stageId!=='VB-P101-B5'||!['OVERDRIVE','RAPID','HYPER'].includes(profile)||
    !number(startSpeed)||startSpeed<1||startSpeed>200)throw Error('B5 A11 manual audit is isolated to real B5 input');
 return {
  schema:B5_MANUAL_SCHEMA,stageId,profile,startSpeed,
  source:'ACTUAL_MANUAL_BROWSER_RUN_NOT_SCRIPTED_NOT_HUMAN_FAIRNESS_CERTIFIED',
  samples:[],maxSpeed:startSpeed,inputs:{leftSamples:0,rightSamples:0,neutralSamples:0},
  hazards:{visibleSamples:0,immediateSamples:0,steeringWhileVisibleSamples:0},
  performance:{slowFrames:0,measuredFrames:0},firstContactTime:null,
  final:null,lastSampleAt:-Infinity
 };
}
export function recordB5ManualFrame(a,seconds){
 if(!a||a.schema!==B5_MANUAL_SCHEMA||a.final)return false;
 if(!number(seconds)||seconds<=0||seconds>1)return false;
 a.performance.measuredFrames++;
 if(seconds>1/30)a.performance.slowFrames++;
 return true;
}
export function recordB5ManualSample(a,x){
 if(!a||a.schema!==B5_MANUAL_SCHEMA||a.final)return false;
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
   edge:['safe','caution','danger'].includes(x.edge)?x.edge:'unavailable'};
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
 if(!a||a.schema!==B5_MANUAL_SCHEMA)throw Error('Invalid B5 observation');
 if(a.final)return a.final;
 if(!['failed','finished','interrupted'].includes(status)||!number(time)||time<0||
  !Number.isInteger(contacts)||contacts<0||!Number.isInteger(nearMisses)||nearMisses<0)
  throw Error('B5 audit needs exact native physics outcome');
 const fps=a.samples.map(x=>x.fps).filter(x=>x>0).sort((x,y)=>x-y);
 const inputCount=a.samples.length;
 a.final={
  status,physicsSeconds:rounded(time,3),lastSurface:typeof surface==='string'?surface.slice(0,80):null,
  contacts,nearMisses,failureReason:typeof failure==='string'?failure.slice(0,120):null,
  peakSpeedMps:rounded(a.maxSpeed),framesSampled:inputCount,
  fpsP10:quantile(fps,.1),fpsMedian:quantile(fps,.5),
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
 if(!a||a.schema!==B5_MANUAL_SCHEMA)throw Error('B5 audit not initialized');
 for(const [name,v] of Object.entries({speedFeel,steeringFeel,hazardLegibility}))
  if(v!==null&&(!Number.isInteger(v)||v<1||v>5))throw Error('Invalid voluntary player rating: '+name);
 if(typeof note!=='string')throw Error('Player note must be text');
 // No local storage keys, absolute file paths, user agent or identifying details.
 const result={schema:a.schema,stageId:a.stageId,profile:a.profile,
  startSpeed:a.startSpeed,source:a.source,
  survey:{speedFeel,steeringFeel,hazardLegibility,note:note.slice(0,900)},
  summary:a.final,samples:a.samples.map(x=>({...x}))};
 return JSON.stringify(result,null,2)+'\n';
}
