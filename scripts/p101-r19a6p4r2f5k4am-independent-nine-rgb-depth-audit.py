#!/usr/bin/env python3
"""K4AM independent source-RGB / 27 genuine in-render GPU proof audit.

This verifies only native source color and group-depth provenance for nine
previously missing K4AK ticks. It NEVER establishes ART/HUMAN/CCD/RELEASE.
"""
import argparse
import hashlib
import json
import runpy
from pathlib import Path

SRC = "af076d67492a677d2235e4730aef8cdf4808e106"
AISHA = "e04c9990ebc2573467e8d95cd3e497a7a6059a9f12384f46507c3c1dfdc0eb60"
PENDING = {"ultra": [11326, 11338, 11349, 11351, 11363],
           "control": [11265, 11277, 11284, 11301]}
N = 11176


def demand(ok, reason):
    if not ok:
        raise ValueError("K4AM_INDEPENDENT_REJECT_" + reason)


def sha(b):
    return hashlib.sha256(b).hexdigest()


def read_pinned(path, expected):
    b = path.read_bytes()
    demand(sha(b) == expected, "PINNED_K4AI_SHA")
    return json.loads(b)


def samples(desc, draws):
    demand(desc["method"] == "ORIGINAL_GPU_MESH_RGBA8_DEPTH24_REPLAY", "GPU_METHOD")
    demand(desc["nonlinearDepth"] is True and desc["sampleCount"] == N, "GPU_DEPTH_KIND")
    demand(desc["originalDraws"] == draws, "GPU_DRAWS")
    values = desc["samples"]
    demand(len(values) == N and all(type(v) is int and 0 <= v <= 16777215 for v in values),
           "GPU_ARRAY")
    demand(sha(json.dumps(values, separators=(",", ":")).encode("utf-8")) ==
           desc["sha256"], "GPU_ARRAY_SHA")
    return values


