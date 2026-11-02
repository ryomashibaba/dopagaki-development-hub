# R13B real 3D original CX/B48 and B51 all28-wide-volume/floor study.
# Draw source-visible cyan volume ONLY FOR DEBUG; NEVER game or ART adoption.
import bpy,json,sys,os,math
from mathutils import Vector
from mathutils.bvhtree import BVHTree
a=sys.argv[sys.argv.index('--')+1:]
def arg(k):assert k in a,k;return a[a.index(k)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
native=json.load(open(arg('--native'),encoding='utf8'))
haz=json.load(open(arg('--hazards'),encoding='utf8'))
r13=json.load(open(arg('--r13a'),encoding='utf8'))
SHA='af076d67492a677d2235e4730aef8cdf4808e106'
assert native['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert haz['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
assert r13['schema']=='dopagaki.g4e7dz-r6d-r13a-genuine-3d-source-connected-corridor/1'
assert road==native['road']==haz['road']==r13['road']
assert native['sourceCXBlob']==haz['sourceCXBlob']==r13['sourceCXBlob']==SHA
assert r13['bounded8mEmptyCubeRouteExists'] and r13['original3DSweptProbeQuarterMidThreeQuarter']
p=[Vector(c) for c in r13['bounded8mClearCubeRouteSourcePathNodes']]
assert len(p)>=8
bpy.ops.wm.open_mainfile(filepath=arg('--source'))
s=bpy.context.scene
assert s['DO_SCENE_IS_NOT_GAME_WEBGL'] and s['DR_ACTUAL_B48_MESH_COUNT']==7 and s['DR_ACTUAL_B51_POSES_PER_FRAME']==28
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
roads=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
b51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
cams=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
ex=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(cx),len(roads),len(b51),len(cams.objects),len(ex.objects))==(18,7,28,5,8)
def sig():
 return (sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx),
 sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in roads),
 sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in b51),
 sorted((o.name,float(o['true_240hz_time'])) for o in cams.objects))
before=sig()
def bvh(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
 [tuple(f.vertices) for f in o.data.polygons],all_triangles=False)
orig=[('CX',o,bvh(o)) for o in cx]+[('B48',o,bvh(o)) for o in roads]
def cube(c,halfHorizontal,halfVertical):
 v=[c+Vector((dx,dy,dz)) for dy in (-halfVertical,halfVertical)
 for dx,dz in ((-halfHorizontal,-halfHorizontal),(-halfHorizontal,halfHorizontal),
               (halfHorizontal,halfHorizontal),(halfHorizontal,-halfHorizontal))]
 return BVHTree.FromPolygons(v,
  [(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7),(3,0,4,7)],all_triangles=False),v
def overlaps(a,b):
 return all(a['min'][j]<=b['max'][j] and b['min'][j]<=a['max'][j] for j in range(3))
def bounds(v,buffer=1.2):
 return {'min':[min(x[j] for x in v)-buffer for j in range(3)],
 'max':[max(x[j] for x in v)+buffer for j in range(3)]}
def verify_volume(center,w,h):
 t,v=cube(center,w/2,h/2)
 interference=[]
 for typ,obj,tr in orig:
  if t.overlap(tr):interference.append(typ)
 bb=bounds(v)
 obstacle=[q['id'] for q in haz['hazards'] if q['sampledAabb'] and overlaps(bb,q['sampledAabb'])]
 return (not interference and not obstacle),sorted(set(interference)),obstacle
# Distinguish route width from real floor-support geometries; require every
# 1/4, 1/2, 3/4 segment for large-volume geometry, never only path nodes.
sampleSites=list(p)
for aa,bb in zip(p,p[1:]):
 sampleSites.extend(aa.lerp(bb,t) for t in (.25,.5,.75))
sizes=((8,8),(12,10),(16,12),(24,16),(32,20))
cross=[]
for w,h in sizes:
 results=[]
 for idx,point in enumerate(sampleSites):
  clear,sourceObstacle,movers=verify_volume(point,w,h)
  results.append({'sample':idx,'clear':clear,'originalCXOrB48Hits':sourceObstacle,
   'all28B51Original721TickBoxHits':movers})
 cross.append({'horizontalSourceVolumeWidthMetres':w,'verticalSourceVolumeHeightMetres':h,
  '3DVolumesSampledIncludingQuarterStep':len(results),
  'originalWorldClearVolumes':sum(q['clear'] for q in results),
  'wholeSourcePolylineWideVolumeClear':all(q['clear'] for q in results),
  'firstTenFailedProbes':[q for q in results if not q['clear']][:10]})
# The concept is a city that reads as a giant deep public street. Even
# an empty 8m hallway is NOT that. Need original view and enough width.
sourceFloors=[]
for i,point in enumerate(p):
 best=None
 for typ,o,tr in orig:
  hit,n,index,d=tr.ray_cast(point,Vector((0,-1,0)),240)
  if hit is None or n.y<.7:continue
  if best is None or d<best['depthFromCandidateCenterMetres']:
   best={'sourceType':typ,'sourceObject':o.name,'world':[float(x) for x in hit],
    'depthFromCandidateCenterMetres':round(float(d),3),
    'originalFaceNormalY':round(float(n.y),3)}
 sourceFloors.append({'segmentNode':i,'actualExistingDownwardFloor':best,
  'realOriginalSourceFloorWithin12m':bool(best and best['depthFromCandidateCenterMetres']<=12),
  'existingSourceSupportsNewStructureCertified':False})
