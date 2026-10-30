/**
 * R15S3D16 genuine WebGL2 private-only art: camera-centered city HEART.
 * Source view anchors are the TRUE original 10-camera-tick study of D15.
 * Unlike D13's endless walls, D14's isolated rings and D15's thin flying
 * shelves, TWO massive offset inhabited aerial districts create a legible
 * foreground/middle/background; architecturally open 100m civic lane between.
 * A: cascade harbor terraces, deeply recessed public courtyards.
 * B: asymmetric floating acropolis with continuous overhead crown and
 * genuinely connected inhabited terraces (not scattered decorative shards).
 * All meshes noncolliding, actual 7 B48 and 28 moving B51 untouched.
 */
export const DESIGNS=Object.freeze(['A_CASCADE_HARBOR','B_CROWNED_ACROPOLIS']);
const C={milk:[.86,.94,.91],ivory:[.96,.87,.71],deep:[.07,.15,.22],
 stone:[.20,.35,.44],teal:[.23,.54,.63],cerulean:[.23,.74,.81],
 emerald:[.37,.75,.61],light:[.57,.99,.87],gold:[1,.71,.39],
 violet:[.59,.46,.73],shadow:[.11,.24,.34]};
const A=(x,y)=>x.map((v,i)=>v+y[i]),S=(x,y)=>x.map((v,i)=>v-y[i]),
 M=(x,t)=>x.map(v=>v*t),L=x=>Math.hypot(...x),N=x=>M(x,1/(L(x)||1)),
 DOT=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0),
 CROSS=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const assert=(a,m)=>{if(!a)throw Error('R15S3D16 '+m)};
