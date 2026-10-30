/**
 * R18P1: two INDEPENDENT architectural massing languages in ONE temporal city.
 * Geometry is actual world XYZ/RGB triangles, rendered by the genuine isolated
 * original WebGL2 game. PRIVATE non-colliding decoration ONLY. Neither
 * visibility nor human/gameplay safety is asserted by mesh construction.
 *
 * Sites explicitly reuse R18 P0 genuine original RAW 240Hz camera proposal
 * coordinates: reference right=[-forward.z,0,forward.x], NOT inferred road
 * edge sign. A false-left/right mapping would invalidate placement evidence.
 */
export const DESIGNS=Object.freeze([
 'A_CIVIC_RIBBON_CONCOURSE','B_TERRACED_COURT_NETWORK'
]);
const SITES=Object.freeze([
 {road:5,u:.18,offset:240,up:100,time:54,role:'approach-landmark'},
 {road:5,u:.48,offset:-120,up:100,time:58,role:'urban-foreshadow'},
 {road:5,u:.91,offset:-120,up:100,time:61,role:'civic-heart'},
 {road:6,u:.30,offset:-240,up:100,time:64,role:'transit-concourse'},
 {road:6,u:.78,offset:-120,up:100,time:67,role:'exit-skyline'}
]);
const PAL={
 ceramic:[.87,.91,.91],warm:[.89,.75,.58],metal:[.22,.44,.52],
 shadow:[.09,.17,.24],sea:[.19,.62,.67],blue:[.21,.54,.73],
 timber:[.62,.37,.29],gold:[.95,.66,.33],glass:[.38,.75,.76],
 green:[.28,.67,.53],ink:[.10,.21,.29],light:[.68,.97,.91]
};
const plus=(a,b)=>a.map((v,i)=>v+b[i]),minus=(a,b)=>a.map((v,i)=>v-b[i]),
 scale=(a,k)=>a.map(v=>v*k),mag=v=>Math.hypot(...v),
 norm=v=>scale(v,1/(mag(v)||1)),cross=(a,b)=>[
 a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
 dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);
function ok(x,msg){if(!x)throw Error('R18P1 '+msg);}
function tri(out,a,b,c,color){for(const p of [a,b,c])out.push(...p,...color);}
function quad(out,a,b,c,d,color){
 tri(out,a,b,c,color);tri(out,a,c,d,color);
 tri(out,d,c,b,PAL.shadow);tri(out,d,b,a,PAL.shadow);
}
function beam(out,a,b,width,height,color){
 const axis=norm(minus(b,a)),base=Math.abs(axis[1])>.95?[0,0,1]:[0,1,0],
 side=norm(cross(axis,base)),up=norm(cross(axis,side));
 ok(mag(minus(b,a))>.5,'degenerate actual beam '+JSON.stringify({distance:mag(minus(b,a)),from:a,to:b}));
 const ring=p=>[
  plus(plus(p,scale(side,width/2)),scale(up,height/2)),
  plus(minus(p,scale(side,width/2)),scale(up,height/2)),
  minus(minus(p,scale(side,width/2)),scale(up,height/2)),
  plus(minus(p,scale(up,height/2)),scale(side,width/2))];
 const aa=ring(a),bb=ring(b);
 for(let i=0;i<4;i++){const j=(i+1)%4;quad(out,aa[i],aa[j],bb[j],bb[i],color);}
 quad(out,aa[0],aa[3],aa[2],aa[1],color);
 quad(out,bb[0],bb[1],bb[2],bb[3],color);
}
function frame(doc,sample,s){
 const surface=doc.surfaces[s.road],center=sample(surface,s.u,.5),
 a=sample(surface,Math.max(0,s.u-.002),.5),
 b=sample(surface,Math.min(1,s.u+.002),.5),
 vector=[b[0]-a[0],0,b[2]-a[2]],forward=norm(vector),
 right=[-forward[2],0,forward[0]],rim=sample(surface,s.u,0);
 ok(mag(vector)>1&&Math.abs(dot(right,forward))<1e-8,'invalid genuine tangent');
 // Explicit independent R15 R18 camera normal calculation, not rim sign.
 const origin=plus(plus(center,scale(right,s.offset)),[0,s.up,0]);
 ok(origin.every(Number.isFinite), 'nonfinite camera source site '+JSON.stringify({site:s,center,a,b,forward,right,origin}));
 return {origin,forward,right,center,edgeVector:minus(rim,center),
  cameraReferenceNormal:right};
}
const at=(f,x,z,y)=>plus(plus(plus(f.origin,scale(f.right,x)),
 scale(f.forward,z)),[0,y,0]);
