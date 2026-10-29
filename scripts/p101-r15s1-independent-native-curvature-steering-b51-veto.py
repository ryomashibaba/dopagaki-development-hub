#!/usr/bin/env python3
"""R15S1 independent no-false-native-physics/art/WebGL/steering QA."""
import argparse
import copy
import json
import math
from pathlib import Path

SHA = "af076d67492a677d2235e4730aef8cdf4808e106"
ROADS = ("true-pinch", "pinch-switch")
MODES = ("B16_ONLY_REFERENCE", "A_C1_SHIFT_24M_SOURCE_WIDTH",
         "B_C1_SHIFT_40M_SOURCE_WIDTH", "C_CURVE_SHIFT_30M_NARROW_16M")

def finite(x):
    return isinstance(x, (int, float)) and not isinstance(x, bool) and math.isfinite(x)

def check(d, ref):
    assert d["sourceBlob"] == SHA
    assert d["sourceHz"] == 240 and d["sourceP96EarlySoft"] is True
    assert d["originalGameModified"] is False
    assert d["sourceEngineModified"] is False and d["newGameColliders"] == 0
    assert d["sourceBrowserWebGLRendered"] is False and d["humanPlayableCertified"] is False
    assert d["sourceR15QQuarterSecondParity"] is True
    assert d["officialArt"] == 0 and d["officialSlope2Meters"] == 0
    assert d["ART"] == d["GAMEPLAY"] == d["HUMAN"] == d["PERFORMANCE"] == "HOLD"
    assert d["INTEGRATION"] == d["RELEASE"] == d["MERGE"] == "HOLD"
    assert d["actualNativeTrials"] == 8
    assert d["sourceB48Variants"] == list(ROADS) and d["sourceCurveModes"] == list(MODES)
    assert "NOT collision distance" in d["geometryLabel"]
    assert "NOT actual WebGL visibility" in d["b51Label"]
    assert "NOT realized lateral acceleration" in d["steeringLabel"]
    assert ref["originalGameSourceBlob"] == SHA and ref["trueOriginal240HzFullTrialCount"] == 8
    observed = []
    for road in ROADS:
        assert set(d["trials"][road]) == set(MODES)
        for mode in MODES:
            item = d["trials"][road][mode]
            saved = ref["nativeScissorRealEditableSurfaceGeometryTrials"][road][mode]["true240HzOriginalSourcePhysics"]
            assert item["sourceB48Roads"] == 7 and item["sourceB51Count"] == 28
            assert item["sourceP96SteeringUnchanged"] is True
            assert item["sourceGameplayPass"] is False and item["sourceArtPass"] is False
            assert item["originalR15QTerminalStatus"] == "failed"
            assert item["actualSourceNativeFinished"] is False
            assert saved["originalSourceStatus"] == "failed"
            assert math.isclose(item["terminalTimeSeconds"], saved["originalSourceTerminalTimeSeconds"], abs_tol=2e-6)
            assert item["originalR15QQuarterTickParityChecks"] == len(saved["nativeQuarterSecondSourcePhysicsTrace"])
            assert item["sourceLastGrounded"] is not None
            assert 0 < item["sourceLastGrounded"]["timeSeconds"] < item["terminalTimeSeconds"]
            assert 0 <= item["maxConsecutiveAirborneSeconds"] <= item["terminalTimeSeconds"]
            assert 0 < item["maxConsecutiveGroundedSeconds"] <= item["terminalTimeSeconds"]
            samples = item["samples"]
            assert 50 < len(samples) < 1000, (road, mode, len(samples))
            last_tick = -1
            at = {}
            for s in samples:
                tick = s["tick"]
                assert isinstance(tick, int) and tick > last_tick
                last_tick = tick
                assert math.isclose(s["seconds"], tick / 240, abs_tol=2e-6)
                assert s["actualNativeStatus"] in ("running", "failed")
                assert isinstance(s["actualNativeGrounded"], bool)
                assert s["actualNativeRoad"] is None or isinstance(s["actualNativeRoad"], str)
                for key in ("speedMps", "trueNativeInput", "approxRoadWidthXZ",
                            "approxSignedXZTrackOffsetM", "approxGeometricEdgeMarginM",
                            "approxPlanCurvaturePerM", "approxPlanCurveRequiredLateralAccelerationMps2",
                            "guideDistance3dM"):
                    assert finite(s[key]), (road, mode, key)
                assert -1 <= s["trueNativeInput"] <= 1
                assert isinstance(s["preStepGroundedForInput"], bool)
                nominal = 172.8 if s["preStepGroundedForInput"] else 25.9
                assert math.isclose(s["nominalCommandedSteeringAccelerationMps2"],
                                    nominal * s["trueNativeInput"], abs_tol=0.001)
                assert s["fullSteerNominalSourceAccelerationMps2"] == nominal
                assert s["approxRoadWidthXZ"] > 0
                assert math.isclose(s["approxPlanCurveRequiredLateralAccelerationMps2"],
                                    s["speedMps"] ** 2 * abs(s["approxPlanCurvaturePerM"]),
                                    abs_tol=0.15)
                b51 = s["b51CameraCenterProxy"]
                assert b51["sourceB51Objects"] == 28
                assert 0 <= b51["centerInsideUnoccludedFrustumCount"] <= 28
                assert 0 <= b51["centerInsideAndStraightLineUnder2sProxyCount"] <= b51["centerInsideUnoccludedFrustumCount"]
                if b51["nearestCenter"]:
                    assert b51["nearestCenter"]["distanceM"] >= 0
                    assert b51["nearestCenter"]["straightLineTimeProxyS"] >= 0
                if tick in (22 * 240, 23 * 240):
                    at[tick] = s["actualNativeGrounded"]
                if tick % 60 == 0 and tick >= 15 * 240:
                    matching = next((x for x in saved["nativeQuarterSecondSourcePhysicsTrace"] if x["tick"] == tick), None)
                    assert matching is not None
                    assert matching["engineGrounded"] == s["actualNativeGrounded"]
                    assert math.isclose(matching["speedMps"], s["speedMps"], abs_tol=0.0002)
                    assert math.isclose(matching["steer"], s["trueNativeInput"], abs_tol=0.0002)
            assert 22 * 240 in at and 23 * 240 in at
            observed.append((road, mode, at[22 * 240], at[23 * 240]))
    assert sum(not grounded22 for _, _, grounded22, _ in observed) == 8
    assert sum(grounded23 for _, _, _, grounded23 in observed) == 1
    return observed

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--result", required=True)
    parser.add_argument("--reference", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    d = json.loads(Path(args.result).read_text())
    ref = json.loads(Path(args.reference).read_text())
    observed = check(d, ref)
    mutants = []
    def mutation(label, transform):
        m = copy.deepcopy(d)
        transform(m)
        try:
            check(m, ref)
        except (AssertionError, KeyError, TypeError, ValueError):
            mutants.append(label)
        else:
            raise AssertionError("FORGED R15S1 CERTIFICATION WAS ACCEPTED: " + label)
    mutation("forged_game_source_blob", lambda m: m.update(sourceBlob="forged"))
    mutation("original_game_edited", lambda m: m.update(originalGameModified=True))
    mutation("engine_edits", lambda m: m.update(sourceEngineModified=True))
    mutation("phantom_collision_floor", lambda m: m.update(newGameColliders=1))
    mutation("R15Q_parity_forgery", lambda m: m.update(sourceR15QQuarterSecondParity=False))
    mutation("false_browser_WebGL", lambda m: m.update(sourceBrowserWebGLRendered=True))
    mutation("false_human_certification", lambda m: m.update(humanPlayableCertified=True))
    mutation("false_art_adoption", lambda m: m.update(officialArt=1))
    mutation("false_slope2_metres", lambda m: m.update(officialSlope2Meters=16))
    mutation("false_gameplay_pass", lambda m: m.update(GAMEPLAY="PASS"))
    mutation("false_art_pass", lambda m: m.update(ART="PASS"))
    mutation("false_native_finish", lambda m: m["trials"]["true-pinch"]["B16_ONLY_REFERENCE"].update(actualSourceNativeFinished=True))
    mutation("false_camera_line_of_sight", lambda m: m.update(b51Label="real visible all hazards"))
    output = dict(schema="dopagaki.r15s1-independent-native-physics-and-proxies-qa/1",
                  sourceBlob=SHA, nativeTrials=8, matchingReference="R15Q genuine saved 8 original 240Hz trials",
                  b51OcclusionOrHumanReactionCertified=False,
                  webGLArtOrHumanCertified=False,
                  authentic22sAllAirborne=True, authentic23sOneGrounded=True,
                  rejectedForgedClaims=mutants, officialArt=0, officialSlope2Meters=0,
                  researchVerdict="SOURCE_TECH_ONLY_NO_GAMEPLAY_PASS")
    Path(args.out).mkdir(parents=True, exist_ok=True)
    Path(args.out, "R15S1_INDEPENDENT_NATIVE_B48_B51_CURVATURE_STEERING_QA.json").write_text(
        json.dumps(output, indent=2, ensure_ascii=False) + "\n")
    print("R15S1_INDEPENDENT_QA_PASS", json.dumps(output))

if __name__ == "__main__":
    main()
