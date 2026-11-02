# R10A: original CX *existing* interior volume investigation. No new meshes.
# Candidate rooms must be actually empty 6x6x10m and have source floor,
# opposite original CX walls, plus native camera rays. No door/walk claim.
import bpy,json,os,sys,math
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
args=sys.argv[sys.argv.index('--')+1:]
def arg(s):assert s in args,s;return args[args.index(s)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
source=json.load(open(arg('--native'),encoding='utf8'))
haz=json.load(open(arg('--hazards'),encoding='utf8'))
r9=json.load(open(arg('--r9c'),encoding='utf8'))
assert source['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert haz['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
assert r9['schema']=='dopagaki.g4e7dz-r6d-r9c-original-floor-void-grid-search/1'
assert source['road']==haz['road']==r9['road']==road
assert source['sourceCXBlob']==haz['sourceCXBlob']==r9['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
bpy.ops.wm.open_mainfile(filepath=arg('--scene'))
s=bpy.context.scene
assert s['DO_SCENE_IS_NOT_GAME_WEBGL'] and s['DR_ACTUAL_B48_MESH_COUNT']==7 and s['DR_ACTUAL_B51_POSES_PER_FRAME']==28 and s['DR_ACTUAL_B48_VOID_CELL52']
cx=[x for x in bpy.data.objects if x.get('game_world_xyz_unmodified')]
roadmeshes=[x for x in bpy.data.objects if x.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
dynamic=[x for x in bpy.data.objects if x.get('SOURCE_ORIGINAL_B51_ID')]
proxies=[x for x in bpy.data.objects if x.get('R1_B51_ID')]
cameras=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
extras=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(cx),len(roadmeshes),len(dynamic),len(proxies),len(cameras.objects),len(extras.objects))==(18,7,28,28,5,8)
def signature():
 return (sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx),
 sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in roadmeshes),
 sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in dynamic),
 sorted((o.name,float(o['true_240hz_time'])) for o in cameras.objects))
before=signature()
def bvh(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
 [tuple(p.vertices) for p in o.data.polygons],all_triangles=False)
cxTree=[('CX',o,bvh(o)) for o in cx]
roadTree=[('B48',o,bvh(o)) for o in roadmeshes]
world=cxTree+roadTree
def ray_first(a,d,length,trees):
 if length<=.1:return None
 best=None
 for typ,obj,tr in trees:
  h,n,i,t=tr.ray_cast(a,d,length)
  if h is not None and t is not None and (best is None or t<best['metres']):
   best={'type':typ,'source':obj.name,'metres':float(t),'normalY':round(float(n.y),3)}
 return best
def makebox(p,half=3,height=10):
 vs=[(p.x+x,p.y+y,p.z+z) for y in (0,height) for x,z in
     ((-half,-half),(-half,half),(half,half),(half,-half))]
 return BVHTree.FromPolygons(vs,[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)],all_triangles=False),vs
def envelopehit(v):
 return [h['id'] for h in haz['hazards'] if h['sampledAabb'] and all(
  min(p[j] for p in v)-2<h['sampledAabb']['max'][j] and
  max(p[j] for p in v)+2>h['sampledAabb']['min'][j] for j in range(3))]
