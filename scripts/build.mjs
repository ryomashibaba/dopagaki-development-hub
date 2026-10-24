import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {generateEchoRush} from './p66-echo-rebuild.mjs';
import {generateVoidBreaker} from './p93-void-breaker-build.mjs';
import {generateVoidAcceptanceEvidence} from './p94-void-native-acceptance.mjs';
import {generateVoidHazardCandidate} from './p95-void-hazard-build.mjs';
import {generateP99VariableWidthCandidate} from './p99-variable-width-build.mjs';
import {generateP100TerrainPulseCandidate} from './p100-terrain-pulse-build.mjs';
import {generateP101OverdriveCandidate} from './p101-overdrive-build.mjs';
import {generateP101B5Speedway} from './p101-b5-speedway-build.mjs';
import {generateP101A13RoadCandidate} from './p101-a13-road-build.mjs';
import {generateP101A13W7Candidate} from './p101-a13-w7-gameplay-build.mjs';
import {generateP101A13W9XCandidate} from './p101-a13-w9b-road-candidate.mjs';
import {generateP101W9C1AbyssCandidate} from './p101-w9c1-abyss-narrow.mjs';
import {generateP101W9C2SCrestCandidate} from './p101-w9c2-s-crest-build.mjs';
import {generateW9C2G4ENarrow} from './p101-w9c2-g4e-narrow-build.mjs';
import {generateG4E6EarlyGap} from './p101-w9c2-g4e6-early-gap-build.mjs';
import {generateG4E7GVisualDocument} from './p101-w9c2-g4e7g-visual-stage.mjs';
import {generateG4E7MPhysical} from './p101-w9c2-g4e7m-physical-build.mjs';
import {generateG4E7QPhysical} from './p101-w9c2-g4e7q-dive-build.mjs';
import {generateG4E7RPhysical} from './p101-w9c2-g4e7r-grade-build.mjs';
import {generateG4E7SNativeCamera} from './p101-w9c2-g4e7s-native-camera.mjs';
import {generateG4E7TPhysical} from './p101-w9c2-g4e7t-real-early-gap-build.mjs';
import {generateG4E7VExit} from './p101-w9c2-g4e7v-exit-build.mjs';
import {g4e7vRealCameraFrames,G4E7V_VISUAL_IDS} from './p101-w9c2-g4e7v-camera-frames.mjs';
import {generateG4E7WBlend} from './p101-w9c2-g4e7w-takeoff-blend-build.mjs';
import {generateG4E7ACR2} from './p101-w9c2-g4e7ac-r2-physical.mjs';
import {generateG4E7AH} from './p101-w9c2-g4e7ah-narrow-real-b48.mjs';
import {g4e7aiNativeFrames,AI_VARIANTS} from './p101-w9c2-g4e7ai-native-frames.mjs';
import {g4e7akNativeFrames} from './p101-w9c2-g4e7ak-native-frames.mjs';
import {generateG4E7AJ,AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {generateG4E7AP} from './p101-w9c2-g4e7ap-temporal-slalom.mjs';
import {generateG4E7AS} from './p101-w9c2-g4e7as-banked-serpent.mjs';
import {generateG4E7AT} from './p101-w9c2-g4e7at-crown-chasm.mjs';
import {generateG4E7AUInspection} from './p101-w9c2-g4e7au-private-inspection.mjs';
import {g4e7adNativeFrames,AD_VARIANTS} from './p101-w9c2-g4e7ad-native-frames.mjs';
import {g4e7wNativeCameraFrames,G4E7W_VISUAL_PROFILES,G4E7Y_EARLY_SHOTS} from './p101-w9c2-g4e7w-camera-frames.mjs';
import {makeP99PhysicalEvidence} from './p99-real-roadplay-probe.mjs';
import {generateP97RoadplayEvidence} from './p97-roadplay-evidence.mjs';
import {generateP96DodgeEvidence} from './p96-acceptance-evidence.mjs';
import {generateReferenceGhost} from './p87-ghost-generate.mjs';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const mode=process.argv[2];
if(!['private','public-safe','public'].includes(mode))throw Error('Usage: node scripts/build.mjs private|public-safe|public');
const includeStages=mode!=='public-safe';
const dest=path.join(root,mode==='private'?'dist-private':mode==='public'?'dist-site':'dist');
fs.rmSync(dest,{recursive:true,force:true});fs.mkdirSync(dest,{recursive:true});
const write=(rel,data)=>{const p=path.join(dest,rel);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,data);};
const copy=(from,to)=>{const p=path.join(root,from);if(!fs.existsSync(p))throw Error('Missing build input: '+from);write(to,fs.readFileSync(p));};
const sha=data=>crypto.createHash('sha256').update(data).digest('hex');
const sources=JSON.parse(fs.readFileSync(path.join(root,'private/P63_INPUT_MANIFEST.json'),'utf8'));
const names=Object.keys(sources.input_sha256);
if(names.length!==4)throw Error('Expected exactly 4 P62 stages');
for(const file of names){const b=fs.readFileSync(path.join(root,'private/stages',file));if(sha(b)!==sources.input_sha256[file])throw Error('Frozen P62 SHA mismatch: '+file)}
// Build-info contains no developer machine paths or private source data.
const build={schema:'dopagaki.devhub.build/1',version:'P100',mode,buildAt:new Date().toISOString(),gitCommit:process.env.GITHUB_SHA||'LOCAL',stageCount:includeStages?4:0,experimentalStageCount:includeStages?4:0,movingObstacleCount:includeStages?24:0,experimentalMovingObstacleCount:includeStages?24:0,publicAccessibleByDefault:true,notes:mode==='private'?'PRIVATE: only deploy behind access control':mode==='public'?'PUBLIC: publication of stage data approved by owner; not a playable 3D game':'PUBLIC-SAFE: stage assets deliberately excluded'};
if(includeStages){
 copy('web/inspector.html','web/index.html');
 copy('web/drive3d.html','drive3d/index.html');
 copy('web/drive3d.mjs','drive3d/drive3d.mjs');
 copy('web/p101-w9c2-g4e7ad-city.mjs','drive3d/p101-w9c2-g4e7ad-city.mjs');
 copy('web/p101-w9c2-g4e7ae-split-horizon.mjs','drive3d/p101-w9c2-g4e7ae-split-horizon.mjs');
 copy('web/p101-w9c2-g4e7af-fracture-city.mjs','drive3d/p101-w9c2-g4e7af-fracture-city.mjs');
 copy('web/p101-w9c2-g4e7ag-open-citadel.mjs','drive3d/p101-w9c2-g4e7ag-open-citadel.mjs');
 copy('web/p101-w9c2-g4e7am-upturned-city.mjs','drive3d/p101-w9c2-g4e7am-upturned-city.mjs');
 copy('web/p101-w9c2-g4e7an-sky-archipelago.mjs','drive3d/p101-w9c2-g4e7an-sky-archipelago.mjs');
 copy('web/p101-w9c2-g4e7ao-b51-approach.mjs','drive3d/p101-w9c2-g4e7ao-b51-approach.mjs');
 copy('web/drive3d-camera.mjs','drive3d/drive3d-camera.mjs');
 copy('web/drive3d-loop.mjs','drive3d/drive3d-loop.mjs');
 copy('web/p66-visual.mjs','drive3d/p66-visual.mjs');
 copy('web/p73-machine-visual.mjs','drive3d/p73-machine-visual.mjs');
 copy('web/p74-nearmiss.mjs','drive3d/p74-nearmiss.mjs');
 copy('web/p75-survival.mjs','drive3d/p75-survival.mjs');
 copy('web/p78-demo.mjs','drive3d/p78-demo.mjs');
 copy('web/p79-practice.mjs','drive3d/p79-practice.mjs');
 copy('web/p80-trackflow.mjs','drive3d/p80-trackflow.mjs');
 copy('web/p81-edge-radar.mjs','drive3d/p81-edge-radar.mjs');
 copy('web/p82-megastructure.mjs','drive3d/p82-megastructure.mjs');
 copy('web/p83-render-quality.mjs','drive3d/p83-render-quality.mjs');
 copy('web/p84-visibility.mjs','drive3d/p84-visibility.mjs');
 copy('web/p85-energyball.mjs','drive3d/p85-energyball.mjs');
 copy('web/p86-chapter-splits.mjs','drive3d/p86-chapter-splits.mjs');
 copy('web/p87-ghost.mjs','drive3d/p87-ghost.mjs');
 copy('web/p88-ghost-gap.mjs','drive3d/p88-ghost-gap.mjs');
 copy('web/p89-ghost-sector-pace.mjs','drive3d/p89-ghost-sector-pace.mjs');
 copy('web/p90-racecard.mjs','drive3d/p90-racecard.mjs');
 copy('web/p91-approach-beacons.mjs','drive3d/p91-approach-beacons.mjs');
 copy('web/p92-failure-practice.mjs','drive3d/p92-failure-practice.mjs');
 copy('web/p93-void-breaker-visual.mjs','drive3d/p93-void-breaker-visual.mjs');
 copy('web/p94-native-steer.mjs','drive3d/p94-native-steer.mjs');
 copy('web/p95-hazard-layout.mjs','drive3d/p95-hazard-layout.mjs');
 copy('web/p96-avoidance-steer.mjs','drive3d/p96-avoidance-steer.mjs');
 copy('web/p97-roadplay-gates.mjs','drive3d/p97-roadplay-gates.mjs');
 copy('web/p100-road-read.mjs','drive3d/p100-road-read.mjs');
 copy('web/p101-overdrive.mjs','drive3d/p101-overdrive.mjs');
 copy('web/p101-b5-forward.mjs','drive3d/p101-b5-forward.mjs');
 copy('web/p101-a13-forward.mjs','drive3d/p101-a13-forward.mjs');
 copy('web/p101-a13-hazard-layout.mjs','drive3d/p101-a13-hazard-layout.mjs');
 copy('web/p101-a13-architecture.mjs','drive3d/p101-a13-architecture.mjs');
 copy('web/p101-a13-w9-architecture.mjs','drive3d/p101-a13-w9-architecture.mjs');
 copy('web/p101-a13-machine-visual.mjs','drive3d/p101-a13-machine-visual.mjs');
 copy('web/p101-a13-road-art.mjs','drive3d/p101-a13-road-art.mjs');
  copy('web/p101-w9c2-g4e7k-quiet-visual.mjs','drive3d/p101-w9c2-g4e7k-quiet-visual.mjs');
  copy('web/p101-w9c2-g4e7l-titan.mjs','drive3d/p101-w9c2-g4e7l-titan.mjs');
 copy('web/p101-w9c2-g4e7s-shard-city.mjs','drive3d/p101-w9c2-g4e7s-shard-city.mjs');
 copy('web/p101-w9c1-approach-cue.mjs','drive3d/p101-w9c1-approach-cue.mjs');
 copy('web/p101-w9c1-g5b-skyline.mjs','drive3d/p101-w9c1-g5b-skyline.mjs');
 copy('web/p101-w9c2-g4d-skyways.mjs','drive3d/p101-w9c2-g4d-skyways.mjs');
 copy('web/p101-w9c2-g4e7b-qa.mjs','drive3d/p101-w9c2-g4e7b-qa.mjs');
 copy('web/p101-w9c2-g4e7c-gap-cues.mjs','drive3d/p101-w9c2-g4e7c-gap-cues.mjs');
  // All stage-capable builds import this harmless drawing module; ONLY PRIVATE
  // emits the actual A065/A070 research B48 stage JSON and 240Hz proof.
  copy('web/p101-w9c2-g4e7x-gap-reading.mjs','drive3d/p101-w9c2-g4e7x-gap-reading.mjs');
 copy('web/p101-w9c2-g4e7d-human-qa.mjs','drive3d/p101-w9c2-g4e7d-human-qa.mjs');
 copy('web/p101-w9c2-g4e7d-manual-panel.mjs','drive3d/p101-w9c2-g4e7d-manual-panel.mjs');
  copy('web/p101-w9c2-g4e7o-manual-qa.mjs','drive3d/p101-w9c2-g4e7o-manual-qa.mjs');
  copy('web/p101-w9c2-g4e7o-manual-panel.mjs','drive3d/p101-w9c2-g4e7o-manual-panel.mjs');
  copy('web/p101-w9c2-g4e7al-manual-qa.mjs','drive3d/p101-w9c2-g4e7al-manual-qa.mjs');
  copy('web/p101-w9c2-g4e7al-manual-panel.mjs','drive3d/p101-w9c2-g4e7al-manual-panel.mjs');
  copy('web/p101-w9c2-g4e7h-hud-focus.mjs','drive3d/p101-w9c2-g4e7h-hud-focus.mjs');
  copy('web/p101-w9c2-g4e7i-readability.mjs','drive3d/p101-w9c2-g4e7i-readability.mjs');
  copy('web/p101-w9c2-g4e7j-matrix.mjs','drive3d/p101-w9c2-g4e7j-matrix.mjs');
 copy('web/p101-w9c1-pair-qa.html','w9c1-pair-qa/index.html');
 copy('web/p101-w9c1-pair-qa.mjs','w9c1-pair-qa/comparison.mjs');
 copy('web/p101-w9c1-pair-session.html','w9c1-pair-session/index.html');
 copy('web/p101-w9c1-pair-session.mjs','w9c1-pair-session/session.mjs');
 copy('web/p101-b5-road-optic.mjs','drive3d/p101-b5-road-optic.mjs');
 copy('web/p101-b5-manual-qa.mjs','drive3d/p101-b5-manual-qa.mjs');
 const nativeCourse=generateEchoRush();
 write('generated/P66_ECHO_RUSH.json',JSON.stringify(nativeCourse,null,2)+'\n');
 const voidStage=generateVoidBreaker();
 write('generated/P93_VOID_BREAKER.json',JSON.stringify(voidStage,null,2)+'\n');
 write('generated/P94_VOID_NATIVE_ACCEPTANCE.json',JSON.stringify(generateVoidAcceptanceEvidence(voidStage),null,2)+'\n');
 const hazardTrial=generateVoidHazardCandidate();
 write('generated/P95_VOID_HAZARD_CANDIDATE.json',JSON.stringify(hazardTrial,null,2)+'\n');
 write('generated/P96_NATIVE_DODGE_ACCEPTANCE.json',JSON.stringify(generateP96DodgeEvidence(hazardTrial),null,2)+'\n');
 write('generated/P97_ROADPLAY_READABILITY.json',JSON.stringify(generateP97RoadplayEvidence(hazardTrial),null,2)+'\n');
 const pressureLines=generateP99VariableWidthCandidate();
 write('generated/P99_PRESSURE_LINES.json',JSON.stringify(pressureLines,null,2)+'\n');
 const terrainPulse=generateP100TerrainPulseCandidate();
 write('generated/P100_TERRAIN_PULSE.json',JSON.stringify(terrainPulse,null,2)+'\n');
 write('generated/P101_VELOCITY_OVERDRIVE.json',JSON.stringify(generateP101OverdriveCandidate(),null,2)+'\n');
 write('generated/P101_B5_HYPER_ARC.json',JSON.stringify(generateP101B5Speedway({lowerReversalLength:1800}),null,2)+'\n');
 write('generated/P101_A13_GAMEPLAY_W1.json',JSON.stringify(generateP101A13RoadCandidate(),null,2)+'\n');
 write('generated/P101_A13_W7_GAMEPLAY.json',JSON.stringify(generateP101A13W7Candidate(),null,2)+'\n');
 // Separate W9-X physical trial asset: intentionally not selectable or promoted.
 write('generated/P101_A13_W9X_B1_TRIAL.json',JSON.stringify(generateP101A13W9XCandidate(),null,2)+'\n');
 // W9-C1 isolated collision skins; Draft/HOLD, never published by PR.
 for(const kind of ['control','ultra'])write('generated/P101_A13_W9C1_'+kind.toUpperCase()+'_TRIAL.json',JSON.stringify(generateP101W9C1AbyssCandidate(kind),null,2)+'\n');
  // W9-C2 independent genuine S-crest experiment; not the playable default.
  for(const kind of ['ribbon','edge'])write('generated/P101_A13_W9C2_'+kind.toUpperCase()+'_TRIAL.json',JSON.stringify(generateP101W9C2SCrestCandidate(kind),null,2)+'\n');
  // G4E-1 genuine physical narrow road, private PR preview only, OFF by default.
  for(const kind of ['shoulder','razor'])write('generated/P101_A13_W9C2_G4E_'+kind.toUpperCase()+'_TRIAL.json',JSON.stringify(generateW9C2G4ENarrow(kind),null,2)+'\n');
  // G4E-7G: visual comparators NEVER shipped to public even with this environment flag.
   if(mode==='private'&&process.env.DOPAGAKI_G4E7G_VISUAL==='1'){
    for(const kind of ['gold','glide'])
     write('generated/P101_A13_W9C2_G4E7G_'+kind.toUpperCase()+'_LOCAL_VISUAL.json',
      JSON.stringify(generateG4E7GVisualDocument(kind),null,2)+'\n');
   }
   // G4E-7M: TRUE 13-16m B48 candidate roads, NEVER public.
   if(mode==='private'&&process.env.DOPAGAKI_G4E7M_VISUAL==='1'){
    for(const kind of ['thread','precipice'])
     write('generated/P101_A13_W9C2_G4E7M_'+kind.toUpperCase()+'_LOCAL_TRIAL.json',
      JSON.stringify(generateG4E7MPhysical(kind,{visualSpawns:true}),null,2)+'\n');
   }
   // G4E-7Q: isolated true B48 sculpted dive / absent collider cells, LOCAL ONLY.
   if(mode==='private'&&process.env.DOPAGAKI_G4E7Q_VISUAL==='1'){
    for(const kind of ['drop','leap'])
     write('generated/P101_A13_W9C2_G4E7Q_'+kind.toUpperCase()+'_LOCAL_TRIAL.json',
      JSON.stringify(generateG4E7QPhysical(kind,{visualSpawns:true}),null,2)+'\n');
   }
   // G4E-7R: isolated true B48 graded narrow-road / real gap, PRIVATE only.
   if(mode==='private'&&process.env.DOPAGAKI_G4E7R_VISUAL==='1'){
    for(const kind of ['sweep','cut'])
     write('generated/P101_A13_W9C2_G4E7R_'+kind.toUpperCase()+'_LOCAL_TRIAL.json',
      JSON.stringify(generateG4E7RPhysical(kind,{inspectionSpawns:true}),null,2)+'\n');
   }
   // G4E-7S: native 240Hz camera snapshots, private and explicit only.
   if(mode==='private'&&process.env.DOPAGAKI_G4E7S_VISUAL==='1'){
    if(process.env.DOPAGAKI_G4E7R_VISUAL!=='1')
     throw Error('G4E7S native shots require an explicitly private real R-CUT source');
    write('generated/P101_A13_W9C2_G4E7S_240HZ_PRIVATE.json',
     JSON.stringify(generateG4E7SNativeCamera(),null,2)+'\n');
   }
   // G4E-7T: private-only actual early 13m narrow B48 gap candidates.
   if(mode==='private'&&process.env.DOPAGAKI_G4E7T_VISUAL==='1'){
    for(const variant of ['solid','early','late'])
     write('generated/P101_A13_W9C2_G4E7T_'+variant.toUpperCase()+'_LOCAL_TRIAL.json',
      JSON.stringify(generateG4E7TPhysical(variant,{inspectionSpawns:true}),null,2)+'\n');
   }
   // G4E-7V private source: real ONE53/EXIT6/SLOPE6 B48, plus actual
   // 240Hz scripted start00 camera frames. This NEVER enters public build.
   if(mode==='private'&&process.env.DOPAGAKI_G4E7V_VISUAL==='1'){
    for(const id of G4E7V_VISUAL_IDS)
     write('generated/P101_A13_W9C2_G4E7V_'+id.toUpperCase()+'_LOCAL_TRIAL.json',
      JSON.stringify(generateG4E7VExit(id),null,2)+'\n');
    write('generated/P101_A13_W9C2_G4E7V_240HZ_FRAMES_LOCAL.json',
     JSON.stringify(g4e7vRealCameraFrames(),null,2)+'\n');
   }
   // G4E-7W: genuinely causal 15.76m narrow B48 gap, only generated
   // for explicit localhost PRIVATE WebGL; NEVER in public-safe/site output.
   if(mode==='private'&&process.env.DOPAGAKI_G4E7W_VISUAL==='1'){
    for(const q of G4E7W_VISUAL_PROFILES)
     write('generated/P101_A13_W9C2_G4E7W_'+q.name+'_LOCAL_TRIAL.json',
      JSON.stringify(generateG4E7WBlend(q.alpha),null,2)+'\n');
    write('generated/P101_A13_W9C2_G4E7W_240HZ_FRAMES_LOCAL.json',
     JSON.stringify(g4e7wNativeCameraFrames(),null,2)+'\n');
    write('generated/P101_A13_W9C2_G4E7Y_EARLY_240HZ_FRAMES_LOCAL.json',
     JSON.stringify(g4e7wNativeCameraFrames(G4E7Y_EARLY_SHOTS),null,2)+'\n');
   }
   // G4E-7AI: physical 14.8m original vs actual ~11m B48 narrow options.
   // Strict private-only research without altering production game assets.
   if(mode==='private'&&process.env.DOPAGAKI_G4E7AI_VISUAL==='1'){
    for(const id of AI_VARIANTS)
     write('generated/P101_A13_W9C2_G4E7AI_'+id.replace('-','_').toUpperCase()+'_LOCAL_TRIAL.json',
      JSON.stringify(generateG4E7AH(id),null,2)+'\n');
    write('generated/P101_A13_W9C2_G4E7AI_240HZ_FRAMES_LOCAL.json',
     JSON.stringify(g4e7aiNativeFrames(),null,2)+'\n');
   }
   // G4E-7AK: real reanchored B51-C on 11m REAL B48, private localhost only.
   // Public and public-safe builds must never include reanchor research JSON.
   if(mode==='private'&&process.env.DOPAGAKI_G4E7AK_VISUAL==='1'){
    for(const id of AJ_ROADS)
     write('generated/P101_A13_W9C2_G4E7AK_'+id.replace('-','_').toUpperCase()+'_LOCAL_TRIAL.json',
      JSON.stringify(generateG4E7AJ(id,'reanchor'),null,2)+'\n');
    // AP is a distinct real B51-C physical candidate, PRIVATE only (no Gold).
    for(const id of AJ_ROADS)
     write('generated/P101_A13_W9C2_G4E7AP_'+id.replace('-','_').toUpperCase()+'_LOCAL_TRIAL.json',
      JSON.stringify(generateG4E7AP(id),null,2)+'\n');
    // BANKED SERPENT is a different actual collision road, not an art overlay; PRIVATE only.
    for(const id of AJ_ROADS)
     write('generated/P101_A13_W9C2_G4E7AS_'+id.replace('-','_').toUpperCase()+'_LOCAL_TRIAL.json',
      JSON.stringify(generateG4E7AS(id),null,2)+'\n');
    // G4E-7AT: two-road genuine B48 physical race candidate; NEVER public.
    for(const id of AJ_ROADS)
     write('generated/P101_A13_W9C2_G4E7AT_'+id.replace('-','_').toUpperCase()+'_LOCAL_TRIAL.json',
      JSON.stringify(generateG4E7AT(id),null,2)+'\n');
    // AU local-only second-road hand inspection: two spawns, all real 28 colliders.
    for(const id of AJ_ROADS)
     write('generated/P101_A13_W9C2_G4E7AU_'+id.replace('-','_').toUpperCase()+'_INSPECT_LOCAL.json',
      JSON.stringify(generateG4E7AUInspection(id),null,2)+'\n');
    write('generated/P101_A13_W9C2_G4E7AK_240HZ_FRAMES_LOCAL.json',
     JSON.stringify(g4e7akNativeFrames(),null,2)+'\n');
   }
   // G4E-7AD: two proven 7/7 R2 roads and true native camera poses.
   // Authored ONLY for explicit PRIVATE localhost WebGL review, never public.
   if(mode==='private'&&process.env.DOPAGAKI_G4E7AD_VISUAL==='1'){
    for(const id of AD_VARIANTS)
     write('generated/P101_A13_W9C2_G4E7AD_'+id.replace('-','_').toUpperCase()+'_LOCAL_TRIAL.json',
      JSON.stringify(generateG4E7ACR2(id),null,2)+'\n');
    write('generated/P101_A13_W9C2_G4E7AD_240HZ_FRAMES_LOCAL.json',
     JSON.stringify(g4e7adNativeFrames(),null,2)+'\n');
   }
   // G4E-6D: physically complete but human-UNAPPROVED gap candidates.
  // Strictly local private build, NEVER emitted by the public build even if
  // someone accidentally sets the environment variable in a release workflow.
  if(mode==='private'&&process.env.DOPAGAKI_G4E6_MANUAL==='1'){
   for(const site of ['C0-55-1','B0-65-1'])
    write('generated/P101_A13_W9C2_G4E6_'+site+'_LOCAL_TRIAL.json',
     JSON.stringify(generateG4E6EarlyGap(site),null,2)+'\n');
  }
 write('generated/P99_PHYSICAL_TRIAL.json',JSON.stringify(makeP99PhysicalEvidence(pressureLines),null,2)+'\n');
 write('generated/P87_REFERENCE_GHOST.json',JSON.stringify(generateReferenceGhost(nativeCourse))+'\n');
 for(const file of names)copy('private/stages/'+file,'generated/'+file);
 copy('private/reports/P62_FULL_RUN_MATRIX.json','reports/P62_FULL_RUN_MATRIX.json');
 const modules=['moving/moving-obstacles.mjs','moving/native-physics-bridge.mjs','surface.js','physics.js','collision.js','math.js','game-fixtures.js'];
 for(const m of modules)copy('private/reference_only/director/'+m,'reference_only/director/'+m);
 copy('private/reference_only/package.json','reference_only/package.json');
 const html=fs.readFileSync(path.join(dest,'web/index.html'),'utf8');
 for(const n of names)if(!html.includes(n))throw Error('P62 inspector references wrong/missing JSON: '+n);
 if(html.includes('_P62_GRAZING_CONTACT_BALANCE.json'))throw Error('P62 legacy 404 reference reintroduced');
}
const info=JSON.stringify(build,null,2)+'\n';write('build-info.json',info);
const hub=(includeStages?
 `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>DOPAGAKI DEV HUB P63</title><style>:root{font:16px system-ui;color:#e8f3ff;background:#071422}body{margin:0;padding:24px;background:radial-gradient(ellipse at top,#1a3549,#071422 68%);min-height:100vh}.frame{max-width:980px;margin:auto}.tag{font-size:12px;color:#7fffd5;letter-spacing:.1em}.panel{background:#0e2232;border:1px solid #36566c;border-radius:16px;padding:24px;margin-top:16px}h1{margin:8px 0;font-size:30px}p{line-height:1.6;color:#aec6d8}.flex{display:flex;gap:15px;flex-wrap:wrap}.card{flex:1 1 200px;background:#142b40;border:1px solid #32516b;border-radius:10px;padding:18px}.card b{display:block;margin-bottom:12px}a{color:#82d7ff}a.launch{display:inline-block;color:#041726;background:#88dbff;border-radius:8px;padding:11px 18px;font-weight:800;text-decoration:none}.warning{color:#ffdd9e}</style></head><body><main class="frame"><div class="tag">${mode==='public'?'P100 / PUBLIC QA-GATED PREVIEW':'P63 / PRIVATE DEV ENVIRONMENT'}</div><h1>DOPAGAKI DEVELOPMENT HUB</h1><p>実ステージ4作品・移動障害物24基のプレビューと実装履歴を管理する開発・検証専用ページです。正式な本番ゲームではありません。</p><p>正式本番：<a href="https://dopagaki-slope.sora-110029.chatgpt.site/">DOPAGAKI SLOPE を開く →</a></p><div class="panel"><div class="tag">STAGE PREVIEW</div><h2>P62 Kinetic Megastructures</h2><div class="flex"><div class="card"><b>ECHO PIPE</b>巨大共鳴管</div><div class="card"><b>HOLLOW SPHERES</b>空洞天球</div><div class="card"><b>MONSOON WAVE</b>波動シェル</div><div class="card"><b>HANGING GARDENS</b>空中庭園</div></div><p><a class="launch" href="./web/">4作品の動体プレビューを開く →</a></p><p><a class="launch" href="./drive3d/">P100 / 大型S字・実道路の起伏とバンク・12障害物（人間の試走HOLD）＋ P99旧候補保持 →</a></p><p class="warning">${mode==='public'?'公開許可済みのステージ資料を表示しています。2D俯瞰とP87の83秒参考ゴースト・8区間タイム・自己ベスト付き3D試走を公開中。正式ゲームの完成版ではありません。':'アクセス制限された開発環境専用です。人間の試走・正式ゲームの描画・FPSを示すものではありません。'}</p></div><div class="panel"><h2>Build / 検証</h2><p>ビルド情報：<a href="./build-info.json">build-info.json</a></p><p>Moving Lab B51-C正本の物理モジュールは読み取り専用参照として保持。新しい移動体実装はここには追加しません。</p></div></main></body></html>`:
 `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>DOPAGAKI DEV HUB — Setup</title><style>body{font:16px system-ui;line-height:1.7;background:#081625;color:#ebf6ff;margin:7vw auto;max-width:740px;padding:20px}section{border:1px solid #42667d;background:#10283b;padding:24px;border-radius:14px}a{color:#83ddff}</style></head><body><section><small>PUBLIC-SAFE / NO PRIVATE DATA</small><h1>DOPAGAKI DEVELOPMENT HUB</h1><p>開発環境の準備中です。この版には未公開ステージJSONやプライベートな検証データを含めていません。</p><p>アクセス制御とデプロイ承認が完了してから実ステージのプレビューを公開します。</p><p><a href="./build-info.json">ビルド情報</a></p></section></body></html>`);
write('index.html',hub);
if(mode==='public')write('.nojekyll','');
write('_headers','/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: no-referrer\n  X-Frame-Options: DENY\n  Cache-Control: no-store\n');
write('robots.txt','User-agent: *\nDisallow: /\n');
const files=[];function enumerate(dir,prefix=''){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const rel=path.posix.join(prefix,entry.name);if(entry.isDirectory())enumerate(path.join(dir,entry.name),rel);else files.push({path:rel,bytes:fs.statSync(path.join(dir,entry.name)).size,sha256:sha(fs.readFileSync(path.join(dir,entry.name)))});}}enumerate(dest);
const forbidden=mode==='public-safe'?files.filter(x=>/generated\/|reference_only\/|reports\/|web\//.test(x.path)):[];
if(forbidden.length)throw Error('PUBLIC LEAK: '+forbidden.map(x=>x.path));
write('asset-checksums.json',JSON.stringify(files,null,2)+'\n');
console.log(`BUILD PASS ${mode}: ${files.length+1} files; ${names.length} private input JSON SHA verified; dist=${dest}`);
