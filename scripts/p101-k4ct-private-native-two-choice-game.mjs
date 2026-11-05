/** K4CT: isolated TRUE original 240Hz browser game, two successive native B51.
 * PRIVATE copy only. Inherits proven K4CS HUD/real Road5 3D world and K4CR physics.
 * No new generated obstacles, no source original, no production or official QA.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const dist=path.resolve('dist-private'),gen=path.join(dist,'generated'),out=path.resolve('test-results/k4ct-two-true-b51');
fs.mkdirSync(out,{recursive:true});
const source=fs.readFileSync('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs');
const origBlob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+source.length+'\0'),source])).digest('hex');
assert.equal(origBlob,'af076d67492a677d2235e4730aef8cdf4808e106','protected original source SHA mismatch');
const original=JSON.parse(fs.readFileSync(path.join(gen,'K4CS_READABLE_REAL_B51_PRIVATE.json'),'utf8'));
assert.ok(original.stageForge.k4csPrivate&&original.stageForge.k4crPrivate);
assert.equal(original.stageForge.k4crPrivate.modifiedResearchRoad5SHA256,'4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b');
const immutable=JSON.stringify(original);
const candidate=structuredClone(original);
candidate.name=original.name+' K4CT 2 successive real moving B51 dynamic choice scene PRIVATE';
candidate.stageForge={...candidate.stageForge,recordStageId:'K4CT-TWO-B51-PRIVATE',productionPromoted:false,
 k4ctPrivate:{schema:'k4ct-two-native-b51-honest-lane-decision-v1',
  sourceR3Stage:'K4CS-READABLE-B51-CHOICE',originalGameBlob:origBlob,
  realB48Roads:7,realB51:28,actualOriginalRelocatedB51:6,
  sameOriginalK4CRPhysicalRoad5SHA256:original.stageForge.k4crPrivate.modifiedResearchRoad5SHA256,
  originalRunnerCamera240HzSteeringCCDUnmodified:true,newColliders:0,
  originalBeaconsNotModified:true,realDynamicB51FutureOBB:true,
  twoConsecutiveRealHazardsMaxAheadM:1450,
  actualHumanAvoidanceNotCertified:true,officialArtAccepted:0,officialSlope2DNAmetres:0,
  HUMAN:'HOLD',ART:'HOLD',SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'}};
for(const key of ['surfaces','movingObstacles','route','routeSegments','spawns','fixtures']){
 assert.deepEqual(candidate[key],original[key],'K4CT must not alter source physical data: '+key);
}
assert.equal(JSON.stringify(original),immutable);
const stage='K4CT-TWO-REAL-B51-CHOICE';
const file='K4CT_TWO_REAL_B51_NATIVE_CHOICE_PRIVATE.json';
fs.writeFileSync(path.join(gen,file),JSON.stringify(candidate)+'\n');
const prior=path.join(dist,'k4cs','drive3d.mjs');
assert.ok(fs.existsSync(prior),'Original K4CS game build must precede K4CT');
const target=path.join(dist,'k4ct');fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(path.join(dist,'k4cs'),target,{recursive:true});
let js=fs.readFileSync(path.join(target,'drive3d.mjs'),'utf8');
const replace=(before,after)=>{
 assert.equal(js.split(before).length,2,'K4CT unique original renderer anchor not found: '+before.slice(0,90));
 js=js.replace(before,after);
};
replace("get('k4cs')==='on'","get('k4ct')==='on'");
const asset="assets['K4CS-READABLE-B51-CHOICE']='K4CS_READABLE_REAL_B51_PRIVATE.json';";
replace(asset,asset+"\nassets['"+stage+"']='"+file+"';"+
 "const k4ctOption=document.createElement('option');k4ctOption.value='"+stage+"';"+
 "k4ctOption.textContent='K4CT TWO REAL B51 + NATIVE A/D DECISION (NOT HUMAN CERTIFIED)';"+
 "$('stage').append(k4ctOption);");
const imports="import {bindK4CSPlan,buildK4CSOutsideB48Beacons,readK4CSRealRoadWarning} from './k4cs-true-b48-ahead-b51-readable-cues.mjs';";
replace(imports,imports+"\nimport {readK4CTTwoTrueB51,formatK4CTNativeDualCue} from './k4ct-dual-real-b51-decision.mjs';");
const panel="let k4csReader=null,k4csMarkerMesh=null;";
replace(panel,panel+"\n"+
 "const k4ctPanel=document.createElement('aside');k4ctPanel.id='k4ctOriginalTwoB51Panel';"+
 "k4ctPanel.hidden=true;k4ctPanel.setAttribute('role','status');"+
 "k4ctPanel.setAttribute('aria-label','Next two actual moving B51 hazards. Geometry only, no guaranteed safe lane.');"+
 "k4ctPanel.style.cssText='position:fixed;top:0;left:0;transform:translateX(-50%);z-index:1130;max-width:min(720px,88vw);background:#061522ed;color:#ffffff;border:2px solid #69dae9;border-radius:10px;padding:8px 13px;text-align:left;font:700 14px/1.40 system-ui,Arial,sans-serif;white-space:pre-line;pointer-events:none;box-shadow:0 3px 12px #000c';"+
 "document.body.append(k4ctPanel);");
const anchor="}else{k4csNotice.hidden=true;canvas.dataset.k4csWarningId='none';}";
replace(anchor,anchor+"\n"+
 "if(doc?.stageForge?.k4ctPrivate&&k4csReader){"+
 " const dual=readK4CTTwoTrueB51(doc,runner,k4csReader,movingObstaclePose,sphereBoxSeparation);"+
 " const current=dual?.rows??[];const r0=current[0],r1=current[1];"+
 " const bounding=canvas.getBoundingClientRect();"+
 " k4ctPanel.style.left=(bounding.left+bounding.width/2).toFixed(1)+'px';"+
 " k4ctPanel.style.top=Math.max(8,bounding.top+8).toFixed(1)+'px';"+
 " k4ctPanel.hidden=!dual||runner.status!=='running';k4csNotice.hidden=true;"+
 " canvas.dataset.k4ctTwoRealCount=String(current.length);"+
 " canvas.dataset.k4ctFirstB51=r0?.id||'none';"+
 " canvas.dataset.k4ctSecondB51=r1?.id||'none';"+
 " canvas.dataset.k4ctFirstETA=r0?r0.etaSeconds.toFixed(2):'none';"+
 " canvas.dataset.k4ctSecondETA=r1?r1.etaSeconds.toFixed(2):'none';"+
 " canvas.dataset.k4ctFirstOriginalBoxSeparation=r0?r0.presentRealBoxSurfaceSeparationM.toFixed(2):'none';"+
 " canvas.dataset.k4ctRealRunnerLaneV=dual?dual.runnerLateralV.toFixed(3):'none';"+
 " canvas.dataset.k4ctDecisionJson=dual?JSON.stringify(dual):'null';"+
 " k4ctPanel.textContent=formatK4CTNativeDualCue(dual);"+
 "}else{k4ctPanel.hidden=true;canvas.dataset.k4ctTwoRealCount='0';}");
fs.writeFileSync(path.join(target,'drive3d.mjs'),js);
fs.copyFileSync('scripts/p101-k4ct-dual-real-b51-decision.mjs',path.join(target,'k4ct-dual-real-b51-decision.mjs'));
const html=fs.readFileSync(path.join(target,'index.html'),'utf8');
fs.writeFileSync(path.join(target,'index.html'),html.replace('K4CS TRUE EARLY B51 NOTICE RESEARCH PRIVATE','K4CT TWO REAL MOVING B51 ORIGINAL GAME PRIVATE'));
assert.ok(!fs.readFileSync(prior,'utf8').includes('k4ctPanel'),'existing K4CS protected copy mutated');
assert.ok(!fs.readFileSync(path.join(dist,'drive3d/drive3d.mjs'),'utf8').includes('k4ctPanel'),'original renderer polluted');
const sha=a=>crypto.createHash('sha256').update(JSON.stringify(a)).digest('hex');
const audit={schema:'k4ct-actual-original-two-moving-b51-one-playable-physics-v1',
 protectedSourceBlob:origBlob,unchangedK4CRRoad5SHA256:sha(candidate.surfaces[5].points),
 originalK4CSRoad5SHA256:sha(original.surfaces[5].points),
 allOriginalB51Identical:sha(candidate.movingObstacles)===sha(original.movingObstacles),
 nativeRoadAndSourceInputsUnchanged:true,newColliders:0,physicalGameForkOnly:true,
 newestResearchStage:stage,realB51:28,originalB48:7,
 plannedReadOnlyTwoB51:true,manualInputConsequenceNotYetProven:true,
 formalART:0,formalSlope2DNA:0,HUMAN:'HOLD',ART:'HOLD',SAT:'HOLD',CCD:'HOLD',
 FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
assert.equal(audit.unchangedK4CRRoad5SHA256,audit.originalK4CSRoad5SHA256);
fs.writeFileSync(path.join(out,'K4CT_NATIVE_GAME_BUILD_AUDIT.json'),JSON.stringify(audit,null,2)+'\n');
console.log('K4CT_TWO_TRUE_B51_NATIVE_PRIVATE_READY',JSON.stringify(audit));
