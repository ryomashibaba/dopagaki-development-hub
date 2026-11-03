#!/usr/bin/env python3
"""K4AP source-camera spatial thirds of true K4AJ B51 GROUP GPU depth.

A source/mask DEPTH DIFFERENCE is neither human obstruction nor collision proof.
The direction of resulting ART authoring is decided by people, not this script.
"""
import argparse
import csv
import hashlib
import io
import json
import zipfile
from pathlib import Path

SRC = "af076d67492a677d2235e4730aef8cdf4808e106"
ZIP_SHA = "60aab331d8881b5f8f456539c00566837a2b061a96ab0725ce7c17ea91ed8efb"
GRID_W, GRID_H = 127, 88
SAMPLE_COUNT = GRID_W * GRID_H
ZONES = {"left": (0, 42), "center": (42, 85), "right": (85, 127)}
WINDOWS = {"ultra": (11320, 11369), "control": (11259, 11307)}

def need(test, code):
    if not test:
        raise ValueError("K4AP_SOURCE_REJECT_" + code)

def analyze(archive):
    need(len(archive.infolist()) == 28 and archive.testzip() is None, "ZIP_CRC")
    raw = json.loads(archive.read("K4AJ_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json"))
    audit = json.loads(archive.read("K4AJ_INDEPENDENT_99_CONTIGUOUS_SOURCE_GPU_MASK_AUDIT.json"))
    csv_text = archive.read("K4AJ_100_REAL_SOURCE_GPU_DEPTH_MASKS.csv").decode("utf8")
    rows = list(csv.DictReader(io.StringIO(csv_text)))
    lookup = {(r["mode"], int(r["tick"])): r for r in rows}
    need(len(lookup) == 100, "CSV_COUNT")
    need(raw["originalSourceBlob"] == audit["originalSourceBlob"] == SRC, "SOURCE_BLOB")
    need(raw["errors"] == [], "RAW_ERRORS")
    need(raw["officialARTAccepted"] == raw["slope2DNAMetres"] == 0, "SOURCE_ART_HOLD")
    need(audit["decision"] == "GENUINE_CONTIGUOUS_SOURCE_GPU_B51_DEPTH_99_TICKS_TECH_CANDIDATE_ART_HOLD",
         "AUDIT_DECISION")
    need(audit["trueOriginalGPUFrames"] == audit["genuineSourceB51Masks"] ==
         audit["originalDepthRestorations"] == 100, "GPU_PROOF_COUNT")
    need(audit["originalSourceGPUReadbackRequestCount"] == 300, "GPU_REQUEST_COUNT")
    need(audit["ART"] == "NOT_TESTED_HOLD" and audit["RELEASE"] == "HOLD", "AUDIT_ART_HOLD")
    out = {}
    for mode, (lo, hi) in WINDOWS.items():
        match = [s for s in raw["sessions"] if s["mode"] == mode]
        need(len(match) == 1, "SESSION_MODE")
        session = match[0]
        frames = {r["tick"]: r for r in session["frames"]}
        masked = {r["tick"]: r for r in session["masks"]}
        restored = {r["tick"]: r for r in session["restored"]}
        need(len(frames) == len(masked) == len(restored) ==
             (hi - lo + 2 if mode == "ultra" else hi - lo + 1), "FRAME_COUNT")
        tick_rows = []
        for tick in range(lo, hi + 1):
            f, m, r = frames[tick], masked[tick], restored[tick]
            original = f["synchronousRenderDepth"]["samples"]
            without = m["synchronousDepth"]["samples"]
            recovery = r["depth"]["samples"]
            need(len(original) == len(without) == len(recovery) == SAMPLE_COUNT and
                 original == recovery, "SAMPLES_AND_RESTORE")
            need(not any(a > b for a, b in zip(original, without)), "NEARER_MASK_DEPTH")
            need(f["synchronousRenderDepth"]["originalDraws"] == 72 and
                 m["synchronousDepth"]["originalDraws"] == 44 and
                 r["depth"]["originalDraws"] == 72, "SOURCE_DRAWS")
            changed = [int(b > a) for a, b in zip(original, without)]
            need(sum(changed) == int(lookup[(mode, tick)]["maskedFartherDepthSamples"]), "CSV_DEPTH")
            thirds = {}
            for label, (start, end) in ZONES.items():
                num = sum(changed[y * GRID_W + x] for y in range(GRID_H)
                          for x in range(start, end))
                total = (end - start) * GRID_H
                thirds[label] = {"changed": num, "total": total,
                                 "fraction": round(num / total, 6)}
            tick_rows.append({"nativeTick": tick, "nativeSeconds": round(tick / 240, 6),
                              "groupDepthChanged": sum(changed), "horizontalThirds": thirds})
        summary = {}
        for label in ZONES:
            num = sum(row["horizontalThirds"][label]["changed"] for row in tick_rows)
            den = sum(row["horizontalThirds"][label]["total"] for row in tick_rows)
            summary[label] = {
                "changedSampleTicks": num, "totalSampleTicks": den,
                "fraction": round(num / den, 6),
                "ticksWithAnyGroupDepthChange":
                    sum(row["horizontalThirds"][label]["changed"] > 0 for row in tick_rows)
            }
        out[mode] = {"nativeWindow": [lo, hi], "consecutiveTicks": len(tick_rows),
                     "horizontalZones": summary, "frames": tick_rows}
    return {
        "schema": "dopagaki.K4AP.original-B51-GPU-depth-horizontal-source-thirds/1",
        "realArtifact": {"runId": 41566784540, "artifactId": 13201661563,
                         "SHA256": ZIP_SHA, "originalSourceBlob": SRC},
        "meaning": "sampled nonlinear GPU group-depth change; NOT real visual human occlusion",
        "sampleGrid": {"width": GRID_W, "height": GRID_H, "everyPixelStride": 8},
        "designInterpretation": "TWO_BEATS_BEFORE_AND_AFTER_B51_NOT_OVERLAY_CENTRAL_OBSTACLE",
        "newCandidateModels": 0, "newColliders": 0,
        "officialARTAccepted": 0, "slope2DNAMetres": 0,
        "humanObstructionSeconds": "NOT_MEASURED",
        "perTickIndividualB51Attribution": "UNKNOWN_EXCEPT_K4AG_VERIFIED_TICK11280",
        "ART": "NOT_TESTED_HOLD", "HUMAN": "HOLD",
        "SAT": "HOLD", "CCD": "HOLD", "FPS": "HOLD",
        "RELEASE": "HOLD", "MERGE": "HOLD", "windows": out
    }

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--zip", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    need(hashlib.sha256(args.zip.read_bytes()).hexdigest() == ZIP_SHA, "ZIP_SHA256")
    with zipfile.ZipFile(args.zip) as archive:
        result = analyze(archive)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf8")
    for mode, window in result["windows"].items():
        print(mode, " ".join(
            "%s:%.3f%%" % (label, 100 * item["fraction"])
            for label, item in window["horizontalZones"].items()
        ))
    print("K4AP_REAL_K4AJ_GPU_HORIZONTAL_THIRDS_SOURCE_TECH_ONLY_PASS_ART_HOLD")

if __name__ == "__main__":
    main()
