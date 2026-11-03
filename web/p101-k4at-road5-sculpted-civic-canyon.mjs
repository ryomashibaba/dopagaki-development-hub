/**
 * K4AT — Civic Rift: one source-grounded, non-colliding Road5 sculptural
 * architectural composition, not a repetition of K4AQ's prefab box towers.
 *
 * Genuine Road5 B48 vertices locate the visual art; its original native
 * Road5 collision mesh, B51 moving OBBs, camera and 240 Hz Runner remain
 * independently untouched. All human walkability/floor support is UNTESTED.
 *
 * 7 floats: XYZ, real triangle normal XYZ, K4AQ material-index 0..7.
 */
export const K4AT_DESIGN=Object.freeze({
 schema:'dopagaki.K4AT.sculpted-civic-canyon-single-direction/1',
 sourceBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
 original240Hz:true,realB48:7,realB51:28,
 road:'p93-PRISM_CREST-01',newColliders:0,physicsChanged:false,
 purpose:'ASYMMETRIC_INHABITED_PUBLIC_CRESCENTS_WITH_RIBBED_REAL_B48',
 skyNonOcclusionTarget:'NOT_TESTED',B51Safety:'NOT_TESTED',
 ART:'NOT_TESTED_HOLD',officialARTAccepted:0,slope2DNAMetres:0,
 HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'
});
const up=[0,1,0],add=(a,b)=>a.map((v,i)=>v+b[i]),
 sub=(a,b)=>a.map((v,i)=>v-b[i]),scale=(a,s)=>a.map(v=>v*s),
 dot=(a,b)=>a.reduce((sum,v,i)=>sum+v*b[i],0),
 cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
 unit=a=>scale(a,1/(Math.hypot(...a)||1));
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const targetBall=[922.42,107.34,-321.10]; // K4AS pinned REAL native camera source tick 11320.
function triangle(out,a,b,c,m){
 const n=unit(cross(sub(b,a),sub(c,a)));
 if(Math.hypot(...cross(sub(b,a),sub(c,a)))<1e-5)throw Error('K4AT DEGENERATE SCULPTURE');
 for(const p of [a,b,c])out.push(...p,...n,m);
}
function quad(out,a,b,c,d,m){triangle(out,a,b,c,m);triangle(out,a,c,d,m);}
function local(f,x,d,h){
 return add(add(add(f.origin,scale(f.forward,x)),scale(f.outward,d)),scale(up,h));
}
function box(out,f,x0,x1,d0,d1,h0,h1,material,roof=material){
 if(!(x1>x0+.06&&d1>d0+.06&&h1>h0+.06))throw Error('K4AT EMPTY BUILDING MASS');
 const p=(x,d,h)=>local(f,x,d,h);
 const a=p(x0,d0,h0),b=p(x1,d0,h0),c=p(x1,d1,h0),d=p(x0,d1,h0);
 const e=p(x0,d0,h1),g=p(x1,d0,h1),h=p(x1,d1,h1),i=p(x0,d1,h1);
 quad(out,a,b,g,e,material);quad(out,b,c,h,g,material);
 quad(out,c,d,i,h,material);quad(out,d,a,e,i,material);
 quad(out,e,g,h,i,roof);quad(out,a,d,c,b,7);
}
function renderRing(out,f,segments,xyz,matSide,matTop=matSide){
 for(let i=0;i<segments;i++){
  const x=xyz(i/segments),y=xyz((i+1)/segments);
  const a=local(f,...x[0]),b=local(f,...y[0]);
  const c=local(f,...y[1]),d=local(f,...x[1]);
  quad(out,a,b,c,d,matSide);
  if(x[2]&&y[2]){
   const e=local(f,...x[2]),g=local(f,...y[2]);
   quad(out,d,c,g,e,matTop);
  }
 }
}
function laneFrame(road,sample,u,side){
 const a=sample(road,clamp(u-.003,.0001,.9999),.5),
       b=sample(road,clamp(u+.003,.0001,.9999),.5),
       origin=sample(road,u,.5),
       edge=sample(road,u,side<0?0:1);
 const forward=unit([b[0]-a[0],0,b[2]-a[2]]);
 const sideV=sub(sub(edge,origin),scale(forward,dot(sub(edge,origin),forward)));
 if(!edge.every(Number.isFinite)||Math.hypot(...sideV)<2)
  throw Error('K4AT NO GENUINE ROAD5 EDGE FRAME');
 return {origin,forward,outward:unit([sideV[0],0,sideV[2]])};
}
function sculptedCrescent(out,f,{x0=-75,x1=185,d=62,high=118,phase=0,thickness=14}={}){
 // One continuous, thick concave vaulted structural shell; the entire void
 // below is genuinely empty 3D space, not a black decal.
 const segments=34;
 for(let i=0;i<segments;i++){
  const t0=i/segments,t1=(i+1)/segments;
  const sampleArc=t=>{
   const x=x0+(x1-x0)*t;
   const h=8+high*Math.pow(Math.sin(Math.PI*t),.81);
   const z=d+13*Math.sin(t*Math.PI+phase)+6*Math.sin(3*Math.PI*t+phase);
   return {x,h,z};
  };
  const a=sampleArc(t0),b=sampleArc(t1);
  // Structural shell quadrilateral, genuinely extruded in 3D, no wire-only hoop.
  const point=(p,dist,up)=>local(f,p.x,p.z+dist,p.h+up);
  quad(out,point(a,-thickness,0),point(b,-thickness,0),
    point(b,thickness,7),point(a,thickness,7),0);
  quad(out,point(a,-thickness,7),point(b,-thickness,7),
    point(b,thickness,7),point(a,thickness,7),1);
  quad(out,point(a,-thickness,0),point(a,-thickness,7),
    point(b,-thickness,7),point(b,-thickness,0),2);
  // Aged bronze trim on vault soffit: material identity, not flat rainbow.
  quad(out,point(a,-thickness-.5,1),point(b,-thickness-.5,1),
    point(b,-thickness-.5,2.8),point(a,-thickness-.5,2.8),4);
  // A naturally spaced recessed glazing spine follows the true curvature.
  if(i%3!==1){
   quad(out,point(a,thickness+.2,2.0),point(b,thickness+.2,2.0),
     point(b,thickness+.2,5.6),point(a,thickness+.2,5.6),3);
  }
 }
 // A massive base and lookout terrace, without filling the interior arch.
 box(out,f,x0-8,x0+8,d-21,d+22,0,28,0,2);
 box(out,f,x1-8,x1+8,d-21,d+22,0,25,2,1);
 return {name:'CURVED_THICK_CIVIC_SHELL',outerSpan:x1-x0,clearCentralVoid:true};
}
function curvedTerraces(out,f,{offset=0,sector=0}={}){
 // Two long offset public atria, separated by a central OPEN courtyarded cut.
 // Every level has layered solid floor, back-wall, deep glazing, narrow copper
 // verticals and a genuinely empty part of its frontage.
 for(let level=0;level<5;level++){
  const rise=level*(16+sector*1.4),floorY=4+rise;
  const left=-115+level*9+offset,right=194-level*5+offset;
  const setback=103+level*8+sector*9;
  box(out,f,left,right,setback,setback+56,floorY,floorY+2.6,
   level%2?2:1,1);
  // A true recessed wall: not the fake multi-colored flat road plate.
  for(let j=0;j<19;j++){
   const px=left+j*(right-left)/19,px2=left+(j+1)*(right-left)/19;
   if(j===4||j===5||j===12||j===13)continue; // deliberate deep double atria
   const z=setback+42+(j%3)*.7;
   box(out,f,px+.3,px2-.3,z,z+1.7,floorY+3,floorY+13.7,3,3);
   if(j%4===0)box(out,f,px,px+.65,z-2,z+5,floorY+2.9,floorY+16.1,4,4);
   if(j%3===1)box(out,f,px+.8,px2-.8,z-1.1,z-.1,
     floorY+9,floorY+10.8,5,5);
  }
  const parapetY=floorY+2.5;
  for(let j=0;j<13;j++){
   const xx=left+j*(right-left)/13;
   box(out,f,xx,xx+1.0,setback-3.2,setback-1.1,
      parapetY,parapetY+4.8,2,2);
  }
  box(out,f,left,right,setback-4,setback-2.7,parapetY+4,parapetY+5.0,4,4);
  if(level%2===1)box(out,f,left+30,right-22,setback+57,setback+70,
   floorY+2,floorY+4,0,1);
 }
 // Open galleria: one large stepped public room, no fake playable floor claim.
 for(let k=0;k<4;k++)box(out,f,-66+k*9,69+k*13,72+k*15,112+k*15,
   1+k*6,3+k*6,2,1);
 return {name:'OCCUPIED_FIVE_LEVEL_PUBLIC_ATRIA',levels:5,
  visualFloorOnly:true,walkable:false};
}
function spiralNeedle(out,f,{cx=255,cz=205,height=265,hand=1}={}){
 // A faceted tapered asymmetric civic tower, not a prism or identical
 // apartment tower. A gently rotating section avoids a repeat-box skyline.
 const steps=19,edges=10;
 for(let j=0;j<steps;j++){
  const slice=h=>{
   const t=h/height,rad=(20+6*Math.sin(t*Math.PI*2.3))*(1-.76*t);
   const shiftX=hand*21*t*t,shiftZ=13*Math.sin(t*Math.PI);
   const rot=hand*(.2+1.5*t);
   return Array.from({length:edges},(_,i)=>{
    const theta=i*Math.PI*2/edges+rot,
    radial=rad*(i%2?.92:1.08);
    return [cx+shiftX+Math.cos(theta)*radial,
     cz+shiftZ+Math.sin(theta)*radial,h];
   });
  };
  const first=slice(j*height/steps),second=slice((j+1)*height/steps);
  for(let i=0;i<edges;i++){
   const n=(i+1)%edges;
   quad(out,local(f,...first[i]),local(f,...first[n]),
    local(f,...second[n]),local(f,...second[i]),
    i%5===0?3:i%3===0?1:0);
   if(j%3===0&&i%2===0){
    // Slender copper seam follows the twist, never a full luminous stripe.
    const va=first[i],vb=second[i],off=1.3;
    quad(out,local(f,va[0]-off,va[1]-off,va[2]),
     local(f,va[0]+off,va[1]+off,va[2]),
     local(f,vb[0]+off,vb[1]+off,vb[2]),
     local(f,vb[0]-off,vb[1]-off,vb[2]),4);
   }
  }
 }
 return {name:'TAPERED_CIVIC_NEEDLE',height,notRectangular:true};
}
function translucentGallery(out,f,phase){
 // Lighting is physically located in deep recessed continuous gallery bays.
 // Warm civic interior is legible independently from cold road warnings.
 const x0=-56+phase*14,x1=176+phase*10;
 for(let i=0;i<16;i++){
  const a=x0+(x1-x0)*i/16,b=x0+(x1-x0)*(i+1)/16;
  if(i===5||i===6||i===11)continue;
  box(out,f,a+.5,b-.7,82+phase*7,83+phase*7,31,43,3,3);
  box(out,f,a+1.1,b-1.4,81.2+phase*7,81.9+phase*7,35,40,
    i%4===0?5:7,3);
  if(i%3===0)box(out,f,a+.4,a+1.6,79+phase*7,89+phase*7,30,48,2,2);
 }
 return {name:'DEEP_LIT_ATRIUM_BAYS',bayCount:16,openBays:3};
}
function uNearTarget(road,sample){
 let best={distance:Infinity,u:.5};
 for(let i=2;i<=254;i++){
  const u=i/256,p=sample(road,u,.5);
  const dx=p[0]-targetBall[0],dz=p[2]-targetBall[2];
  const error=Math.hypot(dx,dz); // vertical excluded because bank/grade may differ
  if(error<best.distance)best={distance:error,u};
 }
 if(!Number.isFinite(best.distance)||best.distance>350)
  throw Error('K4AT CANNOT GROUND SCULPTURAL CITY ON REAL ROAD5');
 return best;
}
function validateSource(doc,sample){
 if(typeof sample!=='function'||doc?.surfaces?.length!==7||
   doc?.movingObstacles?.length!==28||doc?.stageForge?.productionPromoted!==false||
   doc.surfaces?.[5]?.id!==K4AT_DESIGN.road)
  throw Error('K4AT FROZEN ORIGINAL B48/B51 SOURCE GUARD');
 return doc.surfaces[5];
}
export function buildK4ATCivicCanyon(doc,sample,{enabled=false}={}){
 if(!enabled)return {active:false,vertices:[],newColliders:0,ART:'HOLD'};
 const road=validateSource(doc,sample),unchanged=JSON.stringify(doc),v=[];
 const target=uNearTarget(road,sample);
 const sites=[
  {u:clamp(target.u+.018,.06,.94),side:-1,offset:0,sector:0},
  {u:clamp(target.u+.075,.06,.94),side:1,offset:28,sector:1},
  {u:clamp(target.u+.16,.06,.94),side:-1,offset:110,sector:0}
 ];
 const programs=[];
 for(let j=0;j<sites.length;j++){
  const site=sites[j],f=laneFrame(road,sample,site.u,site.side);
  const start=v.length;
  programs.push({roadU:site.u,side:site.side,
    ...sculptedCrescent(v,f,{x0:-76+site.offset,x1:190+site.offset,
       d:65+j*16,high:118+j*23,phase:j*.64,thickness:12+j*3}),
    terraces:curvedTerraces(v,f,{offset:site.offset,sector:site.sector}),
    galleries:translucentGallery(v,f,j),
    triangles:(v.length-start)/21});
  if(j===0||j===2)programs.push({...spiralNeedle(v,f,{
   cx:280+site.offset,cz:170+j*34,height:j===0?235:302,hand:j===0?-1:1}),
   side:site.side});
 }
 const triangles=v.length/21;
 const firstBad=v.findIndex(x=>!Number.isFinite(x));
 if(!Number.isInteger(triangles)||triangles<1000||triangles>90000||
    v.some(x=>!Number.isFinite(x))||JSON.stringify(doc)!==unchanged)
  throw Error('K4AT INVALID_SCULPTURE_PROVENANCE '+JSON.stringify({
   length:v.length,triangles,integer:Number.isInteger(triangles),
   nonfinite:v.filter(x=>!Number.isFinite(x)).length,
   firstBad,firstBadValue:firstBad<0?null:String(v[firstBad]),
   firstBadTriangle:Math.floor(firstBad/21),
   firstBadSite:programs.filter(p=>p.roadU!==undefined).map(p=>({u:p.roadU,side:p.side,triangles:p.triangles})),
   mutated:JSON.stringify(doc)!==unchanged}));
 return {active:true,vertices:v,triangles,programs,
   anchorU:target.u,anchorRoadXYDistance:target.distance,
   groundedInSourceRoad:true,sourceRoad:road.id,nonCollision:true,
   newColliders:0,changedPhysics:false,officialARTAccepted:0,
   slope2DNAMetres:0,ART:'NOT_TESTED_HOLD'};
}
export function buildK4ATInlaidRoad(doc,sample,frame,{enabled=false}={}){
 if(!enabled)return {vertices:[],newColliders:0,ART:'HOLD'};
 const road=validateSource(doc,sample);
 if(typeof frame!=='function')throw Error('K4AT MISSING REAL B48 SURFACE NORMAL');
 const unchanged=JSON.stringify(doc),verts=[];
 const p=(u,v,offset=.10)=>{
  const x=sample(road,clamp(u,0,1),v);
  const n=frame(road,clamp(u,0,1),v).normal;
  if(!x.every(Number.isFinite)||!n.every(Number.isFinite))
   throw Error('K4AT INVALID SOURCE ROAD SURFACE POINT');
  return add(x,scale(n,offset));
 };
 const tri=(a,b,c,col)=>{for(const point of [a,b,c])verts.push(...point,...col);};
 const stripe=(ua,ub,va,vb,color)=>{
  const a=p(ua,va),b=p(ub,va),c=p(ub,vb),d=p(ua,vb);
  tri(a,b,c,color);tri(a,c,d,color);
 };
 // The source itself is authoritative: these merely follow the curved,
 // banked B48 rideable skin and provide no false floor, bridge or collider.
 const segments=128,forbidden=new Set(road.voidLongitudinalCells||[]);
 for(let i=0;i<segments;i++){
  const u0=i/segments,u1=(i+1)/segments;
  const physicalCell=Math.floor(u0*(road.rows-1)*(road.resolution||1));
  if(forbidden.has(physicalCell))continue;
  const even=i%2===0;
  for(const [a,b] of [[.045,.061],[.939,.955]])
   stripe(u0,u1,a,b,even?[.34,.49,.51]:[.25,.36,.38]);
  if(i%2===0){
   for(const edge of [.22,.78])
    stripe(u0,u0+.0025,edge,edge+.04,[.59,.61,.54]);
  }
  if(i%6===0){
   for(const [a,b] of [[.07,.16],[.84,.93]])
    stripe(u0,u0+.0015,a,b,[.45,.55,.54]);
  }
  // Thick panel joints at phase cadence, deliberately matte and consistent.
  if(i%5===0)stripe(u0,u0+.0015,.27,.73,[.19,.28,.30]);
 }
 if(verts.length%18||verts.some(x=>!Number.isFinite(x))||
   JSON.stringify(doc)!==unchanged)throw Error('K4AT INLAID ORIGINAL ROAD INVALID');
 // Fully void source road means no overlay, NEVER a fake support bridge.
 return {vertices:verts,triangles:verts.length/18,sourceRoad:road.id,
   nonColliding:true,newColliders:0,changedPhysics:false,ART:'NOT_TESTED_HOLD'};
}
