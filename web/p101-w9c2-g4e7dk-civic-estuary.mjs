/**
 * G4E-7DK / CIVIC ESTUARY — one PRIVATE urban-composition hypothesis.
 *
 * Not another detached skyline, not a game surface. Existing CX road-bound
 * inhabited districts, real camera, original crescent heroes and roads remain.
 * Only the fragmented far roofline *in the private candidate* is replaced
 * by an inhabited, multi-depth civic terrain with several large OPEN atria.
 * No build copying: Playwright substitutes this module into an isolated
 * 127.0.0.1 genuine WebGL game page.
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
 if(Math.hypot(...sideways)<2)throw Error('DK degenerate original B48 bank');
 return {edge,along,outward:unit(sideways)};
}
function at(f,x,d,h){
 return add(add(add(f.edge,mul(f.along,x)),mul(f.outward,d)),[0,h,0]);
}
function blended(a,b,t){return add(mul(a,1-t),mul(b,t));}

/** A sculpted, curved, inhabited city-bank, open along the middle.
 * Each wing is a *built* volume with real occupied depths / returns.
 * The inner court has NO roof, NO front wall, NO fake painted hole.
 * A vertical/longitudinal gap in its skyline is real empty space.
 */
function civicTerrain(v,frame,shape){
 const first=v.length/18,site=(x,d,h)=>at(frame,x,d,h);
 const lean=shape.lean,scale=shape.scale;
 const wingDefs=[
  {sign:-1,lo:-57,hi:-11,baseDepth:84,skin:P.chalk,offset:0},
  {sign:1,lo:13,hi:63,baseDepth:109,skin:P.iron,offset:12}
 ];
 let inhabitedChambers=0,courts=0;
 for(const [wi,w] of wingDefs.entries()){
  const world=(t,s,h)=>{
   const x=blended([w.lo,0,0],[w.hi,0,0],t)[0]+lean*t*t+
    (wi?7:-9)*Math.sin(Math.PI*t*.9);
   const d=w.baseDepth+33*t+38*s+w.offset;
   return site(x,d,h*scale+2*t);
  };
  // Three gardened residence courts per urban wing. Each open to the
  // genuine sky above and the middle/inner side of the terrain.
  for(let tier=0;tier<3;tier++){
   const t0=tier/3,t1=(tier+1)/3;
   const slope0=12+75*t0,slope1=12+75*t1;
   const step0=10+20*t0,step1=10+20*t1;
   // Thick curved occupied shell is composed of two angled depth planes
   // and short end-walls; it never becomes a broad solid vertical facade.
   both(v,world(t0,.12,slope0),world(t1,.12,slope1),
    world(t1,.52,slope1+step1),world(t0,.52,slope0+step0),
    tier===1?P.iron:w.skin);
   both(v,world(t0,.50,slope0+step0),world(t1,.50,slope1+step1),
    world(t1,.86,slope1+step1+5),world(t0,.86,slope0+step0+5),
    P.shale);
   // The inhabited storey opens onto a terrace: the middle of its
   // concave frontage has NO opaque facade triangles at all.
   both(v,world(t0,.14,slope0-15),world(t1,.14,slope1-15),
    world(t1,.14,slope1-9),world(t0,.14,slope0-9),P.chalk);
   for(const t of [t0,t1]){
    const z=12+75*t;
    both(v,world(t,.14,z-15),world(t,.82,z-15),
     world(t,.82,z+10),world(t,.14,z+10),P.iron);
   }
   // Real, tall 3D public rooms with 20–40m gaps, not tiny windows.
   // Short balcony volumes of distinct depths read as habitable rooms.
   const tm=(t0+t1)/2,h0=10+75*tm;
   both(v,world(tm-.10,.18,h0),world(tm+.10,.18,h0+4),
    world(tm+.10,.75,h0+8),world(tm-.10,.75,h0+4),P.iron);
   both(v,world(tm-.10,.18,h0+17),world(tm+.10,.18,h0+21),
    world(tm+.10,.75,h0+25),world(tm-.10,.75,h0+21),P.chalk);
   for(const t of [tm-.10,tm+.10])
    both(v,world(t,.18,h0+4),world(t,.75,h0+8),
     world(t,.75,h0+22),world(t,.18,h0+18),P.shale);
   both(v,world(tm-.09,.745,h0+11),world(tm+.09,.745,h0+15),
    world(tm+.09,.75,h0+18),world(tm-.09,.75,h0+14),P.cyan);
   courts++;inhabitedChambers++;
  }
 }
 // Two offset ground-level public arrival courts; no continuous roof
 // over the air opening and no visually playable counterfeit road.
 for(const p of [-1,1]){
  const x=p*37;
  both(v,site(x-15,58,6),site(x+15,58,6),
   site(x+17,85,8),site(x-17,85,8),P.shale);
  both(v,site(x-10,82,8),site(x+10,82,8),
   site(x+10,95,15),site(x-10,95,15),P.copper);
 }
 const triangles=v.length/18-first;
 return {triangles,inhabitedChambers,courts,skyOpen:true,roadsideEntrance:true,
  publicConnection:'EXISTING_CX_ROADBOUND_CONCOURSE_NONCOLLIDING'};
}
function joinPublicBanks(v,frames){
 // Six limited spans between existing authentic road positions. These form
 // a usable-looking CIVIC WALKWAY (purely visual) with open sky above.
 // Distinct angled curves and visible large air intervals prevent a slab.
 let links=0;
 for(let i=0;i<frames.length-1;i++){
  const a=frames[i],b=frames[i+1];
  const ca=at(a,0,73,7),cb=at(b,0,73,7);
  for(let k=0;k<2;k++){
   const t0=k/2,t1=(k+1)/2;
   const x=blended(ca,cb,t0),y=blended(ca,cb,t1);
   const w0=mul(unit(blended(a.outward,b.outward,t0)),6),
    w1=mul(unit(blended(a.outward,b.outward,t1)),6);
   both(v,sub(x,w0),add(x,w0),add(y,w1),sub(y,w1),P.iron);
   links++;
  }
 }
 return links;
}
export function g4e7dgCanyonCandidate(doc,sample,{enabled=false,shots=null}={}){
 if(!enabled)return {active:false,vertices:[],sources:[],triangles:0,
  art:'HOLD',newRoads:0,newColliders:0,newMovingHazards:0};
 if(!Array.isArray(shots)||shots.length<2||shots[0]?.id!=='t1500'||
  shots[1]?.id!=='t1700'||
  shots.slice(0,2).some(s=>s.source!=='ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN'))
  throw Error('DK requires actual 15/17s native 240Hz camera');
 const frozen=JSON.stringify(doc);
 const cx=g4e7ciIntegratedStreetscape(doc,sample,{enabled:true,shots});
 if(!cx.active||cx.landmarks!==2||cx.sources?.length<10)
  throw Error('DK unchanged CX city prerequisite absent');
 const vertices=[],sources=[];
 const retained=[];
 for(const source of cx.sources){
  if(source.kind==='distant-folded-roofline')continue;
  const begin=vertices.length/18;
  vertices.push(...cx.vertices.slice(source.firstTriangle*18,
   (source.firstTriangle+source.triangleCount)*18));
  sources.push({...source,firstTriangle:begin});
  retained.push(source.kind);
 }
 // A single urban-convergence composition, instead of disconnected
 // decorative rings on both of the known CX landmark sites.
 const sites=[
  {u:.63,side:-1,scale:1.05,lean:-10},
  {u:.70,side:1,scale:.92,lean:12},
  {u:.78,side:-1,scale:1.13,lean:8},
  {u:.85,side:1,scale:.85,lean:-11}
 ];
 const urbanDetails=[];
 for(const site of sites){
  const f=roadBankFrame(doc,sample,site.u,site.side);
  const start=vertices.length/18,detail=civicTerrain(vertices,f,site);
  urbanDetails.push({u:site.u,side:site.side,...detail});
  sources.push({kind:'dk-inhabited-estuary',road:1,u:site.u,
   side:site.side,firstTriangle:start,triangleCount:vertices.length/18-start});
 }
 let bankLinks=0;
 for(const side of [-1,1]){
  const frames=[.63,.70,.78,.85].map(u=>roadBankFrame(doc,sample,u,side));
  const start=vertices.length/18;
  bankLinks+=joinPublicBanks(vertices,frames);
  sources.push({kind:'dk-open-civic-concourse',road:1,side,
   firstTriangle:start,triangleCount:vertices.length/18-start});
 }
 const triangles=vertices.length/18;
 if(!Number.isInteger(triangles)||triangles>50000||
   triangles<cx.triangles-500||
   vertices.some(x=>!Number.isFinite(x))||
   sources.reduce((n,s)=>n+s.triangleCount,0)!==triangles||
   sources.some((s,i)=>s.firstTriangle!==(i?sources[i-1].firstTriangle+sources[i-1].triangleCount:0))||
   frozen!==JSON.stringify(doc))throw Error('DK geometry or protected physics provenance invalid');
 return {...cx,vertices,sources,triangles,
  dg:{id:'G4E7DK_PRIVATE_UNADOPTED_URBAN_COMPOSITION',
   design:'CIVIC_ESTUARY_INHABITED_TERRAIN_V1',
   retainedCXCityKind:retained,urbanDetails,bankLinks,
   original7Roads:doc.surfaces.length,original28Movers:doc.movingObstacles.length,
   addedPhysicalGeometry:false},art:'HOLD',human:'HOLD',publish:'HOLD',
  newRoads:0,newColliders:0,newMovingHazards:0,physicalChanged:false,
  officialSlope2Meters:0};
}
