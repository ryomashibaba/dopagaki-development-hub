/**
 * G4E-7CF Read-only source proof on ORIGINAL BG 240Hz camera.
 * Only actual GLB is tested. Never implies ART, WEBGL or rights PASS.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import {nativeAssetPreflight} from './p101-w9c2-g4e7cb-native-asset-preflight.mjs';
import {g4e7bgNativeFrames} from './p101-w9c2-g4e7bg-native-visual-frames.mjs';

export function inventory(b) {
 if (!Buffer.isBuffer(b)||b.length<32||b.toString('ascii',0,4)!=='glTF'||
     b.readUInt32LE(4)!==2||b.readUInt32LE(8)!==b.length||
     b.readUInt32LE(16)!==0x4e4f534a)throw Error('AUTHENTIC_GLTF2_BINARY_REQUIRED');
 const size=b.readUInt32LE(12);
 if(size<=2||size>8e6||size+20>b.length)throw Error('INVALID_GLB_JSON_LENGTH');
 const j=JSON.parse(b.subarray(20,20+size).toString('utf8').trim());
 if(j.asset?.version!=='2.0')throw Error('GLTF2_REQUIRED');
 return {
  generator:j.asset.generator??null,
  sceneCount:j.scenes?.length??0,meshCount:j.meshes?.length??0,
  materialCount:j.materials?.length??0,textureCount:j.textures?.length??0,
  images:(j.images??[]).map((x,i)=>({
    index:i,mimeType:x.mimeType??null,name:x.name??null,
    embedded:Number.isInteger(x.bufferView),externalURI:typeof x.uri==='string'
  })),
  extensionsUsed:j.extensionsUsed??[],extensionsRequired:j.extensionsRequired??[]
 };
}
export function audit(bytes,native=g4e7bgNativeFrames()) {
 const report={
  schema:'dopagaki.g4e7cf-one-real-source-private-camera-audit/1',
  source:'SpectraStudios/SourceCityToolkit_glb',
  file:'Market_Day.glb',upstreamGitCommit:'4db7cf1aecba9bbc011d153d6d923a0cb4ac9d9d',
  upstreamGitBlob:'ee3334d9f13f63e38a1f813eee8eb9e7c720b4e1',
  bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),
  materialRights:'UNVERIFIED_THIRD_PARTY_TEXTURES_COM_EXCEPTION',
  originalBinary:'TEMPORARY_CI_ONLY_NOT_REPUBLISHED',
  art:'NOT_TESTED',human:'HOLD',webgl:'NOT_TESTED',publish:'FORBIDDEN',
  ready:'HOLD',merge:'HOLD',formalSlope2Meters:0,
  physics:'UNMODIFIED_240HZ_7_ROADS_28_MOVING_GAP52',
  camera:'EXISTING_BG_ORIGINAL_NATIVE_SCRIPTED_NOT_HUMAN',
  placements:[]
 };
 if(bytes.length!==17786532)throw Error('UNEXPECTED_ORIGINAL_BINARY_SIZE');
 report.inventory=inventory(bytes);
 for(const proposal of [
  {anchorDepth:200,xField:-0.65,yField:.1},
  {anchorDepth:320,xField:-0.55,yField:.15},
  {anchorDepth:450,xField:-0.55,yField:.2},
  {anchorDepth:660,xField:-0.55,yField:.2},
  {anchorDepth:320,xField:.7,yField:.15}
 ]) {
  try {
   const x=nativeAssetPreflight(bytes,native,proposal);
   report.model=x.model;
   report.placements.push({
     proposal,flags:x.flags,
     views:x.views.map(v=>({
       road:v.road,frame:v.frame,speedMps:v.speedMps,
       visibleFraction:v.visibleFraction,
       screenWidthFraction:v.screenWidthFraction,
       screenBoxFraction:v.screenBoxFraction,
       roadWindowCornerFraction:v.roadWindowCornerFraction
     }))
   });
  } catch(e) {
   report.placements.push({proposal,error:String(e.message)});
   break;
  }
 }
 report.technicalResult=report.placements.length===5&&
  report.placements.every(p=>!p.error)?'GEOMETRY_PROJECTED_ONLY_NOT_ART_PASS':
  'GLB_PREFLIGHT_UNRESOLVED';
 return report;
}
if(process.argv[1]?.endsWith('p101-w9c2-g4e7cf-spectra-source-preflight.mjs')){
 const [input,output]=process.argv.slice(2);
 if(!input||!output)throw Error('Missing GLB and JSON output');
 const result=audit(fs.readFileSync(input));
 fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({
  sourceSha256:result.sha256,technicalResult:result.technicalResult,
  meshes:result.inventory.meshCount,
  placements:result.placements.map(p=>({
   proposal:p.proposal,
   maxWidth:p.views?Math.max(...p.views.map(v=>v.screenWidthFraction)):null,
   flags:p.flags,error:p.error
  })),
  disclaimer:'NOT_WEBGL_NOT_ART_PASS_RIGHTS_HOLD'
 }));
}