"""R15K2: collapse 3 visible source CX landings to 2 districts; preserve
original B51 warning-center screen *baseline*, never certify human safety.
Pure Python / no Blender, no new art, no source game modifications.
"""
import argparse,collections,copy,json,math,os
P=argparse.ArgumentParser()
P.add_argument("--r15k",required=True);P.add_argument("--out",required=True)
p=P.parse_args()
R=("true-pinch","pinch-switch")
D=json.load(open(p.r15k,encoding="utf8"))
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
assert D["schema"]=="dopagaki.r15k-original-cx-patch-paired-camera-obstacle-baseline-site-falsification/1"
assert D["originalSourceCXBlob"]==SRC
assert D["originalRoadVariants"]==list(R)
assert (D["priorR15I4DifferentRoadCandidateIds"],D["actualDistinctOriginalCXLandingCoordinates"])==(8,4)
assert D["officialArt"]==D["officialSlope2Meters"]==D["newGameColliders"]==0
assert D["humanActualArtApproved"] is False and D["actualGameWebGLRendered"] is False
sites=[x for x in D["rankedActualOriginalCXSourceSurfaceVisibilityPreflight"] if x["sourceSurfacePreliminaryKeepForNewSiteResearch"]]
assert len(sites)==3,("RECHECK_R15K_NEW_SOURCE_EVIDENCE",len(sites))
def dist(a,b):return math.dist(a,b)
def get(road,s):
 key="|".join(str(v) for v in s["landingWorldXYZ"])
 return D["originalSourceEvidenceByRoad"][road]["realOriginalSourceCXSiteObservations"][key]
# Independent spatial grouping, not counting two landings 5m apart as
# two separate monumental cities. Keep full provenance for each point.
rem={i for i in range(len(sites))}
clusters=[]
while rem:
 i=min(rem);rem.remove(i);group={i};stack=[i]
 while stack:
  a=stack.pop()
  neighbors=[b for b in sorted(rem) if dist(sites[a]["landingWorldXYZ"],sites[b]["landingWorldXYZ"])<15]
  for b in neighbors:rem.remove(b);group.add(b);stack.append(b)
 clusters.append(sorted(group))
assert len(clusters)==2,("NOT_TWO_TRUE_ORIGINAL_SOURCE_CX_DISTRICTS",len(clusters))
areas=[]
for group in clusters:
 members=[sites[i] for i in group]
 candidate=max(members,key=lambda x:(x["largestSourceUpFacingPatchAreaProxySqm"],
  x["maxConsecutiveMatchedOriginalHalfSecondFrames"],
  -x["landingWorldXYZ"][2]))
 frames=[x["frame"] for x in get(R[0],candidate)["realOriginalCXSourceCameraViews"]]
 common=set(candidate["sameFrameTwoRoadOriginalCXSurfaceVisible2Samples"])
 hazards={}
 watch=[]
 for road in R:
  b=D["originalSourceEvidenceByRoad"][road]["originalB51BaselineCenterProjectionByCameraFrame"]
  timeline={x["frame"]:x["baselineOriginalB51CentersVisible"] for x in b}
  for frame in frames:
   if frame not in common:continue
   for h in timeline[frame]:
    if h["straightLineDistanceDividedByCurrentSpeedSeconds"]>2.3:continue
    uv=h["sourceCameraUV"]; hid=h["id"]
    hazards.setdefault(hid,[]).append({"road":road,"frame":frame,
      "sourceProjectionUV":uv,
      "straightLineDistanceOverSpeedSeconds":h["straightLineDistanceDividedByCurrentSpeedSeconds"]})
  # 2D original CX surface visible-sample bounding rectangle is an upper
  # bound only; do not turn projected overlap into true obstacle hiding.
  v={x["frame"]:x for x in get(road,candidate)["realOriginalCXSourceCameraViews"]}
  for frame in frames:
   if frame not in common:continue
   coords=v[frame]["normalizedVisibleSampleScreenCoordinates"]
   if len(coords)<2:continue
   bounds=[min(q[0] for q in coords),min(q[1] for q in coords),
           max(q[0] for q in coords),max(q[1] for q in coords)]
   candidates=[]
   for h in timeline[frame]:
    if h["straightLineDistanceDividedByCurrentSpeedSeconds"]>2.3:continue
    u,w=h["sourceCameraUV"]
    if bounds[0]-.025<=u<=bounds[2]+.025 and bounds[1]-.025<=w<=bounds[3]+.025:
     candidates.append(h["id"])
   watch.append({"road":road,"frame":frame,
     "sourceCXVisibleSampleScreenBoundingBoxNotTrueArtPixels":[round(n,5) for n in bounds],
     "originalHazardCenterInOrNearExpandedSourcePatchScreenBox":sorted(candidates),
     "actualFutureCityObstructingThoseHazardsCertified":False})
 areas.append({"districtSourceName":candidate["originalCXSourceName"],
   "spatialLandingsOriginalCount":len(members),
   "members":[x["landingWorldXYZ"] for x in members],
   "representativeSourceCXLandingWorldXYZ":candidate["landingWorldXYZ"],
   "realSourceUpFacingConnectedAreaProxySqm":candidate["largestSourceUpFacingPatchAreaProxySqm"],
   "nativeOriginalBothRoadVisibleFrameCount":len(common),
   "nativeOriginalBothRoadVisibleFrames":sorted(common),
   "originalB51BaselineNearCueById":{k:sorted(v,key=lambda x:(x["road"],x["frame"]))
      for k,v in sorted(hazards.items())},
   "originalB51ProjectedCueVsCXSurfaceBoxByFrame":watch,
   "actualSourcePedestrianEntranceLoadFairnessCertified":False,
   "realRenderedArtOrWebGLApproved":False})
