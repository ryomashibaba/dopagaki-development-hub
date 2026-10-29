"""Independent R15Q original P96 240Hz source-physics actual road curvature QA.

Reject fake finished, terrain support, collision changes, released game and
ART. Check unchanged 24-36s B16 source trace, no road widenings A/B, actual
C narrow interval and return-to-unchanged SCISSOR after row14.
"""
import argparse,json,copy,os,math
p=argparse.ArgumentParser()
for x in ("result","original","out"):p.add_argument("--"+x,required=True)
a=p.parse_args()
read=lambda f:json.load(open(f,encoding="utf8"))
D=read(a.result);O=read(a.original)
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
ROADS=("true-pinch","pinch-switch")
MODES=("B16_ONLY_REFERENCE","A_C1_SHIFT_24M_SOURCE_WIDTH","B_C1_SHIFT_40M_SOURCE_WIDTH","C_CURVE_SHIFT_30M_NARROW_16M")
def check(d):
 assert d["schema"]=="dopagaki.r15q-genuine-original-native-240hz-scissor-c1-real-curves-8-trials/1"
 assert d["originalGameSourceBlob"]==O["sourceGameBlob"]==SRC
 assert d["realSourceGameHz"]==240 and d["twoOriginalNativeB48Worlds"]==list(ROADS)
 assert d["realC1CurveStudies"]==list(MODES)
 assert d["trueOriginal240HzFullTrialCount"]==8
 assert d["originalB16CrownAndAll28B51Preserved"] is True
 assert d["originalP96InputSourceUnchanged"] is True
 assert d["originalGameJSCodeUntouched"] is True
 assert d["originalPhysicsCCDUnchanged"] is True
 assert d["publicRoadCollidersAdded"]==d["officialArt"]==d["officialSlope2Meters"]==0
 assert d["originalGameWebGLRendered"] is False
 assert all(d[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
 assert set(d["nativeScissorRealEditableSurfaceGeometryTrials"])==set(ROADS)
 outcome={}
 for road in ROADS:
  instances=d["nativeScissorRealEditableSurfaceGeometryTrials"][road]
  assert set(instances)==set(MODES)
  old=O["actualExtendedOriginalSourceEvidence"][road]["extendedActualNativeB48Study"]
  summary=[]
  for mode in MODES:
   item=instances[mode]
   assert item["sourceWorld"]==road and item["sourceStudyName"]==mode
   assert item["sourceOriginalGameCodeUnchanged"] is True
   assert item["sourceB16PhysicalCrownExactlyPreserved"] is True
   assert item["sourceActualB51DefinitionsPreserved"] is True
   assert item["sourceNativeOriginalSteeringUnchanged"] is True
   assert item["humanOrArtApproved"] is False and item["publicGameRoadMerged"] is False
   geo=item["actualPhysicalSCISSORSourceGeometry"]
   assert geo["sourceBlob"]==SRC and geo["road"]==road and geo["mode"]==mode
   assert geo["unmodifiedOriginalB16Crown"] is True
   assert geo["unmodifiedSCISSORRow0AndFromRow14"] is True
   assert geo["unchangedOtherFiveRoads"] is True
   assert geo["unchangedOriginal28B51"] is True
   assert geo["originalRouteGuideUnchanged"] is True
   assert geo["noInvisibleOrExtraColliders"] is True
   assert geo["studyOnlyHumanFairnessNotTested"] is True
   assert geo["ART"]==geo["GAMEPLAY"]==geo["HUMAN"]==geo["RELEASE"]=="HOLD"
   assert len(geo["originalCrossSectionWidthPre"])==len(geo["isolatedTrueCrossSectionWidthPost"])==19
   for n,(x,y) in enumerate(zip(geo["originalCrossSectionWidthPre"],geo["isolatedTrueCrossSectionWidthPost"])):
    assert x["row"]==y["row"]==n
    if mode in MODES[:3]:
     assert abs(x["realWidthXZ"]-y["realWidthXZ"])<.06
    if n==0 or n>=14:assert x==y
   if mode==MODES[0]:
    assert geo["changedOnlyRealScissorRows1To13"]==[]
    assert geo["maximumWorldLatticeShiftM"]==0
    assert geo["originalCrossSectionWidthPre"]==geo["isolatedTrueCrossSectionWidthPost"]
   else:
    assert geo["changedOnlyRealScissorRows1To13"]==list(range(1,14))
    assert geo["maximumWorldLatticeShiftM"]>12
    assert len(geo["shifts"])==13
    if mode==MODES[3]:
     assert geo["studiedPhysicalCurveSpec"]["narrowTarget"]==16
     assert min(y["realWidthXZ"] for y in geo["isolatedTrueCrossSectionWidthPost"][5:12])<35
    else:assert geo["studiedPhysicalCurveSpec"]["narrowTarget"] is None
   actual=item["true240HzOriginalSourcePhysics"]
   assert actual["road"]==road and actual["geometryMode"]=="B_BANKED_OUTER_SHOULDER_16M"
   assert actual["sourceBlob"]==SRC
   assert actual["steering"]=={"id":"ORIGINAL_P96_EARLY_SOFT","start":None,"bias":0}
   assert actual["sourceExact17RealPosCam"]==old["sourceExact17RealPosCam"]
   assert actual["originalGameEdited"] is False
   assert actual["sourceOriginalB51PositionsUnchanged"] is True
   assert actual["newGameColliders"]==0
   assert actual["realBrowserWebGLRendered"] is False and actual["humanGameplayCertified"] is False
   assert actual["ART"]==actual["GAMEPLAY"]==actual["HUMAN"]=="HOLD"
   assert actual["originalSourceStatus"] in ("failed","running","finished")
   assert actual["originalSourceGameActuallyFinished"]==(actual["originalSourceStatus"]=="finished")
   assert 18<=actual["originalSourceTerminalTimeSeconds"]<=32.00001
   assert actual["nativePhysicalLastB48Support"] is not None
   assert actual["nativePhysicalLastB48Support"]["timeSeconds"]<=actual["originalSourceTerminalTimeSeconds"]
   assert 0<=actual["sourceGroundedTickShareAfter17"]<=1
   assert 0<=actual["longestUninterruptedRealRoadContactAfter17Seconds"]<=15
   trace=actual["nativeQuarterSecondSourcePhysicsTrace"]
   assert len(trace)>20 and all(abs(x["tick"]/240-x["seconds"])<.00001 for x in trace)
   if actual["originalSourceStatus"]=="failed":assert actual["originalNativeFailReason"] is not None
   else:assert actual["originalNativeFailReason"] is None
   if mode==MODES[0]:
    assert actual["originalSourceStatus"]==old["originalSourceStatus"]=="failed"
    assert actual["originalSourceTerminalTimeSeconds"]==old["originalSourceTerminalTimeSeconds"]
    assert actual["nativePhysicalLastB48Support"]==old["nativePhysicalLastB48Support"]
    assert trace==old["nativeQuarterSecondSourcePhysicsTrace"]
   summary.append({"mode":mode,"sourceNativeStatus":actual["originalSourceStatus"],
    "nativeTerminalSeconds":actual["originalSourceTerminalTimeSeconds"],
    "realPhysicalLastContactSeconds":actual["nativePhysicalLastB48Support"]["timeSeconds"],
    "lastRoad":actual["nativePhysicalLastB48Support"]["road"],
    "roadMinimumWidthInFirst19Rows":min(y["realWidthXZ"] for y in geo["isolatedTrueCrossSectionWidthPost"]),
    "actualSourceOriginalRunnerFinished":actual["originalSourceGameActuallyFinished"],
    "originalNativeMovingB51Preserved":True,
    "humanWebGLAndArtNotCertified":True})
  outcome[road]=summary
 return outcome
res=check(D)
def veto(name,fn):
 d=copy.deepcopy(D);fn(d)
 try:check(d)
 except (AssertionError,KeyError,ValueError,TypeError,IndexError,ZeroDivisionError):return name
 raise AssertionError("R15Q_FORGED_SOURCE_ART_AND_GAME_"+name)
tests=[
 ("fake_source",lambda d:d.__setitem__("originalGameSourceBlob","fake")),
 ("fake_geometry",lambda d:d["nativeScissorRealEditableSurfaceGeometryTrials"]["true-pinch"][MODES[1]]["actualPhysicalSCISSORSourceGeometry"].__setitem__("unmodifiedOriginalB16Crown",False)),
 ("fake_route",lambda d:d["nativeScissorRealEditableSurfaceGeometryTrials"]["pinch-switch"][MODES[2]]["actualPhysicalSCISSORSourceGeometry"].__setitem__("originalRouteGuideUnchanged",False)),
 ("fake_edit",lambda d:d.__setitem__("originalGameJSCodeUntouched",False)),
 ("fake_webgl",lambda d:d.__setitem__("originalGameWebGLRendered",True)),
 ("fake_human",lambda d:d["nativeScissorRealEditableSurfaceGeometryTrials"]["true-pinch"][MODES[3]].__setitem__("humanOrArtApproved",True)),
 ("fake_finished",lambda d:d["nativeScissorRealEditableSurfaceGeometryTrials"]["pinch-switch"][MODES[0]]["true240HzOriginalSourcePhysics"].__setitem__("originalSourceGameActuallyFinished",True)),
 ("fake_terminal",lambda d:d["nativeScissorRealEditableSurfaceGeometryTrials"]["pinch-switch"][MODES[0]]["true240HzOriginalSourcePhysics"].__setitem__("originalSourceTerminalTimeSeconds",52)),
 ("fake_b51",lambda d:d.__setitem__("originalB16CrownAndAll28B51Preserved",False)),
 ("fake_release",lambda d:d.__setitem__("RELEASE","PASS")),
 ("fake_art",lambda d:d.__setitem__("officialArt",1)),
 ("fake_count",lambda d:d.__setitem__("trueOriginal240HzFullTrialCount",16))
]
qa={"schema":"dopagaki.r15q-independent-original-b48-c1-8-real-240hz-physical-studies-veto/1",
 "sourceGameBlob":SRC,
 "actualOriginalC1AndNarrowPhysicalRoadEvidence":res,
 "rejectedFalseOfficialGameplayOrSourceClaims":[veto(n,f) for n,f in tests],
 "originalGameCodeAndPhysicsPreserved":True,
 "humanGameplayArtWebGLNotCertified":True,
 "officialArt":0,"officialSlope2Meters":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD"}
os.makedirs(a.out,exist_ok=True)
with open(os.path.join(a.out,"R15Q_INDEPENDENT_TRUE_SOURCE_8_C1_ROAD_AND_NARROW_PHYSICS_QA.json"),"w",encoding="utf8") as f:json.dump(qa,f,indent=2,ensure_ascii=False)
print("R15Q_GENUINE_SOURCE_8_C1_NATIVE_REPLAY_QA",qa,flush=True)
