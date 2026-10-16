/** DOPAGAKI TRACK DIRECTOR — platform-neutral moving obstacle primitives.
 * Integrated in director/physics.js and moving/editor.mjs; original standalone tests retained.
 * Coordinate axes: X right, Y up, Z forward; degrees are around the Y axis.
 * All runtime sampling is a PURE function of authored stage data + simulation time.
 * No Date.now(), frame-dependent accumulated phase, browser/global state or dependencies.
 */

export const MOVING_OBSTACLE_SCHEMA = 'dopagaki.track-director.moving-obstacles/1';
export const OBSTACLE_TYPES = Object.freeze(['slider','rotator','piston']);
export const MOVING_COLLISION_MODES = Object.freeze(['fail','bounce','push']);
export const MAX_OBSTACLES = 64;
const TAU=Math.PI*2;
const EPS=1e-10;
const finite=(n)=>typeof n==='number'&&Number.isFinite(n);
const bound=(x,a,b)=>Math.min(b,Math.max(a,x));
const add=(a,b)=>a.map((n,i)=>n+b[i]);
const sub=(a,b)=>a.map((n,i)=>n-b[i]);
const mul=(a,n)=>a.map((v)=>v*n);
const dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0);
const mag=(a)=>Math.hypot(...a);
const unit=(a)=>mul(a,1/mag(a));

function assertNumber(n,description,min,max){
 if(!finite(n)||n<min||n>max)throw new RangeError(`${description}: expected finite number in [${min},${max}]`);
 return n;
}
function vector(v,description,min=-100000,max=100000){
 if(!Array.isArray(v)||v.length!==3)throw new TypeError(`${description}: expected XYZ triple`);
 return v.map((n,i)=>assertNumber(n,`${description}[${i}]`,min,max));
}
function checkId(s){if(typeof s!=='string'|| !/^[a-zA-Z][\w-]{0,63}$/.test(s))throw new TypeError('Obstacle id must be 1–64 ASCII letters, digits, _, or - beginning with a letter');return s;}
function checkName(s){if(typeof s!=='string'||s.length<1||s.length>90)throw new TypeError('Obstacle name must be 1–90 characters');return s;}
/** Legacy obstacles (without `collision`) retain the exact B3.8 lethal behavior.
 * Reject unknown fields rather than silently dropping an intended physical property.
 * `collision` is optional in old JSON; serialization does not add it to legacy objects.
 */
export function validateMovingCollision(input){
 if(input===undefined)return undefined;
 if(!input||typeof input!=='object'||Array.isArray(input))throw new TypeError('collision must be an object');
 const mode=input.mode;
 if(!MOVING_COLLISION_MODES.includes(mode))throw new TypeError(`Unsupported collision mode ${mode}`);
 const keys=Object.keys(input);
 const allowed=mode==='bounce'?['mode','restitution']:mode==='push'?['mode','pushStrength']:['mode'];
 for(const key of keys)if(!allowed.includes(key))throw new TypeError(`Unexpected collision field ${key} for ${mode}`);
 if(mode==='bounce')return {mode,restitution:assertNumber(input.restitution??.8,'restitution',0,1.5)};
 if(mode==='push')return {mode,pushStrength:assertNumber(input.pushStrength??1,'pushStrength',1,2)};
 return {mode};
}
export function movingCollisionSettings(ob){return validateMovingCollision(ob.collision)??{mode:'fail'};}
/** Return a new safe description; reject malformed/unknown motion settings. */
export function validateMovingObstacle(input){
 if(!input || typeof input!=='object'||Array.isArray(input))throw new TypeError('Obstacle must be an object');
 const {id,type,position,size}=input;
 checkId(id);
 if(!OBSTACLE_TYPES.includes(type))throw new TypeError(`Unsupported obstacle type ${type}`);
 const p=vector(position,`obstacle ${id} position`);
 const sz=vector(size,`obstacle ${id} size`,.05,300);
 const period=assertNumber(input.period,`${id} period`,.25,120);
 const phase=assertNumber(input.phase??0,`${id} phase`,0,1);
 const enabled=input.enabled??true;
 if(typeof enabled!=='boolean')throw new TypeError(`${id} enabled must be a boolean`);
 const name=checkName(input.name??id);
 const motion=input.motion;
 if(!motion||typeof motion!=='object'||Array.isArray(motion))throw new TypeError(`${id} motion must be an object`);
 const yawDegrees=assertNumber(input.yawDegrees??0,`${id} yawDegrees`,-360,360);
 const collision=validateMovingCollision(input.collision);
 const base={id,name,type,position:p,size:sz,enabled,period,phase,yawDegrees,...(collision?{collision}:{})};
 if(type==='slider'){
  const axis=vector(motion.axis,`${id} sliding axis`,-1000,1000);
  if(Math.abs(axis[1])>1e-9)throw new RangeError(`${id} slider axis must be horizontal (Y=0)`);
  if(mag(axis)<1e-6)throw new RangeError(`${id} slider axis cannot be zero`);
  return {...base,motion:{axis:unit(axis),amplitude:assertNumber(motion.amplitude,`${id} slider amplitude`,0,200),...(validateTiming(motion.timing,period,type,id)?{timing:validateTiming(motion.timing,period,type,id)}:{})}};
 }
 if(type==='piston'){
  return {...base,motion:{stroke:assertNumber(motion.stroke,`${id} piston stroke`,0,160),...(validateTiming(motion.timing,period,type,id)?{timing:validateTiming(motion.timing,period,type,id)}:{})}};
 }
 if(motion.direction!==undefined&&motion.direction!==1&&motion.direction!==-1)throw new TypeError(`${id} direction must be +1 or -1`);
 return {...base,motion:{direction:motion.direction===-1?-1:1,baseAngleDegrees:assertNumber(motion.baseAngleDegrees??0,`${id} rotator base angle`,-360,360),...(validateTiming(motion.timing,period,type,id)?{timing:validateTiming(motion.timing,period,type,id)}:{})}};
}


