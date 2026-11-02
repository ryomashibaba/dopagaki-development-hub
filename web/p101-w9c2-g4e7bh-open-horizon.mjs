/**
 * G4E-7BH — OPEN HORIZON / SILT-LIGHT CITADELS.
 * Alternative to BF's rejected dark architectural curtain.
 *
 * Physical world: EXACT BC rollDeck 7 B48 surfaces, 28 B51 machines and gap52.
 * Visual world: 4 genuinely separated three-dimensional outboard structures:
 * open skeletal soaring crowns + connective inhabited overhangs. No
 * collision, no stage patches, no steering, no invisible support.
 *
 * Keep the REAL sky empty between structural members: do NOT triangulate
 * a whole valley-length facade and punch a few cosmetic windows in it.
 */
export const BH_ANCHORS=Object.freeze([
 Object.freeze({id:'RIDGE-CROWN',road:0,u:.73,side:1,offset:165,height:460,spread:190,tilt:-86,petals:4}),
 Object.freeze({id:'FORKED-HORIZON',road:1,u:.31,side:-1,offset:185,height:610,spread:225,tilt:104,petals:5}),
 Object.freeze({id:'DELTA-SANCTUM',road:1,u:.57,side:1,offset:210,height:730,spread:290,tilt:-125,petals:6}),
 Object.freeze({id:'SPLIT-HELIOS',road:1,u:.81,side:-1,offset:175,height:890,spread:320,tilt:185,petals:5})
]);
const P=Object.freeze({
 pearl:[.74,.91,.94],arc:[.20,.94,.95],blue:[.17,.59,.74],
 lavender:[.64,.52,.91],warm:[1,.64,.27],
 steel:[.21,.45,.53],under:[.070,.17,.22],spark:[.89,.98,1]
});
const plus=(a,b)=>a.map((x,i)=>x+b[i]);
const minus=(a,b)=>a.map((x,i)=>x-b[i]);
const mul=(a,s)=>a.map(x=>x*s);
const length=v=>Math.hypot(...v);
const norm=v=>mul(v,1/(length(v)||1));
const lerp=(a,b,t)=>plus(mul(a,1-t),mul(b,t));
const dot=(a,b)=>a.reduce((acc,x,i)=>acc+x*b[i],0);
const cross=(a,b)=>[
 a[1]*b[2]-a[2]*b[1],
 a[2]*b[0]-a[0]*b[2],
 a[0]*b[1]-a[1]*b[0]
];
const tri=(buffer,a,b,c,color)=>{for(const v of [a,b,c])buffer.push(...v,...color);};
const quad=(buffer,a,b,c,d,color)=>{
 tri(buffer,a,b,c,color);tri(buffer,a,c,d,color);
};
function plank(buffer,a,b,c,d,top,back=P.under){
 quad(buffer,a,b,c,d,top);
 quad(buffer,d,c,b,a,back);
}
function beam(buffer,a,b,width,depth,color){
 const forward=norm(minus(b,a));
 // Real 3D beam volume, not a view-facing black quad.
 const reference=Math.abs(dot(forward,[0,1,0]))>.9?[0,0,1]:[0,1,0];
 const side=norm(cross(forward,reference)),up=norm(cross(forward,side));
 const w=mul(side,width/2),h=mul(up,depth/2);
 const ring=p=>[
  plus(plus(p,w),h),plus(minus(p,w),h),
  minus(minus(p,w),h),plus(minus(p,h),w)
 ];
 const x=ring(a),y=ring(b);
 for(const [i,j,k,l] of [[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]]){
  const all=[...x,...y];quad(buffer,all[i],all[j],all[k],all[l],color);
 }
}
function frame(s,sample,u,side){
 const center=sample(s,u,.5),edge=sample(s,u,side<0?0:1),
  lo=sample(s,Math.max(0,u-.0035),.5),hi=sample(s,Math.min(1,u+.0035),.5),
  f=norm([hi[0]-lo[0],0,hi[2]-lo[2]]),
  d=minus(edge,center),flat=[d[0],0,d[2]],
  out=norm(minus(flat,mul(f,dot(flat,f))));
 if(dot(out,flat)<3||length(f)<.9)throw Error('BH requires nondegenerate real BC B48 outboard frame');
 return {edge,out,f};
}
const place=(f,along,depth,up)=>plus(plus(plus(f.edge,mul(f.f,along)),mul(f.out,depth)),[0,up,0]);
const none=()=>({
 active:false,vertices:[],triangles:0,monuments:0,openPortalSpans:0,
 separateFloatingQuarters:0,linkedUrbanTerraces:0,lightRibs:0,
 maximumRiseM:0,nominalShoulderClearanceM:null,continuousFacadeSegments:0,
 forcedLaneCover:0,newPhysicalRoads:0,newHazards:0,
 physicsUnchanged:true,certifiedSlope2Meters:0,
 aestheticApproval:'HOLD',humanQA:'HOLD',publish:'HOLD'
});
export function g4e7bhOpenHorizon(doc,sample,{enabled=false}={}){
 if(!enabled)return none();
 const bc=doc?.stageForge?.g4e7bcStudy,aj=doc?.stageForge?.g4e7ajStudy;
 if(bc?.id!=='bank-grade-contour'||bc.variant!=='rollDeck'||
  !['true-pinch','pinch-switch'].includes(bc.road)||aj?.road!==bc.road||
  !bc.real7B48||!bc.real28B51||!bc.hasRealVoid52||
  bc.formalSlope2Meters!==0||bc.publish!=='HOLD'||
  doc.stageForge.productionPromoted!==false||
  doc.stageForge.recordStageId!=='VB-P101-A13-W9C2-G4E7BC-'+bc.road.toUpperCase()+'-ROLLDECK'||
  doc.surfaces?.length!==7||doc.movingObstacles?.length!==28||
  doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52')
  throw Error('BH only permits EXACT private protected BC rollDeck candidate');
 if(typeof sample!=='function')throw Error('BH requires actual physical B48 sampler');
 const signature=JSON.stringify(doc),v=[];
 let portals=0,quarters=0,terraces=0,lightRibs=0,maximumRise=0;
 for(const [index,anchor] of BH_ANCHORS.entries()){
  const f=frame(doc.surfaces[anchor.road],sample,anchor.u,anchor.side);
  const p=(a,d,h)=>place(f,a,anchor.offset+d,h);
  // One readably distinctive torn crescent per structure. Swept across
  // the outboard plane, not erected as a black rectangular roadside wall.
  // The crown's middle is FULLY EMPTY; no faces cover any sky inside.
  for(const sign of [-1,1]){
   const inner=[],outer=[],rear=[],n=anchor.petals*5;
   for(let i=0;i<=n;i++){
    const t=i/n,h=anchor.height*Math.pow(t,.72);
    const along=sign*(anchor.spread*(1.0-t*.46)+anchor.tilt*t*t);
    const out=30+205*Math.sin(t*Math.PI*.70)+110*t*t;
    const alpha= Math.sin(t*Math.PI);
    inner.push(p(along,out,h-33));
    outer.push(p(along+sign*(14+22*alpha),out+17+22*t,h+10+12*alpha));
    rear.push(p(along+sign*(29+19*t),out+50+19*alpha,h-22));
    maximumRise=Math.max(maximumRise,h);
   }
   for(let i=0;i<n;i++){
    const a=inner[i],b=inner[i+1],c=outer[i+1],d=outer[i],
     A=rear[i],B=rear[i+1],bright=(index+i)%5===0?P.warm:index%2?P.lavender:P.arc;
    // The ribbons are slender cross-sections and do not form wall sheets.
    plank(v,a,b,c,d,i%6===0?P.pearl:P.steel);
    plank(v,d,c,B,A,bright);
    if(i%3===0){
     beam(v,lerp(a,d,.35),lerp(b,c,.65),3.8,4.4,P.spark);
     lightRibs++;
    }
   }
  }
  portals++;
  // Actual distinct urban shelves with open sky between levels and
  // recessed outboard supports. Not B48 floor, never cross the lane.
  const levels=[.19,.38,.62,.82];
  for(const [li,t] of levels.entries()){
   // The shelves curve in 3D in both longitudinal and outward directions.
   const n=11,front=[],rear=[],raise=anchor.height*t;
   for(let j=0;j<=n;j++){
    const k=j/n,z=2*k-1,
     longitudinal=anchor.spread*z*.47+25*Math.sin(Math.PI*k)+anchor.tilt*t*.29,
     out=130+li*37+24*(1-z*z);
    front.push(p(longitudinal,out,raise+12*Math.sin(Math.PI*k)));
    rear.push(p(longitudinal+8*Math.sin(z*2.2),out+46+li*7,raise-7));
   }
   for(let j=0;j<n;j++){
    if(j===3||j===7)continue; // true open quarter breaks, not windows.
    plank(v,front[j],front[j+1],rear[j+1],rear[j],
      li%2?P.blue:P.steel, P.under);
    if(j%2===0){
     const mid=lerp(front[j],front[j+1],.5);
     const fin=plus(mid,[0,8+li*2,0]);
     tri(v,front[j],front[j+1],fin,j%3?P.arc:P.warm);
     lightRibs++;
    }
   }
   // Open subframe between adjacent separate urban layers, rather than
   // wall-filling trusses from roof to road.
   if(li>0){
    const base=p((li%2?-1:1)*anchor.spread*.23,130+(li-1)*37,anchor.height*levels[li-1]+16);
    const tip=p((li%2?-1:1)*anchor.spread*.24,130+li*37,raise-8);
    beam(v,base,tip,7,7,P.pearl);
   }
   quarters++;terraces++;
  }
  // Curved flying connections between outboard districts: cantilevered
  // broken spine, narrow enough to leave long unbroken sky windows.
  const span=14,arch=[];
  for(let i=0;i<=span;i++){
   const t=i/span,along=(2*t-1)*anchor.spread*.47;
   arch.push(p(along,270+90*Math.sin(Math.PI*t),anchor.height*.24+
      55*Math.sin(Math.PI*t)+10*Math.sin(2*Math.PI*t)));
  }
  for(let i=0;i<span;i++){
   if(i===5||i===6||i===10)continue; // genuine flying viaduct gap.
   beam(v,arch[i],arch[i+1],7,11,i%4===0?P.warm:P.pearl);
   lightRibs++;
  }
 }
 const triangles=v.length/18;
 if(!v.length||v.length%18||!v.every(Number.isFinite)||
  triangles<1800||triangles>22000||portals!==4||
  quarters!==16||terraces!==16||lightRibs<100||
  maximumRise<890||BH_ANCHORS.some(x=>x.offset<160)||
  JSON.stringify(doc)!==signature)
  throw Error('BH open-horizon geometric / real B48 preservation invariant violated');
 return {active:true,vertices:v,triangles,monuments:portals,
  openPortalSpans:portals*2,separateFloatingQuarters:quarters,
  linkedUrbanTerraces:terraces,lightRibs,
  maximumRiseM:Math.round(maximumRise),
  nominalShoulderClearanceM:Math.min(...BH_ANCHORS.map(x=>x.offset)),
  continuousFacadeSegments:0,forcedLaneCover:0,
  newPhysicalRoads:0,newHazards:0,physicsUnchanged:true,
  certifiedSlope2Meters:0,aestheticApproval:'HOLD',
  humanQA:'HOLD',publish:'HOLD'};
}
