"""R15M independent source actual 240Hz exit and original B48 Blender border audit.

Reconcile original R15L2 engine fails, exact source camera t16, real engine
last support vs first air adjacent tick, source B48 geometry nearest points,
source top-boundary XZ/geometry and alternate steering before 17. Reject
fabricated approvals and fake original physics modifications. Source-only.
"""
import argparse,copy,json,os,math
p=argparse.ArgumentParser()
for k in ("source","blender","l2","native-true-pinch","native-pinch-switch","out"):
 p.add_argument("--"+k,required=True)
a=p.parse_args()
read=lambda f:json.load(open(f,encoding="utf8"))
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
ROADS=("true-pinch","pinch-switch")
modes=("ORIGINAL","FROM_16P5_LEFT_MINUS_0P35","FROM_16P5_RIGHT_PLUS_0P35")
deltas=(0,-.35,.35)
D=read(a.source);B=read(a.blender);L2=read(a.l2)
refs={r:read(getattr(a,"native_"+r.replace("-","_"))) for r in ROADS}
def dist(a,b):return math.dist(a,b)
def contract(d,b):
 assert d["schema"]=="dopagaki.r15m-actual-source-b48-240hz-exit-and-before17-analog/1"
 assert b["schema"]=="dopagaki.r15m-original-b48-world-mesh-last-grounded-and-top-boundary-240hz/1"
 assert d["originalSourceGameBlob"]==b["sourceGameBlob"]==L2["sourceBlob"]==SRC
 assert d["sourceGeometrySourceCounts"]=={"CX":18,"B48":7,"B51":28,"hz":240}
 assert b["originalSourceMeshes"]=={"CX":18,"B48":7,"B51":28}
 for k in ("originalGameSourceEdited","actualRealSourceBlenderBuildingsAdded",
           "humanGameplayCertified","originalGameWebGLRendered"):assert d[k] is False
 for k in ("originalGameSourceEdited","actualNewBlenderMeshesCreated","actualGameWebGL","humanGamePass"):
  assert b[k] is False
 assert d["newGameColliders"]==b["actualNewSourceGameRoadTriangles"]==0
 assert d["officialArt"]==d["officialSlope2Meters"]==b["officialArt"]==b["officialSlope2Meters"]==0
 assert all(d[k]==b[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
 assert d["originalR15L2NativeInputSourceMatched"] is True
 assert b["sourceRoadMeshHashesDifferBetweenRoadVariants"] is True
 cases=d["genuineSourceRoadDepartureExperiments"]
 measures=b["originalSourcedEngineExitAnd3DBlenderGroundRelations"]
 assert set(cases)==set(measures)==set(ROADS)
 summary={}
 for road in ROADS:
  ref=refs[road]
  assert ref["sourceBlob"]==SRC
  assert len(ref["originalR1OverlappingTrue13FramesParity"])==13
  actual=cases[road];geometry=measures[road]
  assert len(actual)==len(geometry)==3
  assert [x["scenario"] for x in actual]==[x["scenario"] for x in geometry]==list(modes)
  assert [x["inputAfter16p5Bias"] for x in actual]==list(deltas)
  assert all(x["road"]==road for x in geometry)
  originalL2=L2["originalSourceScenarioAndTwoAfter17UserInputSensitivityTrials"][road][0]
  for n,(c,g) in enumerate(zip(actual,geometry)):
   assert c["originalP96SourceNativeInputBefore16p5"] is True
   assert c["originalSourcePhysicsAndRoadMeshesEdited"] is False
   assert c["humanGameplayCertified"] is False
   assert c["realBuiltRoadRepair"] is False
   assert c["actualWebGLRendered"] is False
   assert g["roadShapeEdited"] is False
   assert g["newGameColliders"]==0
   assert g["actualPermanentRoadRepairCertified"] is False
   assert g["actualHumanSteeringSafetyOrWebGLCertified"] is False
   assert g["originalNativeTraceFrameCount"]==len(c["actualSourceR15MTrace"])
   assert g["actualOriginalTopBoundarySegmentsCount"]>0
   assert len(g["sourceOriginalRoadB48FaceCounts"])==7
   assert g["sourceOriginalRoadB48FaceCounts"]==b["originalRoadMeshSignatures"][road]
   assert g["lastSupportedRealRoadId"]==c["lastPhysicalGroundedSourceSupportBeforeEngineTerminal"]["surface"]
   first=c["sourcePhysicalSupportExitEventsAfter16p5"]
   assert first
   tlast=c["lastPhysicalGroundedSourceSupportBeforeEngineTerminal"]
   assert g["numberOfActualSourceAirExitEventsAfter16p5"]==len(first)
   assert g["firstTrueOriginalAirExitTickAfter16p5"]==first[0]["tick"]
   assert g["finalLastSupportCorrespondingOriginalAirExitTick"]==first[-1]["tick"]
   assert g["runnerStillRunningAt20s"]==(c["actualRunnerStatus"]=="running")
   assert g["trueLastSourcePhysicalRoadSupport"]["tick"]==tlast["tick"]
   assert g["firstOriginalTickWithoutRoadSupport"]["tick"]==first[-1]["tick"]
   assert first[-1]["tick"]==tlast["tick"]+1
   # If there was a recontact, final exit is NOT the first air event.
   assert tlast["surface"] is not None
   assert g["trueLastSourcePhysicalRoadSupport"]["sourceEngineGrounded"] is True
   assert g["firstOriginalTickWithoutRoadSupport"]["sourceEngineGrounded"] is False
   assert abs(g["trueLastSourcePhysicalRoadSupport"]["seconds"]-tlast["seconds"])<1e-6
   assert abs(g["firstOriginalTickWithoutRoadSupport"]["seconds"]-first[-1]["seconds"])<1e-6
   assert dist(g["trueLastSourcePhysicalRoadSupport"]["playerWorldXYZ"],tlast["position"])<1e-5
   assert dist(g["firstOriginalTickWithoutRoadSupport"]["playerWorldXYZ"],first[-1]["playerCentreXYZ"])<1e-5
   assert abs(g["lastSupportedTickToFirstUnsupportedTickDistanceMetres"]-
    round(dist(tlast["position"],first[-1]["playerCentreXYZ"]),4))<.00015
   for label,step in [("last",g["trueLastSourcePhysicalRoadSupport"]),
                       ("first",g["firstOriginalTickWithoutRoadSupport"])]:
    assert step["originalContactSolverVsProjected3DNotEquivalent"] is True
    assert step["sourceOriginalB48NearestMeshName"] is not None
    assert step["sourceOriginalB48NearestDistance3DMetres"] is not None
    assert step["sourceOriginalB48NearestDistance3DMetres"]>=0
    assert step["sourceOriginalB48NearestTopBoundaryXZDistanceMetres"]>=0
    assert len(step["sourceOriginalB48NearestTopBoundaryWorldXYZ"])==3
    assert step["sourceOriginalB48NearestTopBoundarySourceName"] is not None
    x,z=step["playerWorldXYZ"][0],step["playerWorldXYZ"][2]
    ex,ez=step["sourceOriginalB48NearestTopBoundaryWorldXYZ"][0],step["sourceOriginalB48NearestTopBoundaryWorldXYZ"][2]
    assert abs(math.hypot(x-ex,z-ez)-step["sourceOriginalB48NearestTopBoundaryXZDistanceMetres"])<.003
   trace=c["actualSourceR15MTrace"];assert len(trace)>100
   ids=[f["tick"] for f in trace]
   assert ids==sorted(ids) and len(set(ids))==len(ids)
   assert all(abs(x["seconds"]-x["tick"]/240)<.00001 for x in trace)
   assert all(x["sourceOriginalB48NearestDistance3DMetres"]>=0 for x in
       g["sampledSourceB48RoadMeshAndTopBoundaryRelations"] if x["sourceOriginalB48NearestDistance3DMetres"] is not None)
   assert [x["tick"] for x in trace]==[x["tick"] for x in g["sampledSourceB48RoadMeshAndTopBoundaryRelations"]]
   assert g["originalNativeTraceFrameCount"]==len(trace)
   for f,p in zip(trace,g["sampledSourceB48RoadMeshAndTopBoundaryRelations"]):
    assert f["grounded"]==p["sourceEngineGrounded"]
    assert f["sourcePhysicalB48Road"]==p["sourceEnginePhysicalRoad"]
    assert dist(f["positionXYZ"],p["playerWorldXYZ"])<.00001
    if p["sourceOriginalB48NearestTopBoundaryXZDistanceMetres"] is not None:
     border=p["sourceOriginalB48NearestTopBoundaryWorldXYZ"]
     assert abs(math.hypot(f["positionXYZ"][0]-border[0],
      f["positionXYZ"][2]-border[2])-p["sourceOriginalB48NearestTopBoundaryXZDistanceMetres"])<.005
   assert c["originalR15LTime16CameraReference"]["sourceSnapshotEqualsOriginalReference"] is True
   if n==0:
    assert c["observedR15LTime17OriginalCameraReference"]["sourceSnapshotEqualsOriginalReference"] is True
    assert c["actualRunnerStatus"]==ref["actualRunnerStatus"]=="failed"
    assert abs(c["actualRunnerEndTimeSeconds"]-ref["actualRunnerTimeSeconds"])<.0001
    assert abs(tlast["seconds"]-originalL2["lastGroundedWithOriginalB48WorldAtSeconds"])<.00001
    assert c["originalEngineFailure"]["reason"]==originalL2["actualSourceFixedScriptFailure"]["reason"]=="コースから落下"
   else:
    assert c["observedR15LTime17OriginalCameraReference"]["sourceSnapshotEqualsOriginalReference"] is False
  summary[road]={
   "originalSourceLastGroundedTick":actual[0]["lastPhysicalGroundedSourceSupportBeforeEngineTerminal"]["tick"],
   "originalSourceFirstRoadlessTick":actual[0]["sourcePhysicalSupportExitEventsAfter16p5"][-1]["tick"],
   "exactOriginalLastSupportedRoadSurface":geometry[0]["lastSupportedRealRoadId"],
   "sourceOriginalNearestBorderAtLastSupportMetres":geometry[0]["trueLastSourcePhysicalRoadSupport"]["sourceOriginalB48NearestTopBoundaryXZDistanceMetres"],
   "sourceOriginalNearestBorderAtFirstExitMetres":geometry[0]["firstOriginalTickWithoutRoadSupport"]["sourceOriginalB48NearestTopBoundaryXZDistanceMetres"],
   "allSixVariationsCertifiedHumanSafe":False
  }
 return {"actualSourceOriginalLastSupportAndExit":summary,
  "twoRoadThreeOriginalEngineInputSensitivityStudies":6,
  "realSourceB48x7SurfaceAndTopBoundaryRecomputed":True,
  "sourceOnlyNotPhysicalRoadRepairOrArtApproval":True}
summary=contract(D,B)
def veto(n,change):
 d=copy.deepcopy(D);b=copy.deepcopy(B)
 change(d,b)
 try:contract(d,b)
 except (AssertionError,KeyError,TypeError,ValueError,IndexError):return n
 raise AssertionError("FAKE_SOURCE_B48_ROAD_PASS_"+n)
cases=[
 ("fake_game",lambda d,b:d.__setitem__("officialArt",1)),
 ("fake_webgl",lambda d,b:b.__setitem__("actualGameWebGL",True)),
 ("fake_human",lambda d,b:d.__setitem__("humanGameplayCertified",True)),
 ("fake_poly",lambda d,b:b.__setitem__("actualNewSourceGameRoadTriangles",1)),
 ("fake_signature",lambda d,b:b.__setitem__("sourceRoadMeshHashesDifferBetweenRoadVariants",False)),
 ("fake_engine",lambda d,b:d["genuineSourceRoadDepartureExperiments"]["true-pinch"][0]["originalEngineFailure"].__setitem__("reason","WIN")),
 ("fake_time",lambda d,b:d["genuineSourceRoadDepartureExperiments"]["true-pinch"][0].__setitem__("actualRunnerEndTimeSeconds",52)),
 ("fake_edge",lambda d,b:b["originalSourcedEngineExitAnd3DBlenderGroundRelations"]["true-pinch"][0]["firstOriginalTickWithoutRoadSupport"].__setitem__("sourceOriginalB48NearestTopBoundaryXZDistanceMetres",999)),
 ("fake_exit",lambda d,b:b["originalSourcedEngineExitAnd3DBlenderGroundRelations"]["pinch-switch"][0]["firstOriginalTickWithoutRoadSupport"].__setitem__("tick",200)),
 ("fake_analog",lambda d,b:d["genuineSourceRoadDepartureExperiments"]["pinch-switch"][1].__setitem__("inputAfter16p5Bias",8)),
 ("fake_parity",lambda d,b:d["genuineSourceRoadDepartureExperiments"]["pinch-switch"][0]["observedR15LTime17OriginalCameraReference"].__setitem__("sourceSnapshotEqualsOriginalReference",False)),
 ("fake_contact",lambda d,b:b["originalSourcedEngineExitAnd3DBlenderGroundRelations"]["true-pinch"][0]["trueLastSourcePhysicalRoadSupport"].__setitem__("sourceEngineGrounded",False)),
 ("fake_status",lambda d,b:d["genuineSourceRoadDepartureExperiments"]["true-pinch"][0].__setitem__("actualRunnerStatus","finished"))]
summary["forgedSourcePhysicsExitAndGamePromotionRejected"]=[veto(n,fn) for n,fn in cases]
summary.update({"schema":"dopagaki.r15m-independent-native-240hz-source-b48-triangle-boundary-veto/1",
 "sourceBlob":SRC,"officialArt":0,"officialSlope2Meters":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD"})
os.makedirs(a.out,exist_ok=True)
with open(os.path.join(a.out,"R15M_INDEPENDENT_TRUE_PHYSICAL_B48_3D_EDGE_AND_240HZ_QA.json"),"w",encoding="utf8") as f:
 json.dump(summary,f,indent=2,ensure_ascii=False)
print("R15M_INDEPENDENT_B48_TRUE_ENGINE_SUPPORT_EXIT",summary,flush=True)
