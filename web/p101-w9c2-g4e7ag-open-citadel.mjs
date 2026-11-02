/**
 * G4E-7AG OPEN CITADEL — 5 open monumental crescent structures + suspended
 * urban islands. Independent visual direction: replaces opaque near walls,
 * not a recolor or extra HUD. GPU only. Never part of B48, B51, CCD.
 */
const plus=(a,b)=>a.map((v,i)=>v+b[i]);
const minus=(a,b)=>a.map((v,i)=>v-b[i]);
const scale=(a,m)=>a.map(v=>v*m);
const unit=a=>scale(a,1/(Math.hypot(...a)||1));
const tri=(v,a,b,c,color)=>{for(const p of [a,b,c])v.push(...p,...color);};
const quad=(v,a,b,c,d,color)=>{tri(v,a,b,c,color);tri(v,a,c,d,color);};
const palette={shade:[.043,.12,.23],metal:[.085,.29,.46],
  teal:[.22,.83,.84],ice:[.47,.92,.95],violet:[.48,.28,.72],
  magenta:[.75,.39,.82],gold:[.98,.60,.22]};
const landmarks=Object.freeze([
 Object.freeze({u:.17,side:-1,span:174,height:253,away:112,tilt:16}),
 Object.freeze({u:.32,side:1,span:155,height:215,away:131,tilt:-14}),
 Object.freeze({u:.49,side:-1,span:202,height:315,away:152,tilt:22}),
 Object.freeze({u:.69,side:1,span:172,height:286,away:107,tilt:18}),
 Object.freeze({u:.87,side:-1,span:148,height:240,away:134,tilt:-13})
]);
const blank=()=>({enabled:false,vertices:[],triangles:0,
  landmarks:0,openCenters:0,urbanIslands:0,lightRibs:0,
  minimumOutboardMeters:0,physicalChanges:false,addedRoads:0,
  addedCollision:0,certifiedSlope2Meters:0,publish:'HOLD'});