function tri(v,a,b,c,color){for(const p of [a,b,c])v.push(...p,...color);}
function quad(v,a,b,c,d,color){
 tri(v,a,b,c,color);tri(v,a,c,d,color);
 tri(v,d,c,b,C.shadow);tri(v,d,b,a,C.shadow);
}
function girder(v,p,q,r,color){
 const axis=N(S(q,p)),basis=Math.abs(axis[1])>.91?[0,0,1]:[0,1,0],
 side=N(CROSS(axis,basis)),up=N(CROSS(axis,side));
 const ring=x=>[A(A(x,M(side,r)),M(up,r*.65)),A(S(x,M(side,r)),M(up,r*.65)),
  S(S(x,M(side,r)),M(up,r*.65)),A(S(x,M(up,r*.65)),M(side,r))];
 const a=ring(p),b=ring(q),x=[...a,...b];
 for(const [i,j,k,l] of [[0,1,2,3],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0],[4,7,6,5]])
  quad(v,x[i],x[j],x[k],x[l],color);
}
function roadFrame(doc,sample,road,u){
 const surface=doc.surfaces[road],center=sample(surface,u,.5),
  prev=sample(surface,Math.max(0,u-.001),.5),
  next=sample(surface,Math.min(1,u+.001),.5),
  forward=N([next[0]-prev[0],0,next[2]-prev[2]]),
  left=sample(surface,u,0),raw=[left[0]-center[0],0,left[2]-center[2]],
  side=N(S(raw,M(forward,DOT(raw,forward))));
 assert(L(raw)>6&&side.every(Number.isFinite),'invalid actual B48 coordinate frame');
 return {center,forward,side};
}
function point(f,x,z,h){return A(A(A(f.center,M(f.side,x)),M(f.forward,z)),[0,h,0]);}
function prismHex(v,f,x,z,y,r,h,color,stats,rot=0){
 const bottom=[],top=[];
 for(let i=0;i<=6;i++){
  const th=Math.PI*2*i/6+rot;
  bottom.push(point(f,x+r*Math.cos(th),z+r*.77*Math.sin(th),y));
  top.push(point(f,x+r*.74*Math.cos(th),z+r*.58*Math.sin(th),y+h));
 }
 for(let i=0;i<6;i++){
  if(i===3 && h>19){ // genuine opening in at least one facade
   stats.realArchitecturalOpenings++;continue;
  }
  quad(v,bottom[i],bottom[i+1],top[i+1],top[i],
   (i+Math.floor(x))%5===0?C.ivory:color);
  if(i%2===0)girder(v,top[i],top[i+1],.85,C.light);
 }
 // Sculpted slanted roof: a true six-sided vaulted cap.
 const crown=point(f,x+5,z+3,y+h+9);
 for(let i=0;i<6;i++)tri(v,top[i],top[i+1],crown,C.milk);
 stats.realBuildingVolumes++;
}
function makeTerracedIsland(v,f,centerX,centerZ,site,sideIndex,variant,stat){
 const dense=variant==='A_CASCADE_HARBOR',
  radius=(sideIndex===0?115:95)*(site===0?1:1.12),
  levels=3,segments=36;
 for(let level=0;level<levels;level++){
  const major=radius*(1+.10*level),depth=major*.69,
   height=52+level*37+site*11+(sideIndex===1?9:0),
   thick=10+3*level;
  const shell=[],inner=[],underside=[];
  for(let i=0;i<=segments;i++){
   const t=i/segments,theta=Math.PI*2*t,
    wobble=1+.08*Math.cos(theta*3+sideIndex+.4*level),
    rx=major*wobble,rz=depth*(1+.10*Math.sin(theta*2+site));
   shell.push(point(f,centerX+rx*Math.cos(theta),centerZ+rz*Math.sin(theta),height+
     5*Math.sin(theta*2+site)));
   inner.push(point(f,centerX+rx*.45*Math.cos(theta),centerZ+rz*.43*Math.sin(theta),height+2));
   underside.push(point(f,centerX+rx*Math.cos(theta),centerZ+rz*Math.sin(theta),height-thick));
  }
  for(let j=0;j<segments;j++){
   // Deep open air in the middle; actual missing triangles make courtyards.
   if((j+4*level+2*site+sideIndex)%14===6||
      (j+4*level+2*site+sideIndex)%14===7){stat.courtyardOpenSectors++;continue;}
   quad(v,shell[j],shell[j+1],inner[j+1],inner[j],
    (j+site)%11===0?C.gold:level===2?C.milk:level===1?C.teal:C.stone);
   quad(v,shell[j],underside[j],underside[j+1],shell[j+1],C.deep);
   stat.realThickUrbanDecks++;
   if(j%3===0){
    girder(v,shell[j],shell[j+1],1.9,level===2?C.ivory:C.light);
    stat.continuousEdgeRuns++;
   }
  }
  // Compact but readable INHABITED architecture, not a repeating city wall.
  const count=dense?(level===0?7:6):level===2?9:6;
  for(let j=0;j<count;j++){
   const theta=(j+.27*level+.16*sideIndex)*2*Math.PI/count,
    px=centerX+major*.69*Math.cos(theta),
    pz=centerZ+depth*.66*Math.sin(theta);
   const size=10+((j+site*3+level)%3)*4, h=15+8*((j+level+site)%4);
   prismHex(v,f,px,pz,height+.4,size,h,
    j%4===0?C.emerald:j%3===0?C.ivory:C.cerulean,stat,theta*.24);
  }
  // Branching transit tubes visually connect stacked public layers.
  if(level>0)for(let j=0;j<5;j++){
   const a=point(f,centerX+radius*.85*Math.cos(j*1.25+site),centerZ+
    depth*.8*Math.sin(j*1.25+site),height-37),
    b=point(f,centerX+radius*.55*Math.cos(j*1.25+site+.3),centerZ+
    depth*.55*Math.sin(j*1.25+site+.3),height);
   girder(v,a,b,3.8,C.ivory);stat.transitConnections++;
  }
 }
}
function createCentralSkySpine(v,f,site,mode,stat){
 const dense=mode==='A_CASCADE_HARBOR',
  start=-190,end=210,sections=48,
  top=[],under=[];
 for(let i=0;i<=sections;i++){
  const t=i/sections,x=start+(end-start)*t,
   z=-43+64*Math.sin(t*Math.PI*1.55+site*.2),
   // No close over-road opaque ceiling below y160.
   y=205+site*24+45*Math.sin(Math.PI*t)+13*Math.sin(t*3*Math.PI+site);
  top.push(point(f,x,z,y));under.push(point(f,x,z+34,y-22));
 }
 for(let j=0;j<sections;j++){
  const p=(j+.5)/sections,
   opening=j%16>=6&&j%16<=9;
  if(opening){stat.spineLightWells++;continue;}
  quad(v,top[j],top[j+1],under[j+1],under[j],
   j%10===0?C.ivory:dense?C.milk:C.teal);
  stat.cohesiveSkySpinePanels++;
  if(j%2===0){girder(v,under[j],under[j+1],2.7,C.light);stat.majorConnectedMembers++;}
 }
 for(const t of dense?[.09,.27,.71,.88]:[.04,.23,.47,.83]){
  const index=Math.floor(t*sections),
   p=under[index],w=point(f,(t-.5)*360,0,149+site*15);
  girder(v,p,w,6,t<.5?C.ivory:C.gold);stat.majorConnectedMembers++;
 }
}
export function buildR15S3D16City(doc,sample,{mode='A_CASCADE_HARBOR'}={}){
 assert(DESIGNS.includes(mode),'unsupported substantial geometry');
 assert(doc?.surfaces?.length===7&&doc?.movingObstacles?.length===28,'original 7 real B48 and 28 B51 required');
 assert(doc.stageForge?.r15s3d11?.mode==='A_EDGE_READABLE'&&doc.stageForge.productionPromoted===false,'cannot generate on failed or production course');
 const source=JSON.stringify(doc),v=[],stat={
  mode,sourceCamera:'R15S3D15_ORIGINAL_WEBGL2_TEN_SOURCE_CAMERA_FRAMES',
  realAnchors:[{road:5,u:.78},{road:6,u:.62}],
  majorDistricts:0,realThickUrbanDecks:0,courtyardOpenSectors:0,
  realArchitecturalOpenings:0,realBuildingVolumes:0,transitConnections:0,
  continuousEdgeRuns:0,cohesiveSkySpinePanels:0,majorConnectedMembers:0,
  spineLightWells:0,addedOriginalPhysicsObjects:0,originalRoads:7,originalMovingHazards:28,
  certifiedArt:0};
 for(const [site,s] of [{road:5,u:.78},{road:6,u:.62}].entries()){
  const f=roadFrame(doc,sample,s.road,s.u),
   closer=mode==='A_CASCADE_HARBOR';
  // Central SKY CITY, two offset occupied islands; clear central 100m gap
  // and actual air beneath level0. Their main axes stay in the original
  // source camera center frustum, not miles above/beside the game.
  makeTerracedIsland(v,f,-(closer?130:148),-20-12*site,site,0,mode,stat);
  makeTerracedIsland(v,f,closer?138:152,27+24*site,site,1,mode,stat);
  createCentralSkySpine(v,f,site,mode,stat);
  stat.majorDistricts++;
 }
 assert(JSON.stringify(doc)===source,'noncollision art modified source B48/B51/physics');
 assert(v.length%18===0&&v.length/18>6500&&v.length/18<100000,'real geometry triangle budget');
 assert(v.every(Number.isFinite),'invalid real source world vertices');
 assert(stat.majorDistricts===2&&stat.realBuildingVolumes>=65&&
  stat.realArchitecturalOpenings>25&&stat.courtyardOpenSectors>=20&&
  stat.realThickUrbanDecks>150&&stat.majorConnectedMembers>=45,'missing inhabited coherent city');
 return {vertices:v,triangles:v.length/18,...stat,
  geometryAuthoringIsNotArtApproval:true,
  actualWebGL2RenderAndNativeFinishMustBeVerified:true,
  realCameraVisibleEvidenceNeedsPixelInspection:true,
  collisionAdded:0,ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD'};
}
