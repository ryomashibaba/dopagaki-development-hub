/**
 * P101 B5 A8 — static optical flow cues attached to the ACTUAL 7.28km
 * collision-authoritative B48 skin. Nothing animated, no fake road,
 * collision, steering, assists, lane safety claims or velocity changes.
 *
 * At 200m/s, 20m real-world spacing gives ~10 visible dash passages/s.
 * The previous P100 optical geometry has only 19 ticks per full chapter,
 * roughly 45-90m apart in the long B5 course.
 */
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const mul=(a,k)=>a.map(v=>v*k);
const length=v=>Math.hypot(...v);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const hues=[
 {inner:[.39,.92,1],edge:[.12,.93,.94],accent:[.48,.72,1]},
 {inner:[.94,.55,1],edge:[.64,.35,1],accent:[.7,.83,1]},
 {inner:[.5,1,.88],edge:[.14,.85,.72],accent:[.65,1,.96]},
 {inner:[1,.75,.45],edge:[1,.48,.21],accent:[1,.88,.67]},
 {inner:[.46,.68,1],edge:[.18,.42,1],accent:[.62,.82,1]},
 {inner:[1,.64,.98],edge:[.76,.3,.9],accent:[1,.78,1]},
 {inner:[.4,1,1],edge:[.12,.82,.93],accent:[.65,1,1]}
];
function quad(out,road,u0,u1,v0,v1,color,sample,frame){
 const lifted=(u,v)=>{
  const p=sample(road,u,v),n=frame(road,u,v).normal;
  return add(p,mul(n,n[1]<0?-.16:.16));
 };
 const a=lifted(u0,v0),b=lifted(u1,v0),c=lifted(u1,v1),d=lifted(u0,v1);
 for(const p of [a,b,c,a,c,d])out.push(...p,...color);
}
function physicalDistanceIndex(road,sample){
 const points=Array.from({length:129},(_,i)=>sample(road,i/128,.5));
 const cumulative=[0];let total=0;
 for(let i=1;i<points.length;i++){total+=length(points[i].map((v,k)=>v-points[i-1][k]));cumulative.push(total);}
 return {total,toU(distance){
  const d=clamp(distance,0,total);
  let lo=0,hi=cumulative.length-1;
  while(lo+1<hi){const mid=(lo+hi)>>1;if(cumulative[mid]<d)lo=mid;else hi=mid;}
  const span=cumulative[hi]-cumulative[lo]||1;
  return (lo+clamp((d-cumulative[lo])/span,0,1))/128;
 }};
}
export function p101B5OpticalRoadGeometry(doc,sample,frame){
 if(doc?.stageForge?.variant!=='B5_HYPER_ARC_ISOLATED')return {vertices:[],dashes:0,edgeTicks:0,distanceMeters:0,nonCollision:true};
 if(doc.surfaces?.length!==7||typeof sample!=='function'||typeof frame!=='function')
  throw Error('B5 optical cues require seven real B48 collidable surfaces and sampler');
 let dashes=0,edgeTicks=0,distanceMeters=0;
 const vertices=[];
 for(const [section,road] of doc.surfaces.entries()){
  if(!road.rideable||!road.collidable||road.rows!==31||road.cols!==5)
   throw Error('Optical read cannot lie about real collision-authoritative B48 roadway');
  const profile=physicalDistanceIndex(road,sample),palette=hues[section];
  distanceMeters+=profile.total;
  // Very short symmetric optically precise 20m dashes emphasize road flow
  // without marking the middle as a pre-selected safe lane.
  for(let distance=11;distance+7<profile.total-6;distance+=20){
   const u0=profile.toU(distance),u1=profile.toU(distance+7);
   for(const [a,b] of [[.27,.287],[.713,.73]]){
    quad(vertices,road,u0,u1,a,b,palette.inner,sample,frame);dashes++;
   }
   // Edge reflectors look like paint, not fake raised or solid walls.
   const e0=profile.toU(distance),e1=profile.toU(distance+3);
   for(const [a,b] of [[.045,.078],[.922,.955]]){
    quad(vertices,road,e0,e1,a,b,palette.edge,sample,frame);edgeTicks++;
   }
  }
  // Thin long true-banked shoulder line with deliberate interruptions,
  // designed to expose the *actual* huge S-curves even at 200m/s.
  for(let i=0;i<60;i++){
   if(i%10===9)continue;
   const u0=i/60,u1=(i+1)/60;
   for(const [a,b] of [[.093,.103],[.897,.907]]){
    quad(vertices,road,u0,u1,a,b,palette.accent,sample,frame);
   }
  }
 }
 if(vertices.length>140000||!vertices.every(Number.isFinite))throw Error('B5 optical mesh GPU budget or finite data violated');
 return {vertices,dashes,edgeTicks,distanceMeters:+distanceMeters.toFixed(2),
  opticalSpacingMeters:20,nonCollision:true};
}
