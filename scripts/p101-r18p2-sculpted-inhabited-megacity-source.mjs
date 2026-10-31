/**
 * R18P2 private SOURCE physical-world art studies.
 * Architectural brief: a connected inhabited city, two truly different massive
 * volumes rather than thin arched line art. Strictly ART HOLD until original
 * 240Hz camera PNG review. No B48/B51 or collision modification.
 */
export const DESIGNS=Object.freeze(['A_INHABITED_ESCARPMENT','B_HOLLOW_TRANSIT_SAILS']);
export const SOURCE_CAMERA_SITES=Object.freeze([
 {road:5,u:.18,offset:240,up:100,time:54},
 {road:5,u:.48,offset:-120,up:100,time:58},
 {road:5,u:.91,offset:-120,up:100,time:61},
 {road:6,u:.30,offset:-240,up:100,time:64},
 {road:6,u:.78,offset:-120,up:100,time:67}
]);
const COLORS={
 pale:[.86,.91,.90],ivory:[.98,.85,.63],sea:[.21,.68,.73],
 deep:[.10,.21,.28],marine:[.20,.44,.58],glass:[.43,.82,.84],
 green:[.38,.72,.53],gold:[.98,.70,.33],bronze:[.68,.45,.31],
 blue:[.42,.57,.86],dark:[.095,.15,.19],white:[.76,.94,.99]};
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),
 mul=(a,t)=>a.map(v=>v*t),length=a=>Math.hypot(...a),unit=a=>mul(a,1/(length(a)||1)),
 cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
 dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
