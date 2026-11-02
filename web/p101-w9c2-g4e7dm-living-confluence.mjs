/**
 * G4E-7DM / LIVING CONFLUENCE, PRIVATE-only temporal urban prototype.
 * The earlier giant ring and single megalith were rejected; do not add another
 * isolated monument. These are 6 small parts of ONE inhabited transit district,
 * all physically located on original B48 OUTBOARD banks. Galleries, concourses,
 * facades and hollow courts are colored real 3D (NOT flat screenshot overlays).
 * Genuine 240Hz camera, B48, B51 and public CX are untouched. ART HOLD.
 */
import {g4e7ciIntegratedStreetscape} from './p101-w9c2-g4e7ci-integrated-streetscape.mjs';
const P={chalk:[.75,.88,.89],shale:[.12,.27,.36],iron:[.24,.40,.48],
 deep:[.055,.12,.19],copper:[.92,.62,.23],cyan:[.32,.78,.83]};
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),
 mul=(a,s)=>a.map(v=>v*s),dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),
 unit=a=>mul(a,1/(Math.hypot(...a)||1));
function both(v,a,b,c,d,col){
 for(const [p,q,r] of [[a,b,c],[a,c,d],[d,c,b],[d,b,a]])
  for(const pt of [p,q,r])v.push(...pt,...col);
}
function roadBankFrame(doc,sample,u,side){
 const road=doc.surfaces[1],mid=sample(road,u,.5),
 edge=sample(road,u,side<0?0:1),before=sample(road,u-.003,.5),
 after=sample(road,u+.003,.5);
 const along=unit([after[0]-before[0],0,after[2]-before[2]]);
 const sideways=sub([edge[0]-mid[0],0,edge[2]-mid[2]],mul(along,dot(sub(edge,mid),along)));
 if(Math.hypot(...sideways)<2)throw Error('DM degenerate original B48 bank');
 return {edge,along,outward:unit(sideways)};
}
function at(f,x,d,h){
 return add(add(add(f.edge,mul(f.along,x)),mul(f.outward,d)),[0,h,0]);
}
function blended(a,b,t){return add(mul(a,1-t),mul(b,t));}



