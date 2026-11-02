/**
 * G4E-7DL — PRIVATE / APERTURE CITY, an actual 3D composition experiment.
 *
 * Previous DK surfaces mainly presented their exterior, even where a court
 * had been modelled. DL places a FRONT-READABLE, genuinely empty aperture
 * with recessed inhabited transit galleries behind it, using BOTH original
 * 240Hz camera samples to select a FIXED site for each original road.
 * Site selection is once per world generation, NOT per shot or per frame.
 * Does not change camera, road, physics, render engine or public build.
 *
 * ART is HOLD regardless of technical CI success.
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

const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function projection(shot,p){
 const forward=unit(shot.front),right=unit(cross(forward,[0,1,0])),
  up=unit(cross(right,forward)),w=sub(p,shot.eye),z=dot(w,forward);
 if(z<=4)return null;
 return {x:1.35*dot(w,right)/(z*(1360/860)),y:1.35*dot(w,up)/z,z};
}
function candidateScore(f,shots){
 const representatives=[
  at(f,-83,150,48),at(f,83,150,48),
  at(f,0,150,110),at(f,0,205,68)
 ];
 let score=0,readableFrames=0;
 const study=shots.filter(s=>['t1500','t1550','t1600','t1650','t1700'].includes(s.id));
 for(const shot of study){
  const pts=representatives.map(p=>projection(shot,p));
  const visible=pts.filter(p=>p&&Math.abs(p.x)<.88&&p.y>-.55&&p.y<.87);
  const center=pts[2],left=pts[0],right=pts[1];
  const middle=['t1550','t1600','t1650'].includes(shot.id);
  const weight=middle?2:1;
  if(center&&Math.abs(center.x)<.81&&center.y>-.35&&center.y<.8){
   score+=weight*2;readableFrames++;
  }
  score+=weight*visible.length*.22;
  if(left&&right){
   const span=Math.abs(left.x-right.x);
   if(span>.13&&span<1.30)score+=weight*.6;
  }
 }
 return {score:Number(score.toFixed(4)),readableFrames};
}
function buildInhabitedAperture(v,f){
 const start=v.length/18;
 const p=(x,d,h)=>at(f,x,d,h);
 // One large opening facing the ACTUAL moving camera: the central front
 // elevation is not painted black. No triangles across its air aperture.
 // Four real 3D shell surfaces form deep, thick, curved load-bearing rims.
 // Each piece has 40m of world-space depth, rather than a flat billboard.
 const segments=24,front=143,back=188;
 const shape=(i,outer,d)=>{
  const a=Math.PI*i/segments,r=outer?92:72,h=outer?118:96;
  return p(-r*Math.cos(a),d,43+h*Math.sin(a));
 };
 for(let i=0;i<segments;i++){
  const a=shape(i,true,front),b=shape(i+1,true,front),
   c=shape(i,false,front),d=shape(i+1,false,front);
  const A=shape(i,true,back),B=shape(i+1,true,back),
   C=shape(i,false,back),D=shape(i+1,false,back);
  both(v,a,b,d,c,i%8<4?P.chalk:P.iron);
  both(v,A,B,D,C,P.shale);
  both(v,a,b,B,A,P.iron);
  both(v,c,d,D,C,P.deep);
 }
 // Distinct, thick lateral city banks attach the rim to genuine outboard
 // districts; none intersects the authentic driveable road.
 for(const side of [-1,1]){
  const x0=side<0?-98:72,x1=side<0?-72:98;
  both(v,p(x0,138,6),p(x1,138,6),p(x1,138,44),p(x0,138,44),P.shale);
  both(v,p(x0,138,44),p(x1,138,44),p(x1,189,44),p(x0,189,44),P.iron);
  both(v,p(x0,189,6),p(x1,189,6),p(x1,189,44),p(x0,189,44),P.deep);
 }
 // Behind the OPEN arch are actual room volumes at three recessed depths,
 // deliberately leaving the central line of sight empty. The camera sees
 // occupied terraces THROUGH the void, not a solid added frontal wall.
 let rooms=0;
 for(const side of [-1,1])for(let tier=0;tier<3;tier++){
  const left=side<0?-85:37,right=side<0?-37:85;
  const depth=199+20*tier,low=12+27*tier,high=low+17;
  const q=(x,d,h)=>p(x,d,h);
  // Walkable-looking public terraces are purely visual; NO B48/collider.
  both(v,q(left,depth,low),q(right,depth,low),
   q(right,depth+34,low+3),q(left,depth+34,low+3),P.iron);
  // Thick transverse floor fascia.
  both(v,q(left,depth,low-5),q(right,depth,low-5),
   q(right,depth,low),q(left,depth,low),P.chalk);
  // Three sides of each human-scaled recessed room, intentionally no
  // front facade. Real air opening remains visible from road/camera.
  both(v,q(left,depth+32,low),q(right,depth+32,low),
   q(right,depth+32,high),q(left,depth+32,high),P.deep);
  both(v,q(left,depth,low),q(left,depth+32,low),
   q(left,depth+32,high),q(left,depth,high),P.shale);
  both(v,q(right,depth,low),q(right,depth+32,low),
   q(right,depth+32,high),q(right,depth,high),P.shale);
  // A small warm internal band belongs to the RECeding backwall.
  both(v,q(left+5,depth+31.5,low+10),q(right-5,depth+31.5,low+10),
   q(right-5,depth+31.5,low+13),q(left+5,depth+31.5,low+13),P.copper);
  rooms++;
 }
 // Low, separated arrivals connect visually to existing CX concourses;
 // there is no false bridge or simulated gameplay surface over the course.
 for(const side of [-1,1]){
  const lo=side<0?-98:60,hi=side<0?-60:98;
  both(v,p(lo,79,7),p(hi,79,7),p(hi,132,10),p(lo,132,10),P.shale);
  both(v,p(lo,125,10),p(hi,125,10),p(hi,142,14),p(lo,142,14),P.copper);
 }
 return {triangles:v.length/18-start,openFront:true,realAperture:true,
  recessedRoomVolumes:rooms,originalGameCollidersAdded:0,
  roadVisualSurfacesOnly:true};
}
export function g4e7dgCanyonCandidate(doc,sample,{enabled=false,shots=null}={}){
 if(!enabled)return {active:false,vertices:[],sources:[],triangles:0,
  art:'HOLD',newRoads:0,newColliders:0,newMovingHazards:0};
 if(!Array.isArray(shots)||shots[0]?.id!=='t1500'||shots[1]?.id!=='t1700'||
  shots.slice(0,2).some(s=>s.source!=='ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN')||
  !['t1550','t1600','t1650'].every(id=>shots.some(s=>s.id===id)))
  throw Error('DL requires the original genuine 240Hz 15.0-17.0s trajectory');
 const frozen=JSON.stringify(doc);
 const cx=g4e7ciIntegratedStreetscape(doc,sample,{enabled:true,shots});
 if(!cx.active||cx.landmarks!==2||cx.sources?.length<10)
  throw Error('DL unchanged CX city prerequisite absent');
 const vertices=[],sources=[],retained=[];
 for(const source of cx.sources){
  if(source.kind==='distant-folded-roofline')continue;
  const begin=vertices.length/18;
  vertices.push(...cx.vertices.slice(source.firstTriangle*18,
   (source.firstTriangle+source.triangleCount)*18));
  sources.push({...source,firstTriangle:begin});
  retained.push(source.kind);
 }
 // A few genuinely different physical shoulder positions are tested in 2D
 // before meshing. Only ONE fixed global 3D site wins for each original road.
 // This avoids DK's many visually detached oversized panels.
 const possibilities=[];
 for(const side of [-1,1])for(const u of [.62,.68,.74,.80,.86]){
  const f=roadBankFrame(doc,sample,u,side);
  possibilities.push({u,side,frame:f,...candidateScore(f,shots)});
 }
 possibilities.sort((a,b)=>b.score-a.score||b.readableFrames-a.readableFrames||a.u-b.u||a.side-b.side);
 const site=possibilities[0];
 if(!site||!Number.isFinite(site.score))throw Error('DL no valid native projection candidate');
 const start=vertices.length/18,detail=buildInhabitedAperture(vertices,site.frame);
 sources.push({kind:'dl-inhabited-aperture',road:1,u:site.u,side:site.side,
  firstTriangle:start,triangleCount:vertices.length/18-start});
 const triangles=vertices.length/18;
 if(!Number.isInteger(triangles)||triangles>50000||triangles<1000||
   vertices.some(x=>!Number.isFinite(x))||
   sources.reduce((n,s)=>n+s.triangleCount,0)!==triangles||
   sources.some((s,i)=>s.firstTriangle!==(i?sources[i-1].firstTriangle+sources[i-1].triangleCount:0))||
   frozen!==JSON.stringify(doc))
  throw Error('DL geometry or protected physics provenance invalid');
 return {...cx,vertices,sources,triangles,
  dg:{id:'G4E7DL_PRIVATE_UNADOPTED_VIEW_AWARE_COMPOSITION',
   design:'APERTURE_CITY_DEEP_TRANSIT_V1',
   retainedCXCityKind:retained,
   selectedSite:{u:site.u,side:site.side,score:site.score,readableFrames:site.readableFrames},
   projectionCandidates:possibilities.map(({u,side,score,readableFrames})=>({u,side,score,readableFrames})),
   ...detail,
   original7Roads:doc.surfaces.length,original28Movers:doc.movingObstacles.length,
   addedPhysicalGeometry:false},
  art:'HOLD',human:'HOLD',ready:'HOLD',publish:'HOLD',merge:'HOLD',
  newRoads:0,newColliders:0,newMovingHazards:0,physicalChanged:false,
  officialSlope2Meters:0};
}