function basis(road,sample,u,side){
 const at=sample(road,u,.5),edge=sample(road,u,side<0?0:1);
 const before=sample(road,Math.max(0,u-.007),.5),after=sample(road,Math.min(1,u+.007),.5);
 const along=unit([after[0]-before[0],0,after[2]-before[2]]);
 const dir=minus(edge,at);
 const out=unit(minus([dir[0],0,dir[2]],scale(along,dir[0]*along[0]+dir[2]*along[2])));
 return {edge,along,out};
}
export function g4e7agOpenCitadel(doc,sample,{enabled=false}={}){
 if(!enabled)return blank();
 const study=doc?.stageForge?.g4e7acR2Study;
 if(study?.id!=='approach-arc'||study.source!=='AA_LANDING_SOFT_ALPHA070_UNCHANGED_CUT'||
    !study.originalLipLandingExact||study.publish!=='HOLD'||
    study.certifiedSlope2Meters!==0||doc.stageForge.productionPromoted!==false||
    doc.surfaces?.length!==7||doc.movingObstacles?.length!==28||
    doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52')
  throw Error('AG is only for frozen actual B48 approach-arc private research');
 const before=JSON.stringify(doc),road=doc.surfaces[0],v=[];
 let openCenters=0,urbanIslands=0,lightRibs=0;
 for(let k=0;k<landmarks.length;k++){
  const s=landmarks[k],{edge,along,out}=basis(road,sample,s.u,s.side);
  const pos=(t,height,outward=0)=>{
   const pivot=plus(edge,scale(out,s.away+outward+16*(1-t*t)));
   return plus(plus(pivot,scale(along,s.span*t*.5 + s.tilt*(1-t*t))),
    [0,height,0]);
  };
  // A massive OPEN crescent arc. The hole is a real geometric absence; do
  // not fill it with a near vertical curtain as in AE / AF.
  const bands=[[],[]],segments=30,baseHeight=-34;
  for(let i=0;i<=segments;i++){
   const t=-1+2*i/segments,arc=Math.pow(Math.max(0,1-t*t),.77),
    height=baseHeight+s.height*arc+(k%2?12:-8)*t;
   bands[0].push([pos(t,height,0),pos(t,height-18-7*arc,0)]);
   bands[1].push([pos(t,height,14+8*arc),pos(t,height-18-7*arc,14+8*arc)]);
  }
  for(let i=0;i<segments;i++){
   const a=bands[0][i],b=bands[0][i+1],
     c=bands[1][i],d=bands[1][i+1],
     bright=k%2===0?palette.teal:palette.magenta;
   quad(v,a[0],b[0],b[1],a[1],i%4===0?bright:palette.metal);
   quad(v,c[1],d[1],d[0],c[0],palette.shade);
   quad(v,a[0],c[0],d[0],b[0],palette.ice);
   quad(v,b[1],d[1],c[1],a[1],palette.shade);
   if(i%3===1){
    tri(v,a[0],b[0],plus(scale(plus(a[0],b[0]),.5),scale(out,9)),
      k%2===0?palette.gold:palette.ice);
    lightRibs++;
   }
  }
  openCenters++;
  // Independent cantilevered urban islands, at several heights, made from
  // tapering curved decklets. No suspended city floor crosses the real road.
  for(let layer=0;layer<3;layer++){
   const level=23+layer*35,mid=-.33+layer*.33+(k%2?.08:-.07),
    bandWidth=.22+(layer===1?.06:0),plate=[];
   for(let i=0;i<=12;i++){
    const t=mid-bandWidth/2+bandWidth*i/12,
      lift=level+11*Math.sin(Math.PI*i/12),
      edgeFront=pos(t,lift,s.span*.025+layer*7),
      edgeRear=pos(t,lift-10,s.span*.12+layer*10);
    plate.push([edgeFront,edgeRear]);
   }
   for(let i=0;i<12;i++){
    const a=plate[i],b=plate[i+1];
    quad(v,a[0],b[0],b[1],a[1],layer%2?palette.metal:palette.violet);
    const ridge=plus(scale(plus(a[0],b[0]),.5),[0,3,0]);
    if(i%2===0){tri(v,a[0],b[0],ridge,k%2?palette.gold:palette.ice);lightRibs++;}
   }
   urbanIslands++;
  }
  // Three exposed diagonal structural forks; open areas remain visible.
  for(let j=0;j<3;j++){
   const t=-.64+j*.64,foot=pos(t,-32,22),tip=pos(t*.56,118+j*32,20);
   const tangent=scale(along,3.4),width=scale(out,2.8);
   const a=plus(foot,tangent),b=minus(foot,tangent),
    c=plus(tip,tangent),d=minus(tip,tangent);
   quad(v,a,b,d,c,k%2?palette.violet:palette.shade);
   quad(v,plus(a,width),plus(b,width),plus(d,width),plus(c,width),palette.metal);
   tri(v,a,c,plus(scale(plus(a,c),.5),scale(out,7)),j===1?palette.gold:palette.teal);
   lightRibs++;
  }
 }
 if(!v.length||v.length%18!==0||v.length/18>10000||
    v.some(x=>!Number.isFinite(x))||openCenters!==5||
    urbanIslands!==15||lightRibs<85||
    landmarks.some(s=>s.away<85)||JSON.stringify(doc)!==before)
  throw Error('AG sculptural open-horizon geometry or stage immutability invalid');
 return {enabled:true,vertices:v,triangles:v.length/18,landmarks:landmarks.length,
   openCenters,urbanIslands,lightRibs,
   minimumOutboardMeters:Math.min(...landmarks.map(s=>s.away)),
   physicalChanges:false,addedRoads:0,addedCollision:0,
   certifiedSlope2Meters:0,publish:'HOLD'};
}
