/**
 * R19 A3R — RIFT CIVIC BASILICA — same ONE rejected idea, redesigned in
 * original two-road space.  NOT a second candidate. Original A3 stays in Git.
 *
 * Original game at 0..12s: Road0 narrowing near u .52 and Road1 via t8/t11.
 * Schematic: porous master arch at Road1 .22, Road0 forecourt quarters
 * transitioning to Road1 waterfront programme, never the previous massive
 * facade wall/flat slab. Render from source B48 positions, not invented paths.
 *
 * TRUE 3D mesh only, no B48/B51 collision, road, steering, camera or speed edits.
 */
const C=Object.freeze({deep:[.09,.16,.23],steel:[.15,.31,.39],
 sea:[.20,.46,.52],glass:[.27,.54,.60],pale:[.44,.64,.69],
 ivory:[.51,.67,.71],signal:[.68,.55,.35],shadow:[.08,.22,.27]});
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const mul=(a,k)=>a.map(v=>v*k);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const len=a=>Math.hypot(...a);
const unit=a=>mul(a,1/(len(a)||1));
const dot=(a,b)=>a.reduce((t,v,i)=>t+v*b[i],0);
function assertScene(condition,msg){if(!condition)throw Error('R19 A3R '+msg);}
function tri(o,a,b,c,col){o.push(...a,...col,...b,...col,...c,...col);}
function quad(o,a,b,c,d,col){
 tri(o,a,b,c,col);tri(o,a,c,d,col);
 tri(o,d,c,b,col.map(x=>x*.74));tri(o,d,b,a,col.map(x=>x*.74));
}
function beam(o,a,b,w,d,col){
 const v=sub(b,a);assertScene(len(v)>.05,'zero length 3D beam');
 const axis=unit(v);
 const basis=unit(cross(axis,Math.abs(axis[1])>.94?[0,0,1]:[0,1,0]));
 const up=unit(cross(basis,axis));
 const corner=(p,x,y)=>add(p,add(mul(basis,x*w/2),mul(up,y*d/2)));
 const p=[corner(a,-1,-1),corner(a,1,-1),corner(a,1,1),corner(a,-1,1)];
 const q=[corner(b,-1,-1),corner(b,1,-1),corner(b,1,1),corner(b,-1,1)];
 for(let i=0;i<4;i++){let j=(i+1)%4;quad(o,p[i],p[j],q[j],q[i],col);}
 quad(o,p[3],p[2],p[1],p[0],col);
 quad(o,q[0],q[1],q[2],q[3],col);
}
function frame(road,u,side,sample){
 const center=sample(road,u,.5);
 const edge=sample(road,u,side===1?1:0);
 const p=sample(road,Math.max(0,u-.003),.5),q=sample(road,Math.min(1,u+.003),.5);
 const forward=unit([q[0]-p[0],0,q[2]-p[2]]);
 let outward=sub(edge,center);outward[1]=0;
 outward=unit(sub(outward,mul(forward,dot(outward,forward))));
 assertScene(len(forward)>.95&&len(outward)>.95,'source road frame invalid');
 assertScene(dot(outward,sub(edge,center))>0,'not really outboard');
 return {edge,center,forward,outward,roadId:road.id,station:u,side};
}
function point(f,along,out,height){
 return add(f.edge,add(mul(f.forward,along),add(mul(f.outward,out),[0,height,0])));
}
// Hollow landmark on the OUTSIDE of road1, not an overhead fake tunnel.
// Grand open public arch is visible from outside, made of structural beams
// spaced widely enough that the dark centre stays genuinely transparent.
function oneHollowCivicLandmark(o,f,st){
 const n=46, ribCount=4, ribs=[];
 for(let k=0;k<ribCount;k++){
  const curve=[];
  for(let i=0;i<=n;i++){
   const t=i/n,a=Math.PI*t;
   const along=-(65+7*k)+(130+14*k)*t;
   const out=90+15*k+9*Math.sin(a)+12*Math.sin(2*a);
   const h=8+(155-13*k)*Math.sin(a)+4*Math.sin(3*a);
   curve.push(point(f,along,out,h));
  }
  ribs.push(curve);
  for(let i=0;i<n;i++)beam(o,curve[i],curve[i+1],
   k===0?5.2:k===ribCount-1?3.2:4.4,
   k===0?6.1:4.3,k===0?C.steel:k===3?C.pale:C.sea);
 }
 // Structural diagonals between curved open skeletons, never solid facades.
 for(const t of [3,10,17,25,33,41]){
  for(let k=0;k<ribCount-1;k++){
   beam(o,ribs[k][t],ribs[k+1][Math.min(n,t+2)],2.3,3.0,
    t%2?C.glass:C.shadow);
   st.openRibTies++;
  }
 }
 // Two genuinely grounded pier clusters; gap between them is walkable-looking
 // architectural empty space but NEVER a player collider.
 for(const i of [0,n])for(const k of [0,ribCount-1]){
  const base=ribs[k][i],foot=[base[0],base[1]-23,base[2]];
  beam(o,foot,base,5.4,6.5,C.steel);st.sourceEdgePiers++;
 }
 // Non-opaque suspended interior observation gallery. Not a giant shelf:
 // only delicate 4m-8m vertical trusses, with visible gaps.
 for(let j=0;j<6;j++){
  const u=8+j*6,from=ribs[1][u],to=ribs[2][u];
  beam(o,from,to,2.1,2.5,j%2?C.signal:C.glass);
 }
 st.heroBuildingCount=1;
 st.singleOpenAtrium=1;
 st.centralCourtOpen=true;
 st.trueEmptyBays=n*(ribCount-1);
 st.sourceFocalStation={road:1,u:f.station};
 st.heroRoadEdgeClearanceLowerBoundM=70;
 st.minNominalArtDistanceFromSampledEdgeM=70;
}
// Four programmes along ACTUAL two-road physical corridor. Individual unique
// vertical sections, not identical rectangle boxes or plate buildings.
function quarter(o,f,kind,variant,st){
 const profiles=[
  {length:84,height:66,ribs:3,out:85,lean:16},
  {length:98,height:91,ribs:4,out:94,lean:-12},
  {length:106,height:112,ribs:5,out:102,lean:22},
  {length:121,height:130,ribs:4,out:111,lean:-20}
 ];
 const p=profiles[variant],outline=[];
 for(let i=0;i<p.ribs;i++){
  const u=i/(p.ribs-1),along=(u-.5)*p.length;
  const lean=p.lean*Math.sin(Math.PI*u);
  const floor=point(f,along,p.out+lean,-18);
  const middle=point(f,along+lean*.14,p.out+8+lean,28+p.height*.35);
  const crown=point(f,along+lean*.36,p.out+14+lean,p.height);
  beam(o,floor,middle,3.6,4.6,C.steel);
  beam(o,middle,crown,2.8,3.4,variant%2?C.sea:C.pale);
  outline.push({floor,middle,crown});
  st.sourceEdgePiers++;
 }
 for(let i=0;i<outline.length-1;i++){
  // Bridging only at isolated upper points leaves long open views
  // between structures and prevents a giant horizontal platform.
  beam(o,outline[i].crown,outline[i+1].crown,2.6,3.3,
   i%2?C.glass:C.ivory);
  if(i%2===0)beam(o,outline[i].middle,outline[i+1].crown,
   2.0,2.3,C.shadow);
 }
 // Public movement hierarchy: a tiny suspended illuminated trim / entry,
 // not an opaque decorative floor, never spanning the physical road.
 const x=point(f,0,p.out+12,3);
 beam(o,add(x,mul(f.forward,-8)),add(x,mul(f.forward,8)),2.0,2.1,C.signal);
 st.supportingProgrammes.push(kind);
 st.publicCourtyards++;
 st.trueEmptyBays+=2;
}
export function buildR19A3IntegratedCivicCity(stage,sample,{enabled=false}={}){
 const empty={active:false,vertices:[],triangles:0,colliders:0,ART:'HOLD'};
 const id=stage?.stageForge?.recordStageId;
 if(!enabled||!new Set(['VB-P101-A13-W9C1-CONTROL','VB-P101-A13-W9C1-ULTRA']).has(id))return empty;
 assertScene(stage?.surfaces?.length===7&&stage?.movingObstacles?.length===28&&
  stage.surfaces.every(s=>s.collidable&&s.rideable&&s.rows===31&&s.cols===5)&&
  typeof sample==='function','source physical B48/28B51 changed');
 const before=JSON.stringify(stage);
 const o=[],st={heroBuildingCount:0,singleOpenAtrium:0,trueEmptyBays:0,
  publicCourtyards:0,sourceEdgePiers:0,openRibTies:0,supportingProgrammes:[],
  cityCoversSourceRoadSections:[0,1],
  sourceFocalStation:null,centralCourtOpen:false,
  minNominalArtDistanceFromSampledEdgeM:70,heroRoadEdgeClearanceLowerBoundM:70,
  ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',
  RELEASE:'HOLD',MERGE:'HOLD'};
 // Main landmark is *along road1* rather than the previous single
 // road0 station. 8 and 11.5 sec now have actual source street programmes.
 const hero=frame(stage.surfaces[1],.23,1,sample);
 oneHollowCivicLandmark(o,hero,st);
 const quarters=[
  {road:0,u:.29,side:-1,kind:'arrival exhibition gardens'},
  {road:0,u:.72,side:1,kind:'narrow-road open station'},
  {road:1,u:.43,side:-1,kind:'public market with river court'},
  {road:1,u:.78,side:1,kind:'civic housing and observation campus'}
 ];
 for(const [i,p] of quarters.entries()){
  quarter(o,frame(stage.surfaces[p.road],p.u,p.side,sample),
   p.kind,i,st);
 }
 assertScene(JSON.stringify(stage)===before,'original B48/B51 mutated');
 assertScene(st.heroBuildingCount===1&&st.singleOpenAtrium===1&&
  st.publicCourtyards===4&&st.trueEmptyBays>=6&&
  st.cityCoversSourceRoadSections.length===2,'not one complete two-road spatial district');
 assertScene(o.length%18===0&&o.length/18>2000&&o.length/18<25000&&
  o.every(Number.isFinite),'invalid source 3D mesh');
 return {active:true,vertices:o,triangles:o.length/18,colliders:0,
  noDriveableArt:true,originalB48:7,originalB51:28,
  mode:'ONE_CIVIC_BASILICA_REDESIGN_TWO_ROAD_CONTINUUM',
  sourceBasedNominalClearanceNotActualGlobalProof:true,...st};
}
