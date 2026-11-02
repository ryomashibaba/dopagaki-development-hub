"""R15O4 independent audit that 24-second "running" was provisional.
Original 240Hz physical B48 B16 repair, never false official completion.
"""
import argparse,json,os,copy,math
p=argparse.ArgumentParser()
for k in ("real","old","out"):p.add_argument("--"+k,required=True)
a=p.parse_args()
read=lambda p:json.load(open(p,encoding="utf8"))
T=read(a.real);old=read(a.old)
SHA="af076d67492a677d2235e4730aef8cdf4808e106"
roads=("true-pinch","pinch-switch");mode="B_BANKED_OUTER_SHOULDER_16M"
def verify(d):
 assert d["schema"]=="dopagaki.r15o4-original-b48-banked-16m-real-240hz-after24-source/1"
 assert d["sourceGameBlob"]==old["originalGameSourceBlob"]==SHA
 assert d["sourceNative240Hz"] and d["fullTrialHorizonSeconds"]==36
 assert d["sourceRoads"]==list(roads)
 assert d["originalB48SourcePhysicalVersion"]=="R15O "+mode
 assert d["originalGameProgramEdited"] is False
 assert d["sourceNativePhysicsCCDChanged"] is False
 assert d["formalGameBridgeOrRoadPublished"] is False
 assert d["otherOriginalSixRoadsUnchanged"] is True
 assert d["actualOriginalB51HazardDefinitionsFrozen"] is True
 assert d["newGameColliders"]==d["officialArt"]==d["officialSlope2Meters"]==0
 assert d["originalGameWebGLRendered"] is False
 assert all(d[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
 assert set(d["actualExtendedOriginalSourceEvidence"])==set(roads)
 out={}
 for r in roads:
  a=d["actualExtendedOriginalSourceEvidence"][r]
  b=old["recordedSourceExperiments"][r][mode][0]
  assert a["original24SecondActualNative"]==b["originalSourceStatus"]=="running"
  assert a["original24SecondLastContact"]==b["nativePhysicalLastB48Support"]["timeSeconds"]
  assert a["exactOriginalReal24sSteeringAndPhysicsReplayed"] is True
  assert a["noOriginalGameOrB51Changes"] is True
  assert a["artCertified"] is False and a["humanCertified"] is False
  x=a["extendedActualNativeB48Study"]
  assert x["road"]==r and x["sourceBlob"]==SHA
  assert x["geometryMode"]==mode and x["steering"]==b["steering"]
  assert x["realSourceB48StudyGeometryDifferent"] is True
  assert x["originalB48SourcePhysicsUnchanged"] is True
  assert x["sourceOriginalB51PositionsUnchanged"] is True
  assert x["originalGameEdited"] is False
  assert x["humanGameplayCertified"] is False and x["realBrowserWebGLRendered"] is False
  assert x["newGameColliders"]==0
  assert x["ART"]==x["GAMEPLAY"]==x["HUMAN"]=="HOLD"
  assert x["originalSourceTerminalTimeSeconds"]==a["actualEngineStopOrObservationTime"]
  assert x["originalSourceStatus"]==a["beyond24SourceEngineStatus"]
  assert x["originalSourceGameActuallyFinished"]==a["actuallyFinishedOnlyIfOriginalSourceStatusFinished"]
  assert 24<=x["originalSourceTerminalTimeSeconds"]<=36.000001
  assert x["nativePhysicalLastB48Support"] is not None
  assert x["nativePhysicalLastB48Support"]["timeSeconds"]>=b["nativePhysicalLastB48Support"]["timeSeconds"]
  assert x["sourceExact17RealPosCam"]==b["sourceExact17RealPosCam"]
  assert x["sourceB48StudyGeometryMetadata"]==b["sourceB48StudyGeometryMetadata"]
  assert x["nativeQuarterSecondSourcePhysicsTrace"][:len(b["nativeQuarterSecondSourcePhysicsTrace"])]==b["nativeQuarterSecondSourcePhysicsTrace"]
  if x["originalSourceStatus"]=="failed":
   assert x["originalNativeFailReason"] is not None
  else:assert x["originalNativeFailReason"] is None
  out[r]={"original24SecondRunningWasNotFinish":True,
    "newNativeRealStopOrObservationTime":x["originalSourceTerminalTimeSeconds"],
    "newNativeSourceStatus":x["originalSourceStatus"],
    "newNativeTrueLastGroundedTime":x["nativePhysicalLastB48Support"]["timeSeconds"],
    "cause":x["originalNativeFailReason"],
    "actualSourceB48RoadWasEditedButNoPublishedCourseChanged":True,
    "notHumanOrActualWebGLArtCertification":True}
 return out
q=verify(T)
def mutation(name,fn):
 b=copy.deepcopy(T);fn(b)
 try:verify(b)
 except (AssertionError,KeyError,TypeError,ValueError,IndexError):return name
 raise AssertionError("R15O4_FALSE_RACE_SUCCESS_"+name)
checks=[
 ("fake_finish",lambda d:d["actualExtendedOriginalSourceEvidence"]["true-pinch"].__setitem__("actuallyFinishedOnlyIfOriginalSourceStatusFinished",True)),
 ("fake_52",lambda d:d["actualExtendedOriginalSourceEvidence"]["pinch-switch"].__setitem__("actualEngineStopOrObservationTime",52)),
 ("fake_human",lambda d:d["actualExtendedOriginalSourceEvidence"]["true-pinch"].__setitem__("humanCertified",True)),
 ("fake_art",lambda d:d.__setitem__("officialArt",1)),
 ("fake_b51",lambda d:d.__setitem__("actualOriginalB51HazardDefinitionsFrozen",False)),
 ("fake_game",lambda d:d.__setitem__("formalGameBridgeOrRoadPublished",True)),
 ("fake_webgl",lambda d:d.__setitem__("originalGameWebGLRendered",True)),
 ("fake_source",lambda d:d.__setitem__("sourceGameBlob","fake")),
 ("fake_prefix",lambda d:d["actualExtendedOriginalSourceEvidence"]["pinch-switch"].__setitem__("exactOriginalReal24sSteeringAndPhysicsReplayed",False)),
 ("fake_steer",lambda d:d["actualExtendedOriginalSourceEvidence"]["true-pinch"]["extendedActualNativeB48Study"]["steering"].__setitem__("bias",.5))]
out={"schema":"dopagaki.r15o4-independent-actual-native-b16-24plus-geometry-veto/1",
 "sourceBlob":SHA,"originalGameBlobUnchanged":True,
 "genuine24sBeyondNativeB48PhysicsTrialAudits":q,
 "forgedSourceAndGameplayAndArtPromotionsRejected":[mutation(k,fn) for k,fn in checks],
 "actualGameRepairedOrHumanCertified":False,"officialArt":0,"officialSlope2Meters":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD"}
os.makedirs(a.out,exist_ok=True)
with open(os.path.join(a.out,"R15O4_INDEPENDENT_TRUE_NATIVE_BANKED_B48_AFTER24_QA.json"),"w",encoding="utf8") as f:
 json.dump(out,f,indent=2,ensure_ascii=False)
print("R15O4_INDEPENDENT_GENUINE_B48_36SECOND_STUDY",out,flush=True)
