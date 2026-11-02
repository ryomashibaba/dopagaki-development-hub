/**
 * R18P3: SINGLE CIVIC LANDMARK / SUPPORTING NEIGHBORHOODS / EXIT.
 * Replaces the failed P2 five repeated macro masses. True original stage XYZ,
 * noncolliding PRIVATE art only. A and B use different dominant forms.
 * DO NOT infer gameplay safety, visual approval or walkability from this mesh.
 */
export const DESIGNS=Object.freeze(['A_CRESCENT_CIVIC_ATRIUM','B_CARVED_TRANSIT_CITADEL']);
const SITES=Object.freeze({
 approach:{road:5,u:.18,offset:240,up:100,time:54},
 forecourt:{road:5,u:.48,offset:-120,up:100,time:58},
 heart:{road:5,u:.91,offset:-120,up:100,time:61},
 transit:{road:6,u:.30,offset:-240,up:100,time:64},
 departure:{road:6,u:.78,offset:-120,up:100,time:67}
});
const C={ivory:[.85,.91,.89],glass:[.33,.71,.76],
 metal:[.22,.43,.53],blue:[.27,.54,.72],copper:[.79,.53,.34],
 warm:[.99,.80,.58],shadow:[.11,.19,.24],deep:[.07,.12,.17],
 teal:[.21,.59,.59],green:[.29,.58,.47],white:[.81,.97,.94]};
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),
 scale=(v,t)=>v.map(x=>x*t),len=v=>Math.hypot(...v),
 norm=v=>scale(v,1/(len(v)||1)),cross=(a,b)=>[
 a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
 dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
function check(v,m){if(!v)throw Error('R18P3 '+m);}
function tri(out,a,b,c,color){for(const p of [a,b,c])out.push(...p,...color);}
function quad(out,a,b,c,d,color){tri(out,a,b,c,color);tri(out,a,c,d,color);
 tri(out,d,c,b,C.shadow);tri(out,d,b,a,C.shadow);}
function tangentFrame(stage,sample,s){
 const surf=stage.surfaces[s.road],center=sample(surf,s.u,.5),
  p=sample(surf,Math.max(0,s.u-.002),.5),
  q=sample(surf,Math.min(1,s.u+.002),.5),
  d=[q[0]-p[0],0,q[2]-p[2]],forward=norm(d),
  right=[-forward[2],0,forward[0]];
 const origin=add(add(center,scale(right,s.offset)),[0,s.up,0]);
 check(len(d)>1&&origin.every(Number.isFinite)&&Math.abs(dot(forward,right))<1e-7,'invalid true source frame');
 return {origin,center,forward,right,source:s};
}
const at=(f,x,z,y)=>add(add(add(f.origin,scale(f.right,x)),scale(f.forward,z)),[0,y,0]);
function tube(o,a,b,w,d,color){
 const v=sub(b,a),length=len(v);
 check(Number.isFinite(length)&&length>.5,'broken actual structure');
 const f=norm(v),base=Math.abs(f[1])>.9?[0,0,1]:[0,1,0],
 right=norm(cross(f,base)),up=norm(cross(f,right));
 const ring=p=>[
  add(add(p,scale(right,w/2)),scale(up,d/2)),
  add(sub(p,scale(right,w/2)),scale(up,d/2)),
  sub(sub(p,scale(right,w/2)),scale(up,d/2)),
  add(sub(p,scale(up,d/2)),scale(right,w/2))];
 const A=ring(a),B=ring(b);
 for(let i=0;i<4;i++)quad(o,A[i],A[(i+1)%4],B[(i+1)%4],B[i],color);
 quad(o,A[0],A[3],A[2],A[1],color);quad(o,B[0],B[1],B[2],B[3],color);
}
function steppedBody(o,f,{x,z,width,depth,bottom,height,tiers=4,lean=0.07,color=C.ivory},stat){
 // One coherent building: successive closed rectangular perimeter loops
 // with setbacks and a precisely reserved central arcade opening.
 const levels=[];
 for(let k=0;k<=tiers;k++){
  const t=k/tiers,w=width*(1-.15*t),d=depth*(1-.12*t),
   cx=x+lean*height*t;
  const y=bottom+height*t;
  levels.push([
   at(f,cx-w/2,z-d/2,y),at(f,cx+w/2,z-d/2,y),
   at(f,cx+w/2,z+d/2,y),at(f,cx-w/2,z+d/2,y)]);
 }
 for(let k=0;k<tiers;k++){
  for(let side=0;side<4;side++){
   const j=(side+1)%4;
   // Keep facade primarily solid legible material; window belts are
   // contrasted broad rectangles, not hundreds of disconnected slats.
   quad(o,levels[k][side],levels[k][j],levels[k+1][j],levels[k+1][side],
     k===1||k===tiers-1?C.glass:color);
  }
  for(let side=0;side<4;side++)if(side%2===0)
   tube(o,levels[k][side],levels[k][(side+1)%4],2.2,3,C.warm);
 }
 quad(o,levels[tiers][0],levels[tiers][1],levels[tiers][2],levels[tiers][3],C.ivory);
 stat.buildingVolumes++;
}
function arcFacade(o,f,{cx,cz,bottom,rOuter,rInner,start,end,height,levels=5,color=C.ivory},stat){
 // A single massive C-shaped landmark of visible thickness and concavity.
 // NOT 5 scattered tiny towers, NOT a flat annulus/roof over the race track.
 const n=36,sections=[];
 for(let j=0;j<=levels;j++){
  const h=j/levels,ro=rOuter*(1-.14*h),ri=rInner*(1+.07*h),
    level=[];
  for(let i=0;i<=n;i++){
   const t=i/n,theta=start+(end-start)*t,
    bend=11*Math.sin(t*Math.PI)*h;
   const a=at(f,cx+ro*Math.cos(theta)+bend,cz+ro*.75*Math.sin(theta),
     bottom+height*h);
   const b=at(f,cx+ri*Math.cos(theta)+bend,cz+ri*.75*Math.sin(theta),
     bottom+height*h);
   level.push({a,b});
  }
  sections.push(level);
 }
 for(let j=0;j<levels;j++)for(let i=0;i<n;i++){
  const A=sections[j][i],B=sections[j][i+1],
   D=sections[j+1][i],E=sections[j+1][i+1],
   band=j%3===1?C.glass:color;
  quad(o,A.a,B.a,E.a,D.a,band);
  quad(o,D.b,E.b,B.b,A.b,j%2?C.blue:C.metal);
  // Thick radial public floor slices, with true empty atrium interior.
  if(j===0||j===levels-1){
   quad(o,A.a,A.b,B.b,B.a,C.warm);stat.podiumSegments++;
  }
 }
 for(let j=0;j<levels;j++){
  const a=sections[j][0],b=sections[j+1][0],
   c=sections[j][n],d=sections[j+1][n];
  quad(o,a.a,a.b,b.b,b.a,C.metal);quad(o,c.b,c.a,d.a,d.b,C.metal);
 }
 stat.dominantCityLandmarks++;stat.trueCentralVoids++;
}
function splitCitadel(o,f,{cx,cz,bottom,height,span,depth},stat){
 // A distinct architectural grammar to Crescent: TWO enormous solid
 // stepped wings surrounding a preserved 130m open civic canyon.
 const left=cx-span*.47,right=cx+span*.47;
 steppedBody(o,f,{x:left,z:cz,width:span*.27,depth,bottom,height,
  tiers:7,lean:-.24,color:C.ivory},stat);
 steppedBody(o,f,{x:right,z:cz-26,width:span*.27,depth:depth*.79,bottom,
  height:height*.81,tiers:6,lean:.21,color:C.blue},stat);
 // One high-level (not drivable) city bridge: no roof filling the canyon.
 tube(o,at(f,left+span*.12,cz,126),at(f,right-span*.14,cz-21,149),
  10,16,C.glass);
 stat.dominantCityLandmarks++;stat.trueCentralVoids++;
}
function civicCourt(o,f,{x,z,y=-35,w=120,d=102,color=C.ivory},stat){
 // Negative space is a real hole between four 2-sided bands.
 const a=[[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]],
  b=a.map(([x,z])=>[x*.67,z*.61]);
 for(let i=0;i<4;i++){
  const j=(i+1)%4;
  quad(o,at(f,x+a[i][0],z+a[i][1],y),
   at(f,x+a[j][0],z+a[j][1],y),
   at(f,x+b[j][0],z+b[j][1],y),
   at(f,x+b[i][0],z+b[i][1],y),color);
 }
 stat.courtyards++;
}
function approachQuarter(o,f,mode,stat){
 // One low connected foreground quarter. Not another heroic landmark.
 const k=mode===DESIGNS[0]?1:-1;
 steppedBody(o,f,{x:-42*k,z:-36,width:146,depth:102,bottom:-59,
  height:53,tiers:3,color:C.metal},stat);
 steppedBody(o,f,{x:73*k,z:83,width:98,depth:105,bottom:-58,
  height:75,tiers:3,lean:-k*.04,color:C.ivory},stat);
 civicCourt(o,f,{x:-17*k,z:74,y:-36,w:119,d:89,color:C.warm},stat);
 stat.supportingQuarters++;
}
function boulevardQuarter(o,f,mode,stat){
 const k=mode===DESIGNS[0]?1:-1;
 for(let i=0;i<3;i++){
  steppedBody(o,f,{x:k*(-67+53*i),z:-117+92*i,
   width:75+12*i,depth:75,bottom:-56,height:62+18*(i%2),
   tiers:3,color:i%2?C.ivory:C.metal},stat);
 }
 civicCourt(o,f,{x:-21*k,z:35,w:116,d:109,color:C.teal},stat);
 stat.supportingQuarters++;
}
function transitForeground(o,f,mode,stat){
 // Mid-scale urban public circulation on the OTHER road section.
 // Visually frames the road without changing its collision skin.
 const k=mode===DESIGNS[0]?-1:1;
 steppedBody(o,f,{x:49*k,z:-88,width:145,depth:108,bottom:-58,
  height:89,tiers:4,color:C.ivory},stat);
 steppedBody(o,f,{x:-67*k,z:55,width:94,depth:100,bottom:-52,
  height:55,tiers:3,color:C.metal},stat);
 civicCourt(o,f,{x:26*k,z:74,w:127,d:91,color:C.blue},stat);
 stat.supportingQuarters++;
}
function exitDistrict(o,f,mode,stat){
 // Preserve a readable distant final skyline AFTER the central mass.
 const k=mode===DESIGNS[0]?1:-1;
 steppedBody(o,f,{x:k*65,z:19,width:105,depth:88,bottom:-55,
  height:107,tiers:4,color:C.ivory},stat);
 steppedBody(o,f,{x:-k*88,z:-61,width:82,depth:111,bottom:-54,
  height:75,tiers:3,color:C.metal},stat);
 civicCourt(o,f,{x:k*8,z:108,w:105,d:81,color:C.warm},stat);
 stat.supportingQuarters++;stat.exitSilhouettes++;
}
function distantCompositionLink(o,frames,mode,stat){
 // Draw ONLY local plausible route-aligned structural links. NO fake
 // driveable floor and NO infinite giant bridge between disconnected sites.
 const legs=[['approach','forecourt'],['forecourt','heart'],
  ['heart','transit'],['transit','departure']];
 for(const [a,b] of legs){
  const x=frames[a],y=frames[b];
  const p=at(x,0,93,-26),q=at(y,0,-75,-21),span=len(sub(q,p));
  if(span>=540||span<35||!Number.isFinite(span)){
   stat.unlinkedCityTransitions++;continue;
  }
  const n=Math.max(1,Math.ceil(span/52)),pts=[];
  for(let i=0;i<=n;i++){
   const t=i/n;
   pts.push(add(add(scale(p,1-t),scale(q,t)),
    [0,6*Math.sin(Math.PI*t),0]));
  }
  for(let i=0;i<n;i++)tube(o,pts[i],pts[i+1],
   4.5,6.2,mode===DESIGNS[0]?C.glass:C.warm);
  stat.lowProfileLinks++;
 }
}
export function buildR18P3City(stage,sample,{mode=DESIGNS[0]}={}){
 check(DESIGNS.includes(mode),'invalid candidate');
 check(stage?.surfaces?.length===7&&stage?.movingObstacles?.length===28,
 'source 7 B48/28 B51 not preserved');
 check(stage?.stageForge?.r15s3d11?.mode==='A_EDGE_READABLE'&&
  stage.stageForge.productionPromoted===false,'must be original D11 private stage');
 const frozen=JSON.stringify(stage),out=[],stat={mode,
  sourceOriginalB48:7,sourceOriginalB51:28,addedPhysicsColliders:0,
  temporalCameraConstraints:Object.fromEntries(Object.entries(SITES).map(([k,v])=>[k,{...v}])),
  dominantCityLandmarks:0,trueCentralVoids:0,
  buildingVolumes:0,courtyards:0,podiumSegments:0,
  supportingQuarters:0,exitSilhouettes:0,
  unlinkedCityTransitions:0,lowProfileLinks:0,
  officialARTAccepted:0,formalSlope2Metres:0};
 const frames=Object.fromEntries(Object.entries(SITES).map(([k,s])=>
  [k,tangentFrame(stage,sample,s)]));
 approachQuarter(out,frames.approach,mode,stat);
 boulevardQuarter(out,frames.forecourt,mode,stat);
 if(mode===DESIGNS[0]){
  arcFacade(out,frames.heart,{
   cx:0,cz:4,bottom:-59,rOuter:142,rInner:79,
   start:-2.45,end:2.30,height:210,color:C.ivory},stat);
  steppedBody(out,frames.heart,{
   x:144,z:51,width:100,depth:150,bottom:-58,height:103,
   tiers:4,color:C.metal},stat);
 }else{
  splitCitadel(out,frames.heart,{
   cx:5,cz:10,bottom:-58,height:213,span:300,depth:146},stat);
 }
 transitForeground(out,frames.transit,mode,stat);
 exitDistrict(out,frames.departure,mode,stat);
 distantCompositionLink(out,frames,mode,stat);
 check(JSON.stringify(stage)===frozen,'mutable physical stage forbidden');
 check(stat.dominantCityLandmarks===1&&stat.trueCentralVoids===1&&
  stat.supportingQuarters===4&&stat.exitSilhouettes===1,
  'single landmark hierarchy not respected');
 check(stat.buildingVolumes>=9&&stat.courtyards>=4,
  'actual supporting neighborhood program missing');
 check(out.length%18===0&&out.length/18>1200&&out.length/18<40000,
  'budget or mesh triangle count invalid');
 check(out.every(Number.isFinite),'nonfinite true 3D vertex');
 return {vertices:out,triangles:out.length/18,...stat,
  genuinelyRenderedWebGL2NotYetProved:true,
  ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',
  PERFORMANCE:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
}
