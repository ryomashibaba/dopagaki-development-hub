/** R2F5-G camera-first geometry-only research: NO ART or safety certificate.
 * Source camera: original A1 240Hz tick1921, both 14/28m widths.
 * Centre: actual R2F5-F Blender report from Actions #41294304510 / Artifact #13078872759.
 * Uses neither Blender nor WebGL; avoids repeating the expensive full historical CI.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const blob='af076d67492a677d2235e4730aef8cdf4808e106';
const source=JSON.parse(fs.readFileSync(path.join(root,'docs/R19_A6P3_PRIOR_A1_ORIGINAL_12_TRUE_CAMERAS.json')));
assert.equal(source.origin.originalGitBlob,blob);
assert.equal(source.origin.sourceCanvasWidth,1013);
assert.equal(source.origin.sourceCanvasHeight,698);
const centre=[-656.3844604492188,119.39430236816406,-1017.1207885742188];
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]);
const mul=(a,k)=>a.map(x=>x*k),dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>{const d=Math.hypot(...a);assert(d>1e-8);return mul(a,1/d)};
const cameras=['ultra','control'].map(mode=>{
 const f=source.frames.find(x=>x.mode===mode&&x.tick===1921);
 assert(f);assert.deepEqual(f.viewport,[1013,698]);return f;
});
const toward=norm([cameras[0].eye[0]-centre[0],0,cameras[0].eye[2]-centre[2]]);
const side=norm(cross([0,1,0],toward));
const world=(x,y,z)=>add(centre,add(mul(side,x),add(mul(toward,y),[0,z,0])));
function projection(cam,xyz){
 const front=norm(cam.front),right=norm(cross(front,[0,1,0])),up=norm(cross(right,front));
 const d=sub(xyz,cam.eye),depth=dot(d,front);
 if(depth<=.66)return null;
 return {x:1013*(1+1.35*dot(d,right)/(1013/698)/depth)/2,
  y:698*(1-1.35*dot(d,up)/depth)/2,depth};
}
const limits=pts=>pts.some(x=>!x)?null:[
 Math.min(...pts.map(x=>x.x)),Math.max(...pts.map(x=>x.x)),
 Math.min(...pts.map(x=>x.y)),Math.max(...pts.map(x=>x.y))];
const rect=(cam,s)=>{
 const [x,y,z]=s.p,[w,d,h]=s.s;
 return limits([-1,1].flatMap(a=>[-1,1].flatMap(b=>[-1,1].map(c=>
  projection(cam,world(x+a*w/2,y+b*d/2,z+c*h/2))))));
};
const proposals=[
 {id:'G0_F_ENVELOPE_NEGATIVE_CONTROL',items:[
  {n:'ground',type:'ground',p:[0,0,0],s:[50,36,3]},
  {n:'front_wall',type:'solid',p:[0,7,9],s:[48,10,14]},
  {n:'transfer',type:'transfer',p:[0,-15,12],s:[40,6,2]}],
  gate:[-7.8,13,1.9,15.6,12.5],features:{market:[-17,11,5],transit:[17,11,5],passage:[0,-11,5]}},
 {id:'G1_DEEP_POROUS_STATION',items:[
  {n:'ground',type:'ground',p:[0,0,0],s:[49,35,3]},
  {n:'market',type:'market',p:[-17.3,-4,8],s:[12.5,25,12]},
  {n:'transit',type:'transit',p:[17.6,-7,7.8],s:[11,22,11.5]},
  {n:'back_wall',type:'transfer',p:[0,-15.4,7],s:[31,6,8]},
  {n:'side_canopy',type:'roof',p:[17,9,15],s:[15,9,1.7]},
  {n:'upper_gallery',type:'gallery',p:[0,-14,15.2],s:[25,6,2.2]},
  {n:'market_stall',type:'stall',p:[-12,12,5],s:[6,4,4]},
  {n:'ticket_gate',type:'ticket',p:[11,12,5],s:[6,4,4]}],
  gate:[-8,13,1.9,16,12.7],features:{market:[-15.5,12,5],transit:[15.5,12,5],passage:[0,-10,4]}},
 {id:'G2_SUNKEN_COURT_AND_TRANSFER',items:[
  {n:'single_ground',type:'ground',p:[0,0,0],s:[49,35,3]},
  {n:'west_market',type:'market',p:[-17.5,-7.4,8.5],s:[12.8,24,12.5]},
  {n:'east_transit',type:'transit',p:[16.2,-8.5,7.5],s:[13,21,10]},
  {n:'offset_market_roof',type:'roof',p:[-13.2,4,16.7],s:[14,14,2]},
  // Shift rear exchange to the right, leaving source camera's central sightline clear.
  {n:'rear_exchange',type:'transfer',p:[16.3,-19,8.3],s:[17,8,10]},
  {n:'open_back_walkway',type:'gallery',p:[0,-12,3.2],s:[17,12,1.2]},
  {n:'front_market',type:'stall',p:[-14,12.5,5.4],s:[7,5,4.2]},
  {n:'ticket_concourse',type:'ticket',p:[10.8,12,4.8],s:[8,4.2,3.6]}],
  gate:[-7.8,13.2,2,15.6,12.2],
  features:{market:[-15,12.5,5.4],transit:[12,12,4.8],passage:[0,-11.7,4]}}
];
const common=[];
for(const trial of proposals){
 const modes=[];
 for(const cam of cameras){
  const boxes=trial.items.map(item=>({tag:item.n,type:item.type,box:rect(cam,item)}));
  assert(boxes.every(x=>x.box));
  const all=boxes.flatMap(v=>[{x:v.box[0],y:v.box[2]},{x:v.box[1],y:v.box[3]}]);
  const whole=limits(all);
  const [x,y,z,w,h]=trial.gate;
  const opening=limits([world(x,y,z),world(x+w,y,z),world(x+w,y,z+h),world(x,y,z+h)].map(p=>projection(cam,p)));
  const points=Object.fromEntries(Object.entries(trial.features).map(([k,v])=>[k,projection(cam,world(...v))]));
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  const programSeparation=Math.min(distance(points.market,points.transit),
   distance(points.market,points.passage),distance(points.transit,points.passage));
  const shift=distance(points.passage,{x:(opening[0]+opening[1])/2,y:(opening[2]+opening[3])/2});
  const covered=b=>{
   const dx=Math.max(0,Math.min(b[1],opening[1])-Math.max(b[0],opening[0]));
   const dy=Math.max(0,Math.min(b[3],opening[3])-Math.max(b[2],opening[2]));
   return dx*dy/((opening[1]-opening[0])*(opening[3]-opening[2]));
  };
  // 2D rectangle overlap is a pessimistic solid-backing proxy, not real ray occlusion.
  const backing=Math.max(0,...boxes.filter(x=>['solid','transfer'].includes(x.type)).map(x=>covered(x.box)));
  const checks={
   inFrame:whole[0]>=35&&whole[1]<=978&&whole[2]>=35&&whole[3]<=663,
   usefulScale:whole[1]-whole[0]>=155&&whole[3]-whole[2]>=65,
   openingSize:opening[1]-opening[0]>=25&&opening[3]-opening[2]>=18,
   functionSeparation:programSeparation>=17,
   observableFrontToRearShift:shift>=7,
   rejectGarageWallBacking:backing<=.35,
   doesNotEnterSourceRoadCentralROI:whole[1]<355};
  const round=a=>a.map(x=>+x.toFixed(2));
  modes.push({mode:cam.mode,originalCameraTick:1921,trialBoxPx:round(whole),
   openingBoxPx:round(opening),openingWidthPx:+(opening[1]-opening[0]).toFixed(2),
   openingHeightPx:+(opening[3]-opening[2]).toFixed(2),
   backingOverlapProxy:+backing.toFixed(3),functionSeparationPx:+programSeparation.toFixed(2),
   frontRearDepthShiftPx:+shift.toFixed(2),checks,passed:Object.values(checks).every(Boolean),
   shapeProjectionRects:boxes.map(x=>({tag:x.tag,type:x.type,box:round(x.box)})),
   keyPoints:points});
 }
 common.push({id:trial.id,passedBothModes:modes.every(m=>m.passed),modes});
}
const eligible=common.filter(x=>x.id!=='G0_F_ENVELOPE_NEGATIVE_CONTROL'&&x.passedBothModes);
const selected=eligible.sort((a,b)=>Math.min(...b.modes.map(v=>v.openingWidthPx))-Math.min(...a.modes.map(v=>v.openingWidthPx)))[0];
const report={
 schema:'dopagaki.r2f5g-true-source-camera-projection-only-v1',
 sourceGitBlob:blob,sourceR2F5FRun:41294304510,sourceR2F5FArtifact:13078872759,
 sourceR2F5FWorldCentreXYZ:centre,sourcePlacement:{road1U:.125,offsetFromLeftRoadEdgeM:45},
 sourceNativeCameraTick:1921,projectionSource:'Archived A1 source camera + original B Blender projection formula',
 usedRealNativeWebGL2:false,usedOriginalGameRuntime:false,actualPixelMask:false,
 BlenderCreated:false,GLBCreated:false,trueVisibleInteriors:false,
 verifiedB48B51Contact:false,verifiedHumanPaths:false,
 heuristicThresholdsNotArchitecturalCertification:true,
 candidates:common,preselectedGeometryOnly:selected?.id??null,
 ART:'HOLD',HUMAN:'HOLD',GAMEPLAY:'HOLD',PERFORMANCE:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',
 next:'Only if source-camera sketch is worthwhile, build one isolated Native Blender candidate and compare true 8s images in 14m+28m.'
};
assert.equal(common.length,3);assert.equal(common[0].passedBothModes,false);
assert.equal(report.preselectedGeometryOnly,'G2_SUNKEN_COURT_AND_TRANSFER','Fail closed instead of inventing valid geometry');
const out=path.join(root,'r19-evidence/r19a6p4r2f5g');
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'R2F5G_ORIGINAL_A1_CAMERA_PROJECTION_RESEARCH_ONLY.json'),JSON.stringify(report,null,2)+'\n');
console.log('R2F5G_GEOMETRY_ONLY',JSON.stringify({selected:report.preselectedGeometryOnly,
 result:common.map(c=>({id:c.id,pass:c.passedBothModes,
 modes:c.modes.map(m=>({mode:m.mode,portalWidth:m.openingWidthPx,portalHeight:m.openingHeightPx,backing:m.backingOverlapProxy,checks:m.checks}))})),
 ART:'HOLD',trueRenderer:'NOT_RUN'}));