/** B48 optional timing, preserving exact legacy motion when absent.
 * dwellSeconds is the duration of EACH end stop for slider/piston, or the
 * single cycle-boundary stop for rotator. phase remains top-level [0,1].
 */
const EASINGS=Object.freeze(['cosine','smoothstep','linear','quintic']);
const defaultEase=type=>type==='rotator'?'linear':'cosine';
function validateTiming(raw,period,type,id){
 if(raw===undefined)return undefined;
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError(`${id} timing must be an object`);
 for(const key of Object.keys(raw))if(!['easing','dwellSeconds'].includes(key))throw new TypeError(`${id} unsupported timing field ${key}`);
 const easing=raw.easing??defaultEase(type);
 if(!EASINGS.includes(easing))throw new TypeError(`${id} invalid timing easing ${easing}`);
 const dwellSeconds=assertNumber(raw.dwellSeconds??0,`${id} dwellSeconds`,0,Math.min(20,period*.2));
 return {easing,dwellSeconds};
}
const wrap01=x=>((x%1)+1)%1;
function easeWithDerivative(easing,u){
 if(easing==='linear')return [u,1];
 if(easing==='smoothstep')return [u*u*(3-2*u),6*u*(1-u)];
 if(easing==='quintic')return [u*u*u*(10+u*(-15+6*u)),30*u*u*(u-1)*(u-1)];
 return [(.5-.5*Math.cos(Math.PI*u)),.5*Math.PI*Math.sin(Math.PI*u)];
}
function maxEaseDerivative(easing){return easing==='linear'?1:easing==='smoothstep'?1.5:easing==='quintic'?1.875:Math.PI/2;}
/** Returns dimensionless local position and time derivative (per second). */
export function movingTimingSample(descriptor,simulationSeconds){
 const ob=validateMovingObstacle(descriptor);
 assertNumber(simulationSeconds,'simulation time seconds',-10000000,10000000);
 const {type,period,phase,motion}=ob;
 const timing=motion.timing;
 const elapsed=simulationSeconds/period+phase;
 if(!timing){
  const theta=TAU*elapsed,rate=TAU/period;
  if(type==='slider')return {value:Math.sin(theta),rate:rate*Math.cos(theta)};
  if(type==='piston')return {value:Math.cos(theta),rate:-rate*Math.sin(theta)};
  return {value:elapsed,rate:1/period};
 }
 const {easing,dwellSeconds}=timing,d=dwellSeconds/period;
 if(type==='rotator'){
  const u=wrap01(elapsed),cycles=Math.floor(elapsed);
  if(u<d)return {value:cycles,rate:0};
  const r=(u-d)/(1-d),[a,derivative]=easeWithDerivative(easing,r);
  return {value:cycles+a,rate:derivative/(period*(1-d))};
 }
 // v=0 low, v=.5 high; each extreme has a centered dwell of d cycles.
 // slider starts centered and rises; piston starts at the upper endpoint.
 const v=wrap01(elapsed+(type==='slider'?.25:.5));
 if(v<d/2||v>=1-d/2)return {value:-1,rate:0};
 if(v>=.5-d/2&&v<.5+d/2)return {value:1,rate:0};
 const span=.5-d;
 if(v<.5){const r=(v-d/2)/span,[a,derivative]=easeWithDerivative(easing,r);return {value:-1+2*a,rate:2*derivative/(span*period)};}
 const r=(v-(.5+d/2))/span,[a,derivative]=easeWithDerivative(easing,r);
 return {value:1-2*a,rate:-2*derivative/(span*period)};
}
/** Conservative global upper bound used by swept-sphere CCD. */
export function movingObstacleSpeedLimit(descriptor){
 const ob=validateMovingObstacle(descriptor),t=ob.motion.timing;
 if(!t){
  if(ob.type==='slider')return TAU/ob.period*ob.motion.amplitude;
  if(ob.type==='piston')return TAU/ob.period*.5*ob.motion.stroke;
  return TAU/ob.period*Math.hypot(ob.size[0],ob.size[1]/2,ob.size[2]/2);
 }
 const maxE=maxEaseDerivative(t.easing);
 if(ob.type==='rotator')return TAU*maxE/(ob.period-t.dwellSeconds)*Math.hypot(ob.size[0],ob.size[1]/2,ob.size[2]/2);
 const peak=2*maxE/(.5*ob.period-t.dwellSeconds);
 return peak*(ob.type==='slider'?ob.motion.amplitude:ob.motion.stroke/2);
}

