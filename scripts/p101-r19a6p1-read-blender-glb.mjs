/** R19 A6 P1: independent strict Blender glTF2 GLB indexed/TRS importer.
 * NO arbitrary remote user asset. Only the in-CI source-pinned Blender GLB.
 * Flattens evaluated editable GLB into original WebGL2 XYZRGB float32.
 * PBR/material rendering is NOT implemented; this is vertex-color art preview.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {makeR19A4GLB} from './p101-r19a4-export-editable-source-city-glb.mjs';
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const identity=()=>[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
function multiply(a,b){
 const out=new Array(16).fill(0);
 for(let c=0;c<4;c++)for(let row=0;row<4;row++)
  for(let k=0;k<4;k++)out[c*4+row]+=a[k*4+row]*b[c*4+k];
 return out;
}
function nodeMatrix(n){
 if(n.matrix){assert.equal(n.matrix.length,16);return n.matrix;}
 const [x,y,z,w]=n.rotation||[0,0,0,1];
 assert.ok(Math.abs(x*x+y*y+z*z+w*w-1)<.02,'bad node quaternion');
 const [sx,sy,sz]=n.scale||[1,1,1];const [tx,ty,tz]=n.translation||[0,0,0];
 assert.ok([sx,sy,sz,tx,ty,tz].every(Number.isFinite));
 return [
  (1-2*(y*y+z*z))*sx,2*(x*y+z*w)*sx,2*(x*z-y*w)*sx,0,
  2*(x*y-z*w)*sy,(1-2*(x*x+z*z))*sy,2*(y*z+x*w)*sy,0,
  2*(x*z+y*w)*sz,2*(y*z-x*w)*sz,(1-2*(x*x+y*y))*sz,0,
  tx,ty,tz,1
 ];
}
function point(m,p){
 const w=m[3]*p[0]+m[7]*p[1]+m[11]*p[2]+m[15];
 assert.ok(Math.abs(w)>.1);
 return [
 (m[0]*p[0]+m[4]*p[1]+m[8]*p[2]+m[12])/w,
 (m[1]*p[0]+m[5]*p[1]+m[9]*p[2]+m[13])/w,
 (m[2]*p[0]+m[6]*p[1]+m[10]*p[2]+m[14])/w
 ];
}
export function unpackBlenderEditedGLB(bytes,manifest){
 const bin=Buffer.isBuffer(bytes)?bytes:Buffer.from(bytes);
 assert.equal(sha(bin),manifest.edited_glb_sha256,'edited Blender GLB SHA drift');
 assert.ok(bin.length>100_000&&bin.length<25_000_000,'untrusted GLB size');
 assert.equal(bin.readUInt32LE(0),0x46546c67);assert.equal(bin.readUInt32LE(4),2);
 assert.equal(bin.readUInt32LE(8),bin.length);
 const jsonLength=bin.readUInt32LE(12);assert.equal(bin.readUInt32LE(16),0x4e4f534a);
 const json=JSON.parse(bin.subarray(20,20+jsonLength).toString('utf8'));
 const start=20+jsonLength;
 assert.equal(bin.readUInt32LE(start+4),0x004e4942);
 const dataOffset=start+8;
 const actualLength=bin.readUInt32LE(start);
 assert.equal(dataOffset+actualLength,bin.length);
 assert.equal(json.buffers.length,1);assert.equal(json.buffers[0].uri,undefined);
 assert.ok(json.buffers[0].byteLength<=actualLength);
 assert.equal(json.scene!==undefined,true);
 assert.equal(json.scenes.length,1);
 assert.ok((json.extensionsRequired||[]).length===0,'glTF extensions cannot bypass QA');
 assert.equal(json.skins?.length||0,0);assert.equal(json.animations?.length||0,0);
 assert.ok(json.nodes.length<=40&&json.meshes.length>=5&&json.meshes.length<=10);
 const bytesPer={5120:1,5121:1,5122:2,5123:2,5125:4,5126:4};
 const readValue=(accessor,at,channel)=>{
  const view=json.bufferViews[accessor.bufferView];
  assert.equal(view.buffer||0,0);
  const type=accessor.componentType,bpe=bytesPer[type];
  assert.ok(bpe);
  const count={SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[accessor.type];assert.ok(count);
  const stride=view.byteStride||count*bpe;
  assert.ok(stride>=count*bpe&&stride%4===0||!view.byteStride);
  const offset=dataOffset+(view.byteOffset||0)+(accessor.byteOffset||0)+at*stride+channel*bpe;
  assert.ok(offset>=dataOffset&&offset+bpe<=dataOffset+json.buffers[0].byteLength);
  let n;
  if(type===5126)n=bin.readFloatLE(offset);
  else if(type===5125)n=bin.readUInt32LE(offset);
  else if(type===5123)n=bin.readUInt16LE(offset);
  else if(type===5122)n=bin.readInt16LE(offset);
  else if(type===5121)n=bin.readUInt8(offset);
  else n=bin.readInt8(offset);
  if(accessor.normalized){
   if(type===5121)n/=255;
   else if(type===5123)n/=65535;
   else if(type===5120)n=Math.max(-1,n/127);
   else if(type===5122)n=Math.max(-1,n/32767);
  }
  return n;
 };
 function values(id,index){
  const a=json.accessors[id];assert.ok(a&&a.bufferView!==undefined);
  assert.equal(a.sparse,undefined);
  assert.ok(index>=0&&index<a.count);
  const length={SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[a.type];
  return Array.from({length},(_,i)=>readValue(a,index,i));
 }
 let visited=new Set(),meshInstances=0,triangles=0,nonFinite=0;
 const vertex=[];const usedNames=[];
 function traverse(id,parent,depth){
  assert.ok(depth<8,'unexpected nested scene');
  assert.ok(id>=0&&id<json.nodes.length&&!visited.has(id),'duplicate/cyclic source node');
  visited.add(id);
  const n=json.nodes[id],matrix=multiply(parent,nodeMatrix(n));
  if(n.mesh!==undefined){
   meshInstances++;
   assert.ok(meshInstances<=5,'more than five edited architectural districts');
   const mesh=json.meshes[n.mesh];assert.ok(mesh);
   usedNames.push(n.name||mesh.name||'no-name');
   for(const primitive of mesh.primitives){
    assert.equal(primitive.mode??4,4,'non-triangle render geometry');
    assert.equal(primitive.targets,undefined,'morph targets are not allowed');
    const posIdx=primitive.attributes.POSITION,colorIdx=primitive.attributes.COLOR_0;
    assert.ok(Number.isInteger(posIdx)&&Number.isInteger(colorIdx),'missing REAL glTF colors or positions');
    const p=json.accessors[posIdx],c=json.accessors[colorIdx];
    assert.equal(p.type,'VEC3');assert.ok(['VEC3','VEC4'].includes(c.type));
    assert.equal(p.componentType,5126);assert.equal(p.count,c.count);
    const order=primitive.indices!==undefined?Array.from({length:json.accessors[primitive.indices].count},
      (_,i)=>values(primitive.indices,i)[0]):Array.from({length:p.count},(_,i)=>i);
    assert.ok(order.length>0&&order.length%3===0);
    for(const idx of order){
     assert.ok(Number.isInteger(idx)&&idx>=0&&idx<p.count);
     const xyz=point(matrix,values(posIdx,idx)),rgb=values(colorIdx,idx).slice(0,3);
     assert.ok(xyz.every(v=>Number.isFinite(v)&&Math.abs(v)<1e6));
     assert.ok(rgb.every(v=>Number.isFinite(v)&&v>=0&&v<=1));
     vertex.push(...xyz,...rgb);
    }
    triangles+=order.length/3;
   }
  }
  for(const child of n.children||[])traverse(child,matrix,depth+1);
 }
 for(const i of json.scenes[json.scene].nodes)traverse(i,identity(),0);
 assert.equal(meshInstances,5,'real five-district group count changed');
 assert.ok(triangles>manifest.source_faces&&triangles<50000,
  'edited city must contain real new sculpture, without uncontrolled inflation');
 assert.equal(vertex.length,triangles*18);
 assert.equal(manifest.editable_districts,5);
 assert.equal(manifest.new_colliders,0);
 assert.equal(manifest.ART,'HOLD');
 assert.equal(manifest.mode==='ultra'||manifest.mode==='control',true);
 const gpu=new Float32Array(vertex);
 assert.ok(gpu.every(Number.isFinite));
 return {vertices:gpu,triangles,meshInstances,usedNames,
  editedGLBSHA256:sha(bin),ART:'HOLD',HUMAN:'HOLD',GAMEPLAY:'HOLD',
  PBRimplemented:false,collisionMeshesAdded:0};
}
export function verifySourceOfBlenderEdit(manifest){
 assert.ok(manifest&&['ultra','control'].includes(manifest.mode));
 const {report}=makeR19A4GLB(manifest.mode);
 assert.equal(manifest.source_glb_sha256,report.glbSHA256,'edited Blender base is NOT original source A5 GLB');
 assert.equal(report.sourceBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
 assert.ok(manifest.added_faces>100);
 assert.equal(manifest.editable_districts,5);
 assert.equal(manifest.ART,'HOLD');
 assert.equal(manifest.new_colliders,0);
 return true;
}
if(import.meta.url===new URL('file://'+process.argv[1]).href){
 const [sourceFile,reportFile,outFile]=process.argv.slice(2);
 assert.ok(sourceFile&&reportFile&&outFile);
 const data=JSON.parse(fs.readFileSync(reportFile,'utf8'));
 assert.equal(verifySourceOfBlenderEdit(data),true);
 const out=unpackBlenderEditedGLB(fs.readFileSync(sourceFile),data);
 fs.writeFileSync(outFile,Buffer.from(out.vertices.buffer));
 console.log('R19A6P1_INDEXED_BLENDER_GLB_TO_NATIVE_GPU',JSON.stringify({
  mode:data.mode,triangles:out.triangles,meshInstances:out.meshInstances,
  sourceSHA:data.source_glb_sha256,editedSHA:data.edited_glb_sha256,
  ART:'HOLD',physicalUnchanged:true}));
}
