"""R15L original two-road full ACTUALLY REPLAYABLE native camera/terrain atlas.

NO invented 52s trajectory: uses actual source Runner termination from R15L
240Hz start00 P96 and real original CX18+B48x7+all28 B51 from untouched R1
Blender. Evaluates original terrain top triangles and point-in-original-face
source footprints, B48 spatial proximity and 2-road camera screen footprints,
true 3D original moving hazard ±yaw conservative source envelopes.
No architecture, new collider, walkability, load or human/WebGL approval.
"""
import bpy,sys,json,os,math,collections
from mathutils import Vector
from mathutils.geometry import tessellate_polygon
from mathutils.bvhtree import BVHTree

args=sys.argv[sys.argv.index("--")+1:]
def arg(x):
 assert x in args,x
 return args[args.index(x)+1]
OUT=arg("--out");os.makedirs(OUT,exist_ok=True)
read=lambda p:json.load(open(p,encoding="utf8"))
natives={r:read(arg("--native-"+r)) for r in ("true-pinch","pinch-switch")}
ROADS=("true-pinch","pinch-switch")
SHA="af076d67492a677d2235e4730aef8cdf4808e106"
for road in ROADS:
 d=natives[road]
 assert d["sourceBlob"]==SHA and d["road"]==road and d["physicsHz"]==240
 assert len(d["originalR1OverlappingTrue13FramesParity"])==13
 assert d["originalGameSourceEdited"] is False
 assert len(d["originalFullTimelineFrames"])>=13
 assert all(len(f["moving"])==28 for f in d["originalFullTimelineFrames"])
N={r:{f["id"]:f for f in natives[r]["originalFullTimelineFrames"]} for r in ROADS}
SAMPLES=sorted(set(N[ROADS[0]])&set(N[ROADS[1]]),key=lambda x:int(x[1:]))
assert all(int(x[1:])%50==0 for x in SAMPLES)
assert len(SAMPLES)>=13
HEIGHTS=(12.,28.,56.)
DIMENSIONS=(6.,10.,16.)  # source 5x5 original footprint research sizes (m)
W,H=1008,645
def xyz(p):return [round(float(q),4) for q in p]
def tree(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
  [tuple(f.vertices) for f in o.data.polygons],all_triangles=False)
def project(frame,p):
 forward=Vector(frame["front"]).normalized()
 right=forward.cross(Vector((0,1,0))).normalized()
 up=right.cross(forward)
 d=p-Vector(frame["eye"]);depth=forward.dot(d)
 if depth<.1:return None
 return [W*(.5+.675*right.dot(d)/depth/(W/H)),
         H*(.5-.675*up.dot(d)/depth)]
def visible_screen(uv):
 return uv is not None and 12<=uv[0]<=W-12 and 12<=uv[1]<=H-12
def occluded(eye,point,objects):
 vec=point-eye;ln=vec.length
 if ln<.5:return False
 direction=vec.normalized()
 for o,b in objects:
  if b.ray_cast(eye,direction,ln-.20)[0] is not None:return True
 return False
def mover_box(frame,m):
 if m["enabled"] is False:return None
 center=Vector(m["center"])
 center_screen=project(frame,center)
 if not visible_screen(center_screen):return None
 sx,sy,sz=m["halfSize"];angle=m["yawRadians"]
 pos=[]
 for yaw in (angle,-angle):
  c=math.cos(yaw);s=math.sin(yaw)
  for x in (-sx,sx):
   for z in (-sz,sz):
    for y in (-sy,sy):
     p=center+Vector((c*x+s*z,y,-s*x+c*z))
     uv=project(frame,p)
     if uv is not None:pos.append(uv)
 if not pos:return None
 return [min(v[0] for v in pos),min(v[1] for v in pos),
   max(v[0] for v in pos),max(v[1] for v in pos)]
def boxdistance(a,b):
 return math.hypot(max(a[0]-b[2],b[0]-a[2],0),max(a[1]-b[3],b[1]-a[3],0))
