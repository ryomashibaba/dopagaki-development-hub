"""R15K4B: actual source-CX face interior anchoring, no Blender meshes.

Correct R15K4's edge-anchoring and "first BVH ray hits downside" artifacts.
Source-upward triangles are taken from actual ORIGINAL CX mesh polygons,
transformed into world coordinates. Every virtual footprint is checked by
XZ barycentric membership + interpolated Y at a 5x5 grid; alternative
CX triangles at other Y are NOT silently considered load-support.

Original native R1 cameras and source CX/B48 BVH used for projected
14-point macro box visibility. Original B51 ±yaw 3D envelope from R15K3
is a research warning, not actual moving physical/human warning safety.
No art, no colliders, no new Blender mesh.
"""
import bpy,json,math,os,sys,collections
from mathutils import Vector
from mathutils.geometry import tessellate_polygon
from mathutils.bvhtree import BVHTree
av=sys.argv[sys.argv.index("--")+1:]
def arg(k):
 assert k in av,k
 return av[av.index(k)+1]
OUT=arg("--out");os.makedirs(OUT,exist_ok=True)
load=lambda p:json.load(open(p,encoding="utf8"))
R15K=load(arg("--r15k"));R15K3=load(arg("--r15k3"));R15I4=load(arg("--r15i4"));R15K4=load(arg("--r15k4"))
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
roads=("true-pinch","pinch-switch")
patches=("02 roadbank-promenade None","04 roadbank-promenade None")
assert R15K["originalSourceCXBlob"]==R15K3["sourceBlob"]==R15I4["sourceBlob"]==R15K4["sourceBlob"]==SRC
assert R15K4["hypotheticalBoxDesignCount"]==30 and not R15K4["humanWalkingEntranceVerified"]
N={r:load(arg("--native-"+r)) for r in roads}
envelopes={(x["road"],x["originalCXPatchName"]):{
 f["frame"]:[z["conservativeYawSignUnionScreenBox"] for z in f["projectedOriginalMovers"]]
 for f in x["originalSourceRealCameraFrames"]} for x in R15K3["twoRoadTwoCXOriginalCameraDetailedComparisons"]}
assert len(envelopes)==4
cases=[x for x in R15I4["commonTwoWorldOriginalCXSourceResearchRows"]
 if x["originalGameGeometryAndCXSupportCandidateOnly"] and x["originalCXSourceMeshName"] in patches]
assert len(cases)==5
landings={name:[Vector(x["originalCXTerrainLandingWorldXYZ"]) for x in cases if x["originalCXSourceMeshName"]==name] for name in patches}
def f4(x):return round(float(x),4)
def xyz(v):return [f4(c) for c in v]
def original_tree(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
 [tuple(p.vertices) for p in o.data.polygons],all_triangles=False)
def top_triangles(obj,landings):
 mat=obj.matrix_world
 normal_mat=mat.to_3x3().inverted().transposed()
 found=[]
 for poly in obj.data.polygons:
  if (normal_mat@poly.normal).normalized().y<.70:continue
  vertices=[mat@obj.data.vertices[i].co for i in poly.vertices]
  for tri in tessellate_polygon([vertices]):
   a,b,c=[vertices[i] for i in tri]
   # Filter by triangle's XZ bounds, not polygon CENTER: prior large
   # polygon false-negative demonstrated why center-only fails.
   if not any(min(p.x for p in (a,b,c))<=l.x+55
          and max(p.x for p in (a,b,c))>=l.x-55
          and min(p.z for p in (a,b,c))<=l.z+55
          and max(p.z for p in (a,b,c))>=l.z-55
          and min(p.y for p in (a,b,c))<=l.y+6
          and max(p.y for p in (a,b,c))>=l.y-6
          for l in landings):continue
   area=((b-a).cross(c-a)).length*.5
   if area<.1:continue
   found.append({"poly":int(poly.index),"vertices":(a,b,c),"area":float(area),
    "normalY":round(float((b-a).cross(c-a).normalized().y),5)})
 return found
