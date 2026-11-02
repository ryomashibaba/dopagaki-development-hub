/**
 * G4E-7X — physics-truthful GPU-only legibility aids for a genuine B48
 * 15.76m single-cell gap. Real road surface only; never build a crossing
 * mesh, guardrail, fake floor, jump control, HUD or speed/camera assist.
 * Candidate deliberately restricted to two private scripted 7/7 finishes.
 */
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const mag=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
function arc(road,sample){
 const N=256,points=Array.from({length:N+1},(_,i)=>sample(road,i/N,.5)),dist=[0];
 for(let i=1;i<=N;i++)dist.push(dist.at(-1)+mag(points[i],points[i-1]));
 return {total:dist.at(-1),metersAt(u){
  const w=clamp(u,0,1)*N,i=Math.min(N-1,Math.floor(w));
  return dist[i]+(dist[i+1]-dist[i])*(w-i);
 },uAt(m){
  const v=clamp(m,0,dist.at(-1));let a=0,b=N;
  while(b-a>1){const k=Math.floor((a+b)/2);if(dist[k]<v)a=k;else b=k;}
  return (a+clamp((v-dist[a])/(dist[b]-dist[a]||1),0,1))/N;
 }};
}
const empty=()=>({enabled:false,triangles:0,vertices:[],marks:[],
 nonCollision:true,noFakeBridge:true,physicsUnchanged:true,
 officialSlope2Meters:0,visualAdoption:'HOLD'});
export function g4e7xGapReading(doc,sample,frame,{enabled=false}={}){
 if(!enabled)return empty();
 const study=doc?.stageForge?.g4e7wStudy,alpha=study?.physicalTakeoffTransition,
  suffix=alpha===.65?'0-65':alpha===.7?'0-7':null;
 if(!suffix||doc.stageForge.recordStageId!=='VB-P101-A13-W9C2-G4E7W-BLEND-'+suffix||
  doc.stageForge.productionPromoted!==false||
  doc.surfaces?.length!==7||doc.movingObstacles?.length!==28||
  !study.gap?.realCollisionGap||study.gap.cells?.join(',')!=='52'||
  !study.gap.noInvisibleBridge||study.officialSlope2Meters!==0||
  typeof sample!=='function'||typeof frame!=='function')
  throw Error('G4E-7X requires exact private native-7/7 15m B48 causal gap');
 const road=doc.surfaces[0],gap=study.gap;
 if(road.rows!==31||road.cols!==5||road.resolution!==3||
  road.voidLongitudinalCells?.join(',')!=='52'||!road.rideable||!road.collidable)
  throw Error('G4E-7X not a genuine 1-cell rideable B48 gap');
 const width=mag(sample(road,gap.uTakeoff,0),sample(road,gap.uTakeoff,1));
 if(width<11||width>16||gap.gapMeters<2.5||gap.gapMeters>13)
  throw Error('G4E-7X genuine narrow gap width/length mismatch');
 const profile=arc(road,sample),begin=profile.metersAt(gap.uTakeoff),
  end=profile.metersAt(gap.uLanding),out=[],marks=[];
 const cyan=[.24,.95,1],pale=[.7,.98,1],amber=[1,.77,.21],orange=[1,.43,.18];
 const point=(u,v)=>{
  const p=sample(road,u,v),normal=frame(road,u,v).normal;
  const h=normal[1]<0?-.22:.22;
  return p.map((x,i)=>x+normal[i]*h);
 };
 function stripe(label,m0,m1,v0,v1,color){
  const u0=profile.uAt(m0),u1=profile.uAt(m1);
  if(m0<0||m1>profile.total||u1<=u0+1e-7)return;
  // A triangle on the void is worse than no warning at all.
  const upstream=u1<=gap.uTakeoff-1e-5;
  const downstream=u0>=gap.uLanding+1e-5;
  if(!upstream&&!downstream)
   throw Error('G4E-7X visual stripe would bridge actual missing B48');
  const a=point(u0,v0),b=point(u1,v0),c=point(u1,v1),d=point(u0,v1);
  for(const p of [a,b,c,a,c,d])out.push(...p,...color);
  marks.push({label,u0,u1,metersBeforeCut:Number((begin-m1).toFixed(2)),zone:upstream?'before':'after'});
 }
 // Thin intermittent paint, across the road in four equal zones. No central
 // safety corridor, no long flat opaque slab and no bridge over the cut.
 const bands=[[.035,.16],[.265,.42],[.58,.735],[.84,.965]];
 for(const [meters,thickness] of [[195,1.3],[145,1.2],[95,1.05],[50,.9],[20,.7],[5,.45]]){
  if(begin-meters-thickness<2)continue;
  const col=meters>95?cyan:meters>20?amber:orange;
  for(const [v0,v1] of bands)
   stripe('lookahead-'+meters,begin-meters-thickness,begin-meters,v0,v1,col);
 }
 for(let i=0;i<9;i++){
  const high=begin-3-i*8,low=high-4.3;if(low<1)break;
  stripe('left-edgeline-'+i,low,high,.012,.049,i<4?amber:cyan);
  stripe('right-edgeline-'+i,low,high,.951,.988,i<4?amber:cyan);
 }
 for(const [meters,thickness] of [[.7,.7],[3.4,.75],[11,.9],[22,1.1]]){
  for(const [v0,v1] of bands)
   stripe('landing-'+meters,end+meters,end+meters+thickness,v0,v1,pale);
 }
 if(!marks.some(x=>x.label==='lookahead-195')||
  !marks.some(x=>x.label==='landing-0.7')||!out.length||out.length%18!==0||
  out.length>7000||!out.every(Number.isFinite))
  throw Error('G4E-7X gap reading damaged or GPU budget exceeded');
 return {enabled:true,triangles:out.length/18,vertices:out,marks,
  upstreamMarks:marks.filter(x=>x.zone==='before').length,
  downstreamMarks:marks.filter(x=>x.zone==='after').length,
  noFakeBridge:true,nonCollision:true,physicsUnchanged:true,
  actualLipWidthMeters:Number(width.toFixed(3)),
  actualGapLengthMeters:gap.gapMeters,
  earliestLookaheadMeters:195,
  cameraOrSteeringChange:false,officialSlope2Meters:0,visualAdoption:'HOLD'};
}

