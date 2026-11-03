#!/usr/bin/env python3
"""K4AS 24 genuine-screen frames: independent SHA/provenance and reviewer atlas.

Art is never auto-approved from RGB pixel changes. At most:
SOURCE-CAMERA VISUAL-MATERIAL DIFFERENCE TECH evidence, ART HOLD.
"""
import argparse
from hashlib import sha256
import json
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw

MODES = {"ultra": (11320, 11341, 11369),
         "control": (11259, 11278, 11307)}
SHOTS = ["original", "sky-only", "full", "material"]
SOURCE = "af076d67492a677d2235e4730aef8cdf4808e106"


def guard(b, name):
    if not b:
        raise AssertionError("K4AS_" + name)


def image_of(root, entry):
    name = entry["file"]
    guard(Path(name).name == name and name.endswith(".png"), "BAD_PNG_PATH")
    body = (root / name).read_bytes()
    guard(entry["bytes"] == len(body), "PNG_BYTES")
    guard(entry["sha256"] == sha256(body).hexdigest(), "PNG_HASH")
    with Image.open(root / name) as x:
        guard(x.format == "PNG", "NOT_SOURCE_PNG")
        rgb = x.convert("RGB")
        guard(rgb.width >= 600 and rgb.height >= 350, "PNG_DIMENSIONS")
        return rgb


def delta(a, b):
    guard(a.size == b.size, "COMPARISON_IMAGE_SIZE")
    diff = ImageChops.difference(a, b).convert("L").histogram()
    return sum(diff[9:])


