/**
 * G4E-7BP / ART-FIRST ASSET INTAKE — NEVER RENDER OR AUTO-PROMOTE.
 *
 * Independent binary GLB admission audit for hand-authored model candidates.
 * Unlike the restrictive BK prototype, artist GLBs may contain multiple
 * meshes, textured PBR materials and glTF node hierarchies. Reading/approving
 * the asset is intentionally separate from running it in the physics game.
 *
 * This tool does not establish authorship, licensing, visual fidelity or
 * compatibility with the current legacy WebGL renderer.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';

const strict=(condition,message)=>{if(!condition)throw Error('G4E-7BP '+message);};
const uint=(dv,o)=>dv.getUint32(o,true);
const MAX_BYTES=48*1024*1024;
const repr=(x)=>Number(x.toFixed(3));
const identity=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
const eq=(a,b)=>a.every((v,i)=>v===b[i]);
const finite=(a)=>Array.isArray(a)&&a.every(Number.isFinite);
const allowedRights=new Set(['original-work','appropriately-licensed-third-party']);
const cleanName=x=>typeof x==='string'&&x.length>2&&x.length<=256&&x.trim().length===x.length;
export function auditArtistGLB(input,claim){
 const bytes=Buffer.isBuffer(input)?input:Buffer.from(input);
 strict(bytes.byteLength>=32&&bytes.byteLength<=MAX_BYTES,'invalid GLB binary size');
 const dv=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 strict(uint(dv,0)===0x46546c67&&uint(dv,4)===2&&uint(dv,8)===bytes.byteLength,
  'requires correctly sized binary glTF2');
 let offset=12,json=null,binary=null;
 while(offset+8<=bytes.byteLength){
  const len=uint(dv,offset),kind=uint(dv,offset+4);offset+=8;
  strict(len>=4&&len%4===0&&offset+len<=bytes.byteLength,'invalid GLB chunk');
  if(kind===0x4e4f534a){
   strict(!json,'duplicate JSON chunk');
   json=JSON.parse(bytes.subarray(offset,offset+len).toString('utf8').trim());
  }else if(kind===0x004e4942){
   strict(!binary,'duplicate BIN chunk');
   binary=bytes.subarray(offset,offset+len);
  }else throw Error('G4E-7BP unsupported GLB extension chunk');
  offset+=len;
 }
 strict(offset===bytes.byteLength&&json&&binary&&json.asset?.version==='2.0',
  'binary glTF 2.0 with JSON and BIN required');
 strict(Array.isArray(json.buffers)&&json.buffers.length===1&&!json.buffers[0].uri&&
  json.buffers[0].byteLength<=binary.length,'all buffer bytes must be embedded');
 for(const im of json.images||[])
  strict(!im.uri&&Number.isInteger(im.bufferView)&&!!json.bufferViews?.[im.bufferView],
   'all image textures must be embedded as GLB buffer views, never fetched remotely');
 for(const texture of json.textures||[])
  strict(Number.isInteger(texture.source)&&!!json.images?.[texture.source],
   'texture must resolve to embedded GLB image');
 strict(!json.extensionsRequired?.some(x=>/draco|meshopt|basisu|texture_avif/i.test(x)),
  'compressed formats require a separate renderer capability review');
 strict(Array.isArray(json.meshes)&&json.meshes.length>=1&&
  Array.isArray(json.nodes)&&json.nodes.length>=1,'requires real scene mesh and nodes');
 strict(Array.isArray(json.materials)&&json.materials.length>=1,
  'requires PBR material definition (not just unnamed debug triangles)');
 strict(claim&&typeof claim==='object','must provide explicit provenance manifest');
 strict(/^[a-z0-9][a-z0-9-]{7,79}$/.test(claim.assetId||''),
  'assetId must be stable lowercase kebab-case');
 strict(cleanName(claim.author)&&cleanName(claim.sourceTool)&&cleanName(claim.sourceFile),
  'human source author, modelling program, original file must be declared');
 strict(allowedRights.has(claim.rights),'rights must be original-work or appropriately-licensed-third-party');
 if(claim.rights==='appropriately-licensed-third-party')
  strict(cleanName(claim.licenseName)&&cleanName(claim.licenseEvidence),
   'third-party requires documented license and source evidence');
 strict(claim.unitsMetersPerUnit===1&&claim.coordinateSystem==='glTF-Y-UP',
  'requires explicit meter scale and GLB native Y-up coordinate convention');
 strict(claim.reviewStatus==='HOLD'&&claim.publicationStatus==='HOLD',
  'artist intake cannot grant art/release approvals');
 const bv=json.bufferViews||[],accessors=json.accessors||[];
 const readAccessor=(id,kind)=>{
  const a=accessors[id],v=bv[a?.bufferView];
  strict(a&&v&&a.type===kind&&a.componentType===5126&&Number.isInteger(a.count)&&
   a.count>=3&&a.count<=2000000&&a.sparse===undefined,
   'supports explicit float3 geometry accessors only for POSITION');
  strict(v.buffer===0&&Number.isInteger(v.byteLength)&&Number.isInteger(v.byteOffset||0)&&
   (v.byteOffset||0)>=0,'accessor buffer view outside embedded BIN');
  const stride=v.byteStride||12,begin=(v.byteOffset||0)+(a.byteOffset||0);
  strict(stride>=12&&stride%4===0&&begin%4===0&&
   begin+12+(a.count-1)*stride<=(v.byteOffset||0)+v.byteLength&&
   begin+12+(a.count-1)*stride<=binary.length,'accessor memory footprint invalid');
  const b=new DataView(binary.buffer,binary.byteOffset+begin,binary.length-begin);
  const mins=[Infinity,Infinity,Infinity],maxs=[-Infinity,-Infinity,-Infinity];
  for(let i=0;i<a.count;i++)for(let k=0;k<3;k++){
   const val=b.getFloat32(i*stride+k*4,true);
   strict(Number.isFinite(val),'nonfinite geometry coordinate');
   mins[k]=Math.min(mins[k],val);maxs[k]=Math.max(maxs[k],val);
  }
  return {count:a.count,min:mins,max:maxs};
 };
 let primitives=0,triangles=0,facesWithMaterial=0,vertexPositions=0;
 const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
 for(const mesh of json.meshes){
  strict(Array.isArray(mesh.primitives)&&mesh.primitives.length>0,'empty 3D mesh');
  for(const prim of mesh.primitives){
   strict((prim.mode??4)===4&&Number.isInteger(prim.attributes?.POSITION),
    'only authored triangle primitives are admitted');
   const p=readAccessor(prim.attributes.POSITION,'VEC3');
   let faceVertices=p.count;
   if(prim.indices!==undefined){
    const a=accessors[prim.indices],v=bv[a?.bufferView];
    strict(a&&v&&a.type==='SCALAR'&&[5121,5123,5125].includes(a.componentType)&&
     a.count>0&&a.count%3===0&&a.sparse===undefined,
     'unsupported index buffer');
    const width=a.componentType===5121?1:a.componentType===5123?2:4,
     begin=(v.byteOffset||0)+(a.byteOffset||0),stride=v.byteStride||width;
    strict(begin>=0&&stride>=width&&
     begin+width+(a.count-1)*stride<=(v.byteOffset||0)+v.byteLength&&
     begin+width+(a.count-1)*stride<=binary.length,
     'indices out of GLB buffer range');
    const d=new DataView(binary.buffer,binary.byteOffset+begin,binary.length-begin);
    for(let i=0;i<a.count;i++){
     const at=i*stride,idx=width===1?d.getUint8(at):width===2?d.getUint16(at,true):d.getUint32(at,true);
     strict(idx<p.count,'mesh triangle index out of vertex range');
    }
    faceVertices=a.count;
   }
   strict(faceVertices%3===0,'triangle primitive must be complete');
   strict(Number.isInteger(prim.material)&&!!json.materials[prim.material],
    'every primitive must declare a material');
   for(let k=0;k<3;k++){
    min[k]=Math.min(min[k],p.min[k]);
    max[k]=Math.max(max[k],p.max[k]);
   }
   primitives++;triangles+=faceVertices/3;vertexPositions+=p.count;facesWithMaterial++;
  }
 }
 const extra=json.nodes.some(n=>!(!n.matrix&&!n.translation&&!n.rotation&&!n.scale)||
  (n.matrix&&!eq(n.matrix,identity)));
 const dims=max.map((v,i)=>repr(v-min[i]));
 const warnings=[];
 if(!json.images?.length)warnings.push('NO_EMBEDDED_TEXTURES: geometrical prototype only until materials independently inspected');
 if(triangles<3000)warnings.push('LOW_GEOMETRY_COMPLEXITY: silhouette, usable human scale and materials need dedicated art QA');
 if(extra)warnings.push('NODE_TRANSFORMS: local mesh bounds are NOT world-space bounds; separate transform-baking/placement proof required');
 if(Math.max(...dims)>4000)warnings.push('LOCAL_SPAN_ABOVE_4KM: verify intended meters rather than accidental import scale');
 if(json.animations?.length)warnings.push('ANIMATIONS_PRESENT: no current gameplay renderer support established');
 if(json.extensionsRequired?.length)warnings.push('EXTENSIONS_REQUIRED: verify independent runtime support');
 return {
  schema:'dopagaki.g4e7bp-artist-glb-intake/1',
  assetId:claim.assetId,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),
  provenanceClaim:{author:claim.author,sourceTool:claim.sourceTool,
   sourceFile:claim.sourceFile,rights:claim.rights,
   licenseName:claim.licenseName||null,licenseEvidence:claim.licenseEvidence||null,
   verification:'SELF_DECLARED_NOT_INDEPENDENTLY_VERIFIED'},
  glb:{bytes:bytes.length,meshes:json.meshes.length,nodes:json.nodes.length,
   triangles,primitives,vertexPositions,materials:json.materials.length,
   embeddedTextures:json.images?.length||0,textureRefs:json.textures?.length||0,
   meshLocalAABB:{min:min.map(repr),max:max.map(repr),span:dims},
   possibleNodeTransforms:extra,facesWithMaterial},
  warnings,realCameraWebGLProof:'NOT_YET_RUN',
  humanVisualReview:'HOLD',physicalRoadQA:'UNCHANGED_UNTESTED_BY_INTAKE',
  publicRelease:'FORBIDDEN',mergeApproval:'HOLD',
  officialSlope2CertifiedMeters:0,
  admission:'METADATA_AND_BINARY_CONTRACT_ONLY_NOT_ART_PASS'
 };
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const [file,manifest,output]=process.argv.slice(2);
 if(!file||!manifest)throw Error('Usage: node scripts/p101-w9c2-g4e7bp-artist-asset-intake.mjs model.glb provenance.json [output.json]');
 const report=auditArtistGLB(fs.readFileSync(file),JSON.parse(fs.readFileSync(manifest,'utf8')));
 if(output)fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
 else console.log(JSON.stringify(report,null,2));
}
