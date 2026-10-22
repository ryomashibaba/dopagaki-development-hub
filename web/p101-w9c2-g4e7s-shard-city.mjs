/**
 * G4E-7S private architectural prototype: SPLIT SHARD CITY.
 * Huge asymmetric, pierced, twisting external cliffs. NOT box spam, road,
 * collider, machine, HUD navigation, speed or camera adjustment.
 * Strictly GPU geometry tied to the genuine G4E-7R-CUT B48 skin.
 */
export const G4E7S_MONUMENTS=Object.freeze([
 Object.freeze({u:.615,side:-1,height:165,offset:92,lean:36,turn:-12}),
 Object.freeze({u:.68,side:1,height:255,offset:100,lean:51,turn:17}),
 Object.freeze({u:.747,side:-1,height:342,offset:116,lean:76,turn:-23}),
 Object.freeze({u:.805,side:1,height:224,offset:102,lean:62,turn:14}),
 Object.freeze({u:.872,side:-1,height:279,offset:125,lean:58,turn:-18}),
 Object.freeze({u:.934,side:1,height:365,offset:140,lean:89,turn:25})
]);
const col=Object.freeze({
 abyss:[.055,.13,.20],metal:[.12,.27,.34],edge:[.31,.73,.82],
 deep:[.075,.18,.28],signal:[.88,.58,.32],ice:[.42,.77,.9]
});
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]);
const scale=(a,k)=>a.map(x=>x*k),length=a=>Math.hypot(...a),
 unit=a=>scale(a,1/(length(a)||1));
const lerp=(a,b,t)=>add(scale(a,1-t),scale(b,t));
const tri=(out,a,b,c,rgb)=>{for(const p of [a,b,c])out.push(...p,...rgb);};
const panel=(out,a,b,c,d,rgb)=>{tri(out,a,b,c,rgb);tri(out,a,c,d,rgb);
 const shaded=rgb.map(x=>x*.68);tri(out,c,b,a,shaded);tri(out,d,c,a,shaded);};
function actualFrame(s,u,side,sample){
 const center=sample(s,u,.5),edge=sample(s,u,side<0?0:1),
  prev=sample(s,Math.max(0,u-.006),.5),next=sample(s,Math.min(1,u+.006),.5),
  tangent=unit([next[0]-prev[0],0,next[2]-prev[2]]),
  difference=sub(edge,center);
 // Remove forward component, guaranteeing an outboard offset per side.
 const scalar=difference[0]*tangent[0]+difference[2]*tangent[2];
 const away=unit([difference[0]-tangent[0]*scalar,0,difference[2]-tangent[2]*scalar]);
 if(length(away)<.5)throw Error('G4E-7S actual B48 outboard frame degenerate');
 return {edge,away,tangent};
}
function bladeStations(road,config,sample){
 const f=actualFrame(road,config.u,config.side,sample),stations=[];
 for(let i=0;i<=8;i++){
  const t=i/8,curve=Math.sin(t*Math.PI),height=config.height*t;
  const shift=config.offset+config.lean*(t*t)+18*Math.sin(t*Math.PI*1.4);
  const sweep=config.turn*t+9*Math.sin(t*Math.PI*2.3);
  const center=add(add(add(f.edge,scale(f.away,shift)),scale(f.tangent,sweep)),[0,height,0]);
  const broad=28*(1-t)**.5+5.5;
  const thick=7.5*(1-t)+1.8;
  const across=scale(f.tangent,broad),depth=scale(f.away,thick);
  stations.push({
   p:[add(add(center,across),depth),add(sub(center,across),depth),
    sub(sub(center,across),depth),sub(add(center,across),depth)],
   center
  });
 }
 return stations;
}
export function g4e7sAllowed(doc){
 return doc?.stageForge?.recordStageId==='VB-P101-A13-W9C2-G4E7R-CUT'&&
  doc.stageForge?.g4e7rStudy?.variant==='cut'&&
  doc.stageForge?.g4e7rStudy?.source==='ISOLATED_G4E7F_GLIDE_CLONE'&&
  doc.stageForge?.productionPromoted===false&&
  doc.stageForge?.g4e7rStudy?.officialSlope2Meters===0&&
  doc.surfaces?.length===7&&doc.movingObstacles?.length===28;
}
export function g4e7sShardCity(doc,sample,{enabled=false}={}){
 const empty={active:false,vertices:[],triangles:0,spires:0,voidWindows:0,
  outboardMinimumMeters:0,maximumHeightMeters:0,nonCollision:true,
  extraRoads:0,extraBridges:0,extraMachines:0,officialSlope2Meters:0};
 if(!enabled||!g4e7sAllowed(doc))return empty;
 if(typeof sample!=='function'||doc.surfaces.some(x=>x.rows!==31||x.cols!==5))
  throw Error('G4E-7S requires exact real B48 31x5 sampler');
 const signature=JSON.stringify(doc),road=doc.surfaces[0],vertices=[],monuments=[];
 let voidWindows=0,panels=0;
 for(const config of G4E7S_MONUMENTS){
  const station=bladeStations(road,config,sample);
  monuments.push(station);
  for(let k=0;k<8;k++){
   const a=station[k].p,b=station[k+1].p;
   // Structural cut-out at the center: it is sky, not a fake dark rectangle.
   const open=k===3||k===4;
   if(open){voidWindows++;continue;}
   panel(vertices,a[0],a[1],b[1],b[0],k%3===0?col.metal:col.abyss);
   panel(vertices,a[1],a[2],b[2],b[1],col.deep);
   panel(vertices,a[2],a[3],b[3],b[2],col.metal);
   panel(vertices,a[3],a[0],b[0],b[3],col.abyss);
   panels+=4;
   // Staggered cold edge band makes the pierce and taper readable at speed.
   if(k%2===0){
    const v0=lerp(a[0],b[0],.1),v1=lerp(a[0],b[0],.85);
    const w0=lerp(a[1],b[1],.1),w1=lerp(a[1],b[1],.85);
    panel(vertices,v0,w0,w1,v1,k%4===0?col.ice:col.edge);
   }
  }
  // Transverse ribs across the detached middle ring, not across the road.
  for(const index of [2,5,7]){
   const p=station[index].p;
   panel(vertices,p[0],p[1],p[2],p[3],index===5?col.signal:col.deep);
  }
 }
 // Unequal neighboring spires are linked by slender tilted *exterior* ribs,
 // which leave real air holes and never extend into the drivable corridor.
 for(let i=0;i<monuments.length-2;i+=2){
  const a=monuments[i][7].p,b=monuments[i+2][5].p;
  panel(vertices,a[0],b[0],b[1],a[1],col.deep);
  panel(vertices,a[3],a[0],b[0],b[3],col.metal);
 }
 if(vertices.length<6000||vertices.length>110000||vertices.length%18!==0||
  !vertices.every(Number.isFinite)||voidWindows<12||panels<100)
  throw Error('G4E-7S geometric skyline quality/budget guard');
 if(JSON.stringify(doc)!==signature)throw Error('G4E-7S mutated actual physics stage');
 return {active:true,vertices,triangles:vertices.length/18,spires:G4E7S_MONUMENTS.length,
  voidWindows,panels,outboardMinimumMeters:Math.min(...G4E7S_MONUMENTS.map(m=>m.offset)),
  maximumHeightMeters:Math.max(...G4E7S_MONUMENTS.map(m=>m.height)),
  nonCollision:true,extraRoads:0,extraBridges:0,extraMachines:0,
  officialSlope2Meters:0};
}
