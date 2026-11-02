/**
 * R15S3D14R1: after REAL game 24 images showing three beautiful hollow
 * crescents but empty black 'city', construct actual populated multi-level
 * INHABITED DISTRICTS around the existing private crescent landmarks.
 * Keep genuine 3 native landmark structures as the strong focal spine;
 * build large layered public places, sky gardens, transparent (truly absent)
 * courtyards, sub-level commons, structural sheltered backlands.
 *
 * Public/collision source B48/ B51/ Runner/ camera unchanged, no ghost floors.
 */
import {buildR15S3D14City} from './p101-r15s3d14-monumental-inhabited-hollow-crescents.mjs';
export const DESIGNS=Object.freeze(['A_INHABITED_CRESCENT_DISTRICTS','B_DEEP_CIVIC_TERRACES']);
const C={marble:[.86,.91,.92],night:[.095,.18,.25],slate:[.20,.34,.44],
 teal:[.24,.68,.75],glass:[.40,.86,.83],garden:[.41,.66,.51],
 warm:[.98,.71,.43],white:[.89,.86,.72],blue:[.31,.51,.66]};
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),
 mul=(a,t)=>a.map(v=>v*t),len=a=>Math.hypot(...a),
 unit=a=>mul(a,1/(len(a)||1)),
 dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
