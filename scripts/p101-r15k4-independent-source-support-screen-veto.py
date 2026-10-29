"""R15K4 independent source-only evidence gate, adversarial approval falsification.

Reject inflated full-width walking support, fabricated 2-road render visibility,
false source B51 distance, double-counted CX04 and any art/game promotion.
Per-source raycast itself is measured by Blender job; no independent mesh
solver here, so physical support remains PROBE ONLY, never an approval.
"""
import json,math,os,copy,argparse
P=argparse.ArgumentParser()
for key in ("r15k","r15k3","r15i4","trial","out"):P.add_argument("--"+key,required=True)
a=P.parse_args()
load=lambda f:json.load(open(f,encoding="utf8"))
k=load(a.r15k);k3=load(a.r15k3);i4=load(a.r15i4);d=load(a.trial)
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
ROADS=("true-pinch","pinch-switch")
sites=("02 roadbank-promenade None","04 roadbank-promenade None")
allowed={x["id"]:x for x in i4["commonTwoWorldOriginalCXSourceResearchRows"]
 if x["originalGameGeometryAndCXSupportCandidateOnly"] and x["originalCXSourceMeshName"] in sites}
assert len(allowed)==5
guard={(x["road"],x["originalCXPatchName"]):{
 t["frame"]:[b["conservativeYawSignUnionScreenBox"] for b in t["projectedOriginalMovers"]]
 for t in x["originalSourceRealCameraFrames"]}
 for x in k3["twoRoadTwoCXOriginalCameraDetailedComparisons"]}
assert len(guard)==4
def boxdistance(a,b):
 return math.hypot(max(a[0]-b[2],b[0]-a[2],0),
                   max(a[1]-b[3],b[1]-a[3],0))
