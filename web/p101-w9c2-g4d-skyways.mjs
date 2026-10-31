/**
 * W9-C2 G4D / OUTBOARD SKYWAYS — isolated monumental 1.8km VISUAL STUDY.
 * A deliberately disconnected, non-rideable, non-collidable skyline made
 * from the true W7F Gold section-IV geometry. Not a secretly safe road.
 * OFF by default; gated to exact W7F Gold recordStageId and #g4d=on.
 */
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const mul=(a,k)=>a.map(x=>x*k);
const norm=a=>mul(a,1/(Math.hypot(...a)||1));
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const dot=(a,b)=>a.reduce((x,v,i)=>x+v*b[i],0);
const tri=(out,a,b,c,color)=>out.push(...a,...color,...b,...color,...c,...color);
const quad=(out,a,b,c,d,color)=>{tri(out,a,b,c,color);tri(out,a,c,d,color);};
const BLUE=[.12,.31,.43],FACE=[.18,.42,.52],EDGE=[.18,.95,.98],
 GOLD=[.97,.57,.25],DEEP=[.08,.19,.31];
export const G4D_VISUAL_POLICY=Object.freeze({
 defaultEnabled:false,stageId:'VB-P101-A13-W7F',section:3,
 physicalRoadUntouched:true,rideable:false,collidable:false,
 minimumHorizontalEdgeClearanceMeters:56,maxVertexFloats:145000
});
function beam(out,a,b,halfWidth,halfDepth,color){
 const dir=norm(sub(b,a)),across=norm(cross(dir,Math.abs(dir[1])>.9?[1,0,0]:[0,1,0]));
 const up=norm(cross(across,dir));
 const at=(p,x,y)=>add(p,add(mul(across,x*halfWidth),mul(up,y*halfDepth)));
 const p=[at(a,-1,-1),at(a,1,-1),at(a,1,1),at(a,-1,1),
  at(b,-1,-1),at(b,1,-1),at(b,1,1),at(b,-1,1)];
 for(const [i,j,k,l] of [[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]])
  quad(out,p[i],p[j],p[k],p[l],color);
}
function roadFrame(s,u,side,sample){
 const c=sample(s,u,.5),e=sample(s,u,side<0?0:1);
 const before=sample(s,Math.max(0,u-.003),.5),after=sample(s,Math.min(1,u+.003),.5);
 const forward=norm([after[0]-before[0],0,after[2]-before[2]]);
 let outward=norm([e[0]-c[0],0,e[2]-c[2]]);
 outward=norm(sub(outward,mul(forward,dot(forward,outward))));
 if(dot(outward,sub(e,c))<0)outward=mul(outward,-1);
 return {edge:e,forward,outward};
}
function skyPoint(f,distance,height){
 return add(add(f.edge,mul(f.outward,distance)),[0,height,0]);
}
function bridgeSlab(out,f0,f1,edgeDistance,width,raise){
 const at=(f,d,y)=>skyPoint(f,d,y);
 const near=edgeDistance,far=edgeDistance+width;
 const a=at(f0,near,raise),b=at(f0,far,raise),
  c=at(f1,far,raise),d=at(f1,near,raise);
 const under=p=>add(p,[0,-3.8,0]);
 quad(out,a,b,c,d,FACE);
 quad(out,under(d),under(c),under(b),under(a),DEEP);
 quad(out,a,d,under(d),under(a),BLUE);
 quad(out,b,under(b),under(c),c,BLUE);
 // High-contrast edge guides, narrow enough not to create an opaque wall.
 beam(out,add(a,[0,1.5,0]),add(d,[0,1.5,0]),.48,.55,EDGE);
 beam(out,add(b,[0,1.3,0]),add(c,[0,1.3,0]),.48,.55,GOLD);
}
export function g4dOutboardSkyways(stage,sample,{enabled=false}={}){
 const off={active:false,vertices:[],slabs:0,voidGaps:0,landmarks:0,
  edgeClearanceMeters:null,nonCollision:true,reason:'OFF_OR_UNRELATED'};
 if(!enabled||stage?.stageForge?.recordStageId!==G4D_VISUAL_POLICY.stageId)return off;
 if(stage.stageForge.variant!=='A13_GAMEPLAY_ISOLATED'||
   stage.surfaces?.length!==7||stage.movingObstacles?.length!==28||
   typeof sample!=='function'||stage.surfaces[3].rows!==31||
   stage.surfaces[3].cols!==5||!stage.surfaces[3].collidable||
   !stage.surfaces[3].rideable)throw Error('G4D requires intact W7F Gold true B48 geometry');
 const source=JSON.stringify(stage),road=stage.surfaces[3],vertices=[];
 let slabs=0,voidGaps=0,landmarks=0;
 // Three large, spatially separated suspended skyways, with REAL visual gaps.
 // Their lateral offset starts >= 66m outside Gold's physical edge.
 for(const [branch,side,distance,width,height,from,to] of [
  [0,-1,74,19,73,.10,.88],
  [1,1,86,24,116,.17,.84],
  [2,-1,129,17,156,.29,.78]
 ]){
  const count=branch===2?30:46;
  for(let i=0;i<count;i++){
   // Two widely separated missing spans in each branch. No invisible floor.
   const gap=branch===0?(i>=15&&i<=18||i>=33&&i<=36):
    branch===1?(i>=9&&i<=12||i>=29&&i<=32):
    (i>=8&&i<=10||i>=20&&i<=22);
   if(gap){voidGaps++;continue;}
   const u0=from+(to-from)*i/count,u1=from+(to-from)*(i+1)/count;
   const f0=roadFrame(road,u0,side,sample),f1=roadFrame(road,u1,side,sample);
   const elev=u=>height+Math.sin(Math.PI*(u-from)/(to-from))**2*(branch===2?23:11);
   bridgeSlab(vertices,f0,f1,distance,width,(elev(u0)+elev(u1))/2);
   slabs++;
  }
 }
 // Four unique megastructure landmarks: large asymmetric V-shaped cantilever
 // silhouettes outside the actual driving road, never across the track.
 for(const [index,u,side] of [[0,.21,1],[1,.40,-1],[2,.62,1],[3,.81,-1]]){
  const f=roadFrame(road,u,side,sample),root=skyPoint(f,95,0);
  const tip=add(skyPoint(f,132,230+index*31),mul(f.forward,(index%2?1:-1)*(43+index*13)));
  const heel=add(root,mul(f.forward,72+index*9));
  beam(vertices,root,tip,8+index,11,BLUE);
  beam(vertices,heel,tip,5.5,8,FACE);
  beam(vertices,add(tip,[0,-25,0]),add(tip,[0,36,0]),1.1,1.4,EDGE);
  const crown=add(tip,add(mul(f.outward,31),[0,-46,0]));
  beam(vertices,tip,crown,3.5,5,GOLD);
  landmarks++;
 }
 if(vertices.length>G4D_VISUAL_POLICY.maxVertexFloats||
   vertices.length%18!==0||!vertices.every(Number.isFinite))
  throw Error('G4D nonfinite/excessive GPU-only geometry');
 if(JSON.stringify(stage)!==source)throw Error('G4D may not mutate native physical stage');
 return {active:true,vertices,slabs,voidGaps,landmarks,
  edgeClearanceMeters:74,nonCollision:true,
  reason:'OFFLINE W7F GOLD 1800M OUTBOARD SKYWAYS — HUMAN VISUAL HOLD'};
}
