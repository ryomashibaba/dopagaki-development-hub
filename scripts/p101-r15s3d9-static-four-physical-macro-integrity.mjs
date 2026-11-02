/** Static geometry gate for two native worlds x two genuine physical road5/6 designs.
 * Does NOT certify original Runner, CCD individual collision normals or gameplay.
 */
import fs from 'node:fs';import assert from 'node:assert/strict';
import {buildR15S3D9,MODES} from './p101-r15s3d9-source-real-road5-road6-integrated-macro.mjs';
const get=k=>{const i=process.argv.indexOf(k);assert.ok(i>=0&&process.argv[i+1]);return process.argv[i+1];};
const d={schema:'dopagaki.r15s3d9-four-candidate-source-geometry-static-gate/1',
 originalSourceGameBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
 actualOriginalB48Roads:7,originalMovingB51:28,
 actualNative240HzRun:false,sourceOnlyGeometry:true,
 noHiddenColliders:true,gameplay:'HOLD',art:'HOLD',human:'HOLD',
 officialArtCount:0,officialSlope2ApprovedMeters:0,
 cases:{}};
for(const world of ['true-pinch','pinch-switch']){
 d.cases[world]={};
 for(const mode of MODES){
  const doc=buildR15S3D9(world,mode),g=doc.stageForge.r15s3d9;
  const valid={
   originalSourceHash:g.sourceOriginalGameBlob===d.originalSourceGameBlob,
   actuallySevenB48:g.originalB48Count===7,
   actuallyTwentyEightB51:g.originalMovingB51Count===28,
   onlyDownstreamRealPhysicalGridChanged:g.changedPhysicalRoadIndices.join(',')==='5,6'&&g.unchangedCompleteRoads0Through4,
   noAdditionalPhysicalColliders:g.newHiddenRoadsOrPhysicsColliders===0,
   originalControlLawUnchanged:g.actualOriginalP96P94A13RunnerGuideCameraCCDUnmodified,
   road4To5FullFiveVertexContact:g.realRoad4ToRoad5FiveVertexSeamDistancesM.every(x=>x<=.000001),
   road5To6FullFiveVertexContact:g.realRoad5ToRoad6FiveVertexSeamDistancesM.every(x=>x<=.000001),
   road5PositiveRoadFrame:g.realRoad5Geometry.minFrameNormalY>.75,
   road6PositiveRoadFrame:g.realRoad6Geometry.minFrameNormalY>.75,
   road5NoFold:g.realRoad5Geometry.maxNeighbourFrameNormalDegrees<25,
   road6NoFold:g.realRoad6Geometry.maxNeighbourFrameNormalDegrees<25,
   road5RealWidthAbout16:g.realRoad5Geometry.minWidthXZ>=14&&g.realRoad5Geometry.maxWidthXZ<=18,
   road6RealWidthAbout16:g.realRoad6Geometry.minWidthXZ>=14&&g.realRoad6Geometry.maxWidthXZ<=18,
   road4To5NoTangentCliff:g.realRoad4To5HeadingAngleDegrees<20,
   road5To6NoTangentCliff:g.realRoad5To6HeadingAngleDegrees<20,
   originalFinishPreserved:g.oldFinalFinishCentreStillAtXYZ.every((v,i)=>Math.abs(v-doc.surfaces[6].points[30*5+2][i])<1e-5),
   trueGapRules:g.genuineB48GapCellsOnRoad5===(mode===MODES[1]?2:0)
  };
  const passed=Object.values(valid).every(Boolean);
  d.cases[world][mode]={world,mode,sourceSpatialMetrics:g,gateAssertions:valid,staticResult:passed?'PASS_STATIC_ONLY':'REJECT'};
  console.log('R15S3D9_FOUR_REAL_B48_STATIC',JSON.stringify({world,mode,
   staticResult:passed?'PASS_STATIC_ONLY':'REJECT',normalY:[g.realRoad5Geometry.minFrameNormalY,g.realRoad6Geometry.minFrameNormalY],
   maxNormalAngles:[g.realRoad5Geometry.maxNeighbourFrameNormalDegrees,g.realRoad6Geometry.maxNeighbourFrameNormalDegrees],
   road5To6Angle:g.realRoad5To6HeadingAngleDegrees,road4To5Angle:g.realRoad4To5HeadingAngleDegrees,
   widths:[g.realRoad5Geometry.minWidthXZ,g.realRoad5Geometry.maxWidthXZ,g.realRoad6Geometry.minWidthXZ,g.realRoad6Geometry.maxWidthXZ],
   rejectedTests:Object.keys(valid).filter(k=>!valid[k])}));
 }
}
fs.mkdirSync(get('--out'),{recursive:true});
fs.writeFileSync(get('--out')+'/R15S3D9_FOUR_REAL_B48_STATIC_GEOMETRY_GATE.json',JSON.stringify(d,null,2)+'\n');
const passes=Object.values(d.cases).flatMap(x=>Object.values(x)).filter(x=>x.staticResult==='PASS_STATIC_ONLY').length;
console.log('R15S3D9_STATIC_CANDIDATE_GATE_SUMMARY',passes,'of 4, no gameplay certification');