def verify(data):
 assert data["schema"]=="dopagaki.r15k4-real-original-b48-cx-support-and-virtual-macro-screen-bvh-falsification/1"
 assert data["sourceBlob"]==k["originalSourceCXBlob"]==k3["sourceBlob"]==i4["sourceBlob"]==SRC
 assert data["sourceOriginalGeometry"]=={"CX":18,"B48":7,"B51":28,"physicsHz":240}
 assert data["twoOriginalRoads"]==list(ROADS)
 assert data["twoDistinctOriginalCXTerrainPatches"]==list(sites)
 assert data["originalR15I4TheoreticalRoadRimHypotheses"]==5
 assert data["hypotheticalBoxDesignCount"]==30
 assert data["sourceR15K3ShapeAndVisibilityFromRealOriginalR1"] is True
 for prop in ("originalSourceGameModified","actualNewBlenderMeshesCreated",
  "humanWalkingEntranceVerified","structuralLoadsVerified",
  "originalB51AllHazardsContinuousFullVisibilityCertified",
  "actualGameWebGLRendered","actualHumanArtworkApproved"):
  assert data[prop] is False,prop
 assert data["officialArt"]==data["officialSlope2Meters"]==data["newSourceGameColliders"]==0
 assert all(data[z]=="HOLD" for z in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
 raw=data["originalTwoRoadOriginalRimCxStraightLineSources"]
 assert set(raw)==set(ROADS)
 all_volumes={}
 all_approach=set()
 for road in ROADS:
  sites_observed=raw[road];assert set(sites_observed)==set(sites)
  all_volumes[road]={}
  for patch in sites:
   r=sites_observed[patch]
   approaches=r["originalB48ToCXStraightLineSupportProbes"]
   assert len(approaches)==sum(q["originalCXSourceMeshName"]==patch for q in allowed.values())
   ids=set()
   for approach in approaches:
    name=approach["id"];assert name in allowed and name not in ids
    ids.add(name)
    expected=allowed[name]
    assert approach["originalB48RimXYZ"]==expected["originalRoadRimXYZ"]
    assert approach["originalSourceCXLandingXYZ"]==expected["originalCXTerrainLandingWorldXYZ"]
    assert approach["originalPriorTheoreticalBezierLengthMetres"]==expected["theoreticalBezierApproachMetres"]
    assert approach["originalPriorTheoreticalMaxSlope"]==expected["theoretical32SegmentMaxSlope"]
    assert approach["sourceVerifiedContinuousWalkablePath"] is False
    assert approach["hypotheticalLineIsNotOriginalRoadOrApprovedBezier"] is True
    points=approach["straightLineTestCentres"]
    assert len(points)==41 and [q["s"] for q in points]==list(range(41))
    missing=0;longest=streak=0
    for x in points:
     assert x["groundProximityInspectedNotWalkability"] is True
     assert 0<=x["threeAcrossSamplesSupported"]<=3
     assert len(x["sourceSupportWitnessMeshes"])<=3
     t=x["s"]/40
     expect=[round(v*(1-t)+w*t,4) for v,w in zip(approach["originalB48RimXYZ"],approach["originalSourceCXLandingXYZ"])]
     assert all(abs(u-v)<.00011 for u,v in zip(x["sourceWorldXYZ"],expect))
     miss=x["threeAcrossSamplesSupported"]<3
     missing+=miss
     streak=streak+1 if miss else 0
     longest=max(longest,streak)
    assert approach["fullWidthSourceSupportedStationsOf41"]==41-missing
    assert approach["fullWidthSourceMissingStationsOf41"]==missing
    assert approach["longestSequentialUnsupportedFullWidthStations"]==longest
    all_approach.add((road,name))
   tests=r["virtualStudyVolumesNoMesh"]
   assert len(tests)==15
   for v in tests:
    assert v["sourceCXName"]==patch and v["noActualMeshOrCollider"] is True
    assert v["id"] not in all_volumes[road]
    assert v["virtualFootprintWidthDepthHeightMetres"] in [
      [8,8,14],[14,14,24],[24,24,48]]
    assert len(v["virtualCentreXYZ"])==3
    assert len(v["originalCXLandingReferenceXYZ"])==3
    assert abs(v["virtualCentreXYZ"][1]-v["originalCXLandingReferenceXYZ"][1])<=.00001
    assert len(v["originalSourceFootprintSupportChecksFive"])==5
    witness=sum(bool(w["originalUpperSurfaceWithin4p5m"] and w["mesh"]==patch)
     for w in v["originalSourceFootprintSupportChecksFive"])
    assert witness==v["originalCXGroundSupportWitnessCount"]
    assert 0<=witness<=5
    for w in v["originalSourceFootprintSupportChecksFive"]:
     assert isinstance(w["originalUpperSurfaceWithin4p5m"],bool)
     assert isinstance(w["upwardOriginalFaceNormal"],bool)
     if w["originalUpperSurfaceWithin4p5m"]:
      assert w["upwardOriginalFaceNormal"] and w["verticalErrorMetres"]<=1.75
    frames=v["unmodifiedSourceCameraFrames"];assert len(frames)==13
    assert [int(f["frame"][1:]) for f in frames]==list(range(1100,1701,50))
    seen=set();guarded=set()
    for f in frames:
     t=f["frame"];assert f["realWebGLOrHumanWarningCertified"] is False
     assert 0<=f["originalCXB48UnoccludedVirtualBoxSamples"]<=f["projectedSourceVirtualBoxSamples"]<=14
     b=f["visibleSampleBoundingRectNotSilhouette"];area=f["visibleSamplesScreenRectAreaProxyPixelsSq"]
     if b is None:
      assert area==0 and f["originalCXB48UnoccludedVirtualBoxSamples"]==0
      assert f["nearestOriginalB51ConservativeScreenBoxPixels"] is None
     else:
      assert len(b)==4 and 0<b[0]<=b[2]<1008 and 0<b[1]<=b[3]<645
      assert abs(area-round((b[2]-b[0])*(b[3]-b[1]),1))<=.25
      assert f["originalCXB48UnoccludedVirtualBoxSamples"]>0
     bounds=guard[(road,patch)][t]
     assert f["projectedOriginalB51CenterVisibleBoundingRectsChecked"]==len(bounds)
     distances=sorted(boxdistance(b,h) for h in bounds) if b else []
     near=bool(distances and min(distances)<=48)
     assert f["originalB51Guard48pxTouched"]==near
     assert f["nearestOriginalB51ConservativeScreenBoxPixels"]==(
      round(min(distances),3) if distances else None)
     if near:guarded.add(t)
     if f["originalCXB48UnoccludedVirtualBoxSamples"]>=4 and area>=2500:seen.add(t)
    assert v["sourceOnlyProjectedVolumeReadableFrames"]==sorted(seen)
    assert v["sourceOnlyHazardGuardConcernFrames"]==sorted(guarded)
    all_volumes[road][v["id"]]=v
 assert len(all_approach)==10
 assert all(len(all_volumes[road])==30 for road in ROADS)
 paired=data["twoRoadPairedSourceOnlyVirtualVolumeScreenRanking"]
 assert len(paired)==30
 ids=set();recount=[]
 for x in paired:
  id=x["virtualVolumeId"];assert id not in ids;ids.add(id)
  assert id in all_volumes[ROADS[0]] and id in all_volumes[ROADS[1]]
  p,q=(all_volumes[r][id] for r in ROADS)
  assert x["site"]==p["sourceCXName"]==q["sourceCXName"]
  common=set(p["sourceOnlyProjectedVolumeReadableFrames"]) & set(q["sourceOnlyProjectedVolumeReadableFrames"])
  danger=set(p["sourceOnlyHazardGuardConcernFrames"]) | set(q["sourceOnlyHazardGuardConcernFrames"])
  assert x["sourceSameWorldFootprintFull5PointSupport"]==(p["originalCXGroundSupportWitnessCount"]==q["originalCXGroundSupportWitnessCount"]==5)
  assert x["sourceCameraBothRoadsReadableFrames"]==sorted(common)
  assert x["originalB51ConservativeCenterVisibleGuardConcernFrames"]==sorted(danger)
  assert x["actuallyBuildableConnectedAndVisuallyBeautifulCertified"] is False
  longest=streak=0
  for i in range(1100,1701,50):
   streak=streak+1 if "t"+str(i) in common else 0
   longest=max(longest,streak)
  assert x["sourceCameraLongestConsecutiveHalfSecondReadableFrames"]==longest
  eligible=bool(longest>=5 and x["sourceSameWorldFootprintFull5PointSupport"] and not (common&danger))
  assert x["screenBVHSourceOnlyPreliminaryResearchCandidate"]==eligible
  recount.append(x)
 recount.sort(key=lambda x:(-int(x["screenBVHSourceOnlyPreliminaryResearchCandidate"]),
   -x["sourceCameraLongestConsecutiveHalfSecondReadableFrames"],
   len(x["originalB51ConservativeCenterVisibleGuardConcernFrames"]),x["virtualVolumeId"]))
 assert recount==paired
 return {"studiedPhysicalApproachHypothesesPerRoad":5,
  "twoRoadVirtualMacroVolumeCandidates":len(paired),
  "provisionalSourceBVHOnlyStudyCandidates":sum(x["screenBVHSourceOnlyPreliminaryResearchCandidate"] for x in paired),
  "eachOriginalFullWidthConnectionProven":False}
out=verify(d)
def negative(label,mutation):
 fake=copy.deepcopy(d);mutation(fake)
 try:verify(fake)
 except (AssertionError,KeyError,TypeError,ValueError,IndexError):return label
 raise AssertionError("R15K4_FALSE_PASS_ADMITTED "+label)
cases=[
 ("false_art",lambda x:x.__setitem__("officialArt",1)),
 ("false_walk",lambda x:x.__setitem__("humanWalkingEntranceVerified",True)),
 ("false_collider",lambda x:x.__setitem__("newSourceGameColliders",1)),
 ("false_webgl",lambda x:x.__setitem__("actualGameWebGLRendered",True)),
 ("false_cx_duplicate",lambda x:x.__setitem__("hypotheticalBoxDesignCount",60)),
 ("false_corridor",lambda x:x["originalTwoRoadOriginalRimCxStraightLineSources"]["true-pinch"][sites[0]]["originalB48ToCXStraightLineSupportProbes"][0].__setitem__("fullWidthSourceSupportedStationsOf41",41)),
 ("false_ray",lambda x:x["originalTwoRoadOriginalRimCxStraightLineSources"]["true-pinch"][sites[0]]["virtualStudyVolumesNoMesh"][0]["unmodifiedSourceCameraFrames"][0].__setitem__("originalCXB48UnoccludedVirtualBoxSamples",14)),
 ("false_screen",lambda x:x["originalTwoRoadOriginalRimCxStraightLineSources"]["true-pinch"][sites[0]]["virtualStudyVolumesNoMesh"][0]["unmodifiedSourceCameraFrames"][0].__setitem__("visibleSamplesScreenRectAreaProxyPixelsSq",999999)),
 ("false_b51",lambda x:x["originalTwoRoadOriginalRimCxStraightLineSources"]["true-pinch"][sites[0]]["virtualStudyVolumesNoMesh"][0]["unmodifiedSourceCameraFrames"][0].__setitem__("originalB51Guard48pxTouched",True)),
 ("false_research",lambda x:x["twoRoadPairedSourceOnlyVirtualVolumeScreenRanking"][0].__setitem__("screenBVHSourceOnlyPreliminaryResearchCandidate",True))]
out["negativeFalsificationPasses"]=[negative(n,m) for n,m in cases]
out.update({"schema":"dopagaki.r15k4-independent-real-road-cx-bvh-source-camera-falsification/1",
 "sourceBlob":SRC,"exactSourceRectAndFullWidthSupportCountsRecomputed":True,
 "sourceOnlyNotWebGLOrSafetyApproved":True,"officialArt":0,"officialSlope2Meters":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD"})
os.makedirs(a.out,exist_ok=True)
with open(os.path.join(a.out,"R15K4_INDEPENDENT_B48_CX_SUPPORT_AND_SCREEN_CONTRACT_GATE.json"),"w",encoding="utf8") as f:
 json.dump(out,f,indent=2,ensure_ascii=False)
print("R15K4_INDEPENDENT_REAL_SOURCE_FULLWIDTH_GAP_AND_VIRTUAL_CITY",
 out,"NO ART GAMEPLAY HUMAN APPROVAL",flush=True)
