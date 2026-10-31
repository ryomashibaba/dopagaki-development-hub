"""R15K: original CX surface topology and paired source-camera visibility (no new art).

This is a *site falsification* study: eight R15I4 hypotheses share only four
CX landing coordinates. Inspect upward-oriented actually CONNECTED polygon
patches, source-original screen projection/occlusion and B51 baseline cue
samples from original R1 cameras. No fabricated physical floor or camera.
"""
import bpy,sys,json,os,math,collections
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
argv=sys.argv[sys.argv.index("--")+1:]
def arg(k):
 assert k in argv,("missing",k)
 return argv[argv.index(k)+1]
OUT=arg("--out");os.makedirs(OUT,exist_ok=True)
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
ROADS=("true-pinch","pinch-switch")
f=lambda p:json.load(open(p,encoding="utf8"))
rank=f(arg("--r15i4"));prior=f(arg("--r15i2"))
assert rank["sourceBlob"]==prior["originalSourceCXBlob"]==SRC
assert rank["schema"]=="dopagaki.r15i4-dual-original-source-multicamera-true-cx-access-grade-shortlist/1"
assert prior["schema"]=="dopagaki.r15i2-original-cx-terrain-real-3d-load-path-hypothesis-readonly/1"
native={r:f(arg("--native-"+r)) for r in ROADS}
selected=[x for x in rank["commonTwoWorldOriginalCXSourceResearchRows"]
          if x["originalGameGeometryAndCXSupportCandidateOnly"]]
assert len(selected)==rank["theoreticalSourceModelSiteQualifiers"]==8
sites={}
for q in selected:
 key=tuple(q["originalCXTerrainLandingWorldXYZ"])
 if key not in sites:sites[key]={"landingWorldXYZ":list(key),
      "originalCXSourceName":q["originalCXSourceMeshName"],"originalRoadCandidates":[]}
 assert sites[key]["originalCXSourceName"]==q["originalCXSourceMeshName"]
 sites[key]["originalRoadCandidates"].append(q["id"])
assert len(sites)==4,("R15I4_ROAD_POINTS_NOT_INDEPENDENT_LANDINGS",len(sites))
def tree(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
  [tuple(x.vertices) for x in o.data.polygons],all_triangles=False)
def xyz(v):
 return [round(float(x),5) for x in v]
def signature(cx,b48,b51):
 return (sorted((o.name,o["source_sha256"],len(o.data.polygons)) for o in cx),
  sorted((o.name,o["ORIGINAL_GAME_B48_SHA256"],len(o.data.polygons)) for o in b48),
  sorted((o.name,o["SOURCE_ORIGINAL_B51_ID"],len(o.data.vertices)) for o in b51))
