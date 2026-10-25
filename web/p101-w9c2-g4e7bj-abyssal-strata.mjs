/**
 * G4E-7BJ — ABYSSAL STRATA / private real-BC road-locked 3D city geology.
 *
 * Earlier BF/BH/BI built 300-900m crown ribs high ABOVE the chase camera,
 * leaving the actual 110-126m/s view mostly empty. This is a new urban
 * LANDSCAPE in the visible near-road and under-road field, not another
 * named tower, gate repetition, helper road, collider or camera trick.
 */
export const BJ_DISTRICTS=Object.freeze([
 Object.freeze({id:'ABYSS-A',section:1,center:.615,extent:.050,side:-1,offset:61,depth:105,high:48,low:-112}),
 Object.freeze({id:'ABYSS-B',section:1,center:.700,extent:.053,side:1,offset:70,depth:130,high:63,low:-146}),
 Object.freeze({id:'HANGING-ARC',section:1,center:.783,extent:.057,side:-1,offset:80,depth:144,high:88,low:-172}),
 Object.freeze({id:'SUNDERED-EDGE',section:1,center:.845,extent:.032,side:1,offset:96,depth:160,high:106,low:-195})
]);
const C=Object.freeze({
 shell:[.18,.37,.52],deep:[.07,.20,.32],porcelain:[.78,.94,.99],
 strata:[.42,.73,.86],glass:[.29,.79,.94],energy:[.23,1,1],
 golden:[1,.75,.32],violet:[.67,.48,.91],shadow:[.11,.24,.36],
 back:[.08,.21,.32],rail:[.95,.98,1]
});
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),
 scale=(v,n)=>v.map(x=>x*n),dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0),
 norm=a=>scale(a,1/(Math.hypot(...a)||1)),
 cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2]],
 lerp=(a,b,t)=>add(scale(a,1-t),scale(b,t));
const tri=(arr,a,b,c,color)=>{for(const p of [a,b,c])arr.push(...p,...color);};
const face=(v,a,b,c,d,color)=>{tri(v,a,b,c,color);tri(v,a,c,d,color);};
const double=(v,a,b,c,d,color,back=C.back)=>{face(v,a,b,c,d,color);face(v,d,c,b,a,back);};
function girder(v,a,b,width,color){
 const axis=norm(sub(b,a)),reference=Math.abs(dot(axis,[0,1,0]))>.9?[0,0,1]:[0,1,0],
  side=norm(cross(axis,reference)),normal=norm(cross(axis,side));
 const w=scale(side,width*.5),h=scale(normal,width*.35);
 const ring=p=>[add(add(p,w),h),add(sub(p,w),h),sub(sub(p,w),h),add(sub(p,h),w)];
 const ringA=ring(a),ringB=ring(b),q=[...ringA,...ringB];
 for(const [i,j,k,l] of [[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]])
  face(v,q[i],q[j],q[k],q[l],color);
}
function roadside(road,sample,u,side){
 const m=sample(road,u,.5),edge=sample(road,u,side<0?0:1),
  prev=sample(road,u-.0012,.5),next=sample(road,u+.0012,.5),
  forward=norm([next[0]-prev[0],0,next[2]-prev[2]]),
  outward=norm(sub([edge[0]-m[0],0,edge[2]-m[2]],scale(forward,dot(sub(edge,m),forward))));
 if(Math.hypot(...sub(edge,m))<3||!edge.every(Number.isFinite)||!outward.every(Number.isFinite))
  throw Error('BJ requires finite real B48 shoulder coordinates');
 return {edge,forward,outward};
}
const put=(frame,outer,up,forward=0)=>add(add(add(frame.edge,scale(frame.outward,outer)),[0,up,0]),scale(frame.forward,forward));
const off=()=>({active:false,vertices:[],triangles:0,districts:0,inhabitedCells:0,openAtriums:0,
 fractureLayers:0,lightBays:0,hangingUndersides:0,sideSetbackMin:null,
  realRoads:7,realMovers:28,addedColliderSurfaces:0,changedInput:false,changedCamera:false,
  nativeB48Unchanged:true,officialSlope2Meters:0,art:'HOLD',human:'HOLD',publish:'HOLD'});
