"""R15M: original B48 road mesh support exit and physical top-face border.

Read genuine R15M 240Hz support exit positions, untouched R1 private Blender
with ORIGINAL B48x7 surfaces. Ray cast downward to source top road faces;
compute 3D nearest source mesh and top-road boundary segment in world XZ.
Never add support mesh/road colliders. Descriptive measurements only:
distance to a top border is not proof of which contact solver face caused fall.
"""
import bpy,sys,os,json,math,collections
from mathutils import Vector
from mathutils.bvhtree import BVHTree
v=sys.argv[sys.argv.index("--")+1:]
def arg(k):
 assert k in v,k
 return v[v.index(k)+1]
read=lambda f:json.load(open(f,encoding="utf8"))
OUT=arg("--out");os.makedirs(OUT,exist_ok=True)
D=read(arg("--trace"))
SOURCE="af076d67492a677d2235e4730aef8cdf4808e106"
ROADS=("true-pinch","pinch-switch")
assert D["schema"]=="dopagaki.r15m-actual-source-b48-240hz-exit-and-before17-analog/1"
assert D["originalSourceGameBlob"]==SOURCE
assert D["sourceGeometrySourceCounts"]=={"CX":18,"B48":7,"B51":28,"hz":240}
def xyz(q):return [round(float(a),4) for a in q]
def road_bvh(o):
 verts=[o.matrix_world@v.co for v in o.data.vertices]
 tree=BVHTree.FromPolygons([tuple(p) for p in verts],
     [tuple(poly.vertices) for poly in o.data.polygons],all_triangles=False)
 return verts,tree
def get_edges(o,verts):
 # Top-envelope border from edges with only one incident polygon whose
 # |upward normal y| >= .45. Not actual signed physical contact orientation.
 incidence=collections.defaultdict(list)
 m=o.matrix_world.to_3x3().inverted().transposed()
 for poly in o.data.polygons:
  n=(m@poly.normal).normalized()
  if abs(n.y)<.45:continue
  idx=list(poly.vertices)
  for k in range(len(idx)):
   a,b=idx[k],idx[(k+1)%len(idx)]
   incidence[(min(a,b),max(a,b))].append((int(poly.index),float(n.y)))
 output=[]
 for (i,j),inc in incidence.items():
  if len(inc)!=1:continue
  a,b=verts[i],verts[j]
  flat=math.hypot(b.x-a.x,b.z-a.z)
  if not(.05<=flat<=400):continue
  output.append((a,b,inc[0][0],inc[0][1]))
 return output
def segment_nearest_XZ(p,a,b):
 dx=b.x-a.x;dz=b.z-a.z;length2=dx*dx+dz*dz
 t=max(0,min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/(length2 or 1)))
 q=a.lerp(b,t)
 dist=math.hypot(p.x-q.x,p.z-q.z)
 return dist,q
