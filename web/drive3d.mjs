import {sample,frame} from '../reference_only/director/surface.js';
import {compile} from '../reference_only/director/collision.js';
import {Runner,DT,RADIUS} from '../reference_only/director/physics.js';
import {movingObstaclePose,sphereBoxSeparation} from '../reference_only/director/moving/moving-obstacles.mjs';
import {fixtureTriangles} from '../reference_only/director/game-fixtures.js';
import {epicGeometry} from './p66-visual.mjs';
import {capturePose,resolveDisplayPose,createCameraState,advanceCamera,viewForPose,cameraYawErrorRadians} from './drive3d-camera.mjs';
import {stepFixedClock} from './drive3d-loop.mjs';
import {makeMachineMeshes,nearestMachineCue,obstacleBodyVertices} from './p73-machine-visual.mjs';
import {createNearMissTracker,stepNearMiss,nearMissDisplay} from './p74-nearmiss.mjs';
import {survivalScore,buildRunRecord,readBest,storeBest,scoreString} from './p75-survival.mjs';
import {createNativeDemoState,recordDemoMilestone,nativeDemoSteer,isDemoEligible} from './p78-demo.mjs';
import {PRACTICE_CHAPTERS,createPracticeSeek,advancePracticeSeek,practiceElapsed} from './p79-practice.mjs';
import {FLOW_CHAPTERS,flowLineVertices,flowProgressState} from './p80-trackflow.mjs';
import {locateRoadLateral,edgeRadarLabel} from './p81-edge-radar.mjs';
import {megastructureGeometry} from './p82-megastructure.mjs';
import {createRenderQuality,sampleRenderQuality,framebufferDimensions,renderScaleLabel} from './p83-render-quality.mjs';
import {roadShoulderLights,FOG_START_METERS,FOG_SPAN_METERS,FOG_MAX} from './p84-visibility.mjs';
import {makeEnergyBallVisual,energyBallFrame} from './p85-energyball.mjs';
import {createChapterSplits,observeChapterSplits,chapterTimerView,readChapterBest,storeChapterBest,splitSeconds} from './p86-chapter-splits.mjs';
import {validateGhost,referenceGhostAt,ghostEligible,ghostLatticeVertices} from './p87-ghost.mjs';
import {ghostGapView} from './p88-ghost-gap.mjs';
import {validateReferenceSectors,compareGhostSector,paceCaption} from './p89-ghost-sector-pace.mjs';
import {buildRacecard,racecardTotals,racecardDeltaText} from './p90-racecard.mjs';
import {approachBeaconVertices} from './p91-approach-beacons.mjs';
import {failurePracticeChapter} from './p92-failure-practice.mjs';
import {hazardRoadGateVertices,makeHazardRoadPlan,nextRoadHazardCue} from './p97-roadplay-gates.mjs';
import {p100RoadReadGeometry} from './p100-road-read.mjs';
import {p101Step,P101_DEFAULT,p101ReboundRecoveryState} from './p101-overdrive.mjs';
import {p101B5ForwardScale,createP101B5SurgeState,p101B5RecordStageId} from './p101-b5-forward.mjs';
import {p101A13ForwardScale,createA13SurgeState} from './p101-a13-forward.mjs';
import {a13MachineMegastructures} from './p101-a13-architecture.mjs';
import {a13W9HeroArchitecture} from './p101-a13-w9-architecture.mjs';
import {w9c1G5BSkyline} from './p101-w9c1-g5b-skyline.mjs';
import {a13MachineBodyVertices} from './p101-a13-machine-visual.mjs';
import {a13RacingRoadArt} from './p101-a13-road-art.mjs';
import {makeW9C1CueProfile,readW9C1Cue,w9c1ApproachMarks} from './p101-w9c1-approach-cue.mjs';
import {p101B5OpticalRoadGeometry} from './p101-b5-road-optic.mjs';
import {createB5ManualAudit,recordB5ManualSample,recordB5ManualFrame,observeW9C1ManualCue,finalizeB5ManualAudit,exportB5ManualAudit} from './p101-b5-manual-qa.mjs';