def interpolate(x,z,verts):
 a,b,c=verts
 den=(b.z-c.z)*(a.x-c.x)+(c.x-b.x)*(a.z-c.z)
 if abs(den)<1e-10:return None
 u=((b.z-c.z)*(x-c.x)+(c.x-b.x)*(z-c.z))/den
 v=((c.z-a.z)*(x-c.x)+(a.x-c.x)*(z-c.z))/den
 w=1-u-v
 if min(u,v,w)<-1e-5:return None
 return float(u*a.y+v*b.y+w*c.y)
def source_tris(obj):
 m=obj.matrix_world;normalmat=m.to_3x3().inverted().transposed()
 out=[]
 for poly in obj.data.polygons:
  if (normalmat@poly.normal).normalized().y<.72:continue
  original=[m@obj.data.vertices[k].co for k in poly.vertices]
  # Blender tessellation preserves polygon input vertex ordering.
  for ix in tessellate_polygon([original]):
   vs=tuple(original[k] for k in ix)
   area=(vs[1]-vs[0]).cross(vs[2]-vs[0]).length*.5
   if area<.1:continue
   out.append((poly.index,vs,area))
 return out
def surface_at(x,z,ref_y,triangles):
 hits=[]
 for pid,tri,area in triangles:
  if min(p.x for p in tri)-1e-5>x or max(p.x for p in tri)+1e-5<x:continue
  if min(p.z for p in tri)-1e-5>z or max(p.z for p in tri)+1e-5<z:continue
  yy=interpolate(x,z,tri)
  if yy is not None and abs(ref_y-yy)<=2.5:hits.append((abs(ref_y-yy),yy,pid))
 return min(hits) if hits else None
def floor_grid(centre,size,tris):
 readings=[]
 for u in (-1,-.5,0,.5,1):
  for v in (-1,-.5,0,.5,1):
   val=surface_at(centre.x+u*size*.5,centre.z+v*size*.5,centre.y,tris)
   readings.append(val)
 heights=[x[1] for x in readings if x is not None]
 # Very distinct from certification of a flat physical platform.
 maxdifference=(max(heights)-min(heights)) if heights else None
 return len(heights),round(maxdifference,3) if maxdifference is not None else None
def candidate_points(name,tris):
 raw=[]
 for face,tri,area in tris:
  if area<.3:continue
  a,b,c=tri
  for wa,wb,wc in ((1/3,1/3,1/3),(.55,.225,.225),(.225,.55,.225),(.225,.225,.55)):
   p=a*wa+b*wb+c*wc
   raw.append({"originalCXMeshName":name,"originalFace":face,
       "sourceSurfaceAreaSqm":round(area,2),"sourceFacePointXYZ":xyz(p)})
 # Dedup same-world surface points within 4m, no double counting a face.
 ans=[]
 for item in raw:
  p=Vector(item["sourceFacePointXYZ"])
  if any((p-Vector(other["sourceFacePointXYZ"])).length<4 for other in ans):continue
  ans.append(item)
 return ans
def enough_frames(p):
 matches=[]
 for time in SAMPLES:
  if all(visible_screen(project(N[road][time],p+Vector((0,18,0)))) for road in ROADS):
   matches.append(time)
 return matches
def contact_road(p,roadBVH):
 pool=[]
 for name,b in roadBVH:
  loc,norm,index,d=b.find_nearest(p,250)
  if loc is not None:pool.append((d,name,loc,norm))
 if not pool:return (None,None,None,None)
 dist,name,loc,norm=min(pool,key=lambda x:x[0])
 return (round(float(dist),3),name,xyz(loc),round(float(norm.y),4))
# B51 source envelope precomputed ONCE per actual frame for every candidate.
hazards={}
for road in ROADS:
 hazards[road]={time:[b for h in N[road][time]["moving"]
     if (b:=mover_box(N[road][time],h)) is not None] for time in SAMPLES}