def sample(original,roadmesh,borders):
 p=Vector(original["positionXYZ"])
 choices=[]
 for name,bvh in roadmesh:
  pos,normal,i,dist=bvh.find_nearest(p,300)
  if pos is None:continue
  choices.append((dist,name,pos,normal,i))
 near=min(choices,key=lambda q:q[0]) if choices else None
 downward=[]
 up=p+Vector((0,1.4,0))
 for name,bvh in roadmesh:
  hit,n,index,d=bvh.ray_cast(up,Vector((0,-1,0)),100)
  if hit is None:continue
  below=p.y-hit.y
  if hit.y<=p.y+1.4:
   downward.append((abs(below),below,name,hit,n,index))
 down=min(downward,key=lambda q:q[0]) if downward else None
 # A horizontal support witness is not the same as original Runner.grounded
 # because source collision also uses velocity, radius & triangle solver.
 nearest_edge=None
 for name,a,b,poly,normaly in borders:
  d,q=segment_nearest_XZ(p,a,b)
  if nearest_edge is None or d<nearest_edge[0]:
   nearest_edge=(d,name,q,poly,normaly)
 return {"tick":original["tick"],"seconds":original["seconds"],
  "sourceEngineGrounded":original["grounded"],
  "sourceEnginePhysicalRoad":original["sourcePhysicalB48Road"],
  "playerWorldXYZ":original["positionXYZ"],
  "playerVelocityXYZ":original["velocityXYZ"],
  "sourceOriginalB48NearestMeshName":near[1] if near else None,
  "sourceOriginalB48NearestDistance3DMetres":round(float(near[0]),3) if near else None,
  "sourceOriginalB48NearestSurfacePointXYZ":xyz(near[2]) if near else None,
  "sourceOriginalB48NearestFaceIndex":int(near[4]) if near else None,
  "sourceOriginalB48NearestFaceNormalY":round(float(near[3].y),4) if near else None,
  "sourceOriginalB48DownwardRayNearestFaceName":down[2] if down else None,
  "sourceOriginalB48DownwardRayVerticalOffsetMetres":round(float(down[1]),3) if down else None,
  "sourceOriginalB48DownwardRayFaceNormalY":round(float(down[4].y),4) if down else None,
  "sourceOriginalB48NearestTopBoundaryXZDistanceMetres":round(float(nearest_edge[0]),3) if nearest_edge else None,
  "sourceOriginalB48NearestTopBoundarySourceName":nearest_edge[1] if nearest_edge else None,
  "sourceOriginalB48NearestTopBoundaryWorldXYZ":xyz(nearest_edge[2]) if nearest_edge else None,
  "sourceOriginalB48NearestTopBoundaryPolygonIndex":int(nearest_edge[3]) if nearest_edge else None,
  "sourceOriginalB48NearestTopBoundaryFaceNormalY":round(float(nearest_edge[4]),4) if nearest_edge else None,
  "originalContactSolverVsProjected3DNotEquivalent":True}
