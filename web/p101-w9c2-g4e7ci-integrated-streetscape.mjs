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
 // G4E-7CP: the CO screenshot showed the rear of the occupied wings as
 // uninterrupted teal rectangles. The REAR must have actual through-openings
 // as well, not just the front elevation. Keep broad piers and top lintels.
 const rear=(u,z)=>point(u,1,h0+(h1-h0)*z);
 for(let a=0;a<6;a++)for(let b=0;b<4;b++){
  if((a===1||a===2||a===4)&&(b===1||b===2))continue;
  const u0=a/6,u1=(a+1)/6,z0=b/4,z1=(b+1)/4;
  both(v,rear(u0,z0),rear(u1,z0),rear(u1,z1),rear(u0,z1),
    b===0?C.steel:b===3?C.pearl:(a%2===0?C.glass:C.steel));
 }
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
 // CP2: remove the legacy, opaque 40m storefront that remained visible as
 // repeated cyan walls despite the carved residential wings.
 both(v,p(-20,42,8),p(20,42,8),p(20,42,9),p(-20,42,9),C.steel);
 both(v,p(-20,42,19),p(20,42,19),p(20,42,21),p(-20,42,21),C.pearl);
 for(const [i,x] of [-16,0,16].entries()){
  // CP3: three cyan solid shop panels appeared as huge 17s backdrops.
  // Frame the retail openings, but leave the interior physically empty.
  both(v,p(x-7,41.5,9),p(x-6,41.5,9),p(x-6,41.5,18),p(x-7,41.5,18),C.pearl);
  both(v,p(x+6,41.5,9),p(x+7,41.5,9),p(x+7,41.5,18),p(x+6,41.5,18),C.steel);
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
  // G4E-7CS: actual 17s GPU source-ID proved these exact THREE flat
  // glass quads were the enormous opaque teal foreground rectangles.
  // Only station 2 / left bank has this proven fault. Make three genuinely
  // open transit bays with short grounded 3D abutments; other bays unchanged.
  if(n===2&&side===-1){
   for(const abutment of [x-5,x+5])
    girder(v,p(abutment,32,5),p(abutment,32,16),1.8,C.steel);
  }else{
   both(v,p(x-6,32,7),p(x+6,32,7),p(x+6,32,16),p(x-6,32,16),C.glass);
  }
  both(v,p(x-7,29,16),p(x+7,29,16),p(x+7,53,19),p(x-7,53,19),n%2?C.pearl:C.gold);
 }
}

// G4E-7CP: one continuous, PUBLIC-looking pedestrian concourse in the
// extruded VISUAL scenery (NOT a new surface/collider). Keep it well outboard
// of the B48 rolling strip. Each station's real road frame bends the concourse
// to the original course rather than generating a straight floating skybridge.
function joinDistricts(v,bankFrames,side){
 const at=(f,d,h)=>add(add(f.edge,scale(f.outward,d)),[0,h,0]);
 let links=0;
 const softened=(a,b,k)=>add(scale(a,1-k),scale(b,k));
 for(let i=0;i<bankFrames.length-1;i++){
  const left=bankFrames[i],right=bankFrames[i+1];
  for(let k=0;k<5;k++){
   const f0=k/5,f1=(k+1)/5;
   const center0=softened(at(left,78,10),at(right,78,11),f0);
   const center1=softened(at(left,78,10),at(right,78,11),f1);
   const out0=unit(softened(left.outward,right.outward,f0)),
    out1=unit(softened(left.outward,right.outward,f1));
   const w0=scale(out0,6),w1=scale(out1,6);
   const a=sub(center0,w0),b=add(center0,w0),
    c=add(center1,w1),d=sub(center1,w1);
   // The concourse is a broad continuous inhabited plane, not a thin beam.
   both(v,a,b,c,d,C.steel);
   // Interrupted luminous parapet is BELOW rider eye height at close range.
   if(k===0||k===4){
    both(v,add(b,[0,1,0]),add(c,[0,1,0]),
      add(c,[0,1.2,0]),add(b,[0,1.2,0]),side<0?C.gold:C.lit);
   }
  }
  links++;
 }
 // Broad inhabited abutments support the visual concourse at three nodes.
 for(let i=0;i<bankFrames.length;i+=2){
  const f=bankFrames[i],p=(d,h)=>at(f,d,h);
  both(v,p(72,4),p(84,4),p(84,10),p(74,10),C.pearl);
  both(v,p(84,4),p(91,4),p(89,11),p(84,10),C.steel);
 }
 return links;
}

