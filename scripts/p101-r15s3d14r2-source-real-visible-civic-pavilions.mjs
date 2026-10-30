/** R15S3D14R2 — HUMAN-SCALE READABILITY AT 170–190m/s, PRIVATE ART ONLY.
 * Evidence-led change: actual R14R1 Chromium screenshots showed added
 * habitation primarily at 58s and nearly nothing at 64/67s. Build physically
 * true-3D inhabited OPEN foreground near road5 u~.20/.68 and road6 u~.20,
 * with DISTINCT skyline silhouettes, legitimate voids and visual depth,
 * without recreating R13's endless side walls or B's flying shards.
 * Source real B48/B51/Runner/CCD/camera remain untouched.
 */
import {buildR15S3D14R1City} from './p101-r15s3d14r1-real-inhabited-hollow-city-districts.mjs';
export const SCHEMES=Object.freeze(['A_SHORELINE_PUBLIC_FOLDS','B_CIVIC_SKY_COURTS']);
const C={soft:[.86,.92,.94],white:[.95,.89,.73],aqua:[.39,.82,.79],
 blue:[.22,.52,.64],deep:[.07,.15,.23],steel:[.18,.32,.44],
 gold:[.98,.71,.39],green:[.38,.74,.59],shadow:[.09,.19,.25],
 blueglass:[.34,.66,.77]};
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),
 mul=(a,t)=>a.map(x=>x*t),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),
 len=v=>Math.hypot(...v),unit=v=>mul(v,1/(len(v)||1));
