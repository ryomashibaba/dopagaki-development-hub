"""R15D — original two-road 3D detour A* with conservative swept clearance.

Actual source CX/B48 triangles, vertex-containment witness and all 28 B51
721-tick AABBs; world positions shared between both originals. This studies
only empty space, NOT a built transit floor, ingress, HUMAN or ART pass.
"""
import bpy,sys,os,json,math,heapq,collections
from mathutils import Vector
from mathutils.bvhtree import BVHTree

a=sys.argv[sys.argv.index('--')+1:]
def arg(key):
 assert key in a,key
 return a[a.index(key)+1]
out=arg('--out');os.makedirs(out,exist_ok=True)
SHA='af076d67492a677d2235e4730aef8cdf4808e106'
ROADS=('true-pinch','pinch-switch')
r15c=json.load(open(arg('--r15c'),encoding='utf8'))
assert r15c['schema']=='dopagaki.r15c-both-original-native-source-safety-camera-macro-domain/1'
assert r15c['sourceGameBlob']==SHA and r15c['sourceGameUnchanged']
assert r15c['R15CNewGeometryScaleTests']==66 and r15c['bothVariantsEligibleCount']==16
hz={r:json.load(open(arg('--hazards-'+r),encoding='utf8')) for r in ROADS}
native={r:json.load(open(arg('--native-'+r),encoding='utf8')) for r in ROADS}
for road in ROADS:
 assert hz[road]['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
 assert native[road]['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
 assert hz[road]['sourceCXBlob']==native[road]['sourceCXBlob']==SHA
 assert hz[road]['road']==native[road]['road']==road
 assert len(hz[road]['hazards'])==28 and len(native[road]['frames'])==13

eligible={e['id']:e for e in r15c['bothVariantsCameraAndSourceSafeTwoSecondEquivalentHazardNoObstructionEligible']}
pairs=[
 ('E_M1','E03:R14B_REFERENCE','M01:R14B_REFERENCE'),
 ('M1_M2','M01:R14B_REFERENCE','M02:R14B_REFERENCE'),
 ('M2_L','M02:R14B_REFERENCE','L03:R14B_REFERENCE'),
 ('E_M2_ALT','E03:R14B_REFERENCE','M02:R14B_REFERENCE')]
for label,a,b in pairs:
 assert a in eligible and b in eligible,(label,a,b)
 for name in (a,b):
  e=eligible[name]
  assert e['originalCXB48TriangleEvidenceClearBoth']
  assert e['all28OriginalB51Conservative721TickAABBDoesNotOverlapBoth']
assert len(pairs)==4

def bvh(v,faces):
 return BVHTree.FromPolygons([tuple(q) for q in v],faces,all_triangles=False)
def bounds(v):
 return {'min':[min(q[i] for q in v) for i in range(3)],
         'max':[max(q[i] for q in v) for i in range(3)]}
def overlap(a,b):
 return all(a['min'][i]<=b['max'][i] and b['min'][i]<=a['max'][i] for i in range(3))
def containment(lo,hi,p):
 return all(lo[i]<=p[i]<=hi[i] for i in range(3))
def cube(a,b,half):
 lo=tuple(min(a[i],b[i])-half for i in range(3))
 hi=tuple(max(a[i],b[i])+half for i in range(3))
 vertices=[Vector((x,y,z)) for y in (lo[1],hi[1])
  for x,z in ((lo[0],lo[2]),(lo[0],hi[2]),(hi[0],hi[2]),(hi[0],lo[2]))]
 faces=[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7),(3,0,4,7)]
 return lo,hi,bvh(vertices,faces)

sources={}
for road in ROADS:
 bpy.ops.wm.open_mainfile(filepath=arg('--source-'+road))
 scene=bpy.context.scene
 assert scene['DO_SCENE_IS_NOT_GAME_WEBGL'] and scene['DR_ACTUAL_B48_VOID_CELL52']
 assert scene['DR_ACTUAL_B48_MESH_COUNT']==7 and scene['DR_ACTUAL_B51_POSES_PER_FRAME']==28
 cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
 roadObjs=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
 moverSources=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
 cameras=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
 assert (len(cx),len(roadObjs),len(moverSources),len(cameras.objects))==(18,7,28,5)
 before=(sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx),
  sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in roadObjs),
  sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in moverSources))
 original=[]
 for typ,group in (('CX',cx),('B48',roadObjs)):
  for o in group:
   verts=[o.matrix_world@q.co for q in o.data.vertices]
   original.append((typ,o.name,bvh(verts,[tuple(f.vertices) for f in o.data.polygons]),bounds(verts),verts))
 after=(sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx),
  sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in roadObjs),
  sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in moverSources))
 assert before==after
 sources[road]={
  'triangles':original,
  'movingAABBs':[h['sampledAabb'] for h in hz[road]['hazards'] if h['sampledAabb']]}
