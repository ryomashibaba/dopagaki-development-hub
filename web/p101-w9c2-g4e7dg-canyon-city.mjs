/**
 * G4E-7DG: PRIVATE comparative city candidate, not an adopted replacement.
 * Three occupied volumes form an open, legible canyon extending from CX's
 * real-road-traced public concourse. No render flags outside opt-in.
 * Generated vertices are NOT physical roads, floors, colliders or machines.
 */
import {g4e7ciIntegratedStreetscape} from './p101-w9c2-g4e7ci-integrated-streetscape.mjs';
const CL={
 stone:[.73,.84,.84],deep:[.07,.16,.22],steel:[.20,.32,.39],
 cobalt:[.15,.39,.52],gold:[.98,.60,.22],lit:[.45,.92,.99],
 pale:[.91,.93,.86]
};
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]);
const mul=(v,s)=>v.map(x=>x*s),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const unit=a=>mul(a,1/(Math.hypot(...a)||1));
const vertex=(v,p,c)=>v.push(...p,...c);
const triangle=(v,a,b,c,color)=>{vertex(v,a,color);vertex(v,b,color);vertex(v,c,color);};
const quad=(v,a,b,c,d,color)=>{
 triangle(v,a,b,c,color);triangle(v,a,c,d,color);
 // CX and the original simple WebGL shader render both winding directions.
 triangle(v,d,c,b,CL.deep);triangle(v,d,b,a,CL.deep);
};
function roadBasis(surface,sample,u,side){
 const c=sample(surface,u,.5),edge=sample(surface,u,side<0?0:1),
  before=sample(surface,u-.003,.5),after=sample(surface,u+.003,.5);
 const along=unit([after[0]-before[0],0,after[2]-before[2]]);
 const n=sub([edge[0]-c[0],0,edge[2]-c[2]],mul(along,dot(sub(edge,c),along)));
 const outward=unit(n);
 if(Math.hypot(...n)<3||!outward.every(Number.isFinite))throw Error('DG invalid road frame');
 return {edge,along,outward};
}
function urbanVolume(v,P,{x0,x1,d0,d1,h0,h1,skin=CL.stone,accent=CL.gold,aperture=true}){
 if(x1-x0<14||d1-d0<16||h1-h0<15)throw Error('DG invalid inhabited mass');
 const face=(wall,across,rise)=>{
  // Authored voids are truly absent wall triangles, including the rear face.
  // Thick perimeter and a broad double-storey void; NOT painted-on windows.
  const nx=6,ny=5;
  for(let iy=0;iy<ny;iy++)for(let ix=0;ix<nx;ix++){
   if(aperture&&ix>=2&&ix<=3&&(iy===1||iy===2))continue;
   const a0=ix/nx,a1=(ix+1)/nx,t0=iy/ny,t1=(iy+1)/ny;
   const c=iy===0?CL.steel:iy===4?CL.stone:(ix%3===1?CL.cobalt:skin);
   quad(v,wall(a0,t0),wall(a1,t0),wall(a1,t1),wall(a0,t1),c);
  }
  if(!aperture)return;
  // An occupied inset court is recessed into the wall behind the opening.
  // The visible depth edges provide volume, without filling the opening.
  for(const a of [2/6,4/6]){
   const z0=1/5,z1=3/5;
   quad(v,wall(a,z0),wall(a,z1),across(a,z1),across(a,z0),accent);
  }
  quad(v,wall(2/6,3/5),wall(4/6,3/5),
   across(4/6,3/5),across(2/6,3/5),CL.pale);
 };
 const front=(s,z)=>P(x0+(x1-x0)*s,d0,h0+(h1-h0)*z);
 const rear=(s,z)=>P(x0+(x1-x0)*s,d1,h0+(h1-h0)*z);
 const insetFront=(s,z)=>P(x0+(x1-x0)*s,d0+8,h0+(h1-h0)*z);
 const insetRear=(s,z)=>P(x0+(x1-x0)*s,d1-8,h0+(h1-h0)*z);
 face(front,insetFront);
 face(rear,insetRear);
 // Side walls: similarly carved, so the building is not a single flat slab
 // when viewed along the original 240Hz ball-relative camera.
 for(const x of [x0,x1]){
  for(let i=0;i<5;i++)for(let j=0;j<5;j++){
   if(aperture&&i>=1&&i<=2&&j>=1&&j<=2)continue;
   const u0=i/5,u1=(i+1)/5,z0=j/5,z1=(j+1)/5;
   const side=(u,z)=>P(x,d0+(d1-d0)*u,h0+(h1-h0)*z);
   quad(v,side(u0,z0),side(u1,z0),side(u1,z1),side(u0,z1),
    j===4?CL.stone:j===0?CL.steel:(i%2?CL.cobalt:skin));
  }
 }
 // Thick inhabited core: foundation/roof belong to the same volumes.
 quad(v,P(x0,d0,h0),P(x1,d0,h0),P(x1,d1,h0),P(x0,d1,h0),CL.deep);
 quad(v,P(x0,d0,h1),P(x1,d0,h1),P(x1,d1,h1),P(x0,d1,h1),CL.stone);
 // Luminous bands are short architectural thresholds, not infinite strips.
 for(const y of [h0+(h1-h0)*.18,h0+(h1-h0)*.76]){
  quad(v,P(x0+3,d0-.7,y),P(x0+11,d0-.7,y),
   P(x0+11,d0-.7,y+1.8),P(x0+3,d0-.7,y+1.8),accent);
 }
}
function skylineQuarter(v,frame,site){
 const P=(x,d,h)=>add(add(add(frame.edge,mul(frame.along,x)),mul(frame.outward,d)),[0,h,0]);
 const first=v.length/18;
 // This is one canyon-like urban district, not a freestanding arch,
 // scaffold, billboard wall or succession of thin shelves.
 const volumes=[
  {x0:-75,x1:-26,d0:108,d1:155,h0:5,h1:72,skin:CL.steel},
  {x0:-69,x1:-30,d0:111,d1:159,h0:72,h1:111,skin:CL.stone},
  {x0:19,x1:70,d0:120,d1:164,h0:5,h1:63,skin:CL.cobalt},
  {x0:28,x1:66,d0:123,d1:166,h0:63,h1:100,skin:CL.stone},
  {x0:-19,x1:25,d0:194,d1:229,h0:5,h1:86,skin:CL.steel},
  {x0:-14,x1:23,d0:193,d1:229,h0:86,h1:132,skin:CL.cobalt}
 ];
 // The second landmark gets a different scale, not a duplicate row.
 const sy=site.slot===6?.79:1;
 for(const vol of volumes){
  const scaled={...vol,h0:vol.h0*sy,h1:vol.h1*sy,
   accent:site.slot===2?CL.gold:CL.lit};
  urbanVolume(v,P,scaled);
 }
 const afterTowers=v.length/18;
 // Road-facing city approach is intentionally OUTSIDE the original B48.
 // The passage is a genuine empty 40m wide atrium, with large city volumes
 // flanking it and further habitation at the back. No playable road claim.
 quad(v,P(-24,76,5),P(18,76,5),P(18,125,6),P(-24,125,6),CL.steel);
 quad(v,P(-20,126,6),P(15,126,6),P(15,178,7),P(-20,178,7),CL.deep);
 // Pedestrian crossing with thick inhabitable parapets, only at low height;
 // no skyline-spanning beam across the open canyon.
 quad(v,P(-25,132,17),P(20,132,17),P(20,145,17),P(-25,145,17),CL.pale);
 quad(v,P(-25,132,17),P(20,132,17),P(20,132,24),P(-25,132,24),CL.steel);
 // Four local civic portals at the lower front of two masses.
 for(const x of [-67,-52,30,48]){
  quad(v,P(x,105,5),P(x+9,105,5),P(x+9,105,12),P(x,105,12),CL.gold);
 }
 const afterStreet=v.length/18;
 return {district:'THREE_DEPTH_ANCHORED_INHABITED_CANYON',
  occupiedVolumes:volumes.length,atriumGapM:45,
  triangles:v.length/18-first,parts:[
   {kind:'city-residential-masses',triangles:afterTowers-first},
   {kind:'city-public-street',triangles:afterStreet-afterTowers}
  ]};
}
export function g4e7dgCanyonCandidate(doc,sample,{enabled=false,shots=null}={}){
 if(!enabled)return {active:false,vertices:[],sources:[],triangles:0,
  art:'HOLD',newRoads:0,newColliders:0,newMovingHazards:0};
 if(!Array.isArray(shots)||shots.length<2||
    shots[0].id!=='t1500'||shots[1].id!=='t1700'||
    shots.slice(0,2).some(s=>s.source!=='ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN'))
   throw Error('DG requires unmodified actual native 240Hz camera');
 const frozen=JSON.stringify(doc);
 const cx=g4e7ciIntegratedStreetscape(doc,sample,{enabled:true,shots});
 if(cx.landmarks!==2||cx.landmarksQA.length!==2)throw Error('DG needs immutable CX hero sites');
 const vertices=[],sources=[],detailed=[];
 const record=(kind,meta,author)=>{
  const from=vertices.length/18;
  const details=author();
  const length=vertices.length/18-from;
  if(!Number.isInteger(length)||length<=0)throw Error('DG empty source');
  sources.push({kind,...meta,firstTriangle:from,triangleCount:length});
  if(details)detailed.push(details);
 };
 // Carry forward the real-road-traced civic blocks and pedestrian concourses.
 // Explicitly omit the two detached roofline fragments and old crescents.
 // The reference CX generator remains byte-identical and unmodified.
 for(const source of cx.sources){
  if(['anchored-civic-crescent','distant-folded-roofline'].includes(source.kind))continue;
  record(source.kind,Object.fromEntries(Object.entries(source).filter(([key])=>
    !['firstTriangle','triangleCount','parts','kind'].includes(key))),()=>{
   for(let i=source.firstTriangle*18;i<(source.firstTriangle+source.triangleCount)*18;i++)
    vertices.push(cx.vertices[i]);
  });
 }
 for(const site of cx.landmarksQA){
  if(![2,6].includes(site.slot)||site.road!==1)throw Error('DG unexpected native hero site');
  const f=roadBasis(doc.surfaces[site.road],sample,site.u,site.side);
  record('dg-inhabited-canyon',{road:site.road,u:site.u,side:site.side,slot:site.slot},
   ()=>skylineQuarter(vertices,f,site));
 }
 const triangles=vertices.length/18;
 if(triangles<1000||triangles>50000||vertices.some(v=>!Number.isFinite(v))||
    sources.reduce((n,s)=>n+s.triangleCount,0)!==triangles||
    sources.some((s,i)=>s.firstTriangle!==(i?sources[i-1].firstTriangle+sources[i-1].triangleCount:0))||
    frozen!==JSON.stringify(doc))throw Error('DG provenance or genuine B48 mutated');
 return {...cx,vertices,sources,triangles,landmarksQA:cx.landmarksQA,
  dg:{id:'G4E7DG_RESEARCH_ONLY',design:'CANYON_CITY_INHABITED_VOLUME_V1',
   sourceCX:'unchanged CX geometry before opt-in',landmarkDetails:detailed,
   actualRoads:doc.surfaces.length,actualMovers:doc.movingObstacles.length,
   nonPhysical:true},art:'HOLD',human:'HOLD',publish:'HOLD',
  newRoads:0,newColliders:0,newMovingHazards:0,physicalChanged:false,
  officialSlope2Meters:0};
}
