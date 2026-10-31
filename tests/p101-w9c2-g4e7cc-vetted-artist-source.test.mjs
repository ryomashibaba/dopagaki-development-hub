import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {evaluateSources,examineAcquiredBinary} from '../scripts/p101-w9c2-g4e7cc-vetted-artist-source.mjs';
const original=JSON.parse(fs.readFileSync('docs/G4E7CC_VERIFIED_ARCHITECTURE_SOURCES.json','utf8'));
const clone=()=>structuredClone(original);
test('CC source discovery registers ONE urban-block lead and genuine acknowledged download blocker',()=>{
 const x=evaluateSources(original);
 assert.equal(x.sourceListingCount,3);
 assert.equal(x.fullyAuthenticatedGLB,0);
 assert.equal(x.selectedListing.id,'sketchfab-tomato3-futuristic-buildings');
 assert.equal(x.gameIntegration,'FORBIDDEN');
 assert.equal(x.officialSlope2Meters,0);
 assert.ok(x.blockers.some(y=>y.includes('authenticated')));
});
test('CC explicitly rejects NC/unsupported or preview-only source posing as actual asset',()=>{
 const x=clone();x.candidates[0].listingLicense='CC Attribution-NonCommercial';
 assert.throws(()=>evaluateSources(x),/license\/author\/listing/);
 const y=clone();y.candidates[0].binarySha256='not-a-real-sha';
 assert.throws(()=>evaluateSources(y),/listing masqueraded/);
 const z=clone();z.art='PASS';assert.throws(()=>evaluateSources(z),/protected source registry/);
});
test('CC does not allow old rejected CA GLB to masquerade as the new authorized human made asset',()=>{
 const bytes=fs.readFileSync('artifacts/private/g4e7ca-rift-exchange/G4E7CA_RIFT_EXCHANGE_ART_ONLY.glb');
 assert.throws(()=>examineAcquiredBinary(original,original.preferred,bytes,{}),/SHA256 not independently verified/);
 assert.throws(()=>examineAcquiredBinary(original,original.preferred,bytes,{
  sourcePage:original.candidates[0].sourcePage,creator:original.candidates[0].author,
  archiveComplete:false,licenseVerifiedFromOfficialDownload:false,
  licenseVersion:'CC BY 4.0',sha256:'xyz'}),/SHA256 not independently verified/);
});