/** Do not mutate or discard other track-director fields, old stages default to zero moving obstacles. */
export function normalizeMovingObstacles(course){
 if(!course||typeof course!=='object'||Array.isArray(course))throw new TypeError('Course must be an object');
 const raw=course.movingObstacles===undefined?[]:course.movingObstacles;
 if(!Array.isArray(raw))throw new TypeError('Course movingObstacles must be an array');
 if(raw.length>MAX_OBSTACLES)throw new RangeError(`At most ${MAX_OBSTACLES} moving obstacles are allowed`);
 const unique=new Set();
 return raw.map((m)=>{
  const v=validateMovingObstacle(m);
  if(unique.has(v.id))throw new Error(`Duplicate moving obstacle id: ${v.id}`);
  unique.add(v.id);return v;
 });
}
export function withMovingObstacles(course,obstacles){
 const source={...course,movingObstacles:obstacles};
 return {...course,movingObstacles:normalizeMovingObstacles(source)};
}
export function serializeCourse(course){
 return JSON.stringify(withMovingObstacles(course,normalizeMovingObstacles(course)),null,2)+'\n';
}
/** Deterministic box pose: center, orientation Y-radians, half-size. */
export function movingObstaclePose(descriptor,simulationSeconds){
 const ob=validateMovingObstacle(descriptor);
 assertNumber(simulationSeconds,'simulation time seconds',-10000000,10000000);
 const sample=movingTimingSample(ob,simulationSeconds);
 const half=ob.size.map(x=>x/2),base=ob.position;
 if(ob.type==='slider'){
  const travel=ob.motion.amplitude*sample.value;
  return {id:ob.id,type:ob.type,center:add(base,mul(ob.motion.axis,travel)),yawRadians:ob.yawDegrees*Math.PI/180,halfSize:half,enabled:ob.enabled};
 }
 if(ob.type==='piston'){
  const offset=.5*ob.motion.stroke*sample.value;
  return {id:ob.id,type:ob.type,center:[base[0],base[1]+offset,base[2]],yawRadians:ob.yawDegrees*Math.PI/180,halfSize:half,enabled:ob.enabled};
 }
 const yaw=(ob.motion.baseAngleDegrees*Math.PI/180)+ob.motion.direction*TAU*sample.value;
 // Position = physical rotation pivot. The rectangular arm extends from the pivot along its local +X.
 const length=half[0];const c=Math.cos(yaw),s=Math.sin(yaw);
 return {id:ob.id,type:ob.type,center:[base[0]+c*length,base[1],base[2]-s*length],pivot:[...base],yawRadians:yaw,halfSize:half,enabled:ob.enabled};
}

function rotateLocal(delta,yaw){const c=Math.cos(yaw),s=Math.sin(yaw);return [c*delta[0]-s*delta[2],delta[1],s*delta[0]+c*delta[2]];}
function rotateWorld(local,yaw){const c=Math.cos(yaw),s=Math.sin(yaw);return [c*local[0]+s*local[2],local[1],-s*local[0]+c*local[2]];}
/** Signed separation from ball surface to the rotating obstacle box.
 * >0 separated, =0 contact, <0 penetration. Returns outward box normal in world XYZ.
 */
