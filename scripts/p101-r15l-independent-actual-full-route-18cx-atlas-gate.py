"""R15L independent cross-source actual replay and wide real CX atlas audit.

Original immutable game code is verified by CI git hash. Recompute true
native 240Hz replay frame stepping/IDs and cross-variant matching, original
source mover-centre frustum counts, source projected rectangles, conservative
B51 guard truth, 25-point terrain witness counts, paired original-world
identity and longest uninterrupted 0.5s visibility. Never certify art,
human access or actual browser WebGL from this source-only evidence.
"""
import argparse,copy,json,math,os
p=argparse.ArgumentParser()
for k in ("native-true-pinch","native-pinch-switch","atlas","out"):
 p.add_argument("--"+k,required=True)
a=p.parse_args()
read=lambda f:json.load(open(f,encoding="utf8"))
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
roads=("true-pinch","pinch-switch")
native={r:read(getattr(a,"native_"+r.replace("-","_"))) for r in roads}
raw=read(a.atlas)
def dot(x,y):return sum(a*b for a,b in zip(x,y))
def sub(x,y):return [a-b for a,b in zip(x,y)]
def cross(x,y):return [x[1]*y[2]-x[2]*y[1],x[2]*y[0]-x[0]*y[2],x[0]*y[1]-x[1]*y[0]]
def norm(x):
 l=math.sqrt(dot(x,x));assert l>1e-9
 return [v/l for v in x]
def projected(frame,pt):
 f=norm(frame["front"]);r=norm(cross(f,[0,1,0]));u=cross(r,f)
 d=sub(pt,frame["eye"]);z=dot(d,f)
 if z<=.1:return None
 return (1008*(.5+.675*dot(r,d)/z/(1008/645)),
         645*(.5-.675*dot(u,d)/z))
def screen(uv):
 return uv is not None and 12<=uv[0]<=996 and 12<=uv[1]<=633