/**
 * G4E-7X V2: ten free-standing sculptural fins OUTSIDE genuine B48 shoulders.
 * Unlike planar stripes, their 12-24m vertical silhouette can be seen from
 * far away without placing a false span or overhead arch across the cut.
 * Not approved until actual WebGL camera review proves readability.
 */
export function g4e7xOutboardVanes(doc,sample,frame,{enabled=false}={}){
 if(!enabled)return {enabled:false,vertices:[],triangles:0,stations:[],
  outboardOnly:true,noDeckAboveGap:true,nonCollision:true,officialSlope2Meters:0};
 const valid=g4e7xGapReading(doc,sample,frame,{enabled:true});
 if(!valid.enabled||valid.actualLipWidthMeters>=16)throw Error('G4E-7X outboard only for true W gap');
 const road=doc.surfaces[0],gap=doc.stageForge.g4e7wStudy.gap,
  centerArc=arc(road,sample),lipAt=centerArc.metersAt(gap.uTakeoff),
  endAt=centerArc.metersAt(gap.uLanding),triangles=[],stations=[];
 const plus=(a,b)=>a.map((x,i)=>x+b[i]),mul=(a,k)=>a.map(x=>x*k),
  diff=(a,b)=>a.map((x,i)=>x-b[i]),norm=a=>mul(a,1/(Math.hypot(...a)||1));
 const addTri=(a,b,c,color)=>{for(const p of [a,b,c])triangles.push(...p,...color);};
 const items=[
  {m:lipAt-175,role:'long-lookahead',h:21,color:[.20,.95,1]},
  {m:lipAt-90,role:'mid-approach',h:24,color:[.19,.85,1]},
  {m:lipAt-28,role:'warning',h:23,color:[1,.77,.20]},
  {m:lipAt-2.5,role:'true-takeoff',h:22,color:[1,.40,.15]},
  {m:endAt+2.5,role:'true-landing',h:17,color:[.82,.98,1]}
 ];
 for(const item of items){
  if(item.m<4||item.m>centerArc.total-4)throw Error('Outboard vane would leave authored road');
  const u=centerArc.uAt(item.m),isBefore=u<gap.uTakeoff-1e-5,
   isAfter=u>gap.uLanding+1e-5;
  if(!isBefore&&!isAfter)throw Error('Outboard vane anchored inside true gap');
  const left=sample(road,u,0),right=sample(road,u,1),
   across=norm(diff(right,left)),forward=frame(road,u,.5).forward;
  for(const side of [-1,1]){
   const edge=side===-1?left:right,outward=mul(across,side);
   const clearance=3.2,anchor=plus(edge,mul(outward,clearance)),
    off=(along,lateral,y=0)=>plus(plus(plus(anchor,mul(forward,along)),mul(outward,lateral)),[0,y,0]),
    baseA=off(-2.8,-.2,.25),baseB=off(2.8,1.3,.3),baseC=off(0,2.4,.35),
    peak=off(2.0,4.1,item.h),back=off(-.8,4.4,item.h*.67),
    shade=item.color.map(v=>v*.51),light=item.color.map(v=>Math.min(1,v*1.12));
   addTri(baseA,baseB,peak,item.color);
   addTri(baseA,peak,back,shade);
   addTri(baseB,baseC,peak,light);
   addTri(baseC,back,peak,item.color);
   addTri(baseA,back,baseC,shade);
   addTri(baseB,back,baseC,shade);
   stations.push({role:item.role,side,u:Number(u.toFixed(6)),
    heightMeters:item.h,minimumOutboardMeters:clearance,
    cutSide:isBefore?'before':'after'});
  }
 }
 if(stations.length!==10||triangles.length/18!==60||
  !triangles.every(Number.isFinite)||stations.some(s=>s.minimumOutboardMeters<3))
  throw Error('G4E-7X actual outboard B48 vanes invalid');
 return {enabled:true,vertices:triangles,triangles:triangles.length/18,stations,
  outboardOnly:true,noDeckAboveGap:true,
  minimumOutboardMeters:3.2,nonCollision:true,
  underRoadSupportAdded:false,guideMode:'TAPERED_NONCOLLISION_OUTBOARD_FINS',
  originalPhysicsUnchanged:true,officialSlope2Meters:0,visualAdoption:'HOLD'};
}

