"""R15L2 independent native engine terminal and analog sensitivity audit.

Immutable source physics file SHA is checked by Actions. This independent
contract verifies source R15L native t17 camera, alternative input begins
ONLY after t17.0, original scenario exact terminal timing, all per quarter
second samples and no invented human/art/52s approvals.
"""
import argparse,copy,json,math,os
P=argparse.ArgumentParser()
for x in ("source","true-pinch","pinch-switch","out"):P.add_argument("--"+x,required=True)
a=P.parse_args()
read=lambda p:json.load(open(p,encoding="utf8"))
source=read(a.source)
raw={r:read(getattr(a,r.replace("-","_"))) for r in ("true-pinch","pinch-switch")}
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
ROADS=("true-pinch","pinch-switch")
variants=["ORIGINAL","AFTER17_LEFT_ANALOG_MINUS_0P35","AFTER17_RIGHT_ANALOG_PLUS_0P35"]
deltas=[0,-.35,.35]
def diff(a,b):return max(abs(x-y) for x,y in zip(a,b))
def check(d):
 assert d["schema"]=="dopagaki.r15l2-native-original-failure-reason-and-after17-analog-sensitivity/1"
 assert d["sourceBlob"]==SRC and all(raw[k]["sourceBlob"]==SRC for k in ROADS)
 assert (d["originalWorldCX"],d["originalWorldB48"],d["originalWorldB51"],d["originalPhysicsHz"])==(18,7,28,240)
 assert d["sourceNativeReplayFromR15LOriginalArtifact"] is True
 assert d["twoOriginalRoads"]==list(ROADS)
 assert d["isolatedPost17AnalogAlternativesPerRoad"]==3
 assert all(d[k] is False for k in ("originalSourceScriptChanged","genuineHumanPlaySession","actualGameBrowserWebGL"))
 assert d["originalArtAccepted"]==d["officialSlope2Meters"]==d["newGameColliders"]==0
 assert all(d[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
 cases=d["originalSourceScenarioAndTwoAfter17UserInputSensitivityTrials"]
 assert set(cases)==set(ROADS)
 summary={}
 for road in ROADS:
  reference=raw[road]
  start=next(f for f in reference["originalFullTimelineFrames"] if f["id"]=="t1700")
  assert reference["originalRunnerTimeSeconds"] if "originalRunnerTimeSeconds" in reference else True
  values=cases[road]
  assert len(values)==3 and [v["scenario"] for v in values]==variants
  assert [v["post17InputDelta"] for v in values]==deltas
  terminal=[]
  for v in values:
   assert v["sourceRoad"]==road
   assert v["originalP96InputPreservedUntil17Seconds"] is True
   assert all(v[k] is False for k in ("humanKeyboardSteeringTested","gameInputOrPhysicsModified",
      "collisionSourceGeometryReplaced","gameplayOriginal52SecondCompletionCertified",
      "gameplaySafetyApproved"))
   f=v["exactOriginalCameraAndPhysicalRoadAt17"]
   assert f["tick"]==4080 and f["original17CameraAndPhysicsPositionParity"] is True
   assert f["originalRoad"]==start["physicalRoad"]
   assert diff(f["playerPosition"],start["playerPosition"])<.00001
   assert diff(f["originalSourceEye"],start["eye"])<.00001
   assert abs(f["originalSpeedMps"]-start["speedMps"])<.01
   assert v["trueOriginalEngineStatus"] in ("failed","finished","running")
   assert 17<=v["simulationStoppedAtSeconds"]<=24.01
   assert v["lastGroundedWithOriginalB48WorldAtSeconds"]<=v["simulationStoppedAtSeconds"]
   assert v["originalRunnerAirTimeAtEnd"]>=0
   assert v["originalRunnerCollisionCount"]>=0
   samples=v["actualNativeLastEightSecondsQuarterSecondSamples"]
   assert samples and samples[0]["seconds"]>=16
   assert samples[-1]["seconds"]<=v["simulationStoppedAtSeconds"]+.000001
   assert all(0<=f["airTimeSeconds"]<=25 and len(f["position"])==3 for f in samples)
   assert all(f["runnerStatus"] in ("running","failed","finished") for f in samples)
   assert len({p["tick"] for p in samples})==len(samples)
   assert [p["tick"] for p in samples]==sorted(p["tick"] for p in samples)
   for s in samples:
    assert s["tick"]>0 and abs(s["tick"]/240-s["seconds"])<.00002
    assert -1<=s["actualUserAnalogScenarioInput"]<=1
   failure=v["actualSourceFixedScriptFailure"]
   if v["trueOriginalEngineStatus"]=="failed":
    assert failure is not None
    assert failure["reason"] in (
      "コースから落下","長時間の空中離脱","速度上限600m/s",
      "移動障害物の接触解決が上限に達しました","移動障害物の接触判定が収束しませんでした")
    assert abs(failure["t"]-v["simulationStoppedAtSeconds"])<.0001
    assert len(failure["worldXYZ"])==3 and failure["speedMps"]>0
   else:assert failure is None
   if v["trueOriginalEngineStatus"]=="running":
    assert v["endTruncatedAt24SecondsNoFinishCertification"] is True
    assert abs(v["simulationStoppedAtSeconds"]-24)<.01
   else:assert v["endTruncatedAt24SecondsNoFinishCertification"] is False
   terminal.append({"trial":v["scenario"],"status":v["trueOriginalEngineStatus"],
    "terminalSeconds":v["simulationStoppedAtSeconds"],
    "failedReason":failure["reason"] if failure else None})
  base=values[0]
  assert base["trueOriginalEngineStatus"]==reference["actualRunnerStatus"]=="failed"
  assert abs(base["simulationStoppedAtSeconds"]-reference["actualRunnerTimeSeconds"])<.001
  # Steering offset starts after t17. Before then must share source t17.
  assert all(x["exactOriginalCameraAndPhysicalRoadAt17"]["playerPosition"]==
       base["exactOriginalCameraAndPhysicalRoadAt17"]["playerPosition"] for x in values)
  summary[road]=terminal
 return {"originalTwoRoadNativeStatusFailureReason":summary,
  "originalPriorR15LAt17CameraVerified":True,
  "onlyAnalogInputSensitivityNotHumanGameplay":True,
  "actualNewSourceGameColliderCount":0}
out=check(source)
def veto(name,change):
 copied=copy.deepcopy(source)
 change(copied)
 try:check(copied)
 except (AssertionError,KeyError,IndexError,TypeError,ValueError):return name
 raise AssertionError("R15L2_FRAUD_PASS_"+name)
test=source["originalSourceScenarioAndTwoAfter17UserInputSensitivityTrials"]["true-pinch"]
mut=[
 ("art",lambda x:x.__setitem__("originalArtAccepted",1)),
 ("webgl",lambda x:x.__setitem__("actualGameBrowserWebGL",True)),
 ("human",lambda x:x.__setitem__("genuineHumanPlaySession",True)),
 ("collider",lambda x:x.__setitem__("newGameColliders",1)),
 ("failrelabel",lambda x:x["originalSourceScenarioAndTwoAfter17UserInputSensitivityTrials"]["true-pinch"][0].__setitem__("trueOriginalEngineStatus","finished")),
 ("source",lambda x:x.__setitem__("sourceBlob","fake")),
 ("r17parity",lambda x:x["originalSourceScenarioAndTwoAfter17UserInputSensitivityTrials"]["true-pinch"][1]["exactOriginalCameraAndPhysicalRoadAt17"]["playerPosition"].__setitem__(0,55)),
 ("analog",lambda x:x["originalSourceScenarioAndTwoAfter17UserInputSensitivityTrials"]["true-pinch"][1].__setitem__("post17InputDelta",1)),
 ("terminal",lambda x:x["originalSourceScenarioAndTwoAfter17UserInputSensitivityTrials"]["true-pinch"][0].__setitem__("simulationStoppedAtSeconds",52)),
 ("failure",lambda x:x["originalSourceScenarioAndTwoAfter17UserInputSensitivityTrials"]["true-pinch"][0]["actualSourceFixedScriptFailure"].__setitem__("reason","APPROVED")),
 ("sourceGame",lambda x:x.__setitem__("originalSourceScriptChanged",True)),
 ("unfair",lambda x:x["originalSourceScenarioAndTwoAfter17UserInputSensitivityTrials"]["pinch-switch"][0].__setitem__("gameplaySafetyApproved",True))]
out["forgedGameAndFailureClaimsRejected"]=[veto(name,fn) for name,fn in mut]
out.update({"schema":"dopagaki.r15l2-independent-true-runner-failure-after17-analog-qa/1",
 "sourceBlob":SRC,"genuineSourceEndReasonIndependentContractChecked":True,
 "officialArt":0,"officialSlope2Meters":0,"ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD"})
os.makedirs(a.out,exist_ok=True)
with open(os.path.join(a.out,"R15L2_INDEPENDENT_ACTUAL_TERMINAL_AND_ANALOG_QA.json"),"w",encoding="utf8") as f:
 json.dump(out,f,indent=2,ensure_ascii=False)
print("R15L2_INDEPENDENT_ACTUAL_NATIVE_ENGINE_FAILURE_AND_POST17_ANALOG",out,flush=True)
