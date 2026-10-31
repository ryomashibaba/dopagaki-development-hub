/** G4E-7O true B48 narrow-road voluntary human QA. NO driver assist.
 * Runner/document are observed, not modified; no persistence or upload.
 */
import {p101RoadProgress} from './p101-overdrive.mjs';
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const round=(x,n=3)=>finite(x)?Number(x.toFixed(n)):null;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const dot=(a,b)=>a.reduce((sum,x,i)=>sum+x*b[i],0);
const minus=(a,b)=>a.map((x,i)=>x-b[i]);
export const G4E7O_PROTOCOL=Object.freeze(['thread','precipice']);
export function g4e7oReadRoad(doc,runner,sample,radius=.7){
 if(!doc||!runner||typeof sample!=='function'||!finite(radius)||radius<0)throw Error('G4E7O geometry input invalid');
 const surface=runner.surface||runner.lastSurface;
 const road=doc.surfaces.find(x=>x.id===surface);
 if(!road)return null;
 const progress=p101RoadProgress(runner);
 const u=clamp(progress.u,0,1),a=sample(road,u,0),b=sample(road,u,1);
 const edge=minus(b,a),width=Math.hypot(...edge),v=dot(minus(runner.p,a),edge)/(width*width);
 if(!finite(v)||width<1)throw Error('G4E7O cannot measure real B48 width');
 const edgeMargin=Math.min(v,1-v)*width-radius;
 return {surface,u:round(u,5),v:round(v,5),widthMeters:round(width,3),
  ballRadiusMeters:round(radius,3),
  signedEdgeMarginMeters:round(edgeMargin,3),
  lateralDeviationFromCenterMeters:round((v-.5)*width,3),
  withinPhysicalRoad:v>=0&&v<=1,
  airborne:!runner.grounded,
  section:doc.surfaces.findIndex(s=>s.id===road.id)};
}
export function createG4E7OTrial(doc,runner){
 const m=doc?.stageForge?.g4e7mRealRoad;
 if(!m||!G4E7O_PROTOCOL.includes(m.variant)||m.createdVisualSpawns!==2||
  m.certifiedSlopeDnaMeters!==0||doc.stageForge.productionPromoted!==false||
  doc.movingObstacles?.length!==28||doc.surfaces?.length!==7||
  runner.spawnIndex!==0||runner.startSpeed!==52)
  throw Error('G4E7O must record private true-B48 from original start00 at 52m/s');
 return {variant:m.variant,revision:doc.stageForge.revision,startedAtRunnerTime:runner.time,
  steps:0,activeInputSteps:0,lastSampleAt:-Infinity,samples:[],
  minSignedEdgeMarginMeters:null,minPhysicalWidthMeters:null,peakSpeedMps:52,
  offRoadSampleCount:0,nearEdgeSampleCount:0,firstNarrowEntryAt:null,
  firstNarrowSeenU:null,firstFatal:null,
  raf:[],rafFrames:0,physicsOverloadFrames:0,maxCameraHeadingLagDeg:0,
  sampledCues:0,wasEverNarrow:false};
}
export function observeG4E7OStep(t,doc,runner,steer,sample,radius=.7){
 if(!t)return;
 if(!finite(steer)||steer<-1||steer>1)throw Error('G4E7O normalized human input required');
 t.steps++;if(steer)t.activeInputSteps++;
 const speed=Math.hypot(...runner.v);t.peakSpeedMps=Math.max(t.peakSpeedMps,speed);
 const m=g4e7oReadRoad(doc,runner,sample,radius);
 if(m){
  t.minPhysicalWidthMeters=Math.min(t.minPhysicalWidthMeters??Infinity,m.widthMeters);
  t.minSignedEdgeMarginMeters=Math.min(t.minSignedEdgeMarginMeters??Infinity,m.signedEdgeMarginMeters);
  if(m.signedEdgeMarginMeters<0)t.offRoadSampleCount++;
  if(m.signedEdgeMarginMeters<=1.5)t.nearEdgeSampleCount++;
  if((m.section===0||m.section===1)&&m.widthMeters<=18&&!t.wasEverNarrow){
   t.wasEverNarrow=true;t.firstNarrowEntryAt=runner.time;
   t.firstNarrowSeenU=m.u;
  }
 }
 // 10Hz samples with extra last failure snapshot, bounded 1000; no user/device ID.
 if((runner.time-t.lastSampleAt>=.1||runner.status==='failed'||runner.status==='finished')&&t.samples.length<1000){
  t.lastSampleAt=runner.time;
  t.samples.push({t:round(runner.time,4),speedMps:round(speed,2),
   grounded:runner.grounded,steer,physical:m,
   movingContactCount:runner.events.filter(e=>e.type==='moving-contact').length,
   status:runner.status});
 }
 if(runner.status==='failed'&&!t.firstFatal){
  t.firstFatal={...runner.failure,
   events:runner.events.filter(e=>e.type==='static-fatal-contact'||e.type==='moving-contact'||e.type==='failure').slice(-8),
   road:m};
 }
}
export function observeG4E7OFrame(t,elapsed,headingRadians,overloaded=false){
 if(!t||!finite(elapsed)||elapsed<=0||elapsed>1)return;
 t.rafFrames++;if(overloaded)t.physicsOverloadFrames++;
 if(t.raf.length<25000)t.raf.push(elapsed);
 if(finite(headingRadians))t.maxCameraHeadingLagDeg=Math.max(t.maxCameraHeadingLagDeg,
  Math.abs(headingRadians)*180/Math.PI);
}
const quantile=(sorted,p)=>sorted.length?sorted[Math.floor((sorted.length-1)*p)]:null;
export function exportG4E7OTrial(t,runner,{visibility='unsure',enjoyment=null,note=''}={}){
 if(!t||!runner||!['yes','no','unsure'].includes(visibility)||
  (enjoyment!==null&&(!Number.isInteger(enjoyment)||enjoyment<1||enjoyment>5))||
  typeof note!=='string')throw Error('G4E7O voluntary report invalid');
 const ordered=t.raf.slice().sort((a,b)=>a-b),med=quantile(ordered,.5),p90=quantile(ordered,.9);
 return {schema:'dopagaki.w9c2.g4e7o-manual/1',variant:t.variant,
  realOriginalB48Collision:true,gameSteeringAssistsAdded:false,source:'LOCAL_VOLUNTARY_KEYBOARD_OR_TOUCH',
  wasOriginalStart00:runner.spawnIndex===0,originalStartSpeedMps:runner.startSpeed,
  humanInputNotProvenByAutomation:true,elapsedSeconds:round(runner.time),
  status:['failed','finished'].includes(runner.status)?runner.status:'INTERRUPTED_NOT_A_CLEAR',
  metrics:{physicalSteps:t.steps,activeInputSteps:t.activeInputSteps,
   peakSpeedMps:round(t.peakSpeedMps,2),
   lowestPhysicalWidthMeters:round(t.minPhysicalWidthMeters),
   leastSignedEdgeMarginMeters:round(t.minSignedEdgeMarginMeters),
   nearEdgeStepCount:t.nearEdgeSampleCount,offRoadStepCount:t.offRoadSampleCount,
   firstNarrowEntrySeconds:round(t.firstNarrowEntryAt),
   firstNarrowU:t.firstNarrowSeenU,
   movingContactCount:runner.events.filter(e=>e.type==='moving-contact').length,
   failure:t.firstFatal||(runner.failure?{...runner.failure}:null)},
  render:{rafFrames:t.rafFrames,medianRafFps:med?round(1/med,1):null,
   p10RafFps:p90?round(1/p90,1):null,
   physicsOverloadedFrames:t.physicsOverloadFrames,
   maximumHeadingLagDeg:round(t.maxCameraHeadingLagDeg,2),
   actualHardwareFpsNotNative240Hz:true},
  voluntaryHumanReport:{curveVisibleAtLeastTwoSecondsBeforeArrival:visibility,
   enjoymentOneToFive:enjoyment,note:note.slice(0,450),
   notEyeTracking:true},
  sampledPhysicalRoad:t.samples.slice(),approvedSlopeDnaMeters:0,
  automaticallySubmitted:false,fairnessCertified:false,release:'HOLD'};
}
export function newG4E7OSession(){return {schema:'dopagaki.w9c2.g4e7o-paired-manual/1',index:0,runs:[]};}
export function appendG4E7OTrial(session,report){
 if(!session||session.index>=2||!report||report.variant!==G4E7O_PROTOCOL[session.index]||
  report.approvedSlopeDnaMeters!==0||report.fairnessCertified!==false)
  throw Error('G4E7O paired session incorrect ordering or approval');
 session.runs.push(report);session.index++;return session.index;
}
export function exportG4E7OSession(session){
 if(!session||!Array.isArray(session.runs))throw Error('G4E7O session missing');
 return JSON.stringify({...session,completedBoth:session.index===2,
  normalGameLeaderboardWrites:false,automatedUpload:false,
  feedbackIsSelfReported:true,realWindowsHumanTrial:'UNVERIFIED_UNTIL_USER_RUN',
  review:'HOLD',certifiedSlope2Meters:0},null,2)+'\n';
}