function cap(out,f,x,z,y,r,height,sides,color,stat){
 // Genuine many-sided sculpted tapered tower with absent central top,
 // not a giant solid-wall box. Facades are segmented; door-size voids.
 const a=[],b=[];
 for(let i=0;i<=sides;i++){
  const th=Math.PI*2*i/sides+.17,
    radius=r*(1+.10*Math.cos(th*3));
  a.push(at(f,x+radius*Math.cos(th),z+radius*.72*Math.sin(th),y));
  b.push(at(f,x+radius*.79*Math.cos(th+.11),
   z+radius*.65*Math.sin(th+.11),y+height));
 }
 for(let i=0;i<sides;i++){
  if((i+2)%5===0){stat.realFacadeVoids++;continue;}
  quad(out,a[i],a[i+1],b[i+1],b[i],
   i%7===0?PAL.warm:i%3===0?PAL.sea:color);
  if(i%3===0)beam(out,a[i],b[i],1.4,1.8,PAL.light);
 }
 const crown=at(f,x+8,z+4,y+height+16);
 for(let i=0;i<sides;i++)if(i%5!==0)
  tri(out,b[i],b[i+1],crown,PAL.ceramic);
 stat.occupiedTowerVolumes++;
}
function openCourt(out,f,x,z,y,w,l,color,stat){
 // Actual central EMPTY polygon; no quad is ever drawn across it.
 const outXY=[[-w/2,-l/2],[w/2,-l/2],[w/2,l/2],[-w/2,l/2]];
 const inXY=outXY.map(([a,b])=>[a*.64,b*.62]);
 for(let i=0;i<4;i++){
  const n=(i+1)%4;
  quad(out,at(f,x+outXY[i][0],z+outXY[i][1],y),
   at(f,x+outXY[n][0],z+outXY[n][1],y),
   at(f,x+inXY[n][0],z+inXY[n][1],y),
   at(f,x+inXY[i][0],z+inXY[i][1],y),color);
 }
 stat.openAirCivicVoids++;
}
function vault(out,f,x,z,y,w,l,high,stat,color){
 // Curved leaning public gateway built only from slim framing edges:
 // no overhead flat ceiling and no continuous side wall.
 const n=24,left=[],right=[];
 for(let i=0;i<=n;i++){
  const t=i/n,a=Math.PI*t;
  left.push(at(f,x-w/2+22*Math.sin(a),z+l*(t-.5),y+high*Math.sin(a)+14*t));
  right.push(at(f,x+w/2+13*Math.sin(a+.3),z+l*(t-.5),y+high*Math.sin(a*.92)+10*t));
 }
 for(let i=0;i<n;i++){
  beam(out,left[i],left[i+1],3.7,5.5,color);
  beam(out,right[i],right[i+1],3.7,5.5,PAL.warm);
  if(i%4===0){beam(out,left[i],right[i],2.1,3.1,PAL.glass);stat.openBayConnectors++;}
 }
 stat.sourceLandmarks++;
}
function petal(out,f,x,z,y,rx,rz,theta,color,stat){
 // Scalloped, pitched circulation deck (one wedge only, no solid roof).
 const a=at(f,x,z,y+3),b=at(f,x+rx*Math.cos(theta),z+rz*Math.sin(theta),y+6),
 c=at(f,x+rx*Math.cos(theta+.31),z+rz*Math.sin(theta+.31),y+10);
 tri(out,a,b,c,color);tri(out,c,b,a,PAL.ink);
 beam(out,b,c,2.5,4,PAL.ceramic);stat.terracedPublicSegments++;
}
function ribbonExchange(out,f,s,stat){
 const id=s.time;
 // Each episode has a distinct spatial program, NOT a cloned island.
 if(id===54){
  vault(out,f,0,-40,-58,146,150,188,stat,PAL.ceramic);
  cap(out,f,-79,-53,-50,38,167,13,PAL.metal,stat);
  cap(out,f,105,42,-52,30,107,11,PAL.sea,stat);
 }else if(id===58){
  for(let i=0;i<9;i++)petal(out,f,-15,-15,-44,95,72,i*.66,
    i%2?PAL.green:PAL.warm,stat);
  cap(out,f,-57,31,-53,43,129,15,PAL.blue,stat);
  cap(out,f,82,-67,-54,28,113,9,PAL.metal,stat);
 }else if(id===61){
  vault(out,f,8,-5,-59,175,194,206,stat,PAL.light);
  openCourt(out,f,-61,48,-20,116,145,PAL.ceramic,stat);
  openCourt(out,f,66,-39,1,92,112,PAL.sea,stat);
  cap(out,f,-118,-117,-57,42,116,14,PAL.metal,stat);
 }else if(id===64){
  openCourt(out,f,-45,-55,-45,122,153,PAL.warm,stat);
  openCourt(out,f,62,35,-7,109,123,PAL.ceramic,stat);
  for(let k=0;k<4;k++){
   const a=at(f,-111,-80+k*43,-38+k*8),
    b=at(f,105,-34+k*33,24+k*14);
   beam(out,a,b,3.6,5.3,PAL.glass);stat.transitConnectors++;
  }
  cap(out,f,108,79,-44,38,110,12,PAL.blue,stat);
 }else{
  for(let i=0;i<11;i++)petal(out,f,5,30,-37,142,114,
   i*.54,i%2?PAL.gold:PAL.sea,stat);
  cap(out,f,-101,-47,-54,34,142,11,PAL.ceramic,stat);
  cap(out,f,112,-57,-52,25,185,13,PAL.metal,stat);
 }
 stat.episodes++;
}
function terracedNetwork(out,f,s,stat){
 const id=s.time,k=(id-54)/13;
 // Alternative to A: offset carved courts + genuinely open stair-zigzag
 // profiles rather than semi-arches; FIVE nonrepeating skyline rhythms.
 const courts=id===54?1:id===58?2:id===61?3:id===64?4:2;
 for(let i=0;i<courts;i++){
  const x=(i%2===0?-1:1)*(48+14*i),
    z=-82+53*i+11*Math.sin(id);
  openCourt(out,f,x,z,-51+19*i,90-5*i,106+8*i,
   i%2?PAL.ceramic:PAL.sea,stat);
  const h=69+i*20+17*Math.cos(id+i);
  cap(out,f,x+(x>0?26:-25),z+18,-55+20*i,25+2*i,h,
   9+(i%4)*2,i%2?PAL.metal:PAL.warm,stat);
 }
 // Open, jagged inhabited railway station spine occupies one side of the
 // world frame; never fill the source B48 road with fictional collision.
 const n=id===54?9:id===58?12:id===61?15:id===64?17:11;
 const side=id===54?1:-1;
 const line=[];
 for(let i=0;i<=n;i++){
  const t=i/n;
  line.push(at(f,side*(83+18*Math.sin(t*Math.PI*2)),
   -177+330*t,-42+143*Math.sin(t*Math.PI*.65)+45*t));
 }
 for(let i=0;i<n;i++)beam(out,line[i],line[i+1],
  7.5,10,i%3?PAL.ceramic:PAL.gold);
 for(let i=1;i<n;i+=3){
  beam(out,line[i],at(f,side*115,-177+330*i/n,-63),
   5,8,PAL.sea);stat.transitConnectors++;
 }
 stat.sourceLandmarks++;stat.episodes++;
}
function connectDistricts(out,frames,stat,mode){
 // Thin elevated circulation spines BETWEEN real camera site anchors.
 // These create a single megacity composition instead of 5 loose buildings.
 // Never claim that these are physically safe or pedestrian walkable.
 for(let i=0;i<frames.length-1;i++){
  const a=frames[i],b=frames[i+1];
  const offset=mode===DESIGNS[0]?[-63,-74,36]:[69,54,63];
  const aa=at(a,offset[0],96,12),bb=at(b,offset[1],-106,23);
  const span=mag(minus(bb,aa));
  // The gentle 8m sag protects each chord from zero-length cancellation even on steep B48.\n  // No unbounded giant rails accidentally spanning a discontinuous world.
  // Only draw a visually continuous connection when world-space plausible.
  if(span>1100||span<15){stat.disconnectedCorridors++;continue;}
  const n=Math.ceil(span/74),points=[];
  for(let j=0;j<=n;j++){
   const t=j/n,p=plus(scale(aa,1-t),scale(bb,t));
   points.push(plus(p,[0,8*Math.sin(Math.PI*t)]));
  }
  for(let j=0;j<n;j++)beam(out,points[j],points[j+1],
   3.4,4.6,mode===DESIGNS[0]?PAL.glass:PAL.gold);
  stat.transitConnectors++;
 }
}
export function buildR18P1City(doc,sample,{mode=DESIGNS[0]}={}){
 ok(DESIGNS.includes(mode),'unknown/forged city mode');
 ok(doc?.surfaces?.length===7&&doc?.movingObstacles?.length===28,
  'true original 7 B48 and 28 moving B51 mandatory');
 ok(doc?.stageForge?.r15s3d11?.mode==='A_EDGE_READABLE'&&
  doc.stageForge.productionPromoted===false,
  'requires frozen private D11 source not production');
 const frozen=JSON.stringify(doc),out=[],stat={
  mode,sites:SITES.map(s=>({...s})),episodes:0,sourceLandmarks:0,
  occupiedTowerVolumes:0,realFacadeVoids:0,openAirCivicVoids:0,
  openBayConnectors:0,terracedPublicSegments:0,transitConnectors:0,
  disconnectedCorridors:0,roadB48:7,movingB51:28,physicsCollidersAdded:0,
  officialArtApproved:0,originalCameraReference:'R15S3D15_TRUE_10_NATIVE_CAMERAS',
  sourceRightDefinition:'[-forward.z,0,forward.x]'
 };
 const frames=SITES.map(s=>frame(doc,sample,s));
 for(let i=0;i<SITES.length;i++){
  if(mode===DESIGNS[0])ribbonExchange(out,frames[i],SITES[i],stat);
  else terracedNetwork(out,frames[i],SITES[i],stat);
 }
 connectDistricts(out,frames,stat,mode);
 ok(JSON.stringify(doc)===frozen,'source physical document was mutated');
 ok(stat.episodes===5&&stat.occupiedTowerVolumes>=7&&
  stat.sourceLandmarks>=2&&stat.openAirCivicVoids>=1&&
  stat.transitConnectors>=1,'missing spatial-temporal city program');
 ok(out.length%18===0&&out.length/18>1800&&out.length/18<90000,
  'real GPU triangle budget');
 ok(out.every(Number.isFinite),'nonfinite genuine 3D vertex');
 return {vertices:out,triangles:out.length/18,...stat,
  actualWebGL2Required:true,ART:'HOLD',GAMEPLAY:'HOLD',
  HUMAN:'HOLD',PERFORMANCE:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
}