export function g4e7bjAbyssalStrata(doc,sample,{enabled=false}={}){
 if(!enabled)return off();
 const b=doc?.stageForge?.g4e7bcStudy,aj=doc?.stageForge?.g4e7ajStudy;
 if(b?.id!=='bank-grade-contour'||b.variant!=='rollDeck'||
   aj?.road!==b.road||!['true-pinch','pinch-switch'].includes(b.road)||
   !b.real7B48||!b.real28B51||!b.hasRealVoid52||
   b.formalSlope2Meters!==0||b.publish!=='HOLD'||
   doc.stageForge.productionPromoted!==false||
   doc.stageForge.recordStageId!=='VB-P101-A13-W9C2-G4E7BC-'+b.road.toUpperCase()+'-ROLLDECK'||
   doc.surfaces?.length!==7||doc.movingObstacles?.length!==28||
   doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52')
  throw Error('BJ must use exact unpublished BC B48 native stage');
 if(typeof sample!=='function')throw Error('BJ requires actual B48 sampler');
 const frozen=JSON.stringify(doc),v=[];
 let inhabited=0,atriums=0,fractures=0,lights=0,undersides=0;
 for(const [n,d] of BJ_DISTRICTS.entries()){
  const road=doc.surfaces[d.section],steps=24,panels=[];
  for(let i=0;i<=steps;i++){
   const t=i/steps,u=d.center+d.extent*(2*t-1),f=roadside(road,sample,u,d.side);
   const wave=Math.sin(Math.PI*t),zig=Math.sin(t*Math.PI*4+n*.8);
   panels.push({
    t, u,
    // True continuous 3D cliff mass; the two outer faces are separated
    // by 100-160m of OUTBOARD depth. No hidden B48 road or floor.
    innerUpper:put(f,d.offset+12*zig,d.high*.58+14*wave),
    outerUpper:put(f,d.offset+d.depth+33*wave,d.high*.42+22*zig),
    innerLower:put(f,d.offset+20*wave,d.low*.62+9*zig),
    outerLower:put(f,d.offset+d.depth+25*wave,d.low-20*wave),
    ridge:put(f,d.offset+28+20*wave,d.high+12*zig),
    deep:put(f,d.offset+d.depth*.58,d.low-32*wave),
    frame:f
   });
  }
  // Broad fractured inhabited CLIFF facades dominate the visible 50-250m
  // field, not the sky above the screen. Do not make a black corridor wall:
  // leave large bays genuinely absent between separate giant shelves.
  for(let k=0;k<steps;k++){
   const a=panels[k],b1=panels[k+1],voidIndex=k%12;
   const hasAtrium=voidIndex===4||voidIndex===5||voidIndex===6||voidIndex===9;
   if(hasAtrium){atriums++;continue;}
   const primary=(k+n)%5===0?C.porcelain:(k+n)%3===0?C.strata:C.shell;
   double(v,a.innerUpper,b1.innerUpper,b1.outerUpper,a.outerUpper,primary);
   double(v,a.innerLower,b1.innerLower,b1.outerLower,a.outerLower,k%6===0?C.violet:C.deep);
   // Thick broken outer facade from -100 to 0m; hollow between tiers.
   if(k%3!==1){
    double(v,a.outerUpper,b1.outerUpper,b1.outerLower,a.outerLower,k%5===0?C.glass:C.shadow);
    inhabited++;
   }
   // Genuine visible underbelly: taper down and away into abyss.
   if(k%4!==2){
    double(v,a.innerLower,b1.innerLower,b1.deep,a.deep,C.strata);
    double(v,a.deep,b1.deep,b1.outerLower,a.outerLower,C.deep);
    undersides++;
   }
   // Continuous luminous tracing that visually explains the megastructure,
   // but NEVER crosses the real driving road itself.
   if(k%2===0){
    girder(v,a.innerUpper,b1.innerUpper,2.5,C.energy);
    girder(v,a.outerUpper,b1.outerUpper,3,C.golden);
    lights+=2;
   }
   if(k%4===0){
    girder(v,a.ridge,b1.ridge,4,C.rail);
    girder(v,a.ridge,a.deep,4.5,C.porcelain);
    lights+=2;
   }
   fractures++;
  }
  // Architectural cut-outs are truly empty. Tapering chain of nested glass
  // gardens illuminates the THREE-DIMENSIONAL inhabited voids between tiers.
  for(let layer=0;layer<4;layer++){
   for(let i=1;i<steps-1;i+=2){
    if((i+layer*2)%9===4||(i+layer*2)%9===5)continue;
    const p=panels[i],q=panels[i+1],t=(layer+.5)/4,
      A=lerp(p.innerLower,p.innerUpper,t),B=lerp(q.innerLower,q.innerUpper,t),
      backA=lerp(p.outerLower,p.outerUpper,t),backB=lerp(q.outerLower,q.outerUpper,t);
    const brightness=layer%3===0?C.golden:layer===2?C.energy:C.glass;
    double(v,A,B,backB,backA,brightness);
    // White roof-edges and fine habitable facade luminaires, not flat boxes.
    girder(v,A,B,1.7,C.porcelain);
    girder(v,backA,backB,1.8,brightness);
    inhabited++;lights+=2;
   }
  }
  // Two vast flying ribs from upper city crest to deep suspended neighborhoods
  // frame open sky + deep abyss without enclosing the road.
  for(const idx of [5,18]){
   const a=panels[idx],z=panels[Math.min(steps,idx+4)];
   girder(v,a.ridge,z.outerUpper,9,C.porcelain);
   girder(v,z.outerUpper,z.deep,10,C.glass);
   girder(v,z.deep,a.innerLower,8,C.energy);
   lights+=3;
  }
 }
 if(!v.length||v.length%18||v.some(x=>!Number.isFinite(x))||
  v.length/18<2500||v.length/18>30000||
  inhabited<110||atriums!==32||fractures<55||lights<140||undersides<40||
  JSON.stringify(doc)!==frozen)
  throw Error('BJ massive road-visible 3D city invariant: '+JSON.stringify({
   triangles:v.length/18,nonFinite:v.filter(x=>!Number.isFinite(x)).length,
   inhabited,atriums,fractures,lights,undersides,changed:JSON.stringify(doc)!==frozen
  }));
 return {active:true,vertices:v,triangles:v.length/18,districts:4,inhabitedCells:inhabited,
  openAtriums:atriums,fractureLayers:fractures,lightBays:lights,hangingUndersides:undersides,
  sideSetbackMin:Math.min(...BJ_DISTRICTS.map(x=>x.offset)),realRoads:7,realMovers:28,
  addedColliderSurfaces:0,changedInput:false,changedCamera:false,nativeB48Unchanged:true,
  officialSlope2Meters:0,art:'HOLD',human:'HOLD',publish:'HOLD'};
}
