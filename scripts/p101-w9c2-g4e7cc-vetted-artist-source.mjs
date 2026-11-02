/**
 * G4E-7CC — VETTED SOURCE INTAKE, NOT A NEW CITY GENERATOR.
 * Guard against repeating BX -> BY -> BZ -> CA art failures.
 * Public listings != acquired models; geometric acceptance is separately
 * tested via CB native 240Hz camera and real WebGL.
 * Never scrape Sketchfab viewer or bypass auth.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {sceneCorners,nativeAssetPreflight} from './p101-w9c2-g4e7cb-native-asset-preflight.mjs';
import {g4e7bgNativeFrames} from './p101-w9c2-g4e7bg-native-visual-frames.mjs';
const fail=(m)=>{throw Error('G4E-7CC '+m)};
export function evaluateSources(m){
 if(m?.schema!=='dopagaki.g4e7cc-attributed-hero-architecture-source-review/1'||
   m.original240Hz!=='UNCHANGED'||m.publicRelease!=='FORBIDDEN'||
   m.formalSlope2Meters!==0||m.art!=='NOT_TESTED'||!Array.isArray(m.candidates))
  fail('protected source registry schema, status or physics changed');
 const ids=new Set(),ranking=[];
 for(const a of m.candidates){
  if(ids.has(a.id)||!/^sketchfab-[a-z0-9-]+$/.test(a.id)||!Number.isFinite(a.rank))
   fail('unique and ranked canonical source required');
  ids.add(a.id);
  if(!a.sourcePage.startsWith('https://sketchfab.com/3d-models/')||
     !/^([0-9a-f]{32})$/.test(a.uid)||
     !a.sourcePage.endsWith(a.uid)||a.trianglesListed<=0||
     a.listingLicense!=='CC Attribution'||a.attributionRequired!==true)
    fail('official license/author/listing statement must be preserved');
  if(a.binarySha256!==null||a.evidenceState!=='CREATOR_LISTING_ONLY_BINARY_NOT_ACQUIRED'||
     a.artState!=='VISUAL_NOT_VERIFIED'||!a.access.includes('AUTHENTICATED_'))
    fail('listing masqueraded as an actual acquired/visualized asset');
  ranking.push({id:a.id,rank:a.rank,role:a.role,author:a.author,
   listingTriangles:a.trianglesListed,source:a.sourcePage,
   binary:'NOT_ACQUIRED',licensedBinary:'NOT_INDEPENDENTLY_VERIFIED'});
 }
 ranking.sort((a,b)=>a.rank-b.rank);
 if(ranking[0]?.id!==m.preferred||ranking.length!==3||
    !Array.isArray(m.hardGates)||m.hardGates.length<5)
  fail('one constrained selected candidate, no indefinite shortlist expansion');
 return {schema:'dopagaki.g4e7cc-source-discovery-report/1',
   selectedListing:ranking[0],supportingListings:ranking.slice(1),
   fullyAuthenticatedGLB:0,sourceListingCount:ranking.length,
   pipeline:'SOURCE_DISCOVERY_ONLY_RIGHTS_PBR_GEOMETRY_UNTESTED',
   next:'REQUIRE_OFFICIALLY_AUTHORIZED_BINARY_AND_TEXTURES_BEFORE_GLTF_AND_CB_CHECK',
   blockers:['Sketchfab official downloads require authenticated account',
    'No verifiable source GLB bytes for any preferred human-designed city building',
    'No texture/quality/real-B48-camera screenshot evidence yet'],
   human:'HOLD',art:'NOT_TESTED',gameIntegration:'FORBIDDEN',
   officialSlope2Meters:0};
}
/** Evaluate REAL file only once permissions, license and binary SHA were
 * independently supplied. A filename or listing never authorizes this step.
 * Even then, only TECH + FRUSTUM diagnostics, NEVER art approval. */
export function examineAcquiredBinary(m,candidateId,bytes,certificate){
 evaluateSources(m);
 const row=m.candidates.find(a=>a.id===candidateId);
 if(!row)fail('not approved source candidate');
 if(!Buffer.isBuffer(bytes)||bytes.byteLength<1000||bytes.byteLength>48*1024*1024)
  fail('actual complete and size-bounded GLB is required');
 const digest=crypto.createHash('sha256').update(bytes).digest('hex');
 if(certificate?.sourcePage!==row.sourcePage||
    certificate?.creator!==row.author||
    certificate?.licenseVerifiedFromOfficialDownload!==true||
    certificate?.archiveComplete!==true||
    certificate?.sha256!==digest||
    typeof certificate?.licenseVersion!=='string'||!certificate.licenseVersion.startsWith('CC BY'))
  fail('creator, original archive rights, CC BY license version and SHA256 not independently verified');
 const geometry=sceneCorners(bytes),native=nativeAssetPreflight(bytes,g4e7bgNativeFrames());
 return {candidateId,sourceSha256:digest,
   gltfWorldAABB:geometry.model.worldAABB,modelMeshes:geometry.model.meshInstances,
   assessment:'TECH_AND_NATIVE_FRUSTUM_ONLY_NEEDS_ORIGINAL_GAME_WEBGL',
   runtime:native,art:'NOT_TESTED',publication:'FORBIDDEN'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const args=process.argv.slice(2);
 const m=JSON.parse(fs.readFileSync(args[0]||'docs/G4E7CC_VERIFIED_ARCHITECTURE_SOURCES.json','utf8'));
 const report=evaluateSources(m),s=JSON.stringify(report,null,2)+'\n';
 if(args[1])fs.writeFileSync(args[1],s);else process.stdout.write(s);
}