export function sphereBoxSeparation(ballCenter,ballRadius,pose){
 const center=vector(ballCenter,'ballCenter');assertNumber(ballRadius,'ballRadius',.001,100);
 if(!pose||!Array.isArray(pose.center)||!Array.isArray(pose.halfSize))throw new TypeError('Invalid obstacle pose');
 if(!pose.enabled)return {separation:Infinity,normal:[0,1,0],closestPoint:null,inside:false};
 const local=rotateLocal(sub(center,pose.center),pose.yawRadians);
 const q=local.map((v,i)=>bound(v,-pose.halfSize[i],pose.halfSize[i]));
 const diff=sub(local,q);let len=mag(diff),normalLocal,inside=false,boxSignedDistance;
 if(len>EPS){normalLocal=mul(diff,1/len);boxSignedDistance=len;}
 else {
  inside=true;
  const clear=pose.halfSize.map((v,i)=>v-Math.abs(local[i]));
  const i=clear.indexOf(Math.min(...clear));normalLocal=[0,0,0];normalLocal[i]=local[i]<0?-1:1;
  boxSignedDistance=-clear[i];q[i]=pose.halfSize[i]*normalLocal[i];
 }
 return {separation:boxSignedDistance-ballRadius,normal:rotateWorld(normalLocal,pose.yawRadians),closestPoint:add(pose.center,rotateWorld(q,pose.yawRadians)),inside};
}

/** World velocity of the moving solid at its exact OBB contact point.
 * A rotator is NOT a translating wall: angular tangential velocity at the
 * contact point (not center velocity) must be used for rebound / pushing.
 */
export function movingObstaclePointVelocity(input,time,worldContactPoint){
 const ob=validateMovingObstacle(input);
 assertNumber(time,'contact time',-10000000,10000000);
 const point=vector(worldContactPoint,'contact point');
 if(!ob.enabled)return [0,0,0];
 const sample=movingTimingSample(ob,time);
 if(ob.type==='slider')return mul(ob.motion.axis,ob.motion.amplitude*sample.rate);
 if(ob.type==='piston')return [0,.5*ob.motion.stroke*sample.rate,0];
 const spin=ob.motion.direction*TAU*sample.rate;
 const dx=point[0]-ob.position[0],dz=point[2]-ob.position[2];
 return [spin*dz,0,-spin*dx];
}
/** Pure contact velocity resolution: never mutate ball/obstacle descriptors.
 * Normal points from the moving box TOWARD the ball.
 * - bounce: restitution of relative normal closing velocity.
 * - push: non-penetration velocity with no energy-restoring bounce; optional
 *   pushStrength 1..2 scales only positive approach (never pulls the ball).
 * This solves ONE contact, not all simultaneous static contacts or friction.
 */
export function movingContactResponse(input,ballVelocity,contact){
 const ob=validateMovingObstacle(input);const settings=movingCollisionSettings(ob);
 if(settings.mode==='fail')return {mode:'fail',velocity:[...ballVelocity],deltaVelocity:[0,0,0]};
 const velocity=vector(ballVelocity,'ball velocity',-100000,100000);
 if(!contact||!Array.isArray(contact.normal)||!Array.isArray(contact.closestPoint))throw new TypeError('Contact needs normal and closest point');
 const normal=vector(contact.normal,'contact normal',-1,1),magN=mag(normal);
 if(Math.abs(magN-1)>1e-4)throw new RangeError('Contact normal must be normalized');
 const surfaceVelocity=movingObstaclePointVelocity(ob,contact.time,contact.closestPoint);
 const incoming=dot(sub(velocity,surfaceVelocity),normal);
 const change=incoming<0?-incoming*(settings.mode==='bounce'?1+settings.restitution:settings.pushStrength):0;
 const deltaVelocity=mul(normal,change);
 return {mode:settings.mode,velocity:add(velocity,deltaVelocity),deltaVelocity,surfaceVelocity,incomingNormalVelocity:incoming};
}
function maxObstacleSurfaceSpeed(ob){return movingObstacleSpeedLimit(ob);}
/**
 * Collision of a sphere moving linearly between two positions against a moving obstacle.
 * Adaptive *conservative advancement*: separation is 1-Lipschitz to relative motion,
 * so step < separation/(speedBall + upperBoundSpeedObstacle) cannot skip first contact.
 * This is a standalone geometry CCD kernel, NOT proof of B3.8 runtime integration.
 * If numerical budget is exhausted, status is `indeterminate`, NOT a false `clear`.
 */
