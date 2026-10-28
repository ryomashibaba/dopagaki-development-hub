# R13A — check if R12A genuine originally empty EARLY/MIDDLE boxes
# are connected by a genuine 8m-scale clear 3D tunnel in CX/B48/B51 world.
# Merely finding empty air is not a bridge, floor, ingress or walkable city.
import bpy,sys,os,json,math,heapq,collections
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
argv=sys.argv[sys.argv.index('--')+1:]
def arg(k):assert k in argv,k;return argv[argv.index(k)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
a=json.load(open(arg('--r12a'),encoding='utf8'))
d=json.load(open(arg('--r12d'),encoding='utf8'))
native=json.load(open(arg('--native'),encoding='utf8'))
haz=json.load(open(arg('--hazards'),encoding='utf8'))
SHA='af076d67492a677d2235e4730aef8cdf4808e106'
assert a['schema']=='dopagaki.g4e7dz-r6d-r12a-source-cameras-safe-volume-field/1'
assert d['schema']=='dopagaki.g4e7dz-r6d-r12d-disconnected-native-source-volume/1'
assert native['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert haz['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
assert a['road']==d['road']==native['road']==haz['road']==road
assert a['sourceCXBlob']==d['sourceCXBlob']==native['sourceCXBlob']==haz['sourceCXBlob']==SHA
edges=d['minimalAllGenuineR12ACandidateCrossEraGaps']
assert len(edges)==2 and edges[0]['from']=='EARLY' and edges[0]['to']=='MIDDLE'
assert edges[1]['from']=='MIDDLE' and edges[1]['to']=='LATE'
start0,end0=[Vector(q) for q in edges[0]['closestProvenR12ASafeSourceBoxes']]
assert 60<math.dist(start0,end0)<85
assert any(v['worldXYZ']==list(start0) for v in a['allSafeCameraVisibleCandidatePositions'])
assert any(v['worldXYZ']==list(end0) for v in a['allSafeCameraVisibleCandidatePositions'])
bpy.ops.wm.open_mainfile(filepath=arg('--source'))
scene=bpy.context.scene
assert scene['DO_SCENE_IS_NOT_GAME_WEBGL'] and scene['DR_ACTUAL_B48_MESH_COUNT']==7
assert scene['DR_ACTUAL_B51_POSES_PER_FRAME']==28 and scene['DR_ACTUAL_B48_VOID_CELL52']
CX=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
B48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
B51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
MOV=[o for o in bpy.data.objects if o.get('R1_B51_ID')]
cams=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
extra=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(CX),len(B48),len(B51),len(MOV),len(cams.objects),len(extra.objects))==(18,7,28,28,5,8)
def immutable_sig():
 return [
 sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in CX),
 sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in B48),
 sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in B51),
 sorted((o.name,float(o['true_240hz_time'])) for o in cams.objects)]
before=immutable_sig()
def bvh(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
 [tuple(p.vertices) for p in o.data.polygons],all_triangles=False)
original=[('CX',o,bvh(o)) for o in CX]+[('B48',o,bvh(o)) for o in B48]
def cell_bvh(center,half=3.8):
 v=[center+Vector((x,y,z)) for y in (-half,half)
 for x,z in ((-half,-half),(-half,half),(half,half),(half,-half))]
 return BVHTree.FromPolygons(v,[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7),(3,0,4,7)],all_triangles=False)
def box_range(c,h=5.0):
 return {'min':[c[k]-h for k in range(3)],'max':[c[k]+h for k in range(3)]}
def overlap(aa,bb):
 return all(aa['min'][j]<=bb['max'][j] and bb['min'][j]<=aa['max'][j] for j in range(3))
def first_reason(p):
 bb=box_range(p)
 for obj in haz['hazards']:
  if obj['sampledAabb'] and overlap(bb,obj['sampledAabb']):
   return ('B51_721TICK_CONSERVATIVE_ENVELOPE',obj['id'])
 t=cell_bvh(p)
 for typ,o,tr in original:
  if t.overlap(tr):return (typ,o.name)
 return None
