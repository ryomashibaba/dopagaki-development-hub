/**
 * R15S3D17: two genuinely different, non-colliding PRIVATE source-world
 * urban constructions. Road-connected VISUALLY; no actual player collider or
 * assertion of safe pedestrian connection. Original WebGL2 camera must judge.
 * A = oblique inhabited transit exchange with ONE broad asymmetric gate;
 * B = offset carved station courts, stepped mass, no overhead giant ring.
 * The two original B48 surface camera anchors are preserved as site references.
 */
export const DESIGNS=Object.freeze(['A_OBLIQUE_CIVIC_EXCHANGE','B_SPLIT_STATION_COURTS']);
const P={stone:[.20,.32,.38],dark:[.075,.14,.20],ivory:[.90,.87,.75],
  white:[.77,.92,.94],copper:[.91,.58,.35],aqua:[.19,.68,.75],
  teal:[.19,.47,.52],window:[.30,.78,.82],shade:[.11,.20,.25],
  violet:[.53,.46,.72],light:[.64,.98,.91]};
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),
 mul=(a,s)=>a.map(x=>x*s),len=a=>Math.hypot(...a),
 unit=a=>mul(a,1/(len(a)||1)),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),
 cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function check(condition,message){if(!condition)throw Error('R15S3D17 '+message);}
function tri(out,a,b,c,color){for(const q of [a,b,c])out.push(...q,...color);}
function face(out,a,b,c,d,color){tri(out,a,b,c,color);tri(out,a,c,d,color);
 tri(out,d,c,b,P.shade);tri(out,d,b,a,P.shade);}
