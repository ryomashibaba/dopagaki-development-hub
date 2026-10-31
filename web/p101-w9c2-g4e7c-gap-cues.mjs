/**
 * W9-C2 G4E-7C / candidate visual language for REAL B48 void.
 * GPU triangles only, located on original rideable skins UPSTREAM and
 * DOWNSTREAM of the true removed collider. No mesh may span the open gap.
 * No physics, surface, route, collision, camera, steering, score or HUD edits.
 */
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const length=(a,b)=>Math.hypot(...a.map((n,i)=>n-b[i]));
const ids=new Set(['C0-55-1','B0-65-1']);
function profile(road,sample){
 const positions=Array.from({length:257},(_,i)=>sample(road,i/256,.5));
 const distances=[0];
 for(let i=1;i<positions.length;i++)
  distances.push(distances.at(-1)+length(positions[i],positions[i-1]));
 return {
  uAt(meters){
   const x=clamp(meters,0,distances.at(-1));
   let lo=0,hi=256;
   while(hi-lo>1){const mid=(lo+hi)>>1;if(distances[mid]<x)lo=mid;else hi=mid;}
   return (lo+clamp((x-distances[lo])/(distances[hi]-distances[lo]||1),0,1))/256;
  },
  metersAt(u){
   const f=clamp(u,0,1)*256,i=Math.floor(f),k=Math.min(255,i);
   return distances[k]+(distances[k+1]-distances[k])*(i>=256?1:f-k);
  }
 };
}
function point(road,u,v,sample,frame){
 const xyz=sample(road,u,v),normal=frame(road,u,v).normal;
 const direction=normal[1]<0?-.24:.24;
 return xyz.map((x,i)=>x+normal[i]*direction);
}
function quad(out,road,u0,u1,v0,v1,color,sample,frame){
 const a=point(road,u0,v0,sample,frame),b=point(road,u1,v0,sample,frame),
       c=point(road,u1,v1,sample,frame),d=point(road,u0,v1,sample,frame);
 for(const p of [a,b,c,a,c,d])out.push(...p,...color);
}
export function g4e7cGapRoadCues(doc,sample,frame,{enabled=false}={}){
 const empty={active:false,vertices:[],marks:[],triangles:0,nonCollision:true,
  originalGeometryUnmodified:true,avoidsMissingRoad:true,certifiedSlopeMeters:0};
 if(!enabled)return empty;
 const gap=doc?.stageForge?.g4e6EarlyGap;
 if(!gap||!ids.has(gap.id)||
  doc.stageForge.recordStageId!=='VB-P101-A13-W9C2-G4E6-'+gap.id)
  return empty;
 if(doc.stageForge.productionPromoted!==false||doc.surfaces?.length!==7||
 doc.movingObstacles?.length!==28||!gap.actualOpenB48Collision||
 !gap.noMidpointRideableSupport||typeof sample!=='function'||typeof frame!=='function')
  throw Error('G4E7C requires exact private B48 gap on original 7 roads / 28 machines');
 const road=doc.surfaces[gap.section];
 if(road.id!==gap.surfaceId||!road.collidable||!road.rideable||
  road.voidLongitudinalCells?.length!==1)throw Error('G4E7C physical surface mismatch');
 const arc=profile(road,sample),begin=arc.metersAt(gap.uTakeoff),end=arc.metersAt(gap.uLanding);
 if(!(end-begin>3&&end-begin<10))throw Error('G4E7C must not visually cover a fake or missing physical gap');
 const vertices=[],marks=[],yellow=[1,.74,.17],white=[.88,.98,1],teal=[.17,.92,.98];
 function stripe(kind,d0,d1,color,segments){
  const lo=arc.uAt(d0),hi=arc.uAt(d1);
  if(!(d1>d0+0.1&&lo<hi))return;
  const upstream=hi<=gap.uTakeoff-1e-5;
  const downstream=lo>=gap.uLanding+1e-5;
  if(!upstream&&!downstream)throw Error('G4E7C cue attempts to bridge REAL missing road');
  for(const [v0,v1] of segments)quad(vertices,road,lo,hi,v0,v1,color,sample,frame);
  marks.push({kind,u0:lo,u1:hi,metersBeforeTakeoff:begin-d1,segments:segments.length});
 }
 // At >100m/s these first markings are visible well before the last 1s,
 // but no claim is made that human eyes ACTUALLY detect them at that distance.
 // Avoid wide opaque neon slabs that obscure the driver's view at 80-100m/s.
 // Four narrow staggered pieces preserve the road texture and open-space gap.
 const lanes=[[.035,.19],[.235,.42],[.58,.765],[.81,.965]];
 for(const [distance,width] of [[245,1.5],[165,1.5],[90,1.2],[35,.9],[12,.65]]){
  if(begin-distance-width<3)continue;
  stripe('approach-'+distance,begin-distance-width,begin-distance,
   distance>90?teal:yellow,lanes);
 }
 // Genuine raised-edge perspective guides: entirely on the ORIGINAL real
 // road, longitudinal, with no upper deck, barriers or safety intervention.
 stripe('side-left',begin-26,begin-.8,teal,[[.015,.06]]);
 stripe('side-right',begin-26,begin-.8,teal,[[.94,.985]]);
 stripe('takeoff-lip',begin-.85,begin-.25,yellow,
  [[.035,.19],[.235,.42],[.58,.765],[.81,.965]]);
 stripe('landing-lip',end+.35,end+1.15,white,lanes);
 // The 6-7m void itself contains exactly ZERO paint, hologram or fake floor.
 if(!marks.some(x=>x.kind==='takeoff-lip')||!marks.some(x=>x.kind==='landing-lip')||
  vertices.length===0||vertices.length%18!==0||vertices.length>3600||
  !vertices.every(Number.isFinite))throw Error('G4E7C cue is incomplete or exceeds GPU budget');
 return {active:true,vertices,marks,triangles:vertices.length/18,
  nonCollision:true,originalGeometryUnmodified:true,
  avoidsMissingRoad:true,certifiedSlopeMeters:0,physicalGapMeters:gap.gapMeters,
  id:gap.id,roadSection:gap.section};
}
