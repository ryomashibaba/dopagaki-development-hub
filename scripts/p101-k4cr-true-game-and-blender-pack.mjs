/** One-shot K4CR PRIVATE physical course pack, using the proven K4CQ true game.
 * No new engine, no formal QA route, no production files; source hash pinned.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {makeK4CRPhysical} from './p101-k4cr-physical-road5-chicane-real-b51.mjs';
import {makeK4CQScene,K4CQ_COLORS} from './p101-k4cq-one-sector-coast-geometry.mjs';
import {sample} from '../private/reference_only/director/surface.js';
const root=process.cwd(),dist=path.resolve('dist-private'),generated=path.join(dist,'generated');
const sha=d=>crypto.createHash('sha256').update(JSON.stringify(d)).digest('hex');
const old=fs.readFileSync('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs');
const blob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+old.length+'\0'),old])).digest('hex');
assert.equal(blob,'af076d67492a677d2235e4730aef8cdf4808e106');
const prior=path.join(dist,'k4cq','drive3d.mjs');
assert.ok(fs.existsSync(prior),'K4CQ genuine private renderer MUST be built first');
const baseline=JSON.parse(fs.readFileSync(path.join(generated,'K4CQ_ONE_ROAD5_TIDAL_APEX_PRIVATE.json'),'utf8'));
assert.equal(baseline.stageForge.k4cqPrivate.newColliders,0);
const originalImmutable=JSON.stringify(baseline),physical=makeK4CRPhysical(baseline);
const art=makeK4CQScene(physical,sample);
assert.equal(JSON.stringify(baseline),originalImmutable,'baseline must stay unchanged');
assert.equal(art.triangles,baseline.stageForge.k4cqPrivate.nonCollidingSceneTriangles);
physical.stageForge.k4cqPrivate={...physical.stageForge.k4cqPrivate,
 isolatedK4CRPhysicalRoad5SHA256:physical.stageForge.k4crPrivate.modifiedResearchRoad5SHA256,
 physicalB51SixReanchored:true,nonCollidingSceneTriangles:art.triangles,sourceGameBlob:blob};
const id='K4CR-BANKED-ROAD5-B51';
const file='K4CR_BANKED_ROAD5_B51_REAL_PRIVATE.json';
fs.writeFileSync(path.join(generated,file),JSON.stringify(physical)+'\n');
const target=path.join(dist,'k4cr');fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(path.join(dist,'k4cq'),target,{recursive:true});
let js=fs.readFileSync(path.join(target,'drive3d.mjs'),'utf8');
const replace=(needle,changed)=>{
 assert.equal(js.split(needle).length,2,'K4CR private WebGL source anchor missing: '+needle);
 js=js.replace(needle,changed);
};
replace("get('k4cq')==='on'","get('k4cr')==='on'");
const asset="assets['K4CQ-ONE-ROAD5-TIDAL-APEX']='K4CQ_ONE_ROAD5_TIDAL_APEX_PRIVATE.json';";
replace(asset,asset+
 "assets['"+id+"']='"+file+"';"+
 "const k4crOpt=document.createElement('option');"+
 "k4crOpt.value='"+id+"';k4crOpt.textContent='K4CR PHYSICAL REAL BANKED CHICANE 6 B51 / HOLD';"+
 "$('stage').append(k4crOpt);");
fs.writeFileSync(path.join(target,'drive3d.mjs'),js);
fs.writeFileSync(path.join(target,'index.html'),
 fs.readFileSync(path.join(target,'index.html'),'utf8').replace('K4CQ PRIVATE','K4CR PHYSICAL PRIVATE · original runner + source camera'));
assert.ok(!fs.readFileSync(path.join(dist,'k4cq','drive3d.mjs'),'utf8').includes("get('k4cr')"));
assert.ok(!fs.readFileSync(path.join(dist,'drive3d','drive3d.mjs'),'utf8').includes('K4CR-BANKED-ROAD5-B51'));
const out=path.resolve('test-results/k4cr-native-physical');fs.mkdirSync(out,{recursive:true});
// Both native DCC and WebGL2 receive EXACTLY the same authored environmental triangles.
const obj=['# Source-sampled K4CR background; inherited K4CQ R2 ART REJECT','mtllib K4CR_SCENE.mtl','o K4CR_WORLD_Coast_NotColliding'];
const mats=['# Physical course is a DIFFERENT original-game B48 surface'];
for(const [key,rgb] of Object.entries(K4CQ_COLORS)){
 mats.push('newmtl '+key,'Kd '+rgb.join(' '),'Ka 0.04 0.04 0.04','Ks .05 .05 .05','');
}
let i=1,last='';
for(const f of art.tris){
 if(f.mat!==last){obj.push('usemtl '+f.mat);last=f.mat;}
 for(const v of [f.a,f.b,f.c])obj.push('v '+v.map(x=>x.toFixed(5)).join(' '));
 obj.push('f '+i+' '+(i+1)+' '+(i+2));i+=3;
}
fs.writeFileSync(path.join(out,'K4CR_SCENE.obj'),obj.join('\n')+'\n');
fs.writeFileSync(path.join(out,'K4CR_SCENE.mtl'),mats.join('\n')+'\n');
// Export sampled ORIGINAL B48 physics surface as a separate EDITABLE native Blender mesh.
// This is not a fake surrogate: it is tessellation of the SAME actual Road5 object.
const road=physical.surfaces[5],mesh=['mtllib K4CR_ROAD5.mtl','o K4CR_ACTUAL_REAL_B48_ROAD5_PHYSICAL_CONTROL_SURFACE','usemtl K4CR_ROAD'];
const U=100,V=12;
for(let u=0;u<U;u++)for(let v=0;v<V;v++){
 const a=sample(road,u/U,v/V),b=sample(road,(u+1)/U,v/V),
 c=sample(road,(u+1)/U,(v+1)/V),d=sample(road,u/U,(v+1)/V);
 for(const p of [a,b,c,d]){assert.ok(p.every(Number.isFinite));mesh.push('v '+p.map(x=>x.toFixed(5)).join(' '));}
 const k=4*(u*V+v)+1;mesh.push('f '+k+' '+(k+1)+' '+(k+2),'f '+k+' '+(k+2)+' '+(k+3));
}
fs.writeFileSync(path.join(out,'K4CR_ROAD5.obj'),mesh.join('\n')+'\n');
fs.writeFileSync(path.join(out,'K4CR_ROAD5.mtl'),'newmtl K4CR_ROAD\nKd 0.17 0.24 0.28\n');
const report={schema:'k4cr-actual-original-game-native-road5-physical-and-b51-v1',
 stage:id,sourceBlob:blob,protectedRoad5OriginalSourceNotModified:true,
 oldR15S3D9Road5SHA256:sha(baseline.surfaces[5].points),
 isolatedK4CRPhysicalRoad5SHA256:sha(physical.surfaces[5].points),
 changedRoadIndices:[5],originalSevenB48:true,original28B51:true,
 relocatedOriginalB51:physical.stageForge.k4crPrivate.realRelocatedB51,
 nativeRoad5ExportTriangles:U*V*2,noncollidingEnvironmentTriangles:art.triangles,
 environmentArtInheritedR2FormalStatus:'REJECT',nativePhysicsAndSourceCameraUnmodified:true,
 nativeEditableBlenderPending:true,sourceRealWebGL2Pending:true,
 formalArtAdopted:0,slope2DNAmetres:0,HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',
 physicsMetrics:physical.stageForge.k4crPrivate};
fs.writeFileSync(path.join(out,'K4CR_BUILD_AUDIT.json'),JSON.stringify(report,null,2)+'\n');
console.log('K4CR_GENUINE_PHYSICAL_PRIVATE_AUTHOR',JSON.stringify({
 stage:id,actualRoad5SHA256:report.isolatedK4CRPhysicalRoad5SHA256,
 changedB51:report.relocatedOriginalB51.length,roadTriangles:report.nativeRoad5ExportTriangles,
 cameraPhysicsSourceUnmodified:true,webGL2AndBlenderNotYetExecuted:true,HUMAN:'HOLD',ART:'HOLD'}));
