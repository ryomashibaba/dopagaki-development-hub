/** R72 PRIVATE local trial UX. No physics, source camera, original B51, stage JSON,
 * scoring or collision edits. The demo before handover is SCRIPTED. After
 * takeover the source Runner waits for real/manual keys; even browser
 * isTrusted inputs do NOT certify a human or fairness.
 */
const stageName='K4CT-TWO-REAL-B51-CHOICE';
const $=id=>document.getElementById(id);
const panel=document.createElement('section');
panel.id='r72-local-human-trial';
panel.setAttribute('aria-label','K4CT original manual B51 trial');
panel.style.cssText='position:fixed;right:10px;bottom:10px;width:min(300px,36vw);max-height:38vh;overflow:auto;z-index:1120;padding:10px 12px;background:#081a2adf;color:#f2f8ff;border:1px solid #7f9ba7;border-radius:8px;font:13px/1.4 system-ui,sans-serif;box-sizing:border-box;box-shadow:0 2px 9px #0009';
const heading=document.createElement('div');
heading.textContent='R72 / 本物のB51試走（研究用）';
heading.style.cssText='font-weight:750;margin:0 0 4px';
panel.append(heading);
const tip=document.createElement('div');
tip.textContent='デモで63.70秒へ移動後、元ゲームをA/D・矢印で手動操作。結果の正式PASSは保証しません。';
panel.append(tip);
const button=document.createElement('button');
button.id='r72-start-manual';
button.textContent='B51-14試走を開始';
button.style.cssText='margin:8px 6px 6px 0;padding:7px 9px;background:#12485e;color:#fff;border:1px solid #75a4b4;border-radius:5px;cursor:pointer';
const save=document.createElement('button');
save.id='r72-save-local-result';
save.textContent='結果JSONを保存';
save.style.cssText='padding:7px 9px;background:#293d48;color:#fff;border:1px solid #90a4ae;border-radius:5px;cursor:pointer';
panel.append(button,save);
const status=document.createElement('div');
status.id='r72-local-trial-state';
status.textContent='未開始 / HUMAN 未認証';
status.style.cssText='margin-top:5px;font-weight:650';
panel.append(status);
const note=document.createElement('div');
note.textContent='ローカル完結。結果の自動送信なし。偽の安全レーン・物理変更なし。';
note.style.cssText='font-size:11px;color:#b6cbd1;margin-top:5px';
panel.append(note);
document.body.append(panel);
let observedKeyCount=0,handedOver=false,startCount=0,busy=false,cameraChosen=false;
window.addEventListener('keydown',e=>{
 if(handedOver&&['KeyA','KeyD','ArrowLeft','ArrowRight'].includes(e.code))observedKeyCount++;
});
const sleep=t=>new Promise(done=>setTimeout(done,t));
async function waitFor(fn,maxMs,what){
 const start=performance.now();
 while(performance.now()-start<maxMs){
  if(fn())return;
  await sleep(125);
 }
 throw Error('Local trial timeout at '+what);
}
button.addEventListener('click',async()=>{
 if(busy)return;
 busy=true;button.disabled=true;status.textContent='元デモで試走地点へ移動中…';
 try{
  const c=$('view'),sel=$('stage'),demo=$('demoRun'),take=$('takeoverRun'),speed=$('demoSpeed');
  if(!c||!sel||!demo||!take||!speed)throw Error('True native game UI not initialized');
  if(sel.value!==stageName)throw Error('Choose K4CT-TWO-REAL-B51-CHOICE in Stage first');
  await waitFor(()=>c.dataset.r15s3d10OriginalGame==='REAL_WEBGL2_SOURCE_240HZ',15000,'true original Runner ready');
  if(!cameraChosen&&$('cameraCompare')){$('cameraCompare').click();cameraChosen=true;}
  speed.value='2';speed.dispatchEvent(new Event('change',{bubbles:true}));
  window.__r15s3d10PauseAt=63.70;
  demo.click();
  await waitFor(()=>{
   const pause=Number(c.dataset.r15s3d10PausedAt);
   return c.dataset.r15s3d10Status==='running'&&
    Math.abs(pause-63.70)<.009&&
    Math.abs(Number(c.dataset.r15s3d10NativeTicks)-63.70*240)<=2;
  },90000,'original pause at 63.70');
  take.click();
  await waitFor(()=>c.dataset.k4csControlMode==='ORIGINAL_MANUAL_UNCERTIFIED',10000,'original handover');
  handedOver=true;startCount++;status.textContent='手動操作中：A/D・矢印 / HUMAN・公平性は未認証';
 }catch(err){
  status.textContent='HOLD: '+String(err.message||err).slice(0,190);
 }finally{
  busy=false;button.disabled=false;button.textContent='同じ試走をやり直す';
 }
});
save.addEventListener('click',()=>{
 const c=$('view');
 const result={
  schema:'k4ct-r72-local-uncertified-manual-trial/1',
  exportedAtUTC:new Date().toISOString(),build:'R72_NOT_RELEASED',
  userKeyEventCountObserved:observedKeyCount,
  takeoverReached:handedOver,oneClickTrialStarts:startCount,
  sourceOriginalRunner:c?.dataset.r15s3d10OriginalGame||'UNKNOWN',
  nativeB51Count:c?.dataset.g4e7yRetainedMachines||'UNKNOWN',
  nativeTicks:c?.dataset.r15s3d10NativeTicks||'UNKNOWN',
  sourceStatus:c?.dataset.r15s3d10Status||'UNKNOWN',
  firstOriginalB51:c?.dataset.k4ctFirstB51||'UNKNOWN',
  currentActualContactTrace:window.__k4ctNativeContactTrace||null,
  interpretation:'Unverified local test. Native simulation trace != human fairness/skill certification.',
  realHumanFairnessProven:false,ART:'HOLD',HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',
  publicUploaded:false,networkReportSent:false
 };
 const blob=new Blob([JSON.stringify(result,null,2)+'\n'],{type:'application/json'});
 const url=URL.createObjectURL(blob),link=document.createElement('a');
 link.href=url;link.download='K4CT_R72_MANUAL_TRIAL_LOCAL_UNCERTIFIED.json';
 document.body.append(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
 status.textContent='結果を端末内へ保存（未認証・自動送信なし）';
});
