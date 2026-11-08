/** R78 LOCAL RESEARCH, physical-only copy of R75 stage: drop profile + real gap.
 * No modifications to original B48/B51 references, Game/Runner/Camera, production.
 * Does not certify human fairness, 7-road completion, art or release.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import assert from 'node:assert/strict';
const [src,out]=process.argv.slice(2);
if(!src||!out)throw Error('Usage: node k4ct-r78-basin20-native-generator.mjs INPUT_R75_STAGE.json NEW_OUTPUT_STAGE.json');
assert.notEqual(path.resolve(src),path.resolve(out),'Do not overwrite original');
assert(!fs.existsSync(out),'Do not overwrite existing candidate');
const input=fs.readFileSync(src),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const sourceSHA='7593b21f6e1e3951222115815050cf68823dc8368b44a977763c07c131eb292a';
assert.equal(sha(input),sourceSHA,'R75 source drift');
const original=JSON.parse(input),candidate=structuredClone(original);
assert.equal(candidate.surfaces.length,7);assert.equal(candidate.movingObstacles.length,28);
assert.deepEqual(candidate.surfaces[0].voidLongitudinalCells,[52,53,54]);
const contour={18:0,19:-9,20:-20,21:-23,22:-23,23:-23,24:-23,25:-20,26:-15,27:-10,28:-6,29:-2};
for(const [rowText,dy] of Object.entries(contour)){
 const row=+rowText;for(let col=0;col<5;col++)candidate.surfaces[0].points[row*5+col][1]+=dy;
}
for(let road=1;road<7;road++)assert.deepEqual(candidate.surfaces[road],original.surfaces[road]);
for(const key of ['movingObstacles','routeSegments','spawns','fixtures','route'])assert.deepEqual(candidate[key],original[key]);
for(let row=0;row<31;row++)for(let col=0;col<5;col++){
 const a=original.surfaces[0].points[row*5+col],b=candidate.surfaces[0].points[row*5+col];
 assert.equal(a[0],b[0]);assert.equal(a[2],b[2]);
 assert.equal(b[1],a[1]+(contour[row]??0));
}
candidate.name='R78 TRUE B48 / 20m LEVEL CHANGE & 3-CELL PHYSICAL CHASM / RESEARCH HUMAN ART HOLD';
candidate.stageForge.r78Research={id:'K4CT_R78_BASIN20',sourceR75StageSHA256:sourceSHA,style:'ISOLATED_PHYSICAL_ONLY',
 contourDeltaMeters:contour,originalB48AndB51Unmodified:true,originalNativeRunnerCameraUnmodified:true,
 trueRoad0GapCells:[52,53,54],zeroFakeGround:true,
 firstJumpInNativeZeroSteer:{fromSeconds:5,toSeconds:6.1583,durationSeconds:1.1583,horizontalDistanceM:94.63},
 firstRoadLanding:'PASS_ONE_AUTOMATED_RUN_ONLY',full7Roads:'FAIL_AT_APPROX_16.94_SECONDS',
 human:'HOLD',art:'HOLD',formalArtAccepted:0,officialSlope2DNAMetres:0,release:'HOLD'};
const bytes=Buffer.from(JSON.stringify(candidate)+'\n');
fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,bytes,{flag:'wx'});
console.log(JSON.stringify({id:'R78_BASIN20_SOURCE_ONLY',sha256:sha(bytes),original:sourceSHA,roads:7,movingB51:28,modifiedRoad0Rows:Object.keys(contour).length,notes:'Not a gameplay, ART, Windows, HUMAN or release pass'}));
