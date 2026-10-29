#!/usr/bin/env python3
"""R15S3D independent six actual 240Hz geometry and signed speed witness QA.
Does not certify original WebGL/human playability/art or total-course finish.
"""
import argparse,copy,json,math
from pathlib import Path
SHA="af076d67492a677d2235e4730aef8cdf4808e106"
WORLDS=("true-pinch","pinch-switch")
MODES=("G_SOFT_GRADIENT","H_TANGENT_RELEASE","I_TANGENT_CANYON")
def check(d):
    assert d["sourceGameBlob"]==SHA
    assert d["sourcePhysicsHz"]==240
    assert d["trueNativeTrialCount"]==6
    assert d["trueSourceCrownPreserved"] is True
    assert d["originalB51DefinitionsPreserved"] is True
    assert d["sourcePhysicsOrCameraModified"] is False
    assert d["extraGameColliders"]==0
    assert d["sourceWebGLRendered"] is False and d["humanFairnessEstablished"] is False
    assert d["earlyNativeR15S3BPrefixVerifiedAgainstSavedOriginal"] is True
    assert "PROXY" in d["speedDefinitions"]
    assert d["officialArt"]==d["officialSlope2Meters"]==0
    assert all(d[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
    assert set(d["cases"])==set(WORLDS)
    statuses=[]
    for world in WORLDS:
        assert set(d["cases"][world])==set(MODES)
        for mode in MODES:
            r=d["cases"][world][mode]
            assert r["world"]==world and r["mode"]==mode
            assert r["originalTrueB16SourcePrefixParityChecks"]==2
            assert r["realSourceOriginalProtected"] is True
            assert r["sourceB48Surfaces"]==7 and r["original28MovingB51"]==28
            assert r["trueNativeStatusAtEnd"] in ("failed","running","finished")
            assert r["actualFinishedEntireCourse"]==(r["trueNativeStatusAtEnd"]=="finished")
            assert 20<r["trueTerminalOrCapSeconds"]<=45.000002
            assert r["actualSCISSORGroundedSeconds"]>=0
            assert r["actualNextRoadGroundedSeconds"]>=0
            assert r["actualNegativeNativeHeadingForwardGroundedTicks"]>=0
            assert r["actualGroundedTicksBelow25MpsNativeForward"]>=0
            assert r["negativeSCISSORTangentSpeedSamples"]>=0
            assert r["negativeSCISSORTangentSpeedSamples"]<=r["signedSCISSORRoadTangentSampleCount"]
            if r["signedSCISSORRoadTangentSampleCount"]:
                assert isinstance(r["sampledSignedScissorRoadTangentSpeedMeanMps"],(int,float))
                assert math.isfinite(r["sampledSignedScissorRoadTangentSpeedMeanMps"])
            if r["nativeNextRoadContactEntered"] is not None:
                assert r["actualNextRoadGroundedSeconds"]>0
            else:assert r["actualNextRoadGroundedSeconds"]==0
            if r["sourceSCISSORLastGrounding"] is not None:
                assert r["actualSCISSORGroundedSeconds"]>0
            else:assert r["actualSCISSORGroundedSeconds"]==0
            assert r["sourceActualBrowserWebGL"] is False
            assert r["humanControlSuccessCertified"] is False
            assert r["artOrGameplayAdopted"] is False
            design=r["sourcePhysicalDesignMetadata"]
            assert design["sourceBlob"]==SHA and design["world"]==world and design["mode"]==mode
            assert design["frozenCROWNAllRows"] is True
            assert design["frozenSCISSOREarlyRows0To16"] is True
            assert design["sourceUnchangedOtherSixRoads"] is True
            assert design["original28MovingB51Preserved"] is True
            assert design["originalSourceRouteGuideUnchanged"] is True
            assert design["noAddedColliders"] is True
            assert design["supportOrHumanGameCertified"] is False
            assert design["webGLRendered"] is False
            assert design["officialArt"]==design["officialSlope2Meters"]==0
            assert design["sourceChangedSCISSORRows17To28"]==12
            assert design["measuredPeakActualPhysicalLatticeDisplacementM"]>10
            assert design["sourcePhysicalChangedB48RoadIds"]==["p93-SCISSOR_RISE-01"]
            assert design["downstreamRoadBoundarySourceAudit"]["trueColliderContactAcrossJunctionVerified"] is False
            trace=r["true240HzQuarterSecondSampledTelemetry"]
            assert len(trace)>60
            last=-1
            for p in trace:
                assert p["tick"]>last
                last=p["tick"]
                assert abs(p["timeSeconds"]-p["tick"]/240)<.000002
                assert p["totalSpeedMps"]>=0
                assert -1<=p["legalNativeSteeringInput"]<=1
                assert p["realEngineStatus"] in ("running","failed","finished")
                assert isinstance(p["actualEngineGrounded"],bool)
                assert len(p["positionXYZ"])==3
                for k in ("totalSpeedMps","trueNativeHeadingForwardSpeedMps","legalNativeSteeringInput"):
                    assert math.isfinite(p[k])
            statuses.append({"world":world,"candidate":mode,"runner":r["trueNativeStatusAtEnd"],
                "terminalSeconds":r["trueTerminalOrCapSeconds"],
                "scissorGroundSeconds":r["actualSCISSORGroundedSeconds"],
                "scissorUProxy":r["sourceSCISSORMostAdvancedGroundedUProxy"],
                "meanSignedRoadSpeedMps":r["sampledSignedScissorRoadTangentSpeedMeanMps"],
                "nextRoadSupportedSeconds":r["actualNextRoadGroundedSeconds"],
                "lowNativeHeadingSeconds":r["actualGroundedTicksBelow25MpsNativeForward"]/240})
    return statuses
def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--source",required=True);ap.add_argument("--out",required=True)
    a=ap.parse_args()
    d=json.loads(Path(a.source).read_text())
    states=check(d);veto=[]
    variants=(
      ("false_source",lambda x:x.update(sourceGameBlob="fake")),
      ("false_webgl",lambda x:x.update(sourceWebGLRendered=True)),
      ("false_art",lambda x:x.update(officialArt=1)),
      ("false_slope2",lambda x:x.update(officialSlope2Meters=100)),
      ("false_human",lambda x:x.update(humanFairnessEstablished=True)),
      ("false_physics",lambda x:x.update(sourcePhysicsHz=60)),
      ("false_crown",lambda x:x["cases"][WORLDS[0]][MODES[0]]["sourcePhysicalDesignMetadata"].update(frozenCROWNAllRows=False)),
      ("false_early_scissor",lambda x:x["cases"][WORLDS[0]][MODES[1]]["sourcePhysicalDesignMetadata"].update(frozenSCISSOREarlyRows0To16=False)),
      ("false_junction",lambda x:x["cases"][WORLDS[1]][MODES[1]]["sourcePhysicalDesignMetadata"]["downstreamRoadBoundarySourceAudit"].update(trueColliderContactAcrossJunctionVerified=True)),
      ("false_b51",lambda x:x["cases"][WORLDS[0]][MODES[2]].update(original28MovingB51=0)),
      ("false_legal",lambda x:x["cases"][WORLDS[1]][MODES[2]]["true240HzQuarterSecondSampledTelemetry"][0].update(legalNativeSteeringInput=5)),
      ("false_next_road_contact",lambda x:x["cases"][WORLDS[1]][MODES[0]].update(nativeNextRoadContactEntered={"timeSeconds":12})),
      ("false_gameplay",lambda x:x.update(GAMEPLAY="PASS"))
    )
    for name,mutation in variants:
        copyd=copy.deepcopy(d);mutation(copyd)
        try:check(copyd)
        except (AssertionError,KeyError,TypeError,ValueError):veto.append(name)
        else:raise AssertionError("forged source or game certification accepted: "+name)
    result={"schema":"dopagaki.r15s3d-independent-original-240hz-speed-and-junction/1",
            "sourceGitBlob":SHA,"realSourceTrialCount":6,"outcomes":states,
            "rejectedFakeCertifications":veto,
            "officialArt":0,"officialSlope2Meters":0,"humanGameplayWebGLPassed":False}
    Path(a.out).mkdir(parents=True,exist_ok=True)
    (Path(a.out)/"R15S3D_INDEPENDENT_SOURCE_NATIVE_SPEED_JUNCTION_QA.json").write_text(json.dumps(result,indent=2,ensure_ascii=False)+"\n")
    print("R15S3D_INDEPENDENT_NATIVE_6_TRIALS_QA_PASS",json.dumps({"cases":len(states),"rejected":len(veto)}))
if __name__=="__main__":main()
