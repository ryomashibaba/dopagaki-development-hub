/**
 * G4E-7W causal screen: matched NO GAP and true GAP with exactly identical
 * B48 lattice. Both measured from canonical start00 at native 240Hz.
 * Stop after 9s only: LOCAL EARLY SCREEN, never claim all-7 success here.
 * Publish and human fair/visibility ALWAYS HOLD.
 */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {W_PROFILES,W_GAP_CELLS,g4e7wProfileWidth,generateG4E7WPhysical} from './p101-w9c2-g4e7w-grounded-cut-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {sample} from '../private/reference_only/director/surface.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const f=(x,n=4)=>Number(x.toFixed(n));
const dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);
const distance=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
function uAt(line,p){
 let best=Infinity,u=0;
 for(let i=0;i<line.length-1;i++){
  const a=line[i],d=a.map((x,k)=>line[i+1][k]-x),
   v=p.map((x,k)=>x-a[k]),q=Math.max(0,Math.min(1,dot(v,d)/(dot(d,d)||1))),
   dd=Math.hypot(...v.map((x,k)=>x-q*d[k]));
  if(dd<best){best=dd;u=(i+q)/(line.length-1);}
 }
 return {u,dist:best};
}
function initialize(doc){
 const r=new Runner(doc,compile(doc),0,52);
 return {doc,r,plan:makeP96RoutePlan(doc,r),surge:createA13SurgeState(),
  rejoin:null,firstAir:null,shock:0,exitMin:Infinity,visited:new Set()};
}
function step(x){
 const r=x.r;if(!['ready','running'].includes(r.status))return;
 const before=Math.hypot(...r.v),
  input=p96DodgeSteer(r,x.plan,'early-soft',movingObstaclePose).input/4.8;
 p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,x.surge),
  collisionRecovery:false});
 x.shock=Math.max(x.shock,before-Math.hypot(...r.v));
 if(r.surface)x.visited.add(r.surface);
}
function one(profile,cell){
 const cutDoc=generateG4E7WPhysical(profile,cell),baseDoc=structuredClone(cutDoc);
 delete baseDoc.surfaces[0].voidLongitudinalCells;
 if(JSON.stringify(baseDoc.surfaces[0].points)!==JSON.stringify(cutDoc.surfaces[0].points))
  throw Error('Only physical missing cell may differ');
 const baseline=initialize(baseDoc),cut=initialize(cutDoc),gap=cutDoc.stageForge.g4e7wStudy.gap,
  line=Array.from({length:129},(_,i)=>sample(cutDoc.surfaces[0],i/128,.5));
 let firstDiff=null,maxDelta=0,extraAir=0,bothAir=0,
  preLipBothGround=0,preLipBothAir=0,nearTicks=0,
  firstCause=null,postGapGroundedTicks=0,headToHead=0;
 for(let tick=1;tick<=9/DT;tick++){
  step(baseline);step(cut);
  const a=baseline.r,b=cut.r;
  const at=uAt(line,a.p),qt=uAt(line,b.p);
  if(b.status==='running'&&qt.dist<24){
   if(qt.u>=gap.uTakeoff&&qt.u<=gap.uLanding+.10&&
     !b.grounded&&!cut.firstAir)
    cut.firstAir={t:f(b.time,5),u:f(qt.u,6),speed:f(Math.hypot(...b.v),2)};
   if(cut.firstAir&&b.grounded&&b.surface===cutDoc.surfaces[0].id&&
      qt.u>gap.uLanding&&!cut.rejoin)
    cut.rejoin={t:f(b.time,5),u:f(qt.u,6),speed:f(Math.hypot(...b.v),2)};
   if(qt.u>=gap.uLanding&&qt.u<=gap.uLanding+.08){
    cut.exitMin=Math.min(cut.exitMin,Math.hypot(...b.v));
    if(b.grounded)postGapGroundedTicks++;
   }
  }
  if(a.status==='running'&&b.status==='running'&&at.dist<24){
   const u=at.u;
   if(u>=gap.uTakeoff-.025&&u<gap.uTakeoff-.005){
    if(a.grounded&&b.grounded)preLipBothGround++;
    if(!a.grounded&&!b.grounded)preLipBothAir++;
   }
   if(u>=gap.uTakeoff-.03&&u<=gap.uLanding+.10){
    nearTicks++;
    const delta=distance(a.p,b.p);
    maxDelta=Math.max(maxDelta,delta);
    if(a.grounded&&!b.grounded){extraAir++;if(!firstCause)
     firstCause={t:f(b.time,5),u:f(u,6),speed:f(Math.hypot(...b.v),2)};}
    if(!a.grounded&&!b.grounded)bothAir++;
    if(!firstDiff&&(delta>.01||a.grounded!==b.grounded))
     firstDiff={t:f(b.time,5),u:f(u,6),delta:f(delta,6),
      solidGrounded:a.grounded,cutGrounded:b.grounded};
   }
   headToHead++;
  }
  if(!['running','ready'].includes(a.status)&&!['running','ready'].includes(b.status))break;
 }
 const speed=Number.isFinite(cut.exitMin)?f(cut.exitMin,2):null;
 return {profile,cell,narrowLipWidthMeters:gap.lipWidthMeters,cutLengthMeters:gap.gapMeters,
  localScreenSeconds:9,notAFullCourseTest:true,firstDiff,
  beforeLipBothGroundTicks:preLipBothGround,beforeLipBothAirTicks:preLipBothAir,
  nearWindowBothAirTicks:bothAir,extraGapCausedAirTicks:extraAir,firstCause,
  maximumEarlyPositionDifferenceMeters:f(maxDelta,4),bothRunningNearWindowTicks:nearTicks,
  rejoin:cut.rejoin,afterGapGroundedTicks:postGapGroundedTicks,
  minimumPostGapSpeedMps:speed,
  intact:{status:baseline.r.status,timeSeconds:f(baseline.r.time),
   visited:baseline.visited.size},
  gap:{status:cut.r.status,timeSeconds:f(cut.r.time),visited:cut.visited.size,
   failure:cut.r.failure?.reason??null},
  // Quality gate for further full tests, not an acceptance or formal distance.
  investigateFullRun:preLipBothGround>=3&&extraAir>=4&&maxDelta>.1&&
   Boolean(cut.rejoin)&&postGapGroundedTicks>=2&&speed!==null&&speed>=62&&
   cut.r.status!=='failed',
  humanFairness:'HOLD',officialSlope2Meters:0};
}
export function g4e7wCausalGroundedScreen(){
 const candidates=[],excluded=[];
 for(const profile of W_PROFILES)for(const cell of W_GAP_CELLS){
  const width=g4e7wProfileWidth(profile,cell);
  if(width>22||width<10){
   excluded.push({profile,cell,widthMeters:width,reason:'OUTSIDE_TRUE_NARROW_WAIST'});
   continue;
  }
  candidates.push(one(profile,cell));
 }
 return {schema:'dopagaki.g4e7w-causal-screen/1',hz:1/DT,
  start00:true,initialSpeedMps:52,sameRealB48ExceptVoid:true,
  testedCandidates:candidates.length,excluded,results:candidates,
  qualifiedForFullRun:candidates.filter(x=>x.investigateFullRun).map(x=>({profile:x.profile,cell:x.cell})),
  noUnverifiedAdoption:true,certifiedSlope2Meters:0,
  allCandidatesHumanPlayability:'HOLD',publication:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const result=g4e7wCausalGroundedScreen();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(result,null,2)+'\n');
 console.log('G4E7W_SCREEN '+JSON.stringify({excluded:result.excluded,
  results:result.results.map(({profile,cell,narrowLipWidthMeters,beforeLipBothGroundTicks,
   beforeLipBothAirTicks,extraGapCausedAirTicks,maximumEarlyPositionDifferenceMeters,
   firstCause,rejoin,minimumPostGapSpeedMps,gap,investigateFullRun})=>
    ({profile,cell,width:narrowLipWidthMeters,groundBefore:beforeLipBothGroundTicks,
      airBefore:beforeLipBothAirTicks,causedAir:extraGapCausedAirTicks,
      maxDelta:maximumEarlyPositionDifferenceMeters,firstCause,rejoin,minSpeed:minimumPostGapSpeedMps,
      localState:gap?.status,qualify:investigateFullRun})),
  eligible:result.qualifiedForFullRun}));
}
