/**
 * W9-C2 G4E-7L | FRACTURED TITAN / SKYRIFT.
 *
 * Major, two-district architectural massing anchored in ACTUAL B48 GLIDE
 * surface frames, not a fake driveable mesh. Non-colliding GPU scenery only.
 * A: asymmetric broken continental fins / cliffs with visible void bays.
 * B: A + two very high, open, bent sky seams that cross ABOVE the road.
 *
 * The candidate's 300m real B48 road deformation was already built and
 * separately proven in G4E-7F. G4E-7L changes NONE of those real surfaces.
 */
export const G4E7L_MODES=Object.freeze(['off','rift','skyseam']);
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const mul=(v,k)=>v.map(x=>x*k);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const length=v=>Math.hypot(...v);
const unit=v=>mul(v,1/(length(v)||1));
const smooth=t=>t*t*(3-2*t);
const lerp=(a,b,t)=>add(mul(a,1-t),mul(b,t));
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const palette=Object.freeze({
 bedrock:[.095,.20,.27],facet:[.17,.35,.42],recess:[.055,.13,.19],
 frost:[.26,.72,.82],trace:[.66,.93,1],amber:[.91,.51,.25]
});
export const G4E7L_DISTRICTS=Object.freeze([
 Object.freeze({id:'SKYLINE_FRACTURE',section:0,start:.25,end:.92,slices:29,
  peakLeftMeters:275,peakRightMeters:388,outboardMinimumMeters:72}),
 Object.freeze({id:'CROWN_UPLIFT',section:1,start:.065,end:.345,slices:23,
  peakLeftMeters:340,peakRightMeters:470,outboardMinimumMeters:78})
]);
const off=()=>({active:false,mode:'off',vertices:[],triangles:0,
  districts:0,cliffPanels:0,roofShells:0,openVoidBays:0,
  skySeams:0,landmarkSpines:0,minimumClearanceMeters:null,
  maximumAltitudeAboveRoadMeters:0,architecturalFootprintMeters:null,
  nonCollision:true,addedRoads:0,addedSupport:0,addedMachines:0,
  goldUntouched:true,officiallyApprovedSlopeDnaMeters:0,
  noHumanVisualApproval:true});
