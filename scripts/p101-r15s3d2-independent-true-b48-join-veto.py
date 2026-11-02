#!/usr/bin/env python3
"""Independent physical 4 trial original 240Hz SCISSOR+next-B48 source grade QA.
Reject source edits/extra collision/false finish/false signed-speed/human/game claims.
"""
import argparse,copy,json,math
from pathlib import Path
SHA="af076d67492a677d2235e4730aef8cdf4808e106"
WORLDS=("true-pinch","pinch-switch")
MODES=("J_LONG_GRADE_130","K_BANKED_GRADE_145")
def check(d):
    assert d["sourceGameBlob"]==SHA and d["sourcePhysicsHz"]==240
    assert d["trueNativeTrialCount"]==4
    assert d["trueSourceCrownPreserved"] is True
    assert d["longitudinalMacroscopicTwoRoadRealColliderRedesign"] is True
    assert d["originalB51DefinitionsPreserved"] is True
    assert d["sourcePhysicsOrCameraModified"] is False and d["extraGameColliders"]==0
    assert d["sourceWebGLRendered"] is False and d["humanFairnessEstablished"] is False
    assert d["earlyNativeR15S3BPrefixVerifiedAgainstSavedOriginal"] is True
    assert "PROXY" in d["speedDefinitions"]
    assert d["officialArt"]==d["officialSlope2Meters"]==0
    assert all(d[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
    assert set(d["cases"])==set(WORLDS)
    records=[]
    for world in WORLDS:
        assert set(d["cases"][world])==set(MODES)
        for mode in MODES:
            r=d["cases"][world][mode]
            assert r["world"]==world and r["mode"]==mode
            assert r["originalTrueB16SourcePrefixParityChecks"]==2
            assert r["sourceB48Surfaces"]==7 and r["original28MovingB51"]==28
            assert r["trueNativeStatusAtEnd"] in ("failed","running","finished")
            assert r["actualFinishedEntireCourse"]==(r["trueNativeStatusAtEnd"]=="finished")
            assert 20<r["trueTerminalOrCapSeconds"]<=45.000002
            assert r["actualSCISSORGroundedSeconds"]>=0 and r["actualNextRoadGroundedSeconds"]>=0
            assert r["negativeSCISSORTangentSpeedSamples"]>=0
            assert 0<=r["negativeSCISSORTangentSpeedSamples"]<=r["signedSCISSORRoadTangentSampleCount"]
            if r["signedSCISSORRoadTangentSampleCount"]:
                assert math.isfinite(r["sampledSignedScissorRoadTangentSpeedMeanMps"])
            if r["nativeNextRoadContactEntered"] is not None:
                entry=r["nativeNextRoadContactEntered"]
                assert r["actualNextRoadGroundedSeconds"]>0
                assert 21.5<entry["timeSeconds"]<=r["trueTerminalOrCapSeconds"]
                assert len(entry["xyz"])==3
                assert all(math.isfinite(v) for v in entry["xyz"])
            else:assert r["actualNextRoadGroundedSeconds"]==0
            assert r["sourceActualBrowserWebGL"] is False
            assert r["humanControlSuccessCertified"] is False
            assert r["artOrGameplayAdopted"] is False
            stage=r["sourcePhysicalDesignMetadata"]
            assert stage["sourceBlob"]==SHA and stage["world"]==world and stage["mode"]==mode
            assert stage["changedTruePhysicalB48Sections"]==[2,3]
            assert stage["longSCISSORGradeRows12To30"]==19
            assert stage["nextRoadPhysicalEntryRows0To19"]==20
            assert stage["freezeProvenCROWNEntireSurface"] is True
            assert stage["freezeEarlySCISSORRows0To11"] is True
            assert stage["actualNativeB48RoadCount"]==7
            assert stage["originalDynamicB51DefinitionsUnmodified"]==28
            assert stage["originalPhysicsCCDSteeringRouteAndCameraUnmodified"] is True
            assert stage["newHiddenColliders"]==0
            assert stage["noTeleportOrForceAcceleration"] is True
            assert stage["trueRoadCenterPositionGapM"]<=.0001
            assert stage["sourceTrueSurfaceNormalAndHumanCollisionContinuityNotVerified"] is True
            assert stage["actualB48ControlPointMaxDisplacementM"]>30
            assert stage["sourceBrowserWebGLRendered"] is False
            assert stage["sourceArtOrGameplayUncertified"] is True
            assert stage["officialArt"]==stage["officialSlope2Meters"]==0
            assert abs(stage["newExitY"]-(130 if mode==MODES[0] else 145))<.001
            trace=r["true240HzQuarterSecondSampledTelemetry"]
            assert len(trace)>60
            last=0
            for p in trace:
                assert p["tick"]>last
                last=p["tick"]
                assert abs(p["timeSeconds"]-p["tick"]/240)<.000002
                assert p["totalSpeedMps"]>=0
                assert -1<=p["legalNativeSteeringInput"]<=1
                assert p["realEngineStatus"] in ("running","failed","finished")
                assert isinstance(p["actualEngineGrounded"],bool)
                for field in ("totalSpeedMps","trueNativeHeadingForwardSpeedMps","legalNativeSteeringInput"):
                    assert math.isfinite(p[field])
            records.append({"world":world,"mode":mode,
               "originalRunner":r["trueNativeStatusAtEnd"],
               "terminal":r["trueTerminalOrCapSeconds"],
               "scissorSupportedS":r["actualSCISSORGroundedSeconds"],
               "nextRoadSupportedS":r["actualNextRoadGroundedSeconds"],
               "signedScissorMeanMps":r["sampledSignedScissorRoadTangentSpeedMeanMps"],
               "negativeScissorSamples":r["negativeSCISSORTangentSpeedSamples"],
               "groundedLowNativeForwardS":r["actualGroundedTicksBelow25MpsNativeForward"]/240,
               "scissorUProxy":r["sourceSCISSORMostAdvancedGroundedUProxy"]})
    return records
def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--source",required=True);ap.add_argument("--out",required=True)
    a=ap.parse_args()
    d=json.loads(Path(a.source).read_text());records=check(d)
    rejected=[]
    mutations=(
      ("fake_original_sha",lambda x:x.update(sourceGameBlob="fake")),
      ("fake_webgl",lambda x:x.update(sourceWebGLRendered=True)),
      ("fake_art",lambda x:x.update(officialArt=1)),
      ("fake_slope2",lambda x:x.update(officialSlope2Meters=128)),
      ("fake_human",lambda x:x.update(humanFairnessEstablished=True)),
      ("fake_phys",lambda x:x.update(sourcePhysicsOrCameraModified=True)),
      ("fake_crown",lambda x:x["cases"][WORLDS[0]][MODES[0]]["sourcePhysicalDesignMetadata"].update(freezeProvenCROWNEntireSurface=False)),
      ("fake_early_scissor",lambda x:x["cases"][WORLDS[1]][MODES[1]]["sourcePhysicalDesignMetadata"].update(freezeEarlySCISSORRows0To11=False)),
      ("fake_28b51",lambda x:x["cases"][WORLDS[0]][MODES[1]].update(original28MovingB51=0)),
      ("fake_junction",lambda x:x["cases"][WORLDS[1]][MODES[0]]["sourcePhysicalDesignMetadata"].update(trueRoadCenterPositionGapM=70)),
      ("fake_controller",lambda x:x["cases"][WORLDS[1]][MODES[0]]["true240HzQuarterSecondSampledTelemetry"][0].update(legalNativeSteeringInput=8)),
      ("fake_nextroad",lambda x:x["cases"][WORLDS[0]][MODES[0]].update(nativeNextRoadContactEntered={"timeSeconds":12,"xyz":[1,2,3]},actualNextRoadGroundedSeconds=0)),
      ("fake_gameplay",lambda x:x.update(GAMEPLAY="PASS"))
    )
    for name,fn in mutations:
        t=copy.deepcopy(d);fn(t)
        try:check(t)
        except (AssertionError,KeyError,TypeError,ValueError):rejected.append(name)
        else:raise AssertionError("forged R15S3D2 outcome accepted: "+name)
    p=Path(a.out);p.mkdir(parents=True,exist_ok=True)
    output={"schema":"dopagaki.r15s3d2-independent-real-240hz-two-road-support-qa/1",
         "originalBlob":SHA,"physicalSourceTrials":4,
         "verifiedRunnerOutcomes":records,"rejectedFakeApprovals":rejected,
         "officialArt":0,"officialSlope2Meters":0,"realHumanOrWebGLCertified":False}
    (p/"R15S3D2_INDEPENDENT_TWO_ROAD_REAL_SOURCE_QA.json").write_text(json.dumps(output,indent=2,ensure_ascii=False)+"\n")
    print("R15S3D2_TRUE_NATIVE_240HZ_TWO_ROAD_INDEPENDENT_PASS",json.dumps({"cases":len(records),"forgedRejected":len(rejected)}))
if __name__=="__main__":main()
