"""R15K4: actual ORIGINAL B48/CX 3D BVH support-vs-camera macro-volume falsification.

A measured source-only STOP gate, not actual city construction. Pairs two
original roads, two UNIQUE CX surface patches and five original B48 rims.
Measures 41x3 flat-line path support; this does NOT construct or prove a
Bezier/public walking route. Samples 30 virtual BOXES (never meshes) from
original camera 13 times and original CX/B48 source BVH blockers; compares
their screen rectangles against conservative R15K3 source B51 3D ±yaw
envelopes. Never call an on-screen empty or center-invisible hazard "safe".
"""
import bpy,sys,json,os,math
from mathutils import Vector
from mathutils.bvhtree import BVHTree
args=sys.argv[sys.argv.index("--")+1:]
def A(key):
 assert key in args,key
 return args[args.index(key)+1]
OUT=A("--out");os.makedirs(OUT,exist_ok=True)
load=lambda path:json.load(open(path,encoding="utf8"))
K=load(A("--r15k"));K3=load(A("--r15k3"));I4=load(A("--r15i4"))
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
ROADS=("true-pinch","pinch-switch")
assert K["originalSourceCXBlob"]==K3["sourceBlob"]==I4["sourceBlob"]==SRC
assert len(K["rankedActualOriginalCXSourceSurfaceVisibilityPreflight"])==4
assert (K3["officialArt"],K3["newSourceGameColliders"])==(0,0)
names=("02 roadbank-promenade None","04 roadbank-promenade None")
styles=(("NEAR_8M_X_14H",8.,8.,14.),("CIVIC_14M_X_24H",14.,14.,24.),
        ("MACRO_24M_X_48H",24.,24.,48.))
offsets=((0.,0.),(-8.,0.),(8.,0.),(0.,-8.),(0.,8.))
canvasW,canvasH=1008,645
safe_orig=K3["twoRoadTwoCXOriginalCameraDetailedComparisons"]
hazards={(x["road"],x["originalCXPatchName"]):{
 y["frame"]:[b["conservativeYawSignUnionScreenBox"] for b in y["projectedOriginalMovers"]]
 for y in x["originalSourceRealCameraFrames"]} for x in safe_orig}
assert len(hazards)==4
originalCandidates=[x for x in I4["commonTwoWorldOriginalCXSourceResearchRows"]
 if x["originalGameGeometryAndCXSupportCandidateOnly"] and x["originalCXSourceMeshName"] in names]
assert len(originalCandidates)==5
site={name:[] for name in names}
for x in originalCandidates:site[x["originalCXSourceMeshName"]].append(x)
assert [len(site[name]) for name in names]==[2,3]
landing={name:Vector(site[name][0]["originalCXTerrainLandingWorldXYZ"]) for name in names}
for name in names:
 assert all((Vector(x["originalCXTerrainLandingWorldXYZ"])-landing[name]).length<6
            for x in site[name])
native={road:load(A("--native-"+road)) for road in ROADS}
def tree(obj):
 return BVHTree.FromPolygons(
  [tuple(obj.matrix_world@v.co) for v in obj.data.vertices],
  [tuple(poly.vertices) for poly in obj.data.polygons],all_triangles=False)
def norm(v):
 return v.normalized()
def source_projection(frame,p):
 f=Vector(frame["front"]).normalized()
 right=f.cross(Vector((0,1,0))).normalized()
 up=right.cross(f)
 delta=p-Vector(frame["eye"]);depth=f.dot(delta)
 if depth<=.01:return None
 return (canvasW*(.5+.675*right.dot(delta)/depth/(canvasW/canvasH)),
         canvasH*(.5-.675*up.dot(delta)/depth))
def rect_distance(a,b):
 return math.hypot(max(a[0]-b[2],b[0]-a[2],0),
                   max(a[1]-b[3],b[1]-a[3],0))
def original_ground_at(point,objects):
 origin=point+Vector((0,3,0));direction=Vector((0,-1,0));nearest=None
 for o,t in objects:
  h,n,idx,d=t.ray_cast(origin,direction,7.5)
  if h is not None and (nearest is None or d<nearest[0]):
   nearest=(d,o.name,round(float(n.y),5),h)
 if nearest is None:return {"originalUpperSurfaceWithin4p5m":False,"mesh":None,
     "upwardOriginalFaceNormal":False,"verticalErrorMetres":None}
 delta=abs(point.y-nearest[3].y)
 return {"originalUpperSurfaceWithin4p5m":delta<=1.75 and nearest[2]>=.70,
   "mesh":nearest[1],"upwardOriginalFaceNormal":nearest[2]>=.70,
   "verticalErrorMetres":round(float(delta),3)}
