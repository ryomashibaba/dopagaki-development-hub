/**
 * P93 / VOID BREAKER architectural silhouettes (visuals only).
 * Seven chapters each receive unique dimensional cliff fins, tiered steel
 * crowns, floating blades and under-road suspension supports.
 * Samples the real P93 track geometry; none of these triangles are given
 * to compile(), collisions, or the B48 Runner.
 */
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const mul=(a,k)=>a.map(x=>x*k);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>mul(a,1/(Math.hypot(...a)||1));
const tri=(v,a,b,c,color)=>v.push(...a,...color,...b,...color,...c,...color);
function beam(out,a,b,width,height,color){
 const d=sub(b,a);if(Math.hypot(...d)<.05)return;
 const axis=norm(d);
 const across=norm(cross(axis,Math.abs(axis[1])>.94?[0,0,1]:[0,1,0]));
 const up=norm(cross(across,axis));
 const p=(o,lr,v)=>add(add(o,mul(across,lr*width/2)),mul(up,v*height/2));
 const A=[p(a,-1,-1),p(a,1,-1),p(a,1,1),p(a,-1,1)];
 const B=[p(b,-1,-1),p(b,1,-1),p(b,1,1),p(b,-1,1)];
 for(const [i,j,k,l] of [[0,1,2,3],[4,7,6,5],[0,4,5,1],[3,2,6,7],[0,3,7,4],[1,5,6,2]]){
  const corners=[...A,...B];const x=i<4?A[i]:B[i-4],y=j<4?A[j]:B[j-4],z=k<4?A[k]:B[k-4],w=l<4?A[l]:B[l-4];
  tri(out,x,y,z,color);tri(out,x,z,w,color);
 }
}
const CHAPTERS=[
 {main:[.18,.37,.74],light:[.55,.96,1],tower:155},
 {main:[.39,.16,.72],light:[.99,.42,.96],tower:185},
 {main:[.16,.51,.66],light:[.48,1,.82],tower:160},
 {main:[.51,.26,.22],light:[1,.62,.22],tower:180},
 {main:[.18,.24,.50],light:[.56,.63,1],tower:195},
 {main:[.36,.16,.62],light:[.96,.65,1],tower:170},
 {main:[.10,.39,.50],light:[.42,1,.96],tower:160}
];
export function voidBreakerGeometry(stage,sample){
 if(!['VB-P93','VB-P95','VB-P99','VB-P100','VB-P101'].includes(stage?.stageForge?.id))return {vertices:[],beams:0,sections:[]};
 if(typeof sample!=='function')throw Error('P93 requires exact B48 read-only sampler');
 const roads=stage.surfaces.filter(s=>s.rideable&&s.collidable);
 if(roads.length!==7||!roads.every(s=>s.id.startsWith('p93-')))throw Error('P93 visual requires 7 authentic physical road skins');
 const vertices=[],sections=[];
 const p100=['VB-P100','VB-P101'].includes(stage.stageForge.id);
 // P100 actual Chromium sightline audit: opening real curves while keeping
 // the proven P98/P99 monumental skyline unaffected.
 const portalCount=p100?4:6,exteriorStandOff=p100?56:26;
 for(let n=0;n<roads.length;n++){
  const s=roads[n],palette=CHAPTERS[n],before=vertices.length;
  // Giant superstructures separate each distinctly authored bend/drop.
  for(let j=0;j<portalCount;j++){
   const t=(j+.5)/portalCount;
   const c=sample(s,t,.5),leftEdge=sample(s,t,0),rightEdge=sample(s,t,1);
   // Visual QA P98: old towers stood nearly ON the physical B48 road edge
   // every ~40–85m, filling the driver's horizon with false collision walls.
   // Keep monumental exterior towers, but at least 26m OUTSIDE each real edge.
   // This is GPU geometry only and never changes the 7 native road skins.
   const a=add(leftEdge,mul(norm(sub(leftEdge,c)),exteriorStandOff));
   const b=add(rightEdge,mul(norm(sub(rightEdge,c)),exteriorStandOff));
   const height=palette.tower+(j%3)*23;
   const footing=34+(n%3)*12;
   const leftBase=add(a,[0,-footing,0]),rightBase=add(b,[0,-footing,0]);
   const leftTop=add(a,[0,height,0]),rightTop=add(b,[0,height,0]);
   beam(vertices,leftBase,leftTop,p100?7:8+(n%2)*4,9,palette.main);
   beam(vertices,rightBase,rightTop,p100?7:8+(j%2)*3,9,palette.main);
   // Sharp cantilever roof over the track: real tunnel-like skyline without collision.
   const peak=mul(add(leftTop,rightTop),.5);
   const crown=add(peak,[0,45+(j%3)*13,0]);
   beam(vertices,leftTop,crown,9,11,palette.main);
   beam(vertices,crown,rightTop,9,11,palette.main);
   if(j%2===0){
    beam(vertices,add(leftTop,[0,-21,0]),add(rightTop,[0,-21,0]),3.5,4,palette.light);
    beam(vertices,crown,add(crown,[0,35,0]),5,5,palette.light);
   }
   // Suspended ribs beneath the REAL road, never a driveable underside.
   if(j%3===0){
    beam(vertices,add(a,[0,-14,0]),add(a,[0,-105-(j%2)*35,0]),7,9,palette.main);
    beam(vertices,add(b,[0,-14,0]),add(b,[0,-105-(j%2)*35,0]),7,9,palette.main);
   }
   // Alternating huge exterior blades emphasize high speed and directional rhythm.
   if(j%2===1&&(!p100||j===portalCount-1)){
    const blade=add(a,[0,35,0]),tip=add(a,[-28,145+(j%3)*30,22]);
    beam(vertices,blade,tip,11,12,palette.light);
   }
  }
  sections.push({name:s.id,triangles:(vertices.length-before)/18,
   exteriorClearanceMeters:exteriorStandOff,portalCount});
 }
 if(vertices.length>500000||vertices.some(v=>!Number.isFinite(v)))throw Error('P93 visual GPU budget or coordinate validation failed');
 return {vertices,beams:Math.round(vertices.length/216),sections,
  visualReadability:p100?'P100_FOUR_WIDE_SETBACK_PORTALS_PER_CHAPTER':'P98_SIX_EXTERIOR_GATES_PER_CHAPTER_WITH_OFFROAD_COLUMNS'};
}
