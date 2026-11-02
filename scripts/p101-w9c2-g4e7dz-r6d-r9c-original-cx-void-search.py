# R9C: find a REAL spatial 3D pocket attached to existing source CX floor.
# Rescues no unsafe R9B site by claiming a collision is okay. Test each
# 6x6m mesh volume, all four actual original floor corner rays and B48,
# B51 28×721 source envelopes. No art render before a real empty pocket.
import bpy,json,sys,os,math
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
argv=sys.argv[sys.argv.index('--')+1:]
def arg(k):assert k in argv,k;return argv[argv.index(k)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
r9a=json.load(open(arg('--r9a'),encoding='utf8'))
r9b=json.load(open(arg('--r9b'),encoding='utf8'))
native=json.load(open(arg('--native'),encoding='utf8'))
haz=json.load(open(arg('--hazards'),encoding='utf8'))
assert r9a['schema']=='dopagaki.g4e7dz-r6d-r9a-existing-cx-supported-footprint/1'
assert r9b['schema']=='dopagaki.g4e7dz-r6d-r9b-actual-footprint-physical-sample-gate/1'
assert native['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert haz['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
assert r9a['road']==r9b['road']==native['road']==haz['road']==road
assert r9a['sourceCXBlob']==r9b['sourceCXBlob']==native['sourceCXBlob']==haz['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert r9b['physicalGameRoadAndB51_721TickSampleClearCandidateCount']==0
bpy.ops.wm.open_mainfile(filepath=arg('--source'))
s=bpy.context.scene
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
b48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
b51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
prox=[o for o in bpy.data.objects if o.get('R1_B51_ID')]
oldcams=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
earlycams=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(cx),len(b48),len(b51),len(prox),len(oldcams.objects),len(earlycams.objects))==(18,7,28,28,5,8)
def sig():
 return (sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx),
 sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in b48),
 sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in b51))
before=sig()
def tree(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
 [tuple(f.vertices) for f in o.data.polygons],all_triangles=False)
static=[('CX',o,tree(o)) for o in cx]+[('B48',o,tree(o)) for o in b48]
byname={o.name:tree(o) for o in cx}
def testbox(center,half=3,ht=24):
 x,y,z=center
 v=[(x+dx,y+hh,z+dz) for hh in (.8,ht)
   for dx,dz in ((-half,-half),(-half,half),(half,half),(half,-half))]
 f=[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]
 return BVHTree.FromPolygons(v,f,all_triangles=False),v
def overlapAabb(v,bb,margin=3.0):
 return all(min(p[i] for p in v)-margin<=bb['max'][i]
   and bb['min'][i]<=max(p[i] for p in v)+margin for i in range(3))
early= native['frames'][:5]
cams={}
for fi,f in enumerate(early,1):
 s.frame_set(fi);bpy.context.view_layer.update()
 camera=oldcams.objects.get(f['id']+' REAL ORIGINAL 240HZ')
 if camera is None:camera=earlycams.objects.get('R1 '+f['id']+' SOURCE CAMERA')
 assert camera
 active={m['id'] for m in f['moving'] if m['enabled']}
 cams[f['id']]={'camera':camera,'movers':[('B51',o,tree(o)) for o in prox if o['R1_B51_ID'] in active]}
def directVisible(cam,target,trees):
 proj=world_to_camera_view(s,cam,target)
 if not(proj.z>0 and .055<proj.x<.945 and .06<proj.y<.94):return False
 r=target-cam.location
 for cat,ob,tr in trees:
  h,n,index,dist=tr.ray_cast(cam.location,r.normalized(),r.length-.3)
  if h is not None:return False
 return True
