/** G4E-7BB: diagnostic math only. NO Runner, controls, or collider mutation. */
import {sample,frame} from '../private/reference_only/director/surface.js';
const dot=(a,b)=>a.reduce((sum,x,i)=>sum+x*b[i],0);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const magnitude=v=>Math.hypot(...v);
const norm=v=>{const n=magnitude(v);return n>1e-9?v.map(x=>x/n):[0,0,0];};
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const degrees=x=>x*180/Math.PI;
const round=(x,n=4)=>Number(x.toFixed(n));
const horizontal=v=>norm([v[0],0,v[2]]);
export function projectCenterline(points,p){
 if(!Array.isArray(points)||points.length<2||p.length!==3)throw Error('BB valid 3D polyline needed');
 let best=null;
 for(let i=0;i<points.length-1;i++){
  const a=points[i],delta=sub(points[i+1],a),q=sub(p,a),length2=dot(delta,delta);
  if(length2<1e-9)continue;
  const t=clamp(dot(q,delta)/length2,0,1),foot=a.map((v,k)=>v+t*delta[k]);
  const dist=magnitude(sub(p,foot));
  if(!best||dist<best.distance3D)best={u:(i+t)/(points.length-1),distance3D:dist,segment:i};
 }
 if(!best)throw Error('BB no nondegenerate path segments');
 return best;
}
export function analyzeRoadFrame(surface,u,p,velocity,ballRadius=.65){
 const z=clamp(u,0,1),ahead=sample(surface,Math.min(1,z+.005),.5),
  behind=sample(surface,Math.max(0,z-.005),.5),
  center=sample(surface,z,.5),left=sample(surface,z,0),right=sample(surface,z,1),
  span=sub(right,left),width=magnitude(span),lane=dot(sub(p,left),span)/(width*width),
  v=clamp(lane,0,1),skin=sample(surface,z,v);
 const tangent=norm(sub(ahead,behind)),axis=horizontal(span),
  direction=horizontal(tangent),motion=horizontal(velocity),speed=magnitude(velocity),
  p0=sample(surface,clamp(z-.009,0,1),.5),
  p1=sample(surface,clamp(z+.009,0,1),.5),
  tangent0=horizontal(sub(center,p0)),tangent1=horizontal(sub(p1,center)),
  turn=Math.atan2(tangent0[0]*tangent1[2]-tangent0[2]*tangent1[0],dot(tangent0,tangent1)),
  arc=magnitude(sub(p1,p0)),curvature=arc>1e-5?turn/arc:0,
  signedHeading=degrees(Math.atan2(direction[0]*motion[2]-direction[2]*motion[0],dot(direction,motion))),
  roadNormal=frame(surface,z,v).normal,normal=roadNormal[1]<0?roadNormal.map(x=>-x):roadNormal;
 return {
  u:round(z,6), lane:round(lane,5), widthM:round(width,3),
  edgeMarginM:round(Math.min(lane,1-lane)*width-ballRadius,3),
  speedMps:round(speed,3),horizontalSpeedMps:round(Math.hypot(velocity[0],velocity[2]),3),
  signedHeadingErrorDeg:round(signedHeading,3),
  lateralVelocityMps:round(dot(velocity,axis),3),
  longitudinalVelocityMps:round(dot(velocity,tangent),3),
  normalVelocityMps:round(dot(velocity,normal),3),
  verticalVelocityMps:round(velocity[1],3),
  roadPitchDeg:round(degrees(Math.atan2(tangent[1],Math.hypot(tangent[0],tangent[2]))),3),
  roadBankNormalY:round(normal[1],5),
  roadCurvaturePerM:round(curvature,7),
  turnDegPer100m:round(degrees(curvature)*100,3),
  kinematicCurveAccelMps2:round(Math.hypot(velocity[0],velocity[2])**2*Math.abs(curvature),3),
  ballAboveSkinY:round(p[1]-skin[1],3),
  position:p.map(x=>round(x,3)),velocity:velocity.map(x=>round(x,3)),
  centerline:center.map(x=>round(x,3)),tangent:tangent.map(x=>round(x,5)),
  roadNormal:normal.map(x=>round(x,5))
 };
}
