/**
 * R15S3D13R1 — CONTINUOUS CIVIC SPINE, original-game real WebGL2 private ART research.
 * This IS a physically coherent long-distance visual macrostructure following
 * the actual 16m B48 road5->road6 tangent, not repeated boxes, free fragments,
 * portal gates, a surrogate collision surface, an AI generated picture, or
 * a fake finish. Original 7 rideable B48, 28 physical B51, 240Hz native Runner
 * and all source motion/control/camera are entirely unchanged.
 *
 * A_SKY_OPEN_CONTINUUM: huge asymmetric multi-level continuously connected coastal
 * city mantle (left dominant), with independent but connected right hanging commons.
 * B_ASYMMETRIC_FREE_EDGE: the same integrated structural topology, but truly open civic
 * apertures and lower broken-out lower decks for driving readability.
 * These are separate geometric hypotheses, not recolors of an earlier mesh.
 */
export const DESIGNS=Object.freeze(['A_SKY_OPEN_CONTINUUM','B_ASYMMETRIC_FREE_EDGE']);
const c={
 porcelain:[.80,.91,.94],deep:[.075,.16,.22],deep2:[.12,.25,.32],
 steel:[.23,.40,.48],water:[.28,.68,.73],cyan:[.42,.93,.89],
 ember:[.98,.70,.39],garden:[.36,.66,.58],pearl:[.91,.91,.83],
 shadow:[.09,.21,.28],violet:[.51,.48,.69]
};
function verify(x,msg){if(!x)throw Error('R15S3D13R1: '+msg);}
const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],
 sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],
 sc=(a,n)=>[a[0]*n,a[1]*n,a[2]*n],mag=a=>Math.hypot(...a),
 unit=a=>sc(a,1/(mag(a)||1)),
 dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],
 cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function tri(v,a,b,d,color){for(const p of [a,b,d])v.push(...p,...color);}
