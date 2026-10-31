"""Independent R15P 8 real 240Hz original B48 native SCISSOR entry
physical study, preserve B16 CROWN baseline, reject fake gameplay/art.
"""
import json,copy,argparse,os,math
p=argparse.ArgumentParser()
for a in ("result","old","out"):p.add_argument("--"+a,required=True)
a=p.parse_args()
read=lambda p:json.load(open(p,encoding="utf8"))
D=read(a.result);REF=read(a.old)
SHA="af076d67492a677d2235e4730aef8cdf4808e106"
ROADS=("true-pinch","pinch-switch")
MODES=("ORIGINAL_B16_CROWN_NO_SCISSOR_PATCH","SCISSOR_OUTER_EDGE_RAMP_8M",
 "SCISSOR_OUTER_EDGE_RAMP_16M","SCISSOR_OUTER_EDGE_RAMP_24M")
def verify(x):
 assert x["schema"]=="dopagaki.r15p-original-240hz-crown-b16-and-scissor-entry-4-source-geometries-8-trials/1"
 assert x["originalSourceGameBlob"]==REF["sourceGameBlob"]==SHA
 assert x["originalRealNativeHz"]==240
 assert x["sourceWorlds"]==list(ROADS)
 assert x["originalFourCandidateScissorVariants"]==list(MODES)
 assert x["originalB16CrownSourcePreserved"] is True
 assert x["fullOriginalNativeRunCount"]==8
 assert x["frozenOriginalB51ShapesPositions"] is True
 assert x["originalGameSourceUnchanged"] is True
 assert x["originalPhysicsUnchanged"] is True
 assert x["newPublicGameColliders"]==x["officialArt"]==x["officialSlope2Meters"]==0
 assert x["realBrowserWebGLRendered"] is False
 assert all(x[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
 assert set(x["realSourceEightFullPhysicsReplays"])==set(ROADS)
 output={}
 for road in ROADS:
  scenarios=x["realSourceEightFullPhysicsReplays"][road]
  assert set(scenarios)==set(MODES)
  old=REF["actualExtendedOriginalSourceEvidence"][road]["extendedActualNativeB48Study"]
  z=[]
  for mode in MODES:
   item=scenarios[mode]
   assert item["realNativeStudySourceRoad"]==road
   assert item["scissorPhysicalVariant"]==mode
   assert item["trueNativeOriginalCrownB16PhysicsReplayedUnchangedAt17"] is True
   assert item["sourceGameEdited"] is False and item["sourceOriginal28MovingObstaclesUnmodified"] is True
   assert item["gameProductionNotModified"] is True and item["artHumanOrGameplayCertified"] is False
   meta=item["studyActualScissorGeometrySourceMetadata"]
   assert meta["sourceGameBlob"]==SHA and meta["mode"]==mode
   assert meta["studiedOriginalNativeRoad"]=="p93-SCISSOR_RISE-01"
   assert meta["originalB16CrownPreservedExactly"] is True
   assert meta["originalSCISSORRoadEntryRow0Preserved"] is True
   assert meta["originalSCISSORAfterRow9Preserved"] is True
   assert meta["original28B51FrozenPositionsAndShapes"] is True
   assert meta["trulyRideableGeometryOnly"] is True
   assert meta["newInvisibleSupports"]==0 and meta["realGameProductionPatch"] is False
   assert meta["actualHumanOrArtPass"] is False
   assert len(meta["beforeOriginalScissorWidths"])==len(meta["afterStudyScissorWidths"])==13
   assert all(e["row"]==f["row"] for e,f in zip(meta["beforeOriginalScissorWidths"],meta["afterStudyScissorWidths"]))
   if mode==MODES[0]:
    assert meta["sourceRealB48ModifiedRows"]==[]
    assert meta["physicalChangedSourceMaximumMetres"]==0
    assert meta["beforeOriginalScissorWidths"]==meta["afterStudyScissorWidths"]
   else:
    assert len(meta["sourceRealB48ModifiedRows"])>=5
    assert min(meta["sourceRealB48ModifiedRows"])==1
    assert max(meta["sourceRealB48ModifiedRows"])<=8
    assert meta["physicalChangedSourceMaximumMetres"]>5
    assert all(x["row"]!=0 and x["row"]>=9 and x==y for x,y in zip(
      [x for x in meta["beforeOriginalScissorWidths"] if x["row"]>=9],
      [x for x in meta["afterStudyScissorWidths"] if x["row"]>=9]))
   q=item["actualFullNativeSourceRoadAndContacts"]
   assert q["road"]==road and q["geometryMode"]=="B_BANKED_OUTER_SHOULDER_16M"
   assert q["sourceBlob"]==SHA
   assert q["originalGameEdited"] is False
   assert q["sourceOriginalB51PositionsUnchanged"] is True
   assert q["newGameColliders"]==0
   assert q["realBrowserWebGLRendered"] is False
   assert q["humanGameplayCertified"] is False
   assert q["ART"]==q["GAMEPLAY"]==q["HUMAN"]=="HOLD"
   assert q["sourceExact17RealPosCam"]==old["sourceExact17RealPosCam"]
   assert 22<=q["originalSourceTerminalTimeSeconds"]<=32.00001
   assert q["originalSourceStatus"] in ("running","failed","finished")
   assert q["originalSourceGameActuallyFinished"]==(q["originalSourceStatus"]=="finished")
   assert q["nativePhysicalLastB48Support"]["timeSeconds"]<=q["originalSourceTerminalTimeSeconds"]
   assert q["originalNativeFailReason"] is not None if q["originalSourceStatus"]=="failed" else q["originalNativeFailReason"] is None
   trace=q["nativeQuarterSecondSourcePhysicsTrace"]
   assert len(trace)>20 and all(abs(t["seconds"]-t["tick"]/240)<.00001 for t in trace)
   if mode==MODES[0]:
    assert q["originalSourceStatus"]==old["originalSourceStatus"]=="failed"
    assert abs(q["originalSourceTerminalTimeSeconds"]-old["originalSourceTerminalTimeSeconds"])<.00001
    assert q["nativePhysicalLastB48Support"]==old["nativePhysicalLastB48Support"]
    assert trace==old["nativeQuarterSecondSourcePhysicsTrace"]
   z.append({"mode":mode,
    "sourceNativeRunnerStatus":q["originalSourceStatus"],
    "realSourceTerminalSeconds":q["originalSourceTerminalTimeSeconds"],
    "realOriginalRoadLastContactSeconds":q["nativePhysicalLastB48Support"]["timeSeconds"],
    "sourceRoadLastGroundedId":q["nativePhysicalLastB48Support"]["road"],
    "sourceRealNewGameColliders":0,
    "originalSourceP96PolicyUnchanged":True,
    "originalGameArtworkOrHumanPass":False})
  output[road]=z
 return output
out=verify(D)
def fake(name,fn):
 d=copy.deepcopy(D);fn(d)
 try:verify(d)
 except (AssertionError,KeyError,TypeError,ValueError,IndexError):return name
 raise AssertionError("R15P_FAKE_GAME_REPAIR_"+name)
tests=[
 ("false_art",lambda d:d.__setitem__("officialArt",1)),
 ("false_game",lambda d:d.__setitem__("GAMEPLAY","PASS")),
 ("false_webgl",lambda d:d.__setitem__("realBrowserWebGLRendered",True)),
 ("false_sha",lambda d:d.__setitem__("originalSourceGameBlob","fake")),
 ("false_source",lambda d:d.__setitem__("originalGameSourceUnchanged",False)),
 ("false_8",lambda d:d.__setitem__("fullOriginalNativeRunCount",16)),
 ("false_b51",lambda d:d.__setitem__("frozenOriginalB51ShapesPositions",False)),
 ("false_52",lambda d:d["realSourceEightFullPhysicsReplays"]["true-pinch"]["SCISSOR_OUTER_EDGE_RAMP_8M"]["actualFullNativeSourceRoadAndContacts"].__setitem__("originalSourceTerminalTimeSeconds",52)),
 ("false_edit",lambda d:d["realSourceEightFullPhysicsReplays"]["pinch-switch"]["SCISSOR_OUTER_EDGE_RAMP_16M"]["studyActualScissorGeometrySourceMetadata"].__setitem__("originalSCISSORRoadEntryRow0Preserved",False)),
 ("false_finish",lambda d:d["realSourceEightFullPhysicsReplays"]["true-pinch"][MODES[0]]["actualFullNativeSourceRoadAndContacts"].__setitem__("originalSourceGameActuallyFinished",True))]
qa={"schema":"dopagaki.r15p-independent-real-original-240hz-scissor-8-source-physics-veto/1",
 "sourceBlob":SHA,"originalGameSourceUnchanged":True,
 "eightActualNewPhysicalOriginalSourceRoadTrials":out,
 "forgedGameplayRoadSafetyAndArtClaimsRejected":[fake(n,f) for n,f in tests],
 "officialArt":0,"officialSlope2Meters":0,"ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD"}
os.makedirs(a.out,exist_ok=True)
with open(os.path.join(a.out,"R15P_INDEPENDENT_REAL_SCISSOR_B48_NATIVE_8_TRIALS_QA.json"),"w",encoding="utf8") as f:
 json.dump(qa,f,indent=2,ensure_ascii=False)
print("R15P_INDEPENDENT_REAL_SOURCE_SCISSOR_RISE_GEOMETRY",qa,flush=True)