// Distant *roofline* rather than another skyline of literal tower boxes:
// a sawtooth procession of perforated folded civic canopies, beyond the
// actual bank's inhabited terraces, with lower terraces and thick supports.
// The silhouette changes height and pitch while retaining a continuous line.
// CP2 correction: NO giant cross-frame slabs. Each small roof is anchored
// into a distant folded civic district and leaves a genuine air interval
// before the next one. Both real 15s/17s shots veto screen-wide intrusions.
function civicRoofline(v,bankFrames,side,shots){
 const at=(f,d,h)=>add(add(f.edge,scale(f.outward,d)),[0,h,0]);
 const mix=(a,b,k)=>add(scale(a,1-k),scale(b,k));
 const peaks=side<0?[71,96,77,109,82,101]:[88,75,102,79,112,86];
 const offset=side<0?245:270;
 let bays=0;
 for(let i=0;i<bankFrames.length-1;i++){
  const a=bankFrames[i],b=bankFrames[i+1];
  const point=(frac,d,h)=>mix(at(a,d,h[0]),at(b,d,h[1]),frac);
  const h=[peaks[i],peaks[i+1]];
  // Occupied roof segments extend only 24% of the inter-district span.
  // The open 76% interrupts the formerly endless dark horizontal bands.
  const p0=point(.28,offset,h.map(q=>q-12)),
   p1=point(.52,offset,h.map(q=>q-12)),
   p2=point(.52,offset+28,h),
   p3=point(.28,offset+28,h);
  if(shots.some(shot=>{
   const p=[p0,p1,p2,p3].map(x=>screenPoint(shot,x)).filter(Boolean);
   if(p.length<3)return false;
   const visible=p.filter(x=>x.x>=-1&&x.x<=1&&x.y>=-1&&x.y<=1);
   if(visible.length<2)return false;
   const dx=Math.max(...visible.map(q=>q.x))-Math.min(...visible.map(q=>q.x));
   const dy=Math.max(...visible.map(q=>q.y))-Math.min(...visible.map(q=>q.y));
   // The previous (successful) render proved these distant 'roofs'
   // could appear as thin black bars across the upper sky. If any sampled
   // edge intrudes on the upper game view, reject the complete bay rather
   // than using screenshot-specific positions or moving the camera.
   return dx>.67||dx*dy>.13||
     visible.some(q=>q.y>.31&&Math.abs(q.x)<.93);
  }))continue;
  both(v,p0,p1,p2,p3,i%2===0?C.pearl:C.steel);
  // A built foundation makes the roof a district, not a flying strip.
  const f=point(.40,offset+24,h.map(q=>q-22)),
    root=point(.40,offset+20,[6,6]),
    root2=point(.42,offset+35,[6,6]),
    cap=point(.42,offset+36,h.map(q=>q-18));
  both(v,root,root2,cap,f,C.steel);
  // The slim facade band records a habitable storey at skyline distance.
  both(v,point(.28,offset+15,h.map(q=>q-22)),
    point(.52,offset+15,h.map(q=>q-22)),
    point(.52,offset+15,h.map(q=>q-18)),
    point(.28,offset+15,h.map(q=>q-18)),C.lit);
  bays++;
 }
 return bays;
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
 const freeze=JSON.stringify(doc),v=[],sources=[],stations=[.40,.51,.62,.73,.84,.93];
 const mark=(kind,meta,fn)=>{
  const first=v.length/18;
  fn();
  const count=v.length/18-first;
  if(!Number.isInteger(count)||count<=0)throw Error('CQ empty or invalid provenance');
  sources.push({kind,...meta,firstTriangle:first,triangleCount:count});
 };
 if(!Array.isArray(shots)||shots.length<2)throw Error('CO requires both unchanged native cameras');
 // Roadside cells use a fixed, read-only TWO camera coverage plan; extremely
 // close sites get a low open promenade, avoiding another huge near-camera wall.
 let clippedCellReliefs=0,fullDistrictCells=0;
 for(const [n,u] of stations.entries())for(const side of [-1,1]){
  const f=roadFrame(doc.surfaces[1],sample,u,side);
  const relieved=cameraCellIntrusion(f,shots.slice(0,2));
  if(relieved)clippedCellReliefs++;else fullDistrictCells++;
  mark(relieved?'roadbank-promenade':'roadbank-inhabited',{station:n,u,side},
   ()=>relieved?authorPromenade(v,f,n,side):authorCell(v,f,n,side));
 }
 // Both banks follow the same real roadway, but their distant folded
 // rooflines are deliberately asymmetric. This is scenery only.
 let districtLinks=0,farRoofBays=0;
 for(const side of [-1,1]){
  const frames=stations.map(u=>roadFrame(doc.surfaces[1],sample,u,side));
  mark('civic-concourse',{side},()=>{districtLinks+=joinDistricts(v,frames,side);});
  // CP's camera-veto can legitimately remove some roof spans. Avoid empty spans.
  const roofStart=v.length/18;
  farRoofBays+=civicRoofline(v,frames,side,shots.slice(0,2));
  if(v.length/18>roofStart)sources.push({kind:'distant-folded-roofline',side,
   firstTriangle:roofStart,triangleCount:v.length/18-roofStart});
 }
 const sites=placeLandmarks(doc,sample,shots);
 for(const site of sites)mark('anchored-civic-crescent',
  {road:site.road,u:site.u,side:site.side,slot:site.slot},
  ()=>civicCrescent(v,site.frame,site.slot,site.side));
 const triangles=v.length/18;
 if(triangles<1000||triangles>50000||v.some(x=>!Number.isFinite(x))||JSON.stringify(doc)!==freeze)
  throw Error('CI geometry invalid or physics source mutated');
 if(sources.reduce((sum,x)=>sum+x.triangleCount,0)!==triangles||
    sources.some((x,i)=>x.firstTriangle!==(i?sources[i-1].firstTriangle+sources[i-1].triangleCount:0)))
  throw Error('CQ provenance does not cover all actual triangles');
 return {active:true,vertices:v,sources,triangles,stations:stations.length*2,layers:3,
  carvedFacades:true,openRearFacades:true,districtLinks,farRoofBays,clippedCellReliefs,fullDistrictCells,
  minimumSetbackM:18,landmarks:2,macroSilhouette:'LOW_OPEN_CONCOURSE_WITH_SPACED_ANCHORED_DISTRICTS',
  cameraEvidence:'BG240HZ_BOTH_15_AND_17_NOT_HUMAN',
  landmarksQA:sites.map(({road,u,side,slot,score,framesVisible})=>({road,u,side,slot,score,framesVisible})),
  newRoads:0,newColliders:0,newMovingHazards:0,physicalChanged:false,
  art:'HOLD',human:'HOLD',publish:'HOLD',officialSlope2Meters:0};
}

