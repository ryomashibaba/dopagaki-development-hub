# R8D alternative existing CX floor candidates, no construction and no ART.
# R5A existing proof is at 17s; seek EARLY source face so a 460m
# unsupported skywalk is not accidentally assumed necessary or acceptable.
import bpy,json,os,sys,math
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
args=sys.argv[sys.argv.index('--')+1:]
def arg(k):assert k in args,k;return args[args.index(k)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
r8b=json.load(open(arg('--r8b'),encoding='utf-8'))
source=json.load(open(arg('--native'),encoding='utf-8'))
assert r8b['schema']=='dopagaki.g4e7dz-r6d-r8b-chronology-grade-constrained/1'
assert source['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert r8b['road']==source['road']==road
assert r8b['sourceCXBlob']==source['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
bpy.ops.wm.open_mainfile(filepath=arg('--blend'))
s=bpy.context.scene
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
b48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
b51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
oldcam=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
earlycam=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(cx),len(b48),len(b51),len(oldcam.objects),len(earlycam.objects))==(18,7,28,5,8)
def signature():
 return (sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx),
 sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in b48),
 sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in b51),
 sorted((o.name,float(o['true_240hz_time'])) for o in oldcam.objects))
before=signature()
selected=r8b['selectedChronologicalSites']
assert len(selected)==5
early=Vector(selected[1]['xyz'])
originalContact=Vector(selected[0]['xyz'])
def bvh(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
 [tuple(face.vertices) for face in o.data.polygons],all_triangles=False)
static=[('CX',o,bvh(o)) for o in cx]+[('B48',o,bvh(o)) for o in b48]
# Existing CX originals are world-space polygon geometry. A polygon facing
# upward with real area is merely an apparent FLOOR, not a navigable entrance.
floorCandidates=[]
for obj in cx:
 for face in obj.data.polygons:
  normal=(obj.matrix_world.to_3x3()@face.normal).normalized()
  if normal.y<.82 or face.area<10:continue
  # Centroid of actual polygon, no invented POI.
  pos=obj.matrix_world@face.center
  if not (-9000<pos.x<9000 and -9000<pos.y<9000 and -9000<pos.z<9000):continue
  dxz=math.hypot(early.x-pos.x,early.z-pos.z)
  rise=abs(early.y-pos.y)
  if dxz>420 or dxz<.01:continue
  grade=rise/dxz
  direction=(early-pos).normalized()
  nearest=None
  for typ,ob,tr in static:
   h,n,faceidx,dist=tr.ray_cast(pos+Vector((0,.9,0)),direction,(early-pos).length-.5)
   if h is not None and dist is not None and (nearest is None or dist<nearest[0]):
    nearest=(dist,typ,ob.name)
  score=dxz*.02+max(0,grade-.09)*650+rise*.1
  floorCandidates.append({'sourceCXObject':obj.name,'sourceSourceSHA':obj['source_sha256'],
   'sourcePolygonIndex':face.index,'trueWorldCentroid':[round(float(v),4) for v in pos],
   'floorNormalY':round(float(normal.y),4),'sourceMeshPolygonArea':round(float(face.area),3),
   'horizontalDistanceToEarly':round(dxz,3),'riseMetres':round(rise,3),
   'directLineGrade':round(grade,5),
   'originalMeshCenterlineObstruction':{'metres':round(float(nearest[0]),3),
     'type':nearest[1],'object':nearest[2]} if nearest else None,
   'score':round(score,4),
   'physicalPedestrianAccessCertified':False})
floorCandidates.sort(key=lambda x:x['score'])
# The nearest floor is NOT a usable public ramp if the CX mesh blocks
# its centerline. Prioritize genuine unoccluded real-source segments.
shortClear=[x for x in floorCandidates
 if x['originalMeshCenterlineObstruction'] is None
 and x['horizontalDistanceToEarly']<=150
 and x['directLineGrade']<=.09]
best=shortClear[0] if shortClear else None
camVisibility={}
for f in source['frames']:
 id=f['id']
 camera=oldcam.objects.get(id+' REAL ORIGINAL 240HZ')
 if camera is None:camera=earlycam.objects.get('R1 '+id+' SOURCE CAMERA')
 assert camera
 if not best:
  camVisibility[id]=None;continue
 spot=Vector(best['trueWorldCentroid'])
 v=world_to_camera_view(s,camera,spot)
 inside=bool(v.z>0 and .05<v.x<.95 and .05<v.y<.95)
 camVisibility[id]=inside
assert before==signature()
originalDistance=math.hypot(early.x-originalContact.x,early.z-originalContact.z)
report={'schema':'dopagaki.g4e7dz-r6d-r8d-alternative-existing-cx-floor/1',
 'road':road,'sourceCXBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'sourceIdentityProtected':True,
 'originalCX':18,'originalB48':7,'originalB51':28,'originalCameras':5,
 'existingR5ACXInitialRouteHorizontalMetres':round(originalDistance,3),
 'surveyedActualUpwardCXPolygonsWithin420m':len(floorCandidates),
 'topPotentialRealExistingCxFloorFaces':floorCandidates[:20],
 'actualUnobstructedOriginalSourceFloorCandidatesUnder150mGrade9Percent':len(shortClear),
 'topActualUnobstructedSourceFloorCandidates':shortClear[:10],
 'bestExistingSourceCxFloorCandidate':best,
 'bestFloorFaceWithinEarlyNativeCameraFrame':camVisibility,
 'alternativeIsOnlyOriginalMeshSurfaceNoCertifiedEntrance':True,
 'movingB51ContinuousTimeSafety':'NOT_TESTED',
 'noNewBlenderCityMesh':True,'physicalHumanRouteCertified':False,
 'newGameColliders':0,'officialArt':0,'officialSlope2Meters':0,
 'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD',
 'PERFORMANCE':'HOLD','INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R8D_'+road+'_REAL_SOURCE_ALTERNATIVE_CX_FACE.json'),'w',encoding='utf-8') as fd:
 json.dump(report,fd,indent=2,ensure_ascii=False)
print('R8D_SOURCE_CX_FLOOR_CANDIDATE',road,'faces',len(floorCandidates),
 'oldLink',report['existingR5ACXInitialRouteHorizontalMetres'],
 'best',[(x['sourceCXObject'],x['horizontalDistanceToEarly'],x['directLineGrade'])
 for x in floorCandidates[:3]])
