/**
 * R19 A4: Blender-importable editable GLB (glTF 2.0) exported from the EXACT
 * original 7 B48/28 B51 W9-C1 geometry, not a screenshot or proxy model.
 * Vertex colors preserved and triangles are unchanged. No road collision.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {generateP101W9C1AbyssCandidate} from './p101-w9c1-abyss-narrow.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {buildR19A3IntegratedCivicCity} from './p101-r19a3-one-integrated-civic-basilica-source.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
function originalBlob(){
 const b=fs.readFileSync(path.join(root,'web/p101-w9c2-g4e7ci-integrated-streetscape.mjs'));
 return crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex');
}
export function makeR19A4GLB(mode='ultra'){
 assert.ok(['ultra','control'].includes(mode));
 assert.equal(originalBlob(),'af076d67492a677d2235e4730aef8cdf4808e106');
 const stage=generateP101W9C1AbyssCandidate(mode),before=JSON.stringify(stage);
 assert.equal(stage.surfaces.length,7);assert.equal(stage.movingObstacles.length,28);
 const design=buildR19A3IntegratedCivicCity(stage,sample,{enabled:true});
 assert.equal(JSON.stringify(stage),before);
 assert.equal(design.mode,'ONE_CIVIC_BASILICA_A5_LANDSCAPE_AND_PUBLIC_COURT');
 assert.equal(design.realVolumetricLandforms,15);
 assert.equal(design.structuralUnderpinnings,10);
 assert.equal(design.actualTerrainContactVerified,false);
 assert.ok(design.inhabitedBays>=24);
 assert.equal(design.colliders,0);
 const vertices=design.vertices,amount=vertices.length/6,lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
 const buffer=Buffer.allocUnsafe(amount*24);
 for(let i=0;i<amount;i++){
  const v=i*6;
  for(let k=0;k<3;k++){
   const p=vertices[v+k],col=vertices[v+k+3];
   assert.ok(Number.isFinite(p)&&Number.isFinite(col));
   assert.ok(col>=0&&col<=1);
   lo[k]=Math.min(lo[k],p);hi[k]=Math.max(hi[k],p);
   buffer.writeFloatLE(p,i*24+k*4);
   buffer.writeFloatLE(col,i*24+12+k*4);
  }
 }
 const editable=design.editableGroups;
 assert.equal(editable.length,5);
 assert.equal(editable[0].startTriangle,0);
 assert.equal(editable.at(-1).endTriangle,design.triangles);
 const accessors=[],meshes=[],nodes=[];
 for(const [index,g] of editable.entries()){
  if(index)assert.equal(g.startTriangle,editable[index-1].endTriangle,
   'gltf has missing or overlapping architectural faces');
  const startVertex=g.startTriangle*3,vertexCount=(g.endTriangle-g.startTriangle)*3;
  const l=[Infinity,Infinity,Infinity],h=[-Infinity,-Infinity,-Infinity];
  for(let i=startVertex;i<startVertex+vertexCount;i++)for(let k=0;k<3;k++){
   const value=vertices[i*6+k];l[k]=Math.min(l[k],value);h[k]=Math.max(h[k],value);
  }
  const p=accessors.length;
  accessors.push({bufferView:0,byteOffset:startVertex*24,componentType:5126,
   count:vertexCount,type:'VEC3',min:l,max:h});
  accessors.push({bufferView:0,byteOffset:startVertex*24+12,componentType:5126,
   count:vertexCount,type:'VEC3'});
  meshes.push({name:g.name,primitives:[{attributes:{POSITION:p,COLOR_0:p+1},
   material:index,mode:4}]});
  nodes.push({name:g.name,mesh:index});
 }
 const asset={
  asset:{version:'2.0',generator:'DOPAGAKI source-true R19A5; FIVE editable city objects; research-only preview'},
  scene:0,scenes:[{name:'R19 A5 original B48 source civic district (PRIVATE ART HOLD)',nodes:nodes.map((_,i)=>i)}],
  nodes,meshes,
  materials:editable.map((g,i)=>({
   name:'A5 editable architecture draft material '+(i+1)+' — '+g.name,
   pbrMetallicRoughness:{baseColorFactor:[1,1,1,1],
    metallicFactor:i===0?.26:i===2?.35:.09,
    roughnessFactor:i===0?.54:i===2?.43:.78},
   doubleSided:true
  })),
  buffers:[{byteLength:buffer.length}],
  bufferViews:[{buffer:0,byteOffset:0,byteLength:buffer.length,byteStride:24,target:34962}],
  accessors,
  extras:{researchOnly:true,sourceBlob:originalBlob(),sourceMode:mode,
   physicalRoadsUntouched:7,movingB51Untouched:28,collisionMeshesAdded:0,
   mainHeroCount:1,realPublicCourts:design.publicCourtyards,inhabitedBays:design.inhabitedBays,
   actualArchitectureEntranceAccessibility:'UNTESTED',materialsProductionReady:false,
   ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',RELEASE:'HOLD'}
 };
 const jsonBytes=Buffer.from(JSON.stringify(asset),'utf8');
 const jsonPadding=(4-jsonBytes.length%4)%4;
 const binPadding=(4-buffer.length%4)%4;
 const length=12+8+jsonBytes.length+jsonPadding+8+buffer.length+binPadding;
 const glb=Buffer.alloc(length);
 glb.writeUInt32LE(0x46546c67,0);glb.writeUInt32LE(2,4);glb.writeUInt32LE(length,8);
 glb.writeUInt32LE(jsonBytes.length+jsonPadding,12);glb.writeUInt32LE(0x4e4f534a,16);
 jsonBytes.copy(glb,20);
 glb.fill(0x20,20+jsonBytes.length,20+jsonBytes.length+jsonPadding);
 const offset=20+jsonBytes.length+jsonPadding;
 glb.writeUInt32LE(buffer.length+binPadding,offset);
 glb.writeUInt32LE(0x004e4942,offset+4);
 buffer.copy(glb,offset+8);
 const report={schema:'dopagaki.r19a5-city-landforms-editable-source-geometry/1',
  mode,sourceBlob:originalBlob(),vertexCount:amount,triangleCount:design.triangles,
  editableObjectCount:editable.length,editableGroupNames:editable.map(x=>x.name),
  glbBytes:glb.length,glbSHA256:hash(glb),componentType:'float32',
  actualRoadDependentGeometry:true,sourceRoads:7,sourceB51:28,colliders:0,
  inhabitedBays:design.inhabitedBays,recessedWindows:design.recessedWindows,
  mainHeroCount:design.heroBuildingCount,
  publicQuarters:design.publicCourtyards,
  deepUrbanLandforms:design.realVolumetricLandforms,
  urbanStrataDepthM:design.trueStratifiedDepthM,
  architecturalAccessSceneOnly:true,actualTerrainContactVerified:false,
  bakedSourceFacetLightOnly:true,originalStageUnchanged:true,
  productionQualityMaterials:false,ART:'HOLD',HUMAN:'HOLD'};
 return {glb,report};
}
export function verifyR19A4GLB(bytes,record){
 const g=Buffer.isBuffer(bytes)?bytes:Buffer.from(bytes);
 assert.ok(g.length>1000);
 assert.equal(g.readUInt32LE(0),0x46546c67);
 assert.equal(g.readUInt32LE(4),2);
 assert.equal(g.readUInt32LE(8),g.length);
 const jsonLen=g.readUInt32LE(12);
 assert.equal(g.readUInt32LE(16),0x4e4f534a);
 const obj=JSON.parse(g.subarray(20,20+jsonLen).toString('utf8'));
 const loc=20+jsonLen;
 assert.equal(g.readUInt32LE(loc+4),0x004e4942);
 const dataLen=g.readUInt32LE(loc);
 assert.equal(loc+8+dataLen,g.length);
 assert.equal(dataLen,obj.buffers[0].byteLength);
 assert.equal(obj.accessors.length,record.editableObjectCount*2);
 assert.equal(obj.meshes.length,record.editableObjectCount);
 assert.equal(obj.nodes.length,record.editableObjectCount);
 assert.deepEqual(obj.meshes.map(x=>x.name),record.editableGroupNames);
 assert.equal(obj.scenes[0].nodes.length,record.editableObjectCount);
 let total=0;
 for(let i=0;i<record.editableObjectCount;i++){
  const p=obj.accessors[i*2],c=obj.accessors[i*2+1],mesh=obj.meshes[i];
  assert.equal(p.count,c.count);
  assert.equal(p.type,'VEC3');assert.equal(c.type,'VEC3');
  assert.equal(p.componentType,5126);assert.equal(c.componentType,5126);
  assert.equal(mesh.primitives[0].attributes.POSITION,i*2);
  assert.equal(mesh.primitives[0].attributes.COLOR_0,i*2+1);
  assert.ok(p.count>0&&p.count%3===0);
  total+=p.count;
 }
 assert.equal(total,record.vertexCount);
 assert.equal(total/3,record.triangleCount);
 assert.equal(obj.bufferViews[0].byteStride,24);
 assert.equal(obj.materials.length,record.editableObjectCount);
 for(let i=0;i<record.editableObjectCount;i++)
  assert.equal(obj.meshes[i].primitives[0].material,i);
 assert.equal(obj.extras.sourceBlob,record.sourceBlob);
 assert.equal(obj.extras.collisonMeshesAdded,undefined);
 assert.equal(obj.extras.collisionMeshesAdded,0);
 assert.equal(obj.extras.ART,'HOLD');
 assert.equal(hash(g),record.glbSHA256);
 return true;
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 const out=path.resolve(root,process.argv[2]??'r19-evidence/r19a5');
 fs.mkdirSync(out,{recursive:true});
 for(const mode of ['ultra','control']){
  const {glb,report}=makeR19A4GLB(mode);
  assert.ok(verifyR19A4GLB(glb,report));
  fs.writeFileSync(path.join(out,'R19A5_ORIGINAL_W9C1_'+mode+'_EDITABLE_CITY.glb'),glb);
  fs.writeFileSync(path.join(out,'R19A5_'+mode+'_SOURCE_GEOMETRY.json'),
   JSON.stringify(report,null,2)+'\n');
  console.log('R19A5_ACTUAL_EDITABLE_GLB',JSON.stringify(report));
 }
}