/**
 * G4E-7Z: lightweight, shoulder-exterior, 2-sided real-gap signals.
 * Not the earlier 22m-tall broad outboard fins. No physics or phantom span.
 */
export function g4e7zLowProfileSignals(doc,sample,frame,{enabled=false}={}){
 const empty={enabled:false,vertices:[],triangles:0,stations:[],
  outboardOnly:true,nonCollision:true,noFakeFloor:true,officialSlope2Meters:0};
 if(!enabled)return empty;
 const ok=g4e7xGapReading(doc,sample,frame,{enabled:true});
 if(!ok.enabled||!ok.noFakeBridge)throw Error('G4E-7Z requires true B48 void');
 const road=doc.surfaces[0],gap=doc.stageForge.g4e7wStudy.gap,
  dist=arc(road,sample),lip=dist.metersAt(gap.uTakeoff),
  land=dist.metersAt(gap.uLanding),vertices=[],stations=[];
 const layout=[
  ['preview165',lip-165,12.5,[.24,.88,1]],
  ['preview100',lip-100,14,[.26,.77,1]],
  ['preview55',lip-55,13,[.28,.97,.93]],
  ['warning25',lip-25,12,[1,.77,.20]],
  ['takeoff4',lip-4,14,[1,.43,.17]],
  ['landing4',land+4,14,[.7,1,.95]],
  ['landing21',land+21,11,[.31,.91,1]]
 ];
 const add=(a,b)=>a.map((v,i)=>v+b[i]),
  mul=(a,k)=>a.map(v=>v*k),norm=a=>mul(a,1/(Math.hypot(...a)||1)),
  push=(p,q,r,c)=>{for(const v of [p,q,r])vertices.push(...v,...c)};
 for(const [role,meter,h,col] of layout){
  if(meter<1||meter>dist.total-1)throw Error('G4E-7Z out of physical road');
  const u=dist.uAt(meter),
   zone=u<gap.uTakeoff-.0001?'before':u>gap.uLanding+.0001?'after':null;
  if(!zone)throw Error('G4E-7Z fake span is forbidden');
  for(const side of [-1,1]){
   const edge=sample(road,u,side<0?0:1),middle=sample(road,u,.5),
    outside=norm([edge[0]-middle[0],0,edge[2]-middle[2]]),
    forward=frame(road,u,.5).forward,
    root=add(edge,mul(outside,5.4)),
    at=(f,o,y)=>add(add(root,mul(forward,f)),add(mul(outside,o),[0,y,0])),
    a=at(-.72,0,.18),b=at(.72,0,.18),
    peak=at(-.25,1.05,h),tip=at(.42,1.10,h*.82),
    shade=col.map(x=>x*.52);
   push(a,b,peak,col);push(b,tip,peak,shade);
   push(b,a,tip,shade);push(a,peak,tip,col);
   stations.push({role,zone,side,roadU:Number(u.toFixed(6)),
    edgeClearanceMeters:5.4,heightMeters:h});
  }
 }
 if(stations.length!==14||vertices.length!==14*4*18||
  !vertices.every(Number.isFinite))throw Error('G4E-7Z geometry guard failed');
 return {enabled:true,vertices,triangles:vertices.length/18,stations,
  firstPreviewMeters:165,edgeClearanceMeters:5.4,
  outboardOnly:true,nonCollision:true,noFakeFloor:true,
  physicalB48Unchanged:true,originalMachines:28,
  officialSlope2Meters:0,humanFairness:'HOLD'};
}
