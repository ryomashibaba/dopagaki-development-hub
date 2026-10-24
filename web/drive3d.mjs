import {sample,frame} from '../reference_only/director/surface.js';
import {compile} from '../reference_only/director/collision.js';
import {Runner,DT,RADIUS} from '../reference_only/director/physics.js';
import {movingObstaclePose,sphereBoxSeparation} from '../reference_only/director/moving/moving-obstacles.mjs';
import {fixtureTriangles} from '../reference_only/director/game-fixtures.js';
import {epicGeometry} from './p66-visual.mjs';
import {capturePose,resolveDisplayPose,createCameraState,advanceCamera,viewForPose,cameraYawErrorRadians} from './drive3d-camera.mjs';
import {stepFixedClock} from './drive3d-loop.mjs';
import {makeMachineMeshes,nearestMachineCue,obstacleBodyVertices} from './p73-machine-visual.mjs';
import {createNearMissTracker,stepNearMiss,nearMissDisplay} from './p74-nearmiss.mjs';
import {survivalScore,buildRunRecord,readBest,storeBest,scoreString} from './p75-survival.mjs';
import {createNativeDemoState,recordDemoMilestone,nativeDemoSteer,isDemoEligible} from './p78-demo.mjs';
import {PRACTICE_CHAPTERS,createPracticeSeek,advancePracticeSeek,practiceElapsed} from './p79-practice.mjs';
import {FLOW_CHAPTERS,flowLineVertices,flowProgressState} from './p80-trackflow.mjs';
import {locateRoadLateral,edgeRadarLabel} from './p81-edge-radar.mjs';
import {megastructureGeometry} from './p82-megastructure.mjs';
import {createRenderQuality,sampleRenderQuality,framebufferDimensions,renderScaleLabel} from './p83-render-quality.mjs';
import {roadShoulderLights,FOG_START_METERS,FOG_SPAN_METERS,FOG_MAX} from './p84-visibility.mjs';
import {makeEnergyBallVisual,energyBallFrame} from './p85-energyball.mjs';
import {createChapterSplits,observeChapterSplits,chapterTimerView,readChapterBest,storeChapterBest,splitSeconds} from './p86-chapter-splits.mjs';
import {validateGhost,referenceGhostAt,ghostEligible,ghostLatticeVertices} from './p87-ghost.mjs';
import {ghostGapView} from './p88-ghost-gap.mjs';
import {validateReferenceSectors,compareGhostSector,paceCaption} from './p89-ghost-sector-pace.mjs';
import {buildRacecard,racecardTotals,racecardDeltaText} from './p90-racecard.mjs';
import {approachBeaconVertices} from './p91-approach-beacons.mjs';
import {failurePracticeChapter} from './p92-failure-practice.mjs';
import {hazardRoadGateVertices,makeHazardRoadPlan,nextRoadHazardCue} from './p97-roadplay-gates.mjs';
import {p100RoadReadGeometry} from './p100-road-read.mjs';
import {p101Step,P101_DEFAULT,p101ReboundRecoveryState} from './p101-overdrive.mjs';
import {p101B5ForwardScale,createP101B5SurgeState,p101B5RecordStageId} from './p101-b5-forward.mjs';
import {p101A13ForwardScale,createA13SurgeState} from './p101-a13-forward.mjs';
import {a13MachineMegastructures} from './p101-a13-architecture.mjs';
import {a13W9HeroArchitecture} from './p101-a13-w9-architecture.mjs';
import {w9c1G5BSkyline} from './p101-w9c1-g5b-skyline.mjs';
import {g4dOutboardSkyways} from './p101-w9c2-g4d-skyways.mjs';
import {g4e7cGapRoadCues} from './p101-w9c2-g4e7c-gap-cues.mjs';
import {g4e7xGapReading,g4e7xOutboardVanes,g4e7zLowProfileSignals} from './p101-w9c2-g4e7x-gap-reading.mjs';
import {G4E7D_PROTOCOL,createG4E7DTrial,observeG4E7DStep,observeG4E7DFrame,exportG4E7DTrial,createG4E7DSession,completeG4E7DSession,exportG4E7DSession} from './p101-w9c2-g4e7d-human-qa.mjs';
import {makeG4E7DPanel} from './p101-w9c2-g4e7d-manual-panel.mjs';
import {createG4E7OTrial,observeG4E7OStep,observeG4E7OFrame,exportG4E7OTrial,newG4E7OSession,appendG4E7OTrial,exportG4E7OSession,g4e7oReadRoad} from './p101-w9c2-g4e7o-manual-qa.mjs';
import {createG4E7OManualPanel} from './p101-w9c2-g4e7o-manual-panel.mjs';
import {createG4E7ALTrial,observeG4E7ALStep,observeG4E7ALFrame,exportG4E7ALTrial,
 newG4E7ALSession,appendG4E7ALTrial,archiveG4E7ALRetry,exportG4E7ALSession,G4E7AL_ROADS} from './p101-w9c2-g4e7al-manual-qa.mjs';
import {createG4E7ALPanel} from './p101-w9c2-g4e7al-manual-panel.mjs';
import {createG4E7HFocusHud} from './p101-w9c2-g4e7h-hud-focus.mjs';
import {g4e7iSkylineContours,createG4E7IControls} from './p101-w9c2-g4e7i-readability.mjs';
import {createG4E7JMatrix} from './p101-w9c2-g4e7j-matrix.mjs';
import {createGapQa,qaSteer,qaStep,qaObservation} from './p101-w9c2-g4e7b-qa.mjs';
import {a13MachineBodyVertices} from './p101-a13-machine-visual.mjs';
import {a13RacingRoadArt,g4e7pAllowed} from './p101-a13-road-art.mjs';
import {g4e7kAllowed,createG4E7KControls} from './p101-w9c2-g4e7k-quiet-visual.mjs';
import {g4e7lTitanArchitecture,g4e7lAllowed,createG4E7LStageControls} from './p101-w9c2-g4e7l-titan.mjs';
import {g4e7sShardCity,g4e7sAllowed} from './p101-w9c2-g4e7s-shard-city.mjs';
import {g4e7adCity} from './p101-w9c2-g4e7ad-city.mjs';
import {g4e7aeSplitHorizon} from './p101-w9c2-g4e7ae-split-horizon.mjs';
import {g4e7afFractureCity} from './p101-w9c2-g4e7af-fracture-city.mjs';
import {g4e7agOpenCitadel} from './p101-w9c2-g4e7ag-open-citadel.mjs';
import {g4e7amUpturnedCity} from './p101-w9c2-g4e7am-upturned-city.mjs';
import {g4e7anSkyArchipelago,AN_FOCUS} from './p101-w9c2-g4e7an-sky-archipelago.mjs';
import {g4e7aoActualB51Warning} from './p101-w9c2-g4e7ao-b51-approach.mjs';
import {makeW9C1CueProfile,readW9C1Cue,w9c1ApproachMarks} from './p101-w9c1-approach-cue.mjs';
import {p101B5OpticalRoadGeometry} from './p101-b5-road-optic.mjs';
import {createB5ManualAudit,recordB5ManualSample,recordB5ManualFrame,observeW9C1ManualCue,finalizeB5ManualAudit,exportB5ManualAudit} from './p101-b5-manual-qa.mjs';

const $=id=>document.getElementById(id);
const assets={'VB-P101-A13':'P101_A13_W7_GAMEPLAY.json','VB-P101-A13-W9X-B1':'P101_A13_W9X_B1_TRIAL.json','VB-P101-A13-W9C1-CONTROL':'P101_A13_W9C1_CONTROL_TRIAL.json','VB-P101-A13-W9C1-ULTRA':'P101_A13_W9C1_ULTRA_TRIAL.json','VB-P101-A13-W9C2-RIBBON':'P101_A13_W9C2_RIBBON_TRIAL.json','VB-P101-A13-W9C2-EDGE':'P101_A13_W9C2_EDGE_TRIAL.json','VB-P101-A13-W9C2-G4E-SHOULDER':'P101_A13_W9C2_G4E_SHOULDER_TRIAL.json','VB-P101-A13-W9C2-G4E-RAZOR':'P101_A13_W9C2_G4E_RAZOR_TRIAL.json','VB-P101-A13-W9C2-G4E6-C0-55-1':'P101_A13_W9C2_G4E6_C0-55-1_LOCAL_TRIAL.json','VB-P101-A13-W9C2-G4E6-B0-65-1':'P101_A13_W9C2_G4E6_B0-65-1_LOCAL_TRIAL.json','VB-P101-A13-W9C2-G4E7G-GOLD':'P101_A13_W9C2_G4E7G_GOLD_LOCAL_VISUAL.json','VB-P101-A13-W9C2-G4E7G-GLIDE':'P101_A13_W9C2_G4E7G_GLIDE_LOCAL_VISUAL.json','VB-P101-A13-W9C2-G4E7M-THREAD':'P101_A13_W9C2_G4E7M_THREAD_LOCAL_TRIAL.json','VB-P101-A13-W9C2-G4E7M-PRECIPICE':'P101_A13_W9C2_G4E7M_PRECIPICE_LOCAL_TRIAL.json','VB-P101-A13-W9C2-G4E7Q-DROP':'P101_A13_W9C2_G4E7Q_DROP_LOCAL_TRIAL.json','VB-P101-A13-W9C2-G4E7Q-LEAP':'P101_A13_W9C2_G4E7Q_LEAP_LOCAL_TRIAL.json','VB-P101-A13-W9C2-G4E7R-SWEEP':'P101_A13_W9C2_G4E7R_SWEEP_LOCAL_TRIAL.json','VB-P101-A13-W9C2-G4E7R-CUT':'P101_A13_W9C2_G4E7R_CUT_LOCAL_TRIAL.json','VB-P101-A13-W9C2-G4E7T-SOLID':'P101_A13_W9C2_G4E7T_SOLID_LOCAL_TRIAL.json','VB-P101-A13-W9C2-G4E7T-EARLY':'P101_A13_W9C2_G4E7T_EARLY_LOCAL_TRIAL.json','VB-P101-A13-W9C2-G4E7T-LATE':'P101_A13_W9C2_G4E7T_LATE_LOCAL_TRIAL.json','VB-P101-A13-W9C2-G4E7V-ORIGINAL':'P101_A13_W9C2_G4E7V_ORIGINAL_LOCAL_TRIAL.json','VB-P101-A13-W9C2-G4E7V-EXIT6':'P101_A13_W9C2_G4E7V_EXIT6_LOCAL_TRIAL.json','VB-P101-A13-W9C2-G4E7V-SLOPE6':'P101_A13_W9C2_G4E7V_SLOPE6_LOCAL_TRIAL.json','VB-P101-A13-W9C2-G4E7W-BLEND-0-65':'P101_A13_W9C2_G4E7W_A065_LOCAL_TRIAL.json','VB-P101-A13-W9C2-G4E7W-BLEND-0-7':'P101_A13_W9C2_G4E7W_A070_LOCAL_TRIAL.json','VB-P101-A13-W9C2-G4E7AD-APPROACH-ARC':'P101_A13_W9C2_G4E7AD_APPROACH_ARC_LOCAL_TRIAL.json','VB-P101-A13-W9C2-G4E7AD-LANDING-CRESCENT':'P101_A13_W9C2_G4E7AD_LANDING_CRESCENT_LOCAL_TRIAL.json','VB-P101-A13-W9C2-G4E7AI-R2-CONTROL':'P101_A13_W9C2_G4E7AI_R2_CONTROL_LOCAL_TRIAL.json',
 'VB-P101-A13-W9C2-G4E7AI-TRUE-PINCH':'P101_A13_W9C2_G4E7AI_TRUE_PINCH_LOCAL_TRIAL.json',
 'VB-P101-A13-W9C2-G4E7AI-PINCH-SWITCH':'P101_A13_W9C2_G4E7AI_PINCH_SWITCH_LOCAL_TRIAL.json',
 'VB-P101-A13-W9C2-G4E7AP-TRUE-PINCH':'P101_A13_W9C2_G4E7AP_TRUE_PINCH_LOCAL_TRIAL.json',
 'VB-P101-A13-W9C2-G4E7AP-PINCH-SWITCH':'P101_A13_W9C2_G4E7AP_PINCH_SWITCH_LOCAL_TRIAL.json',
 'VB-P101-A13-W9C2-G4E7AS-TRUE-PINCH':'P101_A13_W9C2_G4E7AS_TRUE_PINCH_LOCAL_TRIAL.json',
 'VB-P101-A13-W9C2-G4E7AS-PINCH-SWITCH':'P101_A13_W9C2_G4E7AS_PINCH_SWITCH_LOCAL_TRIAL.json',
 'VB-P101-A13-W9C2-G4E7AK-TRUE-PINCH':'P101_A13_W9C2_G4E7AK_TRUE_PINCH_LOCAL_TRIAL.json','VB-P101-A13-W9C2-G4E7AK-PINCH-SWITCH':'P101_A13_W9C2_G4E7AK_PINCH_SWITCH_LOCAL_TRIAL.json','VB-P101-B5':'P101_B5_HYPER_ARC.json','VB-P101':'P101_VELOCITY_OVERDRIVE.json','VB-P100':'P100_TERRAIN_PULSE.json','VB-P99':'P99_PRESSURE_LINES.json','VB-P95':'P95_VOID_HAZARD_CANDIDATE.json','VB-P93':'P93_VOID_BREAKER.json','EP-P66':'P66_ECHO_RUSH.json','EP-001':'EP-001_P62_KINETIC_ARCHITECTURE.json','HG-001':'HG-001_P62_KINETIC_ARCHITECTURE.json','HS-001':'HS-001_P62_KINETIC_ARCHITECTURE.json','WV-001':'WV-001_P62_KINETIC_ARCHITECTURE.json'};
// G4E-1 physical trials are private opt-in; Gold remains the visible default.
const g4ePreviewOptIn=new URLSearchParams(window.location.search).get('g4e')==='on'||
 new URLSearchParams(window.location.hash.slice(1)).get('g4e')==='on';
if(g4ePreviewOptIn){
 for(const [id,label] of [
  ['VB-P101-A13-W9C2-G4E-SHOULDER','G4E-1 SHOULDER — 実物理4狭路・82%幅（人間HOLD）'],
  ['VB-P101-A13-W9C2-G4E-RAZOR','G4E-1 RAZOR — 実物理4狭路・68%幅（人間HOLD）']]){
  const option=document.createElement('option');option.value=id;option.textContent=label;
  $('stage').append(option);
 }
}
// G4E-6D only on loopback private preview with an explicit URL opt-in.
const g4e6LocalHost=['localhost','127.0.0.1','[::1]'].includes(window.location.hostname);
const g4e6LocalOptIn=g4e6LocalHost&&
 new URLSearchParams(window.location.search).get('g4e6')==='on';
if(g4e6LocalOptIn){
 for(const [id,label] of [
  ['VB-P101-A13-W9C2-G4E6-C0-55-1','G4E-6 C0-55-1 — 真の6.96m空中ギャップ・7/7自動PASS（手動HOLD）'],
  ['VB-P101-A13-W9C2-G4E6-B0-65-1','G4E-6 B0-65-1 — 真の6.91m空中ギャップ・7/7自動PASS（手動HOLD）']]){
  const option=document.createElement('option');option.value=id;option.textContent=label;
  $('stage').append(option);
 }
}
const g4e7gOptIn=g4e6LocalHost&&new URLSearchParams(window.location.search).get('g4e7g')==='on';
const g4e7gPoint=new URLSearchParams(window.location.search).get('g4e7gPoint')==='crown'?'crown':'skyline';
const g4e7gHold=g4e7gOptIn&&new URLSearchParams(window.location.search).get('g4e7gFrame')==='hold';
const g4e7hRequested=g4e7gOptIn&&new URLSearchParams(window.location.search).get('g4e7h')==='candidate';
const g4e7iRequested=g4e7hRequested&&new URLSearchParams(window.location.search).get('g4e7i')==='candidate';
const g4e7jRequested=g4e7iRequested&&new URLSearchParams(window.location.search).get('g4e7j')==='matrix';
const g4e7kRequested=g4e7gOptIn&&new URLSearchParams(window.location.search).get('g4e7k')==='quiet';
const g4e7lRequested=g4e7gOptIn&&new URLSearchParams(window.location.search).get('g4e7l')==='monument';
const g4e7mOptIn=g4e6LocalHost&&new URLSearchParams(window.location.search).get('g4e7m')==='on';
const g4e7mHold=g4e7mOptIn&&new URLSearchParams(window.location.search).get('g4e7mFrame')==='hold';
const g4e7oRequested=g4e7mOptIn&&!g4e7mHold&&new URLSearchParams(window.location.search).get('g4e7o')==='manual';
const g4e7pRequested=g4e7mOptIn&&!g4e7oRequested&&
 new URLSearchParams(window.location.search).get('g4e7p')==='quiet';
const g4e7mPoint=new URLSearchParams(window.location.search).get('g4e7mPoint')==='crown'?'crown':'skyline';
const g4e7qOptIn=g4e6LocalHost&&new URLSearchParams(window.location.search).get('g4e7q')==='on';
const g4e7qHold=g4e7qOptIn&&new URLSearchParams(window.location.search).get('g4e7qFrame')==='hold';
const g4e7qPoint=new URLSearchParams(window.location.search).get('g4e7qPoint')==='landing'?'landing':'crest';
const g4e7rOptIn=g4e6LocalHost&&new URLSearchParams(window.location.search).get('g4e7r')==='on';
const g4e7rHold=g4e7rOptIn&&new URLSearchParams(window.location.search).get('g4e7rFrame')==='hold';
const g4e7rPoint=new URLSearchParams(window.location.search).get('g4e7rPoint')==='post'?'post':'approach';
const g4e7sOptIn=g4e7rOptIn&&g4e7rHold&&
 new URLSearchParams(window.location.search).get('g4e7s')==='speed';
const g4e7sPoint=['approach','lip','flight','rejoin'].includes(
 new URLSearchParams(window.location.search).get('g4e7sPoint'))?
 new URLSearchParams(window.location.search).get('g4e7sPoint'):'lip';
const g4e7sScene=new URLSearchParams(window.location.search).get('g4e7sScene')==='shards'?'shards':'baseline';
const g4e7tOptIn=g4e6LocalHost&&new URLSearchParams(window.location.search).get('g4e7t')==='on';
const g4e7tHold=g4e7tOptIn&&new URLSearchParams(window.location.search).get('g4e7tFrame')==='hold';
const g4e7tPoint=new URLSearchParams(window.location.search).get('g4e7tPoint')==='landing'?'landing':'approach';
const g4e7vOptIn=g4e6LocalHost&&new URLSearchParams(window.location.search).get('g4e7v')==='on'&&
 new URLSearchParams(window.location.search).get('g4e7vFrame')==='hold';
const g4e7vPoint=['approach','impact','outbound','lookahead'].includes(
 new URLSearchParams(window.location.search).get('g4e7vPoint'))?
 new URLSearchParams(window.location.search).get('g4e7vPoint'):'impact';
const g4e7wOptIn=g4e6LocalHost&&new URLSearchParams(window.location.search).get('g4e7w')==='on'&&
 new URLSearchParams(window.location.search).get('g4e7wFrame')==='hold';
// Explicit loopback + native-frame hold; absent from every ordinary stage menu.
const g4e7aiOptIn=g4e6LocalHost&&new URLSearchParams(window.location.search).get('g4e7ai')==='on'&&
 new URLSearchParams(window.location.search).get('g4e7aiFrame')==='hold'&&
 new URLSearchParams(window.location.search).get('g4e7ad')!=='on';
const g4e7aiBackdrop=g4e7aiOptIn&&new URLSearchParams(window.location.search).get('g4e7aiBackdrop')==='quiet'?'quiet':'legacy';
const g4e7akOptIn=g4e6LocalHost&&!g4e7aiOptIn&&new URLSearchParams(window.location.search).get('g4e7ak')==='on'&&
 new URLSearchParams(window.location.search).get('g4e7akFrame')==='hold';
// AL is genuine live manual physics, never the P96 frame-held AK experiment.
const g4e7alRequested=g4e6LocalHost&&!g4e7akOptIn&&!g4e7aiOptIn&&!g4e7mOptIn&&
 new URLSearchParams(window.location.search).get('g4e7al')==='manual'&&
 new URLSearchParams(window.location.search).get('g4e7akFrame')!=='hold';
const g4e7alSession=g4e7alRequested?newG4E7ALSession():null;
// AM: private art-only A/B; the default AL stage and real 240Hz collision stay unchanged.
const g4e7amRequested=g4e7alRequested&&new URLSearchParams(window.location.search).get('g4e7am')==='continent';
// AN is an independent opt-in. Never stack with rejected AM or other scenery.
const g4e7anRequested=g4e7alRequested&&!g4e7amRequested&&new URLSearchParams(window.location.search).get('g4e7an')==='archipelago';
const g4e7anFocus=g4e7anRequested&&AN_FOCUS.includes(new URLSearchParams(window.location.search).get('g4e7anFocus'))?
 new URLSearchParams(window.location.search).get('g4e7anFocus'):'all';
