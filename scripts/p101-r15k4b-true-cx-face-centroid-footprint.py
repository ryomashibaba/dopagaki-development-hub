"""R15K4B: original CX polygon-interior support, correct boundary-biased R15K4.

Select exact real original upward CX face (area 840/216 sqm). Tessellate
original world-space vertices and test 5 true XZ barycentric footprint points
at both previous R15K landing anchor and real CX face centroid. Cross-check
Blender original BVH first downward ray and nearest face orientation; never
confuse first downward-facing collider surface with lack of all upper faces.
No new mesh, no road, no safety/art pass.
"""
import bpy,sys,json,os,math,collections
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from mathutils.geometry import tessellate_polygon
argv=sys.argv[sys.argv.index("--")+1:]
def arg(k):
 assert k in argv,k
 return argv[argv.index(k)+1]
OUT=arg("--out");os.makedirs(OUT,exist_ok=True)
load=lambda p:json.load(open(p,encoding="utf8"))
K=load(arg("--r15k"));K4=load(arg("--r15k4"))
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
ROADS=("true-pinch","pinch-switch")
assert K["originalSourceCXBlob"]==K4["sourceBlob"]==SRC
assert K4["hypotheticalBoxDesignCount"]==30 and K4["officialArt"]==0
SITES=(("02 roadbank-promenade None",840.),("04 roadbank-promenade None",216.))
choices={n:[q for q in K["rankedActualOriginalCXSourceSurfaceVisibilityPreflight"]
          if q["originalCXSourceName"]==n] for n,_ in SITES}
assert [len(choices[n]) for n,_ in SITES]==[1,2]
offsets=((0,0),(-4,0),(4,0),(0,-4),(0,4))
sizes=(8.,14.,24.)
def projected_in_triangle(pt,pa,pb,pc):
 """Triangle XZ barycentric inclusion on actual ORIGINAL triangle vertices."""
 ax,az=pa.x,pa.z;bx,bz=pb.x,pb.z;cx,cz=pc.x,pc.z
 den=(bz-cz)*(ax-cx)+(cx-bx)*(az-cz)
 if abs(den)<1e-10:return False
 u=((bz-cz)*(pt.x-cx)+(cx-bx)*(pt.z-cz))/den
 v=((cz-az)*(pt.x-cx)+(ax-cx)*(pt.z-cz))/den
 w=1-u-v
 if min(u,v,w)<-1e-7:return False
 y=u*pa.y+v*pb.y+w*pc.y
 return abs(y-pt.y)<=1.25
def in_original_polygon(pt,triangles):
 return any(projected_in_triangle(pt,*tri) for tri in triangles)
def tree(o):
 return BVHTree.FromPolygons(
  [tuple(o.matrix_world@v.co) for v in o.data.vertices],
  [tuple(poly.vertices) for poly in o.data.polygons],all_triangles=False)
results={}
for road in ROADS:
 bpy.ops.wm.open_mainfile(filepath=arg("--source-"+road))
 cx=[o for o in bpy.data.objects if o.get("game_world_xyz_unmodified")]
 b48=[o for o in bpy.data.objects if o.get("MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER")]
 b51=[o for o in bpy.data.objects if o.get("SOURCE_ORIGINAL_B51_ID")]
 assert (len(cx),len(b48),len(b51))==(18,7,28)
 byname={o.name:o for o in cx}
 observed={}
 for name,expectarea in SITES:
  obj=byname[name]
  matrix=obj.matrix_world
  normalmatrix=matrix.to_3x3().inverted().transposed()
  anchors=[Vector(q["landingWorldXYZ"]) for q in choices[name]]
  # R15K's original 840/216 *single original face* component.
  candidates=[]
  for face in obj.data.polygons:
   center=matrix@face.center
   n=(normalmatrix@face.normal).normalized()
   if n.y<.70:continue
   if min(math.hypot(center.x-a.x,center.z-a.z) for a in anchors)>36:continue
   if min(abs(center.y-a.y) for a in anchors)>8:continue
   candidates.append((abs(face.area-expectarea),face.index,face,center,n))
  assert candidates,(name,"NO_ORIGINAL_UPWARD_REAL_POLYGON")
  candidates.sort(key=lambda x:(round(x[0],3),x[1]))
  deviation,faceindex,face,center,n=candidates[0]
  assert abs(float(face.area)-expectarea)<.0002,("SOURCE_FACE_AREA_MISMATCH",name,face.area)
  world=[matrix@obj.data.vertices[j].co for j in face.vertices]
  # API returns *indices*, never already-world-vectors.
  indices=tessellate_polygon([world])
  triangles=[(world[t[0]],world[t[1]],world[t[2]]) for t in indices]
  assert triangles and len(world)>=3
  bvh=tree(obj)
  tests=[]
  locations=[("ORIGINAL_R15K_ROAD_ANCHOR",anchors[0])]
  locations += [("ACTUAL_ORIGINAL_FACE_CENTROID_"+str(dx)+"_"+str(dz),
       Vector((center.x+dx,center.y,center.z+dz))) for dx,dz in offsets]
  for label,base in locations:
   for size in sizes:
    points=[Vector((base.x+size/2*dx,base.y,base.z+size/2*dz))
       for dx,dz in ((-1,-1),(-1,1),(1,-1),(1,1),(0,0))]
    direct=[in_original_polygon(p,triangles) for p in points]
    # Report the source BVH FIRST hit and its normal independently of
    # the explicit true source face membership result.
    ray=bvh.ray_cast(base+Vector((0,3,0)),Vector((0,-1,0)),7.5)
    h,normal,i,d=ray
    nearest=bvh.find_nearest(base,2)
    tests.append({"label":label,"widthDepthMetres":size,
      "testedRealOriginalSourceWorldCentre":[round(float(v),5) for v in base],
      "explicitTrueOriginalUpwardFaceFootprintFive":[bool(x) for x in direct],
      "explicitTrueOriginalUpwardFaceFivePointSupported":sum(direct),
      "firstDownwardRayOriginalSourceFaceNormalY":round(float(normal.y),5) if h is not None else None,
      "firstDownwardRayOriginalSourceFaceHit":h is not None,
      "originalBVHNearestFaceNormalY":round(float(nearest[1].y),5) if nearest[0] is not None else None,
      "originalBVHNearestFaceDistance":round(float(nearest[3]),5) if nearest[0] is not None else None,
      "originalDirectPolygonIsActualWalkableConstructionCertified":False})
  observed[name]={"selectedOriginalCXSourceFaceIndex":faceindex,
   "exactOriginalSourceFaceAreaSqm":round(float(face.area),5),
   "faceSourceWorldVertices":[[round(float(v),5) for v in p] for p in world],
   "faceSourceWorldCentroid":[round(float(v),5) for v in center],
   "faceOriginalUpwardNormal":[round(float(v),5) for v in n],
   "originalTriangleTessellationCount":len(triangles),
   "originalR15KLandingWitnessPoints":[[round(float(v),5) for v in x] for x in anchors],
   "originalActualSurfacePolygonFootprintTrials":tests}
 results[road]=observed
 print("R15K4B_REAL_SOURCE_UPWARD_FACE_CENTROID",road,
 [(name,round(float(observed[name]["exactOriginalSourceFaceAreaSqm"]),2),
  observed[name]["faceSourceWorldCentroid"],
  [(x["label"],x["widthDepthMetres"],x["explicitTrueOriginalUpwardFaceFivePointSupported"],
    x["firstDownwardRayOriginalSourceFaceNormalY"])
   for x in observed[name]["originalActualSurfacePolygonFootprintTrials"]
   if x["widthDepthMetres"]==8][:3]) for name,_ in SITES],flush=True)