world={}
allnames=None
for road in ROADS:
 bpy.ops.wm.open_mainfile(filepath=arg("--source-"+road))
 cx=[o for o in bpy.data.objects if o.get("game_world_xyz_unmodified")]
 b48=[o for o in bpy.data.objects if o.get("MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER")]
 b51=[o for o in bpy.data.objects if o.get("SOURCE_ORIGINAL_B51_ID")]
 proxy=[o for o in bpy.data.objects if o.get("R1_B51_ID")]
 assert (len(cx),len(b48),len(b51),len(proxy))==(18,7,28,28)
 sig=(sorted((o.name,o["source_sha256"],len(o.data.polygons)) for o in cx),
      sorted((o.name,o["ORIGINAL_GAME_B48_SHA256"],len(o.data.polygons)) for o in b48))
 if allnames is None:allnames=sig
 else:assert sig==allnames,("R15L_ORIGINAL_SOURCE_GEOMETRY_NOT_SAME_ROAD",road)
 roadBVH=[(o.name,tree(o)) for o in b48]
 obstacles=[(o,tree(o)) for o in cx+b48]
 stats={}
 items=[]
 for o in cx:
  triangles=source_tris(o)
  pts=candidate_points(o.name,triangles)
  stats[o.name]={"originalTopFacingTriangles":len(triangles),
    "candidateTopFaceSamples":len(pts),"sourceUpTriangleAreaSumSqm":round(sum(a for _,_,a in triangles),2)}
  for entry in pts:
   p=Vector(entry["sourceFacePointXYZ"])
   early=enough_frames(p)
   if len(early)<2:continue
   checks={}
   for size in DIMENSIONS:
    count,grade=floor_grid(p,size,triangles)
    checks[str(int(size))]={"originalTopFaceSupportCellsOf25":count,
       "originalTopFaceSampleHeightVariationMetres":grade}
   if max(x["originalTopFaceSupportCellsOf25"] for x in checks.values())<12:continue
   near=contact_road(p,roadBVH)
   if near[0] is None:continue
   item={**entry,"screenCentrePreflightPairedFrames":early,
     "squareFloor5x5SourceUpFaceWitnesses":checks,
     "closestActualOriginalB48RoadSurfaceDistanceMetres":near[0],
     "closestOriginalB48Mesh":near[1],"closestOriginalB48PointXYZ":near[2],
     "sourceOriginalRoadHitNormalY":near[3],
     "originalRoadToCXPublicPathBuilt":False}
   items.append(item)
 # Restrict costly visibility raycasts to actually road-near 200 source sites.
 items.sort(key=lambda p:(-max(q["originalTopFaceSupportCellsOf25"] for q in p["squareFloor5x5SourceUpFaceWitnesses"].values()),
   p["closestActualOriginalB48RoadSurfaceDistanceMetres"],
   -len(p["screenCentrePreflightPairedFrames"]),p["originalCXMeshName"],
   p["originalFace"],p["sourceFacePointXYZ"]))
 items=items[:240]
 for entry in items:
  c=Vector(entry["sourceFacePointXYZ"])
  perTime=[]
  for time in SAMPLES:
   frame=N[road][time]
   # Study one source-grounded 10x10x28m abstract REGION ENVELOPE.
   probes=[c+Vector((u*5,y,v*5)) for u in (-1,1) for v in (-1,1)
     for y in (0.,28.)]
   probes+= [c+Vector((0,28,0)),c, c+Vector((-5,14,0)),
      c+Vector((5,14,0)),c+Vector((0,14,-5)),c+Vector((0,14,5))]
   assert len(probes)==14
   originalVisible=[]
   eye=Vector(frame["eye"])
   for p in probes:
    uv=project(frame,p)
    if not visible_screen(uv):continue
    if not occluded(eye,p,obstacles):originalVisible.append(uv)
   if originalVisible:
    bb=[min(x[0] for x in originalVisible),min(x[1] for x in originalVisible),
      max(x[0] for x in originalVisible),max(x[1] for x in originalVisible)]
    area=round((bb[2]-bb[0])*(bb[3]-bb[1]),2)
    distances=[boxdistance(bb,x) for x in hazards[road][time]]
    minB51=round(min(distances),2) if distances else None
   else:area=0;bb=None;minB51=None
   perTime.append({"id":time,"unoccludedVirtual3DPointCount":len(originalVisible),
    "screenSampleBoundsNotSurfaceSilhouette":[round(x,3) for x in bb] if bb else None,
    "screenBoundingAreaPixelsSq":area,
    "originalMovingB51CenterOnScreenCount":len(hazards[road][time]),
    "sourceOriginalB51ConservativeEnvelopeScreenDistancePixels":minB51,
    "within48pxOriginalB51SourceScreenGuard":minB51 is not None and minB51<=48})
  entry["sourceOriginalCameraAllFrames"]=perTime
 world[road]={"eachSourceCXMeshTopFaceStats":stats,
  "sourceBroadCandidateEvaluations":items,
  "originalNativeFrameSamples":len(N[road]),"originalSourceObjectCounts":{"CX":18,"B48":7,"B51":28},
  "originalSourceGeometrySignatureMatchedBothWorlds":True}
 print("R15L_ACTUAL_WIDE_CX_SOURCE_SCAN",road,"uniqueMeshes",len(stats),
  "afterSourceScreenGroundRoadPreflight",len(items),
  "originalCameraFrames",len(N[road]),flush=True)
