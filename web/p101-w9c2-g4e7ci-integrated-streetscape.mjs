/**
 * G4E-7CI: PRIVATE-only near/mid/far authored urban corridor on the real BC road.
 * No physical surfaces, hazards, camera, steering or speed changes.
 */
const C={edge:[.14,.98,.98],gold:[1,.68,.29],glass:[.16,.53,.64],pearl:[.70,.88,.91],steel:[.18,.34,.43],deep:[.055,.14,.23],lit:[.42,.88,.94],violet:[.46,.38,.74]};
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),scale=(a,k)=>a.map(x=>x*k),len=v=>Math.hypot(...v),unit=v=>scale(v,1/(len(v)||1));
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const tri=(o,a,b,c,k)=>{for(const p of [a,b,c])o.push(...p,...k);};
const quad=(o,a,b,c,d,k)=>{tri(o,a,b,c,k);tri(o,a,c,d,k);};
const both=(o,a,b,c,d,k)=>{quad(o,a,b,c,d,k);quad(o,d,c,b,a,C.deep);};
function girder(o,a,b,width,k){
 const dir=unit(sub(b,a)),ref=Math.abs(dir[1])>.9?[1,0,0]:[0,1,0],
  side=unit(cross(dir,ref)),up=unit(cross(dir,side)),w=scale(side,width*.5),h=scale(up,width*.36);
 const ring=p=>[add(add(p,w),h),add(sub(p,w),h),sub(sub(p,w),h),add(sub(p,h),w)];
 const v=[...ring(a),...ring(b)];
 for(const [i,j,k1,l] of [[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]])quad(o,v[i],v[j],v[k1],v[l],k);
}
function roadFrame(s,sample,u,side){
 const c=sample(s,u,.5),e=sample(s,u,side<0?0:1),a=sample(s,u-.003,.5),b=sample(s,u+.003,.5),
 along=unit([b[0]-a[0],0,b[2]-a[2]]),flat=[e[0]-c[0],0,e[2]-c[2]],
 outward=unit(sub(flat,scale(along,dot(flat,along))));
 if(dot(flat,outward)<3||!outward.every(Number.isFinite))throw Error('CI bad real roadside axis');
 return {edge:e,along,outward};
}

/**
 * G4E-7CL: 4 monumental, hollow, nonrectangular civic crescents. Their
 * large structural rims, voids, galleries, foundations, and public plaza
 * deliberately replace repetitive tower box silhouettes, not physics.
 */
function civicCrescent(v,f,n,side){
 const p=(u,d,h)=>add(add(add(f.edge,scale(f.along,u)),scale(f.outward,d)),[0,h,0]);
 const origin=n===2?-55:-48,span=n===2?118:104;
 const profile=t=>({
  x:origin+t*span,
  d:90+20*Math.sin(Math.PI*t)+7*Math.sin(t*3+side),
  top:14+(n===2?116:97)*Math.pow(Math.max(0,Math.sin(Math.PI*t)),.74)
 });
 for(let i=0;i<28;i++){
  const a=profile(i/28),b=profile((i+1)/28);
  // Two actual gaps cut through the thick rim, giving a readable open air void.
  if((i>=7&&i<=8)||(i>=19&&i<=20))continue;
  const a0=Math.max(5,a.top-29),b0=Math.max(5,b.top-29);
  both(v,p(a.x,a.d,a0),p(b.x,b.d,b0),p(b.x,b.d,b.top),p(a.x,a.d,a.top),C.pearl);
  both(v,p(a.x,a.d+26,a0),p(b.x,b.d+26,b0),p(b.x,b.d+26,b.top),p(a.x,a.d+26,a.top),C.steel);
  both(v,p(a.x,a.d,a.top),p(b.x,b.d,b.top),p(b.x,b.d+26,b.top),p(a.x,a.d+26,a.top),C.gold);
  if(i%6!==2&&i%6!==3&&Math.min(a.top,b.top)>92){
   const y0=.36*a.top,y1=.36*b.top;
   both(v,p(a.x,a.d-11,y0),p(b.x,b.d-11,y1),
    p(b.x,b.d-11,y1+14),p(a.x,a.d-11,y0+14),i%3===0?C.glass:C.deep);
   both(v,p(a.x,a.d-11,y0+14),p(b.x,b.d-11,y1+14),
    p(b.x,b.d+42,y1+14),p(a.x,a.d+42,y0+14),C.steel);
  }
  if(i%3===0&&Math.min(a.top,b.top)>70)
   both(v,p(a.x,a.d-1,a.top-8),p(b.x,b.d-1,b.top-8),
    p(b.x,b.d-1,b.top-3),p(a.x,a.d-1,a.top-3),C.edge);
 }
 for(const t of [.08,.28,.50,.73,.93]){
  const a=profile(t);
  girder(v,p(a.x+5,a.d+55,0),p(a.x,a.d+15,a.top-9),7,C.pearl);
  both(v,p(a.x-13,a.d+55,8),p(a.x+13,a.d+55,8),
    p(a.x+13,a.d+82,8),p(a.x-13,a.d+82,8),C.steel);
 }
 const square=profile(.52);
 both(v,p(square.x-26,square.d-30,48),p(square.x+26,square.d-30,48),
  p(square.x+26,square.d+62,48),p(square.x-26,square.d+62,48),C.pearl);
 for(const dx of [-18,0,18])
  both(v,p(square.x+dx-4,square.d-29,49),p(square.x+dx+4,square.d-29,49),
   p(square.x+dx+4,square.d-29,54),p(square.x+dx-4,square.d-29,54),C.gold);
}

