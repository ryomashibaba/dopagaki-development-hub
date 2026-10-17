/**
 * P91 / native-road approach beacons.
 *
 * Purely visual vertex pairs sampled from already-authored B48 rideable
 * surfaces. No collision, route, steer, physics, jumping, or score edits.
 * NOT a verified safe line, jump prediction or collision forecast.
 */
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const mul=(a,k)=>a.map(x=>x*k);
const line=(out,a,b,c)=>{out.push(...a,...c,...b,...c);};
const COLORS=Object.freeze({
 forkLeft:[.18,.94,1],forkRight:[.83,.49,1],
 machines:[1,.71,.22],jump:[1,.74,.18],edge:[1,.28,.27]
});
function nearRoad(s,u,v,sample,frame,offset=.35){
 const p=sample(s,u,v),n=frame(s,u,v).normal;
 if(!Array.isArray(p)||p.length!==3||!Array.isArray(n)||n.length!==3)throw Error('Canonical road sampler/frame required');
 const l=Math.hypot(...n)||1,up=n[1]<0?mul(n,-1):n;
 return add(p,mul(up,offset/l));
}
function bar(out,s,u,color,sample,frame){
 // 10 short physical-road bands, not a speculative bridge or virtual route.
 for(let j=0;j<10;j++){
  const a=.07+j*.086,b=Math.min(.93,a+.067);
  line(out,nearRoad(s,u,a,sample,frame),nearRoad(s,u,b,sample,frame),color);
 }
}
function post(out,s,u,v,color,sample,frame){
 const p=nearRoad(s,u,v,sample,frame,.45);
 line(out,p,add(p,[0,7.5,0]),color);
}
function chevron(out,s,u,v,color,sample,frame){
 const tip=nearRoad(s,Math.min(.97,u+.035),v,sample,frame);
 const tailU=Math.max(.03,u-.035);
 line(out,nearRoad(s,tailU,v-.085,sample,frame),tip,color);
 line(out,nearRoad(s,tailU,v+.085,sample,frame),tip,color);
}
function selectSurface(stage,name,which){
 const list=stage.surfaces.filter(s=>s.rideable&&s.collidable&&s.visible!==false&&s.id.includes('-'+name+'-'));
 return which==='last'?list.at(-1):list[0];
}
/** Six floats per vertex: xyz rgb. Entries are GL.LINES pairs only. */
export function approachBeaconVertices(stage,sample,frame){
 if(stage?.stageForge?.id!=='EP-P66')return {vertices:[],regions:[],markerCount:0};
 if(typeof sample!=='function'||typeof frame!=='function')throw Error('Read-only B48 samplers required');
 const result=[],regions=[];
 const fork=selectSurface(stage,'FORK_APPROACH','last');
 if(fork){
  for(const u of [.37,.58,.79]){
   chevron(result,fork,u,.27,COLORS.forkLeft,sample,frame);
   chevron(result,fork,u,.73,COLORS.forkRight,sample,frame);
  }
  // Side gates identify the approach without creating an artificial safe middle lane.
  post(result,fork,.83,.025,COLORS.forkLeft,sample,frame);
  post(result,fork,.83,.975,COLORS.forkRight,sample,frame);
  regions.push('FORK');
 }
 const machines=selectSurface(stage,'MACHINE_CHAMBER','first');
 if(machines){
  for(const u of [.08,.22])bar(result,machines,u,COLORS.machines,sample,frame);
  post(result,machines,.14,.025,COLORS.machines,sample,frame);
  post(result,machines,.14,.975,COLORS.machines,sample,frame);
  regions.push('MACHINES');
 }
 const gap=selectSurface(stage,'GAP_TAKEOFF','last');
 if(gap){
  for(const u of [.64,.79])bar(result,gap,u,COLORS.jump,sample,frame);
  bar(result,gap,.94,COLORS.edge,sample,frame);
  post(result,gap,.95,.035,COLORS.edge,sample,frame);
  post(result,gap,.95,.965,COLORS.edge,sample,frame);
  regions.push('NATURAL_GAP');
 }
 if(result.length%12!==0||result.some(x=>!Number.isFinite(x)))throw Error('Nonfinite or unpaired approach-beacon vertices');
 return {vertices:result,regions,markerCount:result.length/12};
}
