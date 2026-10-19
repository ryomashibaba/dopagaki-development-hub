/**
 * W9-C1 G5-C3: parent of two explicit same-origin MANUAL gameplay frames.
 * In-memory only, no server upload, no localStorage/cookies, no autopilot.
 * Messages MUST originate from the current iframe AND match the exact stage.
 */
import {compareW9C1HumanReports,validateW9C1HumanReport} from '../w9c1-pair-qa/comparison.mjs';
const $=id=>document.getElementById(id);
const STAGE={control:'VB-P101-A13-W9C1-CONTROL',ultra:'VB-P101-A13-W9C1-ULTRA'};
let mode='control',pending=null,requestId=0;
const stored={control:null,ultra:null};
let comparison=null;
const game=$('game');
function alertText(s){$('alert').textContent=s;$('alert').hidden=!s;}
function stageUrl(kind){return '../drive3d/?stage='+STAGE[kind]+'&guided=1';}
function active(kind){
 mode=kind;pending=null;alertText('');
 $('phase').textContent=kind==='control'?'1 / 2 · CONTROL 28m':'2 / 2 · ULTRA 14m';
 $('instruction').textContent=kind==='control'
  ?'開始地点00・OVERDRIVEのまま手動操作。終了後は「14mへ進む」。途中記録も可能。'
  :'同じ開始地点00・OVERDRIVEで14mを操作。終了後は「比較JSONを保存」。途中記録も可能。';
 $('next').hidden=kind!=='control';$('next').disabled=true;
 $('save').hidden=kind!=='ultra';$('save').disabled=true;
 $('capture').textContent='手動走行の読み込み中...';
 game.src=stageUrl(kind);
}
function values(x){return x===null||x===undefined?'未観測':String(x);}
function showComparison(){
 comparison=compareW9C1HumanReports(stored.control,stored.ultra);
 $('summary').hidden=false;
 $('quality').textContent=comparison.comparability.pairedObservedCore
  ?'開始条件が揃い、双方の狭路コアHUDを観測。ただし人間の公平性・楽しさはHOLD。'
  :'開始条件や終了状況・コア到達に不足があります。比較の結論はHOLD。';
 const fields=[['finalStatus','記録終了状態'],['physicsSeconds','計測された時間 (秒)'],
  ['peakSpeedMps','最高速度 (m/s)'],['firstCoreHudSeconds','コアHUD時刻 (秒)'],
  ['observedHudLeadSeconds','表示上の事前予告 (秒)'],
  ['fpsP10','描画FPS 下位10%'],['reboundRecoveryStarted','復帰発動']];
 $('metrics').replaceChildren(...fields.map(([key,label])=>{
  const tr=document.createElement('tr');
  for(const value of [label,values(comparison.control[key]),values(comparison.ultra[key])]){
   const td=document.createElement('td');td.textContent=value;tr.append(td);
  }
  return tr;
 }));
 $('capture').textContent='2走行の記録を取り込みました。保存前に比較値を確認できます。';
 return comparison;
}
function downloadComparison(data){
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json'}));
 const link=document.createElement('a');link.href=url;
 link.download='DOPAGAKI_W9C1_28m_vs_14m_G5C3_COMPARISON.json';
 document.body.append(link);link.click();link.remove();
 // Delay revocation by a microtask, not an external timeout or upload.
 queueMicrotask(()=>URL.revokeObjectURL(url));
}
function useReport(report,kind){
 validateW9C1HumanReport(report,kind);
 stored[kind]=report;
 $('capture').textContent=report.captureStatus==='RUNNING_SNAPSHOT_NOT_TERMINAL'
  ?'途中地点までの実測記録を取得（未完走・未失敗）。'
  :'実物理の終了結果を取得しました。';
 if(kind==='control'){$('next').disabled=false;}
 else {$('save').disabled=false;showComparison();}
}
game.addEventListener('load',()=>{
 $('capture').textContent='実物理の道路と障害物を読み込んでいます...';
});
window.addEventListener('message',event=>{
 if(event.origin!==window.location.origin||event.source!==game.contentWindow||
    event.data?.type!=='dopagaki.w9c1.g5c3.report/1')return;
 const m=event.data;
 if(m.stageId!==STAGE[mode]||m.report?.stageId!==STAGE[mode])return;
 // Auto event accepted only for a genuine TERMINAL audit; a snapshot must
 // have come from the user-initiated explicit capture request.
 if(m.requestId===null){
  if(m.report.captureStatus!=='TERMINAL_OBSERVATION')return;
  try{useReport(m.report,mode);}catch(err){alertText(String(err.message||err));}
  return;
 }
 if(!pending||pending.id!==m.requestId||pending.kind!==mode)return;
 const requested=pending;pending=null;
 try{
  useReport(m.report,mode);
  if(requested.action==='advance')active('ultra');
  else if(requested.action==='save'){downloadComparison(showComparison());}
 }catch(err){
  alertText('記録の確認に失敗: '+String(err.message||err));
 }
});
function capture(action){
 if(pending)return;
 alertText('');
 if(action==='advance'&&stored.control?.captureStatus==='TERMINAL_OBSERVATION'){
  active('ultra');return;
 }
 if(action==='save'&&stored.ultra?.captureStatus==='TERMINAL_OBSERVATION'){
  downloadComparison(showComparison());return;
 }
 const id=++requestId;
 pending={id,kind:mode,action};
 $('capture').textContent='現在時点の実走行を読み取っています...';
 game.contentWindow?.postMessage({type:'dopagaki.w9c1.g5c3.capture/1',requestId:id},window.location.origin);
}
$('next').addEventListener('click',()=>capture('advance'));
$('save').addEventListener('click',()=>capture('save'));
active('control');