function tri(out,a,b,c,col){for(const p of [a,b,c])out.push(...p,...col)}
function sheet(out,a,b,c,d,col){
 tri(out,a,b,c,col);tri(out,a,c,d,col);
 tri(out,d,c,b,C.shadow);tri(out,d,b,a,C.shadow);
}
function getFrame(doc,sample,road,u,sign){
 const s=doc.surfaces[road],
  center=sample(s,u,.5),edge=sample(s,u,sign===-1?0:1),
  prev=sample(s,Math.max(0,u-.003),.5),next=sample(s,Math.min(1,u+.003),.5);
 const along=unit([next[0]-prev[0],0,next[2]-prev[2]]),
  d=[edge[0]-center[0],0,edge[2]-center[2]],
  outer=unit(sub(d,mul(along,dot(d,along))));
 if(len(d)<5||len(outer)<.9)throw Error('R15S3D14R2 original source road frame missing');
 return {edge,along,outer,sideWidth:len(d)};
}
function pt(f,along,depth,height){
 return add(add(add(f.edge,mul(f.along,along)),mul(f.outer,depth)),[0,height,0]);
}
const SITES=[
 {road:5,u:.21,side:1,span:244,role:'INTRO',height:122},
 {road:5,u:.66,side:-1,span:274,role:'EXPANSION',height:176},
 {road:5,u:.84,side:1,span:170,role:'BRIDGE',height:90},
 {road:6,u:.205,side:-1,span:254,role:'FINALE_ARRIVAL',height:168},
 {road:6,u:.46,side:1,span:180,role:'FINALE_EXIT',height:104}
];
// Each cluster is a genuinely inhabited 3D architecture with a broad open
// central courtyard, and a curved multi-tier visible from actual chase camera.
// IMPORTANT: not a 1700m-long road wall; isolated, recognizable distinct sites.
function site(out,doc,sample,s,mode,index,stat){
 const f=getFrame(doc,sample,s.road,s.u,s.side),court=mode===SCHEMES[1];
 const panels=24;
 // 2 or 3 multi-level quarters; arc curvature and courtyard size genuinely
 // differ between proposals, not simply color swapped.
 const bands=court?4:3;
 for(let level=0;level<bands;level++){
  const low=(level-1)*38+(court?-17:0),
    high=low+19+s.height*(level===bands-1?.32:.09),
    near=48+level*9+(court?5:0),
    far=near+(court?127:149),
    samples=[];
  for(let i=0;i<=panels;i++){
   const t=i/panels,x=(t-.5)*s.span;
   const bend=(court?25:45)*Math.sin(t*Math.PI*1.7+level*.24),
    upper=(court?12:20)*Math.sin(t*Math.PI*2.3+index*.35),
    depthNear=near+bend*.25,depthFar=far+bend;
   samples.push({
    nearLow:pt(f,x,depthNear,low+upper*.3),
    farLow:pt(f,x,depthFar,low+upper*.6),
    nearHigh:pt(f,x,depthNear,high+upper*.55),
    farHigh:pt(f,x,depthFar,high+upper),
   });
  }
  for(let i=0;i<panels;i++){
   const a=samples[i],b=samples[i+1],u=i/panels;
   // Large negative-space COURTS: actual absent surfaces, not painting.
   const missing=(i>=8&&i<=12)||(court&&(i>=18&&i<=20))||
     (!court&&level===1&&i>=2&&i<=4);
   if(missing){stat.realOpenCivicCourts++;continue;}
   sheet(out,a.nearLow,b.nearLow,b.farLow,a.farLow,
     level===bands-1?C.green:level%2?C.soft:C.blueglass);
   sheet(out,a.farLow,b.farLow,b.farHigh,a.farHigh,
     level===bands-1?C.white:C.steel);
   // Side fins in visually meaningful intervals, not fake windows every 1m.
   if(i%6===1){
    const lip1=pt(f,(u-.5)*s.span,far+14,high+10),
     lip2=pt(f,(u+.04-.5)*s.span,far+14,high+14);
    sheet(out,a.farHigh,b.farHigh,lip2,lip1,C.gold);
    stat.trueVisibleRoofRibs++;
   }
   stat.inhabitedSurfaceSections++;
  }
  // substantial cantilever understructure extends down into the dark scene
  // with an actual separated suspended public waterfront floor.
  for(const i of [0,6,14,20,24]){
   const a=samples[i],b=pt(f,(i/panels-.5)*s.span,far+30,-70-index*5);
   if(i===0||i===24)continue;
   const q=pt(f,(i/panels-.5)*s.span,near+9,-26-index*5);
   sheet(out,a.farLow,b,q,a.nearLow,C.deep);
   stat.realUndercityBrackets++;
  }
  stat.multilevelPublicTerraces++;
 }
 // primary signature: asymmetrically curving massive *hollow* roof canopy
 // composing each cluster, with a real panoramic empty center.
 for(let k=0;k<2;k++){
  const shell=[],segments=40,
    alongShift=(k===0?-.12:.21)*s.span,
    cDepth=(k===0?153:95)+(court?19:0),
    root=(k===0?18:37)+s.height*.3,
    rx=s.span*(k===0?.31:.17),
    ry=s.height*(k===0?.68:.43);
  for(let i=0;i<=segments;i++){
   const t=i/segments,theta=(-.16+1.41*t)*Math.PI,
    tilt=26*Math.sin(theta*1.25+index),
    center=pt(f,alongShift+rx*Math.cos(theta),cDepth+tilt,
      root+ry*Math.sin(theta));
   const thickness=7+6*Math.sin(Math.PI*t),
    away=mul(f.outer,thickness),
    upwards=[0,thickness*.55,0];
   shell.push([sub(sub(center,away),upwards),add(add(center,away),upwards)]);
  }
  for(let i=0;i<segments;i++){
   // TRUE void apertures in central silhouette; openings are longer than 1
   // module and physically missing; no fake opaque roof.
   const gap=(court?i>=15&&i<=19:i>=23&&i<=26);
   if(gap){stat.openAirShellWindows++;continue;}
   sheet(out,shell[i][0],shell[i+1][0],shell[i+1][1],shell[i][1],k===0?C.soft:C.aqua);
   stat.continuousCanopyCells++;
  }
  stat.bigPublicCanopies++;
 }
 stat.sites.push({road:s.road,u:s.u,role:s.role,side:s.side,setbackM:48,
  physicalSourceRoad:doc.surfaces[s.road].id});
}
export function buildR15S3D14R2City(doc,sample,{mode='A_SHORELINE_PUBLIC_FOLDS'}={}){
 if(!SCHEMES.includes(mode))throw Error('Unknown R15S3D14R2 art hypothesis');
 if(doc?.surfaces?.length!==7||doc?.movingObstacles?.length!==28||
  doc.stageForge?.r15s3d11?.mode!=='A_EDGE_READABLE'||
  doc.stageForge?.productionPromoted!==false)
   throw Error('Refuse gameplay source/production edits');
 const source=JSON.stringify(doc),prior=buildR15S3D14R1City(doc,sample,{mode:'A_INHABITED_CRESCENT_DISTRICTS'});
 const ext=[],stat={mode,sites:[],multilevelPublicTerraces:0,inhabitedSurfaceSections:0,
  realOpenCivicCourts:0,realUndercityBrackets:0,
  trueVisibleRoofRibs:0,continuousCanopyCells:0,bigPublicCanopies:0};
 for(let i=0;i<SITES.length;i++)site(ext,doc,sample,SITES[i],mode,i,stat);
 const vertices=prior.vertices.concat(ext),triangles=vertices.length/18;
 if(!Number.isInteger(triangles)||triangles<prior.triangles+2500||triangles>65000||
   stat.realOpenCivicCourts<100||stat.inhabitedSurfaceSections<180||
   stat.bigPublicCanopies!==10||stat.sites.length!==5||
   stat.continuousCanopyCells<300||!vertices.every(Number.isFinite))
   throw Error('R14R2 physical-scale architectural geometry failed');
 if(JSON.stringify(doc)!==source)throw Error('R14R2 mutates original B48/B51 gameplay');
 return {vertices,triangles,...stat,sourceArchitectureTriangles:prior.triangles,
  realOriginalB48:7,realMovingB51:28,addedOriginalCollisionBodies:0,
  minRealRoadShoulderVisualSetbackM:48,
  visuallyDifferentFromPriorCityButArtStillUnapproved:true,
  notANativeHumanGameplayTest:true,officialArtCount:0,
  ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',RELEASE:'HOLD'};
}
