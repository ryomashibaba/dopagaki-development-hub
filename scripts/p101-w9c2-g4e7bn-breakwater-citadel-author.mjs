/**
 * G4E-7BN / BREAKWATER CITADEL.
 *
 * An art-directed urban SUBJECT, not another tube, wall or repeating neon gate:
 * one terraced inhabited mass with a forked structural canopy, stepped urban
 * strata, three genuinely differently shaped tapered tower complexes, occupied
 * glazed facades, and deep open courts. Geometry and city blocks are authored
 * as explicit 3D surfaces, using a real binary glTF2 export. PRIVATE art test;
 * script-authored, not Blender hand-modelled, no aesthetic PASS claimed.
 */
import {sample} from '../private/reference_only/director/surface.js';
import {BK_MATERIALS,glbFromTriangles} from './p101-w9c2-g4e7bk-glb-author.mjs';
import {generateBMModel} from './p101-w9c2-g4e7bm-camera-registered-author.mjs';
const PI=Math.PI;
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]);
const mul=(a,t)=>a.map(x=>x*t),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=a=>mul(a,1/(Math.hypot(...a)||1));
const round=x=>Number(x.toFixed(3));
function tri(t,m,a,b,c){
 const normal=unit(cross(sub(b,a),sub(c,a)));
 if(Math.hypot(...normal)<.99||[...a,...b,...c,...normal].some(x=>!Number.isFinite(x)))
  throw Error('BN invalid solid urban mesh');
 for(const p of [a,b,c])t[m].push(...p,...normal);
}
function quad(t,m,a,b,c,d){tri(t,m,a,b,c);tri(t,m,a,c,d);}
function block(t,m,top,depth){
 const bot=top.map(p=>add(p,[0,-depth,0]));
 quad(t,m,...top);quad(t,5,...bot.slice().reverse());
 for(let j=0;j<4;j++)quad(t,j%2?5:1,top[j],top[(j+1)%4],bot[(j+1)%4],bot[j]);
}
function frame(s,v){
 const u=.625+.225*v,edge=sample(s,u,1),center=sample(s,u,.5),
  a=sample(s,u-.001,.5),b=sample(s,u+.001,.5),
  forward=unit([b[0]-a[0],0,b[2]-a[2]]),d=sub(edge,center),
  outward=unit(sub([d[0],0,d[2]],mul(forward,dot(d,forward))));
 if(dot(outward,d)<1)throw Error('BN must use original real B48 shoulder');
 return {edge,forward,outward};
}
const loc=(f,along,out,h)=>add(add(add(f.edge,mul(f.forward,along)),mul(f.outward,out)),[0,h,0]);
function strut(t,m,a,b,thickness){
 const forward=unit(sub(b,a)),right=unit(cross(forward,Math.abs(forward[1])>.9?[0,0,1]:[0,1,0]));
 const up=unit(cross(right,forward)),x=mul(right,thickness*.5),y=mul(up,thickness*.48);
 const ring=p=>[add(add(p,x),y),add(sub(p,x),y),sub(sub(p,x),y),add(sub(p,y),x)];
 const p=ring(a),q=ring(b);
 for(let i=0;i<4;i++)quad(t,m,p[i],p[(i+1)%4],q[(i+1)%4],q[i]);
}
function tower(t,s,plan){
 const {v,out,h,height,radius,sides,lean,rotation}=plan;
 const base=frame(s,v),n=24,P=PI*2;
 const point=(level,j,rModifier=0)=>{
  const k=level/n,ang=j*P/sides+rotation+.20*Math.sin(PI*k);
  const taper=(1-.33*k)+.065*Math.sin(k*PI*4);
  const r=(radius+rModifier)*taper*(1+.095*Math.sin(3*ang+.6*k));
  const shift=lean*k*k;
  return loc(base,shift+r*Math.sin(ang)*.84,out+r*Math.cos(ang),h+height*k);
 };
 for(let i=0;i<n;i++){
  for(let j=0;j<sides;j++){
   const windowTier=i>2&&i<22&&i%5!==0;
   const mat=i%7===0?0:windowTier?(j%4===1?3:2):1;
   quad(t,mat,point(i,j),point(i,j+1),point(i+1,j+1),point(i+1,j));
  }
 }
 // A pronounced split crown, real void between offset cap masses, not a ring.
 for(let j=0;j<sides;j+=2){
  const a=point(n,j),b=point(n,j+1);
  const c=add(b,[0,9+4*(j%4),0]),d=add(a,[0,9+4*(j%4),0]);
  quad(t,0,a,b,c,d);
 }
 for(const j of [0,Math.floor(sides/2)]){
  strut(t,1,point(2,j,6),point(20,j,4),4.6);
 }
 // 5m-scale repeated windows communicate the 200m urban height;
 // deliberately constrained to occupied bands (not endless neon bars).
 for(let k=2;k<n-2;k+=3){
  const a=point(k,1,-1),b=point(k,2,-1);
  const c=point(k+1,2,-1),d=point(k+1,1,-1);
  quad(t,3,a,b,c,d);
 }
}
export function generateBNModel(doc,nativeFrames){
 const b=doc?.stageForge?.g4e7bcStudy;
 if(b?.id!=='bank-grade-contour'||b.variant!=='rollDeck'||
  !['true-pinch','pinch-switch'].includes(b.road)||b.publish!=='HOLD'||
  b.formalSlope2Meters!==0||doc.stageForge.productionPromoted!==false||
  doc.surfaces?.length!==7||doc.movingObstacles?.length!==28||
  doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52')
  throw Error('BN only on protected PRIVATE canonical 7-B48 BC');
 const frozen=JSON.stringify(doc);
 const registered=generateBMModel(doc,nativeFrames);
 const shift=registered.meta.modelWorldOffset;
 if(!Array.isArray(shift)||shift.length!==3||shift.some(x=>!Number.isFinite(x)))
  throw Error('BN requires genuine BG camera-calibrated fixed registration');
 const t=BK_MATERIALS.map(()=>[]),s=doc.surfaces[1];
 // Uneven terraced CITY BASE: five thick lands, shifted off-road and
 // physically connected to upper urban strata, with open voids in between.
 const tiers=[
  {a:.07,b:.31,inner:193,outer:402,h:-120,d:34},
  {a:.25,b:.52,inner:210,outer:426,h:-85,d:28},
  {a:.48,b:.77,inner:197,outer:433,h:-103,d:39},
  {a:.72,b:.97,inner:221,outer:384,h:-67,d:25}
 ];
 for(let k=0;k<tiers.length;k++){
  const z=tiers[k],p=frame(s,z.a),q=frame(s,z.b);
  block(t,k%3===1?1:0,[
   loc(p,-17,z.inner,z.h-5),loc(q,18,z.inner+8,z.h+10),
   loc(q,7,z.outer-17,z.h+22),loc(p,-12,z.outer,z.h+3)
  ],z.d);
  // Deliberately deep outward-facing inhabited masses, not colored strips:
  // six different 3D facade bays per terrace with recessed glass/window.
  for(let n=0;n<6;n++){
   const v=z.a+(z.b-z.a)*(n+.14)/6,w=z.a+(z.b-z.a)*(n+.86)/6;
   const f=frame(s,v),g=frame(s,w),o=z.outer-28-4*(n%3),y=z.h-13;
   const glazing=[
    loc(f,0,o,y),loc(g,0,o,y+2),loc(g,0,o,y-19),loc(f,0,o,y-21)
   ];
   quad(t,2,...glazing);
   if(n%3!==1)quad(t,3,
    loc(f,0,o+1,y-7),loc(g,0,o+1,y-6),
    loc(g,0,o+1,y-10),loc(f,0,o+1,y-11));
  }
 }
 // Main signature: TWO DIFFERENT sheared roof wings separated by a true
 // 65m sky opening. The missing center is air, not an unlit roof.
 const canopy=[
  {a:.16,b:.44,out0:210,out1:410,base:27,peak:104},
  {a:.61,b:.91,out0:198,out1:391,base:8,peak:77}
 ];
 for(let index=0;index<canopy.length;index++){
  const z=canopy[index],count=23;
  for(let i=0;i<count;i++){
   const v=z.a+(z.b-z.a)*i/count,w=z.a+(z.b-z.a)*(i+1)/count;
   const bend=x=>Math.sin(PI*(x-z.a)/(z.b-z.a));
   const a=frame(s,v),b1=frame(s,w);
   const offsetA=11*Math.sin(i*.32),offsetB=11*Math.sin((i+1)*.32);
   block(t,index?1:0,[
    loc(a,0,z.out0+offsetA,z.base-22*bend(v)),
    loc(b1,0,z.out0+offsetB,z.base-22*bend(w)),
    loc(b1,0,z.out1+13*bend(w),z.base+z.peak*bend(w)),
    loc(a,0,z.out1+13*bend(v),z.base+z.peak*bend(v))
   ],18+12*bend((v+w)/2));
  }
 }
 // Three asymmetrical inhabited clusters, not monotonous rectangular towers.
 tower(t,s,{v:.245,out:292,h:-88,height:238,radius:31,sides:10,lean:15,rotation:.12});
 tower(t,s,{v:.515,out:350,h:-93,height:302,radius:38,sides:12,lean:-20,rotation:.28});
 tower(t,s,{v:.775,out:302,h:-64,height:214,radius:27,sides:9,lean:17,rotation:.44});
 // A small secondary skyline sits well BEHIND the hero towers, giving
 // readable inhabited scale without a monolithic opaque road-side facade.
 tower(t,s,{v:.38,out:413,h:-82,height:130,radius:16,sides:8,lean:-7,rotation:.1});
 tower(t,s,{v:.68,out:416,h:-73,height:148,radius:19,sides:9,lean:12,rotation:.2});
 // Strong, thick diagonal city circulation spans, attached at both ends.
 for(const [v,w,o,p,height] of [
  [.21,.38,250,338,-56],[.47,.68,334,309,-43],[.72,.88,318,366,-30]
 ]){
  strut(t,1,loc(frame(s,v),0,o,height),
   loc(frame(s,w),0,p,height+22),10);
 }
 // Open sky strata are real; illuminated structural edges limited to a few
 // large silhouette seams, rather than making another rainbow scaffolding.
 for(const z of canopy){
  const n=20;
  for(let i=1;i<n-1;i+=2){
   const v=z.a+(z.b-z.a)*i/n,w=z.a+(z.b-z.a)*(i+1)/n;
   strut(t,4,loc(frame(s,v),0,z.out1+14,z.base+z.peak*.72),
    loc(frame(s,w),0,z.out1+14,z.base+z.peak*.72),1.8);
  }
 }
 // Fixed BM offset is a placement aid ONLY. No gameplay camera transform.
 const verts=[];
 for(const stream of t){
  for(let i=0;i<stream.length;i+=6){
   stream[i]+=shift[0];stream[i+1]+=shift[1];stream[i+2]+=shift[2];
   if(i%30===0)verts.push([stream[i],stream[i+1],stream[i+2]]);
  }
 }
 const stages=nativeFrames?.stages?.[b.road]?.frames;
 if(!stages||stages.length!==3)throw Error('BN missing real BG camera for visual projection QA');
 const projection=stages.map(f=>{
  const front=unit(f.front),right=unit(cross(front,[0,1,0])),up=unit(cross(right,front));
  let hit=0,total=0,roadOverlap=0;
  for(const p of verts){
   const r=sub(p,f.eye),depth=dot(r,front);total++;
   if(depth<3)continue;
   const x=1.35*dot(r,right)/(928/540*depth),y=1.35*dot(r,up)/depth;
   if(Math.abs(x)>1||Math.abs(y)>1)continue;
   hit++;
   if(x>-.32&&x<.65&&y>-.82&&y<.12)roadOverlap++;
  }
  return {id:f.id,speedMps:f.speedMps,visibleFraction:round(hit/Math.max(total,1)),
   roadRegionFraction:round(roadOverlap/Math.max(hit,1))};
 });
 if(projection.filter(x=>x.visibleFraction>.025).length<2)
  throw Error('BN candidate fell out of actual 240Hz view: '+JSON.stringify(projection));
 const meta={schema:'dopagaki.g4e7bk-private-material-city/1',
  visualCandidate:'G4E-7BN-BREAKWATER-CITADEL',authoring:'SCRIPTED_REAL_3D_NOT_BLENDER',
  cameraTarget:'GENUINE_BG_240HZ_P96_NOT_HUMAN',
  baseCameraRegistration:'G4E-7BM_FIX_WORLD_COORDINATES',
  road:b.road,sourceStageId:doc.stageForge.recordStageId,
  realB48:7,realB51:28,genuineCell52:true,officialSlope2Meters:0,
  districts:1,asymmetricCanopyWings:2,thickCityTerraces:tiers.length,
  inhabitedTowers:5,mainTowerHeightMeters:302,
  nativeProjectionChecks:projection,humanQA:'HOLD',artApproval:'HOLD',publication:'HOLD'};
 if(JSON.stringify(doc)!==frozen)throw Error('BN altered canonical B48 physics');
 return glbFromTriangles(t,meta);
}