# Test grade as a spatial route hypothesis, not official accessibility norm.
grade=r13['routeSegmentMaximumVerticalRisePerHorizontalDistance']
assert .15<grade<.25
# Create diagnostic only: 8m path as a collection of cyan shell volumes
# identifying what source study actually found, not a public structure.
coll=bpy.data.collections.new('R13B_CYAN_OUTLINE_ONLY_EMPTY_AIR_NOT_A_BRIDGE')
s.collection.children.link(coll)
mat=bpy.data.materials.new('R13B ghost source-empty 8m research only')
mat.diffuse_color=(.08,.8,1.0,.3);mat.use_nodes=True
shader=mat.node_tree.nodes.get('Principled BSDF')
shader.inputs['Base Color'].default_value=(.02,.75,1,1)
shader.inputs['Roughness'].default_value=.42
shader.inputs['Metallic'].default_value=.2
# Edge framing only, NOT a solid bridge floor. Cyan 3D cuboids at source
# geometry path samples support human image QA of time consistency.
def edgebox(point,i):
 half=3.8
 offsets=[Vector((dx,dy,dz)) for dy in (-half,half)
   for dx,dz in ((-half,-half),(-half,half),(half,half),(half,-half))]
 # only twelve tube-like corner connectors, never an 'accessible deck'
 edges=[(0,1),(1,2),(2,3),(3,0),(4,5),(5,6),(6,7),(7,4),(0,4),(1,5),(2,6),(3,7)]
 objects=[]
 for j,(a,b) in enumerate(edges):
  src=point+offsets[a];dst=point+offsets[b]
  mid=(src+dst)*.5
  bpy.ops.mesh.primitive_cube_add(size=1,location=mid)
  obj=bpy.context.object
  # unlink from default scene collection, link to study collection
  for c in list(obj.users_collection):c.objects.unlink(obj)
  coll.objects.link(obj)
  delta=dst-src;obj.rotation_mode='QUATERNION'
  obj.rotation_quaternion=Vector((0,0,1)).rotation_difference(delta.normalized())
  obj.scale=(.17,.17,delta.length)
  obj.data.materials.append(mat)
  obj.name='R13B SOURCE EMPTY SPACE ONLY '+str(i)+' edge '+str(j)
  obj['R13B_NOT_A_BRIDGE_OR_GAME_ASSET']=True
  objects.append(obj)
 return objects
research=[]
for i,q in enumerate(p):
 research+=edgebox(q,i)
assert sig()==before
# Original source R1 7 time cameras. No new game camera.
s['R13B_DEBUG_GHOST_NOT_A_CITY']=True
s['R13B_ORIGINAL_GAME_ASSETS_UNCHANGED']=True
s['R13B_CITY_ART']='HOLD'
s['R13B_NEW_GAME_COLLIDERS']=0
s.cycles.device='CPU';s.cycles.samples=4;s.cycles.use_denoising=False
s.render.image_settings.file_format='PNG'
s.render.threads_mode='FIXED';s.render.threads=2
s.frame_set(1)
editable='R13B_'+road+'_REAL_EMPTY_AIR_CYAN_DEBUG_NOT_A_CITY_EDITABLE.blend'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,editable))
frames={f['id']:(i+1,f) for i,f in enumerate(native['frames'])}
renders=[]
for key in ('t1100','t1200','t1300','t1400','t1500','t1600','t1700'):
 fi,f=frames[key];s.frame_set(fi)
 cam=cams.objects.get(key+' REAL ORIGINAL 240HZ') or ex.objects.get('R1 '+key+' SOURCE CAMERA')
 assert cam and (cam.location-Vector(f['eye'])).length<.0002
 s.camera=cam
 filename='R13B_'+road+'_'+key+'_TRUE_NATIVE_CAMERA_EMPTY_AIR_DEBUG_NOT_GAME.png'
 s.render.filepath=os.path.join(out,filename)
 bpy.ops.render.render(write_still=True)
 renders.append(filename)
assert sig()==before
data={'schema':'dopagaki.g4e7dz-r6d-r13b-true-original-expanded-3d-width-and-support/1',
 'road':road,'sourceCXBlob':SHA,'sourceCX18B48_7B51_28Cameras5Unchanged':True,
 'R13AOriginalSource8mRouteWasGenuinelyClear':True,
 'originalSource3DProbesAlongPath':len(sampleSites),
 'real3DSafeWidthComparisons':cross,
 'genuineOriginalSourceFloorDownwardProbes':sourceFloors,
 'existingFloorWithin12mSamples':sum(x['realOriginalSourceFloorWithin12m'] for x in sourceFloors),
 'original8mCorridorProposedGrade':grade,
 'all28B51_721SampledAabbUsed':True,
 'realPublicBridgeOrHumanWalkwayExists':False,
 'structuralSupportsBuiltAndCertified':False,
 'originalNativeSource7CameraDiagnosticPNG':renders,'editableOriginalBlenderDiagnostic':editable,
 'diagnosticCyanMeshesNotCityArt':len(research),
 'nextStep':'FIRST_ESTABLISH_LARGE_VISIBLE_SUPPORTED_TRUE_CITY_CORRIDOR_BEFORE_REAL_ART',
 'originalGameSourceChanged':False,
 'newGameColliders':0,'officialArt':0,'officialSlope2Metres':0,
 'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R13B_'+road+'_ORIGINAL_3D_WIDTH_AND_FOOTINGS.json'),'w',encoding='utf8') as f:
 json.dump(data,f,ensure_ascii=False,indent=2)
print('R13B_REAL_SOURCE_OPEN_AIR_DIAGNOSTIC',road,
 [(x['horizontalSourceVolumeWidthMetres'],x['originalWorldClearVolumes'],x['3DVolumesSampledIncludingQuarterStep']) for x in cross],
 'support under12m',data['existingFloorWithin12mSamples'],'of',len(p),
 'grade',grade,'7 real native camera frames, no game or art adoption')