allCandidates=[]
for floor in r9a['topSourceFloorResearchFaces']:
 if floor['genuine8mPadCornersHavingSourceFloorWithin2_3m']!=4:continue
 if floor['longestConsecutiveEarlyCamerasWithVisibleMultiFloor']<2:continue
 originalCenter=Vector(floor['centerWorld'])
 floorBVH=byname[floor['existingCXMesh']]
 for dx in (-12,-8,-4,0,4,8,12):
  for dz in (-12,-8,-4,0,4,8,12):
   point=originalCenter+Vector((dx,0,dz))
   # A genuine source face: all 4 corners must be directly on selected polygon,
   # not another unrelated floor or an invented land surface.
   corners=[point+Vector((x,2,z)) for x in (-3,3) for z in (-3,3)]
   hitFaces=[]
   for p in corners:
    hit,n,index,dist=floorBVH.ray_cast(p,Vector((0,-1,0)),4)
    hitFaces.append((index,dist) if hit is not None and dist is not None else None)
   if not all(a is not None and a[0]==floor['faceIndex'] and .8<=a[1]<=2.3 for a in hitFaces):
    continue
   t,verts=testbox(point)
   staticOverlaps=[]
   for cat,obj,bvh in static:
    h=t.overlap(bvh)
    if h:staticOverlaps.append({'type':cat,'sourceObject':obj.name,'sourceTrianglePairs':len(h)})
   danger=[x['id'] for x in haz['hazards'] if x['sampledAabb'] and overlapAabb(verts,x['sampledAabb'])]
   ballMin=min(math.hypot(point.x-f['playerPosition'][0],point.z-f['playerPosition'][2]) for f in native['frames'])
   # independent true source 5 camera visibility of hypothetical room upper
   # part (centerline; building blocks itself after construction, art TBD)
   viewIDs=[]
   for key,frame in cams.items():
    camera=frame['camera']
    if any(directVisible(camera,point+Vector((0,h,0)),static+frame['movers']) for h in (8,18,25)):
     viewIDs.append(key)
   sourceClear=not staticOverlaps and not danger and ballMin>=24
   allCandidates.append({'originalCXMesh':floor['existingCXMesh'],'faceIndex':floor['faceIndex'],
    'centerWorld':[round(float(v),5) for v in point],
    'shiftX':dx,'shiftZ':dz,'sourceFourCornersSamePolygon':True,
    'originalStaticSourceIntersectionPairs':staticOverlaps,
    'B51_28Moving721TickSampleEnvelopeWarnings':danger,
    'minimumRealBallPlanarMetres':round(ballMin,3),
    'originalFiveCameraUnoccludedMultiFloorPoint':viewIDs,
    'room6x6x23mResearchSourceClear':sourceClear,
    'realExistingCxSourceEntranceCertified':False,
    'realLoadBearingCapacityCertified':False})
approved=[v for v in allCandidates if v['room6x6x23mResearchSourceClear'] and len(v['originalFiveCameraUnoccludedMultiFloorPoint'])>=2]
approved.sort(key=lambda v:(-len(v['originalFiveCameraUnoccludedMultiFloorPoint']),
 math.hypot(v['shiftX'],v['shiftZ'])))
best=approved[0] if approved else None
assert before==sig()
report={'schema':'dopagaki.g4e7dz-r6d-r9c-original-floor-void-grid-search/1',
 'road':road,'sourceCXBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'sourcePreservedCX18B48_7B51_28':True,
 'r9bOriginalZeroClearCandidates':True,
 'originalCxFloorSamePolygonPadCentersTested':len(allCandidates),
 'realExistingFloorSpatialPocketCandidates':len(approved),
 'bestRealSourceResearchPocket':best,
 'top12ClearPhysicalVolumeCandidates':approved[:12],
 'first15BlockedVolumeCandidates':[x for x in allCandidates if not x['room6x6x23mResearchSourceClear']][:15],
 'researchFootprintMetres':[6,6,23.2],
 'sourceCameraEarly5FramePeriod':'11_13_SECONDS',
 'geometryTrueRoadAndB51EnvelopesPreliminarilyClear':bool(best),
 'newGameArchitectureActuallyBuilt':False,
 'cityLivingFunctionActuallyVerified':False,
 'originalCxHumanEntryAccessCertified':False,
 'safeStructuralLoadBearingCertified':False,
 'preModelNextAction':'ONE_SMALL_EDITABLE_BLENDER_COURT_STUDY_ONLY' if best else 'STOP_NO_TRUE_SOURCE_3D_POCKET_FOUND',
 'newBlenderCityMeshes':0,'newGameColliders':0,'officialArt':0,'officialSlope2Meters':0,
 'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R9C_'+road+'_TRUE_CX_ORIGINAL_3D_POCKET.json'),'w',encoding='utf8') as f:json.dump(report,f,indent=2,ensure_ascii=False)
print('R9C_ACTUAL_SOURCE_POCKET_GRID',road,'tested',len(allCandidates),'physical safe',len(approved),
 'best',best['centerWorld'] if best else 'NONE','ART HOLD')