export function sweepSphereMovingObstacle(obstacle,ballStart,ballEnd,radius,t0,t1,{maxIterations=8000,tolerance=1e-6}={}){
 const ob=validateMovingObstacle(obstacle);const a=vector(ballStart,'ballStart'),b=vector(ballEnd,'ballEnd');
 assertNumber(radius,'sphere radius',.001,100);
 assertNumber(t0,'time start',-10000000,10000000);assertNumber(t1,'time end',-10000000,10000000);
 if(t1<t0)throw new RangeError('time end must be >= time start');
 if(!Number.isInteger(maxIterations)||maxIterations<1||maxIterations>100000)throw new RangeError('Invalid maxIterations');
 assertNumber(tolerance,'tolerance',1e-10,.001);
 if(!ob.enabled)return {hit:false,status:'disabled',iterations:0};
 const dt=t1-t0;const speed=dt>0?mag(sub(b,a))/dt:0;const upper=speed+maxObstacleSurfaceSpeed(ob);let t=t0;
 for(let i=0;i<maxIterations;i++){
  const frac=dt===0?0:(t-t0)/dt;
  const center=add(a,mul(sub(b,a),frac));
  const pose=movingObstaclePose(ob,t);const contact=sphereBoxSeparation(center,radius,pose);
  if(contact.separation<=tolerance)return {hit:true,status:'contact',time:t,interpolation:frac,iterations:i+1,normal:contact.normal,closestPoint:contact.closestPoint,separation:contact.separation,obstacleId:ob.id};
  if(t>=t1)return {hit:false,status:'clear',iterations:i+1,minimumEndSeparation:contact.separation};
  if(upper<EPS)return {hit:false,status:'clear',iterations:i+1,minimumEndSeparation:contact.separation};
  const step=.8*contact.separation/upper;
  if(!finite(step)||step<=0)return {hit:false,status:'indeterminate',iterations:i+1,reason:'non-progress step'};
  // At 1e7-second time horizons float resolution may block progress; fail conservatively.
  const next=Math.min(t1,t+step);
  if(next<=t)return {hit:false,status:'indeterminate',iterations:i+1,reason:'time precision'};
  t=next;
 }
 return {hit:false,status:'indeterminate',iterations:maxIterations,reason:'iteration budget; treat as unsafe until checked'};
}
export function obstaclePosesAtTime(course,simulationSeconds){
 return normalizeMovingObstacles(course).map(o=>movingObstaclePose(o,simulationSeconds));
}
export function sweepSphereAll(course,start,end,radius,t0,t1){
 const objects=normalizeMovingObstacles(course);
 const results=objects.map(o=>sweepSphereMovingObstacle(o,start,end,radius,t0,t1));
 // Equal-time contacts must not depend on an arbitrary JSON array order.
 // Preserve the earliest absolute TOI; on a real TOI tie choose lethal contacts
 // before a nonlethal response and then stable id order. Expose ALL equal-time
 // contacts for the native solver to detect an opposing two-wall pinch.
 const byId=new Map(objects.map(o=>[o.id,o]));
 const hits=results.filter(r=>r.hit).sort((a,b)=>
  a.time-b.time ||
  (movingCollisionSettings(byId.get(a.obstacleId)).mode==='fail'?-1:0)-(movingCollisionSettings(byId.get(b.obstacleId)).mode==='fail'?-1:0) ||
  a.obstacleId.localeCompare(b.obstacleId));
 const hit=hits[0],indeterminate=results.filter(r=>r.status==='indeterminate');
 // An unresolved contact could precede the known impact: never let it pass.
 if(indeterminate.length)return {hit:false,status:'indeterminate',results};
 if(hit){
  const simultaneousContacts=hits.filter(r=>Math.abs(r.time-hit.time)<=1e-8)
    .sort((a,b)=>(movingCollisionSettings(byId.get(a.obstacleId)).mode==='fail'?-1:0)
       -(movingCollisionSettings(byId.get(b.obstacleId)).mode==='fail'?-1:0)
       ||a.obstacleId.localeCompare(b.obstacleId));
  const chosen=simultaneousContacts[0];
  return {hit:true,...chosen,results,simultaneousContacts};
 }
 return {hit:false,status:'clear',results};
}
