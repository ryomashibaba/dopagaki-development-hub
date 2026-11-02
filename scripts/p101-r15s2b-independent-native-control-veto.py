#!/usr/bin/env python3
"""Independently examine R15S2B saved 12 real physics runs; no false HUMAN or ART claims."""
import argparse
import copy
import json
import math
from pathlib import Path
SHA = "af076d67492a677d2235e4730aef8cdf4808e106"
ROADS = ("true-pinch", "pinch-switch")
MODES = ("B16_ONLY_REFERENCE", "B_C1_SHIFT_40M_SOURCE_WIDTH", "C_CURVE_SHIFT_30M_NARROW_16M")
POLICIES = ("P94_CORRECTIVE_INPUT_DIV_4P8", "P94_CORRECTIVE_FULL_LEGAL_INPUT")
def validate(d, original):
    assert d["sourceBlob"] == SHA and original["originalGameSourceBlob"] == SHA
    assert d["physicalRunner240Hz"] is True
    assert d["sourceControllerSwitchTimeSeconds"] == 21.5
    assert d["originalP96ExactlyPreservedUntilSwitch"] is True
    assert d["sourceGameEdited"] is False and d["sourceControllerCodeEdited"] is False
    assert d["originalB51DefinitionsAndCollisionEnabled"] is True
    assert d["sourceBrowserWebGLRendered"] is False and d["humanPlayabilityMeasured"] is False
    assert d["noInvisibleSafetyLane"] is True and d["noPositionOrVelocitySnapping"] is True
    assert d["officialArt"] == d["officialSlope2Meters"] == 0
    assert all(d[k] == "HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
    assert d["fullNativeCandidateTrials"] == 12
    assert d["sourceWorlds"] == list(ROADS) and d["sourcePhysicalDesigns"] == list(MODES)
    assert set(d["trials"]) == set(ROADS)
    observed=[]
    for world in ROADS:
        assert set(d["trials"][world]) == set(MODES)
        for mode in MODES:
            assert set(d["trials"][world][mode]) == set(POLICIES)
            baseline = original["nativeScissorRealEditableSurfaceGeometryTrials"][world][mode]["true240HzOriginalSourcePhysics"]
            for policy in POLICIES:
                r = d["trials"][world][mode][policy]
                assert r["policy"] == policy
                assert r["sourceOriginalNativePhysicsUnchanged"] and r["noHumanGameOrArtCertified"]
                assert r["originalP96BeforeSwitchCheckpointsVerified"] == 2
                assert r["originalB51Count"] == 28
                assert 0 <= r["maximumAbsoluteLegalSteer"] <= 1.000001
                assert r["legalInputScale"] == (1/4.8 if policy == POLICIES[0] else 1)
                assert r["trueNativeStatus"] in ("failed","running","finished")
                assert math.isclose(r["originalReferenceTerminalTimeSeconds"],baseline["originalSourceTerminalTimeSeconds"],abs_tol=0.000002)
                assert r["originalReferenceStatus"] == baseline["originalSourceStatus"] == "failed"
                assert 21.5 <= r["realNativeTerminalTimeSeconds"] <= 32.000002
                assert r["actualLastNativeGrounded"] is not None
                assert r["actualLastNativeGrounded"]["timeSeconds"] <= r["realNativeTerminalTimeSeconds"]
                assert r["sourceMovingContactEventCount"] >= 0
                assert r["maxSCISSORGuideStationIndexSampled"] <= 64
                observed.append(dict(world=world,mode=mode,policy=policy,runner=r["trueNativeStatus"],
                                     terminal=r["realNativeTerminalTimeSeconds"],
                                     lastGrounded=r["actualLastNativeGrounded"]["timeSeconds"],
                                     guideStation=r["maxSCISSORGuideStationIndexSampled"]))
    return observed
def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--result",required=True)
    ap.add_argument("--reference",required=True)
    ap.add_argument("--out",required=True)
    a=ap.parse_args()
    data=json.loads(Path(a.result).read_text())
    ref=json.loads(Path(a.reference).read_text())
    obs=validate(data,ref)
    rejected=[]
    for name,mutate in (
        ("fake_source",lambda v:v.update(sourceBlob="fake")),
        ("fake_human_pass",lambda v:v.update(humanPlayabilityMeasured=True)),
        ("fake_webgl",lambda v:v.update(sourceBrowserWebGLRendered=True)),
        ("fake_art",lambda v:v.update(officialArt=1)),
        ("fake_slope2",lambda v:v.update(officialSlope2Meters=16)),
        ("fake_gameplay",lambda v:v.update(GAMEPLAY="PASS")),
        ("fake_no_original",lambda v:v.update(originalP96ExactlyPreservedUntilSwitch=False)),
        ("fake_unbounded_input",lambda v:v["trials"]["true-pinch"][MODES[0]][POLICIES[0]].update(maximumAbsoluteLegalSteer=2)),
        ("fake_240hz",lambda v:v.update(physicalRunner240Hz=False)),
        ("fake_collision",lambda v:v.update(noInvisibleSafetyLane=False)),
        ("fake_28_b51",lambda v:v["trials"]["pinch-switch"][MODES[1]][POLICIES[1]].update(originalB51Count=0)),
        ("fake_checkpoint",lambda v:v["trials"]["pinch-switch"][MODES[1]][POLICIES[1]].update(originalP96BeforeSwitchCheckpointsVerified=0)),
        ("fake_runner_status",lambda v:v["trials"]["true-pinch"][MODES[2]][POLICIES[1]].update(trueNativeStatus="certified"))
    ):
        fake=copy.deepcopy(data)
        mutate(fake)
        try: validate(fake,ref)
        except (AssertionError,KeyError,TypeError,ValueError): rejected.append(name)
        else: raise AssertionError("FORGED CERTIFICATION ACCEPTED: "+name)
    output=dict(schema="dopagaki.r15s2b-independent-physics-counterfactual-qa/1",
                originalGameBlob=SHA,
                actualCounterfactualNativeTrials=12,
                statusesAndTerminals=obs,rejectedFalseClaims=rejected,
                actualPhysicsCompleted=True,humanOrArtCertified=False,officialArt=0,officialSlope2Meters=0)
    Path(a.out).mkdir(parents=True,exist_ok=True)
    Path(a.out,"R15S2B_INDEPENDENT_NATIVE_COUNTERFACTUAL_CONTROL_QA.json").write_text(json.dumps(output,indent=2,ensure_ascii=False)+"\n")
    print("R15S2B_INDEPENDENT_12_NATIVE_CASES_QA",json.dumps(output))
if __name__=="__main__":main()
