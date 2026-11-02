/**
 * G4E-7BF / SKY FRACTURE — one independent ART-FIRST scenic experiment
 * for the real BC rollDeck (not an invisible B48 support, hazard or booster).
 * Three different torn urban masses; actual sky voids in the silhouette.
 * Private manual camera and the real 240Hz B48/B51 runner are unchanged.
 */
const P=Object.freeze({
 dark:[.028,.074,.115],metal:[.085,.25,.33],facet:[.18,.43,.50],
 pearl:[.50,.78,.84],electric:[.24,.89,.93],amber:[.96,.48,.24],
 underside:[.035,.095,.15],violet:[.29,.24,.45]
});
export const BF_MASSES=Object.freeze([
 Object.freeze({name:'LOWER-CITADEL',section:0,u:.69,side:-1,span:.27,rise:540,setback:165,shear:-115,fold:230}),
 Object.freeze({name:'TORN-CROWN',section:1,u:.37,side:1,span:.25,rise:730,setback:152,shear:180,fold:260}),
 Object.freeze({name:'CHASM-VANE',section:1,u:.72,side:-1,span:.24,rise:910,setback:180,shear:-205,fold:390})
]);
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),
 mul=(a,x)=>a.map(v=>v*x),norm=a=>mul(a,1/(Math.hypot(...a)||1)),
 lerp=(a,b,t)=>add(mul(a,1-t),mul(b,t)),
 dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),
 tri=(v,a,b,c,color)=>{for(const p of [a,b,c])v.push(...p,...color);};
function face(v,a,b,c,d,color){
 tri(v,a,b,c,color);tri(v,a,c,d,color);
 const shadow=color.map(x=>x*.58);
 tri(v,d,c,b,shadow);tri(v,d,b,a,shadow);
}
function spar(v,a,b,width,depth,color){
 const dir=norm(sub(b,a)),axis=norm([-dir[2],0,dir[0]]),
  w=mul(axis,width*.5),h=[0,depth*.5,0];
 const corners=p=>[add(add(p,w),h),add(sub(p,w),h),sub(sub(p,w),h),sub(add(p,w),h)];
 const x=corners(a),y=corners(b);
 for(const [i,j,k,l] of [[0,1,2,3],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0],[4,7,6,5]])
  face(v,i<4?x[i]:y[i-4],j<4?x[j]:y[j-4],
   k<4?x[k]:y[k-4],l<4?x[l]:y[l-4],color);
 // Keep forms structural and sparse; tests check all vertices finite and static.
}
function frame(road,sample,u,side){
 const at=sample(road,u,.5),edge=sample(road,u,side<0?0:1),
  before=sample(road,Math.max(0,u-.005),.5),after=sample(road,Math.min(1,u+.005),.5),
  tangent=norm([after[0]-before[0],0,after[2]-before[2]]),
  d=sub(edge,at),plan=[d[0],0,d[2]],l=dot(tangent,plan),
  out=norm(sub(plan,mul(tangent,l)));
 if(dot(out,plan)<2||Math.hypot(...tangent)<.8)throw Error('BF real B48 outboard tangent degenerate');
 return {edge,out,tangent};
}
const empty=()=>({active:false,vertices:[],triangles:0,masses:0,
 openSkyBays:0,inhabitedTerraces:0,connectingRibs:0,highestRiseM:0,
 nominalOutboardMinimumM:null,realRoads:7,realMoving:28,
 noPhysicsMutation:true,noAddedCollision:true,officialSlope2Meters:0,
 artQA:'HOLD',humanQA:'HOLD',publish:'HOLD'});