const $=id=>document.getElementById(id);
const assets={'VB-P101-A13':'P101_A13_W7_GAMEPLAY.json','VB-P101-A13-W9X-B1':'P101_A13_W9X_B1_TRIAL.json','VB-P101-A13-W9C1-CONTROL':'P101_A13_W9C1_CONTROL_TRIAL.json','VB-P101-A13-W9C1-ULTRA':'P101_A13_W9C1_ULTRA_TRIAL.json','VB-P101-B5':'P101_B5_HYPER_ARC.json','VB-P101':'P101_VELOCITY_OVERDRIVE.json','VB-P100':'P100_TERRAIN_PULSE.json','VB-P99':'P99_PRESSURE_LINES.json','VB-P95':'P95_VOID_HAZARD_CANDIDATE.json','VB-P93':'P93_VOID_BREAKER.json','EP-P66':'P66_ECHO_RUSH.json','EP-001':'EP-001_P62_KINETIC_ARCHITECTURE.json','HG-001':'HG-001_P62_KINETIC_ARCHITECTURE.json','HS-001':'HS-001_P62_KINETIC_ARCHITECTURE.json','WV-001':'WV-001_P62_KINETIC_ARCHITECTURE.json'};
const canvas=$('view'),status=$('appStatus'),keys=new Set();
let gl,program,locations={},roads,lines,p100RoadRead,p101B5RoadOptic,a13ArchMesh,a13RoadArtMesh,w9c1MarkMesh,g5bSceneryMesh,flowRoads,shoulderLights,approachBeacons,hazardGateMesh,hazardGateSolidMesh,hazardRoadPlan,ball,ghostMesh,energyMeshes={},energyFx=true,scenery,megaWorld,megaEnabled=true,machineMeshes={},a13MachineMeshes={},guideMeshes=[];
let doc,world,runner,loading=0,paused=false,accum=0,last=0,fps=0,frames=0,fpsAt=0,left=false,right=false;
let previousPose=null,currentPose=null,cameraState=null,comparisonMode='stable',frameSkips=0,headingError=0;
let nearMissTracker=createNearMissTracker(),runCommitted=false,personalBest=null;
let demoMode=false,demoDirector=createNativeDemoState();
let renderQuality=createRenderQuality('auto'),visibilityFx=true;
let practiceMode=false,practiceStartedAt=null,seekingChapter=null,retryChapterId=null,lastEdgeRadarAt=0;
let chapterTracker=null,latestSplit=null,ghostData=null,ghostEnabled=false;
let p101B5Surge=createP101B5SurgeState(),a13Surge=createA13SurgeState();
let b5ManualAudit=null,b5PreviousAudit=null,w9c1CueProfile=null;
// Explicit candidate opt-in via URL; no normal game, road or global toggle changes.
const g5bVisualOptIn=new URLSearchParams(window.location.search).get('g5b')==='on'||new URLSearchParams(window.location.hash.slice(1)).get('g5b')==='on';
const guidedPairTrial=new URLSearchParams(window.location.search).get('guided')==='1';
const pairTrialIds=new Set(['VB-P101-A13-W9C1-CONTROL','VB-P101-A13-W9C1-ULTRA']);
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),mul=(a,k)=>a.map(x=>x*k),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm=a=>mul(a,1/(Math.hypot(...a)||1));
const push=(v,p,c)=>v.push(p[0],p[1],p[2],c[0],c[1],c[2]);
function tri(v,a,b,c,col){push(v,a,col);push(v,b,col);push(v,c,col);}
function box(color){
 const v=[],p=[[-.5,-.5,-.5],[-.5,-.5,.5],[-.5,.5,-.5],[-.5,.5,.5],[.5,-.5,-.5],[.5,-.5,.5],[.5,.5,-.5],[.5,.5,.5]];
 for(const [a,b,c,d] of [[0,4,6,2],[1,3,7,5],[0,1,5,4],[2,6,7,3],[0,2,3,1],[4,5,7,6]]){tri(v,p[a],p[b],p[c],color);tri(v,p[a],p[c],p[d],color);}
 return v;
}
function orb(){
 const v=[],rings=10,seg=14,c=[.18,1,.95],p=(a,b)=>[.65*Math.sin(a)*Math.cos(b),.65*Math.cos(a),.65*Math.sin(a)*Math.sin(b)];
 for(let i=0;i<rings;i++)for(let j=0;j<seg;j++){const a=Math.PI*i/rings,a2=Math.PI*(i+1)/rings,b=2*Math.PI*j/seg,b2=2*Math.PI*(j+1)/seg;const q=[p(a,b),p(a2,b),p(a2,b2),p(a,b2)];tri(v,q[0],q[1],q[2],c);tri(v,q[0],q[2],q[3],c);}
 return v;
}
function shader(type,source){
 const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
 if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;
}
function mesh(v){
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.STATIC_DRAW);
 return {buffer,count:v.length/6};
}
function discard(m){if(m?.buffer)gl.deleteBuffer(m.buffer);}
function init(){
 gl=canvas.getContext('webgl2',{antialias:true,alpha:false});
 if(!gl)throw Error('WebGL2が無効です。GPUまたはブラウザの設定をご確認ください。');
 const vertex=[
 '#version 300 es','precision highp float;',
 'layout(location=0) in vec3 p;layout(location=1) in vec3 color;',
 'uniform vec3 eye,camRight,camUp,camFront,translation,scale;uniform float yaw,aspect,fogStrength,fogStart,fogSpan;',
 'out vec3 shade;out float haze;',
 'void main(){vec3 d=p*scale;float c=cos(yaw),s=sin(yaw);',
 'vec3 w=vec3(c*d.x+s*d.z,d.y,-s*d.x+c*d.z)+translation-eye;',
 'float x=dot(w,camRight),y=dot(w,camUp),z=dot(w,camFront);',
 'gl_Position=vec4(1.35*x/aspect,1.35*y,1.00022*z-1.30014,z);shade=color;haze=clamp((length(w)-fogStart)/fogSpan,0.0,'+FOG_MAX.toFixed(2)+')*fogStrength;}'
 ].join('\n');
 const fragment=[
 '#version 300 es','precision highp float;in vec3 shade;in float haze;out vec4 outColor;',
 'void main(){outColor=vec4(mix(shade,vec3(.019,.041,.083),haze),1.0);}'
 ].join('\n');
 program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
 gl.useProgram(program);
 for(const name of ['eye','camRight','camUp','camFront','translation','scale','yaw','aspect','fogStrength','fogStart','fogSpan'])locations[name]=gl.getUniformLocation(program,name);
 gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);gl.clearColor(.019,.041,.083,1);
 ball=mesh(orb());ghostMesh=mesh(ghostLatticeVertices());
 const energyVisual=makeEnergyBallVisual();
 for(const key of ['shell','filaments','orbits','trails'])energyMeshes[key]=mesh(energyVisual[key]);
 canvas.dataset.energyVertices=String(energyVisual.totalVertices);
 for(const type of ['slider','rotator','piston'])for(const mode of ['fail','bounce','push'])
  {machineMeshes[type+':'+mode]=mesh(obstacleBodyVertices(type,mode));
   a13MachineMeshes[type+':'+mode]=mesh(a13MachineBodyVertices(type,mode));}
}
function buildVisual(stage){
 const vertex=[],wire=[];
 const base={'EP-001':[.3,.85,1],'HS-001':[.64,.53,1],'WV-001':[.33,.67,1],'HG-001':[.25,.98,.64]}[stage.stageForge.id]||[.35,.85,1];
 for(const s of stage.surfaces){
  if(s.visible===false)continue;
  const nu=Math.min(48,Math.max(7,(s.rows-1)*3)),nv=Math.min(12,Math.max(4,(s.cols-1)*2));
  const points=Array.from({length:nu+1},(_,i)=>Array.from({length:nv+1},(_,j)=>sample(s,i/nu,j/nv)));
  const color=mul(base,s.rideable?(s.material==='road'?.49:.62):.3);
  for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){const a=points[i][j],b=points[i+1][j],c=points[i+1][j+1],d=points[i][j+1];tri(vertex,a,b,c,color);tri(vertex,a,c,d,color);}
  if(s.rideable)for(const j of [0,nv])for(let i=0;i<nu;i++){push(wire,points[i][j],[.22,.95,1]);push(wire,points[i+1][j],[.22,.95,1]);}
 }
 for(const f of stage.fixtures??[]){
  const color=f.kind==='danger'?[1,.19,.27]:f.kind==='reward'?[1,.86,.28]:[.4,.52,.67];
  for(const t of fixtureTriangles(f))tri(vertex,t[0],t[1],t[2],color);
 }
 for(let i=0;i<stage.route.length-1;i+=2){push(wire,add(stage.route[i],[0,.3,0]),[.11,.72,.64]);push(wire,add(stage.route[i+1],[0,.3,0]),[.11,.72,.64]);}
 discard(roads);discard(lines);discard(p100RoadRead);discard(p101B5RoadOptic);discard(a13ArchMesh);discard(a13RoadArtMesh);discard(w9c1MarkMesh);discard(g5bSceneryMesh);discard(flowRoads);discard(shoulderLights);discard(approachBeacons);discard(hazardGateMesh);discard(hazardGateSolidMesh);discard(scenery);discard(megaWorld);
 for(const entry of guideMeshes)discard(entry.mesh);
 guideMeshes=makeMachineMeshes(stage.movingObstacles).map(x=>({id:x.id,mesh:mesh(x.guide)}));
 roads=mesh(vertex);lines=mesh(wire);
 const roadRead=p100RoadReadGeometry(stage,sample,frame);p100RoadRead=mesh(roadRead.vertices);
 canvas.dataset.roadReadStripes=String(roadRead.stripes);
 canvas.dataset.roadReadBars=String(roadRead.flowBars);
 const b5Optics=p101B5OpticalRoadGeometry(stage,sample,frame);
 p101B5RoadOptic=mesh(b5Optics.vertices);
 canvas.dataset.b5OpticalDashes=String(b5Optics.dashes);
 canvas.dataset.b5OpticalEdgeTicks=String(b5Optics.edgeTicks);
 canvas.dataset.b5OpticalNonCollision=String(b5Optics.nonCollision);
  const arch=a13MachineMegastructures(stage,sample);
  const hero=a13W9HeroArchitecture(stage,sample);
  a13ArchMesh=mesh([...arch.vertices,...hero.vertices]);
   const g5b=w9c1G5BSkyline(stage,sample,{enabled:g5bVisualOptIn});
   g5bSceneryMesh=g5b.active?mesh(g5b.vertices):null;
   canvas.dataset.g5bMode=g5b.active?'candidate':'off';
   canvas.dataset.g5bStations=String(g5b.stations);
   canvas.dataset.g5bHeroBlades=String(g5b.heroBlades);
   canvas.dataset.g5bTriangles=String(g5b.vertices.length/18);
   canvas.dataset.g5bClearance=String(g5b.minimumEdgeClearanceMeters??0);
   canvas.dataset.g5bNonCollision=String(g5b.nonCollision);
  canvas.dataset.a13W9Facilities=String(hero.facilities);
  canvas.dataset.a13W9Sections=hero.sections.join(',');
  canvas.dataset.a13W9WallPlates=String(hero.wallPlates);
  canvas.dataset.a13W9RoofPlates=String(hero.roofPlates);
  canvas.dataset.a13W9NonCollision=String(hero.nonCollision);
   const art=a13RacingRoadArt(stage,sample,frame);
   a13RoadArtMesh=mesh(art.vertices);
   w9c1CueProfile=makeW9C1CueProfile(stage,sample);
   const w9c1Marks=w9c1ApproachMarks(stage,sample,frame);
   w9c1MarkMesh=mesh(w9c1Marks.vertices);
   canvas.dataset.w9c1NoticeMarkers=String(w9c1Marks.stations);
   canvas.dataset.w9c1NoticeNonCollision=String(w9c1Marks.nonCollision);
   canvas.dataset.w9c1EdgeSegments=String(w9c1Marks.edgeSegments??0);
   canvas.dataset.a13RoadArtSegments=String(art.segments);
   canvas.dataset.a13RoadArtNonCollision=String(art.nonCollision);
  canvas.dataset.a13MachineArchitecture=String(arch.structures);
  canvas.dataset.a13ArchitectureNonCollision=String(arch.collidable===false);
 canvas.parentElement.dataset.stageId=stage.stageForge.id;
 const caption=document.querySelector('.righttag');
 if(caption){
  if(stage.stageForge.id==='VB-P100')caption.textContent='P100 · DEV ONLY · HUMAN QA HOLD';
  else caption.innerHTML='P97 / REAL ROAD PREWARNING · HUMAN QA HOLD<br>NOT FINAL GAME';
 }
 const flow=flowLineVertices(stage,sample,frame);flowRoads=mesh(flow.vertices);
 canvas.dataset.flowMarkers=String(flow.markers);
 const approach=approachBeaconVertices(stage,sample,frame);approachBeacons=mesh(approach.vertices);
 const p97=hazardRoadGateVertices(stage,sample,frame);
 hazardGateMesh=mesh(p97.vertices);hazardGateSolidMesh=mesh(p97.solidVertices);hazardRoadPlan=makeHazardRoadPlan(stage,sample);
 canvas.dataset.hazardGateCount=String(p97.gates.length);
 canvas.dataset.hazardStationCount=String(p97.stations);
 canvas.dataset.approachBeacons=String(approach.markerCount);
 canvas.dataset.approachRegions=approach.regions.join(',')||'none';
 const reflectors=roadShoulderLights(stage,sample,frame);shoulderLights=mesh(reflectors.vertices);
 canvas.dataset.roadBeaconCount=String(reflectors.beacons);
 canvas.dataset.shoulderBeacons=String(reflectors.beacons);
 const epic=epicGeometry(stage);scenery=epic.length?mesh(epic):null;
 const mega=megastructureGeometry(stage,sample);megaWorld=mega.vertices.length?mesh(mega.vertices):null;
 canvas.dataset.archPortalCount=String((mega.sections||[]).reduce((n,x)=>n+(x.portalCount||0),0));
 canvas.dataset.megaTriangleCount=String(mega.vertices.length/18);
 canvas.dataset.megaSectionCount=String(mega.sections.length);
 $('megaWorld').disabled=!megaWorld;
 $('megaWorld').textContent=megaWorld?(megaEnabled?'巨大都市構造：ON':'巨大都市構造：OFF'):'巨大都市構造：対象外';
 canvas.dataset.machineCount=String((stage.movingObstacles||[]).filter(x=>x.enabled!==false).length);
 canvas.dataset.a13CustomMovingShapes=String(stage.stageForge.variant==='A13_GAMEPLAY_ISOLATED'?stage.movingObstacles.filter(o=>o.id.startsWith('a13-machine-')).length:0);
 canvas.dataset.a13Version=stage.stageForge.variant==='A13_GAMEPLAY_ISOLATED'?(stage.stageForge.revision||'W1'):'none';
 canvas.dataset.w9Trial=String(stage.stageForge.recordStageId==='VB-P101-A13-W9X-B1');
 canvas.dataset.w9BankAmplitude=String(stage.stageForge.bankTrial?.amplitudeMeters??0);
 canvas.dataset.w9c1Width=String(stage.stageForge.slopeDNAStudy?.nominalCoreWidthMeters??0);
 canvas.dataset.w9c1Isolated=String(Boolean(stage.stageForge.slopeDNAStudy?.realB48Surface));
 canvas.dataset.hazardUrgency='none';canvas.dataset.hazardTarget='none';canvas.dataset.hazardEta='none';
}
function draw(m,center=[0,0,0],size=[1,1,1],angle=0,primitive=gl.TRIANGLES){
 if(!m||!m.count)return;
 gl.uniform3fv(locations.translation,center);gl.uniform3fv(locations.scale,size);gl.uniform1f(locations.yaw,angle);
 gl.bindBuffer(gl.ARRAY_BUFFER,m.buffer);gl.enableVertexAttribArray(0);gl.enableVertexAttribArray(1);
 gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12);
 gl.drawArrays(primitive,0,m.count);
}
function render(frameSeconds){
 if(!gl)return;
 const {width:w,height:h,ratio}=framebufferDimensions(canvas.clientWidth,canvas.clientHeight,window.devicePixelRatio||1,renderQuality);
 canvas.dataset.renderMode=renderQuality.mode;
 canvas.dataset.renderScale=renderQuality.scale.toFixed(2);
 canvas.dataset.rasterRatio=ratio.toFixed(2);
 if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}if(!w||!h)return;
 gl.viewport(0,0,w,h);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 if(!runner)return;
 // Render-time interpolation leaves native B48 physics untouched.
 const active=!paused&&runner.status==='running';
 const pose=resolveDisplayPose(previousPose,currentPose,accum,DT,active);
 cameraState=comparisonMode==='stable'
  ?advanceCamera(cameraState,pose.forward,active?frameSeconds:0)
  :createCameraState(pose.forward);
 headingError=cameraYawErrorRadians(cameraState,pose.forward);
 const view=viewForPose(pose,cameraState);
 gl.uniform3fv(locations.eye,view.eye);gl.uniform3fv(locations.camFront,view.front);gl.uniform3fv(locations.camRight,view.right);gl.uniform3fv(locations.camUp,view.up);
 canvas.dataset.cameraMode=comparisonMode==='stable'?'ball-lock-interpolated':'ball-lock-unfiltered-heading';
 canvas.dataset.cameraHeadingLagDegrees=(headingError*180/Math.PI).toFixed(2);
 gl.uniform1f(locations.aspect,w/h);
 gl.uniform1f(locations.fogStrength,visibilityFx?1:0);
 gl.uniform1f(locations.fogStart,FOG_START_METERS);
 gl.uniform1f(locations.fogSpan,FOG_SPAN_METERS);
 canvas.dataset.visibilityFx=visibilityFx?'enabled':'disabled';
 draw(scenery);if(megaEnabled){draw(megaWorld);draw(g5bSceneryMesh);}draw(a13ArchMesh);
 canvas.dataset.megaWorld=megaWorld?(megaEnabled?'enabled':'disabled'):'not-applicable';
 draw(roads);draw(a13RoadArtMesh);draw(w9c1MarkMesh);draw(p100RoadRead);draw(p101B5RoadOptic);draw(lines,[0,0,0],[1,1,1],0,gl.LINES);
 draw(flowRoads,[0,0,0],[1,1,1],0,gl.LINES);
 draw(approachBeacons,[0,0,0],[1,1,1],0,gl.LINES);
 draw(hazardGateSolidMesh);
 draw(hazardGateMesh,[0,0,0],[1,1,1],0,gl.LINES);
 if(visibilityFx)draw(shoulderLights,[0,0,0],[1,1,1],0,gl.LINES);
 // Non-collidable trajectory guides. Actual machine solids use exact B51 poses.
 for(const guide of guideMeshes)draw(guide.mesh,[0,0,0],[1,1,1],0,gl.LINES);
 for(const o of doc.movingObstacles){
  if(!o.enabled)continue;
  const obstaclePose=movingObstaclePose(o,pose.time);
  const key=o.type+':'+(o.collision?.mode||'fail');
  draw(o.id.startsWith('a13-machine-')?a13MachineMeshes[key]:machineMeshes[key],obstaclePose.center,obstaclePose.halfSize.map(x=>2*x),obstaclePose.yawRadians);
 }
 // P85: energy ball is strictly display-only, tied to the native 240Hz
 // position and simulation clock. There is no physical effect or steering aid.
 const effect=energyBallFrame(pose.time,runner.v,pose.forward,renderQuality.scale);
 if(energyFx){
  draw(energyMeshes.shell,pose.position,[1,1,1],effect.spin);
  draw(energyMeshes.filaments,pose.position,[1,1,1],effect.spin*.84,gl.LINES);
  if(effect.orbitActive)draw(energyMeshes.orbits,pose.position,[1,1,1],effect.orbitAngle,gl.LINES);
  if(effect.trailActive)draw(energyMeshes.trails,pose.position,
   [1,1,effect.trailScale],effect.directionYaw,gl.LINES);
 }else draw(ball,pose.position);
 const liveMode=demoMode?'spectator-demo':practiceMode?'practice':'manual';
 const canGhost=ghostEnabled&&ghostData&&ghostEligible(doc,runner.spawnIndex,liveMode);
 const ghostPosition=canGhost?referenceGhostAt(ghostData,pose.time):null;
 if(ghostPosition)draw(ghostMesh,ghostPosition,[1,1,1],0,gl.LINES);
 canvas.dataset.ghostMode=ghostPosition?'reference-visible':canGhost?'reference-finished':'off';
 const gap=ghostGapView(ghostData,doc,runner.spawnIndex,liveMode,ghostEnabled,pose.position,pose.time);
 const gapHud=$('ghostGap');gapHud.hidden=!gap.visible;
 if(gap.visible){gapHud.textContent='GHOST · 同時刻距離 '+gap.meters.toFixed(1)+' m';gapHud.dataset.close=String(gap.withinTenMeters);}
 canvas.dataset.ghostSeparation=gap.visible?gap.meters.toFixed(1):'off';
 canvas.dataset.energyMode=energyFx?'enhanced':'classic';
 canvas.dataset.energyTrail=energyFx&&effect.trailActive?'active':'inactive';
}
function browserRecordStore(){try{return window.localStorage;}catch{return null;}}
function updateRunScore(){
 if(!runner||!doc)return;
 const clock=practiceMode?practiceElapsed(runner.time,practiceStartedAt):runner.time;
 const score=survivalScore(clock,nearMissTracker.total);
 $('runScore').textContent=scoreString(score.total);
 $('survivalComponent').textContent=scoreString(score.survival);
 $('bonusComponent').textContent=scoreString(score.bonus);
 $('bestSurvival').textContent=personalBest?personalBest.seconds.toFixed(2)+' s':'—';
 canvas.dataset.survivalScore=String(score.total);
}
function publishGhostPace(last){
 const field=$('ghostPace');if(!field)return;
 const eligible=Boolean(ghostEnabled&&ghostData&&runner&&ghostEligible(doc,runner.spawnIndex,
  demoMode?'spectator-demo':practiceMode?'practice':'manual'));
 const pace=eligible?compareGhostSector(last,ghostData):null;
 field.hidden=!pace;field.dataset.status=pace?.sign||'off';
 canvas.dataset.ghostPaceStatus=pace?.sign||'off';
 if(pace)field.textContent=paceCaption(pace)+' · 同じ区間の実通過時刻で比較';
}
function publishRacecard(){
 const panel=$('ghostRacecard');if(!panel)return;
 const eligible=Boolean(ghostEnabled&&ghostData&&runner&&ghostEligible(doc,runner.spawnIndex,demoMode?'spectator-demo':practiceMode?'practice':'manual'));
 panel.hidden=!eligible;canvas.dataset.ghostRacecard=eligible?'visible':'off';
 if(!eligible)return;
 const rows=buildRacecard(chapterTracker?.completed||[],ghostData);
 const summary=racecardTotals(rows);
 $('racecardProgress').textContent=summary.completed+'/8 SECTORS · '+(summary.currentDelta===null?'実通過を待機':racecardDeltaText(summary.currentDelta)+' 対基準');
 $('racecardRows').replaceChildren(...rows.map(item=>{
  const row=document.createElement('div');row.className='racecardRow';row.dataset.status=item.status;
  const label=document.createElement('span');label.textContent=(item.index+1)+'. '+item.label;
  const value=document.createElement('strong');value.textContent=racecardDeltaText(item.delta);
  row.append(label,value);return row;
 }));
}
function publishChapterTiming(){
 if(!runner||!doc)return;
 const panel=$('chapterTiming');
 const view=chapterTimerView(chapterTracker,runner.time);
 panel.hidden=!view.visible;
 if(!view.visible){canvas.dataset.chapterTimeId='none';publishGhostPace(null);publishRacecard();return;}
 canvas.dataset.chapterTimeId=view.id;
 canvas.dataset.completedSplits=String(view.completed);
 $('splitCurrent').textContent=view.label+'  ·  '+splitSeconds(view.elapsed);
 const best=readChapterBest(browserRecordStore(),doc.stageForge.id,runner.spawnIndex,view.id);
 $('splitBest').textContent=best?'BEST '+splitSeconds(best.duration):'BEST —';
 $('splitLast').textContent=view.latest?'前区間 '+view.latest.label+'  '+splitSeconds(view.latest.duration):'区間通過で計測';
 publishGhostPace(view.latest);
 publishRacecard();
 $('splitHistory').replaceChildren(...chapterTracker.completed.slice(-3).map(record=>{
  const span=document.createElement('span');
  span.textContent=record.label+' '+splitSeconds(record.duration);
  return span;
 }));
 const visible=latestSplit&&runner.time>=latestSplit.time&&runner.time<latestSplit.time+2.2;
 $('splitBurst').hidden=!visible;
}
function updateNativeChapterTime(){
 const event=observeChapterSplits(chapterTracker,runner.surface,runner.lastSurface,runner.time,runner.status);
 if(!event)return;
 const best=(!demoMode&&!practiceMode)
  ?storeChapterBest(browserRecordStore(),event)
  :{best:null,improved:false,saved:false};
 latestSplit=event;
 $('splitBurst').textContent='SECTOR '+event.label+'  '+splitSeconds(event.duration)
  +(best.improved?'  ·  NEW BEST':'');
 canvas.dataset.completedSplits=String(chapterTracker.completed.length);
}
function settleRun(){
 if(!runner||runCommitted||!['failed','finished'].includes(runner.status))return;
 if(demoMode||practiceMode){
  $('b5ResultExport').hidden=true;
  retryChapterId=null;$('retryPractice').hidden=true;
  runCommitted=true;const result=$('runResult');result.hidden=false;
  $('resultTitle').textContent=practiceMode?(runner.status==='finished'?'PRACTICE CLEAR':'PRACTICE ENDED'):(runner.status==='finished'?'DEMO COMPLETE':'DEMO FAILED');
  $('resultScore').textContent=(practiceMode?practiceElapsed(runner.time,practiceStartedAt):runner.time).toFixed(2)+' s · 実物理'+(practiceMode?'操作練習':'観戦デモ');
  $('resultDetails').textContent=(practiceMode?'練習':'観戦デモ')+'は自己ベストへ保存しません。通常プレイで挑戦してください。';
  result.dataset.outcome=runner.status;canvas.dataset.runOutcome=runner.status;
  return;
 }
 runCommitted=true;
 if(b5ManualAudit)finalizeB5ManualAudit(b5ManualAudit,{
  status:runner.status,time:runner.time,surface:runner.surface||runner.lastSurface,
  contacts:runner.collisions,nearMisses:nearMissTracker.total,
  failure:runner.failure?.reason||null,
  collisionEvents:runner.events // G5-A: read-only; exported only after explicit save
 });
 // G5-C3: notify only the same-origin explicit guided parent, in memory.
 sendGuidedPairReport(null);
 const record=buildRunRecord({stageId:doc.stageForge.variant==='A13_GAMEPLAY_ISOLATED'?(doc.stageForge.recordStageId||'VB-P101-A13'):p101B5RecordStageId(doc),spawn:runner.spawnIndex,
  seconds:runner.time,nearMisses:nearMissTracker.total,outcome:runner.status});
 const compared=storeBest(browserRecordStore(),record);
 personalBest=compared.best;
 const result=$('runResult');result.hidden=false;
 $('b5ResultExport').hidden=!b5ManualAudit;
 $('resultTitle').textContent=runner.status==='finished'?'COURSE CLEAR':'RUN ENDED';
 $('resultScore').textContent=scoreString(record.total)+' PTS · '+record.seconds.toFixed(2)+' s';
 $('resultDetails').textContent='生存 '+scoreString(record.survival)+' ＋ 回避 '+scoreString(record.bonus)
  +' / NEAR MISS '+nearMissTracker.total+'回'+(compared.improved?' · NEW BEST!':'');
 result.dataset.outcome=runner.status;
 canvas.dataset.runOutcome=runner.status;
 // Select the most recent REAL physical road, not a fabricated checkpoint.
 // P79 native replay then runs from the authored spawn 00 before control takeover.
 retryChapterId=failurePracticeChapter({stageId:doc.stageForge.id,mode:'manual',status:runner.status,
  surface:runner.failure?.surface??runner.surface,lastSurface:runner.lastSurface,records:runner.records});
 $('retryPractice').hidden=!retryChapterId;
 $('retryPractice').textContent=retryChapterId?'失敗した区間を練習（実物理で再走）':'';
 canvas.dataset.failurePractice=retryChapterId||'none';
 updateRunScore();
}
function restart(){
 if(!doc||!world)return;
 if(b5ManualAudit){
  if(!b5ManualAudit.final)finalizeB5ManualAudit(b5ManualAudit,{
   status:'interrupted',time:runner?.time??0,surface:runner?.surface||runner?.lastSurface||null,
   contacts:runner?.collisions??0,nearMisses:nearMissTracker?.total??0,
   collisionEvents:runner?.events??[] // preserve verified rebound events on restart
  });
  b5PreviousAudit=b5ManualAudit;
 }
 seekingChapter=null;retryChapterId=null;$('retryPractice').hidden=true;canvas.dataset.failurePractice='none';
 const spawn=Math.min(doc.spawns.length-1,Math.max(0,Number($('spawn').value)||0));
 const eligible=Boolean(ghostData&&ghostEligible(doc,spawn,demoMode?'spectator-demo':practiceMode?'practice':'manual'));
  $('ghostToggle').disabled=!eligible;
  $('ghostToggle').textContent=!eligible?'基準ゴースト：対象外':ghostEnabled?'基準ゴースト：ON（非衝突）':'基準ゴースト：OFF';
  $('ghostToggle').setAttribute('aria-pressed',String(eligible&&ghostEnabled));
  $('ghostToggle').title=eligible?'開始地点00の手動走行にだけ適用':'実物理ゴーストはECHO PIPE開始00の手動走行のみ';
  const physicalLaunch=['B5_HYPER_ARC_ISOLATED','A13_GAMEPLAY_ISOLATED'].includes(doc.stageForge.variant)?52:44;
  runner=new Runner(doc,world,spawn,physicalLaunch);runner.assist=true;accum=0;paused=false;
  canvas.dataset.b5LaunchMps=doc.stageForge.variant==='B5_HYPER_ARC_ISOLATED'?'52':'off';
  b5ManualAudit=['B5_HYPER_ARC_ISOLATED','A13_GAMEPLAY_ISOLATED'].includes(doc.stageForge.variant)&&!demoMode&&!practiceMode
   ?createB5ManualAudit({stageId:doc.stageForge.variant==='A13_GAMEPLAY_ISOLATED'?(doc.stageForge.recordStageId||'VB-P101-A13'):'VB-P101-B5',profile:$('p101Profile').value,startSpeed:physicalLaunch,spawnIndex:spawn}):null;
  $('b5QaPanel').hidden=!['B5_HYPER_ARC_ISOLATED','A13_GAMEPLAY_ISOLATED'].includes(doc.stageForge.variant);
  $('b5QaTitle').textContent=doc.stageForge.slopeDNAStudy?.realB48Surface?'W9-C1 ABYSS '+doc.stageForge.slopeDNAStudy.nominalCoreWidthMeters+'m · 独立手動試走':doc.stageForge.recordStageId==='VB-P101-A13-W9X-B1'?'W9-X-B1 · 独立手動試走レポート':doc.stageForge.variant==='A13_GAMEPLAY_ISOLATED'?'A13 W7F · 手動試走レポート':'B5 · 手動試走レポート';
  $('w9TrialWarning').hidden=doc.stageForge.recordStageId!=='VB-P101-A13-W9X-B1';
  $('w9c1TrialWarning').hidden=!doc.stageForge.slopeDNAStudy?.realB48Surface;
  $('w9c1G4Survey').hidden=!doc.stageForge.slopeDNAStudy?.realB48Surface;
  $('b5QaStatus').textContent='手動試走の観測値を端末内で記録。自動送信はありません。';
  p101B5Surge=createP101B5SurgeState();a13Surge=createA13SurgeState();
  canvas.dataset.b5PhysicalStage=doc.stageForge.variant==='B5_HYPER_ARC_ISOLATED'?'true':'false';
 demoDirector=createNativeDemoState();
 canvas.dataset.runMode=demoMode?'spectator-demo':practiceMode?'practice':'manual';
 lastEdgeRadarAt=0;$('edgeRadar').hidden=true;canvas.dataset.edgeStatus='unavailable';
 $('w9c1Notice').hidden=true;canvas.dataset.w9c1NoticePhase='none';
 canvas.dataset.w9c1NoticeEta='none';canvas.dataset.w9c1NoticeDistance='none';
 $('demoBanner').hidden=!demoMode;
 canvas.dataset.overdriveProfile=doc.stageForge.id==='VB-P101'?$('p101Profile').value:'off';
 $('takeoverRun').hidden=!demoMode;
 $('practiceBanner').hidden=!practiceMode;
 $('practiceRun').textContent=practiceMode?'練習終了 → 通常走行':'指定区間から練習（実物理）';
 $('demoRun').textContent=demoMode?'デモ終了 → 自分でプレイ':'全編デモを見る（自動操舵）';
 $('demoRun').setAttribute('aria-pressed',String(demoMode));
 previousPose=currentPose=capturePose(runner);cameraState=createCameraState(currentPose.forward);frameSkips=0;headingError=0;
 nearMissTracker=createNearMissTracker();runCommitted=false;
 chapterTracker=createChapterSplits(doc.stageForge?.id,spawn,runner.surface,runner.time);latestSplit=null;
 $('splitBurst').hidden=true;canvas.dataset.completedSplits='0';
 canvas.dataset.chapterTimeId='none';
 personalBest=readBest(browserRecordStore(),doc.stageForge.variant==='A13_GAMEPLAY_ISOLATED'?(doc.stageForge.recordStageId||'VB-P101-A13'):p101B5RecordStageId(doc),spawn);
 $('runResult').hidden=true;$('b5ResultExport').hidden=true;canvas.dataset.runOutcome='running';
 $('nearMissCount').textContent='0';$('nearMissBurst').hidden=true;
 updateRunScore();
 canvas.dataset.nearMissCount='0';
 $('pause').textContent='一時停止 (Space)';
 delete status.dataset.failed;
 status.className='status';status.textContent=doc.stageForge?.slopeDNAStudy?.realB48Surface?'W9-C1 ABYSS DIVE — 本物のB48 '+doc.stageForge.slopeDNAStudy.nominalCoreWidthMeters+'m狭路 / 310–360m評価窓 / 28基の実動体 / 240Hz / 52m/s始動。人間の楽しさ・2秒視認性・公平性は未検証、W7F/B5/W9-X保護、Draft HOLD。':doc.stageForge?.recordStageId==='VB-P101-A13-W9X-B1'?'W9-X-B1 UNDERPASS DUAL-APEX — 7.28km / 28基 / 実B48路面の交互バンク8m / 240Hz / 52m/s始動。自動7/7は補正操舵のみ・手動の公平性や楽しさは未検証。W7F Goldは変更なし・試走記録は独立。DRAFT HOLD。':doc.stageForge?.variant==='A13_GAMEPLAY_ISOLATED'?'P101 A13 W7F — 7.28km・正規240Hz・28基の実移動障害物・52m/s始動。自動試走7/7完走 53.275秒 / 203.6m/s（人間の難易度・視認性は未検証）。B5保護 / DRAFT HOLD。':doc.stageForge?.variant==='B5_HYPER_ARC_ISOLATED'?'P101 B5 HYPER ARC — 7.28km true giant 3D 180° curves, 12 real moving machines, native 240Hz 206.28m/s SCRIPTED finish proven, 52m/s launch. Human steering/visual/phone FPS HOLD. P100 unchanged.':doc.stageForge?.id==='VB-P101'?'P101 VELOCITY OVERDRIVE — 4×/4.8×/6× genuine lateral acceleration and enhanced forward speed; 240Hz CCD. Human fairness and full-run QA HOLD. P100 baseline unchanged.':doc.stageForge?.id==='VB-P100'?'P100 TERRAIN PULSE — authentic 3D S-bends, real crests and moving road camber; P99 baseline unchanged; 7/7 real 240Hz two-profile native finish confirmed, human fairness and final art HOLD.':doc.stageForge?.id==='VB-P99'?'P99 PRESSURE LINES — real 7-skin variable-width roads and 12 native moving hazards; two real native 240Hz profile finishes confirmed; human fairness and full visual quality HOLD.':doc.stageForge?.id==='VB-P95'?'P96 VOID BREAKER — 12 real moving B51-C obstacles, 7/7 native scripted finish; human difficulty/fairness HOLD.':doc.stageForge?.id==='VB-P93'?'P94 VOID BREAKER — genuine 3990m 7/7 native scripted finish verified; human playability and final art NOT APPROVED.':doc.stageForge?.id==='EP-P66'?'P91 EXPERIMENTAL — physical-road fork/machine/gap visual approach beacons; existing native racecard preserved; no physics/P62 changes.':'3D ready · B48 240Hz / B51-C moving collision · 実走行での楽しさは未認定';
 publishChapterTiming();
 if(guidedPairTrial&&window.parent!==window&&doc.stageForge?.recordStageId&&
    pairTrialIds.has(doc.stageForge.recordStageId)&&b5ManualAudit&&!demoMode&&!practiceMode){
  window.parent.postMessage({type:'dopagaki.w9c1.g5c3.ready/1',
   stageId:doc.stageForge.recordStageId},window.location.origin);
 }
 // Synchronize the visible world-clock immediately after replacing Runner.
 // Otherwise a spectator can see a stale timer from the previous practice run
 // until the next 500ms HUD refresh and mistakenly read a time regression.
 hud();
}
async function load(){
 const seq=++loading,id=$('stage').value;
 runner=null;previousPose=null;currentPose=null;cameraState=null;doc=null;world=null;ghostData=null;status.className='status';status.textContent='JSON取得・衝突BVH構築中...';
 try{
  const response=await fetch('../generated/'+assets[id],{cache:'no-store'});
  if(!response.ok)throw Error('Stage JSON HTTP '+response.status);
  const value=await response.json();
  if(seq!==loading)return;
  if(value.schema!=='dopagaki.track-director/1'||!Array.isArray(value.spawns))throw Error('Stage schema mismatch');
  await new Promise(resolve=>requestAnimationFrame(resolve));
  const compiled=compile(value);
  if(seq!==loading)return;
  let replay=null;
   if(value.stageForge?.id==='EP-P66'){
    const ghostResponse=await fetch('../generated/P87_REFERENCE_GHOST.json',{cache:'no-store'});
    if(!ghostResponse.ok)throw Error('Reference ghost HTTP '+ghostResponse.status);
    replay=validateGhost(await ghostResponse.json());
    validateReferenceSectors(replay);
   }
   if(seq!==loading)return;
   buildVisual(value);doc=value;world=compiled;ghostData=replay;
  $('demoRun').disabled=!isDemoEligible(doc)||id==='VB-P101-A13-W9X-B1'||Boolean(doc.stageForge.slopeDNAStudy);
  $('p101Controls').hidden=doc.stageForge.id!=='VB-P101';
  canvas.dataset.p101Experimental=String(doc.stageForge.id==='VB-P101');
   $('practiceRun').disabled=doc.stageForge?.id!=='EP-P66';
   $('practiceChapter').disabled=doc.stageForge?.id!=='EP-P66';
  $('spawn').replaceChildren();
  value.spawns.forEach((s,i)=>{const option=document.createElement('option');option.value=String(i);option.textContent=s.name||'開始地点 '+(i+1);$('spawn').append(option);});
  restart();
 }catch(e){
  if(seq!==loading)return;
  status.className='status alert';status.textContent='3D load error: '+e.message;console.error(e);
 }
}
function updateTrackFlowHUD(){
 const bar=$('flowProgress');if(!bar||!doc||!runner)return;
 const flow=flowProgressState(doc,runner.surface,runner.lastSurface,runner.status);
 bar.hidden=!flow.visible;
 if(!flow.visible)return;
 bar.replaceChildren(...flow.stages.map(step=>{
  const el=document.createElement('span');el.textContent=step.label;
  el.dataset.state=step.state;el.setAttribute('aria-current',step.state==='current'?'step':'false');
  return el;
 }));
 canvas.dataset.flowChapter=flow.label;
}
function updateChapterHUD(){
 const el=$('chapterHud');if(!el)return;
 if(['VB-P93','VB-P95','VB-P99','VB-P100','VB-P101'].includes(doc?.stageForge?.id)){
  const surface=doc.surfaces.find(s=>s.id===runner?.surface||s.id===runner?.lastSurface);
  const sub=document.createElement('small');sub.textContent='本物の3D道路・バンク・高低差 / 走行品質は検証候補';
  el.replaceChildren(document.createTextNode(surface?.name||'VOID BREAKER · SCISSOR ABYSS'),sub);
  return;
 }
 if(doc?.stageForge?.id!=='EP-P66'){el.textContent='P62 / ORIGINAL STAGE';return;}
 const id=runner.surface||runner.lastSurface||'';
 const x=runner.p[0];
 let name='RESONANCE CATHEDRAL',hint='巨大共鳴管・高速3D走行';
 if(id.includes('SPIRAL_CATHEDRAL')){name='450° SPIRAL DESCENT';hint=id.endsWith('-06')?'螺旋出口！前方の広い接続路で左へ強く操舵':'大空洞を旋回 / バンクの傾斜を利用';}
 else if(id.includes('PIPE_RETURN')){name='HALO RETURN — 180° SKY HAIRPIN';hint='半径260mの巨大カーブ / 螺旋へ自然接続';}
 else if(id.includes('FORK_APPROACH')){name='CHOOSE YOUR SKYLINE';hint='左へしっかり寄せながら立体分岐へ / 道幅が変化';}
 else if(id.includes('FORK_L')){name='BELL VAULT';hint='外周の低層分岐';}
 else if(id.includes('FORK_R')){name='ORGAN SKYBRIDGE';hint='高層の空中分岐';}
 else if(id.includes('MACHINE_CHAMBER')){name='MACHINE GAUNTLET';hint='動体を回避 / 中央固定は危険';}
 else if(id.includes('GAP_TAKEOFF')){name='NATURAL LAUNCH';hint='坂で飛び出す / ジャンプボタンは不要';}
 else if(id.includes('GAP_LANDING')){name='TOUCHDOWN';hint='着地後のラインを整える';}
 else if(id.includes('FORK_REJOIN')){name='LEVEL CROSSING';hint='左右ルートが再合流';}
 else if(x>=1200&&!runner.grounded){name='AIRBORNE';hint='空中移動中 / 着地点を確認';}
 else if(id.includes('PIPE_DIVE')){name='PIPE BREACH';hint='巨大共鳴管へ突入';}
 const small=document.createElement('small');small.textContent=hint;
 el.replaceChildren(document.createTextNode(name),small);
}
function updateW9C1Notice(edge){
 const root=$('w9c1Notice');
 if(!root||!runner)return;
 const cue=runner.status==='failed'||runner.status==='finished'?null:
  readW9C1Cue(w9c1CueProfile,{
   surfaceId:runner.surface,u:edge?.u,grounded:runner.grounded,
   speedMps:Math.hypot(...runner.v)
  });
 root.hidden=!cue;
 if(b5ManualAudit&&cue)observeW9C1ManualCue(b5ManualAudit,cue,runner.time);
 canvas.dataset.w9c1NoticePhase=cue?.phase||'none';
 canvas.dataset.w9c1NoticeEta=cue?cue.instantaneousEtaSeconds.toFixed(2):'none';
 canvas.dataset.w9c1NoticeDistance=cue?cue.physicalDistanceToCoreMeters.toFixed(1):'none';
 canvas.dataset.w9c1NoticePosition=cue?cue.nominalPositionMeters.toFixed(1):'none';
 if(!cue)return;
 root.dataset.phase=cue.phase;
 $('w9c1NoticeTitle').textContent=cue.phase==='approach'
  ?'ABYSS · まもなく'+cue.widthMeters+'m狭路'
  :cue.phase==='core'?'ABYSS · '+cue.widthMeters+'m超狭路区間':'ABYSS · 狭路からの復帰';
 $('w9c1NoticeDetail').textContent=cue.phase==='approach'
  ?'実路面に沿い約'+Math.round(cue.physicalDistanceToCoreMeters)+'m / 現速度換算 '+cue.instantaneousEtaSeconds.toFixed(1)+'秒先 · 左右の道路端に注意'
  :'実道路幅'+cue.widthMeters+'m · 操舵できる余裕は未検証';
}
function updateEdgeRadar(){
 const root=$('edgeRadar');if(!root||!runner||!doc)return;
 const result=locateRoadLateral(doc,runner.surface,runner.p,sample,frame,{grounded:runner.grounded,ballRadius:RADIUS});
 updateW9C1Notice(result);
 root.hidden=!result;
 if(!result){canvas.dataset.edgeStatus='airborne-or-unavailable';return;}
 root.dataset.severity=result.severity;
 root.dataset.edge=result.edge.toLowerCase();
 root.dataset.v=result.v.toFixed(3);
 canvas.dataset.edgeStatus=result.severity;
 $('edgeMarker').style.left=(Math.max(0,Math.min(1,result.v))*100).toFixed(1)+'%';
 $('edgeLabel').textContent=edgeRadarLabel(result);
 $('edgeTilt').textContent='面傾斜 '+result.tiltDegrees.toFixed(0)+'°';
}
function hud(){
 if(!runner)return;
 $('speed').textContent=Math.hypot(...runner.v).toFixed(1);
 $('simTime').textContent=runner.time.toFixed(2)+' s';$('contacts').textContent=String(runner.collisions);
 $('ground').textContent=(runner.grounded?'接地':'空中')+(p101ReboundRecoveryState(runner).active?' / 非致死衝突から復帰中':'');$('fps').textContent=String(Math.round(fps));
 updateRunScore();
 const machineLabel=$('machineCue');
 if(machineLabel){
  const advance=['VB-P95','VB-P99','VB-P100','VB-P101'].includes(doc?.stageForge?.id)
   ?nextRoadHazardCue(doc,runner,hazardRoadPlan,movingObstaclePose,doc.stageForge.id==='VB-P101'?{range:720}:undefined):null;
  const cue=['VB-P95','VB-P99','VB-P100','VB-P101'].includes(doc?.stageForge?.id)?advance
   :nearestMachineCue(doc.movingObstacles,runner.p,runner.forward,runner.time,220,movingObstaclePose);
  machineLabel.hidden=!cue;
  machineLabel.dataset.mode=cue?.mode||'none';
  machineLabel.dataset.urgency=advance?.urgency||'none';
  canvas.dataset.hazardUrgency=advance?.urgency||'none';
  canvas.dataset.hazardTarget=advance?.id||'none';
  canvas.dataset.hazardEta=advance?advance.etaSeconds.toFixed(1):'none';
  if(advance)machineLabel.textContent='先の動体 '+advance.id.slice(-2)+' / '+advance.modeLabel+' · 約'+advance.meters+'m / '+advance.etaSeconds.toFixed(1)+'秒 · 予測位置 '+advance.sideLabel+'（安全な道の保証なし）';
  else if(cue)machineLabel.textContent=cue.typeLabel+' / '+cue.modeLabel+' · '+cue.lateralLabel+' '+cue.distance+'m';
 }
 updateChapterHUD();updateTrackFlowHUD();publishChapterTiming();
 if(runner.status==='failed'&&!status.dataset.failed){
  status.className='status alert';status.textContent='試走終了: '+(runner.failure?.reason||'衝突')+'。Rで再スタート';
  status.dataset.failed='1';
 }
}
function tick(now){
 requestAnimationFrame(tick);
 if(!last)last=now;const elapsed=Math.max(0,(now-last)/1000);last=now;
 let b5PhysicsOverloaded=false;
 if(seekingChapter&&runner){
  const step=advancePracticeSeek(seekingChapter,runner);
  previousPose=currentPose=capturePose(runner);
  cameraState=createCameraState(currentPose.forward);
  accum=0;
  $('practiceProgress').textContent='実物理で追走中 '+runner.time.toFixed(1)+'s / '+seekingChapter.chapter.label;
  if(step.status==='ready'){
   completePracticeTakeover();
  }else if(step.status==='failed'){
   const where=seekingChapter.chapter.label;
   seekingChapter=null;paused=true;
   $('practiceProgress').textContent='この区間への追走に失敗しました: '+where+' / 他の区間を選んでください';
   canvas.dataset.runMode='practice-seek-failed';
  }
 }
 else if(runner&&!paused&&runner.status!=='failed'&&runner.status!=='finished'){
  const manualSteer=Number(right||keys.has('KeyD')||keys.has('ArrowRight'))-Number(left||keys.has('KeyA')||keys.has('ArrowLeft'));
  const progressed=stepFixedClock(accum,elapsed*(demoMode?Number($('demoSpeed').value):1),DT,()=>{
   previousPose=currentPose;
   const steer=demoMode?nativeDemoSteer(demoDirector,runner,movingObstaclePose):manualSteer;
    if(doc.stageForge.id==='VB-P101'){
      const physicalPower=doc.stageForge.variant==='A13_GAMEPLAY_ISOLATED' ?p101A13ForwardScale(runner,a13Surge):doc.stageForge.variant==='B5_HYPER_ARC_ISOLATED' ?p101B5ForwardScale(runner,p101B5Surge):1;
      p101Step(runner,steer,$('p101Profile').value||P101_DEFAULT,{
        forwardScale:physicalPower,
        // G5-C1 human trial only; driver assist is still the native arcade
        // steering system, while the recovery throttle changes no collisions.
        collisionRecovery:!demoMode&&!practiceMode&&!seekingChapter
       });
    }else runner.step(steer);
    currentPose=capturePose(runner);
   if(demoMode)recordDemoMilestone(demoDirector,runner);
   updateNativeChapterTime();
   const near=stepNearMiss(nearMissTracker,doc.movingObstacles,runner,movingObstaclePose,sphereBoxSeparation,RADIUS);
   if(near){
    $('nearMissCount').textContent=String(near.total);
    canvas.dataset.nearMissCount=String(near.total);
    $('nearMissBurst').hidden=false;
    $('nearMissBurst').textContent='NEAR MISS  ·  '+near.clearance.toFixed(2)+'m  /  ×'+near.total;
   }
   return runner.status!=='failed'&&runner.status!=='finished';
  });
  accum=progressed.accumulator;
  if(progressed.overloaded){frameSkips++;b5PhysicsOverloaded=true;}
  settleRun();
 }
 if(runner&&nearMissTracker){const current=nearMissDisplay(nearMissTracker,runner.time);$('nearMissBurst').hidden=!current;}
 if(runner&&latestSplit)$('splitBurst').hidden=!(runner.time>=latestSplit.time&&runner.time<latestSplit.time+2.2);
 if(demoMode&&runner)$('demoElapsed').textContent=runner.time.toFixed(1)+'s / '+(doc?.stageForge?.id==='VB-P100'?'約40s':doc?.stageForge?.id==='VB-P99'?'約39s':doc?.stageForge?.id==='VB-P95'?'約40s':doc?.stageForge?.id==='VB-P93'?'約38s':'約83.2s');
 if(runner&&now-lastEdgeRadarAt>100){lastEdgeRadarAt=now;updateEdgeRadar();}
 if(b5ManualAudit&&runner&&!paused&&runner.status==='running'&&document.visibilityState==='visible')
  recordB5ManualFrame(b5ManualAudit,elapsed,{physicsOverloaded:b5PhysicsOverloaded});
 frames++;
 if(now-fpsAt>=500){fps=frames*1000/Math.max(now-fpsAt,1);frames=0;fpsAt=now;hud();
  if(b5ManualAudit&&runner&&runner.status==='running'&&!paused&&document.visibilityState==='visible'){
   const input=Number(right||keys.has('KeyD')||keys.has('ArrowRight'))
    -Number(left||keys.has('KeyA')||keys.has('ArrowLeft'));
   const cue=hazardRoadPlan?nextRoadHazardCue(doc,runner,hazardRoadPlan,movingObstaclePose,{range:720}):null;
   recordB5ManualSample(b5ManualAudit,{
    time:runner.time,speed:Math.hypot(...runner.v),fps,frameDelta:elapsed,input,
    surface:runner.surface||runner.lastSurface,grounded:runner.grounded,
    hazard:cue?.id||'none',urgency:cue?.urgency||'none',
    edge:canvas.dataset.edgeStatus,
    w9c1NoticePhase:canvas.dataset.w9c1NoticePhase,
    w9c1NoticeEtaSeconds:Number(canvas.dataset.w9c1NoticeEta),
    w9c1NoticeNominalMeters:Number(canvas.dataset.w9c1NoticePosition)
   });
   $('b5QaStatus').textContent='手動QA '+b5ManualAudit.samples.length+'サンプル / '
    +Math.round(b5ManualAudit.maxSpeed)+'m/s最高 / FPS観測中';
  }
  renderQuality=sampleRenderQuality(renderQuality,fps,{active:Boolean(runner&&!paused&&!seekingChapter&&!demoMode&&runner.status==='running'&&document.visibilityState==='visible')});
  $('renderScaleInfo').textContent=renderScaleLabel(renderQuality)+' / '+canvas.width+'×'+canvas.height+'px';
  const lag=$('cameraInfo');if(lag)lag.textContent=comparisonMode==='stable'
   ?'方向補間：有効 / 角度差 '+(headingError*180/Math.PI).toFixed(1)+'°'+(frameSkips?' / 低FPS警告 '+frameSkips+'回':'')
   :'方向補間：OFF（比較用） / 物理は変更なし';
 }
 render(elapsed);
}
function bindHold(id,set){
 const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);set(true);});
 for(const name of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(name,()=>set(false));
}
bindHold('left',v=>left=v);bindHold('right',v=>right=v);
$('ghostToggle').addEventListener('click',()=>{
 if($('ghostToggle').disabled)return;
 ghostEnabled=!ghostEnabled;
 $('ghostToggle').textContent=ghostEnabled?'基準ゴースト：ON（非衝突）':'基準ゴースト：OFF';
 if(!ghostEnabled)$('ghostGap').hidden=true;
 publishRacecard();
 $('ghostToggle').setAttribute('aria-pressed',String(ghostEnabled));
 publishChapterTiming();
});
$('energyFx').addEventListener('click',()=>{
 energyFx=!energyFx;
 $('energyFx').textContent=energyFx?'エネルギーボール：ON':'エネルギーボール：OFF（従来表示）';
 $('energyFx').setAttribute('aria-pressed',String(energyFx));
});
$('visibilityFx').addEventListener('click',()=>{
 visibilityFx=!visibilityFx;
 $('visibilityFx').textContent=visibilityFx?'道路端ライト・遠景：ON':'道路端ライト・遠景：OFF';
 $('visibilityFx').setAttribute('aria-pressed',String(visibilityFx));
});
$('renderQuality').addEventListener('change',()=>{
 renderQuality=createRenderQuality($('renderQuality').value);
 $('renderScaleInfo').textContent=renderScaleLabel(renderQuality);
});
$('megaWorld').addEventListener('click',()=>{
 if(!megaWorld)return;
 megaEnabled=!megaEnabled;
 $('megaWorld').textContent=megaEnabled?'巨大都市構造：ON':'巨大都市構造：OFF';
 $('megaWorld').setAttribute('aria-pressed',String(megaEnabled));
});
$('cameraCompare').addEventListener('click',()=>{
 comparisonMode=comparisonMode==='stable'?'raw':'stable';
 $('cameraCompare').textContent=comparisonMode==='stable'?'カメラ比較：安定':'カメラ比較：生の方向';
 $('cameraCompare').setAttribute('aria-pressed',String(comparisonMode==='raw'));
 // Switching between visualizations is deliberately instantaneous and does not modify Runner.
 if(currentPose)cameraState=createCameraState(currentPose.forward);
});
function toggle(){paused=!paused;$('pause').textContent=paused?'再開 (Space)':'一時停止 (Space)';
 // Stop HUD drift: the native 240Hz clock is frozen immediately on pause,
 // so publish that exact committed time instead of waiting for the 500ms HUD refresh.
 if(runner)hud();}
