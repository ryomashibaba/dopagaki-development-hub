"""R15I independent evidence gate; refuses false constructed-support/game/art claims."""
import argparse,copy,json,math,os
P=argparse.ArgumentParser()
P.add_argument("--in",dest="source",required=True);P.add_argument("--out",required=True)
args=P.parse_args()
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
ROADS=("true-pinch","pinch-switch")
SCHEMA="dopagaki.r15i-real-b48-road-rim-first-dual-original-world-entrance-support-preflight/1"
def gate(d):
    assert d["schema"]==SCHEMA and d["originalSourceCXBlob"]==SRC
    assert (d["originalCX18"],d["originalB48"],d["originalB51"],d["sourcePhysicsHz"])==(18,7,28,240)
    assert d["bothOriginalRoadVariants"]==list(ROADS)
    assert d["nativeTrajectoryWindows"]==["t1100","t1200","t1300","t1400","t1500","t1600","t1700"]
    assert d["physicalRoadsideSourceHypothesesBeforeSpatialDedup"]>=d["spatiallyDistinctSourceRoadsideTestHypotheses"]
    assert d["actualOriginalB48TopFaceBoundaryEdges"]>=0
    assert d["originalB48TopSurfacePolygonsObserved"]>=0
    assert d["resultStatus"]=="PRELIMINARY_GEOMETRY_AND_GROUND_PROXIMITY_NOT_HUMAN_ACCESS"
    for k in ("realPublicFloorOrPedestrianEntranceBuilt","realFoundationsOrLoadPathsBuilt",
      "actualBlenderArtStudyProduced","realWebGLGameRendered","originalGameEdited",
      "originalB51ObstacleWarningAndHumanFairnessCertified"):
        assert d[k] is False,("forged approval",k)
    assert (d["officialArt"],d["officialSlope2Meters"],d["newGameColliders"])==(0,0,0)
    assert all(d[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
    result=d["originalPairedWorldCandidateEvaluations"]
    assert set(result)==set(ROADS)
    a,b=(result[r] for r in ROADS)
    assert len(a)==len(b)==d["spatiallyDistinctSourceRoadsideTestHypotheses"]
    ids=set();computed=[]
    for x,y in zip(a,b):
        assert x["id"]==y["id"] and x["id"] not in ids
        ids.add(x["id"])
        assert x["testDeckCenterXYZ"]==y["testDeckCenterXYZ"]
        assert x["rimMid"]==y["rimMid"]
        assert all(math.isfinite(c) for c in x["testDeckCenterXYZ"]+x["rimMid"])
        for item in (x,y):
            assert item["newFloorOrAccessRouteBuilt"] is False
            assert item["bothGroundContactAndStructuralFoundationCertified"] is False
            assert item["actualGameCameraObstacleLegibilityCertified"] is False
            assert set(item["sevenOriginalCameraSourceUnoccludedFrames"]).issubset(set(d["nativeTrajectoryWindows"]))
            assert 0<=len(item["fourDeckCornersOriginalSourceSupportProximity"])==4
            assert item["boundarySegmentLength"]>0
            assert item["closestPlayerFrameDistance"]>=0
            assert isinstance(item["sourceCXB48CandidateDeckIntersectionPairs"],list)
            assert all(v["triPairs"]>0 for v in item["sourceCXB48CandidateDeckIntersectionPairs"])
            assert isinstance(item["B51Conservative721TickEnvelopeOverlaps"],list)
            assert isinstance(item["originalB48InboardSurfaceWitness"],(list,type(None)))
            assert all(isinstance(z["sourceGroundBelow45m"],bool) for z in item["fourDeckCornersOriginalSourceSupportProximity"])
        anchored=all(v["originalB48InboardSurfaceWitness"] for v in (x,y))
        geom=all(not v["sourceCXB48CandidateDeckIntersectionPairs"] for v in (x,y))
        hazard=all(not v["B51Conservative721TickEnvelopeOverlaps"] for v in (x,y))
        visible=min(len(x["sevenOriginalCameraSourceUnoccludedFrames"]),
                    len(y["sevenOriginalCameraSourceUnoccludedFrames"]))
        ground=min(sum(z["sourceGroundBelow45m"] for z in v["fourDeckCornersOriginalSourceSupportProximity"]) for v in (x,y))
        score=round(visible*2+ground*2-x["closestPlayerFrameDistance"]*.02,3)
        eligible=bool(anchored and geom and hazard and visible>=2 and ground>=2)
        if eligible:
            computed.append({"id":x["id"],"testDeckCenterXYZ":x["testDeckCenterXYZ"],
                "originalRoadRimXYZ":x["rimMid"],
                "bothOriginalRoadSourceRimWitness":bool(anchored),
                "bothOriginalWorldHypotheticalDeckGeometryClear":bool(geom),
                "bothOriginalWorldB51ConservativeEnvelopeClear":bool(hazard),
                "minimumActualGroundUnderFourTestCorners":ground,
                "minimumVisibleSourceCameraFrames":visible,"researchScore":score,
                "eligibleForNextStructuralDesignStudy":True,"publicEntranceCertified":False,
                "structuralFoundationCertified":False})
    computed.sort(key=lambda z:(-z["researchScore"],z["id"]))
    assert len(computed)==d["eligibleSameXYZPhysicalSupportAndCameraStudyCount"]
    assert computed[:8]==d["independentlyOrderedSameXYZBothRoadNextStudyCandidates"]
    assert all(not x["structuralFoundationCertified"] and not x["publicEntranceCertified"] for x in computed)
    return {"schema":"dopagaki.r15i-independent-road-anchored-source-gate/1",
       "originalSourceCXBlob":SRC,
       "twoOriginalWorldsChecked":list(ROADS),
       "realRoadsideHypothesesIndependentlyRecounted":len(a),
       "sourcePhysicalResearchEligibleForFurtherStructuralDesign":len(computed),
       "originalGameSourceProtectionClaim":"ONLY_SOURCE_BLOB_CLAIM_CHECKED;_GIT_HASH_MUST_BE_CHECKED_IN_CI",
       "noManufacturedHumanRouteOrFoundation":True,
       "notAnAestheticOrWebGLApproval":True,
       "negativeForgeryTestsPassed":False,
       "officialArt":0,"officialSlope2Meters":0,
       "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD",
       "INTEGRATION":"HOLD","RELEASE":"HOLD","MERGE":"HOLD"}
def reject_mutation(raw,change):
    t=copy.deepcopy(raw);change(t)
    try:gate(t)
    except (AssertionError,KeyError,TypeError,ValueError,IndexError):return True
    raise AssertionError("FALSIFIED_R15I_EVIDENCE_WAS_ACCEPTED")
with open(args.source,encoding="utf8") as f: raw=json.load(f)
output=gate(raw)
tests=[
 ("false_art",lambda x:x.__setitem__("officialArt",1)),
 ("false_floor",lambda x:x.__setitem__("realPublicFloorOrPedestrianEntranceBuilt",True)),
 ("false_webgl",lambda x:x.__setitem__("realWebGLGameRendered",True)),
 ("false_foundation",lambda x:x.__setitem__("realFoundationsOrLoadPathsBuilt",True)),
 ("false_human",lambda x:x.__setitem__("HUMAN","PASS")),
 ("false_physics",lambda x:x.__setitem__("sourcePhysicsHz",60)),
 ("false_hazard",lambda x:x.__setitem__("originalB51ObstacleWarningAndHumanFairnessCertified",True)),
 ("false_site_count",lambda x:x.__setitem__("eligibleSameXYZPhysicalSupportAndCameraStudyCount",999))
]
for name,mutate in tests:
    assert reject_mutation(raw,mutate),name
if raw["originalPairedWorldCandidateEvaluations"][ROADS[1]]:
    assert reject_mutation(raw,lambda x:x["originalPairedWorldCandidateEvaluations"][ROADS[1]][0].__setitem__(
        "testDeckCenterXYZ",[999,999,999]))
    tests.append(("false_two_world_geometry",None))
if raw["independentlyOrderedSameXYZBothRoadNextStudyCandidates"]:
    assert reject_mutation(raw,lambda x:x["independentlyOrderedSameXYZBothRoadNextStudyCandidates"][0].__setitem__(
        "structuralFoundationCertified",True))
    tests.append(("false_selected_foundation",None))
output["negativeForgeryTestsPassed"]=True
output["forgeryCases"]= [t[0] for t in tests]
os.makedirs(os.path.dirname(args.out) or ".",exist_ok=True)
with open(args.out,"w",encoding="utf8") as f:json.dump(output,f,indent=2)
print("R15I_INDEPENDENT_SOURCE_GATE",len(raw["originalPairedWorldCandidateEvaluations"][ROADS[0]]),
      "hypotheses",output["sourcePhysicalResearchEligibleForFurtherStructuralDesign"],
      "preliminary only; built entrance 0, support 0, ART 0, WebGL 0")
