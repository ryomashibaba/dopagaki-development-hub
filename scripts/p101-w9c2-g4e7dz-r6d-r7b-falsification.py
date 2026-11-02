# R6D-R7B independent falsification, no new art, no geometry changes.
# Distinguish a void merely IN THE CAMERA FRUSTUM from a void physically
# VISIBLE along a ray through real original + newly created 3D meshes.
# Also test whether each slope endpoint actually touches a usable gallery.
import bpy,json,os,sys,statistics,math
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
a=sys.argv[sys.argv.index('--')+1:]
def arg(k):assert k in a,k;return a[a.index(k)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
r7=json.load(open(arg('--audit'),encoding='utf-8'))
source=json.load(open(arg('--native'),encoding='utf-8'))
assert r7['schema']=='dopagaki.g4e7dz-r6d-r7-true-volume-court-city/1'
assert source['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert r7['road']==source['road']==road
assert r7['sourceCXBlob']==source['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
bpy.ops.wm.open_mainfile(filepath=arg('--blend'))
s=bpy.context.scene
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
roads=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
movingSource=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
moving=[o for o in bpy.data.objects if o.get('R1_B51_ID')]
city=[o for o in bpy.data.objects if o.get('R7_UNADOPTED')]
camOriginal=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
camExtra=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(cx),len(roads),len(movingSource),len(moving),len(city),len(camOriginal.objects),len(camExtra.objects))==(18,7,28,28,253,5,8)
def signature():
 return (sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx),
 sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in roads),
 sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in movingSource),
 sorted((o.name,float(o['true_240hz_time'])) for o in camOriginal.objects))
before=signature()
def bvh(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
   [tuple(p.vertices) for p in o.data.polygons],all_triangles=False)
static=[('R7',o,bvh(o)) for o in city]+[('CX',o,bvh(o)) for o in cx]+[('B48',o,bvh(o)) for o in roads]
times=('t1100','t1200','t1300','t1400','t1500','t1600','t1700')
frames={f['id']:(i+1,f) for i,f in enumerate(source['frames'])}
voids=r7['openRealSkyVoidProof']
assert len(voids)==6
study={}
for key in times:
 fi,f=frames[key];s.frame_set(fi);bpy.context.view_layer.update()
 cam=camOriginal.objects.get(key+' REAL ORIGINAL 240HZ')
 if not cam:cam=camExtra.objects.get('R1 '+key+' SOURCE CAMERA')
 assert cam and (cam.location-Vector(f['eye'])).length<.0002
 active={x['id'] for x in f['moving'] if x['enabled']}
 movable=[('B51',m,bvh(m)) for m in moving if m['R1_B51_ID'] in active]
 targets=[]
 for v in voids:
  for height in (0,35,65):
   point=Vector(v['centerWorld'])+Vector((0,height,0))
   ndc=world_to_camera_view(s,cam,point)
   inFrame=bool(ndc.z>0 and 0<ndc.x<1 and 0<ndc.y<1)
   best=None
   ray=point-cam.location
   distance=ray.length
   if inFrame:
    direction=ray.normalized()
    for category,obj,tree in static+movable:
     hit,normal,poly,d=tree.ray_cast(cam.location,direction,distance-.05)
     if hit is not None and d is not None and (best is None or d<best['distance']):
      best={'category':category,'object':obj.name,'distance':round(float(d),3)}
   targets.append({'zone':v['zone'],'heightFromVoidCenterMetres':height,
      'projectedNdc':[round(float(ndc.x),4),round(float(1-ndc.y),4)],
      'cameraFrameHit':inFrame,'unoccludedToTarget':inFrame and best is None,
      'firstObstruction':best})
 study[key]=targets