# The BVHTree instances were constructed from COPY of world vertices and
# faces, not Blender object pointers: both original worlds remain distinct.

stat=collections.Counter()
volcache={}
def clear_volume(start,end,width):
 # Volume is the conservative AABB swept over the ENTIRE edge, not just
 # 7 or 3 point samples. A failed volume could be a false negative; a
 # pass implies no source SURFACE intersects the swept AABB at this time.
 # AABB of a diagonal edge overapproximates real circular swept tube.
 lo,hi,bt=cube(start,end,width*.5)
 key=(tuple(round(q,3) for q in lo),tuple(round(q,3) for q in hi))
 if key in volcache:
  stat['memoHits']+=1
  return volcache[key]
 stat['uniqueOriginalWorldSweptVolumes']+=1
 bb={'min':lo,'max':hi}
 reasons={}
 for road in ROADS:
  world=sources[road]
  hazard=sum(overlap(bb,x) for x in world['movingAABBs'])
  if hazard:
   reasons[road]={'safe':False,'type':'B51_721_CONSERVATIVE','hits':hazard}
   continue
  failure=None
  for kind,name,tr,b,v in world['triangles']:
   if not overlap(bb,b):continue
   overlaps=tr.overlap(bt)
   if overlaps:
    failure={'safe':False,'type':kind+'_ORIGINAL_TRIANGLES','name':name,'hits':len(overlaps)}
    break
   # BVH overlap cannot detect original fully enclosed surfaces.
   if any(containment(lo,hi,p) for p in v):
    failure={'safe':False,'type':kind+'_SOURCE_VERTEX_CONTAINED','name':name,'hits':1}
    break
  reasons[road]=failure or {'safe':True,'type':'CLEAR','hits':0}
 safe=all(x['safe'] for x in reasons.values())
 stat['conservativeWorldSafe' if safe else 'conservativeWorldBlocked']+=1
 for road in ROADS:
  if not reasons[road]['safe']:stat[road+'_'+reasons[road]['type']]+=1
 volcache[key]=(safe,reasons)
 return safe,reasons

