/**
 * R15O V2: ISOLATED genuine B48 rideable geometry intervention.
 * Native B48 material physics/CCD/240Hz unchanged; modify ONLY original
 * road surface #1 control lattice, 0.46 < u < 0.82.
 *
 * Long-span physical surface, not fake invisible catch plane or suspended
 * disconnected bridge. Three meaningfully distinct geometries:
 *  - 8m outward v0 shoulder
 *  - 16m outward v0 shoulder and 1.0m bank-lift, narrower elsewhere
 *  - 22m broad outward centerline bend, width NOT increased.
 * True original 7 road sections & 28 B51 moving hazards. B51 remains
 * frozen here to isolate road shape; NOT certified fair/visual or release.
 */
import assert from 'node:assert/strict';
import {generateG4E7BC} from './p101-w9c2-g4e7bc-bank-contour.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
const modes=Object.freeze({
 ORIGINAL:{kind:'original',metres:0,bank:0},
 A_OUTER_SHOULDER_8M:{kind:'outward',metres:8,bank:0},
 B_BANKED_OUTER_SHOULDER_16M:{kind:'outward',metres:16,bank:1},
 C_REAL_OUTER_CURVE_SHIFT_22M:{kind:'centerline',metres:22,bank:0}
});
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const norm=v=>{const l=Math.hypot(...v);return v.map(x=>x/(l||1));};
const mix=(a,b,t)=>a+(b-a)*t;
const round=(n)=>Number(n.toFixed(5));
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const sm=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const gain=u=>sm((u-.47)/.14)*(1-sm((u-.71)/.12));
function metrics(s){
 const rows=[10,12,14,16,17,18,19,20,21,22,23,24,25,26];
 return rows.map(i=>{
  const p=sample(s,i/30,0),q=sample(s,i/30,1);
  return {row:i,u:round(i/30),widthXZ:round(Math.hypot(p[0]-q[0],p[2]-q[2])),
   leftEdge:p.map(round),centre:sample(s,i/30,.5).map(round)};
 });
}
export function buildR15OIsolatedB48(road,mode){
 assert.ok(Object.hasOwn(modes,mode));
 const base=generateG4E7BC(road,'rollDeck'),raw=JSON.stringify(base);
 const doc=structuredClone(base),s=doc.surfaces[1],orig=base.surfaces[1],spec=modes[mode];
 assert.equal(s.id,'p93-CROWN_REVERSAL-01');
 assert.equal(s.rows,31);assert.equal(s.cols,5);
 assert.equal(doc.movingObstacles.length,28);
 assert.equal(doc.surfaces.length,7);
 assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
 let changed=[],maxChange=0;
 if(mode!=='ORIGINAL'){
  for(let i=0;i<s.rows;i++){
   const u=i/30,w=gain(u);
   if(w<1e-7)continue;
   const centre=orig.points[i*5+2],outside=orig.points[i*5];
   const vec=norm([outside[0]-centre[0],0,outside[2]-centre[2]]);
   assert.ok(Math.hypot(...vec)>.99);
   for(let j=0;j<5;j++){
    const before=orig.points[i*5+j];
    // Shoulder reaches original source-real road outer v0 edge; do not
    // falsify that the original road is narrow in adjacent sections.
    const transverse=spec.kind==='outward'?(1-j/4)**2:1;
    const offset=spec.metres*w*transverse;
    const lift=spec.bank*w*(1-j/4)**2;
    const after=[before[0]+vec[0]*offset,before[1]+lift,before[2]+vec[2]*offset];
    s.points[i*5+j]=after;
    maxChange=Math.max(maxChange,Math.hypot(...after.map((v,k)=>v-before[k])));
   }
   changed.push(i);
  }
  // Recompute real stage source central route when centerline moves;
  // original surface features stay original otherwise.
  if(spec.kind==='centerline'){
   for(let k=0;k<22;k++)doc.route[22+k]=sample(s,(k+.015)/22,.5);
  }
 }
 assert.equal(JSON.stringify(base),raw,'source document mutated');
 assert.ok(eq(doc.surfaces[0],base.surfaces[0]));
 assert.ok(eq(doc.surfaces.slice(2),base.surfaces.slice(2)));
 assert.ok(eq(doc.movingObstacles,base.movingObstacles));
 assert.ok(eq(doc.spawns,base.spawns));
 assert.ok(eq(doc.surfaces[1].points.slice(0,14*5),base.surfaces[1].points.slice(0,14*5)),
  'u < .4667 original road permanently preserved');
 assert.ok(eq(doc.surfaces[1].points.slice(25*5),base.surfaces[1].points.slice(25*5)),
  'u >= 0.8333 downstream original road geometry permanently preserved');
 assert.ok(tessellate(s).degenerate===0);
 assert.ok(mode==='ORIGINAL'||(changed.length>=6&&maxChange>3));
 doc.name=base.name+' R15O '+mode+' ISOLATED PHYSICAL STUDY NOT RELEASE';
 doc.stageForge={...doc.stageForge,productionPromoted:false,
  r15oPhysicalSourceStudy:{id:'r15o-b48-curve-real-geometry-isolated',
   originalSourceBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
   road,mode,realSourceB48ChangedRows:changed,
   originalEarlyRoadRowsPreserved:true,originalAfterCurveRowsPreserved:true,
   originalP96ControlPolicyInTestOnly:true,original28B51PosesFrozenForIsolation:true,
   maxChangedMetres:round(maxChange),sourceR15OFloatParameter:{...spec},
   originalRoadSourceGeomPre:metrics(orig),studyRealRoadSourceGeomPost:metrics(s),
   physicalContactAndGameplayNotYetCertified:true,
   actualPublicWebGLRendered:false,sourceCodeEdited:false,
   art:'HOLD',gameplay:'HOLD',human:'HOLD',publish:'HOLD'}};
 const v=validate(doc);
 assert.equal(v.surfaces.length,7);assert.equal(v.movingObstacles.length,28);
 assert.equal(v.stageForge.productionPromoted,false);
 return v;
}
