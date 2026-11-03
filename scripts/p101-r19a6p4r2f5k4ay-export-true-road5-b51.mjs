/**
 * K4AY: READ-ONLY true B48 source tessellation and exact B51 collision OBBs.
 * Stage is the ORIGINAL W9C1 CONTROL/ULTRA from the source native camera audit.
 * These data are Blender survey context, never a new game road or collider.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {generateP101W9C1AbyssCandidate} from './p101-w9c1-abyss-narrow.mjs';
import {sample,frame,tessellate} from '../private/reference_only/director/surface.js';
import {movingObstaclePose,normalizeMovingObstacles} from '../private/reference_only/director/moving/moving-obstacles.mjs';
const SRC='af076d67492a677d2235e4730aef8cdf4808e106';
const ROAD_ID='p93-PRISM_CREST-01';
const TICKS={control:[11259,11278,11307],ultra:[11320,11341,11369]};
const hash=value=>crypto.createHash('sha256').update(typeof value==='string'?value:JSON.stringify(value)).digest('hex');
const round=x=>Math.round(x*1e9)/1e9;
const dist=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
function nearestSourceSurface(stage,point){
  const candidates=stage.surfaces.map((s,index)=>{
    let best=Infinity,bestUV=null;
    for(let u=0;u<=40;u++)for(let v=0;v<=12;v++){
      const d=dist(point,sample(s,u/40,v/12));
      if(d<best){best=d;bestUV=[u/40,v/12];}
    }
    return {index,id:s.id,meters:round(best),sampleUV:bestUV};
  });
  return candidates.sort((a,b)=>a.meters-b.meters).slice(0,3);
}
export function buildK4AY(cameras){
  assert.equal(cameras.schema,'dopagaki.K4AX.source-true-road5-camera-reference/1');
  assert.equal(cameras.evidenceSource.sourceBlob,SRC);
  assert.equal(cameras.evidenceSource.originalB48Roads,7);
  assert.equal(cameras.evidenceSource.originalB51MovingObstacles,28);
  assert.equal(cameras.evidenceSource.gamePhysicsHz,240);
  assert.deepEqual(cameras.records.map(r=>[r.mode,r.tick]),[
    ['control',11259],['control',11278],['control',11307],
    ['ultra',11320],['ultra',11341],['ultra',11369]]);
  const modes={},all=[];
  for(const mode of ['control','ultra']){
    const stage=generateP101W9C1AbyssCandidate(mode);
    assert.equal(stage.stageForge.recordStageId,'VB-P101-A13-W9C1-'+mode.toUpperCase());
    assert.equal(stage.surfaces.length,7);
    const obstacles=normalizeMovingObstacles(stage);
    assert.equal(obstacles.length,28);
    const roadIndex=stage.surfaces.findIndex(s=>s.id===ROAD_ID);
    assert.ok(roadIndex>=0,'K4AV native Road5 source road ID missing');
    const road=stage.surfaces[roadIndex];
    assert.equal(road.material,'road');
    assert.equal(road.collidable,true);
    assert.equal(road.rideable,true);
    const before=hash(road.points), m=tessellate(road);
    assert.equal(hash(road.points),before,'tessellate unexpectedly mutated source');
    assert.equal(m.degenerate,0);
    assert.ok(m.topIndexCount>0 && m.indices.length>m.topIndexCount);
    const records=cameras.records.filter(x=>x.mode===mode);
    assert.deepEqual(records.map(x=>x.tick),TICKS[mode]);
    const poses=records.map(r=>{
      const seconds=r.tick/240;
      const boxes=obstacles.map(o=>{
        const p=movingObstaclePose(o,seconds);
        assert.equal(p.id,o.id);
        assert.equal(p.enabled,o.enabled);
        assert.ok([p.center,p.halfSize].flat().every(Number.isFinite));
        assert.ok(Number.isFinite(p.yawRadians));
        return {...p,mode:o.collision?.mode??'fail',sourceDescriptorId:o.id};
      });
      assert.equal(boxes.length,28);
      assert.equal(new Set(boxes.map(x=>x.id)).size,28);
      const centers=nearestSourceSurface(stage,r.ball);
      const record={mode,tick:r.tick,sourceNativeSeconds:seconds,eye:r.eye,
        front:r.front,ball:r.ball,sourceImageSHA256:r.sourceImageSHA256,
        originalRoadIDFromK4AV:ROAD_ID,closestPhysicalRoadCandidates:centers,
        B51CollisionOBBNotOriginalVisibleMesh:boxes};
      return record;
    });
    const centerFrame=frame(road,.5,.5);
    assert.ok([...centerFrame.p,...centerFrame.forward,...centerFrame.normal].every(Number.isFinite));
    modes[mode]={
      sourceStageID:stage.stageForge.recordStageId,roadID:ROAD_ID,roadIndex,
      allB48SurfaceIDs:stage.surfaces.map(x=>x.id),
      allB51DescriptorsSHA256:hash(obstacles),B51Count:obstacles.length,
      originalRoadSourcePointsSHA256:before,
      physicalRoadHasRealVoids:(road.voidLongitudinalCells??[]).length>0,
      originalVoidLongitudinalCells:road.voidLongitudinalCells??[],
      originalSourceFrameAtMidpoint:centerFrame,
      mesh:{positions:m.positions,indices:m.indices,topIndexCount:m.topIndexCount,
        bottomIndexCount:m.bottomIndexCount,sideIndexCount:m.sideIndexCount,
        degenerate:m.degenerate,thickness:m.thickness},
      trueSourceTriangleCount:m.indices.length/3,
      trueSourceTopTriangleCount:m.topIndexCount/3,
      nativeTimeMatchedSourceRecords:records
    };
    all.push(...poses.flatMap(r=>r.B51CollisionOBBNotOriginalVisibleMesh));
    modes[mode].sourceTimeRecords=poses;
  }
  assert.equal(all.length,168);
  assert.equal(modes.control.allB51DescriptorsSHA256,modes.ultra.allB51DescriptorsSHA256,
    'W9C1 mode should change source road width only, not original B51 definitions');
  assert.equal(modes.control.roadID,modes.ultra.roadID);
  return {schema:'dopagaki.K4AY.original-B48-tessellated-B51-native-clock-readonly/1',
    frozenOriginalGameGitBlob:SRC,stageGenerator:'generateP101W9C1AbyssCandidate',
    sourceGeometryFunctions:['sample','frame','tessellate'],
    sourceMovingFunction:'movingObstaclePose',
    originalCameraEvidence:'docs/K4AX_TRUE_SOURCE_ROAD5_CAMERA_REFERENCE_20261103.json',
    nativeTimeRule:'source elapsed simulation seconds = exact native tick / 240; independently validated in K4AI source GPU continuity research',
    originalPhysicsHz:240,originalB48Roads:7,originalB51MovingObstacles:28,
    renderedFramesAreOriginalGame:false,sourceCollisionOBBIsOriginalVisualMesh:false,
    newGameColliders:0,alteredGameRoads:0,mainOrProductionChanged:false,
    formalArtAccepted:0,slope2DNAMetres:0,
    gates:{ART:'REJECT_HOLD',HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',
      FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'},modes};
}
const me=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(me){
  const args=process.argv.slice(2);
  const pick=k=>{const i=args.indexOf(k);assert.ok(i>=0,'missing '+k);return args[i+1]};
  const cameras=JSON.parse(fs.readFileSync(pick('--cameras'),'utf8'));
  const out=pick('--out');fs.mkdirSync(out,{recursive:true});
  const data=buildK4AY(cameras);
  fs.writeFileSync(path.join(out,'K4AY_TRUE_SOURCE_B48_B51_READONLY.json'),
    JSON.stringify(data)+'\n');
  const manifest={schema:'dopagaki.K4AY.source-only-export-manifest/1',
    sourceBlob:SRC,Hz:240,physicalRoadID:ROAD_ID,physicalRoads:7,physicalB51:28,
    referenceNativeTicks:cameras.records.map(r=>r.tick),
    imagesAreOriginalGame:false,blenderIsOriginalGame:false,
    originalPhysicalRoadsUnchanged:true,sourceCollisionGeometryReadOnly:true,
    B51VisualAppearanceNotReproduced:true,
    ART:'REJECT_HOLD',HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',
    RELEASE:'HOLD',MERGE:'HOLD',
    modes:Object.fromEntries(Object.entries(data.modes).map(([k,v])=>[k,{
      originalRoadSourcePointsSHA256:v.originalRoadSourcePointsSHA256,
      roadIndex:v.roadIndex,roadID:v.roadID,triangleCount:v.trueSourceTriangleCount,
      sourceTopTriangleCount:v.trueSourceTopTriangleCount,
      voidLongitudinalCells:v.originalVoidLongitudinalCells,
      records:v.sourceTimeRecords.map(r=>({tick:r.tick,seconds:r.sourceNativeSeconds,
        realNativeCameraImageSHA256:r.sourceImageSHA256,
        physicalB51Bodies:r.B51CollisionOBBNotOriginalVisibleMesh.length,
        nearestPhysicalRoad:r.closestPhysicalRoadCandidates[0]}))
    }]))};
  fs.writeFileSync(path.join(out,'K4AY_SOURCE_ONLY_MANIFEST.json'),
    JSON.stringify(manifest,null,2)+'\n');
  console.log('K4AY_GENUINE_SOURCE_ROAD_AND_SOURCE_B51_OBB_EXPORTED_NOT_ART_PASS',
    JSON.stringify(manifest.modes));
}