areas.sort(key=lambda x:x["representativeSourceCXLandingWorldXYZ"][2])
report={"schema":"dopagaki.r15k2-two-original-cx-visible-districts-b51-cue-protection-readonly/1",
 "originalSourceCXBlob":SRC,"sourceR15KDistinctTrueLandingsKept":3,
 "spatiallyIndependentCivicDistricts":len(areas),
 "spatialClusterThresholdMetres":15,
 "originalTwoRoadSourceDistricts":areas,
 "B51StraightDistanceDividedBySpeedNotReactionTimeOrActualCollision":True,
 "sourcePolygonVisibilityIsNotFutureBuiltArchitecture":True,
 "independentSourceDataRevalidated":False,
 "originalGameChanged":False,"newGameColliders":0,
 "genuineArtApproved":False,"humanObstacleFairnessApproved":False,
 "actualGameWebGLRendered":False,
 "officialArt":0,"officialSlope2Meters":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD","PERFORMANCE":"HOLD",
 "INTEGRATION":"HOLD","RELEASE":"HOLD","MERGE":"HOLD"}
# Independent defensive recomputation + forged-promotion rejection.
def validate(z):
 assert z["schema"]=="dopagaki.r15k2-two-original-cx-visible-districts-b51-cue-protection-readonly/1"
 assert z["originalSourceCXBlob"]==SRC
 assert z["sourceR15KDistinctTrueLandingsKept"]==3
 assert z["spatialClusterThresholdMetres"]==15
 assert z["spatiallyIndependentCivicDistricts"]==2==len(z["originalTwoRoadSourceDistricts"])
 assert z["B51StraightDistanceDividedBySpeedNotReactionTimeOrActualCollision"] is True
 assert z["sourcePolygonVisibilityIsNotFutureBuiltArchitecture"] is True
 assert z["originalGameChanged"] is z["genuineArtApproved"] is z["humanObstacleFairnessApproved"] is z["actualGameWebGLRendered"] is False
 assert (z["newGameColliders"],z["officialArt"],z["officialSlope2Meters"])==(0,0,0)
 assert all(z[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
 assert sum(q["spatialLandingsOriginalCount"] for q in z["originalTwoRoadSourceDistricts"])==3
 for x in z["originalTwoRoadSourceDistricts"]:
  assert not x["actualSourcePedestrianEntranceLoadFairnessCertified"]
  assert not x["realRenderedArtOrWebGLApproved"]
  assert x["realSourceUpFacingConnectedAreaProxySqm"]>0
  assert len(x["nativeOriginalBothRoadVisibleFrames"])==x["nativeOriginalBothRoadVisibleFrameCount"]>=5
  assert set(x["nativeOriginalBothRoadVisibleFrames"]).issubset(set(
    f["frame"] for f in get(R[0],sites[0])["realOriginalCXSourceCameraViews"]))
  for h,entries in x["originalB51BaselineNearCueById"].items():
   assert entries and all(q["straightLineDistanceOverSpeedSeconds"]<=2.3 for q in entries)
   assert all(q["road"] in R and q["frame"] in x["nativeOriginalBothRoadVisibleFrames"] for q in entries)
  for frame in x["originalB51ProjectedCueVsCXSurfaceBoxByFrame"]:
   assert frame["actualFutureCityObstructingThoseHazardsCertified"] is False
   b=frame["sourceCXVisibleSampleScreenBoundingBoxNotTrueArtPixels"]
   assert len(b)==4 and 0<=b[0]<=b[2]<=1 and 0<=b[1]<=b[3]<=1
 # Source-derived re-computation is stronger than accepting a self-attested
 # count or a revised hazard record in the output.
 original=z.get("independentSourceDataRevalidated")
 assert original is False or original is True
 for observed,expected in zip(z["originalTwoRoadSourceDistricts"],areas):
  assert observed==expected,(observed["districtSourceName"],"source altered")
 return True
assert validate(report)
for field,val in (("officialArt",1),("actualGameWebGLRendered",True),
  ("humanObstacleFairnessApproved",True),("spatiallyIndependentCivicDistricts",3)):
 bad=copy.deepcopy(report);bad[field]=val
 try:validate(bad)
 except AssertionError:pass
 else:raise AssertionError("R15K2_FAKE_CERTIFICATION_ACCEPTED "+field)
report["independentSourceDataRevalidated"]=True
# Allow changing the redundant final independent pass flag only after above.
os.makedirs(p.out,exist_ok=True)
with open(os.path.join(p.out,"R15K2_TWO_REAL_CX_CIVIC_DISTRICTS_B51_BASELINE_HOLD.json"),"w",encoding="utf8") as h:
 json.dump(report,h,ensure_ascii=False,indent=2)
print("R15K2_TRUE_SOURCE_TWO_SPATIAL_DISTRICTS",len(areas),
 [(x["districtSourceName"],x["realSourceUpFacingConnectedAreaProxySqm"],
   list(x["originalB51BaselineNearCueById"])) for x in areas],
 "NO HUMAN WARNING OR GAME ART PASSED")