def connected(o,landing):
 """Connected real top-facing original CX polygon component near landing."""
 mat=o.matrix_world
 nm=mat.to_3x3().inverted().transposed()
 candidates={}
 edge_faces=collections.defaultdict(list)
 for poly in o.data.polygons:
  pos=mat@poly.center
  if (math.hypot(pos.x-landing.x,pos.z-landing.z)>28 or
      abs(pos.y-landing.y)>7):continue
  normal=(nm@poly.normal).normalized()
  if normal.y<.70:continue
  verts=list(poly.vertices)
  # Poly areas are retained as a local-source area proxy, no load claim.
  candidates[poly.index]=(pos,float(poly.area),normal,verts)
  for j in range(len(verts)):
   e=tuple(sorted((verts[j],verts[(j+1)%len(verts)])))
   edge_faces[e].append(poly.index)
 neighbors=collections.defaultdict(set)
 for faces in edge_faces.values():
  if len(faces)<2:continue
  for i in faces:
   neighbors[i].update(j for j in faces if i!=j)
 remain=set(candidates);groups=[]
 while remain:
  first=min(remain);stack=[first];remain.remove(first);component=[]
  while stack:
   i=stack.pop();component.append(i)
   for j in neighbors[i]:
    if j in remain:
     remain.remove(j);stack.append(j)
  groups.append(component)
 groups.sort(key=lambda g:(-sum(candidates[x][1] for x in g),min(g)))
 best=groups[0] if groups else []
 area=sum(candidates[i][1] for i in best)
 # IMPORTANT: source CX polygons are sometimes HUGE true polygons
 # (e.g. one 840sqm quad). One center per polygon would force 0/4 site
 # passes under a 2-sample camera test. Tessellate the actual source
 # polygon and sample interior barycentric points on those ORIGINAL faces.
 from mathutils.geometry import tessellate_polygon
 pool=[]
 for i in best:
  poly=o.data.polygons[i]
  face=[mat@o.data.vertices[v].co for v in poly.vertices]
  triangles=tessellate_polygon([face])
  for triangle in triangles:
   # Blender 4.x tessellate_polygon returns vertex INDEX triples.
   # Interpret them against the actual original face world vertices.
   assert len(triangle)==3 and all(0<=idx<len(face) for idx in triangle)
   p0,p1,p2=(face[triangle[0]],face[triangle[1]],face[triangle[2]])
   for u in range(1,7):
    for v in range(1,7-u):
     w=7-u-v
     if w<1:continue
     point=(p0*u+p1*v+p2*w)/7
     # Exclude triangle-fan artifacts; only original tessellated faces.
     pool.append(point)
 # Deterministic spatial decimation: no score is assigned just because
 # an original source polygon has only one center.
 pool.sort(key=lambda p:(round(float(p.x),3),round(float(p.z),3),round(float(p.y),3)))
 samples=[]
 for p in pool:
  if all((p-q).length>1.35 for q in samples):samples.append(p)
  if len(samples)>=48:break
 actual=tree(o)
 hit,n,j,d=actual.find_nearest(landing,2)
 if hit is None:
  witness={"sourceFaceLocated":False,"distanceMetres":None,"nearestFaceNormalY":None}
 else:
  witness={"sourceFaceLocated":True,"distanceMetres":round((hit-landing).length,5),
          "nearestFaceNormalY":round(float(n.y),5)}
 return {"nearestLanding":witness,
  "originalSourceUpFacingFacesWithin28m":len(candidates),
  "originalLargestEdgeConnectedUpFacingFaces":len(best),
  "originalLargestConnectedSurfaceAreaProxySqm":round(area,3),
  "realTriangulatedOriginalPolygonInteriorSamples":True,
  "originalLargestPatchSampleCount":len(samples)},samples