function occupiedQuarter(v,f,{tier=0,side=-1}={}){
 const start=v.length/18,p=(x,d,h)=>at(f,x,d,h);
 const rise=tier*9,base=8+rise,high=66+rise;
 let rooms=0,openCourts=0;
 // Two irregular, enclosed-depth residential wings around a TRUE open court.
 // The 26m-wide central court is real missing geometry, not glass/black paint.
 for(const sign of [-1,1]){
  const xlo=sign<0?-47:14,xhi=sign<0?-14:47;
  const d0=91+side*3,d1=151+side*3;
  for(let floor=0;floor<3;floor++){
   const h=base+floor*19,lean=sign*floor*2;
   const X0=xlo+lean,X1=xhi+lean,front=d0+floor*4,back=d1+floor*2;
   // Thickness and roof give a dwelling, with a genuine empty street-facing
   // 20x13m portal. Interior rooms are at 60+ metres depth behind the portal.
   both(v,p(X0,front,h),p(X1,front,h),p(X1,back,h+3),p(X0,back,h+3),
     floor===0?P.shale:P.iron);
   both(v,p(X0,back,h+3),p(X1,back,h+3),p(X1,back,h+17),
     p(X0,back,h+17),P.deep);
   for(const x of [X0,X1-3]){
    both(v,p(x,front,h),p(x+3,front,h),p(x+3,front,h+17),
      p(x,front,h+17),P.chalk);
   }
   // Intentionally no solid front between the end piers.
   both(v,p(X0,front,h+15),p(X1,front,h+15),
     p(X1,front+5,h+19),p(X0,front+5,h+19),P.chalk);
   for(const x of [X0,X1]){
    both(v,p(x,front,h),p(x,back,h+3),
      p(x,back,h+16),p(x,front,h+16),P.shale);
   }
   // Visible illuminated back of each occupied floor: actual depth,
   // not a window decal hiding a solid front facade.
   both(v,p(X0+5,back-.6,h+7),p(X1-5,back-.6,h+7),
     p(X1-5,back-.6,h+12),p(X0+5,back-.6,h+12),P.copper);
   rooms++;
  }
  // An irregular folded, FULL DEPTH skyline cap, not a thin billboard.
  const u0=xlo+side*2,u1=xhi+side*2;
  both(v,p(u0,88,high),p(u1,88,high+4),
    p(u1+8,158,high+18),p(u0+8,158,high+10),P.chalk);
  both(v,p(u0,88,high-5),p(u1,88,high-1),
    p(u1,88,high+4),p(u0,88,high),P.iron);
 }
 // The open-air public court is between real occupied wings, not an
 // enormous single rim. Only a compact arrival terrace near existing CX.
 both(v,p(-13,62,base),p(13,62,base),
   p(13,86,base+2),p(-13,86,base+2),P.shale);
 both(v,p(-12,84,base+2),p(12,84,base+2),
   p(12,91,base+3),p(-12,91,base+3),P.copper);
 openCourts++;
 // Two substantial, stepped urban side-returns connect the district to
 // a visual roadside promenade, without intersecting the real B48.
 for(const sign of [-1,1]){
  const x0=sign<0?-47:35,x1=sign<0?-35:47;
  both(v,p(x0,65,base),p(x1,65,base),
   p(x1,95,base+5),p(x0,95,base+5),P.iron);
 }
 return {triangles:v.length/18-start,rooms,openCourts,frontOpen:true,
  physicalColliders:0};
}
function transitLink(v,a,b){
 const start=v.length/18;
 // Concourse threads THROUGH the district's public arrival courts at
 // road-edge outboard distances, never over the actual driving surface.
 // Its solid edge has vertical depth, but no unbroken giant vertical wall.
 for(let k=0;k<4;k++){
  const t0=k/4,t1=(k+1)/4;
  const pa=blended(at(a,0,74,12),at(b,0,74,12),t0),
   pb=blended(at(a,0,74,12),at(b,0,74,12),t1);
  const out0=unit(blended(a.outward,b.outward,t0)),
   out1=unit(blended(a.outward,b.outward,t1));
  const A=add(pa,mul(out0,7)),B=sub(pa,mul(out0,7)),
   C=sub(pb,mul(out1,7)),D=add(pb,mul(out1,7));
  both(v,A,B,C,D,P.shale);
  // A legible thick platform underside, not a visual playable road.
  both(v,sub(A,[0,5,0]),sub(B,[0,5,0]),B,A,P.iron);
  if(k===0||k===3){
   both(v,add(A,[0,1,0]),add(D,[0,1,0]),
     add(D,[0,3,0]),add(A,[0,3,0]),P.copper);
  }
 }
 return {triangles:v.length/18-start,nonPhysical:true};
}
export function g4e7dgCanyonCandidate(doc,sample,{enabled=false,shots=null}={}){
 if(!enabled)return {active:false,vertices:[],sources:[],triangles:0,
  art:'HOLD',newRoads:0,newColliders:0,newMovingHazards:0};
 if(!Array.isArray(shots)||shots[0]?.id!=='t1500'||shots[1]?.id!=='t1700'||
   !['t1550','t1600','t1650'].every(id=>shots.some(s=>s.id===id))||
   shots.slice(0,2).some(s=>s.source!=='ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN'))
  throw Error('DM requires the unmodified continuous native 240Hz camera series');
 const snapshot=JSON.stringify(doc);
 const cx=g4e7ciIntegratedStreetscape(doc,sample,{enabled:true,shots});
 if(!cx.active||cx.landmarks!==2||cx.sources?.length<10)
  throw Error('DM requires unchanged genuine CX city');
 const vertices=[],sources=[],retained=[];
 for(const source of cx.sources){
  if(source.kind==='distant-folded-roofline')continue;
  const start=vertices.length/18;
  vertices.push(...cx.vertices.slice(source.firstTriangle*18,
   (source.firstTriangle+source.triangleCount)*18));
  sources.push({...source,firstTriangle:start});
  retained.push(source.kind);
 }
 // Not selected to maximize silhouette area. Reuse three EXISTING
 // inhabited CX station coordinates so visual transport/concourse
 // originates from already-authored districts, not isolated new sites.
 const stations=[.62,.73,.84];
 const districts=[],links=[];
 for(const side of [-1,1]){
  const frames=stations.map(u=>roadBankFrame(doc,sample,u,side));
  for(let i=0;i<frames.length;i++){
   const start=vertices.length/18;
   const detail=occupiedQuarter(vertices,frames[i],{side,tier:i});
   sources.push({kind:'dm-occupied-quarter',road:1,u:stations[i],side,
    firstTriangle:start,triangleCount:vertices.length/18-start});
   districts.push({u:stations[i],side,...detail});
  }
  for(let i=0;i<frames.length-1;i++){
   const start=vertices.length/18,detail=transitLink(vertices,frames[i],frames[i+1]);
   sources.push({kind:'dm-confluence-transit',road:1,side,
    firstTriangle:start,triangleCount:vertices.length/18-start});
   links.push({from:stations[i],to:stations[i+1],side,...detail});
  }
 }
 const triangles=vertices.length/18;
 if(triangles<1000||triangles>50000||!Number.isInteger(triangles)||
   vertices.some(x=>!Number.isFinite(x))||
   sources.reduce((n,s)=>n+s.triangleCount,0)!==triangles||
   sources.some((s,i)=>s.firstTriangle!==(i?sources[i-1].firstTriangle+sources[i-1].triangleCount:0))||
   JSON.stringify(doc)!==snapshot)
  throw Error('DM physical / geometry provenance failed closed');
 return {...cx,vertices,sources,triangles,
  dg:{id:'G4E7DM_PRIVATE_UNADOPTED_LIVING_CONFLUENCE',
   design:'LIVING_CONFLUENCE_INHABITED_TRANSIT_V1',
   retainedCXCityKind:retained,originalHeroCount:2,
   cityNarrative:'SIX_EXISTING_CX_STATION_NEIGHBORHOODS_CONNECTED_ALONG_TWO_BANKS',
   districts,links,occupiedRooms:districts.reduce((n,d)=>n+d.rooms,0),
   original7Roads:doc.surfaces.length,original28Movers:doc.movingObstacles.length,
   addedPhysicalGeometry:false},
  art:'HOLD',human:'HOLD',ready:'HOLD',publish:'HOLD',merge:'HOLD',
  newRoads:0,newColliders:0,newMovingHazards:0,physicalChanged:false,
  officialSlope2Meters:0};
}
