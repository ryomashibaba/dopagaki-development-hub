"""Independent R15I2 gate: re-evaluate two-road CX-anchorage witnesses."""
import argparse,json,math,copy,os
p=argparse.ArgumentParser();p.add_argument("--in",dest="source",required=True);p.add_argument("--out",required=True)
args=p.parse_args()
ROADS=("true-pinch","pinch-switch")
SOURCE="af076d67492a677d2235e4730aef8cdf4808e106"
def verify(x):
 assert x["schema"]=="dopagaki.r15i2-original-cx-terrain-real-3d-load-path-hypothesis-readonly/1"
 assert x["originalSourceCXBlob"]==SOURCE
 assert (x["originalCX18"],x["originalB48"],x["originalB51"])==(18,7,28)
 for k in ("originalSourceFilesModified","actualSupportStructuresBuilt","actualHumanRoadAccessBuilt",
   "realSourceCameraBlenderArtProduced","realBrowserWebGLTest","obstacleWarningHumanFairnessCertified"):
  assert x[k] is False,k
 assert (x["officialArt"],x["officialSlope2Meters"],x["newGameColliders"])==(0,0,0)
 assert all(x[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
 raw=x["sourceResultsByRoad"]; assert set(raw)==set(ROADS)
 a,b=[raw[r] for r in ROADS]
 assert len(a)==len(b)==x["originalPairedWorldHypothesesTested"]
 common=[]
 for u,v in zip(a,b):
  assert u["id"]==v["id"] and u["testDeckCenterXYZ"]==v["testDeckCenterXYZ"]
  for w in (u,v):
   assert w["originalB48AccessBridgeActuallyBuilt"] is False
   assert w["CXStructuralLoadPathPhysicallyCertified"] is False
   assert w["humanPublicEntranceCertified"] is False
   assert len(w["actualSourceCXGroundFiveVertical250mRays"])==5
   assert all(z["hit"]== (z["distance"] is not None) for z in w["actualSourceCXGroundFiveVertical250mRays"])
   anchors=w["terrainAnchorage3DWitnesses"]
   assert len(anchors)<=5
   assert all(z["structuralBraceActuallyConstructed"] is False for z in anchors)
   if w["originalCXNearest3DMetres"] is not None:
    assert w["originalCXNearest3DMetres"]>=0
    assert all(z["originalTerrainProximity3DMetres"]>=w["originalCXNearest3DMetres"]-.002 for z in anchors)
   eligible=[z for z in anchors if z["originalTerrainProximity3DMetres"]<=120
       and not z["hypotheticalBraceOriginalSourceInteriorIntersections"]
       and not z["hypotheticalBraceB51AllTickConservativeEnvelopeOverlaps"]]
   assert (eligible[0] if eligible else None)==w["bestUnobstructedHypotheticalCXBrace"]
  if not all(w["originalB48RoadRimWitness"] and w["priorRoadAdjacent8x6SourceGeometryClear"]
     and w["priorB51DeckConservativeEnvelopeClear"]
     and w["priorOriginalCameraUnoccludedFrameCount"]>=2
     and w["bestUnobstructedHypotheticalCXBrace"] for w in (u,v)):continue
  aa=u["bestUnobstructedHypotheticalCXBrace"];bb=v["bestUnobstructedHypotheticalCXBrace"]
  if math.dist(aa["trueNearestTriangleWorldXYZ"],bb["trueNearestTriangleWorldXYZ"])>5:continue
  common.append({"id":u["id"],"testDeckCenterXYZ":u["testDeckCenterXYZ"],
    "originalCXHypotheticalSharedSupportWitnessMetres":max(
      aa["originalTerrainProximity3DMetres"],bb["originalTerrainProximity3DMetres"]),
    "trueSourceCXEndpointXYZByRoad":{ROADS[0]:aa["trueNearestTriangleWorldXYZ"],
        ROADS[1]:bb["trueNearestTriangleWorldXYZ"]},
    "isOnlyUnbuiltStructuralResearchHypothesis":True,
    "realBuildingFoundation":False,"actualWalkingEntrance":False})
 common.sort(key=lambda q:(q["originalCXHypotheticalSharedSupportWitnessMetres"],q["id"]))
 assert x["twoRoadUnbuiltCXBracingResearchHypothesisCount"]==len(common)
 assert x["bothRoadIdenticalWorldCXNearbyCandidateLocationsForFurtherEngineering"]==common[:10]
 return {"schema":"dopagaki.r15i2-independent-real-terrain-preflight-no-approvals/1",
     "sameWorldRoadHypothesesVerified":len(a),"unbuiltAnchorageHypothesesVerified":len(common),
     "sourceCXBlob":SOURCE,"fakeCertificationRejected":False,
     "officialArt":0,"officialSlope2Meters":0,"ART":"HOLD",
     "GAMEPLAY":"HOLD","HUMAN":"HOLD","INTEGRATION":"HOLD","RELEASE":"HOLD"}
def false_claim(x,fn):
 y=copy.deepcopy(x);fn(y)
 try:verify(y)
 except (AssertionError,KeyError,TypeError,ValueError,IndexError):return True
 raise AssertionError("FORGED_R15I2_CERTIFICATE_ACCEPTED")
with open(args.source,encoding="utf8") as f:d=json.load(f)
out=verify(d)
mutations=[
 ("faked_real_support",lambda x:x.__setitem__("actualSupportStructuresBuilt",True)),
 ("faked_art",lambda x:x.__setitem__("officialArt",1)),
 ("faked_entrance",lambda x:x.__setitem__("actualHumanRoadAccessBuilt",True)),
 ("faked_webgl",lambda x:x.__setitem__("realBrowserWebGLTest",True)),
 ("faked_original",lambda x:x.__setitem__("originalSourceFilesModified",True)),
 ("faked_human",lambda x:x.__setitem__("HUMAN","PASS")),
 ("faked_count",lambda x:x.__setitem__("twoRoadUnbuiltCXBracingResearchHypothesisCount",10000))]
for name,fn in mutations:
 assert false_claim(d,fn),name
if d["sourceResultsByRoad"][ROADS[1]]:
 assert false_claim(d,lambda x:x["sourceResultsByRoad"][ROADS[1]][0].__setitem__(
   "testDeckCenterXYZ",[9999,9999,9999]))
 mutations.append(("faked_shared_world",None))
if d["bothRoadIdenticalWorldCXNearbyCandidateLocationsForFurtherEngineering"]:
 assert false_claim(d,lambda x:x["bothRoadIdenticalWorldCXNearbyCandidateLocationsForFurtherEngineering"][0].__setitem__(
   "realBuildingFoundation",True))
 mutations.append(("faked_selected_foundation",None))
out["fakeCertificationRejected"]=True
out["negativeTamperCases"]=[name for name,fn in mutations]
os.makedirs(os.path.dirname(args.out) or ".",exist_ok=True)
with open(args.out,"w",encoding="utf8") as f:json.dump(out,f,indent=2)
print("R15I2_INDEPENDENT_CX_SOURCE_ONLY",out["sameWorldRoadHypothesesVerified"],
 "roadside hypotheses",out["unbuiltAnchorageHypothesesVerified"],
 "hypothetical CX braces; REAL STRUCTURES 0, WALKABLE ENTRANCES 0, ART 0")
