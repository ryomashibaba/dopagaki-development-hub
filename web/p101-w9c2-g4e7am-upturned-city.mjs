/**
 * G4E-7AM R2 — UPTURNED CITY / SKY BREACH (private art iteration).
 *
 * ART-FIRST, private manual A/D study on the actual AJ 11m B48 road.
 * Two gigantic asymmetric urban tectonic banks, real aperture voids,
 * non-rectangular swept shells and habitable outboard terraces. GPU only:
 * never a ghost road, additional CCD shape, B51 machine, HUD, or camera trick.
 */
const pal=Object.freeze({
 dark:[.025,.073,.137],bedrock:[.055,.16,.24],facet:[.12,.31,.39],
 deep:[.045,.105,.17],silver:[.30,.66,.76],ice:[.54,.91,.99],
 azure:[.10,.73,.81],amber:[.98,.53,.19],orchid:[.41,.33,.67]
});
const plus=(a,b)=>a.map((x,i)=>x+b[i]),minus=(a,b)=>a.map((x,i)=>x-b[i]);
const scale=(v,n)=>v.map(x=>x*n);
const dot=(a,b)=>a.reduce((t,x,i)=>t+x*b[i],0);
const unit=v=>scale(v,1/(Math.hypot(...v)||1));
const lerp=(a,b,t)=>plus(scale(a,1-t),scale(b,t));
const tri=(out,a,b,c,rgb)=>{for(const p of [a,b,c])out.push(...p,...rgb);};
const quad=(out,a,b,c,d,rgb)=>{tri(out,a,b,c,rgb);tri(out,a,c,d,rgb);};
const sheet=(out,a,b,c,d,rgb)=>{
 quad(out,a,b,c,d,rgb);quad(out,d,c,b,a,rgb.map(x=>x*.62));
};
const config=Object.freeze([
 Object.freeze({side:-1,start:.06,end:.87,n:30,levels:9,rise:650,
   baseOut:222,lean:320,drift:-170,crestOut:340}),
 Object.freeze({side:1,start:.13,end:.94,n:32,levels:9,rise:980,
   baseOut:255,lean:430,drift:200,crestOut:410})
]);
const empty=()=>({active:false,vertices:[],triangles:0,banks:0,
 negativeSpaceBays:0,macroSkyOpenings:0,terraces:0,citySpines:0,maxRiseMeters:0,
 minimumOutboardMeters:null,physicalChanges:false,extraRoads:0,
 extraMachines:0,certifiedSlope2Meters:0,publish:'HOLD'});
