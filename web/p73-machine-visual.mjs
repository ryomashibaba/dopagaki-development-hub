/**
 * P73: collision-faithful MACHINE GAUNTLET visualization.
 *
 * Every moving solid is represented by an opaque, type-specific housing
 * dimensioned by the *existing* B51-C movingObstaclePose (XYZ, yaw, halfSize).
 * All body details remain within 0.501 of the unit collision box. Only
 * stationary floor/trajectory guides are decorative and NON-COLLIDABLE.
 */
// Source-provided B51-C pose sampler is injected by the host; avoids any
// duplicate physics implementation or deployment/source-relative import drift.

const PALETTE=Object.freeze({
 fail:{body:[.36,.055,.12],light:[1,.15,.23],edge:[1,.49,.22]},
 bounce:{body:[.35,.23,.075],light:[1,.83,.21],edge:[1,.99,.56]},
 push:{body:[.24,.11,.43],light:[.79,.39,1],edge:[.38,.93,1]}
});
const TYPES=Object.freeze({
 slider:'SLIDER',rotator:'ROTATOR',piston:'PISTON'
});
const push=(out,p,c)=>out.push(...p,...c);
const tri=(out,a,b,c,color)=>{push(out,a,color);push(out,b,color);push(out,c,color);};
function quad(out,a,b,c,d,color){tri(out,a,b,c,color);tri(out,a,c,d,color);}
function cube(out,a,b,color){
 const v=[
 [a[0],a[1],a[2]],[b[0],a[1],a[2]],[b[0],b[1],a[2]],[a[0],b[1],a[2]],
 [a[0],a[1],b[2]],[b[0],a[1],b[2]],[b[0],b[1],b[2]],[a[0],b[1],b[2]]
 ];
 for(const [i,j,k,l] of [[0,1,2,3],[4,7,6,5],[0,4,5,1],[3,2,6,7],[0,3,7,4],[1,5,6,2]])
  quad(out,v[i],v[j],v[k],v[l],color);
}
const span=(v,min=-.5008,max=.5008)=>Math.max(min,Math.min(max,v));
const typeName=t=>TYPES[t]||'MACHINE';
export function visualMode(ob){return ob?.collision?.mode||'fail';}
export function obstacleBodyVertices(type,mode){
 if(!TYPES[type]||!PALETTE[mode])throw Error('Unsupported machine visual type/mode');
 const {body,light,edge}=PALETTE[mode],out=[];
 const dark=body.map(x=>x*.54);
 cube(out,[-.5,-.5,-.5],[.5,.5,.5],body);
 // Broad safety-color frame stripes are inside the EXACT physical bounding box.
 for(const sign of [-1,1]){
  const z=sign*.5004;
  for(let i=0;i<7;i++){
   const x=-.43+i*.143;
   quad(out,[x,-.40,z],[x+.055,-.40,z],[x+.055,.40,z],[x,.40,z],
    i%2?dark:light);
  }
 }
 for(const y of [-.45,.45]){
  cube(out,[-.48,y-.032,-.47],[.48,y+.032,.47],edge);
 }
 if(type==='slider'){
  // Sliding ram: strong horizontal carriage bars and eight guide teeth.
  for(const y of [-.22,.20]){
   cube(out,[-.47,y-.075,-.46],[.47,y+.075,.46],dark);
  }
  for(let i=0;i<8;i++){
   const x=-.43+i*.121;
   cube(out,[x,-.34,-.497],[x+.055,.34,-.485],i%2?edge:light);
  }
 }else if(type==='rotator'){
  // Sweep arm: directional saw-tooth diagonal bands along the long dimension.
  for(let i=0;i<8;i++){
   const x=-.44+i*.115;
   cube(out,[x,-.38,-.49],[span(x+.057),.38,-.46],i%2?edge:light);
  }
  cube(out,[-.18,-.47,-.44],[.18,.47,.44],dark);
  cube(out,[-.10,-.32,-.49],[.10,.32,-.47],light);
 }else{
  // Vertically traveling press: nested rectangular actuators and hazard teeth.
  cube(out,[-.31,-.47,-.48],[.31,.47,.48],dark);
  for(let i=0;i<7;i++){
   const y=-.41+i*.135;
   cube(out,[-.45,y,-.493],[.45,y+.04,-.484],i%2?light:edge);
  }
 }
 return out;
}
export function obstacleGuideVertices(ob){
 if(!TYPES[ob.type])throw Error('Unknown moving machine type');
 const out=[],mode=visualMode(ob),c=PALETTE[mode]?.edge||PALETTE.fail.edge;
 const color=c.map(v=>v*.55);
 const line=(a,b)=>{push(out,a,color);push(out,b,color);};
 if(ob.type==='slider'){
  const a=ob.motion.axis,A=ob.motion.amplitude,base=ob.position;
  const rail=(sign,dy)=>{
   const offset=ob.size[2]*sign*.59;
   const from=[base[0]-a[0]*(A+2),base[1]+dy,base[2]-a[2]*(A+2)+offset];
   const to=[base[0]+a[0]*(A+2),base[1]+dy,base[2]+a[2]*(A+2)+offset];
   line(from,to);
  };
  rail(-1,-ob.size[1]/2-.5);rail(1,-ob.size[1]/2-.5);
 }else if(ob.type==='piston'){
  const [x,y,z]=ob.position,h=ob.motion.stroke/2+ob.size[1]/2+2;
  for(const dx of [-ob.size[0]*.56,ob.size[0]*.56])
   line([x+dx,y-h,z],[x+dx,y+h,z]);
 }else{
  const {position:p,size}=ob,r=size[0]+.5;
  for(let i=0;i<72;i++){
   const a=2*Math.PI*i/72,b=2*Math.PI*(i+1)/72;
   const pt=t=>[p[0]+r*Math.cos(t),p[1]-size[1]*.8,p[2]+r*Math.sin(t)];
   line(pt(a),pt(b));
  }
 }
 return out;
}
export function makeMachineMeshes(obstacles){
 return (obstacles||[]).filter(o=>o.enabled!==false).map(o=>({
  id:o.id,type:o.type,mode:visualMode(o),
  body:obstacleBodyVertices(o.type,visualMode(o)),
  guide:obstacleGuideVertices(o)
 }));
}
/** Informational proximity only — NOT a collision or time-to-contact prediction. */
export function nearestMachineCue(obstacles,position,forward,simulationTime,maxDistance=220,poseAt){
 if(typeof poseAt!=='function')throw Error('Physical B51-C pose sampler is required');
 if(!Array.isArray(obstacles)||!obstacles.length)return null;
 const flat=Math.hypot(forward[0],forward[2])||1,f=[forward[0]/flat,forward[2]/flat];
 let nearest=null;
 for(const ob of obstacles){
  if(ob.enabled===false)continue;
  const p=poseAt(ob,simulationTime),dx=p.center[0]-position[0],dz=p.center[2]-position[2];
  const distance=Math.hypot(dx,dz),ahead=dx*f[0]+dz*f[1];
  if(ahead<-10||distance>maxDistance||Math.abs(p.center[1]-position[1])>85)continue;
  const current={id:ob.id,type:ob.type,mode:visualMode(ob),distance:Math.round(distance),
   side:dx*(-f[1])+dz*f[0]};
  if(!nearest||current.distance<nearest.distance)nearest=current;
 }
 if(!nearest)return null;
 return {...nearest,typeLabel:typeName(nearest.type),
  modeLabel:nearest.mode==='fail'?'接触で失敗':nearest.mode==='bounce'?'接触で反発':'接触で押し出し',
  lateralLabel:Math.abs(nearest.side)<4?'前方':nearest.side>0?'右側':'左側'};
}