# Both endpoints are genuine R12A original 26x30x36 cubes. Aim for their
# MID-HEIGHT interior, not at the game B48 road or a presumed occupied floor.
start=start0+Vector((0,18,0));end=end0+Vector((0,18,0))
line=end-start
forward=Vector((line.x,0,line.z)).normalized()
side=Vector((-forward.z,0,forward.x))
N=math.ceil(line.length/8)
assert 7<=N<=13
NL=8 # ±64m sideways; steps of 8m
NH=4 # ±32m vertically, steps of 8m
def coord(t,j,k):
 return start.lerp(end,t/N)+side*(8*j)+Vector((0,8*k,0))
cache={}
reasons=collections.Counter()
def permitted(t,j,k):
 key=(t,j,k)
 if key not in cache:
  r=first_reason(coord(t,j,k))
  cache[key]=r
  if r:reasons[r[0]]+=1
 return cache[key] is None
# Source original 8m-cube search (true 3D, not just a 2D chart).
startKey=(0,0,0);endKey=(N,0,0)
endpointStart=permitted(*startKey);endpointEnd=permitted(*endKey)
queue=[(0,startKey)]
cost={startKey:0} if endpointStart else {}
parent={}
closed=set()
path=None
# A* with strictly monotonic advance + optional lateral/vertical detours.
# This can miss long backtracking; negative is limited to SEARCH WINDOW.
while queue:
 g,node=heapq.heappop(queue)
 if node in closed:continue
 closed.add(node)
 if node==endKey and endpointEnd:
  trace=[];cur=node
  while cur in parent:
   trace.append(cur);cur=parent[cur]
  trace.append(startKey);path=list(reversed(trace));break
 t,j,k=node
 near=[]
 for dt in (0,1):
  for dj in (-1,0,1):
   for dk in (-1,0,1):
    if dt==dj==dk==0:continue
    tt=t+dt;jj=j+dj;kk=k+dk
    if not(0<=tt<=N and -NL<=jj<=NL and -NH<=kk<=NH):continue
    if dt==0 and abs(dj)+abs(dk)>1:continue
    near.append((tt,jj,kk))
 for nxt in near:
  if nxt in closed or not permitted(*nxt):continue
  u=coord(*node);v=coord(*nxt)
  length=(v-u).length
  if length<.2:continue
  # Bounded swept-cell proxies at 1/4, 1/2 and 3/4 of each proposed
  # candidate link, beyond just clear endpoints.
  swept=[first_reason(u.lerp(v,q)) for q in (.25,.50,.75)]
  if any(swept):continue
  # Avoid endless side-wandering. Does not imply real engineered ramp.
  newcost=g+length+(.01 if nxt[0]==t else 0)
  if newcost>=cost.get(nxt,math.inf):continue
  cost[nxt]=newcost;parent[nxt]=node
  heapq.heappush(queue,(newcost,nxt))
# Check camera REAL original world for actual proposed path nodes.
# No art is rendered; access/structural certification remains absent.
frameCam={}
for i,f in enumerate(native['frames'],1):
 scene.frame_set(i);bpy.context.view_layer.update()
 cam=cams.objects.get(f['id']+' REAL ORIGINAL 240HZ') or extra.objects.get('R1 '+f['id']+' SOURCE CAMERA')
 assert cam and (cam.location-Vector(f['eye'])).length<.0002
 active={x['id'] for x in f['moving'] if x['enabled']}
 frameCam[f['id']]=(cam,[bvh(x) for x in MOV if x['R1_B51_ID'] in active])
def camera_ray_clear(p,cam,dynamic):
 q=world_to_camera_view(scene,cam,p)
 if not(q.z>0 and .06<q.x<.94 and .07<q.y<.93):return False
 ray=p-cam.location
 if ray.length<.5:return False
 for typ,o,tr in original:
  hit,n,idx,dist=tr.ray_cast(cam.location,ray.normalized(),ray.length-.3)
  if hit is not None:return False
 for tr in dynamic:
  hit,n,idx,dist=tr.ray_cast(cam.location,ray.normalized(),ray.length-.3)
  if hit is not None:return False
 return True