# Two genuine reference source regions from R9 failed floor and R8 original.
origins=[Vector((-215.16902,113.41296,-837.28394)),Vector((-176.7074,134.0796,-925.2911))]
samples=[]
# Scan 9x9 ground columns at each of 3 elevations around each anchor.
# Spatially constrained: preserves the original world, no invented local city.
for originId,center in enumerate(origins):
 for dx in range(-32,33,8):
  for dz in range(-32,33,8):
   for height in (2,10,18):
    p=center+Vector((dx,height,dz))
    t,verts=makebox(p)
    collision=[]
    for typ,obj,tr in world:
     hits=t.overlap(tr)
     if hits:collision.append((typ,obj.name,len(hits)))
    if collision:continue
    hazardHit=envelopehit(verts)
    if hazardHit:continue
    # A truly existing source FLOOR underneath, not simply no collision.
    floor=ray_first(p+Vector((0,.5,0)),Vector((0,-1,0)),10,cxTree)
    if not floor or floor['normalY']<.70:continue
    # Physical boundaries of an existing SOURCE courtyard/interior.
    # 'enclosed' only if CX surfaces sit opposite on at least one axis.
    plusX=ray_first(p+Vector((0,5,0)),Vector((1,0,0)),58,cxTree)
    minusX=ray_first(p+Vector((0,5,0)),Vector((-1,0,0)),58,cxTree)
    plusZ=ray_first(p+Vector((0,5,0)),Vector((0,0,1)),58,cxTree)
    minusZ=ray_first(p+Vector((0,5,0)),Vector((0,0,-1)),58,cxTree)
    roof=ray_first(p+Vector((0,9.8,0)),Vector((0,1,0)),65,cxTree)
    lateralPairs=sum(bool(a and b) for a,b in ((plusX,minusX),(plusZ,minusZ)))
    if lateralPairs==0:continue
    samples.append({'origin':originId,'worldXYZ':[round(float(q),4) for q in p],
      'centerCubeMetres':[6,6,10],
      'originalFloorBelow':floor,'CxWallsOppositePairs':lateralPairs,
      'wallsDistancesMetres':{k:round(float(v['metres']),2) if v else None for k,v in
       [('east',plusX),('west',minusX),('north',plusZ),('south',minusZ)]},
      'originalCxCeilingAboveMetres':round(float(roof['metres']),3) if roof else None,
      'b48CxRealMeshIntersectingNewVolume':0,'B51All28x721SampleAabbWarnings':hazardHit,
      'genuinelyOriginalCxVolumeNotAnAccessCertifiedRoom':True})
# Only scan native cameras for candidates truly enclosed & clear.
# actual viewport points may still fail to see existing source interior.
activeByFrame={}
for fi,f in enumerate(source['frames'],1):
 s.frame_set(fi);bpy.context.view_layer.update()
 cam=cameras.objects.get(f['id']+' REAL ORIGINAL 240HZ')
 if cam is None:cam=extras.objects.get('R1 '+f['id']+' SOURCE CAMERA')
 assert cam and (cam.location-Vector(f['eye'])).length<.0002
 active={x['id'] for x in f['moving'] if x['enabled']}
 activeByFrame[f['id']]=(cam,[('B51',x,bvh(x)) for x in proxies if x['R1_B51_ID'] in active])
for q in samples:
 point=Vector(q['worldXYZ'])+Vector((0,5,0))
 clear=[]
 for id,(cam,movers) in activeByFrame.items():
  proj=world_to_camera_view(s,cam,point)
  if not(proj.z>0 and .06<proj.x<.94 and .07<proj.y<.93):continue
  ray=point-cam.location
  if ray.length<.1:continue
  occluder=ray_first(cam.location,ray.normalized(),ray.length-.4,world+movers)
  if occluder is None:clear.append(id)
 q['actualSourceNativeCameraVisibleUnoccluded']=clear
 q['humanIngressPortalFromCXExteriorProven']=False
 q['roomSpacePublicExitContinuityProven']=False
 q['sourceStructuralEngineeringCertified']=False
sampledRoom=[q for q in samples if len(q['actualSourceNativeCameraVisibleUnoccluded'])>=2]
sampledRoom.sort(key=lambda q:(-len(q['actualSourceNativeCameraVisibleUnoccluded']),-q['CxWallsOppositePairs']))
assert before==signature()
data={'schema':'dopagaki.g4e7dz-r6d-r10a-real-source-contained-cx-void-survey/1',
 'road':road,'sourceCXBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'sourceCX':18,'sourceB48':7,'sourceB51':28,'originalCameras':5,'gap52':True,
 'originalMeshesCompletelyUnchanged':True,'gridPositionsExamined':2*9*9*3,
 'originalCxVoidEmptyRealMeshAndContainingOpposingWalls':len(samples),
 'realNativeCameraVisibleEnclosedExistingCxVoidCandidates':len(sampledRoom),
 'topTenOriginalSpatialVoids':sampledRoom[:10],
 'topTenAllInternallyEnclosedButNotNecessarilyVisible':samples[:10],
 'entryFromExteriorPhysicallyProven':False,'exitWalkwayContinuityPhysicallyProven':False,
 'actualNewBlenderCityMeshes':0,'newGameColliders':0,'officialArt':0,'officialSlope2Metres':0,
 'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R10A_'+road+'_ORIGINAL_CX_VOID_SURVEY.json'),'w',encoding='utf8') as f:json.dump(data,f,indent=2,ensure_ascii=False)
print('R10A_SOURCE_INTERNAL_ROOM_SCAN',road,'grid',data['gridPositionsExamined'],
  'empty-enclosed',len(samples),'visible2frames',len(sampledRoom),'noSourceChanged')
