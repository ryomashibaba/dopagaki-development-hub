"""R15O independent 16 genuine original 240Hz replay / real B48
geometry-only audit. No claim of official game victory or art approval.
"""
import argparse,copy,json,os,math
p=argparse.ArgumentParser()
for s in ("result","native-true-pinch","native-pinch-switch","r15n2","out"):p.add_argument("--"+s,required=True)
a=p.parse_args()
read=lambda p:json.load(open(p,encoding="utf8"))
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
ROADS=("true-pinch","pinch-switch")
MODES=("ORIGINAL","A_OUTER_SHOULDER_8M","B_BANKED_OUTER_SHOULDER_16M",
 "C_REAL_OUTER_CURVE_SHIFT_22M")
CONTROLS=("ORIGINAL_P96_EARLY_SOFT","R15N2_CROSS_ROAD_BEST_EARLY_RIGHT_0P18")
D=read(a.result)
REF={r:read(getattr(a,'native_'+r.replace("-","_"))) for r in ROADS}
N2=read(a.r15n2)
def check(d):
 assert d["schema"]=="dopagaki.r15o-isolated-original-b48-physical-curve-multi-geometry-240hz/1"
 assert d["originalGameSourceBlob"]==SRC
 assert d["realSourceRoads"]==list(ROADS) and d["realNewGeometryModes"]==list(MODES)
 assert [x["id"] for x in d["realOriginalInputPolicies"]]==list(CONTROLS)
 assert d["realOriginalInputPolicies"][0]["start"] is None and d["realOriginalInputPolicies"][0]["bias"]==0
 assert d["realOriginalInputPolicies"][1]["start"]==15.75 and d["realOriginalInputPolicies"][1]["bias"]==.18
 assert d["realSource240Hz"] is True and d["fullActualNativeRealDrivingTrials"]==16
 assert d["originalGameSourceEdited"] is False and d["originalPhysicsCCDChanged"] is False
 assert d["originalB51DynamicHazardShapesAndPositionsFrozen"] is True
 assert d["originalHumanGameWebGLRendered"] is False
 assert d["newGameColliders"]==d["officialArt"]==d["officialSlope2Meters"]==0
 assert all(d[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
 assert set(d["recordedSourceExperiments"])==set(ROADS)
 data={}
 for road in ROADS:
  assert REF[road]["sourceBlob"]==SRC
  assert set(d["recordedSourceExperiments"][road])==set(MODES)
  entries=[]
  baseline=None
  for mode in MODES:
   cases=d["recordedSourceExperiments"][road][mode]
   assert len(cases)==2
   assert [x["steering"]["id"] for x in cases]==list(CONTROLS)
   assert [x["steering"] for x in cases]==d["realOriginalInputPolicies"]
   assert all(x["road"]==road and x["geometryMode"]==mode for x in cases)
   for item in cases:
    assert item["sourceBlob"]==SRC
    assert item["originallyExactlyParityAt13"] in (True,False)
    assert item["originallyExactlyParityAt14"] in (True,False)
    assert item["sourceExact17RealPosCam"] is not None
    assert len(item["sourceExact17RealPosCam"]["positionXYZ"])==3
    assert len(item["sourceExact17RealPosCam"]["sourceViewEye"])==3
    assert item["realSourceCollisionTriangles"]>=28000
    assert item["originalGameEdited"] is False
    assert item["originalB48SourcePhysicsUnchanged"] is True
    assert item["sourceOriginalB51PositionsUnchanged"] is True
    assert item["newGameColliders"]==0
    assert item["realSourceB48StudyGeometryDifferent"]==(mode!="ORIGINAL")
    assert item["humanGameplayCertified"] is False
    assert item["realBrowserWebGLRendered"] is False
    assert item["ART"]==item["GAMEPLAY"]==item["HUMAN"]=="HOLD"
    assert item["originalSourceStatus"] in ("running","failed","finished")
    assert item["originalSourceGameActuallyFinished"]==(item["originalSourceStatus"]=="finished")
    assert 17<=item["originalSourceTerminalTimeSeconds"]<=24.001
    assert item["nativePhysicalLastB48Support"] is not None
    last=item["nativePhysicalLastB48Support"]
    assert 0<last["timeSeconds"]<=item["originalSourceTerminalTimeSeconds"]
    assert abs(last["timeSeconds"]*240-last["tick"])<.0001
    assert item["lastRoadContactAfter17Clock"]==round(last["timeSeconds"],6)
    assert 0<=item["sourceGroundedTickShareAfter17"]<=1
    assert 0<=item["longestUninterruptedRealRoadContactAfter17Seconds"]<=7
    assert item["actualEngineAirTransitionsAfter17"]>=0
    assert item["actualEngineRecontactsAfter17"]>=0
    if item["originalSourceStatus"]=="failed":assert item["originalNativeFailReason"] is not None
    else:assert item["originalNativeFailReason"] is None
    evidence=item["nativeQuarterSecondSourcePhysicsTrace"]
    assert len(evidence)>=5
    ticks=[x["tick"] for x in evidence]
    assert ticks==sorted(ticks) and len(ticks)==len(set(ticks))
    assert all(abs(x["seconds"]-x["tick"]/240)<.00001 for x in evidence)
    assert all(len(x["playerWorldXYZ"])==3 for x in evidence)
    assert all(-1<=x["steer"]<=1 for x in evidence)
    assert all(x["originalB48SupportWitness"] is None or (
      x["originalB48SupportWitness"]["normalY"]>.15 and
      x["originalB48SupportWitness"]["distance"]<=.691) for x in evidence)
    meta=item["sourceB48StudyGeometryMetadata"]
    assert meta["originalSourceGameBlob"]==SRC
    assert meta["original28B51PosesFrozenForIsolation"] is True
    assert meta["realSourceB48ChangedRows"]==([] if mode=="ORIGINAL" else meta["realSourceB48ChangedRows"])
    assert len(meta["studyRealRoadSourceGeomPost"])==14
    if mode=="ORIGINAL":
     assert meta["studyRealRoadSourceGeomPost"]==d["recordedSourceExperiments"][road]["ORIGINAL"][0]["sourceB48StudyGeometryMetadata"]["studyRealRoadSourceGeomPost"]
     assert meta["maxChangedMetres"]==0
     assert item["originallyExactlyParityAt13"] is True
     assert item["originallyExactlyParityAt14"] is True
    else:
     assert meta["maxChangedMetres"]>3
     assert len(meta["realSourceB48ChangedRows"])>=6
     assert meta["realSourceB48ChangedRows"]==sorted(meta["realSourceB48ChangedRows"])
     originalData=d["recordedSourceExperiments"][road]["ORIGINAL"][0]["sourceB48StudyGeometryMetadata"]["studyRealRoadSourceGeomPost"]
     assert any(abs(r["widthXZ"]-p["widthXZ"])>.1 or r["centre"]!=p["centre"]
       for r,p in zip(meta["studyRealRoadSourceGeomPost"],originalData))
    if mode=="ORIGINAL" and item["steering"]["bias"]==0:
     ref=REF[road]
     assert abs(ref["actualRunnerTimeSeconds"]-item["originalSourceTerminalTimeSeconds"])<.00001
     assert item["originalSourceStatus"]==ref["actualRunnerStatus"]=="failed"
    if mode=="ORIGINAL" and item["steering"]["bias"]==.18:
     source=next(x for x in N2["sourceEvidenceByRoad"][road]
       if x["controlStartSeconds"]==15.75 and x["additiveRightInput"]==.18)
     assert abs(source["actualOriginalRunnerEndTimeSeconds"]-item["originalSourceTerminalTimeSeconds"])<.00001
     assert abs(source["physicalOriginalRoadLastGrounded"]["seconds"]-last["timeSeconds"])<.00001
    entries.append({
     "mode":mode,"steer":item["steering"]["id"],
     "sourceOriginalRoadActuallyLastSupported":last["timeSeconds"],
     "trueSourceOriginalRunnerStatus":item["originalSourceStatus"],
     "trueNativeTerminal":item["originalSourceTerminalTimeSeconds"],
     "contactShareAfter17":item["sourceGroundedTickShareAfter17"],
     "sourcePhysicalRealEditedB48":mode!="ORIGINAL",
     "formalGameplayPass":False})
  data[road]=entries
 return data
out=check(D)
def disallow(name,mut):
 d=copy.deepcopy(D);mut(d)
 try:check(d)
 except (AssertionError,KeyError,ValueError,TypeError,IndexError):return name
 raise AssertionError("FORGED_R15O_ORIGINAL_GAME_APPROVAL "+name)
tests=[
 ("fake_art",lambda d:d.__setitem__("officialArt",1)),
 ("fake_colliders",lambda d:d.__setitem__("newGameColliders",1)),
 ("fake_sha",lambda d:d.__setitem__("originalGameSourceBlob","bad")),
 ("fake_24",lambda d:d.__setitem__("fullActualNativeRealDrivingTrials",24)),
 ("fake_ccd",lambda d:d.__setitem__("originalPhysicsCCDChanged",True)),
 ("fake_real_webgl",lambda d:d.__setitem__("originalHumanGameWebGLRendered",True)),
 ("fake_moving",lambda d:d.__setitem__("originalB51DynamicHazardShapesAndPositionsFrozen",False)),
 ("fake_game",lambda d:d.__setitem__("GAMEPLAY","PASS")),
 ("fake_source_geometry",lambda d:d["recordedSourceExperiments"]["true-pinch"]["A_OUTER_SHOULDER_8M"][0].__setitem__("realSourceB48StudyGeometryDifferent",False)),
 ("fake_source_time",lambda d:d["recordedSourceExperiments"]["pinch-switch"]["ORIGINAL"][0].__setitem__("originalSourceTerminalTimeSeconds",52)),
 ("fake_source_steer",lambda d:d["recordedSourceExperiments"]["true-pinch"]["ORIGINAL"][1]["steering"].__setitem__("bias",.9)),
 ("fake_human",lambda d:d["recordedSourceExperiments"]["pinch-switch"]["B_BANKED_OUTER_SHOULDER_16M"][0].__setitem__("humanGameplayCertified",True))]
qa={"schema":"dopagaki.r15o-independent-original-physical-b48-real-native-16-trials-veto/1",
 "sourceBlob":SRC,"trueOriginalGameOnlySourcePhysicsReplay":True,
 "comparisonWithoutOriginalGameSourceEdits":True,
 "allSixteenSourceStudyCases":out,
 "forgedSourceAndArtGameplayHumanPromotionRejected":[disallow(n,fn) for n,fn in tests],
 "officialArt":0,"officialSlope2Meters":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD"}
os.makedirs(a.out,exist_ok=True)
with open(os.path.join(a.out,"R15O_INDEPENDENT_REAL_B48_16_NATIVE_GEOMETRY_CHANGE_QA.json"),"w") as f:
 json.dump(qa,f,indent=2,ensure_ascii=False)
print("R15O_INDEPENDENT_TRUE_REAL_B48_PHYSICAL_CHANGE",qa,flush=True)
