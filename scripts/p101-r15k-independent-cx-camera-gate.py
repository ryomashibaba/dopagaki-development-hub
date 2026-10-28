"""R15K independent replay of ORIGINAL CX/road/camera study; adversarial contract.
No art promotion, no fabricated area or camera frame successes.
"""
import json,argparse,os,copy,math
P=argparse.ArgumentParser()
for x in ("result","r15i4","out"):P.add_argument("--"+x,required=True)
args=P.parse_args()
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
ROADS=("true-pinch","pinch-switch")
raw=json.load(open(args.result,encoding="utf8"))
prior=json.load(open(args.r15i4,encoding="utf8"))
def gate(d):
 assert d["schema"]=="dopagaki.r15k-original-cx-patch-paired-camera-obstacle-baseline-site-falsification/1"
 assert d["originalSourceCXBlob"]==prior["sourceBlob"]==SRC
 assert d["originalSourceGeometry"]=={"CX":18,"B48":7,"B51":28,"physicsHz":240}
 assert d["originalRoadVariants"]==list(ROADS)
 assert d["priorR15I4DifferentRoadCandidateIds"]==8
 assert d["projectedOriginalB51CenterNotHumanWarningCertification"] is True
 assert d["anyNewStudyMeshConstructed"] is False
 assert d["sourceGameEdited"] is d["actualGameWebGLRendered"] is False
 for k in ("certifiedRealContinuousPublicFloor","humanStructuralLoadingTested","humanActualArtApproved"):
  assert d[k] is False,k
 assert (d["officialArt"],d["officialSlope2Meters"],d["newGameColliders"])==(0,0,0)
 assert all(d[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
 original=[x for x in prior["commonTwoWorldOriginalCXSourceResearchRows"]
  if x["originalGameGeometryAndCXSupportCandidateOnly"]]
 assert len(original)==8
 coords={}
 for x in original:
  coord=tuple(x["originalCXTerrainLandingWorldXYZ"])
  coords.setdefault(coord,[]).append(x["id"])
 assert len(coords)==d["actualDistinctOriginalCXLandingCoordinates"]==4
 byroad=d["originalSourceEvidenceByRoad"]
 assert set(byroad)==set(ROADS)
 for road in ROADS:
  v=byroad[road]
  assert v["sourceSignatureUnchanged"] is True
  assert len(v["realOriginalSourceCXSiteObservations"])==4
  obs=v["realOriginalSourceCXSiteObservations"]
  assert len(v["originalB51BaselineCenterProjectionByCameraFrame"])==13
  for obj in v["originalB51BaselineCenterProjectionByCameraFrame"]:
   assert isinstance(obj["baselineOriginalB51CentersVisible"],list)
   assert all(len(q["sourceCameraUV"])==2 and
    0<q["sourceCameraUV"][0]<1 and 0<q["sourceCameraUV"][1]<1
     and q["straightLineDistanceDividedByCurrentSpeedSeconds"]>=0
     for q in obj["baselineOriginalB51CentersVisible"])
  assert len({f["frame"] for f in v["originalB51BaselineCenterProjectionByCameraFrame"]})==13
  for key,site in obs.items():
   xyz=tuple(site["landingWorldXYZ"])
   assert xyz in coords
   assert key=="|".join(str(x) for x in xyz)
   assert set(site["originalRoadCandidateIds"])==set(coords[xyz])
   assert site["originalCXSourceName"]==next(x["originalCXSourceMeshName"] for x in original
     if tuple(x["originalCXTerrainLandingWorldXYZ"])==xyz)
   s=site["sourceSurfaceTopology"]
   assert isinstance(s["nearestLanding"]["sourceFaceLocated"],bool)
   assert s["originalSourceUpFacingFacesWithin28m"]>=s["originalLargestEdgeConnectedUpFacingFaces"]>=0
   assert s["originalLargestConnectedSurfaceAreaProxySqm"]>=0
   assert 0<=s["originalLargestPatchSampleCount"]<=48
   assert s["realTriangulatedOriginalPolygonInteriorSamples"] is True
   # A single huge quad must never be judged with ONE point: this exact
   # regression falsely vetoed all R15K first-run candidates.
   if s["originalLargestConnectedSurfaceAreaProxySqm"]>=200:
    assert s["originalLargestPatchSampleCount"]>=2,"GIANT_POLYGON_ONE_CENTER_FALSE_NEGATIVE"
   if s["nearestLanding"]["sourceFaceLocated"]:
    assert 0<=s["nearestLanding"]["distanceMetres"]<=2.01
    assert -1.001<=s["nearestLanding"]["nearestFaceNormalY"]<=1.001
   else:assert s["nearestLanding"]["distanceMetres"] is None
   frames=site["realOriginalCXSourceCameraViews"]
   assert len(frames)==13
   assert len({x["frame"] for x in frames})==13
   for frame in frames:
    assert frame["realScreenPixelAreaCertified"] is False
    assert 0<=frame["originalCXPatchSamplesNotOccluded"]==len(frame["normalizedVisibleSampleScreenCoordinates"])<=frame["actuallyProjectedOriginalSourceFaceSamples"]<=s["originalLargestPatchSampleCount"]
    assert all(0<z[0]<1 and 0<z[1]<1 for z in frame["normalizedVisibleSampleScreenCoordinates"])
 summary=d["rankedActualOriginalCXSourceSurfaceVisibilityPreflight"]
 assert len(summary)==4
 seen=set();recomputed=[]
 for row in summary:
  coord=tuple(row["landingWorldXYZ"])
  assert coord in coords and coord not in seen;seen.add(coord)
  assert set(row["originalRoadCandidateIds"])==set(coords[coord])
  t=[]
  for road in ROADS:
   k="|".join(str(x) for x in coord)
   site=byroad[road]["realOriginalSourceCXSiteObservations"][k]
   assert site["originalCXSourceName"]==row["originalCXSourceName"]
   t.append(site)
  x,y=t
  sx,sy=x["sourceSurfaceTopology"],y["sourceSurfaceTopology"]
  assert sx["nearestLanding"]==sy["nearestLanding"]
  assert sx["originalLargestEdgeConnectedUpFacingFaces"]==sy["originalLargestEdgeConnectedUpFacingFaces"]
  commons=[a["frame"] for a,b in zip(x["realOriginalCXSourceCameraViews"],y["realOriginalCXSourceCameraViews"])
    if a["originalCXPatchSamplesNotOccluded"]>=2 and b["originalCXPatchSamplesNotOccluded"]>=2]
  assert row["sameFrameTwoRoadOriginalCXSurfaceVisible2Samples"]==commons
  assert row["largestSourceUpFacingPatchAreaProxySqm"]==sx["originalLargestConnectedSurfaceAreaProxySqm"]
  assert row["nearLandingOriginalSourceNormalY"]==sx["nearestLanding"]["nearestFaceNormalY"]
  streak=longest=0
  for entry in x["realOriginalCXSourceCameraViews"]:
   streak=streak+1 if entry["frame"] in commons else 0
   longest=max(longest,streak)
  assert row["maxConsecutiveMatchedOriginalHalfSecondFrames"]==longest
  eligible=bool(sx["originalLargestConnectedSurfaceAreaProxySqm"]>=120 and
    sx["originalLargestPatchSampleCount"]>=10 and longest>=5 and
    sx["nearestLanding"]["sourceFaceLocated"] and
    sx["nearestLanding"]["nearestFaceNormalY"]>=.70)
  assert row["sourceSurfacePreliminaryKeepForNewSiteResearch"]==eligible
  assert row["structuralOrArtOrGameApproval"] is False
  recomputed.append(row)
 recomputed.sort(key=lambda row:(-int(row["sourceSurfacePreliminaryKeepForNewSiteResearch"]),
  -len(row["sameFrameTwoRoadOriginalCXSurfaceVisible2Samples"]),
  -row["largestSourceUpFacingPatchAreaProxySqm"],row["originalCXSourceName"]))
 assert recomputed==summary
 return {"schema":"dopagaki.r15k-independent-original-cx-topology-camera-negative-gate/1",
    "priorEightOriginalR15I4CandidateIds":len(original),
    "actualDistinctLandingSourceCoordinates":len(coords),
    "preliminaryPossibleCxPatchesRecounted":sum(x["sourceSurfacePreliminaryKeepForNewSiteResearch"] for x in summary),
    "geometryAndCameraEvidenceRecomputed":True,
    "humanArtOrPublicRouteApprovals":False,
    "independentForgedApprovalRejected":False,
    "officialArt":0,"officialSlope2Meters":0,"ART":"HOLD","HUMAN":"HOLD","GAMEPLAY":"HOLD"}
result=gate(raw)
def veto(mutation):
 d=copy.deepcopy(raw);mutation(d)
 try:gate(d)
 except (KeyError,AssertionError,ValueError,TypeError,IndexError):return True
 raise AssertionError("FAKE_R15K_CERTIFICATION_WAS_ACCEPTED")
fake=[
 ("false_art",lambda x:x.__setitem__("officialArt",1)),
 ("false_human",lambda x:x.__setitem__("humanActualArtApproved",True)),
 ("false_game",lambda x:x.__setitem__("actualGameWebGLRendered",True)),
 ("false_geom",lambda x:x.__setitem__("sourceGameEdited",True)),
 ("false_landing_count",lambda x:x.__setitem__("actualDistinctOriginalCXLandingCoordinates",8)),
 ("false_consecutive",lambda x:x["rankedActualOriginalCXSourceSurfaceVisibilityPreflight"][0].__setitem__("maxConsecutiveMatchedOriginalHalfSecondFrames",13)),
 ("false_area",lambda x:x["rankedActualOriginalCXSourceSurfaceVisibilityPreflight"][0].__setitem__("largestSourceUpFacingPatchAreaProxySqm",999999)),
 ("false_camera",lambda x: x["originalSourceEvidenceByRoad"]["true-pinch"]["realOriginalSourceCXSiteObservations"][next(iter(x["originalSourceEvidenceByRoad"]["true-pinch"]["realOriginalSourceCXSiteObservations"]))]["realOriginalCXSourceCameraViews"][0].__setitem__("originalCXPatchSamplesNotOccluded",48)),
]
for name,mut in fake:assert veto(mut),name
result["independentForgedApprovalRejected"]=True
result["forgeryCasesRejected"]=[x[0] for x in fake]
os.makedirs(args.out,exist_ok=True)
with open(os.path.join(args.out,"R15K_INDEPENDENT_REAL_CX_PATCH_CAMERA_QA.json"),"w",encoding="utf8") as out:
 json.dump(result,out,indent=2,ensure_ascii=False)
print("R15K_INDEPENDENT_TRUE_ORIGINAL_TOPOLOGY_CAMERA_GATE",
      result["actualDistinctLandingSourceCoordinates"],"landing sites",
      result["preliminaryPossibleCxPatchesRecounted"],"remain for research ONLY; no ART, WALK, WEBGL")
