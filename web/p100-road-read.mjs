/**
 * P100 / ROAD READ: render-only lane geometry sampled from the actual
 * collidable B48 skin. No guiding "safe" lane, steering, or collision data.
 * Keeps banked curves readable at 100+ m/s without fake roads or barriers.
 */
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const mul=(a,k)=>a.map(x=>x*k);
const colorSets=[
 {edge:[.34,.95,1],stitch:[.20,.53,.74]},
 {edge:[.91,.60,1],stitch:[.39,.47,.73]},
 {edge:[.51,1,.87],stitch:[.19,.48,.50]},
 {edge:[1,.70,.47],stitch:[.51,.38,.25]}
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
 if(!['VB-P100','VB-P101'].includes(stage?.stageForge?.id))return {vertices:[],stripes:0,flowBars:0};
 if(typeof sample!=='function'||typeof frame!=='function')throw Error('P100 visual requires exact B48 skin sampler');
 if(stage.surfaces?.length!==7)throw Error('P100 requires seven real road surfaces');
 const vertices=[];let stripes=0,flowBars=0;
 const clear=(section,u0,u1)=>{
  const gap=section===0?stage.stageForge?.g4e7qStudy?.gap:null;
  return !gap||u1<gap.uTakeoff-.003||u0>gap.uLanding+.003;
 };
 for(const [section,s] of stage.surfaces.entries()){
  if(!s.rideable||!s.collidable)throw Error('P100 road read must be bound to real collidable roads');
  const palette=colorSets[section%colorSets.length];
  // Parallel optical rails expose actual lateral extent and S-bend direction.
  for(const [a,b] of [[.045,.063],[.937,.955],[.225,.235],[.765,.775]]){
   for(let i=0;i<52;i++){
    const u0=i/52,u1=(i+1)/52;
    if(!clear(section,u0,u1))continue;
    append(vertices,lifted(s,u0,a,sample,frame),lifted(s,u1,a,sample,frame),
     lifted(s,u1,b,sample,frame),lifted(s,u0,b,sample,frame),palette.edge);
    stripes++;
   }
  }
  // Thin recessed optic ticks indicate perspective, never solid pads/boosters or a safe centerline.
  for(let i=1;i<=19;i++){
   const u=i/20,delta=.001;
   if(!clear(section,u-delta,u+delta))continue;
   for(const [a,b] of [[.315,.33],[.67,.685]]){
    append(vertices,lifted(s,u-delta,a,sample,frame),lifted(s,u+delta,a,sample,frame),
     lifted(s,u+delta,b,sample,frame),lifted(s,u-delta,b,sample,frame),palette.stitch);
    flowBars++;
   }
  }
 }
 if(vertices.length>115000||!vertices.every(Number.isFinite))throw Error('P100 road read GPU budget/geometry invalid');
 return {vertices,stripes,flowBars};
}
