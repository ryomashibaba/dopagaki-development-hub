/**
 * G4E-7AN — SKY ARCHIPELAGO (independent ART-FIRST private research).
 * Four SEPARATE depth-staggered monumental 3D systems, not longitudinal walls:
 * a fractured hollow crown, a forked torsion citadel, floating urban shelves,
 * and a branching sky harpoon. Based on the true AJ B48 surface frame,
 * all visual-only; no new driveable floor, hazard, physics or auto camera.
 */
const C=Object.freeze({
 abyss:[.024,.052,.103],midnight:[.038,.103,.161],
 deep:[.11,.27,.36],steel:[.23,.44,.52],
 pearl:[.52,.83,.88],cold:[.30,.87,.98],
 ember:[.95,.47,.21],violet:[.35,.28,.57],
 under:[.040,.078,.128]
});
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const mul=(a,s)=>a.map(x=>x*s);
const dot=(a,b)=>a.reduce((t,x,i)=>t+x*b[i],0);
const unit=a=>mul(a,1/(Math.hypot(...a)||1));
const interp=(a,b,t)=>add(mul(a,1-t),mul(b,t));
const tri=(v,a,b,c,color)=>{for(const p of [a,b,c])v.push(...p,...color);};
const quad=(v,a,b,c,d,color)=>{tri(v,a,b,c,color);tri(v,a,c,d,color);};
const double=(v,a,b,c,d,color)=>{
 quad(v,a,b,c,d,color);quad(v,d,c,b,a,color.map(x=>x*.57));
};
const empty=()=>({
 active:false,vertices:[],triangles:0,monuments:0,hollowCrowns:0,
 crownHoles:0,splitCitadelProngs:0,floatingDecks:0,harpoonBranches:0,
 maximumRiseMeters:0,minimumOutboardMeters:null,nonCollision:true,
 addedCollision:0,addedRoads:0,addedMachines:0,
 certifiedSlope2Meters:0,publish:'HOLD'
});
function frame(road,sample,u,side){
 const at=sample(road,u,.5),edge=sample(road,u,side<0?0:1),
  a=sample(road,Math.max(.001,u-.004),.5),
  b=sample(road,Math.min(.999,u+.004),.5),
  forward=unit([b[0]-a[0],0,b[2]-a[2]]),
  delta=sub(edge,at),flat=[delta[0],0,delta[2]],
  across=sub(flat,mul(forward,dot(forward,flat))),
  out=unit(across);
 if(Math.hypot(...across)<.1||dot(out,flat)<=0)
  throw Error('AN requires a nondegenerate real B48 outboard direction');
 return {at,edge,forward,out};
}
function local(f,longitudinal,outboard,up){
 return add(add(add(f.edge,mul(f.forward,longitudinal)),mul(f.out,outboard)),[0,up,0]);
}
function beam(v,a,b,width,depth,color){
 const direction=unit(sub(b,a)),plan=unit([-direction[2],0,direction[0]]),
  across=Math.hypot(...plan)>.5?plan:[1,0,0],
  side=mul(across,width*.5),y=[0,depth*.5,0];
 const pts=[];
 for(const center of [a,b])pts.push(
  add(add(center,side),y),add(sub(center,side),y),
  sub(sub(center,side),y),sub(add(center,side),y));
 for(const [i,j,k,l] of [[0,1,2,3],[4,7,6,5],[0,4,5,1],
  [1,5,6,2],[2,6,7,3],[3,7,4,0]])quad(v,pts[i],pts[j],pts[k],pts[l],color);
}
function crown(v,f){
 // Genuine sky aperture framed by a THICK, torn, pitched toroidal shell.
 // The center remains empty (not a painted dark rectangle).
 const center=local(f,0,155,137),n=40,outer=[],inner=[],rearOuter=[],rearInner=[];
 for(let i=0;i<=n;i++){
  const theta=2*Math.PI*i/n;
  const c=Math.cos(theta),s=Math.sin(theta);
  const deform=1+.10*Math.sin(theta*3+.7);
  const skew=mul(f.out,32*s+.12*180*s*s);
  // AN R2: the original hollow ring was EDGE-ON to the chase camera.
  // Its open plane now faces down-road: lateral span is the REAL outboard
  // direction, and thickness has actual 50m longitudinal depth.
  const p=add(add(center,mul(f.out,130*c*deform)),add([0,123*s,0],skew));
  const q=add(add(center,mul(f.out,84*c*deform)),add([0,76*s,0],mul(skew,.63)));
  outer.push(p);inner.push(q);
  rearOuter.push(add(p,mul(f.forward,54+9*Math.sin(theta*5))));
  rearInner.push(add(q,mul(f.forward,48)));
 }
 let segments=0;
 for(let i=0;i<n;i++){
  // Two displaced breaks, creating an interrupted skyline and a visible
  // 150m+ inner sky opening from the main forward camera.
  if((i>=4&&i<=6)||(i>=23&&i<=25))continue;
  const p=outer[i],q=outer[i+1],r=inner[i+1],t=inner[i],
   P=rearOuter[i],Q=rearOuter[i+1],R=rearInner[i+1],T=rearInner[i],
   color=i%7===0?C.pearl:i%3===0?C.violet:C.steel;
  double(v,p,q,r,t,color);
  quad(v,P,T,R,Q,C.abyss);quad(v,p,P,Q,q,C.midnight);
  quad(v,t,r,R,T,C.under);segments++;
  if(i%5===0)beam(v,interp(p,t,.55),interp(q,r,.56),3.5,4,C.cold);
 }
 return segments;
}
function citadel(v,f){
 // Asymmetric two-pronged sculptural citadel: changing cross-sections;
 // its top floats apart instead of one monotonous rectangular wall.
 const prongs=[
  {start:-90,rise:620,swerve:-125,flare:37,phase:.4},
  {start:102,rise:815,swerve:160,flare:61,phase:2.2}
 ];
 for(const [pidx,p] of prongs.entries()){
  const bands=[],count=12;
  for(let k=0;k<=count;k++){
   const t=k/count,
    y=22+p.rise*t,
    longitudinal=p.start+p.swerve*t*t+27*Math.sin(t*4+p.phase),
    out=93+pidx*65+145*t+32*Math.sin(t*Math.PI*.8+p.phase*.4),
    width=(47+p.flare*Math.sin(t*Math.PI))*Math.pow(1-t,.37)+11;
   const center=local(f,longitudinal,out,y);
   bands.push(Array.from({length:5},(_,i)=>{
    const theta=2*Math.PI*i/5+1.3*t+p.phase*.15,
      radius=width*(1+.25*Math.cos(t*5+i));
    return add(add(center,mul(f.forward,radius*Math.cos(theta))),
      mul(f.out,39*(1-t*.55)*Math.sin(theta)));
   }));
  }
  // R3: the closed five-sided 815m skin was the verified giant DARK WALL.
  // Replace it with a genuine open lattice: irregular structural diagonals,
  // sparse inhabited plates, and 70%+ physical negative space in the sky.
  for(let k=0;k<count;k++){
   if(k===5)continue; // Actual transverse open level.
   for(let i=0;i<5;i++){
    const a=bands[k][i],b=bands[k][(i+1)%5],
      c=bands[k+1][(i+1)%5],d=bands[k+1][i];
    beam(v,a,d,4.5,7,(i+k)%4===0?C.cold:C.steel);
    if((i+k+pidx)%3===0)beam(v,a,c,5.5,7,C.pearl);
    if(k%4===0&&i%2===0)
     double(v,a,b,c,d,k%8===0?C.deep:C.violet);
   }
  }
  for(let k of [2,7,10])beam(v,bands[k][0],bands[k][2],4,5,k===7?C.ember:C.cold);
 }
 const anchors=[
  local(f,-72,92,130),local(f,125,154,160),
  local(f,-80,185,470),local(f,180,255,635)];
 beam(v,anchors[0],anchors[2],11,15,C.steel);
 beam(v,anchors[1],anchors[3],12,15,C.midnight);
 beam(v,anchors[2],anchors[3],7,10,C.cold);
 return prongs.length;
}
function districts(v,f){
 // Three outboard, overlapping-but-disconnected crescent terraces.
 // A large visible city at intermediate altitudes, NOT additional road skin.
 for(const [layer,height] of [82,155,248].entries()){
  const slices=18,inner=[],outer=[],underside=[],half=165+layer*48;
  for(let i=0;i<=slices;i++){
   const t=-1+2*i/slices,
    bent=Math.sin(Math.PI*(t+1)*.5),
    lateral=85+layer*46+24*(1-t*t),
    y=height+34*bent+16*t*(layer-1),
    a=local(f,half*t,lateral,y),
    b=local(f,half*t+20*Math.sin(t*2),lateral+110+18*bent,y-20);
   inner.push(a);outer.push(b);underside.push(add(b,[0,-27,0]));
  }
  for(let i=0;i<slices;i++){
   if((i===6&&layer===1)||(i===12&&layer===2))continue;
   double(v,inner[i],inner[i+1],outer[i+1],outer[i],
    (layer+i)%6===0?C.cold:layer===1?C.violet:C.steel);
   quad(v,outer[i],outer[i+1],underside[i+1],underside[i],C.abyss);
   if(i%3===1){
    beam(v,outer[i],add(interp(inner[i+1],outer[i+1],.6),[0,26+layer*9,0]),
     4,5,C.pearl);
   }
  }
  if(layer<2)beam(v,outer[2],local(f,-45,160+layer*66,85),9,12,C.midnight);
 }
 return 3;
}
function harpoons(v,f){
 // Three jagged branching skyline arms with a large gap beneath.
 const base=local(f,0,100,28),
  junction=local(f,-65,160,155),
  tips=[
   local(f,-200,245,355),
   local(f,170,240,490),
   local(f,325,360,340)
  ];
 beam(v,base,junction,38,46,C.steel);
 for(const [i,tip] of tips.entries()){
  const elbow=interp(junction,tip,.51);
  beam(v,junction,add(elbow,mul(f.out,48+24*i)),24-3*i,26,C.midnight);
  beam(v,add(elbow,mul(f.out,48+24*i)),tip,11,16,i===1?C.cold:C.violet);
  // Suspended, detached irregular urban vane emphasizes 3D depth.
  const a=interp(junction,tip,.40),b=interp(junction,tip,.73),
   away=mul(f.out,52+i*14),up=[0,24+i*12,0];
  double(v,a,b,add(b,away),add(a,up),
   i===1?C.pearl:C.deep);
 }
 return tips.length;
}
export const AN_FOCUS=Object.freeze(['all','crown','citadel','shelves','harpoon']);
export function g4e7anSkyArchipelago(doc,sample,{enabled=false,focus='all'}={}){
 if(!enabled)return empty();
 if(!AN_FOCUS.includes(focus))throw Error('AN private component focus invalid');
 const aj=doc?.stageForge?.g4e7ajStudy,ah=doc?.stageForge?.g4e7ahStudy;
 if(aj?.id!=='reanchor'||!['true-pinch','pinch-switch'].includes(aj.road)||
  aj.originalMovingObjects!==28||aj.unchangedMovingObjects!==26||
  aj.reanchoredOriginalIds?.join(',')!=='a13-machine-01,a13-machine-02'||
  !ah?.realMissingLongitudinalCell52||ah.widthMinMeters<10||ah.widthMinMeters>13.5||
  doc.stageForge.productionPromoted!==false||aj.certifiedSlope2Meters!==0||
  aj.publish!=='HOLD'||doc.surfaces?.length!==7||doc.movingObstacles?.length!==28||
  doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52')
  throw Error('AN requires genuine private 7AJ B48/B51 candidate');
 if(typeof sample!=='function')throw Error('AN needs actual 31x5 B48 sampling');
 const frozen=JSON.stringify(doc),road=doc.surfaces[0],
  pieces={crown:[],citadel:[],shelves:[],harpoon:[]};
 // The four locations alternate side AND longitudinal position. No continuous
 // front faces, no repeated portals, no meshes entering the real 11m lane.
 // R2: u=.155 first road made the crown immediately behind the initial
 // 0.3s camera. All four silhouettes now live AHEAD of the initial chase
 // camera and within useful angular range; none are continuous corridor walls.
 const a=crown(pieces.crown,frame(road,sample,.40,-1));
 const b=citadel(pieces.citadel,frame(road,sample,.49,1));
 const c=districts(pieces.shelves,frame(road,sample,.57,-1));
 const d=harpoons(pieces.harpoon,frame(road,sample,.70,1));
 // Research isolation ONLY: unlike visually stacking scenes, selected
 // geometry is absent from the GPU upload. Default still renders all four.
 const all=AN_FOCUS.slice(1).flatMap(k=>pieces[k]);
 const vertices=focus==='all'?all:pieces[focus];
 const stats={
  active:true,vertices,focus,triangles:vertices.length/18,
  monuments:focus==='all'?4:1,
  hollowCrowns:1,crownHoles:1,crownShellSegments:a,splitCitadelProngs:b,
  floatingDecks:c,harpoonBranches:d,
  maximumRiseMeters:815,minimumOutboardMeters:20,
  nonCollision:true,addedCollision:0,addedRoads:0,addedMachines:0,
  certifiedSlope2Meters:0,publish:'HOLD'
 };
 if(a<25||b!==2||c!==3||d!==3||all.length%18!==0||
  all.length/18<450||all.length/18>16000||
  !all.every(Number.isFinite)||vertices.length<18||vertices.length%18!==0||
  JSON.stringify(doc)!==frozen)
  throw Error('AN sculptural multi-depth skyline/bounds or B48 source mutation');
 return stats;
}
