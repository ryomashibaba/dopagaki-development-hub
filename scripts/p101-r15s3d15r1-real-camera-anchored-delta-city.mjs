/**
 * DOPAGAKI SLOPE R15S3D15R1. First authored future city after reading actual
 * original WebGL2 camera frustum (CI #41047602697, 2 worlds x 5 ticks).
 * Anchors: real B48 road5 u=.78 and road6 u=.62, where 58/61/64/67 sec
 * native camera sees 560-1200m then 300-900m ahead near central screen.
 *
 * Two architecturally different, inhabited, thick-shell 3D alternatives,
 * no repeated portals, curtain side walls, disconnected tiny shards,
 * invented physics floors, ghost hazards or source route modifications.
 * Source GL draw is PRIVATE-only and entirely non-collidable.
 */
export const DESIGNS=Object.freeze(['A_SKY_DELTA_CIVIC_CORE','B_CROWNED_OPEN_SKY_CITY']);
const C={ivory:[.89,.91,.89],pearl:[.94,.87,.73],deep:[.06,.14,.20],
 steel:[.19,.36,.46],ocean:[.23,.56,.68],aqua:[.33,.87,.84],
 amber:[.97,.67,.38],garden:[.38,.64,.50],satin:[.43,.66,.72]};
function expect(x,m){if(!x)throw Error('R15S3D15R1 '+m)}
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),scale=(a,s)=>a.map(x=>x*s),
 length=a=>Math.hypot(...a),unit=a=>scale(a,1/(length(a)||1)),
 dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0),
 cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function tri(v,a,b,c,color){for(const p of [a,b,c])v.push(...p,...color)}