// G4E-7CN: inhabited road-bank blocks, not a forest of floating micro-girders.
// A small number of thick carved wings frame plazas, transit entrances and roofs.
// Everything is visual-only and remains outboard of the original physical lane.
function sculptedWing(v,p,x0,x1,d0,d1,h0,h1,shift,skin,roof){
 const point=(u,w,h)=>p(x0+(x1-x0)*u+shift*w,d0+(d1-d0)*w+3*w,h);
 const top=(u,w)=>point(u,w,h1+2*w),bottom=(u,w)=>point(u,w,h0);
 // A load-bearing occupied block, but NOT one enormous solid colored sheet:
 // subdivided carved facade with actual transparent-air voids (missing
 // triangles), not fake window decals pasted onto an opaque front wall.
 const columns=6,rows=4;
 const front=(u,vv)=>p(x0+(x1-x0)*u+shift*vv*.12,d0,h0+(h1-h0)*vv);
 for(let a=0;a<columns;a++)for(let b=0;b<rows;b++){
  // Three open atrium bays on the front, with solid structural piers/lintels.
  const opening=b===1||b===2;
  if(opening&&(a===1||a===2||a===4))continue;
  const u0=a/columns,u1=(a+1)/columns,v0=b/rows,v1=(b+1)/rows;
  both(v,front(u0,v0),front(u1,v0),front(u1,v1),front(u0,v1),
    b===0?C.steel:b===3?C.pearl:(a%2?skin:C.deep));
 }
 // Perforate the road-facing side as well: the huge unbroken teal side
 // elevations of CN dominated the 15s and 17s native camera screenshots.
 for(const [u,material] of [[0,C.pearl],[1,C.steel]]){
  for(let k=0;k<5;k++)for(let b=0;b<4;b++){
   if((k===1||k===3)&&(b===1||b===2))continue;
   const w0=k/5,w1=(k+1)/5,z0=b/4,z1=(b+1)/4;
   const side=(ww,z)=>p(x0+(x1-x0)*u+shift*ww,d0+(d1-d0)*ww+3*ww,
     h0+(h1-h0)*z);
   both(v,side(w0,z0),side(w1,z0),side(w1,z1),side(w0,z1),
     b===3?C.pearl:material);
  }
 }
 // Recessed back wall and continuous real terrace floors retain architectural
 // load and legible volume while the main facade genuinely breathes.
 both(v,point(0,1,h0),point(1,1,h0),top(1,1),top(0,1),C.steel);
 both(v,bottom(0,0),bottom(1,0),bottom(1,1),bottom(0,1),C.deep);
 both(v,top(0,0),top(1,0),top(1,1),top(0,1),roof);
 for(const [u0,u1] of [[0,.16],[.84,1]])
  both(v,front(u0,.96),front(u1,.96),top(u1,0),top(u0,0),C.gold);
}
function authorCell(v,f,n,side){
 const p=(u,d,h)=>add(add(add(f.edge,scale(f.along,u)),scale(f.outward,d)),[0,h,0]);
 const odd=(n+Math.round((side+1)/2))%2;
 const height=44+(n%3)*11+(side===1?6:0);
 const wingSkin=n%3===0?C.pearl:n%3===1?C.steel:C.glass;
 // The roadside promenade has real ground mass and three shop bays;
 // the center stays physically open instead of becoming a sealed box.
 both(v,p(-31,18,5),p(31,18,5),p(31,49,5),p(-31,49,5),C.steel);
 for(const a of [-29,21]){
  sculptedWing(v,p,a,a+8,21,41,5,23,odd?2:-2,C.pearl,C.gold);
 }
 both(v,p(-27,22,23),p(30,22,23),p(29,44,28),p(-25,44,28),C.steel);
 both(v,p(-20,42,8),p(20,42,8),p(20,42,20),p(-20,42,20),C.glass);
 for(const [i,x] of [-16,0,16].entries()){
  both(v,p(x-7,41.5,9),p(x+7,41.5,9),p(x+7,41.5,18),p(x-7,41.5,18),i===1?C.deep:C.glass);
  both(v,p(x-7,41,19),p(x+7,41,19),p(x+7,41,21),p(x-7,41,21),i===1?C.gold:C.edge);
 }
 // A two-wing terraced housing/civic complex with a wide real air atrium.
 // Lateral offsets, staggered levels and roof planes create volume instead
 // of rectangular wireframes or freestanding neon sticks.
 const center=odd?12:-10,terraceLevels=3;
 for(const wing of [-1,1]){
  const x=center+wing*37;
  for(let tier=0;tier<terraceLevels;tier++){
   const h0=7+tier*height/terraceLevels,
    h1=7+(tier+1)*height/terraceLevels;
   const shift=(odd?1:-1)*tier*5+(wing===-1?-tier:tier);
   const half=14-tier*1.7,depth=112+tier*8+(wing===1?15:0);
   sculptedWing(v,p,x-half,x+half,depth,depth+32,h0,h1,shift,
     tier===0?C.steel:wing===1?C.glass:wingSkin,
     tier===2?C.pearl:C.steel);
   // Occupied floors use wide window bands, no thin lattice roof caps.
   const bx=x+shift;
   both(v,p(bx-half+3,depth-.7,h0+7),p(bx+half-3,depth-.7,h0+7),
    p(bx+half-3,depth-.7,h0+11),p(bx-half+3,depth-.7,h0+11),
    tier%2===0?C.lit:C.gold);
  }
 }
 // Public circulation reads as a single habitable civic concourse.
 if(n%3===0){
  both(v,p(center-25,108,25),p(center+25,108,25),
    p(center+25,126,26),p(center-25,126,26),C.pearl);
  both(v,p(center-24,107,22),p(center+24,107,22),
    p(center+24,107,25),p(center-24,107,25),C.glass);
 }
 // Only two low foreground cornice gestures: no forest of disconnected beams.
 if(n%3===1){
  both(v,p(-26,54,43),p(10,54,43),p(5,70,51),p(-23,70,51),C.pearl);
  both(v,p(12,54,46),p(32,54,46),p(27,68,54),p(15,68,54),C.gold);
 }
}