def audit(root):
    src = root / "K4AS_ORIGINAL_NATIVE_FOUR_WAY_ART_REPORT.json"
    x = json.loads(src.read_text())
    guard(x.get("schema") ==
          "dopagaki.K4AS.original-native-road5-full-screen-material-four-way/1",
          "SCHEMA")
    guard(x.get("sourceBlob") == SOURCE and x.get("originalPhysicsHz") == 240,
          "SOURCE_HASH_HZ")
    guard(x.get("realB48Roads") == 7 and x.get("realB51Movers") == 28,
          "SOURCE_B48_B51")
    guard(x.get("sourceCameraUnchanged") is True and
          x.get("actualWebGL2") is True, "NOT_ORIGINAL_WEBGL2_CAMERA")
    guard(x.get("errors") == [] and len(x.get("comparisons", [])) == 6
          and len(x.get("runs", [])) == 8, "RUNS_INCOMPLETE")
    guard(x.get("candidateART") == "NOT_TESTED_HOLD" and
          x.get("officialARTAccepted") == 0 and x.get("slope2DNAMetres") == 0,
          "ART_ILLEGAL_PROMOTION")
    guard(all(x.get(z) == "HOLD" for z in
              ("HUMAN", "SAT", "CCD", "FPS", "RELEASE", "MERGE")), "SAFETY_GATE")
    roles = {(r["mode"], r["visual"]): r for r in x["runs"]}
    guard(set(roles) == {(mode, shot) for mode in MODES for shot in SHOTS},
          "FOUR_WAY_MISSING")
    for (mode, shot), run in roles.items():
        guard(run.get("errors") == [] and len(run["frames"]) == 3,
              "INVALID_RUN")
        guard([f["tick"] for f in run["frames"]] == list(MODES[mode]),
              "INVALID_NATIVE_FRAME_SEQUENCE")
        guard(all(f["state"]["k4asMode"] ==
                  ("PRIVATE_ROAD5_ONLY_MATERIAL_CANDIDATE_HOLD" if
                   shot == "material" else "OFF") for f in run["frames"]),
              "WRONG_MATERIAL_SCOPE")
    rows = []
    seen = set()
    for compare in x["comparisons"]:
        mode, tick = compare.get("mode"), compare.get("tick")
        guard(mode in MODES and tick in MODES[mode]
              and (mode, tick) not in seen, "TICK_DUPLICATION")
        seen.add((mode, tick))
        guard(compare.get("cameraAndBallIdentical") is True and
              compare.get("sourcePhysicsPreserved") is True and
              compare.get("originalSourceRoad") ==
              "p93-PRISM_CREST-01", "CAMERA_OR_ROAD_DIVERGENCE")
        images = [image_of(root, compare[key]) for key in
                  ("original", "skyOnly", "city", "material")]
        full = images[-2]
        palette = images[-1]
        pixels = delta(full, palette)
        sky = delta(images[0], images[1])
        architecture = delta(images[1], full)
        area = palette.width * palette.height
        guard(compare["cityPixelChangeVsSky"] ==
              (compare["skyOnly"]["sha256"] != compare["city"]["sha256"]),
              "CITY_PIXEL_CLAIM")
        guard(compare["materialPixelChangeVsCity"] ==
              (compare["city"]["sha256"] != compare["material"]["sha256"]),
              "MATERIAL_PIXEL_CLAIM")
        rows.append({
            "mode": mode, "tick": tick,
            "sourceCameraVerifiedByJS": True,
            "skyChangedOver9LumaPixels": sky,
            "cityChangedOver9LumaPixels": architecture,
            "materialChangedOver9LumaPixels": pixels,
            "materialChangedFractionOfEntireCanvas": round(pixels / area, 6),
            "sourceCameraArtVerdict": "HUMAN_IMAGE_REVIEW_REQUIRED",
        })
    guard(seen == {(m, t) for m, ticks in MODES.items() for t in ticks},
          "INCOMPLETE_COMPARISON_TICKS")
    # Source-meaningful pixel difference is a TECH probe only. If no actual
    # visible improvement: a bad candidate, never fix by changing the threshold.
    guard(any(x["materialChangedOver9LumaPixels"] >= 750 for x in rows),
          "NO_MEANINGFUL_MATERIAL_CHANGE_FROM_SOURCE_CAM")
    # Build a compact honest atlas, unchanged original source RGB per panel.
    # No post-processing/retouching to improve evidence.
    w, h = 390, 300
    sheet = Image.new("RGB", (4*w, 6*h), (13, 16, 23))
    draw = ImageDraw.Draw(sheet)
    atlas_order = [("ultra", t) for t in MODES["ultra"]] + [
        ("control", t) for t in MODES["control"]]
    entry = {(v["mode"], v["tick"]): v for v in x["comparisons"]}
    for row, key in enumerate(atlas_order):
        e = entry[key]
        for col, (role, label) in enumerate(zip(
            ("original", "skyOnly", "city", "material"),
            ("ORIGINAL", "SKY ONLY", "CITY + SKY", "ROAD5 MATERIALS")
        )):
            img = image_of(root, e[role])
            img.thumbnail((w-8, h-28))
            sheet.paste(img, (col*w+4, row*h+26))
            draw.text((col*w+8, row*h+6),
                      f"{key[0]} tick {key[1]} | {label}", fill=(224, 227, 224))
    sheet.save(root / "K4AS_AUTHENTIC_FOUR_WAY_ROAD5_CONTACT.png")
    return {
        "schema": "dopagaki.K4AS.independent-native-24-PNG-material-review/1",
        "verdict": "SOURCE_CAMERA_MATERIAL_RGB_TECH_ONLY_ART_HOLD",
        "sourceBlob": SOURCE, "sourceRealB48Roads": 7,
        "sourceRealB51Bodies": 28, "verifiedTrueWebGL2PNGs": 24,
        "sixSameNativeCameraTimes": sorted(seen),
        "results": rows, "materialPixelEvidence": "MEASURED_NOT_ART_ACCEPTANCE",
        "humanVisualReadability": "NOT_MEASURED",
        "sourcePhysicsChanged": False, "sourceCameraChanged": False,
        "formalArtAccepted": 0, "slope2DNAMetres": 0, "ART": "NOT_TESTED_HOLD",
        "HUMAN": "HOLD", "SAT": "HOLD", "CCD": "HOLD",
        "FPS": "HOLD", "RELEASE": "HOLD", "MERGE": "HOLD",
    }


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", type=Path, default=Path("r19-evidence/k4as"))
    args = ap.parse_args()
    info = audit(args.root)
    (args.root / "K4AS_INDEPENDENT_FOUR_WAY_RGB_AUDIT.json").write_text(
        json.dumps(info, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(info["verdict"])
