/** K4CS: one PRIVATE playable-sector early hazard cue.
 * Six REAL original B51 identities, original motion pose sampler, and
 * distance ALONG source B48 Road4/5/6 centreline (not straight-line/FoV).
 * Prediction is constant-speed and approximate: NEVER safe-lane certification.
 * All warning geometry is NONCOLLIDING and anchored OUTSIDE physical road.
 * K4CR road/B51, input, camera, 240Hz Runner, collision, speed are immutable.
 */
// Browser-safe runtime guards; no node:* imports in original game's WebGL2 module.
const assert=(condition,message='assert failed')=>{if(!condition)throw Error('K4CS '+message)};
assert.ok=assert;
assert.equal=(actual,expected,message='equal assertion failed')=>{
 if(actual!==expected)throw Error('K4CS '+message+' actual='+actual+' expected='+expected);
};
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),
 dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),mul=(v,k)=>v.map(x=>x*k),
 mag=v=>Math.hypot(...v),clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
// Actual binary/source Road5 SHA is verified upstream by K4CR private author.\n// The browser reads its already-validated metadata without reimplementing SHA-256.
const EXPECTED_K4CR='4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b';
const SAMPLES=128,MAX_RANGE_M=700;
function segment(road,index,sample,start){
 const p=Array.from({length:SAMPLES+1},(_,i)=>sample(road,i/SAMPLES,.5));
 const prefix=[0];for(let i=1;i<p.length;i++)prefix.push(prefix[i-1]+mag(sub(p[i],p[i-1])));
 return {index,id:road.id,road,points:p,prefix,length:prefix.at(-1),start};
}
function progressAt(s,u){
 const f=clamp(u)*SAMPLES,i=Math.min(SAMPLES-1,Math.floor(f)),t=f-i;
 return s.prefix[i]+(s.prefix[i+1]-s.prefix[i])*t;
}
function closestProgress(seg,p){
 let best={distance:Infinity,progress:0};
 for(let i=0;i<SAMPLES;i++){
  const a=seg.points[i],delta=sub(seg.points[i+1],a),n=dot(delta,delta);
  const t=clamp(dot(sub(p,a),delta)/(n||1)),point=add(a,mul(delta,t));
  const distance=mag(sub(p,point));
  if(distance<best.distance)best={distance,progress:seg.prefix[i]+Math.sqrt(n)*t};
 }
 return best;
}
function stationAt(plan,global){
 const d=clamp(global,0,plan.total),r=plan.roads.find(s=>d<=s.start+s.length)||plan.roads.at(-1);
 const target=clamp(d-r.start,0,r.length);
 let i=0;while(i<SAMPLES-1&&r.prefix[i+1]<target)i++;
 return {road:r.road,roadIndex:r.index,u:(i+clamp((target-r.prefix[i])/(r.prefix[i+1]-r.prefix[i]||1)))/SAMPLES};
}
export function makeK4CSRealB51RoadPlan(doc,sample){
 assert.equal(typeof sample,'function');
 assert.ok(doc.stageForge?.k4crPrivate,'K4CS requires prior physically tested K4CR R2');
 assert.equal(doc.stageForge.k4crPrivate.modifiedResearchRoad5SHA256,EXPECTED_K4CR,'Source K4CR physical Road5 SHA provenance drift');
 assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
 const all=doc.stageForge.k4crPrivate.realRelocatedB51;
 assert.equal(all.length,6);assert.equal(new Set(all.map(a=>a.id)).size,6);
 let sum=0;
 const roads=[4,5,6].map(i=>{const seg=segment(doc.surfaces[i],i,sample,sum);sum+=seg.length;return seg});
 const stations=all.map((a)=>{
  assert.ok((a.road===5||a.road===6)&&a.u>0&&a.u<1);
  const ob=doc.movingObstacles.find(o=>o.id===a.id);
  assert.ok(ob&&ob.enabled!==false);
  const rd=roads.find(r=>r.index===a.road);
  return {id:a.id,ob,roadIndex:a.road,u:a.u,laneV:a.laneV,
   distance:rd.start+progressAt(rd,a.u),road:rd.road,collisionMode:ob.collision?.mode??'fail'};
 }).sort((x,y)=>x.distance-y.distance);
 assert.ok(stations.every((x,i)=>i===0||x.distance>stations[i-1].distance));
 return {roads,stations,total:sum,originalB48:7,originalB51:28,earlyRangeM:MAX_RANGE_M};
}
export function readK4CSRealRoadWarning(doc,runner,plan,movingPose){
 if(!runner||!plan)return null;
 const active=plan.roads.find(r=>r.id===(runner.surface||runner.lastSurface));
 if(!active)return null;
 const actual=closestProgress(active,runner.p);
 if(actual.distance>75)return null; // cannot claim the player is on this road if physically far.
 const now=active.start+actual.progress;
 const target=plan.stations.find(s=>s.distance-now>=-10&&s.distance-now<=MAX_RANGE_M);
 if(!target)return null;
 const dist=Math.max(0,target.distance-now);
 const speed=Math.max(25,mag(runner.v));
 const eta=dist/speed;
 // Real moving-obstacle engine at an estimated arrival time; no copied timing.
 const pose=movingPose(target.ob,runner.time+eta);
 if(!pose?.enabled||!pose.center)return null;
 const l=doc.surfaces[target.roadIndex],left=plan.sample(l,target.u,0);
 const right=plan.sample(l,target.u,1);
 const span=sub(right,left),d=dot(span,span);
 const predictedV=d>1e-8?dot(sub(pose.center,left),span)/d:.5;
 const side=predictedV<=.35?'LEFT':predictedV>=.65?'RIGHT':'CENTER';
 return {id:target.id,roadId:active.id,targetRoadId:target.road.id,
  runnerProgressMeters:+now.toFixed(2),stationProgressMeters:+target.distance.toFixed(2),
  metres:+dist.toFixed(2),etaSeconds:+eta.toFixed(2),speedMps:+mag(runner.v).toFixed(2),
  predictedLaneV:+predictedV.toFixed(3),side,mode:target.collisionMode,
  urgency:dist<=160?'NOW':dist<=340?'READY':'EARLY',
  prediction:'ORIGINAL_B51_FUTURE_POSE_AT_CONSTANT_CURRENT_SPEED',
  occlusionTested:false,actualCollisionPrediction:false,safeLaneCertified:false,
  realB48PhysicalRoad:true,originalB51Object:true,provenHumanReadability:false};
}
const PALETTE={
 EARLY:[.13,.87,.96],READY:[1,.77,.26],NOW:[1,.28,.36],NEUTRAL:[.11,.17,.24]
};
export function buildK4CSOutsideB48Beacons(plan,sample){
 const triangles=[];
 const face=(a,b,c,col)=>triangles.push({a,b,c,color:col});
 const quad=(a,b,c,d,col)=>{face(a,b,c,col);face(a,c,d,col);face(c,b,a,col);face(d,c,a,col)};
 const post=(position,tangent,side,height,color)=>{
  const c=add(position,[0,height*.5,0]),axis=mul(tangent,.72),lateral=mul(side,.55);
  const at=(y,s1,s2)=>add(add(add(c,[0,y,0]),mul(axis,s1)),mul(lateral,s2));
  for(let k=0;k<4;k++){
   const aa=[[-1,-1],[1,-1],[1,1],[-1,1]][k],bb=[[-1,-1],[1,-1],[1,1],[-1,1]][(k+1)%4];
   quad(at(-height*.5,...aa),at(-height*.5,...bb),
        at(height*.5,...bb),at(height*.5,...aa),color);
  }
  // Tall tapered roadside pennant, outside the source B48 collision road.
  const top=add(c,[0,height*.57,0]);
  face(add(c,[0,height*.33,0]),add(top,mul(axis,4.2)),add(top,mul(side,2.6)),color);
  face(add(c,[0,height*.33,0]),add(top,mul(side,2.6)),add(top,mul(axis,4.2)),color);
 };
 const markers=[];
 for(const st of plan.stations){
  for(const [grade,back] of [510,310,145].entries()){
   const position=st.distance-back;
   if(position<10)continue;
   const hit=stationAt(plan,position),road=hit.road,u=hit.u;
   const l=sample(road,u,0),r=sample(road,u,1),c=sample(road,u,.5),
    ahead=sample(road,clamp(u+.008),.5),behind=sample(road,clamp(u-.008),.5);
   let tangent=sub(ahead,behind);tangent[1]=0;tangent=mul(tangent,1/(mag(tangent)||1));
   let side=sub(r,l);side[1]=0;side=mul(side,1/(mag(side)||1));
   const color=grade===0?PALETTE.EARLY:grade===1?PALETTE.READY:PALETTE.NOW,
    height=grade===0?19:grade===1?15:11;
   post(add(l,add(mul(side,-2.7),[0,2,0])),tangent,side,height,color);
   post(add(r,add(mul(side,2.7),[0,2,0])),tangent,side,height,color);
   markers.push({hazard:st.id,road:hit.roadIndex,u:+u.toFixed(5),actualDistanceBeforeB51:back,
    tier:['EARLY','READY','NOW'][grade],outsidePhysicalRoad:true});
  }
 }
 assert.ok(triangles.length>=150&&triangles.length<3000,'Unexpected real road warning gate mesh');
 const vertices=[];for(const t of triangles)for(const p of [t.a,t.b,t.c])vertices.push(...p,...t.color);
 assert.ok(vertices.every(Number.isFinite),'Nonfinite 3D real B48 advance gates');
 return {triangles,vertices,markers,nonColliding:true,realSourceSampled:true};
}
// Bind read-only source sampler ONCE without modifying doc or the Runner.
export function bindK4CSPlan(doc,sample){
 const immutable=JSON.stringify(doc);
 const plan=makeK4CSRealB51RoadPlan(doc,sample);
 assert.equal(JSON.stringify(doc),immutable);
 return {...plan,sample};
}