// G4E-7CM: choose fixed landmark sites once from BOTH genuine scripted cameras.
// Neither a camera nor a screenshot is altered; these are read-only projections
// using the exact perspective coefficient from drive3d.mjs (1.35).
function screenPoint(f,point){
 const front=unit(f.front),right=unit(cross(front,[0,1,0])),
  up=unit(cross(right,front)),w=sub(point,f.eye),z=dot(w,front);
 if(z<=1)return null;
 return {x:1.35*dot(w,right)/(z*(1360/860)),y:1.35*dot(w,up)/z,z};
}
function visibleSiteScore(frame,shots){
 const p=(u,d,h)=>add(add(add(frame.edge,scale(frame.along,u)),scale(frame.outward,d)),[0,h,0]);
 // Evaluate approximate full civic profile, not merely its center/AABB.
 const corners=[p(-58,90,10),p(58,90,10),p(-58,90,142),p(58,90,142),
  p(0,112,128),p(0,90,42)];
 let total=0,framesVisible=0;
 for(const shot of shots){
  if(!shot?.eye||!shot?.front)throw Error('CM requires real BG camera geometry');
  const pts=corners.map(q=>screenPoint(shot,q));
  const alive=pts.filter(q=>q&&q.x>-0.83&&q.x<0.83&&q.y>-.73&&q.y<.73);
  // Reject giant shapes that show one clipped sliver, and those too tiny.
  const center=pts[5],peak=pts[4];
  if(!center||!peak)continue;
  const span=pts.filter(Boolean);
  if(!span.length)continue;
  const wide=Math.max(...span.map(q=>q.x))-Math.min(...span.map(q=>q.x));
  const tall=Math.max(...span.map(q=>q.y))-Math.min(...span.map(q=>q.y));
  const proportion=alive.length/corners.length;
  const readable=proportion>=.5&&wide>.055&&tall>.06;
  if(readable)framesVisible++;
  total+=(readable?1:.1)*proportion*Math.min(1,wide/.44)*Math.min(1,tall/.45);
 }
 return {score:Number(total.toFixed(6)),framesVisible};
}