WIDTHS=(8,12)
results=[]
for label,first,last in pairs:
 a=eligible[first];b=eligible[last]
 start=Vector(a['worldXYZ'])+Vector((0,a['volumeDimensionsMetres'][2]*.46,0))
 end=Vector(b['worldXYZ'])+Vector((0,b['volumeDimensionsMetres'][2]*.46,0))
 length=(end-start).length
 forward=end-start;forward.y=0;forward.normalize()
 lateral=Vector((-forward.z,0,forward.x))
 N=max(4,int(math.ceil(length/12)))
 LAT=7;VERT=4;STEP=12
 def world(key):
  t,j,k=key
  return start.lerp(end,t/N)+lateral*(STEP*j)+Vector((0,STEP*k,0))
 total=(N+1)*(2*LAT+1)*(2*VERT+1)
 for width in WIDTHS:
  oknodes={}
  reasons=collections.Counter()
  edgeCounter=collections.Counter()
  def valid(node):
   if node not in oknodes:
    p=world(node);good,why=clear_volume(p,p,width)
    oknodes[node]=good
    if not good:
     for road in ROADS:
      if not why[road]['safe']:reasons[road+' '+why[road]['type']]+=1
   return oknodes[node]
  startkey=(0,0,0);endkey=(N,0,0)
  startOk=valid(startkey);endOk=valid(endkey)
  heap=[]
  best={}
  parent={}
  if startOk and endOk:
   best[startkey]=0.0
   heap=[(length,startkey)]
  expansions=0
  neighbors=[(dt,dj,dk) for dt in (0,1)
   for dj in (-1,0,1) for dk in (-1,0,1) if (dt,dj,dk)!=(0,0,0)]
  path=None
  while heap:
   est,cur=heapq.heappop(heap)
   if est>best[cur]+(world(endkey)-world(cur)).length+.001:continue
   expansions+=1
   if cur==endkey:
    trace=[cur]
    while trace[-1]!=startkey:trace.append(parent[trace[-1]])
    path=list(reversed(trace));break
   t,j,k=cur
   for dt,dj,dk in neighbors:
    nxt=(t+dt,j+dj,k+dk)
    if not(0<=nxt[0]<=N and -LAT<=nxt[1]<=LAT and -VERT<=nxt[2]<=VERT):continue
    if not valid(nxt):continue
    p=world(cur);q=world(nxt)
    swept,why=clear_volume(p,q,width)
    if not swept:
     edgeCounter['sweptBlocked']+=1
     continue
    edgeCounter['sweptClear']+=1
    distance=(p-q).length
    if distance<.5:continue
    newcost=best[cur]+distance+(0.25 if dt==0 else 0)
    if newcost<best.get(nxt,math.inf)-1e-5:
     best[nxt]=newcost;parent[nxt]=cur
     heapq.heappush(heap,(newcost+(world(endkey)-q).length,nxt))
  points=[list(world(x)) for x in path] if path else []
  sweptproof=[]
  if path:
   for x,y in zip(path,path[1:]):
    safe,why=clear_volume(world(x),world(y),width)
    assert safe and all(why[r]['safe'] for r in ROADS)
    sweptproof.append({'fromGrid':list(x),'toGrid':list(y),
     'sourceTwoRoadsRealSweptAABB':why,'researchAxisAlignedTubeWidthMetres':width})
  if path:
   dist=sum(math.dist(p,q) for p,q in zip(points,points[1:]))
  else:dist=None
  record={
   'pair':label,'fromCandidate':first,'toCandidate':last,'sourceOriginalStraightDistanceMetres':round(length,3),
   'volumeWidthMetres':width,'searchedOriginalWorldGridN':N,
   'lateralOffsetLimitMetres':LAT*STEP,'verticalOffsetLimitMetres':VERT*STEP,
   'searchNodesTotalBounded':total,'startNodeSourceClearBoth':startOk,
   'endNodeSourceClearBoth':endOk,
   'nodesActuallySourceInspected':len(oknodes),
   'nodesSafeInBothOriginalWorlds':sum(oknodes.values()),
   'originalGridSourceCollisionReasonsObserved':dict(reasons),
   'AStarExpandedNodeCount':expansions,
   'sweptOriginalSourceEdgeCounters':dict(edgeCounter),
   'conservativeSWEPT_OriginalWorldSafeRouteExists':bool(path),
   'routeWorldXYZ':points,
   'routeGridNodes':[list(x) for x in path] if path else [],
   'trueConservativeSweptProofEachEdge':sweptproof,
   'sourceRouteLengthMetres':round(dist,3) if dist is not None else None,
   'realHumanPublicWalkwayBuilt':False,'actualStructuralSupportCertified':False,
   'original13NativeCameraAllRouteSegmentsVisibleCertified':False,
   'continuousTimeB51ContactCertified':False,'trueBrowserWebGLGameTested':False}
  results.append(record)
  print('R15D_TWO_ORIGINAL_WORLDS_SWEPT_ASTAR',label,'width',width,'grid',total,
    'nodesInspected',len(oknodes),'expanded',expansions,
    'path',len(points),'routeMetres',record['sourceRouteLengthMetres'],flush=True)
print('R15D_SOURCE_BVH_COUNTERS',dict(stat),flush=True)
assert len(results)==len(pairs)*len(WIDTHS)
output={'schema':'dopagaki.r15d-two-original-world-nonstraight-conservative-swept-a-star/1',
 'sourceCXBlob':SHA,'sourceWorldOriginalCX18B48_7B51_28Cameras5Unchanged':True,
 'R15CEligibleProvenSourceWorldSites':16,
 'R15COriginalSourceWorldAuditedVolumeConditions':66,
 'twoRoadsSameExactWorldCoordinates':True,
 'originalB51All28Each721TickConservativeAABBChecked':True,
 'researchRequestedSizesMetres':list(WIDTHS),
 'researchSelectedBackboneOriginalSourceAnchors':pairs,
 'researchWorldNonStraightDetours4CandidatePairs':results,
 'counts':dict(stat),
 'allTwoRoadConservativeSourceSweptRoutesFound':sum(q['conservativeSWEPT_OriginalWorldSafeRouteExists'] for q in results),
 'sourceWorldGridBoundedNotGlobalImpossibilityProof':True,
 'sweptAABBConservativeOverApproximationNotActualFineRouteMesh':True,
 'actualHumanWalkwayContinuousFloorCertified':False,
 'structuralSupportOrIngressCertified':False,
 'originalSource13CameraTrueWebGLVisibilityCertified':False,
 'genuineGameArchitectureOrArtBuilt':False,'newGameColliders':0,'officialArt':0,'officialSlope2Meters':0,
 'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R15D_TWO_ORIGINAL_WORLDS_3D_DETOUR_AUDIT.json'),'w',encoding='utf8') as f:
 json.dump(output,f,ensure_ascii=False,indent=2)
