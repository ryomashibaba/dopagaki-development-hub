/**
 * G4E-7DI / SKY FJORD: PRIVATE-only urban-composition experiment.
 *
 * Hypothesis: a large, readable, inhabited negative-space corridor extending
 * BEHIND the existing CX landmark can communicate a city at 100m/s better
 * than DG's boxes or DH's opaque internal gallery wedge. The landmark and
 * existing road-traced civic foreground are copied without any modification.
 *
 * This file is NOT copied into the game build. Playwright substitutes it
 * for an already-existing private DG module URL in an isolated page only.
 * No surfaces, colliders, obstacles, camera, controls or physics are created.
 */
import {g4e7ciIntegratedStreetscape} from './p101-w9c2-g4e7ci-integrated-streetscape.mjs';

const C={
 shell:[.69,.85,.88], shadow:[.075,.16,.25], iron:[.19,.34,.43],
 dusk:[.12,.26,.39], glow:[.36,.88,.95], ember:[1,.61,.24],
 court:[.30,.44,.53]
};
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const mul=(a,s)=>a.map(v=>v*s);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const norm=a=>mul(a,1/(Math.hypot(...a)||1));
function face(out,a,b,c,d,color){
 for(const [p,q,r] of [[a,b,c],[a,c,d],[d,c,b],[d,b,a]])
  for(const point of [p,q,r])out.push(...point,...color);
}
function basis(doc,sample,site){
 const road=doc.surfaces[site.road],a=sample(road,site.u-.003,.5),
  b=sample(road,site.u+.003,.5),center=sample(road,site.u,.5),
  bank=sample(road,site.u,site.side<0?0:1);
 const along=norm([b[0]-a[0],0,b[2]-a[2]]);
 const delta=sub(bank,center),flat=[delta[0],0,delta[2]];
 const outward=norm(sub(flat,mul(along,dot(flat,along))));
 if(Math.hypot(...outward)<.99)throw Error('DI invalid real-road basis');
 return {edge:bank,along,outward};
}
function point(frame,x,depth,height){
 return add(add(add(frame.edge,mul(frame.along,x)),
  mul(frame.outward,depth)),[0,height,0]);
}
function buildSkyFjord(out,frame,site){
 const first=out.length/18;
 const P=(x,d,h)=>point(frame,x,d,h);
 const isTall=site.slot===2;
 const heightScale=isTall?1:.83;
 // The opening is not a pasted black facade or a roof hole. There is simply
 // NO geometry in the 40-78m transverse central gorge, from foreground to
 // >200m behind the original hero. It widens with distance and can be seen
 // from oblique, moving authentic road cameras.
 const wings=[
  {sign:-1,start:-33,spread:-31,tone:C.shell,stagger:0},
  {sign:1,start:34,spread:43,tone:C.iron,stagger:13}
 ];
 // Two separated civic threshold courts REFER to the existing CX public
 // bank concourse at depth ~78m; never span the live B48 racing surface.
 for(const x of [-38,29]){
  face(out,P(x-12,64,8),P(x+12,64,8),P(x+10,84,10),
   P(x-10,84,10),C.court);
  face(out,P(x-10,83,10),P(x+10,83,10),P(x+8,94,16),
   P(x-8,94,16),C.shell);
 }
 const forecourtTriangles=out.length/18-first;
 let terraceCount=0,portalCount=0;
 for(const [wi,wing] of wings.entries()){
  // TWO inhabited banks are intentionally NOT parallel rectangular towers.
  // Both fan away from the canyon, taper and climb with real depth.
  const at=(t,across,up)=>{
   const center=wing.start+wing.spread*t*t+(wi===0?-8:5)*Math.sin(t*Math.PI);
   const d=89+132*t+wing.stagger;
   return P(center+wing.sign*across,d,up*heightScale);
  };
  for(let k=0;k<5;k++){
   const t0=k/5,t1=(k+1)/5;
   const rise0=10+76*t0,rise1=10+76*t1;
   const width0=12+11*t0,width1=12+11*t1;
   // Sloping multi-storey occupied ribbon. Partial OPEN passage between
   // segments is a true gap, not a black painted window or fake air.
   if(k===2)continue;
   // The visible inhabited floor projects toward the canyon but is split
   // into different longitudinal pieces instead of a 130m shelf.
   face(out,at(t0,0,rise0),at(t1,0,rise1),
    at(t1,width1,rise1+3),at(t0,width0,rise0+3),
    k%2===0?C.court:C.iron);terraceCount++;
   // Outer curved bulkhead: lower portion opaque, the upper broad aperture
   // is missing triangles so the huge open gorge reads through the mass.
   face(out,at(t0,width0,rise0-18),at(t1,width1,rise1-18),
    at(t1,width1,rise1-4),at(t0,width0,rise0-4),wing.tone);
   // Inner inhabited lintel forms a 12m tall entry with no wall below it.
   face(out,at(t0,-2,rise0+14),at(t1,-2,rise1+14),
    at(t1,6,rise1+20),at(t0,6,rise0+20),C.shell);
   // Two separate deep, short volumetric end courts, visibly above one
   // another as the player moves; no long planar city front.
   for(const t of [t0,t1]){
    const h=10+76*t,depth=10+7*t;
    face(out,at(t,0,h),at(t,depth,h+1),at(t,depth,h+9),
     at(t,0,h+8),C.dusk);
    face(out,at(t,depth,h+5),at(t,depth+3,h+5),
     at(t,depth+3,h+10),at(t,depth,h+10),C.ember);
   }
   portalCount++;
  }
  // Distinct occupied neighbourhoods appear across several actual depths:
  // open-sided three-dimensional balcony clusters at 3 selected waypoints,
  // attached to the rising bank and NOT free-floating scaffold forests.
  for(const t of [.13,.48,.85]){
   const h=(18+76*t)*heightScale,outer=wing.start+wing.spread*t*t+
     (wi===0?-8:5)*Math.sin(t*Math.PI),d=89+132*t+wing.stagger;
   const x0=outer-7,x1=outer+7,z0=d-6,z1=d+12;
   face(out,P(x0,z0,h),P(x1,z0,h),P(x1,z1,h+3),
    P(x0,z1,h+3),C.court);
   face(out,P(x0,z0,h+13),P(x1,z0,h+13),P(x1,z1,h+16),
    P(x0,z1,h+16),C.shell);
   // Corner returns define 16m habitable thickness while intentionally
   // omitting complete front/rear faces: open public rooms, not cubes.
   for(const x of [x0,x1])
    face(out,P(x,z0,h),P(x,z1,h+3),P(x,z1,h+16),
     P(x,z0,h+13),C.iron);
   face(out,P(x0,z1,h+4),P(x1,z1,h+4),P(x1,z1,h+6),
    P(x0,z1,h+6),C.glow);
  }
 }
 const whole=out.length/18-first;
 return {slot:site.slot,designPrinciple:'INHABITED_NEGATIVE_SPACE_ALONG_DEPTH',
  geometry:'TWO_DIVERGING_TERRACED_BANKS_WITH_REAL_OPEN_GORGE',
  openCentralGorge:true,forecourtTriangles,terraceCount,portalCount,
  distantDepthMeters:221,triangleCount:whole};
}
function cameraProjection(p,shot){
 const front=norm(shot.front),right=norm([
  -front[2],0,front[0]]),up=norm([
  -right[2]*front[1],right[2]*front[0]-right[0]*front[2],
  right[0]*front[1]]);
 const v=sub(p,shot.eye),z=dot(v,front);
 return z>1?{x:1.35*dot(v,right)/(z*(1360/860)),
  y:1.35*dot(v,up)/z,z}:null;
}
export function g4e7dgCanyonCandidate(doc,sample,{enabled=false,shots=null}={}){
 if(!enabled)return {active:false,vertices:[],sources:[],triangles:0,
  art:'HOLD',newRoads:0,newColliders:0,newMovingHazards:0};
 if(!Array.isArray(shots)||shots.length<2||
  shots[0].id!=='t1500'||shots[1].id!=='t1700'||
  shots.slice(0,2).some(s=>s.source!=='ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN'))
  throw Error('DI requires unchanged authentic 240Hz native cameras');
 const frozen=JSON.stringify(doc);
 const cx=g4e7ciIntegratedStreetscape(doc,sample,{enabled:true,shots});
 if(!cx.active||cx.landmarksQA?.length!==2||cx.sources?.length<10)
  throw Error('DI immutable CX integrated city prerequisite absent');
 // PRESERVE every single CX triangle, including both original crescents.
 // Unlike DH: no new volume inserted into their sky openings.
 const vertices=cx.vertices.slice(),sources=cx.sources.map(s=>({...s}));
 const designs=[],frameChecks=[];
 for(const site of cx.landmarksQA){
  if(site.road!==1||![2,6].includes(site.slot))
   throw Error('DI unexpected original CX hero bank');
  const b=basis(doc,sample,site),firstTriangle=vertices.length/18;
  const details=buildSkyFjord(vertices,b,site);
  designs.push(details);
  sources.push({kind:'di-inhabited-sky-fjord',road:site.road,
   u:site.u,side:site.side,slot:site.slot,firstTriangle,
   triangleCount:vertices.length/18-firstTriangle});
  // Observational camera-space planning hints, never an ART classifier.
  for(const shot of shots.slice(0,2)){
   const throat=point(b,0,125,41);
   const far=point(b,0,205,74);
   const left=point(b,-50,145,48),right=point(b,50,145,48);
   frameChecks.push({slot:site.slot,frame:shot.id,
    probe:[throat,far,left,right].map(p=>cameraProjection(p,shot))});
  }
 }
 const triangles=vertices.length/18;
 if(triangles<=cx.triangles||triangles>50000||
  vertices.some(x=>!Number.isFinite(x))||
  sources.reduce((n,s)=>n+s.triangleCount,0)!==triangles||
  sources.some((s,i)=>s.firstTriangle!==(i?sources[i-1].firstTriangle+
    sources[i-1].triangleCount:0))||
  frozen!==JSON.stringify(doc))throw Error('DI scene/physics provenance invalid');
 return {...cx,vertices,sources,triangles,
  dg:{id:'G4E7DI_PRIVATE_ONLY_NOT_ADOPTED',design:'SKY_FJORD_DEPTH_CITY_V1',
   sourceCX:'exact unmodified prefix including the landmark',
   landmarkDetails:designs,cameraProbeObservations:frameChecks,
   actualRoads:doc.surfaces.length,actualMovers:doc.movingObstacles.length,
   nonPhysical:true},art:'HOLD',human:'HOLD',publish:'HOLD',
  newRoads:0,newColliders:0,newMovingHazards:0,physicalChanged:false,
  officialSlope2Meters:0};
}