function cameraCellIntrusion(f,shots){
 const p=(u,d,h)=>add(add(add(f.edge,scale(f.along,u)),scale(f.outward,d)),[0,h,0]);
 const corners=[p(-60,55,6),p(60,55,6),p(-60,130,93),p(60,130,93)];
 return shots.some(shot=>{
  const pts=corners.map(q=>screenPoint(shot,q));
  // Camera crossing a proposed city block means it is not an acceptable
  // megafacade site even if corners vanish behind the eye.
  const delta=sub(p(0,91,45),shot.eye);
  if(len(delta)<75)return true;
  const visible=pts.filter(Boolean);
  if(visible.length<3)return false;
  const minX=Math.max(-1,Math.min(...visible.map(q=>q.x))),
    maxX=Math.min(1,Math.max(...visible.map(q=>q.x))),
    minY=Math.max(-1,Math.min(...visible.map(q=>q.y))),
    maxY=Math.min(1,Math.max(...visible.map(q=>q.y)));
  const area=Math.max(0,maxX-minX)*Math.max(0,maxY-minY);
  // Frustum-area threshold is a conservative engineering warning, not
  // a beauty metric: do not permit one nearby district to mask the road.
  return area>.32;
 });
}
function authorPromenade(v,f,n,side){
 const p=(u,d,h)=>add(add(add(f.edge,scale(f.along,u)),scale(f.outward,d)),[0,h,0]);
 // Open-sided inhabited sidewalk and transit shelters only, NOT empty scenery.
 both(v,p(-30,25,5),p(30,25,5),p(30,53,5),p(-30,53,5),C.steel);
 for(const x of [-23,0,23]){
  both(v,p(x-6,32,7),p(x+6,32,7),p(x+6,32,16),p(x-6,32,16),C.glass);
  both(v,p(x-7,29,16),p(x+7,29,16),p(x+7,53,19),p(x-7,53,19),n%2?C.pearl:C.gold);
 }
}
function placeLandmarks(doc,sample,shots){
 if(!Array.isArray(shots)||shots.length<2||
  shots[0]?.id!=='t1500'||shots[1]?.id!=='t1700'||
  shots.slice(0,2).some(x=>x.source!=='ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN'))
  throw Error('CM requires both original 240Hz 15/17s frames; never substitute a camera');
 // A landmark that cannot be recognized in either image is worse than no
 // landmark. Rank both physical bank sides together; do not insist on one
 // impossible monument per side. Roadside inhabitation stays bilateral.
 const options=[];
 for(const side of [-1,1])for(let road=0;road<2;road++)for(let k=2;k<=17;k++){
  const u=k/20,frame=roadFrame(doc.surfaces[road],sample,u,side),
   proof=visibleSiteScore(frame,shots.slice(0,2));
  if(proof.framesVisible>=1&&proof.score>=.12)
   options.push({road,u,side,frame,...proof});
 }
 options.sort((a,b)=>b.framesVisible-a.framesVisible||b.score-a.score||a.road-b.road||a.u-b.u);
 const chosen=[];
 for(const option of options){
  if(chosen.every(s=>s.road!==option.road||s.side!==option.side||Math.abs(s.u-option.u)>.17)){
   chosen.push({...option,slot:chosen.length===0?2:6});
   if(chosen.length===2)break;
  }
 }
 if(chosen.length!==2||chosen.some(x=>x.framesVisible<1||x.score<.12))
  throw Error('CN genuine camera has fewer than two readable physical-bank sites');
 return chosen;
}