const tri=(out,a,b,c,color)=>{
 for(const p of [a,b,c])out.push(...p,...color);
};
const panel=(out,a,b,c,d,color)=>{
 tri(out,a,b,c,color);tri(out,a,c,d,color);
 // Back is deliberate: no view-angle dependent missing canyon façade.
 const shadow=color.map(v=>v*.70);
 tri(out,c,b,a,shadow);tri(out,d,c,a,shadow);
};
function hollowRib(out,a,b,thickness,color){
 const d=unit(sub(b,a));
 const along=[-d[2],0,d[0]];
 const horizontal=length(along)<.1?[1,0,0]:unit(along);
 const across=unit([d[1]*horizontal[2]-d[2]*horizontal[1],
  d[2]*horizontal[0]-d[0]*horizontal[2],
  d[0]*horizontal[1]-d[1]*horizontal[0]]);
 const bend=(p,x,y)=>add(p,add(mul(horizontal,x*thickness),mul(across,y*thickness*.55)));
 const p=[bend(a,-1,-1),bend(a,1,-1),bend(a,1,1),bend(a,-1,1),
  bend(b,-1,-1),bend(b,1,-1),bend(b,1,1),bend(b,-1,1)];
 for(const [i,j,k,l] of [[0,1,2,3],[4,7,6,5],[0,4,5,1],
  [1,5,6,2],[2,6,7,3],[3,7,4,0]])panel(out,p[i],p[j],p[k],p[l],color);
}
function realFrame(s,u,side,sample){
 const pos=sample(s,u,.5),edge=sample(s,u,side===-1?0:1);
 const p=sample(s,clamp(u-.004,0,1),.5);
 const q=sample(s,clamp(u+.004,0,1),.5);
 const direction=unit([q[0]-p[0],0,q[2]-p[2]]);
 const away=sub(edge,pos);
 let outward=unit(sub([away[0],0,away[2]],mul(direction,dot(direction,away))));
 if(dot(outward,away)<0)outward=mul(outward,-1);
 return {pos,edge,direction,outward};
}
function out(f,meters,raise,forward=0){
 return add(add(f.edge,mul(f.outward,meters)),
  add([0,raise,0],mul(f.direction,forward)));
}
function bayFrame(road,u,side,district,sample){
 const f=realFrame(road,u,side,sample),normalized=(u-district.start)/(district.end-district.start);
 const phase=Math.PI*normalized;
 const sideShift=side===-1?1.0:1.32;
 const wave=.5+.5*Math.sin(phase*3.3+(side===-1?.7:1.85));
 const taper=.35+.65*Math.sin(phase)**.60;
 const peak=(side===-1?district.peakLeftMeters:district.peakRightMeters)*taper;
 const inner=out(f,district.outboardMinimumMeters+wave*15,8);
 const heel=out(f,115+wave*28,-66);
 const crest=out(f,165+wave*75,peak,24*Math.sin(phase*2.7+sideShift));
 const outer=out(f,280+wave*62,peak*.31,-12*Math.cos(phase*2+sideShift));
 return {inner,heel,crest,outer,
  tip:out(f,208+wave*78,peak+34+14*Math.sin(phase*4.0),20*Math.sin(phase*3)),
  u,peak};
}
function need(doc){
 return doc?.stageForge?.recordStageId==='VB-P101-A13-W9C2-G4E7G-GLIDE'&&
  doc.stageForge?.g4e7gVisualTrial?.kind==='glide'&&
  doc.stageForge?.g4e7fPhysicalStudy?.variant==='glide'&&
  doc.stageForge?.productionPromoted===false&&
  doc.surfaces?.length===7&&doc.movingObstacles?.length===28;
}
export function g4e7lAllowed(stage){return Boolean(need(stage));}
export function g4e7lTitanArchitecture(stage,sample,{mode='off'}={}){
 if(!G4E7L_MODES.includes(mode))throw Error('G4E7L declared mode required');
 if(mode==='off'||!need(stage))return off();
 if(typeof sample!=='function'||stage.surfaces.some(s=>s.rows!==31||
   s.cols!==5||s.rideable!==true||s.collidable!==true))
  throw Error('G4E7L must reference exactly seven true B48 collision roads');
 const signature=JSON.stringify(stage);
 const vertices=[];
 let cliffPanels=0,roofShells=0,openVoidBays=0,landmarkSpines=0,skySeams=0;
 let highest=0;
 for(const district of G4E7L_DISTRICTS){
  const road=stage.surfaces[district.section];
  for(const side of [-1,1]){
   const series=[];
   for(let i=0;i<=district.slices;i++){
    const u=district.start+(district.end-district.start)*i/district.slices;
    const f=bayFrame(road,u,side,district,sample);
    highest=Math.max(highest,f.peak+34);
    series.push(f);
   }
   for(let i=0;i<district.slices;i++){
    const a=series[i],b=series[i+1];
    // Fragmented void bays make the façade broken, NOT a tunnel of identical
    // square boxes. Real blue sky remains visible through the missing bays.
    const notch=(i%11===4||i%11===5||i%11===6);
    if(notch)openVoidBays++;
    else{
     // Build a truly massive FOLDED canyon wall instead of a single paper
     // plane. Intermediate ridges bend out and back through the depth of the
     // external shard, creating the iconic vertical sawtooth silhouette.
     const kink=(node,t,n)=>add(lerp(node.inner,node.crest,t),
       mul(sub(node.outer,node.heel),n));
     const a1=kink(a,.24,.085),b1=kink(b,.24,.095);
     const a2=kink(a,.49,-.055),b2=kink(b,.49,-.062);
     const a3=kink(a,.73,.067),b3=kink(b,.73,.072);
     panel(vertices,a.inner,b.inner,b1,a1,palette.bedrock);
     panel(vertices,a1,b1,b2,a2,palette.facet);
     panel(vertices,a2,b2,b3,a3,palette.bedrock);
     panel(vertices,a3,b3,b.crest,a.crest,palette.facet);
     cliffPanels+=4;
     // Thick lower overhang folds away into the actual open sky. This is
     // scenery, never a fake road or additional collision triangle.
     const backA=add(lerp(a.heel,a.outer,.54),[0,-13,0]);
     const backB=add(lerp(b.heel,b.outer,.54),[0,-18,0]);
     panel(vertices,a.heel,b.heel,backB,backA,palette.recess);
     panel(vertices,backA,backB,b.outer,a.outer,palette.bedrock);
     cliffPanels+=2;
    }
    // The upturned shell's top remains thin, disconnected at the void bays.
    if(!notch){
     panel(vertices,a.crest,b.crest,b.tip,a.tip,
      i%4===0?palette.frost:palette.facet);roofShells++;
     panel(vertices,a.tip,b.tip,b.outer,a.outer,palette.bedrock);roofShells++;
    }
    // Only four massive spines, staggered left/right and section-by-section.
    if((i===4||i===12||i===22)&&!(i===22&&district.slices<25)){
     hollowRib(vertices,a.heel,a.tip,5.2+(i%3)*3,palette.bedrock);
     hollowRib(vertices,a.inner,a.crest,2.0,palette.facet);
     hollowRib(vertices,a.crest,a.tip,1.15,palette.trace);
     landmarkSpines++;
    }
   }
   // Out-of-phase huge floating torn fins float well OUTSIDE the road, not
   // secretly rideable and not masquerading as a center safe strip.
   for(const i of [9,18]){
    if(i>=district.slices)continue;
    const s=series[i],t=series[i+2];
    const detached=add(s.tip,[0,64,0]),point=add(t.tip,[0,101,0]);
    panel(vertices,s.crest,t.crest,point,detached,palette.frost);roofShells++;
    panel(vertices,s.crest,detached,point,t.crest,palette.recess);roofShells++;
   }
  }
 }
 if(mode==='skyseam'){
  // Two elevated open split seams (actual huge structure, not a floor).
  // Their LOWEST beams are >160m above the sampled B48 center. Never join
  // collision geometry, never occlude hazards near the actual driving surface.
  for(const [section,u,peak] of [[0,.63,290],[1,.178,345]]){
   const road=stage.surfaces[section];
   const left=realFrame(road,u,-1,sample),right=realFrame(road,u,1,sample);
   const sideLeft=out(left,99,peak*.66),sideRight=out(right,120,peak*.57);
   const archCenter=add(sample(road,u,.5),[0,peak,0]);
   const seamStart=add(sideLeft,[0,24,0]),seamEnd=add(sideRight,[0,38,0]);
   // Open asymmetrical V with a suspended dorsal blade, no solid slab.
   hollowRib(vertices,seamStart,add(archCenter,[-21,16,0]),6.5,palette.facet);
   hollowRib(vertices,add(archCenter,[25,-9,0]),seamEnd,5,palette.bedrock);
   hollowRib(vertices,add(archCenter,[-21,16,0]),
    add(archCenter,[25,-9,0]),1.4,palette.trace);
   const tip=add(archCenter,[0,123,0]);
   hollowRib(vertices,add(archCenter,[25,-9,0]),tip,4.1,palette.frost);
   hollowRib(vertices,tip,add(seamEnd,[0,-43,0]),2.2,palette.amber);
   skySeams++;
   highest=Math.max(highest,peak+123);
  }
 }
 if(vertices.length<50000||vertices.length>240000||vertices.length%18!==0||
   !vertices.every(Number.isFinite))
  throw Error('G4E7L insufficient real scenic mass or invalid GPU budget');
 if(openVoidBays<12||cliffPanels<50||roofShells<50||highest<300)
  throw Error('G4E7L must form huge asymmetric pierced silhouettes');
 if(JSON.stringify(stage)!==signature)throw Error('G4E7L mutated real B48 or machines');
 return {active:true,mode,vertices,triangles:vertices.length/18,
  districts:G4E7L_DISTRICTS.length,cliffPanels,roofShells,openVoidBays,
  skySeams,landmarkSpines,minimumClearanceMeters:Math.min(...G4E7L_DISTRICTS.map(x=>x.outboardMinimumMeters)),
  maximumAltitudeAboveRoadMeters:Number(highest.toFixed(1)),
  architecturalFootprintMeters:'TWO_REAL_ROAD_ANCHORED_SKYLINE_AND_CROWN_DISTRICTS',
  nonCollision:true,addedRoads:0,addedSupport:0,addedMachines:0,
  goldUntouched:true,officiallyApprovedSlopeDnaMeters:0,
  noHumanVisualApproval:true};
}
export function createG4E7LStageControls({canvas,parent}){
 if(!canvas||!parent)throw Error('Missing research control anchors');
 const group=document.createElement('section');group.id='g4e7lModes';
 group.setAttribute('aria-label','G4E-7L 非公開巨大3D構造の比較');
 group.style.cssText='padding:8px;margin:6px 0;display:flex;gap:8px;flex-wrap:wrap;border:1px solid #63a0b2;border-radius:10px';
 let enabled=false,mode='off';
 const buttons=new Map();
 const publish=()=>{
  group.style.display=enabled?'flex':'none';
  group.hidden=!enabled;
  canvas.dataset.g4e7lMode=enabled?mode:'off';
  for(const [name,button] of buttons){
   button.disabled=!enabled;
   button.setAttribute('aria-pressed',String(enabled&&name===mode));
  }
 };
 const setStage=allow=>{enabled=Boolean(allow);mode='off';publish();};
 for(const [value,label] of [
  ['off','BASELINE／建築追加なし'],
  ['rift','FRACTURED TITAN／巨大非対称の裂けた外殻'],
  ['skyseam','SKYRIFT／外殻＋高空の断裂構造']]){
  const b=document.createElement('button');b.id='g4e7l-'+value;
  b.type='button';b.textContent=label;
  b.addEventListener('click',()=>{if(!enabled)return;mode=value;publish();});
  group.append(b);buttons.set(value,b);
 }
 parent.append(group);publish();
 return {group,setStage,get mode(){return enabled?mode:'off';}};
}