def original_occluded(eye,point,objects):
 delta=point-eye;dist=delta.length
 if dist<.02:return False
 direction=delta.normalized()
 for obj,bvh in objects:
  hit,normal,i,d=bvh.ray_cast(eye,direction,max(0.001,dist-.18))
  if hit is not None:return True
 return False
results={}
for road in ROADS:
 bpy.ops.wm.open_mainfile(filepath=A("--source-"+road))
 cx=[o for o in bpy.data.objects if o.get("game_world_xyz_unmodified")]
 b48=[o for o in bpy.data.objects if o.get("MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER")]
 b51=[o for o in bpy.data.objects if o.get("SOURCE_ORIGINAL_B51_ID")]
 movers=[o for o in bpy.data.objects if o.get("R1_B51_ID")]
 assert (len(cx),len(b48),len(b51),len(movers))==(18,7,28,28)
 originals=[(o,tree(o)) for o in cx+b48]
 n=native[road]
 assert n["road"]==road and n["sourceCXBlob"]==SRC and len(n["frames"])==13
 views={}
 for name in names:
  # The 04 patch appears at two landing coordinates ~5 metres apart.
  # Use the face-connected 216sqm as one common district, two study anchors.
  chosen=site[name]
  approaches=[]
  for case in chosen:
   road_xyz=Vector(case["originalRoadRimXYZ"])
   end_xyz=Vector(case["originalCXTerrainLandingWorldXYZ"])
   dxz=Vector((end_xyz.x-road_xyz.x,0,end_xyz.z-road_xyz.z))
   perp=Vector((-dxz.z,0,dxz.x)).normalized()*1.5
   station=[]
   for i in range(41):
    t=i/40
    origin=road_xyz.lerp(end_xyz,t)
    witnesses=[original_ground_at(origin+perp*f,originals) for f in (-1,0,1)]
    station.append({"s":i,
      "sourceWorldXYZ":[round(float(v),4) for v in origin],
      "threeAcrossSamplesSupported":sum(q["originalUpperSurfaceWithin4p5m"] for q in witnesses),
      "sourceSupportWitnessMeshes":sorted({q["mesh"] for q in witnesses if q["originalUpperSurfaceWithin4p5m"]}),
      "groundProximityInspectedNotWalkability":True})
   gaps=[q["s"] for q in station if q["threeAcrossSamplesSupported"]<3]
   # Any missing station invalidates *full-width* support. Longest continuous
   # missing run retained for a corridor construction research estimate.
   streak=longest=0
   for q in station:
    streak=streak+1 if q["threeAcrossSamplesSupported"]<3 else 0
    longest=max(longest,streak)
   approaches.append({"id":case["id"],
     "originalB48RimXYZ":case["originalRoadRimXYZ"],
     "originalSourceCXLandingXYZ":case["originalCXTerrainLandingWorldXYZ"],
     "originalPriorTheoreticalBezierLengthMetres":case["theoreticalBezierApproachMetres"],
     "originalPriorTheoreticalMaxSlope":case["theoretical32SegmentMaxSlope"],
     "straightLineTestCentres":station,
     "fullWidthSourceSupportedStationsOf41":41-len(gaps),
     "fullWidthSourceMissingStationsOf41":len(gaps),
     "longestSequentialUnsupportedFullWidthStations":longest,
     "sourceVerifiedContinuousWalkablePath":False,
     "hypotheticalLineIsNotOriginalRoadOrApprovedBezier":True})
  # Pair the two roads only after measuring the same proposed 3D volumes.
  volumes=[]
  center=landing[name]
  for dx,dz in offsets:
   for label,wide,deep,height in styles:
    px=center.x+dx;pz=center.z+dz;y=center.y
    anchors=[Vector((px+xx*wide*.5,y,pz+zz*deep*.5))
             for xx,zz in ((-1,-1),(-1,1),(1,-1),(1,1),(0,0))]
    footprints=[original_ground_at(v,originals) for v in anchors]
    supported=sum(q["originalUpperSurfaceWithin4p5m"] and
       (q["mesh"]==name) for q in footprints)
    # Derived virtual box: 8 corners + 6 actual face centers; no bpy.mesh.
    probes=[]
    for x in (-wide/2,wide/2):
     for z in (-deep/2,deep/2):
      for h in (0,height):probes.append(Vector((px+x,y+h,pz+z)))
    probes += [Vector((px,y,pz)),Vector((px,y+height,pz)),
      Vector((px-wide/2,y+height/2,pz)),Vector((px+wide/2,y+height/2,pz)),
      Vector((px,y+height/2,pz-deep/2)),Vector((px,y+height/2,pz+deep/2))]
    assert len(probes)==14
    frames=[]
    for frame in n["frames"]:
     raw=[];unoccluded=[];eye=Vector(frame["eye"])
     for point in probes:
      uv=source_projection(frame,point)
      if uv is None:continue
      if not (12<uv[0]<canvasW-12 and 12<uv[1]<canvasH-12):continue
      raw.append(uv)
      if not original_occluded(eye,point,originals):unoccluded.append(uv)
     # Occlusion-sensitive SAMPLE bounding rectangle, not a real 3D mesh
     # silhouette or full raster coverage. Do not call it screen area.
     if unoccluded:
      bbox=[round(min(q[0] for q in unoccluded),3),
            round(min(q[1] for q in unoccluded),3),
            round(max(q[0] for q in unoccluded),3),
            round(max(q[1] for q in unoccluded),3)]
      area=round((bbox[2]-bbox[0])*(bbox[3]-bbox[1]),1)
      nearby=[round(rect_distance(bbox,ob),3) for ob in hazards[(road,name)][frame["id"]]]
      nearest=min(nearby) if nearby else None
      hazard_near=bool(nearby and nearest<=48)
     else:bbox=None;area=0.;nearest=None;hazard_near=False
     frames.append({"frame":frame["id"],"projectedSourceVirtualBoxSamples":len(raw),
       "originalCXB48UnoccludedVirtualBoxSamples":len(unoccluded),
       "visibleSampleBoundingRectNotSilhouette":bbox,
       "visibleSamplesScreenRectAreaProxyPixelsSq":area,
       "projectedOriginalB51CenterVisibleBoundingRectsChecked":len(hazards[(road,name)][frame["id"]]),
       "nearestOriginalB51ConservativeScreenBoxPixels":nearest,
       "originalB51Guard48pxTouched":hazard_near,
       "realWebGLOrHumanWarningCertified":False})
    first={x["frame"] for x in frames
      if x["originalCXB48UnoccludedVirtualBoxSamples"]>=4
      and x["visibleSamplesScreenRectAreaProxyPixelsSq"]>=2500}
    protected={x["frame"] for x in frames if x["originalB51Guard48pxTouched"]}
    volumes.append({"id":name+"|"+str(dx)+"|"+str(dz)+"|"+label,
      "sourceCXName":name,
      "originalCXLandingReferenceXYZ":[round(float(v),4) for v in center],
      "virtualCentreXYZ":[round(float(v),4) for v in (px,y,pz)],
      "virtualFootprintWidthDepthHeightMetres":[wide,deep,height],
      "originalSourceFootprintSupportChecksFive":footprints,
      "originalCXGroundSupportWitnessCount":supported,
      "unmodifiedSourceCameraFrames":frames,
      "sourceOnlyProjectedVolumeReadableFrames":sorted(first),
      "sourceOnlyHazardGuardConcernFrames":sorted(protected),
      "noActualMeshOrCollider":True})
  views[name]={"originalB48ToCXStraightLineSupportProbes":approaches,
               "virtualStudyVolumesNoMesh":volumes}
 results[road]=views
 print("R15K4_TRUE_ORIGINAL_SOURCE_BVH",road,
    [(q,len(views[q]["originalB48ToCXStraightLineSupportProbes"]),
      [(p["fullWidthSourceSupportedStationsOf41"],p["longestSequentialUnsupportedFullWidthStations"]) for p in views[q]["originalB48ToCXStraightLineSupportProbes"]],
      sum(v["originalCXGroundSupportWitnessCount"]==5 for v in volumes if v["sourceCXName"]==q))
     for q in names],flush=True)
