/** K4CS isolated PRIVATE copy of the proved K4CR TRUE WebGL2 original game.
 * No Road/Runner/physics/speed/Camera/CCD/Gold/prod write, no manual QA spoof.
 * Adds early dynamic original B51 cue and REAL source-B48 roadside warning mesh.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {bindK4CSPlan,buildK4CSOutsideB48Beacons} from './p101-k4cs-true-b48-ahead-b51-readable-cues.mjs';
import {sample} from '../private/reference_only/director/surface.js';
const dist=path.resolve('dist-private'),gen=path.join(dist,'generated'),out=path.resolve('test-results/k4cs-native-readable');
fs.mkdirSync(out,{recursive:true});
const old=fs.readFileSync('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs');
const blob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+old.length+'\0'),old])).digest('hex');
assert.equal(blob,'af076d67492a677d2235e4730aef8cdf4808e106');
const prior=path.join(dist,'k4cr','drive3d.mjs');
assert.ok(fs.existsSync(prior),'K4CR real source renderer must be built first');
const base=JSON.parse(fs.readFileSync(path.join(gen,'K4CR_BANKED_ROAD5_B51_REAL_PRIVATE.json'),'utf8'));
const before=JSON.stringify(base),plan=bindK4CSPlan(base,sample);
const beacons=buildK4CSOutsideB48Beacons(plan,sample);
assert.equal(JSON.stringify(base),before,'K4CR source candidate mutated');
const candidate=structuredClone(base);
candidate.name=base.name+' K4CS ACTUAL REAL B48 700M EARLY B51 WARNING PRIVATE';
candidate.stageForge={...candidate.stageForge,recordStageId:'K4CS-READABLE-PRIVATE',productionPromoted:false,
 k4csPrivate:{schema:'k4cs-native-700m-original-b51-early-choice-v1',originalSourceGameBlob:blob,
  physicallyAuthoredOriginalRoad5SHA256:base.stageForge.k4crPrivate.modifiedResearchRoad5SHA256,
  sourceOriginal28B51:true,observedOriginalSixRelocatedB51:6,
  nativeCameraAnd240HzPhysicsUntouched:true,kinematicWarningOnly:true,
  actualOriginalMovingObstaclePoseFutureProjection:true,visibilityOcclusionUnproven:true,
  actualNewGameColliders:0,earlyReadingMeters:700,warnStations:plan.stations.map(s=>({id:s.id,road:s.roadIndex,u:s.u,positionM:+s.distance.toFixed(2)})),
  nonCollidingBeaconTriangles:beacons.triangles.length,
  officialArtAdopted:0,slope2DNAM:0,HUMAN:'HOLD',ART:'HOLD',SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'}};
assert.equal(JSON.stringify(candidate.surfaces),JSON.stringify(base.surfaces));
assert.equal(JSON.stringify(candidate.movingObstacles),JSON.stringify(base.movingObstacles));
assert.equal(JSON.stringify(candidate.route),JSON.stringify(base.route));
assert.equal(JSON.stringify(candidate.spawns),JSON.stringify(base.spawns));
const stage='K4CS-READABLE-B51-CHOICE',file='K4CS_READABLE_REAL_B51_PRIVATE.json';
fs.writeFileSync(path.join(gen,file),JSON.stringify(candidate)+'\n');
const target=path.join(dist,'k4cs');fs.rmSync(target,{recursive:true,force:true});fs.cpSync(path.join(dist,'k4cr'),target,{recursive:true});
let js=fs.readFileSync(path.join(target,'drive3d.mjs'),'utf8');
const replace=(needle,value)=>{assert.equal(js.split(needle).length,2,'K4CS unique original-engine patch anchor: '+needle.slice(0,100));js=js.replace(needle,value);};
replace("get('k4cr')==='on'","get('k4cs')==='on'");
const asset="assets['K4CR-BANKED-ROAD5-B51']='K4CR_BANKED_ROAD5_B51_REAL_PRIVATE.json';";
replace(asset,asset+"\nassets['"+stage+"']='"+file+"';"+
 "\nconst k4csOption=document.createElement('option');k4csOption.value='"+stage+"';"+
 "k4csOption.textContent='K4CS LIVE ORIGINAL B51 EARLY NOTICE + SOURCE ROAD GATES';$('stage').append(k4csOption);");
replace("import {makeK4CQScene} from './k4cq-one-sector-coast-geometry.mjs';",
 "import {makeK4CQScene} from './k4cq-one-sector-coast-geometry.mjs';\n"+
 "import {bindK4CSPlan,buildK4CSOutsideB48Beacons,readK4CSRealRoadWarning} from './k4cs-true-b48-ahead-b51-readable-cues.mjs';");
replace("let k4cqSceneMesh=null;",
 [
 "const k4csNotice=document.createElement('aside');",
 "k4csNotice.id='k4csNativeHazardNotice';k4csNotice.hidden=true;",
 "k4csNotice.setAttribute('role','status');k4csNotice.setAttribute('aria-live','polite');",
 "k4csNotice.style.cssText='position:fixed;top:0;left:0;transform:translateX(-50%);z-index:1100;max-width:min(510px,72vw);border:2px solid #ffd166;border-radius:10px;background:#05131bef;color:#fef9e6;font:700 16px/1.3 system-ui,Arial,sans-serif;padding:7px 12px;text-align:center;white-space:pre-line;pointer-events:none;box-shadow:0 3px 12px #000b';",
 "document.body.append(k4csNotice);",
 "let k4csReader=null,k4csMarkerMesh=null;",
 "let k4cqSceneMesh=null;"
 ].join('\n'));
const origInit='discard(k4cqSceneMesh);k4cqSceneMesh=null;';
replace(origInit,origInit+"\n"+
 "discard(k4csMarkerMesh);k4csMarkerMesh=null;k4csReader=null;"+
 "if(stage.stageForge?.k4csPrivate){\n"+
 " k4csReader=bindK4CSPlan(stage,sample);"+
 " const authored=buildK4CSOutsideB48Beacons(k4csReader,sample);"+
 " if(authored.triangles.length!==stage.stageForge.k4csPrivate.nonCollidingBeaconTriangles)throw Error('K4CS authored gate triangle drift');"+
 " k4csMarkerMesh=mesh(authored.vertices);"+
 " canvas.dataset.k4csActualOriginalRoadGates=String(authored.markers.length);"+
 " canvas.dataset.k4csGateTriangles=String(authored.triangles.length);"+
 "}else{canvas.dataset.k4csActualOriginalRoadGates='0';}");
replace('if(k4cqSceneMesh){draw(k4cqSceneMesh);}',
 'if(k4cqSceneMesh){draw(k4cqSceneMesh);}\nif(k4csMarkerMesh){draw(k4csMarkerMesh);}');
const cueSlot="canvas.dataset.r15s3d10FovOnlyNotVisibility=String(physical.occlusionUntested);";
replace(cueSlot,cueSlot+"\n"+
 "if(doc.stageForge?.k4csPrivate&&k4csReader){"+
 " const early=readK4CSRealRoadWarning(doc,runner,k4csReader,movingObstaclePose);"+
 " k4csNotice.hidden=!early||runner.status!=='running';"+
 " canvas.dataset.k4csWarningId=early?.id||'none';"+
 " canvas.dataset.k4csAdvanceM=early?early.metres.toFixed(2):'none';"+
 " canvas.dataset.k4csAdvanceSeconds=early?early.etaSeconds.toFixed(2):'none';"+
 " canvas.dataset.k4csPredictedSide=early?.side||'none';"+
 " canvas.dataset.k4csUrgency=early?.urgency||'none';"+
 " canvas.dataset.k4csActualRunnerPosition=runner.p.map(x=>x.toFixed(3)).join(',');"+
 " canvas.dataset.k4csControlMode=demoMode?'SCRIPTED_NOT_HUMAN':'ORIGINAL_MANUAL_UNCERTIFIED';"+
 " if(early){const position=canvas.getBoundingClientRect();k4csNotice.style.left=(position.left+position.width/2).toFixed(1)+'px';k4csNotice.style.top=Math.max(8,position.top+69).toFixed(1)+'px';const jp=early.side==='LEFT'?'左寄り':early.side==='RIGHT'?'右寄り':'中央付近';"+
 " k4csNotice.textContent='B51-'+early.id.slice(-2)+' | '+Math.round(early.metres)+' m / '+early.etaSeconds.toFixed(1)+' s | '+early.side+' SIDE\\nESTIMATE - NO SAFE LANE CERTIFIED';k4csNotice.setAttribute('aria-label','実B51 '+early.id.slice(-2)+'。約'+Math.round(early.metres)+'メートル、'+early.etaSeconds.toFixed(1)+'秒先。未来位置 '+jp+'。安全レーン未認証');"+
 " k4csNotice.dataset.state=early.urgency;"+
 " k4csNotice.style.borderColor=early.urgency==='NOW'?'#ff576b':early.urgency==='READY'?'#ffc15a':'#50e1ee';"+
 " }"+
 "}else{k4csNotice.hidden=true;canvas.dataset.k4csWarningId='none';}");
const inputAnchor="const manualSteer=Number(right||keys.has('KeyD')||keys.has('ArrowRight'))-Number(left||keys.has('KeyA')||keys.has('ArrowLeft'));";
replace(inputAnchor,inputAnchor+"\n"+
 "if(doc?.stageForge?.k4csPrivate){canvas.dataset.k4csActualManualSteer=String(manualSteer);"+
 "canvas.dataset.k4csLastInputUsed=demoMode?'SCRIPTED_P96_P94':'ORIGINAL_MANUAL_KEYBOARD';}");
fs.writeFileSync(path.join(target,'drive3d.mjs'),js);
fs.copyFileSync('scripts/p101-k4cs-true-b48-ahead-b51-readable-cues.mjs',path.join(target,'k4cs-true-b48-ahead-b51-readable-cues.mjs'));
fs.writeFileSync(path.join(target,'index.html'),fs.readFileSync(path.join(target,'index.html'),'utf8').replace('K4CR PHYSICAL PRIVATE','K4CS TRUE EARLY B51 NOTICE RESEARCH PRIVATE'));
assert.ok(!fs.readFileSync(prior,'utf8').includes('k4csReader'));
assert.ok(!fs.readFileSync(path.join(dist,'drive3d/drive3d.mjs'),'utf8').includes('k4csReader'));
// EXACT same RGB XYZ authored GPU warning triangles exported for native Blender.
const obj=['# K4CS honest outboard warning geometry; no collision, not a safe route','mtllib K4CS_GATES.mtl','o K4CS_TRUE_B48_ROADSIDE_B51_WARNING'];
const mats=['newmtl K4CS_CYAN','Kd 0.13 0.87 0.96','newmtl K4CS_AMBER','Kd 1.0 0.77 0.26','newmtl K4CS_RED','Kd 1.0 0.28 0.36'];
const colorName=c=>c[0]<.2?'K4CS_CYAN':c[1]>.7?'K4CS_AMBER':'K4CS_RED';
let idx=1,last='';
for(const tri of beacons.triangles){
 const mat=colorName(tri.color);if(mat!==last){obj.push('usemtl '+mat);last=mat;}
 for(const p of [tri.a,tri.b,tri.c])obj.push('v '+p.map(n=>n.toFixed(5)).join(' '));
 obj.push('f '+idx+' '+(idx+1)+' '+(idx+2));idx+=3;
}
fs.writeFileSync(path.join(out,'K4CS_GATES.obj'),obj.join('\n')+'\n');
fs.writeFileSync(path.join(out,'K4CS_GATES.mtl'),mats.join('\n')+'\n');
const audit={schema:'k4cs-early-original-b51-gameplay-readable-not-human-v1',
 originalGameBlob:blob,originalPhysicalRoad5SHA256:base.stageForge.k4crPrivate.modifiedResearchRoad5SHA256,
 candidatePhysicalRoad5SHA256:candidate.stageForge.k4crPrivate.modifiedResearchRoad5SHA256,
 physicallyIdenticalK4CRAndK4CS:true,originalB51Identical:true,
 originalRunnerCameraInputCCDAnd240HzUnchanged:true,newColliders:0,
 originalB51Warnings:plan.stations.map(s=>({id:s.id,physicalRoad:s.roadIndex,u:s.u,stationM:+s.distance.toFixed(2)})),
 sourceRoadOutsideMarkers:beacons.markers,actualWarningGateTriangles:beacons.triangles.length,
 sourceOriginalGameUnchanged:true,formalArtAdopted:0,slope2DNAmetres:0,
 ART:'HOLD',HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
fs.writeFileSync(path.join(out,'K4CS_BUILD_AUDIT.json'),JSON.stringify(audit,null,2)+'\n');
console.log('K4CS_REAL_NATIVE_B51_EARLY_PLAYABLE_RESEARCH',JSON.stringify({stage,
 realHazards:plan.stations.length,markers:beacons.markers.length,triangles:beacons.triangles.length,
 originalGameUntouched:true,manualAutoTestsPending:true,HUMAN:'HOLD'}));
