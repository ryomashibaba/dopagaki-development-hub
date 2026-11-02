/** R15S3D2 source-real long-span CROWN-frozen SCISSOR + CHASM entry.
 * A real, continuous roadway grade (not invisible support or speed assist).
 * CROWN original B16 and 28 B51 moving definitions remain entirely frozen.
 */
import assert from 'node:assert/strict';
import {buildR15S3B} from './p101-r15s3b-isolated-source-trail-aware-scissor-macro-candidates.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
export const GRADE_DESIGNS=Object.freeze({
 J_LONG_GRADE_130:Object.freeze({id:'J_LONG_GRADE_130',endY:130,lateBankM:0,
  hypothesis:'continuous SCISSOR crest to 130m and next road entry without forced auto-forward'}),
 K_BANKED_GRADE_145:Object.freeze({id:'K_BANKED_GRADE_145',endY:145,lateBankM:2.5,
  hypothesis:'less-deep longitudinal release plus bounded true physical late road banking'})
});
const eq=(x,y)=>JSON.stringify(x)===JSON.stringify(y);
const abs=(x,y)=>Math.abs(x-y),round=x=>Number(x.toFixed(6));
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const distance=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
export function buildR15S3D2(world,mode){
 assert.ok(['true-pinch','pinch-switch'].includes(world)&&Object.hasOwn(GRADE_DESIGNS,mode));
 const old=buildR15S3B(world,'E_BANKED_LANDING'),frozen=JSON.stringify(old),doc=structuredClone(old);
 const target=GRADE_DESIGNS[mode],scissor=doc.surfaces[2],next=doc.surfaces[3];
 const sourceSCISSOR=old.surfaces[2],sourceNEXT=old.surfaces[3];
 assert.equal(scissor.rows,31);assert.equal(scissor.cols,5);
 assert.equal(next.rows,31);assert.equal(next.cols,5);
 const startRow=11,sourceStart=sourceSCISSOR.points[startRow*5+2][1];
 const originalExit=sourceSCISSOR.points[30*5+2][1],drop=originalExit-target.endY;
 assert.ok(drop>30&&drop<90);
 let maxChange=0,scissorRows=0,nextRows=0;
 for(let row=startRow+1;row<=30;row++){
  // Preserve every actual original early SCISSOR road control row 0...11.
  // Whole 20-row longitudinal crest is reauthored into a genuinely lower
  // physical road, not a contact-only phantom plane.
  const t=(row-startRow)/(30-startRow);
  const targetY=sourceStart+(target.endY-sourceStart)*t;
  const trueMid=sourceSCISSOR.points[row*5+2][1];
  const bank=target.lateBankM*Math.sin(Math.PI*t)**2;
  for(let col=0;col<5;col++){
   const p=sourceSCISSOR.points[row*5+col],across=(col-2)/2;
   const revised=[p[0],p[1]+(targetY-trueMid)+bank*across,p[2]];
   scissor.points[row*5+col]=revised;
   maxChange=Math.max(maxChange,distance(revised,p));
  }
  scissorRows++;
 }
 for(let row=0;row<20;row++){
  const weight=1-smooth(row/20);
  for(let col=0;col<5;col++){
   const p=sourceNEXT.points[row*5+col];
   next.points[row*5+col]=[p[0],p[1]-drop*weight,p[2]];
   maxChange=Math.max(maxChange,distance(p,next.points[row*5+col]));
  }
  nextRows++;
 }
 assert.equal(scissorRows,19);
 assert.equal(nextRows,20);
 assert.ok(maxChange>30,'must be meaningful real macro road redesign');
 assert.ok(eq(scissor.points.slice(0,(startRow+1)*5),sourceSCISSOR.points.slice(0,(startRow+1)*5)));
 assert.ok(eq(next.points.slice(20*5),sourceNEXT.points.slice(20*5)));
 assert.ok(eq(doc.surfaces[1],old.surfaces[1]),'freeze successful true B16 CROWN');
 assert.ok(eq(doc.surfaces[0],old.surfaces[0]));
 assert.ok(eq(doc.surfaces.slice(4),old.surfaces.slice(4)));
 assert.ok(eq(doc.movingObstacles,old.movingObstacles));
 assert.ok(eq(doc.route,old.route));
 assert.ok(eq(doc.spawns,old.spawns));
 assert.equal(tessellate(scissor).degenerate,0);
 assert.equal(tessellate(next).degenerate,0);
 const a=sample(scissor,1,.5),b=sample(next,0,.5),gap=distance(a,b);
 assert.ok(gap<1e-4,'true road SCISSOR exit and next entrance centre must share same coordinates');
 assert.ok(abs(a[1],target.endY)<1e-5);
 assert.equal(JSON.stringify(old),frozen);
 const oldGap=distance(sample(sourceSCISSOR,1,.5),sample(sourceNEXT,0,.5));
 assert.ok(oldGap<1e-4);
 doc.name=old.name+' R15S3D2 '+mode+' REAL LONGITUDINAL CONTINUOUS TWO ROAD STUDY';
 doc.stageForge={...doc.stageForge,productionPromoted:false,
  r15s3d2PhysicalStudy:{sourceBlob:SHA,world,mode,
   studyOnly:true,changedTruePhysicalB48Sections:[2,3],
   longSCISSORGradeRows12To30:scissorRows,
   nextRoadPhysicalEntryRows0To19:nextRows,
   freezeProvenCROWNEntireSurface:true,freezeEarlySCISSORRows0To11:true,
   preserveFirstOriginalB48AndLastThreeRoads:true,
   actualNativeB48RoadCount:7,originalDynamicB51DefinitionsUnmodified:28,
   originalPhysicsCCDSteeringRouteAndCameraUnmodified:true,
   newHiddenColliders:0,noTeleportOrForceAcceleration:true,
   trueRoadCenterPositionGapM:round(gap),
   sourceTrueSurfaceNormalAndHumanCollisionContinuityNotVerified:true,
   originalExitY:round(originalExit),newExitY:round(a[1]),
   actualB48ControlPointMaxDisplacementM:round(maxChange),
   sourceArtOrGameplayUncertified:true,sourceBrowserWebGLRendered:false,
   officialArt:0,officialSlope2Meters:0,ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD'}};
 const valid=validate(doc);assert.equal(valid.surfaces.length,7);assert.equal(valid.movingObstacles.length,28);
 return valid;
}
