#!/usr/bin/env python3
"""K4AK: conservative, read-only ART-FIRST capture request from K4AJ proof.
Structural verification is NOT independent raw Chromium/GPU certification.
"""
import argparse
import copy
import csv
import json
from pathlib import Path

N = 11176
WINDOWS = {"ultra": (11320, 11369), "control": (11259, 11307)}
ANCHORS = {"ultra": 53, "control": 5972}
SHOTS = {
    "ultra": [11320, 11326, 11338, 11341, 11349, 11351, 11363, 11369],
    "control": [11259, 11265, 11277, 11280, 11284, 11301, 11307],
}
CONTRACT = {
    "decision": "GENUINE_CONTIGUOUS_SOURCE_GPU_B51_DEPTH_99_TICKS_TECH_CANDIDATE_ART_HOLD",
    "trueOriginalGPUFrames": 100, "genuineSourceB51Masks": 100,
    "originalDepthRestorations": 100, "nativeSourceConsecutiveWindowTicks": 99,
    "genuineK4AF11280Anchors": 2, "originalSourceGPUReadbackRequestCount": 300,
    "independentNegativeControls": 5, "actualGPUResearchMask": "B51_BODY_ALL_28",
    "perTickObjectAttribution": "UNKNOWN_EXCEPT_K4AG_VERIFIED_11280",
    "humanVisualObstructionSeconds": "NOT_MEASURED",
    "officialARTAccepted": 0, "slope2DNAMetres": 0,
    "newModels": 0, "newColliders": 0,
    "ART": "NOT_TESTED_HOLD", "RELEASE": "HOLD", "MERGE": "HOLD",
}

def need(condition, message):
    if not condition:
        raise ValueError("K4AK_REJECT_" + message)

def segments(rows, threshold):
    result = []
    start = end = None
    for row in rows:
        tick = int(row["tick"])
        if int(row["maskedFartherDepthSamples"]) >= threshold:
            if start is None:
                start = tick
            end = tick
        elif start is not None:
            result.append((start, end))
            start = end = None
    if start is not None:
        result.append((start, end))
    return result

def gate(audit, rows):
    for key, expected in CONTRACT.items():
        need(audit.get(key) == expected, "CONTRACT_" + key)
    need(len(rows) == 100, "COUNT")
    by_mode = {m: [] for m in WINDOWS}
    seen = set()
    for index, row in enumerate(rows):
        mode = row.get("mode")
        need(mode in WINDOWS, "MODE")
        tick = int(row["tick"])
        low, high = WINDOWS[mode]
        need(tick == 11280 or low <= tick <= high, "WINDOW")
        need((mode, tick) not in seen, "DUPLICATE_TICK")
        seen.add((mode, tick))
        need(str(row["dense"]).lower() == str(low <= tick <= high).lower(), "DENSE")
        need(int(row["sampledPixels"]) == N, "SAMPLES")
        need(int(row["freshGPURequestSequence"]) == 3 * (index + 1), "SEQ")
        need(int(row["actualSourceGPUDraws"]) == 72, "DRAW_ORIGINAL")
        need(int(row["withoutAllB51GPUdraws"]) == 44, "DRAW_MASK")
        need(row["actualRemovedVisualLayer"] == "B51_BODY_ALL_28", "MASK_SCOPE")
        need(str(row["nativeDepthRestoredAllSamples"]).lower() == "true", "RESTORE")
        need(row["ART"] == "NOT_TESTED_HOLD", "ART")
        attribution = ("K4AG_VERIFIED_P95_HAZARD_12" if tick == 11280
                       else "NOT_MEASURED_UNKNOWN")
        need(row["singleObstacleGPUAttributionAtThisTick"] == attribution, "ATTRIBUTION")
        count = int(row["maskedFartherDepthSamples"])
        need(0 <= count <= N, "DEPTH")
        need(abs(float(row["fractionOfSampledGPUdepthChanged"]) - count / N) < 1e-12,
             "DEPTH_FRACTION")
        if tick == 11280:
            need(count == ANCHORS[mode], "TRUE_K4AF_ANCHOR")
        by_mode[mode].append(row)
    for mode, (low, high) in WINDOWS.items():
        ticks = [int(row["tick"]) for row in by_mode[mode]]
        need(ticks == sorted({11280, *range(low, high + 1)}), "CONTIGUITY")
        dense = [row for row in by_mode[mode] if low <= int(row["tick"]) <= high]
        summary = audit.get("observedNativeTickWindows", {}).get(mode, {})
        need(summary.get("nativeWindow") == [low, high], "WINDOW_AGGREGATE")
        need(summary.get("sourceGPUDepthVerifiedFrames") == len(dense), "FRAME_AGGREGATE")
        for key, threshold in (("anyB51GPUDepthContribution", 1),
                               ("B51DepthContributionAtLeast10Pct", 1118)):
            spans = segments(dense, threshold)
            total = sum(b - a + 1 for a, b in spans)
            observed = summary.get(key, {})
            need(observed.get("observedTicks") == total, "AGGREGATE_COUNT")
            need(abs(observed.get("sampledTickDurationSeconds", -1) - total / 240)
                 < 1e-10, "AGGREGATE_TIME")
            need([(i["firstTick"], i["lastTickInclusive"])
                  for i in observed.get("intervals", [])] == spans, "AGGREGATE_SPANS")
    captures = []
    for mode, ticks in SHOTS.items():
        lookup = {int(r["tick"]): r for r in by_mode[mode]}
        for tick in ticks:
            row = lookup[tick]
            captures.append({
                "mode": mode, "nativeTick": tick, "nativePhysicsSeconds": tick / 240,
                "originalGPUGroupDepthChangedSamples": int(row["maskedFartherDepthSamples"]),
                "depthSampleGrid": N, "sourceCandidateSamePoseColorAB": "NOT_CAPTURED",
                "candidateGeometry": "NOT_CREATED", "humanThreeLayerVoidReview": "NOT_TESTED",
                "humanObstructionDuration": "NOT_MEASURED",
                "oneObstacleAttribution": row["singleObstacleGPUAttributionAtThisTick"],
                "ART": "NOT_TESTED_HOLD",
            })
    return {
        "schema": "dopagaki.K4AK.readonly-art-first-review-packet/1",
        "sourceEvidence": "K4AJ independent JSON + 100-row CSV",
        "verificationLimit": "STRUCTURAL_CHECK_ONLY_NOT_INDEPENDENT_RAW_GPU_SHA_CRC_VERIFICATION",
        "singleDesignDirection": "UNBUILT_ROAD5_INHABITED_CIVIC_RIFT_OPEN_VOID",
        "candidateCount": 0, "captureRequests": captures,
        "reviewGates": [
            "real same-original-camera color A/B", "entrance-middle-far public void",
            "foreground road to civic floor physical support", "B51 cue / architecture distinction",
            "human true play legibility", "B48 B51 full SAT CCD and Windows iPhone FPS",
        ],
        "perTickCause": "UNKNOWN_EXCEPT_VERIFIED_11280",
        "humanObstructionSeconds": "NOT_MEASURED",
        "officialARTAccepted": 0, "slope2DNAMetres": 0,
        "ART": "NOT_TESTED_HOLD", "HUMAN": "HOLD", "SAT": "HOLD",
        "CCD": "HOLD", "FPS": "HOLD", "RELEASE": "HOLD", "MERGE": "HOLD",
    }

