#!/usr/bin/env python3
"""K4AR genuine screenshot RGB provenance gate; never automatic artistic approval."""
import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageChops

EXPECTED = {
    "ultra": (11320, 11341, 11369),
    "control": (11259, 11278, 11307),
}
SOURCE = "af076d67492a677d2235e4730aef8cdf4808e106"
VERDICT = "TRUE_CAMERA_TRIAD_ARCHITECTURE_PIXEL_PROOF_ONLY_ART_HOLD"


def insist(condition, code):
    if not condition:
        raise AssertionError("K4AR_" + code)


def verified_image(root, entry):
    name = entry.get("file")
    insist(isinstance(name, str) and name == Path(name).name, "FILE_PATH_INVALID")
    raw = (root / name).read_bytes()
    insist(len(raw) == entry.get("bytes"), "FILE_BYTE_LENGTH_MISMATCH")
    insist(hashlib.sha256(raw).hexdigest() == entry.get("sha256"), "FILE_SHA_MISMATCH")
    with Image.open(root / name) as im:
        insist(im.format == "PNG", "NOT_PNG")
        rgb = im.convert("RGB")
        insist(rgb.width >= 600 and rgb.height >= 350, "IMAGE_TOO_SMALL")
        return rgb


def changed_pixels(before, after, threshold=9):
    insist(before.size == after.size, "TRIAD_FRAMEBUFFER_SIZE_MISMATCH")
    # Perceived luminance difference threshold reduces tiny codec/render jitter,
    # but this remains only a sampling diagnostic, never an ART judgment.
    img = ImageChops.difference(before, after).convert("L")
    hist = img.histogram()
    return sum(hist[threshold:])


def inspect(root):
    doc = json.loads((root / "K4AR_TRUE_CAMERA_ART_AB_REPORT.json").read_text())
    insist(doc.get("schema") == "dopagaki.K4AR.original-sky-only-architecture-triad/1",
           "SCHEMA")
    insist(doc.get("sourceBlob") == SOURCE and doc.get("originalPhysicsHz") == 240,
           "SOURCE_PROVENANCE")
    insist(doc.get("realB48Roads") == 7 and doc.get("realB51Movers") == 28,
           "ORIGINAL_B48_B51")
    insist(doc.get("actualWebGL2") is True and doc.get("sourceCameraUnchanged") is True,
           "NOT_ORIGINAL_CAMERA_WEBGL")
    insist(doc.get("errors") == [] and len(doc.get("runs", [])) == 6,
           "INVALID_SESSIONS")
    insist(doc.get("officialARTAccepted") == 0 and doc.get("slope2DNAMetres") == 0,
           "ILLEGAL_ART_PROMOTION")
    insist(doc.get("candidateART") == "NOT_TESTED_HOLD", "NOT_ART_HOLD")
    insist(all(doc.get(key) == "HOLD" for key in
               ("HUMAN", "SAT", "CCD", "FPS", "RELEASE", "MERGE")), "GUARDS")
    snapshots = doc.get("comparisons", [])
    insist(len(snapshots) == 6, "SIX_NATIVE_COMPARISONS_REQUIRED")
    seen = set()
    result = []
    for item in snapshots:
        mode, tick = item.get("mode"), item.get("tick")
        insist(mode in EXPECTED and tick in EXPECTED[mode] and (mode, tick) not in seen,
               "NATIVE_TICK_OR_DUPLICATE")
        seen.add((mode, tick))
        insist(item.get("sameSkySameNativePose") is True
               and item.get("cameraAndBallIdentical") is True
               and item.get("sourcePhysicsPreserved") is True, "CAMERA_BALL_B51_MISMATCH")
        insist(item.get("ART") == "NOT_TESTED_HOLD", "ART_STATUS")
        orig = verified_image(root, item["original"])
        sky = verified_image(root, item["skyOnly"])
        full = verified_image(root, item["candidate"])
        sky_delta = changed_pixels(orig, sky)
        architecture_delta = changed_pixels(sky, full)
        area = orig.width * orig.height
        # Camera's center can contain B51 geometry; this merely flags image
        # changes there, NOT actual obstacles blocked or human readability.
        center = (int(orig.width * .32), int(orig.height * .15),
                  int(orig.width * .68), int(orig.height * .82))
        danger = changed_pixels(sky.crop(center), full.crop(center))
        source_same = item.get("skyRGBDifferent") == (
            item["original"]["sha256"] != item["skyOnly"]["sha256"]
        )
        architecture_same = item.get("architectureRGBDifferent") == (
            item["skyOnly"]["sha256"] != item["candidate"]["sha256"]
        )
        insist(source_same and architecture_same, "RGB_SHA_CLAIM_MISMATCH")
        result.append({
            "mode": mode, "tick": tick,
            "actualArchitectureChangedPixelsOver9Luma": architecture_delta,
            "actualArchitectureChangedFraction": round(architecture_delta / area, 6),
            "actualSkyChangedPixelsOver9Luma": sky_delta,
            "potentialHazardRegionArchitectureChanges": danger,
            "interpretation": "2D_RGB_DIFFERENCE_NOT_OCCLUSION_OR_ART_QUALITY",
        })
    insist(seen == {(m, t) for m, ticks in EXPECTED.items() for t in ticks},
           "INCOMPLETE_NATIVE_TICKS")
    # Technical 'visible at all' is not equivalent to 'good design'. Fail
    # closed even if the sky changes but true authored architecture does not.
    insist(any(x["actualArchitectureChangedPixelsOver9Luma"] >= 1000
               for x in result), "ARCHITECTURE_NOT_MATERIALLY_VISIBLE_IN_SOURCE_CAMERA")
    return {
        "schema": "dopagaki.K4AR.independent-true-pixel-visible-architecture/1",
        "verdict": VERDICT, "originalSourceBlob": SOURCE,
        "originalSourceRoads": 7, "originalSourceB51": 28,
        "nativeCameraTriplets": 6, "verifiedPNG": 18,
        "frames": result, "officialARTAccepted": 0, "slope2DNAMetres": 0,
        "ART": "NOT_TESTED_HOLD",
        "HUMAN": "HOLD", "SAT": "HOLD", "CCD": "HOLD",
        "FPS": "HOLD", "RELEASE": "HOLD", "MERGE": "HOLD",
        "visualQualityDecision": "REQUIRES_INDEPENDENT_HUMAN_IMAGE_REVIEW",
        "continuousVisualReadabilitySeconds": "UNKNOWN",
        "civicFloorSupport": "NOT_TESTED",
    }


if __name__ == "__main__":
    cli = argparse.ArgumentParser()
    cli.add_argument("--source", type=Path, default=Path("r19-evidence/k4ar"))
    args = cli.parse_args()
    evidence = inspect(args.source)
    (args.source / "K4AR_INDEPENDENT_ARCHITECTURE_PIXEL_REVIEW.json").write_text(
        json.dumps(evidence, ensure_ascii=False, indent=2) + "\n"
    )
    print(VERDICT)