const g4e7asRequested=g4e7alRequested&&!g4e7amRequested&&!g4e7anRequested&&
 new URLSearchParams(window.location.search).get('g4e7as')==='bank';
const g4e7apRequested=g4e7alRequested&&!g4e7amRequested&&!g4e7anRequested&&!g4e7asRequested&&
 new URLSearchParams(window.location.search).get('g4e7ap')==='duel';
const g4e7aoRequested=g4e7alRequested&&!g4e7amRequested&&!g4e7anRequested&&!g4e7apRequested&&!g4e7asRequested&&
 new URLSearchParams(window.location.search).get('g4e7ao')==='on';
const g4e7alStageCode=g4e7asRequested?'G4E7AS':g4e7apRequested?'G4E7AP':'G4E7AK';
const g4e7akBackdrop=g4e7akOptIn&&new URLSearchParams(window.location.search).get('g4e7akBackdrop')==='quiet'?'quiet':'legacy';
const g4e7akPoint=['t220','t250','t280','t320','t520','t690'].includes(
 new URLSearchParams(window.location.search).get('g4e7akPoint'))?
 new URLSearchParams(window.location.search).get('g4e7akPoint'):'t280';
const g4e7adOptIn=g4e6LocalHost&&new URLSearchParams(window.location.search).get('g4e7ad')==='on'&&
 new URLSearchParams(window.location.search).get('g4e7adFrame')==='hold';
const g4e7adScene=g4e7adOptIn&&new URLSearchParams(window.location.search).get('g4e7adScene')==='city'?'city':'clear';
const g4e7aePreview=g4e7adOptIn&&new URLSearchParams(window.location.search).get('g4e7ae')==='on';
const g4e7aeScene=g4e7aePreview&&new URLSearchParams(window.location.search).get('g4e7aeScene')==='rift'?'rift':'legacy';
const g4e7afReplacement=g4e7aePreview&&new URLSearchParams(window.location.search).get('g4e7af')==='on'&&
 new URLSearchParams(window.location.search).get('g4e7afScene')==='citadel';
const g4e7agReplacement=g4e7aePreview&&new URLSearchParams(window.location.search).get('g4e7ag')==='on'&&
 new URLSearchParams(window.location.search).get('g4e7agScene')==='open';
const g4e7aeReplacement=g4e7aePreview&&g4e7aeScene==='rift'&&!g4e7afReplacement;
const g4e7adPoint=['t315','t365','t415','t450','t515','t600'].includes(
 new URLSearchParams(window.location.search).get('g4e7adPoint'))?
 new URLSearchParams(window.location.search).get('g4e7adPoint'):'t365';
if(g4e7aiOptIn)for(const id of ['R2-CONTROL','TRUE-PINCH','PINCH-SWITCH']){
 const opt=document.createElement('option');
 opt.value='VB-P101-A13-W9C2-G4E7AI-'+id;
 opt.textContent='G4E-7AI '+id+' / REAL B48 240Hz / NOT HUMAN';
 $('stage').append(opt);
}
const g4e7aiPoint=['t315','t365','t415','t450','t515','t600'].includes(
 new URLSearchParams(window.location.search).get('g4e7aiPoint'))?
 new URLSearchParams(window.location.search).get('g4e7aiPoint'):'t365';
if(g4e7alRequested)for(const road of G4E7AL_ROADS){
 const option=document.createElement('option');
 option.value='VB-P101-A13-W9C2-'+g4e7alStageCode+'-'+road.toUpperCase();
 option.textContent=(g4e7asRequested?'G4E-7AS BANKED SERPENT ':g4e7apRequested?'G4E-7AP PHYSICAL DUEL ':'G4E-7AL MANUAL ')+road.toUpperCase()+' / TRUE B48 + B51 / HOLD';
 $('stage').append(option);
}
if(g4e7akOptIn)for(const id of ['TRUE-PINCH','PINCH-SWITCH']){
 const option=document.createElement('option');
 option.value='VB-P101-A13-W9C2-G4E7AK-'+id;
 option.textContent='G4E-7AK '+id+' / REANCHORED 28 B51-C / NOT HUMAN';
 $('stage').append(option);
}
if(g4e7adOptIn)for(const [variant,label] of [['APPROACH-ARC','APPROACH ARC'],['LANDING-CRESCENT','LANDING CRESCENT']]){
 const option=document.createElement('option');
 option.value='VB-P101-A13-W9C2-G4E7AD-'+variant;
 option.textContent='G4E-7AD '+label+' / real 240Hz / research HUMAN HOLD';
 $('stage').append(option);
}
const g4e7xGuideRequested=g4e7wOptIn&&new URLSearchParams(window.location.search).get('g4e7xGuide')==='on';
const g4e7xVanesRequested=g4e7wOptIn&&new URLSearchParams(window.location.search).get('g4e7xGuide')==='vanes';
const g4e7zRequested=g4e7wOptIn&&new URLSearchParams(window.location.search).get('g4e7zGuide')==='on';
const g4e7yRequested=new URLSearchParams(window.location.search).get('g4e7yScene');
const g4e7yScene=g4e7wOptIn&&['quiet','open','vista','vista2'].includes(g4e7yRequested)?
 g4e7yRequested:'baseline';
const g4e7yEarlyPoint=g4e7wOptIn&&['t265','t315','t365','t415','t450'].includes(
 new URLSearchParams(window.location.search).get('g4e7yEarly'))?
 new URLSearchParams(window.location.search).get('g4e7yEarly'):null;
const g4e7wPoint=['approach','lip','flight','landing','post'].includes(
 new URLSearchParams(window.location.search).get('g4e7wPoint'))?
 new URLSearchParams(window.location.search).get('g4e7wPoint'):'flight';
