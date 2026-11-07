/** R38 diagnostic ONLY. Patches the generated PRIVATE renderer, never the source Game.
 * The original depth-tested renderer remains unchanged when __k4ctR38VisibilityMode is BASE.
 * OFF-FRONT screenshots are NOT gameplay, ART evidence or publishable output.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
const file='dist-private/k4ct/drive3d.mjs';
let s=fs.readFileSync(file,'utf8');
const start=" const r12Skip=window.__k4ctR12SkipGroup??null;\n";
const end=" canvas.dataset.k4ctR12SkippedGroup=r12Skip??'ALL';";
const a=s.indexOf(start),b=s.indexOf(end,a);
assert(a>0&&b>a&&s.indexOf(start,a+1)<0);
const original=s.slice(a+start.length,b);
const replacement=` const r12Skip=window.__k4ctR12SkipGroup??null;
 const r38Mode=window.__k4ctR38VisibilityMode??'BASE';
 window.__k4ctR38ActualCamera=[...view.eye,...view.front,...view.right,...view.up];
 if(r38Mode==='BASE'){
${original}
 }else{
  const authorized=['NO19','NO19_NO_WATER','NO_LOCAL','NO_LOCAL_NO_WATER','FRONT_ONLY_WATER','FRONT_NONE'];
  if(!authorized.includes(r38Mode))throw Error('Unsupported R38 temporary mode '+r38Mode);
  const mask=new Set();
  if(r38Mode.startsWith('NO19'))mask.add('19');
  if(r38Mode.startsWith('NO_LOCAL'))for(const k of ['19','03','15','16','17','20','21'])mask.add(k);
  if(r38Mode.endsWith('NO_WATER'))for(const k of ['23','24'])mask.add(k);
  const front=r38Mode.startsWith('FRONT_');
  const priorDepth=gl.isEnabled(gl.DEPTH_TEST),priorWrite=gl.getParameter(gl.DEPTH_WRITEMASK);
  if(front){gl.disable(gl.DEPTH_TEST);gl.depthMask(false);}
  let counted=0;
  for(const part of K4CT_R12_NONROAD_GROUP_SPANS){
   const id=part.name.slice(0,2),water=id==='23'||id==='24';
   if(front?(r38Mode==='FRONT_NONE'||!water):mask.has(id))continue;
   gl.drawArrays(gl.TRIANGLES,part.first,part.count);counted+=part.count/3;
  }
  if(front){gl.depthMask(priorWrite);if(priorDepth)gl.enable(gl.DEPTH_TEST);else gl.disable(gl.DEPTH_TEST);}
  canvas.dataset.k4ctR38DrawTriangles=String(counted);
 }
 canvas.dataset.k4ctR38ProbeMode=r38Mode;
`;
s=s.slice(0,a)+replacement+s.slice(b);
fs.writeFileSync(file,s);
assert(s.includes('canvas.dataset.k4ctR38ProbeMode=r38Mode;'));
console.log('R38_PRIVATE_SOURCE_RENDER_INSTRUMENTED_NO_PHYSICS_CAMERA_OR_PROTECTED_DCC_EDITS');
