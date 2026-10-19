/**
 * W9-C1 G5-B: opt-in monumental outer-skyline candidate (DRAFT/HOLD).
 * Visual-only and read-only: no hidden driving surface, CCD, steering, camera
 * or obstacle alterations. The default browser state leaves it completely OFF.
 * Stations derive from the genuine B48 road edge rather than an invented path.
 */
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const mul=(a,n)=>a.map(v=>v*n);
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const normHorizontal=v=>{
 const d=Math.hypot(v[0],v[2]);
 if(d<1e-6)throw Error('G5-B cannot establish a horizontal road frame');
 return [v[0]/d,0,v[2]/d];
};
const VISUAL_STAGE_IDS=new Set(['VB-P101-A13-W9C1-CONTROL','VB-P101-A13-W9C1-ULTRA']);
export const G5B_PARAMETERS=Object.freeze({
 enabledByDefault:false,
 minimumClearanceFromPhysicalEdgeMeters:38,
 candidateOnly:true,
 maxVertexFloats:240000
});
const PALETTE=Object.freeze([
 Object.freeze({mass:[.085,.205,.285],face:[.135,.315,.415],glow:[.37,.82,.95]}),
 Object.freeze({mass:[.11,.19,.34],face:[.175,.275,.48],glow:[.42,.85,1]}),
 Object.freeze({mass:[.095,.275,.315],face:[.165,.38,.42],glow:[.42,.98,.87]}),
 Object.freeze({mass:[.135,.205,.29],face:[.23,.34,.44],glow:[.64,.94,1]})
]);
const shade=(c,f)=>c.map(x=>Math.min(1,x*f));
function triangle(vertices,a,b,c,color){
 vertices.push(...a,...color,...b,...color,...c,...color);
}
function solid(vertices,center,forward,outward,length,width,height,color){
 if(![...center,...forward,...outward,length,width,height,...color].every(Number.isFinite))
  throw Error('G5-B nonfinite geometry');
 const corner=(a,b,c)=>add(center,add(add(mul(forward,a*length/2),mul(outward,b*width/2)),[0,c*height/2,0]));
 const p=[
  corner(-1,-1,-1),corner(-1,-1,1),corner(-1,1,-1),corner(-1,1,1),
  corner(1,-1,-1),corner(1,-1,1),corner(1,1,-1),corner(1,1,1)
 ];
 for(const [a,b,c,d,factor] of [
  [0,4,6,2,.72],[1,3,7,5,1.17],[0,1,5,4,.86],
  [2,6,7,3,.97],[0,2,3,1,.7],[4,5,7,6,1.05]
 ]){const tint=shade(color,factor);triangle(vertices,p[a],p[b],p[c],tint);triangle(vertices,p[a],p[c],p[d],tint);}
}
function stationFrame(road,u,side,sample){
 const center=sample(road,u,.5),edge=sample(road,u,side===-1?0:1);
 const back=sample(road,Math.max(0,u-.004),.5);
 const ahead=sample(road,Math.min(1,u+.004),.5);
 const forward=normHorizontal(sub(ahead,back));
 let lateral=normHorizontal(sub(edge,center));
 lateral=normHorizontal(sub(lateral,mul(forward,dot(lateral,forward))));
 // The orthonormal lateral basis points OUTWARD from the actual road edge.
 if(dot(lateral,sub(edge,center))<0)lateral=mul(lateral,-1);
 return {center,edge,forward,outward:lateral};
}
function outboard(frame,clearance,width,forwardShift=0,height=0){
 return add(add(frame.edge,mul(frame.outward,clearance+width/2)),
  add(mul(frame.forward,forwardShift),[0,height,0]));
}
export function w9c1G5BSkyline(stage,sample,{enabled=false}={}){
 const empty={vertices:[],stations:0,masses:0,luminousPanels:0,
  nonCollision:true,minimumEdgeClearanceMeters:null,active:false,reason:'HOLD'};
 if(!enabled||!VISUAL_STAGE_IDS.has(stage?.stageForge?.recordStageId))return empty;
 if(stage?.stageForge?.variant!=='A13_GAMEPLAY_ISOLATED'||
    stage?.surfaces?.length!==7||stage?.movingObstacles?.length!==28||
    typeof sample!=='function'||
    stage.surfaces.some(s=>!s.rideable||!s.collidable||s.rows!==31||s.cols!==5))
  throw Error('G5-B requires intact W9-C1 genuine 7-road/28-machine isolation');
 const vertices=[];let stations=0,masses=0,luminousPanels=0,minClearance=Infinity;
 for(let chapter=0;chapter<7;chapter++){
  const road=stage.surfaces[chapter];
  // Uneven spacing deliberately avoids a repetitive corridor of small poles.
  const marks=chapter===0?[.11,.23,.37,.55,.72,.87]:[.16,.39,.62,.85];
  const palette=PALETTE[chapter%PALETTE.length];
  for(let j=0;j<marks.length;j++){
   for(const side of [-1,1]){
    if(chapter!==0&&j%4===3&&side===1)continue; // asymmetric skyline
    const f=stationFrame(road,marks[j],side,sample);
    const phase=(chapter*7+j*3+(side===1?2:0))%5;
    const clearance=38+phase*6;
    const width=25+(phase%3)*6;
    const height=102+phase*26+((chapter+j)%3)*14;
    const along=75+phase*16;
    const base=outboard(f,clearance,width,0,height/2-26);
    minClearance=Math.min(minClearance,clearance);
    // Very large separated hanging cliff / terrestrial foundation.
    solid(vertices,base,f.forward,f.outward,along,width,height,palette.mass);masses++;
    const lower=outboard(f,clearance+7,width*.75,-along*.16,-66);
    solid(vertices,lower,f.forward,f.outward,along*.66,width*.75,106+phase*14,palette.face);masses++;
    // Floating roof mass: visibly DETACHED from the cliff below.
    const capWidth=width+16,capClearance=clearance+10;
    solid(vertices,outboard(f,capClearance,capWidth,along*.26,height+37),
     f.forward,f.outward,along*1.2,capWidth,20+phase*3,palette.face);masses++;
    // Tall ascending wing – not a bridge across the actual driving lane.
    const wingWidth=width*.72;
    solid(vertices,outboard(f,clearance+23,wingWidth,-along*.38,height*.77),
     f.forward,f.outward,along*.42,wingWidth,height*.73,palette.mass);masses++;
    // Precise thin outboard light seam: never marks a fake road.
    const lightWidth=.9,lightClearance=clearance+.1;
    solid(vertices,outboard(f,lightClearance,lightWidth,-along*.28,height*.58),
     f.forward,f.outward,along*.45,lightWidth,1.9,palette.glow);luminousPanels++;
    // Elevated vertical luminous fin, independent of the obstacle palette.
    solid(vertices,outboard(f,clearance+3,1.3,along*.23,height+52),
     f.forward,f.outward,1.3,1.3,54+phase*14,palette.glow);luminousPanels++;
    stations++;
   }
  }
 }
 if(vertices.length>G5B_PARAMETERS.maxVertexFloats||
    vertices.length%18!==0||!vertices.every(Number.isFinite))
  throw Error('G5-B exceeded finite GPU geometry budget');
 return {vertices,stations,masses,luminousPanels,nonCollision:true,
  minimumEdgeClearanceMeters:minClearance,active:true,
  reason:'W9-C1 ONLY / G5-B VISUAL CANDIDATE / HUMAN APPROVAL HOLD'};
}