if(g4e7wOptIn)for(const [stage,name] of [['VB-P101-A13-W9C2-G4E7W-BLEND-0-65','A065'],
 ['VB-P101-A13-W9C2-G4E7W-BLEND-0-7','A070']]){
 const option=document.createElement('option');
 option.value=stage;option.textContent='G4E-7W '+name+' genuine 15.76m / native240Hz / HUMAN HOLD';
 $('stage').append(option);
}
if(g4e7vOptIn)for(const name of ['ORIGINAL','EXIT6','SLOPE6']){
 const option=document.createElement('option');
 option.value='VB-P101-A13-W9C2-G4E7V-'+name;
 option.textContent='G4E-7V '+name+' — actual native 240Hz scripted camera / HOLD';
 $('stage').append(option);
}
if(g4e7tOptIn)for(const variant of ['SOLID','EARLY','LATE']){
 const option=document.createElement('option');option.value='VB-P101-A13-W9C2-G4E7T-'+variant;
 option.textContent='G4E-7T '+variant+' / REAL EARLY B48 13m / HUMAN HOLD';
 $('stage').append(option);
}
if(g4e7rOptIn){
 for(const [id,label] of [
  ['VB-P101-A13-W9C2-G4E7R-SWEEP','G4E-7R SWEEP — graded real B48 (HOLD)'],
  ['VB-P101-A13-W9C2-G4E7R-CUT','G4E-7R CUT — real gap / honest native crossing (HOLD)']
 ]){const opt=document.createElement('option');opt.value=id;opt.textContent=label;$('stage').append(opt);}
}
if(g4e7qOptIn){
 for(const [id,label] of [
  ['VB-P101-A13-W9C2-G4E7Q-DROP','G4E-7Q DROP — genuine B48 dive, no gap / human HOLD'],
  ['VB-P101-A13-W9C2-G4E7Q-LEAP','G4E-7Q LEAP — true open collision gap / human HOLD']
 ]){const option=document.createElement('option');option.value=id;option.textContent=label;$('stage').append(option);}
}
if(g4e7mOptIn){
 for(const [id,label] of [
  ['VB-P101-A13-W9C2-G4E7M-THREAD','G4E-7M THREAD 15.4m TRUE B48 / AUTO FAILED / HUMAN HOLD'],
  ['VB-P101-A13-W9C2-G4E7M-PRECIPICE','G4E-7M PRECIPICE 13.1m TRUE B48 / AUTO 7/7 / HUMAN HOLD']
 ]){const o=document.createElement('option');o.value=id;o.textContent=label;$('stage').append(o);}
}
if(g4e7gOptIn){
 for(const [id,label] of [
  ['VB-P101-A13-W9C2-G4E7G-GOLD','G4E-7G GOLD — unchanged W7F clone, visual only'],
  ['VB-P101-A13-W9C2-G4E7G-GLIDE','G4E-7G GLIDE — actual 300m B48 road, HUMAN HOLD']]){
  const o=document.createElement('option');o.value=id;o.textContent=label;$('stage').append(o);
 }
}
const g4e7bRequested=g4e6LocalOptIn&&new URLSearchParams(window.location.search).get('g4e7b')==='scripted';
const g4e7cRequested=g4e6LocalOptIn&&new URLSearchParams(window.location.search).get('g4e7c')==='candidate';
const g4e7dRequested=g4e7cRequested&&!g4e7bRequested&&new URLSearchParams(window.location.search).get('g4e7d')==='manual';
const g4e7dSession=g4e7dRequested?createG4E7DSession():null;
const canvas=$('view'),status=$('appStatus'),keys=new Set();
let gl,program,locations={},roads,lines,p100RoadRead,p101B5RoadOptic,a13ArchMesh,a13RoadArtMesh,w9c1MarkMesh,g5bSceneryMesh,g4dSkywayMesh,flowRoads,shoulderLights,approachBeacons,hazardGateMesh,hazardGateSolidMesh,hazardRoadPlan,ball,ghostMesh,energyMeshes={},energyFx=true,scenery,megaWorld,megaEnabled=true,machineMeshes={},a13MachineMeshes={},guideMeshes=[];
let doc,world,runner,loading=0,paused=false,accum=0,last=0,fps=0,frames=0,fpsAt=0,left=false,right=false;
let g4e7cCueMesh=null,g4e7cCueActive=false,g4e7cCue=null,g4e7cButton=null;
let g4e7xCueMesh=null,g4e7zCueMesh=null,g4e7adCityMesh=null,g4e7aeMesh=null,g4e7afMesh=null,g4e7agMesh=null,g4e7amMesh=null,g4e7anMesh=null,g4e7aoMesh=null,g4e7adShot=null,g4e7adActive=false,g4e7aiShot=null,g4e7aiActive=false,g4e7akShot=null,g4e7akActive=false;
let g4e7dTrial=null,g4e7dPanel=null,g4e7oTrial=null,g4e7oPanel=null,g4e7oResultDownload=null,g4e7alTrial=null,g4e7alPanel=null,g4e7alResultDownload=null,g4e7alActive=false;
let g4e7gActive=false,g4e7mActive=false,g4e7oActive=false,g4e7qActive=false,g4e7rActive=false,g4e7tActive=false,g4e7vActive=false,g4e7vShot=null,g4e7wActive=false,g4e7wShot=null,g4e7sShot=null,g4e7sTrace=null,g4e7sShardMesh=null,g4e7hHud=null,g4e7iUi=null,g4e7iMesh=null,g4e7iContour=null,g4e7jUi=null,g4e7kUi=null,g4e7kQuietMesh=null,g4e7pQuietMesh=null,g4e7lUi=null,g4e7lRiftMesh=null,g4e7lSeamMesh=null;
let previousPose=null,currentPose=null,cameraState=null,comparisonMode='stable',frameSkips=0,headingError=0;
let nearMissTracker=createNearMissTracker(),runCommitted=false,personalBest=null;
let demoMode=false,demoDirector=createNativeDemoState();
let renderQuality=createRenderQuality('auto'),visibilityFx=true;
let practiceMode=false,practiceStartedAt=null,seekingChapter=null,retryChapterId=null,lastEdgeRadarAt=0;
let chapterTracker=null,latestSplit=null,ghostData=null,ghostEnabled=false;
let p101B5Surge=createP101B5SurgeState(),a13Surge=createA13SurgeState();
let b5ManualAudit=null,b5PreviousAudit=null,w9c1CueProfile=null,g4e7bQa=null;
// Explicit candidate opt-in via URL; no normal game, road or global toggle changes.
const g5bVisualOptIn=new URLSearchParams(window.location.search).get('g5b')==='on'||new URLSearchParams(window.location.hash.slice(1)).get('g5b')==='on';
const g4dVisualOptIn=new URLSearchParams(window.location.search).get('g4d')==='on'||new URLSearchParams(window.location.hash.slice(1)).get('g4d')==='on';
const guidedPairTrial=new URLSearchParams(window.location.search).get('guided')==='1';
const pairTrialIds=new Set(['VB-P101-A13-W9C1-CONTROL','VB-P101-A13-W9C1-ULTRA']);
const g4e7oSession=newG4E7OSession();
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),mul=(a,k)=>a.map(x=>x*k),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm=a=>mul(a,1/(Math.hypot(...a)||1));
const push=(v,p,c)=>v.push(p[0],p[1],p[2],c[0],c[1],c[2]);
function tri(v,a,b,c,col){push(v,a,col);push(v,b,col);push(v,c,col);}
function box(color){
 const v=[],p=[[-.5,-.5,-.5],[-.5,-.5,.5],[-.5,.5,-.5],[-.5,.5,.5],[.5,-.5,-.5],[.5,-.5,.5],[.5,.5,-.5],[.5,.5,.5]];
 for(const [a,b,c,d] of [[0,4,6,2],[1,3,7,5],[0,1,5,4],[2,6,7,3],[0,2,3,1],[4,5,7,6]]){tri(v,p[a],p[b],p[c],color);tri(v,p[a],p[c],p[d],color);}
 return v;
}
function orb(){
 const v=[],rings=10,seg=14,c=[.18,1,.95],p=(a,b)=>[.65*Math.sin(a)*Math.cos(b),.65*Math.cos(a),.65*Math.sin(a)*Math.sin(b)];
 for(let i=0;i<rings;i++)for(let j=0;j<seg;j++){const a=Math.PI*i/rings,a2=Math.PI*(i+1)/rings,b=2*Math.PI*j/seg,b2=2*Math.PI*(j+1)/seg;const q=[p(a,b),p(a2,b),p(a2,b2),p(a,b2)];tri(v,q[0],q[1],q[2],c);tri(v,q[0],q[2],q[3],c);}
 return v;
}
function shader(type,source){
 const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
 if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;
}
function mesh(v){
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.STATIC_DRAW);
 return {buffer,count:v.length/6};
}
function discard(m){if(m?.buffer)gl.deleteBuffer(m.buffer);}
function init(){
 gl=canvas.getContext('webgl2',{antialias:true,alpha:false});
 if(!gl)throw Error('WebGL2が無効です。GPUまたはブラウザの設定をご確認ください。');
 const vertex=[
 '#version 300 es','precision highp float;',
 'layout(location=0) in vec3 p;layout(location=1) in vec3 color;',
 'uniform vec3 eye,camRight,camUp,camFront,translation,scale;uniform float yaw,aspect,fogStrength,fogStart,fogSpan;',
 'out vec3 shade;out float haze;',
 'void main(){vec3 d=p*scale;float c=cos(yaw),s=sin(yaw);',
 'vec3 w=vec3(c*d.x+s*d.z,d.y,-s*d.x+c*d.z)+translation-eye;',
 'float x=dot(w,camRight),y=dot(w,camUp),z=dot(w,camFront);',
 'gl_Position=vec4(1.35*x/aspect,1.35*y,1.00022*z-1.30014,z);shade=color;haze=clamp((length(w)-fogStart)/fogSpan,0.0,'+FOG_MAX.toFixed(2)+')*fogStrength;}'
 ].join('\n');
 const fragment=[
 '#version 300 es','precision highp float;in vec3 shade;in float haze;out vec4 outColor;',
 'void main(){outColor=vec4(mix(shade,vec3(.019,.041,.083),haze),1.0);}'
 ].join('\n');
 program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
 gl.useProgram(program);
 for(const name of ['eye','camRight','camUp','camFront','translation','scale','yaw','aspect','fogStrength','fogStart','fogSpan'])locations[name]=gl.getUniformLocation(program,name);
 gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);gl.clearColor(.019,.041,.083,1);
 ball=mesh(orb());ghostMesh=mesh(ghostLatticeVertices());
 const energyVisual=makeEnergyBallVisual();
 for(const key of ['shell','filaments','orbits','trails'])energyMeshes[key]=mesh(energyVisual[key]);
 canvas.dataset.energyVertices=String(energyVisual.totalVertices);
 for(const type of ['slider','rotator','piston'])for(const mode of ['fail','bounce','push'])
  {machineMeshes[type+':'+mode]=mesh(obstacleBodyVertices(type,mode));
   a13MachineMeshes[type+':'+mode]=mesh(a13MachineBodyVertices(type,mode));}
}
function buildVisual(stage){
 const vertex=[],wire=[];
 const base={'EP-001':[.3,.85,1],'HS-001':[.64,.53,1],'WV-001':[.33,.67,1],'HG-001':[.25,.98,.64]}[stage.stageForge.id]||[.35,.85,1];
 for(const s of stage.surfaces){
  if(s.visible===false)continue;
  // Physical gap preview must never render a deceptive continuous road over
  // a missing B48 collider. Match longitudinal visual cells to true tessellation.
  const nu=s.voidLongitudinalCells?.length?(s.rows-1)*s.resolution:
   Math.min(48,Math.max(7,(s.rows-1)*3)),nv=Math.min(12,Math.max(4,(s.cols-1)*2));
  const points=Array.from({length:nu+1},(_,i)=>Array.from({length:nv+1},(_,j)=>sample(s,i/nu,j/nv)));
  const color=mul(base,s.rideable?(s.material==='road'?.49:.62):.3);
  for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){if(s.voidLongitudinalCells?.includes(i))continue;const a=points[i][j],b=points[i+1][j],c=points[i+1][j+1],d=points[i][j+1];tri(vertex,a,b,c,color);tri(vertex,a,c,d,color);}
  if(s.rideable)for(const j of [0,nv])for(let i=0;i<nu;i++){if(s.voidLongitudinalCells?.includes(i))continue;push(wire,points[i][j],[.22,.95,1]);push(wire,points[i+1][j],[.22,.95,1]);}
 }
 for(const f of stage.fixtures??[]){
  const color=f.kind==='danger'?[1,.19,.27]:f.kind==='reward'?[1,.86,.28]:[.4,.52,.67];
  for(const t of fixtureTriangles(f))tri(vertex,t[0],t[1],t[2],color);
 }
 for(let i=0;i<stage.route.length-1;i+=2){push(wire,add(stage.route[i],[0,.3,0]),[.11,.72,.64]);push(wire,add(stage.route[i+1],[0,.3,0]),[.11,.72,.64]);}
 discard(roads);discard(lines);discard(p100RoadRead);discard(p101B5RoadOptic);discard(a13ArchMesh);discard(a13RoadArtMesh);discard(g4e7kQuietMesh);discard(g4e7pQuietMesh);discard(g4e7lRiftMesh);discard(g4e7lSeamMesh);discard(g4e7sShardMesh);discard(g4e7adCityMesh);discard(g4e7aeMesh);discard(g4e7afMesh);discard(g4e7agMesh);discard(g4e7amMesh);discard(g4e7anMesh);discard(g4e7aoMesh);discard(g4e7cCueMesh);discard(g4e7xCueMesh);discard(g4e7zCueMesh);discard(g4e7iMesh);discard(w9c1MarkMesh);discard(g5bSceneryMesh);discard(g4dSkywayMesh);discard(flowRoads);discard(shoulderLights);discard(approachBeacons);discard(hazardGateMesh);discard(hazardGateSolidMesh);discard(scenery);discard(megaWorld);
 for(const entry of guideMeshes)discard(entry.mesh);
 guideMeshes=makeMachineMeshes(stage.movingObstacles).map(x=>({id:x.id,mesh:mesh(x.guide)}));
 roads=mesh(vertex);lines=mesh(wire);
 const roadRead=p100RoadReadGeometry(stage,sample,frame);p100RoadRead=mesh(roadRead.vertices);
 canvas.dataset.roadReadStripes=String(roadRead.stripes);
 canvas.dataset.roadReadBars=String(roadRead.flowBars);
 const b5Optics=p101B5OpticalRoadGeometry(stage,sample,frame);
 p101B5RoadOptic=mesh(b5Optics.vertices);
 canvas.dataset.b5OpticalDashes=String(b5Optics.dashes);
 canvas.dataset.b5OpticalEdgeTicks=String(b5Optics.edgeTicks);
 canvas.dataset.b5OpticalNonCollision=String(b5Optics.nonCollision);
  if(g4e7yScene!=='baseline'&&!stage.stageForge?.g4e7wStudy)
   throw Error('G4E-7Y scenery is only permitted on private proven real B48 gap');
  const arch=a13MachineMegastructures(stage,sample,{quietGapSection0:g4e7yScene!=='baseline'});
  const hero=a13W9HeroArchitecture(stage,sample,{quietFirstSection:g4e7yScene!=='baseline'});
  a13ArchMesh=mesh([...arch.vertices,...hero.vertices]);
  canvas.dataset.g4e7yScene=g4e7yScene;
  canvas.dataset.g4e7yRemovedHazardFrames=String(arch.removed??0);
  canvas.dataset.g4e7yHeroFacilities=String(hero.facilities);
  canvas.dataset.g4e7yRetainedMachines=String(stage.movingObstacles.length);
  canvas.dataset.g4e7yActualB48Unmodified=String(g4e7yScene==='baseline'||Boolean(stage.stageForge?.g4e7wStudy));
  const adCity=g4e7adCity(stage,sample,{enabled:g4e7adOptIn&&g4e7adScene==='city'});
  g4e7adCityMesh=adCity.active?mesh(adCity.vertices):null;
  canvas.dataset.g4e7adScene=g4e7adOptIn?g4e7adScene:'off';
  canvas.dataset.g4e7adSpires=String(adCity.spires);
  canvas.dataset.g4e7adWindows=String(adCity.windows);
  canvas.dataset.g4e7adTriangles=String(adCity.triangles);
  canvas.dataset.g4e7adClearanceMeters=String(adCity.minClearanceMeters);
  canvas.dataset.g4e7adNonCollision=String(adCity.nonCollision);
  // G4E-7AE must REPLACE legacy scenery at the exact same R2 physics/camera,
  // not add decorative towers over the old rectangular gateways.
  const ae=g4e7aeSplitHorizon(stage,sample,{enabled:g4e7aeReplacement});
  g4e7aeMesh=ae.enabled?mesh(ae.vertices):null;
  canvas.dataset.g4e7aeScene=g4e7aePreview?g4e7aeScene:'off';
  canvas.dataset.g4e7aeReplacesLegacy=String(g4e7aeReplacement);
  canvas.dataset.g4e7aeBanks=String(ae.bankCount);
  canvas.dataset.g4e7aeFolds=String(ae.folds);
  canvas.dataset.g4e7aeVoids=String(ae.voids);
  canvas.dataset.g4e7aeTriangles=String(ae.triangles);
  canvas.dataset.g4e7aeClearance=String(ae.minOutboardMeters);
  canvas.dataset.g4e7aeNonCollision=String(ae.nonCollision);
  const af=g4e7afFractureCity(stage,sample,{enabled:g4e7afReplacement});
  g4e7afMesh=af.enabled?mesh(af.vertices):null;
  canvas.dataset.g4e7afScene=g4e7afReplacement?'citadel':'off';
  canvas.dataset.g4e7afDistricts=String(af.districts);
  canvas.dataset.g4e7afAtriumHoles=String(af.atriumHoles);
  canvas.dataset.g4e7afLitShear=String(af.litShearFolds);
  canvas.dataset.g4e7afTriangles=String(af.triangles);
  canvas.dataset.g4e7afPhysicsPreserved=String(!af.physicalChanges&&af.addedCollision===0&&af.addedRoads===0);
  const ag=g4e7agOpenCitadel(stage,sample,{enabled:g4e7agReplacement});
  g4e7agMesh=ag.enabled?mesh(ag.vertices):null;
  canvas.dataset.g4e7agScene=g4e7agReplacement?'open':'off';
  canvas.dataset.g4e7agLandmarks=String(ag.landmarks);
  canvas.dataset.g4e7agOpenCenters=String(ag.openCenters);
  canvas.dataset.g4e7agIslands=String(ag.urbanIslands);
  canvas.dataset.g4e7agLightRibs=String(ag.lightRibs);
  canvas.dataset.g4e7agTriangles=String(ag.triangles);
  canvas.dataset.g4e7agMinimumOutboard=String(ag.minimumOutboardMeters);
  canvas.dataset.g4e7agPhysicsUnchanged=String(!ag.physicalChanges&&ag.addedCollision===0&&ag.addedRoads===0);
  const am=g4e7amUpturnedCity(stage,sample,{enabled:g4e7amRequested});
  g4e7amMesh=am.active?mesh(am.vertices):null;
  canvas.dataset.g4e7amScene=am.active?'continent':'off';
  canvas.dataset.g4e7amBanks=String(am.banks);
  canvas.dataset.g4e7amVoids=String(am.negativeSpaceBays);
  canvas.dataset.g4e7amMacroSkyOpenings=String(am.macroSkyOpenings);
  canvas.dataset.g4e7amTerraces=String(am.terraces);
  canvas.dataset.g4e7amSpines=String(am.citySpines);
  canvas.dataset.g4e7amTriangles=String(am.triangles);
  canvas.dataset.g4e7amRiseMeters=String(am.maxRiseMeters);
  canvas.dataset.g4e7amOutboard=String(am.minimumOutboardMeters);
  canvas.dataset.g4e7amNonCollision=String(!am.physicalChanges&&am.extraRoads===0&&am.extraMachines===0);
  const an=g4e7anSkyArchipelago(stage,sample,{enabled:g4e7anRequested,focus:g4e7anFocus});
  g4e7anMesh=an.active?mesh(an.vertices):null;
  canvas.dataset.g4e7anScene=an.active?'archipelago':'off';
  canvas.dataset.g4e7anFocus=an.active?an.focus:'off';
  canvas.dataset.g4e7anMonuments=String(an.monuments);
  canvas.dataset.g4e7anCrown=String(an.hollowCrowns);
  canvas.dataset.g4e7anProngs=String(an.splitCitadelProngs);
  canvas.dataset.g4e7anDecks=String(an.floatingDecks);
  canvas.dataset.g4e7anBranches=String(an.harpoonBranches);
  canvas.dataset.g4e7anTriangles=String(an.triangles);
  canvas.dataset.g4e7anSetback=String(an.minimumOutboardMeters);
  canvas.dataset.g4e7anNonCollision=String(an.nonCollision&&an.addedCollision===0&&an.addedRoads===0&&an.addedMachines===0);
  const ao=g4e7aoActualB51Warning(stage,sample,{enabled:g4e7aoRequested});
  g4e7aoMesh=ao.active?mesh(ao.vertices):null;
  canvas.dataset.g4e7apMode=g4e7apRequested&&stage.stageForge?.g4e7apStudy?.id==='temporal-slalom'?'true-b51-temporal-slalom':'off';
  canvas.dataset.g4e7asMode=g4e7asRequested&&stage.stageForge?.g4e7asStudy?.id==='banked-serpent'?'real-b48-banked-serpent':'off';
  canvas.dataset.g4e7aoMode=ao.active?'real-b51-approach':'off';
  canvas.dataset.g4e7aoHazards=String(ao.hazards);
  canvas.dataset.g4e7aoStations=String(ao.stations.length);
  canvas.dataset.g4e7aoFirstU=String(ao.stations[0]?.u??'off');
  canvas.dataset.g4e7aoOffRoadOnly=String(ao.warningGeometryOnly&&ao.additionalRoads===0&&ao.additionalB51===0&&!ao.physicalCollisionChanges);
  canvas.dataset.g4e7aoCertifiedMeters=String(ao.certifiedSlope2Meters);
  const shard=g4e7sShardCity(stage,sample,{enabled:g4e7sOptIn&&g4e7sScene==='shards'});
  g4e7sShardMesh=shard.active?mesh(shard.vertices):null;
  canvas.dataset.g4e7sScene=shard.active?'shards':'baseline';
  canvas.dataset.g4e7sSpires=String(shard.spires);
  canvas.dataset.g4e7sVoidWindows=String(shard.voidWindows);
  canvas.dataset.g4e7sTriangles=String(shard.triangles);
  canvas.dataset.g4e7sNonCollision=String(shard.nonCollision);
  canvas.dataset.g4e7sOutboardMeters=String(shard.outboardMinimumMeters);
   const g5b=w9c1G5BSkyline(stage,sample,{enabled:g5bVisualOptIn});
   g5bSceneryMesh=g5b.active?mesh(g5b.vertices):null;
   canvas.dataset.g5bMode=g5b.active?'candidate':'off';
   canvas.dataset.g5bStations=String(g5b.stations);
   canvas.dataset.g5bHeroBlades=String(g5b.heroBlades);
   canvas.dataset.g5bTriangles=String(g5b.vertices.length/18);
   canvas.dataset.g5bClearance=String(g5b.minimumEdgeClearanceMeters??0);
   canvas.dataset.g5bNonCollision=String(g5b.nonCollision);
   const g4d=g4dOutboardSkyways(stage,sample,{enabled:g4dVisualOptIn});
   g4dSkywayMesh=g4d.active?mesh(g4d.vertices):null;
   canvas.dataset.g4dMode=g4d.active?'visual-candidate':'off';
   canvas.dataset.g4dSlabs=String(g4d.slabs);
   canvas.dataset.g4dGaps=String(g4d.voidGaps);
   canvas.dataset.g4dLandmarks=String(g4d.landmarks);
   canvas.dataset.g4dTriangles=String(g4d.vertices.length/18);
   canvas.dataset.g4dNonCollision=String(g4d.nonCollision);
  canvas.dataset.a13W9Facilities=String(hero.facilities);
  canvas.dataset.a13W9Sections=hero.sections.join(',');
  canvas.dataset.a13W9WallPlates=String(hero.wallPlates);
  canvas.dataset.a13W9RoofPlates=String(hero.roofPlates);
  canvas.dataset.a13W9NonCollision=String(hero.nonCollision);
   const art=a13RacingRoadArt(stage,sample,frame);
   a13RoadArtMesh=mesh(art.vertices);
   if(g4e7kRequested&&g4e7kAllowed(stage)){
    const candidate=a13RacingRoadArt(stage,sample,frame,{quietSkyline:true});
    if(candidate.segments!==art.segments||candidate.vertices.length>=art.vertices.length)
     throw Error('G4E7K visual declutter would alter Gold or add GPU geometry');
    g4e7kQuietMesh=mesh(candidate.vertices);
    canvas.dataset.g4e7kQuietChevrons=String(candidate.g4e7k.quietChevrons);
    canvas.dataset.g4e7kTriangleReduction=String((art.vertices.length-candidate.vertices.length)/18);
    canvas.dataset.g4e7kNonCollision=String(candidate.nonCollision);
   }else{
    g4e7kQuietMesh=null;canvas.dataset.g4e7kQuietChevrons='0';
    canvas.dataset.g4e7kTriangleReduction='0';
    canvas.dataset.g4e7kNonCollision='true';
   }
   // G4E-7P: two genuinely narrow B48 road segments; subtract oversized
   // interior chevrons without changing any physics, road edge or camera.
   if(g4e7pRequested&&g4e7pAllowed(stage)){
    const candidate=a13RacingRoadArt(stage,sample,frame,{quietNarrow:true});
    if(candidate.segments!==art.segments||candidate.vertices.length>=art.vertices.length)
     throw Error('G4E-7P must only remove existing GPU road art');
    g4e7pQuietMesh=mesh(candidate.vertices);
    canvas.dataset.g4e7pMode='private-narrow-quiet';
    canvas.dataset.g4e7pRemoved=String((art.vertices.length-candidate.vertices.length)/18);
    canvas.dataset.g4e7pSections=candidate.g4e7p.quietBySection.join(',');
   }else{
    g4e7pQuietMesh=null;
    canvas.dataset.g4e7pMode='off';
    canvas.dataset.g4e7pRemoved='0';
    canvas.dataset.g4e7pSections='0,0';
   }
   // G4E-7L: two huge road-anchored but strictly noncolliding 3D districts.
   // Prepare two visual alternatives only when localhost and exact GLIDE
   // stage were explicitly opted in; none are serialized as road fixtures.
   if(g4e7lRequested&&g4e7lAllowed(stage)){
    const rift=g4e7lTitanArchitecture(stage,sample,{mode:'rift'});
    const seam=g4e7lTitanArchitecture(stage,sample,{mode:'skyseam'});
    g4e7lRiftMesh=mesh(rift.vertices);
    g4e7lSeamMesh=mesh(seam.vertices);
    canvas.dataset.g4e7lRiftTriangles=String(rift.triangles);
    canvas.dataset.g4e7lSkyseamTriangles=String(seam.triangles);
    canvas.dataset.g4e7lSkyseamCount=String(seam.skySeams);
    canvas.dataset.g4e7lDistricts=String(rift.districts);
    canvas.dataset.g4e7lVoidBays=String(rift.openVoidBays);
    canvas.dataset.g4e7lHighestMeters=String(seam.maximumAltitudeAboveRoadMeters);
    canvas.dataset.g4e7lNonCollision=String(seam.nonCollision);
   }else{
    g4e7lRiftMesh=null;g4e7lSeamMesh=null;
    canvas.dataset.g4e7lRiftTriangles='0';canvas.dataset.g4e7lSkyseamTriangles='0';
    canvas.dataset.g4e7lSkyseamCount='0';canvas.dataset.g4e7lDistricts='0';
    canvas.dataset.g4e7lVoidBays='0';canvas.dataset.g4e7lHighestMeters='0';
    canvas.dataset.g4e7lNonCollision='true';
   }
   g4e7iContour=g4e7iSkylineContours(stage,sample,frame,{enabled:g4e7iRequested});
   g4e7iMesh=g4e7iContour.active?mesh(g4e7iContour.vertices):null;
   canvas.dataset.g4e7iTriangles=String(g4e7iContour.triangles);
   canvas.dataset.g4e7iNonCollision=String(g4e7iContour.nonCollision);
   canvas.dataset.g4e7iGeometryEligible=String(g4e7iContour.active);
   const legible=g4e7xGapReading(stage,sample,frame,{enabled:g4e7xGuideRequested});
   const vanes=g4e7xOutboardVanes(stage,sample,frame,{enabled:g4e7xVanesRequested});
   const signal=vanes.enabled?vanes:legible;
   g4e7xCueMesh=signal.enabled?mesh(signal.vertices):null;
   canvas.dataset.g4e7xGuide=vanes.enabled?'REAL_OUTBOARD_FINS_NONCOLLISION':
     legible.enabled?'REAL_GAP_PAINT_NONCOLLISION':'off';
   canvas.dataset.g4e7xGuideTriangles=String(signal.triangles);
   canvas.dataset.g4e7xUpstreamMarkers=String(legible.upstreamMarks??0);
   canvas.dataset.g4e7xDownstreamMarkers=String(legible.downstreamMarks??0);
   canvas.dataset.g4e7xOutboardVanes=String(vanes.stations.length);
   canvas.dataset.g4e7xMinimumOutboardMeters=String(vanes.minimumOutboardMeters??0);
   canvas.dataset.g4e7xNoFakeBridge=String(vanes.enabled?vanes.noDeckAboveGap:legible.noFakeBridge);
   canvas.dataset.g4e7xEarliestMeters=String(legible.earliestLookaheadMeters??0);
   if(g4e7zRequested&&g4e7yScene!=='vista2')
    throw Error('G4E-7Z requires private two-chapter vista');
   const signals=g4e7zLowProfileSignals(stage,sample,frame,{enabled:g4e7zRequested});
   g4e7zCueMesh=signals.enabled?mesh(signals.vertices):null;
   canvas.dataset.g4e7zMode=signals.enabled?'TRUE_B48_OUTBOARD_NO_FAKE_FLOOR':'off';
   canvas.dataset.g4e7zStations=String(signals.stations.length);
   canvas.dataset.g4e7zTriangles=String(signals.triangles);
   canvas.dataset.g4e7zEdgeClearance=String(signals.edgeClearanceMeters??0);
   canvas.dataset.g4e7zTrueVoid=String(signals.noFakeFloor);
   canvas.dataset.g4e7zPhysicsUnchanged=String(signals.physicalB48Unchanged??true);
   g4e7cCue=g4e7cGapRoadCues(stage,sample,frame,{enabled:g4e7cRequested});
   g4e7cCueMesh=mesh(g4e7cCue.vertices);
   g4e7cCueActive=g4e7cCue.active&&(!g4e7dRequested||G4E7D_PROTOCOL[g4e7dSession.index]?.cue===true);
   canvas.dataset.g4e7cMode=g4e7cCue.active?'private-opt-in':'off';
   canvas.dataset.g4e7cCueActive=String(g4e7cCueActive);
   canvas.dataset.g4e7cTriangles=String(g4e7cCue.triangles);
   canvas.dataset.g4e7cNonCollision=String(g4e7cCue.nonCollision);
   if(g4e7cCue.active&&!g4e7cButton){
    const btn=document.createElement('button');
    btn.id='g4e7cCueToggle';btn.type='button';
    btn.setAttribute('aria-label','G4E-7C 非衝突ギャップ描画候補の比較切替');
    btn.addEventListener('click',()=>{
     if(!g4e7cCue?.active||g4e7dTrial)return;
     g4e7cCueActive=!g4e7cCueActive;
     canvas.dataset.g4e7cCueActive=String(g4e7cCueActive);
     btn.textContent='G4E-7C 実路面ライン '+(g4e7cCueActive?'ON':'OFF')+'（研究限定）';
    });
    $('stage').parentElement.append(btn);g4e7cButton=btn;
   }
   if(g4e7cButton){
    g4e7cButton.hidden=!g4e7cCue.active;
    g4e7cButton.disabled=g4e7dRequested;
    g4e7cButton.textContent='G4E-7C 実路面ライン '+(g4e7cCueActive?'ON':'OFF')+'（研究限定）';
   }
   w9c1CueProfile=makeW9C1CueProfile(stage,sample);
   const w9c1Marks=w9c1ApproachMarks(stage,sample,frame);
   w9c1MarkMesh=mesh(w9c1Marks.vertices);
   canvas.dataset.w9c1NoticeMarkers=String(w9c1Marks.stations);
   canvas.dataset.w9c1NoticeNonCollision=String(w9c1Marks.nonCollision);
   canvas.dataset.w9c1EdgeSegments=String(w9c1Marks.edgeSegments??0);
   canvas.dataset.a13RoadArtSegments=String(art.segments);
   canvas.dataset.a13RoadArtNonCollision=String(art.nonCollision);
  canvas.dataset.a13MachineArchitecture=String(arch.structures);
  canvas.dataset.a13ArchitectureNonCollision=String(arch.collidable===false);
 canvas.parentElement.dataset.stageId=stage.stageForge.id;
 const caption=document.querySelector('.righttag');
 if(caption){
  if(stage.stageForge.id==='VB-P100')caption.textContent='P100 · DEV ONLY · HUMAN QA HOLD';
  else caption.innerHTML='P97 / REAL ROAD PREWARNING · HUMAN QA HOLD<br>NOT FINAL GAME';
 }
 const flow=flowLineVertices(stage,sample,frame);flowRoads=mesh(flow.vertices);
 canvas.dataset.flowMarkers=String(flow.markers);
 const approach=approachBeaconVertices(stage,sample,frame);approachBeacons=mesh(approach.vertices);
 const p97=hazardRoadGateVertices(stage,sample,frame);
 hazardGateMesh=mesh(p97.vertices);hazardGateSolidMesh=mesh(p97.solidVertices);hazardRoadPlan=makeHazardRoadPlan(stage,sample);
 canvas.dataset.hazardGateCount=String(p97.gates.length);
 canvas.dataset.hazardStationCount=String(p97.stations);
 canvas.dataset.approachBeacons=String(approach.markerCount);
 canvas.dataset.approachRegions=approach.regions.join(',')||'none';
 const reflectors=roadShoulderLights(stage,sample,frame);shoulderLights=mesh(reflectors.vertices);
 canvas.dataset.roadBeaconCount=String(reflectors.beacons);
 canvas.dataset.shoulderBeacons=String(reflectors.beacons);
 const epic=epicGeometry(stage);scenery=epic.length?mesh(epic):null;
 const mega=megastructureGeometry(stage,sample,{firstChapterVista:g4e7yScene==='vista'||g4e7yScene==='vista2',vistaChapters:g4e7yScene==='vista2'?2:1});
 megaWorld=mega.vertices.length?mesh(mega.vertices):null;
 canvas.dataset.g4e7yVista=String(g4e7yScene==='vista');
 canvas.dataset.g4e7yChapter0Portals=String(mega.sections[0]?.portalCount??0);
 canvas.dataset.g4e7yChapter0Wings=String(mega.sections[0]?.nonblockingWings??0);
 canvas.dataset.g4e7yChapter1Portals=String(mega.sections[1]?.portalCount??0);
 canvas.dataset.g4e7yChapter1Wings=String(mega.sections[1]?.nonblockingWings??0);
 canvas.dataset.archPortalCount=String((mega.sections||[]).reduce((n,x)=>n+(x.portalCount||0),0));
 canvas.dataset.megaTriangleCount=String(mega.vertices.length/18);
 canvas.dataset.megaSectionCount=String(mega.sections.length);
 $('megaWorld').disabled=!megaWorld;
 $('megaWorld').textContent=megaWorld?(megaEnabled?'巨大都市構造：ON':'巨大都市構造：OFF'):'巨大都市構造：対象外';
 canvas.dataset.machineCount=String((stage.movingObstacles||[]).filter(x=>x.enabled!==false).length);
 canvas.dataset.a13CustomMovingShapes=String(stage.stageForge.variant==='A13_GAMEPLAY_ISOLATED'?stage.movingObstacles.filter(o=>o.id.startsWith('a13-machine-')).length:0);
 canvas.dataset.a13Version=stage.stageForge.variant==='A13_GAMEPLAY_ISOLATED'?(stage.stageForge.revision||'W1'):'none';
 canvas.dataset.w9Trial=String(stage.stageForge.recordStageId==='VB-P101-A13-W9X-B1');
 canvas.dataset.w9BankAmplitude=String(stage.stageForge.bankTrial?.amplitudeMeters??0);
 canvas.dataset.w9c1Width=String(stage.stageForge.slopeDNAStudy?.nominalCoreWidthMeters??0);
 canvas.dataset.w9c1Isolated=String(Boolean(stage.stageForge.slopeDNAStudy?.realB48Surface));
 canvas.dataset.w9c2Variant=stage.stageForge.w9c2PhysicalStudy?stage.stageForge.revision:'off';
 canvas.dataset.w9c2Section=String(stage.stageForge.w9c2PhysicalStudy?.section??'none');
 canvas.dataset.w9c2TrueCollider=String(Boolean(stage.stageForge.w9c2PhysicalStudy?.realPhysicalCollision));
 canvas.dataset.hazardUrgency='none';canvas.dataset.hazardTarget='none';canvas.dataset.hazardEta='none';
}
function draw(m,center=[0,0,0],size=[1,1,1],angle=0,primitive=gl.TRIANGLES){
 if(!m||!m.count)return;
 gl.uniform3fv(locations.translation,center);gl.uniform3fv(locations.scale,size);gl.uniform1f(locations.yaw,angle);
 gl.bindBuffer(gl.ARRAY_BUFFER,m.buffer);gl.enableVertexAttribArray(0);gl.enableVertexAttribArray(1);
 gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12);
 gl.drawArrays(primitive,0,m.count);
}
function render(frameSeconds){
 if(!gl)return;
 const {width:w,height:h,ratio}=framebufferDimensions(canvas.clientWidth,canvas.clientHeight,window.devicePixelRatio||1,renderQuality);
 canvas.dataset.renderMode=renderQuality.mode;
 canvas.dataset.renderScale=renderQuality.scale.toFixed(2);
 canvas.dataset.rasterRatio=ratio.toFixed(2);
 if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}if(!w||!h)return;
 gl.viewport(0,0,w,h);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 if(!runner)return;
 // Render-time interpolation leaves native B48 physics untouched.
 const active=!paused&&runner.status==='running';
 let pose=resolveDisplayPose(previousPose,currentPose,accum,DT,active);
 if((g4e7akShot&&g4e7akOptIn)||(g4e7aiShot&&g4e7aiOptIn)||(g4e7adShot&&g4e7adOptIn)||(g4e7sShot&&g4e7sOptIn)||(g4e7vShot&&g4e7vOptIn)||(g4e7wShot&&g4e7wOptIn)){
  // Actual 240Hz start00 native frame; rendering does not move the physics ball.
  const shot=(g4e7akShot&&g4e7akOptIn?g4e7akShot:null)||(g4e7aiShot&&g4e7aiOptIn?g4e7aiShot:null)||(g4e7adShot&&g4e7adOptIn?g4e7adShot:null)||(g4e7wShot&&g4e7wOptIn?g4e7wShot:null)||(g4e7vShot&&g4e7vOptIn?g4e7vShot:null)||g4e7sShot;
  pose={...shot.pose,position:[...shot.pose.position],
   forward:[...shot.pose.forward]};
  cameraState={yaw:shot.yaw};
 }else{
  cameraState=comparisonMode==='stable'
   ?advanceCamera(cameraState,pose.forward,active?frameSeconds:0)
   :createCameraState(pose.forward);
 }
 headingError=cameraYawErrorRadians(cameraState,pose.forward);
 const view=viewForPose(pose,cameraState);
 canvas.dataset.g4e7sMode=g4e7sShot&&g4e7sOptIn?'ACTUAL_240HZ_SCRIPTED_STILL_NOT_HUMAN':'off';
 canvas.dataset.g4e7sPoint=g4e7sShot?.id||'off';
 canvas.dataset.g4e7sSpeedMps=g4e7sShot?String(g4e7sShot.speedMps):'off';
 canvas.dataset.g4e7sU=g4e7sShot?String(g4e7sShot.roadU):'off';
 canvas.dataset.g4e7sGrounded=g4e7sShot?String(g4e7sShot.grounded):'off';
 canvas.dataset.g4e7sTick=g4e7sShot?String(g4e7sShot.tick):'off';
 canvas.dataset.g4e7vMode=g4e7vShot&&g4e7vOptIn?'ACTUAL_240HZ_NOT_HUMAN_STATIC':'off';
 canvas.dataset.g4e7vPoint=g4e7vShot?.id??'off';
 canvas.dataset.g4e7vTime=g4e7vShot?String(g4e7vShot.timeSeconds):'off';
 canvas.dataset.g4e7vSpeedMps=g4e7vShot?String(g4e7vShot.speedMps):'off';
 canvas.dataset.g4e7vGrounded=g4e7vShot?String(g4e7vShot.grounded):'off';
 canvas.dataset.g4e7akMode=g4e7akShot&&g4e7akOptIn?'ACTUAL_240HZ_AJ_REANCHOR_B51_HOLD':'off';
  canvas.dataset.g4e7akPoint=g4e7akShot?.id??'off';
  canvas.dataset.g4e7akTime=g4e7akShot?String(g4e7akShot.timeSeconds):'off';
  canvas.dataset.g4e7akBackdrop=g4e7akOptIn?g4e7akBackdrop:'off';
  canvas.dataset.g4e7aiMode=g4e7aiShot&&g4e7aiOptIn?'ACTUAL_240HZ_AH_NARROW_B48_HOLD':'off';
 canvas.dataset.g4e7aiPoint=g4e7aiShot?.id??'off';
 canvas.dataset.g4e7aiTime=g4e7aiShot?String(g4e7aiShot.timeSeconds):'off';
 canvas.dataset.g4e7aiSpeed=g4e7aiShot?String(g4e7aiShot.speedMps):'off';
 canvas.dataset.g4e7aiBackdrop=g4e7aiOptIn?g4e7aiBackdrop:'off';
 canvas.dataset.g4e7aiNativeWidth=doc?.stageForge?.g4e7ahStudy?.widthMinMeters===undefined?
   'off':String(doc.stageForge.g4e7ahStudy.widthMinMeters);
 canvas.dataset.g4e7adMode=g4e7adShot&&g4e7adOptIn?'ACTUAL_240HZ_R2_NATIVE_CAMERA_HOLD':'off';
 canvas.dataset.g4e7adPoint=g4e7adShot?.id??'off';
 canvas.dataset.g4e7adTime=g4e7adShot?String(g4e7adShot.timeSeconds):'off';
 canvas.dataset.g4e7adSpeedMps=g4e7adShot?String(g4e7adShot.speedMps):'off';
 canvas.dataset.g4e7adGrounded=g4e7adShot?String(g4e7adShot.grounded):'off';
 canvas.dataset.g4e7wMode=g4e7wShot&&g4e7wOptIn?'ACTUAL_B48_240HZ_NOT_HUMAN':'off';
 canvas.dataset.g4e7wPoint=g4e7wShot?.id??'off';
 canvas.dataset.g4e7wTime=g4e7wShot?String(g4e7wShot.timeSeconds):'off';
 canvas.dataset.g4e7wSpeedMps=g4e7wShot?String(g4e7wShot.speedMps):'off';
 canvas.dataset.g4e7wGrounded=g4e7wShot?String(g4e7wShot.grounded):'off';
 canvas.dataset.g4e7yEarly=g4e7yEarlyPoint||'off';
 canvas.dataset.g4e7yEyeToTakeoffMeters=g4e7wShot?String(g4e7wShot.eyeToActualTakeoffMeters):'off';
 gl.uniform3fv(locations.eye,view.eye);gl.uniform3fv(locations.camFront,view.front);gl.uniform3fv(locations.camRight,view.right);gl.uniform3fv(locations.camUp,view.up);
 canvas.dataset.cameraMode=comparisonMode==='stable'?'ball-lock-interpolated':'ball-lock-unfiltered-heading';
 canvas.dataset.cameraHeadingLagDegrees=(headingError*180/Math.PI).toFixed(2);
 if(g4e7bQa){
  const o=qaObservation(g4e7bQa,runner);
  canvas.dataset.g4e7bTime=o.t.toFixed(3);
  canvas.dataset.g4e7bU=o.u.toFixed(5);
  canvas.dataset.g4e7bGrounded=String(o.grounded);
  canvas.dataset.g4e7bArmed=String(o.armed);
  canvas.dataset.g4e7bAirSeen=String(o.airSeen);
  canvas.dataset.g4e7bLandingSeen=String(o.landingSeen);
  canvas.dataset.g4e7bSpeed=o.speed.toFixed(2);
  canvas.dataset.g4e7bXYZ=o.position.map(x=>x.toFixed(2)).join(',');
  canvas.dataset.g4e7bFrameSkips=String(frameSkips);
 }else canvas.dataset.g4e7bTime='off';
 gl.uniform1f(locations.aspect,w/h);
 gl.uniform1f(locations.fogStrength,visibilityFx?1:0);
 gl.uniform1f(locations.fogStart,FOG_START_METERS);
 gl.uniform1f(locations.fogSpan,FOG_SPAN_METERS);
 canvas.dataset.visibilityFx=visibilityFx?'enabled':'disabled';
 if((g4e7aiOptIn&&g4e7aiBackdrop==='quiet')||(g4e7akOptIn&&g4e7akBackdrop==='quiet')){
  // Physics-first road readability study: background architecture only is hidden.
  // Real roads, their B48 sides, real void, fixtures, hazards and ball remain.
 }else if(g4e7anRequested){
  // Entirely separate depth-staggered skyline in place of both rejected walls.
  draw(g4e7anMesh);
 }else if(g4e7amRequested){
  // REPLACE repetitive default walls/gates with private asymmetric GPU continent.
  draw(g4e7amMesh);
 }else if(g4e7agReplacement){
  // Open sky and true architectural voids. Never overlay rejected dark wall.
  draw(g4e7agMesh);
 }else if(g4e7afReplacement){
  // Independent AF scene replaces legacy and AE, never overlays either.
  draw(g4e7afMesh);
 }else if(g4e7aeReplacement){
  // True REPLACEMENT of the repetitive gate skyline on private G4E-7AE:
  // do not render epic blocks, mega portals, side skyways or legacy arches.
  // Keep exact road, natural gap, fixture triangles and 28 moving hazards.
  draw(g4e7aeMesh);
 }else{
  if(g4e7yScene!=='open')draw(scenery);
  if(megaEnabled&&g4e7yScene!=='open'){draw(megaWorld);draw(g5bSceneryMesh);}
  if(g4e7yScene!=='open')draw(g4dSkywayMesh);
  draw(a13ArchMesh);if(g4e7yScene!=='open')draw(g4e7sShardMesh);
  draw(g4e7adCityMesh);
 }
 canvas.dataset.megaWorld=megaWorld?(megaEnabled?'enabled':'disabled'):'not-applicable';
 // Draw monumental arches and cliffs as scenery, NEVER as collision skins.
 if(g4e7lUi?.mode==='rift')draw(g4e7lRiftMesh);
 else if(g4e7lUi?.mode==='skyseam')draw(g4e7lSeamMesh);
 draw(roads);draw(g4e7pQuietMesh||(g4e7kUi?.quiet&&g4e7kQuietMesh?g4e7kQuietMesh:a13RoadArtMesh));if(g4e7iUi?.active&&g4e7iContour?.active)draw(g4e7iMesh);if(g4e7cCueActive)draw(g4e7cCueMesh);draw(g4e7xCueMesh);draw(g4e7zCueMesh);draw(w9c1MarkMesh);draw(p100RoadRead);draw(p101B5RoadOptic);draw(lines,[0,0,0],[1,1,1],0,gl.LINES);
 draw(flowRoads,[0,0,0],[1,1,1],0,gl.LINES);
 draw(approachBeacons,[0,0,0],[1,1,1],0,gl.LINES);
 draw(hazardGateSolidMesh);
 draw(hazardGateMesh,[0,0,0],[1,1,1],0,gl.LINES);
 if(visibilityFx)draw(shoulderLights,[0,0,0],[1,1,1],0,gl.LINES);
 // Local-only measured off-shoulder warning; no collider or steering advice.
 if(g4e7aoRequested)draw(g4e7aoMesh);
 // Non-collidable trajectory guides. Actual machine solids use exact B51 poses.
 for(const guide of guideMeshes)draw(guide.mesh,[0,0,0],[1,1,1],0,gl.LINES);
 for(const o of doc.movingObstacles){
  if(!o.enabled)continue;
  const obstaclePose=movingObstaclePose(o,pose.time);
  const key=o.type+':'+(o.collision?.mode||'fail');
  draw(o.id.startsWith('a13-machine-')?a13MachineMeshes[key]:machineMeshes[key],obstaclePose.center,obstaclePose.halfSize.map(x=>2*x),obstaclePose.yawRadians);
 }
 // P85: energy ball is strictly display-only, tied to the native 240Hz
 // position and simulation clock. There is no physical effect or steering aid.
 const effect=energyBallFrame(pose.time,g4e7akShot?.velocity||g4e7aiShot?.velocity||g4e7adShot?.velocity||g4e7wShot?.velocity||g4e7vShot?.velocity||g4e7sShot?.velocity||runner.v,pose.forward,renderQuality.scale);
 if(energyFx){
  draw(energyMeshes.shell,pose.position,[1,1,1],effect.spin);
  draw(energyMeshes.filaments,pose.position,[1,1,1],effect.spin*.84,gl.LINES);
  if(effect.orbitActive)draw(energyMeshes.orbits,pose.position,[1,1,1],effect.orbitAngle,gl.LINES);
  if(effect.trailActive)draw(energyMeshes.trails,pose.position,
   [1,1,effect.trailScale],effect.directionYaw,gl.LINES);
 }else draw(ball,pose.position);
 const liveMode=demoMode?'spectator-demo':practiceMode?'practice':'manual';
 const canGhost=ghostEnabled&&ghostData&&ghostEligible(doc,runner.spawnIndex,liveMode);
 const ghostPosition=canGhost?referenceGhostAt(ghostData,pose.time):null;
 if(ghostPosition)draw(ghostMesh,ghostPosition,[1,1,1],0,gl.LINES);
 canvas.dataset.ghostMode=ghostPosition?'reference-visible':canGhost?'reference-finished':'off';
 const gap=ghostGapView(ghostData,doc,runner.spawnIndex,liveMode,ghostEnabled,pose.position,pose.time);
 const gapHud=$('ghostGap');gapHud.hidden=!gap.visible;
 if(gap.visible){gapHud.textContent='GHOST · 同時刻距離 '+gap.meters.toFixed(1)+' m';gapHud.dataset.close=String(gap.withinTenMeters);}
 canvas.dataset.ghostSeparation=gap.visible?gap.meters.toFixed(1):'off';
 canvas.dataset.energyMode=energyFx?'enhanced':'classic';
 canvas.dataset.energyTrail=energyFx&&effect.trailActive?'active':'inactive';
}
function browserRecordStore(){try{return window.localStorage;}catch{return null;}}
function updateRunScore(){
 if(!runner||!doc)return;
 const clock=practiceMode?practiceElapsed(runner.time,practiceStartedAt):runner.time;
 const score=survivalScore(clock,nearMissTracker.total);
 $('runScore').textContent=scoreString(score.total);
 $('survivalComponent').textContent=scoreString(score.survival);
 $('bonusComponent').textContent=scoreString(score.bonus);
 $('bestSurvival').textContent=personalBest?personalBest.seconds.toFixed(2)+' s':'—';
 canvas.dataset.survivalScore=String(score.total);
}
function publishGhostPace(last){
 const field=$('ghostPace');if(!field)return;
 const eligible=Boolean(ghostEnabled&&ghostData&&runner&&ghostEligible(doc,runner.spawnIndex,
  demoMode?'spectator-demo':practiceMode?'practice':'manual'));
 const pace=eligible?compareGhostSector(last,ghostData):null;
 field.hidden=!pace;field.dataset.status=pace?.sign||'off';
 canvas.dataset.ghostPaceStatus=pace?.sign||'off';
 if(pace)field.textContent=paceCaption(pace)+' · 同じ区間の実通過時刻で比較';
}
function publishRacecard(){
 const panel=$('ghostRacecard');if(!panel)return;
 const eligible=Boolean(ghostEnabled&&ghostData&&runner&&ghostEligible(doc,runner.spawnIndex,demoMode?'spectator-demo':practiceMode?'practice':'manual'));
 panel.hidden=!eligible;canvas.dataset.ghostRacecard=eligible?'visible':'off';
 if(!eligible)return;
 const rows=buildRacecard(chapterTracker?.completed||[],ghostData);
 const summary=racecardTotals(rows);
 $('racecardProgress').textContent=summary.completed+'/8 SECTORS · '+(summary.currentDelta===null?'実通過を待機':racecardDeltaText(summary.currentDelta)+' 対基準');
 $('racecardRows').replaceChildren(...rows.map(item=>{
  const row=document.createElement('div');row.className='racecardRow';row.dataset.status=item.status;
  const label=document.createElement('span');label.textContent=(item.index+1)+'. '+item.label;
  const value=document.createElement('strong');value.textContent=racecardDeltaText(item.delta);
  row.append(label,value);return row;
 }));
}
function publishChapterTiming(){
 if(!runner||!doc)return;
 const panel=$('chapterTiming');
 const view=chapterTimerView(chapterTracker,runner.time);
 panel.hidden=!view.visible;
 if(!view.visible){canvas.dataset.chapterTimeId='none';publishGhostPace(null);publishRacecard();return;}
 canvas.dataset.chapterTimeId=view.id;
 canvas.dataset.completedSplits=String(view.completed);
 $('splitCurrent').textContent=view.label+'  ·  '+splitSeconds(view.elapsed);
 const best=readChapterBest(browserRecordStore(),doc.stageForge.id,runner.spawnIndex,view.id);
 $('splitBest').textContent=best?'BEST '+splitSeconds(best.duration):'BEST —';
 $('splitLast').textContent=view.latest?'前区間 '+view.latest.label+'  '+splitSeconds(view.latest.duration):'区間通過で計測';
 publishGhostPace(view.latest);
 publishRacecard();
 $('splitHistory').replaceChildren(...chapterTracker.completed.slice(-3).map(record=>{
  const span=document.createElement('span');
  span.textContent=record.label+' '+splitSeconds(record.duration);
  return span;
 }));
 const visible=latestSplit&&runner.time>=latestSplit.time&&runner.time<latestSplit.time+2.2;
 $('splitBurst').hidden=!visible;
}
function updateNativeChapterTime(){
 const event=observeChapterSplits(chapterTracker,runner.surface,runner.lastSurface,runner.time,runner.status);
 if(!event)return;
 const best=(!demoMode&&!practiceMode&&!g4e7bQa&&!g4e7dTrial&&!g4e7gActive&&!g4e7mActive&&!g4e7qActive&&!g4e7rActive&&!g4e7tActive&&!g4e7vActive&&!g4e7wActive&&!g4e7adActive&&!g4e7aiActive&&!g4e7akActive&&!g4e7alActive)
  ?storeChapterBest(browserRecordStore(),event)
  :{best:null,improved:false,saved:false};
 latestSplit=event;
 $('splitBurst').textContent='SECTOR '+event.label+'  '+splitSeconds(event.duration)
  +(best.improved?'  ·  NEW BEST':'');
 canvas.dataset.completedSplits=String(chapterTracker.completed.length);
}
function settleRun(){
 if(!runner||runCommitted||!['failed','finished'].includes(runner.status))return;
 if(demoMode||practiceMode||g4e7bQa||g4e7dTrial||g4e7gActive||g4e7mActive||g4e7oActive||g4e7qActive||g4e7rActive||g4e7tActive||g4e7vActive||g4e7wActive||g4e7adActive||g4e7aiActive||g4e7akActive||g4e7alActive){
  $('b5ResultExport').hidden=true;
  retryChapterId=null;$('retryPractice').hidden=true;
  runCommitted=true;const result=$('runResult');result.hidden=false;
   if(g4e7oActive&&g4e7oResultDownload)g4e7oResultDownload.hidden=false;
   if(g4e7alActive&&g4e7alResultDownload)g4e7alResultDownload.hidden=false;
  $('resultTitle').textContent=g4e7alActive?'G4E-7AL · TRUE 11m B48 / 28 B51-C · MANUAL HOLD':g4e7oActive?'G4E-7O · HUMAN QA HOLD':g4e7akActive?'G4E-7AK · REAL 11m + MOVING 28 B51 / NOT HUMAN':g4e7aiActive?'G4E-7AI · REAL 11m B48 / NOT HUMAN':g4e7adActive?'G4E-7AD · R2 VISUAL RESEARCH / NOT HUMAN':g4e7wActive?'G4E-7W · REAL 15m GAP / P96 NONHUMAN QA HOLD':g4e7vActive?'G4E-7V · ACTUAL SCRIPTED NATIVE 240Hz HOLD':g4e7tActive?'G4E-7T · EARLY TRUE GAP · HUMAN HOLD':g4e7rActive?'G4E-7R · REAL B48 REJOIN · HUMAN HOLD':g4e7qActive?'G4E-7Q · TRUE B48 DIVE/LEAP · HUMAN HOLD':g4e7mActive?'G4E-7M · TRUE B48 HUMAN HOLD':g4e7gActive?'G4E-7G · VISUAL QA · NOT HUMAN':g4e7dTrial?'G4E-7D · HUMAN QA · REVIEW HOLD':g4e7bQa?'SCRIPTED QA · NOT HUMAN':practiceMode?(runner.status==='finished'?'PRACTICE CLEAR':'PRACTICE ENDED'):(runner.status==='finished'?'DEMO COMPLETE':'DEMO FAILED');
  $('resultScore').textContent=(practiceMode?practiceElapsed(runner.time,practiceStartedAt):runner.time).toFixed(2)+' s · 実物理'+(practiceMode?'操作練習':'観戦デモ');
  $('resultDetails').textContent=(g4e7wActive?'非公開のG4E-7W実細道・本物の跳躍・高速視界研究':g4e7vActive?'非公開のG4E-7V実物理着地面・高速視界研究':g4e7tActive?'非公開のG4E-7T早期実細道・2セルギャップ研究':g4e7rActive?'非公開のG4E-7R実細道・ギャップ研究':g4e7qActive?'非公開の真の急降下・ギャップ研究':g4e7mActive?'非公開の本物の超細道研究':g4e7gActive?'非公開の景観研究':g4e7dTrial?'手動比較走行':g4e7bQa?'研究用P96走行':practiceMode?'練習':'観戦デモ')+'は自己ベストへ保存しません。人間評価HOLD。';
  result.dataset.outcome=runner.status;canvas.dataset.runOutcome=runner.status;
  return;
 }
 runCommitted=true;
 if(b5ManualAudit)finalizeB5ManualAudit(b5ManualAudit,{
  status:runner.status,time:runner.time,surface:runner.surface||runner.lastSurface,
  contacts:runner.collisions,nearMisses:nearMissTracker.total,
  failure:runner.failure?.reason||null,
  collisionEvents:runner.events // G5-A: read-only; exported only after explicit save
 });
 // G5-C3: notify only the same-origin explicit guided parent, in memory.
 sendGuidedPairReport(null);
 const record=buildRunRecord({stageId:doc.stageForge.variant==='A13_GAMEPLAY_ISOLATED'?(doc.stageForge.recordStageId||'VB-P101-A13'):p101B5RecordStageId(doc),spawn:runner.spawnIndex,
  seconds:runner.time,nearMisses:nearMissTracker.total,outcome:runner.status});
 const compared=storeBest(browserRecordStore(),record);
 personalBest=compared.best;
 const result=$('runResult');result.hidden=false;
 $('b5ResultExport').hidden=!b5ManualAudit;
 $('resultTitle').textContent=runner.status==='finished'?'COURSE CLEAR':'RUN ENDED';
 $('resultScore').textContent=scoreString(record.total)+' PTS · '+record.seconds.toFixed(2)+' s';
 $('resultDetails').textContent='生存 '+scoreString(record.survival)+' ＋ 回避 '+scoreString(record.bonus)
  +' / NEAR MISS '+nearMissTracker.total+'回'+(compared.improved?' · NEW BEST!':'');
 result.dataset.outcome=runner.status;
 canvas.dataset.runOutcome=runner.status;
 // Select the most recent REAL physical road, not a fabricated checkpoint.
 // P79 native replay then runs from the authored spawn 00 before control takeover.
 retryChapterId=failurePracticeChapter({stageId:doc.stageForge.id,mode:'manual',status:runner.status,
  surface:runner.failure?.surface??runner.surface,lastSurface:runner.lastSurface,records:runner.records});
 $('retryPractice').hidden=!retryChapterId;
 $('retryPractice').textContent=retryChapterId?'失敗した区間を練習（実物理で再走）':'';
 canvas.dataset.failurePractice=retryChapterId||'none';
 updateRunScore();
}
function ensureG4E7DPanel(){
 if(!g4e7dRequested)return;
 if(!g4e7dPanel)g4e7dPanel=makeG4E7DPanel($('b5QaPanel').parentElement,{
  onNext(feedback){
   if(!g4e7dTrial||!runner)return;
   const report=exportG4E7DTrial(g4e7dTrial,runner,feedback);
   completeG4E7DSession(g4e7dSession,report);
   g4e7dPanel.reset();
   if(g4e7dSession.index>=G4E7D_PROTOCOL.length){
    g4e7dTrial=null;paused=true;accum=0;
    $('pause').textContent='再開 (Space)';
    canvas.dataset.g4e7dMode='four-trials-recorded-hold';
    g4e7dPanel.render({index:g4e7dSession.index,count:G4E7D_PROTOCOL.length});
    return;
   }
   const step=G4E7D_PROTOCOL[g4e7dSession.index],stage='VB-P101-A13-W9C2-G4E6-'+step.id;
   if($('stage').value===stage)restart();
   else{$('stage').value=stage;load();}
  },
  onDownload(){
   const json=exportG4E7DSession(g4e7dSession);
   const url=URL.createObjectURL(new Blob([json],{type:'application/json;charset=utf-8'}));
   const a=document.createElement('a');a.href=url;
   a.download='DOPAGAKI_G4E7D_HUMAN_'+g4e7dSession.runs.length+'runs.json';
   document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);
   g4e7dPanel.notice('JSONを端末に保存しました。自動送信はありません。');
  }
 });
 const step=G4E7D_PROTOCOL[g4e7dSession.index];
 g4e7dPanel.render({index:g4e7dSession.index,count:G4E7D_PROTOCOL.length,
  id:step?.id,cue:step?.cue});
}
function exportG4E7OJSON(){
 if(!g4e7oRequested)return;
 const report=JSON.parse(exportG4E7OSession(g4e7oSession));
 if(g4e7oTrial&&runner)report.uncommittedCurrentRun=exportG4E7OTrial(g4e7oTrial,runner);
 const u=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)+'\n'],{type:'application/json;charset=utf-8'}));
 const a=document.createElement('a');a.href=u;a.download='DOPAGAKI_G4E7O_'+g4e7oSession.runs.length+'runs.json';
 document.body.append(a);a.click();a.remove();URL.revokeObjectURL(u);
 g4e7oPanel?.notice('JSON保存。自動送信なし。');
}
function ensureG4E7OPanel(){
 if(!g4e7oRequested)return;
 if(!g4e7oPanel)g4e7oPanel=createG4E7OManualPanel($('b5QaPanel').parentElement,{
  onNext(feedback){
   if(!g4e7oTrial||!runner||g4e7oSession.index>=2)return;
   appendG4E7OTrial(g4e7oSession,exportG4E7OTrial(g4e7oTrial,runner,feedback));
   g4e7oTrial=null;g4e7oPanel.reset();
   if(g4e7oSession.index===2){paused=true;accum=0;g4e7oPanel.render(2);
    canvas.dataset.g4e7oMode='two-trials-recorded-hold';return;}
   $('stage').value='VB-P101-A13-W9C2-G4E7M-PRECIPICE';load();
  },onDownload:exportG4E7OJSON
 });
 if(!g4e7oResultDownload){
  const b=document.createElement('button');b.id='g4e7oResultDownload';b.type='button';
  b.textContent='G4E-7O 計測JSONを直接保存';b.hidden=true;
  b.addEventListener('click',exportG4E7OJSON);$('runResult').append(b);
  g4e7oResultDownload=b;
 }
 g4e7oPanel.root.hidden=false;g4e7oPanel.render(g4e7oSession.index);
}
function exportG4E7ALJSON(feedback=g4e7alPanel?.feedback()){
  if(!g4e7alRequested||!g4e7alSession)return;
  const report=exportG4E7ALSession(g4e7alSession);
  if(g4e7alTrial&&runner)report.uncommittedCurrentRun=exportG4E7ALTrial(g4e7alTrial,runner,feedback);
  const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)+'\n'],{type:'application/json;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='DOPAGAKI_G4E7AL_'+g4e7alSession.runs.length+'runs.json';
  document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);
  g4e7alPanel?.notice('JSON保存。端末のみ、自動送信なし。');
 }
 function ensureG4E7ALPanel(){
  if(!g4e7alRequested)return;
  if(!g4e7alPanel)g4e7alPanel=createG4E7ALPanel($('b5QaPanel').parentElement,{
   onNext(feedback){
    if(!g4e7alTrial||!runner||g4e7alSession.index>=2)return;
    if(g4e7alTrial.inputSteps===0){
     g4e7alPanel.notice('まだ左右の手動入力がありません。A/Dまたは矢印で操作してから記録してください。');
     return;
    }
    appendG4E7ALTrial(g4e7alSession,exportG4E7ALTrial(g4e7alTrial,runner,feedback));
    g4e7alTrial=null;g4e7alPanel.reset();
    if(g4e7alSession.index===2){
     paused=true;accum=0;g4e7alPanel.render(2);
     canvas.dataset.g4e7alMode='two-trials-recorded-hold';
     if(g4e7alResultDownload)g4e7alResultDownload.hidden=false;
     return;
    }
    $('stage').value='VB-P101-A13-W9C2-'+g4e7alStageCode+'-PINCH-SWITCH';load();
   },onDownload:exportG4E7ALJSON
  });
  if(!g4e7alResultDownload){
   const b=document.createElement('button');b.id='g4e7alResultDownload';b.type='button';
   b.textContent='G4E-7AL 失敗・完走JSONを直接保存';b.hidden=true;
   b.addEventListener('click',()=>exportG4E7ALJSON());
   $('runResult').append(b);g4e7alResultDownload=b;
  }
  g4e7alPanel.root.hidden=false;g4e7alPanel.render(g4e7alSession.index);
 }
 function restart(){
 if(g4e7dRequested&&g4e7dSession.index>=G4E7D_PROTOCOL.length)return;
 if(g4e7alRequested&&g4e7alSession.index>=G4E7AL_ROADS.length)return;
 if(!doc||!world)return;
 if(g4e7alActive&&g4e7alTrial?.steps>0&&runner){
  archiveG4E7ALRetry(g4e7alSession,exportG4E7ALTrial(g4e7alTrial,runner));
 }
 if(b5ManualAudit){
  if(!b5ManualAudit.final)finalizeB5ManualAudit(b5ManualAudit,{
   status:'interrupted',time:runner?.time??0,surface:runner?.surface||runner?.lastSurface||null,
   contacts:runner?.collisions??0,nearMisses:nearMissTracker?.total??0,
   collisionEvents:runner?.events??[] // preserve verified rebound events on restart
  });
  b5PreviousAudit=b5ManualAudit;
 }
 seekingChapter=null;retryChapterId=null;$('retryPractice').hidden=true;canvas.dataset.failurePractice='none';
 const spawn=Math.min(doc.spawns.length-1,Math.max(0,Number($('spawn').value)||0));
 const eligible=Boolean(ghostData&&ghostEligible(doc,spawn,demoMode?'spectator-demo':practiceMode?'practice':'manual'));
  $('ghostToggle').disabled=!eligible;
  $('ghostToggle').textContent=!eligible?'基準ゴースト：対象外':ghostEnabled?'基準ゴースト：ON（非衝突）':'基準ゴースト：OFF';
  $('ghostToggle').setAttribute('aria-pressed',String(eligible&&ghostEnabled));
  $('ghostToggle').title=eligible?'開始地点00の手動走行にだけ適用':'実物理ゴーストはECHO PIPE開始00の手動走行のみ';
  const physicalLaunch=['B5_HYPER_ARC_ISOLATED','A13_GAMEPLAY_ISOLATED'].includes(doc.stageForge.variant)?52:44;
  runner=new Runner(doc,world,spawn,physicalLaunch);runner.assist=true;accum=0;paused=false;
   g4e7gActive=Boolean(doc.stageForge.g4e7gVisualTrial&&g4e7gOptIn);
   g4e7mActive=Boolean(doc.stageForge.g4e7mRealRoad&&g4e7mOptIn);
    g4e7qActive=Boolean(doc.stageForge.g4e7qStudy&&g4e7qOptIn);
    g4e7rActive=Boolean(doc.stageForge.g4e7rStudy&&g4e7rOptIn);
    g4e7tActive=Boolean(doc.stageForge.g4e7tStudy&&g4e7tOptIn);
    g4e7vActive=Boolean(doc.stageForge.g4e7vStudy&&g4e7vOptIn);
    g4e7wActive=Boolean(doc.stageForge.g4e7wStudy&&g4e7wOptIn);
    g4e7adActive=Boolean(doc.stageForge.g4e7acR2Study&&g4e7adOptIn);
    g4e7aiActive=Boolean(doc.stageForge.g4e7ahStudy&&g4e7aiOptIn);
     g4e7akActive=Boolean(doc.stageForge.g4e7ajStudy?.id==='reanchor'&&g4e7akOptIn);
     if(g4e7akActive){paused=true;accum=0;}
    if(g4e7aiActive){paused=true;accum=0;}
    if(g4e7adActive){paused=true;accum=0;}
    if(g4e7wActive){paused=true;accum=0;}
    if(g4e7vActive){paused=true;accum=0;}
    if(g4e7tActive&&g4e7tHold){paused=true;accum=0;}
    if(g4e7rActive&&g4e7rHold){paused=true;accum=0;}
    if(g4e7qActive&&g4e7qHold){paused=true;accum=0;}
   if(g4e7mActive&&g4e7mHold){paused=true;accum=0;}
   if(g4e7gActive&&g4e7gHold){paused=true;accum=0;}
   g4e7oActive=Boolean(g4e7oRequested&&g4e7mActive);
   g4e7alActive=Boolean(g4e7alRequested&&doc.stageForge.g4e7ajStudy?.id==='reanchor');
   g4e7alTrial=g4e7alActive?createG4E7ALTrial(doc,runner):null;
   g4e7oTrial=g4e7oActive?createG4E7OTrial(doc,runner):null;
  g4e7bQa=createGapQa(doc,runner,g4e7bRequested);
  g4e7dTrial=g4e7dRequested?createG4E7DTrial(doc,runner,G4E7D_PROTOCOL[g4e7dSession.index]):null; 
   if(g4e7alActive){
    $('stage').disabled=true;$('spawn').disabled=true;
    $('p101Profile').value='OVERDRIVE';$('p101Profile').disabled=true;
    $('cameraCompare').disabled=true;$('renderQuality').disabled=true;
    $('demoRun').disabled=true;$('practiceRun').disabled=true;
    $('energyFx').disabled=true;$('visibilityFx').disabled=true;$('megaWorld').disabled=true;
    ensureG4E7ALPanel();g4e7alResultDownload.hidden=true;
    canvas.dataset.g4e7alMode='human-keyboard-qa-only';
   }
   if(g4e7oActive){
    $('stage').disabled=true;$('spawn').disabled=true;
    $('p101Profile').value='OVERDRIVE';$('p101Profile').disabled=true;
    $('cameraCompare').disabled=true;$('renderQuality').disabled=true;
    $('demoRun').disabled=true;$('practiceRun').disabled=true;
    $('energyFx').disabled=true;$('visibilityFx').disabled=true;$('megaWorld').disabled=true;
    ensureG4E7OPanel();g4e7oResultDownload.hidden=true;
    canvas.dataset.g4e7oMode='human-keyboard-qa-only';
   }else if(g4e7oPanel){g4e7oPanel.root.hidden=true;if(g4e7oResultDownload)g4e7oResultDownload.hidden=true;}
  if(g4e7dRequested){
   g4e7cCueActive=Boolean(g4e7cCue?.active&&G4E7D_PROTOCOL[g4e7dSession.index]?.cue);
   canvas.dataset.g4e7cCueActive=String(g4e7cCueActive);
   if(g4e7cButton){
    g4e7cButton.disabled=true;
    g4e7cButton.textContent='G4E-7C 実路面ライン '+(g4e7cCueActive?'ON':'OFF')+'（手動比較中は固定）';
   }
   $('stage').disabled=true;$('p101Profile').disabled=true;
   $('cameraCompare').disabled=true;$('renderQuality').disabled=true;
   $('demoRun').disabled=true;$('practiceRun').disabled=true;
   $('energyFx').disabled=true;$('visibilityFx').disabled=true;$('megaWorld').disabled=true;
   ensureG4E7DPanel();
   canvas.dataset.g4e7dMode='human-keyboard-qa-only';
  }
  canvas.dataset.g4e7bMode=g4e7bQa?'SCRIPTED_P96_NOT_HUMAN':'off';
  canvas.dataset.b5LaunchMps=doc.stageForge.variant==='B5_HYPER_ARC_ISOLATED'?'52':'off';
  b5ManualAudit=['B5_HYPER_ARC_ISOLATED','A13_GAMEPLAY_ISOLATED'].includes(doc.stageForge.variant)&&!demoMode&&!practiceMode&&!g4e7bQa&&!g4e7dTrial&&!g4e7gActive&&!g4e7mActive&&!g4e7qActive&&!g4e7rActive&&!g4e7tActive&&!g4e7vActive&&!g4e7wActive&&!g4e7adActive&&!g4e7aiActive&&!g4e7akActive&&!g4e7alActive
   ?createB5ManualAudit({stageId:doc.stageForge.variant==='A13_GAMEPLAY_ISOLATED'?(doc.stageForge.recordStageId||'VB-P101-A13'):'VB-P101-B5',profile:$('p101Profile').value,startSpeed:physicalLaunch,spawnIndex:spawn}):null;
  $('b5QaPanel').hidden=Boolean(g4e7bQa)||g4e7adActive||g4e7aiActive||g4e7akActive||g4e7alActive||!['B5_HYPER_ARC_ISOLATED','A13_GAMEPLAY_ISOLATED'].includes(doc.stageForge.variant);
  $('b5QaTitle').textContent=doc.stageForge.slopeDNAStudy?.realB48Surface?'W9-C1 ABYSS '+doc.stageForge.slopeDNAStudy.nominalCoreWidthMeters+'m · 独立手動試走':doc.stageForge.recordStageId==='VB-P101-A13-W9X-B1'?'W9-X-B1 · 独立手動試走レポート':doc.stageForge.variant==='A13_GAMEPLAY_ISOLATED'?(doc.stageForge.g4e6EarlyGap?'W9-C2 G4E-6 · 真のB48ギャップ · 人間操作HOLD':doc.stageForge.g4ePhysicalStudy?'W9-C2 G4E-1 · '+doc.stageForge.revision+' · 実物理4狭路・人間HOLD':doc.stageForge.w9c2PhysicalStudy?'W9-C2 S-CREST · '+doc.stageForge.revision+' · 実物理研究/HOLD':'A13 W7F · 手動試走レポート'):'B5 · 手動試走レポート';
  $('w9TrialWarning').hidden=doc.stageForge.recordStageId!=='VB-P101-A13-W9X-B1';
  $('w9c1TrialWarning').hidden=!doc.stageForge.slopeDNAStudy?.realB48Surface;
  $('w9c1G4Survey').hidden=!doc.stageForge.slopeDNAStudy?.realB48Surface;
  $('b5QaStatus').textContent='手動試走の観測値を端末内で記録。自動送信はありません。';
  p101B5Surge=createP101B5SurgeState();a13Surge=createA13SurgeState();
  canvas.dataset.b5PhysicalStage=doc.stageForge.variant==='B5_HYPER_ARC_ISOLATED'?'true':'false';
 demoDirector=createNativeDemoState();
 canvas.dataset.g4e7gMode=g4e7gActive?(g4e7gHold?'STATIC_SAME_U_NOT_SAME_WORLD_POSE':'PRIVATE_NEUTRAL_VISUAL_NOT_HUMAN'):'off';
  canvas.dataset.g4e7gKind=g4e7gActive?doc.stageForge.g4e7gVisualTrial.kind:'off';
  canvas.dataset.g4e7gViewpoint=g4e7gActive?g4e7gPoint:'off';
  canvas.dataset.g4e7mMode=g4e7mActive?(g4e7mHold?'STATIC_TRUE_B48_HUMAN_HOLD':'TRUE_B48_HUMAN_HOLD'):'off';
   canvas.dataset.g4e7mVariant=g4e7mActive?doc.stageForge.g4e7mRealRoad.variant:'off';
   canvas.dataset.g4e7qMode=g4e7qActive?(g4e7qHold?'STATIC_ACTUAL_B48_HOLD':'TRUE_B48_HUMAN_HOLD'):'off';
    canvas.dataset.g4e7qVariant=g4e7qActive?doc.stageForge.g4e7qStudy.variant:'off';
    canvas.dataset.g4e7rMode=g4e7rActive?(g4e7rHold?'STATIC_TRUE_B48_HOLD':'PRIVATE_REAL_B48_HUMAN_HOLD'):'off';
    canvas.dataset.g4e7rVariant=g4e7rActive?doc.stageForge.g4e7rStudy.variant:'off';
    canvas.dataset.g4e7tMode=g4e7tActive?(g4e7tHold?'STATIC_TRUE_EARLY_B48_HOLD':'PRIVATE_EARLY_B48_HUMAN_HOLD'):'off';
    canvas.dataset.g4e7tVariant=g4e7tActive?doc.stageForge.g4e7tStudy.variant:'off';
    canvas.dataset.runMode=g4e7alActive?'private-real-B48-B51-AL-manual-HOLD':g4e7oActive?'private-human-B48-QA-HOLD':g4e7wActive?'private-W-true-native-240hz-HOLD':g4e7vActive?'private-240hz-real-speed-static-HOLD':g4e7tActive?'private-true-early-B48-HOLD':g4e7rActive?'private-true-B48-graded-HOLD':g4e7qActive?'private-real-B48-dive-human-hold':g4e7mActive?'private-real-B48-human-hold':g4e7gActive?'private-visual-qa-not-human':g4e7bQa?'scripted-qa-not-human':demoMode?'spectator-demo':practiceMode?'practice':'manual';
 lastEdgeRadarAt=0;$('edgeRadar').hidden=true;canvas.dataset.edgeStatus='unavailable';
 $('w9c1Notice').hidden=true;canvas.dataset.w9c1NoticePhase='none';
 canvas.dataset.w9c1NoticeEta='none';canvas.dataset.w9c1NoticeDistance='none';
 $('demoBanner').hidden=!demoMode&&!g4e7bQa;
 $('demoBanner').firstChild.textContent=g4e7bQa?'G4E-7B · P96 SCRIPTED · NOT HUMAN ':'観戦専用デモ · 自動操舵 · 自己ベスト対象外 ';
 canvas.dataset.overdriveProfile=doc.stageForge.id==='VB-P101'?$('p101Profile').value:'off';
 $('takeoverRun').hidden=!demoMode;
 $('practiceBanner').hidden=!practiceMode;
 $('practiceRun').textContent=practiceMode?'練習終了 → 通常走行':'指定区間から練習（実物理）';
 $('demoRun').textContent=demoMode?'デモ終了 → 自分でプレイ':'全編デモを見る（自動操舵）';
 $('demoRun').setAttribute('aria-pressed',String(demoMode));
 previousPose=currentPose=capturePose(runner);cameraState=createCameraState(currentPose.forward);frameSkips=0;headingError=0;
 nearMissTracker=createNearMissTracker();runCommitted=false;
 chapterTracker=createChapterSplits(doc.stageForge?.id,spawn,runner.surface,runner.time);latestSplit=null;
 $('splitBurst').hidden=true;canvas.dataset.completedSplits='0';
 canvas.dataset.chapterTimeId='none';
 personalBest=readBest(browserRecordStore(),doc.stageForge.variant==='A13_GAMEPLAY_ISOLATED'?(doc.stageForge.recordStageId||'VB-P101-A13'):p101B5RecordStageId(doc),spawn);
 $('runResult').hidden=true;$('b5ResultExport').hidden=true;canvas.dataset.runOutcome='running';
   if(g4e7oResultDownload)g4e7oResultDownload.hidden=true;
   if(g4e7alResultDownload)g4e7alResultDownload.hidden=true;
 $('nearMissCount').textContent='0';$('nearMissBurst').hidden=true;
 updateRunScore();
 canvas.dataset.nearMissCount='0';
 $('pause').textContent=paused?'再開 (Space)':'一時停止 (Space)';
 delete status.dataset.failed;
 status.className='status';status.textContent=doc.stageForge?.slopeDNAStudy?.realB48Surface?'W9-C1 ABYSS DIVE — 本物のB48 '+doc.stageForge.slopeDNAStudy.nominalCoreWidthMeters+'m狭路 / 310–360m評価窓 / 28基の実動体 / 240Hz / 52m/s始動。人間の楽しさ・2秒視認性・公平性は未検証、W7F/B5/W9-X保護、Draft HOLD。':doc.stageForge?.g4e6EarlyGap?'G4E-6 ローカル限定比較 — 本物のB48第I道路を切断した'+doc.stageForge.g4e6EarlyGap.gapMeters.toFixed(2)+'mギャップ、28基の移動障害物と240Hz。正規start00 7/7はスクリプト操作のみ確認済み。手動の視認性・難易度・FPSはHOLD。公開禁止。':doc.stageForge?.g4ePhysicalStudy?'G4E-1 独立試走 — 本物のB48物理道路4か所を狭くした候補。28基の実動体・240Hz・自動完走3/3。自然ジャンプと人間操作は未認定。公開HOLD。':doc.stageForge?.w9c2PhysicalStudy?'W9-C2 S-CREST — 実B48第VI道路のS字・頂上・バンク・狭路。28基そのまま / 240Hz / 人間操作と正規完走HOLD。W7F/C1/B5/mainを保護。':doc.stageForge?.recordStageId==='VB-P101-A13-W9X-B1'?'W9-X-B1 UNDERPASS DUAL-APEX — 7.28km / 28基 / 実B48路面の交互バンク8m / 240Hz / 52m/s始動。自動7/7は補正操舵のみ・手動の公平性や楽しさは未検証。W7F Goldは変更なし・試走記録は独立。DRAFT HOLD。':doc.stageForge?.variant==='A13_GAMEPLAY_ISOLATED'?'P101 A13 W7F — 7.28km・正規240Hz・28基の実移動障害物・52m/s始動。自動試走7/7完走 53.275秒 / 203.6m/s（人間の難易度・視認性は未検証）。B5保護 / DRAFT HOLD。':doc.stageForge?.variant==='B5_HYPER_ARC_ISOLATED'?'P101 B5 HYPER ARC — 7.28km true giant 3D 180° curves, 12 real moving machines, native 240Hz 206.28m/s SCRIPTED finish proven, 52m/s launch. Human steering/visual/phone FPS HOLD. P100 unchanged.':doc.stageForge?.id==='VB-P101'?'P101 VELOCITY OVERDRIVE — 4×/4.8×/6× genuine lateral acceleration and enhanced forward speed; 240Hz CCD. Human fairness and full-run QA HOLD. P100 baseline unchanged.':doc.stageForge?.id==='VB-P100'?'P100 TERRAIN PULSE — authentic 3D S-bends, real crests and moving road camber; P99 baseline unchanged; 7/7 real 240Hz two-profile native finish confirmed, human fairness and final art HOLD.':doc.stageForge?.id==='VB-P99'?'P99 PRESSURE LINES — real 7-skin variable-width roads and 12 native moving hazards; two real native 240Hz profile finishes confirmed; human fairness and full visual quality HOLD.':doc.stageForge?.id==='VB-P95'?'P96 VOID BREAKER — 12 real moving B51-C obstacles, 7/7 native scripted finish; human difficulty/fairness HOLD.':doc.stageForge?.id==='VB-P93'?'P94 VOID BREAKER — genuine 3990m 7/7 native scripted finish verified; human playability and final art NOT APPROVED.':doc.stageForge?.id==='EP-P66'?'P91 EXPERIMENTAL — physical-road fork/machine/gap visual approach beacons; existing native racecard preserved; no physics/P62 changes.':'3D ready · B48 240Hz / B51-C moving collision · 実走行での楽しさは未認定';
 publishChapterTiming();
 if(g4e7bQa)status.textContent='G4E-7B P96 SCRIPTED QA — 実B48撮影専用。人間操作・公平性HOLD。';
  if(g4e7gActive)status.textContent='G4E-7G 非公開実路面比較：Gold/Glideを同じ道路uで観察。世界座標・視線は同一ではない。人間評価HOLD。';
  if(g4e7mActive)status.textContent='G4E-7M LOCAL ONLY / TRUE B48 13–16m narrow collision road / 28 moving hazards / human fair play HOLD. Native scripted result is not human.';
   if(g4e7qActive)status.textContent='G4E-7Q LOCAL / TRUE B48 '+doc.stageForge.g4e7qStudy.variant.toUpperCase()+
    ' — actual sculpted dive '+(doc.stageForge.g4e7qStudy.gap?'and real OPEN GAP':'intact road control')+
    ' / 28 moving hazards / native candidate NOT CERTIFIED / human playability HOLD.';
    if(g4e7rActive)status.textContent='G4E-7R LOCAL / TRUE B48 '+doc.stageForge.g4e7rStudy.variant.toUpperCase()+
     ' — smoother physical dive '+(doc.stageForge.g4e7rStudy.gap?'and REAL GAP':'continuous road control')+
     ' / 28 moving machines / native scripted results do NOT certify human fairness.';
    if(g4e7tActive)status.textContent='G4E-7T LOCAL '+doc.stageForge.g4e7tStudy.variant.toUpperCase()+
     ' / TRUE EARLY 13m B48 '+(doc.stageForge.g4e7tStudy.gap?'TWO-CELL REAL GAP':'SOLID CONTROL')+
     ' / 28 ORIGINAL MACHINES / SCRIPT/HUMAN FAIRNESS HOLD.';
    if(g4e7alActive)status.textContent=g4e7asRequested?'G4E-7AS LOCAL MANUAL / BANKED SERPENT REAL B48 + 28 B51-C / HUMAN FAIRNESS HOLD.':g4e7apRequested?'G4E-7AL LOCAL MANUAL / AP TRUE TEMPORAL SLALOM + 28 REAL B51-C / NO P96 / HUMAN FAIRNESS HOLD.':'G4E-7AL LOCAL MANUAL / 11m REAL B48 + 28 REAL B51-C / NO P96 / HUMAN FAIRNESS HOLD.';
     if(g4e7akActive)status.textContent='G4E-7AK LOCAL REAL 11m B48 + REANCHORED 2/28 B51 / '+g4e7akPoint.toUpperCase()+' / 240Hz P96 NONHUMAN / HOLD.';
     if(g4e7aiActive)status.textContent='G4E-7AI LOCAL REAL NARROW B48 / '+g4e7aiPoint.toUpperCase()+' / 240Hz P96 NONHUMAN / RESEARCH HOLD.';
    if(g4e7adActive)status.textContent='G4E-7AD LOCAL TRUE R2 B48 / '+g4e7adPoint.toUpperCase()+' / 240Hz P96 NONHUMAN / REAL GPU VISUAL RESEARCH HOLD.';
    if(g4e7wActive)status.textContent='G4E-7W LOCAL TRUE B48 15.76m GAP / '+g4e7wPoint.toUpperCase()
     +' / 240Hz P96 NONHUMAN / HUMAN VISUAL HOLD.';
    if(g4e7vActive)status.textContent='G4E-7V LOCAL actual start00 240Hz '
     +doc.stageForge.g4e7vStudy.variant.toUpperCase()+' / '+g4e7vPoint.toUpperCase()
     +' / 28 MACHINES / NOT HUMAN / VISUAL & FAIRNESS HOLD.';
    if(g4e7sShot&&g4e7sOptIn)status.textContent='G4E-7S SCRIPTED 240Hz REAL START00 FRAME '
     +g4e7sShot.id.toUpperCase()+' / '+g4e7sShot.speedMps.toFixed(1)
     +' m/s · '+g4e7sScene+' scenery. This is NOT human driving; Gold/production unchanged, HOLD.';
 if(guidedPairTrial&&window.parent!==window&&doc.stageForge?.recordStageId&&
    pairTrialIds.has(doc.stageForge.recordStageId)&&b5ManualAudit&&!demoMode&&!practiceMode){
  window.parent.postMessage({type:'dopagaki.w9c1.g5c3.ready/1',
   stageId:doc.stageForge.recordStageId},window.location.origin);
 }
 // Synchronize the visible world-clock immediately after replacing Runner.
 // Otherwise a spectator can see a stale timer from the previous practice run
 // until the next 500ms HUD refresh and mistakenly read a time regression.
 hud();
}
async function load(){
 const seq=++loading,id=$('stage').value;
 runner=null;previousPose=null;currentPose=null;cameraState=null;doc=null;world=null;ghostData=null;g4e7gActive=false;g4e7mActive=false;g4e7oActive=false;g4e7qActive=false;g4e7rActive=false;g4e7tActive=false;g4e7vActive=false;g4e7vShot=null;g4e7wActive=false;g4e7wShot=null;g4e7adActive=false;g4e7adShot=null;g4e7aiActive=false;g4e7aiShot=null;g4e7alActive=false;g4e7alTrial=null;g4e7akActive=false;g4e7akShot=null;g4e7sShot=null;g4e7sTrace=null;g4e7oTrial=null;status.className='status';status.textContent='JSON取得・衝突BVH構築中...';
 try{
  const response=await fetch('../generated/'+assets[id],{cache:'no-store'});
  if(!response.ok)throw Error('Stage JSON HTTP '+response.status);
  const value=await response.json();
  if(seq!==loading)return;
  if(value.schema!=='dopagaki.track-director/1'||!Array.isArray(value.spawns))throw Error('Stage schema mismatch');
  await new Promise(resolve=>requestAnimationFrame(resolve));
  const compiled=compile(value);
  if(seq!==loading)return;
  let replay=null;
   if(value.stageForge?.id==='EP-P66'){
    const ghostResponse=await fetch('../generated/P87_REFERENCE_GHOST.json',{cache:'no-store'});
    if(!ghostResponse.ok)throw Error('Reference ghost HTTP '+ghostResponse.status);
    replay=validateGhost(await ghostResponse.json());
    validateReferenceSectors(replay);
   }
   if(seq!==loading)return;
   if(g4e7aiOptIn){
    const q=value.stageForge?.g4e7ahStudy;
    if(!q||!['r2-control','true-pinch','pinch-switch'].includes(q.id)||
       id!=='VB-P101-A13-W9C2-G4E7AI-'+q.id.toUpperCase()||
       q.source!=='G4E7AC_R2_APPROACH_ARC_FULL_7_ROAD_SUCCESS'||
       q.geometry!=='TRUE_B48_COLLISION_ROAD_NOT_GRAPHIC'||
       !q.originalLipLandingExact||!q.realMissingLongitudinalCell52||
       q.certifiedSlope2Meters!==0||q.publish!=='HOLD'||
       value.stageForge.productionPromoted!==false||
       value.surfaces.length!==7||value.movingObstacles.length!==28||
       value.surfaces[0].voidLongitudinalCells?.join(',')!=='52')
      throw Error('AI private narrow stage physical provenance mismatch');
    const response=await fetch('../generated/P101_A13_W9C2_G4E7AI_240HZ_FRAMES_LOCAL.json',{cache:'no-store'});
    if(!response.ok)throw Error('AI actual 240Hz camera evidence missing');
    const proof=await response.json(),entry=proof.stages?.[q.id];
    if(proof.schema!=='dopagaki.g4e7ai-R2-visual-native-240hz/1'||
       proof.physicsHz!==240||proof.certifiedSlope2Meters!==0||
       entry?.stageId!==value.stageForge.recordStageId||
       entry.originalRoads!==7||entry.originalMovingMachines!==28||
       entry.minimumRealWidthMeters!==q.widthMinMeters)
      throw Error('AI native 240Hz evidence and physical width mismatch');
    g4e7aiShot=entry.frames.find(f=>f.id===g4e7aiPoint);
    if(!g4e7aiShot||g4e7aiShot.source!=='ACTUAL_240HZ_START00_P96_NOT_HUMAN'||
       g4e7aiShot.speedMps<=52)throw Error('AI requested native frame missing');
    $('demoRun').disabled=true;$('practiceRun').disabled=true;$('spawn').value='0';
   }
   if(g4e7alRequested){
    const aj=value.stageForge?.g4e7ajStudy,ah=value.stageForge?.g4e7ahStudy,
     ap=value.stageForge?.g4e7apStudy,asStudy=value.stageForge?.g4e7asStudy;
    if(aj?.id!=='reanchor'||!G4E7AL_ROADS.includes(aj.road)||
       id!=='VB-P101-A13-W9C2-'+g4e7alStageCode+'-'+aj.road.toUpperCase()||
       value.stageForge.recordStageId!==(g4e7asRequested
        ?'VB-P101-A13-W9C2-G4E7AS-'+aj.road.toUpperCase()+'-BANKED-SERPENT'
        :g4e7apRequested?'VB-P101-A13-W9C2-G4E7AP-'+aj.road.toUpperCase()+'-DUEL'
        :'VB-P101-A13-W9C2-G4E7AJ-'+aj.road.toUpperCase()+'-REANCHOR')||
       (g4e7asRequested?(asStudy?.id!=='banked-serpent'||asStudy.road!==aj.road||
         asStudy.original7Roads!==7||asStudy.actualB51!==28||
         asStudy.originalUnchangedB51FromAP!==26||!asStudy.actualPhysicalGapCell52||
         asStudy.formalSlope2Meters!==0||asStudy.publish!=='HOLD'):Boolean(asStudy))||
       ((g4e7apRequested||g4e7asRequested)?(ap?.id!=='temporal-slalom'||ap.road!==aj.road||
        ap.changedMovingIds?.join(',')!=='a13-machine-01,a13-machine-02'||
        ap.unchangedMovingObjects!==26||ap.realMovingObjects!==28||
        ap.certifiedSlope2Meters!==0||ap.publish!=='HOLD'):Boolean(ap))||
       aj.originalMovingObjects!==28||aj.unchangedMovingObjects!==26||
       !ah?.realMissingLongitudinalCell52||ah.certifiedSlope2Meters!==0||
       aj.publish!=='HOLD'||aj.certifiedSlope2Meters!==0||
       value.stageForge.productionPromoted!==false||
       value.surfaces.length!==7||value.movingObstacles.length!==28||
       value.surfaces[0].voidLongitudinalCells?.join(',')!=='52')
      throw Error('G4E7AL requires real reanchored 7AJ physical course');
    $('demoRun').disabled=true;$('practiceRun').disabled=true;$('spawn').value='0';
   }
   if(g4e7akOptIn){
    const aj=value.stageForge?.g4e7ajStudy,ah=value.stageForge?.g4e7ahStudy;
    if(aj?.id!=='reanchor'||!['true-pinch','pinch-switch'].includes(aj.road)||
       id!=='VB-P101-A13-W9C2-G4E7AK-'+aj.road.toUpperCase()||
       !ah?.realMissingLongitudinalCell52||ah.certifiedSlope2Meters!==0||
       aj.originalMovingObjects!==28||aj.unchangedMovingObjects!==26||
       aj.publish!=='HOLD'||aj.certifiedSlope2Meters!==0||
       value.stageForge.productionPromoted!==false||
       value.surfaces.length!==7||value.movingObstacles.length!==28||
       value.surfaces[0].voidLongitudinalCells?.join(',')!=='52')
      throw Error('AK true physical reanchor provenance mismatch');
    const reply=await fetch('../generated/P101_A13_W9C2_G4E7AK_240HZ_FRAMES_LOCAL.json',{cache:'no-store'});
    if(!reply.ok)throw Error('AK actual 240Hz reanchor camera evidence missing');
    const proof=await reply.json(),entry=proof.stages?.[aj.road];
    if(proof.schema!=='dopagaki.g4e7ak-reanchor-real-native-240hz-frames/1'||
       proof.physicsHz!==240||proof.certifiedSlope2Meters!==0||
       proof.publication!=='HOLD'||entry?.stageId!==value.stageForge.recordStageId||
       entry.realRoads!==7||entry.realB51C!==28||entry.changedB51C!==2||
       entry.widthMeters!==ah.widthMinMeters)
      throw Error('AK real 240Hz frames and native stage mismatch');
    g4e7akShot=entry.frames.find(f=>f.id===g4e7akPoint);
    if(!g4e7akShot||
       g4e7akShot.source!=='ACTUAL_240HZ_START00_REANCHORED_28_B51_P96_NOT_HUMAN'||
       g4e7akShot.speedMps<=52||g4e7akShot.originalMovingPose.length!==2)
      throw Error('AK real native frame missing');
    $('demoRun').disabled=true;$('practiceRun').disabled=true;$('spawn').value='0';
   }
   if(g4e7adOptIn){
    const q=value.stageForge?.g4e7acR2Study;
    if(!q||id!=='VB-P101-A13-W9C2-G4E7AD-'+q.id.toUpperCase()||
       !['approach-arc','landing-crescent'].includes(q.id)||
       q.source!=='AA_LANDING_SOFT_ALPHA070_UNCHANGED_CUT'||!q.originalLipLandingExact||
       q.certifiedSlope2Meters!==0||q.publish!=='HOLD'||
       value.stageForge.productionPromoted!==false||
       value.surfaces.length!==7||value.movingObstacles.length!==28||
       value.surfaces[0].voidLongitudinalCells?.join(',')!=='52')
      throw Error('AD private stage physical provenance mismatch');
    const response=await fetch('../generated/P101_A13_W9C2_G4E7AD_240HZ_FRAMES_LOCAL.json',{cache:'no-store'});
    if(!response.ok)throw Error('AD actual 240Hz camera evidence not present');
    const proof=await response.json(),entry=proof.stages?.[q.id];
    if(proof.schema!=='dopagaki.g4e7ad-R2-visual-native-240hz/1'||
       proof.physicsHz!==240||proof.certifiedSlope2Meters!==0||
       entry?.stageId!==value.stageForge.recordStageId||
       entry.originalRoads!==7||entry.originalMovingMachines!==28)
      throw Error('AD native 240Hz evidence and actual R2 geometry mismatch');
    g4e7adShot=entry.frames.find(f=>f.id===g4e7adPoint);
    if(!g4e7adShot||g4e7adShot.source!=='ACTUAL_240HZ_START00_P96_NOT_HUMAN'||
       g4e7adShot.speedMps<=52)throw Error('AD native 240Hz shot missing');
    $('demoRun').disabled=true;$('practiceRun').disabled=true;$('spawn').value='0';
   }
   if(g4e7wOptIn){
    const q=value.stageForge?.g4e7wStudy;
    const k=q?.physicalTakeoffTransition===.65?'A065':
     q?.physicalTakeoffTransition===.7?'A070':null;
    if(!k||!q?.gap?.realCollisionGap||q.gap.cells?.[0]!==52||
      value.movingObstacles.length!==28||value.surfaces.length!==7||
      value.stageForge.g4e7wStudy.officialSlope2Meters!==0)
     throw Error('G4E-7W private B48 gap provenance mismatch');
    const proofFile=g4e7yEarlyPoint?'P101_A13_W9C2_G4E7Y_EARLY_240HZ_FRAMES_LOCAL.json':
     'P101_A13_W9C2_G4E7W_240HZ_FRAMES_LOCAL.json';
    const proofResponse=await fetch('../generated/'+proofFile,{cache:'no-store'});
    if(!proofResponse.ok)throw Error('G4E-7W missing real 240Hz camera source');
    const proof=await proofResponse.json(),entry=proof.stages?.[k];
    if(proof.schema!=='dopagaki.g4e7w-real-native-B48-WebGL/1'||
     proof.real240Hz!==240||proof.officialSlope2Meters!==0||
     entry.stageId!==value.stageForge.recordStageId||entry.actualRoads!==7||
     entry.movingMachines!==28)
     throw Error('G4E-7W actual physics source and scene disagree');
    g4e7wShot=entry.frames.find(f=>f.id===(g4e7yEarlyPoint||g4e7wPoint));
    if(!g4e7wShot||g4e7wShot.source!=='TRUE_START00_240HZ_P96_NOT_HUMAN'||
      !Number.isFinite(g4e7wShot.speedMps))throw Error('G4E-7W requested native frame absent');
    $('demoRun').disabled=true;$('practiceRun').disabled=true;
    $('spawn').value='0';
   }
   if(g4e7vOptIn){
    const variant=value.stageForge?.g4e7vStudy?.variant;
    if(!['original','exit6','slope6'].includes(variant)||
       id!=='VB-P101-A13-W9C2-G4E7V-'+variant.toUpperCase()||
       value.surfaces.length!==7||value.movingObstacles.length!==28||
       value.stageForge.g4e7vStudy.officialSlope2Meters!==0)
     throw Error('G4E-7V localhost-only real B48 research source mismatch');
    const proofResponse=await fetch('../generated/P101_A13_W9C2_G4E7V_240HZ_FRAMES_LOCAL.json',{cache:'no-store'});
    if(!proofResponse.ok)throw Error('Missing PRIVATE real 240Hz proof');
    const proof=await proofResponse.json(),sub=proof.stages?.[variant];
    if(proof.schema!=='dopagaki.g4e7v-honest-native-speed-WebGL/1'||
       proof.physicsHz!==240||proof.officialSlope2Meters!==0||
       sub?.stageId!==value.stageForge.recordStageId||
       sub.realRoads!==7||sub.movingMachines!==28)
     throw Error('G4E-7V physics observation origin mismatch');
    g4e7vShot=sub.frames.find(x=>x.id===g4e7vPoint);
    if(!g4e7vShot||g4e7vShot.source!=='NATIVE_START00_240HZ_P96_NOT_HUMAN'||
       !Number.isFinite(g4e7vShot.speedMps)||g4e7vShot.speedMps<=0)throw Error('G4E-7V real native frame missing');
    $('demoRun').disabled=true;$('practiceRun').disabled=true;
    $('spawn').value='0';
   }
   if(g4e7sOptIn){
    if(!g4e7sAllowed(value)||id!=='VB-P101-A13-W9C2-G4E7R-CUT')
     throw Error('G4E7S native speed comparison only for genuine private G4E7R-CUT');
    const shotResponse=await fetch('../generated/P101_A13_W9C2_G4E7S_240HZ_PRIVATE.json',{cache:'no-store'});
    if(!shotResponse.ok)throw Error('Missing PRIVATE actual 240Hz frame evidence');
    const recorded=await shotResponse.json();
    if(recorded.schema!=='dopagaki.g4e7s-native-camera/1'||
     recorded.stageId!==value.stageForge.recordStageId||
     recorded.physicsHz!==240||recorded.spawnIndex!==0||
     recorded.officialSlopeDnaMeters!==0||recorded.frames?.length!==4)
     throw Error('G4E7S scripted real-physics provenance mismatch');
    g4e7sTrace=recorded;
    g4e7sShot=recorded.frames.find(f=>f.id===g4e7sPoint);
    if(!g4e7sShot||g4e7sShot.physicsHz!==240||g4e7sShot.speedMps<70)
     throw Error('G4E7S actual high-speed frame unavailable');
   }
   if(seq!==loading)return;
   buildVisual(value);doc=value;world=compiled;ghostData=replay;
  $('demoRun').disabled=!isDemoEligible(doc)||id==='VB-P101-A13-W9X-B1'||Boolean(doc.stageForge.slopeDNAStudy);
  $('p101Controls').hidden=doc.stageForge.id!=='VB-P101';
  canvas.dataset.p101Experimental=String(doc.stageForge.id==='VB-P101');
   $('practiceRun').disabled=doc.stageForge?.id!=='EP-P66';
   $('practiceChapter').disabled=doc.stageForge?.id!=='EP-P66';
  $('spawn').replaceChildren();
  value.spawns.forEach((s,i)=>{const option=document.createElement('option');option.value=String(i);option.textContent=s.name||'開始地点 '+(i+1);$('spawn').append(option);});
  if(g4e7gOptIn&&value.stageForge.g4e7gVisualTrial){
   const i=value.stageForge.g4e7gVisualTrial.originalSpawns;
   $('spawn').value=String(i+(g4e7gPoint==='crown'?1:0));
   $('demoRun').disabled=true;$('practiceRun').disabled=true;
  }
  if(g4e7mOptIn&&value.stageForge.g4e7mRealRoad){
   const m=value.stageForge.g4e7mRealRoad;
   if(m.createdVisualSpawns!==2||m.certifiedSlopeDnaMeters!==0||value.movingObstacles.length!==28)
    throw Error('G4E7M private real B48 asset invariant');
   $('spawn').value=String(g4e7oRequested?0:m.originalSpawns+(g4e7mPoint==='crown'?1:0));
   $('demoRun').disabled=true;$('practiceRun').disabled=true;
  }
  if(g4e7qOptIn&&value.stageForge.g4e7qStudy){
   const q=value.stageForge.g4e7qStudy;
   if(q.createdVisualSpawns!==2||q.officiallyApprovedSlopeDnaMeters!==0||
    value.movingObstacles.length!==28||value.surfaces.length!==7)
    throw Error('G4E-7Q nonpublic actual B48 trial invariant');
   $('spawn').value=String(g4e7qHold?q.originalSpawns+(g4e7qPoint==='landing'?1:0):0);
   $('demoRun').disabled=true;$('practiceRun').disabled=true;
  }
  if(g4e7rOptIn&&value.stageForge.g4e7rStudy){
   const m=value.stageForge.g4e7rStudy;
   if(m.createdInspectionSpawns!==2||m.officialSlope2Meters!==0||
    value.surfaces.length!==7||value.movingObstacles.length!==28)
    throw Error('G4E-7R private actual B48 asset invariant');
   $('spawn').value=String(g4e7rHold?m.inspectionSpawnStart+(g4e7rPoint==='post'?1:0):0);
   $('demoRun').disabled=true;$('practiceRun').disabled=true;
  }
  if(g4e7tOptIn&&value.stageForge.g4e7tStudy){
   const m=value.stageForge.g4e7tStudy;
   if(m.inspectionSpawns!==2||m.certifiedSlope2Meters!==0||
    value.movingObstacles.length!==28||value.surfaces.length!==7)
    throw Error('G4E-7T real B48 localhost-only study invariants');
   $('spawn').value=String(g4e7tHold?m.originalSpawnCount+(g4e7tPoint==='landing'?1:0):0);
   $('demoRun').disabled=true;$('practiceRun').disabled=true;
  }
  if(g4e7hRequested){
   if(!g4e7hHud)g4e7hHud=createG4E7HFocusHud({canvas,parent:$('stage').parentElement});
   g4e7hHud.setStage(Boolean(value.stageForge.g4e7gVisualTrial));
  }
  if(g4e7iRequested){
   if(!g4e7iUi){
    g4e7iUi=createG4E7IControls({canvas,parent:$('stage').parentElement});
    g4e7hHud.button.addEventListener('click',()=>g4e7iUi.refreshFocus());
   }
   g4e7iUi.setStage(Boolean(g4e7iContour?.active));
  }
  if(g4e7jRequested){
   if(!g4e7jUi)g4e7jUi=createG4E7JMatrix({
    canvas,parent:$('stage').parentElement,readability:g4e7iUi,
    focusButton:g4e7hHud.button
   });
   g4e7jUi.setStage(Boolean(g4e7iContour?.active));
  }
  if(g4e7kRequested){
   if(!g4e7kUi)g4e7kUi=createG4E7KControls({canvas,parent:$('stage').parentElement});
   g4e7kUi.setStage(Boolean(g4e7kQuietMesh&&g4e7kAllowed(value)));
  }
  if(g4e7lRequested){
   if(!g4e7lUi)g4e7lUi=createG4E7LStageControls({canvas,parent:$('stage').parentElement});
   g4e7lUi.setStage(Boolean(g4e7lRiftMesh&&g4e7lSeamMesh&&g4e7lAllowed(value)));
  }
  restart();
 }catch(e){
  if(seq!==loading)return;
  status.className='status alert';status.textContent='3D load error: '+e.message;console.error(e);
 }
}
function updateTrackFlowHUD(){
 const bar=$('flowProgress');if(!bar||!doc||!runner)return;
 const flow=flowProgressState(doc,runner.surface,runner.lastSurface,runner.status);
 bar.hidden=!flow.visible;
 if(!flow.visible)return;
 bar.replaceChildren(...flow.stages.map(step=>{
  const el=document.createElement('span');el.textContent=step.label;
  el.dataset.state=step.state;el.setAttribute('aria-current',step.state==='current'?'step':'false');
  return el;
 }));
 canvas.dataset.flowChapter=flow.label;
}
function updateChapterHUD(){
 const el=$('chapterHud');if(!el)return;
 if(['VB-P93','VB-P95','VB-P99','VB-P100','VB-P101'].includes(doc?.stageForge?.id)){
  const surface=doc.surfaces.find(s=>s.id===runner?.surface||s.id===runner?.lastSurface);
  const sub=document.createElement('small');sub.textContent='本物の3D道路・バンク・高低差 / 走行品質は検証候補';
  el.replaceChildren(document.createTextNode(surface?.name||'VOID BREAKER · SCISSOR ABYSS'),sub);
  return;
 }
 if(doc?.stageForge?.id!=='EP-P66'){el.textContent='P62 / ORIGINAL STAGE';return;}
 const id=runner.surface||runner.lastSurface||'';
 const x=runner.p[0];
 let name='RESONANCE CATHEDRAL',hint='巨大共鳴管・高速3D走行';
 if(id.includes('SPIRAL_CATHEDRAL')){name='450° SPIRAL DESCENT';hint=id.endsWith('-06')?'螺旋出口！前方の広い接続路で左へ強く操舵':'大空洞を旋回 / バンクの傾斜を利用';}
 else if(id.includes('PIPE_RETURN')){name='HALO RETURN — 180° SKY HAIRPIN';hint='半径260mの巨大カーブ / 螺旋へ自然接続';}
 else if(id.includes('FORK_APPROACH')){name='CHOOSE YOUR SKYLINE';hint='左へしっかり寄せながら立体分岐へ / 道幅が変化';}
 else if(id.includes('FORK_L')){name='BELL VAULT';hint='外周の低層分岐';}
 else if(id.includes('FORK_R')){name='ORGAN SKYBRIDGE';hint='高層の空中分岐';}
 else if(id.includes('MACHINE_CHAMBER')){name='MACHINE GAUNTLET';hint='動体を回避 / 中央固定は危険';}
 else if(id.includes('GAP_TAKEOFF')){name='NATURAL LAUNCH';hint='坂で飛び出す / ジャンプボタンは不要';}
 else if(id.includes('GAP_LANDING')){name='TOUCHDOWN';hint='着地後のラインを整える';}
 else if(id.includes('FORK_REJOIN')){name='LEVEL CROSSING';hint='左右ルートが再合流';}
 else if(x>=1200&&!runner.grounded){name='AIRBORNE';hint='空中移動中 / 着地点を確認';}
 else if(id.includes('PIPE_DIVE')){name='PIPE BREACH';hint='巨大共鳴管へ突入';}
 const small=document.createElement('small');small.textContent=hint;
 el.replaceChildren(document.createTextNode(name),small);
}
function updateW9C1Notice(edge){
 const root=$('w9c1Notice');
 if(!root||!runner)return;
 const cue=runner.status==='failed'||runner.status==='finished'?null:
  readW9C1Cue(w9c1CueProfile,{
   surfaceId:runner.surface,u:edge?.u,grounded:runner.grounded,
   speedMps:Math.hypot(...runner.v)
  });
 root.hidden=!cue;
 if(b5ManualAudit&&cue)observeW9C1ManualCue(b5ManualAudit,cue,runner.time);
 canvas.dataset.w9c1NoticePhase=cue?.phase||'none';
 canvas.dataset.w9c1NoticeEta=cue?cue.instantaneousEtaSeconds.toFixed(2):'none';
 canvas.dataset.w9c1NoticeDistance=cue?cue.physicalDistanceToCoreMeters.toFixed(1):'none';
 canvas.dataset.w9c1NoticePosition=cue?cue.nominalPositionMeters.toFixed(1):'none';
 if(!cue)return;
 root.dataset.phase=cue.phase;
 $('w9c1NoticeTitle').textContent=cue.phase==='approach'
  ?'ABYSS · まもなく'+cue.widthMeters+'m狭路'
  :cue.phase==='core'?'ABYSS · '+cue.widthMeters+'m超狭路区間':'ABYSS · 狭路からの復帰';
 $('w9c1NoticeDetail').textContent=cue.phase==='approach'
  ?'実路面に沿い約'+Math.round(cue.physicalDistanceToCoreMeters)+'m / 現速度換算 '+cue.instantaneousEtaSeconds.toFixed(1)+'秒先 · 左右の道路端に注意'
  :'実道路幅'+cue.widthMeters+'m · 操舵できる余裕は未検証';
}
function updateEdgeRadar(){
 const root=$('edgeRadar');if(!root||!runner||!doc)return;
 const result=locateRoadLateral(doc,runner.surface,runner.p,sample,frame,{grounded:runner.grounded,ballRadius:RADIUS});
 updateW9C1Notice(result);
 root.hidden=!result;
 if(!result){canvas.dataset.edgeStatus='airborne-or-unavailable';return;}
 root.dataset.severity=result.severity;
 root.dataset.edge=result.edge.toLowerCase();
 root.dataset.v=result.v.toFixed(3);
 canvas.dataset.edgeStatus=result.severity;
 $('edgeMarker').style.left=(Math.max(0,Math.min(1,result.v))*100).toFixed(1)+'%';
 $('edgeLabel').textContent=edgeRadarLabel(result);
 $('edgeTilt').textContent='面傾斜 '+result.tiltDegrees.toFixed(0)+'°';
}
function hud(){
 if(!runner)return;
 if(g4e7alTrial&&g4e7alPanel){
  const m=g4e7oReadRoad(doc,runner,sample,RADIUS);
  g4e7alPanel.live(m?'真B48幅 '+m.widthMeters.toFixed(2)+'m ・ 路肩 '+m.signedEdgeMarginMeters.toFixed(2)+'m ・ '+Math.hypot(...runner.v).toFixed(1)+'m/s ・ FPS '+Math.round(fps):
   '空中/路面不明 ・ '+Math.hypot(...runner.v).toFixed(1)+'m/s');
 }
 if(g4e7oTrial&&g4e7oPanel){
   const m=g4e7oReadRoad(doc,runner,sample,RADIUS);
   g4e7oPanel.live(m?'実B48幅 '+m.widthMeters.toFixed(2)+'m ・ 路肩余裕 '+m.signedEdgeMarginMeters.toFixed(2)+'m ・ '+Math.hypot(...runner.v).toFixed(1)+'m/s ・ FPS '+Math.round(fps):
    '空中／路面位置不明 ・ '+Math.hypot(...runner.v).toFixed(1)+'m/s');
  }
  // Only research screenshots reflect the genuine 240Hz start00 frozen state.
  // Every actual human/manual game remains bound to the live Runner unchanged.
  const speedFrame=(g4e7akOptIn&&g4e7akShot?g4e7akShot:null)||(g4e7aiOptIn&&g4e7aiShot?g4e7aiShot:null)||(g4e7adOptIn&&g4e7adShot?g4e7adShot:null)||(g4e7wOptIn&&g4e7wShot?g4e7wShot:null)||(g4e7vOptIn&&g4e7vShot?g4e7vShot:null)||(g4e7sOptIn&&g4e7sShot?g4e7sShot:null);
  $('speed').textContent=(speedFrame?.speedMps??Math.hypot(...runner.v)).toFixed(1);
 $('simTime').textContent=(speedFrame?.timeSeconds??runner.time).toFixed(2)+' s';$('contacts').textContent=String(runner.collisions);
 $('ground').textContent=speedFrame
  ?(speedFrame.grounded?'接地':'空中')+' / 240Hz SCRIPTED FRAME'
  :(runner.grounded?'接地':'空中')+(p101ReboundRecoveryState(runner).active?' / 非致死衝突から復帰中':'');
 $('fps').textContent=String(Math.round(fps));
 updateRunScore();
 const machineLabel=$('machineCue');
 if(machineLabel){
  const advance=['VB-P95','VB-P99','VB-P100','VB-P101'].includes(doc?.stageForge?.id)
   ?nextRoadHazardCue(doc,runner,hazardRoadPlan,movingObstaclePose,doc.stageForge.id==='VB-P101'?{range:720}:undefined):null;
  const cue=['VB-P95','VB-P99','VB-P100','VB-P101'].includes(doc?.stageForge?.id)?advance
   :nearestMachineCue(doc.movingObstacles,runner.p,runner.forward,runner.time,220,movingObstaclePose);
  machineLabel.hidden=!cue;
  machineLabel.dataset.mode=cue?.mode||'none';
  machineLabel.dataset.urgency=advance?.urgency||'none';
  canvas.dataset.hazardUrgency=advance?.urgency||'none';
  canvas.dataset.hazardTarget=advance?.id||'none';
  canvas.dataset.hazardEta=advance?advance.etaSeconds.toFixed(1):'none';
  if(advance)machineLabel.textContent='先の動体 '+advance.id.slice(-2)+' / '+advance.modeLabel+' · 約'+advance.meters+'m / '+advance.etaSeconds.toFixed(1)+'秒 · 予測位置 '+advance.sideLabel+'（安全な道の保証なし）';
  else if(cue)machineLabel.textContent=cue.typeLabel+' / '+cue.modeLabel+' · '+cue.lateralLabel+' '+cue.distance+'m';
 }
 updateChapterHUD();updateTrackFlowHUD();publishChapterTiming();
 if(runner.status==='failed'&&!status.dataset.failed){
  status.className='status alert';status.textContent='試走終了: '+(runner.failure?.reason||'衝突')+'。Rで再スタート';
  status.dataset.failed='1';
 }
}
function tick(now){
 requestAnimationFrame(tick);
 if(!last)last=now;const elapsed=Math.max(0,(now-last)/1000);last=now;
 let b5PhysicsOverloaded=false;
 if(seekingChapter&&runner){
  const step=advancePracticeSeek(seekingChapter,runner);
  previousPose=currentPose=capturePose(runner);
  cameraState=createCameraState(currentPose.forward);
  accum=0;
  $('practiceProgress').textContent='実物理で追走中 '+runner.time.toFixed(1)+'s / '+seekingChapter.chapter.label;
  if(step.status==='ready'){
   completePracticeTakeover();
  }else if(step.status==='failed'){
   const where=seekingChapter.chapter.label;
   seekingChapter=null;paused=true;
   $('practiceProgress').textContent='この区間への追走に失敗しました: '+where+' / 他の区間を選んでください';
   canvas.dataset.runMode='practice-seek-failed';
  }
 }
 else if(runner&&!paused&&runner.status!=='failed'&&runner.status!=='finished'){
  const manualSteer=Number(right||keys.has('KeyD')||keys.has('ArrowRight'))-Number(left||keys.has('KeyA')||keys.has('ArrowLeft'));
  const progressed=stepFixedClock(accum,elapsed*(demoMode?Number($('demoSpeed').value):1),DT,()=>{
   previousPose=currentPose;
   const steer=g4e7bQa?qaSteer(g4e7bQa,runner,movingObstaclePose):demoMode?nativeDemoSteer(demoDirector,runner,movingObstaclePose):manualSteer;
    if(doc.stageForge.id==='VB-P101'){
      const physicalPower=doc.stageForge.variant==='A13_GAMEPLAY_ISOLATED' ?p101A13ForwardScale(runner,a13Surge):doc.stageForge.variant==='B5_HYPER_ARC_ISOLATED' ?p101B5ForwardScale(runner,p101B5Surge):1;
      p101Step(runner,steer,$('p101Profile').value||P101_DEFAULT,{
        forwardScale:physicalPower,
        // G5-C1 human trial only; driver assist is still the native arcade
        // steering system, while the recovery throttle changes no collisions.
        collisionRecovery:!g4e7bQa&&!demoMode&&!practiceMode&&!seekingChapter&&!g4e7alActive
       });
    }else runner.step(steer);
    currentPose=capturePose(runner);
   if(g4e7bQa)qaStep(g4e7bQa,runner);
   if(g4e7dTrial)observeG4E7DStep(g4e7dTrial,runner,steer);
    if(g4e7oTrial)observeG4E7OStep(g4e7oTrial,doc,runner,steer,sample,RADIUS);
    if(g4e7alTrial)observeG4E7ALStep(g4e7alTrial,doc,runner,steer,sample,RADIUS,movingObstaclePose,sphereBoxSeparation);
   if(demoMode)recordDemoMilestone(demoDirector,runner);
   updateNativeChapterTime();
   const near=stepNearMiss(nearMissTracker,doc.movingObstacles,runner,movingObstaclePose,sphereBoxSeparation,RADIUS);
   if(near){
    $('nearMissCount').textContent=String(near.total);
    canvas.dataset.nearMissCount=String(near.total);
    $('nearMissBurst').hidden=false;
    $('nearMissBurst').textContent='NEAR MISS  ·  '+near.clearance.toFixed(2)+'m  /  ×'+near.total;
   }
   return runner.status!=='failed'&&runner.status!=='finished';
  });
  accum=progressed.accumulator;
  if(progressed.overloaded){frameSkips++;b5PhysicsOverloaded=true;}
  settleRun();
 }
 if(runner&&nearMissTracker){const current=nearMissDisplay(nearMissTracker,runner.time);$('nearMissBurst').hidden=!current;}
 if(runner&&latestSplit)$('splitBurst').hidden=!(runner.time>=latestSplit.time&&runner.time<latestSplit.time+2.2);
 if((demoMode||g4e7bQa)&&runner)$('demoElapsed').textContent=runner.time.toFixed(1)+'s / '+(doc?.stageForge?.id==='VB-P100'?'約40s':doc?.stageForge?.id==='VB-P99'?'約39s':doc?.stageForge?.id==='VB-P95'?'約40s':doc?.stageForge?.id==='VB-P93'?'約38s':'約83.2s');
 if(runner&&now-lastEdgeRadarAt>100){lastEdgeRadarAt=now;updateEdgeRadar();}
 if(b5ManualAudit&&runner&&!paused&&runner.status==='running'&&document.visibilityState==='visible')
  recordB5ManualFrame(b5ManualAudit,elapsed,{physicsOverloaded:b5PhysicsOverloaded});
 if(g4e7dTrial&&runner&&!paused&&runner.status==='running'&&document.visibilityState==='visible')
  observeG4E7DFrame(g4e7dTrial,elapsed,headingError,b5PhysicsOverloaded);
  if(g4e7oTrial&&runner&&!paused&&runner.status==='running'&&document.visibilityState==='visible')observeG4E7OFrame(g4e7oTrial,elapsed,headingError,b5PhysicsOverloaded);
  if(g4e7alTrial&&runner&&!paused&&runner.status==='running'&&document.visibilityState==='visible')observeG4E7ALFrame(g4e7alTrial,elapsed,headingError,b5PhysicsOverloaded);
 frames++;
 if(now-fpsAt>=500){fps=frames*1000/Math.max(now-fpsAt,1);frames=0;fpsAt=now;hud();
  if(b5ManualAudit&&runner&&runner.status==='running'&&!paused&&document.visibilityState==='visible'){
   const input=Number(right||keys.has('KeyD')||keys.has('ArrowRight'))
    -Number(left||keys.has('KeyA')||keys.has('ArrowLeft'));
   const cue=hazardRoadPlan?nextRoadHazardCue(doc,runner,hazardRoadPlan,movingObstaclePose,{range:720}):null;
   recordB5ManualSample(b5ManualAudit,{
    time:runner.time,speed:Math.hypot(...runner.v),fps,frameDelta:elapsed,input,
    surface:runner.surface||runner.lastSurface,grounded:runner.grounded,
    hazard:cue?.id||'none',urgency:cue?.urgency||'none',
    edge:canvas.dataset.edgeStatus,
    w9c1NoticePhase:canvas.dataset.w9c1NoticePhase,
    w9c1NoticeEtaSeconds:Number(canvas.dataset.w9c1NoticeEta),
    w9c1NoticeNominalMeters:Number(canvas.dataset.w9c1NoticePosition)
   });
   $('b5QaStatus').textContent='手動QA '+b5ManualAudit.samples.length+'サンプル / '
    +Math.round(b5ManualAudit.maxSpeed)+'m/s最高 / FPS観測中';
  }
  renderQuality=sampleRenderQuality(renderQuality,fps,{active:Boolean(runner&&!paused&&!seekingChapter&&!demoMode&&runner.status==='running'&&document.visibilityState==='visible')});
  $('renderScaleInfo').textContent=renderScaleLabel(renderQuality)+' / '+canvas.width+'×'+canvas.height+'px';
  const lag=$('cameraInfo');if(lag)lag.textContent=comparisonMode==='stable'
   ?'方向補間：有効 / 角度差 '+(headingError*180/Math.PI).toFixed(1)+'°'+(frameSkips?' / 低FPS警告 '+frameSkips+'回':'')
   :'方向補間：OFF（比較用） / 物理は変更なし';
 }
 render(elapsed);
}
function bindHold(id,set){
 const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);set(true);});
 for(const name of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(name,()=>set(false));
}
bindHold('left',v=>left=v);bindHold('right',v=>right=v);
$('ghostToggle').addEventListener('click',()=>{
 if($('ghostToggle').disabled)return;
 ghostEnabled=!ghostEnabled;
 $('ghostToggle').textContent=ghostEnabled?'基準ゴースト：ON（非衝突）':'基準ゴースト：OFF';
 if(!ghostEnabled)$('ghostGap').hidden=true;
 publishRacecard();
 $('ghostToggle').setAttribute('aria-pressed',String(ghostEnabled));
 publishChapterTiming();
});
$('energyFx').addEventListener('click',()=>{
 energyFx=!energyFx;
 $('energyFx').textContent=energyFx?'エネルギーボール：ON':'エネルギーボール：OFF（従来表示）';
 $('energyFx').setAttribute('aria-pressed',String(energyFx));
});
$('visibilityFx').addEventListener('click',()=>{
 visibilityFx=!visibilityFx;
 $('visibilityFx').textContent=visibilityFx?'道路端ライト・遠景：ON':'道路端ライト・遠景：OFF';
 $('visibilityFx').setAttribute('aria-pressed',String(visibilityFx));
});
$('renderQuality').addEventListener('change',()=>{
 renderQuality=createRenderQuality($('renderQuality').value);
 $('renderScaleInfo').textContent=renderScaleLabel(renderQuality);
});
$('megaWorld').addEventListener('click',()=>{
 if(!megaWorld)return;
 megaEnabled=!megaEnabled;
 $('megaWorld').textContent=megaEnabled?'巨大都市構造：ON':'巨大都市構造：OFF';
 $('megaWorld').setAttribute('aria-pressed',String(megaEnabled));
});
$('cameraCompare').addEventListener('click',()=>{
 comparisonMode=comparisonMode==='stable'?'raw':'stable';
 $('cameraCompare').textContent=comparisonMode==='stable'?'カメラ比較：安定':'カメラ比較：生の方向';
 $('cameraCompare').setAttribute('aria-pressed',String(comparisonMode==='raw'));
 // Switching between visualizations is deliberately instantaneous and does not modify Runner.
 if(currentPose)cameraState=createCameraState(currentPose.forward);
});
function toggle(){
 if(g4e7alRequested&&g4e7alSession.index>=G4E7AL_ROADS.length)return;
 paused=!paused;$('pause').textContent=paused?'再開 (Space)':'一時停止 (Space)';
 // Stop HUD drift: the native 240Hz clock is frozen immediately on pause,
 // so publish that exact committed time instead of waiting for the 500ms HUD refresh.
 if(runner)hud();}