results={}
for road in ROADS:
 bpy.ops.wm.open_mainfile(filepath=arg("--source-"+road))
 scene=bpy.context.scene
 assert scene["DO_SCENE_IS_NOT_GAME_WEBGL"] and scene["DR_ACTUAL_B48_MESH_COUNT"]==7
 cx=[x for x in bpy.data.objects if x.get("game_world_xyz_unmodified")]
 b48=[x for x in bpy.data.objects if x.get("MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER")]
 b51=[x for x in bpy.data.objects if x.get("SOURCE_ORIGINAL_B51_ID")]
 movers=[x for x in bpy.data.objects if x.get("R1_B51_ID")]
 assert (len(cx),len(b48),len(b51),len(movers))==(18,7,28,28)
 n=native[road]
 assert n["schema"]=="dopagaki.g4e7dz-r6d-r1-original-early-native/1"
 assert n["sourceCXBlob"]==SRC and n["road"]==road and len(n["frames"])==13
 cams=bpy.data.collections["DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION"]
 early=bpy.data.collections["R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION"]
 assert (len(cams.objects),len(early.objects))==(5,8)
 before=signature(cx,b48,b51)
 all_original=[("CX",o,tree(o)) for o in cx]+[("B48",o,tree(o)) for o in b48]
 per_site={}
 for key,meta in sites.items():
  landing=Vector(key)
  cx_obj=next((o for o in cx if o.name==meta["originalCXSourceName"]),None)
  assert cx_obj is not None,meta["originalCXSourceName"]
  surf,samples=connected(cx_obj,landing)
  views=[]
  for fi,frame in enumerate(n["frames"],1):
   scene.frame_set(fi);bpy.context.view_layer.update()
   cam=cams.objects.get(frame["id"]+" REAL ORIGINAL 240HZ") or early.objects.get("R1 "+frame["id"]+" SOURCE CAMERA")
   assert cam and (cam.location-Vector(frame["eye"])).length<.0002
   active={v["id"] for v in frame["moving"] if v["enabled"]}
   source_nodes=all_original+[("B51",o,tree(o)) for o in movers if o["R1_B51_ID"] in active]
   visible=[];projected=0
   for pt in samples:
    dest=pt+Vector((0,.045,0))
    image=world_to_camera_view(scene,cam,dest)
    if not(image.z>0 and .04<image.x<.96 and .06<image.y<.94):continue
    projected+=1
    ray=dest-cam.location
    if ray.length<1:continue
    hit_first=None
    for kind,obj,tr in source_nodes:
     h,normal,idx,d=tr.ray_cast(cam.location,ray.normalized(),ray.length-.16)
     if h is not None and (hit_first is None or d<hit_first[0]):
      hit_first=(d,kind,obj.name)
    if hit_first is None:visible.append([round(image.x,4),round(image.y,4)])
   views.append({"frame":frame["id"],"actuallyProjectedOriginalSourceFaceSamples":projected,
     "originalCXPatchSamplesNotOccluded":len(visible),
     "normalizedVisibleSampleScreenCoordinates":visible,
     "realScreenPixelAreaCertified":False})
  per_site["|".join(str(x) for x in key)]={
   "landingWorldXYZ":list(key),"originalCXSourceName":meta["originalCXSourceName"],
   "sourceSurfaceTopology":surf,"realOriginalCXSourceCameraViews":views,
   "originalRoadCandidateIds":meta["originalRoadCandidates"]}
 # Baseline moving B51 cue-center projections and occlusion by ORIGINAL static.
 # No invented proposed building; this can establish what future art must not
 # conceal, but NOT human reaction-time clearance.
 baseline=[]
 for fi,frame in enumerate(n["frames"],1):
  scene.frame_set(fi);bpy.context.view_layer.update()
  cam=cams.objects.get(frame["id"]+" REAL ORIGINAL 240HZ") or early.objects.get("R1 "+frame["id"]+" SOURCE CAMERA")
  clear=[]
  for hazard in frame["moving"]:
   if not hazard["enabled"]:continue
   target=Vector(hazard["center"])
   project=world_to_camera_view(scene,cam,target)
   if not(project.z>0 and .04<project.x<.96 and .06<project.y<.94):continue
   ray=target-cam.location
   if ray.length<1:continue
   occluded=any(tr.ray_cast(cam.location,ray.normalized(),ray.length-.20)[0] is not None
       for kind,o,tr in all_original)
   if not occluded:
    clear.append({"id":hazard["id"],"sourceCameraUV":[round(float(project.x),4),round(float(project.y),4)],
       "straightLineDistanceDividedByCurrentSpeedSeconds":round(
          (target-Vector(frame["playerPosition"])).length/max(1,frame["speedMps"]),3)})
  baseline.append({"frame":frame["id"],"baselineOriginalB51CentersVisible":clear})
 assert signature(cx,b48,b51)==before
 results[road]={"realOriginalSourceCXSiteObservations":per_site,
   "originalB51BaselineCenterProjectionByCameraFrame":baseline,
   "sourceSignatureUnchanged":True}
 print("R15K_SOURCE_REAL_CX_TRIANGLE_PATCH",road,
   [(q["originalCXSourceName"],q["sourceSurfaceTopology"]["nearestLanding"],
       q["sourceSurfaceTopology"]["originalLargestConnectedSurfaceAreaProxySqm"],
       [x["frame"] for x in q["realOriginalCXSourceCameraViews"] if x["originalCXPatchSamplesNotOccluded"]>=2])
     for q in per_site.values()],flush=True)