window.addEventListener('keydown',e=>{
 if(['KeyA','KeyD','ArrowLeft','ArrowRight','KeyR','Space'].includes(e.code)&&!['SELECT','INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){
  e.preventDefault();keys.add(e.code);
  if(!e.repeat&&e.code==='KeyR'){if(practiceMode)exitPractice();else if(demoMode)exitDemo();else restart();}
  if(!e.repeat&&e.code==='Space')toggle();
 }
});
window.addEventListener('keyup',e=>keys.delete(e.code));
window.addEventListener('blur',()=>{keys.clear();left=false;right=false;});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){last=0;accum=0;previousPose=currentPose;fpsAt=0;frames=0;}});
function completePracticeTakeover(){
 // Keep exactly the original physics Runner, collision bridge, time and speed.
 demoMode=false;practiceMode=true;seekingChapter=null;
 practiceStartedAt=runner.time;accum=0;last=0;paused=false;
 chapterTracker=createChapterSplits(doc.stageForge?.id,runner.spawnIndex,runner.surface,runner.time);
 latestSplit=null;$('splitBurst').hidden=true;
 nearMissTracker=createNearMissTracker();
 nearMissTracker.eventCursor=runner.events.length;
 $('nearMissCount').textContent='0';$('nearMissBurst').hidden=true;
 canvas.dataset.nearMissCount='0';canvas.dataset.runMode='practice';
 $('demoBanner').hidden=true;$('takeoverRun').hidden=true;
 $('practiceBanner').hidden=false;
 $('practiceProgress').textContent='自分で操作中 / '+runner.time.toFixed(1)+'sから開始 · A/Dで操舵';
 $('practiceRun').textContent='練習終了 → 通常走行';
 $('demoRun').textContent='全編デモを見る（自動操舵）';
 $('demoRun').setAttribute('aria-pressed','false');
 status.textContent='P79 実物理の区間練習中 — 自動操舵OFF、自己ベスト対象外。';
 hud();
 updateRunScore();
}
function exitPractice(){
 practiceMode=false;seekingChapter=null;practiceStartedAt=null;
 demoMode=false;left=false;right=false;keys.clear();restart();
}
function startPractice(){
 if(doc?.stageForge?.id!=='EP-P66'||!runner)return;
 demoMode=false;practiceMode=true;practiceStartedAt=null;
 left=false;right=false;keys.clear();$('spawn').value='0';
 restart();
 seekingChapter=createPracticeSeek($('practiceChapter').value);
 canvas.dataset.runMode='practice-seek';
 $('practiceBanner').hidden=false;
 $('practiceProgress').textContent='実物理の再走開始 · '+seekingChapter.chapter.label;
 $('practiceRun').textContent='練習終了 → 通常走行';
}
function startFailurePractice(){
 const chapter=retryChapterId;
 if(!chapter||doc?.stageForge?.id!=='EP-P66'||runner?.status!=='failed'||demoMode||practiceMode)return;
 if(!PRACTICE_CHAPTERS.some(c=>c.id===chapter))return;
 $('practiceChapter').value=chapter;
 startPractice(); // P79: native 240Hz replay from spawn 00, never a teleport.
}
function takeoverDemo(){
 if(!demoMode||!runner||runner.status!=='running')return;
 completePracticeTakeover();
}
function exitDemo(){
 if(!demoMode)return;
 demoMode=false;left=false;right=false;keys.clear();restart();
}
function startDemo(){
 if(!isDemoEligible(doc)||!runner)return;
 practiceMode=false;practiceStartedAt=null;seekingChapter=null;
 demoMode=true;left=false;right=false;keys.clear();$('spawn').value='0';restart();
 // P98: right-hand setup controls can be several screens below the race.
 // Bring the REAL live canvas into view when spectator play begins, otherwise
 // the player watches a scrolled-off simulation without realizing it.
 canvas.scrollIntoView({block:'start',behavior:'auto'});
}
function pairSnapshot(){
 if(!runner||!b5ManualAudit||!doc||!pairTrialIds.has(b5ManualAudit.stageId)||
    b5ManualAudit.stageId!==doc.stageForge?.recordStageId||
    demoMode||practiceMode||seekingChapter)return null;
 if(b5ManualAudit.final)return null;
 return {time:runner.time,surface:runner.surface||runner.lastSurface,
  contacts:runner.collisions,nearMisses:nearMissTracker.total,
  collisionEvents:runner.events};
}
function sendGuidedPairReport(requestId=null){
 if(!guidedPairTrial||window.parent===window||!b5ManualAudit||
    !pairTrialIds.has(b5ManualAudit.stageId)||demoMode||practiceMode||seekingChapter)return;
 const json=exportB5ManualAudit(b5ManualAudit,{snapshot:pairSnapshot()});
 window.parent.postMessage({type:'dopagaki.w9c1.g5c3.report/1',
  requestId,stageId:b5ManualAudit.stageId,report:JSON.parse(json)},window.location.origin);
}
window.addEventListener('message',event=>{
 // Guard the exact embedding frame and local origin: no remote submission.
 if(!guidedPairTrial||event.origin!==window.location.origin||
    event.source!==window.parent||event.data?.type!=='dopagaki.w9c1.g5c3.capture/1')return;
 if(!b5ManualAudit||!pairTrialIds.has(b5ManualAudit.stageId)||
    !runner||demoMode||practiceMode||seekingChapter)return;
 // A deliberate capture pauses the runner; does not invent a failure,
 // collision or finish, and never modifies its physical velocity.
 if(!b5ManualAudit.final){paused=true;accum=0;$('pause').textContent='再開 (Space)';}
 sendGuidedPairReport(Number.isSafeInteger(event.data.requestId)?event.data.requestId:null);
});
function exportLocalManualQa(){
 const audit=b5ManualAudit?.samples.length?b5ManualAudit:b5PreviousAudit;
 if(!audit){$('b5QaStatus').textContent='まずB5またはA13を手動で走ってください。';return;}
 const val=id=>{const n=Number($(id).value);return n>=1&&n<=5?n:null;};
 const json=exportB5ManualAudit(audit,{
  speedFeel:val('b5SpeedFeel'),steeringFeel:val('b5SteeringFeel'),
  hazardLegibility:val('b5HazardFeel'),note:$('b5QaNote').value,
  w9c1Feedback:audit.stageId.includes('W9C1-')?{
   warningSeenEarly:val('w9c1WarningSeen'),
   edgeReadability:val('w9c1EdgeReadability'),
   failureFairness:val('w9c1FailureFairness'),
   failureAttribution:$('w9c1FailureCause').value
  }:null,
  snapshot:audit===b5ManualAudit?pairSnapshot():null
 });
 const blob=new Blob([json],{type:'application/json;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 const prefix=audit.stageId==='VB-P101-A13-W9C1-ULTRA'?'P101_A13_W9C1_ULTRA':audit.stageId==='VB-P101-A13-W9C1-CONTROL'?'P101_A13_W9C1_CONTROL':audit.stageId==='VB-P101-A13-W9X-B1'?'P101_A13_W9X_B1':audit.stageId==='VB-P101-A13-W7F'?'P101_A13_W7F':audit.stageId==='VB-P101-A13'?'P101_A13_W1':'P101_B5';
 a.href=url;a.download=prefix+'_MANUAL_QA_'+(audit.final?.status||'running_snapshot')+'.json';
 document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);
 $('b5QaStatus').textContent='試走JSONを端末へ保存しました（自動送信なし）。';
}
$('b5QaExport').addEventListener('click',exportLocalManualQa);
$('b5ResultExport').addEventListener('click',exportLocalManualQa);

$('demoRun').addEventListener('click',()=>demoMode?exitDemo():startDemo());
$('practiceRun').addEventListener('click',()=>practiceMode?exitPractice():startPractice());
$('takeoverRun').addEventListener('click',takeoverDemo);
$('retryPractice').addEventListener('click',startFailurePractice);
for(const chapter of PRACTICE_CHAPTERS){const option=document.createElement('option');option.value=chapter.id;option.textContent=chapter.label;$('practiceChapter').append(option);}
$('practiceChapter').value='fork';
$('stage').addEventListener('change',()=>{demoMode=false;practiceMode=false;seekingChapter=null;load();});
// Explicit local QA launch may select a validated stage; never starts a demo or autopilot.
const requestedStage=new URLSearchParams(window.location.search).get('stage');
if(requestedStage&&Object.hasOwn(assets,requestedStage))$('stage').value=requestedStage;
 $('p101Profile').addEventListener('change',()=>{if(doc?.stageForge?.id==='VB-P101')restart();});
$('spawn').addEventListener('change',()=>{demoMode=false;practiceMode=false;seekingChapter=null;restart();});
$('restart').addEventListener('click',()=>practiceMode?exitPractice():demoMode?exitDemo():restart());$('retryRun').addEventListener('click',()=>practiceMode?exitPractice():demoMode?exitDemo():restart());$('pause').addEventListener('click',toggle);
try{init();requestAnimationFrame(tick);load();}
catch(e){status.className='status alert';status.textContent='WebGL2 unsupported: '+e.message;console.error(e);}
