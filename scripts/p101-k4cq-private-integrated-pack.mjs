/** K4CQ isolation: true 240Hz D10 PRIVATE game with one Road5 art sector.
 * All writes are under dist-private/k4cq and test-results/k4cq-integrated.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {makeK4CQScene,K4CQ_COLORS} from './p101-k4cq-one-sector-coast-geometry.mjs';
import {sample} from '../private/reference_only/director/surface.js';
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const root=process.cwd(),dist=path.join(root,'dist-private');
const original=fs.readFileSync('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs');
const blob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+original.length+'\0'),original])).digest('hex');
assert.equal(blob,'af076d67492a677d2235e4730aef8cdf4808e106');
const existing=path.join(dist,'r15s3d10');
assert.ok(fs.existsSync(path.join(existing,'drive3d.mjs')),'real D10 private game must be generated first');
const base=JSON.parse(fs.readFileSync(path.join(dist,'generated/R15S3D10_TRUE-PINCH_REAL_PRIVATE_WEBGL.json'),'utf8'));
assert.equal(base.stageForge.r15s3d9.mode,'A_CONTINUOUS_NARROW_MACRO');
const baseFrozen=JSON.stringify(base),scene=makeK4CQScene(base,sample);
assert.equal(JSON.stringify(base),baseFrozen);
assert.equal(base.surfaces.length,7);assert.equal(base.movingObstacles.length,28);
const road5Hash=hash(JSON.stringify(base.surfaces[5].points));
const doc=structuredClone(base);
doc.stageForge={...doc.stageForge,productionPromoted:false,
 k4cqPrivate:{id:scene.id,sourceGameBlob:blob,isolatedCandidateRoad5SHA256:road5Hash,
 researchRoad5AlreadyAlteredByR15S3D9:true,immutableOriginalB48Road5NotClaimed:true,
 genuineRoad5Index:5,roadU:scene.sourceRoadU,nonCollidingSceneTriangles:scene.triangles,
 physicalRoads:7,movingB51:28,newColliders:0,artOfficiallyAdopted:0,officialSlope2Meters:0,
 HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'}};
const id='K4CQ-ONE-ROAD5-TIDAL-APEX';
const filename='K4CQ_ONE_ROAD5_TIDAL_APEX_PRIVATE.json';
fs.writeFileSync(path.join(dist,'generated',filename),JSON.stringify(doc)+'\n');
const target=path.join(dist,'k4cq');fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(existing,target,{recursive:true});
let js=fs.readFileSync(path.join(target,'drive3d.mjs'),'utf8');
const replace=(from,to)=>{assert.equal(js.split(from).length,2,'unique game renderer anchor missing: '+from.slice(0,65));js=js.replace(from,to);};
replace("new URLSearchParams(window.location.search).get('r15s3d10')==='on'",
 "new URLSearchParams(window.location.search).get('k4cq')==='on'");
const anchor='// G4E-1 physical trials are private opt-in; Gold remains the visible default.';
replace(anchor,[
 "// K4CQ single opt-in PRIVATE art sector, SOURCE 240Hz physics untouched.",
 "if(r15s3d10OptIn){assets['"+id+"']='"+filename+"';",
 "const option=document.createElement('option');option.value='"+id+"';",
 "option.textContent='K4CQ real B48 Road5 coastal apex / ART HUMAN HOLD';$('stage').append(option);}",
 anchor
].join('\n'));
replace("import {originalB51TrueSpatialCue} from './r15s3d10-physical-b51-hud-cue.mjs';",
 "import {originalB51TrueSpatialCue} from './r15s3d10-physical-b51-hud-cue.mjs';\nimport {makeK4CQScene} from './k4cq-one-sector-coast-geometry.mjs';");
replace('function buildVisual(stage){\n const vertex=[],wire=[];',
 "let k4cqSceneMesh=null;\nfunction buildVisual(stage){\n const vertex=[],wire=[];\n"+
 "discard(k4cqSceneMesh);k4cqSceneMesh=null;\n"+
 "if(stage.stageForge?.k4cqPrivate){\n const info=stage.stageForge.k4cqPrivate;\n"+
 "if(info.sourceGameBlob!=="+JSON.stringify(blob)+"||info.newColliders!==0||stage.surfaces.length!==7||stage.movingObstacles.length!==28)throw Error('K4CQ source integrity violated');\n"+
 "const authored=makeK4CQScene(stage,sample);\n"+
 "if(authored.triangles!==info.nonCollidingSceneTriangles)throw Error('K4CQ scene triangle drift');\n"+
 "k4cqSceneMesh=mesh(authored.vertices);canvas.dataset.k4cqScene=authored.id;canvas.dataset.k4cqTriangles=String(authored.triangles);\n"+
 "}else canvas.dataset.k4cqScene='off';");
replace("if((g4e7aiOptIn&&g4e7aiBackdrop==='quiet')||(g4e7akOptIn&&g4e7akBackdrop==='quiet')){",
 "if(k4cqSceneMesh){draw(k4cqSceneMesh);}\nelse if((g4e7aiOptIn&&g4e7aiBackdrop==='quiet')||(g4e7akOptIn&&g4e7akBackdrop==='quiet')){");
fs.writeFileSync(path.join(target,'drive3d.mjs'),js);
fs.copyFileSync('scripts/p101-k4cq-one-sector-coast-geometry.mjs',path.join(target,'k4cq-one-sector-coast-geometry.mjs'));
const html=path.join(target,'index.html');
fs.writeFileSync(html,fs.readFileSync(html,'utf8').replace('R15S3D10 PRIVATE','K4CQ PRIVATE · actual B48/240Hz integrated terrain research'));
assert.ok(!fs.readFileSync(path.join(existing,'drive3d.mjs'),'utf8').includes('k4cqSceneMesh'));
assert.ok(!fs.readFileSync(path.join(dist,'drive3d/drive3d.mjs'),'utf8').includes('k4cqSceneMesh'));
// Native DCC export of EXACT same vertices/materials rendered by WebGL2.
const evidence=path.resolve('test-results/k4cq-integrated');fs.mkdirSync(evidence,{recursive:true});
const obj=['# K4CQ independent native authoring material, no source road included','mtllib K4CQ_COAST.mtl','o K4CQ_Actual_Road5_Aligned_Noncolliding_Coast'];
const mats=['# K4CQ authored coastal materials'];
for(const [name,rgb] of Object.entries(K4CQ_COLORS))mats.push('newmtl '+name,'Kd '+rgb.join(' '),'Ka 0.04 0.04 0.04','Ks .05 .05 .05','');
let vertex=1,last='';
for(const t of scene.tris){
 if(t.mat!==last){obj.push('usemtl '+t.mat);last=t.mat;}
 for(const p of [t.a,t.b,t.c])obj.push('v '+p.map(x=>x.toFixed(5)).join(' '));
 obj.push('f '+vertex+' '+(vertex+1)+' '+(vertex+2));vertex+=3;
}
fs.writeFileSync(path.join(evidence,'K4CQ_COAST.obj'),obj.join('\n')+'\n');
fs.writeFileSync(path.join(evidence,'K4CQ_COAST.mtl'),mats.join('\n')+'\n');
fs.writeFileSync(path.join(evidence,'K4CQ_BUILD_AUDIT.json'),JSON.stringify({
 schema:'k4cq-single-sector-source-integrated-v1',candidateId:id,originalGameBlob:blob,
 baselineK4CQResearchBranchUnmodified:true,originalRoad5SourceNotModified:true,
 researchCandidateRoad5SHA256:road5Hash,road5IsOldR15S3D9ResearchVariant:true,
 nativeRoadIndex:5,roadU:scene.sourceRoadU,realRoads:7,realMovingMachines:28,
 originalNative240HzAndCameraUnmodified:true,newGameColliders:0,
 sceneTriangles:scene.triangles,seaDatumY:scene.oceanDatumY,
 sourceRenderer:'PRIVATE dist-private/k4cq',webGL2Verified:false,blenderExecuted:false,
 directART:'HOLD',humanPlay:'HOLD',FPS:'HOLD',formalArt:0,slope2Metres:0,release:'HOLD',merge:'HOLD'
},null,2)+'\n');
console.log('K4CQ_PRIVATE_INTEGRATED_ART_AUTHOR',JSON.stringify({id,triangles:scene.triangles,stage:id,originalGameBlob:blob,newColliders:0,actualWebGLStillPending:true}));