summary=[]
for key,item in sites.items():
 a=results[ROADS[0]]["realOriginalSourceCXSiteObservations"]["|".join(str(x) for x in key)]
 b=results[ROADS[1]]["realOriginalSourceCXSiteObservations"]["|".join(str(x) for x in key)]
 ta=a["sourceSurfaceTopology"];tb=b["sourceSurfaceTopology"]
 assert (ta["nearestLanding"]==tb["nearestLanding"] and
        ta["originalLargestEdgeConnectedUpFacingFaces"]==tb["originalLargestEdgeConnectedUpFacingFaces"])
 common=[x["frame"] for x,y in zip(a["realOriginalCXSourceCameraViews"],b["realOriginalCXSourceCameraViews"])
         if x["originalCXPatchSamplesNotOccluded"]>=2 and y["originalCXPatchSamplesNotOccluded"]>=2]
 frame_ids=[z["frame"] for z in a["realOriginalCXSourceCameraViews"]]
 longest=0;streak=0
 for t in frame_ids:
  streak=streak+1 if t in common else 0
  longest=max(longest,streak)
 connected=bool(ta["originalLargestConnectedSurfaceAreaProxySqm"]>=120 and
                ta["originalLargestPatchSampleCount"]>=10 and longest>=5 and
                ta["nearestLanding"]["sourceFaceLocated"] and
                ta["nearestLanding"]["nearestFaceNormalY"]>=.70)
 summary.append({"landingWorldXYZ":list(key),"originalCXSourceName":item["originalCXSourceName"],
  "originalRoadCandidateIds":item["originalRoadCandidates"],
  "sameFrameTwoRoadOriginalCXSurfaceVisible2Samples":common,
  "maxConsecutiveMatchedOriginalHalfSecondFrames":longest,
  "largestSourceUpFacingPatchAreaProxySqm":ta["originalLargestConnectedSurfaceAreaProxySqm"],
  "nearLandingOriginalSourceNormalY":ta["nearestLanding"]["nearestFaceNormalY"],
  "sourceSurfacePreliminaryKeepForNewSiteResearch":connected,
  "structuralOrArtOrGameApproval":False})
summary.sort(key=lambda x:(-int(x["sourceSurfacePreliminaryKeepForNewSiteResearch"]),
 -len(x["sameFrameTwoRoadOriginalCXSurfaceVisible2Samples"]),
 -x["largestSourceUpFacingPatchAreaProxySqm"],x["originalCXSourceName"]))
report={"schema":"dopagaki.r15k-original-cx-patch-paired-camera-obstacle-baseline-site-falsification/1",
 "originalSourceCXBlob":SRC,"originalSourceGeometry":{"CX":18,"B48":7,"B51":28,"physicsHz":240},
 "originalRoadVariants":list(ROADS),"priorR15I4DifferentRoadCandidateIds":8,
 "actualDistinctOriginalCXLandingCoordinates":len(sites),
 "rankedActualOriginalCXSourceSurfaceVisibilityPreflight":summary,
 "originalSourceEvidenceByRoad":results,
 "projectedOriginalB51CenterNotHumanWarningCertification":True,
 "anyNewStudyMeshConstructed":False,"newGameColliders":0,
 "sourceGameEdited":False,"actualGameWebGLRendered":False,
 "certifiedRealContinuousPublicFloor":False,"humanStructuralLoadingTested":False,
 "humanActualArtApproved":False,"officialArt":0,"officialSlope2Meters":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD","PERFORMANCE":"HOLD","INTEGRATION":"HOLD",
 "RELEASE":"HOLD","MERGE":"HOLD"}
with open(os.path.join(OUT,"R15K_TRUE_ORIGINAL_CX_PATCH_TWO_WORLD_CAMERA_BASELINE.json"),"w",encoding="utf8") as h:
 json.dump(report,h,indent=2,ensure_ascii=False)
print("R15K_FOUR_REAL_CX_LANDING_SITES_PROBE_ONLY",len(sites),
 "KEEP_UNDER_RESEARCH",sum(x["sourceSurfacePreliminaryKeepForNewSiteResearch"] for x in summary),
 "NO NEW ART / NO HUMAN / NO WEBGL",flush=True)
