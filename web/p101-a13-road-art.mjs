/**
 * A13 W8: high-speed road armour / asymmetrical wing chevrons.
 * GPU only; all pieces are projected to genuine seven B48 rideable skins.
 * No fabricated floors, fixed barriers, auto steering or safe-lane marking.
 */
const palette=[
 [[.2,1,.96],[.29,.5,1],[1,.36,.48]],
 [[1,.67,.27],[.22,.9,1],[1,.37,.5]],
 [[.28,1,.8],[.62,.45,1],[1,.7,.3]],
 [[1,.7,.36],[.98,.28,.7],[.3,.86,1]],
 [[.37,.72,1],[.8,.38,1],[1,.48,.38]],
 [[1,.49,.87],[.39,.94,1],[1,.84,.44]],
 [[.27,.95,1],[.72,.5,1],[1,.47,.39]]
];
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function arc(road,sample){
 const p=Array.from({length:129},(_,i)=>sample(road,i/128,.5)),c=[0];
 for(let i=1;i<129;i++)c.push(c.at(-1)+Math.hypot(...p[i].map((x,k)=>x-p[i-1][k])));
 return {total:c.at(-1),u(d){
  const x=clamp(d,0,c.at(-1));let lo=0,hi=128;
  while(hi-lo>1){let m=(hi+lo)>>1;if(c[m]<x)lo=m;else hi=m;}
  return (lo+clamp((x-c[lo])/(c[hi]-c[lo]||1),0,1))/128;
 }};
}
function place(road,u,v,sample,frame){
 const p=sample(road,u,v),n=frame(road,u,v).normal,up=n[1]<0?-.29:.29;
 return p.map((x,k)=>x+n[k]*up);
}
function triangle(out,road,pts,col,sample,frame){
 for(const [u,v] of pts)out.push(...place(road,u,v,sample,frame),...col);
}
function quad(out,road,a,b,v0,v1,col,sample,frame){
 triangle(out,road,[[a,v0],[b,v0],[b,v1]],col,sample,frame);
 triangle(out,road,[[a,v0],[b,v1],[a,v1]],col,sample,frame);
}
// G4E-7P: independent GPU-only study on genuine B48 narrow-road surfaces.
export const G4E7P_NARROW_WINDOWS=Object.freeze([
 Object.freeze({section:0,uStart:.31,uEnd:.735}),
 Object.freeze({section:1,uStart:.055,uEnd:.305})
]);
export function g4e7pAllowed(doc){
 const sf=doc?.stageForge,physical=sf?.g4e7mRealRoad,variant=physical?.variant;
 return (variant==='thread'||variant==='precipice')&&
  sf.recordStageId==='VB-P101-A13-W9C2-G4E7M-'+variant.toUpperCase()&&
  sf.variant==='A13_GAMEPLAY_ISOLATED'&&sf.productionPromoted===false&&
  sf.studyOnly==='PRIVATE_REAL_PHYSICS_NOT_APPROVED'&&
  physical.source==='G4E7F_GLIDE_GENUINE_B48'&&
  physical.realCollisionRoads===7&&physical.movingObstacles===28&&
  physical.certifiedSlopeDnaMeters===0&&physical.windows?.length===2&&
  doc.surfaces?.length===7&&doc.movingObstacles?.length===28;
}
export function a13RacingRoadArt(doc,sample,frame,{quietSkyline=false,quietNarrow=false}={}){
 if(quietSkyline&&quietNarrow)throw Error('G4E-7K and G4E-7P independent studies');
 if(quietNarrow&&!g4e7pAllowed(doc))
  throw Error('G4E-7P private B48 narrow road only');
 // G4E-7K is a PRIVATE, explicit, nonphysical visual alternative only.
 // Never change the W7F Gold or any ordinary A13 art output via defaults.
 if(quietSkyline&&(doc?.stageForge?.recordStageId!=='VB-P101-A13-W9C2-G4E7G-GLIDE'||
   doc?.stageForge?.g4e7gVisualTrial?.kind!=='glide'||doc?.stageForge?.g4e7fPhysicalStudy?.variant!=='glide'||
   doc?.stageForge?.productionPromoted!==false))
  throw Error('G4E-7K quiet chevrons permitted only on real private G4E7G GLIDE');
 if(doc?.stageForge?.variant!=='A13_GAMEPLAY_ISOLATED')
  return {vertices:[],segments:0,sections:0,nonCollision:true};
 if(doc.surfaces?.length!==7||typeof sample!=='function'||typeof frame!=='function'||
    doc.surfaces.some(s=>!s.collidable||!s.rideable||s.rows!==31||s.cols!==5))
  throw Error('W8 must use seven actual collidable B48 skin surfaces');
 const vertices=[];let segments=0,quietChevrons=0,quietTriangleSavings=0;
 const narrowBySection=[0,0];
 for(const [section,s] of doc.surfaces.entries()){
  // W9-C2: a 22m wide S-crest cannot carry all W8 giant chevrons:
  // overlapping paint hid the true road edge and upcoming curvature in
  // matched real-WebGL images. Remove them ONLY on that one trial surface.
  // Real physical edge lighting from P100/P101 remains unchanged.
  if(doc.stageForge.w9c2PhysicalStudy?.section===section)continue;
  const profile=arc(s,sample),[glow,glow2,accent]=palette[section];
  for(let d=7;d+25<profile.total;d+=34){
   const a=profile.u(d),b=profile.u(d+19),c=profile.u(d+25);
   // G4E-6D: no GPU chevron, wing plate or paint can bridge a missing REAL
   // physical road strip. Keep most visual art; cut only the gap neighborhood.
   const gap=section===0&&doc.stageForge.g4e7qStudy?.gap?
    doc.stageForge.g4e7qStudy.gap:
    doc.stageForge.g4e6EarlyGap?.section===section?doc.stageForge.g4e6EarlyGap:null;
   if(gap&&a<=gap.uLanding+.015&&c>=gap.uTakeoff-.015)continue;
   // Quiet only the real first-road S-shaped approach. Preserve all lateral
   // outer-edge styling, hazard warning shapes and all remaining road panels.
   // Segment suppression is conservative (whole motifs) and does NOT change
   // the B48 lattice, collisions, obstacles, camera or route geometry.
   const w=quietNarrow?G4E7P_NARROW_WINDOWS.find(x=>x.section===section):null;
   const quietThis=(quietSkyline&&section===0&&b>=.28&&a<=.85)||
    Boolean(w&&b>=w.uStart&&a<=w.uEnd);
   const oldVertexCount=vertices.length;
   for(const [v0,v1] of [[.02,.11],[.89,.98]])quad(vertices,s,a,c,v0,v1,[.03,.085,.13],sample,frame);
   if(!quietThis)for(const [v0,v1] of [[.12,.22],[.78,.88]])
    quad(vertices,s,a,b,v0,v1,[.065,.14,.21],sample,frame);
   quad(vertices,s,b,c,.04,.09,glow,sample,frame);
   quad(vertices,s,b,c,.91,.96,accent,sample,frame);
   if(!quietThis){
    triangle(vertices,s,[[a,.24],[b,.24],[c,.33]],glow2,sample,frame);
    triangle(vertices,s,[[a,.76],[b,.76],[c,.67]],accent,sample,frame);
    const phase=Math.floor(d/34)%3;
    if(phase===0){
     quad(vertices,s,a,b,.37,.41,glow2,sample,frame);
     quad(vertices,s,a,b,.59,.63,glow,sample,frame);
    }else if(phase===1){
     triangle(vertices,s,[[a,.36],[c,.36],[b,.46]],glow,sample,frame);
    }else triangle(vertices,s,[[a,.64],[c,.64],[b,.54]],glow2,sample,frame);
   }
   if(quietThis){
    quietChevrons++;
    if(quietNarrow)narrowBySection[section]++;
    // Source returns only the retained GPU triangles, not fake paint over
    // the removed center. Compare against exact original counted separately.
    quietTriangleSavings+=((Math.floor(d/34)%3===0)?10:7);
   }
   if(quietThis&&vertices.length<=oldVertexCount)throw Error('G4E7K cannot remove road-edge outline');
   segments++;
  }
 }
 if(segments<140||segments>400||vertices.length>180000||vertices.length%18!==0||!vertices.every(Number.isFinite))
  throw Error('W8 road art invalid or over GPU budget');
 const value={vertices,segments,sections:7,nonCollision:true,g4e6RealGapVisualClearance:!!(doc.stageForge.g4e6EarlyGap||doc.stageForge.g4e7qStudy?.gap)};
 if(quietSkyline){
  if(quietChevrons<3||quietChevrons>25)throw Error('G4E7K quiet real-road study span drift');
  value.g4e7k={active:true,section:0,normalizedWindow:[.28,.85],
   quietChevrons,removedInteriorOnly:true,outerRoadEdgePaintRetained:true,
   deletedTrianglesEstimate:quietTriangleSavings,nonCollision:true,
   originalB48GeometryUnchanged:true,officiallyApprovedSlopeDnaMeters:0};
 }
 if(quietNarrow){
  if(narrowBySection.some(n=>n<2))throw Error('G4E-7P narrow window has too few actual motifs');
  value.g4e7p={active:true,quietBySection:narrowBySection,
   windows:G4E7P_NARROW_WINDOWS.map(w=>({...w})),
   removedInteriorOnly:true,outerRoadEdgePaintRetained:true,
   quietChevrons,deletedTrianglesEstimate:quietTriangleSavings,
   originalB48GeometryUnchanged:true,nonCollision:true,officiallyApprovedSlopeDnaMeters:0};
 }
 return value;
}
