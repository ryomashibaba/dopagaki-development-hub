/** R15O5: locate original real SCISSOR_RISE B48 exit after B16 source-only correction. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {generateG4E7BC} from './p101-w9c2-g4e7bc-bank-contour.mjs';
import {sample} from '../private/reference_only/director/surface.js';
const argv=process.argv.slice(2),flag=k=>{const i=argv.indexOf(k);assert.ok(i>=0,k);return argv[i+1]};
const z=JSON.parse(fs.readFileSync(flag('--r15o4'),'utf8'));
const output={schema:'dopagaki.r15o5-native-banked-b48-original-scissor-next-exit-inspection/1',
 sourceBlob:'af076d67492a677d2235e4730aef8cdf4808e106',result:{}};
const round=v=>+v.toFixed(4),dist=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
for(const r of ['true-pinch','pinch-switch']){
 const s=generateG4E7BC(r,'rollDeck').surfaces[2];
 assert.equal(s.id,'p93-SCISSOR_RISE-01');
 const run=z.actualExtendedOriginalSourceEvidence[r].extendedActualNativeB48Study;
 const last=run.nativePhysicalLastB48Support;
 assert.equal(last.road,s.id);
 let best=null;
 for(let i=0;i<=160;i++)for(let j=0;j<=40;j++){
  const u=i/160,v=j/40,q=sample(s,u,v);
  const d=dist(q,last.worldPositionXYZ);
  if(!best||d<best.d)best={d,u,v,q};
 }
 const rows=[0,1,2,3,4,5,6,7,8,10,12,15,18,20,22,24,28,30].filter(x=>x<s.rows).map(i=>{
  const u=i/(s.rows-1),p=sample(s,u,0),q=sample(s,u,1),c=sample(s,u,.5);
  return {row:i,u:round(u),a:p.map(round),b:q.map(round),centre:c.map(round),
   widthXZ:round(Math.hypot(q[0]-p[0],q[2]-p[2]))};
 });
 output.result[r]={sourceRoadId:s.id,sourceSceneRows:s.rows,sourceSceneCols:s.cols,
  nativeLastGroundedAtSeconds:last.timeSeconds,actualLastRoadSupportXYZ:last.worldPositionXYZ,
  originalNativeVelocityAtFailureSourceQuarterSecondBeforeExit:
   run.nativeQuarterSecondSourcePhysicsTrace.find(x=>x.tick===Math.round(last.timeSeconds*240))??null,
  nearestOriginalRoadUV:{u:round(best.u),v:round(best.v),
   realSourceDistanceMetres:round(best.d),roadSourcePointXYZ:best.q.map(round)},
  originalB48ActualScissorRows:rows,originalSourceNeverEdited:true};
 console.log('R15O5_TRUE_SOURCE_SCISSOR_RISE_NEAREST_UV_AND_ROAD_GEOMETRY',r,
  JSON.stringify(output.result[r]).slice(0,7500));
}
fs.mkdirSync(flag('--out'),{recursive:true});
fs.writeFileSync(flag('--out')+'/R15O5_REAL_SCISSOR_RISE_SOURCE_BORDER_PARAMETRIC.json',JSON.stringify(output,null,2)+'\n');