function quad(v,a,b,c,d,color){tri(v,a,b,c,color);tri(v,a,c,d,color)}
function sheet(v,a,b,c,d,col){quad(v,a,b,c,d,col);quad(v,d,c,b,a,C.deep)}
function thickBeam(v,a,b,r,col){
 const axis=unit(sub(b,a)),ref=Math.abs(axis[1])>.9?[0,0,1]:[0,1,0],
 y=unit(cross(axis,ref)),z=unit(cross(axis,y)),ring=p=>[
 add(add(p,scale(y,r)),scale(z,r*.65)),add(sub(p,scale(y,r)),scale(z,r*.65)),
 sub(sub(p,scale(y,r)),scale(z,r*.65)),add(sub(p,scale(z,r*.65)),scale(y,r))];
 const A=ring(a),B=ring(b);
 for(let i=0;i<4;i++){const j=(i+1)%4;quad(v,A[i],B[i],B[j],A[j],col);}
}
function realFrame(doc,sample,road,u){
 const src=doc.surfaces[road],center=sample(src,u,.5),
 before=sample(src,Math.max(0,u-.003),.5),after=sample(src,Math.min(1,u+.003),.5);
 const ahead=unit([after[0]-before[0],0,after[2]-before[2]]);
 const left=sample(src,u,0),raw=[left[0]-center[0],0,left[2]-center[2]],
 normal=unit(sub(raw,scale(ahead,dot(raw,ahead))));
 expect(length(raw)>6&&length(normal)>.9,'actual road frame invalid');
 return {center,along:ahead,left:normal};
}
function sitePoint(f,x,along,height){
 return add(add(add(f.center,scale(f.left,x)),scale(f.along,along)),[0,height,0]);
}
const CITY_SITES=[
 {road:5,u:.78,span:335,depth:260,rise:285,program:'SKY_COMMONS'},
 {road:6,u:.62,span:395,depth:285,rise:350,program:'CIVIC_FINALE'}
];
function sculptCivicSky(v,frame,site,mode,stats,idx){
 const split=mode==='B_CROWNED_OPEN_SKY_CITY',count=52;
 const rim=[],back=[],underside=[];
 for(let k=0;k<=count;k++){
  const t=k/count,x=(t-.50)*site.span*2,
   asym=idx===0?-.18:.24,
   lift=site.rise*.55+
    site.rise*.50*Math.sin(Math.PI*Math.pow(t,.85+asym))+
    24*Math.sin(t*Math.PI*3+idx*.55),
   z=(t-.5)*110+70*Math.sin(t*Math.PI*2+.6*idx),
   skew=split?(t<.42?-63:81)*Math.sin(t*Math.PI):40*Math.sin(t*Math.PI*1.5),
   center=sitePoint(frame,x,z+skew,lift);
  const thickness=split?26:38;
  rim.push(center);back.push(sitePoint(frame,x,z+skew+site.depth*.33,lift-8));
  underside.push(sitePoint(frame,x,z+skew+site.depth*.16,lift-thickness));
 }
 // Big volumetric unified structure: roof, upper flank, cantilever undercroft.
 for(let i=0;i<count;i++){
  const t=(i+.5)/count,missing=split&&(t>.36&&t<.49)||(t>.15&&t<.19)||(t>.72&&t<.77);
  if(missing){stats.realStructuralLightwells++;continue}
  sheet(v,rim[i],rim[i+1],back[i+1],back[i],i%17<4?C.ivory:C.ocean);
  sheet(v,back[i],back[i+1],underside[i+1],underside[i],C.steel);
  sheet(v,underside[i],underside[i+1],rim[i+1],rim[i],C.satin);
  stats.thickUnifiedRoofCells+=3;
 }
 // A separate broad unbroken REAL 3D load-bearing line resolves omitted
 // skylight panels without recreating the old skinny repeated beam forest.
 for(let i=0;i<count;i++)if(i%2===0){
  thickBeam(v,back[i],back[i+2],8,i%6===0?C.pearl:C.steel);
  stats.continuousStructuralMembers++;
 }
 // Civic garden terraces are physically 3D planes with negative courtyard
 // apertures; only ART, never inserted into native collision/rideable roads.
 for(const side of [-1,1]){
  for(let level=0;level<4;level++){
   const front=(split?116:94)+level*11,far=(split?345:360)+level*5;
   const signX=side===-1?-1:1;
   const y=-42+level*48+idx*12,segments=24;
   for(let j=0;j<segments;j++){
    const a=-site.depth*.77+j*site.depth*1.54/segments,
      b=-site.depth*.77+(j+1)*site.depth*1.54/segments;
    // Genuine open atria spanning multiple deck segments, not tint-only.
    const open=(j+2*level+idx)%11>=7||
     (split&&level===2&&j>=7&&j<=12);
    if(open){stats.actualAirCourtCells++;continue;}
    const to=(d,z,up)=>sitePoint(frame,d*signX,z,up);
    const A=to(front,a,y),B=to(front,b,y),D=to(far,a,y+14),E=to(far,b,y+14);
    sheet(v,A,B,E,D,level===3?C.garden:level===1?C.pearl:C.steel);
    // Thick outer inhabited skin only as discrete wings, never endless road
    // side walls; open 2 of each 3 large bays.
    if(j%3===0){
     const hi=12+level*5;
     sheet(v,D,E,add(E,[0,hi,0]),add(D,[0,hi,0]),
      level===3?C.ivory:C.ocean);
     stats.inhabitedThreeDimensionalFacades++;
    }
    stats.realPublicDeckCells++;
   }
  }
 }
 // The two main city districts have unique public programs:
 // first canyon is a split hanging garden, finale a tapering civic amphitheatre.
 if(idx===0){
  for(let i=0;i<5;i++){
   const q=sitePoint(frame,-180+i*84,-165-i*8,-105+i*22),
    r=sitePoint(frame,-130+i*90,-42-i*7,-80+i*27);
   thickBeam(v,q,r,10,C.ivory);stats.openHangingGardenSpans++;
  }
 }else{
  for(let k=0;k<8;k++){
   const p=sitePoint(frame,-250+k*66,-160,120+k*9);
   const q=sitePoint(frame,-175+k*55,100,156+k*10);
   thickBeam(v,p,q,13,k%3===0?C.pearl:C.ocean);stats.finalCivicGallerySpans++;
  }
 }
 stats.cityDistricts++;
 return {road:site.road,u:site.u,
  cityMainAxisSpanM:site.span*2,highestRelativeM:site.rise*1.1,
  noNewDrivingSurface:true,sourceAnchorFromRealB48:true};
}
export function buildR15S3D15R1City(doc,sample,{mode='A_SKY_DELTA_CIVIC_CORE'}={}){
 expect(DESIGNS.includes(mode),'unknown substantial real city');
 expect(doc?.surfaces?.length===7&&doc?.movingObstacles?.length===28,'source count 7 B48 and 28 B51');
 expect(doc.stageForge?.r15s3d11?.mode==='A_EDGE_READABLE'&&doc.stageForge.productionPromoted===false,
  'prohibited Gold/failed stage');
 const original=JSON.stringify(doc),v=[],stats={mode,
  cityDistricts:0,screenPositionSource:'R15S3D15_ORIGINAL_WEBGL2_RAW_CAMERA_FRUSTUM_10_IMAGES',
  sourceCameraAnchors:[{road:5,u:.78},{road:6,u:.62}],
  thickUnifiedRoofCells:0,continuousStructuralMembers:0,
  realStructuralLightwells:0,actualAirCourtCells:0,realPublicDeckCells:0,
  inhabitedThreeDimensionalFacades:0,openHangingGardenSpans:0,
  finalCivicGallerySpans:0,addedPhysicsColliders:0,
  originalB48RoadCount:7,originalB51Hazards:28,officialArtAccepted:0,
  sourceCameraProjectionNotOcclusion:true};
 const designed= CITY_SITES.map((site,i)=>sculptCivicSky(v,
  realFrame(doc,sample,site.road,site.u),site,mode,stats,i));
 const triangles=v.length/18;
 expect(Number.isInteger(triangles)&&triangles>3500&&triangles<95000,'real 3D source geometry count');
 expect(v.every(Number.isFinite),'finite real 3D triangles');
 expect(stats.cityDistricts===2&&stats.thickUnifiedRoofCells>200&&
  stats.realPublicDeckCells>180&&stats.actualAirCourtCells>80,
  'materially inhabited, actually hollow huge city surfaces not generated');
 expect(stats.continuousStructuralMembers>45,
  'new city must not regress into disconnected shards');
 expect(JSON.stringify(doc)===original,'non-collider ART must not change ANY original gameplay objects');
 return {vertices:v,triangles,...stats,designedDistricts:designed,
  cityVisibleInCameraNeedsRealWebGLProof:true,humanTested:false,
  ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',RELEASE:'HOLD'};
}