def interpolate(x,z,tri):
 a,b,c=tri["vertices"]
 denom=(b.z-c.z)*(a.x-c.x)+(c.x-b.x)*(a.z-c.z)
 if abs(denom)<1.e-8:return None
 u=((b.z-c.z)*(x-c.x)+(c.x-b.x)*(z-c.z))/denom
 v=((c.z-a.z)*(x-c.x)+(a.x-c.x)*(z-c.z))/denom
 w=1-u-v
 if min(u,v,w)<-0.0002:return None
 return float(u*a.y+v*b.y+w*c.y)
def support(x,z,refy,triangles):
 heights=[(abs(h-refy),h,q["poly"]) for q in triangles
          if (h:=interpolate(x,z,q)) is not None and abs(h-refy)<=.30]
 if not heights:return None
 heights.sort()
 return heights[0]
def samples_for(name,triangles):
 samples=[]
 for t in triangles:
  a,b,c=t["vertices"]
  for u in range(1,9):
   for v in range(1,9-u):
    w=9-u-v
    if w<1:continue
    pos=(a*u+b*v+c*w)/9
    if not any(math.hypot(pos.x-l.x,pos.z-l.z)<=43 and abs(pos.y-l.y)<=3 for l in landings[name]):continue
    samples.append(pos)
 samples.sort(key=lambda p:(round(p.x,3),round(p.z,3),round(p.y,3)))
 out=[]
 for p in samples:
  if all((p-q).length>=1.45 for q in out):out.append(p)
 return out
def probes_at(name,triangles,center,side):
 w=side/2;checks=[]
 for u in (-1,-.5,0,.5,1):
  for v in (-1,-.5,0,.5,1):
   xx=center.x+u*w;zz=center.z+v*w
   hit=support(xx,zz,center.y,triangles)
   checks.append({"u":u,"v":v,"originalSurfaceY":f4(hit[1]) if hit else None,
    "originalSurfaceFaceIndex":hit[2] if hit else None,
    "onSameSourceCXUpFacingTriangle":hit is not None})
 return checks
def source_project(frame,p):
 front=Vector(frame["front"]).normalized()
 right=front.cross(Vector((0,1,0))).normalized();up=right.cross(front)
 d=p-Vector(frame["eye"]);depth=front.dot(d)
 if depth<.05:return None
 return (1008*(.5+right.dot(d)*.675/depth/(1008/645)),
         645*(.5-up.dot(d)*.675/depth))
def blocked(eye,target,obs):
 dr=target-eye
 if dr.length<.1:return False
 for o,tr in obs:
  if tr.ray_cast(eye,dr.normalized(),dr.length-.15)[0] is not None:return True
 return False
def sep(a,b):
 return math.hypot(max(a[0]-b[2],b[0]-a[2],0),max(a[1]-b[3],b[1]-a[3],0))
def frame_probes(center,side,height,frame,obs,b51):
 probes=[Vector((center.x+u*side/2,center.y+h,center.z+v*side/2))
    for u in (-1,1) for v in (-1,1) for h in (0,height)]
 probes.extend([Vector((center.x,center.y+h,center.z)) for h in (0,height)])
 probes.extend([
  Vector((center.x+u*side/2,center.y+height/2,center.z)) for u in (-1,1)])
 probes.extend([
  Vector((center.x,center.y+height/2,center.z+v*side/2)) for v in (-1,1)])
 assert len(probes)==14
 on=[];eye=Vector(frame["eye"])
 for p in probes:
  q=source_project(frame,p)
  if q is None or not(12<q[0]<996 and 12<q[1]<633):continue
  if not blocked(eye,p,obs):on.append(q)
 if on:
  rect=[round(min(x[0] for x in on),3),round(min(x[1] for x in on),
        3),round(max(x[0] for x in on),3),round(max(x[1] for x in on),3)]
  area=round((rect[2]-rect[0])*(rect[3]-rect[1]),1)
  mind=min((sep(rect,box) for box in b51),default=None)
 else:rect=None;area=0.;mind=None
 return {"id":frame["id"],"sourceOriginalCXB48UnoccludedPointCount":len(on),
  "sourcePointBoundsNotRealMeshSilhouette":rect,
  "sourceScreenPointBoundingAreaProxyPixelsSquared":area,
  "sourceOriginalB51CenterVisibleEnvelopeCount":len(b51),
  "sourceOriginalB51EnvelopeDistancePixels":round(mind,3) if mind is not None else None,
  "sourceOriginalB51ResearchGuard48pxConcern":mind is not None and mind<=48,
  "actualNewArchitectureSafetyOrArtCertified":False}