window.addEventListener('keydown',e=>{
 if(['KeyA','KeyD','ArrowLeft','ArrowRight','KeyR','Space'].includes(e.code)&&!['SELECT','INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){
  e.preventDefault();keys.add(e.code);
  if(!e.repeat&&e.code==='KeyR'){if(practiceMode)exitPractice();else if(demoMode)exitDemo();else restart();}
  if(!e.repeat&&e.code==='Space')toggle();
 }
});
window.addEventListener('keyup',e=>keys.delete(e.code));
window.addEventListener('blur',()=>{keys.clear();left=false;right=false;});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){last=0;accum=0;previousPose=currentPose;fpsAt=0;frames=0;}});
function completePracticeTakeover(){
 // Keep exactly the original physics Runner, collision bridge, time and speed.
 demoMode=false;practiceMode=true;seekingChapter=null;
 practiceStartedAt=runner.time;accum=0;last=0;paused=false;
 chapterTracker=createChapterSplits(doc.stageForge?.id,runner.spawnIndex,runner.surface,runner.time);
 latestSplit=null;$('splitBurst').hidden=true;
 nearMissTracker=createNearMissTracker();
 nearMissTracker.eventCursor=runner.events.length;
 $('nearMissCount').textContent='0';$('nearMissBurst').hidden=true;
 canvas.dataset.nearMissCount='0';canvas.dataset.runMode='practice';
 $('demoBanner').hidden=true;$('takeoverRun').hidden=true;
 $('practiceBanner').hidden=false;
 $('practiceProgress').textContent='自分で操作中 / '+runner.time.toFixed(1)+'sから開始 · A/Dで操舵';
 $('practiceRun').textContent='練習終了 → 通常走行';
 $('demoRun').textContent='全編デモを見る（自動操舵）';
 $('demoRun').setAttribute('aria-pressed','false');
 status.textContent='P79 実物理の区間練習中 — 自動操舵OFF、自己ベスト対象外。';
 hud();
 updateRunScore();
}
function exitPractice(){
 practiceMode=false;seekingChapter=null;practiceStartedAt=null;
 demoMode=false;left=false;right=false;keys.clear();restart();
}
function startPractice(){
 if(doc?.stageForge?.id!=='EP-P66'||!runner)return;
 demoMode=false;practiceMode=true;practiceStartedAt=null;
 left=false;right=false;keys.clear();$('spawn').value='0';
 restart();
 seekingChapter=createPracticeSeek($('practiceChapter').value);
 canvas.dataset.runMode='practice-seek';
 $('practiceBanner').hidden=false;
 $('practiceProgress').textContent='実物理の再走開始 · '+seekingChapter.chapter.label;
 $('practiceRun').textContent='練習終了 → 通常走行';
}
function startFailurePractice(){
 const chapter=retryChapterId;
 if(!chapter||doc?.stageForge?.id!=='EP-P66'||runner?.status!=='failed'||demoMode||practiceMode)return;
 if(!PRACTICE_CHAPTERS.some(c=>c.id===chapter))return;
 $('practiceChapter').value=chapter;
 startPractice(); // P79: native 240Hz replay from spawn 00, never a teleport.
}
function takeoverDemo(){
 if(!demoMode||!runner||runner.status!=='running')return;
 completePracticeTakeover();
}
function exitDemo(){
 if(!demoMode)return;
 demoMode=false;left=false;right=false;keys.clear();restart();
}
function startDemo(){
 if(!isDemoEligible(doc)||!runner)return;
 practiceMode=false;practiceStartedAt=null;seekingChapter=null;
 demoMode=true;left=false;right=false;keys.clear();$('spawn').value='0';restart();
 // P98: right-hand setup controls can be several screens below the race.
 // Bring the REAL live canvas into view when spectator play begins, otherwise
 // the player watches a scrolled-off simulation without realizing it.
 canvas.scrollIntoView({block:'start',behavior:'auto'});
}
function pairSnapshot(){
 if(!runner||!b5ManualAudit||!doc||!pairTrialIds.has(b5ManualAudit.stageId)||
    b5ManualAudit.stageId!==doc.stageForge?.recordStageId||
    demoMode||practiceMode||seekingChapter)return null;
 if(b5ManualAudit.final)return null;
 return {time:runner.time,surface:runner.surface||runner.lastSurface,
  contacts:runner.collisions,nearMisses:nearMissTracker.total,
  collisionEvents:runner.events};
}
function sendGuidedPairReport(requestId=null){
 if(!guidedPairTrial||window.parent===window||!b5ManualAudit||
    !pairTrialIds.has(b5ManualAudit.stageId)||demoMode||practiceMode||seekingChapter)return;
 const json=exportB5ManualAudit(b5ManualAudit,{snapshot:pairSnapshot()});
 window.parent.postMessage({type:'dopagaki.w9c1.g5c3.report/1',
  requestId,stageId:b5ManualAudit.stageId,report:JSON.parse(json)},window.location.origin);
}
window.addEventListener('message',event=>{
 // Guard the exact embedding frame and local origin: no remote submission.
 if(!guidedPairTrial||event.origin!==window.location.origin||
    event.source!==window.parent||event.data?.type!=='dopagaki.w9c1.g5c3.capture/1')return;
 if(!b5ManualAudit||!pairTrialIds.has(b5ManualAudit.stageId)||
    !runner||demoMode||practiceMode||seekingChapter)return;
 // A deliberate capture pauses the runner; does not invent a failure,
 // collision or finish, and never modifies its physical velocity.
 if(!b5ManualAudit.final){paused=true;accum=0;$('pause').textContent='再開 (Space)';}
 sendGuidedPairReport(Number.isSafeInteger(event.data.requestId)?event.data.requestId:null);
});
function exportLocalManualQa(){
 const audit=b5ManualAudit?.samples.length?b5ManualAudit:b5PreviousAudit;
 if(!audit){$('b5QaStatus').textContent='まずB5またはA13を手動で走ってください。';return;}
 const val=id=>{const n=Number($(id).value);return n>=1&&n<=5?n:null;};
 const json=exportB5ManualAudit(audit,{
  speedFeel:val('b5SpeedFeel'),steeringFeel:val('b5SteeringFeel'),
  hazardLegibility:val('b5HazardFeel'),note:$('b5QaNote').value,
  w9c1Feedback:audit.stageId.includes('W9C1-')?{
   warningSeenEarly:val('w9c1WarningSeen'),
   edgeReadability:val('w9c1EdgeReadability'),
   failureFairness:val('w9c1FailureFairness'),
   failureAttribution:$('w9c1FailureCause').value
  }:null,
  snapshot:audit===b5ManualAudit?pairSnapshot():null
 });
 const blob=new Blob([json],{type:'application/json;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 const prefix=audit.stageId.startsWith('VB-P101-A13-W9C2-G4E6-')?
  'P101_A13_W9C2_G4E6_'+audit.stageId.split('G4E6-')[1].replace(/[^A-Z0-9-]/gi,'_'):audit.stageId==='VB-P101-A13-W9C1-ULTRA'?'P101_A13_W9C1_ULTRA':audit.stageId==='VB-P101-A13-W9C1-CONTROL'?'P101_A13_W9C1_CONTROL':audit.stageId==='VB-P101-A13-W9C2-RIBBON'?'P101_A13_W9C2_RIBBON':audit.stageId==='VB-P101-A13-W9C2-G4E-SHOULDER'?'P101_A13_W9C2_G4E_SHOULDER':audit.stageId==='VB-P101-A13-W9C2-G4E-RAZOR'?'P101_A13_W9C2_G4E_RAZOR':audit.stageId==='VB-P101-A13-W9C2-EDGE'?'P101_A13_W9C2_EDGE':audit.stageId==='VB-P101-A13-W9X-B1'?'P101_A13_W9X_B1':audit.stageId==='VB-P101-A13-W7F'?'P101_A13_W7F':audit.stageId==='VB-P101-A13'?'P101_A13_W1':'P101_B5';
 a.href=url;a.download=prefix+'_MANUAL_QA_'+(audit.final?.status||(audit.stageId.includes('W9C1-')||audit.stageId.includes('W9C2-')?'running_snapshot':'ongoing'))+'.json';
 document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);
 $('b5QaStatus').textContent='試走JSONを端末へ保存しました（自動送信なし）。';
}
$('b5QaExport').addEventListener('click',exportLocalManualQa);
$('b5ResultExport').addEventListener('click',exportLocalManualQa);

$('demoRun').addEventListener('click',()=>demoMode?exitDemo():startDemo());
$('practiceRun').addEventListener('click',()=>practiceMode?exitPractice():startPractice());
$('takeoverRun').addEventListener('click',takeoverDemo);
$('retryPractice').addEventListener('click',startFailurePractice);
for(const chapter of PRACTICE_CHAPTERS){const option=document.createElement('option');option.value=chapter.id;option.textContent=chapter.label;$('practiceChapter').append(option);}
$('practiceChapter').value='fork';
$('stage').addEventListener('change',()=>{demoMode=false;practiceMode=false;seekingChapter=null;load();});
// Explicit local QA launch may select a validated stage; never starts a demo or autopilot.
const requestedStage=new URLSearchParams(window.location.search).get('stage');
if(requestedStage&&Object.hasOwn(assets,requestedStage)&&Array.from($('stage').options).some(o=>o.value===requestedStage))$('stage').value=requestedStage;
if(g4e7oRequested)$('stage').value='VB-P101-A13-W9C2-G4E7M-THREAD';
if(g4e7alRequested)$('stage').value='VB-P101-A13-W9C2-'+g4e7alStageCode+'-TRUE-PINCH';
 $('p101Profile').addEventListener('change',()=>{if(doc?.stageForge?.id==='VB-P101')restart();});
$('spawn').addEventListener('change',()=>{demoMode=false;practiceMode=false;seekingChapter=null;restart();});
$('restart').addEventListener('click',()=>practiceMode?exitPractice():demoMode?exitDemo():restart());$('retryRun').addEventListener('click',()=>practiceMode?exitPractice():demoMode?exitDemo():restart());$('pause').addEventListener('click',toggle);
try{init();requestAnimationFrame(tick);load();}
catch(e){status.className='status alert';status.textContent='WebGL2 unsupported: '+e.message;console.error(e);}
