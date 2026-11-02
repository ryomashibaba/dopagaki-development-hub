# R6D-R8C: actual original mesh corridor/foundation/camera verification
# for R8B topology ONLY. Never claim an unsupported skywalk is traversable.
import bpy,sys,os,json,math,statistics
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
argv=sys.argv[sys.argv.index('--')+1:]
def arg(k):assert k in argv,k;return argv[argv.index(k)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
r8=json.load(open(arg('--r8b'),encoding='utf8'))
original=json.load(open(arg('--native'),encoding='utf8'))
contact=json.load(open(arg('--contact'),encoding='utf8'))
hazard=json.load(open(arg('--hazards'),encoding='utf8'))
assert r8['road']==original['road']==contact['road']==hazard['road']==road
assert r8['schema']=='dopagaki.g4e7dz-r6d-r8b-chronology-grade-constrained/1'
assert original['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert contact['schema']=='dopagaki.g4e7dz-r5a-source-contact/1'
assert hazard['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
assert r8['sourceCXBlob']==original['sourceCXBlob']==hazard['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
bpy.ops.wm.open_mainfile(filepath=arg('--source'))
s=bpy.context.scene
assert s['DO_SCENE_IS_NOT_GAME_WEBGL'] and s['DR_ACTUAL_B48_MESH_COUNT']==7
assert s['DR_ACTUAL_B51_POSES_PER_FRAME']==28 and s['DR_ACTUAL_B48_VOID_CELL52']
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
b48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
b51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
movers=[o for o in bpy.data.objects if o.get('R1_B51_ID')]
cams=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
extra=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(cx),len(b48),len(b51),len(movers),len(cams.objects),len(extra.objects))==(18,7,28,28,5,8)
def signature():
 return (sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx),
 sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in b48),
 sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in b51),
 sorted((o.name,float(o['true_240hz_time'])) for o in cams.objects))
frozen=signature()
def bvh(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@x.co) for x in o.data.vertices],
  [tuple(p.vertices) for p in o.data.polygons],all_triangles=False)
world=[('CX',o,bvh(o)) for o in cx]+[('B48',o,bvh(o)) for o in b48]
def rayfirst(a,b,trees,epsilon=.26):
 a=Vector(a);b=Vector(b);d=b-a
 if d.length<epsilon:return None
 best=None
 for typ,obj,t in trees:
  h,n,idx,dist=t.ray_cast(a,d.normalized(),d.length-epsilon)
  if h is not None and dist is not None and (best is None or dist<best['distance']):
   best={'type':typ,'name':obj.name,'distance':float(dist)}
 return best
def boundsSegment(a,b,margin):
 return {'min':[min(a[i],b[i])-margin for i in range(3)],
   'max':[max(a[i],b[i])+margin for i in range(3)]}
def overlaps(a,b):
 return all(a['min'][i]<=b['max'][i] and b['min'][i]<=a['max'][i] for i in range(3))
landing=contact['best']
assert landing and landing['preliminaryCandidate']
origin=[o for o in cx if o.name==landing['CX']]
assert len(origin)==1
point,normal,index,err=bvh(origin[0]).find_nearest(Vector(landing['CXcontactWorldXYZ']))
assert err<.025 and normal.y>.65
assert (Vector(r8['selectedChronologicalSites'][0]['xyz'])-point).length<.001
assert r8['siteRoleTimeOrderValid'] and len(r8['selectedChronologicalSites'])==5
# Exact source raycast along 3D centerline and at both ±3m side bounds.
# Endpoint existing surfaces have special first 0.6m offset only.
edgeStudies=[]
for link in r8['proposedGraphEdges']:
 a=next(x for x in r8['selectedChronologicalSites'] if x['id']==link['from'])
 b=next(x for x in r8['selectedChronologicalSites'] if x['id']==link['to'])
 p=Vector(a['xyz']);q=Vector(b['xyz'])
 horizontal=q-p;horizontal.y=0
 assert horizontal.length>20
 side=Vector((-horizontal.z,0,horizontal.x)).normalized()
 count=max(1,math.ceil((q-p).length/12))
 samples=[];hits=[];dynamicWarnings=set();supports=[]
 for k in range(count):
  pa=p.lerp(q,k/count);pb=p.lerp(q,(k+1)/count)
  if k==0 and link['from']=='SOURCE_CX_WALKABLE_FACE_ONLY':
   pa+=Vector((0,.65,0))
  for lateral in (-3,0,3):
   ra=pa+side*lateral;rb=pb+side*lateral
   hit=rayfirst(ra,rb,world)
   if hit:hits.append({'segment':k,'lateral':lateral,
      'sourceHit':hit,'atMetres':round(float((pa-p).length),2)})
  box=boundsSegment(pa,pb,3.5)
  for hz in hazard['hazards']:
   if hz['sampledAabb'] and overlaps(box,hz['sampledAabb']):
    dynamicWarnings.add(hz['id'])
  # A vertical search for SOURCE footings is only foundation *potential*.
  mid=(pa+pb)/2
  bearing=[]
  for typ,obj,t in world:
   h,n,index,depth=t.ray_cast(mid,Vector((0,-1,0)),400)
   if h is not None and depth is not None and n.y>=.5:
    bearing.append((depth,typ,obj.name))
  nearest=min(bearing) if bearing else None
  if nearest:
   supports.append({'segment':k,'nearestExistingUpwardFloorBelowMetres':round(float(nearest[0]),3),
      'sourceSurfaceType':nearest[1],'sourceSurface':nearest[2]})
  samples.append({'segment':k,'length':round(float((pb-pa).length),3),
   'nearestExistingVerticalSupportGapMetres':round(float(nearest[0]),3) if nearest else None})
 gaps=[x['nearestExistingVerticalSupportGapMetres'] for x in samples]
 edgeStudies.append({'from':a['id'],'to':b['id'],
  'centerAnd3mSideOriginalMeshTriangleHitCount':len(hits),
  'first20OriginalSourceCorridorObstructions':hits[:20],
  'intersectedAll28MovingSampleEnvelopesIDs':sorted(dynamicWarnings),
  '12mCorridorSampleCount':len(samples),
  'samplesWithExistingUpwardFloorBelowWithin25m':sum(x is not None and x<=25 for x in gaps),
  'samplesWithNoExistingFloorFound400m':sum(x is None for x in gaps),
  'maxObservedSourceFloorGapMetres':max((x for x in gaps if x is not None),default=None),
  'directRampGrade':link['directLineGrade'],
  'directRampTooSteepWithoutLift':link['verticalLiftOrSwitchbackRequired'],
  'longSpanSupportStructureNotVerified':link['longSpanNeedsActualLoadPath'],
  'sourceCorridorResearchProvisionalClear':len(hits)==0 and not dynamicWarnings,
  'independentUsableNewFloorBuilt':False,'realLoadBearingCertified':False,
  'humanAccessCertified':False})
