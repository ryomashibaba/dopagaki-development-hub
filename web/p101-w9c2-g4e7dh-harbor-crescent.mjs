/**
 * G4E-7DH: PRIVATE true-game WebGL city silhouette art study.
 *
 * Keep CX's two iconic open crescents rather than replacing them with DG's
 * ordinary tower boxes. The occupied civic galleries share the same physical
 * road-bound origin and crescent profile: buildings belong WITHIN the hero
 * monument and read as one public harbor. Not gameplay geometry.
 *
 * The only runtime entry is a private Playwright request substitution of the
 * already-existing g4e7dg-canyon-city module (never copied to game build).
 * This is an experiment, not a public URL, not an adopted visual asset.
 */
import {g4e7ciIntegratedStreetscape} from './p101-w9c2-g4e7ci-integrated-streetscape.mjs';
const PALETTE={
 pearl:[.76,.90,.92],basalt:[.09,.20,.27],struct:[.25,.39,.48],
 orange:[1,.67,.26],light:[.49,.89,.94],slate:[.14,.34,.47],
 underside:[.055,.14,.23]
};
const sum=(a,b)=>a.map((v,i)=>v+b[i]);
const diff=(a,b)=>a.map((v,i)=>v-b[i]);
const scale=(a,s)=>a.map(x=>x*s);
const dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);
const unit=x=>scale(x,1/(Math.hypot(...x)||1));
function both(v,a,b,c,d,color){
 for(const [p,q,r] of [[a,b,c],[a,c,d],[d,c,b],[d,b,a]])
  for(const pt of [p,q,r])v.push(...pt,...color);
}
function physicalRoadFrame(doc,sample,site){
 const surf=doc.surfaces[site.road],mid=sample(surf,site.u,.5),
  bank=sample(surf,site.u,site.side<0?0:1),
  pre=sample(surf,site.u-.003,.5),post=sample(surf,site.u+.003,.5);
 const along=unit([post[0]-pre[0],0,post[2]-pre[2]]);
 const offset=diff(bank,mid);
 const horizontal=diff([offset[0],0,offset[2]],scale(along,dot(offset,along)));
 if(Math.hypot(...horizontal)<3)throw Error('DH actual road bank degenerate');
 return {edge:bank,along,outward:unit(horizontal)};
}
function addPublicHarbor(v,frame,site){
 const begin=v.length/18,hero=site.slot;
 const P=(x,d,h)=>sum(sum(sum(frame.edge,scale(frame.along,x)),
  scale(frame.outward,d)),[0,h,0]);
 const arc=t=>{
  const x=(hero===2?-55:-48)+t*(hero===2?118:104);
  const d=90+20*Math.sin(Math.PI*t)+7*Math.sin(3*t+site.side);
  const top=14+(hero===2?116:97)*Math.pow(Math.max(0,Math.sin(Math.PI*t)),.74);
  return {x,d,top};
 };
 // Real external entrances in two asymmetrical, inhabited concave CHEEKS.
 // No roof bridge across the sky void or broad city-length horizontal slab.
 const galleries=[
  {start:.10,end:.37,depth:24,height:.57,rise:2.7},
  {start:.66,end:.91,depth:31,height:.49,rise:-2.3}
 ];
 for(const [gidx,g] of galleries.entries()){
  const count=9;
  for(let k=0;k<count;k++){
   const ta=g.start+(g.end-g.start)*k/count,
    tb=g.start+(g.end-g.start)*(k+1)/count;
   const a=arc(ta),b=arc(tb);
   const h0=7+(gidx===0?2:0);
   const ha=Math.min(84,a.top*g.height+g.rise*(ta-g.start));
   const hb=Math.min(84,b.top*g.height+g.rise*(tb-g.start));
   const da=a.d-g.depth-8,db=b.d-g.depth-8,ra=a.d-4,rb=b.d-4;
   // Deep, folded floor+roof: a true volumetric civic gallery, not a 2D sign.
   both(v,P(a.x,da,h0),P(b.x,db,h0),P(b.x,rb,h0),
    P(a.x,ra,h0),PALETTE.struct);
   both(v,P(a.x,da,ha),P(b.x,db,hb),P(b.x,rb,hb+7),
    P(a.x,ra,ha+7),gidx?PALETTE.pearl:PALETTE.slate);
   // OPEN atrium at the central 2 rows of two 3-4m-wide neighboring bays:
   // missing triangles, rather than opaque glazing / flat black windows.
   for(let row=0;row<4;row++){
    if([1,2].includes(row)&&[1,2,6,7].includes(k))continue;
    const q0=row/4,q1=(row+1)/4;
    const za=h0+(ha-h0)*q0,zb=h0+(hb-h0)*q0;
    const wa=h0+(ha-h0)*q1,wb=h0+(hb-h0)*q1;
    const tone=row===3?PALETTE.pearl:
     row===0?PALETTE.basalt:(k%3===0?PALETTE.light:PALETTE.slate);
    both(v,P(a.x,da,za),P(b.x,db,zb),P(b.x,db,wb),P(a.x,da,wa),tone);
    // Back elevation is ALSO perforated; prevent the old "cyan wall".
    both(v,P(a.x,ra,za),P(b.x,rb,zb),P(b.x,rb,wb),P(a.x,ra,wa),
     row===3?PALETTE.pearl:PALETTE.struct);
   }
   // Visible oblique return edges emphasize massive 3D *occupied* depth.
   if(k===0||k===count-1){
    const q=k===0?a:b,front=k===0?da:db,rear=k===0?ra:rb,top=k===0?ha:hb;
    both(v,P(q.x,front,h0),P(q.x,rear,h0),P(q.x,rear,top+7),
     P(q.x,front,top),PALETTE.struct);
   }
   // A lit short entrance lintel appears along the pedestrian-facing elevation.
   if(k===0||k===5){
    both(v,P(a.x,da-.3,14),P(b.x,db-.3,14),
     P(b.x,db-.3,16),P(a.x,da-.3,16),PALETTE.orange);
   }
  }
 }
 const galleryTriangles=v.length/18-begin;
 // Two low, inhabited abutments CONNECT the road-bank circulation into the
 // monument. They turn progressively, not perpendicular parking-lot boxes.
 for(const sign of [-1,1]){
  const x=sign*42;
  const A=P(x-8,51,6),B=P(x+8,51,6),C=P(x+11,77,23),D=P(x-11,77,23);
  both(v,A,B,C,D,PALETTE.struct);
  both(v,P(x-11,72,23),P(x+11,72,23),P(x+11,93,26),
   P(x-11,93,26),PALETTE.pearl);
  both(v,P(x-8,51,10),P(x+8,51,10),P(x+8,51,12),
   P(x-8,51,12),PALETTE.orange);
 }
 const whole=v.length/18-begin;
 return {hero,profile:'CENTRAL_OPEN_HARBOR_TWO_CURVED_INHABITED_CHEEKS',
  occupiedGalleries:2,galleryTriangles,
  abutments:2,triangles:whole,openCivicSky:true,
  connectsTo:'CX_PHYSICAL_ROAD_TRACED_PUBLIC_CONCOURSE'};
}
/** This named export is required ONLY by the private substituted module URL. */
export function g4e7dgCanyonCandidate(doc,sample,{enabled=false,shots=null}={}){
 if(!enabled)return {active:false,vertices:[],sources:[],triangles:0,art:'HOLD',
  newRoads:0,newColliders:0,newMovingHazards:0};
 if(!Array.isArray(shots)||shots.length<2||
  shots[0].id!=='t1500'||shots[1].id!=='t1700'||
  shots.slice(0,2).some(x=>x.source!=='ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN'))
  throw Error('DH requires authentic 240Hz native camera evidence');
 const frozen=JSON.stringify(doc);
 const cx=g4e7ciIntegratedStreetscape(doc,sample,{enabled:true,shots});
 if(!cx.active||cx.landmarksQA?.length!==2||cx.sources?.length<10)
  throw Error('DH needs unchanged native CX monument + civic district');
 const vertices=[],sources=[],landmarkDetails=[];
 for(const s of cx.sources){
  const start=vertices.length/18;
  for(let i=s.firstTriangle*18;i<(s.firstTriangle+s.triangleCount)*18;i++)
   vertices.push(cx.vertices[i]);
  sources.push({...s,firstTriangle:start});
 }
 for(const site of cx.landmarksQA){
  if(![2,6].includes(site.slot)||site.road!==1)throw Error('DH foreign landmark site');
  const frame=physicalRoadFrame(doc,sample,site);
  const firstTriangle=vertices.length/18;
  landmarkDetails.push(addPublicHarbor(vertices,frame,site));
  sources.push({kind:'dh-inhabited-harbor',
   road:site.road,u:site.u,side:site.side,slot:site.slot,
   firstTriangle,triangleCount:vertices.length/18-firstTriangle});
 }
 const triangles=vertices.length/18;
 if(triangles<cx.triangles||triangles>50000||vertices.some(x=>!Number.isFinite(x))||
  sources.reduce((n,s)=>n+s.triangleCount,0)!==triangles||
  sources.some((s,i)=>s.firstTriangle!==(i?sources[i-1].firstTriangle+sources[i-1].triangleCount:0))||
  frozen!==JSON.stringify(doc))throw Error('DH physical inputs / provenance invalid');
 return {...cx,vertices,sources,triangles,
  dg:{id:'G4E7DH_PRIVATE_BROWSER_MODULE_TRIAL_NOT_RELEASED',
   design:'HARBOR_CRESCENT_INHABITED_V1',sourceCX:'immutably preserved',
   activeMonuments:2,landmarkDetails,nonPhysical:true},
  art:'HOLD',human:'HOLD',publish:'HOLD',newRoads:0,newColliders:0,
  newMovingHazards:0,physicalChanged:false,officialSlope2Meters:0};
}
