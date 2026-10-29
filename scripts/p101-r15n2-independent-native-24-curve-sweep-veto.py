"""R15N2 independent 24 actual fixed P96 input-only B48 source 240Hz study.

No style or physics certification from increased grounded time alone. Check
same t14 original R1 camera parity, 12x2 distinct values, failure status,
native 240Hz audit sample consistency and false game/art release vetoes.
"""
import os,argparse,math,copy,json
p=argparse.ArgumentParser()
for k in ("native","true-pinch","pinch-switch","out"):p.add_argument("--"+k,required=True)
a=p.parse_args()
read=lambda f:json.load(open(f,encoding="utf8"))
D=read(a.native);SRC="af076d67492a677d2235e4730aef8cdf4808e106"
ROADS=("true-pinch","pinch-switch");STARTS=(15,15.75,16.25,16.5)
BIAS=(.18,.35,.52)
natives={r:read(getattr(a,r.replace("-","_"))) for r in ROADS}
def check(x):
 assert x["schema"]=="dopagaki.r15n2-original-source-native-240hz-earlier-steering-24-matched-input-trials/1"
 assert x["sourceBlob"]==SRC
 assert (x["originalPhysicsHz"],x["sourceNativeB48"],x["sourceNativeB51"])==(240,7,28)
 assert x["nativeRoads"]==list(ROADS)
 assert x["inputStartVariantsSeconds"]==list(STARTS)
 assert x["analogRightAdditionVariants"]==list(BIAS)
 assert x["realOriginalRunnerMaximumObservationSeconds"]==22
 assert all(x[k] is False for k in ("sourceGameEdited","actualNewGameRoadGeometry",
  "genuineHumanControllerPass","actualGameWebGLRendered"))
 assert x["gameplayCompletedCourseUnprovenUnlessNativeStatusFinished"] is True
 assert x["newGameColliders"]==x["officialArt"]==x["officialSlope2Meters"]==0
 assert all(x[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
 assert set(x["sourceEvidenceByRoad"])==set(ROADS)
 summary={}
 for road in ROADS:
  native=natives[road];assert native["sourceBlob"]==SRC
  assert len(native["originalR1OverlappingTrue13FramesParity"])==13
  trials=x["sourceEvidenceByRoad"][road]
  assert len(trials)==12
  options={(u["controlStartSeconds"],u["additiveRightInput"]) for u in trials}
  assert options=={(t,b) for t in STARTS for b in BIAS}
  assert len(set(map(id,trials)))==12
  ranking=[]
  for u in trials:
   assert u["exactSourceNativeT14PoseCameraAndContactParity"] is True
   assert u["actualOriginalSourceScenarioRoad"]==road
   assert all(u[k] is False for k in ("originalGameSourceModified",
     "originalPlayerInputHumanControlled","originalB48B51CollidersChanged",
     "originalCourseWebGLRendered","originalSourcePhysicsPassedHumanCert"))
   assert u["officialArt"]==u["officialSlope2Meters"]==0
   assert u["originalSourceRunnerStatusAtEnd"] in ("failed","finished","running")
   assert u["actuallyCompletedOriginalCourse"]==(u["originalSourceRunnerStatusAtEnd"]=="finished")
   assert 14<=u["actualOriginalRunnerEndTimeSeconds"]<=22.00001
   if u["originalSourceRunnerStatusAtEnd"]=="failed":
    assert u["originalEngineFailure"]
    assert u["originalEngineFailure"]["reason"] in (
     "コースから落下","長時間の空中離脱","速度上限600m/s",
     "移動障害物の接触判定が収束しませんでした",
     "移動障害物の接触解決が上限に達しました")
    assert abs(u["originalEngineFailure"]["timeSeconds"]-u["actualOriginalRunnerEndTimeSeconds"])<.0001
   else:assert u["originalEngineFailure"] is None
   if u["originalSourceRunnerStatusAtEnd"]=="running":
    assert abs(u["actualOriginalRunnerEndTimeSeconds"]-22)<.00001
   last=u["physicalOriginalRoadLastGrounded"]
   assert last is None or (0<=last["seconds"]<=u["actualOriginalRunnerEndTimeSeconds"]
     and last["tick"]==round(last["seconds"]*240))
   if u["trueRoadContactShareTicksFrom17"] is not None:
    assert 0<=u["trueRoadContactShareTicksFrom17"]<=1
   trace=u["sourceQuarterSecondRoadAndInputEvidence"]
   assert len(trace)>0
   ticks=[t["tick"] for t in trace]
   assert ticks==sorted(ticks) and len(set(ticks))==len(ticks)
   assert all(abs(t["seconds"]-t["tick"]/240)<.00003 for t in trace)
   assert all(-1<=t["input"]<=1 for t in trace)
   assert all(t["nativeRunnerStatus"] in ("failed","finished","running") for t in trace)
   assert all(len(t["positionXYZ"])==3 for t in trace)
   ranking.append((u["physicalOriginalRoadLastGrounded"]["seconds"] if last else 0,
    u["trueRoadContactShareTicksFrom17"] or 0,
    -u["controlStartSeconds"],-u["additiveRightInput"]))
  assert ranking==sorted(ranking,reverse=True)
  summary[road]={"genuinelyDifferentNative240HzExperiments":12,
   "latestTruePhysicalRoadSupportSeconds":round(max(t["physicalOriginalRoadLastGrounded"]["seconds"] for t in trials if t["physicalOriginalRoadLastGrounded"]),5),
   "numberWithActualGameFinishedStatus":sum(t["originalSourceRunnerStatusAtEnd"]=="finished" for t in trials),
   "numberStillRunningAt22sButNotCertifiedFinished":sum(t["originalSourceRunnerStatusAtEnd"]=="running" for t in trials),
   "bestSourceObservedPhysicalRoadPersistenceInput":{
    "startedAtSeconds":trials[0]["controlStartSeconds"],
    "rightBias":trials[0]["additiveRightInput"],
    "lastGroundedSeconds":trials[0]["physicalOriginalRoadLastGrounded"]["seconds"]}}
 return summary
result=check(D)
def veto(name,edit):
 d=copy.deepcopy(D);edit(d)
 try:check(d)
 except (AssertionError,KeyError,TypeError,IndexError,ValueError,ZeroDivisionError):return name
 raise AssertionError("R15N2_FALSE_NATIVE_SOURCE_CERTIFICATION_"+name)
tests=[
 ("false_source",lambda x:x.__setitem__("sourceBlob","fake")),
 ("false_webgl",lambda x:x.__setitem__("actualGameWebGLRendered",True)),
 ("false_human",lambda x:x.__setitem__("genuineHumanControllerPass",True)),
 ("false_game",lambda x:x.__setitem__("GAMEPLAY","PASS")),
 ("false_art",lambda x:x.__setitem__("officialArt",1)),
 ("false_colliders",lambda x:x.__setitem__("newGameColliders",20)),
 ("false_52",lambda x:x.__setitem__("realOriginalRunnerMaximumObservationSeconds",52)),
 ("false_steering",lambda x:x["sourceEvidenceByRoad"]["true-pinch"][0].__setitem__("additiveRightInput",2)),
 ("false_finish",lambda x:x["sourceEvidenceByRoad"]["true-pinch"][0].__setitem__("actuallyCompletedOriginalCourse",True)),
 ("false_tick",lambda x:x["sourceEvidenceByRoad"]["pinch-switch"][0]["sourceQuarterSecondRoadAndInputEvidence"][0].__setitem__("tick",999)),
 ("false_road",lambda x:x["sourceEvidenceByRoad"]["pinch-switch"][0].__setitem__("actualOriginalSourceScenarioRoad","wrong")),
 ("false_sort",lambda x:x["sourceEvidenceByRoad"]["true-pinch"].reverse())]
qa={"schema":"dopagaki.r15n2-independent-original-p96-240hz-start-steer-24-studies-veto/1",
 "sourceBlob":SRC,"originalNativeTrueP96PhysicsNotChanged":True,
 "genuineSourceObservations":result,"artAndGameplayOfficiallyHold":True,
 "forgedSourceAndGameApprovalsRejected":[veto(n,fn) for n,fn in tests],
 "officialArt":0,"officialSlope2Meters":0,"ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD"}
os.makedirs(a.out,exist_ok=True)
with open(os.path.join(a.out,"R15N2_INDEPENDENT_ACTUAL_EARLY_RIGHT_STEER_24_NATIVE_QA.json"),"w",encoding="utf8") as f:
 json.dump(qa,f,indent=2,ensure_ascii=False)
print("R15N2_REAL_NATIVE_STARTTIME_STEERING_INDEPENDENT_QA",qa,flush=True)