export function g4e7ciIntegratedStreetscape(doc,sample,{enabled=false,shots=null}={}){
 const blank={active:false,vertices:[],triangles:0,stations:0,layers:0,newRoads:0,newColliders:0,newMovingHazards:0,physicalChanged:false,art:'HOLD',human:'HOLD',publish:'HOLD',officialSlope2Meters:0};
 if(!enabled)return blank;
 const bc=doc?.stageForge?.g4e7bcStudy,aj=doc?.stageForge?.g4e7ajStudy;
 if(bc?.id!=='bank-grade-contour'||bc.variant!=='rollDeck'||aj?.road!==bc.road||
  !['true-pinch','pinch-switch'].includes(bc.road)||!bc.real7B48||!bc.real28B51||
  !bc.hasRealVoid52||bc.publish!=='HOLD'||bc.formalSlope2Meters!==0||
  doc.stageForge.productionPromoted!==false||doc.surfaces?.length!==7||
  doc.movingObstacles?.length!==28||doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52')
  throw Error('CI requires exact protected unpublished BC/B48/B51 geometry');
 const freeze=JSON.stringify(doc),v=[],stations=[.40,.51,.62,.73,.84,.93];
 if(!Array.isArray(shots)||shots.length<2)throw Error('CO requires both unchanged native cameras');
 // Roadside cells use a fixed, read-only TWO camera coverage plan; extremely
 // close sites get a low open promenade, avoiding another huge near-camera wall.
 let clippedCellReliefs=0,fullDistrictCells=0;
 for(const [n,u] of stations.entries())for(const side of [-1,1]){
  const f=roadFrame(doc.surfaces[1],sample,u,side);
  if(cameraCellIntrusion(f,shots.slice(0,2))){
   clippedCellReliefs++;
   authorPromenade(v,f,n,side);
  }else{fullDistrictCells++;authorCell(v,f,n,side);}
 }
 const sites=placeLandmarks(doc,sample,shots);
 for(const site of sites)civicCrescent(v,site.frame,site.slot,site.side);
 const triangles=v.length/18;
 if(triangles<1000||triangles>50000||v.some(x=>!Number.isFinite(x))||JSON.stringify(doc)!==freeze)
  throw Error('CI geometry invalid or physics source mutated');
 return {active:true,vertices:v,triangles,stations:stations.length*2,layers:3,
  carvedFacades:true,clippedCellReliefs,fullDistrictCells,
  minimumSetbackM:18,landmarks:2,macroSilhouette:'OPEN_AIR_FRAMED_CIVIC_DISTRICTS_WITH_CARVED_TERRACES',
  cameraEvidence:'BG240HZ_BOTH_15_AND_17_NOT_HUMAN',
  landmarksQA:sites.map(({road,u,side,slot,score,framesVisible})=>({road,u,side,slot,score,framesVisible})),
  newRoads:0,newColliders:0,newMovingHazards:0,physicalChanged:false,
  art:'HOLD',human:'HOLD',publish:'HOLD',officialSlope2Meters:0};
}