def validate(data):
 assert data["schema"]=="dopagaki.r15l-actual-native-all-replayable-times-18cx-seven-b48-two-road-land-atlas/1"
 assert data["sourceBlob"]==SRC
 assert data["actualPlayableOriginalTimeIsNotAssumedToBe52Seconds"] is True
 assert data["exactOriginalGeometry"]=={"CX":18,"B48":7,"B51":28,"nativeHz":240}
 assert all(data[k] is False for k in ("originalGameSourceEdited","actualNewBlenderCityCreated",
   "fullHumanWalkCertified","allOriginalHazard3DContinuousVisualSafety",
   "realRenderedFinalArtApproved","browserWebGLRendered"))
 assert (data["newGameColliders"],data["officialArt"],data["officialSlope2Meters"])==(0,0,0)
 assert all(data[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
 frames={}
 for road in roads:
  n=native[road]
  assert n["schema"]=="dopagaki.r15l-actual-native-full-available-start00-two-road-screen-replay/1"
  assert n["sourceBlob"]==SRC and n["road"]==road
  assert (n["originalCX"],n["originalB48"],n["originalB51"],n["originalCameras"],n["physicsHz"])==(18,7,28,5,240)
  assert n["originalGameSourceEdited"] is False
  assert n["sourceP96FixedSteeringUnmodified"] is True
  assert n["humanControlActuallyTested"] is False
  assert n["actualWebGLRendered"] is False
  assert n["originalGameplayFullRunCertified"] is False
  assert n["newSourceGameColliders"]==n["officialArt"]==n["officialSlope2Meters"]==0
  assert len(n["originalR1OverlappingTrue13FramesParity"])==13
  assert n["originalR1OverlappingTrue13FramesParity"]==["t"+str(k) for k in range(1100,1701,50)]
  fs=n["originalFullTimelineFrames"];assert len(fs)>=13
  ids=[f["id"] for f in fs];assert len(ids)==len(set(ids))
  assert ids==["t"+str(i*50).zfill(4) for i in range(1,len(fs)+1)]
  for f in fs:
   assert f["tick"]==round(f["seconds"]*240)
   assert f["originalSource"]=="ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN"
   assert len(f["moving"])==28
   assert len(f["eye"])==len(f["front"])==len(f["playerPosition"])==3
   assert all(math.isfinite(q) for q in f["eye"]+f["front"]+f["playerPosition"])
   assert f["speedMps"]>=0 and math.isfinite(f["speedMps"])
   assert len({m["id"] for m in f["moving"]})==28
   assert all(len(m["center"])==len(m["halfSize"])==3 and
     all(z>0 for z in m["halfSize"]) for m in f["moving"])
  assert n["observedToTimeSeconds"]==fs[-1]["seconds"]
  assert n["observedToTimeSeconds"]<=n["actualRunnerTimeSeconds"]+.00001
  frames[road]={f["id"]:f for f in fs}
 shared=sorted(set(frames[roads[0]])&set(frames[roads[1]]),key=lambda t:int(t[1:]))
 assert shared==data["commonOriginalNativeHalfSecondFrames"]
 assert len(shared)>=13
 assert any(int(t[1:])<1100 for t in shared)
 assert any(int(t[1:])>1700 for t in shared), "R15L_NOT_BROAD_BEYOND_R1_WINDOW"
 assert data["originalNativeTimeWindowsActuallyObserved"]=={
  r:[x["seconds"] for x in native[r]["originalFullTimelineFrames"]] for r in roads}
 world=data["originalWorldByRoad"]
 assert set(world)==set(roads)
 candidate={}
 for road in roads:
  w=world[road]
  assert w["originalSourceObjectCounts"]=={"CX":18,"B48":7,"B51":28}
  assert w["originalSourceGeometrySignatureMatchedBothWorlds"] is True
  assert w["originalNativeFrameSamples"]==len(frames[road])
  assert len(w["eachSourceCXMeshTopFaceStats"])==18
  assert len(w["sourceBroadCandidateEvaluations"])<=240
  assert all(x["candidateTopFaceSamples"]>=0 and x["originalTopFacingTriangles"]>=0
     for x in w["eachSourceCXMeshTopFaceStats"].values())
  on_screen_counts={time:sum(
    m["enabled"] is not False and screen(projected(frames[road][time],m["center"]))
    for m in frames[road][time]["moving"]) for time in shared}
  unique=set();candidate[road]={}
  for x in w["sourceBroadCandidateEvaluations"]:
   site=(x["originalCXMeshName"],tuple(x["sourceFacePointXYZ"]),x["originalFace"])
   assert site not in unique;unique.add(site)
   assert x["originalCXMeshName"] in w["eachSourceCXMeshTopFaceStats"]
   assert len(x["sourceFacePointXYZ"])==3
   assert x["originalRoadToCXPublicPathBuilt"] is False
   assert 0<=x["closestActualOriginalB48RoadSurfaceDistanceMetres"]<=250
   assert len(x["closestOriginalB48PointXYZ"])==3
   assert len(x["sourceOriginalCameraAllFrames"])==len(shared)
   assert [y["id"] for y in x["sourceOriginalCameraAllFrames"]]==shared
   assert all(time in shared and screen(projected(frames[road][time],
    [x["sourceFacePointXYZ"][0],x["sourceFacePointXYZ"][1]+18,
     x["sourceFacePointXYZ"][2]])) for time in x["screenCentrePreflightPairedFrames"])
   assert set(x["squareFloor5x5SourceUpFaceWitnesses"])=={"6","10","16"}
   assert any(q["originalTopFaceSupportCellsOf25"]>=12 for q in x["squareFloor5x5SourceUpFaceWitnesses"].values())
   for width,q in x["squareFloor5x5SourceUpFaceWitnesses"].items():
    assert 0<=q["originalTopFaceSupportCellsOf25"]<=25
    assert q["originalTopFaceSampleHeightVariationMetres"] is None or q["originalTopFaceSampleHeightVariationMetres"]>=0
   for f in x["sourceOriginalCameraAllFrames"]:
    assert 0<=f["unoccludedVirtual3DPointCount"]<=14
    assert f["originalMovingB51CenterOnScreenCount"]==on_screen_counts[f["id"]]
    bbox=f["screenSampleBoundsNotSurfaceSilhouette"]
    if bbox is None:
     assert f["unoccludedVirtual3DPointCount"]==0 and f["screenBoundingAreaPixelsSq"]==0
     assert f["sourceOriginalB51ConservativeEnvelopeScreenDistancePixels"] is None
    else:
     assert len(bbox)==4 and bbox[0]<=bbox[2] and bbox[1]<=bbox[3]
     assert 12<=bbox[0]<=996 and 12<=bbox[2]<=996
     assert 12<=bbox[1]<=633 and 12<=bbox[3]<=633
     assert abs(round((bbox[2]-bbox[0])*(bbox[3]-bbox[1]),2)
       -f["screenBoundingAreaPixelsSq"])<.5
     assert f["unoccludedVirtual3DPointCount"]>0
    distance=f["sourceOriginalB51ConservativeEnvelopeScreenDistancePixels"]
    assert f["within48pxOriginalB51SourceScreenGuard"]==(
     distance is not None and distance<=48)
   candidate[road][site]=x
 matching=sorted(set(candidate[roads[0]])&set(candidate[roads[1]]),key=str)
 assert len(matching)==data["twoRoadOriginalCXSiteCount"]
 entries=data["twoRoadExactSameWorldCXSiteStudies"]
 assert len(entries)==len(matching)
 assert len({(q["originalCXMesh"],tuple(q["siteXYZ"]),q["exactSourceOriginalFaceId"]) for q in entries})==len(entries)
 evaluated=[]
 for entry in entries:
  site=(entry["originalCXMesh"],tuple(entry["siteXYZ"]),entry["exactSourceOriginalFaceId"])
  assert site in matching
  a,b=(candidate[road][site] for road in roads)
  assert a["squareFloor5x5SourceUpFaceWitnesses"]==b["squareFloor5x5SourceUpFaceWitnesses"]
  dist=[a["closestActualOriginalB48RoadSurfaceDistanceMetres"],
        b["closestActualOriginalB48RoadSurfaceDistanceMetres"]]
  assert entry["originalB48NearestSourceDistanceTwoRoadMetres"]==dist
  supported=max([int(k) for k,v in a["squareFloor5x5SourceUpFaceWitnesses"].items()
      if v["originalTopFaceSupportCellsOf25"]==25] or [0])
  assert entry["originalGroundUpFace25PointLargestSupportedFootprintSideMetres"]==supported
  visible=[];risk=[]
  for fa,fb in zip(a["sourceOriginalCameraAllFrames"],b["sourceOriginalCameraAllFrames"]):
   assert fa["id"]==fb["id"]
   if min(fa["unoccludedVirtual3DPointCount"],fb["unoccludedVirtual3DPointCount"])>=4 and (
     min(fa["screenBoundingAreaPixelsSq"],fb["screenBoundingAreaPixelsSq"])>=1600):
    visible.append(fa["id"])
   if fa["within48pxOriginalB51SourceScreenGuard"] or fb["within48pxOriginalB51SourceScreenGuard"]:
    risk.append(fa["id"])
  assert entry["bothRoadOriginalSource2DBoxVisibleFrames"]==visible
  assert entry["originalB51ConservativeGuardResearchFrames"]==risk
  longest=consecutive=0
  for x in shared:
   consecutive=consecutive+1 if x in visible else 0
   longest=max(longest,consecutive)
  assert entry["longestContinuousTwoRoadOriginalHalfSecondFrames"]==longest
  eligible=longest>=5 and supported>=6 and not (set(visible)&set(risk)) and max(dist)<=75
  assert entry["eligibleOnlyForFurtherRoadAndArchitectureResearch"]==eligible
  assert entry["actualOriginalRoadToSiteContinuousWalkBuilt"] is False
  assert entry["newCityActuallyBuiltAndRendered"] is False
  assert entry["humanObstacleWarningFairnessCertified"] is False
  score=round(longest*100+len(visible)*15-max(dist)*.2,3)
  assert entry["sourceCameraOnlySiteRankScore"]==score
  evaluated.append(entry)
 evaluated.sort(key=lambda q:(-int(q["eligibleOnlyForFurtherRoadAndArchitectureResearch"]),
  -q["longestContinuousTwoRoadOriginalHalfSecondFrames"],
  -q["originalGroundUpFace25PointLargestSupportedFootprintSideMetres"],
  -q["sourceCameraOnlySiteRankScore"],q["originalCXMesh"],q["exactSourceOriginalFaceId"]))
 assert entries==evaluated
 assert data["preliminaryResearchGateSurvivorCount"]==sum(q["eligibleOnlyForFurtherRoadAndArchitectureResearch"] for q in entries)
 return {"originalNativeTrueFrameCountByRoad":{r:len(frames[r]) for r in roads},
  "originalTwoRoadSharedActual0p5sFrames":len(shared),
  "sourceOriginalCXMeshesInspected":18,"originalB48RoadVariantsInspected":2,
  "twoRoadSameXYZSourceSiteCount":len(entries),
  "strictResearchCandidateCount":data["preliminaryResearchGateSurvivorCount"],
  "actualArtAccessOrSafetyCertified":False}
result=validate(raw)
def reject(name,fn):
 d=copy.deepcopy(raw);fn(d)
 try:validate(d)
 except (AssertionError,KeyError,TypeError,ValueError,IndexError):return name
 raise AssertionError("R15L_FAKE_PASS "+name)
# Make all robust even if no same-site candidate is discovered.
fake=[
 ("ART",lambda d:d.__setitem__("officialArt",1)),
 ("GAMEPLAY",lambda d:d.__setitem__("GAMEPLAY","PASS")),
 ("WEBGL",lambda d:d.__setitem__("browserWebGLRendered",True)),
 ("INGRESS",lambda d:d.__setitem__("fullHumanWalkCertified",True)),
 ("B51_CERT",lambda d:d.__setitem__("allOriginalHazard3DContinuousVisualSafety",True)),
 ("SRC",lambda d:d.__setitem__("sourceBlob","tampered")),
 ("TIME_52",lambda d:d.__setitem__("actualPlayableOriginalTimeIsNotAssumedToBe52Seconds",False)),
 ("FAKE_MESH",lambda d:d.__setitem__("exactOriginalGeometry",{"CX":19,"B48":7,"B51":28,"nativeHz":240})),
 ("COLLIDER",lambda d:d.__setitem__("newGameColliders",1)),
 ("MESH",lambda d:d.__setitem__("actualNewBlenderCityCreated",True)),
 ("SITE_COUNT",lambda d:d.__setitem__("twoRoadOriginalCXSiteCount",-1)),
 ("MULTISITE",lambda d:d.__setitem__("preliminaryResearchGateSurvivorCount",999)),
 ("TIMES",lambda d:d["commonOriginalNativeHalfSecondFrames"].pop()),
 ("ROAD",lambda d:d["originalWorldByRoad"]["true-pinch"].__setitem__("originalNativeFrameSamples",0)),
 ("RENDER",lambda d:d.__setitem__("realRenderedFinalArtApproved",True)),
 ("PHYSICAL",lambda d:d.__setitem__("officialSlope2Meters",50))]
if raw["twoRoadExactSameWorldCXSiteStudies"]:
 fake.extend([
 ("SITEFRAME",lambda d:d["twoRoadExactSameWorldCXSiteStudies"][0].__setitem__("longestContinuousTwoRoadOriginalHalfSecondFrames",500)),
 ("SITE_WALK",lambda d:d["twoRoadExactSameWorldCXSiteStudies"][0].__setitem__("actualOriginalRoadToSiteContinuousWalkBuilt",True))])
result["adversarialFalsePromotionRejected"]=[reject(name,fn) for name,fn in fake]
result.update({"schema":"dopagaki.r15l-independent-two-road-true-240hz-18cx-camera-atlas-gate/1",
 "originalSourceBlob":SRC,"independentCrossRoadSourcePointAndFrameCountRecomputed":True,
 "realWebGLOrHumanWalkOrArtApproved":False,
 "officialArt":0,"officialSlope2Meters":0,"ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD"})
os.makedirs(a.out,exist_ok=True)
with open(os.path.join(a.out,"R15L_INDEPENDENT_WIDE_ORIGINAL_NATIVE_CX_B48_B51_ATLAS_QA.json"),"w",encoding="utf8") as f:
 json.dump(result,f,indent=2,ensure_ascii=False)
print("R15L_INDEPENDENT_WIDE_TWO_NATIVE_SOURCE_ATLAS",result,flush=True)