def synthetic_fixture():
    rows = []
    summaries = {}
    for mode, (low, high) in WINDOWS.items():
        dense = []
        for tick in sorted({11280, *range(low, high + 1)}):
            count = ANCHORS[mode] if tick == 11280 else 0
            row = {
                "mode": mode, "tick": tick, "dense": low <= tick <= high,
                "sampledPixels": N, "freshGPURequestSequence": 3 * (len(rows) + 1),
                "actualSourceGPUDraws": 72, "withoutAllB51GPUdraws": 44,
                "actualRemovedVisualLayer": "B51_BODY_ALL_28",
                "nativeDepthRestoredAllSamples": True, "ART": "NOT_TESTED_HOLD",
                "maskedFartherDepthSamples": count,
                "fractionOfSampledGPUdepthChanged": count / N,
                "singleObstacleGPUAttributionAtThisTick": (
                    "K4AG_VERIFIED_P95_HAZARD_12" if tick == 11280
                    else "NOT_MEASURED_UNKNOWN"),
            }
            rows.append(row)
            if low <= tick <= high:
                dense.append(row)
        summary = {"nativeWindow": [low, high],
                   "sourceGPUDepthVerifiedFrames": len(dense)}
        for key, threshold in (("anyB51GPUDepthContribution", 1),
                               ("B51DepthContributionAtLeast10Pct", 1118)):
            spans = segments(dense, threshold)
            total = sum(b - a + 1 for a, b in spans)
            summary[key] = {
                "observedTicks": total, "sampledTickDurationSeconds": total / 240,
                "intervals": [{"firstTick": a, "lastTickInclusive": b} for a, b in spans],
            }
        summaries[mode] = summary
    return {**CONTRACT, "observedNativeTickWindows": summaries}, rows

def self_test():
    a, r = synthetic_fixture()
    need(len(gate(a, r)["captureRequests"]) == 15, "CAPTURE_COUNT")
    variants = []
    x = copy.deepcopy(a); x["officialARTAccepted"] = 1; variants.append((x, r))
    x = copy.deepcopy(a); x["humanVisualObstructionSeconds"] = .2; variants.append((x, r))
    x = copy.deepcopy(r); x[0]["maskedFartherDepthSamples"] += 1; variants.append((a, x))
    x = copy.deepcopy(r); x[1]["tick"] = x[0]["tick"]; variants.append((a, x))
    x = copy.deepcopy(r); x[1]["freshGPURequestSequence"] = 3; variants.append((a, x))
    x = copy.deepcopy(r); x[2]["singleObstacleGPUAttributionAtThisTick"] = "K4AG_VERIFIED_P95_HAZARD_12"; variants.append((a, x))
    x = copy.deepcopy(a); x["observedNativeTickWindows"]["control"]["anyB51GPUDepthContribution"]["observedTicks"] += 1; variants.append((x, r))
    for index, (changed_a, changed_r) in enumerate(variants):
        try:
            gate(changed_a, changed_r)
        except ValueError:
            continue
        raise AssertionError("K4AK_NEGATIVE_CONTROL_ACCEPTED_" + str(index))
    print("K4AK_SYNTHETIC_TESTS_7_NEGATIVE_CONTROLS_PASS; GENUINE_GPU_NOT_TESTED")

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--audit", type=Path)
    p.add_argument("--csv", type=Path)
    p.add_argument("--out", type=Path)
    p.add_argument("--self-test", action="store_true")
    args = p.parse_args()
    if args.self_test:
        self_test()
        return
    need(args.audit and args.csv and args.out, "NEED_GENUINE_AUDIT_CSV_OUTPUT")
    with args.csv.open(encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f))
    result = gate(json.loads(args.audit.read_text(encoding="utf-8")), rows)
    args.out.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n",
                        encoding="utf-8")
    print("K4AK_STRUCTURAL_GATE_PASS_ART_HOLD_NOT_RAW_GPU_CERTIFIED")

if __name__ == "__main__":
    main()
