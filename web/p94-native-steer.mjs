/**
 * P94: read-only scripted QA steering for the original P93 physical world.
 * ONLY produces a user input [-1,1]; cannot change Runner physics, velocity,
 * position, collision, stage geometry, acceleration or records by itself.
 * It follows the already authored 65-node real B48 road midline guides.
 */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0);
const unit=a=>{const d=Math.hypot(...a)||1;return a.map(x=>x/d);};
function nearestCenterline(points,at){
 let best=null;
 for(let i=0;i<points.length-1;i++){
  const a=points[i],b=points[i+1],delta=b.map((v,k)=>v-a[k]);
  const proj=clamp(dot(at.map((v,k)=>v-a[k]),delta)/(dot(delta,delta)||1),0,1);
  const foot=a.map((v,k)=>v+proj*delta[k]);
  const dist=dot(at.map((v,k)=>v-foot[k]),at.map((v,k)=>v-foot[k]));
  if(best===null||dist<best.dist)best={point:foot,forward:unit(delta),dist};
 }
 return best;
}
export function p94NativeSteer(r,profile='corrective'){
 if(!['neutral','gentle','corrective'].includes(profile))throw Error('Unknown P94 controller profile');
 if(profile==='neutral')return 0;
 const guide=r.guides?.find(x=>x.surface===(r.surface||r.lastSurface));
 if(!guide)return 0;
 const near=nearestCenterline(guide.points,r.p);
 const tangent=unit([near.forward[0],0,near.forward[2]]);
 const roadRight=[-tangent[2],0,tangent[0]];
 const offset=dot(r.p.map((v,i)=>v-near.point[i]),roadRight);
 const velocityForward=unit([r.forward[0],0,r.forward[2]]);
 const localRight=[-velocityForward[2],0,velocityForward[0]];
 const bend=dot(tangent,localRight);
 return clamp(bend*(profile==='gentle'?1:2.1)-offset*(profile==='gentle'?.026:.058),-1,1);
}
