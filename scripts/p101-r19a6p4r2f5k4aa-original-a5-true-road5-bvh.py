"""K4AA — source A5 five-mesh BVH ray audit at 14 real Road5 camera states.

NO proposed site, building, build mesh, road, obstacle, physics or camera edit.
The exact original 240Hz source cameras are read from K4Z true WebGL2
screenshot manifests. The A5 research overlay is NOT rendered in K4Z's
private original r19a1 scene. This is a COUNTERFACTUAL geometry projection,
not a measurement of structures actually displayed in the K4Z screenshot.
Only the unchanged A5 research GLBs are ray-cast.
The 1013x698 K2 inverse lens is an approximation; classification is NOT
GPU depth, actual PNG segmentation, walkable ground, verified free space,
human perception, continuous visibility or approval for a construction.
"""
import bpy, json, sys, math, hashlib, os
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree

SOURCE='af076d67492a677d2235e4730aef8cdf4808e106'
CITY_SHA={
 'ultra':'00197cab04222acbbb6c27f1c97c348ccbf9df0b74864235bed90c0598d3a527',
 'control':'bb7edbdcd850be94e49ada0cd148328e663e60d3ea7398542ff44336f38f226f',
}
TICKS=(10680,10800,10920,11040,11160,11280,11400)
W,H=1013,698
F=1.35
RAY_FAR=3000.0
NEAR_RAY_DIST=1500.0
ZONES={
 'SCREEN_LEFT':(0.065,0.295),
 'SCREEN_MIDDLE':(0.365,0.635),
 'SCREEN_RIGHT':(0.705,0.935),
}
Y_FRACTIONS=(0.18,0.25,0.32,0.39,0.46,0.53)
X_SAMPLES_PER_ZONE=6
def arg(key):
 args=sys.argv[sys.argv.index('--')+1:]
 return args[args.index(key)+1]
ultra=arg('--city-ultra')
control=arg('--city-control')
camera_path=arg('--k4z')
output_path=arg('--output')
def sha_file(file):
 h=hashlib.sha256()
 with open(file,'rb') as f:
  for chunk in iter(lambda:f.read(1024*1024),b''):h.update(chunk)
 return h.hexdigest()
def read_json(file):return json.loads(Path(file).read_text(encoding='utf8'))
data=read_json(camera_path)
assert data['sourceBlob']==SOURCE and data['Hz']==240
assert data['sourceB48']==7 and data['sourceB51']==28
assert data['nativeRuntimeOriginalSource'] and data['oneContinuousPhysicalRunPerMode']
assert data['captureIsSparsePausesNotContinuousVideo']
assert data['originalCamera']=='ball-lock-unfiltered-heading'
assert data['originalPhysicsChanged'] is False and data['originalCameraChanged'] is False
assert data['originalGeometryChanged'] is False
assert data['buildingModelsCreated']==data['addedColliders']==data['officialARTAccepted']==0
assert data['slope2DNARecognizedMetres']==0 and data['errors']==[]
assert len(data['sessions'])==2 and len(data['targetTicks'])==41

def original_source_bvh(glb,mode):
 assert sha_file(glb)==CITY_SHA[mode],(mode,'A5 source GLB hash drift')
 bpy.ops.object.select_all(action='SELECT')
 bpy.ops.object.delete(use_global=False)
 bpy.ops.import_scene.gltf(filepath=os.path.abspath(glb))
 items=sorted((o for o in bpy.context.scene.objects if o.type=='MESH'),key=lambda o:o.name)
 assert len(items)==5,(mode,len(items))
 verts=[]; tris=[]
 for obj in items:
  mesh=obj.data
  mesh.calc_loop_triangles()
  offset=len(verts)
  verts.extend([obj.matrix_world@v.co for v in mesh.vertices])
  tris.extend([tuple(offset+i for i in t.vertices) for t in mesh.loop_triangles])
 assert len(tris)==10566,(mode,len(tris))
 bvhtree=BVHTree.FromPolygons(verts,tris,all_triangles=True)
 assert bvhtree is not None
 return bvhtree