function beam(out,p,q,w,d,color){
 const axis=unit(sub(q,p));
 const reference=Math.abs(axis[1])>.91?[0,0,1]:[0,1,0];
 const side=unit(cross(axis,reference)),up=unit(cross(axis,side));
 const corners=v=>[
  add(add(v,mul(side,w/2)),mul(up,d/2)),
  add(sub(v,mul(side,w/2)),mul(up,d/2)),
  sub(sub(v,mul(side,w/2)),mul(up,d/2)),
  add(sub(v,mul(up,d/2)),mul(side,w/2))];
 const a=corners(p),b=corners(q);
 for(let i=0;i<4;i++){const j=(i+1)%4;face(out,a[i],a[j],b[j],b[i],color);}
 face(out,a[0],a[3],a[2],a[1],color);face(out,b[0],b[1],b[2],b[3],color);
}
function roadFrame(doc,sample,road,u){
 const surf=doc.surfaces[road],center=sample(surf,u,.5),
  a=sample(surf,Math.max(0,u-.001),.5),
  b=sample(surf,Math.min(1,u+.001),.5),
  direction=unit([b[0]-a[0],0,b[2]-a[2]]),
  rim=sample(surf,u,0),rough=[rim[0]-center[0],0,rim[2]-center[2]],
  side=unit(sub(rough,mul(direction,dot(rough,direction))));
 check(len(rough)>6&&len(direction)>.9&&len(side)>.9,'invalid source road frame');
 return {center,direction,side};
}
function at(f,x,z,y){return add(add(add(f.center,mul(f.side,x)),mul(f.direction,z)),[0,y,0]);}
function box(out,f,x,z,y,w,l,h,color){
 const a=[at(f,x-w/2,z-l/2,y),at(f,x+w/2,z-l/2,y),
  at(f,x+w/2,z+l/2,y),at(f,x-w/2,z+l/2,y)];
 const b=a.map(p=>add(p,[0,h,0]));
 face(out,a[0],a[1],a[2],a[3],color);
 face(out,b[0],b[3],b[2],b[1],color);
 for(let i=0;i<4;i++){const j=(i+1)%4;face(out,a[i],b[i],b[j],a[j],color);}
}
function ringCourt(out,f,x,z,y,w,l,border,stat,color){
 const outer=[[-w/2,-l/2],[w/2,-l/2],[w/2,l/2],[-w/2,l/2]];
 const inner=[[-w/2+border,-l/2+border],[w/2-border,-l/2+border],
  [w/2-border,l/2-border],[-w/2+border,l/2-border]];
 for(let i=0;i<4;i++){
  const j=(i+1)%4;
  const a=at(f,x+outer[i][0],z+outer[i][1],y),
        b=at(f,x+outer[j][0],z+outer[j][1],y),
        c=at(f,x+inner[j][0],z+inner[j][1],y),
        d=at(f,x+inner[i][0],z+inner[i][1],y);
  face(out,a,b,c,d,color);
  beam(out,a,b,2,3,P.ivory);
 }
 stat.trueOpenCourts++; // absence of ALL polygons in the interior is the court.
 stat.publicDecks++;
}
function fenestratedPod(out,f,x,z,base,w,l,h,stat,palette){
 // Occupied, solid asymmetric body. Open portal is physically absent in
 // the middle of the facade; do not draw a misleading closed wall.
 box(out,f,x,z,base,w,l,h,palette);
 const levels=[.26,.51,.77];
 for(let j=0;j<levels.length;j++){
  const y=base+h*levels[j];
  for(const side of [-1,1]){
   const px=x+side*(w/2+1.8);
   beam(out,at(f,px,z-l*.39,y),at(f,px,z+l*.39,y),1.6,2.2,P.window);
  }
 }
 stat.occupiedVolumes++;
}
function sculptedArch(out,f,z,variant,stat){
 // An asymmetric inhabited exchange threshold: supports are >45m from
 // road center; physical driving road stays the SOURCE B48, untouched.
 const count=21,left=-73,right=83;
 const pts=[];
 for(let i=0;i<=count;i++){
  const t=i/count,x=left+(right-left)*t;
  const y=14+109*Math.pow(Math.sin(Math.PI*t),.83)+21*t;
  const depth=z+14*Math.sin(Math.PI*t)+12*t;
  pts.push(at(f,x,depth,y));
 }
 for(let i=0;i<count;i++)beam(out,pts[i],pts[i+1],variant===0?11:9,10,
  i<8?P.stone:i<16?P.aqua:P.ivory);
 for(const side of [-1,1]){
  const x=side<0?left:right;
  beam(out,at(f,x,z-2,-32),at(f,x,z,17),11,11,P.stone);
 }
 // OPEN underside: no sheet/floor spanning the road.
 stat.sourceAlignedThresholds++;
}
function transitExchange(out,f,site,stat){
 const zz=site?25:0;
 // Massing is NOT a repeated ring of aerial islands: a low facade,
 // a diagonally growing terminal and a single tall asymmetric exchange.
 sculptedArch(out,f,-112+zz,site,stat);
 box(out,f,-77,-67+zz,-15,56,119,35,P.stone);
 fenestratedPod(out,f,-79,-23+zz,18,44,84,73,stat,P.ivory);
 fenestratedPod(out,f,87,-129+zz,-12,75,104,99,stat,P.teal);
 fenestratedPod(out,f,119,-9+zz,11,51,84,68,stat,P.ivory);
 box(out,f,68,72+zz,-18,42,104,28,P.stone);
 for(let i=0;i<3;i++){
  const x=i===2?89:-80,y=21+i*23,z=-170+i*101+zz;
  ringCourt(out,f,x,z,y,62-i*5,74,10,stat,i===0?P.aqua:P.white);
 }
 for(const [x,z,h] of [[-58,-212,54],[-93,100,66],[105,105,42],[77,-218,73]]){
  beam(out,at(f,x,z,-25),at(f,x+(x>0?10:-9),z+15,h),9,11,P.ivory);
  stat.structuralMembers++;
 }
 // Strong vertical elevation rhythm, side-oriented: no flat canyon wall.
 for(let i=0;i<8;i++){
  const side=i%2?-1:1,x=side*(47+11*(i%3)),z=-180+i*49+zz;
  const y=24+(i%3)*17;
  beam(out,at(f,x,z,-16),at(f,x+side*7,z+11,y+37),4.5,5,
   i%2?P.copper:P.window);
  stat.structuralMembers++;
 }
}
function carveStation(out,f,x,z,site,stat){
 // A different topology to A: staggered side-loaded station masses
 // around a genuine open court, with NO full cross-road arch.
 box(out,f,x,z,-25,76,130,28,P.stone);
 ringCourt(out,f,x,z,-1,74,125,13,stat,P.white);
 ringCourt(out,f,x+8,z+7,23,58,94,9,stat,P.teal);
 const stride=x>0?1:-1;
 fenestratedPod(out,f,x+stride*12,z-44,25,30,30,66,stat,P.ivory);
 fenestratedPod(out,f,x-stride*9,z+49,23,36,38,91,stat,P.aqua);
 // Open-air vertical circulation, exterior to the car race.
 for(let i=0;i<6;i++){
  const sx=x+stride*(27+3*(i%2)),sz=z-55+i*23;
  beam(out,at(f,sx,sz,3+i*2),at(f,sx+stride*7,sz+7,92+(i%3)*6),
   3.5,5,P.copper);
  stat.structuralMembers++;
 }
 stat.stationCourts++;
}
function splitCourts(out,f,site,stat){
 const dz=site?35:0;
 carveStation(out,f,-80,-115+dz,site,stat);
 carveStation(out,f,74,64+dz,site,stat);
 // Distinct landmark: swept *vertical* asymmetric city fin outside the
 // driving line, not overhead roof or hundreds of identical strips.
 const pts=[];
 for(let i=0;i<=24;i++){
  const t=i/24;
  pts.push(at(f,83+26*Math.sin(t*Math.PI*.7),-188+204*t+dz,
    16+177*Math.sin(t*Math.PI*.62)+33*t));
 }
 for(let i=0;i<24;i++)beam(out,pts[i],pts[i+1],12,15,
  i<12?P.ivory:P.copper);
 for(const [x,z,h] of [[-67,-244,84],[-112,-18,105],[111,168,98]]){
  beam(out,at(f,x,z,-27),at(f,x+(x>0?23:-15),z+28,h),
   10,13,P.stone);
  stat.structuralMembers++;
 }
}
export function buildR15S3D17City(doc,sample,{mode='A_OBLIQUE_CIVIC_EXCHANGE'}={}){
 check(DESIGNS.includes(mode),'unsupported or forged art mode');
 check(doc?.surfaces?.length===7&&doc?.movingObstacles?.length===28,
  'original 7 B48 and 28 B51 must exist');
 check(doc.stageForge?.r15s3d11?.mode==='A_EDGE_READABLE'&&
  doc.stageForge.productionPromoted===false,'requires original isolated unpromoted D11 source');
 const frozen=JSON.stringify(doc),out=[],stat={mode,
  sourceCamera:'R15S3D15_TRUE_10_WEBGL2_CAMERA_TICKS',
  realAnchors:[{road:5,u:.78},{road:6,u:.62}],
  districts:0,trueOpenCourts:0,publicDecks:0,occupiedVolumes:0,
  structuralMembers:0,sourceAlignedThresholds:0,stationCourts:0,
  originalRoads:7,originalMovingHazards:28,addedOriginalPhysicsObjects:0,
  collisionAdded:0,officialARTAccepted:0};
 for(const [site,anchor] of stat.realAnchors.entries()){
  const f=roadFrame(doc,sample,anchor.road,anchor.u);
  if(mode===DESIGNS[0])transitExchange(out,f,site,stat);
  else splitCourts(out,f,site,stat);
  stat.districts++;
 }
 check(JSON.stringify(doc)===frozen,'attempt to change source gameplay document');
 check(out.length%18===0&&out.length/18>1500&&out.length/18<65000,
  'real mesh triangle budget invalid');
 check(out.every(Number.isFinite),'unrenderable vertex');
 check(stat.districts===2&&stat.trueOpenCourts>=4&&
  stat.structuralMembers>=6&&stat.occupiedVolumes>=4,
  'expected genuine public city program missing');
 return {vertices:out,triangles:out.length/18,...stat,
  cameraVisibilityNotCertified:true,realB51OcclusionNotCertified:true,
  originalRunnerNotReplaced:true,ART:'HOLD',GAMEPLAY:'HOLD',
  HUMAN:'HOLD',PERFORMANCE:'HOLD',RELEASE:'HOLD'};
}