def verify(ai, report, image_dir, require_images=True):
    helper = runpy.run_path("scripts/p101-r19a6p4r2f5k4ad-independent-rgba-depth-audit.py")
    img = helper["img"]
    same_without_hud = helper["source_png_equals_outside_css"]
    demand(ai["originalSourceBlob"] == report["originalSourceBlob"] == SRC, "SOURCE_BLOB")
    demand(report["pinnedK4AIRawSHA256"] == AISHA, "K4AI_REFERENCE")
    demand(report["original240HzPhysics"] is True and report["actualLive240fpsClaim"] is False,
           "PHYSICS_VS_DISPLAY")
    demand(report["purpose"] == "FILL_ONLY_K4AK_NINE_MISSING_SOURCE_RGB_TICKS", "SCOPE")
    demand(report["gpuRemovedGroup"] == "B51_BODY_ALL_28", "REMOVED_GROUP")
    demand(report["perTickSingleObstacleAttribution"] == "UNKNOWN_EXCEPT_K4AG_TICK11280",
           "UNPROVEN_PER_ID")
    demand(report["newModels"] == report["newColliders"] == report["officialARTAccepted"]
           == report["slope2DNAMetres"] == report["sourceCandidatesCreated"] == 0,
           "FALSE_ACCEPTANCE")
    demand(report["physicsChanged"] is report["cameraChanged"] is False, "SOURCE_MUTATION")
    demand(report["ART"] == "NOT_TESTED_HOLD", "ART_HOLD")
    for key in ("HUMAN", "SAT", "CCD", "FPS", "RELEASE", "MERGE"):
        demand(report[key] == "HOLD", "HOLD_" + key)
    demand(report["errors"] == [] and len(report["sessions"]) == 2, "ERRORS")
    mode_rows = {}
    verified = 0
    seq = 0
    total_depth_changed = 0
    images_checked = 0
    for mode in ("ultra", "control"):
        group = [s for s in report["sessions"] if s["mode"] == mode]
        baseline = [s for s in ai["sessions"] if s["mode"] == mode]
        demand(len(group) == len(baseline) == 1, "WIDTH_SESSION")
        g, pin = group[0], baseline[0]
        demand(g["errors"] == [], "SESSION_ERRORS")
        demand(g["trueOriginalWebGLContext"]["webgl2"] is True
               and g["trueOriginalWebGLContext"]["preserveDrawingBuffer"] is False,
               "REAL_WEBGL2")
        demand(g["missingTicks"] == PENDING[mode], "MISSING_TICKS")
        demand([x["tick"] for x in g["frames"]] == PENDING[mode], "OBSERVED_TICKS")
        mode_rows[mode] = []
        for f in g["frames"]:
            tick = f["tick"]
            original_pose = pin["continuousNative240Hz"]["records"][tick - 10680]
            source = f["source"]
            demand(original_pose["nativeTick"] == tick
                   and original_pose["originalStatus"] == "running"
                   and original_pose["originalRoad"] == "p93-PRISM_CREST-01", "PINNED_STATE")
            demand(source["tick"] == source["paused"] == tick
                   and source["road"] == original_pose["originalRoad"], "REAL_SOURCE_TICK")
            demand(source["status"] == "running" and source["sourceB51"] == 28
                   and source["camera"] == "ball-lock-unfiltered-heading"
                   and source["effectiveMask"] == "none", "REAL_SOURCE_CAMERA")
            demand(source["audit"]["sourceBlob"] == SRC
                   and source["audit"]["originalSceneA5R19A3OverlayRendered"] is False,
                   "ORIGINAL_RENDER")
            for key, reference, epsilon in (
                ("xyz", "originalSourceBallCenter", .0015),
                ("eye", "originalSourceCameraEye", .025),
                ("front", "originalSourceCameraFront", .0015),
            ):
                actual, expected = source[key], original_pose[reference]
                demand(len(actual) == len(expected) == 3
                       and all(abs(float(x) - float(y)) < epsilon
                               for x, y in zip(actual, expected)),
                       "PINNED_POSE_" + key)
            demand(f["k4aiNativeTickPoseMatch"] is True, "BROWSER_PIN")
            demand(f["groupMaskNotSingleB51Id"] is True and
                   f["sourceColorCandidateArtAB"] == "NOT_CAPTURED" and
                   f["ART"] == "NOT_TESTED_HOLD", "PER_ID_OR_ART_OVERCLAIM")
            demand(f["gpuReadbackSeq"] == [seq + 1, seq + 2, seq + 3], "GPU_SEQ")
            seq += 3
            depth = f["nativeGPU"]
            original = samples(depth["original"], 72)
            masked = samples(depth["allB51GroupHidden"], 44)
            restored = samples(depth["restored"], 72)
            demand(original == restored and depth["originalRestoredAll11176"] is True,
                   "RESTORE_NOT_EQUAL")
            diff = sum(m > o for o, m in zip(original, masked))
            demand(not any(m < o for o, m in zip(original, masked)), "MASK_CREATED_NEARER_DEPTH")
            demand(diff == depth["maskedFartherDepthSamples"] and
                   depth["nearerDepthSamples"] == 0, "B51_GROUP_AGGREGATE")
            triple = []
            for label in ("sourcePNG", "groupHiddenPNG", "restoredPNG"):
                meta = f[label]
                filename = Path(meta["file"])
                demand(len(filename.parts) == 1 and filename.suffix == ".png"
                       and filename.name.startswith("K4AM_" + mode + "_" + str(tick) + "_"),
                       "IMAGE_PATH")
                p = image_dir / filename
                if require_images:
                    triple.append(img(p, meta["sha256"], meta["bytes"]))
                    images_checked += 1
            if require_images:
                img_review = same_without_hud(triple[0], triple[2], f["chapterHUD"])
                demand(img_review["native3DOrNonHUDPixelsChanged"] == 0, "RESTORED_SOURCE_RGB")
            mode_rows[mode].append({
                "nativeTick": tick, "sourcePhysicsSeconds": tick / 240,
                "actualB51GroupMaskedFartherDepthSamples": diff,
                "sampledPoints": N, "sourcePNG": f["sourcePNG"]["sha256"],
                "B51GroupHiddenPNG": f["groupHiddenPNG"]["sha256"],
                "restoredPNG": f["restoredPNG"]["sha256"],
                "singleObjectAttribution": "NOT_MEASURED_UNKNOWN",
                "candidateArtRGB": "NOT_CREATED", "HUMAN": "HOLD", "ART": "NOT_TESTED_HOLD",
            })
            verified += 1
            total_depth_changed += diff
    demand(seq == 27 and verified == 9 and images_checked == (27 if require_images else 0),
           "PROOF_COUNT")
    return {
        "schema": "dopagaki.K4AM.nine-source-RGB-and-GPU-independent-audit/1",
        "verdict": "K4AM_SOURCE_RGB_AND_GROUP_DEPTH_TECH_CANDIDATE_ART_HOLD",
        "pinnedK4AIRawSHA256": AISHA, "originalSourceBlob": SRC,
        "sourceNativeTicks": 9, "realSourcePNGProofs": images_checked,
        "inRenderDepthReadbackRequests": seq, "sampledDepthPointsEach": N,
        "sumB51GroupMaskedFartherDepthSamplesAcrossNineSnapshots": total_depth_changed,
        "perMode": mode_rows, "actualB51PerObjectGPUAttribution": "UNKNOWN",
        "humanLegibility": "NOT_MEASURED", "ART": "NOT_TESTED_HOLD",
        "officialARTAccepted": 0, "slope2DNAMetres": 0,
        "newModels": 0, "newColliders": 0,
        "HUMAN": "HOLD", "SAT": "HOLD", "CCD": "HOLD",
        "FPS": "HOLD", "RELEASE": "HOLD", "MERGE": "HOLD",
    }


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--k4ai", required=True, type=Path)
    p.add_argument("--k4am", required=True, type=Path)
    args = p.parse_args()
    ai = read_pinned(args.k4ai / "K4AI_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json", AISHA)
    file = args.k4am / "K4AM_ORIGINAL_NINE_MISSING_RGB_TICKS.json"
    report = json.loads(file.read_text(encoding="utf-8"))
    verdict = verify(ai, report, args.k4am)
    (args.k4am / "K4AM_INDEPENDENT_NINE_SOURCE_RGB_AUDIT.json").write_text(
        json.dumps(verdict, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("K4AM_NINE_NATIVE_ORIGINAL_RGB_SHA_GPU_DEPTH_AND_RESTORE_TECH_CANDIDATE_PASS")
    print("K4AM_ORIGINAL_SOURCE_ONLY_ART_HUMAN_SAFETY_RELEASE_HOLD")


if __name__ == "__main__":
    main()