function tri(v,a,b,c,color){for(const p of [a,b,c])v.push(...p,...color);}
function face(v,a,b,c,d,color){
 tri(v,a,b,c,color);tri(v,a,c,d,color);
 tri(v,d,c,b,C.night);tri(v,d,b,a,C.night);
}
function frame(doc,sample,road,u,side){
 const src=doc.surfaces[road],edge=sample(src,u,side<0?0:1),mid=sample(src,u,.5);
 const a=sample(src,Math.max(0,u-.003),.5),b=sample(src,Math.min(1,u+.003),.5);
 const along=unit([b[0]-a[0],0,b[2]-a[2]]);
 const sideRaw=[edge[0]-mid[0],0,edge[2]-mid[2]];
 const across=unit(sub(sideRaw,mul(along,dot(sideRaw,along))));
 if(len(sideRaw)<6||len(across)<.9)throw Error('Original B48 real geometry inadequate');
 return {edge,across,along};
}
function p(f,depth,along,height){
 return add(add(add(f.edge,mul(f.across,depth)),mul(f.along,along)),[0,height,0]);
}
function deck(v,f,depthA,depthB,alongA,alongB,h,scheme,stats,idx){
 const step=16,top=[],bottom=[];
 // This is one curved, deliberately NON-RECTANGULAR inhabited terrace;
 // the punched-out bays are real absence of geometry, not black textures.
 for(let j=0;j<=step;j++){
  const t=j/step,along=alongA+(alongB-alongA)*t,
   rise=8*Math.sin(2*Math.PI*t+idx*.8),
   front=depthA+9*Math.sin(t*Math.PI*2+idx),
   back=depthB+14*Math.sin(t*Math.PI*1.6+idx*.21);
  top.push([p(f,front,along,h+rise),p(f,back,along,h+rise+4)]);
  bottom.push([p(f,front,along,h+rise-12),p(f,back,along,h+rise-18)]);
 }
 for(let j=0;j<step;j++){
  const u=j/step;
  const missing=(j+3*idx)%13===5||(j+3*idx)%13===6;
  if(missing||(scheme===DESIGNS[1]&&j%7===2)){stats.trueAirCourtyards++;continue;}
  const a=top[j],b=top[j+1],c=bottom[j],d=bottom[j+1];
  face(v,a[0],b[0],b[1],a[1],h>80?C.garden:h<0?C.slate:C.marble);
  face(v,c[1],d[1],b[1],a[1],C.blue);
  stats.habitableDeckSurfaceCells++;
  if(j%3===0){
   // Three-dimensional inhabited parapet/walkway silhouette. NEVER copy
   // the old longitudinal road wall all the way along the two source roads.
   const lift1=add(a[1],[0,13+idx%3*4,0]),lift2=add(b[1],[0,13+idx%3*4,0]);
   face(v,a[1],b[1],lift2,lift1,j%2?C.white:C.teal);
   stats.habitableParapetCells++;
  }
  if(j%4===0){
   const upperA=add(a[0],[0,3,0]),upperB=add(b[0],[0,3,0]);
   face(v,a[0],b[0],upperB,upperA,C.warm);stats.luminousCivicBoundaries++;
  }
 }
 stats.realPublicTerraceLevels++;
}
function district(v,doc,sample,site,scheme,stats,i){
 const f=frame(doc,sample,site.road,site.u,site.side);
 const sideBias=scheme===DESIGNS[1]?1.35:1;
 const l0=i===0?-190:i===1?-140:-205,l1=i===0?210:i===1?145:215;
 // NOTE: all decks are outboard >180m beyond existing shoulder. These
 // built public platforms are ART only; original rideable B48 remains 7.
 for(let lev=0;lev<5;lev++){
  const depthA=185*sideBias+lev*14+site.bias,
    depthB=depthA+(scheme===DESIGNS[1]?138:175),
    h=-90+lev*55+i*15;
  deck(v,f,depthA,depthB,l0+lev*11,l1-lev*9,h,scheme,stats,lev+i*7);
 }
 // Open amphitheatre occupied skyline: alternating curved inhabited
 // 'petals' around the moon, not a repeated station or box tower row.
 for(let k=0;k<6;k++){
  const aa=2*Math.PI*k/6+.3*i,bb=aa+.67;
  const rad=120+(scheme===DESIGNS[1]?48:15);
  const home=site.anchor+25,up=65+site.height*.38;
  const a=p(f,home+rad*Math.cos(aa),rad*.82*Math.sin(aa),up+k*9);
  const b=p(f,home+rad*Math.cos(bb),rad*.82*Math.sin(bb),up+(k+1)*9);
  const c=p(f,home+(rad+46)*Math.cos(bb),rad*.9*Math.sin(bb)+13,up+(k+1)*9+17);
  const d=p(f,home+(rad+46)*Math.cos(aa),rad*.9*Math.sin(aa)+13,up+k*9+17);
  face(v,a,b,c,d,k%2?C.glass:C.marble);stats.suspendedNeighborhoodShells++;
 }
 // Large negative plazas with distinct 3D civic 'hanging boulevards'.
 for(let k=0;k<5;k++){
  const left=p(f,site.anchor+40+k*19,(k-2)*44,-90+k*15);
  const right=p(f,site.anchor+135+k*14,(k-2)*44+38,-90+k*15);
  const deep=add(left,[0,-25,0]),deep2=add(right,[0,-25,0]);
  face(v,left,right,deep2,deep,C.blue);stats.underCityStructuralBridges++;
 }
}
export function buildR15S3D14R1City(doc,sample,{mode='A_INHABITED_CRESCENT_DISTRICTS'}={}){
 if(!DESIGNS.includes(mode))throw Error('unsupported inhabited-city candidate');
 if(doc?.surfaces?.length!==7||doc?.movingObstacles?.length!==28||
  doc.stageForge?.r15s3d11?.mode!=='A_EDGE_READABLE'||
  doc.stageForge.productionPromoted!==false)throw Error('protected real native gameplay source mismatch');
 const unchanged=JSON.stringify(doc);
 const base=buildR15S3D14City(doc,sample,{mode:'A_TIDAL_CRESCENT_CITADEL'});
 const extra=[],stats={
  mode,realCrescentStructures:3,
  roadSections:[5,6],realPublicTerraceLevels:0,
  habitableDeckSurfaceCells:0,habitableParapetCells:0,luminousCivicBoundaries:0,
  suspendedNeighborhoodShells:0,underCityStructuralBridges:0,trueAirCourtyards:0,
  originalSourceWebGL2:1,
  originalRealB48:7,originalMovingB51:28,addedPhysicalCollisionObjects:0,
  noRepetitiveR1RoadsideWalls:true,cityHinterlandOutboardFromRoadM:185
 };
 const sites=[
  {road:5,u:.43,side:-1,anchor:326,height:216,bias:0},
  {road:5,u:.81,side:1,anchor:230,height:144,bias:35},
  {road:6,u:.44,side:-1,anchor:337,height:244,bias:20}
 ];
 for(let i=0;i<sites.length;i++)district(extra,doc,sample,sites[i],mode,stats,i);
 const vertices=[...base.vertices,...extra],triangles=vertices.length/18;
 if(!Number.isInteger(triangles)||triangles<base.triangles+1500||triangles>60000)
  throw Error('material new TRUE inhabited 3D geometry not generated');
 if(!vertices.every(Number.isFinite)||stats.realPublicTerraceLevels!==15||
    stats.suspendedNeighborhoodShells!==18||stats.trueAirCourtyards<15)
  throw Error('broken or overclaimed real urban living geometry');
 if(JSON.stringify(doc)!==unchanged)throw Error('ART mutated source native gameplay');
 return {vertices,triangles,...stats,referenceCrescentTriangleCount:base.triangles,
  originalNativeRunnerFinishedBeforeArt:true,realBrowserStillRequiresVerification:true,
  officialArtAccepted:0,officialSlope2Certified:0,ART:'HOLD',
  GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',RELEASE:'HOLD'};
}
