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
 const origin=n===2?-91:-61,span=n===2?185:160;
 const profile=t=>({
  x:origin+t*span,
  d:155+36*Math.sin(Math.PI*t)+10*Math.sin(t*3+side),
  top:16+(n===2?252:315)*Math.pow(Math.max(0,Math.sin(Math.PI*t)),.74)
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

function authorCell(v,f,n,side){
 const p=(along,depth,h)=>add(add(add(f.edge,scale(f.along,along)),scale(f.outward,depth)),[0,h,0]);
 const tone=n%3===0?C.pearl:n%3===1?C.steel:C.glass;
 // Near public transit arcade: open shops, real gaps, three decks, illuminated signage.
 for(let z=0;z<(n%4===0?1:n%4===1?2:3);z++){
  const h=7+z*13,d=18+z*3;
  both(v,p(-27,d,h),p(29,d,h),p(29,d+24,h),p(-27,d+24,h),z===2?C.pearl:C.steel);
  for(const x of [-26,-1,27])girder(v,p(x,d+2,h-13),p(x,d+2,h+4),2,C.pearl);
  for(let k=0;k<5;k++){
   if(k===1||k===4)continue;
   const x=-23+k*10;
   both(v,p(x,d+.3,h+1),p(x+7,d+.3,h+1),p(x+7,d+.3,h+9),p(x,d+.3,h+9),C.glass);
   both(v,p(x,d-.2,h+2),p(x+7,d-.2,h+2),p(x+7,d-.2,h+3.5),p(x,d-.2,h+3.5),k%2?C.edge:C.gold);
  }
 }
 girder(v,p(-33,19,47),p(35,19,52),4,C.pearl);
 for(const x of [-18,7,26]){
  girder(v,p(x,20,44),p(x+5,48,35),2,C.edge);
  both(v,p(x-4,18,16),p(x+5,18,16),p(x+5,18,22),p(x-4,18,22),x===7?C.gold:C.edge);
 }
 // Inhabited mid-bank: two different terraced towers with a genuinely open civic atrium.
 const center=12*Math.sin(n*1.67+side),rise=80+22*((n+side+8)%4);
 if(n%3!==1)for(const wing of [-1,1]){
  const origin=center+wing*32,d=83+n%3*9;
  for(let tier=0;tier<4;tier++){
   const low=tier*rise/4,high=(tier+1)*rise/4,shift=tier*tier*1.7,half=15-tier*1.45,
    a=p(origin-half+shift,d,low),b=p(origin+half+shift,d,low),
    c=p(origin+half+shift+2,d,high),dd=p(origin-half+shift+2,d,high);
   both(v,a,b,c,dd,tier%2?C.steel:tone);
   both(v,b,p(origin+half+shift,d+30,low),p(origin+half+shift+2,d+30,high),c,C.deep);
   if(tier!==1)both(v,dd,c,p(origin+half+shift+2,d+30,high),p(origin-half+shift+2,d+30,high),C.pearl);
   for(const fraction of [.28,.72]){
    const y=low+(high-low)*fraction;
    both(v,p(origin-half+3+shift,d-.5,y),p(origin+half-3+shift,d-.5,y),p(origin+half-3+shift,d-.5,y+1.5),p(origin-half+3+shift,d-.5,y+1.5),fraction<.5?C.lit:C.gold);
   }
  }
 }
 girder(v,p(center-20,119,rise*.47),p(center+20,119,rise*.51),4,C.pearl);
 // Far skyline: two sweeping incomplete spines with a large open air gap.
 if(n%4===0){
  const peak=182+30*n,axis=center+side*16;
  for(const sign of [-1,1]){
   let last=null;
   for(let k=0;k<=16;k++){
    const t=k/16,q=p(axis+sign*(44+42*t+16*Math.sin(Math.PI*t)),
     185+70*t+15*Math.sin(t*3),34+peak*t*t);
    if(last&&k!==5&&k!==11)girder(v,last,q,4,k%4===0?C.gold:C.edge);
    last=q;
   }
  }
  for(let level=0;level<5;level++){
   const height=peak*(.36+level*.118),w=66-level*8;
   both(v,p(axis-w,195+level*14,height),p(axis+w*.7,195+level*14,height),
    p(axis+w*.43,224+level*14,height+12),p(axis-w*.70,224+level*14,height+18),level%2?C.violet:C.pearl);
  }
 }
 if(n===2||n===6)civicCrescent(v,f,n,side);
}
export function g4e7ciIntegratedStreetscape(doc,sample,{enabled=false}={}){
 const blank={active:false,vertices:[],triangles:0,stations:0,layers:0,newRoads:0,newColliders:0,newMovingHazards:0,physicalChanged:false,art:'HOLD',human:'HOLD',publish:'HOLD',officialSlope2Meters:0};
 if(!enabled)return blank;
 const bc=doc?.stageForge?.g4e7bcStudy,aj=doc?.stageForge?.g4e7ajStudy;
 if(bc?.id!=='bank-grade-contour'||bc.variant!=='rollDeck'||aj?.road!==bc.road||
  !['true-pinch','pinch-switch'].includes(bc.road)||!bc.real7B48||!bc.real28B51||
  !bc.hasRealVoid52||bc.publish!=='HOLD'||bc.formalSlope2Meters!==0||
  doc.stageForge.productionPromoted!==false||doc.surfaces?.length!==7||
  doc.movingObstacles?.length!==28||doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52')
  throw Error('CI requires exact protected unpublished BC/B48/B51 geometry');
 const freeze=JSON.stringify(doc),v=[],stations=[.36,.44,.52,.60,.68,.76,.84,.92];
 for(const [n,u] of stations.entries())for(const side of [-1,1])
  authorCell(v,roadFrame(doc.surfaces[1],sample,u,side),n,side);
 const triangles=v.length/18;
 if(triangles<2500||triangles>50000||v.some(x=>!Number.isFinite(x))||JSON.stringify(doc)!==freeze)
  throw Error('CI geometry invalid or physics source mutated');
 return {active:true,vertices:v,triangles,stations:stations.length*2,layers:3,
  minimumSetbackM:18,landmarks:4,macroSilhouette:'FOUR_HOLLOW_CIVIC_CRESCENTS',newRoads:0,newColliders:0,newMovingHazards:0,physicalChanged:false,
  art:'HOLD',human:'HOLD',publish:'HOLD',officialSlope2Meters:0};
}