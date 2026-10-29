/**
 * R15S2B source-native controlled counterfactual:
 * same real B48 7 roads + 28 B51 moving hazards, original 240Hz/CCD,
 * identical P96 early-soft until 21.50s, then only a STANDARD LEGAL
 * [-1,1] scripted P94 centerline-corrective user-input policy differs.
 * This is causal controller FEASIBILITY research, NOT human playability.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {buildR15Q} from './p101-r15q-isolated-b48-scissor-c1-curve-and-narrow-route.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p94NativeSteer} from '../web/p94-native-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const ROADS=['true-pinch','pinch-switch'];
const MODES=['B16_ONLY_REFERENCE','B_C1_SHIFT_40M_SOURCE_WIDTH','C_CURVE_SHIFT_30M_NARROW_16M'];
const POLICIES=[{id:'P94_CORRECTIVE_INPUT_DIV_4P8',gain:1/4.8},
                {id:'P94_CORRECTIVE_FULL_LEGAL_INPUT',gain:1}];
const SWITCH_TICK=Math.round(21.5/DT),HORIZON_TICK=Math.round(32/DT);
const round=(x,n=6)=>Number(x.toFixed(n));
const mag=(v)=>Math.hypot(...v);
const dist=(a,b)=>mag(a.map((v,i)=>v-b[i]));
const args=process.argv.slice(2),arg=x=>{const i=args.indexOf(x);assert.ok(i>=0&&args[i+1],'missing '+x);return args[i+1]};
const ref=JSON.parse(fs.readFileSync(arg('--r15q'),'utf8'));
assert.equal(ref.originalGameSourceBlob,SHA);
const results={schema:'dopagaki.r15s2b-original-240hz-same-road-isolated-correction-controls/1',
 sourceBlob:SHA,physicalRunner240Hz:true,sourceGameEdited:false,sourceControllerCodeEdited:false,
 fullNativeCandidateTrials:12,sourceWorlds:ROADS,sourcePhysicalDesigns:MODES,
 sourceControllerSwitchTimeSeconds:21.5,originalP96ExactlyPreservedUntilSwitch:true,
 originalB51DefinitionsAndCollisionEnabled:true,originalGeometryNeverChangesWithinSameControlComparison:true,
 researchOnly:true,noInvisibleSafetyLane:true,noPositionOrVelocitySnapping:true,
 sourceBrowserWebGLRendered:false,humanPlayabilityMeasured:false,
 officialArt:0,officialSlope2Meters:0,ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',
 PERFORMANCE:'HOLD',INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',trials:{}};
for(const road of ROADS){
 results.trials[road]={};
 for(const mode of MODES){
  const baseline=ref.nativeScissorRealEditableSurfaceGeometryTrials[road][mode].true240HzOriginalSourcePhysics;
  const checkpoints=new Map(baseline.nativeQuarterSecondSourcePhysicsTrace.map(x=>[x.tick,x]));
  results.trials[road][mode]={};
  for(const policy of POLICIES){
   const doc=buildR15Q(road,mode),original=JSON.stringify(doc);
   assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
   const player=new Runner(doc,compile(doc),0,52),plan=makeP96RoutePlan(doc,player),surge=createA13SurgeState();
   let verifiedBeforeSwitch=0,lastGrounded=null,firstScissor=null,maxScissorPointIndex=-1;
   let groundedAfterSwitchTicks=0,airAfterSwitchTicks=0;
   let maxInput=0,steeringTicksAfterSwitch=0;
   for(let tick=1;tick<=HORIZON_TICK;tick++){
    if(player.status==='failed'||player.status==='finished')break;
    const input=tick<=SWITCH_TICK
      ?p96DodgeSteer(player,plan,'early-soft',movingObstaclePose).input/4.8
      :p94NativeSteer(player,'corrective')*policy.gain;
    assert.ok(Number.isFinite(input)&&Math.abs(input)<=1+1e-8);
    p101Step(player,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(player,surge),collisionRecovery:false});
    if(tick>SWITCH_TICK){
     maxInput=Math.max(maxInput,Math.abs(input));
     if(Math.abs(input)>1e-6)steeringTicksAfterSwitch++;
     if(player.grounded&&player.surface)groundedAfterSwitchTicks++; else airAfterSwitchTicks++;
    }
    if(tick===Math.round(21.25/DT)||tick===SWITCH_TICK){
     const old=checkpoints.get(tick);
     assert.ok(old,'genuine original saved original pre-switch checkpoint');
     assert.ok(dist(player.p,old.playerWorldXYZ)<1e-5,'original game path before switch');
     assert.ok(Math.abs(mag(player.v)-old.speedMps)<.00011);
     assert.equal(player.surface,old.sourceRoad);
     assert.equal(Boolean(player.grounded&&player.surface),old.engineGrounded);
     assert.ok(Math.abs(input-old.steer)<.00011);
     verifiedBeforeSwitch++;
    }
    if(player.grounded&&player.surface){
     lastGrounded={timeSeconds:round(player.time),road:player.surface};
     if(player.surface===doc.surfaces[2].id){
      if(!firstScissor)firstScissor={timeSeconds:round(player.time)};
      if(tick%12===0){
       const g=player.guides.find(x=>x.surface===doc.surfaces[2].id);
       if(g){
        let idx=-1,d=Infinity;
        g.points.forEach((pt,i)=>{const di=dist(player.p,pt);if(di<d){d=di;idx=i;}});
        maxScissorPointIndex=Math.max(maxScissorPointIndex,idx);
       }
      }
     }
    }
   }
   assert.equal(verifiedBeforeSwitch,2);
   assert.equal(JSON.stringify(doc),original,'replay mutated source road');
   const movingEvents=player.events.filter(x=>x.type==='moving-contact'||x.type==='moving-crush'||x.type==='moving-unsafe');
   const record={policy:policy.id,legalInputScale:policy.gain,
     trueNativeStatus:player.status,realNativeTerminalTimeSeconds:round(player.time),
     actualNativeFailure:player.failure?.reason??null,
     originalReferenceStatus:baseline.originalSourceStatus,
     originalReferenceTerminalTimeSeconds:baseline.originalSourceTerminalTimeSeconds,
     actualLastNativeGrounded:lastGrounded,firstActualSCISSORGrounded:firstScissor,
     maxSCISSORGuideStationIndexSampled:maxScissorPointIndex,
     groundedAfterSwitchSeconds:round(groundedAfterSwitchTicks*DT),
     airborneAfterSwitchSeconds:round(airAfterSwitchTicks*DT),
     maximumAbsoluteLegalSteer:round(maxInput),
     nonzeroSteeringTicksAfterSwitch:steeringTicksAfterSwitch,
     sourceMovingContactEventCount:movingEvents.length,
     originalP96BeforeSwitchCheckpointsVerified:verifiedBeforeSwitch,
     originalB51Count:doc.movingObstacles.length,
     sourceOriginalNativePhysicsUnchanged:true,
     noHumanGameOrArtCertified:true};
   results.trials[road][mode][policy.id]=record;
   console.log('R15S2B_240HZ_POLICY_COMPARISON',JSON.stringify({road,mode,policy:policy.id,
    status:record.trueNativeStatus,terminal:record.realNativeTerminalTimeSeconds,
    baseline:record.originalReferenceTerminalTimeSeconds,lastGrounded,
    firstScissor,guideIndex:maxScissorPointIndex,movingContactEvents:movingEvents.length}));
  }
 }
}
const outputDir=arg('--out');fs.mkdirSync(outputDir,{recursive:true});
fs.writeFileSync(outputDir+'/R15S2B_12_SOURCE_NATIVE_LEGAL_CONTROLLER_21P5S_COUNTERFACTUAL.json',JSON.stringify(results,null,2)+'\n');