# Pair exact original world location IDs, do not compare distinct source sites.
def sitekey(q):return (q["originalCXMeshName"],tuple(q["sourceFacePointXYZ"]),q["originalFace"])
pairs=[{sitekey(x):x for x in world[r]["sourceBroadCandidateEvaluations"]} for r in ROADS]
matched=sorted(set(pairs[0])&set(pairs[1]),key=str)
studies=[]
for key in matched:
 a,b=(p[key] for p in pairs)
 assert a["originalCXMeshName"]==b["originalCXMeshName"]
 assert a["sourceFacePointXYZ"]==b["sourceFacePointXYZ"]
 for size in DIMENSIONS:
  c=a["squareFloor5x5SourceUpFaceWitnesses"][str(int(size))]
  d=b["squareFloor5x5SourceUpFaceWitnesses"][str(int(size))]
  assert c==d,("same exact terrain changed",key,size)
 risk=[];frames=[]
 for f,g in zip(a["sourceOriginalCameraAllFrames"],b["sourceOriginalCameraAllFrames"]):
  assert f["id"]==g["id"]
  if (min(f["unoccludedVirtual3DPointCount"],g["unoccludedVirtual3DPointCount"])>=4
      and min(f["screenBoundingAreaPixelsSq"],g["screenBoundingAreaPixelsSq"])>=1600):
   frames.append(f["id"])
  if f["within48pxOriginalB51SourceScreenGuard"] or g["within48pxOriginalB51SourceScreenGuard"]:
   risk.append(f["id"])
 streak=longest=0
 for k in SAMPLES:
  streak=streak+1 if k in frames else 0
  longest=max(longest,streak)
 score=longest*100+len(frames)*15-max(a["closestActualOriginalB48RoadSurfaceDistanceMetres"],
    b["closestActualOriginalB48RoadSurfaceDistanceMetres"])*.2
 supported=max(size for size in DIMENSIONS if a["squareFloor5x5SourceUpFaceWitnesses"][str(int(size))]["originalTopFaceSupportCellsOf25"]==25) if any(
    a["squareFloor5x5SourceUpFaceWitnesses"][str(int(size))]["originalTopFaceSupportCellsOf25"]==25 for size in DIMENSIONS) else 0
 # Guard frames that actually contain proposed architecture; off-screen hazard
 # warnings do not imply physical "safe" for unseen moving 3D volumes.
 sourceCandidate=bool(longest>=5 and supported>=6 and not (set(frames)&set(risk)) and
  max(a["closestActualOriginalB48RoadSurfaceDistanceMetres"],
      b["closestActualOriginalB48RoadSurfaceDistanceMetres"])<=75)
 studies.append({"originalCXMesh":a["originalCXMeshName"],"exactSourceOriginalFaceId":a["originalFace"],
  "siteXYZ":a["sourceFacePointXYZ"],
  "originalGroundUpFace25PointLargestSupportedFootprintSideMetres":supported,
  "originalB48NearestSourceDistanceTwoRoadMetres":[a["closestActualOriginalB48RoadSurfaceDistanceMetres"],
    b["closestActualOriginalB48RoadSurfaceDistanceMetres"]],
  "bothRoadOriginalSource2DBoxVisibleFrames":frames,
  "longestContinuousTwoRoadOriginalHalfSecondFrames":longest,
  "originalB51ConservativeGuardResearchFrames":risk,
  "sourceCameraOnlySiteRankScore":round(score,3),
  "eligibleOnlyForFurtherRoadAndArchitectureResearch":sourceCandidate,
  "actualOriginalRoadToSiteContinuousWalkBuilt":False,
  "newCityActuallyBuiltAndRendered":False,
  "humanObstacleWarningFairnessCertified":False})