export function g4e7bfSkyFracture(doc,sample,{enabled=false}={}){
 if(!enabled)return empty();
 const b=doc?.stageForge?.g4e7bcStudy,aj=doc?.stageForge?.g4e7ajStudy;
 if(!b||b.id!=='bank-grade-contour'||b.variant!=='rollDeck'||
    !['true-pinch','pinch-switch'].includes(b.road)||aj?.road!==b.road||
    b.real7B48!==true||b.real28B51!==true||!b.hasRealVoid52||
    b.formalSlope2Meters!==0||b.publish!=='HOLD'||
    doc.stageForge.productionPromoted!==false||
    doc.surfaces?.length!==7||doc.movingObstacles?.length!==28||
    doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52'||
    doc.stageForge.recordStageId!=='VB-P101-A13-W9C2-G4E7BC-'+b.road.toUpperCase()+'-ROLLDECK')
   throw Error('BF requires real PRIVATE BC rollDeck with exact original B48/B51 ancestry');
 if(typeof sample!=='function')throw Error('BF requires real road sampler');
 const source=JSON.stringify(doc),v=[];
 let openSkyBays=0,inhabitedTerraces=0,connectingRibs=0,highestRise=0;
 for(const mass of BF_MASSES){
  const surf=doc.surfaces[mass.section],cols=18,levels=12;
  const ribbons=[],outs=[];
  for(let i=0;i<=cols;i++){
   const t=i/cols,u=Math.max(.01,Math.min(.99,mass.u+mass.span*(t-.5))),
    f=frame(surf,sample,u,mass.side),row=[],rear=[];
   for(let k=0;k<=levels;k++){
    const h=k/levels,rise=mass.rise*Math.pow(h,.91)+17*Math.sin(t*Math.PI*2.2)*h,
     sweep=mass.shear*h*h+35*Math.sin(t*Math.PI*3)*h,
     offset=mass.setback+mass.fold*h*h+65*Math.sin(Math.PI*t)*Math.sin(Math.PI*h),
     point=add(add(add(f.edge,mul(f.out,offset)),mul(f.tangent,sweep)),[0,rise,0]);
    row.push(point);
    rear.push(add(add(point,mul(f.out,25+23*h)),[0,-12-14*h,0]));
    highestRise=Math.max(highestRise,rise);
   }
   ribbons.push(row);outs.push(rear);
  }
  for(let i=0;i<cols;i++)for(let k=0;k<levels;k++){
   // Deliberately NOT a continuous opaque canyon wall.
   // Two wide full-height voids puncture the entire tectonic shell.
   const mainBreach=(i>=5&&i<=8)||(i>=13&&i<=14);
   const crossBreach=(i>=2&&i<=3&&k>=4&&k<=9)||
     (i>=10&&i<=12&&k>=2&&k<=6);
   if(mainBreach||crossBreach){openSkyBays++;continue;}
   const a=ribbons[i][k],b=ribbons[i+1][k],
    c=ribbons[i+1][k+1],d=ribbons[i][k+1],
    A=outs[i][k],B=outs[i+1][k],C=outs[i+1][k+1],D=outs[i][k+1];
   // Real folded-front/back shell thickness; irregular faceted silhouette.
   face(v,a,b,c,d,k<=2?P.dark:k>=9?P.facet:(i+k)%5===0?P.violet:P.metal);
   face(v,D,C,B,A,P.underside);
   if(k===0||k===levels-1){face(v,a,A,B,b,P.facet);face(v,d,c,C,D,P.pearl);}
   if((i+k)%9===0){face(v,a,b,lerp(b,c,.085),lerp(a,d,.085),P.electric);}
  }
  // Massive separate urban cantilevers at distinct heights.
  for(const [q,level] of [3,7,10].entries()){
   const i=q===1?11:q===0?3:16;
   const base=ribbons[i][level],rear=outs[i][level],
    f=frame(surf,sample,Math.max(.01,Math.min(.99,mass.u+mass.span*(i/cols-.5))),mass.side);
   const outboard=mul(f.out,67+q*32),along=mul(f.tangent,37+q*11),
    low=[0,-18-q*4,0];
   const A=add(base,outboard),B=add(add(rear,outboard),along),
    C=add(rear,mul(along,-.8)),D=add(base,mul(along,-.9));
   face(v,A,B,C,D,q%2?P.facet:P.violet);
   face(v,add(A,low),add(B,low),B,A,P.dark);
   face(v,A,D,add(D,low),add(A,low),P.facet);
   const peak=add(lerp(A,B,.6),[0,20+q*8,0]);
   tri(v,A,B,peak,q%2?P.electric:P.amber);
   inhabitedTerraces++;
  }
  // Structural forks with generous sky gaps: read as a single connected
  // megastructure rather than a row of identical rectangular buildings.
  for(const [j,k] of [[1,7],[10,6],[16,9]]){
   const a=outs[j][1],b=ribbons[j][k];
   spar(v,a,b,8+j%3*2,9,P.facet);
   connectingRibs++;
  }
 }
 if(!v.length||v.length%18||v.some(x=>!Number.isFinite(x))||
   v.length/18<1000||v.length/18>30000||
   openSkyBays<160||inhabitedTerraces!==9||
   connectingRibs!==9||highestRise<880||
   BF_MASSES.some(x=>x.setback<140)||
   JSON.stringify(doc)!==source)
  throw Error('BF massive physical-safety/void-budget/art geometry invariant');
 return {active:true,vertices:v,triangles:v.length/18,
  masses:BF_MASSES.length,openSkyBays,inhabitedTerraces,connectingRibs,
  highestRiseM:+highestRise.toFixed(2),
  nominalOutboardMinimumM:Math.min(...BF_MASSES.map(x=>x.setback)),
  realRoads:7,realMoving:28,noPhysicsMutation:true,noAddedCollision:true,
  officialSlope2Meters:0,artQA:'HOLD',humanQA:'HOLD',publish:'HOLD'};
}
