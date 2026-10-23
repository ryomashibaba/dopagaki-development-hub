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