studies.sort(key=lambda q:(-int(q["eligibleOnlyForFurtherRoadAndArchitectureResearch"]),
 -q["longestContinuousTwoRoadOriginalHalfSecondFrames"],
 -q["originalGroundUpFace25PointLargestSupportedFootprintSideMetres"],
 -q["sourceCameraOnlySiteRankScore"],q["originalCXMesh"],q["exactSourceOriginalFaceId"]))
report={"schema":"dopagaki.r15l-actual-native-all-replayable-times-18cx-seven-b48-two-road-land-atlas/1",
 "sourceBlob":SHA,"originalNativeTimeWindowsActuallyObserved":{r:[N[r][x]["seconds"] for x in sorted(N[r],key=lambda q:int(q[1:]))] for r in ROADS},
 "commonOriginalNativeHalfSecondFrames":SAMPLES,
 "actualPlayableOriginalTimeIsNotAssumedToBe52Seconds":True,
 "exactOriginalGeometry":{"CX":18,"B48":7,"B51":28,"nativeHz":240},
 "originalWorldByRoad":world,
 "twoRoadExactSameWorldCXSiteStudies":studies,
 "twoRoadOriginalCXSiteCount":len(studies),
 "preliminaryResearchGateSurvivorCount":sum(x["eligibleOnlyForFurtherRoadAndArchitectureResearch"] for x in studies),
 "originalGameSourceEdited":False,"actualNewBlenderCityCreated":False,
 "newGameColliders":0,"fullHumanWalkCertified":False,"allOriginalHazard3DContinuousVisualSafety":False,
 "realRenderedFinalArtApproved":False,"browserWebGLRendered":False,
 "officialArt":0,"officialSlope2Meters":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD","PERFORMANCE":"HOLD",
 "INTEGRATION":"HOLD","RELEASE":"HOLD","MERGE":"HOLD"}
with open(os.path.join(OUT,"R15L_ACTUAL_ORIGINAL_TWO_ROAD_WIDE_TIME_CX_B48_SOURCE_ATLAS.json"),"w",encoding="utf8") as f:
 json.dump(report,f,ensure_ascii=False,indent=2)
print("R15L_VERIFIED_REAL_240HZ_WIDE_ORIGINAL_SOURCE_ATLAS",
 len(SAMPLES),"paired frame samples",len(studies),"paired actual sites",
 sum(q["eligibleOnlyForFurtherRoadAndArchitectureResearch"] for q in studies),"only research",
 "top",[(q["originalCXMesh"],q["longestContinuousTwoRoadOriginalHalfSecondFrames"])
 for q in studies[:5]],flush=True)