/**
 * G4E-7CQ read-only pixel to authored-triangle candidate tracer. Uses the
 * *actual original* WebGL vertex projection (drive3d's 1.35/aspect, eye/right/
 * up/front) and near/far homogeneous clipping. Triangles are neither
 * re-rendered nor modified. This records candidate ownership among CI
 * triangles only: objects rendered later (road, ball etc.) may occlude them.
 * Confirm original screen RGB alongside the candidate; do not claim ART PASS.
 */
export function g4e7cqTracePixels(vertices,sources,view,width,height,pixels){
 if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)
  throw Error('CQ requires actual game framebuffer size');
 const right=view.right,up=view.up,front=view.front,eye=view.eye;
 if([eye,right,up,front].some(x=>!Array.isArray(x)||x.length!==3||x.some(v=>!Number.isFinite(v))))
  throw Error('CQ requires actual viewForPose camera');
 const projected=[];
 for(let ti=0;ti<vertices.length/18;ti++){
  const p=[];
  for(let j=0;j<3;j++){
   const k=ti*18+j*6,xyz=vertices.slice(k,k+3),w=sub(xyz,eye),z=dot(w,front);
   if(z<1.4){p.length=0;break;}
   p.push({x:1.35*dot(w,right)/((width/height)*z),
    y:1.35*dot(w,up)/z,z,xyz,color:vertices.slice(k+3,k+6)});
  }
  projected.push(p.length===3?p:null);
 }
 const probes=[];
 for(const [x,y] of pixels){
  const X=2*(x+.5)/width-1,Y=1-2*(y+.5)/height;
  let best=null,all=0;
  for(let ti=0;ti<projected.length;ti++){
   const p=projected[ti];if(!p)continue;
   const area=(p[1].y-p[2].y)*(p[0].x-p[2].x)+(p[2].x-p[1].x)*(p[0].y-p[2].y);
   if(Math.abs(area)<1e-12)continue;
   const a=((p[1].y-p[2].y)*(X-p[2].x)+(p[2].x-p[1].x)*(Y-p[2].y))/area,
    b=((p[2].y-p[0].y)*(X-p[2].x)+(p[0].x-p[2].x)*(Y-p[2].y))/area,
    c=1-a-b;
   if(Math.min(a,b,c)<-1e-8)continue;
   const invZ=a/p[0].z+b/p[1].z+c/p[2].z;
   if(invZ<=0)continue;
   const depth=1/invZ;all++;
   // gl.LEQUAL with both() reverse-facing triangles: later coplanar
   // dark backface may win exactly equal depth at shader precision.
   if(best&&(depth>best.depth+0.0001||
      (Math.abs(depth-best.depth)<0.0001&&ti<best.triangle)))continue;
   const source=sources.find(z=>ti>=z.firstTriangle&&ti<z.firstTriangle+z.triangleCount);
   if(!source)throw Error('CQ triangle attribution hole '+ti);
   best={triangle:ti,kind:source.kind,source:((({firstTriangle,triangleCount,...info})=>info)(source)),
    depth:Number(depth.toFixed(3)),
    position:p[0].xyz.map((_,i)=>Number(((p[0].xyz[i]+p[1].xyz[i]+p[2].xyz[i])/3).toFixed(2))),
    color:p[0].color.map(v=>Number(v.toFixed(3)))};
  }
  probes.push({x,y,candidateCount:all,candidate:best});
 }
 return {schema:'G4E7CQ_ACTUAL_GL_PROJECTION_CPU_GEOMETRIC_CANDIDATES_NOT_PICK_BUFFER',
  width,height,triangles:projected.length,probes};
}


// G4E-7CR: PRIVATE-only GPU-color provenance A/B; geometry and physics stay identical.
// Neon magenta belongs solely to roadbank station=2, u=.62, side=-1.
export function g4e7crHighlightStation2Left(art){
 if(!art?.active||!Array.isArray(art.vertices)||!Array.isArray(art.sources))
  throw Error('CR requires genuine authored CI mesh and immutable source tags');
 const hits=art.sources.filter(s=>s.station===2&&s.u===.62&&s.side===-1&&
  (s.kind==='roadbank-promenade'||s.kind==='roadbank-inhabited'));
 if(hits.length!==1)throw Error('CR station2 left provenance must resolve exactly once');
 const source=hits[0],vertices=art.vertices.slice();
 for(let ti=source.firstTriangle;ti<source.firstTriangle+source.triangleCount;ti++)
  for(let vi=0;vi<3;vi++){
   const k=ti*18+vi*6+3;
   vertices[k]=1;vertices[k+1]=0;vertices[k+2]=1;
  }
 return {vertices,kind:source.kind,triangles:source.triangleCount,
  firstTriangle:source.firstTriangle,station:source.station,side:source.side};
}