world={}
for road in roads:
 bpy.ops.wm.open_mainfile(filepath=arg("--blend-"+road))
 CX=[o for o in bpy.data.objects if o.get("game_world_xyz_unmodified")]
 B48=[o for o in bpy.data.objects if o.get("MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER")]
 B51=[o for o in bpy.data.objects if o.get("SOURCE_ORIGINAL_B51_ID")]
 MOV=[o for o in bpy.data.objects if o.get("R1_B51_ID")]
 assert (len(CX),len(B48),len(B51),len(MOV))==(18,7,28,28)
 objs={o.name:o for o in CX}
 obs=[(o,original_tree(o)) for o in CX+B48]
 report={}
 for name in patches:
  tris=top_triangles(objs[name],landings[name])
  assert tris,(road,name,"missing true source upward faces")
  samples=samples_for(name,tris)
  candidates=[]
  for point in samples:
   for side,height in ((4.,10.),(8.,14.),(14.,24.),(24.,48.)):
    checks=probes_at(name,tris,point,side)
    count=sum(x["onSameSourceCXUpFacingTriangle"] for x in checks)
    if count<25:continue
    cid=name+"|"+",".join(str(x) for x in xyz(point))+"|"+str(int(side))
    candidates.append({"id":cid,"centreOriginalCXFaceXYZ":xyz(point),
      "virtualSquareFootprintSideMetres":side,"virtualHeightMetres":height,
      "originalFootprint5By5SourceFaceChecks":checks,
      "full25PointOriginalTopFaceMembership":True,
      "sourceRoadsCamera":None})
  candidates.sort(key=lambda x:(-x["virtualSquareFootprintSideMetres"],
     math.hypot(x["centreOriginalCXFaceXYZ"][0]-landings[name][0].x,x["centreOriginalCXFaceXYZ"][2]-landings[name][0].z),
     x["id"]))
  # Limit to 20 distinct original source interior positions per patch,
  # selecting large footprints first. Do not make 1000 empty boxes.
  candidates=candidates[:20]
  for q in candidates:
   centre=Vector(q["centreOriginalCXFaceXYZ"])
   q["sourceRoadsCamera"]=[frame_probes(centre,q["virtualSquareFootprintSideMetres"],
    q["virtualHeightMetres"],frame,obs,envelopes[(road,name)][frame["id"]])
     for frame in N[road]["frames"]]
  report[name]={"originalSourceUpFaceTriangleCount":len(tris),
    "originalSourceUpFaceTriangleAreaSumSqm":round(sum(t["area"] for t in tris),2),
    "originalSourceUpFacePolygonIndices":sorted({t["poly"] for t in tris}),
    "sourceFaceInteriorSamplePoints":len(samples),
    "fullySourceGrounded25PointStudyBoxes":len(candidates),
    "sourceCentreInteriorNoNewMeshes":candidates,
    "initialR15K4ZeroFootprintSelectionWasEdgeAnchored":True}
 world[road]=report
 print("R15K4B_ORIGINAL_CX_INTERIOR",road,
  [(name,report[name]["originalSourceUpFaceTriangleCount"],
    report[name]["sourceFaceInteriorSamplePoints"],
    report[name]["fullySourceGrounded25PointStudyBoxes"])
   for name in patches],flush=True)