function ensure(v,s){if(!v)throw Error('R18P2 '+s);}
function triangle(o,p,q,r,color){for(const v of [p,q,r])o.push(...v,...color);}
function quad(o,a,b,c,d,color){
 triangle(o,a,b,c,color);triangle(o,a,c,d,color);
 triangle(o,d,c,b,COLORS.deep);triangle(o,d,b,a,COLORS.deep);
}
function point(f,x,z,y){
 return add(add(add(f.origin,mul(f.right,x)),mul(f.forward,z)),[0,y,0]);
}
function frame(doc,sample,s){
 const surface=doc.surfaces[s.road],
  center=sample(surface,s.u,.5),
  prev=sample(surface,Math.max(0,s.u-.002),.5),
  next=sample(surface,Math.min(1,s.u+.002),.5);
 const vec=[next[0]-prev[0],0,next[2]-prev[2]],forward=unit(vec),
  right=[-forward[2],0,forward[0]];
 const origin=add(add(center,mul(right,s.offset)),[0,s.up,0]);
 ensure(length(vec)>1&&origin.every(Number.isFinite),'invalid genuine B48 camera anchor');
 ensure(Math.abs(dot(right,forward))<1e-8,'wrong camera right sign');
 return {origin,forward,right,worldCenter:center,sourceAnchor:s};
}
function girder(out,p,q,w,d,color){
 const axis=unit(sub(q,p)),len=length(sub(q,p));
 ensure(Number.isFinite(len)&&len>.3,'invalid transit member');
 const up0=Math.abs(axis[1])>.90?[0,0,1]:[0,1,0],
  right=unit(cross(axis,up0)),vertical=unit(cross(axis,right));
 const loop=v=>[
  add(add(v,mul(right,w/2)),mul(vertical,d/2)),
  add(sub(v,mul(right,w/2)),mul(vertical,d/2)),
  sub(sub(v,mul(right,w/2)),mul(vertical,d/2)),
  add(sub(v,mul(vertical,d/2)),mul(right,w/2))];
 const a=loop(p),b=loop(q);
 for(let i=0;i<4;i++)quad(out,a[i],a[(i+1)%4],b[(i+1)%4],b[i],color);
 quad(out,a[0],a[3],a[2],a[1],color);
 quad(out,b[0],b[1],b[2],b[3],color);
}
function facetedOccupiedVolume(o,f,opt,stat){
 // Unlike a rectangular box, every shell ring has changing sides,
 // footprints and twist. It generates genuine facade planes and glazing.
 const {x,z,height,base=-58,radius=36,
  sides=10,phase=0,tilt=0.18,color=COLORS.pale}=opt;
 const segments=8,rings=[];
 for(let h=0;h<=segments;h++){
  const t=h/segments,y=base+height*t,
   radiusAt=radius*(1-.12*t+.09*Math.sin(t*Math.PI*2+phase)),
   posX=x+tilt*height*t+12*Math.sin(t*Math.PI*.8+phase)*t,
   posZ=z+9*Math.sin(t*Math.PI*1.4+phase)*t;
  const circle=[];
  for(let k=0;k<=sides;k++){
   const angle=2*Math.PI*k/sides+.12*phase+t*.12,
    ex=radiusAt*(1+.10*Math.cos(angle*3+phase))*Math.cos(angle),
    ez=radiusAt*.71*(1+.14*Math.sin(angle*2+phase))*Math.sin(angle);
   circle.push(point(f,posX+ex,posZ+ez,y));
  }
  rings.push(circle);
 }
 for(let h=0;h<segments;h++)for(let j=0;j<sides;j++){
  const gap=(j+2*h+Math.floor(phase*3))%11===6;
  if(gap){stat.realOpenFacadeBays++;continue;}
  quad(o,rings[h][j],rings[h][j+1],rings[h+1][j+1],rings[h+1][j],
   h%3===1?COLORS.glass:j%5===0?COLORS.ivory:color);
  if(h%2===0&&j%2===0)
   girder(o,rings[h][j],rings[h+1][j],1.4,2.5,COLORS.white);
 }
 const crown=point(f,x+tilt*height+15,z+2,base+height+17);
 for(let j=0;j<sides;j++)triangle(o,rings[segments][j],
  rings[segments][j+1],crown,j%3===0?COLORS.ivory:COLORS.pale);
 stat.occupiedVolumes++;stat.publicWindowBands+=segments;
}
function cutOpenTerrace(o,f,opt,stat){
 // Thick courtyard perimeter with OPEN middle. Four bands instead of
 // placing a covering plane over the source B48 runner.
 const {x,z,y=-42,wx=160,wz=98,thickness=9,color=COLORS.pale}=opt,
  a=[[-wx/2,-wz/2],[wx/2,-wz/2],[wx/2,wz/2],[-wx/2,wz/2]],
  b=a.map(([px,pz])=>[px*.65,pz*.61]);
 for(let i=0;i<4;i++){
  const j=(i+1)%4;
  const A=point(f,x+a[i][0],z+a[i][1],y),B=point(f,x+a[j][0],z+a[j][1],y),
    C=point(f,x+b[j][0],z+b[j][1],y),D=point(f,x+b[i][0],z+b[i][1],y);
  quad(o,A,B,C,D,color);
  quad(o,point(f,x+a[i][0],z+a[i][1],y-thickness),
   point(f,x+a[j][0],z+a[j][1],y-thickness),B,A,COLORS.marine);
 }
 stat.trueVoidAtriums++;stat.supportedDecks++;
}
function foldedUrbanTerrace(o,f,opt,stat){
 // Concave multi-polygon mass showing its front and underside.
 const {x,z,w=190,depth=95,y=-50,tilt=0,color=COLORS.sea}=opt;
 const segments=14,front=[],back=[],bottom=[];
 for(let i=0;i<=segments;i++){
  const t=i/segments,xi=x+w*(t-.5),
   yi=y+22*Math.sin(t*Math.PI*1.2+tilt)+30*t*Math.sin(tilt+.5);
  front.push(point(f,xi,z-depth/2+8*Math.sin(t*6),yi));
  back.push(point(f,xi+27*Math.sin(t*Math.PI),z+depth/2,yi+13));
  bottom.push(point(f,xi,z-depth/2+8*Math.sin(t*6),yi-10));
 }
 for(let i=0;i<segments;i++){
  // Large articulated facets, with deliberate OPEN AIR gaps.
  if(i%7!==3){
   quad(o,front[i],front[i+1],back[i+1],back[i],
    i%3===0?COLORS.ivory:color);
   quad(o,bottom[i],bottom[i+1],front[i+1],front[i],COLORS.dark);
   stat.occupiedDeckFacets++;
  }else stat.realOpenFacadeBays++;
  if(i%3===0)girder(o,front[i],back[i],2.4,4,COLORS.white);
 }
}
function steppedCityWall(o,f,opt,stat){
 // Macro habitation TERRAIN, not a flat curtain wall. Fractured,
 // with transparent daylight holes and changing setbacks per floor.
 const {x,z,side,height=175,color=COLORS.pale}=opt,
  floors=6,panels=10;
 for(let k=0;k<floors;k++){
  const t=k/floors,ystart=-55+k*height/floors,
   setback=(1-t)*85,dx=x+side*(28*k),
   span=132+44*Math.sin((k+2)*.7),depth=70+setback*.15;
  for(let j=0;j<panels;j++){
   // Missing panels reveal the inner public courts; wall is not solid.
   const missing=(j+2*k)%9===4||(k>=3&&j===5);
   if(missing){stat.realOpenFacadeBays++;continue;}
   const v=j/panels,v2=(j+1)/panels,
    x1=dx+span*(v-.5),x2=dx+span*(v2-.5),
    frontZ=z+(k%2?12:-9)+12*Math.sin(v*Math.PI*2),
    rearZ=frontZ+side*depth;
   quad(o,point(f,x1,frontZ,ystart),point(f,x2,frontZ,ystart),
    point(f,x2+side*5,frontZ+9,ystart+height/floors-4),
    point(f,x1+side*5,frontZ+9,ystart+height/floors-4),
    (j+k)%3===0?COLORS.glass:color);
   if(j%3===0&&k%2===0){
    girder(o,point(f,x1,frontZ,ystart),
     point(f,x1+side*5,frontZ+9,ystart+height/floors-4),
     2.7,3,COLORS.ivory);
   }
  }
  foldedUrbanTerrace(o,f,{x:dx,z:z+side*33,w:span,depth,
   y:ystart+height/floors-2,tilt:t,color:k%2?COLORS.sea:COLORS.marine},stat);
 }
 stat.majorSolidCityMasses++;
}
function doubleShell(o,f,opt,stat){
 // Two facing sail-like 3D surfaces form a real monumental hollow.
 // No opaque roof spans the roadway. Both have projected area and depth.
 const {x,z,height,side=1,color=COLORS.ivory}=opt,
  segments=26,rails=8;
 for(const wing of [-1,1]){
  const wall=[];
  for(let i=0;i<=segments;i++){
   const t=i/segments,u=t*Math.PI,
    y=-58+height*t,
    xCenter=x+wing*(70+19*Math.cos(t*4+side))+
      54*t*t*side+12*Math.sin(t*Math.PI),
    zCenter=z+76*Math.sin(t*Math.PI*.9+wing*.3);
   const row=[];
   for(let j=0;j<=rails;j++){
    const v=j/rails,curvature=(v-.5);
    row.push(point(f,xCenter+wing*curvature*45,
      zCenter+120*curvature+12*Math.sin(u+v*4),
      y+18*Math.sin(v*Math.PI)*Math.sin(u)));
   }
   wall.push(row);
  }
  for(let i=0;i<segments;i++)for(let j=0;j<rails;j++){
   const hole=((i+2*j+(wing===1?1:0))%17===8);
   if(hole){stat.realOpenFacadeBays++;continue;}
   quad(o,wall[i][j],wall[i+1][j],wall[i+1][j+1],wall[i][j+1],
    j%3===0?COLORS.glass:i%4===0?COLORS.white:color);
  }
  // Avoid the old naked-wire arch: edge structure is secondary to 3D surface.
  for(let i=0;i<segments;i+=3)
   girder(o,wall[i][0],wall[i+1][0],2.2,4.8,COLORS.marine);
 }
 stat.sculptedHollowShells++;
}
function livingEscarpment(o,f,s,index,st){
 const t=s.time,away=Math.sign(s.offset),centerX=away*14,
  cx=centerX,depth=index*19;
 // A single inhabited cliff district composes high mass, sky courts,
 // supporting tower groups and light-filled stacked civic volumes.
 steppedCityWall(o,f,{x:cx-36*away,z:-38+depth,
  side:away,height:170+index*26,color:index%2?COLORS.pale:COLORS.marine},st);
 cutOpenTerrace(o,f,{x:cx+42*away,z:91-depth*.5,
  y:18,wx:165+index*11,wz:110,color:COLORS.ivory},st);
 if(index%2===0)cutOpenTerrace(o,f,{x:cx+75*away,z:-97,
  y:-8,wx:115,wz:101,color:COLORS.sea},st);
 for(let j=0;j<5;j++){
  const lateral=cx+away*(78+44*(j%2))+23*Math.sin(j+index),
    long=-172+j*74+(index%2)*18;
  facetedOccupiedVolume(o,f,{
   x:lateral,z:long,base:-60+12*(j%2),
   radius:24+(j*3)%15,height:75+((j+index*2)%4)*39,
   sides:9+(j%3)*2,phase:j*.7+index,tilt:away*.19,
   color:j%2?COLORS.glass:COLORS.pale},st);
 }
 st.temporalEpisodes++;
}
function hollowTransitSails(o,f,s,index,st){
 const away=Math.sign(s.offset),cx=18*away;
 doubleShell(o,f,{x:cx+50*away,z:10+index*13,
  height:173+31*index,side:away,
  color:index%2?COLORS.blue:COLORS.pale},st);
 for(let k=0;k<3;k++)
  cutOpenTerrace(o,f,{x:cx+away*(40+42*k),
   z:-115+k*94,y:-23+32*k,wx:135-13*k,wz:105+9*k,
   color:k%2?COLORS.sea:COLORS.ivory},st);
 for(let j=0;j<4;j++){
  facetedOccupiedVolume(o,f,{
   x:cx+away*(85+31*(j%3)),z:-173+102*j,
   base:-64+6*j,radius:26+4*j,height:92+24*j+7*index,
   sides:10+j*2,phase:.3*j+index*.8,
   tilt:-away*.17,color:j%2?COLORS.blue:COLORS.marine},st);
 }
 st.temporalEpisodes++;
}
function connectWhereReal(o,frames,st,mode){
 // Source world-space route is only visually suggested, not a traversable
 // player road. Refuse to span >600m in empty space as a fake street.
 for(let i=0;i<frames.length-1;i++){
  const a=point(frames[i],0,115,36),b=point(frames[i+1],0,-107,31);
  const span=length(sub(b,a));
  if(!Number.isFinite(span)||span<30||span>600){
   st.unbridgedSourceSitePairs++;continue;
  }
  const n=Math.ceil(span/45),pts=[];
  for(let j=0;j<=n;j++){
   const q=j/n;
   pts.push(add(add(mul(a,1-q),mul(b,q)),
    [0,12*Math.sin(Math.PI*q),0]));
  }
  for(let j=0;j<n;j++)girder(o,pts[j],pts[j+1],
   mode===DESIGNS[0]?4.7:3.3,6.2,COLORS.glass);
  st.connectedCivicSpans++;
 }
}
export function buildR18P2City(doc,sample,{mode=DESIGNS[0]}={}){
 ensure(DESIGNS.includes(mode),'unknown or false candidate mode');
 ensure(doc?.surfaces?.length===7&&doc?.movingObstacles?.length===28,
  'original immutable real 7 B48 and 28 B51 required');
 ensure(doc?.stageForge?.r15s3d11?.mode==='A_EDGE_READABLE'&&
  doc.stageForge?.productionPromoted===false,
  'requires original D11 nonproduction physical world');
 const original=JSON.stringify(doc),out=[],stat={mode,
  sourceRealCameraSites:SOURCE_CAMERA_SITES.map(s=>({...s})),
  temporalEpisodes:0,occupiedVolumes:0,publicWindowBands:0,
  trueVoidAtriums:0,supportedDecks:0,majorSolidCityMasses:0,
  sculptedHollowShells:0,realOpenFacadeBays:0,occupiedDeckFacets:0,
  connectedCivicSpans:0,unbridgedSourceSitePairs:0,
  originalB48:7,originalB51:28,newCollisionMeshes:0,
  nativeRawCameraRequired:true,officialArtAccepted:0};
 const frames=SOURCE_CAMERA_SITES.map(s=>frame(doc,sample,s));
 for(let i=0;i<frames.length;i++)
  if(mode===DESIGNS[0])livingEscarpment(out,frames[i],SOURCE_CAMERA_SITES[i],i,stat);
  else hollowTransitSails(out,frames[i],SOURCE_CAMERA_SITES[i],i,stat);
 connectWhereReal(out,frames,stat,mode);
 ensure(JSON.stringify(doc)===original,'source road/hazards/physics mutation');
 ensure(stat.temporalEpisodes===5&&stat.occupiedVolumes>=20&&
  stat.trueVoidAtriums>=5&&stat.realOpenFacadeBays>=60,
  'missing actual five-episode volumetric city and open atriums');
 ensure(mode===DESIGNS[0]?stat.majorSolidCityMasses===5:stat.sculptedHollowShells===5,
  'two architectures must have distinct non-recolored geometry');
 ensure(out.length%18===0&&out.length/18>6000&&out.length/18<130000,
  'invalid actual GPU geometric triangle budget');
 ensure(out.every(Number.isFinite),'nonfinite world vertex refused');
 return {vertices:out,triangles:out.length/18,...stat,
  actualTrueNative240HzGameplayNotYetVerified:true,
  ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',RELEASE:'HOLD'};
}