out={}
signatures={}
for road in ROADS:
 bpy.ops.wm.open_mainfile(filepath=arg("--source-"+road))
 CX=[o for o in bpy.data.objects if o.get("game_world_xyz_unmodified")]
 B48=[o for o in bpy.data.objects if o.get("MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER")]
 B51=[o for o in bpy.data.objects if o.get("SOURCE_ORIGINAL_B51_ID")]
 MOV=[o for o in bpy.data.objects if o.get("R1_B51_ID")]
 assert len(CX)==18 and len(B48)==7 and len(B51)==len(MOV)==28
 signatures[road]=sorted((o.name,o["ORIGINAL_GAME_B48_SHA256"],len(o.data.polygons)) for o in B48)
 roadmeshes=[];boundaries=[]
 for o in B48:
  vs,tree=road_bvh(o)
  roadmeshes.append((o.name,tree))
  boundaries.extend((o.name,a,b,i,normaly) for a,b,i,normaly in get_edges(o,vs))
 assert boundaries and len(roadmeshes)==7
 case=[]
 for c in D["genuineSourceRoadDepartureExperiments"][road]:
  frames=c["actualSourceR15MTrace"]
  # High-density exact tick segment and terminal evidence from original physics.
  native=[sample(f,roadmeshes,boundaries) for f in frames]
  at={x["tick"]:x for x in native}
  exitEvents=c["sourcePhysicalSupportExitEventsAfter16p5"]
  assert exitEvents
  # A source run can leave B48, land again and leave a second time.
  # Pair the FINAL physically grounded tick with its NEXT source air tick.
  exitEvent=exitEvents[-1]
  exitTick=exitEvent["tick"]
  last=c["lastPhysicalGroundedSourceSupportBeforeEngineTerminal"]
  assert last and last["tick"]+1==exitTick,("final contact must immediately precede last exit",road,c["scenario"],last["tick"],exitTick)
  # The last physical supporting tick may not have been emitted as frame
  # (outside full-density window); evaluate the true original world position
  # without inventing a fake Runner event.
  atLast=at.get(last["tick"]) or sample({
   "tick":last["tick"],"seconds":last["seconds"],"grounded":True,
   "sourcePhysicalB48Road":last["surface"],"positionXYZ":last["position"],
   "velocityXYZ":last["velocity"]},roadmeshes,boundaries)
  atExit=at.get(exitTick) or sample({
   "tick":exitTick,"seconds":exitEvent["seconds"],"grounded":False,
   "sourcePhysicalB48Road":None,"positionXYZ":exitEvent["playerCentreXYZ"],
   "velocityXYZ":exitEvent["playerVelocityXYZ"]},roadmeshes,boundaries)
  if c["scenario"]=="ORIGINAL":
   assert round(atLast["seconds"]+1/240,6)==round(atExit["seconds"],6),("departure not adjacent",road)
  # Actual B48 ownership checked by true source nearest face ID vs last physical road
  ownerProximity=atLast["sourceOriginalB48NearestMeshName"]==last["surface"]
  lastToExitGap=math.dist(atLast["playerWorldXYZ"],atExit["playerWorldXYZ"])
  case.append({"scenario":c["scenario"],"road":road,
   "numberOfActualSourceAirExitEventsAfter16p5":len(exitEvents),
   "firstTrueOriginalAirExitTickAfter16p5":exitEvents[0]["tick"],
   "finalLastSupportCorrespondingOriginalAirExitTick":exitTick,
   "runnerStillRunningAt20s":c["actualRunnerStatus"]=="running",
   "sourceOriginalRoadB48FaceCounts":signatures[road],
   "actualOriginalTopBoundarySegmentsCount":len(boundaries),
   "trueLastSourcePhysicalRoadSupport":atLast,
   "firstOriginalTickWithoutRoadSupport":atExit,
   "lastSupportedRealRoadId":last["surface"],
   "supportRoadMatchesNearestBlenderSourceB48Face":ownerProximity,
   "lastSupportedTickToFirstUnsupportedTickDistanceMetres":round(lastToExitGap,4),
   "sampledSourceB48RoadMeshAndTopBoundaryRelations":native,
   "originalNativeTraceFrameCount":len(native),
   "roadShapeEdited":False,"newGameColliders":0,"actualPermanentRoadRepairCertified":False,
   "actualHumanSteeringSafetyOrWebGLCertified":False})
 print("R15M_SOURCE_PHYSICS_TO_ORIGINAL_B48_REAL3D",road,
  [(q["scenario"],q["lastSupportedRealRoadId"],
    q["trueLastSourcePhysicalRoadSupport"]["seconds"],
    q["firstOriginalTickWithoutRoadSupport"]["seconds"],
    q["trueLastSourcePhysicalRoadSupport"]["sourceOriginalB48NearestTopBoundaryXZDistanceMetres"],
    q["firstOriginalTickWithoutRoadSupport"]["sourceOriginalB48NearestTopBoundaryXZDistanceMetres"])
    for q in case],flush=True)
 out[road]=case
assert len(out)==2
result={"schema":"dopagaki.r15m-original-b48-world-mesh-last-grounded-and-top-boundary-240hz/1",
 "sourceGameBlob":SOURCE,
 "originalSourceMeshes":{"CX":18,"B48":7,"B51":28},
 "sourceRoadMeshHashesDifferBetweenRoadVariants":signatures[ROADS[0]]!=signatures[ROADS[1]],
 "originalRoadMeshSignatures":signatures,
 "originalSourcedEngineExitAnd3DBlenderGroundRelations":out,
 "actualNewSourceGameRoadTriangles":0,
 "originalGameSourceEdited":False,
 "actualNewBlenderMeshesCreated":False,
 "actualGameWebGL":False,"humanGamePass":False,
 "officialArt":0,"officialSlope2Meters":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD","PERFORMANCE":"HOLD",
 "INTEGRATION":"HOLD","RELEASE":"HOLD","MERGE":"HOLD"}
with open(os.path.join(OUT,"R15M_TRUE_SOURCE_240HZ_LAST_ROAD_SUPPORT_TO_REAL_B48_BORDER.json"),"w",encoding="utf8") as f:
 json.dump(result,f,ensure_ascii=False,indent=2)
