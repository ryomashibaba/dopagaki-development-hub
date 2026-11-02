#!/usr/bin/env python3
"""R15S3 independent source-native road geometry / input / claims veto.
No scripted runner outcome can confer human/gameplay/art approval.
"""
import argparse, copy, json, math
from pathlib import Path

SHA="af076d67492a677d2235e4730aef8cdf4808e106"
WORLDS=("true-pinch","pinch-switch")
MODES=("A_LONG_SWEEP","B_BANKED_DESCENT","C_LATE_NARROW")
CONTROLS=("P96_ORIGINAL","P94_FULL_AFTER_21P5")
def check(data):
    assert data["sourceGameBlob"]==SHA
    assert data["source240Hz"] is True and data["sourceBallRadiusM"]==.65
    assert data["actualSourceRealPhysicsTrials"]==12
    assert data["roadWorlds"]==list(WORLDS)
    assert data["macroPhysicalDesigns"]==list(MODES)
    assert data["controllers"]==list(CONTROLS)
    assert data["controllerSwitchSecond"]==21.5
    for key in ("originalGameCodeModified","originalCameraOrPhysicsModified",
                "sourceRealGameWebGLRendered","humanFairnessProven",
                "hiddenSupportOrVelocityClamp"):
        assert data[key] is False, key
    assert data["originalGameCollidersAdded"]==0
    assert data["originalB51MovingObstaclesEnabledAndUnmodified"] is True
    assert data["samePhysicalRoadWithinEachControllerComparison"] is True
    assert data["officialArt"]==data["officialSlope2Meters"]==0
    assert all(data[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN",
        "PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
    seen=[]; outcomes=[]
    assert set(data["actualCases"])==set(WORLDS)
    for world in WORLDS:
        assert set(data["actualCases"][world])==set(MODES)
        for mode in MODES:
            pair=data["actualCases"][world][mode]
            assert set(pair)==set(CONTROLS)
            h=[]
            for control in CONTROLS:
                r=pair[control]
                assert r["controller"]==control
                assert r["originalGameUnchanged"] is True
                assert r["originalB51Count"]==28 and r["physicalSourceRoadCount"]==7
                assert r["physicsHz"]==240
                assert r["inputLegalityEnforced"] is True
                assert r["originalSourceGameWebGLRendered"] is False
                assert r["humanGameplayProven"] is False
                assert r["originalSourceStatus"] in ("failed","running","finished")
                assert r["sourceActualFinished"]==(r["originalSourceStatus"]=="finished")
                assert 0<r["trueTerminalSeconds"]<=34.000002
                assert r["actualNativeAllRoadGroundedDurationSeconds"]>0
                assert r["actualNativeAllRoadGroundedDurationSeconds"]<=r["trueTerminalSeconds"]+.01
                assert r["actualNativeAirborneDurationSeconds"]>=0
                assert r["longestContinuousAirborneSeconds"]>=0
                assert r["groundStateTransitions"]>=0
                assert r["actualSCISSORGroundedDurationSeconds"]>=0
                assert r["actualLastB48Contact"] is not None
                assert r["actualLastB48Contact"]["timeSeconds"]<=r["trueTerminalSeconds"]+.00001
                u=r["approximateMaximumScissorGuideU"]
                assert u is None or 0<=u<=1
                assert isinstance(r["originalSourceB51MovingContactEvents"],list)
                assert len(r["checkpointAndQuarterSecondSourceTrajectory"])>0
                assert isinstance(r["preSwitchTruePhysicalCheckpoints"],list)
                assert all(c["tick"]<=5160 for c in r["preSwitchTruePhysicalCheckpoints"])
                study=r["sourceMacroDesign"]
                assert study["sourceBlob"]==SHA and study["world"]==world and study["mode"]==mode
                assert study["changedActualPhysicalRoadSections"]==[1,2]
                assert study["originalMovingB51Definitions"]==28
                assert study["genuineB48Roads"]==7
                assert study["noHiddenSafetyLane"] and study["noTeleport"]
                assert study["existingRouteGuideKeptForControlledStudy"] is True
                assert study["fullTangentOrSupportContinuityUnverified"] is True
                assert study["sourceRealHumanAndArtCertification"] is False
                assert study["officialSlope2Meters"]==0
                audits=study["actualPhysicalGridAudits"]
                assert len(audits)==2
                assert [v["section"] for v in audits]==[1,2]
                assert all(v["sourceChangedControlRows"]>=14 and
                           v["maximumSourceControlDisplacementM"]>7 and
                           v["sourceRideableTriangleCount"]>1000
                           for v in audits)
                assert all(v["revisedWidth"]["minWidthXZ"]>5 for v in audits)
                assert len(r["sameRoadGeometrySHA256"])==64
                seen.append((world,mode,control,r["trueTerminalSeconds"]))
                h.append(r["sameRoadGeometrySHA256"])
                outcomes.append({"world":world,"macro":mode,"control":control,
                    "native":r["originalSourceStatus"],"seconds":r["trueTerminalSeconds"],
                    "lastGroundedSeconds":r["actualLastB48Contact"]["timeSeconds"],
                    "scissorUProxy":u,
                    "movingEvents":len(r["originalSourceB51MovingContactEvents"])})
            assert h[0]==h[1], "same geometry MUST have identical hashes for controller isolation"
            assert pair[CONTROLS[0]]["preSwitchTruePhysicalCheckpoints"]==pair[CONTROLS[1]]["preSwitchTruePhysicalCheckpoints"]
    return outcomes

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--native",required=True);p.add_argument("--out",required=True)
    a=p.parse_args()
    d=json.loads(Path(a.native).read_text())
    outcomes=check(d)
    veto=[]
    variants=(
      ("forged_original_blob",lambda x:x.update(sourceGameBlob="bad")),
      ("forged_webgl",lambda x:x.update(sourceRealGameWebGLRendered=True)),
      ("forged_human",lambda x:x.update(humanFairnessProven=True)),
      ("forged_art_pass",lambda x:x.update(ART="PASS")),
      ("forged_gameplay_pass",lambda x:x.update(GAMEPLAY="PASS")),
      ("forged_slope2",lambda x:x.update(officialSlope2Meters=10)),
      ("forged_colliders",lambda x:x.update(originalGameCollidersAdded=1)),
      ("forged_invisible_support",lambda x:x.update(hiddenSupportOrVelocityClamp=True)),
      ("forged_engine",lambda x:x.update(source240Hz=False)),
      ("forged_B51",lambda x:x["actualCases"]["true-pinch"]["A_LONG_SWEEP"]["P96_ORIGINAL"].update(originalB51Count=0)),
      ("forged_road_edit",lambda x:x["actualCases"]["pinch-switch"]["B_BANKED_DESCENT"]["P94_FULL_AFTER_21P5"]["sourceMacroDesign"].update(changedActualPhysicalRoadSections=[2])),
      ("forged_source_controller",lambda x:x.update(samePhysicalRoadWithinEachControllerComparison=False)),
      ("forged_finishto_human",lambda x:x["actualCases"]["true-pinch"]["C_LATE_NARROW"]["P96_ORIGINAL"].update(humanGameplayProven=True))
    )
    for name,change in variants:
        candidate=copy.deepcopy(d);change(candidate)
        try: check(candidate)
        except (AssertionError,KeyError,TypeError,ValueError):
            veto.append(name)
        else: raise AssertionError("R15S3 accepted forged approval: "+name)
    verdict={"schema":"dopagaki.r15s3-independent-true-native-physical-and-claims-qa/1",
        "originalSourceBlob":SHA,"nativeTrialCount":12,"independentVerifierPassed":True,
        "observedOutcomes":outcomes,"rejectedFalseClaims":veto,
        "sourceOnlyResearch":True,"humanWebGLOrArtPassed":False,
        "officialArt":0,"officialSlope2Meters":0}
    pth=Path(a.out);pth.mkdir(parents=True,exist_ok=True)
    (pth/"R15S3_INDEPENDENT_TRUE_SOURCE_MACRO_NATIVE_QA.json").write_text(
        json.dumps(verdict,indent=2,ensure_ascii=False)+"\n")
    print("R15S3_INDEPENDENT_12_NATIVE_QA_SUCCESS",json.dumps({"cases":len(outcomes),"veto":len(veto)},ensure_ascii=False))

if __name__=="__main__": main()