# Pair matching virtual box IDs in BOTH source variants, not alternative cities.
paired=[]
for name in names:
 a=results[ROADS[0]][name]["virtualStudyVolumesNoMesh"]
 b=results[ROADS[1]][name]["virtualStudyVolumesNoMesh"]
 assert len(a)==len(b)==len(offsets)*len(styles)==15
 for x,y in zip(a,b):
  assert x["id"]==y["id"] and x["virtualCentreXYZ"]==y["virtualCentreXYZ"]
  common=set(x["sourceOnlyProjectedVolumeReadableFrames"]) & set(y["sourceOnlyProjectedVolumeReadableFrames"])
  danger=set(x["sourceOnlyHazardGuardConcernFrames"]) | set(y["sourceOnlyHazardGuardConcernFrames"])
  longest=streak=0
  for frame in native[ROADS[0]]["frames"]:
   streak=streak+1 if frame["id"] in common else 0
   longest=max(longest,streak)
  # Not a claim of "safe" for B51 whose centre was originally off-screen.
  study=bool(longest>=5 and x["originalCXGroundSupportWitnessCount"]==5 and
      y["originalCXGroundSupportWitnessCount"]==5 and not (common&danger))
  paired.append({"virtualVolumeId":x["id"],"site":name,
   "sourceSameWorldFootprintFull5PointSupport":x["originalCXGroundSupportWitnessCount"]==5 and y["originalCXGroundSupportWitnessCount"]==5,
   "sourceCameraBothRoadsReadableFrames":sorted(common),
   "sourceCameraLongestConsecutiveHalfSecondReadableFrames":longest,
   "originalB51ConservativeCenterVisibleGuardConcernFrames":sorted(danger),
   "screenBVHSourceOnlyPreliminaryResearchCandidate":study,
   "actuallyBuildableConnectedAndVisuallyBeautifulCertified":False})
