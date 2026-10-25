/**
 * G4E-7BK / THE HOLLOW CONTINENT.
 * Source-authored GLB 2.0 with distinct metallic, ceramic, glass-like, and
 * physically luminous material surfaces. This is actual 3D WORLD geometry
 * tied to the real BC B48 shoulder; not image generation or fake backdrop.
 * Prototype remains aesthetic HOLD regardless of engineering success.
 */
import {sample} from '../private/reference_only/director/surface.js';
export const BK_MATERIALS=Object.freeze([
 {name:'IVORY CERAMIC ARMOR',color:[.66,.83,.87,1],metallic:.3,roughness:.34,emissive:[0,0,0]},
 {name:'BLUE TITANIUM FACET',color:[.11,.29,.40,1],metallic:.85,roughness:.22,emissive:[0,0,0]},
 {name:'DEEP URBAN GLASS',color:[.09,.32,.38,1],metallic:.48,roughness:.17,emissive:[.018,.07,.085]},
 {name:'WARM CITY WINDOWS',color:[.45,.30,.11,1],metallic:.12,roughness:.46,emissive:[.95,.49,.12]},
 {name:'CYAN ENERGY VEINS',color:[.15,.76,.84,1],metallic:.22,roughness:.25,emissive:[.04,.88,1]},
 {name:'HULL UNDERSIDE',color:[.095,.18,.26,1],metallic:.57,roughness:.51,emissive:[0,0,0]}
]);
const plus=(a,b)=>a.map((x,i)=>x+b[i]),minus=(a,b)=>a.map((x,i)=>x-b[i]),
 mul=(a,t)=>a.map(x=>x*t),dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0),
 cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
 norm=a=>mul(a,1/(Math.hypot(...a)||1)),mix=(a,b,t)=>plus(mul(a,1-t),mul(b,t));