paired=[]
for name in patches:
 a={q["id"]:q for q in world[roads[0]][name]["sourceCentreInteriorNoNewMeshes"]}
 b={q["id"]:q for q in world[roads[1]][name]["sourceCentreInteriorNoNewMeshes"]}
 matched=sorted(set(a)&set(b))
 for cid in matched:
  x,y=a[cid],b[cid]
  original_frames=set()
  danger=set()
  for f,g in zip(x["sourceRoadsCamera"],y["sourceRoadsCamera"]):
   assert f["id"]==g["id"]
   if (f["sourceOriginalCXB48UnoccludedPointCount"]>=4 and
       g["sourceOriginalCXB48UnoccludedPointCount"]>=4 and
       f["sourceScreenPointBoundingAreaProxyPixelsSquared"]>=2500 and
       g["sourceScreenPointBoundingAreaProxyPixelsSquared"]>=2500):
    original_frames.add(f["id"])
   if f["sourceOriginalB51ResearchGuard48pxConcern"] or g["sourceOriginalB51ResearchGuard48pxConcern"]:
    danger.add(f["id"])
  consecutive=longest=0
  for k in range(1100,1701,50):
   consecutive=consecutive+1 if "t"+str(k) in original_frames else 0
   longest=max(longest,consecutive)
  safe_only_in_sample=not bool(original_frames&danger)
  conditional=longest>=5 and safe_only_in_sample
  paired.append({"originalCXPatch":name,"virtualCentreXYZ":x["centreOriginalCXFaceXYZ"],
   "sourceMatchedCandidateId":cid,"squareSideMetres":x["virtualSquareFootprintSideMetres"],
   "bothRoadOriginalSourceCameraSampleReadableFrames":sorted(original_frames),
   "bothRoadLongestContinuousSourceFrameSamples":longest,
   "originalB51ScreenBoxResearchConcernFrames":sorted(danger),
   "sourceOnlyConditionalCameraAndHalfsizeResearchMatch":conditional,
   "notRealGameB51FullSilhouette":True,"realArchitectureWalkArtSafetyAccepted":False})
paired.sort(key=lambda x:(-int(x["sourceOnlyConditionalCameraAndHalfsizeResearchMatch"]),
 -x["bothRoadLongestContinuousSourceFrameSamples"],
 -x["squareSideMetres"],x["sourceMatchedCandidateId"]))
result={"schema":"dopagaki.r15k4b-original-upface-triangulated-interior-25point-floor-recheck/1",
 "sourceCXBlob":SRC,"sourceWorlds":list(roads),"sourceOriginalCXMeshes":list(patches),
 "priorR15K4DisqualifiedEdgeAnchoredStudyBoxes":30,
 "noNewMeshesOrCollider":True,
 "sourceFaceInteriorWorldResults":world,
 "matchedTwoRoadSourceOnlyCandidateScreenResults":paired,
 "anyOriginalRoadToCXPublicAccessibleRouteBuilt":False,
 "allOriginalMovingB51TrueObstaclesRendered":False,
 "physicalLoadOrStructureCertified":False,"actualRealGameplayWebGL":False,
 "humanArtApproved":False,"newSourceGameColliders":0,
 "officialArt":0,"officialSlope2Meters":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD","PERFORMANCE":"HOLD",
 "INTEGRATION":"HOLD","RELEASE":"HOLD","MERGE":"HOLD"}
with open(os.path.join(OUT,"R15K4B_REAL_SOURCE_UPFACE_INTERIOR_25POINT_TWO_ROADS.json"),"w",encoding="utf8") as o:
 json.dump(result,o,ensure_ascii=False,indent=2)
print("R15K4B_2ROAD_MATCHED_SOURCE_INTERIOR",len(paired),
 "RESEARCH_SCREEN_CONDITIONAL",sum(x["sourceOnlyConditionalCameraAndHalfsizeResearchMatch"] for x in paired),
 "NO ACTUAL CONNECTED CITY MODEL",flush=True)
