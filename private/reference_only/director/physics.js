import {add,sub,mul,dot,len,norm,cross,project,clamp,mix} from './math.js';
import {frame,sample} from './surface.js';
import {contacts,sweep} from './collision.js';
import {fixtureTouches,fixtureType} from './game-fixtures.js';
import {createMovingObstaclePhysicsBridge} from './moving/native-physics-bridge.mjs';
import {movingContactResponse} from './moving/moving-obstacles.mjs';
export const DT=1/240,RADIUS=.65;
// B45: authored fixture impulses are intentionally separate from moving-obstacle
// collision modes. In particular, changing these does not rewrite stage JSON.
export const FIXTURE_IMPULSES=Object.freeze({
 shove:Object.freeze({side:10.0,lift:8.0,forward:3.0}),
 boosterCube:Object.freeze({horizontal:10.0,minUpward:30.0})
});
export function routeFrame(route,p){let best=null;
 for(let i=0;i<route.length-1;i++){const a=route[i],d=sub(route[i+1],a),t=clamp(dot(sub(p,a),d)/(dot(d,d)||1),0,1),q=add(a,mul(d,t)),dist=len(sub(p,q));if(!best||dist<best.distance)best={distance:dist,forward:norm(d),index:i,point:q};}return best;}
export class Runner{
 constructor(doc,world,spawn=0,speed=44){this.movingBridge=createMovingObstaclePhysicsBridge(doc);this.doc=doc;this.world=world;this.records=[];this.events=[];this.time=0;this.recordAt=1/30;this.status='ready';this.steer=0;this.assist=true;this.collisions=0;this.spawnIndex=spawn;this.startSpeed=speed;this.collected=new Set();this.boosted=new Set();this.points=0;this.magnetTime=0;this.magnetTime=0;
 this.guides=doc.generatedRoute&&doc.routeSegments?.map(g=>({surface:g.surface,points:Array.from({length:65},(_,i)=>sample(doc.surfaces.find(s=>s.id===g.surface),g.u0+(g.u1-g.u0)*i/64,g.v))}));
 const start=doc.spawns[spawn],s=doc.surfaces.find(x=>x.id===start.surface),f=frame(s,start.u,start.v);let n=f.normal;if(n[1]<0)n=mul(n,-1);this.p=add(f.p,mul(n,RADIUS+.025));this.forward=mul(f.forward,start.reverse?-1:1);this.v=mul(this.forward,speed);this.normal=n;this.surface=start.surface;this.grounded=true;this.lastSurface=this.surface;this.airTime=0;this.record(0);}
 resumeAt(checkpoint){
  // A checkpoint run has its own zero-based time and telemetry, never mutates the course JSON.
  this.p=[...checkpoint.position];this.v=[...checkpoint.velocity];this.forward=[...checkpoint.forward];
  this.normal=[...checkpoint.normal];this.grounded=true;this.surface=checkpoint.surface;this.lastSurface=checkpoint.surface;
  this.startSpeed=checkpoint.speed;this.status='ready';this.time=0;
  this.airTime=0;this.collisions=0;this.steer=0;this.failure=null;this.events=[];this.records=[];this.recordAt=1/30;this.collected=new Set();this.boosted=new Set();this.points=0;this.magnetTime=0;this.magnetTime=0;
  this.record(0);
  return this;
 }
 record(input){this.records.push({t:+this.time.toFixed(4),position:[...this.p],velocity:[...this.v],speed:len(this.v),input,surface:this.surface,grounded:this.grounded,status:this.status});}
 fail(reason){if(this.status==='failed')return;this.status='failed';this.failure={t:this.time,reason,position:[...this.p],speed:len(this.v),surface:this.surface};this.events.push({type:'failure',...this.failure});this.record(this.steer);}
 step(input=0){if(this.status==='failed'||this.status==='finished')return;this.status='running';this.time+=DT;this.steer=clamp(input,-1,1);this.magnetTime=Math.max(0,this.magnetTime-DT);
 const touching=contacts(this.world,this.p,RADIUS),support=touching.filter(c=>c.triangle.rideable&&c.normal[1]>.15).sort((a,b)=>b.normal[1]-a.normal[1])[0];
 this.grounded=!!support;this.surface=support?.triangle.surface??null;this.normal=support?.normal??[0,1,0];if(this.surface!==this.lastSurface){this.events.push({type:this.surface?'contact':'air',t:this.time,surface:this.surface,position:[...this.p]});this.lastSurface=this.surface;}
 const n=this.normal,local=this.guides?.filter(g=>g.surface===this.surface).map(g=>({g,f:routeFrame(g.points,this.p)})).sort((a,b)=>a.f.distance-b.f.distance)[0],route=local?.g.points??this.doc.route,guide=routeFrame(route,this.p);
 const oldForward=norm(project(this.forward,n)),oldRight=norm(cross(oldForward,n));
 if(this.assist&&this.grounded&&guide.distance<30){const preview=routeFrame(route,add(this.p,mul(this.forward,Math.min(12,len(this.v)*.22))));let target=norm(project(preview.forward,n));if(dot(target,this.forward)<-.2)target=this.forward;this.forward=norm(mix(this.forward,target,DT*6));}
 let f=norm(project(this.forward,n));if(len(f)<.1)f=[0,0,1];this.forward=f;const right=norm(cross(f,n));
 // Arcade auto-forward rotates the drive frame without binding the position to the guide.
 // Tangential speed is preserved across heading changes; gravity still changes it on slopes.
 if(this.grounded){this.v=add(add(mul(f,dot(this.v,oldForward)),mul(right,dot(this.v,oldRight))),mul(n,dot(this.v,n)));}
 let acceleration=[0,-28,0];if(this.grounded){const side=dot(this.v,right);acceleration=add(acceleration,add(mul(f,1.1),mul(right,this.steer*36-side*3.8)));}else acceleration=add(acceleration,mul(right,this.steer*7));
 this.v=add(this.v,mul(acceleration,DT));let remaining=DT;
 for(let i=0;i<5&&remaining>1e-7;i++){const delta=mul(this.v,remaining),hit=sweep(this.world,this.p,delta,RADIUS);
 const moving=this.movingBridge.step({previousBallPosition:this.p,ballPosition:add(this.p,delta),ballRadius:RADIUS,previousSimulationSeconds:this.time-remaining,simulationSeconds:this.time});
 if(moving.status==='indeterminate'){this.events.push({type:'moving-unsafe',t:this.time,results:moving.results});this.fail('移動障害物の接触判定が収束しませんでした');break;}
 if(moving.hit&&(!hit||moving.interpolation<=hit.time)){
  const ob=this.movingBridge.definitions.find(x=>x.id===moving.obstacleId);
  if(!ob)throw new Error(`Moving contact without definition: ${moving.obstacleId}`);
  // Move to the conservative continuous TOI rather than the end-of-frame,
  // then use moving *surface* velocity to resolve relative normal motion.
  const fraction=clamp(moving.interpolation,0,1);
  this.p=add(this.p,mul(delta,fraction));this.collisions++;
  // G5-A: observational diagnostics only; do not modify the contact impulse.
  const velocityBefore=[...this.v];
  const response=movingContactResponse(ob,this.v,moving);
  this.events.push({type:'moving-contact',id:moving.obstacleId,obstacleType:ob.type,
   mode:response.mode,t:moving.time,normal:[...moving.normal],position:[...this.p],
   velocityBefore,velocityAfter:[...response.velocity],forward:[...this.forward],
   forwardBeforeMps:dot(velocityBefore,this.forward),
   forwardAfterMps:dot(response.velocity,this.forward),
   surfaceVelocity:response.surfaceVelocity?[...response.surfaceVelocity]:null,
   deltaVelocity:[...response.deltaVelocity]});
  if(response.mode==='fail'){this.fail('赤い障害物に衝突（移動障害物）');break;}
  // Two opposing closing moving surfaces cannot both be satisfied by one
  // contact impulse. A ball sandwiched between them must fail closed, not pass
  // through one wall because the source JSON chooses which obstacle is first.
  const coincident=moving.simultaneousContacts??[];
  if(coincident.length>1 && response.mode!=='fail'){
   const pushes=coincident.map(c=>{
    const source=this.movingBridge.definitions.find(x=>x.id===c.obstacleId);
    return {contact:c,response:movingContactResponse(source,this.v,c)};
   }).filter(x=>x.response.mode!=='fail' && dot(x.response.deltaVelocity,x.contact.normal)>.001);
   if(pushes.some((a,i)=>pushes.slice(i+1).some(b=>dot(a.contact.normal,b.contact.normal)<-.85))){
    this.events.push({type:'moving-crush',t:this.time,ids:pushes.map(x=>x.contact.obstacleId).sort(),kind:'opposing-moving'});
    this.fail('複数の移動障害物に挟まれました');break;
   }
  }
  // Piston/slider pushing a ball INTO an already contacted fixed solid is
  // compression, not a free impulse. Detect only true opposing support contact
  // and nonlethal push; a bounce toward a floor is handled by ordinary CCD.
  if(response.mode==='push' && contacts(this.world,this.p,RADIUS).some(c=>
   c.distance<=RADIUS+.003 && dot(c.normal,moving.normal)<-.85 &&
   dot(response.deltaVelocity,c.normal)<-.01)){
   this.events.push({type:'moving-crush',t:this.time,ids:[moving.obstacleId],kind:'moving-against-static'});
   this.fail('移動障害物と固定面に挟まれました');break;
  }
  this.v=response.velocity;
  // The CCD begins at a mathematical contact, so separate slightly along
  // the outward normal to avoid repeating a t=0 impact next iteration.
  this.p=add(this.p,mul(moving.normal,.0015));
  remaining*=1-fraction;
  if(remaining<1e-7)break;
  continue;
 }
 if(!hit){this.p=add(this.p,delta);remaining=0;break;}
 const fixedVelocityBefore=[...this.v];
 this.p=add(this.p,mul(delta,Math.max(0,hit.time-1e-5)));const inward=dot(this.v,hit.normal);if(inward<0)this.v=sub(this.v,mul(hit.normal,inward));this.p=add(this.p,mul(hit.normal,.0003));remaining*=1-hit.time;this.collisions++;
 if(hit.triangle.part==='fixture'){
  const id=hit.triangle.surface.slice('fixture:'.length),fixture=this.doc.fixtures?.find(f=>f.id===id);
  if(['danger','block','wall'].includes(fixture?.kind)){this.fail('赤い障害物に衝突');break;}
 }
 if(!hit.triangle.rideable&&-inward>10){
  // G5-A: distinguish lethal static surfaces from prior moving-machine contacts.
  this.events.push({type:'static-fatal-contact',t:this.time,
   surface:hit.triangle.surface??null,part:hit.triangle.part??null,
   normal:[...hit.normal],position:[...this.p],velocityBefore:fixedVelocityBefore,
   forward:[...this.forward],forwardBeforeMps:dot(fixedVelocityBefore,this.forward),
   inwardNormalMps:inward});
  this.fail('衝突専用面へ衝突');break;
 }
 }
 // A contact may consume all five conservative substeps at nearly zero TOI.
 // The remaining physics time is UNSOLVED. Do not carry on with a falsely
 // successful step or permit a ball trapped inside a moving machine.
 if(this.status==='running' && remaining>1e-7){
  this.events.push({type:'moving-unsafe',t:this.time,reason:'contact solver budget',remainingSeconds:remaining});
  this.fail('移動障害物の接触解決が上限に達しました');
 }
 if(this.status==='failed')return;
 // Resolve initial overlap locally; never snap to a height field or a different layer.
 for(const c of contacts(this.world,this.p,RADIUS))if(c.distance<RADIUS-.00001)this.p=add(this.p,mul(c.normal,Math.min(.08,RADIUS-c.distance+.0001)));
 this.airTime=this.grounded?0:this.airTime+DT;
 // Props use the course-local ground anchor. Pickups and pads do not edit course geometry.
 for(const fixture of this.doc.fixtures??[]){if(fixture.enabled===false)continue;
  const spec=fixtureType(fixture.kind);if(!spec)continue;
  const magnetic=this.magnetTime>0&&fixture.kind==='cube';
  const touched=fixtureTouches(fixture,this.p,magnetic?2.5:RADIUS);
  if(spec.behavior==='boost'&&touched){this.v=add(this.v,mul(this.forward,30*DT));if(!this.boosted.has(fixture.id)){this.boosted.add(fixture.id);this.events.push({type:'boost',id:fixture.id,t:this.time,position:[...this.p]});}}
  if(!touched)continue;
  if(spec.behavior==='pickup'&&!this.collected.has(fixture.id)){
   this.collected.add(fixture.id);if(fixture.kind==='magnet')this.magnetTime=6;
   this.points+=spec.value;this.events.push({type:'pickup',kind:fixture.kind,id:fixture.id,points:spec.value,t:this.time,position:[...this.p]});
  }
  if(['shove','boosterCube'].includes(spec.behavior)&&!this.boosted.has(fixture.id)){
   this.boosted.add(fixture.id);
   if(spec.behavior==='shove'){
    const {side,lift,forward}=FIXTURE_IMPULSES.shove;
    this.v=add(this.v,[this.p[0]>=fixture.position[0]?side:-side,lift,forward]);
   }else{
    const {horizontal,minUpward}=FIXTURE_IMPULSES.boosterCube;
    // Horizontal forward boost keeps the launch strong even on steep ramps.
    // A fixed minimum upward launch speed also works while descending: merely
    // adding a small impulse to a high downward speed would feel like no jump.
    const flatForward=norm([this.forward[0],0,this.forward[2]]);
    this.v=add(this.v,mul(len(flatForward)>.1?flatForward:[0,0,1],horizontal));
    this.v[1]=Math.max(this.v[1],minUpward);
   }
   this.events.push({type:spec.behavior==='shove'?'shove':'boosterCube',id:fixture.id,t:this.time,position:[...this.p]});
  }
 }
 if(this.p[1]<-24)this.fail('コースから落下');if(this.airTime>8)this.fail('長時間の空中離脱');if(len(this.v)>600)this.fail('速度上限600m/s');
 if(guide.index>=route.length-3&&(!this.guides||local?.g===this.guides.at(-1))&&guide.distance<16&&this.grounded&&this.time>2){this.status='finished';this.events.push({type:'finish',t:this.time,position:[...this.p]});}
 if(this.time>=this.recordAt){this.record(input);this.recordAt+=1/30;}
 }
 export(){return {schema:'dopagaki.track-director.run/1',course:structuredClone(this.doc),physics:{step:DT,radius:RADIUS,gravity:28},spawn:this.spawnIndex,startSpeed:this.startSpeed,assist:this.assist,points:this.points,samples:this.records,events:this.events,failure:this.failure??null,status:this.status};}
}