const blank=()=>Array.from({length:BK_MATERIALS.length},()=>[]);
function addTri(tris,m,a,b,c){
 const n=norm(cross(minus(b,a),minus(c,a)));
 if(n.length!==3||!n.every(Number.isFinite)||Math.hypot(...n)<.9||
    [...a,...b,...c].some(x=>!Number.isFinite(x)))throw Error('BK invalid authored normal or position');
 for(const p of [a,b,c])tris[m].push(...p,...n);
}
function face(t,m,a,b,c,d){
 addTri(t,m,a,b,c);addTri(t,m,a,c,d);
}
function double(t,m,a,b,c,d){
 face(t,m,a,b,c,d);face(t,m,d,c,b,a);
}
function solid(t,material,upper,lower){
 // Thick closed structural deck; unequal non-rectangular cross sections
 // are allowed, all eight corner coordinates are real world positions.
 const U=upper,L=lower;
 face(t,material,...U);
 face(t,5,...[...L].reverse());
 for(let i=0;i<4;i++)face(t,i%3===0?1:5,U[i],U[(i+1)%4],L[(i+1)%4],L[i]);
}
function frameAt(s,u,side){
 const center=sample(s,u,.5),edge=sample(s,u,side<0?0:1),
  p=sample(s,u-.0013,.5),q=sample(s,u+.0013,.5),
  forward=norm([q[0]-p[0],0,q[2]-p[2]]),
  slope=minus(edge,center),
  out=norm(minus([slope[0],0,slope[2]],mul(forward,dot(slope,forward))));
 if(![...edge,...forward,...out].every(Number.isFinite)||dot(out,slope)<2)
  throw Error('BK requires finite truly native B48 road shoulder');
 return {edge,forward,out};
}
function place(f,along,outboard,rise){
 return plus(plus(plus(f.edge,mul(f.forward,along)),mul(f.out,outboard)),[0,rise,0]);
}
function beam(t,m,a,b,width=2){
 const forward=norm(minus(b,a)),ref=Math.abs(forward[1])>.85?[0,0,1]:[0,1,0],
  r=norm(cross(forward,ref)),up=norm(cross(r,forward)),
  A=mul(r,width*.5),B=mul(up,width*.36);
 const ring=p=>[plus(plus(p,A),B),plus(minus(p,A),B),minus(minus(p,A),B),plus(minus(p,B),A)];
 const u=ring(a),v=ring(b);
 for(let i=0;i<4;i++)face(t,m,u[i],u[(i+1)%4],v[(i+1)%4],v[i]);
}
function glbFromTriangles(sets,meta){
 const chunks=[],views=[],accessors=[],primitives=[];let bytes=0,triangles=0;
 const append=(data)=>{
  const aligned=Buffer.alloc(Math.ceil(data.length/4)*4);
  data.copy(aligned,0);const offset=bytes;bytes+=aligned.length;chunks.push(aligned);
  views.push({buffer:0,byteOffset:offset,byteLength:data.length});
  return views.length-1;
 };
 for(let material=0;material<sets.length;material++){
  const d=sets[material];
  if(!d.length)continue;
  if(d.length%6||d.some(x=>!Number.isFinite(x)))throw Error('BK nonfinite material triangle stream');
  const n=d.length/6,p=new Float32Array(n*3),normals=new Float32Array(n*3),
   lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
  for(let i=0;i<n;i++)for(let k=0;k<3;k++){
   const x=d[i*6+k],v=d[i*6+3+k];p[3*i+k]=x;normals[3*i+k]=v;
   lo[k]=Math.min(lo[k],x);hi[k]=Math.max(hi[k],x);
  }
  const pv=append(Buffer.from(p.buffer)),nv=append(Buffer.from(normals.buffer));
  const pa=accessors.push({bufferView:pv,componentType:5126,count:n,type:'VEC3',min:lo,max:hi})-1;
  const na=accessors.push({bufferView:nv,componentType:5126,count:n,type:'VEC3'})-1;
  primitives.push({attributes:{POSITION:pa,NORMAL:na},material,mode:4});
  triangles+=n/3;
 }
 const materials=BK_MATERIALS.map(x=>({
  name:x.name,doubleSided:true,
  pbrMetallicRoughness:{
   baseColorFactor:x.color,metallicFactor:x.metallic,roughnessFactor:x.roughness
  },emissiveFactor:x.emissive
 }));
 const gltf={asset:{version:'2.0',generator:'G4E-7BK world-space architectural GLB author'},
  scenes:[{nodes:[0]}],scene:0,nodes:[{mesh:0,name:'HOLLOW CONTINENT | actual BC road2 world space'}],
  meshes:[{name:'HOLLOW CONTINENT | multi-material visible city',primitives}],
  materials,buffers:[{byteLength:bytes}],bufferViews:views,accessors,
  extras:{...meta,physics:'NO COLLIDERS',humanQA:'HOLD',artApproval:'HOLD',publication:'HOLD'}};
 const js=Buffer.from(JSON.stringify(gltf));
 const jp=Buffer.alloc(Math.ceil(js.length/4)*4,32);js.copy(jp);
 const binary=Buffer.concat(chunks);
 const total=12+8+jp.length+8+binary.length;
 const glb=Buffer.alloc(total);glb.writeUInt32LE(0x46546c67,0);glb.writeUInt32LE(2,4);glb.writeUInt32LE(total,8);
 glb.writeUInt32LE(jp.length,12);glb.writeUInt32LE(0x4e4f534a,16);jp.copy(glb,20);
 const o=20+jp.length;glb.writeUInt32LE(binary.length,o);glb.writeUInt32LE(0x004e4942,o+4);binary.copy(glb,o+8);
 return {glb,meta:{...meta,triangles,materialCount:materials.length,byteLength:total}};
}
export function generateBKModel(doc){
 const b=doc?.stageForge?.g4e7bcStudy;
 if(b?.id!=='bank-grade-contour'||b.variant!=='rollDeck'||!['true-pinch','pinch-switch'].includes(b.road)||
   !b.real7B48||!b.real28B51||!b.hasRealVoid52||
   doc.stageForge.productionPromoted!==false||b.publish!=='HOLD'||b.formalSlope2Meters!==0||
   doc.surfaces.length!==7||doc.movingObstacles.length!==28||
   doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52')
  throw Error('BK author requires untouched genuine PRIVATE BC rollDeck stage');
 const snapshot=JSON.stringify(doc),t=blank(),s=doc.surfaces[1],segments=54,stations=[];
 const at=(u,side,offset,up)=>place(frameAt(s,u,side),0,offset,up);
 // Two asymmetrical colossal CRADLE LANDS: avoid BLACK WALLS and small
 // thin boxes. Interconnected thick ceramic faulted roofs above fractured
 // warm inner glass neighborhoods, tapering downward into the blue abyss.
 for(const [bank,side] of [1,-1].entries()){
  const fraction=bank===0?.99:.61;
  const n=Math.floor(segments*fraction);
  const u0=bank===0?.55:.59,u1=bank===0?.855:.805;
  for(let i=0;i<=n;i++){
   const u=u0+(u1-u0)*i/n,drift=Math.sin(Math.PI*i/n),ripple=Math.sin(i*.43+bank);
   // Road road-side skin remains empty: no road bridge or false road lane.
   const inner=bank===0?85:102,outer=bank===0?235:178;
   const roof=bank===0?28:16;
   const x=inner+9*ripple,z=outer+38*drift;
   const f=frameAt(s,u,side);
   const p=(o,h)=>place(f,0,o,h);
   stations.push({bank,i,u,innerTop:p(x,roof+8*ripple),innerBot:p(x+8,roof-18),
    crestTop:p(z,roof+45*drift+8*ripple),crestBot:p(z+10,roof+27*drift),
    outerTop:p(z+65,roof+3*drift),outerBot:p(z+80,roof-38-12*drift),
    lowInner:p(x+29,-42-25*drift),lowOuter:p(z+69,-150-40*drift),
    mainFrame:f});
  }
  const ss=stations.filter(x=>x.bank===bank);
  for(let i=0;i<ss.length-1;i++){
   const a=ss[i],b1=ss[i+1];
   const hole=(i%19>=8&&i%19<=11)||(i%19===15&&bank===1);
   if(hole)continue; // giant true architectural excavations; genuine sky.
   // Explicit THICK sculpted folded roof mass (not billboard plane).
   solid(t,0,[a.innerTop,b1.innerTop,b1.crestTop,a.crestTop],
    [a.innerBot,b1.innerBot,b1.crestBot,a.crestBot]);
   solid(t,1,[a.crestTop,b1.crestTop,b1.outerTop,a.outerTop],
    [a.crestBot,b1.crestBot,b1.outerBot,a.outerBot]);
   // Lower strata are huge volumetric wedge formations, carved with gaps.
   if(i%7!==4&&i%7!==5){
    double(t,1,a.innerBot,b1.innerBot,b1.lowInner,a.lowInner);
    double(t,5,a.lowInner,b1.lowInner,b1.lowOuter,a.lowOuter);
    double(t,1,a.outerBot,b1.outerBot,b1.lowOuter,a.lowOuter);
   }
   // A few coherent metal/energy accent structural strakes, not a forest
   // of same-thickness glowing beams used by BF/BH/BI/BJ.
   if(i%4===0)beam(t,4,a.crestTop,b1.crestTop,2.4);
  }
  // Deep open atrium terraces spanning 20–60m, in bands of three distinct
  // occupancy elevations below road level. Each deck has thickness and
  // illuminated INNER habitable facade cells carved from the main hull.
  for(let tier=0;tier<3;tier++)for(let i=3;i<ss.length-4;i+=4){
   if(i%19>=8&&i%19<=11)continue;
   const a=ss[i],b1=ss[Math.min(ss.length-1,i+3)],h=-20-tier*38,
    inside=bank===0?112:121,outside=bank===0?198:159,
    p=(point,o,y)=>place(point.mainFrame,0,o,y);
   solid(t,tier===2?1:0,[
    p(a,inside,h),p(b1,inside+7,h+5),p(b1,outside,h-9),p(a,outside,h-8)
   ],[
    p(a,inside,h-9),p(b1,inside+7,h-5),p(b1,outside,h-21),p(a,outside,h-20)
   ]);
   // Recessed windows at inhabited walls. Genuinely emissive glTF materials.
   for(let j=0;j<3;j++){
    const w0=i+j,w1=w0+1;
    if(w1>=ss.length)break;
    const x=ss[w0],y=ss[w1],base=inside+3,
      illum=j%2===0?3:2;
    face(t,illum,p(x,base,h-15),p(y,base,h-14),p(y,base,h-22),p(x,base,h-22));
   }
  }
 }
 // One geometrically unmistakable central excavation: three split, thick
 // hanging hero ribs follow actual B48 coordinates but never cover its lane.
 for(const u of [.635,.735,.815]){
  for(const side of [-1,1]){
   const curve=[],count=16;
   for(let i=0;i<=count;i++){
    const q=i/count,off=100+110*Math.sin(Math.PI*q)+26*q,
     height=-126+160*q-45*Math.sin(Math.PI*q);
    curve.push(at(u+(.018*(q-.5)),side,off,height));
   }
   for(let i=0;i<count;i++){
    if(i===5||i===6||i===10)continue; // true hollow voids
    beam(t,i%3===0?0:1,curve[i],curve[i+1],7+4*Math.sin(Math.PI*i/count));
   }
  }
 }
 const meta={schema:'dopagaki.g4e7bk-private-material-city/1',road:b.road,
  sourceStageId:doc.stageForge.recordStageId,realB48:7,realB51:28,
  genuineCell52:true,officialSlope2Meters:0};
 if(JSON.stringify(doc)!==snapshot)throw Error('BK artist mutated canonical B48 physics');
 return glbFromTriangles(t,meta);
}
