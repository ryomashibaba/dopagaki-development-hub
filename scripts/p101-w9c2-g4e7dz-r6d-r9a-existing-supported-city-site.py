# G4E-7DZ R6D-R9A: compare 100m unsupported link with TRUE SOURCE CX
# architectural floor faces. Build NO art; search direct on-source civic life.
# Native R1 Blender camera + CX18 real polygons + B48 and B51 poses unchanged.
import bpy,sys,os,json,math
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
argv=sys.argv[sys.argv.index('--')+1:]
def arg(k):assert k in argv,k;return argv[argv.index(k)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
native=json.load(open(arg('--native'),encoding='utf-8'))
r8e=json.load(open(arg('--r8e'),encoding='utf-8'))
hazard=json.load(open(arg('--hazards'),encoding='utf-8'))
assert native['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert r8e['schema']=='dopagaki.g4e7dz-r6d-r8e-source-cx-early-6m-corridor/1'
assert hazard['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
assert native['road']==r8e['road']==hazard['road']==road
assert native['sourceCXBlob']==r8e['sourceCXBlob']==hazard['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
bpy.ops.wm.open_mainfile(filepath=arg('--blend'))
scene=bpy.context.scene
assert scene['DO_SCENE_IS_NOT_GAME_WEBGL']
assert scene['DR_ACTUAL_B48_MESH_COUNT']==7 and scene['DR_ACTUAL_B51_POSES_PER_FRAME']==28
assert scene['DR_ACTUAL_B48_VOID_CELL52']
CX=[x for x in bpy.data.objects if x.get('game_world_xyz_unmodified')]
B48=[x for x in bpy.data.objects if x.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
B51=[x for x in bpy.data.objects if x.get('SOURCE_ORIGINAL_B51_ID')]
proxies=[x for x in bpy.data.objects if x.get('R1_B51_ID')]
originalCameras=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
earlyCameras=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(CX),len(B48),len(B51),len(proxies),len(originalCameras.objects),len(earlyCameras.objects))==(18,7,28,28,5,8)
def frozen():
 return [sorted((x.name,x['source_sha256'],len(x.data.polygons)) for x in CX),
 sorted((x.name,x['ORIGINAL_GAME_B48_SHA256'],len(x.data.polygons)) for x in B48),
 sorted((x.name,x['SOURCE_ORIGINAL_B51_ID'],len(x.data.vertices)) for x in B51),
 sorted((x.name,float(x['true_240hz_time'])) for x in originalCameras.objects)]
saved=frozen()
def tree(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@p.co) for p in o.data.vertices],
 [tuple(face.vertices) for face in o.data.polygons],all_triangles=False)
orig=[('CX',x,tree(x)) for x in CX]+[('B48',x,tree(x)) for x in B48]
def hitray(start,target,objects,margin=.28):
 ray=target-start
 if ray.length<=margin:return None
 result=None
 for cat,x,tr in objects:
  p,n,k,d=tr.ray_cast(start,ray.normalized(),ray.length-margin)
  if p is not None and d is not None and (result is None or d<result['d']):
   result={'type':cat,'name':x.name,'d':round(float(d),4)}
 return result
def inEnvelope(point,margin=6):
 return [h['id'] for h in hazard['hazards'] if h['sampledAabb'] and
  all(h['sampledAabb']['min'][i]-margin<=point[i]<=h['sampledAabb']['max'][i]+margin for i in range(3))]
frames=native['frames']
fearly=frames[:5] # 11.0 11.5 12.0 12.5 13.0
# The actual player's source path must not be modified to obtain visibility.
frameData={}
for fi,f in enumerate(fearly,1):
 scene.frame_set(fi);bpy.context.view_layer.update()
 cam=originalCameras.objects.get(f['id']+' REAL ORIGINAL 240HZ')
 if cam is None:cam=earlyCameras.objects.get('R1 '+f['id']+' SOURCE CAMERA')
 assert cam and (cam.location-Vector(f['eye'])).length<.0002
 active={m['id'] for m in f['moving'] if m['enabled']}
 movers=[('B51',x,tree(x)) for x in proxies if x['R1_B51_ID'] in active]
 frameData[f['id']]={'camera':cam,'moving':movers,'player':Vector(f['playerPosition'])}
# Future building can sit directly on existing source floor, eliminating
# a 100m suspended bridge; but its load bearing remains UNPROVEN.
# Evaluate only source faces near 11..13 visible corridor, not arbitrary
# faraway surface that can never be reached or rendered.
faces=[]
for obj in CX:
 for face in obj.data.polygons:
  normal=(obj.matrix_world.to_3x3()@face.normal).normalized()
  if normal.y<.88 or face.area<55:continue
  center=obj.matrix_world@face.center
  dEarly=min(math.hypot(center.x-p['player'].x,center.z-p['player'].z)
             for p in frameData.values())
  if dEarly>250:continue
  if inEnvelope(center,8):continue
  # A 4-corner footprint on the real source face: a local 8x8m pad.
  # Support at corners must be immediately under the candidate floor.
  # This says "geometric support" not material/engineering safe.
  padCorners=[center+Vector((x,2,z)) for x in (-4,4) for z in (-4,4)]
  footprints=[]
  for p in padCorners:
   best=None
   for cat,mesh,bvh in orig:
    h,n,k,d=bvh.ray_cast(p,Vector((0,-1,0)),8)
    if h is not None and d is not None and n.y>.72 and (best is None or d<best[0]):
     best=(float(d),cat,mesh.name)
   footprints.append(best)
  supported=sum(f is not None and f[0]<=2.3 for f in footprints)
  views={}
  for id,study in frameData.items():
   cam=study['camera'];narrowViews=[]
   # Head heights: courtyard +1.7m, legible multi-floor mass +12m,+30m.
   for height in (2.7,12,30):
    q=center+Vector((0,height,0))
    ndc=world_to_camera_view(scene,cam,q)
    inside=ndc.z>0 and .055<ndc.x<.945 and .06<ndc.y<.94
    blocker=hitray(cam.location,q,orig+study['moving']) if inside else None
    narrowViews.append({'h':height,'inside':inside,'clear':inside and blocker is None,
     'firstBlock':blocker})
   views[id]=narrowViews
  visible=[k for k,v in views.items() if any(x['clear'] for x in v)]
  volumeVisible=[k for k,v in views.items() if sum(x['clear'] for x in v)>=2]
  run=0;longest=0
  for f in fearly:
   if f['id'] in volumeVisible:run+=1;longest=max(run,longest)
   else:run=0
  # Main priority: genuine stable early image of 12-30m habitable volume
  # supported under all four corners, not an arbitrary invisible sheet.
  score=(15*longest+3*len(volumeVisible)+supported*4-
    .025*dEarly - (4-supported)*15)
  faces.append({'existingCXMesh':obj.name,'faceIndex':face.index,
   'originalFaceSourceSHA256':obj['source_sha256'],
   'originalFaceArea':round(float(face.area),3),
   'faceNormalY':round(float(normal.y),4),
   'centerWorld':[round(float(v),5) for v in center],
   'near11to13HorizontalDistanceMetres':round(dEarly,3),
   'genuine8mPadCornersHavingSourceFloorWithin2_3m':supported,
   'genuine8mPadCornersTotal':4,
   'padExistingSourceFoundationWitness':[{'depthMetres':round(x[0],3),'category':x[1],
     'sourceObject':x[2]} if x else None for x in footprints],
   'earlyCamerasWithVisibleMultiFloorVolume':volumeVisible,
   'earlyCamerasWithAnyVisibleHeight':visible,
   'longestConsecutiveEarlyCamerasWithVisibleMultiFloor':longest,
   'nativeOriginal5CameraEvidence':views,
   'earlyVisibilityScoreNotArt':round(score,3),
   'trueStructuralLoadBearingCertified':False})
faces.sort(key=lambda v:(v['longestConsecutiveEarlyCamerasWithVisibleMultiFloor'],
 len(v['earlyCamerasWithVisibleMultiFloorVolume']),
 v['genuine8mPadCornersHavingSourceFloorWithin2_3m'],
 v['earlyVisibilityScoreNotArt']),reverse=True)
allFoundation=[v for v in faces if v['genuine8mPadCornersHavingSourceFloorWithin2_3m']==4]
qual=[v for v in allFoundation if v['longestConsecutiveEarlyCamerasWithVisibleMultiFloor']>=2]
best=qual[0] if qual else None
assert saved==frozen()
report={'schema':'dopagaki.g4e7dz-r6d-r9a-existing-cx-supported-footprint/1',
 'road':road,'sourceCXBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'originalCX':18,'originalB48':7,'originalB51':28,'originalCameras':5,'gap52':True,
 'sourceIdentityUnchanged':True,
 'oldR8ESuspendedSpanMetres':r8e['distancePlanMetres'],
 'oldR8ESupportSampleWithin20m':r8e['samplesActualExistingFloorBelowWithin20m'],
 'oldR8ESupportSampleTotal':r8e['originalSources6mWidePer8mCorridorSamples'],
 'realOriginalFacesExplored':len(faces),
 'realOriginalFloorFootprints4of4Support':len(allFoundation),
 'realSourceSupportedVisibleEarlyTwoFrames':len(qual),
 'topSourceFloorResearchFaces':faces[:25],
 'bestSourceFloorDirectBuildSite':best,
 'newSuspendedPublicBridgeRequiredForThisSite':False if best else None,
 'anyPublicCityPedestrianEntryCertified':False,
 'structuralLoadCapacityCertified':False,
 'anyNewBlenderCityMeshes':0,
 'nativeOriginalEarlyCameraHumanArt':'NOT_RENDERED_CITY_GEOMETRY_NOT_BUILT',
 'decision':'SOURCE_FOUND_GEOMETRIC_DIRECT_FLOOR_SITE' if best else 'STOP_NO_SOURCE_FLOOR_VISIBLE_IN_EARLY_CAMERA',
 'newGameColliders':0,'officialArt':0,'officialSlope2Metres':0,
 'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R9A_'+road+'_EXISTING_CX_FLOOR_AND_EARLY_CAMERA.json'),'w',encoding='utf-8') as fp:
 json.dump(report,fp,indent=2,ensure_ascii=False)
print('R9A_EXISTING_REAL_FLOOR_SEARCH',road,
 'originalFaces',len(faces),'4-corner supported',len(allFoundation),
 'genuinely visible 2 early',len(qual),
 'best',[(x['existingCXMesh'],x['faceIndex'],x['centerWorld'],x['earlyCamerasWithVisibleMultiFloorVolume']) for x in qual[:1]])