function roadFrame(road,sample,u,side){
 const center=sample(road,u,.5),edge=sample(road,u,side<0?0:1);
 const p=sample(road,Math.max(0,u-.004),.5),q=sample(road,Math.min(1,u+.004),.5);
 const tangent=unit([q[0]-p[0],0,q[2]-p[2]]);
 const e=minus(edge,center),out=unit(minus([e[0],0,e[2]],scale(tangent,dot(tangent,[e[0],0,e[2]]))));
 if(dot(out,e)<0||Math.hypot(...out)<.75)throw Error('AM degenerate true-road outboard frame');
 return {edge,tangent,out};
}
const point=(f,c,u,h,extra=0)=>{
 const folded=Math.sin((u*2.6+c.side*.17)*Math.PI)*25*h;
 const outward=c.baseOut+c.lean*Math.pow(h,1.65)+
   c.crestOut*.31*h*h*Math.sin(Math.PI*u)+extra+folded;
 const sweep=c.drift*h*h+30*Math.sin(u*11+c.side)*h;
 const rise=-48+c.rise*h*(.76+.24*Math.sin(Math.PI*u*.83+c.side*.12));
 return plus(plus(plus(f.edge,scale(f.out,outward)),scale(f.tangent,sweep)),[0,rise,0]);
};
export function g4e7amUpturnedCity(doc,sample,{enabled=false}={}){
 if(!enabled)return empty();
 const aj=doc?.stageForge?.g4e7ajStudy,ah=doc?.stageForge?.g4e7ahStudy;
 if(aj?.id!=='reanchor'||!['true-pinch','pinch-switch'].includes(aj.road)||
  aj.originalMovingObjects!==28||aj.unchangedMovingObjects!==26||
  !ah?.realMissingLongitudinalCell52||ah.widthMinMeters<10||ah.widthMinMeters>13.5||
  doc.stageForge.productionPromoted!==false||aj.certifiedSlope2Meters!==0||
  aj.publish!=='HOLD'||doc.surfaces.length!==7||doc.movingObstacles.length!==28||
  doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52')
  throw Error('AM only for actual private AJ narrow B48 with original 28 moving hazards');
 if(typeof sample!=='function')throw Error('AM requires native B48 sampler');
 const signature=JSON.stringify(doc),road=doc.surfaces[0],vertices=[];
 let negativeSpaceBays=0,macroSkyOpenings=0,terraces=0,citySpines=0,maxRise=0;
 // Connected MASSING: two different elevations and nonlinear bending,
 // rather than 8 identical portals or repetitive skyscraper boxes.
 for(const cfg of config){
  const frames=[],surface=[],rear=[];
  for(let i=0;i<=cfg.n;i++){
   const u=cfg.start+(cfg.end-cfg.start)*i/cfg.n,f=roadFrame(road,sample,u,cfg.side);
   frames.push(f);surface.push([]);rear.push([]);
   for(let k=0;k<=cfg.levels;k++){
    const h=k/cfg.levels,front=point(f,cfg,u,h);
    const depth=30+42*h*h;
    surface[i].push(front);
    rear[i].push(plus(plus(front,scale(f.out,depth)),[0,-12-22*h,0]));
    maxRise=Math.max(maxRise,front[1]-f.edge[1]);
   }
  }
  // Each dark aperture is actual missing triangles, not a black rectangle.
  for(let i=0;i<cfg.n;i++)for(let k=0;k<cfg.levels;k++){
   // R1 rendered as an opaque canyon despite huge nominal height.
   // R2 *removes complete skyline columns* to leave continuous views of sky,
   // rather than hiding small dark windows inside a 900m flat vertical sheet.
   // Macro openings are deliberately out of phase between both banks.
   const breach=cfg.side<0?(i>=7&&i<=13)||(i>=22&&i<=25):
     (i>=9&&i<=14)||(i>=24&&i<=28);
   const aperture=(breach&&k>=1)||
      (i>=2&&i<=5&&k>=3&&k<=6)||
      (i>=16&&i<=19&&k>=5&&k<=7)||
      (cfg.side>0&&i>=18&&i<=21&&k>=2&&k<=5);
   if(aperture){negativeSpaceBays++;if(breach&&k>=1)macroSkyOpenings++;continue;}
   const a=surface[i][k],b=surface[i+1][k],c=surface[i+1][k+1],d=surface[i][k+1],
    A=rear[i][k],B=rear[i+1][k],C=rear[i+1][k+1],D=rear[i][k+1];
   const color=k<2?pal.bedrock:k>6?(cfg.side>0?pal.orchid:pal.facet):
       (i+k)%6===0?pal.facet:pal.dark;
   sheet(vertices,a,b,c,d,color);
   sheet(vertices,D,C,B,A,pal.deep);
   if(k===0||k===cfg.levels-1)quad(vertices,a,A,B,b,pal.facet);
   if(k===2||k===6){
    // True accent ridges follow distorted tectonic strata.
    sheet(vertices,lerp(a,d,.02),lerp(b,c,.02),
     lerp(b,c,.065),lerp(a,d,.065),(i%7===0?pal.amber:pal.azure));
   }
  }
  // Massive cantilevered urban terraces at materially different altitudes,
  // attached only to the OUTBOARD side of the continuous continental shell.
  for(const [index,level] of [2,4,6,8].entries()){
   const start=2+index*6,end=Math.min(cfg.n-2,start+5),lift=14+index*5;
   for(let i=start;i<end;i++){
    // Detached cantilever terraces may remain visible at macro breach edges;
    // geometry is isolated >200m beyond the actual road shoulder.
    const a=surface[i][level],b=surface[i+1][level],
      oa=plus(plus(a,scale(frames[i].out,75+index*13)),[0,lift,0]),
      ob=plus(plus(b,scale(frames[i+1].out,75+index*13)),[0,lift+4,0]),
      c=plus(ob,[0,-14,0]),d=plus(oa,[0,-14,0]);
    sheet(vertices,a,b,ob,oa,index%2?pal.facet:pal.bedrock);
    quad(vertices,oa,ob,c,d,pal.deep);
    if(i%2===start%2){
     const top=plus(lerp(oa,ob,.5),[0,15+index*5,0]);
     tri(vertices,oa,ob,top,index%2?pal.ice:pal.amber);
    }
   }
   terraces++;
  }
  // Large jagged skyline fins, genuinely swept and attached to the shell:
  // asymmetric intervals and spires rather than an interchangeable skyline.
  for(const i of cfg.side<0?[3,14,26]:[4,17,29]){
   const k=cfg.levels-1, a=surface[i][k],b=surface[i+1][k],
     tip=plus(lerp(a,b,.36),plus(scale(frames[i].out,52+10*(i%3)),[0,95+(i%4)*31,0]));
   sheet(vertices,a,b,tip,plus(a,scale(frames[i].out,14)),i%2?pal.silver:pal.facet);
   citySpines++;
  }
 }
 if(vertices.length%18!==0||vertices.length/18<1000||vertices.length/18>18000||
   !vertices.every(Number.isFinite)||negativeSpaceBays<210||macroSkyOpenings<150||terraces!==8||
   citySpines!==6||maxRise<650||JSON.stringify(doc)!==signature)
  throw Error('AM huge urban continent or original physical stage integrity rejected');
 return {active:true,vertices,triangles:vertices.length/18,
  banks:2,negativeSpaceBays,macroSkyOpenings,terraces,citySpines,
  maxRiseMeters:Number(maxRise.toFixed(2)),minimumOutboardMeters:Math.min(...config.map(x=>x.baseOut)),
  physicalChanges:false,extraRoads:0,extraMachines:0,certifiedSlope2Meters:0,publish:'HOLD'};
}