# Exact distance from each ramp ENDPOINT to the nearest open public gallery
# or switchback landing at matching 3D space: more conservative than names.
# No assumptions about source collision or traversable physical surface.
floorRoles={'INHABITABLE_FRONT_GALLERY_TRUE_3D','INHABITABLE_REAR_GALLERY_TRUE_3D',
 'INHABITABLE_COURTYARD_ARCADE_TRUE_3D','INHABITABLE_OUTER_GALLERY_TRUE_3D',
 'HORIZONTAL_WALK_GALLERY_DIRECT_ENDPOINT',
 'CONTIGUOUS_SWITCHBACK_LANDING_STUDY'}
gallery=[(o,bvh(o)) for o in city if o['R7_ROLE'] in floorRoles]
ramps=[o for o in city if o['R7_ROLE']=='REAL_SLOPED_PUBLIC_RAMP_WITH_LANDING_CONNECTION_STUDY']
assert len(ramps)==32 and len(gallery)>100
endpointEvidence=[]
for obj in ramps:
 v=[obj.matrix_world@p.co for p in obj.data.vertices]
 assert len(v)==8
 starts=[sum((p for p in v[:4]),Vector())/4,sum((p for p in v[4:]),Vector())/4]
 distances=[]
 for endpoint in starts:
  best=float('inf');name=None
  for candidate,tr in gallery:
   cp,n,idx,d=tr.find_nearest(endpoint)
   if d is not None and d<best:
    best=d;name=candidate.name
  distances.append({'closestGalleryDistanceMetres':round(float(best),4),
    'closestGalleryObject':name,
    'precise3DMeshEndpointWithin0_25m':best<=.25})
 endpointEvidence.append({'ramp':obj.name,'endpoints':distances,
   'bothEndpointsNearSomeGallery':all(x['precise3DMeshEndpointWithin0_25m'] for x in distances)})
# Original CX anchoring can be an overlap, not legitimate public access.
# Require a route to be proven separately, even when source triangles intersect.
assert before==signature()
total=len(times)*len(voids)*3
projected=sum(x['cameraFrameHit'] for seq in study.values() for x in seq)
clear=sum(x['unoccludedToTarget'] for seq in study.values() for x in seq)
fullRamps=sum(x['bothEndpointsNearSomeGallery'] for x in endpointEvidence)
report={'schema':'dopagaki.g4e7dz-r6d-r7b-independent-falsification/1','road':road,
 'originalCX':18,'originalB48':7,'originalB51':28,'originalCameraObjects':5,
 'sourceProtected':True,'sourceCXBlob':r7['sourceCXBlob'],
 'genuineSourceFrames':list(times),'sourceCityMeshes':253,'sourceArtUnadopted':True,
 'voidTargetsByNativeCamera':study,'testedVoidTargets':total,
 'projectedVoidTargetCount':projected,'unobstructedVoidTargetCount':clear,
 'genuineVisibleVoidTargetsByFrame':{k:sum(x['unoccludedToTarget'] for x in vs) for k,vs in study.items()},
 'projectedVoidTargetsByFrame':{k:sum(x['cameraFrameHit'] for x in vs) for k,vs in study.items()},
 'rampEndpointContactEvidence':endpointEvidence,
 'rampsWithBothEndpointsWithin25cmOfSomeGallery':fullRamps,
 'rampCount':len(ramps),'mechanicalR7MeshCourtyardVoidVerified':True,
 'originalCityAccessCertified':False,'fullPedestrianRouteCertified':False,
 'rampCollisionAndTraversabilityCertified':False,
 'noNewMeshes':True,'newGameColliders':0,
 'genuineHumanArtVerdict':'REQUIRES_INDEPENDENT_ACTUAL_IMAGE_REVIEW',
 'officialArt':0,'officialSlope2Meters':0,
 'GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R7B_'+road+'_FALSIFICATION.json'),'w',encoding='utf-8') as f:
 json.dump(report,f,ensure_ascii=False,indent=2)
print('R7B_INDEPENDENT_TRUE_SOURCE_PROJECTION_VS_VISIBILITY',road,
 'targets',total,'inFrustum',projected,'genuinelyUnobstructed',clear,
 'rampBothNearGallery',fullRamps,'of',len(ramps),
 'frameClear',report['genuineVisibleVoidTargetsByFrame'])