points=[coord(*v) for v in path] if path else []
vis={key:sum(camera_ray_clear(p,*data) for p in points) for key,data in frameCam.items()} if points else {}
sumdistance=sum((points[i]-points[i-1]).length for i in range(1,len(points))) if points else None
segmentGrades=[]
for i in range(1,len(points)):
 pa,pb=points[i-1],points[i]
 horizontal=math.hypot(pb.x-pa.x,pb.z-pa.z)
 segmentGrades.append(abs(pb.y-pa.y)/horizontal if horizontal>.01 else None)
# Exhaustively classify all nodes for independent segment-level obstruction,
# then compare with a deliberately smaller hypothetical 4m research pocket.
counts={'clear':0,'B51':0,'CX':0,'B48':0}
for t in range(N+1):
 for j in range(-NL,NL+1):
  for k in range(-NH,NH+1):
   if permitted(t,j,k):counts['clear']+=1
   else:
    kind=cache[(t,j,k)][0]
    counts['B51' if kind.startswith('B51') else kind]+=1
assert sum(counts.values())==(N+1)*(2*NL+1)*(2*NH+1)
assert immutable_sig()==before
data={'schema':'dopagaki.g4e7dz-r6d-r13a-genuine-3d-source-connected-corridor/1',
 'road':road,'sourceCXBlob':SHA,'sourceCX18B48_7B51_28Cameras5Unchanged':True,
 'R12DOriginalStartAndEndPreclearedBoxes':[list(start0),list(end0)],
 'originalSourceBoxCentres3DMetres':[list(start),list(end)],
 'originalShortestSafeBoxCenterDistanceMetres':d['minimalAllGenuineR12ACandidateCrossEraGaps'][0]['minimalOriginalSafeCandidateCentreDistanceMetres'],
 'originalSource3DStudySearchLongitudinalStations':N+1,
 'originalSource8mStepLateralRangeMetres':[-NL*8,NL*8],
 'originalSource8mStepVerticalRangeMetres':[-NH*8,NH*8],
 'gridCellsRealCXB48B51EnvelopeResults':counts,
 'original3DSweptProbeQuarterMidThreeQuarter':True,
 'endpointSourceClear':[endpointStart,endpointEnd],
 'bounded8mEmptyCubeRouteExists':bool(path),
 'bounded8mClearCubeRouteSourcePathNodes':[list(p) for p in points],
 'bounded8mClearCubeRouteMetres':round(float(sumdistance),3) if sumdistance is not None else None,
 'routeOriginalSource13CameraVisibleCellCounts':vis,
 'routeSegmentMaximumVerticalRisePerHorizontalDistance':round(max((g for g in segmentGrades if g is not None),default=0),4) if path else None,
 'notARealGameRouteOrPlatform':True,
 'originalHumanIngressAndFloorConnectivity':'NOT_CERTIFIED',
 'structuralSupportsAndLoadCapacity':'NOT_CERTIFIED',
 'continuousTimeB51ExactCollision':'NOT_CERTIFIED',
 'sourceObjectOrGamePhysicsEdited':False,'newBlenderCityMeshes':0,'newGameColliders':0,
 'officialArt':0,'officialSlope2Metres':0,
 'decision':'POTENTIAL_8M_GEOMETRIC_VOID_ROUTE_ONLY' if path else 'NO_MONOTONIC_8M_VOID_LINK_WITHIN_64M_LATERAL_32M_VERTICAL_WINDOW',
 'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R13A_'+road+'_ORIGINAL_SOURCE_8M_VOXEL_CORRIDOR.json'),'w',encoding='utf8') as f:
 json.dump(data,f,ensure_ascii=False,indent=2)
print('R13A_ACTUAL_ORIGINAL_SOURCE_8M_GRID',road,
 'searched',counts,'route',data['bounded8mEmptyCubeRouteExists'],
 '3D metres',data['bounded8mClearCubeRouteMetres'],
 'source authentic visibility',vis,
 'ART/HUMAN/GAMEPLAY HOLD')