combined=[]
for name,area in SITES:
 a,b=(results[r][name] for r in ROADS)
 assert a["selectedOriginalCXSourceFaceIndex"]==b["selectedOriginalCXSourceFaceIndex"]
 assert a["faceSourceWorldVertices"]==b["faceSourceWorldVertices"]
 assert a["faceSourceWorldCentroid"]==b["faceSourceWorldCentroid"]
 assert a["faceOriginalUpwardNormal"]==b["faceOriginalUpwardNormal"]
 assert len(a["originalActualSurfacePolygonFootprintTrials"])==len(b["originalActualSurfacePolygonFootprintTrials"])==18
 for x,y in zip(a["originalActualSurfacePolygonFootprintTrials"],b["originalActualSurfacePolygonFootprintTrials"]):
  assert x["label"]==y["label"] and x["widthDepthMetres"]==y["widthDepthMetres"]
  assert x["explicitTrueOriginalUpwardFaceFootprintFive"]==y["explicitTrueOriginalUpwardFaceFootprintFive"]
  combined.append({"sourceCXOriginalPolygonName":name,"footprintPosition":x["label"],
    "footprintWidthDepthMetres":x["widthDepthMetres"],
    "sourceTrueFaceFivePointBothWorldWitnessCount":x["explicitTrueOriginalUpwardFaceFivePointSupported"],
    "sourceOriginalBVHFirstRayNormalYPerRoad":[x["firstDownwardRayOriginalSourceFaceNormalY"],y["firstDownwardRayOriginalSourceFaceNormalY"]],
    "actualSourceOriginalFaceInteriorFull5PointsResearchOnly":x["explicitTrueOriginalUpwardFaceFivePointSupported"]==5,
    "humanRoadEntryOrStructuralArtApproved":False})
assert len(combined)==36
report={"schema":"dopagaki.r15k4b-actual-original-cx-up-facing-2face-interior-bvh-first-hit-ambiguity/1",
 "sourceBlob":SRC,"twoOriginalRoads":list(ROADS),"originalCXSourceGeometry":{"CX":18,"B48":7,"B51":28},
 "actualDistinctCXPolygonsExamined":2,
 "originalSource2FaceTrialsByRoad":results,
 "pairedOriginalSourceTwoFacePositionAndFootprints":combined,
 "sourceUpwardPolygonArea840And216VerifiedDirectly":True,
 "B48OriginalRoadIngressActualWalkableCertified":False,
 "sourceFloorLoadAndBuildingSafetyCertified":False,
 "sourceVirtualMacroActuallyRenderedWebGL":False,"newOriginalGameOrBlenderMeshes":0,
 "sourceGameModified":False,"officialArt":0,"officialSlope2Meters":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD","PERFORMANCE":"HOLD",
 "INTEGRATION":"HOLD","RELEASE":"HOLD","MERGE":"HOLD"}
with open(os.path.join(OUT,"R15K4B_REAL_CX_UPWARD_SOURCE_POLYGON_CENTROID_5POINT_FOOTPRINT.json"),"w",encoding="utf8") as f:
 json.dump(report,f,indent=2,ensure_ascii=False)
print("R15K4B_FOOTPRINT_ORIGINAL_POLYGON_INTERIOR_ONLY",
 len(combined),"paired ground trials",
 sum(p["actualSourceOriginalFaceInteriorFull5PointsResearchOnly"] for p in combined),
 "NO APPROVAL OF ACCESS OR ART",flush=True)