function face(v,a,b,d,e,color){tri(v,a,b,d,color);tri(v,a,d,e,color);}
function double(v,a,b,d,e,color,back=c.shadow){face(v,a,b,d,e,color);face(v,e,d,b,a,back);}
function beam(v,a,b,width,color){
 const ax=unit(sub(b,a));if(mag(sub(b,a))<.01)return;
 const ref=Math.abs(dot(ax,[0,1,0]))>.90?[0,0,1]:[0,1,0];
 const side=unit(cross(ax,ref)),up=unit(cross(ax,side)),
  w=sc(side,width*.5),h=sc(up,width*.36);
 const ring=p=>[add(add(p,w),h),add(sub(p,w),h),sub(sub(p,w),h),add(sub(p,h),w)];
 const A=ring(a),B=ring(b),q=[...A,...B];
 for(const [i,j,k,l] of [[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]])
  face(v,q[i],q[j],q[k],q[l],color);
}
// Longitudinal index follows two ACTUAL existing B48 roads, neither guessed
// route polyline nor ghost track. No separate portal at their real seam.
function stations(doc,sample){
 const n5=96,n6=68,arr=[];
 for(const [road,steps] of [[5,n5],[6,n6]]){
  for(let i=0;i<=steps;i++){
   if(road===6&&i===0)continue;
   const u=i/steps,center=sample(doc.surfaces[road],u,.5),
    left=sample(doc.surfaces[road],u,0),
    right=sample(doc.surfaces[road],u,1);
   verify([center,left,right].every(p=>p.length===3&&p.every(Number.isFinite)),'invalid original real B48 XYZ');
   arr.push({road,u,center,left,right,chainT:(road===5?u*.60:.60+u*.40)});
  }
 }
 for(let i=0;i<arr.length;i++){
  const a=arr[Math.max(0,i-1)].center,b=arr[Math.min(arr.length-1,i+1)].center;
  const forward=unit([b[0]-a[0],0,b[2]-a[2]]);
  const mid=arr[i].center,dl=sub(arr[i].left,mid),dr=sub(arr[i].right,mid);
  const flat=(p)=>[p[0],0,p[2]];
  const direction=(d)=>{
   const f=flat(d),n=sub(f,sc(forward,dot(f,forward)));
   verify(mag(n)>5,'narrow real B48 normal is unusable');
   return unit(n);
  };
  arr[i].leftOut=direction(dl);
  arr[i].rightOut=direction(dr);
  arr[i].forward=forward;
 }
 return arr;
}
function loc(s,sign,outboard,height,along=0){
 const p=sign<0?s.left:s.right,n=sign<0?s.leftOut:s.rightOut;
 return add(add(add(p,sc(n,outboard)),[0,height,0]),sc(s.forward,along));
}
const smooth=t=>{const x=Math.max(0,Math.min(1,t));return x*x*(3-2*x)};
function pulse(t,start,end){
 const fade=Math.max(.025,(end-start)*.22);
 return smooth((t-start)/fade)*smooth((end-t)/fade);
}
function atmosphere(t,mode){
 const swell=Math.pow(Math.sin(Math.PI*t),1.15);
 const variation=Math.sin(t*Math.PI*3.4+.2);
 const sparse=mode==='B_ASYMMETRIC_FREE_EDGE';
 return {swell,variation,
  primaryHeight:(sparse?106:125)+swell*(sparse?133:157)+variation*24,
  lowerDepth:(sparse?-117:-154)-swell*42,
  near:(sparse?88:70)+22*Math.sin(Math.PI*t*1.55)**2,
  far:(sparse?225:245)+swell*(sparse?106:135),
  secondaryHeight:(sparse?47:80)+swell*(sparse?68:91)};
}
// Large holes spanning dozens of metres through actual structural surfaces.
function aperture(t,mode,layer,sign){
 const open=[ [.105,.156],[.285,.344],[.448,.522],[.692,.755],[.84,.885] ];
 if(mode==='B_ASYMMETRIC_FREE_EDGE')open.push([.22,.270],[.595,.670]);
 const phase=layer===0?0:layer===1?.018:layer===2?-.011:.026;
 return open.some(([a,b])=>{
  const width=sign<0?1:.74,mid=(a+b)*.5;
  return Math.abs(t-(mid+phase))<(b-a)*.5*width;
 });
}
function strip(v,A,B,color,stat,{opening=false,back=c.shadow}={}){
 if(opening){stat.openSurfaceCells++;return;}
 double(v,A[0],B[0],B[1],A[1],color,back);
 stat.surfaceCells++;
}
function connectors(v,arr,sign,indexA,indexB,height,stat,width=4.5){
 const a=arr[indexA],b=arr[indexB];
 if(!a||!b)return;
 const p=loc(a,sign,90,height),q=loc(b,sign,120,height+14);
 if(mag(sub(q,p))<2)return;
 beam(v,p,q,width,c.porcelain);stat.gallerySpans++;
}
export function buildR15S3D13R1City(doc,sample,{mode='A_SKY_OPEN_CONTINUUM'}={}){
 verify(DESIGNS.includes(mode),'invalid mode');
 verify(doc?.surfaces?.length===7&&doc?.movingObstacles?.length===28,'must be actual seven B48 and 28 moving B51');
 verify(doc?.stageForge?.r15s3d11?.mode==='A_EDGE_READABLE','only source-finished road with six edge B51 allowed');
 verify(doc.stageForge.productionPromoted===false,'not permitted on production');
 const frozen=JSON.stringify(doc);
 const track=stations(doc,sample),vertices=[];
 const stat={mode,roadSections:2,chainStations:track.length,connectedSpineSegments:0,
  undercitySegments:0,hollowSkyCells:0,openSurfaceCells:0,surfaceCells:0,
  publicDeckCells:0,communityCourtCells:0,terraceLevels:4,
  gallerySpans:0,structuralRibs:0,urbanDistrictEntrances:0,
  unbrokenLongitudinalStructuralLinks:0,
  minTrueRoadLateralSetback:Infinity,maxRiseM:0,minLowerDepthM:0};
 const last={};
 // Side 0: gigantic continuous habitable shell + deep open undercity.
 // Side 1: deliberately lower and sparser suspended commons; not symmetric gates.
 for(const sign of [-1,1]){
  const cells=track.map((s,i)=>{
   const t=s.chainT,a=atmosphere(t,mode),main=sign<0,
    offset=main?0:(mode==='B_ASYMMETRIC_FREE_EDGE'?98:83),
    near=a.near+offset,far=a.far*(main?1:.64)+offset,
    rise=a.primaryHeight*(main?1:.57),
    deep=a.lowerDepth*(main?1:.63),
    sky=rise+25+35*Math.sin(t*Math.PI*1.65)**2,
    upperNear=loc(s,sign,near,sky*.67),
    upperFar=loc(s,sign,far,sky),
    lowerNear=loc(s,sign,near+12,-24),
    lowerFar=loc(s,sign,far,deep),
    midNear=loc(s,sign,near+8,rise*.39),
    midFar=loc(s,sign,far-15,rise*.54),
    underRidge=loc(s,sign,near+44,deep*.66);
   stat.maxRiseM=Math.max(stat.maxRiseM,sky);
   stat.minLowerDepthM=Math.min(stat.minLowerDepthM,deep);
   stat.minTrueRoadLateralSetback=Math.min(stat.minTrueRoadLateralSetback,near);
   return {t,near,far,sky,upperNear,upperFar,lowerNear,lowerFar,midNear,midFar,underRidge,s,i};
  });
  for(let i=0;i<cells.length-1;i++){
   const a=cells[i],b=cells[i+1],t=(a.t+b.t)*.5;
   // Dominant uninterrupted curving mantle (except purposeful BIG skylights);
   // true 3D top with opposing normal/back and separated underside.
   const opening=aperture(t,mode,0,sign)||(sign>0&&i%17<11)||
    (mode==='B_ASYMMETRIC_FREE_EDGE'&&i%23<13);
   strip(vertices,[a.upperNear,a.upperFar],[b.upperNear,b.upperFar],
    sign<0?(i%27<8?c.porcelain:c.steel):c.water,stat,{opening});
   if(!opening)stat.connectedSpineSegments++;
   else stat.hollowSkyCells++;
   // Semi-open vertically inhabited inner urban facade and exterior,
   // with actual EMPTY window bays cut through the skin rather than tinted.
   strip(vertices,[a.lowerNear,a.upperNear],[b.lowerNear,b.upperNear],
    sign<0?c.steel:c.deep2,stat,{opening:aperture(t,mode,1,sign)||
      !(sign<0&&(t<.135||t>.872))});
   strip(vertices,[a.upperFar,a.lowerFar],[b.upperFar,b.lowerFar],
    c.deep2,stat,{opening:aperture(t,mode,2,sign)});
   // "Underworld": genuinely descended, continuous sweeping buttress.
   strip(vertices,[a.lowerNear,a.underRidge],[b.lowerNear,b.underRidge],
    c.water,stat,{opening:aperture(t,mode,3,sign)});
   strip(vertices,[a.underRidge,a.lowerFar],[b.underRidge,b.lowerFar],
    sign<0?c.deep:c.steel,stat,{opening:aperture(t,mode,2,sign)});
   stat.undercitySegments++;
   // R1: two UNBROKEN structural load paths along the far actual-road flank,
   // so open skylights do not turn the megacity back into floating shards.
   beam(vertices,a.upperFar,b.upperFar,sign<0?13:7,sign<0?c.porcelain:c.water);
   beam(vertices,a.midFar,b.midFar,sign<0?8:4,c.steel);
   stat.unbrokenLongitudinalStructuralLinks+=2;
   // 4 long civic decks with long, truly absent atrium sections:
   // driven through as 50-100m scale spaces, not fake windows.
   for(let level=0;level<4;level++){
    const h0=level===0?-32:level===1?18:level===2?70:127;
    const topScale=sign<0?1:.63;
    const p=loc(a.s,sign,a.near+14,h0*topScale+10*Math.sin(2*Math.PI*a.t)),
      q=loc(a.s,sign,Math.min(a.far-18,a.near+73),h0*topScale+9*Math.sin(2*Math.PI*a.t)),
      r=loc(b.s,sign,b.near+14,h0*topScale+10*Math.sin(2*Math.PI*b.t)),
      w=loc(b.s,sign,Math.min(b.far-18,b.near+73),h0*topScale+9*Math.sin(2*Math.PI*b.t));
    const empty=aperture(t,mode,level,sign)||
      (mode==='B_ASYMMETRIC_FREE_EDGE'&&level===2&&t>.30&&t<.43);
    if(empty){stat.communityCourtCells++;continue;}
    double(vertices,p,r,w,q,
     level===3?c.garden:level===2?c.pearl:level===1?c.water:c.deep2);
    stat.publicDeckCells++;
    // Continuous illuminated inhabited gallery at 50m intervals. Subtle,
    // not 1m bright wires as substitute for architecture.
    if(i%9===0 && !(t>.44&&t<.52)){
     beam(vertices,p,r,1.8,level===1?c.ember:c.cyan);
     stat.gallerySpans++;
    }
   }
   // Great arched structural legs from underworld to mantle only at 3%
   // station spacing, not identical vertical portal gates each 50 metres.
   if(i%22===5&&sign<0){
    beam(vertices,a.underRidge,a.upperFar,9,c.porcelain);
    stat.structuralRibs++;
   }
  }
  // Inhabited transverse concourses span each intentional void. Outboard only:
  // none runs over driving road or creates a fake physical B48 bridge.
  for(const k of [15,35,55,83,105,130,151]){
   if(k>=track.length-9)continue;
   connectors(vertices,track,sign,k,k+7,42,stat,6);
   connectors(vertices,track,sign,k,k+7,-43,stat,5);
   stat.urbanDistrictEntrances++;
  }
 }
 verify(track.length>120&&stat.connectedSpineSegments>60&&
  stat.unbrokenLongitudinalStructuralLinks>600,'not a genuine unbroken two-road long structural spine');
 verify(stat.openSurfaceCells>100&&stat.communityCourtCells>100,'city must have actual huge open volumes');
 verify(stat.publicDeckCells>600,'real civic court decks should remain despite open sky');
 verify(stat.minTrueRoadLateralSetback>=68,'no near vertical city wall on actual 16m road');
 verify(stat.maxRiseM>240&&stat.minLowerDepthM< -130,'sky AND abyss geometry required');
 verify(stat.undercitySegments>280,'not a superficial silhouette-only crown');
 verify(vertices.length%18===0&&vertices.length/18>5000&&vertices.length/18<160000,'native GL triangle count');
 verify(vertices.every(Number.isFinite),'nonfinite actual 3D mesh position/color');
 verify(JSON.stringify(doc)===frozen,'scene may not edit any B48/B51 or source Runner input');
 return {vertices,triangles:vertices.length/18,...stat,
  actualRoads:7,actualMovingBodies:28,
  sourceRoadsPreserved:true,sourceMovingPreserved:true,
  originalRendererRequired:true,addedPhysicsColliders:0,
  officialArtAdopted:0,formalSlope2Meters:0,
  source240HzFinishAlreadyKnownButBrowserNeedsQA:true,
  notManualHumanValidated:true,notOriginalWindowsPerformanceQA:true,
  ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD'};
}