paired.sort(key=lambda q:(-int(q["screenBVHSourceOnlyPreliminaryResearchCandidate"]),
 -q["sourceCameraLongestConsecutiveHalfSecondReadableFrames"],
 len(q["originalB51ConservativeCenterVisibleGuardConcernFrames"]),q["virtualVolumeId"]))
report={"schema":"dopagaki.r15k4-real-original-b48-cx-support-and-virtual-macro-screen-bvh-falsification/1",
 "sourceBlob":SRC,"sourceR15K3ShapeAndVisibilityFromRealOriginalR1":True,
 "sourceOriginalGeometry":{"CX":18,"B48":7,"B51":28,"physicsHz":240},
 "twoOriginalRoads":list(ROADS),"twoDistinctOriginalCXTerrainPatches":list(names),
 "originalR15I4TheoreticalRoadRimHypotheses":len(originalCandidates),
 "originalTwoRoadOriginalRimCxStraightLineSources":results,
 "twoRoadPairedSourceOnlyVirtualVolumeScreenRanking":paired,
 "hypotheticalBoxDesignCount":len(paired),
 "originalSourceGameModified":False,"actualNewBlenderMeshesCreated":False,
 "newSourceGameColliders":0,"humanWalkingEntranceVerified":False,
 "structuralLoadsVerified":False,"originalB51AllHazardsContinuousFullVisibilityCertified":False,
 "actualGameWebGLRendered":False,"actualHumanArtworkApproved":False,
 "officialArt":0,"officialSlope2Meters":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD","PERFORMANCE":"HOLD",
 "INTEGRATION":"HOLD","RELEASE":"HOLD","MERGE":"HOLD"}
with open(os.path.join(OUT,"R15K4_REAL_SOURCE_CX_B48_PATH_AND_VIRTUAL_MACRO_VOLUMES.json"),"w",encoding="utf8") as o:
 json.dump(report,o,indent=2,ensure_ascii=False)
print("R15K4_ACTUAL_ORIGINAL_SOURCE_NO_NEW_MESHES_2_ROAD_30_VOLUMES",
 len(paired),"site-stage survivors",
 sum(z["screenBVHSourceOnlyPreliminaryResearchCandidate"] for z in paired),
 "ART/HUMAN/GAMEPLAY/RELEASE_HOLD",flush=True)
