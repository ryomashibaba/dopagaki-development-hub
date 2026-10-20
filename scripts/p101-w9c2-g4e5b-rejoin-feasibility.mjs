/** G4E-5B real geometry survey. Does NOT mutate or stage any road. */
import {generateG4E5Continuation,G4E5_POLICY} from './p101-w9c2-g4e5-physical-continuation.mjs';
import {sample} from '../private/reference_only/director/surface.js';
const fmt=(x,n=2)=>Number(x.toFixed(n));
const flat=(a,b)=>Math.hypot(a[0]-b[0],a[2]-b[2]);
const unit=(a,b)=>{const x=b[0]-a[0],z=b[2]-a[2],d=Math.hypot(x,z)||1;return [x/d,z/d];};
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1];
const cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
const normAngle=(a,b)=>Math.atan2(cross(a,b),dot(a,b));
const yaw=(a,b)=>fmt(normAngle(a,b)*180/Math.PI,1);
const xyz=p=>p.map(v=>fmt(v,2));
const nearest=(target,road)=>Array.from({length:501},(_,i)=>{
 const u=i/500,p=sample(road,u,.5),t=unit(sample(road,Math.max(0,u-.002),.5),sample(road,Math.min(1,u+.002),.5));
 return {u:fmt(u,3),point:xyz(p),distanceXZ:fmt(flat(target,p)),
  verticalMeters:fmt(p[1]-target[1]),tangentXZ:t.map(v=>fmt(v,4))};
}).sort((a,b)=>a.distanceXZ-b.distanceXZ);
export function g4e5bFeasibility(){
 const speed=170,limits=[8,12,18,25].map(a=>({maxLateralAcceleration:a,
  minimumTurnRadiusMeters:fmt(speed*speed/a,1)}));
 const rows=G4E5_POLICY.runwayLengths.map(lengthMeters=>{
  const doc=generateG4E5Continuation({lengthMeters}),V=doc.surfaces[4],
   bridge=doc.surfaces[7],runway=doc.surfaces[8];
  const end=sample(runway,1,.5),start=sample(runway,0,.5),
   forward=unit(sample(runway,.99,.5),end),
   Vstart=sample(V,0,.5),Vend=sample(V,1,.5);
  const vStartDir=unit(sample(V,0,.5),sample(V,.01,.5)),
   vEndDir=unit(sample(V,.99,.5),Vend);
  const candidates=nearest(end,V).slice(0,6).map(x=>({
   ...x,turnDegrees:yaw(forward,x.tangentXZ),
   signedBearingToTargetDegrees:yaw(forward,unit(end,x.point)),
   straightLineSlope:fmt((x.point[1]-end[1])/Math.max(1,x.distanceXZ),3)
  }));
  const scan=nearest(end,V);
  const reachableForward=scan.filter(x=>dot(forward,unit(end,x.point))>.25);
  const aligned=scan.filter(x=>dot(forward,x.tangentXZ)>.4);
  const plausible=scan.filter(x=>dot(forward,unit(end,x.point))>.0&&dot(forward,x.tangentXZ)>.25);
  return {lengthMeters,roadV:V.id,runwayEnd:xyz(end),runwayStart:xyz(start),
   bridgeEnd:xyz(sample(bridge,1,.5)),
   runwayHeadingXZ:forward.map(v=>fmt(v,4)),
   roadVStart:xyz(Vstart),roadVEnd:xyz(Vend),
   roadVStartHeadingXZ:vStartDir.map(v=>fmt(v,4)),
   roadVEndHeadingXZ:vEndDir.map(v=>fmt(v,4)),
   roadVStartDistanceXZ:fmt(flat(end,Vstart)),
   roadVEndDistanceXZ:fmt(flat(end,Vend)),
   roadVStartTurnDegrees:yaw(forward,vStartDir),
   closest:candidates,forwardCandidates:reachableForward.slice(0,3),
   alignedCandidates:aligned.slice(0,3),plausibleCandidates:plausible.slice(0,3),
   roadVCenterlineXZBounds:{
    x:[fmt(Math.min(...scan.map(x=>x.point[0]))),fmt(Math.max(...scan.map(x=>x.point[0])))],
    z:[fmt(Math.min(...scan.map(x=>x.point[2]))),fmt(Math.max(...scan.map(x=>x.point[2])))]
   }};
 });
 return {schema:'dopagaki.w9c2.g4e5b-feasibility/1',
  maxWorldCoordinateAbs:2000,originalRoads:7,realMachines:28,
  noPhysicalEdits:true,turnSpeedMps:speed,turnRadiusReference:limits,
  candidates:rows,release:'HOLD',human:'NOT_TESTED'};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href)
 console.log('G4E5B_GEOMETRY '+JSON.stringify(g4e5bFeasibility()));
