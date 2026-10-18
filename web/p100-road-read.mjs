/**
 * P100 / ROAD READ: render-only lane geometry sampled from the actual
 * collidable B48 skin. No guiding "safe" lane, steering, or collision data.
 * Keeps banked curves readable at 100+ m/s without fake roads or barriers.
 */
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const mul=(a,k)=>a.map(x=>x*k);
const colorSets=[
 {edge:[.34,.95,1],stitch:[.39,.70,.98]},
 {edge:[.91,.60,1],stitch:[.64,.75,1]},
 {edge:[.51,1,.87],stitch:[.27,.70,.73]},
 {edge:[1,.70,.47],stitch:[.75,.54,.36]}
];
function append(v,a,b,c,d,color){
 for(const p of [a,b,c,a,c,d])v.push(...p,...color);
}
function lifted(surface,u,v,sample,frame){
 const p=sample(surface,u,v),normal=frame(surface,u,v).normal;
 const sign=normal[1]<0?-1:1;
 return add(p,mul(normal,.2*sign));
}
export function p100RoadReadGeometry(stage,sample,frame){
 if(stage?.stageForge?.id!=='VB-P100')return {vertices:[],stripes:0,flowBars:0};
 if(typeof sample!=='function'||typeof frame!=='function')throw Error('P100 visual requires exact B48 skin sampler');
 if(stage.surfaces?.length!==7)throw Error('P100 requires seven real road surfaces');
 const vertices=[];let stripes=0,flowBars=0;
 for(const [section,s] of stage.surfaces.entries()){
  if(!s.rideable||!s.collidable)throw Error('P100 road read must be bound to real collidable roads');
  const palette=colorSets[section%colorSets.length];
  // Parallel optical rails expose actual lateral extent and S-bend direction.
  for(const [a,b] of [[.045,.063],[.937,.955],[.225,.235],[.765,.775]]){
   for(let i=0;i<52;i++){
    const u0=i/52,u1=(i+1)/52;
    append(vertices,lifted(s,u0,a,sample,frame),lifted(s,u1,a,sample,frame),
     lifted(s,u1,b,sample,frame),lifted(s,u0,b,sample,frame),palette.edge);
    stripes++;
   }
  }
  // Short staggered tread marks indicate forward perspective, not a safe centerline.
  for(let i=1;i<=19;i++){
   const u=i/20,delta=.0035;
   for(const [a,b] of [[.31,.38],[.62,.69]]){
    append(vertices,lifted(s,u-delta,a,sample,frame),lifted(s,u+delta,a,sample,frame),
     lifted(s,u+delta,b,sample,frame),lifted(s,u-delta,b,sample,frame),palette.stitch);
    flowBars++;
   }
  }
 }
 if(vertices.length>115000||!vertices.every(Number.isFinite))throw Error('P100 road read GPU budget/geometry invalid');
 return {vertices,stripes,flowBars};
}
