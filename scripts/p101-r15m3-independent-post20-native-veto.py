"""Independent R15M3 20-26 second source-only right steering sanity and false certification gate."""
import json,copy,argparse,os
p=argparse.ArgumentParser()
for k in ("current","original","out"):p.add_argument("--"+k,required=True)
a=p.parse_args()
read=lambda f:json.load(open(f,encoding="utf8"))
cur=read(a.current);old=read(a.original)
roads=("true-pinch","pinch-switch")
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
def evaluate(d):
 assert d["schema"]=="dopagaki.r15m3-genuine-original-16p5-right-steer-horizon26/1"
 assert d["sourceBlob"]==old["originalSourceGameBlob"]==SRC
 assert d["sourcePhysicsHz"]==240 and d["originalRoadVariants"]==list(roads)
 assert d["genuineSourceTrialPrefix15to18p25AndR15MOriginalArtifactReused"] is True
 assert d["allGamePhysicsAndOriginalB48MeshSourceUnmodified"] is True
 assert d["newlyBuiltRoads"]==d["newGameColliders"]==d["officialArt"]==d["officialSlope2Meters"]==0
 assert d["realWebGLRendered"] is False and d["humanGameplayCertified"] is False
 assert all(d[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
 a=d["actualRightInputOnlyExtendedSourceEvidence"];assert set(a)==set(roads)
 result={}
 for road in roads:
  item=a[road]
  prior=old["genuineSourceRoadDepartureExperiments"][road][2]
  assert item["samePre20ActualNativeSteeringAndPhysics"] is True
  assert item["originalAt20StateBeforeExtension"]==prior["actualRunnerStatus"]=="running"
  assert item["originalAt20LastSupportedTick"]==prior["lastPhysicalGroundedSourceSupportBeforeEngineTerminal"]["tick"]
  assert item["extendedInputScenario"]=="FROM_16P5_RIGHT_PLUS_0P35_EXTENDED_TO_26"
  assert item["R15MSourceOriginalPrefix18p25Parity"] is True
  assert item["sourceLastSupportedB48Tick"]>=item["originalAt20LastSupportedTick"]
  assert item["sourceLastSupportedRoadId"] is not None
  assert item["sourceLastSupportedB48TimeSeconds"]<=item["actualStopOrObservationLimitSeconds"]
  assert 20<=item["actualStopOrObservationLimitSeconds"]<=26.01
  assert item["extendedSourceStatus"] in ("running","failed","finished")
  assert item["actualFinishOnlyIfSourceStatusFinished"]==(item["extendedSourceStatus"]=="finished")
  assert item["trueHumanGameplayAndObstacleFairnessCertified"] is False
  assert item["actualGameSourceEdited"] is False and item["newGameColliders"]==0
  source_events=item["sourceAfter16p5PhysicalAirExitEvents"]
  assert len(source_events)>=1
  assert all(x["tick"]>3960 and x["seconds"]>16.5 for x in source_events)
  assert [x["tick"] for x in source_events]==sorted(x["tick"] for x in source_events)
  if item["extendedSourceStatus"]=="failed":
   assert item["sourceActualFailure"] is not None
   assert item["sourceActualFailure"]["reason"] in (
     "コースから落下","長時間の空中離脱","速度上限600m/s",
     "移動障害物の接触判定が収束しませんでした",
     "移動障害物の接触解決が上限に達しました")
   assert abs(item["sourceActualFailure"]["seconds"]-item["actualStopOrObservationLimitSeconds"])<1e-5
  else:assert item["sourceActualFailure"] is None
  result[road]={"nativeTerminalStatus":item["extendedSourceStatus"],
    "nativeTrueStoppedOrObservedUntil":item["actualStopOrObservationLimitSeconds"],
    "nativeFailureCause":item["sourceActualFailure"]["reason"] if item["sourceActualFailure"] else None,
    "realB48GroundedUntil":item["sourceLastSupportedB48TimeSeconds"],
    "notGameCompletionCertification":True}
 return result
summary=evaluate(cur)
def reject(name,fn):
 d=copy.deepcopy(cur)
 fn(d)
 try:evaluate(d)
 except (KeyError,AssertionError,ValueError,TypeError,IndexError):return name
 raise AssertionError("R15M3_FALSE_GAMEPLAY_CLAIM_"+name)
tests=[
 ("false_art",lambda x:x.__setitem__("officialArt",1)),
 ("false_race",lambda x:x.__setitem__("officialSlope2Meters",100)),
 ("false_webgl",lambda x:x.__setitem__("realWebGLRendered",True)),
 ("false_human",lambda x:x.__setitem__("humanGameplayCertified",True)),
 ("false_original",lambda x:x.__setitem__("allGamePhysicsAndOriginalB48MeshSourceUnmodified",False)),
 ("false_road",lambda x:x.__setitem__("newlyBuiltRoads",1)),
 ("false_26status",lambda x:x["actualRightInputOnlyExtendedSourceEvidence"]["true-pinch"].__setitem__("actualFinishOnlyIfSourceStatusFinished",True)),
 ("false_source",lambda x:x.__setitem__("sourceBlob","tampered")),
 ("false_analog",lambda x:x["actualRightInputOnlyExtendedSourceEvidence"]["pinch-switch"].__setitem__("originalAt20StateBeforeExtension","finished")),
 ("false_terminal",lambda x:x["actualRightInputOnlyExtendedSourceEvidence"]["true-pinch"].__setitem__("actualStopOrObservationLimitSeconds",52)),
 ("false_prefix",lambda x:x["actualRightInputOnlyExtendedSourceEvidence"]["pinch-switch"].__setitem__("R15MSourceOriginalPrefix18p25Parity",False)),
 ("false_safety",lambda x:x["actualRightInputOnlyExtendedSourceEvidence"]["true-pinch"].__setitem__("trueHumanGameplayAndObstacleFairnessCertified",True))]
answer={"schema":"dopagaki.r15m3-independent-genuine-20plus-source-terminal/1",
 "originalSourceBlob":SRC,"exactArchivedSource20sStateReconciled":True,
 "actualSourceRightBiasBeyond20":summary,
 "adversarialFakeHumanArtCompletionClaimsRejected":[reject(n,fn) for n,fn in tests],
 "newGameColliders":0,"officialArt":0,"officialSlope2Meters":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD"}
os.makedirs(a.out,exist_ok=True)
with open(os.path.join(a.out,"R15M3_INDEPENDENT_NATIVE_POST20_RIGHT_BIAS_QA.json"),"w",encoding="utf8") as f:json.dump(answer,f,indent=2,ensure_ascii=False)
print("R15M3_INDEPENDENT_20PLUS_ORIGINAL_NATIVE",answer,flush=True)