def to_blender(p):
 # Pinned game to Blender axis map from K4S; no camera changes.
 return Vector((p[0],-p[2],p[1]))
def direction(state,x_px,y_px):
 f=Vector(state['cameraFront']).normalized()
 right=f.cross(Vector((0,1,0))).normalized()
 up=right.cross(f).normalized()
 dx=(2*x_px/W-1)*(W/H)/F
 dy=(1-2*y_px/H)/F
 v=(f+right*dx+up*dy).normalized()
 return to_blender(v).normalized()
def cell_positions():
 for zone,(lo,hi) in ZONES.items():
  for ix in range(X_SAMPLES_PER_ZONE):
   x=(lo+(hi-lo)*ix/(X_SAMPLES_PER_ZONE-1))*W
   for yf in Y_FRACTIONS:
    yield zone,round(x,3),round(yf*H,3)
CELLS=list(cell_positions())
assert len(CELLS)==len(ZONES)*X_SAMPLES_PER_ZONE*len(Y_FRACTIONS)==108
result={
 'schema':'dopagaki.k4aa-original-A5-five-mesh-road5-true-camera-ray-layers/1',
 'sourceBlob':SOURCE,'Hz':240,'sourceB48':7,'sourceB51':28,
 'camera':'ball-lock-unfiltered-heading','sourceK4ZJSONsha256':sha_file(camera_path),
 'sourceA5GLBsha256':CITY_SHA,
 'originalA5MeshCountPerWidth':5,'originalA5TrianglesPerWidth':10566,
 'geometrySourceOnly':True,'noNewBuildingModels':True,
 'K4ZSourceSceneRenderedA5':False,
 'counterfactualA5GeometryUnderRealSourceCamera':True,
 'actualK4ZScreenGeometryExplainedByThisBVH':False,
 'originalA5CityIsNotTheOriginalRoadAndHazardGeometry':True,
 'sourceCameraStates':14,'trueRoad5TickCountPerWidth':7,
 'raysPerTrueCamera':len(CELLS),'maxRayDistanceM':RAY_FAR,
 'nearOriginalA5HitClassMaxDistanceM':NEAR_RAY_DIST,
 'rayModel':'K2_APPROXIMATE_INVERSE_CAMERA_PROJECTION_NOT_ACTUAL_GPU_DEPTH',
 'rayObjects':'ONLY_ORIGINAL_A5_FIVE_STATIC_CITY_MESHES__NO_B48_B51_OR_OTHER',
 'sampledTimeNotContinuousVisibility':True,'darkPixelMeansFreeSpace':False,
 'noHitByA5IsNotOpenWalkableOrConstructible':True,
 'sourceGamePhysicsModified':False,'originalRoadCameraModified':False,
 'addedColliders':0,'newBuildingModels':0,
 'independentHumanArchitectureReview':'NOT_TESTED','candidateNativeImage':'NOT_CREATED',
 'independentART':'NOT_TESTED_HOLD','historicK4RAndK4U':'REJECT',
 'officialARTAccepted':0,'slope2DNARecognizedMetres':0,
 'candidateSAT':'NOT_RUN','candidateCCD':'NOT_RUN','walkability':'NOT_RUN',
 'human':'NOT_TESTED','performance':'HOLD','release':'HOLD','merge':'HOLD',
 'modeFrames':[],'errors':[]
}
for mode,glb in [('ultra',ultra),('control',control)]:
 tree=original_source_bvh(glb,mode)
 sess=next(s for s in data['sessions'] if s['mode']==mode)
 frames=[next(x for x in sess['frames'] if x['tick']==t) for t in TICKS]
 assert len(frames)==7 and len({x['tick'] for x in frames})==7
 prior=None
 for frame in frames:
  state=frame['state']
  assert state['road']=='p93-PRISM_CREST-01'
  assert state['status']=='running' and state['B51']==28
  assert state['camera']=='ball-lock-unfiltered-heading'
  assert state['tick']==frame['tick'] and state['paused']==frame['tick']
  assert state['privateSteeringLabel']=='K3B_LEGAL_LATE_P94_DIV3__NOT_HUMAN'
  assert len(state['cameraEye'])==len(state['cameraFront'])==3
  eye=to_blender(state['cameraEye'])
  cells=[]
  for zone,x,y in CELLS:
   direction_world=direction(state,x,y)
   hit,normal,triangle,distance=tree.ray_cast(
      eye+direction_world*0.015,direction_world,RAY_FAR)
   has_hit=hit is not None
   if has_hit:assert distance>=0 and triangle>=0
   cells.append({'zone':zone,'screenPx':[x,y],
     'originalA5HitWithin3000m':has_hit,
     'originalA5HitWithin1500m':has_hit and distance<=NEAR_RAY_DIST,
     'nearestOriginalA5HitDistanceM':round(distance,3) if has_hit else None})
  cameraStep=None
  if prior is not None:
   prev=prior['state']
   shift=math.dist(prev['cameraEye'],state['cameraEye'])
   aa=Vector(prev['cameraFront']).normalized()
   bb=Vector(state['cameraFront']).normalized()
   heading=math.degrees(aa.angle(bb))
   assert 85<shift<115 and heading<20,(mode,frame['tick'],shift,heading)
   cameraStep={'previousTick':prior['tick'],'secondsBetweenSamples':
      round((frame['tick']-prior['tick'])/240,4),
      'straightLineCameraEyeDisplacementM':round(shift,4),
      'cameraFrontAngleDifferenceDegrees':round(heading,4)}
  zone_counts={}
  for zone in ZONES:
   items=[c for c in cells if c['zone']==zone]
   assert len(items)==36
   near=sum(c['originalA5HitWithin1500m'] for c in items)
   far=sum(c['originalA5HitWithin3000m'] for c in items)
   zone_counts[zone]={'sampledScreenRays':len(items),
     'intersectOriginalA5Within1500m':near,
     'intersectOriginalA5Within3000m':far,
     'notIntersectA5Within1500m':len(items)-near,
     'fractionNotHitA5Within1500m':round((len(items)-near)/len(items),5),
     'cannotClaimNoRoadOrB51Obstruction':True}
  result['modeFrames'].append({
   'mode':mode,'tick':frame['tick'],'seconds':frame['seconds'],
   'road':state['road'],'speedMps':round(state['speed'],5),
   'cameraEye':state['cameraEye'],'cameraFront':state['cameraFront'],
   'sourceTrueWebGL2File':frame['file'],'sourceTruePNGsha256':frame['sha256'],
   'cameraStepFromPreviousObservedState':cameraStep,
   'zoneCounts':zone_counts,'rayGrid':cells})
  prior=frame
assert len(result['modeFrames'])==14
assert sum(len(f['rayGrid']) for f in result['modeFrames'])==1512
Path(output_path).parent.mkdir(parents=True,exist_ok=True)
Path(output_path).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('K4AA_FROZEN_ORIGINAL_A5_BVH_TRUE_ROAD5_CAMERA_ONLY_TECH_GATED',json.dumps({
 'trueOriginalA5Rays':1512,'realRoad5CameraStates':14,
 'byMode':{mode:[
   [f['tick'],f['zoneCounts']['SCREEN_LEFT']['fractionNotHitA5Within1500m'],
    f['zoneCounts']['SCREEN_MIDDLE']['fractionNotHitA5Within1500m'],
    f['zoneCounts']['SCREEN_RIGHT']['fractionNotHitA5Within1500m']]
   for f in result['modeFrames'] if f['mode']==mode] for mode in ('ultra','control')},
 'art':'NOT_TESTED_HOLD','newModels':0}))
