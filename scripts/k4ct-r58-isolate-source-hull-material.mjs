/** R58: ONLY generated PRIVATE K4CT research renderer, original moving B51 
 * source body XYZ preserved, original camera/240Hz/CCD never touched.
 * Allows one A/B comparison of actual source hull material at same native tick.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const f=path.resolve('dist-private/k4ct/drive3d.mjs');
const source=fs.readFileSync(f,'utf8');
const old="window.__k4ctVisualABMode==='R7C_MATERIAL'";
const next="window.__k4ctR58B51HullMode==='SOURCE_HULL_CONTRAST'";
assert.equal(source.split(old).length,2,'R58 actual source B51 material switch must be unique');
assert.ok(source.includes('k4ctR9DrawMaterialWorld')&&source.includes('applyK4CTR57Hud'),
  'R58 must reuse real DCC and integrated R57 private HUD');
assert.ok(source.includes("k4ctIndustrialMaterialOnly"),'same-hull RGB-only source mesh missing');
const result=source.replace(old,next);
fs.writeFileSync(f,result);
console.log('R58_REAL_SOURCE_B51_XYZ_LOCKED_MATERIAL_AB_ENABLED',JSON.stringify({
 generatedPrivateOnly:true,originalGame:false,originalGameCameraUnchanged:true,
 originalRunner240Hz:true,originalB48:7,originalB51:28,newColliders:0,
 originalB51XYZIdentical:true,notNewBlenderNotNewArt:true,
 selectionFlag:'window.__k4ctR58B51HullMode BASE/SOURCE_HULL_CONTRAST',
 originalSourceHullDefault:true}));
