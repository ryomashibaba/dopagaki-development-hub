/**
 * R18P4 ground-following original-stage urban fabric.
 * This is TRUE NONCOLLIDING GAME ART: not additional collision, not roads.
 *
 * R18P3 camera audit found hero at road5 u=.91 "up=100m", building base=-59m:
 * foundation +41m above the real road, visually disconnected. P4 eliminates
 * that old elevated float by using the ACTUAL B48 road Y as baseline (0m).
 * 
 * Two different civic identities, same honest physical stage and native camera:
 * A: arterial station district with ONE dominant transit landmark
 * B: garden terraces district with ONE dominant sculptural city hall.
 */
export const DESIGNS=Object.freeze(['A_GROUNDED_TRANSIT_BOULEVARD','B_CARVED_GARDEN_DISTRICT']);
const C={ivory:[.90,.93,.90],sand:[.86,.70,.52],glass:[.34,.72,.77],
 marine:[.18,.36,.48],bright:[.72,.92,.93],green:[.25,.58,.42],
 dark:[.08,.16,.22],bronze:[.70,.46,.28],blue:[.31,.54,.68]};
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),
 mul=(a,t)=>a.map(x=>x*t),len=a=>Math.hypot(...a),
 norm=a=>mul(a,1/(len(a)||1)),cross=(a,b)=>[
 a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function requireTrue(ok,msg){if(!ok)throw Error('R18P4 '+msg);}
function triangle(out,a,b,c,color){for(const p of [a,b,c])out.push(...p,...color);}
function quad(out,a,b,c,d,color){
 triangle(out,a,b,c,color);triangle(out,a,c,d,color);
 triangle(out,d,c,b,C.dark);triangle(out,d,b,a,C.dark);
}
function roadFrame(doc,sample,road,u){
 const surface=doc.surfaces[road],p=sample(surface,u,.5),
  a=sample(surface,Math.max(0,u-.002),.5),
  b=sample(surface,Math.min(1,u+.002),.5),
  d=[b[0]-a[0],0,b[2]-a[2]],
  forward=norm(d),right=[-forward[2],0,forward[0]];
 requireTrue(len(d)>1&&p.length===3&&p.every(Number.isFinite),
  'invalid original source B48 actual road frame');
 return {p,forward,right,road,u,roadY:p[1]};
}
function at(f,x,z,y){
 return add(add(add(f.p,mul(f.right,x)),mul(f.forward,z)),[0,y,0]);
}
function girder(out,a,b,w,h,color){
 const delta=sub(b,a),L=len(delta);
 requireTrue(Number.isFinite(L)&&L>.5,'degenerate 3D beam');
 const forward=norm(delta),base=Math.abs(forward[1])>.9?[0,0,1]:[0,1,0],
  side=norm(cross(forward,base)),up=norm(cross(forward,side)),
  rings=[a,b].map(p=>[
   add(add(p,mul(side,w/2)),mul(up,h/2)),
   add(sub(p,mul(side,w/2)),mul(up,h/2)),
   sub(sub(p,mul(side,w/2)),mul(up,h/2)),
   add(sub(p,mul(up,h/2)),mul(side,w/2))]);
 for(let i=0;i<4;i++)quad(out,rings[0][i],rings[0][(i+1)%4],
  rings[1][(i+1)%4],rings[1][i],color);
 quad(out,rings[0][0],rings[0][3],rings[0][2],rings[0][1],color);
 quad(out,rings[1][0],rings[1][1],rings[1][2],rings[1][3],color);
}
function groundBuilding(out,f,{x,z,width,depth,height,offset=0,color=C.ivory,profile=0},st){
 // Faceted mid-rise frontage: actual lower facade is at Y=sourceRoadY-2.
 // No architecture is artificially hovered at sourceRoadY+41 like R18P3.
 requireTrue(Math.abs(x)>=30,'city intruded original source racing lane');
 const baseY=-2,capY=baseY+height,topW=width*(.87+.05*Math.cos(profile)),
 topD=depth*(.88+.07*Math.sin(profile+1));
 const a=[[-width/2,-depth/2],[width/2,-depth/2],
  [width/2,depth/2],[-width/2,depth/2]];
 const b=[[-topW/2,-topD/2],[topW/2,-topD/2],
  [topW/2,topD/2],[-topW/2,topD/2]];
 const bottom=a.map(([i,j])=>at(f,x+i,z+j,baseY));
 const upper=b.map(([i,j])=>at(f,x+i+offset,z+j,capY));
 for(let i=0;i<4;i++){
  const j=(i+1)%4;
  // Large clear facades and contrasting glazing bands.
  quad(out,bottom[i],bottom[j],upper[j],upper[i],
   i===0?C.glass:i===2?C.bright:color);
 }
 quad(out,upper[0],upper[1],upper[2],upper[3],C.sand);
 // A horizontal glazed accent and restrained facade ribs, not noisy fragments.
 for(let k=0;k<4;k++){
  const t=(k+1)/5;
  if(k===2)continue; // genuine open visual rhythm
  girder(out,at(f,x-width*.45,z-depth*.5,baseY+height*t),
   at(f,x+width*.45,z-depth*.5,baseY+height*t),1.8,2.2,C.marine);
 }
 st.roadLevelVolumes++;st.groundedFoundations++;
 st.lowestFoundationOffsetY=Math.min(st.lowestFoundationOffsetY,baseY);
 st.highestFoundationOffsetY=Math.max(st.highestFoundationOffsetY,baseY);
}
function gardenCourtyard(out,f,{x,z,w,d,y=5,color=C.green},st){
 requireTrue(Math.abs(x)>30,'private decorative deck must not simulate race road');
 const outer=[[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]],
 inner=outer.map(([a,b])=>[a*.58,b*.62]);
 for(let i=0;i<4;i++){
  const j=(i+1)%4;
  quad(out,at(f,x+outer[i][0],z+outer[i][1],y),
   at(f,x+outer[j][0],z+outer[j][1],y),
   at(f,x+inner[j][0],z+inner[j][1],y),
   at(f,x+inner[i][0],z+inner[i][1],y),color);
 }
 st.trueOpenCourts++;
}
function transitHero(out,f,st){
 // One visually continuous original-road-level central building at u=.57,
 // not five disconnected elevated pieces. Wide PUBLIC NEGATIVE AIRSPACE.
 for(const side of [-1,1]){
  const x=side*95;
  groundBuilding(out,f,{x,z:15,width:62,depth:174,height:155,
   offset:side*19,profile:4+side,color:C.ivory},st);
  groundBuilding(out,f,{x:side*157,z:43,width:49,depth:121,height:112,
   offset:-side*11,color:C.marine,profile:3},st);
 }
 // This translucent upper-level span is high enough to avoid visually
 // claiming a new B48 traffic surface. It remains totally noncolliding.
 girder(out,at(f,-79,22,118),at(f,80,19,141),9,13,C.glass);
 gardenCourtyard(out,f,{x:-117,z:-126,w:95,d:72,y:0,color:C.sand},st);
 gardenCourtyard(out,f,{x:115,z:143,w:82,d:90,y:0,color:C.green},st);
 st.heroStructures++;st.recessedHeroAirCorridors++;
}
function civicHero(out,f,st){
 // B's different civic identity: asymmetrically carved mid-rise garden
 // terraces, with one tall landmark on the off-road side and open court.
 groundBuilding(out,f,{x:-100,z:8,width:104,depth:205,height:175,
  offset:-32,profile:6,color:C.blue},st);
 groundBuilding(out,f,{x:93,z:22,width:75,depth:163,height:96,
  offset:25,profile:4,color:C.sand},st);
 // Carving is an actual 3D air opening between separated masses.
 gardenCourtyard(out,f,{x:93,z:140,w:111,d:90,y:7,color:C.green},st);
 gardenCourtyard(out,f,{x:-114,z:-132,w:132,d:87,y:12,color:C.ivory},st);
 girder(out,at(f,-51,18,132),at(f,59,23,138),7,10,C.bright);
 st.heroStructures++;st.recessedHeroAirCorridors++;
}
function neighborhood(out,f,mode,index,st){
 const near=index%2===0?1:-1,
   h=mode===DESIGNS[0]?45+10*(index%4):39+13*(index%3);
 const id=mode===DESIGNS[0]?1:2;
 for(const side of [-1,1]){
  const x=side*(48+9*((index+id)%3));
  // This creates the space between the real B48 route and the surrounding
  // city while keeping the visual buildings visibly GROUNDED on that road.
  groundBuilding(out,f,{x,z:(index%2?30:-30),
   width:24+5*((index+2)%3),depth:44+9*(index%4),
   height:h+7*(side+1),offset:side*4,
   profile:index+2,color:side===near?C.ivory:C.marine},st);
  if(index%3===1){
   groundBuilding(out,f,{x:side*(94+index%5),z:-52,width:32,
    depth:45,height:50+8*(index%3),offset:-side*7,profile:index,
    color:mode===DESIGNS[0]?C.glass:C.green},st);
  }
 }
 if(index%2===0)gardenCourtyard(out,f,{
  x:(index%4===0?1:-1)*98,z:72,w:62,d:51,y:1,
  color:mode===DESIGNS[0]?C.sand:C.green},st);
 st.sourceRoadNeighborhoods++;
}
function plausibleFrontageLink(out,f1,f2,side,stat){
 // Connect short successive blocks into honest city frontage; do not
 // build one gigantic artificial shelf, a road, or a hanging bridge.
 const a=at(f1,side*67,0,15),b=at(f2,side*67,0,15),dist=len(sub(b,a));
 if(!Number.isFinite(dist)||dist<7||dist>250){
  stat.disconnectedStreetfrontPairs++;return;
 }
 girder(out,a,b,3.3,3.2,C.glass);
 stat.trueShortFrontageLinks++;
}
export function buildR18P4City(stage,sample,{mode=DESIGNS[0]}={}){
 requireTrue(DESIGNS.includes(mode),'unknown new art mode');
 requireTrue(stage?.surfaces?.length===7&&stage?.movingObstacles?.length===28&&
  stage?.stageForge?.r15s3d11?.mode==='A_EDGE_READABLE'&&
  stage?.stageForge?.productionPromoted===false,
  'requires unmodified true D11 original physical source');
 const baseline=JSON.stringify(stage),vertices=[],stat={
  mode,sourceB48:7,sourceB51:28,addedColliders:0,artOnly:true,
  groundAlignedOriginalRoadSections:[5,6],
  actualHeroRoad:5,actualHeroU:.57,
  sourceRoadNeighborhoods:0,roadLevelVolumes:0,
  groundedFoundations:0,lowestFoundationOffsetY:Infinity,
  highestFoundationOffsetY:-Infinity,heroStructures:0,
  recessedHeroAirCorridors:0,trueOpenCourts:0,
  trueShortFrontageLinks:0,disconnectedStreetfrontPairs:0,
  roadCenterNoNoncollidingFakeSurface:true,sourceRoadUnchanged:true,
  officialArtAccepted:0,officialSlope2Meters:0
 };
 const us=[.10,.22,.34,.46,.58,.70,.82,.92],groups={};
 let districtIndex=0;
 for(const road of [5,6]){
  groups[road]=[];
  for(const u of us){
   const f=roadFrame(stage,sample,road,u);
   // Hero remains unique, while smaller architecture follows road level.
   neighborhood(vertices,f,mode,districtIndex++,stat);
   groups[road].push(f);
  }
  for(let i=0;i<groups[road].length-1;i++)
   for(const side of [-1,1])
    plausibleFrontageLink(vertices,groups[road][i],groups[road][i+1],side,stat);
 }
 const hero=roadFrame(stage,sample,5,.57);
 if(mode===DESIGNS[0])transitHero(vertices,hero,stat);
 else civicHero(vertices,hero,stat);
 requireTrue(JSON.stringify(stage)===baseline,'source physics mutation');
 requireTrue(stat.heroStructures===1&&stat.sourceRoadNeighborhoods===16&&
  stat.groundedFoundations===stat.roadLevelVolumes&&
  stat.lowestFoundationOffsetY===-2&&stat.highestFoundationOffsetY===-2,
  'actual B48 ground alignment failed');
 requireTrue(stat.recessedHeroAirCorridors===1&&stat.trueOpenCourts>=10,
  'grounded connected city open-space composition failed');
 requireTrue(vertices.length%18===0&&vertices.length/18>3000&&
  vertices.length/18<30000&&vertices.every(Number.isFinite),
  'real 3D budget or invalid vertex');
 return {vertices,triangles:vertices.length/18,...stat,
  nativeWebGL2MustBeIndependentlyVerified:true,ART:'HOLD',
  GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
}