frames={f['id']:(i+1,f) for i,f in enumerate(original['frames'])}
# Independent cam source check at each true 240Hz R1 half-second; verify that
# "site visible" in R8B is not an unoccluded animation/physics error.
sourceCameraChecks={}
for key,(fi,f) in frames.items():
 s.frame_set(fi);bpy.context.view_layer.update()
 cam=cams.objects.get(key+' REAL ORIGINAL 240HZ')
 if cam is None:cam=extra.objects.get('R1 '+key+' SOURCE CAMERA')
 assert cam
 movingActive={x['id'] for x in f['moving'] if x['enabled']}
 moveTrees=[('B51',o,bvh(o)) for o in movers if o['R1_B51_ID'] in movingActive]
 v={}
 for site in r8['selectedChronologicalSites'][1:]:
  spot=Vector(site['xyz'])
  uv=world_to_camera_view(s,cam,spot)
  inFrame=uv.z>0 and .06<uv.x<.94 and .08<uv.y<.92
  obstruction=rayfirst(cam.location,spot,world+moveTrees) if inFrame else None
  visible=bool(inFrame and obstruction is None)
  v[site['id']]={'inActualCamera':bool(inFrame),
    'realOriginalSceneRayUnobstructed':visible,
    'originalB48CxB51Occluder':obstruction}
 sourceCameraChecks[key]=v
compare=[]
for site in r8['selectedChronologicalSites'][1:]:
 recomputed={t for t,x in sourceCameraChecks.items() if x[site['id']]['realOriginalSceneRayUnobstructed']}
 selected=set(site['sourceClearFrames'])
 compare.append({'role':site['id'],
  'original13CameraSiteClearFramesAgree':recomputed==selected,
  'mismatchingFrames':sorted(recomputed.symmetric_difference(selected)),
  'sourceVisibleFrameCount':len(recomputed)})
assert frozen==signature()
report={'schema':'dopagaki.g4e7dz-r6d-r8c-actual-source-route-structure/1',
 'road':road,'sourceCXBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'sourceIdentityProtected':True,'sourceCX':18,'sourceB48':7,'sourceB51':28,'originalCameras':5,
 'realCxLandingFaceWithin2_5cm':True,
 'trueOriginalRoute4EdgeStudy':edgeStudies,
 'sourceRayReverificationVsR8A':compare,
 'originalCameraAll13TimesReverified':True,
 'allRolesAndTimeProgression':r8['siteRoleTimeOrderValid'],
 'sourceR8BDirectRampsAllUnder9Percent':r8['directRampGradeNinePercentSatisfiedEverywhere'],
 'physicalContinuousPedestrianCityPath':'NOT_CERTIFIED',
 'sourceCXEntryPublicFloorBuilt':False,
 'structuralBearingAndLongSpanSupport':'NOT_PROVEN',
 'all28MovingContinuousTimeSafety':'NOT_CERTIFIED',
 'artInterior3DExists':False,
 'preModelVerdict':'STOP_NEW_ART_UNTIL_SUPPORT_AND_ACTUAL_PEDESTRIAN_SURFACE_DESIGN',
 'newBlenderCityMeshes':0,'newGameColliders':0,'officialArt':0,'officialSlope2Meters':0,
 'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R8C_'+road+'_SOURCE_ROUTE_CLEARANCE.json'),'w',encoding='utf-8') as fd:
 json.dump(report,fd,indent=2,ensure_ascii=False)
print('R8C_REAL_SOURCE_ROUTE_CLEARANCE',road,
 [(x['from'],x['to'],x['centerAnd3mSideOriginalMeshTriangleHitCount'],
   len(x['intersectedAll28MovingSampleEnvelopesIDs']),
   x['samplesWithExistingUpwardFloorBelowWithin25m'],x['12mCorridorSampleCount'])
 for x in edgeStudies],
 'camRevalidation',[(x['role'],x['original13CameraSiteClearFramesAgree']) for x in compare])
