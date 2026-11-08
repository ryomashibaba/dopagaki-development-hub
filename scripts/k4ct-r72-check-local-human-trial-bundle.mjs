/** R72: only validate the local click-to-handover experiment with real
 * Chromium/WebGL2/240Hz. NO fake human performance/avoidance certification.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const root=path.resolve('test-results/k4ct-r72-human-trial-bundle');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'R72_PACKAGE_MANIFEST.json'),'utf8'));
assert.equal(manifest.trueOriginal240HzStage,'K4CT-TWO-REAL-B51-CHOICE');
assert.equal(manifest.originalB48,7);assert.equal(manifest.originalB51,28);
assert.equal(manifest.newColliders,0);
assert.equal(manifest.HUMAN,'HOLD');
assert.equal(manifest.launchTestedOnWindows,false);
const evidenceRoot=path.resolve('test-results/k4ct-r72-bundle-native-smoke');
fs.mkdirSync(evidenceRoot,{recursive:true});
let browser,ctx;
const errors=[];
await new Promise((done,fail)=>server.once('error',fail).listen(0,'127.0.0.1',done));
try{
 const url='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,args:[
  '--use-gl=angle','--use-angle=swiftshader','--enable-webgl',
  '--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 ctx=await browser.newContext({viewport:{width:1365,height:930},acceptDownloads:true});
 const page=await ctx.newPage();
 page.on('pageerror',e=>errors.push(String(e.message)));
 await page.goto(url+'/k4ct/?k4ct=on&stage=K4CT-TWO-REAL-B51-CHOICE',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>{
  const c=document.getElementById('view');
  return c?.dataset.r15s3d10OriginalGame==='REAL_WEBGL2_SOURCE_240HZ' &&
    document.getElementById('stage')?.value==='K4CT-TWO-REAL-B51-CHOICE' &&
    document.getElementById('r72-start-manual')!=null;
 },null,{timeout:90000});
 const trueGL=await page.locator('#view').evaluate(c=>c.getContext('webgl2') instanceof WebGL2RenderingContext);
 assert.ok(trueGL,'not genuine source WebGL2');
 await page.locator('#r72-start-manual').click();
 await page.waitForFunction(()=>{
  const c=document.getElementById('view');
  return c?.dataset.k4csControlMode==='ORIGINAL_MANUAL_UNCERTIFIED' &&
    c.dataset.r15s3d10OriginalGame==='REAL_WEBGL2_SOURCE_240HZ';
 },null,{timeout:110000});
 const runtime=await page.locator('#view').evaluate(c=>({
  status:c.dataset.r15s3d10Status,
  ticks:Number(c.dataset.r15s3d10NativeTicks),
  original:c.dataset.r15s3d10OriginalGame,
  b51:Number(c.dataset.g4e7yRetainedMachines),
  control:c.dataset.k4csControlMode,
  realB51Count:Number(c.dataset.k4ctTwoRealCount)
 }));
 assert.equal(runtime.status,'running');
 assert.equal(runtime.b51,28);assert.equal(runtime.control,'ORIGINAL_MANUAL_UNCERTIFIED');
 assert.ok(runtime.ticks>=63.70*240-2&&runtime.ticks<=63.70*240+2);
 const [download]=await Promise.all([
  page.waitForEvent('download',{timeout:10000}),
  page.locator('#r72-save-local-result').click()
 ]);
 assert.equal(download.suggestedFilename(),'K4CT_R72_MANUAL_TRIAL_LOCAL_UNCERTIFIED.json');
 const dest=path.join(evidenceRoot,'K4CT_R72_LOCAL_DOWNLOAD_UNCERTIFIED.json');
 await download.saveAs(dest);
 const actual=JSON.parse(fs.readFileSync(dest,'utf8'));
 assert.equal(actual.sourceOriginalRunner,'REAL_WEBGL2_SOURCE_240HZ');
 assert.equal(actual.nativeB51Count,'28');
 assert.equal(actual.takeoverReached,true);
 assert.equal(actual.realHumanFairnessProven,false);
 assert.equal(actual.publicUploaded,false);
 assert.equal(actual.networkReportSent,false);
 assert.deepEqual(errors,[]);
 const summary={
  schema:'k4ct-r72-one-click-sandbox-native-webgl-240hz-smoke/1',
  status:'PASS_BROWSER_SCRIPTED_TO_TRUE_MANUAL_HANDOVER_NOT_HUMAN',
  originalWebGL2:true,original240Hz:true,originalB48:7,originalB51:28,
  manualControlMode:runtime.control,tick:runtime.ticks,
  nativeHandoverVerified:true,downloadedLocalUncertifiedResult:true,
  noActualHumanTrialProven:true,sourceBlenderART:'REJECT',
  errors,HUMAN:'HOLD',ART:'HOLD',SAT:'HOLD',CCD:'HOLD',
  WindowsLaunch:'NOT_RUN_IN_CI',RELEASE:'HOLD',MERGE:'HOLD'
 };
 fs.writeFileSync(path.join(evidenceRoot,'R72_NATIVE_TRIAL_BUNDLE_SMOKE_RESULT.json'),JSON.stringify(summary,null,2)+'\n');
 console.log('R72_NATIVE_CHROMIUM_HANDOVER_PASS_UNCERTIFIED',JSON.stringify(summary));
}finally{
 if(ctx)await ctx.close();
 if(browser)await browser.close();
 await new Promise(done=>server.close(done));
}
