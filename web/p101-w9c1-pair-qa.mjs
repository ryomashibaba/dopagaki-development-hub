/**
 * G5-C2: local-only, privacy-preserving paired W9-C1 human report review.
 * This module is READ ONLY. It never touches B48 240Hz physics, steering,
 * scoring, stage selection or network. Data comes from two explicitly
 * selected files; it cannot certify a person truly drove the course.
 */
export const W9C1_PAIR_SCHEMA='dopagaki.w9c1-paired-human-review/1';
const STAGES=Object.freeze({
 control:'VB-P101-A13-W9C1-CONTROL',
 ultra:'VB-P101-A13-W9C1-ULTRA'
});
const isNum=n=>typeof n==='number'&&Number.isFinite(n);
const nOrNull=n=>isNum(n)?n:null;
const rounded=n=>isNum(n)?Number(n.toFixed(3)):null;
const limitString=(s,max=100)=>typeof s==='string'?s.slice(0,max):null;
const allowStatus=new Set(['failed','finished','interrupted']);
export function validateW9C1HumanReport(report,kind){
 if(!Object.hasOwn(STAGES,kind))throw Error('Unknown W9-C1 variant');
 if(!report||typeof report!=='object'||Array.isArray(report))
  throw Error(kind+': JSON object required');
 if(report.schema!=='dopagaki.a13-manual-qa/1'||report.stageId!==STAGES[kind])
  throw Error(kind+': wrong trial JSON (expected '+STAGES[kind]+')');
 if(report.source!=='ACTUAL_MANUAL_BROWSER_RUN_NOT_SCRIPTED_NOT_HUMAN_FAIRNESS_CERTIFIED')
  throw Error(kind+': not a W9-C1 manual observation record');
 if(!['OVERDRIVE','RAPID','HYPER'].includes(report.profile)||!Number.isInteger(report.spawnIndex)||
    report.spawnIndex<0||report.spawnIndex>20||!isNum(report.startSpeed)||report.startSpeed<1||
    !Array.isArray(report.samples)||report.samples.length>300)
  throw Error(kind+': invalid manual trial header');
 if(report.summary!==null&&report.summary!==undefined&&(!allowStatus.has(report.summary.status)||
    !isNum(report.summary.physicsSeconds)||report.summary.physicsSeconds<0||
    !Number.isInteger(report.summary.contacts)||report.summary.contacts<0))
  throw Error(kind+': invalid terminal run summary');
 // Exact field allowlist; do NOT include free text notes or source samples.
 const summary=report.summary??null,core=summary?.w9c1G4Telemetry??null;
 const g4=report.w9c1G4?.selfReport??null;
 const recovery=summary?.nonlethalReboundRecovery?.observedEvents??[];
 const events=Array.isArray(recovery)?recovery:[];
 const validEvents=events.filter(e=>e&&['rebound-recovery-start','rebound-recovery-end'].includes(e.type));
 return {
  kind,stageId:report.stageId,nominalCoreWidthMeters:kind==='control'?28:14,
  spawnIndex:report.spawnIndex,profile:report.profile,startSpeedMps:report.startSpeed,
  // A manual capture of an active 240Hz run is NOT an actual terminal finish.
  captureStatus:report.captureStatus??'LEGACY_UNKNOWN',
  finalStatus:report.captureStatus==='RUNNING_SNAPSHOT_NOT_TERMINAL'
   ?'running-snapshot':summary?.status??'ongoing',
  physicsSeconds:rounded(summary?.physicsSeconds),
  lastSurface:limitString(summary?.lastSurface),
  peakSpeedMps:rounded(summary?.peakSpeedMps),
  movingOrFixedContacts:nOrNull(summary?.contacts),
  firstCoreHudSeconds:rounded(core?.firstHudCoreSeconds),
  observedHudLeadSeconds:rounded(core?.observedHudLeadSeconds),
  hudCoreUpdates:nOrNull(core?.coreUpdates),
  fpsP10:rounded(summary?.renderFrameFpsP10),
  physicsOverloadedFrameShare:rounded(summary?.physicsOverloadedFrameShare),
  reboundRecoveryStarted:validEvents.filter(e=>e.type==='rebound-recovery-start').length,
  reboundRecoveryEnded:validEvents.filter(e=>e.type==='rebound-recovery-end').length,
  reportedEdgeReadability:Number.isInteger(g4?.edgeReadability)&&g4.edgeReadability>=1&&g4.edgeReadability<=5?g4.edgeReadability:null,
  reportedFailureFairness:Number.isInteger(g4?.failureFairness)&&g4.failureFairness>=1&&g4.failureFairness<=5?g4.failureFairness:null,
  failureReason:limitString(summary?.failureReason),
  samplingRows:report.samples.length,
  sourceDeclaredManual:true
 };
}
export function compareW9C1HumanReports(controlReport,ultraReport){
 const control=validateW9C1HumanReport(controlReport,'control');
 const ultra=validateW9C1HumanReport(ultraReport,'ultra');
 const sameProfile=control.profile===ultra.profile;
 const sameStartSpeed=control.startSpeedMps===ultra.startSpeedMps;
 const bothStart00=control.spawnIndex===0&&ultra.spawnIndex===0;
 const bothHaveCoreHud=control.firstCoreHudSeconds!==null&&ultra.firstCoreHudSeconds!==null;
 const bothTerminated=['failed','finished','interrupted'].includes(control.finalStatus)&&
  ['failed','finished','interrupted'].includes(ultra.finalStatus);
 const repeatedHumanRuns=1; // one uploaded file each, not a statistical comparison
 const flags=[];
 if(!bothStart00)flags.push('開始地点00同士ではないため、狭路への実速度到達や全体生存を比較できません');
 if(!sameProfile)flags.push('前進/操舵プロファイルが一致しません');
 if(!sameStartSpeed)flags.push('開始速度が一致しません');
 if(!bothHaveCoreHud)flags.push('双方が狭路コアへ到達したHUD記録はまだありません');
 if(!bothTerminated)flags.push('途中スナップショットまたは終了状態のない走行が含まれます');
 if(control.samplingRows===0||ultra.samplingRows===0)flags.push('入力・FPS等の観測サンプルが不足しています');
 flags.push('各版1走行の比較です。成績差は操作・障害物タイミング・偶然でも変わります');
 flags.push('HUDの表示履歴は人間が警告を見た証拠ではありません');
 const matchedStartConditions=bothStart00&&sameProfile&&sameStartSpeed;
 const pairedObservedCore=matchedStartConditions&&bothHaveCoreHud&&bothTerminated;
 return {
  schema:W9C1_PAIR_SCHEMA,version:'G5-C2-READONLY/1',
  control,ultra,
  comparability:{
   sameProfile,sameStartSpeed,bothStart00,bothHaveCoreHud,bothTerminated,
   matchedStartConditions,pairedObservedCore,repeatedHumanRuns
  },
  indicators:{
   durationDifferenceUltraMinusControlSeconds:
    control.physicsSeconds!==null&&ultra.physicsSeconds!==null
     ?rounded(ultra.physicsSeconds-control.physicsSeconds):null,
   coreWidthDifferenceMeters:ultra.nominalCoreWidthMeters-control.nominalCoreWidthMeters
  },
  limitations:flags,
  winner:'UNDETERMINED',
  humanFairness:'HOLD',
  humanEnjoyment:'HOLD',
  approvedForProduction:false,
  noCourseOrPhysicsMutation:true,
  provenance:'TWO_USER_SELECTED_LOCAL_JSON_FILES_NOT_INDEPENDENTLY_AUTHENTICATED'
 };
}
